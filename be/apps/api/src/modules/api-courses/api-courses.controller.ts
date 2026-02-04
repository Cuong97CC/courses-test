import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { CurrentUser } from '@app/auth/decorators/current-user.decorator';
import { User, UserRole } from '@app/users';
import { ApiCoursesService } from './api-courses.service';
import { CreateCourseDto, UpdateCourseDto, CourseFilterDto } from './dto';
import { Course } from '@app/courses';
import { ListCourseResponseDto } from './dto/list-courses-response.dto';

@ApiTags('Courses')
@Controller('courses')
@ApiBearerAuth()
export class ApiCoursesController {
  constructor(private readonly apiCoursesService: ApiCoursesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create new course (Instructor/Manager)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Course created successfully',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  async create(@Body() createDto: CreateCourseDto, @CurrentUser() user: User) {
    return await this.apiCoursesService.create(createDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List courses (role-based visibility)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of courses based on user role',
    type: [ListCourseResponseDto],
  })
  async paginate(
    @Query() filters: CourseFilterDto,
    @CurrentUser() user: User,
  ): Promise<ListCourseResponseDto> {
    return await this.apiCoursesService.paginate(user, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course details',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.apiCoursesService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course updated successfully',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Version conflict - course was modified by another user',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseDto,
    @CurrentUser() user: User,
  ) {
    return await this.apiCoursesService.update(id, updateDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete course' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Course deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  async remove(@Param('id') id: string) {
    await this.apiCoursesService.remove(id);
  }

  @Get(':id/versions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Get version history',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course version history',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  async getVersionHistory(@Param('id') id: string, @CurrentUser() user: User) {
    return this.apiCoursesService.getVersionHistory(id, user);
  }
}
