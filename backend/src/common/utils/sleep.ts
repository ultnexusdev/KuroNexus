/**
 * Dört serviste birebir kopyaydı (jikan, bin-kitap, football-live, tff —
 * 1 Eylül 2026 denetimi, D-B8). Hepsi dış kaynaklara nazik davranma
 * beklemesi için kullanıyor.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
