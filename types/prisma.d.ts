declare module '@prisma/client' {
  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction(fn: (tx: any) => Promise<any>): Promise<any>;
    [key: string]: any;
  }
  export enum UserRole {
    APPLICANT = "APPLICANT",
    RECRUITER = "RECRUITER",
    ADMIN = "ADMIN"
  }
  export enum JobType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP"
  }
  export enum JobStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
  }
  export enum ApplicationStatus {
    APPLIED = "APPLIED",
    SHORTLISTED = "SHORTLISTED",
    INTERVIEW = "INTERVIEW",
    OFFER = "OFFER",
    HIRED = "HIRED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN",
    OFFER_DECLINED = "OFFER_DECLINED"
  }
  export namespace Prisma {
    export type JobWhereInput = any;
    export type ApplicationUpdateInput = any;
    export type TransactionClient = any;
  }
}
