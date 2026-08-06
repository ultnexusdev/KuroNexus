"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./SpoilerReveal.module.css";

/**
 * Dış kaynaktan gelen metnin spoiler'lı parçası için kapı.
 *
 * `wiki/SpoilerGate` neden kullanılmadı: o bileşen bir **evrene** ve o evren
 * için seçilmiş spoiler seviyesine bağlı çalışıyor (`spoilerTier`, cookie).
 * AniList açıklamalarında seviye kavramı yok — elde tek bilgi var, "bu parça
 * hikâyeyi ele veriyor". Oraya sahte bir tier uydurmak, wiki tarafındaki
 * gerçek seviyelerin anlamını bozardı.
 *
 * Varsayılan **kapalı** ve açan şey butonun kendisi; bloğun tamamı tıklanabilir
 * olsaydı mobilde kaydırırken yanlışlıkla açılırdı (AGENTS.md kural 2).
 */
export function SpoilerReveal({ children }: { children: React.ReactNode }) {
  const t = useTranslations("character.spoiler");
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <div className={styles.revealed}>
        <span className={styles.hint}>{t("mark")}</span>
        {children}
      </div>
    );
  }

  return (
    <div className={styles.gate}>
      <p className={styles.warning}>{t("warning")}</p>
      <button
        type="button"
        className={styles.reveal}
        onClick={() => setRevealed(true)}
      >
        {t("reveal")}
      </button>
    </div>
  );
}
