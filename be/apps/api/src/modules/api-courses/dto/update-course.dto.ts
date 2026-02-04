import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends CreateCourseDto {
  @ApiProperty({ description: 'Current version for optimistic locking' })
  @Expose()
  @IsNumber()
  version: number;
}
