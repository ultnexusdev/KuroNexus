import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { sportHref } from "@/lib/sport/routes";
import {
  FAVOURITE_PLAYERS,
  findFavouritePlayer,
} from "@/lib/sport/favourite-players";
import { collectCredits } from "@/lib/sport/football-media";
import { PlayerStage } from "@/components/sport/football/PlayerStage";
import { PlayerRoute } from "@/components/sport/football/PlayerRoute";
import { CareerReel } from "@/components/sport/football/CareerReel";
import { PlayerGallery } from "@/components/sport/football/PlayerGallery";
import { MediaCredits } from "@/components/sport/football/MediaCredits";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../../../layout.module.css";
import styles from "./page.module.css";

/**
 * Defterdeki her futbolcu için bir statik yol. Veri depoda durduğu için
 * (dış istek yok) bütün profiller derleme anında üretilebiliyor — sayfa
 * ziyaretçiye önbellekten geliyor.
 */
export function generateStaticParams() {
  return FAVOURITE_PLAYERS.map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = findFavouritePlayer(slug);
  if (!player) return {};
  return {
    title: player.name,
    description: player.tagline,
  };
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Sayfa — `/spor/futbol/futbolcular/[slug]` · FAVORİ FUTBOLCU PROFİLİ
 *
 * THESIS: Bir futbolcu künyesi değil, bir SEYİR. Sayfa yukarıdan aşağı bir
 *   kariyer deneyimi gibi ilerliyor ve her bölüm bir öncekinden farklı bir
 *   hareketle açılıyor — tablo, ızgara ve "istatistik kartı" düzenlerinin
 *   üçü de reddediliyor.
 * OWN-WORLD: Gece stadyumu, ama hub'dan farklı bir saatte: ışık yandan
 *   (mor/çivit) ve arkadan (crimson) geliyor, figür spot altında duruyor.
 *   Palet VERİDEN: `player.palette`. Yeni bir futbolcu eklendiğinde sayfa
 *   onun rengini giyiyor, tek satır CSS değişmiyor.
 * STORY: Ziyaretçi ismi görür, sesini duyar (alıntı), hikâyeyi okur,
 *   kariyeri kaydırarak geçer, gecelerin arasından yürür, küratörün kişisel
 *   notlarına varır ve galeride kalır.
 * FIRST VIEWPORT: Tam kıvrım. Solda iki satır dev ad (ikinci satır kadrajın
 *   solundan taşıyor), sağda tabana basan saydam figür, tabanda sayısal
 *   künye rayı, sağ kenarda ince dikey bölüm rayı.
 * FORM: Brief bölüm bölüm sabitledi (hikâye → kariyer → geceler → favori
 *   anlar → galeri).
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── VERİ ─────────────────────────────────────────────────────────────────
 * Tamamı `lib/sport/favourite-players.ts` defterinden. Dış istek YOK, bu
 * yüzden hata durumu da yok: slug defterde değilse 404.
 */
export default async function FavouritePlayerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const player = findFavouritePlayer(slug);
  if (!player) notFound();

  const t = await getTranslations({ locale, namespace: "sportArchive" });

  const stops = [
    { id: "hikaye", label: t("favourite.story") },
    { id: "kariyer", label: t("favourite.career") },
    { id: "geceler", label: t("favourite.nights") },
    { id: "anlar", label: t("favourite.moments") },
    { id: "galeri", label: t("favourite.gallery") },
  ].filter((stop) => {
    if (stop.id === "hikaye") return player.story.length > 0;
    if (stop.id === "kariyer") return player.career.length > 0;
    if (stop.id === "geceler") return player.nights.length > 0;
    if (stop.id === "anlar") return player.personal.length > 0;
    return player.gallery.length > 0;
  });

  // Sayfada gerçekten çizilen her karenin künyesi toplanıyor.
  const credits = collectCredits([
    player.figure,
    ...(player.backdrop ? [player.backdrop] : []),
    ...player.career.map((stop) => stop.media).filter(Boolean),
    ...player.nights.map((night) => night.media).filter(Boolean),
    ...player.gallery,
  ]);

  // Hikâyenin ortasına giren tam bant kare: kariyerin son durağının görseli
  // (yani bugünkü hâli). Yoksa bant hiç çizilmiyor.
  const storyPlate = player.career.at(-1)?.media ?? null;
  const storyHead = player.story.slice(0, 2);
  const storyTail = player.story.slice(2);

  return (
    <main
      className={styles.page}
      style={
        {
          "--ink": player.palette.ink,
          "--accent": player.palette.accent,
          "--warm": player.palette.warm,
          "--glow": player.palette.glow,
          "--neon": player.palette.neon,
        } as React.CSSProperties
      }
    >
      <nav className={`${shell.crumb} ${styles.crumb}`} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
        <span className={shell.sep}>/</span>
        <Link href={sportHref.football()}>{t("backToFootball")}</Link>
      </nav>

      <PlayerStage player={player} badgesLabel={t("favourite.figure")} />

      <PlayerRoute stops={stops} label={t("favourite.route")} />

      {/* ══ Hikâyesi ══
          Editoryal sütun: ilk paragraf büyük, ortada tam bant bir kare,
          sonra normal ölçüde devam. Wikipedia bloğu değil, dergi sayfası. */}
      {player.story.length > 0 ? (
        <section
          id="hikaye"
          className={styles.story}
          aria-labelledby="hikaye-baslik"
        >
          <h2
            id="hikaye-baslik"
            className={`${shell.display} ${styles.sectionHeading}`}
          >
            {t("favourite.story")}
          </h2>

          <div className={styles.column}>
            {storyHead.map((paragraph, i) => (
              <p key={i} data-lede={i === 0 ? "" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          {storyPlate ? (
            <Reveal className={styles.plateBand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyPlate.src}
                alt=""
                width={storyPlate.width}
                height={storyPlate.height}
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true" />
            </Reveal>
          ) : null}

          {storyTail.length > 0 ? (
            <div className={styles.column}>
              {storyTail.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ══ Kariyer ══ */}
      <div id="kariyer">
        <CareerReel
          stops={player.career}
          title={t("favourite.career")}
          lede={t("favourite.careerLede")}
        />
      </div>

      {/* ══ Unutulmaz geceler ══
          Açıklama kartın üstünde HER ZAMAN duruyor; hover yalnızca ışığı ve
          kareyi büyütüyor. Bilgi hover'ın arkasına saklanmıyor — dokunmatik
          cihazda ulaşılamaz olurdu. */}
      {player.nights.length > 0 ? (
        <section
          id="geceler"
          className={styles.nights}
          aria-labelledby="geceler-baslik"
        >
          <header className={styles.sectionHead}>
            <h2
              id="geceler-baslik"
              className={`${shell.display} ${styles.sectionHeading}`}
            >
              {t("favourite.nights")}
            </h2>
            <p className={styles.sectionLede}>{t("favourite.nightsLede")}</p>
          </header>

          <ul className={styles.nightGrid}>
            {player.nights.map((night, i) => (
              <Reveal
                as="li"
                key={`${night.year}-${night.title}`}
                delay={Math.min(i, 2) * 70}
              >
                <article className={styles.night}>
                  {night.media ? (
                    <span className={styles.nightShot} aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={night.media.src}
                        alt=""
                        width={night.media.width}
                        height={night.media.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  ) : null}

                  <span className={styles.nightBody}>
                    <span className={`${shell.figure} ${styles.nightYear}`}>
                      {night.year}
                    </span>
                    <h3 className={`${shell.display} ${styles.nightTitle}`}>
                      {night.title}
                    </h3>
                    <span className={`${shell.data} ${styles.nightMeta}`}>
                      {night.meta}
                    </span>
                    <p className={styles.nightLine}>{night.line}</p>
                  </span>
                </article>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ══ Favori anlar ══
          Arşivin en kişisel yeri; o yüzden görsel değil TİPOGRAFİ taşıyor.
          Bir sahne dolusu ışıktan sonra sessiz bir oda — ritim için gerekli. */}
      {player.personal.length > 0 ? (
        <section
          id="anlar"
          className={styles.personal}
          aria-labelledby="anlar-baslik"
        >
          <header className={styles.sectionHead}>
            <h2
              id="anlar-baslik"
              className={`${shell.display} ${styles.sectionHeading}`}
            >
              {t("favourite.moments")}
            </h2>
            <p className={styles.sectionLede}>{t("favourite.momentsLede")}</p>
          </header>

          <ul className={styles.noteList}>
            {player.personal.map((note, i) => (
              <Reveal as="li" key={note.title} delay={Math.min(i, 2) * 70}>
                <span className={styles.noteLabel}>{note.label}</span>
                <h3 className={`${shell.display} ${styles.noteTitle}`}>
                  {note.title}
                </h3>
                <p className={styles.noteBody}>{note.body}</p>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ══ Galeri ══ */}
      <div id="galeri">
        <PlayerGallery
          images={player.gallery}
          labels={{
            title: t("favourite.gallery"),
            lede: t("favourite.galleryLede"),
            open: t("favourite.open"),
            close: t("favourite.close"),
            prev: t("favourite.prevImage"),
            next: t("favourite.nextImage"),
          }}
        />
      </div>

      <MediaCredits credits={credits} label={t("favourite.credits")} />
    </main>
  );
}
