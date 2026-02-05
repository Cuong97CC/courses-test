import { CourseVisibility } from '@app/courses/courses.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Advanced 2026' })
  @Expose()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn advanced NestJS patterns and best practices' })
  @Expose()
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ example: '<p>Course content in HTML</p>' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '2026-03-01' })
  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2026-06-01' })
  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: 30 })
  @Expose()
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({
    enum: CourseVisibility,
    example: CourseVisibility.PUBLIC,
  })
  @Expose()
  @IsEnum(CourseVisibility)
  @IsNotEmpty()
  visibility: CourseVisibility;
}
