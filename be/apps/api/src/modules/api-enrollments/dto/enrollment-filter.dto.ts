import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { BasePaginationRequest } from '@app/common/common.type';
import { EnrollmentStatus } from '@app/enrollments';

export class EnrollmentFilterDto extends BasePaginationRequest {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  requestedAtFrom?: Date;

  @ApiPropertyOptional()
  @Expose()
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
