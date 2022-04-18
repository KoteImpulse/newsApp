import { IsBoolean, IsOptional, IsNumber } from 'class-validator';
import {
  TabComment,
  TabRating,
  TabUserProfile,
} from '../entities/option.entity';

export class UpdateOptionDto {
  @IsOptional({ message: 'Поле может быть пустым' })
  @IsBoolean({ message: 'Должно быть булевым' })
  sidePanelIsOpenOption?: boolean;

  @IsOptional({ message: 'Поле может быть пустым' })
  @IsBoolean({ message: 'Должно быть булевым' })
  menuIsOpenOption?: boolean;

  @IsOptional({ message: 'Поле может быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  commentsSortOption?: TabComment;

  @IsOptional({ message: 'Поле может быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  userActiveTabOption?: TabUserProfile;

  @IsOptional({ message: 'Поле может быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  ratingActiveTabOption?: TabRating;
}
