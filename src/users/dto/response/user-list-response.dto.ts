import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserListResponseDto<T> {
  @Expose()
  totalCount: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;

  @Expose()
  items: T[];
}
