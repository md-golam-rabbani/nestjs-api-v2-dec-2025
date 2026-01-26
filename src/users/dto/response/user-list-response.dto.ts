import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserListResponseDto<T> {
  @Expose()
  pageNumber: number;

  @Expose()
  pageSize: number;

  @Expose()
  totalPages: number;

  @Expose()
  totalElements: number;

  @Expose()
  content: T[];
}
