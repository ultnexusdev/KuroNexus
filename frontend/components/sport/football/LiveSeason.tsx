import { getTranslations } from "next-intl/server";
import type { ClubLiveOverview } from "@/lib/api/football-live";
import { FavouriteEleven } from "./FavouriteEleven";
import { FootballCuratorSwitch } from "./FootballCuratorSwitch";
import { MatchdayHero } from "./MatchdayHero";
import { NewsTicker } from "./NewsTicker";
import { SeasonBoard } from "./SeasonBoard";
import { SquadBoard } from "./SquadBoard";
import { StadiumExperience } from "./StadiumExperience";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./LiveSeason.module.css";

/**
 * Sayfanın ÜST YARISI — yaşayan sezon.
 *
 * ── NEDEN AYRI BİR BİLEŞEN ───────────────────────────────────────────────
 * `<Suspense>` yedeğiyle AKARAK gelsin diye. Kulübün arşivde var olup
 * olmadığı Suspense'in dışında, ilk bayt gönderilmeden karara bağlanıyor
 * (`notFound()` orada çalışıyor ve 404 doğru gidiyor); canlı katman ise
 * hazır olduğunda yerine oturuyor. Bu ayrımın gerekçesi `LiveSkeleton`
 * başlığında ölçümüyle yazılı.
 *
 * ── PROMISE PROP OLARAK GELİYOR ──────────────────────────────────────────
 * `overviewPromise` sayfa tarafında `await` EDİLMEDEN başlatılıp buraya
 * veriliyor. Böylece arşiv isteği ve canlı veri isteği PARALEL koşuyor;
 * `await`i sayfada yapsaydık ikisi sıraya girerdi ve iki tur bekleme
 * eklenirdi.
 *
 * ── HATA YUTULUYOR, SAYFA DÜŞMÜYOR ───────────────────────────────────────
 * Promise reddedilirse (backend kapalı, ağ hatası) bölüm hiç çizilmiyor ve
 * arşiv yarısı tek başına açılıyor. Bir veri kaynağının kesintisi kürasyonu
 * görünmez yapmamalı.
 */
