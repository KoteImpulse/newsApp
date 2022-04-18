import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateSubscriptionDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  // @IsNumber({}, { message: 'Должно быть числом' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userToSubscribeId: string;
}
