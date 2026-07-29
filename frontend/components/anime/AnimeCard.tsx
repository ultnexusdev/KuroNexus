"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ArchiveAnime } from "@/lib/api/types";
import { daysUntil } from "@/lib/anime/filters";
import styles from "./AnimeHall.module.css";

// Küratör kontrolleri yalnızca mod açıkken iner — ziyaretçi bu JS'i almaz
const CuratorCardTools = dynamic(
  () => import("./AnimeCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);

/** Kapak; künye gelmemişse başlığın kendisi posterin yerini tutar. */
export function Cover({ anime, sizes }: { anime: ArchiveAnime; sizes: string }) {
  if (!anime.coverImage) {
    return (
      <span className={styles.coverFallback}>
        <span>{anime.title}</span>
      </span>
    );
  }
  return (
    <Image
      src={anime.coverImage}
      alt=""
      fill
      sizes={sizes}
      className={styles.coverImg}
      unoptimized
    />
  );
}

/**
 * Yayın durumu rozeti — **benim durumumdan ayrı eksen**. Renk token'lardan
 * gelir (kural 16): parlayan neon yok, düşük doygunluklu üç ton.
 */
export function AiringBadge({ anime }: { anime: ArchiveAnime }) {
  const t = useTranslations("anime");
  const state = anime.airingState;
  const className =
    state === "RELEASING"
      ? styles.badgeAiring
      : state === "UPCOMING"
        ? styles.badgeUpcoming
        : state === "HIATUS" || state === "CANCELLED"
          ? styles.badgePaused
          : styles.badgeFinished;

  return <span className={className}>{t(`airing.${state}`)}</span>;
}

/**
 * Seri kartı. Tek bakışta üç şey okunmalı: **nerede kaldım**, **devam ediyor
 * mu**, **sırada ne var**. Sezon bilgisi altta ("S2 · 14/23") çünkü ilerleme
 * part'ın özelliği — seride tek bir sayı yok.
 */
export function AnimeCard({
  anime,
  curating,
}: {
  anime: ArchiveAnime;
  curating: boolean;
}) {
  const t = useTranslations("anime");
  const part = anime.currentPart;
  const total = part?.episodes ?? null;
  const watched = part?.watchedEpisodes ?? 0;
  const percent =
    total && total > 0 ? Math.min(100, Math.round((watched / total) * 100)) : 0;
  const days = daysUntil(anime.nextAiringAt);
  const rating = anime.personalRating ?? (anime.averageScore ? anime.averageScore / 10 : null);

  return (
    <article className={styles.card}>
      <div className={styles.coverWrap}>
        <Cover
          anime={anime}
          sizes="(max-width: 640px) 45vw, (max-width: 1100px) 23vw, 15vw"
        />
        {anime.isFavorite ? (
          <span className={styles.favoriteMark} aria-label={t("favorite")}>
            ★
          </span>
        ) : null}
      </div>

      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>{anime.title}</h3>
        <AiringBadge anime={anime} />
      </div>

      {part ? (
        <p className={styles.cardProgress}>
          <span className={styles.partName}>
            {partLabel(part.title, anime.title)}
          </span>
          <span className={styles.partCount}>
            {total
              ? t("episodeOf", { watched, total })
              : t("episodeCount", { watched })}
          </span>
        </p>
      ) : null}

      {/* İlerleme çubuğu yalnızca bölüm sayısı bilinen yapımlarda anlamlı */}
      {total ? (
        <span className={styles.progressBar} aria-hidden>
          <span className={styles.progressFill} style={{ width: `${percent}%` }} />
        </span>
      ) : null}

      <p className={styles.cardMeta}>
        {anime.startYear ? <span>{anime.startYear}</span> : null}
        {days !== null ? (
          <span className={styles.countdown}>
            {t("nextInDays", { count: days, episode: anime.nextEpisode ?? 0 })}
          </span>
        ) : null}
        {rating ? (
          <span className={styles.cardRating}>{rating.toFixed(1)}</span>
        ) : null}
      </p>

      {curating ? <CuratorCardTools anime={anime} /> : null}
    </article>
  );
}

/**
 * Sezon adı seri adını tekrar etmesin: "Jujutsu Kaisen 2nd Season" kartın
 * altında "2nd Season" olarak okunur. Tek sezonluk yapımlarda (One Piece)
 * parça adı serinin adıyla aynıdır — o zaman hiç yazılmaz, başlık zaten
 * kartın üstünde duruyor.
 */
function partLabel(partTitle: string, seriesTitle: string): string {
  if (partTitle === seriesTitle) {
    return "";
  }
  const trimmed = partTitle.replace(seriesTitle, "").trim();
  return trimmed.length > 0 ? trimmed.replace(/^[:·\-–]\s*/, "") : partTitle;
}
