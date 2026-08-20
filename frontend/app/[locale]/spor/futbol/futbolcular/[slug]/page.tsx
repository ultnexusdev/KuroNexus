import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { sportHref } from "@/lib/sport/routes";
import { readIsAdmin } from "@/lib/auth/session";
import {
  allSlotsOf,
  findFavouritePlayer,
} from "@/lib/sport/favourite-players";
import { collectCredits } from "@/lib/sport/football-media";
import { fetchPlayerImages } from "@/lib/api/sport-archive";
import { PlayerCuratorProvider } from "@/components/sport/football/player/PlayerCurator";
import { PlayerAudio } from "@/components/sport/football/player/PlayerAudio";
import { PlayerHero } from "@/components/sport/football/player/PlayerHero";
import { PlayerStory } from "@/components/sport/football/player/PlayerStory";
import { PlayerJourney } from "@/components/sport/football/player/PlayerJourney";
import { PlayerStats } from "@/components/sport/football/player/PlayerStats";
import { PlayerGallery } from "@/components/sport/football/player/PlayerGallery";
import { PlayerImage } from "@/components/sport/football/player/PlayerImage";
import { PlayerRoute } from "@/components/sport/football/PlayerRoute";
import { MediaCredits } from "@/components/sport/football/MediaCredits";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../../../layout.module.css";
import styles from "./page.module.css";

