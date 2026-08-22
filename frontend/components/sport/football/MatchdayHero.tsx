import Image from "next/image";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import {
  isHomeGame,
  matchdayMode,
  opponentOf,
  resultOf,
  type ClubLiveOverview,
  type LiveMatch,
  type MatchdayMode,
} from "@/lib/api/football-live";
import { Countdown } from "./Countdown";
import { LiveScore } from "./LiveScore";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./MatchdayHero.module.css";

/**
 * Maç günü hero'su — sayfanın en güçlü bölümü.
 *
 * ── ATMOSFER KATMANLI, TEK GÖRSEL DEĞİL ──────────────────────────────────
 * Brief altı katman istiyor. Uygulanan hâli:
 *   1 stadyum karesi (gerçek fotoğraf — TheSportsDB fanart, indirilmiş)
 *   2 sinematik karartma (okunurluk maskesi)
 *   3 sarı-kırmızı ışık gradientleri (kadraj DIŞINDAN sızıyor)
 *   4 ışık huzmesi / sweep — yalnızca maç günü kipinde
 *   5 UI glow (skorun arkasındaki halo)
 *   6 film grain — kanat kabuğunda ZATEN var (`.wing::before`), tekrar
 *     eklenmiyor; iki grain üst üste dokuyu çamura çeviriyor
 *
 * Fotoğraf yoksa katman 1 hiç çizilmiyor ve geri kalanı tek başına çalışıyor
 * — "boş resim çerçevesi" göstermek yerine kompozisyon sadeleşiyor.
 *
 * ── MAÇ GÜNÜ KİPİ VERİDEN GELİYOR ────────────────────────────────────────
 * `data-mode` özniteliği kökte duruyor ve bütün yoğunluk farkları CSS'te ona
 * bağlı. Elle açılan bir bayrak YOK: kip `matchdayMode()` ile ilk vuruş
 * saatinden hesaplanıyor, yani sezon boyunca kendiliğinden çalışıyor.
 *
 * ── SUNUCUDA HESAPLANAN "ŞİMDİ" ──────────────────────────────────────────
 * `now` prop olarak geliyor ve sayfa `force-dynamic`. Bileşen içinde
 * `Date.now()` çağırmak sunucu ve istemcinin farklı ana bakmasına, dolayısıyla
 * hidrasyon uyuşmazlığına yol açardı. Saniye saniye ilerleyen tek şey
 * `Countdown` ve o bilinçli olarak istemci adası.
 */
