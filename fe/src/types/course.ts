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
  start_date: string
  end_date: string
  capacity: number
  visibility: CourseVisibility
  instructor_id: string
  instructor?: IUser
  version: number
  enrolled_count?: number
  is_enrolled?: boolean
  created_at: string
  updated_at: string
}

export interface ICourseCreateInput {
  title: string
  summary: string
  content: string
  start_date: string
  end_date: string
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
  instructor_id?: string
  sort?: string
}
