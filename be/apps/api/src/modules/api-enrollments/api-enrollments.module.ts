import { Module } from '@nestjs/common';
import { EnrollmentsModule } from '@app/enrollments';
import { CoursesModule } from '@app/courses';
import { ApiEnrollmentsController } from './api-enrollments.controller';
import { ApiEnrollmentsService } from './api-enrollments.service';
import { RedisModule } from '@app/redis';
import { UsersModule } from '@app/users';

@Module({
  imports: [EnrollmentsModule, CoursesModule, RedisModule, UsersModule],
  controllers: [ApiEnrollmentsController],
  providers: [ApiEnrollmentsService],
})
export class ApiEnrollmentsModule {}
