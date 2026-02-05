import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseVersion } from './entities/course-version.entity';
import sanitizeHtml from 'sanitize-html';
import { ICourseFilter, IUpdateCourseData } from './courses.type';
import { IBasePaginationRequest } from '@app/common/common.type';
import { formatPaginate } from '@app/common/common.helper';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseVersion)
    private courseVersionRepository: Repository<CourseVersion>,
  ) {}

  async create(data: Partial<Course>, userId: string): Promise<Course> {
    const course = this.courseRepository.create({
      ...data,
      content: this.sanitizeHtml(data.content || ''),
      createdById: userId,
    });

    return this.courseRepository.save(course);
  }

  async paginate(filters: ICourseFilter & IBasePaginationRequest) {
    const query = this.createQueryWithFilters(filters);
    return await formatPaginate(query, filters, Course);
  }

  createQueryWithFilters(filters?: ICourseFilter) {
    const query = this.courseRepository.createQueryBuilder('course');

    if (filters?.title) {
      query.andWhere('course.title ILIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    if (filters?.visibility) {
      query.andWhere('course.visibility = :filterVisibility', {
        filterVisibility: filters.visibility,
      });
    }

    if (filters?.startDateFrom) {
      query.andWhere('course.start_date >= :from', {
        from: filters.startDateFrom,
      });
    }

    if (filters?.startDateTo) {
      query.andWhere('course.start_date <= :to', { to: filters.startDateTo });
    }

    if (filters?.instructorId) {
      query.andWhere('course.created_by_id = :instructorId', {
        instructorId: filters.instructorId,
      });
    }

    return query;
  }

  async findById(id: string) {
    return await this.courseRepository.findOne({ where: { id } });
  }

  async findByIds(ids: string[]) {
    return await this.courseRepository.find({ where: { id: In(ids) } });
  }

  async update(
    id: string,
    data: IUpdateCourseData,
    userId: string,
    expectedVersion: number,
  ) {
    const course = await this.findById(id);

    if (!course) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }

    await this.courseVersionRepository.save({
      courseId: course.id,
      title: course.title,
      summary: course.summary,
      content: course.content,
      startDate: course.startDate,
      endDate: course.endDate,
      capacity: course.capacity,
      visibility: course.visibility,
      version: course.version,
      changedById: userId,
    });

    const updateData: IUpdateCourseData = {
      ...data,
    };

    if (data.content) {
      updateData.content = this.sanitizeHtml(data.content);
    }

    const result = await this.courseRepository.update(
      { id, version: expectedVersion },
      updateData,
    );

    if (result.affected === 0) {
      throw new ConflictException('COURSE.VERSION_CONFLICT');
    }

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }

  async getVersionHistory(id: string): Promise<CourseVersion[]> {
    return this.courseVersionRepository.find({
      where: { courseId: id },
      order: { changedAt: 'DESC' },
    });
  }

  private sanitizeHtml(html: string): string {
    return sanitizeHtml(html, {
      allowedTags: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'br',
        'strong',
        'em',
        'u',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'blockquote',
        'code',
        'pre',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
    });
  }
}
