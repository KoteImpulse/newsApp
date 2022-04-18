import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('tokenstable')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  refreshToken: string;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
}
