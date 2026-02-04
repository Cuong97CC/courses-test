import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { CourseVisibility } from '@app/courses';
import { BasePaginationRequest } from '@app/common/common.type';

export class CourseFilterDto extends BasePaginationRequest {
  @ApiPropertyOptional({ description: 'Search in title and summary' })
  @Expose()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: CourseVisibility })
  @Expose()
  @IsEnum(CourseVisibility)
  @IsOptional()
  visibility?: CourseVisibility;

  @ApiPropertyOptional({ name: 'start_date_from' })
  @Expose({ name: 'start_date_from' })
  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @ApiPropertyOptional({ name: 'start_date_to' })
  @Expose({ name: 'start_date_to' })
  @IsDateString()
  @IsOptional()
  startDateTo?: string;

  @ApiPropertyOptional({ name: 'instructor_id' })
  @Expose({ name: 'instructor_id' })
  @IsString()
  @IsOptional()
  instructorId?: string;
}
