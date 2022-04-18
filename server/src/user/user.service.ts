import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { SearchUserDto } from './dto/search-user.dto';
import { FileService, FileType } from 'src/file/file.service';
import { UpdateOptionDto } from 'src/options/dto/update-option.dto';
import { OptionsService } from 'src/options/options.service';
import { UpdateUserNickNameDto } from './dto/update-user.dto';
import { UpdateUserBookmarksDto } from './dto/update-user-bookmark.dto';
import { PostService } from 'src/post/post.service';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private fileService: FileService,
    private optionService: OptionsService,
    private postService: PostService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    activationLink: string,
    option,
  ): Promise<User> {
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      nickName: createUserDto.nickName,
      activationLink,
      option,
    });
    const userForSave = await this.userRepository.save(user);
    return userForSave;
  }

  async findAll(days?: number): Promise<User[]> {
    const qb = this.userRepository.createQueryBuilder('user');
    qb.leftJoinAndMapMany('user.post', Post, 'post', 'post.user.id = user.id');
    qb.leftJoin('post.rating', 'rating');
    if (days) {
      const currentdate = new Date();
      const lastDate = new Date(
        currentdate.setDate(currentdate.getDate() - days),
      );
      qb.where('rating.createdAt > :lastDate', { lastDate });
    }
    // qb.loadRelationCountAndMap('post.ratingCount', 'post.rating', 'rating');

    qb.select([
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
      'post.id',
      'rating',
    ]);

    qb.take(10);

    const users = await qb.getMany();
    // if (!users.length) {
    //   throw new HttpException(
    //     'Пользователи не найдены в базе данных',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    return users;
  }
  async search(
    searchUserDto: SearchUserDto,
  ): Promise<{ items: User[]; total: number }> {
    const qb = this.userRepository.createQueryBuilder('user');

    qb.limit(searchUserDto.skip || 0);
    qb.take(searchUserDto.take || 10);

    if (searchUserDto.email) {
      qb.andWhere(`user.email ILIKE '%${searchUserDto.email}%'`);
    }
    const [items, total] = await qb.getManyAndCount();

    if (!items.length) {
      throw new HttpException(
        'Пользователи не найдены в базе данных',
        HttpStatus.NOT_FOUND,
      );
    }

    return { items, total };
  }

  async findByEmail(email: string): Promise<User> {
    const qb = await this.userRepository.createQueryBuilder('user');
    qb.where(`user.email = :email`, { email });
    qb.leftJoin('user.option', 'option');
    qb.leftJoin('user.rating', 'rating');
    qb.leftJoin('user.subscriptions', 'subscriptions');
    qb.leftJoin('subscriptions.subscription', 'subscription');
    qb.leftJoin('rating.post', 'post');
    qb.select([
      'user',
      'option',
      'rating',
      'post.id',
      'subscriptions',
      'subscription.id',
      'subscription.nickName',
      'subscription.picture',
    ]);
    const user = await qb.getOne();
    return user;
  }

  async findByLink(activationLink: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { activationLink },
      relations: ['option', 'rating', 'subscriptions'],
    });
    const { password, ...result } = user;
    return result;
  }

  async findById(id: number): Promise<User> {
    const qb = await this.userRepository.createQueryBuilder('user');
    qb.whereInIds(id);
    qb.leftJoin('user.option', 'option');
    qb.leftJoin('user.rating', 'rating');
    qb.leftJoin('user.subscriptions', 'subscriptions');
    qb.leftJoin('subscriptions.subscription', 'subscription');
    qb.leftJoin('rating.post', 'post');
    qb.select([
      'user',
      'option',
      'rating',
      'post.id',
      'subscriptions',
      'subscription.id',
      'subscription.nickName',
      'subscription.picture',
    ]);
    const user = await qb.getOne();
    const { password, ...result } = user;
    return result;
  }

  async findOne(id: number): Promise<User> {
    const qb = await this.userRepository.createQueryBuilder('user');
    qb.whereInIds(id);
    qb.leftJoin('user.option', 'option');
    qb.leftJoin('user.rating', 'rating');
    qb.leftJoin('user.subscriptions', 'subscriptions');
    qb.leftJoin('subscriptions.subscription', 'subscription');
    qb.select([
      'user.id',
      'user.createdAt',
      'user.updatedAt',
      'user.picture',
      'user.nickName',
      'option',
      'subscriptions',
      'subscription.id',
      'subscription.nickName',
      'subscription.picture',
    ]);
    const user = await qb.getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updatePicture(
    userId: number,
    idUser: number,
    picture,
  ): Promise<UpdateResult> {
    const userFromReq = await this.findOne(userId);
    const userFromClient = await this.findOne(idUser);

    if (!userFromReq) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (!userFromClient) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    if (userFromReq.id !== userFromClient.id) {
      throw new HttpException(
        'Нет прав менять чужой профиль',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userFromReq.picture === userFromClient.picture) {
      const removeFile = this.fileService.removeFile(userFromReq.picture);
    }
    const picturePath = this.fileService.createFile(FileType.AVATAR, picture);

    try {
      if (picture) {
        return await this.userRepository.update(userId, {
          picture: picturePath,
        });
      }
    } catch (error) {
      throw new HttpException('Произошла ошибка', HttpStatus.BAD_REQUEST);
    }
  }

  async setDefaultPicture(
    userId: number,
    idUser: number,
    imagePath: string,
  ): Promise<UpdateResult> {
    const userFromReq = await this.findOne(userId);
    const userFromClient = await this.findOne(idUser);

    if (!userFromReq) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (!userFromClient) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    if (userFromReq.id !== userFromClient.id) {
      throw new HttpException(
        'Нет прав менять чужой профиль',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userFromReq.picture === userFromClient.picture) {
      const removeFile = this.fileService.removeFile(userFromReq.picture);
    }

    try {
      if (imagePath && imagePath.trim().length > 0) {
        return await this.userRepository.update(userId, {
          picture: imagePath,
        });
      }
    } catch (error) {
      throw new HttpException('Произошла ошибка', HttpStatus.BAD_REQUEST);
    }
  }

  async updateNickname(
    userId: number,
    idUser: number,
    dto: UpdateUserNickNameDto,
  ): Promise<UpdateResult> {
    const userFromReq = await this.findOne(userId);
    const userFromClient = await this.findOne(idUser);

    if (!userFromReq) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (!userFromClient) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (userFromReq.id !== userFromClient.id) {
      throw new HttpException(
        'Нет прав менять чужой профиль',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      if (dto.nickName && dto.nickName.trim().length > 2) {
        return await this.userRepository.update(userId, {
          nickName: dto.nickName,
        });
      }
    } catch (error) {
      throw new HttpException('Произошла ошибка', HttpStatus.BAD_REQUEST);
    }
  }

  async updateOptions(userId: number, idUser: number, dto: UpdateOptionDto) {
    const userFromReq = await this.findOne(userId);
    const userFromClient = await this.findOne(idUser);

    if (!userFromReq) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (!userFromClient) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    if (userFromReq.id !== userFromClient.id) {
      throw new HttpException(
        'Нет прав менять чужой профиль',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.optionService.saveOptions(userFromReq, userId, {
        sidePanelIsOpenOption: dto.sidePanelIsOpenOption,
        menuIsOpenOption: dto.menuIsOpenOption,
        commentsSortOption: dto.commentsSortOption,
        userActiveTabOption: dto.userActiveTabOption,
        ratingActiveTabOption: dto.ratingActiveTabOption,
      });
    } catch (error) {
      throw new HttpException('Произошла ошибка', HttpStatus.BAD_REQUEST);
    }
  }

  async updateBookmarks(userId: number, dto: UpdateUserBookmarksDto) {
    const userFromReq = await this.findById(userId);
    const post = await this.postService.findOnePost(dto.postToBookmarkId);

    if (!userFromReq) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (userFromReq.bookmarks.includes(dto.postToBookmarkId) && !post) {
      try {
        const bookmarks = userFromReq.bookmarks.filter(
          (item) => item !== dto.postToBookmarkId,
        );
        await this.userRepository.update(userFromReq.id, {
          bookmarks: bookmarks,
        });
        return (await this.findById(userId)).bookmarks;
      } catch (error) {
        throw new HttpException('Произошла ошибка', HttpStatus.BAD_REQUEST);
      }
    }
    if (!post) {
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND);
    }
    if (post.user.id === userFromReq.id) {
      throw new HttpException(
        'Нельзя добавлять свои посты в закладки',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      if (userFromReq.bookmarks.includes(dto.postToBookmarkId)) {
        const bookmarks = userFromReq.bookmarks.filter(
          (item) => item !== dto.postToBookmarkId,
        );
        await this.userRepository.update(userFromReq.id, {
          bookmarks: bookmarks,
        });
        return (await this.findById(userId)).bookmarks;
      }
      await this.userRepository.update(userFromReq.id, {
        bookmarks: [...userFromReq.bookmarks, dto.postToBookmarkId],
      });
      return (await this.findById(userId)).bookmarks;
    } catch (error) {
      throw new HttpException('Произошла ошибка', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllInUserBookmarks(
    userId: number,
    take?,
    postId?: number,
    del?: boolean,
  ) {
    const userFromReq = await this.findById(userId);
    if (!userFromReq) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    try {
      if (userFromReq.bookmarks.length > 0) {
        const posts = await this.postService.findAllInUserBookmarks(
          userId,
          del,
          userFromReq.bookmarks,
        );

        const findedPosts = posts.posts.map((item) => item.id);

        if (userFromReq.bookmarks.length !== findedPosts.length) {
          const newBookmarks = userFromReq.bookmarks.filter((item) =>
            findedPosts.includes(item),
          );
          await this.userRepository.update(userFromReq.id, {
            bookmarks: newBookmarks,
          });
        }
        return posts;
      }
    } catch (error) {
      throw new HttpException('Ошибка', HttpStatus.NOT_FOUND);
    }
  }
}
