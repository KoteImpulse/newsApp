import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { Option } from 'src/options/entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Option]),
  ],

  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
