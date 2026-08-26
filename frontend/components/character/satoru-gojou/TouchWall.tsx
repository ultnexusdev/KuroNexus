"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionSafe } from "./useMotionSafe";
import styles from "./GojoExperience.module.css";

/**
 * P10 · GÖRÜNMEZ DUVAR — dokunma denemesi.
 *
 * ══ NE YAPIYOR ════════════════════════════════════════════════════════
 * İmleç (ya da parmak) bariyerin merkezine yaklaştıkça iki şey oluyor:
 *   · `--reach` büyüyor → çarpışma halkası ve deformasyon beliriyor
 *   · kalan mesafe sayacı YARIYA İNİYOR ve asla sıfırlanmıyor
 * Birkaç denemeden sonra "Infinity seni durdurdu." satırı çıkıyor.
 *
 * ══ ZENO TUTARLILIĞI ══════════════════════════════════════════════════
 * Sayaç P03'ün dizisini sürdürüyor: her deneme kalan mesafeyi yarıya
 * bölüyor (`d / 2ⁿ`). Sayı küçülüyor, sıfır olmuyor. İki bölüm aynı
 * matematiği paylaşıyor çünkü aynı şeyi anlatıyorlar — burada ekranda
 * `0.00001cm` gibi bir değer görünüyor ama tam sıfır HİÇ görünmüyor.
 *
 * ══ GÜVENLİK ══════════════════════════════════════════════════════════
 * ⚠️ İMLEÇ GİZLENMİYOR, yakalanmıyor, taşınmıyor. Hiçbir olay
 * `preventDefault` edilmiyor. Dinleyiciler `window`a DEĞİL yalnızca
 * bölümün kendi kutusuna bağlı — etkileşim sayfa geneline taşmıyor
 * (brief şartı). Kullanıcı her an scroll ile çıkabiliyor.
 *
 * ⚠️ Dokunmatikte `touch-action: pan-y` (CSS): parmak dikeyde sayfayı
 * kaydırmaya devam ediyor, yalnızca yatay sürükleme okunuyor. Yani
 * bölüm parmağı hiçbir zaman esir almıyor.
 *
 * ══ REDUCED-MOTION ════════════════════════════════════════════════════
 * Bileşen hiç bağlanmıyor. Kayıp yok: bölümün düz metin karşılığı o
 * modda `sr-only` olmaktan çıkıp GÖRÜNÜR hâle geliyor (CSS).
 */

/** Bariyerin sınırı sayılan yarıçap oranı (kutunun kısa kenarına göre). */
const BARRIER = 0.5;

/** Kaç denemeden sonra kapanış satırı çıkıyor. */
const ATTEMPTS_UNTIL_MESSAGE = 3;

/** Başlangıç mesafesi (cm) — her deneme bunu yarıya bölüyor. */
const START_CM = 1;

/** Sayacın gösterileceği en küçük değer; altına inince gösterim sabitleniyor. */
const MIN_CM = 0.00001;

export function TouchWall({
  distanceLabel,
  attemptsLabel,
  stoppedLabel,
  hintPointer,
  hintTouch,
  triggerLabel,
}: {
  distanceLabel: string;
  attemptsLabel: string;
  stoppedLabel: string;
  hintPointer: string;
  hintTouch: string;
  triggerLabel: string;
}) {
  const { reducedMotion, coarsePointer } = useMotionSafe();
  const [armed, setArmed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [distance, setDistance] = useState(START_CM);

  /* İmleç sınırın içinde mi? Aynı yaklaşmayı iki kez saymamak için. */
  const inside = useRef(false);

  useEffect(() => {
    if (!armed || reducedMotion) return;
    const field = document.querySelector<HTMLElement>("[data-gojo-touch]");
    if (!field) return;

    /* ⚠️ Dinleyiciler yalnızca BU kutuda. `window`a bağlanmıyor. */
    function onMove(event: PointerEvent) {
      const box = field!.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const radius = (Math.min(box.width, box.height) / 2) * BARRIER;
      const dist = Math.hypot(event.clientX - cx, event.clientY - cy);

      /* 0 (uzak) → 1 (sınırda). Sınırın İÇİNE geçilemiyor: değer 1'de
         doyuyor, imleç serbestçe hareket etmeye devam ediyor. */
      const reach = radius > 0 ? Math.max(0, Math.min(1, 1 - dist / radius)) : 0;
      field!.style.setProperty("--reach", reach.toFixed(3));

      if (reach > 0.82 && !inside.current) {
        inside.current = true;
        setAttempts((n) => n + 1);
        /* Zeno: kalan mesafeyi yarıya böl, sıfıra indirme. */
        setDistance((d) => Math.max(MIN_CM, d / 2));
      } else if (reach < 0.5) {
        inside.current = false;
      }
    }

    function onLeave() {
      field!.style.setProperty("--reach", "0");
      inside.current = false;
    }

    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerleave", onLeave);
    field.addEventListener("pointercancel", onLeave);

    return () => {
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
      field.removeEventListener("pointercancel", onLeave);
      /* Sökülürken yazdığını geri al. */
      field.style.removeProperty("--reach");
    };
  }, [armed, reducedMotion]);

  const arm = useCallback(() => setArmed(true), []);

  if (reducedMotion) return null;

  /* `0.00001cm` biçimi — brief'in istediği sayaç görünümü. */
  const shown =
    distance <= MIN_CM ? MIN_CM.toFixed(5) : distance.toFixed(5);

  return (
    <>
      {armed ? (
        <>
          <p className={styles.touchReadout}>
            <span>
              {distanceLabel}{" "}
              <span className={styles.touchDistance}>{shown}cm</span>
            </span>
            <span>
              {attemptsLabel} {attempts}
            </span>
          </p>
          {/* `role="status"`: kapanış satırı ekran okuyucuya da
              bildiriliyor. */}
          <p className={styles.touchStopped} role="status">
            {attempts >= ATTEMPTS_UNTIL_MESSAGE ? stoppedLabel : ""}
          </p>
        </>
      ) : (
        <>
          <button type="button" className={styles.touchTrigger} onClick={arm}>
            {triggerLabel}
          </button>
          <p className={styles.touchHint}>
            {coarsePointer ? hintTouch : hintPointer}
          </p>
        </>
      )}
    </>
  );
}
