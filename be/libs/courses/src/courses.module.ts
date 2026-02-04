import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CourseVersion } from './entities/course-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseVersion])],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
