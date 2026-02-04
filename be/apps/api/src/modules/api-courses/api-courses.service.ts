import { Injectable, NotFoundException } from '@nestjs/common';
import { Course, CoursesService, CourseVisibility } from '@app/courses';
import { User, UserRole } from '@app/users';
import { CreateCourseDto, UpdateCourseDto, CourseFilterDto } from './dto';
import {
  Enrollment,
  ENROLLMENT_ACTIVE_STATUSES,
  EnrollmentsService,
  EnrollmentStatus,
} from '@app/enrollments';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CourseDetailDto } from './dto/course-detail.dto';

@Injectable()
export class ApiCoursesService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async create(dto: CreateCourseDto, user: User) {
    return this.coursesService.create(
      {
        title: dto.title,
        summary: dto.summary,
        content: dto.content,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        capacity: dto.capacity,
        visibility: dto.visibility,
      },
      user.id,
    );
  }

  async paginate(user: User, filters: CourseFilterDto) {
    if (user.role === UserRole.STUDENT) {
      filters.visibility = CourseVisibility.PUBLIC;
    }
    const courses = await this.coursesService.paginate(filters);

    const enrollments = await this.enrollmentsService.findByCourseIds(
      courses.data.map((c) => c.id),
    );

    const enrollmentMap = enrollments.reduce((acc, enrollment) => {
      if (!acc.has(enrollment.courseId)) {
        acc.set(enrollment.courseId, []);
      }
      acc.get(enrollment.courseId)?.push(enrollment);
      return acc;
    }, new Map<string, Enrollment[]>());

    const response = {
      ...courses,
      data: courses.data.map((course) =>
        this.buildCourseResponse(
          course,
          user,
          enrollmentMap.get(course.id) || [],
        ),
      ),
    };

    return response;
  }

  async findOne(id: string, user: User) {
    const course = await this.coursesService.findById(id);
    if (!course) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }
    if (
      user.role === UserRole.STUDENT &&
      course.visibility !== CourseVisibility.PUBLIC
    ) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }

    const enrollments = await this.enrollmentsService.findByCourseId(id);
    return this.buildCourseResponse(course, user, enrollments);
  }

  async update(id: string, dto: UpdateCourseDto, user: User) {
    return this.coursesService.update(id, dto, user.id, dto.version);
  }

  async remove(id: string) {
    return this.coursesService.remove(id);
  }

  async getVersionHistory(id: string, user: User) {
    const course = await this.coursesService.findById(id);
    if (!course) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }
    if (
      user.role === UserRole.STUDENT &&
      course.visibility !== CourseVisibility.PUBLIC
    ) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }
    return await this.coursesService.getVersionHistory(id);
  }

  private buildCourseResponse(
    course: Course,
    user: User,
    enrollments: Enrollment[],
  ) {
    const response = plainToInstance(CourseDetailDto, instanceToPlain(course));
    response.enrolledCount = enrollments.filter(
      (e) => e.status === EnrollmentStatus.APPROVED,
    ).length;
    response.isEnrolled = enrollments.some(
      (e) =>
        e.studentId === user.id &&
        ENROLLMENT_ACTIVE_STATUSES.includes(e.status),
    );
    return response;
  }
}
