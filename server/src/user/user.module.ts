import { User } from './entities/user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Token } from 'src/token/entities/token.entity';
import { FileService } from 'src/file/file.service';
import { OptionsService } from 'src/options/options.service';
import { Option } from 'src/options/entities/option.entity';
import { PostService } from 'src/post/post.service';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Option, Post]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, FileService, OptionsService, PostService],
  exports: [UserService],
})
export class UserModule {}
