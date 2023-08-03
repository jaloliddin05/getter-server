import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'website' })
export class Website extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column()
  link: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column('boolean', { default: false })
  isActive: boolean = false;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @ManyToMany(() => User, (user) => user.websiteLikes, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: User[];
}
