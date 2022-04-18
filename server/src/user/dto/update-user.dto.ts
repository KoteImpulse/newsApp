import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserNickNameDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30, {
    message: 'Ник не может быть короче 3 символов и длиннее 30',
  })
  readonly nickName: string;
}
