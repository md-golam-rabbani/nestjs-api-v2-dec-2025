import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength, IsNumber } from 'class-validator';

/**
 * DTO for creating a test user
 * Used for testing validation errors
 */
export class CreateTestUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
