/**
 * TMDB görsel yardımcısı — film ve dizi kanatlarının ortak hattı.
 *
 * `TMDB_IMAGE_BASE` ile `tmdbImage` 1 Eylül 2026 denetimine kadar
 * `lib/api/movies.ts` ve `lib/api/shows.ts` içinde İKİ tanım hâlinde
 * duruyordu; dizi dosyasının yorumu kopyayı zaten itiraf ediyordu (bulgu
 * D-F6). İki taban adresin bir gün ayrışması, iki salonun görsellerini
 * farklı sunucudan çekmesi demekti. Kanat modülleri geri uyumluluk için
 * yeniden dışa aktarıyor — tüketicilerin hiçbiri değişmedi.
 */
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/**
 * TMDB görsel yolu → tam URL. Yol yoksa null döner, çağıran boşluğu doldurur.
 *
 * `w1280`: sahne karesi büyütme penceresi için eklendi (7 Ağustos 2026).
 * Şeritteki küçük hâl `w500` ile yeterliydi ama tam ekranda o dosya
 * büyütülüp bulanıklaşıyordu.
 */
export function tmdbImage(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" | "w1280" = "w342",
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
