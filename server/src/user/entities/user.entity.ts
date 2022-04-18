import { Comment } from 'src/comment/entities/comment.entity';
import { Option } from 'src/options/entities/option.entity';
import { Post } from 'src/post/entities/post.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Permission from '../permission.type';

export enum RolesForUsers {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
  GHOST = 'GHOST',
}

@Entity('userstable')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password?: string;

  @Column({ nullable: false, default: false })
  isActivated: boolean;

  @Column({ nullable: false })
  activationLink: string;

  @Column({ nullable: false })
  nickName: string;

  @Column({ nullable: false, default: 'defaultAvatars/defaultAvatar.jpg' })
  picture: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: RolesForUsers,
    default: RolesForUsers.GHOST,
  })
  role: RolesForUsers;

  @Column({
    type: 'enum',
    enum: Permission,
    array: true,
    default: [],
  })
  permissions: Permission[];

  @Column('int', { array: true, default: [] })
  bookmarks: number[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToOne(() => Option, (option) => option.user, { nullable: false })
  @JoinColumn()
  option: Option;

  @OneToMany(() => Rating, (rating) => rating.user)
  rating: Rating[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
