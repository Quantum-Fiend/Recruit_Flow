'use server'

import { prisma } from "@/lib/prisma"
import { requireAuth, requireRecruiter } from "@/lib/auth-utils"
import { 
  createApplicationSchema, 
  updateApplicationStatusSchema,
  createNoteSchema,
  type CreateApplicationInput,
  type UpdateApplicationStatusInput,
  type CreateNoteInput 
} from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { sendApplicationReceivedEmail, sendStatusUpdateEmail } from "@/lib/email"

export async function createApplicationAction(data: CreateApplicationInput) {
  try {
    const user = await requireAuth()
    const validated = createApplicationSchema.parse(data)

    // Check if job is still open
    const job = await prisma.job.findUnique({
      where: { id: validated.jobId },
    })

    if (!job || job.status !== "OPEN") {
      return { error: "This job is no longer accepting applications" }
    }

    // Check for duplicate application
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId: validated.jobId,
          applicantId: user.id,
        },
      },
    })

    if (existingApplication) {
      return { error: "You have already applied to this job" }
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: validated.jobId,
        applicantId: user.id,
        resumeUrl: validated.resumeUrl,
        resumeName: validated.resumeName,
        status: "APPLIED",
      },
    })

    // Send confirmation email
    if (user.email) {
      await sendApplicationReceivedEmail(user.email, user.name || 'Applicant', job.title)
    }

    // Log and track
    analytics.trackApplicationSubmitted(validated.jobId, user.id)
    logger.logApplicationEvent("APPLICATION_SUBMITTED", application.id, user.id, {
      jobId: validated.jobId,
    })

    revalidatePath("/dashboard")
    revalidatePath(`/jobs/${validated.jobId}`)
    
    return { success: true, applicationId: application.id }
  } catch (error) {
    logger.error("Create application error", error as Error, {
      action: "createApplicationAction",
      metadata: { jobId: data.jobId }
    })
    return { error: "Failed to submit application" }
  }
}

import { isValidTransition } from "@/lib/workflow"
import { logger, analytics } from "@/lib/monitoring"

export async function updateApplicationStatusAction(data: UpdateApplicationStatusInput) {
  try {
    const user = await requireRecruiter()
    const validated = updateApplicationStatusSchema.parse(data)

    // Get application with job and applicant to verify ownership and send email
    const application = await prisma.application.findUnique({
      where: { id: validated.applicationId },
      include: { 
        job: true,
        applicant: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!application) {
      return { error: "Application not found" }
    }

    if (application.job.recruiterId !== user.id) {
      logger.logSecurityEvent("Unauthorized status update attempt", "high", { 
        userId: user.id, 
        applicationId: validated.applicationId 
      })
      return { error: "Unauthorized" }
    }

    // Validate transition
    if (!isValidTransition(application.status, validated.status)) {
      return { error: `Invalid status transition from ${application.status} to ${validated.status}` }
    }

    // Update status and history in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: validated.applicationId },
        data: { status: validated.status },
      })

      await tx.applicationHistory.create({
        data: {
          applicationId: validated.applicationId,
          oldStatus: application.status,
          newStatus: validated.status,
          changedById: user.id,
        },
      })
    })

    // Send status update email to applicant
    await sendStatusUpdateEmail(
      application.applicant.email,
      application.applicant.name,
      application.job.title,
      validated.status
    )

    // Log and track
    analytics.trackStatusUpdate(validated.applicationId, application.status, validated.status, user.id)
    logger.logApplicationEvent("STATUS_UPDATED", validated.applicationId, user.id, {
      from: application.status,
      to: validated.status,
    })

    revalidatePath("/recruiter/jobs")
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)
    
    return { success: true }
  } catch (error) {
    logger.error("Update application status error", error as Error, { 
      action: "updateApplicationStatusAction",
      metadata: { applicationId: data.applicationId }
    })
    return { error: "Failed to update application status" }
  }
}

export async function addApplicationNoteAction(data: CreateNoteInput) {
  try {
    const user = await requireRecruiter()
    const validated = createNoteSchema.parse(data)

    // Verify ownership
    const application = await prisma.application.findUnique({
      where: { id: validated.applicationId },
      include: { job: true },
    })

    if (!application || application.job.recruiterId !== user.id) {
      return { error: "Unauthorized" }
    }

    await prisma.applicationNote.create({
      data: {
        applicationId: validated.applicationId,
        recruiterId: user.id,
        note: validated.note,
      },
    })

    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)
    return { success: true }
  } catch (error) {
    console.error("Add note error:", error)
    return { error: "Failed to add note" }
  }
}

export async function getMyApplicationsAction() {
  try {
    const user = await requireAuth()

    const applications = await prisma.application.findMany({
      where: { applicantId: user.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            type: true,
            employmentType: true,
            status: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    })

    return { success: true, applications }
  } catch (error) {
    console.error("Get applications error:", error)
    return { error: "Failed to fetch applications" }
  }
}

export async function getJobApplicationsAction(jobId: string) {
  try {
    const user = await requireRecruiter()

    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.recruiterId !== user.id) {
      return { error: "Unauthorized" }
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notes: {
          include: {
            recruiter: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    })

    return { success: true, applications }
  } catch (error) {
    console.error("Get job applications error:", error)
    return { error: "Failed to fetch applications" }
  }
}

export async function withdrawApplicationAction(applicationId: string) {
  try {
    const user = await requireAuth()

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    })

    if (!application) {
      return { error: "Application not found" }
    }

    if (application.applicantId !== user.id) {
      return { error: "Unauthorized" }
    }

    if (!isValidTransition(application.status, "WITHDRAWN")) {
      return { error: "Cannot withdraw application in current status" }
    }

    // Update status
     await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: "WITHDRAWN" },
      }),
      prisma.applicationHistory.create({
        data: {
          applicationId,
          oldStatus: application.status,
          newStatus: "WITHDRAWN",
          changedById: user.id, // Applicant changed it
        },
      }),
    ])

    revalidatePath("/dashboard")
    revalidatePath(`/jobs/${application.jobId}`)
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)

    return { success: true }
  } catch (error) {
    console.error("Withdraw application error:", error)
    return { error: "Failed to withdraw application" }
  }
}

export async function declineOfferAction(applicationId: string) {
  try {
    const user = await requireAuth()

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    })

    if (!application) {
      return { error: "Application not found" }
    }

    if (application.applicantId !== user.id) {
      return { error: "Unauthorized" }
    }

    if (application.status !== "OFFER") {
      return { error: "No offer to decline" }
    }

    // Update status
     await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: "OFFER_DECLINED" },
      }),
      prisma.applicationHistory.create({
        data: {
          applicationId,
          oldStatus: application.status,
          newStatus: "OFFER_DECLINED",
          changedById: user.id,
        },
      }),
    ])

    revalidatePath("/dashboard")
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)

    return { success: true }
  } catch (error) {
    console.error("Decline offer error:", error)
    return { error: "Failed to decline offer" }
  }
}
