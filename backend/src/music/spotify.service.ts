import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Spotify Web API erişimi — **Client Credentials** akışı.
 *
 * Kullanıcı girişi gerekmiyor: katalog verisi (arama, sanatçı, albüm, parça,
 * herkese açık çalma listesi) uygulama anahtarıyla okunuyor. Kişisel uçlar
 * (`/me/...`) Faz 5'e ait ve ayrı bir akış (Authorization Code) istiyor.
 *
 * Anahtarlar yalnızca backend `.env`'de durur (kural 4). `NEXT_PUBLIC_`
 * önekiyle tanımlanmaları YASAK — o önek değeri tarayıcı paketine gömer.
 *
 * ── KAPALI UÇLAR — ÇAĞIRILMAYACAK ─────────────────────────────────────────
 * Spotify Kasım 2024'te şunları yeni uygulamalara kapattı:
 *   /artists/{id}/related-artists   → "ilişkili sanatçı" (NexusEdge küratör
 *                                      eliyle kurulacak, kayıp değil)
 *   /recommendations
 *   /audio-features, /audio-analysis → BPM/key/mood; hiç ihtiyaç yoktu
 *   track.preview_url                → 30 sn önizleme; ses yalnızca gömülü
 *                                      player'dan gelecek
 * Ayrıca Spotify'ın KENDİ editoryal/algoritmik listeleri (Discover Weekly,
 * Today's Top Hits) de kapalı — yalnızca kullanıcının kendi listeleri okunur.
 *
 * ── HER YANIT CACHE'LENİR (kural 4/14) ────────────────────────────────────
 * Sayfalar bu servisi HİÇ çağırmaz; onlar veritabanındaki senkronize kopyadan
 * servis edilir (`music.service.ts`). Bu servis yalnızca senkronizasyon ve
 * admin arama yolundan çağrılır. `ExternalCache` yine de var: aynı albümü
 * arka arkaya iki kez tazelemek dış istek harcamasın.
 */

const SPOTIFY_API = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const REQUEST_TIMEOUT_MS = 10_000;

/** Kural 14: varsayılan 7 gün. Katalog künyesi neredeyse hiç değişmiyor. */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Arama sonucu hızlı eskiyor ve küratör yeni çıkanı arıyor olabilir. */
const SEARCH_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Jeton süresi dolmadan kaç ms önce yenilenir. Spotify jetonu 3600 sn
 * veriyor; sınıra dayanmak, uzun süren bir sync turunun ortasında 401
 * yemek demek.
 */
const TOKEN_SAFETY_MARGIN_MS = 60_000;

/** Liste uçlarında tek sayfa boyu. Spotify'ın izin verdiği üst sınır. */
const PAGE_SIZE_ALBUMS = 50;
const PAGE_SIZE_TRACKS = 50;
const PAGE_SIZE_PLAYLIST_TRACKS = 100;

/**
 * Sayfalanmış uçlarda en fazla kaç sayfa çekilir.
 *
 * Sınır bilinçli: kötü niyetli ya da hatalı bir kimlik yüzünden binlerce
 * istek atan bir döngü, hem Spotify kotasını hem sync turunu yakar. 40 sayfa
 * albüm = 2000 albüm, hiçbir sanatçı bu kadarını taşımıyor.
 */
const MAX_PAGES = 40;

export interface SpotifyImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface SpotifyArtist {
  spotifyId: string;
  name: string;
  genres: string[];
  popularity: number | null;
  followers: number | null;
  images: SpotifyImage[];
  externalUrl: string | null;
}

export interface SpotifyAlbumSummary {
  spotifyId: string;
  title: string;
  albumType: string;
  releaseDate: string | null;
  releaseDatePrecision: string | null;
  totalTracks: number | null;
  images: SpotifyImage[];
  externalUrl: string | null;
  /** Albümün künyedeki sanatçıları — derlemelerde act'ten farklı olabilir */
  artists: Array<{ spotifyId: string; name: string }>;
}

