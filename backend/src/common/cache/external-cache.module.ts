import { Global, Module } from '@nestjs/common';
import { ExternalCacheService } from './external-cache.service';

/**
 * Global: `PrismaModule` gibi her modülde import etmeden enjekte edilir —
 * on altı servis kullanıyor, her birinin modülüne satır eklemek gürültü.
 */
@Global()
@Module({
  providers: [ExternalCacheService],
  exports: [ExternalCacheService],
})
export class ExternalCacheModule {}
