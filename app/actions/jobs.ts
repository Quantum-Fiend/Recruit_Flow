'use server'

import { prisma } from "@/lib/prisma"
import { requireRecruiter } from "@/lib/auth-utils"
import { createJobSchema, updateJobSchema, type CreateJobInput, type UpdateJobInput } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { Prisma, JobStatus, JobType } from "@prisma/client"

export async function createJobAction(data: CreateJobInput) {
  try {
    const user = await requireRecruiter()
    const validated = createJobSchema.parse(data)

    const job = await prisma.job.create({
      data: {
        ...validated,
        recruiterId: user.id,
      },
    })

    revalidatePath("/recruiter/jobs")
    return { success: true, jobId: job.id }
  } catch (error) {
    console.error("Create job error:", error)
    return { error: "Failed to create job" }
  }
}

export async function updateJobAction(jobId: string, data: UpdateJobInput) {
  try {
    const user = await requireRecruiter()
    
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
      data: validated,
    })

    revalidatePath("/recruiter/jobs")
    revalidatePath(`/recruiter/jobs/${jobId}`)
    return { success: true }
  } catch (error) {
    console.error("Update job error:", error)
    return { error: "Failed to update job" }
  }
}

export async function closeJobAction(jobId: string) {
  try {
    const user = await requireRecruiter()
    
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
    return { success: true }
  } catch (error) {
    console.error("Close job error:", error)
    return { error: "Failed to close job" }
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
      where.location = { contains: filters.location, mode: 'insensitive' }
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
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

    return { 
      success: true, 
      jobs, 
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      }
    }
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

    return { success: true, job }
  } catch (error) {
    console.error("Get job error:", error)
    return { error: "Failed to fetch job" }
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    const user = await requireRecruiter()
    
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
    return { success: true }
  } catch (error) {
    console.error("Delete job error:", error)
    return { error: "Failed to delete job" }
  }
}
