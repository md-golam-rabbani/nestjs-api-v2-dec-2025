import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;
}
