"use client";

import { useDiscovery } from "./DiscoveryProvider";
import styles from "./GojoExperience.module.css";

/**
 * P11 · MİKRO OBJE — sayfaya serpiştirilmiş üç keşiften biri.
 *
 * ⚠️ GİZLİ DEĞİL, ZOR. İkon rengi `#1a1a1a` (zeminde 1.27): fark etmek
 * için bakmak gerekiyor ama ekranda gerçekten var. Gerçek bir `<button>`
 * olduğu için sekmeyle sırası geliyor ve odaklandığında görünür bir halka
 * çiziliyor — yani KLAVYEYLE KEŞFEDİLEBİLİR. Brief'in düzeltmesi tam
 * olarak buydu: Gemini'nin `#050505` ikonları ne görülebiliyor ne
 * odaklanabiliyordu.
 *
 * ⚠️ `aria-label` objenin ADINI VERMİYOR — "gizli obje" diyor. Ekran
 * okuyucu kullanıcısı düğmeyi bulabiliyor (erişilebilirlik), ama ne
 * olduğunu ancak tıklayınca öğreniyor (keşif korunuyor). Adı ve notu
 * bulunduktan sonra keşif kaydında açılıyor.
 */
export function EggObject({
  eggKey,
  mark,
  label,
  side,
  tone,
}: {
  /** `GOJO_EGGS` içindeki anahtar */
  eggKey: string;
  /** Görünen işaret — tek karakter ya da kanji */
  mark: string;
  /** Erişilebilir ad — objenin adını VERMEZ */
  label: string;
  side: "left" | "right";
  /** Keşfedilince açılan spot renk */
  tone?: string;
}) {
  const { found, discover } = useDiscovery();
  const isFound = found.has(eggKey);

  return (
    <button
      type="button"
      className={`${styles.egg} ${
        side === "left" ? styles.eggLeft : styles.eggRight
      }`}
      data-found={isFound ? "1" : undefined}
      style={tone ? ({ "--eggTone": tone } as React.CSSProperties) : undefined}
      aria-label={label}
      aria-pressed={isFound}
      onClick={() => discover(eggKey)}
    >
      <span className={styles.eggMark} aria-hidden="true">
        {mark}
      </span>
    </button>
  );
}
