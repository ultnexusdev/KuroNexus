import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RemoteImageService } from '../uploads/remote-image.service';
import { UploadsService } from '../uploads/uploads.service';
import type { CharacterImageSlot } from '../generated/prisma/client';

/**
 * Akatsuki sergisinin görsel kurulumu.
 *
 * Sergi sayfasının YAZILI içeriği kodda (`frontend/lib/anime/akatsuki.ts` +
 * i18n) — Zaraki emsalinin aynısı. GÖRSELLER ise `CharacterImage`
 * tablosunda durur ve bu servis onları kaynak sitelerden indirip kendi
 * diskimize koyar. Hotlink bilinçli olarak YOK: kaynak site görseli
 * kaldırırsa sayfa bozulur, CSP zaten dış adrese izin vermiyor ve kendi
 * diskimiz daha hızlı (kitap kapağı / müzik kapak servislerindeki gerekçe).
 *
 * Neden admin ucu: `prisma db seed` konteynerde çalışmıyor (ESM/`_client`),
 * kurulum işleri admin uçlarından yapılıyor — müzik taksonomisi emsali.
 *
 * İdempotent: aynı karakter+yuva(+kart adı) için silinmemiş kayıt varsa o
 * satır ATLANIR. Küratörün elle yüklediği görsel asla ezilmez; beğenilmeyen
 * görsel küratör panelinden silinip uç yeniden çalıştırılarak tazelenir.
 */

interface ManifestRow {
  /** AniList karakter numarası (CharacterImage.characterId ile aynı anlam) */
  characterId: number;
  slot: CharacterImageSlot;
  /** ABILITY yuvasında sergi anahtarı: "path:deva", "akatsuki:sky" gibi */
  abilityName?: string;
  sourceUrl: string;
  altText: string;
}

/**
 * Kaynak: Naruto Wiki (naruto.fandom.com) — dosya adresleri MediaWiki
 * API'sinden alındı (16 Ağustos 2026). Tam liste ve atıf `PLAN.md`
 * "Görsel Kaynakları" bölümünde.
 *
 * ⚠️ ABILITY yuvası burada "sergi görseli" anlamında kullanılıyor:
 * `abilityName` koddaki katmanın anahtarıyla eşleşir (şemadaki yorumun
 * öngördüğü kullanım). Karakter dosya sayfası yalnızca kendi tanımladığı
 * kart adlarını çizer, "path:*" / "akatsuki:*" anahtarları orada görünmez.
 */
const WIKI = 'https://static.wikia.nocookie.net/naruto/images';

