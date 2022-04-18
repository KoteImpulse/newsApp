import { Controller, UseGuards, HttpCode, Query, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import PermissionGuard from '../auth/guards/permission.guard';
import { PostPermission } from '../user/permission.type';
import { EmailActivatedGuard } from '../mail/guards/emailActivated.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwtAccess.guard';
import { JwtRefreshTokenGuard } from '../auth/guards/jwtRefresh.guard';
import { UserDecorator } from '../decorators/userId.decorator';

@Controller('subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @HttpCode(200)
  @UseGuards(PermissionGuard(PostPermission.CREATEPOST))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Get('subscribe')
  subscribe(
    @UserDecorator() userId: number,
    @Query() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.subscribe(userId, +dto.userToSubscribeId);
  }
}
