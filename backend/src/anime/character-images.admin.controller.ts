import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { CharacterImagesService } from './character-images.service';
import { CreateCharacterImageDto } from './dto/create-character-image.dto';

/**
 * Karakter görselleri — kürator uçları.
 *
 * Yükleme iki adım: önce `/admin/uploads` (ya da `/admin/uploads/from-url`)
 * dosyayı sunucuya koyup adresini verir, sonra bu uç o adresi karaktere
 * bağlar. İki adım ayrı çünkü yükleme mantığı (SSRF savunması, mime/boyut
 * denetimi) tek bir yerde duruyor ve başka özellikler de onu kullanıyor.
 */
@Roles('ADMIN')
@Controller('admin/character-images')
export class CharacterImagesAdminController {
  constructor(private readonly images: CharacterImagesService) {}

  @Post()
  create(
    @Body() dto: CreateCharacterImageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.images.create(dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.images.remove(id);
  }
}
