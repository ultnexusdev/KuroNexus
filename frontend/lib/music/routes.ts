/**
 * Salon 06 · Müzik — TEK ADRES KAYNAĞI.
 *
 * `lib/sport/routes.ts`in müzik karşılığı ve aynı gerekçeyle var: spor kanadı
 * taşınırken `/dark-stories/category/${slug}` dizesi ÜÇ ayrı dosyada elle
 * yazılıydı ve üçünü ayrı ayrı düzeltmek üç kez unutma şansı demekti. Müzik
 * doğduğu andan itibaren o desende kuruluyor — sonradan taşınmıyor.
 *
 * Kural: hiçbir bileşen `/muzik/...` dizesini elle yazmaz.
 */

/** `/muzik` ağacının bütün adresleri. Rota dosyaları bunlarla birebir eşleşir. */
export const musicHref = {
  root: () => "/muzik",

  /** 2c · sanatçı/grup sayfası */
  act: (slug: string) => `/muzik/${slug}`,
  /**
   * Sanatçı dizini. Salon kavşağındaki "YOL 02" kartı EskİDEN `acts[0]`e
   * gidiyordu — yani her zaman aynı sanatçıya. Arşivde tek sanatçı varken
   * fark edilmiyordu; kart artık buraya bakıyor.
   */
  acts: () => "/muzik/sanatcilar",
  /** Album Room — act ağacının altında, çünkü albüm act'e ait */
  album: (actSlug: string, albumSlug: string) =>
    `/muzik/${actSlug}/${albumSlug}`,

  /** 2b · tür odası */
  room: (slug: string) => `/muzik/tur/${slug}`,
  rooms: () => "/muzik/tur",

  /** 2d · dinleme kaydı */
  listening: () => "/muzik/dinleme",

  /** Kişi sayfası (Chester Bennington, Hans Zimmer) */
  person: (slug: string) => `/muzik/kisi/${slug}`,

  /** Çalma listesi */
  playlist: (slug: string) => `/muzik/liste/${slug}`,
  /** Çalma listesi dizini */
  playlists: () => "/muzik/listeler",
} as const;

/**
 * Sanatçı slug'ıyla çakışamayacak yollar.
 *
 * `/muzik/[actSlug]` dinamik bir segment; "tur" adında bir act kaydı açılırsa
 * `/muzik/tur` iki şeyi birden gösterebilir. App Router statik segmenti
 * önceliklendirir, yani **sanatçı sayfası ERİŞİLEMEZ olur** — sessiz bir
 * kayıp. Act oluşturma bu listeye karşı doğrulanmalı.
 *
 * `lib/sport/routes.ts`teki `RESERVED_CLUB_SLUGS` ile aynı tuzak; orada
 * ölçülmüş, burada baştan kapatılıyor.
 */
export const RESERVED_ACT_SLUGS = new Set([
  "tur",
  "turler",
  "dinleme",
  "kisi",
  "kisiler",
  "liste",
  "listeler",
  "albumler",
  "parcalar",
  "sanatcilar",
  "arsiv",
]);

/** Spotify gömülü çalar adresi. */
export type SpotifyEmbedKind = "track" | "album" | "artist" | "playlist";

/**
 * `open.spotify.com/embed/...` adresi.
 *
 * ⚠️ Bu adres `next.config.ts` içindeki CSP `frame-src` listesinde olmak
 * ZORUNDA; yoksa iframe **sessizce** boş kalır (sayfa çökmez, konsolda ihlal
 * görünür). Liste 11 Ağustos 2026'da `https://open.spotify.com` ile
 * genişletildi.
 *
 * `theme=0` koyu gömü demek — salonun kendi zeminiyle uyumlu.
 * `utm_source` EKLENMİYOR: gereksiz izleme parametresi.
 */
export function spotifyEmbedSrc(
  kind: SpotifyEmbedKind,
  spotifyId: string,
): string {
  return `https://open.spotify.com/embed/${kind}/${encodeURIComponent(spotifyId)}?theme=0`;
}

/** Spotify'ın kendi sayfası — "Spotify'da aç" düğmesi. */
export function spotifyOpenUrl(
  kind: SpotifyEmbedKind,
  spotifyId: string,
): string {
  return `https://open.spotify.com/${kind}/${encodeURIComponent(spotifyId)}`;
}

/**
 * Tür rozetinin rengi.
 *
 * Veritabanındaki `accentKey` bir **token anahtarı**, renk değeri değil
 * (kural 16). Bilinmeyen anahtar `--genre-unknown`a düşer — sessiz bozulma
 * yerine nötr bir gri.
 */
export function genreColorVar(accentKey: string | null | undefined): string {
  const known = [
    "pop", "rock", "metal", "hiphop", "electronic", "rnb", "jazz", "blues", "classical", "folk", "country", "latin", "reggae", "world", "gospel", "soundtrack", "experimental",
  ];
  return accentKey && known.includes(accentKey)
    ? `var(--genre-${accentKey})`
    : "var(--genre-unknown)";
}
