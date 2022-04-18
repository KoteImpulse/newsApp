import { Controller } from '@nestjs/common';
import { OptionsService } from './options.service';

@Controller('option')
export class OptionsController {
  constructor(readonly optionService: OptionsService) {}
}
