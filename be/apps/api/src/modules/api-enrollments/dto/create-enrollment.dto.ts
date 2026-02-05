import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Course ID to enroll in' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
