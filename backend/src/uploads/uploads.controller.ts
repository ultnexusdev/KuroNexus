import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { UploadFromUrlDto } from './dto/upload-from-url.dto';
import { RemoteImageService } from './remote-image.service';
import { UploadsService } from './uploads.service';

@Roles('ADMIN')
@Controller('admin/uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly remoteImages: RemoteImageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('UPLOADS.FILE_REQUIRED');
    }
    return this.uploadsService.saveFile(file, user.id);
  }

  /**
   * Adresten görsel alma.
   *
   * Görsel **indirilip kendi sunucumuza yazılıyor**, adres olduğu gibi
   * saklanmıyor. İki sebep: (1) CSP `img-src` yalnızca sayılı sunucuya izin
   * veriyor, yabancı bir adres tarayıcıda engellenirdi; (2) dış adres bir gün
   * ölürse görsel de ölürdü. Aynı karar kitap kapaklarında da alınmıştı
   * (`book-cover.service.ts`).
   */
  @Post('from-url')
  async uploadFromUrl(
    @Body() dto: UploadFromUrlDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const image = await this.remoteImages.fetchImage(dto.url);
    return this.uploadsService.saveRemoteImage(image, user.id);
  }
}
