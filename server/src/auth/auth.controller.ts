import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  Req,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwtAccess.guard';
import { JwtRefreshTokenGuard } from '../auth/guards/jwtRefresh.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: RequestWithUser) {
    const { user } = request;
    const result = await this.authService.login(user);
    request.res.setHeader('Set-Cookie', [
      result.accessCookie,
      result.refreshCookie,
    ]);
    return user;
  }

  @Post('registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration({
      email: createUserDto.email,
      nickName: createUserDto.nickName,
      password: createUserDto.password,
    });
  }

  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard)
  @Post('logout')
  async logout(@Request() request: RequestWithUser) {
    await this.authService.logout(request.user);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  async refresh(@Request() request: RequestWithUser) {
    const { activationLink, email, password, ...user } = request.user;
    const result = await this.authService.refresh(request.user);
    request.res.setHeader('Set-Cookie', result.accessCookie);
    return { user: user, access: result.accessCookie };
  }

  @Get('activate/:link')
  async activateLink(@Param('link') link: string, @Req() req) {
    await this.mailService.activateLink(link);
    return req.res.redirect(process.env.FRONTURL);
  }
}
