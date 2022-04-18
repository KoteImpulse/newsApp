import { Controller, Post, HttpCode, UseGuards, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import PermissionGuard from '../auth/guards/permission.guard';
import { PostPermission } from '../user/permission.type';
import { EmailActivatedGuard } from '../mail/guards/emailActivated.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwtAccess.guard';
import { JwtRefreshTokenGuard } from '../auth/guards/jwtRefresh.guard';
import { UserDecorator } from '../decorators/userId.decorator';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @HttpCode(200)
  @UseGuards(PermissionGuard(PostPermission.CREATEPOST))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Post('setLike')
  setLike(@UserDecorator() userId: number, @Query() dto: CreateRatingDto) {
    return this.ratingService.setLike(userId, +dto.postId);
  }
}
