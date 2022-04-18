import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('substable')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: User;

  @CreateDateColumn({ type: 'timestamp', name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updatedat' })
  updatedAt: Date;
}
