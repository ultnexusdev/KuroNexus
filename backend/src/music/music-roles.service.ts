import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Künye rolü sözlüğü — **kontrollü, serbest metin değil.**
 *
 * Spotify rol bilgisi vermiyor; bu sözlük tamamen bizim. O yüzden
 * `MusicGenre`deki `isApproved` onay kapısı burada YOK: dışarıdan gelen bir
 * şey olmadığı için onaylanacak bir şey de yok.
 *
 * ⚠️ Görünen etiket tabloda TUTULMUYOR. `key` bir çeviri anahtarı ve metin
 * `messages/tr.json|en.json` → `music.roles.<key>` içinde duruyor (kural 1:
 * sıfır sabit metin). `BookGenre.key` ile aynı desen.
 *
 * ⚠️ Katalog sync'i bu tabloya YAZMAZ (bkz. `music-sync.service.ts` yazma
 * izni kuralı). Sözlük yalnızca buradan ve `prisma/seed.ts`ten kurulur; sync
 * eksik rol görürse künyeyi atlar ve uyarı düşer.
 *
 * ── ActKind ile KARIŞTIRILMAZ ─────────────────────────────────────────────
 * `MusicActKind` act'in ontolojik türü ("bu oluşum ne": Band, SoloProject).
 * `MusicRole` ise kimin hangi profesyonel işlevi üstlendiği. Hans Zimmer'ın
 * act'i SOLO_PROJECT, rolleri Composer + Producer.
 */

/**
 * Başlangıç sözlüğü. Sıra `orderIndex` olarak yazılıyor — künyede vokalist
 * prodüktörden önce görünsün.
 *
 * `primary_artist` ve `featured_artist` teknik olarak zorunlu: parça künyesini
 * kuran sync onları arıyor (`linkTrackCredits`). Kalanı küratör elle veriyor.
 */
const ROLE_KEYS = [
  'primary_artist',
  'featured_artist',
  'vocalist',
  'guitarist',
  'bassist',
  'drummer',
  'keyboardist',
  'dj',
  'turntablist',
  'composer',
  'songwriter',
  'producer',
  'arranger',
  'conductor',
  'mixing_engineer',
  'mastering_engineer',
] as const;

@Injectable()
export class MusicRolesService {
  private readonly logger = new Logger(MusicRolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async count(): Promise<number> {
    return this.prisma.musicRole.count();
  }

  /**
   * Sözlüğü kurar. **Tekrar çalıştırmak güvenli:** var olan anahtara
   * dokunmaz, yalnızca eksikleri ekler. Küratörün elle düzelttiği bir sırayı
   * ya da slug'ı ezmemesi için `update: {}` bilinçli olarak boş.
   */
  async seed(): Promise<{ created: number; existing: number }> {
    let created = 0;
    let existing = 0;

    for (const [index, key] of ROLE_KEYS.entries()) {
      const before = await this.prisma.musicRole.findUnique({
        where: { key },
        select: { id: true },
      });
      if (before) {
        existing += 1;
        continue;
      }
      await this.prisma.musicRole.create({
        data: {
          key,
          // Slug anahtarla aynı biçimde ama alt çizgi yerine tire: adres
          // segmenti olarak kullanılabilsin
          slug: key.replace(/_/g, '-'),
          orderIndex: index,
        },
      });
      created += 1;
    }

    if (created > 0) {
      this.logger.log(`Rol sözlüğü: ${created} rol eklendi, ${existing} vardı`);
    }
    return { created, existing };
  }
}
