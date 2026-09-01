/**
 * YouTube adres kurucuları — CSP ile elle senkron duran TEK yer.
 *
 * `next.config.ts` içindeki `frame-src` beyaz listesi yalnızca
 * `www.youtube-nocookie.com`u, `img-src` ise `i.ytimg.com`u tanıyor. Bu
 * adresler 1 Eylül 2026 denetimine kadar beş noktada elle yazılıydı (bulgu
 * H-F4); dördü fragman ikizlerinin içindeydi ve D-F3 ile zaten tekleşti,
 * beşincisi futbolcu sinema salonuydu. Taban adres bir gün değişirse (ya da
 * CSP daraltılırsa) artık tek dosya değişiyor — beş noktadan birini unutup
 * sessizce kırık çerçeve üretme riski kapandı.
 */

/**
 * Gömülü oynatıcı adresi. `params` sorgu dizesi olarak eklenir; çağıranlar
 * farklı parametre setleri kullanıyor (fragman `autoplay=1&rel=0`, futbol
 * sineması buna `modestbranding` ve `playsinline` ekliyor) ve bu bilinçli —
 * ortak yardımcı adresi tekliyor, sahne davranışını dayatmıyor.
 */
export function youtubeEmbedUrl(videoKey: string, params: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoKey}?${params}`;
}

/** Videonun kapak karesi — oynatıcı inmeden önce gösterilen görsel. */
export function youtubeThumbUrl(videoKey: string): string {
  return `https://i.ytimg.com/vi/${videoKey}/hqdefault.jpg`;
}
