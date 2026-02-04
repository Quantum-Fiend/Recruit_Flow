import { describe, it, expect } from 'vitest'
import { ApplicationStatus } from '@prisma/client'
import { isValidTransition, getPossibleNextStatuses } from '../lib/workflow'

describe('Workflow Engine', () => {
  describe('isValidTransition', () => {
    it('should return true for same status', () => {
      expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.APPLIED)).toBe(true)
    })

    it('should return true for valid transitions', () => {
      expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED)).toBe(true)
      expect(isValidTransition(ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW)).toBe(true)
      expect(isValidTransition(ApplicationStatus.INTERVIEW, ApplicationStatus.OFFER)).toBe(true)
      expect(isValidTransition(ApplicationStatus.OFFER, ApplicationStatus.HIRED)).toBe(true)
    })

    it('should return false for invalid transitions', () => {
      expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.HIRED)).toBe(false)
      expect(isValidTransition(ApplicationStatus.HIRED, ApplicationStatus.APPLIED)).toBe(false)
      expect(isValidTransition(ApplicationStatus.REJECTED, ApplicationStatus.HIRED)).toBe(false)
    })

    it('should allow reconsidering a rejected application', () => {
      expect(isValidTransition(ApplicationStatus.REJECTED, ApplicationStatus.SHORTLISTED)).toBe(true)
    })

    it('should allow renegotiating a declined offer', () => {
      expect(isValidTransition(ApplicationStatus.OFFER_DECLINED, ApplicationStatus.OFFER)).toBe(true)
    })
  })

  describe('getPossibleNextStatuses', () => {
    it('should return empty array for terminal states', () => {
      expect(getPossibleNextStatuses(ApplicationStatus.HIRED)).toEqual([])
    })

    it('should return all possible statuses for given state', () => {
      const next = getPossibleNextStatuses(ApplicationStatus.APPLIED)
      expect(next).toContain(ApplicationStatus.SHORTLISTED)
      expect(next).toContain(ApplicationStatus.REJECTED)
      expect(next).toContain(ApplicationStatus.WITHDRAWN)
      expect(next.length).toBe(3)
    })
  })
})
