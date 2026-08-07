import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { HiddenCharactersService } from './hidden-characters.service';
import { HideCharacterDto } from './dto/hide-character.dto';

/**
 * Karakter dizininden çıkarma — küratör uçları.
 *
 * `POST` gizler, `DELETE` gizlemeyi geri alır. İkisi de tekrarlanabilir:
 * aynı isteği iki kez göndermek hata üretmiyor, aynı sonuca varıyor.
 */
@Roles('ADMIN')
@Controller('admin/hidden-characters')
export class HiddenCharactersAdminController {
  constructor(private readonly hidden: HiddenCharactersService) {}

  @Post()
  hide(@Body() dto: HideCharacterDto, @CurrentUser() user: AuthenticatedUser) {
    return this.hidden.hide(dto.characterId, user.id);
  }

  @Delete(':characterId')
  reveal(@Param('characterId', ParseIntPipe) characterId: number) {
    return this.hidden.reveal(characterId);
  }
}
