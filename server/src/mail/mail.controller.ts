import { JwtRefreshTokenGuard } from './../auth/guards/jwtRefresh.guard';
import { JwtAccessTokenGuard } from './../auth/guards/jwtAccess.guard';
import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserDecorator } from 'src/decorators/userId.decorator';
import RoleGuard from 'src/auth/guards/role.guard';
import { RolesForUsers } from 'src/user/entities/user.entity';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(200)
  @UseGuards(RoleGuard(RolesForUsers.GHOST))
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Post('resendLink')
  async resendActivationLink(@UserDecorator() userId: number) {
    await this.mailService.resendActivationLink(userId);
  }
}
