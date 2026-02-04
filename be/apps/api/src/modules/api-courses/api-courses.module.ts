import { Module } from '@nestjs/common';
import { CoursesModule } from '@app/courses';
import { ApiCoursesController } from './api-courses.controller';
import { ApiCoursesService } from './api-courses.service';
import { EnrollmentsModule } from '@app/enrollments';

@Module({
  imports: [CoursesModule, EnrollmentsModule],
  controllers: [ApiCoursesController],
  providers: [ApiCoursesService],
})
export class ApiCoursesModule {}
