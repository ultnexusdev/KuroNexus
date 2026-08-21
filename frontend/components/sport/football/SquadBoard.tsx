import { apiUrl } from "@/lib/api/client";
import type { LiveSquadPlayer } from "@/lib/api/football-live";
import { Reveal } from "@/components/sport/Reveal";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./SquadBoard.module.css";

/**
 * Kadro — iki görünüm: SAHA ve KARTLAR.
 *
 * ── GÖRÜNÜM DEĞİŞTİRİCİ JAVASCRIPT KULLANMIYOR ───────────────────────────
 * Gizli radio + `:has()` deseni. Kanatta zaten var (`PodiumStage`) ve
 * gerekçesi orada yazılı: bu depoda `next dev` sırasında CSP `'unsafe-eval'`
 * vermediği için istemci JS'i çalışmıyor; salt-CSS etkileşim her koşulda
 * çalışıyor. Radio'lar gerçek form öğesi olduğu için klavye ve ekran okuyucu
 * desteği bedava geliyor.
 *
 * ── "İLK 11" DEĞİL "KADRO" ───────────────────────────────────────────────
 * ⚠️ Saha görünümü oyuncuları MEVKİ HATLARINA diziyor, bir dizilişe DEĞİL.
 * Elimizdeki veri (API-Football `games.position`) yalnızca dört değer
 * veriyor: kaleci / defans / orta saha / forvet. Bununla 4-3-3 çizmek,
 * bilmediğimiz bir dizilişi biliyormuş gibi göstermek olurdu. Gerçek diziliş
 * maç kadrosu ucundan gelir ve o uç ücretli planda; geldiğinde bu bileşen
 * hatları değil ilk 11'i çizecek şekilde genişletilebilir.
 *
 * ── VERİ YOKKEN ──────────────────────────────────────────────────────────
 * Bölüm gizlenmiyor, AÇIKLANIYOR. Brief'in 29. maddesi tam olarak bunu
 * istiyor: ham hata gösterme ama kullanıcıya verinin neden olmadığını
 * açıkça söyle. Kadro sayfanın manşet bölümlerinden biri; sessizce yok olması
 * "bu site eksik" hissi verirdi, gerekçeli boşluk vermiyor.
 */

const LINES = ["Goalkeeper", "Defender", "Midfielder", "Attacker"] as const;
type Line = (typeof LINES)[number];

/** API-Football mevki adlarını hatta eşliyor; tanımadığını orta sahaya atmıyor, null bırakıyor. */
function lineOf(position: string | null): Line | null {
  if (!position) return null;
  const p = position.toLowerCase();
  if (p.startsWith("goal")) return "Goalkeeper";
  if (p.startsWith("def")) return "Defender";
  if (p.startsWith("mid")) return "Midfielder";
  if (p.startsWith("att") || p.startsWith("for")) return "Attacker";
  return null;
}

