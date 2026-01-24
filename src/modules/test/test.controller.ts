import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { CreateTestUserDto } from './dto/create-test-user.dto';
import { UpdateTestUserDto } from './dto/update-test-user.dto';
import { TestUser } from './entities/test-user.entity';

/**
 * Test Controller
 * Contains all endpoints for testing API response standardization
 */
@Controller('test')
export class TestController {
  // Mock data for testing
  private users: TestUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      age: 35,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /**
   * GET /test/users
   * Standard response with data (array of users)
   * Status: 200 OK
   */
  @Get('users')
  getAllUsers(): TestUser[] {
    return this.users;
  }

  /**
   * GET /test/users/:id
   * Single user response
   * Status: 200 OK or 404 Not Found
   */
  @Get('users/:id')
  getUserById(@Param('id') id: string): TestUser {
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  /**
   * POST /test/users
   * Create user with 201 status
   * Status: 201 Created
   */
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateTestUserDto): TestUser {
    const newUser: TestUser = {
      id: String(this.users.length + 1),
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * PUT /test/users/:id
   * Update user response
   * Status: 200 OK
   */
  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateTestUserDto,
  ): TestUser {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * DELETE /test/users/:id
   * Void response (no data, just success message)
   * Status: 200 OK
   */
  @Delete('users/:id')
  deleteUser(@Param('id') id: string): void {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    // Return void - no data
  }

  /**
   * DELETE /test/users/hard/:id
   * Another delete variation
   * Status: 200 OK
   */
  @Delete('users/hard/:id')
  hardDeleteUser(@Param('id') id: string): { message: string } {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    return { message: `User ${id} has been permanently deleted` };
  }

  /**
   * GET /test/users/paginated
   * Paginated response
   * Status: 200 OK
   */
  @Get('users/paginated')
  getPaginatedUsers(): {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    content: TestUser[];
  } {
    const pageNumber = 1;
    const pageSize = 10;

    return {
      pageNumber,
      pageSize,
      totalPages: Math.ceil(this.users.length / pageSize),
      totalElements: this.users.length,
      content: this.users,
    };
  }

  /**
   * GET /test/error
   * Trigger error for testing error responses
   * Status: 500 Internal Server Error
   */
  @Get('error')
  triggerError(): never {
    throw new InternalServerErrorException('This is a test error');
  }

  /**
   * GET /test/not-found
   * Trigger not found error
   * Status: 404 Not Found
   */
  @Get('not-found')
  triggerNotFound(): never {
    throw new NotFoundException('This resource does not exist');
  }

  /**
   * POST /test/validate
   * Test validation errors
   * Status: 400 Bad Request (if validation fails)
   */
  @Post('validate')
  testValidation(@Body() createUserDto: CreateTestUserDto): TestUser {
    // This will trigger validation errors if the DTO is invalid
    return {
      id: 'validated',
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * GET /test/conflict
   * Test conflict error
   * Status: 409 Conflict
   */
  @Get('conflict')
  triggerConflict(): never {
    throw new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: 'Resource already exists',
      },
      HttpStatus.CONFLICT,
    );
  }
}
