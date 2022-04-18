import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/auth/tokenPayload.interface';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    accessCookie: string;
    refreshCookie: string;
  }> {
    const { accessToken, accessCookie } =
      this.getCookieWithJwtAccessToken(user);
    const { refreshToken, refreshCookie } =
      this.getCookieWithJwtRefreshToken(user);
    return {
      accessToken,
      accessCookie,
      refreshToken,
      refreshCookie,
    };
  }

  public getCookieWithJwtAccessToken(user: User) {
    const payload: AccessTokenPayload = {
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
      isActivated: user.isActivated,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_KEY,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_KEY_TIME}m`,
    });
    const accessCookie = `Authentication=${accessToken}; HttpOnly; Path=/;  Max-Age=${process.env.JWT_ACCESS_TOKEN_KEY_TIME_SECONDS}`;
    return {
      accessToken,
      accessCookie,
    };
  }

  public getCookieWithJwtRefreshToken(user: User) {
    const payload: RefreshTokenPayload = {
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
      isActivated: user.isActivated,
      activationLink: user.activationLink,
      role: user.role
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_KEY,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_KEY_TIME}d`,
    });
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_KEY_TIME_SECONDS}`;
    return {
      refreshToken,
      refreshCookie,
    };
  }

  async saveRefreshToken(
    user: User,
    refreshToken: string,
    userId,
  ): Promise<Token> {
    const tokenData = await this.tokenRepository.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await this.tokenRepository.save({
        id: tokenData.id,
        refreshToken: tokenData.refreshToken,
        user: tokenData.user,
      });
    }
    const token = await this.tokenRepository.create({
      refreshToken,
      user: { id: user.id },
    });
    const tokenForSave = await this.tokenRepository.save(token);
    return tokenForSave;
  }

  async removeToken(user: User, userId): Promise<DeleteResult> {
    const token = await this.tokenRepository.findOne({ user: userId });
    if (!token) {
      throw new HttpException(
        'Некорректный логин или пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleteResult = await this.tokenRepository.delete(token.id);
    return deleteResult;
  }

  validateAccessToken(accessToken: string) {
    const user = this.jwtService.verify(accessToken, {
      secret: process.env.JWT_ACCESS_TOKEN_KEY,
    });

    if (!user) {
      throw new HttpException('Некорректный токен', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  validateRefreshToken(refreshToken: string) {
    const user = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN_KEY,
    });
    if (!user) {
      throw new HttpException('Некорректный токен', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
