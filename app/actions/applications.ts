'use server'

import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRecruiter } from "@/lib/auth-utils"
import { ZodError } from "zod";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  createNoteSchema,
  type CreateApplicationInput,
  type UpdateApplicationStatusInput,
  type CreateNoteInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import {
  sendApplicationReceivedEmail,
  sendStatusUpdateEmail,
} from "@/lib/email";
import { logger, analytics } from "@/lib/monitoring";
import { isValidTransition } from "@/lib/workflow";
import { persistApplicationTransition } from "@/lib/application-status";

export async function createApplicationAction(data: CreateApplicationInput) {
  const user = await requireAuth();

  try {
    if (user.role !== "APPLICANT") {
      return { error: "Only applicant accounts can apply for jobs." };
    }
    const validated = createApplicationSchema.parse(data);
    const escapedUserId = user.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const resumeFilePattern = new RegExp(
      `^${escapedUserId}-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}-[A-Za-z0-9._-]{1,150}\\.(?:pdf|docx?)$`,
      "i",
    );
    let resumePath: string;
    try {
      const resumeUrl = new URL(validated.resumeUrl, "http://localhost");
      if (resumeUrl.origin !== "http://localhost" || !resumeUrl.pathname.startsWith("/api/resumes/")) {
        return { error: "Upload your resume before submitting the application." };
      }
      resumePath = decodeURIComponent(resumeUrl.pathname.slice("/api/resumes/".length));
    } catch {
      return { error: "The uploaded resume reference is invalid." };
    }
    if (basename(resumePath) !== resumePath || !resumeFilePattern.test(resumePath)) {
      return { error: "You can only submit a resume uploaded from your account." };
    }
    if (validated.resumeName.length > 255) {
      return { error: "Resume filename is too long." };
    }
    const resumeExtension = resumePath.toLowerCase().split(".").pop();
    if (!["pdf", "doc", "docx"].includes(resumeExtension ?? "")) {
      return { error: "The uploaded resume type is not supported." };
    }
    const resumeBytes = await readFile(join(process.cwd(), "data", "uploads", resumePath));
    const validSignature = resumeExtension === "pdf"
      ? resumeBytes.subarray(0, 5).toString() === "%PDF-"
      : resumeExtension === "docx"
        ? resumeBytes.subarray(0, 2).toString() === "PK"
        : resumeBytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    if (
      resumeBytes.length > 5 * 1024 * 1024 ||
      resumeBytes.length < 5 ||
      !validSignature
    ) {
      return { error: "The uploaded resume file is invalid." };
    }
    const resumeName = validated.resumeName.replace(/[\r\n\u0000-\u001f]/g, " ").trim();
    if (!resumeName) {
      return { error: "Resume filename is invalid." };
    }

    try {
      const submission = await prisma.$transaction(async (transaction) => {
        const [openJob] = await transaction.$queryRaw<Array<{ id: string; title: string }>>`
          SELECT "id", "title" FROM "Job"
          WHERE "id" = ${validated.jobId}
            AND "status" = 'OPEN'
            AND "deletedAt" IS NULL
          FOR UPDATE
        `;
        if (!openJob) return null;

        const created = await transaction.application.create({
          data: {
            jobId: validated.jobId,
            applicantId: user.id,
            resumeUrl: validated.resumeUrl,
            resumeName,
            status: "APPLIED",
          },
        });
        await transaction.applicationHistory.create({
          data: {
            applicationId: created.id,
            oldStatus: null,
            newStatus: "APPLIED",
            changedById: user.id,
          },
        });
        return { application: created, jobTitle: openJob.title };
      });
      if (!submission) {
        return { error: "This job is no longer accepting applications." };
      }
      const { application, jobTitle } = submission;

      if (user.email) {
        await sendApplicationReceivedEmail(
          user.email,
          user.name || "Applicant",
          jobTitle,
        );
      }

      analytics.trackApplicationSubmitted(validated.jobId, user.id);
      logger.logApplicationEvent(
        "APPLICATION_SUBMITTED",
        application.id,
        user.id,
        { jobId: validated.jobId },
      );

      revalidatePath("/dashboard");
      revalidatePath(`/jobs/${validated.jobId}`);
      return { success: true, applicationId: application.id };
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return { error: "You have already applied to this job." };
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("FULL SUBMIT ERROR:", error);
    logger.error("Create application error", error as Error, {
      action: "createApplicationAction",
      metadata: { jobId: data.jobId },
    });
    return { error: "Failed to submit application. Please try again." };
  }
}

export async function updateApplicationStatusAction(
  data: UpdateApplicationStatusInput,
) {
  const user = await requireRecruiter();

  try {
    const validated = updateApplicationStatusSchema.parse(data);

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
    });

    if (!application) {
      return { error: "Application not found" };
    }

    if (user.role !== "ADMIN" && application.job.recruiterId !== user.id) {
      logger.logSecurityEvent("Unauthorized status update attempt", "high", {
        userId: user.id,
        applicationId: validated.applicationId,
      });
      return { error: "Unauthorized" };
    }

    // Validate transition
    if (!isValidTransition(application.status, validated.status)) {
      return {
        error: `Invalid status transition from ${application.status} to ${validated.status}`,
      };
    }

    // Update status and history in a transaction
    const changed = await persistApplicationTransition({
      applicationId: validated.applicationId,
      from: application.status,
      to: validated.status,
      actorId: user.id,
    });
    if (!changed) return { error: "Application changed. Refresh and try again." };

    // Send status update email to applicant
    await sendStatusUpdateEmail(
      application.applicant.email,
      application.applicant.name,
      application.job.title,
      validated.status,
    );

    // Log and track
    analytics.trackStatusUpdate(
      validated.applicationId,
      application.status,
      validated.status,
      user.id,
    );
    logger.logApplicationEvent(
      "STATUS_UPDATED",
      validated.applicationId,
      user.id,
      {
        from: application.status,
        to: validated.status,
      },
    );

    revalidatePath("/recruiter/jobs");
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`);

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0].message };
    }
    logger.error("Update application status error", error as Error, {
      action: "updateApplicationStatusAction",
      metadata: { applicationId: data.applicationId },
    });
    return { error: "Failed to update application status" };
  }
}

export async function addApplicationNoteAction(data: CreateNoteInput) {
  const user = await requireRecruiter();

  try {
    const validated = createNoteSchema.parse(data);

    // Verify ownership
    const application = await prisma.application.findUnique({
      where: { id: validated.applicationId },
      include: { job: true },
    });

    if (!application || (user.role !== "ADMIN" && application.job.recruiterId !== user.id)) {
      return { error: "Unauthorized" };
    }

    await prisma.applicationNote.create({
      data: {
        applicationId: validated.applicationId,
        recruiterId: user.id,
        note: validated.note,
      },
    });

    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`);
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Add note error:", error);
    return { error: "Failed to add note" };
  }
}

