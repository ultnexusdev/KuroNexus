"use client";

import { useEffect } from "react";
import { useSixEyes } from "./SixEyesProvider";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · MOD DÜĞMESİ.
 *
 * ── NEDEN `aria-pressed`, `role="switch"` DEĞİL ──────────────────────────
 * İkisi de geçerli, ama `aria-pressed` daha az sürprizli: `switch` rolü
 * bazı ekran okuyucu/tarayıcı çiftlerinde "açık/kapalı" yerine düğmenin
 * adını yutarak okuyor. Basılı-düğme deseni her yerde aynı okunuyor.
 *
 * Düğmenin ADI moda göre DEĞİŞMİYOR ("Six Eyes"), değişen yalnızca basılı
 * olup olmadığı. Adı da değiştirmek ekran okuyucuda "Six Eyes açık" →
 * "Gözbağı, basılı değil" gibi iki ayrı şey söyletirdi.
 *
 * ── `S` KISAYOLU ─────────────────────────────────────────────────────────
 * BRIEF · P11 easter egg listesinin ilk maddesi. Yazı yazılan bir alan
 * odaktayken devre dışı — yoksa arama kutusuna "s" yazan biri sayfanın
 * modunu değiştirirdi. Değiştirici tuşlarla birlikte de çalışmıyor
 * (`Ctrl+S` kaydetme, `Cmd+S` aynı).
 *
 * Kısayolun ekran okuyucu karşılığı sayfadaki `sr-only` kısayol listesinde
 * (BRIEF · erişilebilirlik: erişilemez içerik kalmaz).
 */

/** Yazı yazılan bir alan odakta mı? */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function SixEyesToggle({
  label,
  onLabel,
  offLabel,
  keyHint,
}: {
  /** Düğmenin sabit adı — moda göre değişmez */
  label: string;
  /** Yalnızca görsel durum yazısı */
  onLabel: string;
  offLabel: string;
  /** `S` ipucu; dokunmatikte CSS gizliyor */
  keyHint: string;
}) {
  const { sixEyes, toggle } = useSixEyes();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "s" && event.key !== "S") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      toggle();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={sixEyes}
      onClick={toggle}
    >
      <span className={styles.toggleTrack} aria-hidden="true">
        <span className={styles.toggleThumb} />
      </span>
      <span className={styles.toggleText}>{label}</span>
      {/* Durum yazısı GÖRSEL: `aria-pressed` zaten aynı bilgiyi taşıyor,
          iki kere okutmamak için ekran okuyucudan gizli. */}
      <span className={styles.toggleText} aria-hidden="true">
        {sixEyes ? onLabel : offLabel}
      </span>
      <span className={styles.toggleKey} aria-hidden="true">
        {keyHint}
      </span>
    </button>
  );
}
