import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchFootballHub, pick } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { FAVOURITE_PLAYERS } from "@/lib/sport/favourite-players";
import {
  FOOTBALL_MEDIA,
  LEGEND_PLATES,
  collectCredits,
} from "@/lib/sport/football-media";
import { HubStage } from "@/components/sport/football/HubStage";
import { ClubGate } from "@/components/sport/football/ClubGate";
import { LegendsHall } from "@/components/sport/football/LegendsHall";
import { PlayerRail } from "@/components/sport/football/PlayerRail";
import { HistoryReel } from "@/components/sport/football/HistoryReel";
import { MediaCredits } from "@/components/sport/football/MediaCredits";
import shell from "../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });
  return { title: t("football.name"), description: t("football.lede") };
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Sayfa 2 — `/spor/futbol` · GECE
 *
 * THESIS: Bu sayfa bir kayıt dizini değil, içine girilen bir gece. Kategorinin
 *   varsayılan iki düzenini de reddediyor: siyah zemin + beyaz metin + ince
 *   çizgi olan "arşiv indeksi"ni de, eşit kartların dizildiği "spor portalı
 *   ızgarası"nı da. Her bölüm kendi ışığı olan bir SAHNE.
 * OWN-WORLD: Stadyum gecesi. Zemin hiçbir yerde #000 değil — kehribar, kızıl
 *   ve çivit radyal yıkamaların üst üste bindiği renkli bir karanlık. Işık
 *   malzeme: projektör konileri, lens parlaması, havada asılı kor. Tipografi
 *   evin sesi (Petrona 800-900 display, Cinzel tracked-out etiket, Bebas
 *   rakam) ama boyu kompozisyon ölçeğinde. Bölüm paletleri: hub = derin sarı +
 *   elektrik kırmızısı; kulüp kapısı = crimson + altın + turuncu; efsaneler =
 *   bordo + antika altın + vintage krem; favoriler = veriden gelen kişisel
 *   palet; tarih = yıla göre soğuyan/ısınan ışık.
 * STORY: Ziyaretçi maç saatinde stadyuma girer, kulüp kapısının önünden
 *   geçer, altın ışık altında efsanelerle karşılaşır, kişisel bir futbolcu
 *   seçkisini raftan çeker ve ışığın kupa gecesinde zirveye çıktığı bir
 *   şeritten aşağı iner.
 * FIRST VIEWPORT: Tam kıvrım gece. Solda dev FUTBOL, altında iki satırlık
 *   editoryal ifade, viewport'un tabanında künye rayı ve kaydırma işareti.
 *   Fotoğraf plakası `screen` karışımıyla renk alanının içinde ışık olarak
 *   duruyor, kutu içindeki resim olarak değil.
 * FORM: Brief tarafından bölüm bölüm sabitlendi (hero → kulüp kapısı →
 *   efsaneler → favori futbolcular → tarih). Yapı seçimi turu bu yüzden
 *   çalıştırılmadı; kullanıcı formu kendisi yazdı.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── KORUNAN SÖZLER ───────────────────────────────────────────────────────
 * 1. Veri kaynağı DEĞİŞMEDİ: hâlâ tek `fetchFootballHub()` çağrısı.
 * 2. Adresler DEĞİŞMEDİ: kulüp kapısı `sportHref.club()`, efsane kartları
 *    `sportHref.legend()`, tarih şeridi `club#era` çapasına gidiyor. Çalışan
 *    hiçbir yönlendirme bozulmadı.
 * 3. BOŞ ODA YASAĞI duruyor: dolu olmayan yüzey HİÇ çizilmiyor ve kanadın
 *    tamamı boşsa sayfa 404.
 *
 * ── EKLENEN TEK YENİ KAYNAK ──────────────────────────────────────────────
 * `FAVOURITE_PLAYERS` — depoda duran bir defter, backend'de değil. Gerekçesi
 * `lib/sport/favourite-players.ts` başlığında.
 */
