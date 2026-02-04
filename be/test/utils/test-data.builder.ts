import { Course } from '@app/courses/entities/course.entity';
import { CourseVersion } from '@app/courses/entities/course-version.entity';
import { CourseVisibility } from '@app/courses/courses.type';
import { User, UserRole } from '@app/users';
import { Enrollment, EnrollmentStatus } from '@app/enrollments';

/**
 * Test data builders following the Builder pattern
 */

export class UserBuilder {
  private user: Partial<User> = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.STUDENT,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  withId(id: string): this {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withRole(role: UserRole): this {
    this.user.role = role;
    return this;
  }

  asStudent(): this {
    return this.withRole(UserRole.STUDENT).withEmail('student@example.com');
  }

  asInstructor(): this {
    return this.withRole(UserRole.INSTRUCTOR).withEmail(
      'instructor@example.com',
    );
  }

  asManager(): this {
    return this.withRole(UserRole.MANAGER).withEmail('manager@example.com');
  }

  build(): User {
    return this.user as User;
  }
}

export class CourseBuilder {
  private course: Partial<Course> = {
    id: 'course-uuid-123',
    title: 'Test Course Title',
    summary: 'This is a test course summary with enough characters',
    content: '<p>Test course content</p>',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-06-01'),
    capacity: 30,
    visibility: CourseVisibility.PUBLIC,
    version: 1,
    createdById: 'instructor-uuid',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  withId(id: string): this {
    this.course.id = id;
    return this;
  }

  withTitle(title: string): this {
    this.course.title = title;
    return this;
  }

  withCapacity(capacity: number): this {
    this.course.capacity = capacity;
    return this;
  }

  withVisibility(visibility: CourseVisibility): this {
    this.course.visibility = visibility;
    return this;
  }

  asPublic(): this {
    return this.withVisibility(CourseVisibility.PUBLIC);
  }

  asPrivate(): this {
    return this.withVisibility(CourseVisibility.PRIVATE);
  }

  withCreatedBy(userId: string): this {
    this.course.createdById = userId;
    return this;
  }

  withVersion(version: number): this {
    this.course.version = version;
    return this;
  }

  withDates(startDate: Date, endDate: Date): this {
    this.course.startDate = startDate;
    this.course.endDate = endDate;
    return this;
  }

  build(): Course {
    return this.course as Course;
  }
}

export class CourseVersionBuilder {
  private version: Partial<CourseVersion> = {
    id: 'version-uuid-123',
    courseId: 'course-uuid-123',
    title: 'Test Course Title',
    summary: 'Test summary',
    content: '<p>Test content</p>',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-06-01'),
    capacity: 30,
    visibility: CourseVisibility.PUBLIC,
    version: 1,
    changedById: 'user-uuid',
    changedAt: new Date('2026-01-01'),
  };

  withCourseId(courseId: string): this {
    this.version.courseId = courseId;
    return this;
  }

  withVersion(version: number): this {
    this.version.version = version;
    return this;
  }

  build(): CourseVersion {
    return this.version as CourseVersion;
  }
}

export class EnrollmentBuilder {
  private enrollment: Partial<Enrollment> = {
    id: 'enrollment-uuid-123',
    studentId: 'student-uuid',
    courseId: 'course-uuid-123',
    status: EnrollmentStatus.PENDING,
    requestedAt: new Date('2026-01-01'),
    processedAt: null,
    processedById: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  withId(id: string): this {
    this.enrollment.id = id;
    return this;
  }

  withStudentId(studentId: string): this {
    this.enrollment.studentId = studentId;
    return this;
  }

  withCourseId(courseId: string): this {
    this.enrollment.courseId = courseId;
    return this;
  }

  withStatus(status: EnrollmentStatus): this {
    this.enrollment.status = status;
    return this;
  }

  asPending(): this {
    return this.withStatus(EnrollmentStatus.PENDING);
  }

  asCancelled(): this {
    return this.withStatus(EnrollmentStatus.CANCELLED);
  }

  asApproved(processedAt?: Date, processedById?: string): this {
    this.enrollment.status = EnrollmentStatus.APPROVED;
    this.enrollment.processedAt = processedAt || new Date();
    this.enrollment.processedById = processedById || 'manager-uuid';
    return this;
  }

  asRejected(processedAt?: Date, processedById?: string): this {
    this.enrollment.status = EnrollmentStatus.REJECTED;
    this.enrollment.processedAt = processedAt || new Date();
    this.enrollment.processedById = processedById || 'manager-uuid';
    return this;
  }

  build(): Enrollment {
    return this.enrollment as Enrollment;
  }
}

/**
 * Quick factory methods for common test scenarios
 */
export const TestDataFactory = {
  createStudent: () => new UserBuilder().asStudent().build(),

  createInstructor: () => new UserBuilder().asInstructor().build(),

  createManager: () => new UserBuilder().asManager().build(),

  createPublicCourse: () => new CourseBuilder().asPublic().build(),

  createPrivateCourse: () => new CourseBuilder().asPrivate().build(),

  createPendingEnrollment: () => new EnrollmentBuilder().asPending().build(),

  createApprovedEnrollment: () => new EnrollmentBuilder().asApproved().build(),
};
