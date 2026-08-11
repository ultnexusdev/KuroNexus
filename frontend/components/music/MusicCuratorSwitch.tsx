"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import styles from "./MusicCurator.module.css";

/**
 * Küratör modu anahtarı — Salon 06 · Müzik.
 *
 * ── NEDEN SAYFA İSTEMCİYE ÇEVRİLMEDİ ──────────────────────────────────────
 * Kitap salonunda kabuk (`BookHall`) baştan sona istemci bileşeni, çünkü orada
 * süzgeçler/sıralama zaten istemcide. Müzik sayfaları saf sunucu bileşeni ve
 * öyle kalmaları gerekiyor: içlerinde süzgeç yok, hepsi tek istekten çizilen
 * okuma yolları. Bütün sayfayı "use client" yapmak küratör düğmesi uğruna
 * ziyaretçiye tüm salon ağacını JavaScript olarak indirmek olurdu.
 *
 * Onun yerine bu ada: sayfada sadece bu düğme istemci, panel `next/dynamic`
 * ile mod açılınca iniyor. Ziyaretçi bu dosyayı hiç almıyor — sunucu `isAdmin`
 * false iken bileşeni RENDER ETMİYOR, dolayısıyla parçası istenmiyor.
 *
 * ⚠️ `isAdmin` yalnızca düğmeyi gösteriyor. Yetkinin gerçek kapısı backend:
 * bütün küratör uçları `@Roles('ADMIN')` arkasında ve çerezdeki token her
 * istekte doğrulanıyor.
 */

/** Salon paneli — yalnızca mod açılınca indirilir */
const HallCurator = dynamic(
  () => import("./MusicCurator").then((mod) => mod.HallCurator),
  { ssr: false },
);

/** Sanatçı paneli — aynı dosyadan, aynı tembellikle */
const ActCurator = dynamic(
  () => import("./MusicCurator").then((mod) => mod.ActCurator),
  { ssr: false },
);

export interface CuratorAct {
  id: string;
  slug: string;
  name: string;
  actKind: string;
  bio: string | null;
  formedYear: number | null;
  disbandedYear: number | null;
  originCity: string | null;
  originCountry: string | null;
  bannerImage: string | null;
  spotifyId: string | null;
  genreSlugs: string[];
}

export function MusicCuratorSwitch(
  props: { scope: "hall" } | { scope: "act"; act: CuratorAct },
) {
  const t = useTranslations("music.curator");
  const [curating, setCurating] = useState(false);

  return (
    <div className={styles.switchRow}>
      <button
        type="button"
        className={curating ? styles.switchOn : styles.switchOff}
        aria-pressed={curating}
        aria-expanded={curating}
        onClick={() => setCurating((value) => !value)}
      >
        {curating ? t("off") : t("on")}
      </button>

      {curating ? (
        props.scope === "hall" ? (
          <HallCurator />
        ) : (
          <ActCurator act={props.act} />
        )
      ) : null}
    </div>
  );
}
