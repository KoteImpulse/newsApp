import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 400, {
    message: 'Comment не может быть короче 1 символов и длиннее 400',
  })
  readonly text: string;
}
