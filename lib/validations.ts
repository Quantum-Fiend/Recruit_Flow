import { z } from 'zod'
import { ApplicationStatus } from "@prisma/client";

// Auth validations
export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long'),
  role: z.enum(['APPLICANT', 'RECRUITER']),
})

export const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

// Job validations
export const createJobSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description is too long'),
  location: z.string().trim().min(2, 'Location is required').max(100, 'Location is too long'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  employmentType: z.enum(['OFFICE', 'REMOTE', 'HYBRID']),
  experienceLevel: z.string().trim().min(1, 'Experience level is required').max(100, 'Experience level is too long'),
  skills: z.array(z.string().trim().min(1).max(80)).min(1, 'At least one skill is required').max(50),
})

export const updateJobSchema = createJobSchema.partial()

// Application validations
export const createApplicationSchema = z.object({
  jobId: z.string().min(1).max(64),
  resumeUrl: z.string().min(1, 'Resume URL is required').max(512),
  resumeName: z.string().trim().min(1, 'Resume name is required').max(255),
})

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().cuid(),
  status: z.nativeEnum(ApplicationStatus),
})

// Note validations
export const createNoteSchema = z.object({
  applicationId: z.string().cuid(),
  note: z.string().trim().min(1, 'Note cannot be empty').max(1000, 'Note is too long'),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>
export type CreateNoteInput = z.infer<typeof createNoteSchema>