export function MatchdayHero({
  overview,
  clubKey,
  now,
  labels,
}: {
  overview: ClubLiveOverview;
  clubKey: string;
  now: number;
  labels: HeroLabels;
}) {
  const mode: MatchdayMode = matchdayMode(overview, now);
  // Öncelik KÜRATÖRÜN: yüklediği kare varsa o, yoksa TheSportsDB fanart'ı,
  // o da yoksa banner. Hiçbiri yoksa katman hiç çizilmiyor.
  const backdrop =
    overview.curatorImages.hero[0] ??
    overview.club?.fanart[0] ??
    overview.club?.banner ??
    null;

  return (
    <header className={styles.hero} data-mode={mode}>
      {/* ── Atmosfer katmanları ── */}
      <div className={styles.atmosphere} aria-hidden="true">
        {backdrop ? (
          /* next/image'e 2026-08-22'de çevrildi: üç backdrop kaynağı da
             (küratör karesi, fanart, banner) backend'e indirilen /uploads/*
             yolları — remotePatterns kapsıyor. Ham <img> orijinal dosyayı
             olduğu gibi indiriyordu (yeniden boyutlandırma yok, WebP yok);
             kulüp sayfasının LCP görseli buydu. `priority` eski
             fetchPriority="high"ın karşılığı + preload. Filtre/animasyon
             .backdrop sınıfında, aynen geçerli. */
          <Image
            src={apiUrl(backdrop)}
            alt=""
            fill
            sizes="100vw"
            className={styles.backdrop}
            priority
            /* Karar ham yoldan (PersonHall deseni): /uploads dışı bir adres
               DB'ye girerse optimizer'ı atla, sayfa çökmesin. */
            unoptimized={!isLocalUpload(backdrop)}
          />
        ) : null}
        <span className={styles.veil} />
        <span className={styles.lights} />
        <span className={styles.sweep} />
      </div>

      <div className={styles.body}>
        <p className={`${shell.eyebrow} ${styles.eyebrow}`}>
          {overview.standings?.seasonLabel
            ? `${labels.league} · ${overview.season.label}`
            : overview.season.label}
        </p>

        <h1 className={`${shell.display} ${shell.world} ${styles.name}`}>
          {overview.club?.name ?? labels.clubFallback}
        </h1>

        {overview.club && overview.club.nicknames.length > 0 ? (
          <p className={styles.nicknames}>
            {overview.club.nicknames.join(" · ")}
          </p>
        ) : null}

        {/* ── Yıldızlar ve sıradaki hedef ──
            Yıldız sayısı kupa sayısından TÜRETİLİYOR (her beş şampiyonluk bir
            yıldız) — eski görsellerdeki üç/dört yıldız yerine güncel sayı
            neyse o çiziliyor. Kupa sayısı bilinmiyorsa bant HİÇ görünmüyor;
            tahmini bir yıldız dizmek kulübün en görünür işaretini yanlış
            göstermek olurdu. */}
        {overview.club?.stars && overview.club.nextTitle ? (
          <p className={styles.honours}>
            <span className={styles.stars} aria-hidden="true">
              {"★".repeat(overview.club.stars)}
            </span>
            <span className={styles.honoursText}>
              {labels.titles(overview.club.leagueTitles ?? 0)}
            </span>
            <span className={styles.target}>
              {labels.target(overview.club.nextTitle)}
            </span>
          </p>
        ) : null}

        {/* ── Canlı maç: hero'yu devralıyor ── */}
        {overview.live ? (
          <LiveScore
            initial={overview.live}
            clubKey={clubKey}
            labels={{ live: labels.live, minute: labels.minute }}
          />
        ) : null}

        <div className={styles.split}>
          {/* ── Son maç ── */}
          {overview.lastMatch && !overview.live ? (
            <section className={styles.last}>
              <h2 className={`${shell.eyebrow} ${styles.blockLabel}`}>
                {mode === "complete" ? labels.fullTime : labels.lastMatch}
              </h2>
              <Scoreline match={overview.lastMatch} clubKey={clubKey} />
              <MatchMeta match={overview.lastMatch} labels={labels} />
            </section>
          ) : null}

          {/* ── Sonraki maç + geri sayım ── */}
          {overview.nextMatch ? (
            <section className={styles.next}>
              <h2 className={`${shell.eyebrow} ${styles.blockLabel}`}>
                {labels.nextMatch}
              </h2>
              <p className={styles.nextTeams}>
                <span>{overview.nextMatch.home.name}</span>
                <span className={styles.nextVs}>{labels.versus}</span>
                <span>{overview.nextMatch.away.name}</span>
              </p>

              {overview.nextMatch.kickoffAt ? (
                <Countdown
                  targetIso={overview.nextMatch.kickoffAt}
                  now={now}
                  labels={{
                    days: labels.days,
                    hours: labels.hours,
                    minutes: labels.minutes,
                    seconds: labels.seconds,
                    kickoff: labels.kickoff,
                  }}
                />
              ) : (
                // Saat henüz açıklanmamış (TFF sezonun ilk üç haftasından
                // sonrasını tarihlendirmiyor). Sahte bir geri sayım
                // göstermektense durumu yazıyoruz.
                <p className={styles.noKickoff}>{labels.kickoffTba}</p>
              )}

              <MatchMeta match={overview.nextMatch} labels={labels} />
            </section>
          ) : null}
        </div>

        {/* ── Form şeridi ── */}
        {overview.form.length > 0 ? (
          <section className={styles.form} aria-label={labels.form}>
            <h2 className={`${shell.eyebrow} ${styles.blockLabel}`}>
              {labels.form}
            </h2>
            <ol className={styles.formList}>
              {overview.form.map((match) => {
                const result = resultOf(match, clubKey);
                if (!result) return null;
                const foe = opponentOf(match, clubKey);
                return (
                  <li key={match.id} className={styles.formItem}>
                    <span
                      className={styles.formChip}
                      data-result={result}
                      title={`${foe.name} · ${match.homeGoals}-${match.awayGoals}`}
                    >
                      {labels.resultShort[result]}
                    </span>
                    <span className={styles.formFoe}>{foe.name}</span>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}
      </div>
    </header>
  );
}

/** Büyük skor gösterimi. Kazanan taraf ağırlıkla değil OPAKLIKLA ayrılıyor. */
function Scoreline({ match, clubKey }: { match: LiveMatch; clubKey: string }) {
  const result = resultOf(match, clubKey);
  const home = isHomeGame(match, clubKey);

  return (
    <div className={styles.scoreline}>
      <TeamSide team={match.home} align="end" mine={home} />
      <p className={`${shell.figure} ${styles.score}`} data-result={result}>
        <span>{match.homeGoals ?? "–"}</span>
        <span className={styles.scoreDash}>–</span>
        <span>{match.awayGoals ?? "–"}</span>
      </p>
      <TeamSide team={match.away} align="start" mine={!home} />
    </div>
  );
}

function TeamSide({
  team,
  align,
  mine,
}: {
  team: LiveMatch["home"];
  align: "start" | "end";
  mine: boolean;
}) {
  return (
    <div className={styles.side} data-align={align} data-mine={mine || undefined}>
      {team.crest ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apiUrl(team.crest)}
          alt=""
          className={styles.crest}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <span className={styles.sideName}>{team.name}</span>
    </div>
  );
}

/**
 * Maç künyesi — tarih, organizasyon, hafta, stat.
 *
 * Tarih `<time>` içinde ve makine okunur `dateTime` taşıyor. Görünen metin
 * SUNUCUDA biçimlendiriliyor (`Intl`), böylece istemci JS'i gelmese de
 * doğru okunuyor — bu kanatta CSP dev modunda istemci JS'ini engelliyor ve
 * ev deseni "JS olmadan da doğru" yönünde.
 */
function MatchMeta({ match, labels }: { match: LiveMatch; labels: HeroLabels }) {
  const parts = [
    match.competition,
    match.round,
    match.venue,
  ].filter((v): v is string => Boolean(v));

  return (
    <p className={`${shell.data} ${styles.meta}`}>
      {match.kickoffAt ? (
        <time dateTime={match.kickoffAt}>
          {labels.formatDateTime(match.kickoffAt)}
        </time>
      ) : null}
      {parts.length > 0 ? (
        <span className={styles.metaRest}>{parts.join(" · ")}</span>
      ) : null}
    </p>
  );
}

export interface HeroLabels {
  league: string;
  clubFallback: string;
  lastMatch: string;
  nextMatch: string;
  fullTime: string;
  live: string;
  minute: string;
  versus: string;
  form: string;
  kickoff: string;
  kickoffTba: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  resultShort: Record<"W" | "D" | "L", string>;
  /** 26 → "26 şampiyonluk" */
  titles: (count: number) => string;
  /** 27 → "HEDEF 27" */
  target: (next: number) => string;
  formatDateTime: (iso: string) => string;
}
