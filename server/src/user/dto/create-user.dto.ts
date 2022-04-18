import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsEmail(undefined, { message: 'Неккоретно задана почта' })
  @IsString({ message: 'Должно быть строкой' })
  readonly email: string;

  @Length(6, 32, {
    message: 'Пароль не может быть короче 6 символов и длиннее 32',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly password?: string;

  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(3, 30, {
    message: 'Ник не может быть короче 3 символов и длиннее 30',
  })
  readonly nickName: string;
}