export interface SpotifyAlbum extends SpotifyAlbumSummary {
  label: string | null;
  popularity: number | null;
}

export interface SpotifyTrack {
  spotifyId: string;
  title: string;
  discNumber: number;
  trackNumber: number;
  durationMs: number | null;
  isExplicit: boolean;
  externalUrl: string | null;
  artists: Array<{ spotifyId: string; name: string }>;
}

export interface SpotifyPlaylist {
  spotifyId: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  totalTracks: number | null;
  externalUrl: string | null;
  owner: string | null;
}

export interface SpotifyPlaylistTrack {
  track: SpotifyTrack;
  albumSpotifyId: string | null;
  addedAt: string | null;
}

/* ── Spotify'ın ham yanıt biçimleri (yalnızca okuduğumuz alanlar) ───────── */

interface RawImage {
  url?: string;
  width?: number | null;
  height?: number | null;
}

interface RawArtistRef {
  id?: string;
  name?: string;
}

interface RawArtist extends RawArtistRef {
  genres?: string[];
  popularity?: number;
  followers?: { total?: number };
  images?: RawImage[];
  external_urls?: { spotify?: string };
}

interface RawAlbum {
  id?: string;
  name?: string;
  album_type?: string;
  album_group?: string;
  release_date?: string;
  release_date_precision?: string;
  total_tracks?: number;
  images?: RawImage[];
  external_urls?: { spotify?: string };
  artists?: RawArtistRef[];
  label?: string;
  popularity?: number;
}

interface RawTrack {
  id?: string;
  name?: string;
  disc_number?: number;
  track_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  external_urls?: { spotify?: string };
  artists?: RawArtistRef[];
  album?: { id?: string };
}

interface RawPaged<T> {
  items?: T[];
  next?: string | null;
  total?: number;
}

interface RawPlaylist {
  id?: string;
  name?: string;
  description?: string;
  images?: RawImage[];
  tracks?: { total?: number };
  external_urls?: { spotify?: string };
  owner?: { display_name?: string };
}

interface RawPlaylistItem {
  added_at?: string | null;
  track?: RawTrack | null;
}

