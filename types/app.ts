import { Job as PrismaJob, JobType, JobStatus, EmploymentType } from "@prisma/client"

export interface Job extends Omit<PrismaJob, 'skills'> {
  skills: string[]
  recruiter: {
    name: string
    email: string
  }
  _count?: {
    applications: number
  }
}

export interface Application {
  id: string
  jobId: string
  applicantId: string
  resumeUrl: string
  resumeName: string
  status: string
  appliedAt: Date
  job: Job
  applicant: {
    name: string
    email: string
  }
}
