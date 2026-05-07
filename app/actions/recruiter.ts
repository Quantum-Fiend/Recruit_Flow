'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getRecruiterDashboardAction() {
  const session = await auth()

  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" }
  }

  try {
    const [
      activeJobsCount,
      totalApplicationsCount,
      pendingApplicationsCount,
      recentJobs,
      recentApplications
    ] = await Promise.all([
      prisma.job.count({
        where: { recruiterId: session.user.id, status: "OPEN" }
      }),
      prisma.application.count({
        where: { job: { recruiterId: session.user.id } }
      }),
      prisma.application.count({
        where: { 
          job: { recruiterId: session.user.id },
          status: "APPLIED"
        }
      }),
      prisma.job.findMany({
        where: { recruiterId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          _count: {
            select: { applications: true }
          }
        }
      }),
      prisma.application.findMany({
        where: { job: { recruiterId: session.user.id } },
        orderBy: { appliedAt: "desc" },
        take: 5,
        include: {
          applicant: {
            select: { name: true }
          },
          job: {
            select: { title: true }
          }
        }
      })
    ])

    return {
      success: true,
      data: {
        activeJobsCount,
        totalApplicationsCount,
        pendingApplicationsCount,
        recentJobs,
        recentApplications
      }
    }
  } catch (error) {
    console.error("Recruiter dashboard error:", error)
    return { error: "Internal server error" }
  }
}
