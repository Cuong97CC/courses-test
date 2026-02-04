import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentsService } from '@app/enrollments';
import { CoursesService, CourseVisibility } from '@app/courses';
import { User, UserRole, UsersService } from '@app/users';
import {
  CreateEnrollmentDto,
  ProcessEnrollmentDto,
  EnrollmentFilterDto,
  ListEnrollmentResponseDto,
} from './dto';
import { LockService } from '@app/redis/services/lock.service';

@Injectable()
export class ApiEnrollmentsService {
  private readonly logger = new Logger(ApiEnrollmentsService.name);
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    private readonly lockService: LockService,
  ) {}

  async create(dto: CreateEnrollmentDto, user: User) {
    const course = await this.coursesService.findById(dto.courseId);
    if (!course || course.visibility !== CourseVisibility.PUBLIC) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }

    const currentEnrollment =
      await this.enrollmentsService.findCurrentEnrollment(
        user.id,
        dto.courseId,
      );

    if (currentEnrollment) {
      throw new ConflictException('ENROLLMENT.ALREADY_ENROLLED');
    }

    return this.enrollmentsService.create(user.id, dto.courseId);
  }

  async paginate(user: User, filters: EnrollmentFilterDto) {
    if (user.role === UserRole.STUDENT) {
      filters.studentId = user.id;
    }

    const enrollments = await this.enrollmentsService.paginate(filters);

    const courses = await this.coursesService.findByIds(
      enrollments.data.map((e) => e.courseId),
    );
    const courseMap = new Map(courses.map((c) => [c.id, c]));

    const students = await this.usersService.findByIds(
      enrollments.data.map((e) => e.studentId),
    );
    const studentMap = new Map(students.map((s) => [s.id, s]));

    enrollments.data = enrollments.data.map((e) => ({
      ...e,
      course: courseMap.get(e.courseId),
      student: studentMap.get(e.studentId),
    }));

    return enrollments as ListEnrollmentResponseDto;
  }

  async findOne(id: string, user: User) {
    const enrollment = await this.enrollmentsService.findById(id);

    if (!enrollment) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    if (user.role === UserRole.STUDENT && enrollment.studentId !== user.id) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    return enrollment;
  }

  async process(id: string, dto: ProcessEnrollmentDto, user: User) {
    const enrollment = await this.enrollmentsService.findById(id);

    if (!enrollment) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    const course = await this.coursesService.findById(enrollment.courseId);
    if (!course) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lock = await this.lockService
      .lock(
        [
          `enrollment:${id}:process`,
          `course:${enrollment.courseId}:enrollments`,
        ],
        5,
        {
          retryCount: 50,
          retryDelay: 100,
        },
      )
      .catch((e) => {
        this.logger.warn('Failed to acquire lock', e);
        throw new ConflictException();
      });

    try {
      const courseSuccessEnrollments =
        await this.enrollmentsService.findSuccessEnrollmentsOfCourse(
          enrollment.courseId,
        );

      if (courseSuccessEnrollments.length >= course?.capacity) {
        throw new BadRequestException('ENROLLMENT.MAX_ENROLLMENTS_REACHED');
      }

      return this.enrollmentsService.process(id, {
        status: dto.status,
        processedById: user.id,
        processedAt: new Date(),
      });
    } finally {
      await lock
        .release()
        .catch((e) => this.logger.warn('Failed to release lock', e));
    }
  }

  async cancel(id: string, user: User) {
    const enrollment = await this.enrollmentsService.findById(id);

    if (!enrollment) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    if (enrollment.studentId !== user.id) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    return await this.enrollmentsService.cancel(id);
  }
}
