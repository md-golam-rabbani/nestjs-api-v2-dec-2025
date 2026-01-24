import { Exclude, Expose, Transform } from 'class-transformer';
import { Course } from '../../entities/course.entity';

@Exclude()
export class CourseResponseDto {
  @Expose()
  // @Transform(({ obj }: { obj: Course }) => obj._id?.toString())
  _id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  price: number;

  @Expose()
  tags: string[];

  @Expose()
  isPublished: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
