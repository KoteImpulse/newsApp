import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  CategoryList,
  EditorData,
} from '../types';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  @MinLength(3, { message: 'Должно быть больше 3 символов' })
  @MaxLength(200, { message: 'Максимум 200 символов' })
  readonly title: string;

  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsArray()
  @ArrayNotEmpty()
  readonly body: EditorData[];

  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsObject()
  @IsNotEmptyObject()
  readonly category: CategoryList;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  readonly mainDescription?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  readonly tags?: string;
}