const MANIFEST: ManifestRow[] = [
  // ── Pain (AniList 3180) — hero + sergi görselleri ─────────────────────
  {
    characterId: 3180,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/e/e3/Deva_Path.png/revision/latest`,
    altText: 'Pain — Deva Path',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:sky',
    sourceUrl: `${WIKI}/2/27/Pain_at_Konoha.png/revision/latest`,
    altText: 'Pain, Konoha semalarinda',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:six',
    sourceUrl: `${WIKI}/3/3a/Six_Paths_Pain.png/revision/latest`,
    altText: 'Six Paths of Pain',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:origins',
    sourceUrl: `${WIKI}/d/d1/Akatsuki_original.png/revision/latest`,
    altText: 'Akatsuki kurulus kadrosu — Yahiko, Nagato, Konan',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:nagato',
    sourceUrl: `${WIKI}/4/46/Nagato.png/revision/latest`,
    altText: 'Nagato',
  },
  /*
   * v2 güncellemesi (16 Ağustos 2026, akşam): 4K/yüksek çözünürlük bantlar.
   * SALT EKLEME — uç idempotent kaldığı için canlıda düğmeye bir kez daha
   * basmak yalnızca bu üçünü indirir, mevcut görsellere dokunmaz.
   */
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:legion',
    // 3840x2151 — üyeler bölümünün arka bandı
    sourceUrl: `${WIKI}/3/39/Nagato%27s_Akatsuki.png/revision/latest`,
    altText: 'Akatsuki kadrosu bir arada',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:horror',
    // 3424x1572 — ikililer koşarken, Konan'in kagit kanatlari acik
    sourceUrl: `${WIKI}/f/f8/Horror_of_Akatsuki.png/revision/latest`,
    altText: 'Akatsuki ikilileri harekatta',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'akatsuki:dawn',
    // 2560x1440 — yagmurun altinda genc Nagato, Rinnegan acik
    sourceUrl: `${WIKI}/3/33/Origin_of_Pain.png/revision/latest`,
    altText: 'Yagmurun altinda Nagato',
  },
  // ── Six Paths (hepsi Pain kaydinda) ───────────────────────────────────
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'path:deva',
    sourceUrl: `${WIKI}/3/33/Yahiko_Turned_Deva.png/revision/latest`,
    altText: 'Deva Path',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'path:asura',
    sourceUrl: `${WIKI}/c/c5/Asura_Path.png/revision/latest`,
    altText: 'Asura Path',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'path:human',
    sourceUrl: `${WIKI}/7/7e/Ningendo.png/revision/latest`,
    altText: 'Human Path',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'path:animal',
    sourceUrl: `${WIKI}/c/cd/Animal_Path.png/revision/latest`,
    altText: 'Animal Path',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'path:preta',
    sourceUrl: `${WIKI}/2/20/Preta_Path.png/revision/latest`,
    altText: 'Preta Path',
  },
  {
    characterId: 3180,
    slot: 'ABILITY',
    abilityName: 'path:naraka',
    sourceUrl: `${WIKI}/8/81/Naraka_Path.png/revision/latest`,
    altText: 'Naraka Path',
  },
  // ── Üyeler ────────────────────────────────────────────────────────────
  {
    characterId: 14,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/b/bb/Itachi.png/revision/latest`,
    altText: 'Itachi Uchiha',
  },
  {
    characterId: 2672,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/f/f7/Kisame_Hoshigaki_full.png/revision/latest`,
    altText: 'Kisame Hoshigaki',
  },
  {
    characterId: 1902,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/0/06/Deidara.png/revision/latest`,
    altText: 'Deidara',
  },
  {
    characterId: 1900,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/f/f7/Sasori.png/revision/latest`,
    altText: 'Sasori',
  },
  {
    characterId: 3178,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/5/57/Kakuzu.png/revision/latest`,
    altText: 'Kakuzu',
  },
  {
    characterId: 2792,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/e/e3/Hidan.png/revision/latest`,
    altText: 'Hidan',
  },
  {
    characterId: 3179,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/5/58/Konan_Infobox.png/revision/latest`,
    altText: 'Konan',
  },
  {
    characterId: 3149,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/7/72/Tobi.png/revision/latest`,
    altText: 'Tobi',
  },
  {
    characterId: 3149,
    slot: 'ABILITY',
    abilityName: 'akatsuki:obito',
    sourceUrl: `${WIKI}/4/4a/Obito_Uchiha.png/revision/latest`,
    altText: 'Obito Uchiha',
  },
  {
    characterId: 3150,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/b/b6/Black_and_White_Zetsu.png/revision/latest`,
    altText: 'Zetsu',
  },
  // ── İlişkiler bölümü ──────────────────────────────────────────────────
  {
    characterId: 53901,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/f/fd/Madara.png/revision/latest`,
    altText: 'Madara Uchiha',
  },
  {
    characterId: 23050,
    slot: 'PORTRAIT',
    sourceUrl: `${WIKI}/7/76/Yahiko.png/revision/latest`,
    altText: 'Yahiko',
  },
];

export interface AkatsukiSetupResult {
  characterId: number;
  slot: CharacterImageSlot;
  abilityName: string | null;
  status: 'created' | 'exists' | 'failed';
  /** Devir dersi: dış servise giden yolda hata sebebi çağırana taşınır */
  reason?: string;
  url?: string;
}

@Injectable()
export class AkatsukiSetupService {
  private readonly logger = new Logger(AkatsukiSetupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly remoteImages: RemoteImageService,
    private readonly uploads: UploadsService,
  ) {}

  async setupImages(userId: string): Promise<{
    created: number;
    exists: number;
    failed: number;
    results: AkatsukiSetupResult[];
  }> {
    const results: AkatsukiSetupResult[] = [];

    // Sırayla, bilinçli: 22 görseli aynı anda istemek kaynak CDN'e karşı
    // kabalık ve bellekte 22 buffer demek. Kurulum bir kez koşan bir iş.
    for (const row of MANIFEST) {
      const existing = await this.prisma.characterImage.findFirst({
        where: {
          characterId: row.characterId,
          slot: row.slot,
          abilityName: row.abilityName ?? null,
          isDeleted: false,
        },
        select: { id: true },
      });

      if (existing) {
        results.push({
          characterId: row.characterId,
          slot: row.slot,
          abilityName: row.abilityName ?? null,
          status: 'exists',
        });
        continue;
      }

      try {
        const image = await this.remoteImages.fetchImage(row.sourceUrl);
        const stored = await this.uploads.saveRemoteImage(image, userId);
        const last = await this.prisma.characterImage.findFirst({
          where: { characterId: row.characterId, isDeleted: false },
          orderBy: { orderIndex: 'desc' },
          select: { orderIndex: true },
        });
        await this.prisma.characterImage.create({
          data: {
            characterId: row.characterId,
            slot: row.slot,
            abilityName: row.abilityName ?? null,
            url: stored.url,
            altText: row.altText,
            orderIndex: (last?.orderIndex ?? -1) + 1,
            userId,
          },
        });
        results.push({
          characterId: row.characterId,
          slot: row.slot,
          abilityName: row.abilityName ?? null,
          status: 'created',
          url: stored.url,
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Akatsuki gorseli inmedi: ${row.characterId}/${row.slot}/${row.abilityName ?? '-'} — ${reason}`,
        );
        results.push({
          characterId: row.characterId,
          slot: row.slot,
          abilityName: row.abilityName ?? null,
          status: 'failed',
          reason,
        });
      }
    }

    return {
      created: results.filter((r) => r.status === 'created').length,
      exists: results.filter((r) => r.status === 'exists').length,
      failed: results.filter((r) => r.status === 'failed').length,
      results,
    };
  }
}
