import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/request/create-course.dto';
import { UpdateCourseDto } from './dto/request/update-course.dto';
import { CourseListFilterDto } from './dto/request/course-list-filter.dto';
import { instanceToPlain } from 'class-transformer';
import { CourseResponseDto } from './dto/response/course-response.dto';
import { CourseListResponseDto } from './dto/response/course-list-response.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    const course = await this.coursesRepository.create(createCourseDto);
    return instanceToPlain(course, {
      groups: ['response'],
    }) as CourseResponseDto;
  }

  async findOne(id: string): Promise<CourseResponseDto> {
    const course = await this.coursesRepository.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return instanceToPlain(course, {
      groups: ['response'],
    }) as CourseResponseDto;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    const existingCourse = await this.coursesRepository.findById(id);

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    const course = await this.coursesRepository.update(id, updateCourseDto);
    return instanceToPlain(course, {
      groups: ['response'],
    }) as CourseResponseDto;
  }

  async remove(id: string): Promise<void> {
    const existingCourse = await this.coursesRepository.findById(id);

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    await this.coursesRepository.remove(id);
  }

  async togglePublishStatus(id: string): Promise<CourseResponseDto> {
    const existingCourse = await this.coursesRepository.findById(id);

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    const course = await this.coursesRepository.togglePublishStatus(id);
    return instanceToPlain(course, {
      groups: ['response'],
    }) as CourseResponseDto;
  }

  async findAllWithFilters(
    filterDto: CourseListFilterDto,
  ): Promise<CourseListResponseDto<CourseResponseDto>> {
    const result = await this.coursesRepository.findAllWithFilters(filterDto);

    const content = result.content.map((course) =>
      instanceToPlain(course, { groups: ['response'] }),
    ) as CourseResponseDto[];

    return {
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      totalElements: result.totalElements,
      content,
    };
  }
}
