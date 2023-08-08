import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';

@Entity({ name: 'article' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column('boolean', { default: false })
  isActive: boolean = false;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  avatar: any[];

  @ManyToMany(() => User, (user) => user.articleLikes, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: User[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (user) => user.articles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.articles, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  tags: Tag[];
}
