import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { sportHref } from "@/lib/sport/routes";
import { readIsAdmin } from "@/lib/auth/session";
import {
  isInNotebook,
  legendaryPlayers,
  nameLangOf,
  nameLangOfCode,
  type PlayerImageSlot,
} from "@/lib/sport/favourite-players";
import { HUB_OWNER } from "@/lib/sport/football-hub-slots";
import { readCuratorImages } from "@/lib/sport/curator-images";
import { fetchFootballHub, pick } from "@/lib/api/sport-archive";
import { PlayerCuratorProvider } from "@/components/sport/football/player/PlayerCurator";
import { PlayerImage } from "@/components/sport/football/player/PlayerImage";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../../layout.module.css";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });
  return {
    title: t("legendsIndex.title"),
    description: t("legendsIndex.lede"),
  };
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Sayfa — `/spor/futbol/efsaneler` · EFSANELER SALONU
 *
 * THESIS: Bu bir liste sayfası değil bir SALON. Kategorinin varsayılanı
 *   ("eşit kartların ızgarası") reddediliyor: bir kulübün hafızasında bütün
 *   isimler eşit ağırlıkta durmaz. Sayfa bunu kabul ediyor ve hiyerarşiyi
 *   görünür kılıyor — önce panteon, sonra onur listesi.
 * OWN-WORLD: Bireysel futbolcu sayfaları enerjik ve modern (Anton, gece
 *   rengi, hareket). Burası tersi: Cinzel'in kitabe sesi, arşiv sepyası,
 *   tarama dokusu, taş gibi duran bir ızgara. Bir madalya vitrini.
 * STORY: Ziyaretçi iki kurucu yüzle karşılaşır, sonra aynı formayı taşımış
 *   diğerlerinin arasından geçer ve istediğinin sayfasına girer.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── İKİ KAYNAK, TEK SALON ────────────────────────────────────────────────
 * Yüzlerin bir kısmı arşiv kaydı (`FootballLegend`, backend — bugün yalnız
 * Hagi), bir kısmı defterde `legendEpithet` yazılmış favori futbolcu.
 * ADRESLERİ farklı: efsane kendi efsane sayfasına, futbolcu kendi profiline
 * gidiyor. Aynı kişinin iki yerde birden görünmesi bir çakışma değil,
 * kullanıcının açık kararı (20 Ağustos 2026).
 *
 * ── PORTRE KİMDE DÜZENLENİR ──────────────────────────────────────────────
 * Arşiv efsanesinin portresi backend kaydında ve kendi küratör ekranından
 * yönetiliyor (`editable: false`) — aynı görselin iki kaynağı olmasın diye.
 * Defterdeki futbolcunun portresi ise kart yuvası, burada düzenlenebiliyor.
 *
 * ⚠️ `generateStaticParams` YOK ve OLMAYACAK — `app/[locale]` altında statik
 * parametre `/en`i 500'e düşürüyor (devir notu §4.1).
 */

/**
 * PANTEON — sayfanın açılışındaki iki isim.
 *
 * Bu bir küratör kararı, veriden türetilmiyor: kulübü var eden isim (Metin
 * Oktay) ile ona bir oyun dili öğreten isim (Hagi) yan yana duruyor. Sıra da
 * kararın parçası.
 *
 * ⚠️ Slug'lar burada yazılı çünkü bu bir SEÇKİ; "en çok maç" gibi bir ölçüte
 * bağlanamaz. Biri salonda yoksa sayfa kırılmıyor: eşleşmeyen slug sessizce
 * atlanıyor, kalan tek isim panteonu tek başına taşıyor, ikisi de yoksa
 * bölüm hiç çizilmiyor (boş oda yasağı).
 */
const PANTHEON = ["metin-oktay", "hagi"];

interface HallEntry {
  key: string;
  slug: string;
  name: string;
  /** Adın büyük harfe çevrilirken uyacağı dil — gerekçe `nameLangOf` */
  nameLang: "tr" | "en";
  epithet: string;
  countryCode: string | null;
  years: string | null;
  href: string;
  portrait: PlayerImageSlot;
  editable: boolean;
}

