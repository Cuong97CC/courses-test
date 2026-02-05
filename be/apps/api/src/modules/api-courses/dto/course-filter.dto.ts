import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { CourseVisibility } from '@app/courses';
import { BasePaginationRequest } from '@app/common/common.type';

export class CourseFilterDto extends BasePaginationRequest {
  @ApiPropertyOptional({ description: 'Search in title' })
  @Expose()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: CourseVisibility })
  @Expose()
  @IsEnum(CourseVisibility)
  @IsOptional()
  visibility?: CourseVisibility;

  @ApiPropertyOptional()
  @Expose()
  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsDateString()
  @IsOptional()
  startDateTo?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  instructorId?: string;
}
