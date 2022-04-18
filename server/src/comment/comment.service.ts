import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesForUsers, User } from 'src/user/entities/user.entity';
import Permission from 'src/user/permission.type';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    if (!('text' in createCommentDto)) {
      throw new ForbiddenException('Не может быть пустым');
    }
    if (createCommentDto.text.trim().length <= 0) {
      throw new ForbiddenException('Не может быть пустым');
    }
    const comment = await this.commentRepository.create({
      text: createCommentDto.text.trim(),
      post: { id: createCommentDto.postId },
      user: { id: userId },
    });
    const commentForSave = await this.commentRepository.save(comment);
    const newComment = await this.findOne(commentForSave.id);
    return newComment;
  }

  async findAll(): Promise<{ comments: Comment[]; total: number }> {
    const qb = this.commentRepository.createQueryBuilder('comment');
    qb.orderBy('comment.createdAt', 'DESC');
    qb.leftJoin('comment.user', 'user');
    qb.leftJoin('comment.post', 'post');
    qb.select([
      'comment',
      'post.id',
      'post.title',
      'user.id',
      'user.createdAt',
      'user.picture',
      'user.nickName',
    ]);
    qb.limit(10);

    const [comments, total] = await qb.getManyAndCount();
    return { comments, total };
  }

  async findAllInPost(
    postId?: number,
    sortBy?: 'ASC' | 'DESC',
    take?: number,
    commentId?: number,
    del?: boolean,
  ): Promise<{ comments: Comment[]; total: number }> {
    const qb = this.commentRepository.createQueryBuilder('comment');
    if (postId) {
      qb.where(`comment.post.id = ${postId}`);
    }
    if (commentId) {
      if (del) {
        qb.andWhere('comment.id <= :commentId', { commentId });
      } else {
        if (sortBy === 'DESC') {
          qb.andWhere('comment.id < :commentId', { commentId });
        } else {
          qb.andWhere('comment.id > :commentId', { commentId });
        }
      }
    }
    qb.orderBy('comment.createdAt', sortBy || 'DESC');
    qb.leftJoin('comment.user', 'user');
    qb.leftJoin('comment.post', 'post');
    qb.select([
      'comment',
      'post.id',
      'post.title',
      'user.id',
      'user.createdAt',
      'user.picture',
      'user.nickName',
    ]);
    if (!postId) {
      return null;
    }
    if (take) {
      qb.take(take);
    }
    if (!commentId) {
      qb.skip(0);
    }

    const [comments, total] = await qb.getManyAndCount();
    return { comments, total };
  }

  async findAllInUser(
    userId: number,
    sortBy?: 'ASC' | 'DESC',
    take?: number,
    commentId?: number,
    del?: boolean,
  ): Promise<{ comments: Comment[]; total: number }> {
    const qb = this.commentRepository.createQueryBuilder('comment');
    if (userId) {
      qb.where(`comment.user.id = ${userId}`);
    }
    if (commentId) {
      if (del) {
        qb.andWhere('comment.id <= :commentId', { commentId });
      } else {
        qb.andWhere('comment.id < :commentId', { commentId });
      }
    }

    qb.orderBy('comment.createdAt', sortBy || 'DESC');
    qb.leftJoin('comment.user', 'user');
    qb.leftJoin('comment.post', 'post');
    qb.select([
      'comment',
      'post.id',
      'post.title',
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
    if (!commentId) {
      qb.skip(0);
    }

    const [comments, total] = await qb.getManyAndCount();
    return { comments, total };
  }

  async findOne(id: number): Promise<Comment> {
    const qb = await this.commentRepository.createQueryBuilder('commentstable');
    qb.leftJoin('commentstable.user', 'user');
    qb.leftJoin('commentstable.post', 'post');
    qb.select([
      'commentstable',
      'user.id',
      'user.createdAt',
      'user.picture',
      'user.nickName',
      'post.id',
      'post.title',
    ]);
    qb.whereInIds(id);

    const comment = await qb.getOne();

    if (!comment) {
      throw new HttpException('Комментарий не найден', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<any> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new HttpException('Комментарий не найден', HttpStatus.NOT_FOUND);
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('Нет доступа для редактирования поста');
    }
    if (!('text' in updateCommentDto)) {
      throw new ForbiddenException('Не может быть пустым');
    }
    if (updateCommentDto.text.trim().length <= 0) {
      throw new ForbiddenException('Не может быть пустым');
    }
    const updatedComment = await this.commentRepository.update(id, {
      text: updateCommentDto.text.trim(),
    });
    return updatedComment;
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new HttpException('Комментарий не найден', HttpStatus.NOT_FOUND);
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('Нет доступа для удаления поста');
    }
    const deleteResult = await this.commentRepository.delete(id);
    return deleteResult;
  }

  async removeAdmin(id: number, user: User): Promise<DeleteResult> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new HttpException('Комментарий не найден', HttpStatus.NOT_FOUND);
    }
    if (
      (user.role === RolesForUsers.ADMIN || RolesForUsers.MODERATOR) &&
      user.permissions.includes(Permission.DELETECOMMENT)
    ) {
      const deleteResult = await this.commentRepository.delete(id);
      return deleteResult;
    }
    throw new ForbiddenException('Нет доступа для удаления этого комментария');
  }
}
