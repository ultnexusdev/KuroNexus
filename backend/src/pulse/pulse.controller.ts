import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PulseService } from './pulse.service';

@Controller('pulse')
export class PulseController {
  constructor(private readonly pulseService: PulseService) {}

  // "Nexus'u Keşfet" sayfasının tamamı tek istekte
  @Public()
  @Get()
  getPulse() {
    return this.pulseService.getPulse();
  }
}
