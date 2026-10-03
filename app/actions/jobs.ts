'use server'

import { prisma } from "@/lib/prisma"
import { requireRecruiter } from "@/lib/auth-utils"
import { ZodError } from "zod";
import {
  createJobSchema,
  updateJobSchema,
  type CreateJobInput,
  type UpdateJobInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { Prisma, JobStatus, JobType } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function createJobAction(data: CreateJobInput) {
  const user = await requireRecruiter();

  try {
    const validated = createJobSchema.parse(data);

    const job = await prisma.job.create({
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        type: validated.type,
        employmentType: validated.employmentType,
        experienceLevel: validated.experienceLevel,
        skills: validated.skills.join(","),
        recruiterId: user.id,
      },
    });

    revalidatePath("/recruiter/jobs");
    revalidatePath("/recruiter/dashboard");
    revalidatePath("/jobs");
    return { success: true, jobId: job.id };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Create job error:", error);
    return { error: "Failed to create job specification." };
  }
}

export async function updateJobAction(jobId: string, data: UpdateJobInput) {
  const user = await requireRecruiter();

  try {
    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || (user.role !== "ADMIN" && job.recruiterId !== user.id)) {
      return { error: "Unauthorized" };
    }

    const validated = updateJobSchema.parse(data);

    await prisma.job.update({
      where: { id: jobId },
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        type: validated.type,
        employmentType: validated.employmentType,
        experienceLevel: validated.experienceLevel,
        skills: validated.skills ? validated.skills.join(",") : undefined,
      },
    });

    revalidatePath("/recruiter/jobs");
    revalidatePath(`/recruiter/jobs/${jobId}`);
    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Update job error:", error);
    return { error: "Failed to update job specification." };
  }
}

export async function closeJobAction(jobId: string) {
  const user = await requireRecruiter()

  try {
    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || (user.role !== "ADMIN" && job.recruiterId !== user.id)) {
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
    const session = await auth();
    if (filters?.status && !["OPEN", "CLOSED"].includes(filters.status)) {
      return { error: "Invalid job status filter." };
    }
    if (filters?.type && !["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].includes(filters.type)) {
      return { error: "Invalid job type filter." };
    }
    if (filters?.page !== undefined && (!Number.isInteger(filters.page) || filters.page < 1 || filters.page > 1_000_000)) {
      return { error: "Invalid page number." };
    }
    if (filters?.limit !== undefined && (!Number.isInteger(filters.limit) || filters.limit < 1)) {
      return { error: "Invalid page size." };
    }
    const page = Number.isInteger(filters?.page) && (filters?.page ?? 0) > 0
      ? filters!.page!
      : 1;
    const limit = Number.isInteger(filters?.limit) && (filters?.limit ?? 0) > 0
      ? Math.min(filters!.limit!, 50)
      : 10;
    const skip = (page - 1) * limit

    const where: Prisma.JobWhereInput = {
      deletedAt: null,
    }

    if (session?.user?.role === "RECRUITER") {
      where.recruiterId = session.user.id;
    } else if (session?.user?.role !== "ADMIN") {
      where.status = "OPEN";
    }

    if (filters?.status) {
      if (session?.user?.role === "RECRUITER" || session?.user?.role === "ADMIN") {
        where.status = filters.status as JobStatus;
      }
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
    const session = await auth();
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            name: true,
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
    if (
      job.status !== "OPEN" &&
      session?.user?.role !== "ADMIN" &&
      !(session?.user?.role === "RECRUITER" && job.recruiterId === session.user.id)
    ) {
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

    if (!job || (user.role !== "ADMIN" && job.recruiterId !== user.id)) {
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
    return { error: "Failed to delete job." }
  }
}
