import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { MusicActKind } from '../generated/prisma/enums';

/**
 * MusicBrainz erişimi — Spotify'ın vermediği alanları dolduran ikincil kaynak.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN GEREKLİ (11 Ağustos 2026 ölçümü)
 *
 * Bu uygulamanın gördüğü Spotify sanatçı nesnesi sadeleştirilmiş:
 *   gelen:    external_urls, href, id, images, name, type, uri
 *   gelmeyen: genres, popularity, followers
 * Yani tür taksonomisi, grup/solo ayrımı, kuruluş yılı ve köken Spotify'dan
 * HİÇ gelmiyor. Planın 6. bölümü MusicBrainz'i tam bu boşluk için ikincil
 * kaynak olarak önermişti; ölçüm o öneriyi zorunluluğa çevirdi.
 *
 * MusicBrainz'in verdikleri:
 *   genres      → oy sayılarıyla (topluluk küratörlüğü)
 *   type        → Person / Group / Orchestra / Choir → `MusicActKind`
 *   life-span   → kuruluş / dağılma yılı
 *   area        → köken ülkesi ve şehri
 *
 * Vermedikleri: `popularity` / `followers`. MusicBrainz bir popülerlik servisi
 * değil; o iki sütun kalıcı olarak boş kalacak ve HİÇBİR sıralama onlara
 * dayanmıyor (11 Ağustos'ta düzeltildi).
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── ÜÇ KURAL ──────────────────────────────────────────────────────────────
 *
 * 1. **SANİYEDE BİR İSTEK.** MusicBrainz'in yazılı kuralı bu ve aşan
 *    istemciler engelleniyor. İstekler bu serviste sıraya alınıyor
 *    (`gate`), yani paralel çağrı gelse bile arka arkaya en az
 *    `MIN_GAP_MS` boşlukla gidiyor. Bu yüzden zenginleştirme sanatçı ekleme
 *    yolunun İÇİNE konmadı — ayrı bir adım (bkz. `music-sync.service.ts`
 *    `enrichFromMusicBrainz`).
 *
 * 2. **TANITICI `User-Agent` ZORUNLU.** Kimliksiz istemciler bloke ediliyor.
 *    İletişim adresi içermesi de kuralın parçası.
 *
 * 3. **ANAHTAR GEREKMİYOR.** Ücretsiz ve açık; `.env`e bir şey eklenmiyor.
 */

const MB_API = 'https://musicbrainz.org/ws/2';

/**
 * İki istek arasındaki en az boşluk. Kural "saniyede bir"; 1100 ms pay
 * bırakıyor çünkü ağ gecikmesi ölçümü sunucu tarafında yapılıyor ve tam
 * 1000 ms sınıra dayanmak zaman zaman 503 getiriyor.
 */
const MIN_GAP_MS = 1_100;

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * MusicBrainz verisi Spotify'dan çok daha yavaş değişiyor (topluluk
 * düzenlemesi, ayda birkaç kez). 30 gün cache, saniyede bir istek sınırıyla
 * birlikte anlamlı: 50 sanatçılık bir arşivi tazelemek dakikalar sürüyor.
 */
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Ada göre arama ancak bu puanın üstünde kabul edilir.
 *
 * MusicBrainz her sonuca 0-100 arası bir eşleşme puanı veriyor. Eşik yüksek
 * tutuldu çünkü yanlış sanatçıyı bağlamanın bedeli sessiz ve büyük: yanlış
 * türler, yanlış kuruluş yılı, yanlış köken — hepsi doğru görünerek yerleşir.
 * Eşleşemeyen act zenginleşmemiş kalır, o kabul edilebilir.
 */
const MIN_SEARCH_SCORE = 90;

/**
 * Bir act'e en fazla kaç tür bağlanır.
 *
 * MusicBrainz türleri oy sayısıyla geliyor ve popüler bir grupta on beşi
 * aşabiliyor ("nu metal", "rap metal", "alternative metal", "rap rock"…).
 * Hepsini almak tür sözlüğünü varyantlarla dolduruyordu — Spotify'da
 * yaşanan sorunun aynısı. En çok oy alan altısı yeter; kalanını küratör
 * isterse elle ekler.
 */
const MAX_GENRES = 6;

