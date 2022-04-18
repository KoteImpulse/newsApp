import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesForUsers, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import Permission from 'src/user/permission.type';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  async sendMailToUser(link: string, to: any) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter
      .sendMail({
        to: to,
        from: `Me`,
        subject: `Активация аккаунта на сайте ${process.env.BACKURL}`,
        text: '',
        html: `
				Пройти по ссылке для активации аккаунта
				<div><a href=${link}>${link}</a></div>
            `,
      })
      .then(() => HttpStatus.OK)
      .catch(() => {
        throw new HttpException(
          'Не удалось отправить данные',
          HttpStatus.BAD_GATEWAY,
        );
      })
      .finally(() => HttpStatus.OK);
  }

  async activateLink(link: string) {
    const fullLink = `${process.env.BACKURL}/auth/activate/${link}`;
    const user = await this.userService.findByLink(fullLink);
    if (!user) {
      throw new HttpException(
        'Некорректная ссылка активации',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.isActivated) {
      throw new BadRequestException('Почта уже подтверждена');
    }
    user.isActivated = true;
    user.role = RolesForUsers.USER;
    user.permissions = [
      Permission.CREATECOMMENT,
      Permission.EDITCOMMENT,
      Permission.EDITPOST,
      Permission.CREATEPOST,
      Permission.CHANGEPROFILEOPTIONS,
    ];
    const { password, role, permissions, activationLink, email, ...result } =
      await this.userRepository.save(user);
    return 'почта активирована';
  }

  async resendActivationLink(userId: number) {
    const user = await this.userService.findById(userId);
    if (user.isActivated) {
      throw new HttpException('Почта уже подтверждена', HttpStatus.BAD_REQUEST);
    }
    await this.sendMailToUser(user.activationLink, user.email);
    const { password, role, permissions, activationLink, email, ...result } =
      user;
    return 'done';
  }
}
