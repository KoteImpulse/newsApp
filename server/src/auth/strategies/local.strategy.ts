import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'activationLink' | 'email'>> {
    const user = await this.authService.validateUserCredentials(
      username,
      password,
    );
    if (!user) {
      throw new HttpException(
        'Некорректный логин или пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
