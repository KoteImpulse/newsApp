import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { Option } from 'src/options/entities/option.entity';
import { UserService } from 'src/user/user.service';
import { OptionsService } from 'src/options/options.service';
import { FileService } from 'src/file/file.service';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User, Option, Post])],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    PostService,
    UserService,
    FileService,
    OptionsService,
  ],
})
export class SubscriptionsModule {}
