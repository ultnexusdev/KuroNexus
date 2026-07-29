import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PulseController } from './pulse.controller';
import { PulseService } from './pulse.service';

@Module({
  imports: [PrismaModule],
  controllers: [PulseController],
  providers: [PulseService],
})
export class PulseModule {}