export default async function LegendsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });
  const isAdmin = await readIsAdmin();

  /* Arşiv kayıtları. Uç düşerse sayfa defterdeki futbolcularla açılıyor —
     bir veri kaynağının kesintisi sayfayı kırmamalı. */
  const hub = await fetchFootballHub().catch(() => null);
  const archive = hub?.legends ?? [];

  const notebook = legendaryPlayers();

  const entries: HallEntry[] = [
    /* ⚠️ Defterde karşılığı olan arşiv kaydı ELENİYOR: aynı kişi salonda iki
       kez görünmemeli ve iki kart farklı sayfalara gitmemeli. Hagi
       21 Ağustos 2026'da deftere taşındı ve ikisi de var — gerekçenin
       tamamı `isInNotebook` başında. */
    ...archive
      .filter((legend) => !isInNotebook(legend.slug))
      .map((legend) => ({
      key: `arsiv-${legend.slug}`,
      slug: legend.slug,
      name: legend.name,
      nameLang: nameLangOfCode(legend.countryCode),
      epithet: pick(locale, legend.epithetTr, legend.epithetEn),
      countryCode: legend.countryCode,
      years: legend.yearsFrom
        ? `${legend.yearsFrom}–${legend.yearsTo ?? ""}`
        : null,
      href: sportHref.legend(legend.slug),
      portrait: {
        id: `efsane-${legend.slug}`,
        owner: HUB_OWNER,
        src: legend.portraitImage ?? "",
        alt: legend.name,
        placeholder: !legend.portraitImage,
        hint: legend.name,
      },
      editable: false,
    })),
    ...notebook.map((player) => ({
      key: `favori-${player.slug}`,
      slug: player.slug,
      name: player.name,
      nameLang: nameLangOf(player),
      epithet: player.legendEpithet ?? "",
      countryCode: player.countryCode,
      years: player.legendEra ?? null,
      href: sportHref.favouritePlayer(player.slug),
      portrait: { ...player.card, owner: player.slug },
      editable: true,
    })),
  ];

  // Salon tamamen boşsa sayfa hiç açılmasın.
  if (entries.length === 0) notFound();

  /* Panteon SIRASI listenin sırası değil `PANTHEON`un sırası — eşleşmeyen
     slug sessizce düşüyor. */
  const pantheon = PANTHEON.map((slug) =>
    entries.find((entry) => entry.slug === slug),
  ).filter((entry): entry is HallEntry => Boolean(entry));

  const roll = entries.filter((entry) => !PANTHEON.includes(entry.slug));

  /**
   * Küratör görselleri: arşiv portreleri hub sahibinde, defterdeki
   * futbolcuların kart yuvaları kendi slug'larında. İstekler paralel.
   */
  const owners = [HUB_OWNER, ...notebook.map((player) => player.slug)];
  const images = await readCuratorImages(owners);

  const curatorLabels = {
    on: t("favourite.curator.on"),
    off: t("favourite.curator.off"),
    panelTitle: t("favourite.curator.panelTitle"),
    panelNote: t("favourite.curator.panelNote"),
    edit: t("favourite.curator.edit"),
    fromFile: t("favourite.curator.fromFile"),
    fromUrl: t("favourite.curator.fromUrl"),
    urlPlaceholder: t("favourite.curator.urlPlaceholder"),
    fetch: t("favourite.curator.fetch"),
    reset: t("favourite.curator.reset"),
    busy: t("favourite.curator.busy"),
    error: t("favourite.curator.error"),
    empty: t("favourite.curator.empty"),
    close: t("favourite.close"),
    saving: t("favourite.curator.saving"),
    migrate: t("favourite.curator.migrate"),
    migrating: t("favourite.curator.migrating"),
    migrateNote: t("favourite.curator.migrateNote"),
  };

  return (
    <PlayerCuratorProvider
      defaultOwner={HUB_OWNER}
      isAdmin={isAdmin}
      initialImages={images}
      labels={curatorLabels}
    >
      <main className={styles.page}>
        <div className={styles.atmosphere} aria-hidden="true">
          <span className={styles.wash} />
          <span className={styles.scan} />
        </div>

        <nav
          className={`${shell.crumb} ${styles.crumb}`}
          aria-label="breadcrumb"
        >
          <Link href={sportHref.root()}>{t("backToSport")}</Link>
          <span className={shell.sep}>/</span>
          <Link href={sportHref.football()}>{t("backToFootball")}</Link>
        </nav>

        <header className={styles.head}>
          <p className={styles.eyebrow}>{t("legendsIndex.eyebrow")}</p>
          <h1 className={styles.title}>{t("legendsIndex.title")}</h1>
          <p className={styles.lede}>{t("legendsIndex.lede")}</p>
        </header>

        {/* ══ Panteon — iki isim, yan yana, büyük ══ */}
        {pantheon.length > 0 ? (
          <section
            className={styles.pantheon}
            aria-labelledby="panteon-baslik"
            data-single={pantheon.length === 1 || undefined}
          >
            <header className={styles.sectionHead}>
              <h2 id="panteon-baslik" className={styles.sectionTitle}>
                {t("legendsIndex.pantheon")}
              </h2>
              <p className={styles.sectionLede}>
                {t("legendsIndex.pantheonLede")}
              </p>
            </header>

            <div className={styles.pantheonGrid}>
              {pantheon.map((entry, i) => (
                <Reveal key={entry.key} delay={i * 90}>
                  {/* Portre bağlantının DIŞINDA: küratör düğmesi bir `<a>`
                      içinde kalırsa hem geçersiz HTML olur hem de dosya/adres
                      alanına basınca sayfa değişir (galeri karelerinde
                      ölçülmüş hata, devir notu §4.4). */}
                  <article className={styles.monument}>
                    <span className={styles.monumentPortrait}>
                      <PlayerImage
                        slot={entry.portrait}
                        position="50% 20%"
                        noEdit={!entry.editable}
                      />
                      <span className={styles.frameLine} aria-hidden="true" />
                    </span>

                    <div className={styles.monumentBody}>
                      {/* `lang`: bu başlık CSS'te büyütülüyor ve sayfanın
                          dili Türkçe — Türkçe kural yabancı adları bozuyordu
                          ("Hagi" → HAGİ, kullanıcı bildirimi). */}
                      <h3 className={styles.monumentName} lang={entry.nameLang}>
                        <Link href={entry.href}>{entry.name}</Link>
                      </h3>
                      {entry.epithet ? (
                        <p className={styles.monumentEpithet}>
                          {entry.epithet}
                        </p>
                      ) : null}
                      {entry.years ? (
                        <p className={styles.monumentYears}>
                          <em>{entry.years}</em>
                          <i>{t("legendsIndex.years")}</i>
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {/* ══ Onur listesi — tekdüze ızgara ══ */}
        {roll.length > 0 ? (
          <section className={styles.roll} aria-labelledby="onur-baslik">
            <header className={styles.sectionHead}>
              <h2 id="onur-baslik" className={styles.sectionTitle}>
                {t("legendsIndex.roll")}
              </h2>
              <p className={styles.sectionLede}>{t("legendsIndex.rollLede")}</p>
            </header>

            <ul className={styles.rollGrid}>
              {roll.map((entry, i) => (
                <Reveal as="li" key={entry.key} delay={Math.min(i, 5) * 60}>
                  <article className={styles.plaque}>
                    <span className={styles.plaquePortrait}>
                      <PlayerImage
                        slot={entry.portrait}
                        position="50% 20%"
                        noEdit={!entry.editable}
                      />
                    </span>

                    <div className={styles.plaqueBody}>
                      <h3 className={styles.plaqueName} lang={entry.nameLang}>
                        <Link href={entry.href}>{entry.name}</Link>
                      </h3>
                      {entry.epithet ? (
                        <p className={styles.plaqueEpithet}>{entry.epithet}</p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </PlayerCuratorProvider>
  );
}
