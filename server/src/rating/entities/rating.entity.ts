import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('ratingtable')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  rating: boolean;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @CreateDateColumn({ type: 'timestamp', name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updatedat' })
  updatedAt: Date;
}
