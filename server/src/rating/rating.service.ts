import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    readonly postService: PostService,
    readonly userService: UserService,
  ) {}

  async findRating(userId: number, postId: number) {
    const qb = this.ratingRepository.createQueryBuilder('ratingtable');
    if (userId && postId) {
      qb.where('ratingtable.user.id = :userId', { userId });
      qb.andWhere('ratingtable.post.id = :postId', { postId });
    }
    const rating = await qb.getOne();
    return rating;
  }

  async setLike(userId: number, postId: number) {
    const post = await this.postService.findOnePost(postId);
    const user = await this.userService.findOne(userId);
    const rating = await this.findRating(userId, postId);

    if (rating) {
      await this.ratingRepository.delete(rating.id);
      return await this.userService.findById(userId);
    } else {
      if (post && user) {
        const rating = this.ratingRepository.create({
          rating: true,
          user: { id: userId },
          post: { id: postId },
        });
        await this.ratingRepository.save(rating);
        return await this.userService.findById(userId);
      }
    }
  }
}
