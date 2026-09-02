import { apiFetch } from "./client";
import { freshness } from "./freshness";

/**
 * Salon 06 · Müzik — veri getiriciler.
 *
 * Dört uç, tasarımın dört ekranına birebir karşılık geliyor. Hiçbiri
 * Spotify'a çıkmıyor: backend veritabanındaki senkronize kopyadan servis
 * ediyor (plan Bölüm 7). Sonuç: Spotify düşse de salon eksiksiz açılır.
 *
 * ⚠️ Hata YAKALANMIYOR. Dört getirici de `apiFetch`in hatasını yukarı
 * bırakıyor ve sayfalar `error.tsx`e düşüyor. Gerekçe STATE.md'deki bilinen
 * tuzak (bulgu Ö-8): backend düştüğünde `catch` içinde boş dizi döndüren
 * getiriciler yüzünden salon "arşiv boş" yazısı gösteriyordu ve ziyaretçi
 * gerçek boşlukla arızayı ayırt edemiyordu. Boş arşiv ile ulaşılamayan
 * arşiv AYNI ŞEY DEĞİL.
 */

export type ListeningRange = "FOUR_WEEKS" | "SIX_MONTHS" | "ALL_TIME";

export type MusicActKind =
  | "UNCLASSIFIED"
  | "BAND"
  | "SOLO_PROJECT"
  | "DUO"
  | "GROUP"
  | "ORCHESTRA";

export type MusicAlbumType =
  | "ALBUM"
  | "SINGLE"
  | "EP"
  | "COMPILATION"
  | "LIVE"
  | "SOUNDTRACK";

export interface GenreShare {
  slug: string;
  name: string;
  /** `globals.css` içindeki `[data-genre="…"]` anahtarı; renk DEĞİL */
  accentKey: string | null;
  percent: number;
}

export interface GenreRoomSummary {
  slug: string;
  name: string;
  key: string | null;
  accentKey: string | null;
  actCount: number;
}

export interface MusicPlaylistSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  artwork: string | null;
  trackCount: number;
  durationMs: number | null;
  isFavorite: boolean;
  genreMix: GenreShare[];
}

export interface TopAct {
  name: string;
  /** Arşivde act kaydı varsa sayfa adresi; yoksa null (satır bağlantısız) */
  slug: string | null;
  image: string | null;
  genreName: string | null;
  accentKey: string | null;
  playCount: number;
  msPlayed: number;
  /**
   * Ölçüm gerçek mi? `false` ise dinleme kaydı henüz aktarılmadı ve liste
   * popülerliğe göre sıralandı — ön yüz "dinlemeye göre" etiketini gizler.
   */
  measured: boolean;
}

export interface MusicOverview {
  counts: { acts: number; albums: number; tracks: number; playlists: number };
  lastSyncedAt: string | null;
  playlists: MusicPlaylistSummary[];
  acts: TopAct[];
  rooms: GenreRoomSummary[];
  /**
   * Salonun alt şeridi. Tasarım (2a) burada "şu an çalan" gösteriyordu ama o
   * veri Faz 5'e ait (Authorization Code + refresh token). Faz 1'de dürüst
   * karşılığı en son dinlenen kayıt — gerçek veri, gerçek etiket. Canlı
   * çalıyormuş gibi bir eşitleyici animasyonu yanlış bir şey söylerdi.
   */
  lastPlay: RecentPlay | null;
}

export interface AlbumCard {
  slug: string;
  title: string;
  artwork: string | null;
  releaseDate: string | null;
  releaseDatePrecision: string | null;
  albumType: MusicAlbumType;
  /** Sanatçı sayfasında dolu (parça toplamı bundan çıkıyor); oda listesinde yok */
  totalTracks?: number | null;
  /** Oda listesinde dolu (albüm kimin?); sanatçı sayfasında gereksiz */
  act?: { slug: string; name: string };
  /** Sanatçı sayfasında dolu — küratörün kurduğu dönem bağı */
  era?: { slug: string; name: string } | null;
  spotifyId?: string | null;
}

export interface RecentPlay {
  playedAt: string;
  trackName: string;
  artistName: string | null;
  albumName: string | null;
  track: {
    slug: string;
    spotifyId: string | null;
    album: {
      slug: string;
      artwork: string | null;
      act: { slug: string };
    };
  } | null;
}

/** Odaya bağlı çalma listesi — küratörün seçtiği oda (`MusicPlaylist.genreId`) */
export interface GenreRoomPlaylist {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  artwork: string | null;
  trackCount: number;
  durationMs: number | null;
}

