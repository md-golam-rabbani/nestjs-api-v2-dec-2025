import { IsString, IsEmail, IsOptional, MinLength, IsNumber } from 'class-validator';

/**
 * DTO for updating a test user
 * All fields are optional for partial updates
 */
export class UpdateTestUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
