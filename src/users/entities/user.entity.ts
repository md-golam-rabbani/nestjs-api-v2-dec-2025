import { IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: number;

  @Column({ length: 25 })
  firstName: string;

  @IsOptional()
  @Column({ nullable: true, length: 25 })
  lastName: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 25 })
  phone: string;

  @IsOptional()
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
