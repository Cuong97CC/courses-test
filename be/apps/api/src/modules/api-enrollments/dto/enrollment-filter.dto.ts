import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { BasePaginationRequest } from '@app/common/common.type';
import { EnrollmentStatus } from '@app/enrollments';

export class EnrollmentFilterDto extends BasePaginationRequest {
  @ApiPropertyOptional({ name: 'student_id' })
  @Expose({ name: 'student_id' })
  @IsString()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ name: 'course_id' })
  @Expose({ name: 'course_id' })
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional({ name: 'created_at_from' })
  @Expose({ name: 'created_at_from' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  requestedAtFrom?: Date;

  @ApiPropertyOptional({ name: 'created_at_to' })
  @Expose({ name: 'created_at_to' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  requestedAtTo?: Date;

  @ApiPropertyOptional({ enum: EnrollmentStatus })
  @Expose()
  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;
}
