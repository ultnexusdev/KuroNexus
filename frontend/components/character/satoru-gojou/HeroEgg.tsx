"use client";

import { useCallback, useRef, useState } from "react";
import { useDiscovery } from "./DiscoveryProvider";
import styles from "./GojoExperience.module.css";

/**
 * P11 · HERO'DAKİ İŞARET — altı tıklama.
 *
 * Altı. Rikugan'ın altısı. Sayı tesadüf değil ve keşif kaydındaki notu da
 * bunu söylüyor.
 *
 * ⚠️ KLAVYEYLE DE ÇALIŞIYOR. Gerçek bir `<button>` olduğu için `Enter` ve
 * `Space` tıklama sayılıyor — yani altı kez tuşlamak da keşfi açıyor.
 * "Sadece fareyle bulunabilen" bir egg erişilebilirlik şartını çiğnerdi.
 *
 * ⚠️ `aria-label` ne olduğunu söylemiyor ("gizli işaret"), yalnızca orada
 * bir şey olduğunu. Keşif korunuyor, erişim korunuyor.
 */

/** Kaç tıklama gerekiyor — Rikugan'ın altısı. */
const NEEDED = 6;

export function HeroEgg({ label }: { label: string }) {
  const { found, discover } = useDiscovery();
  const [count, setCount] = useState(0);
  const done = useRef(false);

  const isFound = found.has("hero");

  const onClick = useCallback(() => {
    if (done.current || isFound) return;
    setCount((current) => {
      const next = current + 1;
      if (next >= NEEDED) {
        done.current = true;
        discover("hero");
      }
      return next;
    });
  }, [discover, isFound]);

  return (
    <button
      type="button"
      className={`${styles.egg} ${styles.eggRight}`}
      data-found={isFound ? "1" : undefined}
      aria-label={label}
      aria-pressed={isFound}
      onClick={onClick}
    >
      <span className={styles.eggMark} aria-hidden="true">
        {isFound ? "六" : "·"}
      </span>
      {/* Sayaç yalnızca görsel değil: ekran okuyucu da ilerlemeyi
          duyuyor, yoksa altı kez basmanın bir şey yaptığı anlaşılmazdı. */}
      <span className={styles.srOnly}>
        {isFound ? `${NEEDED} / ${NEEDED}` : `${count} / ${NEEDED}`}
      </span>
    </button>
  );
}
