import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EmailActivatedGuard } from '../mail/guards/emailActivated.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwtAccess.guard';
import { UserDecorator } from '../decorators/userId.decorator';
import { JwtRefreshTokenGuard } from '../auth/guards/jwtRefresh.guard';
import RoleGuard from '../auth/guards/role.guard';
import { RolesForUsers, User } from '../user/entities/user.entity';
import { FullUserDecorator } from '../decorators/user.decorator';
import PermissionGuard from '../auth/guards/permission.guard';
import { PostPermission } from '../user/permission.type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService, FileType } from '../file/file.service';
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    readonly fileService: FileService,
  ) {}

  @UseGuards(PermissionGuard(PostPermission.CREATEPOST))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @UserDecorator() userId: number,
  ) {
    return this.postService.create(createPostDto, userId);
  }

  @Get('/search')
  searchPosts(@Query() dto) {
    return this.postService.searchPosts(dto);
  }

  @Get('/user')
  findAllInUser(
    @Query()
    query: {
      userId?: string;
      sortBy?: 'ASC' | 'DESC';
      take?: number;
      postId?: number;
      del?: boolean;
    },
  ) {
    return this.postService.findAllInUser(
      +query.userId,
      query.sortBy,
      query.take,
      query.postId,
      query.del,
    );
  }
  @Get('/category/:slug')
  findAllInCategory(
    @Param('slug') slug: string,
    @Query()
    query: {
      sortBy?: 'ASC' | 'DESC';
      take?: number;
      postId?: number;
      del?: boolean;
    },
  ) {
    return this.postService.findAllInCategory(
      slug,
      query.sortBy,
      query.take,
      query.postId,
      query.del,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Get('find/:id')
  findOnePostNoViews(@Param('id') id: number) {
    return this.postService.findOnePostNoViews(id);
  }

  @UseGuards(PermissionGuard(PostPermission.EDITPOST))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Patch(':id')
  update(
    @UserDecorator() userId: number,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto, userId);
  }

  @UseGuards(RoleGuard(RolesForUsers.ADMIN, RolesForUsers.MODERATOR))
  @UseGuards(PermissionGuard(PostPermission.DELETEPOST))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Delete(':id')
  remove(@FullUserDecorator() user: User, @Param('id') id: number) {
    return this.postService.removeAdmin(id, user);
  }

  @HttpCode(200)
  @UseGuards(PermissionGuard(PostPermission.CREATEPOST))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  @Post('uploadImageForPost')
  updatePicture(
    @UserDecorator() userId: number,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
    },
  ) {
    const { picture } = files;
    return this.fileService.createImageFile(
      FileType.USERIMAGE,
      picture[0],
      userId,
    );
  }

  @Get('/p/all')
  pagination(@Query() { take, postId, del }) {
    return this.postService.pagination(take, postId, del);
  }

  @Get()
  findAll(@Query() { take, skip }) {
    return this.postService.findAll(take, skip);
  }

  @Get('/get/popular')
  getPopularPosts() {
    return this.postService.getPopularPosts();
  }
}
