"use client";

import { useCallback, useEffect, useState } from "react";
import { JJK_ANCHORS } from "@/lib/anime/jjk/anchors";
import styles from "./KanjiRail.module.css";

/**
 * KANJİ RAYI — sayfanın imza gezinme elemanı (mockup'ın sağ rayı).
 *
 * On bir sekme: kanji + çevrilen ad. Scroll-spy Bleach `DepthRail`
 * deseninin aynısı — görünür alanın ORTASINDA sıfır yükseklikte bant
 * (`rootMargin: -50%/-50%`), çünkü ekrandan uzun bölümlerde `threshold`
 * asla dolmaz (oradaki ölçüm). Aynı anda en fazla bir bölüm bandı keser.
 *
 * Dar ekranda ray alt kenara iner (kullanıcı kararı): yatay kayan şerit,
 * yalnızca kanji.
 */
export function KanjiRail({
  labels,
  ariaLabel,
}: {
  /** anchor → çevrilen ad (`anime.jjk.toc` sözlüğünden sunucuda kurulur) */
  labels: Record<string, string>;
  ariaLabel: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = JJK_ANCHORS.map((a) => document.getElementById(a.anchor)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const jump = useCallback((anchor: string) => {
    const section = document.getElementById(anchor);
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    section.focus({ preventScroll: true });
  }, []);

  return (
    <nav className={styles.rail} aria-label={ariaLabel}>
      <ol className={styles.list}>
        {JJK_ANCHORS.map((anchor) => (
          <li key={anchor.anchor}>
            <button
              type="button"
              className={styles.tab}
              data-on={active === anchor.anchor ? "" : undefined}
              aria-current={active === anchor.anchor ? "true" : undefined}
              onClick={() => jump(anchor.anchor)}
            >
              <span className={styles.kanji} lang="ja" aria-hidden="true">
                {anchor.kanji}
              </span>
              <span className={styles.name}>{labels[anchor.key] ?? anchor.key}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
