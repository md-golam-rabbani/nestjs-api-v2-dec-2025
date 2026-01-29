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
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserListFilterDto } from './dto/request/user-list-filter.dto';
import { UserListResponseDto } from './dto/response/user-list-response.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
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

  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Patch(':id/update-status')
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
