import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CourseVisibility } from '../courses.type';

@Entity('course_versions')
export class CourseVersion {
  @ApiProperty({ name: 'id' })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ name: 'course_id' })
  @Expose({ name: 'course_id' })
  @Column({ name: 'course_id', type: 'uuid' })
  courseId!: string;

  @ApiProperty({ name: 'title' })
  @Expose()
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @ApiProperty({ name: 'summary' })
  @Expose()
  @Column({ type: 'text' })
  summary!: string;

  @ApiProperty({ name: 'content' })
  @Expose()
  @Column({ type: 'text' })
  content!: string;

  @ApiProperty({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @ApiProperty({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  @Column({ name: 'end_date', type: 'date' })
  endDate!: Date;

  @ApiProperty({ name: 'capacity' })
  @Expose()
  @Column({ type: 'integer' })
  capacity!: number;

  @ApiProperty({ name: 'visibility', enum: CourseVisibility })
  @Expose()
  @Column({
    type: 'enum',
    enum: CourseVisibility,
  })
  visibility!: CourseVisibility;

  @ApiProperty({ name: 'version' })
  @Expose()
  @Column({ type: 'integer' })
  version!: number;

  @ApiProperty({ name: 'changed_by_id' })
  @Expose({ name: 'changed_by_id' })
  @Column({ name: 'changed_by_id', type: 'uuid' })
  changedById!: string;

  @ApiProperty({ name: 'changed_at' })
  @Expose({ name: 'changed_at' })
  @CreateDateColumn({ name: 'changed_at', type: 'timestamp' })
  changedAt!: Date;
}
