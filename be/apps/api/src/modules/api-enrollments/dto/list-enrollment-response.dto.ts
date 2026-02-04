import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BasePaginationResponse } from '@app/common/common.type';
import { Enrollment } from '@app/enrollments';
import { Course } from '@app/courses';
import { User } from '@app/users';

export class EnrollmentResponseDto extends Enrollment {
  @ApiProperty()
  @Expose()
  course: Course;

  @ApiProperty()
  @Expose()
  student: User;
}

export class ListEnrollmentResponseDto extends BasePaginationResponse<EnrollmentResponseDto> {
  @ApiProperty({
    type: EnrollmentResponseDto,
    isArray: true,
  })
  @Expose()
  @Type(() => EnrollmentResponseDto)
  declare data: EnrollmentResponseDto[];
}
