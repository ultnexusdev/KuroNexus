"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ArchiveAnime } from "@/lib/api/types";
import { daysUntil } from "@/lib/anime/filters";
import styles from "./AnimeHall.module.css";

// Küratör kontrolleri yalnızca mod açıkken iner — ziyaretçi bu JS'i almaz
const CuratorCardTools = dynamic(
  () => import("./AnimeCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);
const EpisodeInput = dynamic(
  () => import("./AnimeCurator").then((mod) => mod.EpisodeInput),
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

  const href = `/dark-stories/category/anime/${anime.slug}`;

  return (
    <article className={styles.card}>
      {/* Kapak ve başlık anime sayfasına açılır */}
      <Link href={href} className={styles.coverLink}>
        <span className={styles.coverWrap}>
          <Cover
            anime={anime}
            sizes="(max-width: 640px) 45vw, (max-width: 1100px) 23vw, 15vw"
          />
          {anime.isFavorite ? (
            <span className={styles.favoriteMark} aria-label={t("favorite")}>
              ★
            </span>
          ) : null}
        </span>
      </Link>

      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>
          <Link href={href} className={styles.titleLink}>
            {anime.title}
          </Link>
        </h3>
        <AiringBadge anime={anime} />
      </div>

      {part ? (
        <p className={styles.cardProgress}>
          <span className={styles.partName}>
            {partLabel(part.title, anime.title)}
          </span>
          {/* Küratör modunda sayaç tıklanınca elle bölüm girilebilir */}
          {curating ? (
            <EpisodeInput part={part} />
          ) : (
            <span className={styles.partCount}>
              {total
                ? t("episodeOf", { watched, total })
                : t("episodeCount", { watched })}
            </span>
          )}
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
 * Sezon adı seri adını tekrar etmesin: "Jujutsu Kaisen Season 2" kartın
 * altında "Season 2" olarak okunur. Tek sezonluk yapımlarda parça adı serinin
 * adıyla aynıdır — o zaman hiç yazılmaz, başlık zaten kartın üstünde.
 *
 * Kırpma yalnızca kalan parça gerçekten bir **sezon işareti** ise yapılır:
 * canlıda "Naruto, the Genie, and the Three Wishes, Believe It!" başlığı
 * körlemesine kırpılınca kartta ", the Genie, and the Three Wishes…" diye
 * başlayan bir artık kalıyordu.
 */
const SEASON_MARK =
  /^(season\s*\d+|s\d+\b|part\s*\d+|\d+(st|nd|rd|th)\s+season|final\s+season|movie\b)/i;

function partLabel(partTitle: string, seriesTitle: string): string {
  if (partTitle === seriesTitle) {
    return "";
  }
  if (!partTitle.startsWith(seriesTitle)) {
    return partTitle;
  }
  const rest = partTitle.slice(seriesTitle.length).trim().replace(/^[:·\-–]\s*/, "");
  return SEASON_MARK.test(rest) ? rest : partTitle;
}
