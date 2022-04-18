import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwtRefreshToken') {
  handleRequest(err, result) {
    if (err || !result) {
      throw new UnauthorizedException('У вас нет доступа к этой страниц');
    }
    return result;
  }
}
