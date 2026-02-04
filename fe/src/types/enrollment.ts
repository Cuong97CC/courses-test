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
  student_id: string
  course_id: string
  status: EnrollmentStatus
  approved_by?: string
  approved_at?: string
  student?: IUser
  course?: ICourse
  approver?: IUser
  created_at: string
  updated_at: string
}

export interface IEnrollmentCreateInput {
  course_id: string
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
  course_id?: string
  student_id?: string
}
