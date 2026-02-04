import { Course } from '@app/courses';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseDetailDto extends Course {
  @ApiProperty({ name: 'enrolled_count' })
  @Expose({ name: 'enrolled_count' })
  enrolledCount: number;

  @ApiProperty({ name: 'is_enrolled' })
  @Expose({ name: 'is_enrolled' })
  isEnrolled: boolean;
}
