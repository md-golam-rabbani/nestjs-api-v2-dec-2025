import { UsersRepository } from './users.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserListFilterDto } from './dto/request/user-list-filter.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserListResponseDto } from './dto/response/user-list-response.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersRepository.create(createUserDto);
    return instanceToPlain(user, {
      groups: ['response'],
    }) as UserResponseDto;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return instanceToPlain(user, {
      groups: ['response'],
    }) as UserResponseDto;
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = this.usersRepository.update(id, updateUserDto);
    return instanceToPlain(user, {
      groups: ['response'],
    }) as UserResponseDto;
  }

  async remove(id: string): Promise<void> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(id);
  }

  async updateStatus(id: string): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = this.usersRepository.updateStatus(id);
    return instanceToPlain(user, {
      groups: ['response'],
    }) as UserResponseDto;
  }

  async findAllWithFilters(
    filterDto: UserListFilterDto,
  ): Promise<UserListResponseDto<UserResponseDto>> {
    const result = await this.usersRepository.findAllWithFilters(filterDto);

    const content = result.content.map((user) =>
      instanceToPlain(user, { groups: ['response'] }),
    ) as UserResponseDto[];

    return {
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      totalElements: result.totalElements,
      content,
    };
  }
}
