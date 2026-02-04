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
    default: CourseVisibility.PUBLIC,
  })
  visibility!: CourseVisibility;

  @ApiProperty({ name: 'version' })
  @Expose()
  @VersionColumn()
  version!: number;

  @ApiProperty({ name: 'created_by_id' })
  @Expose({ name: 'created_by_id' })
  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById!: string;

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
