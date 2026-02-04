import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnrollmentStatus } from '@app/enrollments';

export class ProcessEnrollmentDto {
  @ApiProperty({
    enum: [EnrollmentStatus.APPROVED, EnrollmentStatus.REJECTED],
    description: 'Approval decision',
  })
  @Expose()
  @IsEnum([EnrollmentStatus.APPROVED, EnrollmentStatus.REJECTED])
  @IsNotEmpty()
  status: EnrollmentStatus.APPROVED | EnrollmentStatus.REJECTED;
}
