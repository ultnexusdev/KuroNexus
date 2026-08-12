import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import type { MusicActKind } from '../generated/prisma/enums';

/**
 * Küratör düzenlemeleri — Spotify'ın vermediği her şey.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN AYRI BİR SERVİS
 *
 * `MusicSyncService`in başında yazılı bir söz var: "MusicGenre'a yalnızca
 * `isApproved: false` ile OLUŞTURUR" ve "MusicEra/MusicRole'e hiç yazmaz".
 * Küratör tarafı bunun tam tersini yapıyor — tür onaylıyor, act künyesini
 * elle dolduruyor. İkisini aynı sınıfa koymak o sözü anlamsızlaştırırdı;
 * ayrı sınıf, sözü şemada olduğu gibi kodda da tutuyor.
 *
 * ── NEDEN BU SERVİS ZORUNLU HÂLE GELDİ (11 Ağustos 2026 ölçümü) ───────────
 * Bu uygulamanın gördüğü Spotify sanatçı nesnesi **sadeleştirilmiş**:
 *   gelen:    external_urls, href, id, images, name, type, uri
 *   gelmeyen: genres, popularity, followers
 * Yani tür taksonomisi Spotify'dan HİÇ gelmiyor ve `actKind` da gelmiyor.
 * Planın 6. bölümü bunu öngörmüş ("taksonomi kendi küratörlüğüne dayansın")
 * ama küratörün tür OLUŞTURMASI ve act'e ATAMASI için uç yoktu — vardı
 * sanılıyordu çünkü Spotify'dan tür geleceği varsayılmıştı. Bu servis o
 * boşluğu kapatıyor.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** `globals.css` içinde `[data-genre="…"]` bloğu olan anahtarlar. */
const KNOWN_ACCENT_KEYS = ['rock', 'pop', 'rnb', 'electronic'];

const ACT_KINDS: MusicActKind[] = [
  'UNCLASSIFIED',
  'BAND',
  'SOLO_PROJECT',
  'DUO',
  'GROUP',
  'ORCHESTRA',
];

@Injectable()
export class MusicCuratorService {
  constructor(private readonly prisma: PrismaService) {}

  /* ── Türler ──────────────────────────────────────────────────────────── */

  /** Bütün türler — küratör panelinin tür kutusu bunu okuyor. */
  async listGenres() {
    return this.prisma.musicGenre.findMany({
      orderBy: [{ isApproved: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        isApproved: true,
        parentId: true,
        _count: { select: { acts: true } },
      },
    });
  }

  /**
   * Onay bekleyen türler.
   *
   * ⚠️ Bu liste artık genelde BOŞ olacak: Spotify tür vermiyor (yukarıdaki
   * ölçüm), yani onay bekleyecek bir şey oluşmuyor. Uç yine duruyor —
   * ileride MusicBrainz/Discogs eklenirse oradan gelen türler bu kapıdan
   * geçecek.
   */
  async pendingGenres() {
    return this.prisma.musicGenre.findMany({
      where: { isApproved: false },
      orderBy: [{ acts: { _count: 'desc' } }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        _count: { select: { acts: true } },
      },
    });
  }

  /**
   * Küratörün eliyle tür oluşturur — **onaylı olarak.**
   *
   * `isApproved: true` varsayılanı bilinçli: onay kapısı *dış kaynaktan*
   * gelen türler için var (sözlüğü varyantlarla doldurmasınlar diye).
   * Küratörün kendi yazdığı türü ayrıca onaylatmak anlamsız bir tur olurdu.
   */
  async createGenre(input: {
    name: string;
    slug?: string;
    key?: string;
    accentKey?: string;
    parentId?: string;
  }) {
    const name = input.name.trim();
    if (name.length === 0) {
      throw new BadRequestException('MUSIC.GENRE_NAME_REQUIRED');
    }
    const slug = slugify(input.slug?.trim() || name);
    if (!slug) {
      throw new BadRequestException('MUSIC.GENRE_SLUG_INVALID');
    }
    this.assertAccentKey(input.accentKey);
    this.assertTokenKey(input.key, 'MUSIC.GENRE_KEY_INVALID');

    const existing = await this.prisma.musicGenre.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      throw new BadRequestException('MUSIC.GENRE_SLUG_TAKEN');
    }
    if (input.parentId) {
      await this.assertGenreExists(input.parentId);
    }

    return this.prisma.musicGenre.create({
      data: {
        name,
        slug,
        key: input.key || null,
        accentKey: input.accentKey || null,
        parentId: input.parentId || null,
        isApproved: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        isApproved: true,
        parentId: true,
      },
    });
  }

