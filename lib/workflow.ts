import { ApplicationStatus } from "@prisma/client"

export type ValidTransitions = Record<ApplicationStatus, ApplicationStatus[]>

export const VALID_TRANSITIONS: ValidTransitions = {
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.SHORTLISTED]: [
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.INTERVIEW]: [
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.OFFER]: [
    ApplicationStatus.HIRED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.OFFER_DECLINED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.HIRED]: [], // Terminal state
  [ApplicationStatus.REJECTED]: [
    ApplicationStatus.SHORTLISTED, // Allow reconsidering
  ],
  [ApplicationStatus.WITHDRAWN]: [
    ApplicationStatus.APPLIED, // Allow reapplying/reopening
  ],
  [ApplicationStatus.OFFER_DECLINED]: [
    ApplicationStatus.OFFER, // Allow renegotiating
    ApplicationStatus.WITHDRAWN,
  ],
}

export function isValidTransition(current: ApplicationStatus, next: ApplicationStatus): boolean {
  if (current === next) return true
  return VALID_TRANSITIONS[current].includes(next)
}

export function getPossibleNextStatuses(current: ApplicationStatus): ApplicationStatus[] {
  return VALID_TRANSITIONS[current]
}
