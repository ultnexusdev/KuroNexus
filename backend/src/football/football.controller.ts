import { Controller, Get, Param } from '@nestjs/common';
import { FootballService } from './football.service';
import { Public } from '../common/decorators/public.decorator';

// Public uçlar: yanıtlar backend cache'inden gelir, API anahtarı dışarı sızmaz
@Controller('football')
export class FootballController {
  constructor(private readonly football: FootballService) {}

  @Public()
  @Get('squad')
  getSquad() {
    return this.football.getSquad();
  }

  @Public()
  @Get('player/:id')
  getPlayer(@Param('id') id: string) {
    return this.football.getPlayer(id);
  }
}
