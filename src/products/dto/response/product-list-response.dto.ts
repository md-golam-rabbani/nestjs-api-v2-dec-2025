import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductListResponseDto<T> {
  @Expose()
  totalCount: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;

  @Expose()
  data: T[];
}
