import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetCuratedImageDto } from './dto/curated-image.dto';

/**
 * Yüzeyin bir yuvası — ön yüze dönen biçim.
 *
 * Veritabanı satırıyla birebir DEĞİL: `id`, `surface`, zaman damgaları ve
 * `isDeleted` dışarı çıkmıyor. Çizim tarafının onlara ihtiyacı yok ve her
 * fazla alan, ileride şema değişince kırılacak bir bağ demek.
 */
export interface CuratedImageRow {
  slotId: string;
  url: string | null;
  position: string | null;
  scale: number | null;
  ratio: string | null;
  altTr: string | null;
  altEn: string | null;
  credit: string | null;
  treatment: string | null;
  opacity: number | null;
  blend: string | null;
  isHidden: boolean;
}

/**
 * Küratör görsel yuvaları — servis.
 *
 * ── OKUMA TEK SORGU ──────────────────────────────────────────────────────
 * Sayfa açılışında yüzeyin BÜTÜN yuvaları tek istekte iniyor
 * (`@@index([surface, isDeleted])` tam bu sorgu için). Bleach sayfasında
 * 60'tan fazla yuva var; yuva başına istek 60 tur demekti ve futbol hub'ında
 * aynı hata bir kez yapılıp düzeltilmişti (`fetchAllPlayerImages` gerekçesi).
 *
 * ── KISMİ GÜNCELLEME: `undefined` ≠ `null` ───────────────────────────────
 * Küratör paneli sekme sekme çalışıyor; odak sekmesi kaydettiğinde alt metni
 * göndermiyor. Yani:
 *
 *   alan gönderilmedi (`undefined`)  → DEĞİŞMEDEN kalır
 *   alan boş dize / `null`           → TEMİZLENİR (sütuna null yazılır)
 *
 * Bu ayrım olmasaydı her kaydetme, gönderilmeyen alanları sessizce silerdi:
 * küratör odağı düzeltir, alt metni kaybederdi. `patch()` yardımcısı ayrımı
 * tek yerde tutuyor.
 */
@Injectable()
export class CuratedImagesService {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly SELECT = {
    slotId: true,
    url: true,
    position: true,
    scale: true,
    ratio: true,
    altTr: true,
    altEn: true,
    credit: true,
    treatment: true,
    opacity: true,
    blend: true,
    isHidden: true,
  } as const;

  /**
   * Bir yüzeyin bütün yuvaları: `{ "bleach:hero": { … } }`.
   *
   * Kayıt yoksa boş nesne döner — hata değil. Yeni bir sayfa ilk günü
   * kayıtsız açılır ve bu normal durumdur (yuvalar tasarlanmış yedekleriyle
   * çizilir, "boş oda yasağı").
   */
  async bySurface(surface: string): Promise<Record<string, CuratedImageRow>> {
    const rows = await this.prisma.curatedImage.findMany({
      where: { surface, isDeleted: false },
      select: CuratedImagesService.SELECT,
    });

    const map: Record<string, CuratedImageRow> = {};
    for (const row of rows) {
      map[row.slotId] = row;
    }
    return map;
  }

  /**
   * Yuvayı yaz.
   *
   * `reset: true` → satır soft-delete edilir (kural 3), yuva sıfırdan başlar.
   * Aksi hâlde upsert: kayıt yoksa oluşur, varsa YALNIZCA gönderilen alanlar
   * güncellenir ve `isDeleted` diriltilir (aynı yuvaya yeniden yükleme,
   * `FavouritePlayerImage` deseni).
   */
  async set(dto: SetCuratedImageDto): Promise<CuratedImageRow> {
    const surface = dto.surface.trim();
    const slotId = dto.slotId.trim();

    if (dto.reset) {
      const existing = await this.prisma.curatedImage.findUnique({
        where: { surface_slotId: { surface, slotId } },
        select: { id: true },
      });
      if (existing) {
        /*
         * ⚠️ ALANLAR DA TEMİZLENİYOR, yalnızca `isDeleted` işaretlenmiyor.
         *
         * Ölçülmüş arıza (23 Ağustos 2026): önce sadece `isDeleted: true`
         * yazılıyordu. Upsert aynı yuvaya yeni bir kare bağlandığında satırı
         * DİRİLTİYOR ve gönderilmeyen alanlar olduğu gibi kalıyor — yani
         * "geçici gizle" açıkken sıfırlanmış bir yuva, yeni görsel
         * yüklendiğinde GİZLİ olarak geri geliyordu. Küratör kareyi yüklüyor,
         * sayfada hiçbir şey görünmüyor ve sebebi hiçbir yerde yazmıyor.
         *
         * Satır yine duruyor (kural 3: fiziksel silme yok); duran şey artık
         * yalnızca kabuk.
         */
        await this.prisma.curatedImage.update({
          where: { id: existing.id },
          data: { ...CuratedImagesService.blank(), isDeleted: true },
        });
      }
      return CuratedImagesService.empty(slotId);
    }

    const data = CuratedImagesService.patch(dto);

    return this.prisma.curatedImage.upsert({
      where: { surface_slotId: { surface, slotId } },
      create: { surface, slotId, ...data },
      update: { ...data, isDeleted: false },
      select: CuratedImagesService.SELECT,
    });
  }

  /**
   * DTO → Prisma verisi.
   *
   * Gönderilmeyen alan çıktıya HİÇ girmiyor (Prisma onu "dokunma" olarak
   * okur). Boş dize `null`a çevriliyor: "temizle" niyetinin veritabanındaki
   * karşılığı boş metin değil, yokluk — aksi hâlde `position: ""` gibi bir
   * değer CSS'e basılır ve sessizce hiçbir şey yapmaz.
   */
  private static patch(dto: SetCuratedImageDto) {
    const text = (value: string | undefined) => {
      if (value === undefined) return undefined;
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    };

    return {
      ...(dto.url !== undefined ? { url: text(dto.url) } : {}),
      ...(dto.position !== undefined ? { position: text(dto.position) } : {}),
      ...(dto.scale !== undefined ? { scale: dto.scale } : {}),
      ...(dto.ratio !== undefined ? { ratio: text(dto.ratio) } : {}),
      ...(dto.altTr !== undefined ? { altTr: text(dto.altTr) } : {}),
      ...(dto.altEn !== undefined ? { altEn: text(dto.altEn) } : {}),
      ...(dto.credit !== undefined ? { credit: text(dto.credit) } : {}),
      ...(dto.treatment !== undefined
        ? { treatment: text(dto.treatment) }
        : {}),
      ...(dto.opacity !== undefined ? { opacity: dto.opacity } : {}),
      ...(dto.blend !== undefined ? { blend: text(dto.blend) } : {}),
      ...(dto.isHidden !== undefined ? { isHidden: dto.isHidden } : {}),
    };
  }

  /** Sıfırlanmış satırın veritabanı hâli — `reset` bunu yazıyor */
  private static blank() {
    return {
      url: null,
      position: null,
      scale: null,
      ratio: null,
      altTr: null,
      altEn: null,
      credit: null,
      treatment: null,
      opacity: null,
      blend: null,
      isHidden: false,
    };
  }

  /** Sıfırlanmış yuvanın ön yüze dönen hâli */
  private static empty(slotId: string): CuratedImageRow {
    return {
      slotId,
      url: null,
      position: null,
      scale: null,
      ratio: null,
      altTr: null,
      altEn: null,
      credit: null,
      treatment: null,
      opacity: null,
      blend: null,
      isHidden: false,
    };
  }
}
