export enum EnrollmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export const ENROLLMENT_ACTIVE_STATUSES = [
  EnrollmentStatus.PENDING,
  EnrollmentStatus.APPROVED,
];

export interface IEnrollmentFilter {
  studentId?: string;
  courseId?: string;
  status?: EnrollmentStatus;
  requestedAtFrom?: Date;
  requestedAtTo?: Date;
}

export interface IProcessEnrollmentData {
  status: EnrollmentStatus.APPROVED | EnrollmentStatus.REJECTED;
  processedById: string;
  processedAt: Date;
}
