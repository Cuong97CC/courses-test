/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CourseVersion } from './entities/course-version.entity';
import { CourseVisibility, IUpdateCourseData } from './courses.type';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  createMockRepository,
  MockRepository,
} from '../../../test/utils/mock-repository';
import { CourseBuilder } from '../../../test/utils/test-data.builder';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: MockRepository<Course>;
  let courseVersionRepository: MockRepository<CourseVersion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: createMockRepository<Course>(),
        },
        {
          provide: getRepositoryToken(CourseVersion),
          useValue: createMockRepository<CourseVersion>(),
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get(getRepositoryToken(Course));
    courseVersionRepository = module.get(getRepositoryToken(CourseVersion));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a course with sanitized HTML content', async () => {
      // Arrange
      const courseData = {
        title: 'NestJS Advanced',
        summary: 'Learn advanced NestJS patterns and best practices',
        content: '<p>Course content</p><script>alert("xss")</script>',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-06-01'),
        capacity: 30,
        visibility: CourseVisibility.PUBLIC,
      };
      const userId = 'instructor-uuid-123';

      const expectedCourse = new CourseBuilder()
        .withTitle(courseData.title)
        .withCapacity(courseData.capacity)
        .withCreatedBy(userId)
        .build();

      courseRepository.create.mockReturnValue(expectedCourse);
      courseRepository.save.mockResolvedValue(expectedCourse);

      // Act
      const result = await service.create(courseData, userId);

      // Assert
      expect(courseRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: courseData.title,
          summary: courseData.summary,
          // HTML should be sanitized (script tag removed)
          content: '<p>Course content</p>',
          createdById: userId,
        }),
      );
      expect(courseRepository.save).toHaveBeenCalledWith(expectedCourse);
      expect(result).toEqual(expectedCourse);
    });

    it('should set createdById from userId parameter', async () => {
      // Arrange
      const courseData = {
        title: 'Test Course',
        summary: 'Test summary with minimum length required',
        content: '<p>Content</p>',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-06-01'),
        capacity: 20,
        visibility: CourseVisibility.PUBLIC,
      };
      const userId = 'specific-user-uuid';

      const mockCourse = new CourseBuilder().withCreatedBy(userId).build();

      courseRepository.create.mockReturnValue(mockCourse);
      courseRepository.save.mockResolvedValue(mockCourse);

      // Act
      await service.create(courseData, userId);

      // Assert
      expect(courseRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          createdById: userId,
        }),
      );
    });

    it('should sanitize malicious HTML in content', async () => {
      // Arrange
      const maliciousContent =
        '<p>Safe content</p><img src="x" onerror="alert(1)"><script>evil()</script>';

      const courseData = {
        title: 'Test Course',
        summary: 'Test summary',
        content: maliciousContent,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-06-01'),
        capacity: 30,
        visibility: CourseVisibility.PUBLIC,
      };

      const mockCourse = new CourseBuilder().build();
      courseRepository.create.mockReturnValue(mockCourse);
      courseRepository.save.mockResolvedValue(mockCourse);

      // Act
      await service.create(courseData, 'user-id');

      // Assert
      const createCall = courseRepository.create.mock.calls[0][0];
      expect(createCall.content).not.toContain('<script>');
      expect(createCall.content).not.toContain('onerror');
      expect(createCall.content).toContain('<p>Safe content</p>');
    });
  });

  describe('paginate()', () => {
    it('should return paginated courses with default pagination', async () => {
      // Arrange
      const mockCourses = [
        new CourseBuilder()
          .withId('course-1')
          .withCreatedBy('instructor-uuid')
          .withDates(new Date('2026-03-01'), new Date('2026-06-01'))
          .build(),
        new CourseBuilder()
          .withId('course-2')
          .withCreatedBy('instructor-uuid')
          .withDates(new Date('2026-03-01'), new Date('2026-06-01'))
          .build(),
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCourses),
        getCount: jest.fn().mockResolvedValue(2),
      };

      courseRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      const result = await service.paginate({});

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        id: 'course-1',
        title: 'Test Course Title',
        visibility: CourseVisibility.PUBLIC,
      });
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0);
    });

    it('should filter by title', async () => {
      // Arrange
      const searchTerm = 'NestJS';
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };

      courseRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ title: searchTerm });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({
          title: `%${searchTerm}%`,
        }),
      );
    });

    it('should filter by visibility', async () => {
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

      courseRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ visibility: CourseVisibility.PRIVATE });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'course.visibility = :filterVisibility',
        { filterVisibility: CourseVisibility.PRIVATE },
      );
    });

    it('should limit max page size to 100', async () => {
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

      courseRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ page: 1, size: 500 }); // Request 500 items

      // Assert
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(100); // Should cap at 100
    });

    it('should calculate correct offset from page number', async () => {
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

      courseRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // Act
      await service.paginate({ page: 3, size: 20 });

      // Assert
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(40); // (3-1) * 20 = 40
    });
  });

  describe('findById()', () => {
    it('should return course if exists', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const mockCourse = new CourseBuilder().withId(courseId).build();

      courseRepository.findOne.mockResolvedValue(mockCourse);

      // Act
      const result = await service.findById(courseId);

      // Assert
      expect(courseRepository.findOne).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should return null if course does not exist', async () => {
      // Arrange
      const courseId = 'non-existent-id';
      courseRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findById(courseId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update course and create version snapshot', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const userId = 'user-uuid';
      const expectedVersion = 1;

      const existingCourse = new CourseBuilder()
        .withId(courseId)
        .withVersion(expectedVersion)
        .withTitle('Old Title')
        .build();

      const updateData: IUpdateCourseData = {
        title: 'Updated Title',
        content: '<p>Updated content</p>',
      };

      courseRepository.findOne.mockResolvedValue(existingCourse);
      courseVersionRepository.save.mockResolvedValue({} as any);
      courseRepository.update.mockResolvedValue({ affected: 1 } as any);
      courseRepository.findOne.mockResolvedValueOnce(existingCourse); // First call
      courseRepository.findOne.mockResolvedValueOnce({
        ...existingCourse,
        ...updateData,
        version: expectedVersion + 1,
      }); // Second call after update

      // Act
      const result = await service.update(
        courseId,
        updateData,
        userId,
        expectedVersion,
      );

      // Assert
      // Verify version snapshot was created
      expect(courseVersionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          courseId,
          changedById: userId,
        }),
      );

      // Verify course was updated
      expect(courseRepository.update).toHaveBeenCalledWith(
        { id: courseId, version: expectedVersion },
        expect.objectContaining({
          title: 'Updated Title',
        }),
      );

      expect(result).toBeDefined();
    });

    it('should throw ConflictException on version mismatch (optimistic locking)', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const userId = 'user-uuid';
      const staleVersion = 1;

      const existingCourse = new CourseBuilder()
        .withId(courseId)
        .withVersion(staleVersion)
        .build();

      const updateData: IUpdateCourseData = {
        title: 'Updated Title',
      };

      courseRepository.findOne.mockResolvedValue(existingCourse);
      courseVersionRepository.save.mockResolvedValue({} as any);
      courseRepository.update.mockResolvedValue({ affected: 0 } as any); // Version conflict

      // Act & Assert
      await expect(
        service.update(courseId, updateData, userId, staleVersion),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.update(courseId, updateData, userId, staleVersion),
      ).rejects.toThrow('COURSE.VERSION_CONFLICT');
    });

    it('should throw NotFoundException if course does not exist', async () => {
      // Arrange
      const courseId = 'non-existent-id';
      const updateData: IUpdateCourseData = { title: 'New Title' };

      courseRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update(courseId, updateData, 'user-id', 1),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.update(courseId, updateData, 'user-id', 1),
      ).rejects.toThrow('COURSE.NOT_FOUND');
    });

    it('should sanitize HTML in updated content', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const existingCourse = new CourseBuilder().withId(courseId).build();

      const updateData: IUpdateCourseData = {
        content: '<p>Safe</p><script>alert("xss")</script>',
      };

      courseRepository.findOne.mockResolvedValue(existingCourse);
      courseVersionRepository.save.mockResolvedValue({} as any);
      courseRepository.update.mockResolvedValue({ affected: 1 } as any);
      courseRepository.findOne.mockResolvedValueOnce(existingCourse);
      courseRepository.findOne.mockResolvedValueOnce(existingCourse);

      // Act
      await service.update(courseId, updateData, 'user-id', 1);

      // Assert
      const updateCall = courseRepository.update.mock.calls[0][1];
      expect(updateCall.content).not.toContain('<script>');
      expect(updateCall.content).toContain('<p>Safe</p>');
    });
  });

  describe('remove()', () => {
    it('should delete course successfully', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      courseRepository.delete.mockResolvedValue({ affected: 1 } as any);

      // Act
      await service.remove(courseId);

      // Assert
      expect(courseRepository.delete).toHaveBeenCalledWith(courseId);
    });
  });

  describe('getVersionHistory()', () => {
    it('should return version history ordered by date DESC', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const mockVersions = [
        { version: 2, changedAt: new Date('2026-01-02') },
        { version: 1, changedAt: new Date('2026-01-01') },
      ];

      courseVersionRepository.find.mockResolvedValue(mockVersions as any);

      // Act
      const result = await service.getVersionHistory(courseId);

      // Assert
      expect(courseVersionRepository.find).toHaveBeenCalledWith({
        where: { courseId },
        order: { changedAt: 'DESC' },
      });
      expect(result).toEqual(mockVersions);
    });

    it('should return empty array if no versions exist', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      courseVersionRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getVersionHistory(courseId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long strings within limits', async () => {
      // Arrange
      const longTitle = 'A'.repeat(255); // Max length
      const courseData = {
        title: longTitle,
        summary: 'B'.repeat(500), // Max length
        content: '<p>Content</p>',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-06-01'),
        capacity: 1000, // Max capacity
        visibility: CourseVisibility.PUBLIC,
      };

      const mockCourse = new CourseBuilder().build();
      courseRepository.create.mockReturnValue(mockCourse);
      courseRepository.save.mockResolvedValue(mockCourse);

      // Act & Assert - Should not throw
      await expect(
        service.create(courseData, 'user-id'),
      ).resolves.toBeDefined();
    });

    it('should handle concurrent updates with version conflict', async () => {
      // Arrange
      const courseId = 'course-uuid-123';
      const existingCourse = new CourseBuilder()
        .withId(courseId)
        .withVersion(1)
        .build();

      courseRepository.findOne.mockResolvedValue(existingCourse);
      courseVersionRepository.save.mockResolvedValue({} as any);

      // Simulate: First update succeeds, second fails
      courseRepository.update
        .mockResolvedValueOnce({ affected: 1 } as any)
        .mockResolvedValueOnce({ affected: 0 } as any);

      // Act
      const update1 = service.update(
        courseId,
        { title: 'Update 1' },
        'user1',
        1,
      );
      const update2 = service.update(
        courseId,
        { title: 'Update 2' },
        'user2',
        1,
      );

      // Assert
      await expect(update1).resolves.toBeDefined();
      await expect(update2).rejects.toThrow(ConflictException);
    });
  });
});
