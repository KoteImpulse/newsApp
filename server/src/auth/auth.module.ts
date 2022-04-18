import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from 'src/token/token.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt.access.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt.refresh.strategy';
import { MailModule } from 'src/mail/mail.module';
import { OptionsService } from 'src/options/options.service';
import { Option } from 'src/options/entities/option.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwtAccessToken' }),
    TypeOrmModule.forFeature([Token, User, Option]),
    ConfigModule.forRoot({ envFilePath: `.env` }),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    OptionsService
  ],
  exports: [AuthService],
})
export class AuthModule {}
