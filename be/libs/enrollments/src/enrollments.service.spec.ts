/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentStatus, IProcessEnrollmentData } from './enrollments.type';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  createMockRepository,
  MockRepository,
} from '../../../test/utils/mock-repository';
import { EnrollmentBuilder } from '../../../test/utils/test-data.builder';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentRepository: MockRepository<Enrollment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: createMockRepository<Enrollment>(),
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentRepository = module.get(getRepositoryToken(Enrollment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create enrollment with PENDING status', async () => {
      // Arrange
      const studentId = 'student-uuid-123';
      const courseId = 'course-uuid-456';

      const expectedEnrollment = new EnrollmentBuilder()
        .withStudentId(studentId)
        .withCourseId(courseId)
        .asPending()
        .build();

      enrollmentRepository.create.mockReturnValue(expectedEnrollment);
      enrollmentRepository.save.mockResolvedValue(expectedEnrollment);

      // Act
      const result = await service.create(studentId, courseId);

      // Assert
      expect(enrollmentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId,
          courseId,
          status: EnrollmentStatus.PENDING,
          requestedAt: expect.any(Date),
        }),
      );
      expect(enrollmentRepository.save).toHaveBeenCalledWith(
        expectedEnrollment,
      );
      expect(result).toEqual(expectedEnrollment);
    });

    it('should set requestedAt to current time', async () => {
      // Arrange
      const studentId = 'student-uuid';
      const courseId = 'course-uuid';
      const mockEnrollment = new EnrollmentBuilder().build();

      enrollmentRepository.create.mockReturnValue(mockEnrollment);
      enrollmentRepository.save.mockResolvedValue(mockEnrollment);

      const beforeCreate = new Date();

      // Act
      await service.create(studentId, courseId);

      // Assert
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const createCall = enrollmentRepository.create.mock.calls[0][0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const requestedAt = createCall.requestedAt as Date;

      expect(requestedAt).toBeInstanceOf(Date);
      expect(requestedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
    });

    it('should throw ConflictException if duplicate enrollment exists', async () => {
      // Arrange
      const studentId = 'student-uuid';
      const courseId = 'course-uuid';

      const mockEnrollment = new EnrollmentBuilder().build();
      enrollmentRepository.create.mockReturnValue(mockEnrollment);

      // Simulate unique constraint violation
      const duplicateError = new ConflictException('ENROLLMENT.ALREADY_EXISTS');
      enrollmentRepository.save.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(service.create(studentId, courseId)).rejects.toThrow(
        ConflictException,
      );

      await expect(service.create(studentId, courseId)).rejects.toThrow(
        'ENROLLMENT.ALREADY_EXISTS',
      );
    });
  });

  describe('paginate()', () => {
    it('should return paginated enrollments with default pagination', async () => {
      // Arrange
      const mockEnrollments = [
        new EnrollmentBuilder().withId('enrollment-1').build(),
        new EnrollmentBuilder().withId('enrollment-2').build(),
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEnrollments),
        getCount: jest.fn().mockResolvedValue(2),
      };

      enrollmentRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      const result = await service.paginate({});

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({ id: 'enrollment-1' });
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });

    it('should filter by studentId', async () => {
      // Arrange
      const studentId = 'student-uuid-123';
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };

      enrollmentRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ studentId });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'enrollment.student_id = :studentId',
        { studentId },
      );
    });

    it('should filter by courseId', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };

      enrollmentRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ courseId });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'enrollment.course_id = :courseId',
        { courseId },
      );
    });

    it('should filter by status', async () => {
      // Arrange
      const status = EnrollmentStatus.PENDING;
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };

      enrollmentRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ status });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'enrollment.status = :status',
        { status },
      );
    });

    it('should order by requestedAt DESC', async () => {
      // Arrange
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };

      enrollmentRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({});

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'enrollment.requested_at',
        'DESC',
      );
    });
  });

  describe('findById()', () => {
    it('should return enrollment if exists', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const mockEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .build();

      enrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      // Act
      const result = await service.findById(enrollmentId);

      // Assert
      expect(enrollmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: enrollmentId },
      });
      expect(result).toEqual(mockEnrollment);
    });

    it('should return null if enrollment does not exist', async () => {
      // Arrange
      const enrollmentId = 'non-existent-id';
      enrollmentRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findById(enrollmentId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('process()', () => {
    it('should approve PENDING enrollment', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const processData: IProcessEnrollmentData = {
        status: EnrollmentStatus.APPROVED,
        processedById: 'manager-uuid',
        processedAt: new Date(),
      };

      const pendingEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asPending()
        .build();

      const approvedEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asApproved()
        .build();

      enrollmentRepository.findOne.mockResolvedValue(pendingEnrollment);
      enrollmentRepository.update.mockResolvedValue({ affected: 1 } as any);
      enrollmentRepository.findOne.mockResolvedValueOnce(pendingEnrollment);
      enrollmentRepository.save.mockResolvedValueOnce(approvedEnrollment);

      // Act
      const result = await service.process(enrollmentId, processData);

      expect(result.status).toBe(EnrollmentStatus.APPROVED);
    });

    it('should reject PENDING enrollment', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const processData: IProcessEnrollmentData = {
        status: EnrollmentStatus.REJECTED,
        processedById: 'manager-uuid',
        processedAt: new Date(),
      };

      const pendingEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asPending()
        .build();

      const rejectedEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asRejected()
        .build();

      enrollmentRepository.findOne.mockResolvedValue(pendingEnrollment);
      enrollmentRepository.update.mockResolvedValue({ affected: 1 } as any);
      enrollmentRepository.findOne.mockResolvedValueOnce(pendingEnrollment);
      enrollmentRepository.save.mockResolvedValueOnce(rejectedEnrollment);

      // Act
      const result = await service.process(enrollmentId, processData);

      // Assert
      expect(result.status).toBe(EnrollmentStatus.REJECTED);
    });

    it('should throw NotFoundException if enrollment does not exist', async () => {
      // Arrange
      const enrollmentId = 'non-existent-id';
      const processData: IProcessEnrollmentData = {
        status: EnrollmentStatus.APPROVED,
        processedById: 'manager-uuid',
        processedAt: new Date(),
      };

      enrollmentRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.process(enrollmentId, processData)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.process(enrollmentId, processData)).rejects.toThrow(
        'ENROLLMENT.NOT_FOUND',
      );
    });

    it('should throw BadRequestException if enrollment already processed', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const processData: IProcessEnrollmentData = {
        status: EnrollmentStatus.APPROVED,
        processedById: 'manager-uuid',
        processedAt: new Date(),
      };

      const alreadyApprovedEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asApproved()
        .build();

      enrollmentRepository.findOne.mockResolvedValue(alreadyApprovedEnrollment);

      // Act & Assert
      await expect(service.process(enrollmentId, processData)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.process(enrollmentId, processData)).rejects.toThrow(
        'ENROLLMENT.ALREADY_PROCESSED',
      );
    });

    it('should set processedAt and processedById correctly', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const managerId = 'manager-uuid-456';
      const processedAt = new Date('2026-02-03T10:00:00Z');

      const processData: IProcessEnrollmentData = {
        status: EnrollmentStatus.APPROVED,
        processedById: managerId,
        processedAt,
      };

      const pendingEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asPending()
        .build();

      const updatedEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asApproved(processedAt, managerId)
        .build();

      enrollmentRepository.findOne.mockResolvedValue(pendingEnrollment);
      enrollmentRepository.update.mockResolvedValue({ affected: 1 } as any);
      enrollmentRepository.findOne.mockResolvedValueOnce(pendingEnrollment);
      enrollmentRepository.save.mockResolvedValueOnce(updatedEnrollment);

      // Act
      const result = await service.process(enrollmentId, processData);

      expect(result.processedAt).toEqual(processData.processedAt);
      expect(result.processedById).toEqual(processData.processedById);
    });
  });

  describe('cancel()', () => {
    it('should cancel PENDING enrollment', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const pendingEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asPending()
        .build();

      enrollmentRepository.findOne.mockResolvedValue(pendingEnrollment);
      enrollmentRepository.save.mockResolvedValue(
        new EnrollmentBuilder().withId(enrollmentId).asCancelled().build(),
      );

      // Act
      const result = await service.cancel(enrollmentId);

      expect(result.status).toBe(EnrollmentStatus.CANCELLED);
    });

    it('should throw NotFoundException if enrollment does not exist', async () => {
      // Arrange
      const enrollmentId = 'non-existent-id';
      enrollmentRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.cancel(enrollmentId)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.cancel(enrollmentId)).rejects.toThrow(
        'ENROLLMENT.NOT_FOUND',
      );
    });

    it('should throw BadRequestException if enrollment is APPROVED', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const approvedEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asApproved()
        .build();

      enrollmentRepository.findOne.mockResolvedValue(approvedEnrollment);

      // Act & Assert
      await expect(service.cancel(enrollmentId)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.cancel(enrollmentId)).rejects.toThrow(
        'ENROLLMENT.CANNOT_CANCEL',
      );
    });

    it('should throw BadRequestException if enrollment is REJECTED', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const rejectedEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .asRejected()
        .build();

      enrollmentRepository.findOne.mockResolvedValue(rejectedEnrollment);

      // Act & Assert
      await expect(service.cancel(enrollmentId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if enrollment is already CANCELLED', async () => {
      // Arrange
      const enrollmentId = 'enrollment-uuid-123';
      const cancelledEnrollment = new EnrollmentBuilder()
        .withId(enrollmentId)
        .withStatus(EnrollmentStatus.CANCELLED)
        .build();

      enrollmentRepository.findOne.mockResolvedValue(cancelledEnrollment);

      // Act & Assert
      await expect(service.cancel(enrollmentId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Status Transition Rules', () => {
    it('should only allow PENDING → APPROVED transition', async () => {
      // Arrange
      const pendingEnrollment = new EnrollmentBuilder().asPending().build();
      enrollmentRepository.findOne.mockResolvedValue(pendingEnrollment);
      enrollmentRepository.save.mockResolvedValue(
        new EnrollmentBuilder().asApproved().build(),
      );

      // Act & Assert - Should succeed
      await expect(
        service.process(pendingEnrollment.id, {
          status: EnrollmentStatus.APPROVED,
          processedById: 'manager',
          processedAt: new Date(),
        }),
      ).resolves.toBeDefined();
    });

    it('should only allow PENDING → REJECTED transition', async () => {
      // Arrange
      const pendingEnrollment = new EnrollmentBuilder().asPending().build();
      enrollmentRepository.findOne.mockResolvedValue(pendingEnrollment);
      enrollmentRepository.save.mockResolvedValue(
        new EnrollmentBuilder().asRejected().build(),
      );

      // Act & Assert - Should succeed
      await expect(
        service.process(pendingEnrollment.id, {
          status: EnrollmentStatus.REJECTED,
          processedById: 'manager',
          processedAt: new Date(),
        }),
      ).resolves.toBeDefined();
    });

    it('should NOT allow APPROVED → APPROVED transition', async () => {
      // Arrange
      const approvedEnrollment = new EnrollmentBuilder().asApproved().build();
      enrollmentRepository.findOne.mockResolvedValue(approvedEnrollment);

      // Act & Assert - Should fail (trying to change APPROVED back to PENDING)
      await expect(
        service.process(approvedEnrollment.id, {
          status: EnrollmentStatus.APPROVED, // Should fail because already approved
          processedById: 'manager',
          processedAt: new Date(),
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
