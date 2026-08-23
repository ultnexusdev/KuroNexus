import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchFootballHub, pick } from "@/lib/api/sport-archive";
import { readIsAdmin } from "@/lib/auth/session";
import { sportHref } from "@/lib/sport/routes";
import { shareCard } from "@/lib/seo";
import { readCuratorImages } from "@/lib/sport/curator-images";
import {
  FAVOURITE_PLAYERS,
  isInNotebook,
  nameLangOf,
  nameLangOfCode,
} from "@/lib/sport/favourite-players";
import {
  HUB_HERO_SLOT,
  HUB_OWNER,
  historySlot,
} from "@/lib/sport/football-hub-slots";
import { PlayerCuratorProvider } from "@/components/sport/football/player/PlayerCurator";
import { HubStage } from "@/components/sport/football/HubStage";
import { ClubGate } from "@/components/sport/football/ClubGate";
import { LegendsHall } from "@/components/sport/football/LegendsHall";
import { PlayerRail } from "@/components/sport/football/PlayerRail";
import { HistoryReel } from "@/components/sport/football/HistoryReel";
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
  const title = t("football.name");
  const description = t("football.lede");
  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: sportHref.football() }),
  };
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
 *   ve bordo radyal yıkamaların üst üste bindiği renkli bir karanlık.
 *   ⚠️ MAVİ/LACİVERT YOK: rakip kulübün rengi, bu arşivde yeri yok.
 * STORY: Ziyaretçi maç saatinde stadyuma girer, kulüp kapısının önünden
 *   geçer, bordo-altın bir salonda efsanelerle karşılaşır, kişisel bir
 *   futbolcu seçkisini raftan çeker ve ışığın kupa gecesinde zirveye çıktığı
 *   bir zikzak şeritten aşağı iner.
 * FIRST VIEWPORT: Tam kıvrım gece. Solda dev FUTBOL, altında iki satırlık
 *   editoryal ifade, viewport'un tabanında künye rayı ve kaydırma işareti.
 * FORM: Brief tarafından bölüm bölüm sabitlendi.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── KORUNAN SÖZLER ───────────────────────────────────────────────────────
 * 1. Arşiv verisi tek `fetchFootballHub()` çağrısından geliyor.
 * 2. Adresler değişmedi: kulüp kapısı `sportHref.club()`, arşiv efsaneleri
 *    `sportHref.legend()`, tarih şeridi `club#era` çapasına gidiyor.
 * 3. BOŞ ODA YASAĞI duruyor: dolu olmayan yüzey HİÇ çizilmiyor ve kanadın
 *    tamamı boşsa sayfa 404.
 *
 * ── KÜRATÖR MODU BURADA DA VAR ───────────────────────────────────────────
 * Sayfanın kendi yuvaları (hero plakası, tarih şeridi kareleri) `futbol-hub`
 * sahibine, defterdeki futbolcuların kart yuvaları ise kendi slug değerlerine
 * yazılıyor. Hepsi aynı tablo, `playerSlug` sütunu ayırıyor — bu yüzden
 * görseller tek istekle DEĞİL, sahip başına bir istekle geliyor ve istekler
 * paralel koşuyor.
 *
 * ── GÖRSEL KÜNYESİ KALDIRILDI ────────────────────────────────────────────
 * Sayfanın dibindeki künye bloğu kullanıcı isteğiyle gitti. Bu ancak künye
 * GEREKTİREN kare kalmadığında yapılabilirdi ve öyle yapıldı: efsaneler
 * bölümündeki CC BY plaka kaldırıldı, kulüp kapısının CC BY yedeği CC0 bir
 * kareyle değiştirildi. Sayfada atıf isteyen tek bir görsel kalmadı.
 */
