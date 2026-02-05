import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CourseVisibility } from '../courses.type';

@Entity('courses')
export class Course {
  @ApiProperty({ name: 'id' })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
  content!: string; // HTML content

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
    default: CourseVisibility.PUBLIC,
  })
  visibility!: CourseVisibility;

  @ApiProperty()
  @Expose()
  @VersionColumn()
  version!: number;

  @ApiProperty()
  @Expose()
  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById!: string;

  @ApiProperty()
  @Expose()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
