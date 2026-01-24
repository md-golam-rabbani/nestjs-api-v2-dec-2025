import { Exclude, Expose, Transform } from 'class-transformer';
import { Product } from '../../entities/product.entity';

@Exclude()
export class ProductResponseDto {
  @Expose()
  @Transform(({ obj }: { obj: Product }) => obj._id?.toString())
  _id: string;

  @Expose()
  name: string;

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
