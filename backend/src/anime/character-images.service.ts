import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CharacterImageSlot } from '../generated/prisma/client';

/**
 * Karakter sayfasındaki elle yüklenen görseller.
 *
 * Karakterlerin YAZILI içeriği kodda duruyor (`frontend/lib/characters/`),
 * görseller ise burada. Ayrım bilinçli: yazılı bölümler her karaktere özel
 * tasarlanıyor ve esnek tipleri bir forma sığdırmak tasarımı kısıtlardı;
 * görsellerde ise böyle bir sorun yok ve kürator yüklediğini **anında**
 * sayfada görmek istiyor.
 */

export interface CharacterImageRecord {
  id: string;
  slot: CharacterImageSlot;
  abilityName: string | null;
  url: string;
  altText: string | null;
  caption: string | null;
  orderIndex: number;
}

/** Çoklu okuma satırı: hangi karaktere ait olduğu da taşınıyor. */
export interface CharacterImageRow extends CharacterImageRecord {
  characterId: number;
}

@Injectable()
export class CharacterImagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Bir karakterin görselleri.
   *
   * Sıralama `orderIndex` sonra `createdAt`: sıra verilmemişse yükleme sırası
   * korunur, yani kürator hiçbir şey ayarlamadan da beklediği düzeni görür.
   */
  async listFor(characterId: number): Promise<CharacterImageRecord[]> {
    const rows = await this.prisma.characterImage.findMany({
      where: { characterId, isDeleted: false },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        slot: true,
        abilityName: true,
        url: true,
        altText: true,
        caption: true,
        orderIndex: true,
      },
    });
    return rows;
  }

  /**
   * Birden çok karakterin görselleri TEK istekte — Akatsuki sergisi gibi
   * çok karakterli sayfalar için. Karakter başına ayrı istek, 12 karakterlik
   * bir sergide 12 tur demekti (kards ucundaki gerekçenin aynısı).
   */
  async listForMany(characterIds: number[]): Promise<CharacterImageRow[]> {
    if (characterIds.length === 0) {
      return [];
    }
    return this.prisma.characterImage.findMany({
      where: { characterId: { in: characterIds }, isDeleted: false },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        characterId: true,
        slot: true,
        abilityName: true,
        url: true,
        altText: true,
        caption: true,
        orderIndex: true,
      },
    });
  }

  /**
   * Karakter → küratörün yüklediği PORTRE adresi.
   *
   * Karakter dizini bu haritayla zenginleşiyor: AniList'in verdiği ~230 px
   * kart, elle yüklenmiş bir portre varsa onunla değişiyor. Tek sorgu —
   * `listForMany`i çağırıp PORTRAIT'leri ayıklamak, dizindeki 130 karakter
   * için bütün yetenek ve galeri karelerini de taşımak demekti.
   *
   * "SONUNCUSU KAZANIR" — dosya sayfasındaki kuralın aynısı
   * (`CharacterDossier`: `.filter(PORTRAIT).at(-1)`). Sıralama artan
   * olduğu için döngü ilerledikçe üzerine yazıyor ve haritada en son
   * yüklenen kalıyor. İki yer aynı portreyi göstermeli: dizinde eski,
   * sayfada yeni portre görmek küratöre "yükleme tutmadı" hissi verirdi.
   *
   * `characterIds` verilmezse bütün portreler geliyor: dizin zaten
   * tamamını istiyor ve `in` listesi 130 elemana çıkardı.
   */
  async portraitMap(characterIds?: number[]): Promise<Map<number, string>> {
    if (characterIds && characterIds.length === 0) {
      return new Map();
    }
    const rows = await this.prisma.characterImage.findMany({
      where: {
        slot: 'PORTRAIT',
        isDeleted: false,
        ...(characterIds ? { characterId: { in: characterIds } } : {}),
      },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      select: { characterId: true, url: true },
    });
    const map = new Map<number, string>();
    for (const row of rows) {
      map.set(row.characterId, row.url);
    }
    return map;
  }

  async create(
    data: {
      characterId: number;
      slot: CharacterImageSlot;
      abilityName?: string | null;
      url: string;
      altText?: string | null;
      caption?: string | null;
    },
    userId: string,
  ): Promise<CharacterImageRecord> {
    /*
     * Yeni kayıt listenin SONUNA giriyor: mevcut en büyük sıra + 1.
     * `count` kullanılmadı — silinen kayıtlar sayımdan düşer ve iki görsel
     * aynı sırayı alırdı.
     */
    const last = await this.prisma.characterImage.findFirst({
      where: { characterId: data.characterId, isDeleted: false },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    return this.prisma.characterImage.create({
      data: {
        characterId: data.characterId,
        slot: data.slot,
        abilityName: data.abilityName ?? null,
        url: data.url,
        altText: data.altText ?? null,
        caption: data.caption ?? null,
        orderIndex: (last?.orderIndex ?? -1) + 1,
        userId,
      },
      select: {
        id: true,
        slot: true,
        abilityName: true,
        url: true,
        altText: true,
        caption: true,
        orderIndex: true,
      },
    });
  }

  /**
   * Yumuşak silme (AGENTS.md kural 3).
   *
   * Diskteki dosyaya dokunulmuyor: aynı dosya başka bir yuvada da kullanılıyor
   * olabilir ve `MediaAsset` kaydı ayrı bir sahiplik taşıyor.
   */
  async remove(id: string): Promise<{ id: string }> {
    const existing = await this.prisma.characterImage.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('CHARACTER_IMAGES.NOT_FOUND');
    }
    await this.prisma.characterImage.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { id };
  }
}
