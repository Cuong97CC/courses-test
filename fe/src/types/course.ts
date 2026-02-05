import type { IUser } from './user'

export const COURSE_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const

export type CourseVisibility =
  (typeof COURSE_VISIBILITY)[keyof typeof COURSE_VISIBILITY]

export const COURSE_VISIBILITY_VALUES = Object.values(COURSE_VISIBILITY)

export interface ICourse {
  id: string
  title: string
  summary: string
  content: string // HTML content from CKEditor
  startDate: string
  endDate: string
  capacity: number
  visibility: CourseVisibility
  instructorId: string
  instructor?: IUser
  version: number
  enrolledCount?: number
  isEnrolled?: boolean
  createdAt: string
  updatedAt: string
}

export interface ICourseCreateInput {
  title: string
  summary: string
  content: string
  startDate: string
  endDate: string
  capacity: number
  visibility: CourseVisibility
}

export interface ICourseUpdateInput extends Partial<ICourseCreateInput> {
  version: number
}

export interface ICourseFilterVariables {
  page?: number
  size?: number
  search?: string
  visibility?: CourseVisibility
  instructorId?: string
  sort?: string
}