export default async function FootballHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  /**
   * ⚠️ YALNIZCA 404 "bulunamadı"dır.
   *
   * Önceki hâl her hatayı yutup `notFound()` çağırıyordu: backend bir saniye
   * için düşse, ağ takılsa ya da uç 500 dönse ziyaretçi "sayfa yok" görüyordu
   * — oysa sayfa var, veri gelmedi. Hata sınıfını ayırmak müzik kanadındaki
   * yerleşik desenin aynısı (`muzik/liste/[slug]/page.tsx`): 404 gerçekten
   * yok demek, kalan her şey yukarı fırlatılıp Next'in hata sınırına gidiyor
   * ve orada yeniden denenebiliyor.
   */
  /**
   * Küratör görselleri hub isteğiyle AYNI ANDA yola çıkıyor (2026-08-22):
   * yuva sahibi listesi tamamen yerel (hub sahibi + defter slug'ları), hub
   * yanıtına bağlı değil — eskiden hub bitene kadar bekletilip ikinci bir
   * ağ turu ekliyordu. `readCuratorImages` hiçbir koşulda reject etmez
   * (bkz. lib/sport/curator-images.ts), yarıda kalan promise sızıntısı yok.
   * Uç düşerse boş harita döner ve sayfa varsayılanlarla açılır.
   */
  const imagesPromise = readCuratorImages([
    HUB_OWNER,
    ...FAVOURITE_PLAYERS.map((p) => p.slug),
  ]);

  let hub;
  try {
    hub = await fetchFootballHub();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const { featuredClub, clubs, legends, moments } = hub;
  const otherClubs = clubs.filter((c) => c.slug !== featuredClub?.slug);

  // Kanadın tamamı boşsa sayfa hiç açılmasın — brief'in boş oda yasağı.
  if (!featuredClub && clubs.length === 0 && legends.length === 0) {
    notFound();
  }

  const isAdmin = await readIsAdmin();

  // Küratör görselleri: sayfanın kendi yuvaları + her futbolcunun kart
  // yuvası. İstek yukarıda, hub'la paralel başlatıldı.
  const images = await imagesPromise;

  /**
   * EFSANELER — iki kaynak tek salonda.
   *
   * Önce arşiv kayıtları (backend), sonra defterde `legendEpithet` yazılmış
   * favori futbolcular. Adresleri farklı: efsane kendi efsane sayfasına,
   * futbolcu kendi profiline gidiyor. Portresi de farklı yerden geliyor —
   * biri backend kaydı (burada düzenlenemez, kendi ekranı var), diğeri
   * defterdeki kart yuvası (burada düzenlenebilir).
   */
  const legendEntries = [
    /* ⚠️ Defterde karşılığı olan arşiv kaydı ELENİYOR — yoksa aynı kişi
       şeritte iki kez çıkar ve iki kart farklı sayfalara gider (Hagi,
       21 Ağustos 2026). Gerekçesi `isInNotebook` başında. */
    ...legends
      .filter((legend) => !isInNotebook(legend.slug))
      .map((legend) => ({
      key: `arsiv-${legend.slug}`,
      name: legend.name,
      nameLang: nameLangOfCode(legend.countryCode),
      epithet: pick(locale, legend.epithetTr, legend.epithetEn),
      countryCode: legend.countryCode,
      yearsFrom: legend.yearsFrom,
      yearsTo: legend.yearsTo,
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
    ...FAVOURITE_PLAYERS.filter((player) => player.legendEpithet).map(
      (player) => ({
        key: `favori-${player.slug}`,
        name: player.name,
        nameLang: nameLangOf(player),
        epithet: player.legendEpithet ?? "",
        countryCode: player.countryCode,
        yearsFrom: null,
        yearsTo: null,
        href: sportHref.favouritePlayer(player.slug),
        portrait: { ...player.card, owner: player.slug },
        editable: true,
      }),
    ),
  ];

  const historyEntries = moments.map((moment) => ({
    year: moment.year,
    title: pick(locale, moment.titleTr, moment.titleEn),
    kind: moment.kind,
    // ⚠️ Çapa korunuyor: kulüp sayfasındaki dönem bölümüne iniyor.
    href: `${sportHref.club(moment.era.club.slug)}#${moment.era.slug}`,
    image: historySlot(
      moment.era.club.slug,
      moment.era.slug,
      moment.year,
      pick(locale, moment.titleTr, moment.titleEn),
    ),
  }));

  return (
    <PlayerCuratorProvider
      defaultOwner={HUB_OWNER}
      isAdmin={isAdmin}
      initialImages={images}
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
      <div className={styles.page}>
        <nav
          className={`${shell.crumb} ${styles.crumb}`}
          aria-label="breadcrumb"
        >
          <Link href={sportHref.root()}>{t("backToSport")}</Link>
        </nav>

        {/* ══ Sahne 1 · gece ══ */}
        <HubStage
          title={t("football.name")}
          lines={[t("hub.statementA"), t("hub.statementB")]}
          scrollHint={t("hub.scroll")}
          plate={HUB_HERO_SLOT}
          index={[
            { label: t("hub.indexClubs"), count: clubs.length },
            { label: t("hub.indexLegends"), count: legendEntries.length },
            { label: t("hub.indexPlayers"), count: FAVOURITE_PLAYERS.length },
            { label: t("hub.indexStories"), count: moments.length },
          ].filter((entry) => entry.count > 0)}
        />

        {/* ══ Sahne 2 · kulüp kapısı ══ */}
        {featuredClub ? (
          <ClubGate
            slug={featuredClub.slug}
            name={featuredClub.name}
            tagline={pick(
              locale,
              featuredClub.taglineTr,
              featuredClub.taglineEn,
            )}
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
          allHref={sportHref.legends()}
          labels={{
            title: t("hub.legends"),
            lede: t("hub.legendsLede"),
            open: t("hub.legendOpen"),
            years: t("hub.legendYears"),
            all: t("hub.allLegends"),
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
            Sessiz kalıyor ve öyle kalmalı: bu bir sahne değil, bir dizin. */}
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
      </div>
    </PlayerCuratorProvider>
  );
}
