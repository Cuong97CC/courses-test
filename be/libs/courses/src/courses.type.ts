export enum CourseVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface ICourseFilter {
  title?: string;
  visibility?: CourseVisibility;
  startDateFrom?: string;
  startDateTo?: string;
  instructorId?: string;
}

export interface IUpdateCourseData {
  title?: string;
  summary?: string;
  content?: string;
  startDate?: Date;
  endDate?: Date;
  capacity?: number;
  visibility?: CourseVisibility;
}