/**
 * ⚠️ `generateStaticParams` YOK — DENENDİ VE GERİ ALINDI (20 Ağustos 2026).
 *
 * Veri depoda durduğu için profilleri derleme anında üretmek cazip görünüyordu
 * ve derleme temiz geçti. Canlıda ölçüm başka şey söyledi:
 *   /spor/futbol/futbolcular/mauro-icardi        → 200
 *   /en/spor/futbol/futbolcular/mauro-icardi     → 500
 *
 * Sebep üst segment: `app/[locale]` katmanının kendi `generateStaticParams`ı
 * YOK. Çocuk segment yalnızca `{ slug }` üretince Next yolları varsayılan
 * dille (tr) kuruyor, `/en/...` ise SSG işaretli bir segmentte istek anında
 * üretilmeye çalışılıyor ve next-intl'in statik render için beklediği
 * `setRequestLocale` çağrısı olmadığı için patlıyor.
 *
 * Çözüm iki yönlüydü: ya `[locale]` katmanına da statik parametre eklemek —
 * yani PAYLAŞILAN bir dosyayı değiştirip altı salonun tamamını riske atmak —
 * ya da bu sayfayı depodaki diğer bütün rotalar gibi istek anında üretmek.
 * İkincisi seçildi: sayfa hiçbir dış uca çıkmıyor.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = findFavouritePlayer(slug);
  if (!player) return {};
  return { title: player.name, description: player.tagline };
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Sayfa — `/spor/futbol/futbolcular/[slug]` · FUTBOLCU POSTERİ
 *
 * THESIS: Bir futbolcu künyesi değil, bir POSTER. Kategorinin iki varsayılanı
 *   da reddediliyor: eşit kartların dizildiği "oyuncu profili şablonu" ve
 *   sayı yığan "istatistik panosu". Sayfanın imzası formanın kendi
 *   geometrisi — kadrajı çapraz kesen sash — ve forma numarası.
 * OWN-WORLD: Anton (poster kapitali) + Inter (künye gövdesi). Zemin renkli
 *   bir gece, ASLA #000. Palet VERİDEN (`player.palette`): Icardi'de altın +
 *   crimson. Başka kulübün oyuncusu eklendiğinde sayfa onun rengini giyiyor,
 *   tek satır CSS değişmiyor.
 * STORY: Ziyaretçi ismi ve sesi görür, hikâyeyi okur, kariyeri gittikçe
 *   parlayan bir hat üzerinde geçer, gecelerin arasından yürür, kulüp
 *   istatistiklerini armaya basarak açar ve galeride kalır.
 * FIRST VIEWPORT: Solda kicker + iki satır dev ad (ikinci satır altın),
 *   künye ve alıntı; sağda tabana basan dikey fotoğraf; arkada çapraz sash
 *   ve kadrajdan taşan dev "9". Sağ üstte tek tuşluk ses kontrolü.
 * FORM: Kullanıcının mockup'ı (icardi-redesign-mockup.html) + ekran görüntüsü
 *   referans alındı; birebir kopya değil, bu depodaki bileşen sistemine
 *   uyarlandı.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── KORUNANLAR ───────────────────────────────────────────────────────────
 * Rota, `sportHref` adresleri, kırıntı, `PlayerRoute` dikey navigasyonu ve
 * `Reveal` (kanadın tek belirme hareketi) olduğu gibi duruyor.
 *
 * ── GÖRSELLER YER TUTUCU ─────────────────────────────────────────────────
 * Sayfadaki fotoğrafların tamamı `public/assets/players/icardi/` altında
 * bekliyor ve defterde `placeholder: true`. Gerçek kareler gelene kadar
 * TASARLANMIŞ bir çerçeve çiziliyor (kadraj notu + dosya yolu + "FOTO
 * EKLENECEK"); kırık görsel kutusu hiçbir koşulda görünmüyor. Küratör modu
 * her yuvayı dosyadan ya da adresten anında değiştirebiliyor.
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
  // Küratör düğmesinin görünürlüğü; yetkinin kapısı backend'de.
  const isAdmin = await readIsAdmin();

  /**
   * Küratörün yüklediği kareler — SUNUCUDA okunuyor.
   *
   * Böylece sayfa ilk boyamada doğru fotoğrafla geliyor; istemcide bir tur
   * daha atıp yer tutucudan gerçek kareye "zıplamıyor". Uç düşerse sayfa
   * defterdeki varsayılanlarla (yer tutucularla) açılıyor — bir veri
   * kaynağının kesintisi sayfayı kırmamalı, kanadın yerleşik kuralı bu.
   */
  const images = await fetchPlayerImages(player.slug).catch(
    () => ({}) as Record<string, string>,
  );

  const stops = [
    { id: "hikaye", label: t("favourite.story") },
    { id: "kariyer", label: t("favourite.career") },
    { id: "geceler", label: t("favourite.nights") },
    { id: "anlar", label: t("favourite.moments") },
    { id: "istatistik", label: t("favourite.stats") },
    { id: "galeri", label: t("favourite.gallery") },
  ];

  // Künye YALNIZCA gerçekten çizilen karelerden toplanıyor; yer tutucuların
  // künyesi olmaz, `collectCredits` onları zaten eliyor.
  const credits = collectCredits(allSlotsOf(player));

  return (
    <PlayerCuratorProvider
      defaultOwner={player.slug}
      isAdmin={isAdmin}
      initialImages={{ [player.slug]: images }}
      labels={{
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
      }}
    >
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
        <PlayerAudio
          src="/audio/icardi-theme.mp3"
          labels={{
            play: t("favourite.audio.play"),
            pause: t("favourite.audio.pause"),
            title: t("favourite.audio.title"),
          }}
        />

        <nav
          className={`${shell.crumb} ${styles.crumb}`}
          aria-label="breadcrumb"
        >
          <Link href={sportHref.root()}>{t("backToSport")}</Link>
          <span className={shell.sep}>/</span>
          <Link href={sportHref.football()}>{t("backToFootball")}</Link>
        </nav>

        <PlayerHero
          player={player}
          labels={{
            scroll: t("favourite.scroll"),
            crumb: `${t("favourite.back")} / ${player.name}`,
          }}
        />

        <PlayerRoute stops={stops} label={t("favourite.route")} />

        {/* ══ Hikâyesi ══ */}
        <div id="hikaye">
          <PlayerStory
            player={player}
            labels={{ eyebrow: t("favourite.story") }}
          />
        </div>

        {/* ══ Kariyer yolculuğu ══ */}
        <div id="kariyer">
          <PlayerJourney
            stops={player.career}
            labels={{
              title: t("favourite.career"),
              lede: t("favourite.careerLede"),
              matches: t("favourite.matches"),
              goals: t("favourite.goals"),
            }}
          />
        </div>

        {/* ══ Unutulmaz geceler ══
            Açıklama kartın üstünde HER ZAMAN duruyor; hover yalnızca ışığı ve
            kareyi büyütüyor. Bilgi hover'ın arkasına saklanmıyor —
            dokunmatik cihazda ulaşılamaz olurdu. */}
        {player.nights.length > 0 ? (
          <section
            id="geceler"
            className={styles.nights}
            aria-labelledby="geceler-baslik"
          >
            <header className={styles.sectionHead}>
              <h2 id="geceler-baslik" className={styles.sectionTitle}>
                {t("favourite.nights")}
              </h2>
              <p className={styles.sectionLede}>{t("favourite.nightsLede")}</p>
            </header>

            <ul className={styles.nightGrid}>
              {player.nights.map((night, i) => (
                <Reveal
                  as="li"
                  key={night.image.id}
                  delay={Math.min(i, 2) * 70}
                >
                  <article className={styles.night}>
                    <span className={styles.nightShot}>
                      <PlayerImage
                        slot={night.image}
                        position="50% 22%"
                        decorative
                      />
                      <span className={styles.nightLight} aria-hidden="true" />
                    </span>

                    <span className={styles.nightBody}>
                      <span className={styles.nightYear}>{night.year}</span>
                      <h3 className={styles.nightTitle}>{night.title}</h3>
                      <span className={styles.nightMeta}>{night.meta}</span>
                      <p className={styles.nightLine}>{night.line}</p>
                    </span>
                  </article>
                </Reveal>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ══ Favori anlar ══
            Arşivin en kişisel yeri; görsel değil TİPOGRAFİ taşıyor. Bir sahne
            dolusu ışıktan sonra sessiz bir oda — ritim için gerekli. */}
        {player.personal.length > 0 ? (
          <section
            id="anlar"
            className={styles.personal}
            aria-labelledby="anlar-baslik"
          >
            <header className={styles.sectionHead}>
              <h2 id="anlar-baslik" className={styles.sectionTitle}>
                {t("favourite.moments")}
              </h2>
              <p className={styles.sectionLede}>{t("favourite.momentsLede")}</p>
            </header>

            <ul className={styles.noteList}>
              {player.personal.map((note, i) => (
                <Reveal as="li" key={note.title} delay={Math.min(i, 2) * 70}>
                  <span className={styles.noteLabel}>{note.label}</span>
                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  <p className={styles.noteBody}>{note.body}</p>
                </Reveal>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ══ İstatistikler ══ */}
        <div id="istatistik">
          <PlayerStats
            stats={player.stats}
            labels={{
              title: t("favourite.stats"),
              allTime: t("favourite.allTime"),
              clubHint: t("favourite.clubStats"),
            }}
          />
        </div>

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

        {/* ══ Kapanış ══ */}
        <section className={styles.closing}>
          <span className={styles.closingMark} aria-hidden="true">
            {player.shirt ?? ""}
          </span>
          <blockquote className={styles.closingQuote}>
            {player.closingQuote}
          </blockquote>
          <p className={styles.closingSig}>— {player.name}</p>
        </section>

        <MediaCredits credits={credits} label={t("favourite.credits")} />
      </main>
    </PlayerCuratorProvider>
  );
}
