import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { EnrollmentStatus } from '../enrollments.type';
import { ApiProperty } from '@nestjs/swagger';

@Entity('enrollments')
export class Enrollment {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'course_id', type: 'uuid' })
  courseId!: string;

  @ApiProperty({ enum: EnrollmentStatus })
  @Expose()
  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status!: EnrollmentStatus;

  @ApiProperty()
  @Expose()
  @Column({ name: 'requested_at', type: 'timestamp' })
  requestedAt!: Date;

  @ApiProperty()
  @Expose()
  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt!: Date | null;

  @ApiProperty()
  @Expose()
  @Column({ name: 'processed_by_id', type: 'uuid', nullable: true })
  processedById!: string | null;

  @ApiProperty()
  @Expose()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
