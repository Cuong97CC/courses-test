import type { IUser } from './user'
import type { ICourse } from './course'

export const ENROLLMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const

export type EnrollmentStatus =
  (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS]

export const ENROLLMENT_STATUS_VALUES = Object.values(ENROLLMENT_STATUS)

export interface IEnrollment {
  id: string
  studentId: string
  courseId: string
  status: EnrollmentStatus
  approvedBy?: string
  approvedAt?: string
  student?: IUser
  course?: ICourse
  approver?: IUser
  createdAt: string
  updatedAt: string
}

export interface IEnrollmentCreateInput {
  courseId: string
}

export interface IEnrollmentProcessInput {
  status: EnrollmentStatus
}

export interface IEnrollmentApiError {
  statusCode: number
  message: string
  error?: string
}

export interface IEnrollmentFilterVariables {
  page?: number
  size?: number
  status?: EnrollmentStatus
  courseId?: string
  studentId?: string
}
