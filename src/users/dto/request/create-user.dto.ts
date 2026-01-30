import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(1, { message: 'First name must be at least one character long' })
  @MaxLength(25, { message: 'First name must be at most 25 characters long' })
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(25, { message: 'Last name must be at most 25 characters long' })
  lastName?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(100, { message: 'Email  must be at most 100 characters long' })
  email: string;

  @IsOptional()
  @MaxLength(25, { message: 'Phone  must be at most 25 characters long' })
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
