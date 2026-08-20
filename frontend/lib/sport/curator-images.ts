import type { CuratorImages } from "@/components/sport/football/player/PlayerCurator";
import {
  fetchAllPlayerImages,
  fetchPlayerImages,
} from "@/lib/api/sport-archive";

/**
 * Küratörün yüklediği kareleri SUNUCUDA okuyan tek nokta.
 *
 * ── NEDEN ORTAK BİR YARDIMCI ─────────────────────────────────────────────
 * Üç yüzey aynı işi yapıyor: hub (`/spor/futbol`), efsaneler salonu
 * (`/spor/futbol/efsaneler`) ve futbolcu profili. Üçünün de aynı yedekleme
 * davranışını taşıması gerekiyor; kopyalanmış üç blok er ya da geç ayrışırdı.
 *
 * ── TOPLU UÇ + YEDEK ─────────────────────────────────────────────────────
 * Önce tek istekle bütün futbolcuların yuvaları okunuyor. Uç yanıt vermezse
 * sahip başına ayrı istek atan ESKİ yola düşülüyor.
 *
 * Bu yedek süs değil: iki servis aynı push'ta deploy oluyor ama AYNI ANDA
 * ayağa kalkmıyorlar. Ön yüz yeni, backend hâlâ eskiyse toplu uç 404 döner ve
 * yedek olmasaydı küratörün yüklediği bütün kareler o pencerede kaybolur,
 * sayfa yer tutucularla açılırdı.
 *
 * Her iki yolda da hata YUTULUYOR ve boş harita dönüyor: bir veri kaynağının
 * kesintisi sayfayı kırmamalı — kanadın yerleşik kuralı.
 */
export async function readCuratorImages(
  owners: string[],
): Promise<CuratorImages> {
  const images: CuratorImages = {};

  const all = await fetchAllPlayerImages().catch(() => null);

  if (all) {
    for (const owner of owners) images[owner] = all[owner] ?? {};
    return images;
  }

  const fetched = await Promise.all(
    owners.map((owner) =>
      fetchPlayerImages(owner).catch(() => ({}) as Record<string, string>),
    ),
  );
  owners.forEach((owner, i) => {
    images[owner] = fetched[i];
  });

  return images;
}
