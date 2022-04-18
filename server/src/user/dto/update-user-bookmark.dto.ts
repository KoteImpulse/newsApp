import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserBookmarksDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  postToBookmarkId: number;
}
