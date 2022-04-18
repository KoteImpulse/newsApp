import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async saveOptions(user: User, userId, dto?: UpdateOptionDto) {
    const option = await this.optionRepository.findOne(user.option.id);
    if (option) {
      await this.optionRepository.update(option.id, {
        ...dto,
      });
      return 'done';
    }
    return 'error';
  }

  async createOptions() {
    const optionsData = await this.optionRepository.create({
      sidePanelIsOpenOption: true,
      menuIsOpenOption: true,
      commentsSortOption: 0,
      userActiveTabOption: 0,
      ratingActiveTabOption: 0,
    });
    const options = await this.optionRepository.save(optionsData);
    return options;
  }
}
