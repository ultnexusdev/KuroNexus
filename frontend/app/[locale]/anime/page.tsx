import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getAnimeArchive, getAnimeShowcase } from "@/lib/api/anime";
import { getCharacterImages } from "@/lib/api/characters";
import { fetchCategories } from "@/lib/api/universes";
import { apiUrl } from "@/lib/api/client";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { animeHref } from "@/lib/anime/routes";
import { AKATSUKI_IDS, EXHIBIT_IMAGE_KEYS } from "@/lib/anime/akatsuki";
import { ANIME_SECTIONS } from "@/lib/anime/sections";
import type { ArchiveAnime } from "@/lib/api/types";
import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import { AkatsukiPortalLink } from "@/components/anime/AkatsukiPortal";
import shell from "./layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });
  return { title: t("hallName"), description: t("lobbyLede") };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı (eski lobiyle aynı). */
async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "anime")),
      name: hallName(categories, "anime", fallbackName),
    };
  } catch {
    return { label: "", name: fallbackName };
  }
}

/**
 * Arşivde adı geçen seriyi bul. En kısa başlık kazanır: "Naruto" araması
 * "Naruto: Shippuden"i değil kök seriyi seçsin. Bulunamazsa `null` —
 * kart HİÇ çizilmez (boş oda yasağı: olmayan sayfaya kapı açılmaz).
 */
function findSeries(entries: ArchiveAnime[], needle: string) {
  const matches = entries.filter((entry) =>
    entry.title.toLowerCase().includes(needle),
  );
  if (matches.length === 0) return null;
  return [...matches].sort((a, b) => a.title.length - b.title.length)[0];
}

/**
 * Salon girişi — `/anime`.
 *
 * ── ÜÇ HAREKET ───────────────────────────────────────────────────────────
 *   1. AÇILIŞ     ANİME başlığı + cümle; vitrindeki iki afiş kenarlardan
 *                 sızar ve merkeze doğru kaybolur          (sessiz, sinematik)
 *   2. ODALAR     Anime Arşivim + Karakterler — mevcut iki kapı korunur
 *   3. DÜNYALAR   Akatsuki (öne çıkan) · Naruto · One Piece · Arşiv
 *
 * Akatsuki kartı bilinçli olarak diğerlerinden AYRIŞIR: kendi derisini
 * (`data-world="akatsuki"`) taşır, bulut motifi ve Pain silüetiyle gelir.
 * Amaç, göz sayfaya ilk düştüğünde oraya gitsin (komut §2a).
 */
