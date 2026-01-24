import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectIdColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @ObjectIdColumn()
  _id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'number' })
  price: number;

  @Column({ type: 'array', default: [] })
  tags: string[];

  @Column({ type: 'boolean', default: true })
  isPublished: boolean = true;

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