export interface MusicBrainzArtist {
  mbid: string;
  name: string;
  /** `MusicActKind`e eşlenmiş hâli; eşlenemezse null (dokunulmaz) */
  actKind: MusicActKind | null;
  formedYear: number | null;
  disbandedYear: number | null;
  originCountry: string | null;
  originCity: string | null;
  /** Oy sayısına göre azalan, en çok `MAX_GENRES` tane */
  genres: string[];
}

/* ── MusicBrainz'in ham yanıt biçimleri (yalnızca okuduğumuz alanlar) ────── */

interface RawGenre {
  name?: string;
  count?: number;
}

interface RawArea {
  name?: string;
  'sort-name'?: string;
}

interface RawArtist {
  id?: string;
  name?: string;
  type?: string;
  'life-span'?: { begin?: string; end?: string };
  area?: RawArea;
  'begin-area'?: RawArea;
  genres?: RawGenre[];
  score?: number;
}

interface RawUrlLookup {
  relations?: Array<{ artist?: { id?: string; name?: string } }>;
}

interface RawArtistSearch {
  artists?: RawArtist[];
}

@Injectable()
export class MusicBrainzService {
  private readonly logger = new Logger(MusicBrainzService.name);

  /**
   * İstek sırası. Her istek öncekinin bitmesini VE aradan `MIN_GAP_MS`
   * geçmesini bekliyor. Basit bir promise zinciri; kuyruk kütüphanesi
   * getirmeye değmez çünkü tek tüketici var.
   */
  private gate: Promise<void> = Promise.resolve();
  private lastRequestAt = 0;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Spotify kimliğinden MusicBrainz kimliğini (MBID) bulur.
   *
   * ── İKİ YOL, SIRASI ÖNEMLİ ──────────────────────────────────────────────
   * 1. **Spotify adresinden** (`/url?resource=…&inc=artist-rels`).
   *    MusicBrainz dış bağlantıları ilişki olarak tutuyor, yani bu KESİN
   *    eşleşme — tahmin yok. Önce bu denenir.
   * 2. Ada göre arama, yalnızca `MIN_SEARCH_SCORE` üstündeki sonuç kabul
   *    edilerek. "Nirvana", "Genesis", "Yes" gibi adlarda yanlış sanatçıyı
   *    bağlamanın bedeli sessiz ve kalıcı olduğu için eşik yüksek.
   *
   * Bulunamazsa `null` — act zenginleşmemiş kalır, hata fırlatılmaz.
   */
  async findMbid(spotifyId: string, name: string): Promise<string | null> {
    const spotifyUrl = `https://open.spotify.com/artist/${spotifyId}`;
    const byUrl = await this.cached<RawUrlLookup>(
      `mb:url:${spotifyId}`,
      'url',
      { resource: spotifyUrl, inc: 'artist-rels' },
    ).catch(() => null);

    const linked = byUrl?.relations?.find((relation) => relation.artist?.id);
    if (linked?.artist?.id) {
      return linked.artist.id;
    }

    const term = name.trim();
    if (term.length < 2) {
      return null;
    }
    const search = await this.cached<RawArtistSearch>(
      `mb:search:${term.toLowerCase()}`,
      'artist',
      { query: `artist:"${term.replace(/"/g, '')}"` },
    ).catch(() => null);

    const best = search?.artists?.[0];
    if (!best?.id || (best.score ?? 0) < MIN_SEARCH_SCORE) {
      if (best) {
        this.logger.log(
          `MusicBrainz eşleşmesi zayıf, atlandı: "${term}" → "${best.name}" (puan ${best.score ?? 0})`,
        );
      }
      return null;
    }
    return best.id;
  }

  /** MBID'den künye ve türler. */
  async getArtist(mbid: string): Promise<MusicBrainzArtist | null> {
    const raw = await this.cached<RawArtist>(
      `mb:artist:${mbid}`,
      `artist/${mbid}`,
      {
        // `genres` türleri oy sayısıyla veriyor; `tags` serbest etiketler ve
        // gürültülü olduğu için İSTENMİYOR
        inc: 'genres',
      },
    ).catch(() => null);

    if (!raw?.id) {
      return null;
    }
    return {
      mbid: raw.id,
      name: raw.name ?? '',
      actKind: mapActKind(raw.type),
      formedYear: parseYear(raw['life-span']?.begin),
      disbandedYear: parseYear(raw['life-span']?.end),
      originCountry: raw.area?.name ?? null,
      // `begin-area` "nereden çıktı" demek; `area` daha genel (ülke)
      originCity: raw['begin-area']?.name ?? null,
      genres: (raw.genres ?? [])
        .filter((genre): genre is RawGenre => Boolean(genre?.name))
        .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        .slice(0, MAX_GENRES)
        .map((genre) => (genre.name ?? '').trim())
        .filter(Boolean),
    };
  }

