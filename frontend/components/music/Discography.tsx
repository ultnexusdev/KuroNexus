"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { musicHref } from "@/lib/music/routes";
import { CoverTile } from "./CoverArt";
import styles from "./Discography.module.css";

/**
 * Diskografi ızgarası.
 *
 * ── İKİ ÖLÇÜLMÜŞ SORUN, İKİSİ DE KULLANICI BİLDİRİMİ ──────────────────────
 * 1. **Kapaklar çok büyüktü.** Izgara geniş ekranda 5 sütuna çıkıyordu ama
 *    orta bantta (620–1000 px) 3'te kalıyordu ve 63 albümlük bir diskografi
 *    yirmi bir sıra sürüyordu. Sütunlar sıklaştırıldı: 3 / 4 / 6.
 * 2. **Hepsi birden çiziliyordu.** Sanatçı sayfasının yarısını tek bir bölüm
 *    yiyordu. İlk `INITIAL` kadarı görünüyor, kalanı düğmeyle açılıyor.
 *
 * Neden `<details>` değil de düğme: açılan kısım ızgaranın DEVAMI, ayrı bir
 * blok değil. `details` içine koymak ilk sıralarla sonrakiler arasında bir
 * kesme çizgisi bırakıyordu.
 */

/** İlk açılışta görünen albüm sayısı — geniş ekranda iki tam sıra. */
const INITIAL = 12;

export interface DiscographyAlbum {
  slug: string;
  title: string;
  artwork: string | null;
  releaseDate: string | null;
}

export function Discography({
  actSlug,
  albums,
}: {
  actSlug: string;
  albums: DiscographyAlbum[];
}) {
  const t = useTranslations("music.act");
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? albums : albums.slice(0, INITIAL);
  const hidden = albums.length - shown.length;

  return (
    <>
      <ul className={styles.grid}>
        {shown.map((album) => (
          <li key={album.slug} className={styles.cell}>
            <Link
              href={musicHref.album(actSlug, album.slug)}
              className={styles.link}
            >
              {/* `cellPx` yalnızca `sizes` için ölçülen tipik genişlik: 6
                  sütunlu ızgarada hücre 1600px kapsayıcıda ~240px, 1280'de
                  ~190px. 240 yazmak dar ekranda fazladan piksel indirmiyor
                  (kapaklar zaten 300px kaynak). */}
              <CoverTile src={album.artwork} alt={album.title} cellPx={240} />
              <span className={styles.title}>{album.title}</span>
              <span className={styles.year}>
                {album.releaseDate
                  ? new Date(album.releaseDate).getUTCFullYear()
                  : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {hidden > 0 ? (
        <button
          type="button"
          className={styles.more}
          onClick={() => setExpanded(true)}
        >
          {t("showAll", { count: hidden })}
        </button>
      ) : null}

      {expanded && albums.length > INITIAL ? (
        <button
          type="button"
          className={styles.more}
          onClick={() => setExpanded(false)}
        >
          {t("showLess")}
        </button>
      ) : null}
    </>
  );
}
