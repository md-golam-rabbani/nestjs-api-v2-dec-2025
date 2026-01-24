import { UsersRepository } from './users.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserListFilterDto } from './dto/request/user-list-filter.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/response/user-response.dto';

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

    return await this.usersRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(id);
  }

  async updateStatus(id: string): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.updateStatus(id);
  }

  async findAllWithFilters(filterDto: UserListFilterDto): Promise<{
    items: User[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    return await this.usersRepository.findAllWithFilters(filterDto);
  }
}
