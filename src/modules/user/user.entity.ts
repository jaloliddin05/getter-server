import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRole } from '../../infra/shared/types';
import { Position } from '../position/position.entity';
import { Article } from '../article/article.entity';
import { Comment } from '../comment/comment.entity';
import { FileEntity } from '../file/file.entity';
import { Website } from '../website/website.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { RepliedComment } from '../replied-comment/replied-comment.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 1 })
  role: UserRole;

  // @Column()
  // phone: string;

  // @Column({ nullable: true })
  // description: string;

  @Column({ default: false })
  isEmailValid: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @ManyToOne(() => Position, (position) => position.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  position: Position;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => RepliedComment, (repliedComment) => repliedComment.user)
  repliedComments: RepliedComment[];

  @OneToOne(() => FileEntity, (file) => file.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;

  @ManyToMany(() => Article, (article) => article.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  articleLikes: Article[];

  @ManyToMany(() => Website, (website) => website.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  websiteLikes: Website[];

  @ManyToMany(() => Portfolio, (portfolio) => portfolio.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  portfolioLikes: Portfolio[];

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
