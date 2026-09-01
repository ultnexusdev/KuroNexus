/**
 * Öneri havuzunun saf mantığı — film ve dizi kanatlarının ortak hattı.
 *
 * ── NEDEN AYRI DOSYA ──────────────────────────────────────────────────────
 * `movies.service.ts` ve `shows.service.ts` içindeki `suggestions()` gövdesi
 * ~100 satır BİREBİR aynıydı; round-robin dizim döngüsü tek karakter farksız,
 * `dedupe`/`shuffle` de öyle (1 Eylül 2026 denetimi, D-B1 ve D-B4'ün bir
 * kısmı). İkisi servis metodunun içine gömülü olduğu için **test edilemiyordu**
 * da: dizim kuralını sınamak için Prisma ve TMDB istemcisi ayağa kaldırmak
 * gerekiyordu. Saf fonksiyona çıkınca hem tek kaynak oldu hem sınanabildi.
 *
 * Servislerin kalanı (hangi tabloyu okuduğu, hangi TMDB istemcisini
 * çağırdığı) kanada özgü olduğu için yerinde kaldı.
 */

/** Havuzdaki her öğenin taşıması gereken tek alan. */
export interface Suggestible {
  tmdbId: number;
}

/**
 * Bilinen ve tekrar eden kayıtları eler.
 *
 * `known`: arşivde duran ya da kullanıcının "ilgilenmiyorum" dediği kimlikler.
 */
export function dedupe<T extends Suggestible>(
  items: T[],
  known: Set<number>,
): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (known.has(item.tmdbId) || seen.has(item.tmdbId)) {
      return false;
    }
    seen.add(item.tmdbId);
    return true;
  });
}

/** Fisher-Yates. Kopya üzerinde çalışır, girdi dizisine dokunmaz. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Birden çok kaynağı dönüşümlü dizer.
 *
 * Çağıranlar akışları `[explore, taste, explore, buzz]` sırasıyla veriyor:
 * keşif bilerek İKİ KEZ listede, havuz gündemin dar penceresine sıkışmasın
 * diye. Aynı akışın iki kez geçmesi aynı öğeyi iki kez almak anlamına
 * gelmiyor — alınanlar `tmdbId` ile işaretleniyor.
 *
 * Bütün akışlar tükenirse döngü erken biter: `limit` bir hedef, garanti değil.
 */
export function interleave<T extends Suggestible>(
  streams: T[][],
  limit: number,
): T[] {
  const cursors = streams.map(() => 0);
  const mixed: T[] = [];
  const taken = new Set<number>();

  while (mixed.length < limit) {
    let progressed = false;
    for (let s = 0; s < streams.length; s += 1) {
      const stream = streams[s];
      // Aynı akış listede birden fazla olabilir: alınmışları atla
      while (
        cursors[s] < stream.length &&
        taken.has(stream[cursors[s]].tmdbId)
      ) {
        cursors[s] += 1;
      }
      if (cursors[s] >= stream.length) {
        continue;
      }
      const item = stream[cursors[s]];
      cursors[s] += 1;
      taken.add(item.tmdbId);
      mixed.push(item);
      progressed = true;
      if (mixed.length >= limit) {
        break;
      }
    }
    if (!progressed) {
      break;
    }
  }
  return mixed;
}
