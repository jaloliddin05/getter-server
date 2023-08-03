import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'portfolio' })
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column()
  link: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @ManyToMany(() => User, (user) => user.portfolioLikes, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: User[];
}
