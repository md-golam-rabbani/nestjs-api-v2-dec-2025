import { IsOptional } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectIdColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @IsOptional()
  @Column({ type: 'varchar', length: 25, nullable: true })
  lastName?: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 25 })
  phone: string;

  @IsOptional()
  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  setDatesBeforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setDatesBeforeUpdate() {
    this.updatedAt = new Date();
  }
}
