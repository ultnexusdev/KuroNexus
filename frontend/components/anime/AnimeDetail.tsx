"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { fetchPartEpisodes } from "@/lib/api/anime";
import type {
  AnimeCharacter,
  AnimeLink,
  AnimeLinkKind,
  ArchiveAnime,
  ArchiveAnimePart,
  PartEpisodes,
} from "@/lib/api/types";
import { daysUntil } from "@/lib/anime/filters";
import { AiringBadge } from "./AnimeCard";
import styles from "./AnimeDetail.module.css";
import { CuratorDock } from "@/components/curated/CuratorDock";
import { animeHref } from "@/lib/anime/routes";

/**
 * Anime sayfası.
 *
 * Üç katman: künye (banner + iki eksen rozet + "nerede kaldım"), **izleme
 * sırası** (her sezonun kendi posteriyle zaman çizelgesi) ve seçili sezonun
 * **bölüm ızgarası** (filler bölümler işaretli).
 *
 * Bölüm listeleri sayfa açılışında değil, sezon açıldığında çekilir: her
 * sezon ayrı bir Jikan isteği demek ve o kaynak yavaş/kırılgan.
 */

/* Küratör panelleri yalnızca küratör modunda iniyor (BookDetail deseni,
   2026-09-01 denetimi P-02): statik import edilselerdi `lib/admin/api` ile
   birlikte her ziyaretçinin chunk'ına girerlerdi. */
const CuratorDossier = dynamic(
  () => import("./AnimeDetailCurator").then((mod) => mod.CuratorDossier),
  { ssr: false },
);
const PartTools = dynamic(
  () => import("./AnimeDetailCurator").then((mod) => mod.PartTools),
  { ssr: false },
);

