import { Course } from '@app/courses';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseDetailDto extends Course {
  @ApiProperty()
  @Expose()
  enrolledCount: number;

  @ApiProperty()
  @Expose()
  isEnrolled: boolean;
}
