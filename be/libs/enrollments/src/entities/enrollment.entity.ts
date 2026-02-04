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
  @ApiProperty({ name: 'id' })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ name: 'student_id' })
  @Expose({ name: 'student_id' })
  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string;

  @ApiProperty({ name: 'course_id' })
  @Expose({ name: 'course_id' })
  @Column({ name: 'course_id', type: 'uuid' })
  courseId!: string;

  @ApiProperty({ name: 'status', enum: EnrollmentStatus })
  @Expose()
  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status!: EnrollmentStatus;

  @ApiProperty({ name: 'requested_at' })
  @Expose({ name: 'requested_at' })
  @Column({ name: 'requested_at', type: 'timestamp' })
  requestedAt!: Date;

  @ApiProperty({ name: 'processed_at' })
  @Expose({ name: 'processed_at' })
  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt!: Date | null;

  @ApiProperty({ name: 'processed_by_id' })
  @Expose({ name: 'processed_by_id' })
  @Column({ name: 'processed_by_id', type: 'uuid', nullable: true })
  processedById!: string | null;

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