  /**
   * Türü onaylar / adını, i18n anahtarını, oda rengini, üst türünü ayarlar.
   *
   * ⚠️ `accentKey` bir **token anahtarı**, renk değeri DEĞİL. Hex girilirse
   * reddedilir: veritabanına renk yazmak kural 16'yı veritabanı üzerinden
   * delmek ve tema değiştiğinde oda rengini sabit bırakmak olurdu.
   */
  async updateGenre(
    id: string,
    dto: {
      /** Panel formu dize gönderiyor, JSON gövde boolean — ikisi de kabul */
      isApproved?: boolean | 'true' | 'false';
      accentKey?: string;
      key?: string;
      name?: string;
      parentId?: string;
    },
  ) {
    await this.assertGenreExists(id);
    this.assertAccentKey(dto.accentKey);
    this.assertTokenKey(dto.key, 'MUSIC.GENRE_KEY_INVALID');
    if (dto.parentId === id) {
      throw new BadRequestException('MUSIC.GENRE_PARENT_SELF');
    }
    if (dto.parentId) {
      await this.assertGenreExists(dto.parentId);
    }

    return this.prisma.musicGenre.update({
      where: { id },
      data: {
        ...(dto.isApproved !== undefined
          ? { isApproved: dto.isApproved === true || dto.isApproved === 'true' }
          : {}),
        ...(dto.accentKey !== undefined
          ? { accentKey: dto.accentKey || null }
          : {}),
        ...(dto.key !== undefined ? { key: dto.key || null } : {}),
        ...(dto.name ? { name: dto.name.trim() } : {}),
        ...(dto.parentId !== undefined
          ? { parentId: dto.parentId || null }
          : {}),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        isApproved: true,
        parentId: true,
      },
    });
  }

  /* ── Act künyesi ─────────────────────────────────────────────────────── */

  /**
   * Act'in türlerini **tümüyle değiştirir** (gönderilen liste son hâl).
   *
   * Ekle/çıkar yerine "son hâli gönder" seçildi: küratör arayüzünde tür
   * seçimi bir çoklu kutu, yani kullanıcının kafasındaki model zaten "şu
   * anda seçili olanlar". İki ayrı uç (ekle/çıkar) aynı işi iki isteğe
   * bölerdi ve arada tutarsız bir an bırakırdı.
   */
  async setActGenres(actId: string, genreIds: string[]) {
    const act = await this.prisma.musicalAct.findFirst({
      where: { id: actId, isDeleted: false },
      select: { id: true },
    });
    if (!act) {
      throw new NotFoundException('MUSIC.ACT_NOT_FOUND');
    }

    const unique = [...new Set(genreIds)];
    if (unique.length > 0) {
      const found = await this.prisma.musicGenre.count({
        where: { id: { in: unique } },
      });
      if (found !== unique.length) {
        throw new BadRequestException('MUSIC.GENRE_NOT_FOUND');
      }
    }

    // Tek işlemde: eskiyi sil, yeniyi kur. Arada act'in türsüz göründüğü bir
    // an kalmasın.
    await this.prisma.$transaction([
      this.prisma.musicGenreOnAct.deleteMany({ where: { actId } }),
      ...(unique.length > 0
        ? [
            this.prisma.musicGenreOnAct.createMany({
              data: unique.map((genreId) => ({ actId, genreId })),
            }),
          ]
        : []),
    ]);

    return this.prisma.musicalAct.findUniqueOrThrow({
      where: { id: actId },
      select: {
        id: true,
        slug: true,
        name: true,
        genres: {
          select: {
            genre: { select: { id: true, slug: true, name: true } },
          },
        },
      },
    });
  }

  /**
   * Act künyesinin **küratör alanları**.
   *
   * ⚠️ Sync'in yazdığı alanlar (`name`, `image`, `spotifyId`, `externalData`)
   * BURADAN düzenlenmiyor: bir sonraki tazelemede üzerine yazılır ve küratör
   * "değişikliğim kayboldu" derdi. Burada yalnızca sync'in ASLA dokunmadığı
   * alanlar var (bkz. `music-sync.service.ts` upsert'inin `update` bloğu).
   *
   * `bannerImage` küratör yüklemesi: Spotify sanatçı görselini 640×640 kare
   * veriyor, tasarımın (2c) istediği 2000×640 bant değil.
   */
  async updateAct(
    id: string,
    dto: {
      actKind?: string;
      sortName?: string;
      bio?: string;
      formedYear?: number;
      disbandedYear?: number;
      originCity?: string;
      originCountry?: string;
      bannerImage?: string;
      bannerPosition?: string;
    },
  ) {
    const act = await this.prisma.musicalAct.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!act) {
      throw new NotFoundException('MUSIC.ACT_NOT_FOUND');
    }

