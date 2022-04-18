import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 400, {
    message: 'Comment не может быть короче 1 символов и длиннее 400',
  })
  readonly text: string;
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  readonly postId: number;
}