export interface GenreRoom {
  playlists: GenreRoomPlaylist[];
  genre: {
    slug: string;
    name: string;
    key: string | null;
    accentKey: string | null;
    subgenres: Array<{ slug: string; name: string; accentKey: string | null }>;
  };
  counts: { acts: number; albums: number; tracks: number };
  acts: Array<{
    slug: string;
    name: string;
    image: string | null;
    actKind: MusicActKind;
    formedYear: number | null;
    albumCount: number;
    genres: Array<{ slug: string; name: string }>;
    playCount: number;
  }>;
  albums: AlbumCard[];
  recentPlays: RecentPlay[];
}

export interface MusicAct {
  id: string;
  slug: string;
  name: string;
  actKind: MusicActKind;
  bio: string | null;
  image: string | null;
  bannerImage: string | null;
  /** CSS `background-position` degeri ("50% 30%"); null ise ortadan kirpiliyor */
  bannerPosition: string | null;
  formedYear: number | null;
  disbandedYear: number | null;
  originCity: string | null;
  originCountry: string | null;
  popularity: number | null;
  followers: number | null;
  spotifyId: string | null;
  genres: Array<{ slug: string; name: string; accentKey: string | null }>;
  eras: Array<{
    slug: string;
    name: string;
    startedAt: string | null;
    endedAt: string | null;
    description: string | null;
  }>;
  memberships: Array<{
    isCurrent: boolean;
    startedAt: string | null;
    endedAt: string | null;
    person: { slug: string; name: string; photo: string | null };
    role: { key: string; slug: string };
  }>;
  albums: AlbumCard[];
  singles: AlbumCard[];
  topTracks: Array<{
    id: string;
    slug: string;
    title: string;
    durationMs: number | null;
    spotifyId: string | null;
    album: { slug: string; title: string; artwork: string | null };
    playCount: number;
    measured: boolean;
  }>;
  playCount: number;
  roomMates: Array<{ slug: string; name: string; image: string | null }>;
}

/** Sanatçı dizini satırı — `/muzik/sanatcilar` */
export interface ActCard {
  slug: string;
  name: string;
  image: string | null;
  actKind: MusicActKind;
  formedYear: number | null;
  disbandedYear: number | null;
  originCountry: string | null;
  albumCount: number;
  genres: Array<{ slug: string; name: string; accentKey: string | null }>;
}

/** Parça satırı — albüm ve liste sayfalarında aynı satır çiziliyor */
export interface AlbumTrack {
  id: string;
  slug: string;
  title: string;
  discNumber: number;
  trackNumber: number;
  durationMs: number | null;
  isExplicit: boolean;
  spotifyId: string | null;
  playCount: number;
}

/** Albüm sayfası — `/muzik/[actSlug]/[albumSlug]` */
export interface MusicAlbum {
  id: string;
  slug: string;
  title: string;
  originalTitle: string | null;
  albumType: MusicAlbumType;
  releaseDate: string | null;
  releaseDatePrecision: string | null;
  totalTracks: number | null;
  label: string | null;
  artwork: string | null;
  spotifyId: string | null;
  era: { slug: string; name: string } | null;
  act: {
    slug: string;
    name: string;
    image: string | null;
    genres: Array<{ slug: string; name: string; accentKey: string | null }>;
  };
  tracks: AlbumTrack[];
  /** Dinleme kaydı aktarılmadıysa `false` — ekran sayı sütununu hiç çizmez */
  measured: boolean;
  otherAlbums: Array<{
    slug: string;
    title: string;
    artwork: string | null;
    releaseDate: string | null;
    albumType: MusicAlbumType;
  }>;
}

/** Liste sayfası — `/muzik/liste/[slug]` */
export interface MusicPlaylistDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  artwork: string | null;
  trackCount: number;
  durationMs: number | null;
  isFavorite: boolean;
  spotifyId: string | null;
  /** Bizim listemiz mi (Spotify'dan gelmediyse `true`) */
  isLocal: boolean;
  /** Küratörün seçtiği oda; `null` ise liste hiçbir tür odasında görünmüyor */
  genre: { id: string; slug: string; name: string } | null;
  tracks: Array<{
    position: number;
    addedAt: string | null;
    id: string;
    slug: string;
    title: string;
    durationMs: number | null;
    spotifyId: string | null;
    album: {
      slug: string;
      title: string;
      artwork: string | null;
      act: { slug: string; name: string };
    };
  }>;
}

export interface MusicListening {
  range: ListeningRange;
  totals: { plays: number; msPlayed: number; distinctArtists: number };
  /** PostgreSQL `EXTRACT(DOW)`: 0 = Pazar. Gün adı ön yüzde çevrilir. */
  busiestDay: { dayOfWeek: number; plays: number } | null;
  topActs: TopAct[];
  genreShare: GenreShare[];
  recentPlays: RecentPlay[];
  playlists: Array<{
    slug: string;
    name: string;
    artwork: string | null;
    trackCount: number | null;
    durationMs: number | null;
  }>;
  /** Dinleme kaydı hiç aktarılmadıysa `false` — ekran boş grafik çizmez */
  hasData: boolean;
}