export async function LiveSeason({
  overviewPromise,
  locale,
  clubSlug,
  clubName,
  clubMeta,
  now,
  isAdmin,
}: {
  /**
   * Sayfa tarafında `await` EDİLMEDEN başlatılıp buraya veriliyor (arşiv
   * isteğiyle paralel koşsun diye) ve `.catch()` orada bağlandığı için
   * `null` gelebiliyor — tip bunu yansıtıyor.
   */
  overviewPromise: Promise<ClubLiveOverview | null>;
  locale: string;
  clubSlug: string;
  clubName: string;
  /** "Kuruluş 1905 · İstanbul · RAMS Park" parçaları — canlı katman yoksa künye satırı */
  clubMeta: string[];
  /** Küratör modu düğmesi yalnızca admin için çiziliyor (yetkinin kapısı backend). */
  isAdmin: boolean;
  /** Sunucunun render anı — geri sayım ve maç günü kipi bununla hesaplanıyor */
  now: number;
}) {
  const overview = await overviewPromise.catch(() => null);
  const hasLive = Boolean(
    overview &&
      (overview.fixtures.length > 0 ||
        overview.standings !== null ||
        overview.club !== null),
  );

  // ⚠️ SAYFANIN TEK `<h1>`'İ BU BİLEŞENDE — iki dalda da.
  //
  // İlk sürümde kulüp adı hem maç günü hero'sunda hem arşiv başlığında
  // yazıyordu ve ölçümde sayfada İKİ `<h1>` çıktı (ikisi de aynı metin).
  // Aynı belgede iki birinci düzey başlık, ekran okuyucunun belge planını
  // bozar ve arama motoruna iki farklı sayfa başlığı bildirir.
  //
  // Sorumluluk buraya alındı çünkü "canlı katman var mı" sorusunu YALNIZCA bu
  // bileşen biliyor: veri varsa başlık hero'nun içinde, yoksa aşağıdaki sade
  // künye başlığında. Sayfa tarafındaki arşiv girişi artık başlık taşımıyor.
  if (!hasLive || !overview) {
    return (
      <header className={styles.plainHeader}>
        <h1 className={`${shell.display} ${shell.world}`}>{clubName}</h1>
        {clubMeta.length > 0 ? (
          <p className={shell.data}>{clubMeta.join(" · ")}</p>
        ) : null}
      </header>
    );
  }

  const t = await getTranslations({ locale, namespace: "sportArchive" });
  const clubKey = overview.club?.key ?? clubSlug.toLowerCase();

  // Biçimlendiriciler SUNUCUDA kuruluyor: istemci JS'i gelmese de tarihler
  // doğru okunuyor (bu depoda dev modunda CSP istemci JS'ini engelliyor).
  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  });
  const shortFormat = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
  // Yalnizca gun bilindiginde: "06 Eyl" gibi kisa ve saatsiz.
  const dayFormat = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    timeZone: "Europe/Istanbul",
  });
  const numberFormat = new Intl.NumberFormat(locale);

  return (
    <>
      <MatchdayHero
        overview={overview}
        clubKey={clubKey}
        now={now}
        labels={{
          league: t("live.league"),
          clubFallback: clubName,
          lastMatch: t("live.lastMatch"),
          nextMatch: t("live.nextMatch"),
          fullTime: t("live.fullTime"),
          live: t("live.liveBadge"),
          minute: t("live.minute"),
          versus: t("live.versus"),
          form: t("live.form"),
          kickoff: t("live.kickoff"),
          kickoffTba: t("live.kickoffTba"),
          days: t("live.days"),
          hours: t("live.hours"),
          minutes: t("live.minutes"),
          seconds: t("live.seconds"),
          resultShort: {
            W: t("live.resultW"),
            D: t("live.resultD"),
            L: t("live.resultL"),
          },
          titles: (count) => t("live.titles", { count }),
          target: (next) => t("live.target", { next }),
          formatDateTime: (iso) => dateTimeFormat.format(new Date(iso)),
        }}
      />

      {/* Hero ile veri yarısı arasındaki geçiş bandı. Kaynağı kulübün RESMÎ
          RSS beslemesi — üçüncü taraf haber sitesi değil. */}
      <NewsTicker news={overview.news} label={t("live.newsLabel")} />

      <SeasonBoard
        overview={overview}
        clubKey={clubKey}
        labels={{
          fixtures: t("live.fixtures"),
          scrollHint: t("live.scrollHint"),
          homeShort: t("live.homeShort"),
          awayShort: t("live.awayShort"),
          tba: t("live.tba"),
          seasonStats: t("live.seasonStats"),
          standings: t("live.standings"),
          updated: t("live.updated"),
          source: t("live.source"),
          scorers: t("live.scorers"),
          positionCurve: t("live.positionCurve"),
          currentPosition: t("live.currentPosition"),
          week: t("live.week"),
          col: {
            rank: t("live.col.rank"),
            team: t("live.col.team"),
            played: t("live.col.played"),
            won: t("live.col.won"),
            drawn: t("live.col.drawn"),
            lost: t("live.col.lost"),
            goalsFor: t("live.col.goalsFor"),
            goalsAgainst: t("live.col.goalsAgainst"),
            goalDifference: t("live.col.goalDifference"),
            points: t("live.col.points"),
          },
          stat: {
            played: t("live.stat.played"),
            won: t("live.stat.won"),
            drawn: t("live.stat.drawn"),
            lost: t("live.stat.lost"),
            goalsFor: t("live.stat.goalsFor"),
            goalsAgainst: t("live.stat.goalsAgainst"),
            goalDifference: t("live.stat.goalDifference"),
            cleanSheets: t("live.stat.cleanSheets"),
            goalsForPerMatch: t("live.stat.goalsForPerMatch"),
            goalsAgainstPerMatch: t("live.stat.goalsAgainstPerMatch"),
          },
          formatShort: (iso) => shortFormat.format(new Date(iso)),
          formatDay: (iso) => dayFormat.format(new Date(iso)),
        }}
      />

      {/* Küratörün 11'i kadronun ÜSTÜNDE: "kim oynasın" sorusu, "kim var"
          sorusundan daha ilginç ve sayfanın bu noktasında okuyucu zaten
          kadroya bakmaya hazır. Kurulmamışsa bileşen null dönüyor. */}
      {overview.lineup ? (
        <FavouriteEleven
          lineup={overview.lineup}
          labels={{
            eyebrow: t("live.eleven.eyebrow"),
            title: t("live.eleven.title"),
            emptySlot: t("live.eleven.emptySlot"),
            // Küratörün kendi notu varsa o, yoksa "bu maç kadrosu değil"
            // uyarısı. İkisinden biri HER ZAMAN yazılıyor — bu bölümün
            // yanlış anlaşılması en olası yer.
            note:
              (locale === "en"
                ? overview.lineup.noteEn || overview.lineup.noteTr
                : overview.lineup.noteTr) || t("live.eleven.disclaimer"),
          }}
        />
      ) : null}

      {/* Küratör anahtarı 11'in HEMEN ALTINDA: seçim yapılan yer ile sonucun
          görüldüğü yer aynı ekranda. 11 henüz kurulmamışsa (yukarısı null
          dönerken) düğme yine görünüyor — kurmanın tek yolu o. */}
      {isAdmin ? <FootballCuratorSwitch /> : null}

      <SquadBoard
        squad={overview.squad}
        unavailableReason={
          overview.capabilities.playerSeasonStats
            ? null
            : t("live.squad.noSquadText")
        }
        labels={{
          squad: t("live.squad.squad"),
          viewMode: t("live.squad.viewMode"),
          pitchView: t("live.squad.pitchView"),
          cardView: t("live.squad.cardView"),
          seasonStats: t("live.squad.seasonStats"),
          profile: t("live.squad.profile"),
          noSquadTitle: t("live.squad.noSquadTitle"),
          noSquadText: t("live.squad.noSquadText"),
          line: {
            Goalkeeper: t("live.squad.lineGoalkeeper"),
            Defender: t("live.squad.lineDefender"),
            Midfielder: t("live.squad.lineMidfielder"),
            Attacker: t("live.squad.lineAttacker"),
            other: t("live.squad.lineOther"),
          },
          stat: {
            appearances: t("live.squad.statAppearances"),
            minutes: t("live.squad.statMinutes"),
            goals: t("live.squad.statGoals"),
            assists: t("live.squad.statAssists"),
            yellow: t("live.squad.statYellow"),
            red: t("live.squad.statRed"),
            rating: t("live.squad.statRating"),
          },
          detail: {
            position: t("live.squad.detail.position"),
            age: t("live.squad.detail.age"),
            height: t("live.squad.detail.height"),
            foot: t("live.squad.detail.foot"),
            marketValue: t("live.squad.detail.marketValue"),
          },
          // Piyasa değeri milyon avro olarak: 75000000 → "75 M€".
          // Tam sayı basmak (75.000.000 €) kartın dar sütununa sığmıyor ve
          // futbol okuyucusu zaten "M€" ile düşünüyor.
          formatMoney: (value) =>
            value >= 1_000_000
              ? `${numberFormat.format(Math.round(value / 100_000) / 10)} M€`
              : `${numberFormat.format(value)} €`,
        }}
      />

      {overview.club ? (
        <StadiumExperience
          club={overview.club}
          curatorScenes={overview.curatorImages.stadium}
          labels={{
            eyebrow: t("live.stadium.eyebrow"),
            title: t("live.stadium.title"),
            stadium: t("live.stadium.stadium"),
            capacity: t("live.stadium.capacity"),
            founded: t("live.stadium.founded"),
            formatNumber: (value) => numberFormat.format(value),
          }}
        />
      ) : null}

      {/* Veri künyesi — hangi verinin ne sıklıkta tazelendiği. Sayfanın iki
          yarısının SINIRINDA duruyor: üstteki her şeyin kaynağını söylüyor. */}
      <p className={`${shell.data} ${styles.dataNote}`}>
        {t("live.dataNote")}
        {overview.updatedAt ? (
          <>
            {" · "}
            {t("live.updatedAt")}:{" "}
            <time dateTime={overview.updatedAt}>
              {dateTimeFormat.format(new Date(overview.updatedAt))}
            </time>
          </>
        ) : null}
      </p>
    </>
  );
}
