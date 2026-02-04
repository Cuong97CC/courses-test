import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BasePaginationResponse } from '@app/common/common.type';
import { Course } from '@app/courses';
import { CourseDetailDto } from './course-detail.dto';

export class ListCourseResponseDto extends BasePaginationResponse<Course> {
  @ApiProperty({
    type: CourseDetailDto,
    isArray: true,
  })
  @Expose()
  @Type(() => CourseDetailDto)
  declare data: CourseDetailDto[];
}