/**
 * `revalidate: 300` — beş dakika.
 *
 * Katalog haftalık cron'la tazeleniyor, yani saniyelik tazelik gereksiz. Ama
 * küratör panelden bir sanatçı eklediğinde salonu bir hafta beklemek de
 * kabul edilemez; beş dakika iki uç arasındaki denge.
 */
/*
 * `REVALIDATE` ve `freshness` 2 Eylül 2026'dan beri site geneli tek yerde
 * (`lib/api/freshness.ts`) — bu dosyada doğan desen arşivlerin tamamına
 * çıktı. Aşağıdaki ölçüm notu ilk kaynak olduğu için burada duruyor.
 */

/**
 * Önbellek kararı **çağırana göre** değişiyor.
 *
 * ⚠️ ÖLÇÜLEN PÜRÜZ (11 Ağustos 2026): beş dakikalık önbellek küratörün
 * karşısına "kaydedilmedi" gibi görünen bir ekran çıkarıyordu. Bir tür
 * onaylandıktan ya da sanatçı eklendikten sonra sayfa beş dakikaya kadar eski
 * hâlinde kalıyor ve panelin "eklendi" yazısıyla salonun gösterdiği şey
 * çelişiyordu. `router.refresh()` tek başına YETMİYOR: sunucu bileşeni
 * yeniden çalışıyor ama `revalidate` işaretli `fetch` yine Data Cache'ten
 * dönüyor.
 *
 * Çözüm önbelleği kaldırmak DEĞİL — ziyaretçi için beş dakika hâlâ doğru
 * denge (katalog haftalık cron'la tazeleniyor). Yalnızca **küratör** taze
 * okuyor: sayfalar `readIsAdmin()` sonucunu buraya `fresh` olarak geçiriyor.
 * Böylece arşivin sahibi her zaman gerçeği görüyor, ziyaretçi hızlı sayfa
 * alıyor ve backend'e gereksiz yük binmiyor.
 */

export function fetchMusicOverview(fresh?: boolean): Promise<MusicOverview> {
  return apiFetch<MusicOverview>("/music/overview", freshness(fresh));
}

export function fetchMusicRooms(fresh?: boolean): Promise<GenreRoomSummary[]> {
  return apiFetch<GenreRoomSummary[]>("/music/rooms", freshness(fresh));
}

export function fetchGenreRoom(
  slug: string,
  fresh?: boolean,
): Promise<GenreRoom> {
  return apiFetch<GenreRoom>(
    `/music/rooms/${encodeURIComponent(slug)}`,
    freshness(fresh),
  );
}

export function fetchMusicAct(
  slug: string,
  fresh?: boolean,
): Promise<MusicAct> {
  return apiFetch<MusicAct>(
    `/music/acts/${encodeURIComponent(slug)}`,
    freshness(fresh),
  );
}

export function fetchMusicActs(fresh?: boolean): Promise<ActCard[]> {
  return apiFetch<ActCard[]>("/music/acts", freshness(fresh));
}

export function fetchMusicAlbum(
  actSlug: string,
  albumSlug: string,
  fresh?: boolean,
): Promise<MusicAlbum> {
  return apiFetch<MusicAlbum>(
    `/music/acts/${encodeURIComponent(actSlug)}/albums/${encodeURIComponent(albumSlug)}`,
    freshness(fresh),
  );
}

export function fetchMusicPlaylists(
  fresh?: boolean,
): Promise<MusicPlaylistSummary[]> {
  return apiFetch<MusicPlaylistSummary[]>("/music/playlists", freshness(fresh));
}

export function fetchMusicPlaylist(
  slug: string,
  fresh?: boolean,
): Promise<MusicPlaylistDetail> {
  return apiFetch<MusicPlaylistDetail>(
    `/music/playlists/${encodeURIComponent(slug)}`,
    freshness(fresh),
  );
}

/**
 * Dinleme kaydı. `no-store` bilinçli: dönem seçicisi tıklanınca ziyaretçi
 * anında yeni dönemi görmeli, önbellekten gelen bir önceki dönemi değil.
 * Ayrıca bu ekranı yalnızca arşiv sahibi açıyor — önbelleğin kazancı da yok.
 */
export function fetchMusicListening(
  range: ListeningRange,
): Promise<MusicListening> {
  return apiFetch<MusicListening>(`/music/listening?range=${range}`, {
    cache: "no-store",
  });
}
