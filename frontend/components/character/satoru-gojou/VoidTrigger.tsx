"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useMotionSafe } from "./useMotionSafe";
import styles from "./GojoExperience.module.css";

/**
 * P05 · SEKANSIN TETİKLEYİCİSİ.
 *
 * ⚠️ OTOMATİK AÇILMIYOR. Yalnızca bu düğme ya da `D` kısayolu açıyor,
 * istenildiği kadar tekrar oynatılabiliyor.
 *
 * ── REDUCED-MOTION: HİÇ BAĞLANMIYOR ──────────────────────────────────────
 * Hareket azaltılmışsa ne düğme çiziliyor ne de kısayol bağlanıyor —
 * sekansın açılmasının hiçbir yolu kalmıyor. Bilgi kaybı yok: sekansın
 * taşıdığı her şey bölümün statik panosunda zaten duruyor (alan adı,
 * gövde metni, akan parçaların tam listesi, göz kadrajı).
 *
 * ── SEKANS AYRI PARÇA ────────────────────────────────────────────────────
 * `ssr: false` + `next/dynamic`: sekans sunucu çıktısında hiç yok ve
 * ancak ilk kez açıldığında iniyor. Bölümün statik panosu ondan tamamen
 * bağımsız.
 */
const VoidSequence = dynamic(
  () => import("./VoidSequence").then((mod) => mod.VoidSequence),
  { ssr: false },
);

/** Yazı yazılan bir alan odakta mı? */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function VoidTrigger({
  label,
  hint,
  kanji,
  kanjiGloss,
  freezeLine,
  skipLabel,
  escapeLabel,
  fragments,
}: {
  label: string;
  hint: string;
  kanji: string;
  kanjiGloss: string;
  freezeLine: string;
  skipLabel: string;
  escapeLabel: string;
  fragments: ReadonlyArray<{ text: string; lang: string | null }>;
}) {
  const { reducedMotion } = useMotionSafe();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (reducedMotion) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "d" && event.key !== "D") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      /* Zaten açıksa yeniden tetiklemiyor: üst üste binen iki sekans
         flaş limitini bozardı. */
      setOpen((current) => current || true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <button
        type="button"
        className={styles.voidTrigger}
        onClick={() => setOpen(true)}
      >
        {label}
        <span className={styles.voidTriggerHint}>{hint}</span>
      </button>

      {open ? (
        <VoidSequence
          open={open}
          onClose={close}
          kanji={kanji}
          kanjiGloss={kanjiGloss}
          freezeLine={freezeLine}
          skipLabel={skipLabel}
          escapeLabel={escapeLabel}
          fragments={fragments}
        />
      ) : null}
    </>
  );
}