  /* ── Alt katman ──────────────────────────────────────────────────────── */

  private async cached<T>(
    cacheKey: string,
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      return cached.payload as unknown as T;
    }

    try {
      const payload = await this.request<T>(path, params);
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: { cacheKey, payload: payload as never, fetchedAt: new Date() },
        update: { payload: payload as never, fetchedAt: new Date() },
      });
      return payload;
    } catch (error) {
      // Kural 4: dış kaynak düşerse bayat veri sunulur
      if (cached) {
        this.logger.warn(
          `MusicBrainz düştü, bayat kayıt sunuluyor (${cacheKey}): ${String(error)}`,
        );
        return cached.payload as unknown as T;
      }
      throw error;
    }
  }

  private async request<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    await this.waitForTurn();

    const query = Object.entries({ ...params, fmt: 'json' })
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
    const url = `${MB_API}/${path}?${query}`;

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          /**
           * ⚠️ ZORUNLU. MusicBrainz kimliksiz istemcileri engelliyor ve
           * iletişim adresi içermesini istiyor. Kaldırılırsa istekler 403
           * döner — ve bu sessiz bir arıza olur.
           */
          'user-agent': 'KuroNexus/1.0 ( https://kuronexus.com )',
          accept: 'application/json',
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.warn(
        `MusicBrainz isteği başarısız: ${url} — ${String(error)}`,
      );
      throw new ServiceUnavailableException('MUSIC.MUSICBRAINZ_UNAVAILABLE');
    }

    if (response.status === 503) {
      // MusicBrainz hız sınırını 503 ile bildiriyor
      this.logger.warn(`MusicBrainz hız sınırı: ${url}`);
      throw new ServiceUnavailableException('MUSIC.MUSICBRAINZ_RATE_LIMITED');
    }
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.warn(
        `MusicBrainz ${response.status} döndü: ${url}` +
          (body ? ` — gövde: ${body.slice(0, 200)}` : ''),
      );
      throw new ServiceUnavailableException('MUSIC.MUSICBRAINZ_UNAVAILABLE');
    }

    return (await response.json()) as T;
  }

  /**
   * Sıraya girer ve önceki istekten en az `MIN_GAP_MS` geçmesini bekler.
   *
   * `gate` zinciri paralel çağrıları da sıraya diziyor: iki act aynı anda
   * zenginleştirilse bile istekler arka arkaya gidiyor.
   */
  private waitForTurn(): Promise<void> {
    const turn = this.gate.then(async () => {
      const wait = this.lastRequestAt + MIN_GAP_MS - Date.now();
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
      this.lastRequestAt = Date.now();
    });
    // Zincir kopmasın: bir istek patlasa da sıradaki beklemeye devam etsin
    this.gate = turn.catch(() => undefined);
    return turn;
  }
}

/**
 * MusicBrainz `type` → `MusicActKind`.
 *
 * Eşlenemeyen tür için `null` dönüyor ve çağıran act'e DOKUNMUYOR — yanlış
 * sınıflandırmak, sınıflandırmamaktan kötü. "Character" ve "Other" bilinçli
 * olarak eşlenmiyor; "Duo" MusicBrainz'de bir tür değil (küratör işaretler).
 */
function mapActKind(type: string | undefined): MusicActKind | null {
  switch (type) {
    case 'Group':
      return 'BAND';
    case 'Person':
      return 'SOLO_PROJECT';
    case 'Orchestra':
      return 'ORCHESTRA';
    case 'Choir':
      return 'GROUP';
    default:
      return null;
  }
}

/** "1996-05-12" / "1996" → 1996. Geçersizse null. */
function parseYear(value: string | undefined): number | null {
  if (!value) {
    return null;
  }
  const year = Number.parseInt(value.slice(0, 4), 10);
  return Number.isFinite(year) && year > 1850 && year < 2200 ? year : null;
}
