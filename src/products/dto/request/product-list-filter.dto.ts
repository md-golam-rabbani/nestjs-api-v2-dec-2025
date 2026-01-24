import {
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductListFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page number must be an integer' })
  @IsPositive({ message: 'Page number must be positive' })
  pageNumber?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page size must be an integer' })
  @Min(1, { message: 'Page size must be at least 1' })
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
