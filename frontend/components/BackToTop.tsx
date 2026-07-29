"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./BackToTop.module.css";

/**
 * "En üste git" düğmesi.
 *
 * Uzun listelerde (film ve anime rafları) "Daha fazla" her basışta bir sayfa
 * daha ekliyor; sayfa büyüdükçe başa dönmek eziyet oluyordu. Düğme yalnızca
 * bir ekran boyu kaydırıldıktan sonra beliriyor — kısa sayfalarda hiç
 * görünmüyor, boşuna yer kaplamıyor.
 */

// Kaç piksel kaydırınca belirir: bir ekran boyu iyi bir eşik
const SHOW_AFTER_PX = 700;

export function BackToTop() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.button}
      title={t("backToTop")}
      onClick={() =>
        window.scrollTo({
          top: 0,
          // Kullanıcı hareketi kısıtlamışsa anında zıplar (kural 2 ruhu)
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
    >
      <span aria-hidden>↑</span>
      <span className={styles.label}>{t("backToTop")}</span>
    </button>
  );
}
