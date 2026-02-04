import { describe, it, expect } from 'vitest'
import { signUpSchema, createJobSchema, createApplicationSchema } from '../lib/validations'

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
    it('should validate valid sign up data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'APPLICANT'
      }
      expect(signUpSchema.safeParse(data).success).toBe(true)
    })

    it('should fail on invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        role: 'APPLICANT'
      }
      expect(signUpSchema.safeParse(data).success).toBe(false)
    })

    it('should fail on short password', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
        role: 'APPLICANT'
      }
      const result = signUpSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
      }
    })
  })

  describe('createJobSchema', () => {
    it('should validate valid job data', () => {
      const data = {
        title: 'Senior Developer',
        description: 'This is a very long description that should be at least 50 characters long so that it passes validation.',
        location: 'New York',
        type: 'FULL_TIME',
        employmentType: 'OFFICE',
        experienceLevel: 'Senior',
        skills: ['React', 'Node.js']
      }
      expect(createJobSchema.safeParse(data).success).toBe(true)
    })

    it('should fail on short description', () => {
      const data = {
        title: 'Short Job',
        description: 'Too short',
        location: 'New York',
        type: 'FULL_TIME',
        employmentType: 'OFFICE',
        experienceLevel: 'Junior',
        skills: ['None']
      }
      expect(createJobSchema.safeParse(data).success).toBe(false)
    })
  })

  describe('createApplicationSchema', () => {
    it('should validate valid application data', () => {
      const data = {
        jobId: 'cle7y7l5v000008jt6r1b8w2a', // Mock CUID
        resumeUrl: 'https://example.com/resume.pdf',
        resumeName: 'resume.pdf'
      }
      expect(createApplicationSchema.safeParse(data).success).toBe(true)
    })

    it('should fail on invalid URL', () => {
      const data = {
        jobId: 'cle7y7l5v000008jt6r1b8w2a',
        resumeUrl: 'not-a-url',
        resumeName: 'resume.pdf'
      }
      expect(createApplicationSchema.safeParse(data).success).toBe(false)
    })
  })
})