interface RawSearch {
  artists?: RawPaged<RawArtist>;
}

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  private readonly clientId: string | undefined;
  private readonly clientSecret: string | undefined;

  /** Bellekte tutulan uygulama jetonu; süresi dolunca yenilenir. */
  private token: string | null = null;
  private tokenExpiresAt = 0;
  /**
   * Eşzamanlı jeton isteklerini tek çağrıya indirir. Sync turu paralel
   * çağrı yaptığında, jeton süresi dolmuşsa hepsi birden yenileme isteği
   * atardı — Spotify bunu hız sınırıyla karşılıyor.
   */
  private tokenPromise: Promise<string> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.clientId = config.get<string>('SPOTIFY_CLIENT_ID');
    this.clientSecret = config.get<string>('SPOTIFY_CLIENT_SECRET');
  }

  /** Anahtarlar tanımlı mı — admin paneli bunu kullanıcıya bildirir. */
  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /* ── Katalog uçları ──────────────────────────────────────────────────── */

  async searchArtists(query: string, limit = 12): Promise<SpotifyArtist[]> {
    const term = query.trim();
    if (term.length < 2) {
      return [];
    }
    const capped = Math.min(Math.max(limit, 1), 50);
    const payload = await this.cached<RawSearch>(
      `spotify:search:artist:${capped}:${term.toLowerCase()}`,
      'search',
      { q: term, type: 'artist', limit: String(capped) },
      SEARCH_CACHE_TTL_MS,
    );
    return (payload.artists?.items ?? [])
      .filter((item): item is RawArtist => Boolean(item?.id))
      .map((item) => mapArtist(item));
  }

  async getArtist(spotifyId: string): Promise<SpotifyArtist> {
    const payload = await this.cached<RawArtist>(
      `spotify:artist:${spotifyId}`,
      `artists/${encodeURIComponent(spotifyId)}`,
      {},
      CACHE_TTL_MS,
    );
    if (!payload?.id) {
      // Sessiz fırlatmak, 11 Ağustos'ta hangi dala düşüldüğünü bulmayı
      // imkânsız hâle getirdi: uç 503 dönüyordu ve logta tek satır yoktu.
      // Kural: her fırlatma öncesinde ne olduğu yazılır.
      this.logger.warn(
        `Spotify sanatçı yanıtı kimliksiz geldi (${spotifyId}); ` +
          `cache'te bozuk kayıt olabilir — anahtar: spotify:artist:${spotifyId}`,
      );
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }
    return mapArtist(payload);
  }

  /**
   * Sanatçının albümleri.
   *
   * `include_groups` üç grup istiyor. **`appears_on` BİLEREK YOK:** onlar
   * başka sanatçıların albümleri ve bizim act'imiz orada yalnızca konuk.
   * Çekilseler `MusicAlbum.actId` ile bizim act'e asılırdı, yani diskografi
   * yabancı albümlerle dolardı — sessiz ve düzeltmesi zahmetli bir yanlış.
   * Konuk katkı bilgisi zaten `MusicTrackCredit` üzerinden, o albümün kendi
   * parça künyesinden geliyor.
   *
   * `market` verilMİYOR: pazar süzgeci bazı albümleri listeden düşürüyor ve
   * arşivin eksik görünmesine yol açıyor. Karşılığında aynı albümün ülke
   * baskıları tekrar gelebilir; tekilleştirme sync tarafında (aynı ad + yıl).
   */
  async getArtistAlbums(spotifyId: string): Promise<SpotifyAlbumSummary[]> {
    const items = await this.paged<RawAlbum>(
      `spotify:artist-albums:${spotifyId}`,
      `artists/${encodeURIComponent(spotifyId)}/albums`,
      { include_groups: 'album,single,compilation' },
      PAGE_SIZE_ALBUMS,
    );
    return items
      .filter((item): item is RawAlbum => Boolean(item?.id))
      .map((item) => mapAlbumSummary(item));
  }

  async getAlbum(spotifyId: string): Promise<SpotifyAlbum> {
    const payload = await this.cached<RawAlbum>(
      `spotify:album:${spotifyId}`,
      `albums/${encodeURIComponent(spotifyId)}`,
      {},
      CACHE_TTL_MS,
    );
    if (!payload?.id) {
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }
    return {
      ...mapAlbumSummary(payload),
      label: payload.label || null,
      popularity: numberOrNull(payload.popularity),
    };
  }

  async getAlbumTracks(spotifyId: string): Promise<SpotifyTrack[]> {
    const items = await this.paged<RawTrack>(
      `spotify:album-tracks:${spotifyId}`,
      `albums/${encodeURIComponent(spotifyId)}/tracks`,
      {},
      PAGE_SIZE_TRACKS,
    );
    return items
      .filter((item): item is RawTrack => Boolean(item?.id))
      .map((item) => mapTrack(item));
  }

  /**
   * Sanatçının en çok dinlenen parçaları. `market` burada ZORUNLU (Spotify
   * şartı); Türkiye seçildi çünkü arşiv Türkçe varsayılan.
   */
  async getArtistTopTracks(spotifyId: string): Promise<SpotifyTrack[]> {
    const payload = await this.cached<{ tracks?: RawTrack[] }>(
      `spotify:artist-top:${spotifyId}`,
      `artists/${encodeURIComponent(spotifyId)}/top-tracks`,
      { market: 'TR' },
      CACHE_TTL_MS,
    );
    return (payload.tracks ?? [])
      .filter((item): item is RawTrack => Boolean(item?.id))
      .map((item) => mapTrack(item));
  }

  /* ── Çalma listesi uçları (herkese açık listeler) ─────────────────────── */

  async getPlaylist(spotifyId: string): Promise<SpotifyPlaylist> {
    const payload = await this.cached<RawPlaylist>(
      `spotify:playlist:${spotifyId}`,
      `playlists/${encodeURIComponent(spotifyId)}`,
      {
        // Parça listesi ayrı uçtan sayfalanarak geliyor; künyeyle birlikte
        // 100 parça çekmek yanıtı gereksiz büyütürdü
        fields:
          'id,name,description,images,external_urls,owner(display_name),tracks(total)',
      },
      CACHE_TTL_MS,
    );
    if (!payload?.id) {
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }
    return {
      spotifyId: payload.id,
      name: payload.name ?? '',
      // Spotify açıklamayı HTML kaçışlı veriyor ("Rock &amp; metal")
      description: decodeEntities(payload.description) || null,
      images: mapImages(payload.images),
      totalTracks: numberOrNull(payload.tracks?.total),
      externalUrl: payload.external_urls?.spotify ?? null,
      owner: payload.owner?.display_name || null,
    };
  }

  async getPlaylistTracks(spotifyId: string): Promise<SpotifyPlaylistTrack[]> {
    const items = await this.paged<RawPlaylistItem>(
      `spotify:playlist-tracks:${spotifyId}`,
      `playlists/${encodeURIComponent(spotifyId)}/tracks`,
      {
        fields:
          'items(added_at,track(id,name,disc_number,track_number,duration_ms,explicit,external_urls,artists(id,name),album(id))),next',
      },
      PAGE_SIZE_PLAYLIST_TRACKS,
    );
    const result: SpotifyPlaylistTrack[] = [];
    for (const item of items) {
      const raw = item?.track;
      // Listede silinmiş parça ya da podcast bölümü olabilir; ikisi de null
      // `id` ile geliyor ve atlanır
      if (!raw?.id) {
        continue;
      }
      result.push({
        track: mapTrack(raw),
        albumSpotifyId: raw.album?.id ?? null,
        addedAt: item.added_at ?? null,
      });
    }
    return result;
  }

  /* ── Alt katman ──────────────────────────────────────────────────────── */

  /**
   * Sayfalanmış uçları sonuna kadar toplar ve **birleşik sonucu** tek cache
   * satırına yazar. Sayfa sayfa cache'lemek, ortadaki bir sayfanın bayat
   * kalmasıyla listenin kendi içinde tutarsız olmasına yol açardı.
   */
  private async paged<T>(
    cacheKey: string,
    path: string,
    params: Record<string, string>,
    pageSize: number,
  ): Promise<T[]> {
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      return cached.payload as unknown as T[];
    }

    try {
      const collected: T[] = [];
      for (let page = 0; page < MAX_PAGES; page++) {
        const payload = await this.request<RawPaged<T>>(path, {
          ...params,
          limit: String(pageSize),
          offset: String(page * pageSize),
        });
        const items = payload.items ?? [];
        collected.push(...items);
        if (!payload.next || items.length === 0) {
          break;
        }
        if (page === MAX_PAGES - 1) {
          this.logger.warn(
            `Sayfa sınırına dayandı, liste kesildi: ${path} (${collected.length} kayıt)`,
          );
        }
      }
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: collected as never,
          fetchedAt: new Date(),
        },
        update: { payload: collected as never, fetchedAt: new Date() },
      });
      return collected;
    } catch (error) {
      // Kural 4: dış kaynak düşerse bayat veri sunulur, hata gösterilmez
      if (cached) {
        this.logger.warn(
          `Spotify düştü, bayat liste sunuluyor (${cacheKey}): ${String(error)}`,
        );
        return cached.payload as unknown as T[];
      }
      throw error;
    }
  }

  private async cached<T>(
    cacheKey: string,
    path: string,
    params: Record<string, string>,
    ttlMs: number,
  ): Promise<T> {
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < ttlMs) {
      return cached.payload as unknown as T;
    }

    try {
      const payload = await this.request<T>(path, params);
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: payload as never,
          fetchedAt: new Date(),
        },
        update: { payload: payload as never, fetchedAt: new Date() },
      });
      return payload;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `Spotify düştü, bayat künye sunuluyor (${cacheKey}): ${String(error)}`,
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
    const token = await this.getToken();
    const url = buildUrl(path, params);

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.warn(`Spotify isteği başarısız: ${url} — ${String(error)}`);
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }

    if (response.status === 401) {
      // Jeton beklenmedik şekilde geçersiz: bir sonraki çağrı yenilesin
      this.token = null;
      this.tokenExpiresAt = 0;
      // Bu dal 11 Ağustos'a kadar SESSİZDİ ve teşhisi imkânsız kılıyordu.
      this.logger.warn(
        `Spotify 401 döndü (${path}) — jeton düşürüldü, sonraki çağrı yeniler`,
      );
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      this.logger.warn(
        `Spotify hız sınırı (${path}); Retry-After: ${retryAfter ?? 'yok'}`,
      );
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_RATE_LIMITED');
    }
    if (!response.ok) {
      /**
       * ⚠️ TAM ADRES ve GÖVDE loglanıyor, yalnızca `path` değil.
       *
       * 11 Ağustos 2026'da bu satır sadece `path` yazıyordu ve teşhisi
       * yavaşlattı: log "Spotify 400 döndü: artists/…/albums" diyordu ama
       * hatanın SORGU DİZESİNDE olduğunu söylemiyordu (bkz. `buildUrl`).
       * Adres uzun ama içinde gizli bilgi yok — jeton başlıkta gidiyor.
       */
      const body = await response.text().catch(() => '');
      this.logger.warn(
        `Spotify ${response.status} döndü: ${url}` +
          (body ? ` — gövde: ${body.slice(0, 300)}` : ''),
      );
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }

    return (await response.json()) as T;
  }

  /** Uygulama jetonu; süresi doluysa yenilenir. */
  private async getToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_NOT_CONFIGURED');
    }
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }
    // Zaten bir yenileme uçuşta ise ona katıl
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    this.tokenPromise = this.fetchToken().finally(() => {
      this.tokenPromise = null;
    });
    return this.tokenPromise;
  }

  private async fetchToken(): Promise<string> {
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );

    let response: Response;
    try {
      response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
          authorization: `Basic ${basic}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.error(`Spotify jetonu alınamadı: ${String(error)}`);
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_UNAVAILABLE');
    }

    if (!response.ok) {
      // 400/401 burada "anahtarlar yanlış" demek; loga durum kodu düşsün ama
      // anahtarın kendisi ASLA loglanmasın (kural 6)
      this.logger.error(`Spotify jeton ucu ${response.status} döndü`);
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_AUTH_FAILED');
    }

    const payload = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!payload.access_token) {
      throw new ServiceUnavailableException('MUSIC.SPOTIFY_AUTH_FAILED');
    }

    const lifetimeMs = (payload.expires_in ?? 3600) * 1000;
    this.token = payload.access_token;
    this.tokenExpiresAt = Date.now() + lifetimeMs - TOKEN_SAFETY_MARGIN_MS;
    return this.token;
  }
}

/* ── Eşleyiciler ─────────────────────────────────────────────────────────── */

function mapArtist(raw: RawArtist): SpotifyArtist {
  return {
    spotifyId: raw.id ?? '',
    name: raw.name ?? '',
    genres: (raw.genres ?? []).filter((genre) => Boolean(genre?.trim())),
    popularity: numberOrNull(raw.popularity),
    followers: numberOrNull(raw.followers?.total),
    images: mapImages(raw.images),
    externalUrl: raw.external_urls?.spotify ?? null,
  };
}

function mapAlbumSummary(raw: RawAlbum): SpotifyAlbumSummary {
  return {
    spotifyId: raw.id ?? '',
    title: raw.name ?? '',
    // `album_group` sanatçıya göre bağlamı verir ("appears_on"), `album_type`
    // ise albümün kendi türü. Sınıflandırmada grup öncelikli.
    albumType: raw.album_group || raw.album_type || 'album',
    releaseDate: raw.release_date || null,
    releaseDatePrecision: raw.release_date_precision || null,
    totalTracks: numberOrNull(raw.total_tracks),
    images: mapImages(raw.images),
    externalUrl: raw.external_urls?.spotify ?? null,
    artists: mapArtistRefs(raw.artists),
  };
}

function mapTrack(raw: RawTrack): SpotifyTrack {
  return {
    spotifyId: raw.id ?? '',
    title: raw.name ?? '',
    discNumber: raw.disc_number ?? 1,
    trackNumber: raw.track_number ?? 0,
    durationMs: numberOrNull(raw.duration_ms),
    isExplicit: raw.explicit === true,
    externalUrl: raw.external_urls?.spotify ?? null,
    artists: mapArtistRefs(raw.artists),
  };
}

function mapArtistRefs(
  raw: RawArtistRef[] | undefined,
): Array<{ spotifyId: string; name: string }> {
  return (raw ?? [])
    .filter((item) => Boolean(item?.id))
    .map((item) => ({ spotifyId: item.id ?? '', name: item.name ?? '' }));
}

function mapImages(raw: RawImage[] | undefined): SpotifyImage[] {
  return (raw ?? [])
    .filter((image) => Boolean(image?.url))
    .map((image) => ({
      url: image.url ?? '',
      width: numberOrNull(image.width),
      height: numberOrNull(image.height),
    }));
}

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Spotify çalma listesi açıklamasını HTML kaçışlı veriyor ("Rock &amp;
 * metal", "&#x27;90lar"). Metin sayfada düz yazı olarak basıldığı için
 * kaçışın çözülmesi gerekiyor; aksi hâlde ziyaretçi `&amp;` görür.
 *
 * Tam bir HTML çözücü DEĞİL ve olmamalı: yalnızca Spotify'ın ürettiği beş
 * varlık ve sayısal kaçışlar çözülüyor. Etiket geçirmiyor.
 */
function decodeEntities(value: string | undefined): string {
  if (!value) {
    return '';
  }
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(Number.parseInt(dec, 10)),
    )
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Spotify istek adresini kurar.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ NEDEN `URLSearchParams` KULLANILMIYOR — ÖLÇÜLDÜ (11 Ağustos 2026)
 *
 * `url.searchParams.set('include_groups', 'album,single,compilation')`
 * virgülleri **`%2C`** olarak kodluyor:
 *     ?include_groups=album%2Csingle%2Ccompilation&limit=50&offset=0
 * ve Spotify bu isteğe **400 Bad Request** dönüyor. Aynı adres düz virgülle
 * çalışıyor:
 *     ?include_groups=album,single,compilation&limit=50&offset=0
 *
 * Belirti sinsiydi: sanatçı künyesi (parametresiz istek) 200 dönüyor,
 * diskografi 400 dönüyordu — yani "Spotify çalışıyor" gibi görünürken sync
 * her sanatçıda patlıyordu. Canlıda `MUSIC.SPOTIFY_UNAVAILABLE` olarak
 * görünüyordu; sebep ancak `Logs`ta `Spotify 400 döndü: artists/…/albums`
 * satırı okununca daraldı.
 *
 * Virgül sorgu dizesinde ayrılmış (reserved) bir karakter DEĞİL — RFC 3986'ya
 * göre `sub-delims` içinde ve kodlanmadan kullanılabilir. Yani burada kural
 * dışına çıkılmıyor; `URLSearchParams`ın fazla kodlaması düzeltiliyor.
 *
 * Diğer her şey normal kodlanıyor: boşluk `%20`, `&` ve `=` kaçırılıyor.
 * Bu, arama sorgularının ("linkin park") doğru gitmesi için şart.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function buildUrl(path: string, params: Record<string, string>): string {
  const base = `${SPOTIFY_API}/${path}`;
  const entries = Object.entries(params);
  if (entries.length === 0) {
    return base;
  }
  const query = entries
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(/%2C/g, ',')}`,
    )
    .join('&');
  return `${base}?${query}`;
}
