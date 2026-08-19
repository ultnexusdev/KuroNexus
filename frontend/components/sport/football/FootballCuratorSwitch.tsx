"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import styles from "./FootballCuratorSwitch.module.css";

/**
 * Kulüp sayfasının küratör modu anahtarı.
 *
 * Kanattaki `SportCuratorSwitch` deseninin aynısı ve aynı gerekçeyle:
 * kulüp sayfası saf SUNUCU bileşeni ve öyle kalmalı. Bütün sayfayı
 * `"use client"` yapmak, bir düğme uğruna ziyaretçiye sayfanın tamamını
 * JavaScript olarak indirmek olurdu.
 *
 * Panel `next/dynamic` ile yalnızca mod açılınca iniyor; ziyaretçi bu dosyayı
 * hiç almıyor çünkü sunucu `isAdmin` false iken bileşeni RENDER ETMİYOR.
 *
 * ⚠️ `isAdmin` YALNIZCA DÜĞMEYİ gösteriyor — yetkinin kapısı backend'de.
 */
const LineupCurator = dynamic(
  () => import("./LineupCurator").then((mod) => mod.LineupCurator),
  { ssr: false },
);

export function FootballCuratorSwitch() {
  const t = useTranslations("sportArchive.live.eleven");
  const [curating, setCurating] = useState(false);

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={curating ? styles.on : styles.off}
        aria-pressed={curating}
        aria-expanded={curating}
        onClick={() => setCurating((value) => !value)}
      >
        {curating ? t("curatorOff") : t("curatorOn")}
      </button>

      {curating ? <LineupCurator /> : null}
    </div>
  );
}
