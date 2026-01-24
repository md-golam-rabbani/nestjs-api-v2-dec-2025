import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/request/create-course.dto';
import { UpdateCourseDto } from './dto/request/update-course.dto';
import { CourseListFilterDto } from './dto/request/course-list-filter.dto';
import { CourseResponseDto } from './dto/response/course-response.dto';
import { CourseListResponseDto } from './dto/response/course-list-response.dto';
import { Course } from './entities/course.entity';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ValidationPipe()) createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.coursesService.create(createCourseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return await this.coursesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return await this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    await this.coursesService.remove(id);
    return;
  }

  @Patch(':id/toggle-publish')
  async togglePublishStatus(@Param('id') id: string): Promise<Course> {
    return await this.coursesService.togglePublishStatus(id);
  }

  @Post('list')
  async findAllWithFilters(
    @Body(new ValidationPipe()) filterDto: CourseListFilterDto,
  ): Promise<CourseListResponseDto<Course>> {
    return await this.coursesService.findAllWithFilters(filterDto);
  }
}
