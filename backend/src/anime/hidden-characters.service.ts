import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Karakter dizininden çıkarılan karakterler.
 *
 * Dizin, arşivdeki serilerin AniList kadrolarından **türetiliyor** — bir
 * karakteri "silmek" diye bir şey yok, kaynak onu her tazelemede geri
 * getirir. Kalıcı olan tek şey bu dışlama listesi.
 *
 * Liste küçük (küratörün elle işaretlediği kadar) ve her dizin isteğinde
 * okunuyor; o yüzden tek bir `Set` olarak dönüyor, karakter başına sorgu yok.
 */
@Injectable()
export class HiddenCharactersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Gizlenmiş karakter numaraları. */
  async listIds(): Promise<Set<number>> {
    const rows = await this.prisma.hiddenCharacter.findMany({
      select: { characterId: true },
    });
    return new Set(rows.map((row) => row.characterId));
  }

  /**
   * Karakteri gizler.
   *
   * `upsert`: aynı karaktere iki kez basmak hata vermesin. Kullanıcı bir
   * karakteri gizler, sayfa tazelenmeden ikinci kez tıklarsa ikinci istek
   * sessizce aynı sonuca varır.
   */
  async hide(characterId: number, userId: string): Promise<{ characterId: number }> {
    await this.prisma.hiddenCharacter.upsert({
      where: { characterId },
      create: { characterId, userId },
      update: {},
    });
    return { characterId };
  }

  /**
   * Gizlemeyi geri alır.
   *
   * Burada gerçek silme var, yumuşak silme değil: kayıt zaten "gösterme"
   * demek, onu `isDeleted` ile işaretlemek "gizlemeyi gizlemek" gibi
   * anlamsız bir ikinci katman olurdu (şema notunda da yazılı).
   *
   * `deleteMany`: kayıt yoksa hata atmıyor — geri alma işlemi tekrarlanabilir
   * olsun.
   */
  async reveal(characterId: number): Promise<{ characterId: number }> {
    await this.prisma.hiddenCharacter.deleteMany({ where: { characterId } });
    return { characterId };
  }
}
