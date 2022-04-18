import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Request,
  Query,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwtAccess.guard';
import { JwtRefreshTokenGuard } from '../auth/guards/jwtRefresh.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { EmailActivatedGuard } from '../mail/guards/emailActivated.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserDecorator } from '../decorators/userId.decorator';
import { UserPermission } from './permission.type';
import PermissionGuard from '../auth/guards/permission.guard';
import { OptionsService } from '../options/options.service';
import { UpdateOptionDto } from '../options/dto/update-option.dto';
import { UpdateUserNickNameDto } from './dto/update-user.dto';
import { UpdateUserBookmarksDto } from './dto/update-user-bookmark.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    readonly optionService: OptionsService,
  ) {}

  @HttpCode(200)
  // @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @HttpCode(200)
  @UseGuards(PermissionGuard(UserPermission.CHANGEPROFILEOPTIONS))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Patch('change/profileNickname/:idUser')
  updateNickname(
    @UserDecorator() userId: number,
    @Param('idUser') idUser: number,
    @Body() dto: UpdateUserNickNameDto,
  ) {
    return this.userService.updateNickname(Number(userId), idUser, dto);
  }

  @HttpCode(200)
  @UseGuards(PermissionGuard(UserPermission.CHANGEPROFILEOPTIONS))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  @Patch('change/profileAvatar/:idUser')
  updatePicture(
    @UserDecorator() userId: number,
    @Param('idUser') idUser: number,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
    },
  ) {
    const { picture } = files;
    return this.userService.updatePicture(Number(userId), idUser, picture[0]);
  }

  @HttpCode(200)
  @UseGuards(PermissionGuard(UserPermission.CHANGEPROFILEOPTIONS))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Patch('change/profileAvatarDefault/:idUser')
  setDefaultPicture(
    @UserDecorator() userId: number,
    @Param('idUser') idUser: number,
    @Body('imageSrc') imageSrc: string,
  ) {
    return this.userService.setDefaultPicture(Number(userId), idUser, imageSrc);
  }

  @HttpCode(200)
  @UseGuards(PermissionGuard(UserPermission.CHANGEPROFILEOPTIONS))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Patch('change/profileOptions/:idUser')
  updateOptions(
    @Body() dto: UpdateOptionDto,
    @UserDecorator() userId: number,
    @Param('idUser') idUser: number,
  ) {
    return this.userService.updateOptions(Number(userId), idUser, dto);
  }

  @HttpCode(200)
  @UseGuards(PermissionGuard(UserPermission.CHANGEPROFILEOPTIONS))
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Patch('set/bookmarks')
  updateBookmarks(
    @Body() dto: UpdateUserBookmarksDto,
    @UserDecorator() userId: number,
  ) {
    return this.userService.updateBookmarks(Number(userId), dto);
  }

  @Get('get/bookmarks')
  findAllInUserBookmarks(
    @Query()
    query: {
      userId: number;
      del?: boolean;
    },
  ) {
    return this.userService.findAllInUserBookmarks(query.userId, query.del);
  }

  @HttpCode(200)
  @UseGuards(EmailActivatedGuard)
  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

  @HttpCode(200)
  @Get()
  findAll(
    @Query()
    query: {
      days: number;
    },
  ) {
    return this.userService.findAll(query.days);
  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    return user;
  }
}
