'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getRecruiterDashboardAction() {
  const session = await auth()

  if (!session || !["RECRUITER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" }
  }

  try {
    const jobScope = session.user.role === "ADMIN"
      ? {}
      : { recruiterId: session.user.id }
    const [
      activeJobsCount,
      totalApplicationsCount,
      pendingApplicationsCount,
      applicationsByStatus,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      prisma.job.count({
        where: { ...jobScope, status: "OPEN" },
      }),
      prisma.application.count({
        where: { job: jobScope },
      }),
      prisma.application.count({
        where: {
          job: jobScope,
          status: "APPLIED",
        },
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { job: jobScope },
        _count: { _all: true },
      }),
      prisma.job.findMany({
        where: jobScope,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          _count: {
            select: { applications: true },
          },
        },
      }),
      prisma.application.findMany({
        where: { job: jobScope },
        orderBy: { appliedAt: "desc" },
        take: 5,
        include: {
          applicant: {
            select: { name: true },
          },
          job: {
            select: { title: true },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        activeJobsCount,
        totalApplicationsCount,
        pendingApplicationsCount,
        applicationsByStatus: Object.fromEntries(
          applicationsByStatus.map(({ status, _count }) => [status, _count._all]),
        ),
        recentJobs,
        recentApplications
      }
    }
  } catch (error) {
    console.error("Recruiter dashboard error:", error)
    return { error: "Internal server error" }
  }
}