export function SquadBoard({
  squad,
  labels,
  unavailableReason,
}: {
  squad: LiveSquadPlayer[];
  labels: SquadLabels;
  /** Veri yoksa gösterilecek gerekçe; null ise bölüm normal çiziliyor. */
  unavailableReason: string | null;
}) {
  return (
    <Reveal as="section" className={styles.section}>
      <header className={styles.head}>
        <h2 className={`${shell.display} ${shell.title}`}>{labels.squad}</h2>

        {squad.length > 0 ? (
          <fieldset className={styles.modes}>
            <legend className={styles.srOnly}>{labels.viewMode}</legend>
            <label className={styles.mode}>
              <input
                type="radio"
                name="squad-view"
                value="pitch"
                defaultChecked
                className={styles.srOnly}
              />
              <span>{labels.pitchView}</span>
            </label>
            <label className={styles.mode}>
              <input
                type="radio"
                name="squad-view"
                value="cards"
                className={styles.srOnly}
              />
              <span>{labels.cardView}</span>
            </label>
          </fieldset>
        ) : null}
      </header>

      {squad.length === 0 ? (
        <div className={styles.unavailable}>
          <p className={styles.unavailableTitle}>{labels.noSquadTitle}</p>
          <p className={styles.unavailableText}>
            {unavailableReason ?? labels.noSquadText}
          </p>
        </div>
      ) : (
        <div className={styles.views}>
          {/* ---- SAHA ---- */}
          <div className={styles.pitch}>
            <div className={styles.pitchLines} aria-hidden="true" />
            {LINES.map((line) => {
              const players = squad.filter((p) => lineOf(p.position) === line);
              if (players.length === 0) return null;
              return (
                <div key={line} className={styles.line} data-line={line}>
                  <p className={`${shell.eyebrow} ${styles.lineLabel}`}>
                    {labels.line[line]}
                  </p>
                  <ul className={styles.lineList}>
                    {players.map((player) => (
                      <li key={player.id} className={styles.pin}>
                        <PlayerPin player={player} labels={labels} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Hattı tanınmayan oyuncular kayboluyor değil, ayrı listeleniyor. */}
            {squad.some((p) => lineOf(p.position) === null) ? (
              <div className={styles.line} data-line="other">
                <p className={`${shell.eyebrow} ${styles.lineLabel}`}>
                  {labels.line.other}
                </p>
                <ul className={styles.lineList}>
                  {squad
                    .filter((p) => lineOf(p.position) === null)
                    .map((player) => (
                      <li key={player.id} className={styles.pin}>
                        <PlayerPin player={player} labels={labels} />
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* ---- KARTLAR ---- */}
          <ul className={styles.cards}>
            {squad.map((player) => (
              <li key={player.id} className={styles.cardItem}>
                <PlayerCard player={player} labels={labels} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Reveal>
  );
}

/** Saha görünümündeki küçük künye. Üzerine gelince istatistik açılıyor (CSS). */
function PlayerPin({
  player,
  labels,
}: {
  player: LiveSquadPlayer;
  labels: SquadLabels;
}) {
  return (
    <div className={styles.pinBody} tabIndex={0}>
      {player.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apiUrl(player.photo)}
          alt=""
          className={styles.pinPhoto}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className={styles.pinPhoto} aria-hidden="true" />
      )}
      <span className={styles.pinName}>{player.name}</span>
      {player.shirtNumber !== null ? (
        <span className={`${shell.figure} ${styles.pinNumber}`}>
          {player.shirtNumber}
        </span>
      ) : null}

      {/* ⚠️ `<dl>` — `<div role="note">` DEĞİL. İçindeki `Stat` bileşeni
          `<dt>`/`<dd>` basıyor ve bu düğümler bir `dl` atası olmadan
          geçersiz: HTML içerik modeli ihlali ve ekran okuyucu terimle tanımı
          eşleştiremiyor. Kartın arka yüzündeki aynı küme (`.cardStats`) zaten
          `<dl>`; niyet baştan buydu, CSS'te de ikisi tek kuralla ele alınıyor
          (`.cardStats, .pinStats { margin: 0 }`). */}
      {player.season ? (
        <dl className={styles.pinStats}>
          <Stat label={labels.stat.appearances} value={player.season.appearances} />
          <Stat label={labels.stat.goals} value={player.season.goals} />
          <Stat label={labels.stat.assists} value={player.season.assists} />
          <Stat label={labels.stat.minutes} value={player.season.minutes} />
          {player.season.rating !== null ? (
            <Stat
              label={labels.stat.rating}
              value={Number(player.season.rating.toFixed(2))}
            />
          ) : null}
        </dl>
      ) : null}
    </div>
  );
}

/**
 * Oyuncu kartı — ön yüz künye, arka yüz sezon istatistiği.
 *
 * Çevirme (flip) `:hover` VE `:focus-within` ile tetikleniyor. Yalnızca hover
 * yazmak kartın arka yüzünü klavye kullanıcısından ve dokunmatik cihazdan
 * tamamen gizlerdi.
 */
function PlayerCard({
  player,
  labels,
}: {
  player: LiveSquadPlayer;
  labels: SquadLabels;
}) {
  const hasStats =
    player.season &&
    Object.values(player.season).some((v) => v !== null && v !== undefined);

  return (
    <article className={styles.card} tabIndex={0}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          {player.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={apiUrl(player.photo)}
              alt=""
              className={styles.cardPhoto}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className={styles.cardPhoto} aria-hidden="true" />
          )}
          <div className={styles.cardMeta}>
            {player.shirtNumber !== null ? (
              <span className={`${shell.figure} ${styles.cardNumber}`}>
                {player.shirtNumber}
              </span>
            ) : null}
            <span className={styles.cardName}>{player.name}</span>
            {player.position ? (
              <span className={`${shell.data} ${styles.cardPosition}`}>
                {player.position}
              </span>
            ) : null}
          </div>
        </div>

        {/* ── KARTIN ARKA YÜZÜ ──
            İstatistik sağlayıcısı açıksa sezon rakamları, değilse KÜNYE.
            Boş bırakmak yerine künye gösteriliyor çünkü o veri ücretsiz
            katmanda ZATEN elimizde (Transfermarkt seti: yaş, boy, ayak,
            piyasa değeri, ayrıntılı mevki). Rakamları uydurmak yerine
            gerçekten bildiğimiz şeyi göstermek. */}
        {hasStats && player.season ? (
          <div className={styles.cardBack}>
            <p className={`${shell.eyebrow} ${styles.cardBackTitle}`}>
              {labels.seasonStats}
            </p>
            <dl className={styles.cardStats}>
              <Stat label={labels.stat.appearances} value={player.season.appearances} />
              <Stat label={labels.stat.minutes} value={player.season.minutes} />
              <Stat label={labels.stat.goals} value={player.season.goals} />
              <Stat label={labels.stat.assists} value={player.season.assists} />
              <Stat label={labels.stat.yellow} value={player.season.yellowCards} />
              <Stat label={labels.stat.red} value={player.season.redCards} />
            </dl>
          </div>
        ) : hasProfile(player) ? (
          <div className={styles.cardBack}>
            <p className={`${shell.eyebrow} ${styles.cardBackTitle}`}>
              {labels.profile}
            </p>
            <dl className={styles.cardStats}>
              {player.detailedPosition ? (
                <TextStat
                  label={labels.detail.position}
                  value={player.detailedPosition}
                />
              ) : null}
              <Stat label={labels.detail.age} value={player.age ?? null} />
              <Stat label={labels.detail.height} value={player.heightInCm ?? null} />
              {player.foot ? (
                <TextStat label={labels.detail.foot} value={player.foot} />
              ) : null}
              {player.marketValueInEur ? (
                <TextStat
                  label={labels.detail.marketValue}
                  value={labels.formatMoney(player.marketValueInEur)}
                />
              ) : null}
            </dl>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** Değer null ise satır HİÇ çizilmiyor — "0" yazmak veri varmış gibi gösterir. */
function Stat({ label, value }: { label: string; value: number | null }) {
  if (value === null || value === undefined) return null;
  return (
    <div className={styles.statRow}>
      <dt>{label}</dt>
      <dd className={shell.figure}>{value}</dd>
    </div>
  );
}

/** Metin değerli künye satırı (ayak, mevki, piyasa değeri). */
function TextStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statRow}>
      <dt>{label}</dt>
      <dd className={styles.statText}>{value}</dd>
    </div>
  );
}

/** Kart arka yüzünde gösterilecek KÜNYE verisi var mı? */
function hasProfile(player: LiveSquadPlayer): boolean {
  return Boolean(
    player.detailedPosition ||
      player.age ||
      player.heightInCm ||
      player.foot ||
      player.marketValueInEur,
  );
}

export interface SquadLabels {
  squad: string;
  viewMode: string;
  pitchView: string;
  cardView: string;
  seasonStats: string;
  profile: string;
  noSquadTitle: string;
  noSquadText: string;
  line: Record<Line | "other", string>;
  stat: {
    appearances: string;
    minutes: string;
    goals: string;
    assists: string;
    yellow: string;
    red: string;
    rating: string;
  };
  detail: {
    position: string;
    age: string;
    height: string;
    foot: string;
    marketValue: string;
  };
  /** 75000000 → "75 M€" */
  formatMoney: (value: number) => string;
}
