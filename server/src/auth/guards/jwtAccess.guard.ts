import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwtAccessToken') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('Необходима авторизация');
    }
    return user;
  }
}
