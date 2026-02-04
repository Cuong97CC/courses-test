import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ name: 'course_id', description: 'Course ID to enroll in' })
  @Expose({ name: 'course_id' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
