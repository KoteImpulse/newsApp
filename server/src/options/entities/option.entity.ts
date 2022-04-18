import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum TabComment {
  DESC = 0,
  ASC = 1,
}
export enum TabUserProfile {
  POST = 0,
  COMMENT = 1,
  BOOKMARK = 2,
}
export enum TabRating {
  FIRSTOPT = 0,
  SECONDOPT = 1,
  THIRDOPT = 2,
}

@Entity('optionstable')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  sidePanelIsOpenOption: boolean;

  @Column({ nullable: false, default: true })
  menuIsOpenOption: boolean;

  @Column({ nullable: false, default: TabComment.DESC })
  commentsSortOption: TabComment;

  @Column({ nullable: false, default: TabUserProfile.POST })
  userActiveTabOption: TabUserProfile;

  @Column({ nullable: false, default: TabRating.FIRSTOPT })
  ratingActiveTabOption: TabRating;

  @OneToOne(() => User, { nullable: false })
  user: User;
}
