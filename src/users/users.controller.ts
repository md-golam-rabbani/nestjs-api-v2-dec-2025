import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserListFilterDto } from './dto/request/user-list-filter.dto';
import { UserListResponseDto } from './dto/response/user-list-response.dto';
import { UserResponseDto } from './dto/response/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.updateStatus(id);
  }

  @Post('list')
  async findAllWithFilters(
    @Body(new ValidationPipe()) filterDto: UserListFilterDto,
  ): Promise<UserListResponseDto<UserResponseDto>> {
    return await this.usersService.findAllWithFilters(filterDto);
  }
}