export async function getMyApplicationsAction(page = 1) {
  try {
    const user = await requireAuth()
    if (user.role !== "APPLICANT") {
      return { error: "Applicant access required." }
    }
    if (!Number.isInteger(page) || page < 1 || page > 1_000_000) {
      return { error: "Invalid page number." }
    }
    const limit = 25

    const where = { applicantId: user.id }
    const [applications, total, groupedStatuses] = await Promise.all([
      prisma.application.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
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
        orderBy: { appliedAt: "desc" },
      }),
      prisma.application.count({ where }),
      prisma.application.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
      }),
    ])

    return {
      success: true,
      applications,
      statusCounts: Object.fromEntries(groupedStatuses.map(({ status, _count }) => [status, _count._all])),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  } catch (error) {
    console.error("Get applications error:", error)
    return { error: "Failed to fetch applications" }
  }
}

export async function getJobApplicationsAction(jobId: string, page = 1) {
  try {
    const user = await requireRecruiter()
    if (!Number.isInteger(page) || page < 1 || page > 1_000_000) {
      return { error: "Invalid page number." }
    }
    const limit = 25

    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || (user.role !== "ADMIN" && job.recruiterId !== user.id)) {
      return { error: "Unauthorized" }
    }

    const where = { jobId }
    const [applications, total, groupedStatuses] = await Promise.all([
      prisma.application.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          resumeAnalyses: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { id: true, model: true, result: true, createdAt: true },
          },
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          notes: {
            take: 20,
            include: {
              recruiter: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: { appliedAt: "desc" },
      }),
      prisma.application.count({ where }),
      prisma.application.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
      }),
    ])

    return {
      success: true,
      applications,
      statusCounts: Object.fromEntries(groupedStatuses.map(({ status, _count }) => [status, _count._all])),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  } catch (error) {
    console.error("Get job applications error:", error)
    return { error: "Failed to fetch applications" }
  }
}

export async function withdrawApplicationAction(applicationId: string) {
  try {
    const user = await requireAuth()
    if (user.role !== "APPLICANT") {
      return { error: "Only applicants can withdraw applications." }
    }

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

    const changed = await persistApplicationTransition({
      applicationId,
      from: application.status,
      to: "WITHDRAWN",
      actorId: user.id,
    })
    if (!changed) return { error: "Application changed. Refresh and try again." }

    revalidatePath("/dashboard")
    revalidatePath(`/jobs/${application.jobId}`)
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)

    return { success: true }
  } catch (error) {
    console.error("Withdraw application error:", error)
    return { error: "Failed to withdraw application" }
  }
}

export async function acceptOfferAction(applicationId: string) {
  try {
    const user = await requireAuth()
    if (user.role !== "APPLICANT") {
      return { error: "Only applicants can accept offers." }
    }

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
      return { error: "No offer to accept" }
    }

    // Update status to HIRED
    const changed = await persistApplicationTransition({
      applicationId,
      from: "OFFER",
      to: "HIRED",
      actorId: user.id,
    })
    if (!changed) return { error: "Offer changed. Refresh and try again." }

    revalidatePath("/dashboard")
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)

    return { success: true }
  } catch (error) {
    console.error("Accept offer error:", error)
    return { error: "Failed to accept offer" }
  }
}

export async function declineOfferAction(applicationId: string) {
  try {
    const user = await requireAuth()
    if (user.role !== "APPLICANT") {
      return { error: "Only applicants can decline offers." }
    }

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
    const changed = await persistApplicationTransition({
      applicationId,
      from: "OFFER",
      to: "OFFER_DECLINED",
      actorId: user.id,
    })
    if (!changed) return { error: "Offer changed. Refresh and try again." }

    revalidatePath("/dashboard")
    revalidatePath(`/recruiter/jobs/${application.jobId}/applicants`)

    return { success: true }
  } catch (error) {
    console.error("Decline offer error:", error)
    return { error: "Failed to decline offer" }
  }
}
