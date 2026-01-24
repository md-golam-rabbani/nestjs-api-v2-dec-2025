import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CourseListResponseDto<T> {
  @Expose()
  totalCount: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;

  @Expose()
  items: T[];
}