export default async function AnimeHallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });

  const [archive, showcase, hall, painImages] = await Promise.all([
    getAnimeArchive(),
    getAnimeShowcase(),
    getHall(t("hallName")),
    // Silüet için yalnızca Pain'in kayıtları; kurulum koşmadıysa boş döner
    // ve kart bulut motifiyle çizilir — sayfa görsele borçlu değil.
    getCharacterImages([AKATSUKI_IDS.pain]),
  ]);

  const painPortrait =
    painImages.find(
      (image) =>
        image.characterId === AKATSUKI_IDS.pain && image.slot === "PORTRAIT",
    ) ?? null;

  /* v6-A1: üretilmiş özgün hero fonu (kürasyonla değiştirilebilir; yuvası
     sergideki küratör kuşağında). Varsa afişlerin yerini tam kadraj alır;
     SON kayıt kazanır (kürasyon sözleşmesi). */
  const hallHero =
    [...painImages]
      .reverse()
      .find(
        (image) =>
          image.slot === "ABILITY" &&
          image.abilityName === EXHIBIT_IMAGE_KEYS.hallHero,
      ) ?? null;

  const naruto = findSeries(archive.entries, "naruto");
  const onePiece = findSeries(archive.entries, "one piece");

  const archiveMeter =
    archive.entries.length === 0
      ? t("lobbyArchiveEmpty")
      : t("lobbyArchiveMeter", {
          count: archive.entries.length,
          watching: archive.stats.watching,
        });

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href="/dark-stories">KuroNexus</Link>
        <span className={shell.sep}>/</span>
        <span>{t("hall", { num: hall.label, name: hall.name })}</span>
      </nav>

      {/* ══ 1. AÇILIŞ ══ */}
      <header className={styles.opening}>
        {/* v6-A1: üretilmiş hero fonu — varsa sahnenin tamamı onun,
            afişler hiç çizilmez */}
        {hallHero ? (
          <span className={styles.heroArt} aria-hidden>
            <Image
              src={apiUrl(hallHero.url)}
              alt=""
              fill
              sizes="1920px"
              priority
            />
          </span>
        ) : null}

        {/* Vitrin afişleri: kenarlardan sızar, metne doğru kaybolur.
            AniList adresleri tam URL verir; CSP img-src'de s4.anilist.co
            zaten var. remotePatterns'ta olmadığı için düz <img>. */}
        {!hallHero && showcase.left?.posterPath ? (
          <span className={`${styles.poster} ${styles.posterLeft}`} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showcase.left.posterPath} alt="" loading="eager" />
          </span>
        ) : null}
        {!hallHero && showcase.right?.posterPath ? (
          <span
            className={`${styles.poster} ${styles.posterRight}`}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showcase.right.posterPath} alt="" loading="eager" />
          </span>
        ) : null}

        {/* v3-A1: merkez ışık havuzu — hero'nun ortası ölü siyah kalmasın */}
        <span className={styles.openingPool} aria-hidden />

        <div className={styles.openingInner}>
          <p className={shell.eyebrow}>
            {t("hall", { num: hall.label, name: hall.name })}
          </p>
          <h1 className={`${shell.display} ${shell.world}`}>
            {hall.name.toLocaleUpperCase(locale)}
          </h1>
          <p className={shell.lede}>{t("lobbyLede")}</p>
        </div>
      </header>

      {/* ══ 2. ODALAR — mevcut iki kapı, kanat dilinde ══ */}
      <nav className={styles.rooms} aria-label={t("lobbySectionsAria")}>
        {ANIME_SECTIONS.map((section) => (
          <Link key={section.slug} href={section.href} className={styles.room}>
            <span className={`${shell.display} ${styles.roomTitle}`}>
              {t(`sections.${section.key}.title`)}
            </span>
            <span className={styles.roomDesc}>
              {t(`sections.${section.key}.desc`)}
            </span>
            {section.key === "archive" ? (
              <span className={`${shell.data} ${styles.roomMeter}`}>
                {archiveMeter}
              </span>
            ) : null}
            <span className={styles.roomRule} aria-hidden />
          </Link>
        ))}
      </nav>

      {/* ══ 3. ANİME DÜNYALARI ══ */}
      <section className={styles.worlds} aria-label={t("worlds.aria")}>
        <h2 className={`${shell.eyebrow} ${styles.worldsLabel}`}>
          {t("worlds.title")}
        </h2>

        <ul className={styles.worldGrid}>
          {/* Akatsuki — öne çıkan kart, kendi derisiyle. Tıklama anı bir
              portal (v2): bulut ekranı yutar, sonra sergi açılır. */}
          <li className={styles.worldItem} data-featured>
            <AkatsukiPortalLink
              href={animeHref.akatsuki()}
              className={`${styles.world} ${styles.akatsuki}`}
            >
              <span className={styles.mist} aria-hidden />
              {painPortrait ? (
                <span className={styles.silhouette} aria-hidden>
                  {/* Kendi diskimizden — next/image küçültüp WebP'ye çevirir;
                      sizes SABİT px (vw yasak, next.config.ts ölçümü) */}
                  <Image
                    src={apiUrl(painPortrait.url)}
                    alt=""
                    fill
                    sizes="620px"
                  />
                </span>
              ) : null}
              <span className={`${shell.brush} ${styles.kanji}`} aria-hidden>
                暁
              </span>

              <span className={styles.worldBody}>
                {/* v3-A4: bulut artık serbest katman değil, metin bloğunun
                    rozeti — tam görünür, hiçbir şeyin üstüne binmiyor */}
                <span className={styles.cloudChip} aria-hidden>
                  <AkatsukiCloud className={styles.cloudChipArt} />
                </span>
                <span className={`${shell.data} ${styles.worldMeter}`}>
                  {t("worlds.akatsuki.meter")}
                </span>
                {/* Özel ad — TR büyütme İ üretir ("AKATSUKİ", LINKIN PARK
                    dersi). Bebas kapitali görsel olarak zaten basıyor. */}
                <span className={`${shell.display} ${styles.worldName}`}>
                  {t("worlds.akatsuki.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.akatsuki.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {t("worlds.enter")}
                </span>
              </span>
            </AkatsukiPortalLink>
          </li>

          {naruto ? (
            <li className={styles.worldItem}>
              <Link
                href={animeHref.series(naruto.slug)}
                className={styles.world}
              >
                <span className={styles.worldBody}>
                  <span className={`${shell.display} ${styles.worldName}`}>
                    {t("worlds.naruto.title")}
                  </span>
                  <span className={styles.worldTagline}>
                    {t("worlds.naruto.tagline")}
                  </span>
                  <span className={`${shell.data} ${styles.worldEnter}`}>
                    {t("worlds.enter")}
                  </span>
                </span>
              </Link>
            </li>
          ) : null}

          {onePiece ? (
            <li className={styles.worldItem}>
              <Link
                href={animeHref.series(onePiece.slug)}
                className={styles.world}
              >
                <span className={styles.worldBody}>
                  {/* "One Piece" TR büyütmede "ONE PİECE" olurdu — özel ad */}
                  <span className={`${shell.display} ${styles.worldName}`}>
                    {t("worlds.onepiece.title")}
                  </span>
                  <span className={styles.worldTagline}>
                    {t("worlds.onepiece.tagline")}
                  </span>
                  <span className={`${shell.data} ${styles.worldEnter}`}>
                    {t("worlds.enter")}
                  </span>
                </span>
              </Link>
            </li>
          ) : null}

          <li className={styles.worldItem}>
            <Link href={animeHref.archive()} className={styles.world}>
              <span className={styles.worldBody}>
                <span className={`${shell.display} ${styles.worldName}`}>
                  {t("worlds.archive.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.archive.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {archiveMeter}
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
