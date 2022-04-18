import {
  IsBoolean,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  isEnum,
} from 'class-validator';
import { TabComment, TabUserProfile } from '../entities/option.entity';

export class CreateOptionDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsBoolean({ message: 'Должно быть строкой' })
  sidePanelIsOpenOption: boolean;
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsBoolean({ message: 'Должно быть строкой' })
  menuIsOpenOption: boolean;
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  commentsSortOption: TabComment;
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  userActiveTabOption: TabUserProfile;
}
