import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subsRepository: Repository<Subscription>,
    readonly userService: UserService,
  ) {}

  async findSubscription(userId: number, userToSubscribeId: number) {
    const qb = this.subsRepository.createQueryBuilder('substable');
    if (userId && userToSubscribeId) {
      qb.where('substable.user.id = :userId', { userId });
      qb.andWhere('substable.subscription.id = :userToSubscribeId', {
        userToSubscribeId,
      });
    }
    const subscription = await qb.getOne();
    return subscription;
  }

  async subscribe(userId: number, userToSubscribeId: number) {
    if (userId === userToSubscribeId) {
      throw new HttpException(
        'Нельзя подписываться на себя',
        HttpStatus.BAD_GATEWAY,
      );
    }
    const user = await this.userService.findOne(userId);
    const userToSub = await this.userService.findOne(userToSubscribeId);
    const subscription = await this.findSubscription(userId, userToSubscribeId);

    if (subscription) {
      await this.subsRepository.delete(subscription.id);
      return await this.userService.findById(userId);
    } else {
      if (user && userToSub) {
        const subscription = this.subsRepository.create({
          user: { id: userId },
          subscription: { id: userToSubscribeId },
        });
        await this.subsRepository.save(subscription);
        return await this.userService.findById(userId);
      }
    }
  }
}