export function AnimeDetail({
  anime,
  characters,
  isAdmin = false,
}: {
  anime: ArchiveAnime;
  characters: AnimeCharacter[];
  isAdmin?: boolean;
}) {
  const t = useTranslations("anime");
  const parts = anime.parts;
  const [openPartId, setOpenPartId] = useState<string | null>(
    anime.currentPart?.id ?? parts[0]?.id ?? null,
  );
  // Kunye formu ve bolum isaretleme yalnizca kurator modunda: sayfa okuma
  // ekrani olarak acilir, duzenleme anahtarla istenir (film sayfasindaki desen)
  const [curating, setCurating] = useState(false);
  const editing = isAdmin && curating;
  const days = daysUntil(anime.nextAiringAt);
  const resume = mangaResume(anime);

  return (
    <div data-category="anime" className={styles.page}>
      {anime.bannerImage ? (
        <div className={styles.banner}>
          <Image
            src={anime.bannerImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.bannerImg}
            unoptimized
          />
          <div className={styles.bannerFade} />
        </div>
      ) : null}

      <div className={styles.inner}>
        <div className={styles.topBar}>
          <Link
            href={animeHref.archive()}
            className={styles.back}
          >
            {t("backToHall")}
          </Link>

          {isAdmin ? (
            <CuratorDock
              on={curating}
              onToggle={() => setCurating((value) => !value)}
              label={curating ? t("curator.on") : t("curator.off")}
            />
          ) : null}
        </div>

        <header className={styles.head}>
          {anime.coverImage ? (
            <div className={styles.cover}>
              <Image
                src={anime.coverImage}
                alt=""
                fill
                sizes="200px"
                className={styles.coverImg}
                unoptimized
              />
            </div>
          ) : null}

          <div className={styles.headText}>
            <div className={styles.badges}>
              <AiringBadge anime={anime} />
              <span className={styles.myStatus}>
                {t(`curator.statusName.${anime.status}`)}
              </span>
              {anime.isFavorite ? (
                <span className={styles.favorite}>★ {t("favorite")}</span>
              ) : null}
            </div>

            <h1 className={styles.title}>{anime.title}</h1>
            {anime.titleNative ? (
              <p className={styles.native}>{anime.titleNative}</p>
            ) : null}

            <dl className={styles.facts}>
              {anime.startYear ? (
                <div>
                  <dt>{t("detail.year")}</dt>
                  <dd>{anime.startYear}</dd>
                </div>
              ) : null}
              <div>
                <dt>{t("detail.seasons")}</dt>
                <dd>{t("detail.partCount", { count: parts.length })}</dd>
              </div>
              {anime.averageScore ? (
                <div>
                  <dt>{t("detail.score")}</dt>
                  <dd>{(anime.averageScore / 10).toFixed(1)}</dd>
                </div>
              ) : null}
              {anime.personalRating ? (
                <div>
                  <dt>{t("detail.myScore")}</dt>
                  <dd>{anime.personalRating.toFixed(1)}</dd>
                </div>
              ) : null}
            </dl>

            {/* "Nerede kalmıştım" — sayfanın en çok bakılan satırı */}
            {anime.currentPart ? (
              <p className={styles.resume}>
                <span className={styles.resumeLabel}>{t("detail.resume")}</span>
                <strong>{anime.currentPart.title}</strong>
                <span>
                  {anime.currentPart.episodes
                    ? t("episodeOf", {
                        watched: anime.currentPart.watchedEpisodes,
                        total: anime.currentPart.episodes,
                      })
                    : t("episodeCount", {
                        watched: anime.currentPart.watchedEpisodes,
                      })}
                </span>
                {days !== null ? (
                  <span className={styles.countdown}>
                    {t("nextInDays", {
                      count: days,
                      episode: anime.nextEpisode ?? 0,
                    })}
                  </span>
                ) : null}
              </p>
            ) : null}

            {anime.tags.length > 0 || anime.genres.length > 0 ? (
              <p className={styles.tags}>
                {[...new Set([...anime.genres, ...anime.tags])]
                  .slice(0, 10)
                  .join(" · ")}
              </p>
            ) : null}

            {anime.personalNote ? (
              <p className={styles.note}>{anime.personalNote}</p>
            ) : null}
          </div>
        </header>

        {anime.description ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("detail.synopsis")}</h2>
            {/* AniList açıklaması düz metin istendi ama yine de <br> içerebiliyor */}
            <p className={styles.synopsis}>
              {anime.description.replace(/<[^>]+>/g, " ")}
            </p>
          </section>
        ) : null}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("detail.watchOrder")}</h2>
          <p className={styles.sectionLede}>{t("detail.watchOrderLede")}</p>

          <ol className={styles.timeline}>
            {parts.map((part, index) => (
              <PartRow
                key={part.id}
                part={part}
                index={index + 1}
                isOpen={openPartId === part.id}
                editing={editing}
                onToggle={() =>
                  setOpenPartId(openPartId === part.id ? null : part.id)
                }
              />
            ))}
          </ol>
        </section>

        {characters.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("detail.characters")}</h2>
            <ul className={styles.characters}>
              {characters.map((character) => (
                // Anahtar ad değil id: aynı adı taşıyan iki karakter aynı
                // kadroda bulunabiliyor (aile üyeleri, "Unnamed" kayıtlar)
                <li key={character.characterId} className={styles.character}>
                  {/* Kadro artık karakter dosyasına açılıyor. Kart bir bütün
                      olarak tıklanıyor — yüzü ve adı ayrı hedefler yapmak
                      56px'lik satırda iki minik dokunma alanı üretirdi. */}
                  <Link
                    href={animeHref.character(character.characterId)}
                    className={styles.characterLink}
                  >
                    {character.imageSmall ?? character.image ? (
                      <span className={styles.characterFace}>
                        <Image
                          /* Küçük boy: bu daire 42px, büyük portre burada
                             boşuna indirilirdi (dizindeki levhalar `image` alır) */
                          src={(character.imageSmall ?? character.image)!}
                          alt=""
                          fill
                          sizes="56px"
                          className={styles.characterImg}
                          unoptimized
                        />
                      </span>
                    ) : null}
                    <span className={styles.characterText}>
                      <span className={styles.characterName}>
                        {character.name}
                      </span>
                      {character.voiceActor ? (
                        <span className={styles.characterVoice}>
                          {character.voiceActor}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {anime.manga ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("detail.manga")}</h2>
            <p className={styles.mangaLine}>
              <strong>{anime.manga.title}</strong>
              {anime.manga.chapters
                ? ` · ${t("detail.chapters", { count: anime.manga.chapters })}`
                : ""}
              {anime.manga.volumes
                ? ` · ${t("detail.volumes", { count: anime.manga.volumes })}`
                : ""}
            </p>
            {/* Anime → manga eşlemesi hiçbir API'de yok: elle girilen sayı */}
            <p className={styles.mangaHint}>
              {resume
                ? t("detail.mangaResume", {
                    part: resume.part,
                    chapter: resume.chapter,
                    next: resume.chapter + 1,
                  })
                : t("detail.mangaHint")}
            </p>
          </section>
        ) : null}

        <ExternalLinks links={anime.links} />

        {editing ? <CuratorDossier anime={anime} /> : null}
      </div>
    </div>
  );
}

/**
 * Dış bağlantı kartları. Fragman, resmi site, AniList ve MyAnimeList künyeden
 * türetilir; manga adresi ile OP/ED klibi küratör tarafından elle girilir
 * (hiçbir API vermiyor). Adresi olmayan tür hiç kart açmaz.
 */
const LINK_ICONS: Record<AnimeLinkKind, string> = {
  MANGA: "📖",
  TRAILER: "🎬",
  OPENING: "🎵",
  ENDING: "🎵",
  OFFICIAL: "🌐",
  ANILIST: "📊",
  MAL: "📚",
};

function ExternalLinks({ links }: { links: AnimeLink[] }) {
  const t = useTranslations("anime");
  // Backend ile frontend aynı anda deploy olmuyor: alan gelmediği kısa
  // pencerede sayfa çökmesin, bölüm hiç çizilmesin
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("detail.links")}</h2>
      <ul className={styles.linkCards}>
        {links.map((link) => (
          <li key={link.kind}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkCard}
            >
              <span className={styles.linkIcon} aria-hidden>
                {LINK_ICONS[link.kind]}
              </span>
              <span className={styles.linkLabel}>
                {t(`detail.linkName.${link.kind}`)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "Anime nerede bitti → manga nereden devam": elle girilmiş sayıdan okunur. */
function mangaResume(
  anime: ArchiveAnime,
): { part: string; chapter: number } | null {
  const marked = [...anime.parts]
    .filter((part) => part.mangaChapter && part.isCompleted)
    .sort((a, b) => (b.mangaChapter ?? 0) - (a.mangaChapter ?? 0))[0];
  if (!marked?.mangaChapter) {
    return null;
  }
  return { part: marked.title, chapter: marked.mangaChapter };
}

/**
 * Zaman çizelgesinin bir satırı: sezonun kendi posteri, ilerlemesi ve
 * açıldığında bölüm ızgarası.
 */
function PartRow({
  part,
  index,
  isOpen,
  editing,
  onToggle,
}: {
  part: ArchiveAnimePart;
  index: number;
  isOpen: boolean;
  editing: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("anime");
  const percent =
    part.episodes && part.episodes > 0
      ? Math.min(100, Math.round((part.watchedEpisodes / part.episodes) * 100))
      : 0;

  return (
    <li className={isOpen ? styles.partOpen : styles.part}>
      <div className={styles.partHead}>
        <span className={styles.partIndex}>
          {String(index).padStart(2, "0")}
        </span>

        {/* Her sezonun kendi afişi — AniList sezon başına ayrı kapak veriyor */}
        <span className={styles.partCover}>
          {part.coverImage ? (
            <Image
              src={part.coverImage}
              alt=""
              fill
              sizes="60px"
              className={styles.partCoverImg}
              unoptimized
            />
          ) : null}
        </span>

        <span className={styles.partInfo}>
          <button type="button" className={styles.partToggle} onClick={onToggle}>
            {part.title}
          </button>
          <span className={styles.partMeta}>
            {[
              part.format,
              part.seasonYear,
              part.episodes
                ? t("episodeOf", {
                    watched: part.watchedEpisodes,
                    total: part.episodes,
                  })
                : t("episodeCount", { watched: part.watchedEpisodes }),
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
          {part.episodes ? (
            <span className={styles.partBar} aria-hidden>
              <span
                className={styles.partBarFill}
                style={{ width: `${percent}%` }}
              />
            </span>
          ) : null}
        </span>

        <button
          type="button"
          className={styles.partChevron}
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          {isOpen ? "▾" : "▸"}
        </button>
      </div>

      {isOpen ? (
        <>
          {editing ? <PartTools part={part} /> : null}
          <EpisodeGrid part={part} editing={editing} />
        </>
      ) : null}
    </li>
  );
}

/**
 * Bölüm ızgarası. Filler bölümler soluk ve "F" işaretli; küratör modunda bir
 * bölüme tıklamak "buraya kadar izledim" demek — 220 bölümlük seride tek tek
 * ilerlemek zorunda kalmamak için (kullanıcı geri bildirimi).
 */
function EpisodeGrid({
  part,
  editing,
}: {
  part: ArchiveAnimePart;
  editing: boolean;
}) {
  const t = useTranslations("anime");
  const router = useRouter();
  const [data, setData] = useState<PartEpisodes | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const result = await fetchPartEpisodes(part.id);
        if (!cancelled) {
          setData(result);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [part.id]);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      setData(await fetchPartEpisodes(part.id));
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className={styles.episodesLoading}>{t("detail.loadingEpisodes")}</p>;
  }
  if (error || !data || data.episodes.length === 0) {
    return <p className={styles.episodesLoading}>{t("detail.noEpisodes")}</p>;
  }

  const watchedCanon = data.episodes.filter(
    (episode) => episode.state === "WATCHED" && !episode.filler,
  ).length;
  const canonTotal = data.episodes.length - data.fillerCount;
  // İzlenmiş bölümlerin sonuncusu: ızgarada ▶ ile işaretlenen kare
  const lastWatched = data.episodes.reduce(
    (last, episode) => (episode.state === "WATCHED" ? episode.number : last),
    0,
  );

  return (
    <div className={styles.episodes}>
      <div className={styles.episodesHead}>
        <span className={styles.episodesMeta}>
          {data.hasSourceData
            ? t("detail.fillerCount", {
                filler: data.fillerCount,
                canon: canonTotal,
              })
            : t("detail.noFillerData")}
        </span>
        {data.hasSourceData ? (
          <span className={styles.episodesMeta}>
            {t("detail.canonProgress", {
              watched: watchedCanon,
              total: canonTotal,
            })}
          </span>
        ) : null}
        {editing && data.fillerCount > 0 ? (
          <button
            type="button"
            className={styles.skipFillers}
            disabled={busy}
            onClick={() =>
              // Izgara ziyaretçiye de çiziliyor; admin API'si tıklama ANINDA
              // yüklenir ki `lib/admin/api` ziyaretçi chunk'ına girmesin (P-02)
              void run(async () => {
                const { updateAnimePart } = await import("@/lib/admin/api");
                return updateAnimePart(part.id, { skipFillers: true });
              })
            }
          >
            {t("detail.skipFillers")}
          </button>
        ) : null}
      </div>

      <ol className={styles.episodeGrid}>
        {data.episodes.map((episode) => {
          // Son izlenen bölüm ayrı vurgulanır: ilerleme çubuğu "nerede
          // kaldım"ı yeterince anlatmıyordu (kullanıcı geri bildirimi)
          const isLastWatched = episode.number === lastWatched;
          const className = [
            episode.state === "WATCHED"
              ? styles.epWatched
              : episode.state === "SKIPPED"
                ? styles.epSkipped
                : styles.ep,
            episode.filler ? styles.epFiller : "",
            isLastWatched ? styles.epCurrent : "",
          ]
            .filter(Boolean)
            .join(" ");
          const label = [
            `${episode.number}. ${episode.title ?? ""}`.trim(),
            episode.filler ? t("detail.filler") : "",
            episode.recap ? t("detail.recap") : "",
          ]
            .filter(Boolean)
            .join(" — ");

          return (
            <li key={episode.number}>
              <button
                type="button"
                className={className}
                title={label}
                disabled={!editing || busy}
                onClick={() =>
                  void run(async () => {
                    const { updateAnimePart } = await import("@/lib/admin/api");
                    return updateAnimePart(part.id, {
                      // Tıklanan bölüm zaten izlendiyse bir öncesine düşür:
                      // yanlış tıklamayı geri almanın en kısa yolu
                      watchedEpisodes:
                        episode.state === "WATCHED"
                          ? episode.number - 1
                          : episode.number,
                    });
                  })
                }
              >
                {isLastWatched ? "▶" : episode.number}
              </button>
            </li>
          );
        })}
      </ol>

      {editing ? (
        <p className={styles.episodesHint}>{t("detail.gridHint")}</p>
      ) : null}
    </div>
  );
}