export default async function FootballHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  let hub;
  try {
    hub = await fetchFootballHub();
  } catch {
    notFound();
  }

  const { featuredClub, clubs, legends, moments } = hub;
  const otherClubs = clubs.filter((c) => c.slug !== featuredClub?.slug);

  // Kanadın tamamı boşsa sayfa hiç açılmasın — brief'in boş oda yasağı.
  // Favori futbolcular defteri bu koşula BİLEREK katılmıyor: o, kulüp
  // arşivinin yerine geçemez; tek başına dolu olması sayfayı açmaya yetmez.
  if (!featuredClub && clubs.length === 0 && legends.length === 0) {
    notFound();
  }

  const legendEntries = legends.map((legend) => ({
    slug: legend.slug,
    name: legend.name,
    epithet: pick(locale, legend.epithetTr, legend.epithetEn),
    countryCode: legend.countryCode,
    yearsFrom: legend.yearsFrom,
    yearsTo: legend.yearsTo,
    portraitImage: legend.portraitImage,
  }));

  const historyEntries = moments.map((moment) => ({
    year: moment.year,
    title: pick(locale, moment.titleTr, moment.titleEn),
    kind: moment.kind,
    // ⚠️ Çapa korunuyor: kulüp sayfasındaki dönem bölümüne iniyor.
    href: `${sportHref.club(moment.era.club.slug)}#${moment.era.slug}`,
  }));

  /**
   * Künye listesi — sayfada GERÇEKTEN çizilen görsellerden toplanıyor.
   * Efsane plakası yalnızca o efsane varsa listeye giriyor; kulüp kapağı
   * küratörünse künyesi yok (o görselin sahibi arşivin kendisi).
   */
  const credits = collectCredits([
    FOOTBALL_MEDIA.stadiumNight,
    featuredClub?.coverImage ? { credit: null } : FOOTBALL_MEDIA.stadiumAerial,
    ...legendEntries.map((l) => LEGEND_PLATES[l.slug]).filter(Boolean),
    // Kart yuvaları çoğu zaman yer tutucu; künyesi olan varsa toplanıyor.
    ...FAVOURITE_PLAYERS.map((p) => p.card),
  ]);

  return (
    <main className={styles.page}>
      <nav className={`${shell.crumb} ${styles.crumb}`} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
      </nav>

      {/* ══ Sahne 1 · gece ══ */}
      <HubStage
        title={t("football.name")}
        lines={[t("hub.statementA"), t("hub.statementB")]}
        scrollHint={t("hub.scroll")}
        index={[
          { label: t("hub.indexClubs"), count: clubs.length },
          { label: t("hub.indexLegends"), count: legends.length },
          { label: t("hub.indexPlayers"), count: FAVOURITE_PLAYERS.length },
          { label: t("hub.indexStories"), count: moments.length },
        ].filter((entry) => entry.count > 0)}
      />

      {/* ══ Sahne 2 · kulüp kapısı ══ */}
      {featuredClub ? (
        <ClubGate
          slug={featuredClub.slug}
          name={featuredClub.name}
          tagline={pick(locale, featuredClub.taglineTr, featuredClub.taglineEn)}
          foundedYear={featuredClub.foundedYear}
          cityName={featuredClub.cityName}
          stadiumName={featuredClub.stadiumName}
          nickname={pick(
            locale,
            featuredClub.nicknameTr,
            featuredClub.nicknameEn,
          )}
          coverImage={featuredClub.coverImage}
          coverPosition={featuredClub.coverPosition}
          coverScale={featuredClub.coverScale}
          labels={{
            enter: t("hub.enterClub"),
            founded: t("club.founded"),
          }}
        />
      ) : null}

      {/* ══ Sahne 3 · efsaneler ══ */}
      <LegendsHall
        legends={legendEntries}
        labels={{
          title: t("hub.legends"),
          lede: t("hub.legendsLede"),
          open: t("hub.legendOpen"),
          years: t("hub.legendYears"),
        }}
      />

      {/* ══ Sahne 4 · favori futbolcular ══ */}
      <PlayerRail
        players={FAVOURITE_PLAYERS}
        labels={{
          title: t("hub.favourites"),
          lede: t("hub.favouritesLede"),
          open: t("hub.playerOpen"),
          prev: t("chronology.prev"),
          next: t("chronology.next"),
        }}
      />

      {/* ══ Sahne 5 · tarih ══ */}
      <HistoryReel
        entries={historyEntries}
        labels={{
          title: t("hub.history"),
          lede: t("hub.historyLede"),
          kinds: {
            MILESTONE: t("curator.kinds.MILESTONE"),
            MATCH: t("curator.kinds.MATCH"),
            TROPHY: t("curator.kinds.TROPHY"),
            ARRIVAL: t("curator.kinds.ARRIVAL"),
            DEPARTURE: t("curator.kinds.DEPARTURE"),
            TURNING_POINT: t("curator.kinds.TURNING_POINT"),
            OTHER: t("curator.kinds.OTHER"),
          },
        }}
      />

      {/* ══ Kuyruk · öne çıkan dışındaki kulüpler ══
          Sessiz kalıyor ve öyle kalmalı: bu bir sahne değil, bir dizin. Sayfa
          zaten beş sahneden geçti; altıncısı ritmi düzleştirirdi. */}
      {otherClubs.length > 0 ? (
        <section className={styles.rest}>
          <h2 className={`${shell.display} ${styles.restTitle}`}>
            {t("hub.otherClubs")}
          </h2>
          <ul className={styles.clubList}>
            {otherClubs.map((club) => (
              <li key={club.slug}>
                <Link
                  href={sportHref.club(club.slug)}
                  className={styles.clubLink}
                >
                  <span className={styles.clubName}>{club.name}</span>
                  {club.foundedYear ? (
                    <span className={shell.data}>{club.foundedYear}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <MediaCredits credits={credits} label={t("hub.credits")} />
    </main>
  );
}
