import { Comment } from 'src/comment/entities/comment.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryList, EditorData } from '../types';

@Entity('poststable')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: 'jsonb' })
  body: EditorData[];

  @Column({ nullable: false, type: 'jsonb' })
  description: EditorData | string;

  @Column({ nullable: true })
  maindescription: string;

  @Column({ nullable: false, default: 0 })
  views: number;

  @Column({ nullable: false, default: '' })
  tags: string;

  @Column({
    nullable: false,
    type: 'jsonb',
    default: {
      id: 0,
      title: 'Прочее',
      slug: 'other',
      description: 'Все стать на разные темы',
      image: 'logo.jpg',
    },
  })
  category: CategoryList;

  @ManyToOne(() => User, { eager: false, nullable: false })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => Rating, (rating) => rating.post)
  rating: Rating[];

  @CreateDateColumn({ type: 'timestamp', name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updatedat' })
  updatedAt: Date;
}
