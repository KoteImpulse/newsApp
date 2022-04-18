import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { FileService, FileType } from 'src/file/file.service';
import { Rating } from 'src/rating/entities/rating.entity';
import { RolesForUsers, User } from 'src/user/entities/user.entity';
import Permission from 'src/user/permission.type';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { categories } from './types';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    readonly fileService: FileService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    await this.postCreateDataValidation(createPostDto);

    const description = createPostDto.body[0];
    const post = await this.postRepository.create({
      title: createPostDto.title,
      body: createPostDto.body,
      tags: createPostDto.tags || '',
      category: {
        id: createPostDto.category.id || 0,
        title: createPostDto.category.title || 'Прочее',
        slug: createPostDto.category.slug || 'other',
        description:
          createPostDto.category.description || 'Все стать на разные темы',
        image: createPostDto.category.image || 'logo.jpg',
      },
      description: description || '',
      user: { id: userId },
    });

    const postForSave = await this.postRepository.save(post);
    const newPost = this.fileService.moveFilesToPostDir(postForSave);
    this.fileService.removeDir(FileType.USERIMAGE, postForSave.user.id);
    return await this.postRepository.save(newPost);
  }

  async findAll(
    take?: number,
    skip?: number,
  ): Promise<{ posts: Post[]; total: number }> {
    const qb = this.postRepository.createQueryBuilder('poststable');

    qb.orderBy('poststable.createdAt', 'DESC');
    qb.leftJoinAndSelect('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
    ]);
    if (take) {
      qb.take(take);
    }
    if (skip) {
      qb.skip(skip);
    }

    const [posts, total] = await qb.getManyAndCount();

    return { posts, total };
  }

  async pagination(
    take?: number,
    postId?: number,
    del?: boolean,
  ): Promise<{ posts: Post[]; left: number }> {
    const qb = this.postRepository.createQueryBuilder('poststable');

    if (postId) {
      if (del) {
        qb.andWhere('poststable.id <= :postId', { postId });
      } else {
        qb.andWhere('poststable.id < :postId', { postId });
      }
    }

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.orderBy('poststable.createdAt', 'DESC');
    qb.leftJoinAndSelect('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
    ]);
    if (take) {
      qb.take(take);
    }
    if (!postId) {
      qb.skip(0);
    }

    const [posts, left] = await qb.getManyAndCount();

    return { posts, left };
  }

  async findAllInUser(
    userId: number,
    sortBy: 'ASC' | 'DESC',
    take?,
    postId?: number,
    del?: boolean,
  ): Promise<{ posts: Post[]; total: number }> {
    const qb = this.postRepository.createQueryBuilder('poststable');
    if (userId) {
      qb.where('user.id = :userId', { userId });
    }
    if (postId) {
      if (del) {
        qb.andWhere('poststable.id <= :postId', { postId });
      } else {
        qb.andWhere('poststable.id < :postId', { postId });
      }
    }

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.orderBy('poststable.createdAt', sortBy || 'DESC');
    qb.leftJoinAndSelect('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.createdAt',
      'user.picture',
      'user.nickName',
    ]);
    if (!userId) {
      return null;
    }
    if (take) {
      qb.take(take);
    }
    if (!postId) {
      qb.skip(0);
    }

    const [posts, total] = await qb.getManyAndCount();
    return { posts, total };
  }

  async findAllInCategory(
    slug: string,
    sortBy?: 'ASC' | 'DESC',
    take?,
    postId?: number,
    del?: boolean,
  ): Promise<{ posts: Post[]; total: number }> {
    if (!categories.map((category) => category.slug).includes(slug)) {
      throw new HttpException(
        'Данной категории не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    const qb = this.postRepository.createQueryBuilder('poststable');
    if (slug) {
      qb.where(`poststable.category ::jsonb @> \'{"slug":"${slug}"}\'`);
    }
    if (postId) {
      if (del) {
        qb.andWhere('poststable.id <= :postId', { postId });
      } else {
        qb.andWhere('poststable.id < :postId', { postId });
      }
    }

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.orderBy('poststable.createdAt', sortBy || 'DESC');
    qb.leftJoinAndSelect('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.createdAt',
      'user.picture',
      'user.nickName',
    ]);
    if (take) {
      qb.take(take);
    }
    if (!postId) {
      qb.skip(0);
    }

    const [posts, total] = await qb.getManyAndCount();
    return { posts, total };
  }

  async findAllInUserBookmarks(
    userId: number,
    del?: boolean,
    userBookmarks?: number[],
  ): Promise<{ posts: Post[]; total: number }> {
    const qb = this.postRepository.createQueryBuilder('poststable');

    qb.where('poststable.id IN (:...bookmarks)', {
      bookmarks: userBookmarks,
    });

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.orderBy('poststable.createdAt', 'DESC');
    qb.leftJoinAndSelect('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.createdAt',
      'user.picture',
      'user.nickName',
    ]);
    if (!userId) {
      return null;
    }

    const [posts, total] = await qb.getManyAndCount();
    return { posts, total };
  }

  async getPopularPosts(): Promise<{ posts: Post[]; total: number }> {
    const qb = this.postRepository.createQueryBuilder('poststable');
    qb.orderBy('views', 'DESC');
    const [posts, total] = await qb.getManyAndCount();
    qb.limit(10);
    return { posts, total };
  }

  async searchPosts(
    searchPostDto: SearchPostDto,
  ): Promise<{ posts: Post[]; total: number }> {
    const qb = this.postRepository.createQueryBuilder('poststable');

    if (searchPostDto.lastPostId) {
      const postId = searchPostDto.lastPostId;
      qb.where('poststable.id < :postId', { postId });
    }
    if (searchPostDto.firstPostId) {
      const postId = searchPostDto.firstPostId;
      qb.where('poststable.id <= :postId', { postId });
    }

    qb.orderBy('poststable.createdAt', 'DESC');
    qb.leftJoinAndSelect('poststable.user', 'user');

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.select([
      'poststable',
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
    ]);
    qb.skip(searchPostDto.skip || 0);
    qb.take(searchPostDto.take || 10);

    if (searchPostDto.views) {
      qb.orderBy('poststable.views', searchPostDto.views || 'DESC');
    }
    if (searchPostDto.body) {
      qb.andWhere(`poststable.body ILIKE '%${searchPostDto.body}%'`);
    }
    if (searchPostDto.maindescription) {
      qb.andWhere(
        `poststable.description ILIKE '%${searchPostDto.maindescription}%'`,
      );
    }
    if (searchPostDto.title) {
      qb.andWhere(`poststable.title ILIKE '%${searchPostDto.title}%'`);
    }
    if (searchPostDto.tag) {
      qb.andWhere(`poststable.tags ILIKE '%${searchPostDto.tag}%'`);
    }

    const [posts, total] = await qb.getManyAndCount();

    return { posts, total };
  }

  async findOne(id: number) {
    const qb = await this.postRepository.createQueryBuilder('poststable');

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.leftJoin('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
    ]);
    await qb
      .whereInIds(id)
      .update()
      .set({ views: () => 'views + 1' })
      .execute();

    const post = await qb.getOne();

    if (!post) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async findOnePostNoViews(id: number) {
    const qb = await this.postRepository.createQueryBuilder('poststable');

    qb.leftJoinAndMapMany(
      'poststable.comment',
      Comment,
      'comment',
      'comment.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap(
      'b.commentsCount',
      'poststable.comment',
      'comment',
    );

    qb.leftJoinAndMapMany(
      'poststable.rating',
      Rating,
      'rating',
      'rating.post.id = poststable.id',
    );

    qb.loadRelationCountAndMap('b.ratingCount', 'poststable.rating', 'rating');

    qb.leftJoin('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
    ]);
    qb.whereInIds(id);

    const post = await qb.getOne();

    if (!post) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async findOnePost(id: number): Promise<Post> {
    const qb = await this.postRepository.createQueryBuilder('poststable');
    qb.leftJoin('poststable.user', 'user');
    qb.select([
      'poststable',
      'user.id',
      'user.picture',
      'user.nickName',
      'user.createdAt',
    ]);
    qb.whereInIds(id);

    const post = await qb.getOne();

    if (!post) {
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<UpdateResult> {
    const post = await this.findOnePost(id);
    if (!post) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'Нет доступа для редактирования этой статьи',
      );
    }
    const description = updatePostDto.body[0];

    if (updatePostDto.body.filter((item) => item.type === 'image').length > 0) {
      this.fileService.moveFilesToPostDir(null, updatePostDto, post.id);
      this.fileService.removeDir(FileType.USERIMAGE, userId);
      const filesInDto = updatePostDto.body
        .filter((item) => item.type === 'image')
        .map((item) => item.data.file.fileName);
      this.fileService.removeImages(
        FileType.POSTIMAGE,
        post.id,
        filesInDto as string[],
      );
    } else {
      this.fileService.removeDir(FileType.POSTIMAGE, post.id);
    }
    const updatedPost = await this.postRepository.update(id, {
      ...updatePostDto,
      description,
    });
    return updatedPost;
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    const post = await this.findOnePost(id);
    if (!post) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException('Нет доступа для удалений этой статьи');
    }
    const deleteResult = await this.postRepository.delete(id);
    return deleteResult;
  }

  async removeAdmin(id: number, user: User): Promise<DeleteResult> {
    const post = await this.findOnePost(id);
    if (!post) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (
      (user.role === RolesForUsers.ADMIN || RolesForUsers.MODERATOR) &&
      user.permissions.includes(Permission.DELETEPOST)
    ) {
      this.fileService.removeDir(FileType.POSTIMAGE, post.id);
      const deleteResult = await this.postRepository.delete(id);
      return deleteResult;
    }
    throw new ForbiddenException('Нет доступа для удалений этой статьи');
  }

  async postCreateDataValidation(createPostDto: CreatePostDto) {
    if (
      createPostDto.title.trim().length === 0 ||
      createPostDto.body.length === 0 ||
      Object.keys(createPostDto.body[0]).length === 0 ||
      Object.keys(createPostDto.category).length === 0
    ) {
      throw new ForbiddenException('Не может быть пустым');
    }

    if (
      !('id' in createPostDto.category) ||
      !('title' in createPostDto.category) ||
      !('slug' in createPostDto.category) ||
      !('description' in createPostDto.category) ||
      !('image' in createPostDto.category) ||
      typeof createPostDto.category.id !== 'number' ||
      typeof createPostDto.category.slug !== 'string' ||
      typeof createPostDto.category.title !== 'string' ||
      typeof createPostDto.category.description !== 'string' ||
      typeof createPostDto.category.image !== 'string'
    ) {
      throw new ForbiddenException('Не может быть пустым');
    }
    for (let i = 0; i < createPostDto.body.length; i++) {
      const el = createPostDto.body[i];

      if (
        !('id' in el) ||
        !('type' in el) ||
        !('data' in el) ||
        typeof el.id !== 'string' ||
        typeof el.type !== 'string' ||
        typeof el.data !== 'object' ||
        ![
          'header',
          'paragraph',
          'list',
          'delimiter',
          'image',
          'quote',
          'embed',
        ].includes(el.type)
      ) {
        throw new ForbiddenException('Не может быть пустым');
      }

      switch (el.type) {
        case 'header':
          if (
            Object.keys(el.data).length !== 2 ||
            !('text' in el.data) ||
            !('level' in el.data) ||
            typeof el.data.text !== 'string' ||
            typeof el.data.level !== 'number' ||
            el.data.level > 6 ||
            el.data.level < 2
          ) {
            throw new ForbiddenException('Не может быть пустым11');
          }
          break;

        case 'paragraph':
          if (
            Object.keys(el.data).length !== 1 ||
            !('text' in el.data) ||
            typeof el.data.text !== 'string'
          ) {
            throw new ForbiddenException('Не может быть пустым22');
          }
          break;
        case 'list':
          if (
            Object.keys(el.data).length !== 2 ||
            !('style' in el.data) ||
            !('items' in el.data) ||
            typeof el.data.style !== 'string' ||
            !Array.isArray(el.data.items)
          ) {
            throw new ForbiddenException('Не может быть пустым33');
          }
          if (el.data.style === 'ordered' || el.data.style === 'unordered') {
          } else {
            throw new ForbiddenException('Не может быть пустым44');
          }
          break;
        case 'delimiter':
          if (Object.keys(el.data).length !== 0) {
            throw new ForbiddenException('Не может быть пустым55');
          }
          break;
        case 'image':
          if (
            Object.keys(el.data).length !== 5 ||
            !('file' in el.data) ||
            !('caption' in el.data) ||
            !('withBorder' in el.data) ||
            !('withBackground' in el.data) ||
            !('stretched' in el.data) ||
            typeof el.data.file !== 'object' ||
            typeof el.data.caption !== 'string' ||
            typeof el.data.withBorder !== 'boolean' ||
            typeof el.data.withBackground !== 'boolean' ||
            typeof el.data.stretched !== 'boolean'
          ) {
            throw new ForbiddenException('Не может быть пустым66');
          }
          break;
        case 'quote':
          if (
            Object.keys(el.data).length !== 3 ||
            !('text' in el.data) ||
            !('caption' in el.data) ||
            !('alignment' in el.data) ||
            typeof el.data.text !== 'string' ||
            typeof el.data.caption !== 'string' ||
            typeof el.data.alignment !== 'string'
          ) {
            throw new ForbiddenException('Не может быть пустым77');
          }
          break;
        case 'embed':
          if (
            Object.keys(el.data).length !== 6 ||
            !('service' in el.data) ||
            !('source' in el.data) ||
            !('embed' in el.data) ||
            !('width' in el.data) ||
            !('height' in el.data) ||
            !('caption' in el.data) ||
            typeof el.data.service !== 'string' ||
            typeof el.data.source !== 'string' ||
            typeof el.data.embed !== 'string' ||
            typeof el.data.width !== 'number' ||
            typeof el.data.height !== 'number' ||
            typeof el.data.caption !== 'string'
          ) {
            throw new ForbiddenException('Не может быть пустым88');
          }
          break;
        default:
          throw new ForbiddenException('Не может быть пустым99');
          break;
      }
    }
  }
}
