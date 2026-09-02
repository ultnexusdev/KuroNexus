/**
 * Önbellek kararı **çağırana göre** — sitenin tek tazelik kuralı.
 *
 * ── NE ─────────────────────────────────────────────────────────────────────
 * Ziyaretçi Next Data Cache'ten okur (beş dakika), KÜRATÖR her zaman taze
 * okur. Sayfalar `readIsAdmin()` sonucunu getiricilere `fresh` olarak geçirir.
 *
 * ── NEDEN (2 Eylül 2026, denetim API-04/05; karar kullanıcıya soruldu ve
 * onaylandı) ────────────────────────────────────────────────────────────────
 * Kitap/anime/film/dizi arşivleri ve karakter dizini her SSR render'ında
 * `no-store` ile taze çekiliyordu: `/books` tek başına 558 KB JSON ve ~10
 * sorgu, 120 sayfa `force-dynamic` — yani her ziyaretçi, tek kişilik ve
 * seyrek küratörlüğün tazelik bedelini 3.7 GB / 2 çekirdeklik kutuda
 * ödüyordu. Bu desen müzik kanadında (11 Ağustos) ve nabız ucunda (22
 * Ağustos) zaten ölçülüp uygulanmıştı; burada site geneline çıkıyor.
 *
 * ── ÖLÇÜLEN TUZAK (music.ts, 11 Ağustos) ───────────────────────────────────
 * `router.refresh()` tek başına YETMİYOR: sunucu bileşeni yeniden çalışır ama
 * `revalidate` işaretli `fetch` Data Cache'ten döner — küratör "kaydettim ama
 * gelmedi" görür. Çözüm önbelleği kaldırmak değil, küratörü muaf tutmak.
 * Bu yüzden küratör yüzeyi taşıyan HER sayfa `fresh` geçirmek ZORUNDA;
 * geçirmeyen sayfa ziyaretçi sayılır.
 *
 * ── API-05 NOTU ────────────────────────────────────────────────────────────
 * Sayfalardaki `force-dynamic` bildirimleri kaldırılMADI: `readIsAdmin()`
 * çerez okuduğu için render zaten dinamik; kazanç fetch katmanındaki Data
 * Cache'ten geliyor ve o, render dinamik olsa da çalışıyor. Statikleştirme
 * ayrıca `[locale]` altında bilinen bir 500 tuzağı taşıyor.
 */
export const REVALIDATE = 300;

export function freshness(fresh?: boolean): RequestInit {
  return fresh ? { cache: "no-store" } : { next: { revalidate: REVALIDATE } };
}
