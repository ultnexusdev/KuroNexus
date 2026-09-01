import { slugify } from './slugify';

/**
 * Çakışmayan slug üretiminin tek kaynağı (AGENTS.md kural 14).
 *
 * ── NEDEN TEK DOSYA ───────────────────────────────────────────────────────
 * Aynı kural altı ayrı yerde yeniden yazılmıştı ve DÖRT FARKLI DAVRANIŞ
 * üretiyordu (1 Eylul 2026 denetimi, bulgu D-B5). Slug URL sözleşmesinin
 * kalbi olduğu için bu ayrışmalar sessizce farklı adresler doğuruyordu:
 *
 *   - stories / universes / wiki: sayaç 2'den başlıyor → `ad-2`
 *   - categories: sayaç 1'den başlıyordu → aynı çakışmada `ad-1`
 *   - categories'te ayrıca YEDEK AD YOKTU: `slugify()` boş dönerse (ör. yalnız
 *     noktalama içeren bir ad) slug BOŞ kaydediliyordu
 *   - music tarafındaki iki varyantta ise diğerlerinde olmayan bir üst sınır
 *     vardı; ötekiler `for(;;)` ile sonsuza dek deneyebiliyordu
 *
 * Bu dosya en iyi davranışları birleştiriyor: 2'den başlayan sayaç (çoğunluk
 * ve mevcut verideki desen), zorunlu yedek ad ve üst sınır.
 *
 * ── `exists` NEDEN CALLBACK ───────────────────────────────────────────────
 * Çakışma sorgusu her tabloda farklı: wiki girdileri evren içinde benzersiz,
 * ötekiler global; kimi güncellemede kendi kaydını hariç tutuyor. Sorguyu
 * çağırana bırakmak, kuralı ortaklaştırırken kapsamı serbest bırakıyor.
 */

/**
 * Kaç sonek denenir. Aşılırsa zaman damgasına düşülüyor: sonsuz döngüde
 * kalmaktansa çirkin ama benzersiz bir slug üretmek yeğdir. Bir isteği
 * süresiz kilitlemek, kullanıcıya 500 döndürmekten de kötü.
 */
const MAX_ATTEMPTS = 200;

export async function buildUniqueSlug(
  source: string,
  fallback: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(source) || fallback;
  let candidate = base;
  for (let counter = 2; counter <= MAX_ATTEMPTS + 1; counter += 1) {
    if (!(await exists(candidate))) {
      return candidate;
    }
    candidate = `${base}-${counter}`;
  }
  return `${base}-${Date.now()}`;
}
