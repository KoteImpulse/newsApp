import { JwtRefreshTokenGuard } from './../auth/guards/jwtRefresh.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/guards/jwtAccess.guard';
import { UserDecorator } from '../decorators/userId.decorator';
import { EmailActivatedGuard } from '../mail/guards/emailActivated.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import RoleGuard from 'src/auth/guards/role.guard';
import { RolesForUsers, User } from '../user/entities/user.entity';
import { FullUserDecorator } from '../decorators/user.decorator';
import PermissionGuard from '../auth/guards/permission.guard';
import { CommentPermission } from '../user/permission.type';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(PermissionGuard(CommentPermission.CREATECOMMENT))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UserDecorator() userId: number,
  ) {
    return this.commentService.create(createCommentDto, userId);
  }

  @Get('/post')
  findAllInPost(
    @Query()
    query: {
      postId?: string;
      sortBy?: 'ASC' | 'DESC';
      take?: number;
      commentId?: number;
      del?: boolean;
    },
  ) {
    return this.commentService.findAllInPost(
      +query.postId,
      query.sortBy,
      query.take,
      query.commentId,
      query.del,
    );
  }

  @Get('/user')
  findAllInUser(
    @Query()
    query: {
      userId?: string;
      sortBy?: 'ASC' | 'DESC';
      take?: number;
      commentId?: number;
      del?: boolean;
    },
  ) {
    return this.commentService.findAllInUser(
      +query.userId,
      query.sortBy,
      query.take,
      query.commentId,
      query.del,
    );
  }

  @Get('all')
  findAll() {
    return this.commentService.findAll();
  }

  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findOne(id);
  }

  @UseGuards(PermissionGuard(CommentPermission.EDITCOMMENT))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCommentDto,
    @UserDecorator() userId: number,
  ) {
    return this.commentService.update(id, dto, userId);
  }

  @UseGuards(RoleGuard(RolesForUsers.ADMIN, RolesForUsers.MODERATOR))
  @UseGuards(PermissionGuard(CommentPermission.DELETECOMMENT))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @FullUserDecorator() user: User) {
    return this.commentService.removeAdmin(id, user);
  }
}
