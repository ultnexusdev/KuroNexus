import { Module } from '@nestjs/common';
import { TransferNewsService } from './transfer-news.service';
import { TransferNewsController } from './transfer-news.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransferNewsController],
  providers: [TransferNewsService],
})
export class TransferNewsModule {}
