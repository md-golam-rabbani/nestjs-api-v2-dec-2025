import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListFilterDto } from './dto/request/user-list-filter.dto';
import { UserListResponseDto } from './dto/response/user-list-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Patch('update-status/:id')
  async updateStatus(@Param('id') id: string): Promise<User> {
    return await this.usersService.updateStatus(id);
  }

  @Post('list')
  async findAllWithFilters(
    @Body(new ValidationPipe()) filterDto: UserListFilterDto,
  ): Promise<UserListResponseDto<User>> {
    return await this.usersService.findAllWithFilters(filterDto);
  }
}