    if (dto.actKind !== undefined) {
      if (!ACT_KINDS.includes(dto.actKind as MusicActKind)) {
        throw new BadRequestException('MUSIC.ACT_KIND_INVALID');
      }
    }
    if (
      dto.formedYear !== undefined &&
      dto.disbandedYear !== undefined &&
      dto.disbandedYear < dto.formedYear
    ) {
      throw new BadRequestException('MUSIC.ACT_YEARS_REVERSED');
    }
    /**
     * Banner yalnızca KENDİ sunucumuzdaki bir yol olabilir. Dış adres kabul
     * edilirse CSP `img-src` onu engelleyeceği için görsel sessizce
     * çizilmezdi; üstelik dış adres bir gün ölür. Küratör görseli
     * `/admin/uploads` ya da `/admin/uploads/from-url` ile yükler, buraya
     * dönen yolu verir.
     */
    if (
      dto.bannerImage !== undefined &&
      dto.bannerImage !== '' &&
      !dto.bannerImage.startsWith('/uploads/')
    ) {
      throw new BadRequestException('MUSIC.BANNER_MUST_BE_LOCAL');
    }
    /**
     * Bant odak noktası. **Yalnızca "<sayı>% <sayı>%" kabul ediliyor.**
     *
     * ⚠️ Bu değer ön yüzde satır içi stile yazılıyor. Serbest bırakılsaydı
     * `background-position` alanına başka bir CSS parçası enjekte edilebilirdi
     * (`url(...)`, `;` ile yeni bildirim…). Kalıp dar tutuldu: iki yüzde, tek
     * boşluk, başka hiçbir şey.
     */
    if (dto.bannerPosition !== undefined && dto.bannerPosition !== '') {
      if (!/^\d{1,3}% \d{1,3}%$/.test(dto.bannerPosition)) {
        throw new BadRequestException('MUSIC.BANNER_POSITION_INVALID');
      }
    }

    return this.prisma.musicalAct.update({
      where: { id },
      data: {
        ...(dto.actKind !== undefined
          ? { actKind: dto.actKind as MusicActKind }
          : {}),
        ...(dto.sortName !== undefined
          ? { sortName: dto.sortName.trim() || null }
          : {}),
        ...(dto.bio !== undefined ? { bio: dto.bio.trim() || null } : {}),
        ...(dto.formedYear !== undefined ? { formedYear: dto.formedYear } : {}),
        ...(dto.disbandedYear !== undefined
          ? { disbandedYear: dto.disbandedYear }
          : {}),
        ...(dto.originCity !== undefined
          ? { originCity: dto.originCity.trim() || null }
          : {}),
        ...(dto.originCountry !== undefined
          ? { originCountry: dto.originCountry.trim() || null }
          : {}),
        ...(dto.bannerImage !== undefined
          ? {
              bannerImage: dto.bannerImage || null,
              bannerFetchedAt: dto.bannerImage ? new Date() : null,
            }
          : {}),
        ...(dto.bannerPosition !== undefined
          ? { bannerPosition: dto.bannerPosition || null }
          : {}),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        actKind: true,
        sortName: true,
        bio: true,
        formedYear: true,
        disbandedYear: true,
        originCity: true,
        originCountry: true,
        bannerImage: true,
        bannerPosition: true,
      },
    });
  }

  /* ── Doğrulayıcılar ──────────────────────────────────────────────────── */

  private async assertGenreExists(id: string): Promise<void> {
    const genre = await this.prisma.musicGenre.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!genre) {
      throw new NotFoundException('MUSIC.GENRE_NOT_FOUND');
    }
  }

  /**
   * Oda rengi anahtarı. Bilinen listeye karşı doğrulanıyor — serbest bir dize
   * kabul edilse `globals.css`te karşılığı olmayan bir anahtar yazılabilir ve
   * oda sessizce salonun varsayılan accent'iyle çizilirdi. Yeni bir oda rengi
   * eklemek = `globals.css`e blok + bu listeye bir satır.
   */
  private assertAccentKey(value: string | undefined): void {
    if (value === undefined || value === '') {
      return;
    }
    if (!KNOWN_ACCENT_KEYS.includes(value)) {
      throw new BadRequestException('MUSIC.ACCENT_KEY_UNKNOWN');
    }
  }

  /** i18n anahtarı biçimi: küçük harf, rakam, tire, alt çizgi. Hex geçmez. */
  private assertTokenKey(value: string | undefined, error: string): void {
    if (value === undefined || value === '') {
      return;
    }
    if (!/^[a-z0-9][a-z0-9_-]{0,38}$/.test(value)) {
      throw new BadRequestException(error);
    }
  }
}
