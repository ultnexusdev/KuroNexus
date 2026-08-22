import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { sportHref } from "@/lib/sport/routes";
import { shareCard } from "@/lib/seo";
import { readIsAdmin } from "@/lib/auth/session";
import {
  DEFAULT_SECTION_ORDER,
  allSlotsOf,
  findFavouritePlayer,
  type PlayerImageSlot,
  type PlayerSection,
} from "@/lib/sport/favourite-players";
import { collectCredits } from "@/lib/sport/football-media";
import { fetchPlayerImages } from "@/lib/api/sport-archive";
import { PlayerCuratorProvider } from "@/components/sport/football/player/PlayerCurator";
import { PlayerAudio } from "@/components/sport/football/player/PlayerAudio";
import { PlayerHero } from "@/components/sport/football/player/PlayerHero";
import { PlayerStory } from "@/components/sport/football/player/PlayerStory";
import { PlayerFilm } from "@/components/sport/football/player/PlayerFilm";
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
  const { locale, slug } = await params;
  const player = findFavouritePlayer(slug);
  if (!player) return {};
  const title = player.name;
  const description = player.tagline;
  return {
    title,
    description,
    ...shareCard({
      title,
      description,
      locale,
      path: sportHref.favouritePlayer(slug),
    }),
  };
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Sayfa — `/spor/futbol/futbolcular/[slug]` · FUTBOLCU POSTERİ
 *
 * THESIS: Bir futbolcu künyesi değil, bir POSTER. Kategorinin iki varsayılanı
 *   da reddediliyor: eşit kartların dizildiği "oyuncu profili şablonu" ve
 *   sayı yığan "istatistik panosu".
 * STORY: Ziyaretçi ismi ve sesi görür, hikâyeyi okur, kariyeri gittikçe
 *   parlayan bir hat üzerinde geçer, gecelerin arasından yürür, kulüp
 *   istatistiklerini armaya basarak açar ve galeride kalır.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── YİRMİ ÜÇ SAYFA, TEK BİLEŞEN AĞACI, BENZEMEYEN YÜZLER ─────────────────
 *
 * Bu rota yirmi üç futbolcuya birden hizmet ediyor ve sayfaların birbirine
 * benzememesi bir istek değil, ŞART (kullanıcı kararı, 20 Ağustos 2026).
 *
 * Oyuncu başına ayrı bileşen ağacı yazmak ölçüldü ve reddedildi: küratör
 * modu, yuva sistemi, `/en` rotası ve erişilebilirlik yirmi üç kez yeniden
 * yazılırdı ve tek bir düzeltme yirmi üç dosyaya elle taşınırdı.
 *
 * Onun yerine KOMPOZİSYON DA VERİ oldu. `player.design` altı eksen taşıyor
 * ve altısı da bu kökten aşağı `data-*` özniteliğiyle iniyor:
 *
 *   data-voice    hangi tipografi ailesi konuşuyor (Anton/Cinzel/Bebas/Petrona)
 *   data-hero     ilk ekranın iskeleti (sash/column/split/frame/kinetic/stack)
 *   data-sig      bölümlerin ve BOŞ YUVALARIN arkasındaki imza motifi
 *   data-rhythm   dikey nefes (tight/open/cinematic)
 *   data-texture  zemin dokusu (grain/archive/clean/halo)
 *   design.order  bölümlerin SIRASI — dizinin kendisi
 *
 * CSS bu öznitelikleri okuyor. Yani yeni bir oyuncu eklemek hâlâ tek bir veri
 * dosyası yazmak demek; tek satır CSS ya da bileşen kodu gerekmiyor.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Kareler küratör modundan yükleniyor ve VERİTABANINDA duruyor. Fotoğrafı
 * olmayan yuvada ziyaretçi tasarlanmış bir boşluk görüyor (yazısız), küratör
 * ise kadraj notunu ve dosya yolunu. Ayrım `PlayerImage` içinde.
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
   * defterdeki varsayılanlarla açılıyor — bir veri kaynağının kesintisi
   * sayfayı kırmamalı, kanadın yerleşik kuralı bu.
   */
  const images = await fetchPlayerImages(player.slug).catch(
    () => ({}) as Record<string, string>,
  );

  /**
   * ── HANGİ BÖLÜM ÇİZİLİYOR ────────────────────────────────────────────
   *
   * "Boş oda yasağı" (devir notu §7.5) burada İNCE bir ayrım gerektiriyor.
   * Fotoğrafı olmayan her bölümü gizlemek yanlış olurdu: geceler ve kariyer
   * bölümlerinde fotoğrafın YANINDA metin var (yıl, başlık, tek cümle,
   * maç/gol sayısı). O bölümleri kare gelmedi diye kapatmak, yazılmış
   * içeriği silmek demek.
   *
   * Gerçekten boş kalan tek bölüm GALERİ: içinde fotoğraftan başka bir şey
   * yok. Fotoğrafsız bir galeri, tanımı gereği boş bir oda.
   *
   * ⚠️ KÜRATÖR İSTİSNASI: admin girişliyken galeri fotoğraf olmasa DA
   * çiziliyor. Yoksa küratörün fotoğrafı yükleyeceği yuva sayfada hiç
   * görünmezdi — bölümü gizlemek onu doldurmayı imkânsız kılardı.
   */
  const hasPhoto = (slot: PlayerImageSlot) =>
    !slot.placeholder || Boolean(images[slot.id]);

  const drawn: Record<PlayerSection, boolean> = {
    hikaye: player.story.length > 0,
    kariyer: player.career.length > 0,
    geceler: player.nights.length > 0,
    anlar: player.personal.length > 0,
    istatistik: true,
    /* Film YALNIZCA kayıt taşıyorsa. Boş bir oynatıcı çizmek "boş oda
       yasağını" ihlal ederdi — tema müziğiyle aynı kural. */
    film: Boolean(player.film),
    galeri:
      player.gallery.length > 0 && (isAdmin || player.gallery.some(hasPhoto)),
  };

  const order = player.design.order ?? DEFAULT_SECTION_ORDER;
  const sections = order.filter((id) => drawn[id]);

  const sectionLabel: Record<PlayerSection, string> = {
    hikaye: t("favourite.story"),
    kariyer: t("favourite.career"),
    geceler: t("favourite.nights"),
    anlar: t("favourite.moments"),
    istatistik: t("favourite.stats"),
    film: t("favourite.film"),
    galeri: t("favourite.gallery"),
  };

  /* Dikey bölüm rayı ÇİZİLEN bölümlerden türetiliyor; ikinci bir sıra elle
     tutulmuyor. Gizlenmiş bir bölüme giden ölü çapa böylece imkânsız. */
  const stops = sections.map((id) => ({ id, label: sectionLabel[id] }));

  // Künye YALNIZCA gerçekten çizilen karelerden toplanıyor; yer tutucuların
  // künyesi olmaz, `collectCredits` onları zaten eliyor.
  const credits = collectCredits(allSlotsOf(player));

  /** Bölümün gövdesi — sıra `design.order` ile değiştiği için haritadan. */
  const body: Record<PlayerSection, React.ReactNode> = {
    hikaye: (
      <PlayerStory player={player} labels={{ eyebrow: t("favourite.story") }} />
    ),

    kariyer: (
      <PlayerJourney
        stops={player.career}
        labels={{
          title: t("favourite.career"),
          lede: t("favourite.careerLede"),
          matches: t("favourite.matches"),
          goals: t("favourite.goals"),
        }}
      />
    ),

    /* Açıklama kartın üstünde HER ZAMAN duruyor; hover yalnızca ışığı ve
       kareyi büyütüyor. Bilgi hover'ın arkasına saklanmıyor — dokunmatik
       cihazda ulaşılamaz olurdu. */
    geceler: (
      <section className={styles.nights} aria-labelledby="geceler-baslik">
        <header className={styles.sectionHead}>
          <h2 id="geceler-baslik" className={styles.sectionTitle}>
            {t("favourite.nights")}
          </h2>
          <p className={styles.sectionLede}>{t("favourite.nightsLede")}</p>
        </header>

        <ul className={styles.nightGrid}>
          {player.nights.map((night, i) => (
            <Reveal as="li" key={night.image.id} delay={Math.min(i, 2) * 70}>
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
    ),

    /* Arşivin en kişisel yeri; görsel değil TİPOGRAFİ taşıyor. Bir sahne
       dolusu ışıktan sonra sessiz bir oda — ritim için gerekli. */
    anlar: (
      <section className={styles.personal} aria-labelledby="anlar-baslik">
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
    ),

    istatistik: (
      <PlayerStats
        stats={player.stats}
        labels={{
          title: t("favourite.stats"),
          allTime: t("favourite.allTime"),
          clubHint: t("favourite.clubStats"),
        }}
      />
    ),

    /* `player.film` burada kesin dolu: bölüm `drawn.film` false iken
       `sections` dizisine hiç girmiyor. Yine de tip daraltması gerekiyor,
       `body` haritası koşulsuz kuruluyor. */
    film: player.film ? (
      <PlayerFilm
        film={player.film}
        labels={{
          eyebrow: t("favourite.film"),
          play: t("favourite.filmPlay"),
          note: t("favourite.filmNote"),
        }}
      />
    ) : null,

    galeri: (
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
    ),
  };

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
        data-voice={player.design.voice}
        data-hero={player.design.hero}
        data-sig={player.design.signature}
        data-rhythm={player.design.rhythm}
        data-texture={player.design.texture}
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
        {/* Tema müziği YALNIZCA `theme` dolu olan kayıtta. Kullanıcı kararı:
            müzik Icardi'ye özel. Sessiz bir ses düğmesi çizmek boş oda
            yasağını ihlal ederdi. */}
        {player.theme ? (
          <PlayerAudio
            src={player.theme}
            labels={{
              play: t("favourite.audio.play"),
              pause: t("favourite.audio.pause"),
              title: t("favourite.audio.title"),
            }}
          />
        ) : null}

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
            /* Ad burada eklenmiyor: `PlayerHero` onu kendi `lang`i olan
                ayrı bir `span` içinde basıyor (Türkçe büyütme kuralı
                yabancı adları bozuyordu). */
            crumb: `${t("favourite.back")} / `,
          }}
        />

        <PlayerRoute stops={stops} label={t("favourite.route")} />

        {sections.map((id) => (
          <div key={id} id={id}>
            {body[id]}
          </div>
        ))}

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
