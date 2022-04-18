import { TokenService } from './../token/token.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { DeleteResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { OptionsService } from 'src/options/options.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailService: MailService,
    private optionsService: OptionsService,
  ) {}

  async login(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
    accessCookie: string;
    refreshCookie: string;
  }> {
    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveRefreshToken(
      user,
      tokens.refreshToken,
      user.id,
    );

    return { ...tokens, user };
  }

  async registration(createUserDto: CreateUserDto): Promise<string> {
    const candidate = await this.userService.findByEmail(createUserDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      !('nickName' in createUserDto) ||
      !('email' in createUserDto) ||
      !('password' in createUserDto)
    ) {
      throw new ForbiddenException('Не может быть пустым');
    }
    if (createUserDto.nickName.trim().length === 0) {
      throw new ForbiddenException('Не может быть пустым');
    }
    if (createUserDto.email.trim().length === 0) {
      throw new ForbiddenException('Не может быть пустым');
    }
    if (createUserDto.password.trim().length === 0) {
      throw new ForbiddenException('Не может быть пустым');
    }

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.SALT),
    );
    const activationLink = await this.generateActivationLink(
      createUserDto.email,
    );
    const option = await this.optionsService.createOptions();
    const user: User = await this.userService.create(
      {
        email: createUserDto.email,
        password: hashPassword,
        nickName: createUserDto.nickName,
      },
      activationLink,
      option,
    );
    // await this.mailService.sendMailToUser(activationLink, createUserDto.email);
    const { refreshToken } = await this.tokenService.generateTokens(user);
    const { password, ...result } = user;
    await this.tokenService.saveRefreshToken(result, refreshToken, result.id);
    return 'Регистрация прошла успешно';
  }

  async refresh(user: User) {
    const { accessCookie, refreshCookie } =
      await this.tokenService.generateTokens(user);
    return { accessCookie, refreshCookie };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async logout(user: User): Promise<DeleteResult> {
    const token = await this.tokenService.removeToken(user, user.id);
    return token;
  }

  private async generateActivationLink(email: string): Promise<string> {
    const nameSpace = process.env.NAMESPACE;
    const activationLinkAffix = await uuidv5(email, nameSpace);
    const activationLinkPrefix = await uuidv4();
    const activationLink = `${process.env.BACKURL}/auth/activate/${activationLinkAffix}${activationLinkPrefix}`;
    return activationLink;
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<Omit<User, 'activationLink' | 'email'> | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (user && passwordEquals) {
      const { password: pwd, activationLink, email, ...result } = user;
      return result;
    }
    return null;
  }
}
