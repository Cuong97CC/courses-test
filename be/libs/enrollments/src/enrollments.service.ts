import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import {
  ENROLLMENT_ACTIVE_STATUSES,
  EnrollmentStatus,
  IEnrollmentFilter,
  IProcessEnrollmentData,
} from './enrollments.type';
import { IBasePaginationRequest } from '@app/common/common.type';
import { formatPaginate } from '@app/common/common.helper';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(studentId: string, courseId: string): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.create({
      studentId,
      courseId,
      status: EnrollmentStatus.PENDING,
      requestedAt: new Date(),
    });

    return await this.enrollmentRepository.save(enrollment);
  }

  async paginate(filters: IEnrollmentFilter & IBasePaginationRequest) {
    const query = this.createQueryWithFilters(filters);
    return await formatPaginate(query, filters, Enrollment);
  }

  createQueryWithFilters(filters?: IEnrollmentFilter) {
    const query = this.enrollmentRepository.createQueryBuilder('enrollment');

    if (filters?.studentId) {
      query.andWhere('enrollment.student_id = :studentId', {
        studentId: filters.studentId,
      });
    }

    if (filters?.courseId) {
      query.andWhere('enrollment.course_id = :courseId', {
        courseId: filters.courseId,
      });
    }

    if (filters?.status) {
      query.andWhere('enrollment.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.requestedAtFrom) {
      query.andWhere('enrollment.requested_at >= :requestedAtFrom', {
        requestedAtFrom: filters.requestedAtFrom,
      });
    }

    if (filters?.requestedAtTo) {
      query.andWhere('enrollment.requested_at <= :requestedAtTo', {
        requestedAtTo: filters.requestedAtTo,
      });
    }

    query.orderBy('enrollment.requested_at', 'DESC');

    return query;
  }

  async findById(id: string) {
    return await this.enrollmentRepository.findOne({ where: { id } });
  }

  async findByCourseId(courseId: string) {
    return await this.enrollmentRepository.find({ where: { courseId } });
  }

  async findSuccessEnrollmentsOfCourse(courseId: string) {
    return await this.enrollmentRepository.find({
      where: {
        courseId,
        status: EnrollmentStatus.APPROVED,
      },
    });
  }

  async findCurrentEnrollment(studentId: string, courseId: string) {
    return await this.enrollmentRepository.findOne({
      where: {
        studentId,
        courseId,
        status: In(ENROLLMENT_ACTIVE_STATUSES),
      },
    });
  }

  async findByCourseIds(courseIds: string[]) {
    return await this.enrollmentRepository.find({
      where: { courseId: In(courseIds) },
    });
  }

  async process(id: string, data: IProcessEnrollmentData): Promise<Enrollment> {
    const enrollment = await this.findById(id);

    if (!enrollment) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    if (enrollment.status !== EnrollmentStatus.PENDING) {
      throw new BadRequestException('ENROLLMENT.ALREADY_PROCESSED');
    }

    enrollment.status = data.status;
    enrollment.processedById = data.processedById;
    enrollment.processedAt = data.processedAt;

    return await this.enrollmentRepository.save(enrollment);
  }

  async cancel(id: string): Promise<Enrollment> {
    const enrollment = await this.findById(id);

    if (!enrollment) {
      throw new NotFoundException('ENROLLMENT.NOT_FOUND');
    }

    if (
      enrollment.status === EnrollmentStatus.APPROVED ||
      enrollment.status === EnrollmentStatus.REJECTED
    ) {
      throw new BadRequestException('ENROLLMENT.CANNOT_CANCEL_APPROVED');
    }

    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new BadRequestException('ENROLLMENT.ALREADY_CANCELLED');
    }

    enrollment.status = EnrollmentStatus.CANCELLED;

    return await this.enrollmentRepository.save(enrollment);
  }
}
