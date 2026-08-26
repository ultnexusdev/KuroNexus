import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · GİZLİ VERİ KATMANI.
 *
 * Six Eyes açıldığında sayfa yalnızca renk değiştirmiyor — ÖLÇMEYE
 * başlıyor. Bu bileşen o ikinci katmanın tek taşıyıcısı.
 *
 * ── DOM'DA HER ZAMAN VAR ─────────────────────────────────────────────────
 * Maske de (`???`) gerçek değer de sunucuda basılıyor; hangisinin
 * çizileceğine SADECE CSS karar veriyor (`[data-mode]` seçicileri,
 * `GojoExperience.module.css`). JS ile sonradan enjekte edilmiyor.
 *
 * Gerekçe BRIEF'te iki başlık:
 *   · SEO — değer kaynak HTML'de olmasaydı hiçbir tarayıcı robotu görmezdi.
 *   · i18n — değer iki dilde de sunucuda seçiliyor; istemciye sözlük
 *     göndermek gerekmiyor.
 *
 * ⚠️ Bu, sayfadaki TEK "moda göre farklı davranan" bileşen ve o farkı da
 * koşullu render ile değil CSS ile yapıyor. Sözleşme bozulmuyor.
 *
 * ── EKRAN OKUYUCU ────────────────────────────────────────────────────────
 * Maske `aria-hidden`: "soru işareti soru işareti soru işareti" okutmanın
 * kimseye faydası yok. Gizliyken değer `display: none` olduğu için
 * okunmuyor — yani bilgi bir sürpriz olarak korunuyor, ama düğme klavyeyle
 * erişilebilir olduğu için ekran okuyucu kullanıcısı da açabiliyor.
 * Erişilemez içerik YOK, sadece açılması gereken içerik var.
 */
export function RevealedData({
  label,
  value,
  mask = "???",
  className,
}: {
  /** Alanın adı — her iki modda da görünür */
  label?: string;
  /** Six Eyes'ta açılan gerçek değer (sunucuda dile göre seçilmiş) */
  value: string;
  /** Gözbağlı moddaki karşılık */
  mask?: string;
  className?: string;
}) {
  return (
    <span className={[styles.revealed, className].filter(Boolean).join(" ")}>
      {label ? <span className={styles.revealedLabel}>{label}</span> : null}
      <span className={styles.revealedMask} aria-hidden="true">
        {mask}
      </span>
      <span className={styles.revealedValue}>{value}</span>
    </span>
  );
}
