import { OptionsService } from './../options/options.service';
import { FileService } from './../file/file.service';
import { UserService } from './../user/user.service';
import { PostService } from 'src/post/post.service';
import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Rating } from './entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Option } from 'src/options/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Post, User, Option])],
  controllers: [RatingController],
  providers: [
    RatingService,
    PostService,
    UserService,
    FileService,
    OptionsService,
  ],
  exports: [RatingService],
})
export class RatingModule {}
