"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import styles from "./SportCurator.module.css";
import { CuratorDock } from "@/components/curated/CuratorDock";

/**
 * Küratör modu anahtarı — Salon 06 · Spor.
 *
 * Müzik kanadındaki `MusicCuratorSwitch` deseninin aynısı ve aynı gerekçeyle:
 * spor sayfaları saf SUNUCU bileşeni ve öyle kalmalı. Bütün sayfayı
 * `"use client"` yapmak, küratör düğmesi uğruna ziyaretçiye tüm spor ağacını
 * JavaScript olarak indirmek olurdu.
 *
 * Panel `next/dynamic` ile yalnızca mod açılınca iniyor. Ziyaretçi bu dosyayı
 * hiç almıyor — sunucu `isAdmin` false iken bileşeni RENDER ETMİYOR.
 *
 * ⚠️ `isAdmin` YALNIZCA DÜĞMEYİ GÖSTERİYOR. Yetkinin gerçek kapısı backend:
 * bütün küratör uçları `@Roles('ADMIN')` arkasında ve çerezdeki token her
 * istekte doğrulanıyor. Bu bileşeni elle render etmek hiçbir kapı açmaz.
 */
const SportCurator = dynamic(
  () => import("./SportCurator").then((mod) => mod.SportCurator),
  { ssr: false },
);

export function SportCuratorSwitch() {
  const t = useTranslations("sportArchive.curator");
  const [curating, setCurating] = useState(false);

  return (
    <div className={styles.switchRow}>
      <CuratorDock
        on={curating}
        onToggle={() => setCurating((value) => !value)}
        label={curating ? t("off") : t("on")}
        expanded={curating}
      />

      {curating ? <SportCurator /> : null}
    </div>
  );
}
