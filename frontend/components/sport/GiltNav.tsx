"use client";

import { useEffect, useState } from "react";
import styles from "./GiltNav.module.css";

export interface GiltNavSection {
  id: string;
  label: string;
}

/**
 * Yaldızlı kenar indeksi — GS salonunun sol sütunu.
 * Bölümleri IntersectionObserver ile izler, görünür olanı işaretler.
 * Numaralar dikey yazılır (kapı adları deseni), aktif olan altın renge döner.
 */
export function GiltNav({ sections }: { sections: GiltNavSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Ekranda en yukarıda duran görünür bölüm aktif sayılır
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Üst şerit: başlık ekranın üst üçte birine girince aktifleşir
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className={styles.nav} aria-label="Bölümler">
      <ol className={styles.list}>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={styles.item}
              data-active={active === s.id ? "true" : undefined}
              aria-current={active === s.id ? "true" : undefined}
            >
              <span className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.label}>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
