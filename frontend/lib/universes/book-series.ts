/**
 * Evren ↔ kitap serisi eşleşmesi.
 *
 * "Kadim Dünyalar"daki Zaman Çarkı ile kitap arşivindeki Zaman Çarkı aynı
 * şey; kullanıcı serinin evren sayfasında da görünmesini istedi.
 *
 * ── NEDEN BU YOL ──────────────────────────────────────────────────────────
 * Veri modelinde iki taraf arasında **hiçbir bağ yok**: `BookSeries`te
 * `universeId` alanı bulunmuyor, `WikiUniverse`te de serbest bir alan yok.
 * Var olan tek köprü `BookEntry.universeId` — yani kitap başına, seri başına
 * değil — ve ölçüldü (2026-08-06, canlı `GET /books`): **hiçbir seride bu
 * bağ kurulu değil**, 32 serinin hepsinde `universeSlug` boş. Üstelik o alanı
 * dolduracak bir kürator formu da yok.
 *
 * Gerçek bir yabancı anahtar eklemek migration ister; kullanıcı içeriği kodda
 * tutma kararı verdiği için (6 Ağustos 2026) eşleşme de burada.
 *
 * ── EŞLEŞME KURALI ────────────────────────────────────────────────────────
 * Önce aşağıdaki tablo, yoksa **slug'ın kendisi**. Ölçüm (canlı veri):
 *
 *   zaman-carki        ↔ zaman-carki         ✓ birebir
 *   malazan-yitikler   ↔ malazan-yitikler    ✓ birebir
 *   firtinaisigi-arsivi↔ firtinaisigi-arsivi ✓ birebir
 *   dune               ↔ dune-serisi         ✗ tabloya yazıldı
 *
 * Kalan evrenlerin (Buz ve Ateşin Şarkısı, Kral Katili Güncesi, Yüzüklerin
 * Efendisi, Temürkan Efsaneleri) arşivde karşılık gelen bir serisi yok;
 * `getBookSeries` `null` döndüğü için o sayfalarda bölüm hiç çizilmiyor.
 *
 * Yeni bir eşleşme eklemek = buraya bir satır.
 */
const EXPLICIT: Record<string, string> = {
  // Seri adı "Dune Serisi" olduğu için slug evrenin slug'ıyla tutmuyor
  dune: "dune-serisi",
};

/** Evrenin kitap serisi slug'ı. */
export function bookSeriesSlugFor(universeSlug: string): string {
  return EXPLICIT[universeSlug] ?? universeSlug;
}
