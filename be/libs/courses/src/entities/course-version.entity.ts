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
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'course_id', type: 'uuid' })
  courseId!: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'text' })
  summary!: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'text' })
  content!: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @ApiProperty()
  @Expose()
  @Column({ name: 'end_date', type: 'date' })
  endDate!: Date;

  @ApiProperty()
  @Expose()
  @Column({ type: 'integer' })
  capacity!: number;

  @ApiProperty({ enum: CourseVisibility })
  @Expose()
  @Column({
    type: 'enum',
    enum: CourseVisibility,
  })
  visibility!: CourseVisibility;

  @ApiProperty()
  @Expose()
  @Column({ type: 'integer' })
  version!: number;

  @ApiProperty()
  @Expose()
  @Column({ name: 'changed_by_id', type: 'uuid' })
  changedById!: string;

  @ApiProperty()
  @Expose()
  @CreateDateColumn({ name: 'changed_at', type: 'timestamp' })
  changedAt!: Date;
}
