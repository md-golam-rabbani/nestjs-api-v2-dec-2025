import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.repository.create(createUserDto);
    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findAll() {
    return await this.repository.find();
  }

  async findById(id: string) {
    return await this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async update(id: string, createUserDto: Partial<CreateUserDto>) {
    return await this.repository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: createUserDto },
      { returnDocument: 'after' },
    );
  }

  async remove(id: string) {
    return await this.repository.deleteOne({ _id: new ObjectId(id) });
  }

  async updateStatus(id: string) {
    const objectId = new ObjectId(id);

    const document = await this.findById(id);

    if (!document) {
      throw new NotFoundException('User not found');
    }

    const currentStatus = document.isActive;
    const newStatus = !currentStatus;

    await this.repository.updateOne(
      { _id: objectId },
      { $set: { isActive: newStatus } },
    );

    return;
  }
}
