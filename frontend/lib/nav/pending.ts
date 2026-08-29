/**
 * ROTA GECISI BEKLEME DEPOSU.
 *
 * ── NEDEN BIR MODUL DEGISKENI, CONTEXT DEGIL ─────────────────────────────
 * Gostergenin kaynagi `useLinkStatus()` ve o kanca `next/link`in ic
 * context'ini okuyor: yalnizca bir `<Link>`in ALTINDA calisiyor. Yani
 * "sayfa gecisi suruyor mu" bilgisi sitenin dibinde, yuzlerce ayri
 * baglantinin icinde doguyor; katman ise kok duzende, hepsinin ustunde
 * duruyor.
 *
 * Bir React context'i bu ikisini birlestiremezdi: saglayici baglantilarin
 * USTUNDE olurdu ve bilgi asagidan yukari akmasi gerekirken yukaridan
 * asagi akardi. Modul degiskeni + `useSyncExternalStore` tam olarak bu
 * yonu cozuyor -- kaynak nerede olursa olsun tek bir sayaca yaziyor.
 *
 * ⚠️ SAYAC, BAYRAK DEGIL. Kullanici arka arkaya iki baglantiya basabilir
 * (ya da bir baglanti prefetch ederken digeri gezinebilir): tek bir
 * boolean'da ilk biten gecis katmani erken kapatirdi. Sayac sifira
 * inmeden katman kalkmiyor.
 */

let pending = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/**
 * Bir gecisin basladigini bildir; donen islev onu SERBEST BIRAKIR.
 *
 * ⚠️ Iki kez cagrilsa bile bir kez dusuyor: React etkilerinin temizligi
 * gelistirme kipinde (StrictMode) iki kez kosuyor ve sayac negatife
 * kayarsa katman bir daha hic acilmaz.
 */
export function beginNavPending(): () => void {
  pending += 1;
  emit();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    pending -= 1;
    emit();
  };
}

export function subscribeNavPending(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getNavPending(): boolean {
  return pending > 0;
}

/** Sunucuda gecis diye bir sey yok: ilk HTML her zaman katmansiz. */
export function getNavPendingServer(): boolean {
  return false;
}
