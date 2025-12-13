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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
