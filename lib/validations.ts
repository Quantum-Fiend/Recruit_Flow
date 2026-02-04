import { z } from 'zod'

// Auth validations
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['APPLICANT', 'RECRUITER']),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Job validations
export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  employmentType: z.enum(['OFFICE', 'REMOTE', 'HYBRID']),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
})

export const updateJobSchema = createJobSchema.partial()

// Application validations
export const createApplicationSchema = z.object({
  jobId: z.string().cuid(),
  resumeUrl: z.string().url('Invalid resume URL'),
  resumeName: z.string().min(1, 'Resume name is required'),
})

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().cuid(),
  status: z.enum(['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN', 'OFFER_DECLINED']),
})

// Note validations
export const createNoteSchema = z.object({
  applicationId: z.string().cuid(),
  note: z.string().min(1, 'Note cannot be empty').max(1000, 'Note is too long'),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>
export type CreateNoteInput = z.infer<typeof createNoteSchema>
