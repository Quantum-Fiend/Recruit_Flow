export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN"
  | "OFFER_DECLINED";

export type ValidTransitions = Record<ApplicationStatus, ApplicationStatus[]>;

export const VALID_TRANSITIONS: ValidTransitions = {
  APPLIED: ["SHORTLISTED", "REJECTED", "WITHDRAWN"],
  SHORTLISTED: ["INTERVIEW", "REJECTED", "WITHDRAWN"],
  INTERVIEW: ["OFFER", "REJECTED", "SHORTLISTED", "WITHDRAWN"],
  OFFER: ["HIRED", "REJECTED", "OFFER_DECLINED", "WITHDRAWN"],
  HIRED: [], // Terminal state
  REJECTED: [
    "SHORTLISTED", // Allow reconsidering
  ],
  WITHDRAWN: [
    "APPLIED", // Allow reapplying/reopening
  ],
  OFFER_DECLINED: [
    "OFFER", // Allow renegotiating
    "WITHDRAWN",
  ],
};

export function isValidTransition(
  current: ApplicationStatus,
  next: ApplicationStatus,
): boolean {
  if (current === next) return true;
  return VALID_TRANSITIONS[current].includes(next);
}

export function getPossibleNextStatuses(
  current: ApplicationStatus,
): ApplicationStatus[] {
  return VALID_TRANSITIONS[current];
}
