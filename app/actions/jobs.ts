'use server'

import { prisma } from "@/lib/prisma"
import { requireRecruiter } from "@/lib/auth-utils"
import { createJobSchema, updateJobSchema, type CreateJobInput, type UpdateJobInput } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import type { Prisma, JobStatus, JobType } from "@prisma/client"

export async function createJobAction(data: CreateJobInput) {
  const user = await requireRecruiter()
  
  try {
    const validated = createJobSchema.parse(data)

    const job = await prisma.job.create({
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        type: validated.type,
        employmentType: validated.employmentType,
        experienceLevel: validated.experienceLevel,
        skills: validated.skills.join(','),
        recruiterId: user.id,
      },
    })

    revalidatePath("/recruiter/jobs")
    revalidatePath("/recruiter/dashboard")
    revalidatePath("/jobs")
    return { success: true, jobId: job.id }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      // @ts-ignore
      return { error: error.errors[0].message }
    }
    console.error("Create job error:", error)
    return { error: "Failed to create job specification." }
  }
}

export async function updateJobAction(jobId: string, data: UpdateJobInput) {
  const user = await requireRecruiter()
  
  try {
    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.recruiterId !== user.id) {
      return { error: "Unauthorized" }
    }

    const validated = updateJobSchema.parse(data)

    await prisma.job.update({
      where: { id: jobId },
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        type: validated.type,
        employmentType: validated.employmentType,
        experienceLevel: validated.experienceLevel,
        skills: validated.skills ? validated.skills.join(',') : undefined,
      },
    })

    revalidatePath("/recruiter/jobs")
    revalidatePath(`/recruiter/jobs/${jobId}`)
    revalidatePath("/jobs")
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      // @ts-ignore
      return { error: error.errors[0].message }
    }
    console.error("Update job error:", error)
    return { error: "Failed to update job specification." }
  }
}

export async function closeJobAction(jobId: string) {
  const user = await requireRecruiter()
  
  try {
    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.recruiterId !== user.id) {
      return { error: "Unauthorized" }
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: "CLOSED" },
    })

    revalidatePath("/recruiter/jobs")
    revalidatePath("/jobs")
    return { success: true }
  } catch (error) {
    console.error("Close job error:", error)
    return { error: "Failed to close job specification." }
  }
}

export async function getJobsAction(filters?: {
  status?: string
  type?: string
  location?: string
  search?: string
  page?: number
  limit?: number
}) {
  try {
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.JobWhereInput = {}

    if (filters?.status) {
      where.status = filters.status as JobStatus
    }

    if (filters?.type) {
      where.type = filters.type as JobType
    }

    if (filters?.location) {
      where.location = { contains: filters.location }
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          recruiter: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    const transformedJobs = jobs.map((job) => ({
      ...job,
      skills: job.skills.split(',').filter(Boolean),
    }))

    return {
      success: true,
      jobs: transformedJobs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Get jobs error:", error)
    return { error: "Failed to fetch jobs" }
  }
}

export async function getJobByIdAction(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    if (!job) {
      return { error: "Job not found" }
    }

    const transformedJob = {
      ...job,
      skills: job.skills.split(',').filter(Boolean),
    }

    return { success: true, job: transformedJob }
  } catch (error) {
    console.error("Get job error:", error)
    return { error: "Failed to fetch job" }
  }
}

export async function deleteJobAction(jobId: string) {
  const user = await requireRecruiter()
  
  try {
    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.recruiterId !== user.id) {
      return { error: "Unauthorized" }
    }

    // Perform soft delete
    await prisma.job.update({
      where: { id: jobId },
      data: { deletedAt: new Date() },
    })

    revalidatePath("/recruiter/jobs")
    revalidatePath("/jobs")
    return { success: true }
  } catch (error) {
    console.error("Delete job error:", error)
    return { error: "Failed to delete job deployment." }
  }
}
