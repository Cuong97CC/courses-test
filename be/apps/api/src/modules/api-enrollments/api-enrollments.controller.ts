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
import { Enrollment } from '@app/enrollments';
import { ApiEnrollmentsService } from './api-enrollments.service';
import {
  CreateEnrollmentDto,
  ProcessEnrollmentDto,
  EnrollmentFilterDto,
  ListEnrollmentResponseDto,
} from './dto';

@ApiTags('Enrollments')
@Controller('enrollments')
@ApiBearerAuth()
export class ApiEnrollmentsController {
  constructor(private readonly apiEnrollmentsService: ApiEnrollmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Request course enrollment (Student only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Enrollment request created',
    type: Enrollment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Already enrolled in this course',
  })
  async create(
    @Body() createDto: CreateEnrollmentDto,
    @CurrentUser() user: User,
  ) {
    return await this.apiEnrollmentsService.create(createDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List enrollments (role-based filtering)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of enrollments',
    type: ListEnrollmentResponseDto,
  })
  async paginate(
    @Query() filters: EnrollmentFilterDto,
    @CurrentUser() user: User,
  ): Promise<ListEnrollmentResponseDto> {
    return await this.apiEnrollmentsService.paginate(user, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Enrollment details',
    type: Enrollment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Enrollment not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Cannot access this enrollment',
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.apiEnrollmentsService.findOne(id, user);
  }

  @Patch(':id/process')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({
    summary: 'Approve/Reject enrollment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Enrollment processed',
    type: Enrollment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Enrollment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Enrollment already processed',
  })
  async process(
    @Param('id') id: string,
    @Body() processDto: ProcessEnrollmentDto,
    @CurrentUser() user: User,
  ) {
    return await this.apiEnrollmentsService.process(id, processDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel enrollment request' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Enrollment cancelled',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Enrollment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot cancel approved enrollment',
  })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.apiEnrollmentsService.cancel(id, user);
  }
}
