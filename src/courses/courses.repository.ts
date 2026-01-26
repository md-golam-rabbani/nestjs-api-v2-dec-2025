import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/request/create-course.dto';
import { CourseListFilterDto } from './dto/request/course-list-filter.dto';

/**
 * MongoDB filter type for course queries
 */
type MongoFilter = {
  title?: {
    $regex: string;
    $options?: string;
  };
  price?: {
    $gte?: number;
    $lte?: number;
  };
};

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repository: MongoRepository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.repository.create(createCourseDto);
    return await this.repository.save(course);
  }

  async findById(id: string): Promise<Course | null> {
    return await this.repository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async update(
    id: string,
    updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<Course> {
    const result = await this.repository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateCourseDto },
      { returnDocument: 'after' },
    );

    if (!result) {
      throw new NotFoundException('Course not found');
    }

    return result as unknown as Course;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Course not found');
    }
  }

  async togglePublishStatus(id: string): Promise<Course> {
    const course = await this.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const newStatus = !course.isPublished;

    const result = await this.repository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isPublished: newStatus } },
      { returnDocument: 'after' },
    );

    return result as unknown as Course;
  }

  async findAllWithFilters(filterDto: CourseListFilterDto): Promise<{
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    content: Course[];
  }> {
    const {
      search,
      minPrice,
      maxPrice,
      pageNumber = 1,
      pageSize = 10,
    } = filterDto;

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    // Build query filter
    const filter: MongoFilter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: 'i',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // Get total count
    const totalElements = await this.repository.count(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalElements / pageSize);

    // Get paginated data
    const content = await this.repository.find({
      where: filter,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      pageNumber,
      pageSize,
      totalPages,
      totalElements,
      content,
    };
  }
}
