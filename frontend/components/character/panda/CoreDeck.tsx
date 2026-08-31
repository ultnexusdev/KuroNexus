"use client";

import styles from "./ThreeCoresExperience.module.css";

/**
 * Üç çekirdek güvertesi — sayfanın kalbi, ama DURUMU YOK.
 *
 * Durumun tamamı `CoreShell`de duruyor, çünkü seçim sayfanın KÖK öğesindeki
 * `data-core` / `data-locked` niteliklerini çeviriyor ve üç sütunun oranı
 * bütün bölümlerde o niteliklerden okunuyor. Bu bileşen yalnızca çiziyor.
 *
 * ── TÜKENME ──────────────────────────────────────────────────────────────
 * Bir çekirdek "yakıldığında" TÜKENİYOR: bir daha yakılamıyor. Ama kaydı
 * okunabilir kalıyor — tükenmiş sütunun düğmesi hâlâ odaklanabilir ve
 * basıldığında o çekirdeğin okumasını yeniden açıyor (yeniden tüketmiyor).
 *
 * ⚠️ `disabled` KULLANILMADI. Tükenmiş düğme `aria-disabled="true"` taşıyor
 * ve `aria-describedby` ile "bu çekirdek tükendi" açıklamasına bağlanıyor:
 * `disabled` olsaydı düğme sekme sırasından düşer, klavyeyle gezen okuyucu
 * o sütunun neden değiştiğini hiç duymazdı. Odağın kaybolmaması şart.
 *
 * ⚠️ Kadrajlar ve küratör yuvaları SUNUCUDA çizilip `frame` propuyla
 * geliyor. Böylece tükenmiş ya da kilitli bir sütunun içindeki `CuratorSlot`
 * mekaniğin durumundan bağımsız olarak çalışmaya devam ediyor.
 */

export interface DeckStat {
  key: string;
  label: string;
  /** `null` → kayıt bu çekirdeği çalışırken göstermiyor */
  value: number | null;
  max: number;
}

export interface DeckCore {
  key: string;
  column: 1 | 2 | 3;
  name: string;
  native: string;
  recordLine: string;
  kin: string;
  tagline: string;
  text: string;
  reading: string;
  loss: string;
  stats: DeckStat[];
  /** Gövde silueti — sunucuda çizilmiş SVG */
  silhouette: React.ReactNode;
  /** Kadraj + HEMEN ALTINDAKİ küratör yuvası — sunucuda çizilmiş */
  frame: React.ReactNode;
}

export interface DeckUi {
  deckLabel: string;
  ignite: string;
  reopen: string;
  intactBadge: string;
  spentBadge: string;
  liveBadge: string;
  spentHelp: string;
  remaining: string;
  statsTitle: string;
  statsNote: string;
  unmeasured: string;
  silhouetteLabel: string;
  idleHint: string;
  lockedTitle: string;
  lockedNative: string;
  lockedBody: string;
  lockedNote: string;
}

export function CoreDeck({
  cores,
  ui,
  spent,
  active,
  locked,
  message,
  lockedGlyph,
  onPick,
}: {
  cores: DeckCore[];
  ui: DeckUi;
  spent: string[];
  active: string | null;
  locked: boolean;
  /** `aria-live` bölgesine yazılan son duyuru */
  message: string;
  /** Kırık bambu — sunucuda çizilmiş SVG */
  lockedGlyph: React.ReactNode;
  onPick: (key: string) => void;
}) {
  const remaining = cores.length - spent.length;

  return (
    <div className={styles.deckWrap}>
      <div className={styles.deckMeter}>
        <span className={styles.deckMeterLabel}>{ui.remaining}</span>
        <span className={styles.deckMeterValue}>
          {remaining}
          <span className={styles.deckMeterOf}>/{cores.length}</span>
        </span>
        <span className={styles.deckMeterPips} aria-hidden>
          {cores.map((core) => (
            <span
              key={core.key}
              className={styles.deckPip}
              data-spent={spent.includes(core.key) ? "true" : "false"}
            />
          ))}
        </span>
      </div>

      {/* Duyuru bölgesi baştan DOM'da; yalnızca içeriği değişiyor. */}
      <p className={styles.live} role="status" aria-live="polite">
        {message}
      </p>

      <div className={styles.deck} role="group" aria-label={ui.deckLabel}>
        {cores.map((core) => {
          const isSpent = spent.includes(core.key);
          const isActive = active === core.key;
          const state = isActive ? "live" : isSpent ? "spent" : "intact";
          const helpId = `pnd-core-help-${core.key}`;
          return (
            <article
              key={core.key}
              className={styles.core}
              data-column={core.column}
              data-state={state}
              data-spent={isSpent ? "true" : "false"}
            >
              <p className={styles.coreKin}>{core.kin}</p>
              <h3 className={styles.coreName}>
                {core.name}
                <span className={styles.coreNative} lang="ja">
                  {core.native}
                </span>
              </h3>
              <p className={styles.coreRecord}>{core.recordLine}</p>

              {/* Durum yalnızca renkle değil YAZIYLA da veriliyor ve ekran
                  okuyucudan gizlenmiyor: rozet metni tükenmeyi duyuran ikinci
                  kanal (birincisi aşağıdaki `aria-live` bölgesi). */}
              <span className={styles.coreBadge} data-state={state}>
                {isActive ? ui.liveBadge : isSpent ? ui.spentBadge : ui.intactBadge}
              </span>

              <figure className={styles.coreShape}>
                {core.silhouette}
                <figcaption className={styles.coreShapeCap}>
                  {ui.silhouetteLabel}
                </figcaption>
              </figure>

              <p className={styles.coreTagline}>{core.tagline}</p>
              <p className={styles.coreText}>{core.text}</p>

              <button
                type="button"
                className={styles.coreButton}
                aria-pressed={isActive}
                aria-disabled={isSpent ? true : undefined}
                aria-describedby={isSpent ? helpId : undefined}
                onClick={() => onPick(core.key)}
              >
                <span className={styles.coreButtonMark} aria-hidden />
                <span className={styles.coreButtonLabel}>
                  {isSpent ? ui.reopen : ui.ignite}
                </span>
              </button>

              {/* Açıklama HER ZAMAN DOM'da: `aria-describedby` yalnızca
                  tükenmişken bağlanıyor, ama metin kaybolmuyor. */}
              <p
                id={helpId}
                className={styles.coreHelp}
                data-shown={isSpent ? "true" : "false"}
              >
                {ui.spentHelp}
              </p>

              <div className={styles.coreReading} data-open={isActive ? "true" : "false"}>
                <p className={styles.coreReadingText}>{core.reading}</p>
                {isSpent ? (
                  <p className={styles.coreLoss}>{core.loss}</p>
                ) : null}
              </div>

              <div className={styles.coreStats}>
                <p className={styles.coreStatsTitle}>{ui.statsTitle}</p>
                <dl className={styles.statList}>
                  {core.stats.map((stat) => (
                    <div
                      key={stat.key}
                      className={styles.statRow}
                      data-void={stat.value === null ? "true" : "false"}
                    >
                      <dt className={styles.statLabel}>{stat.label}</dt>
                      <dd className={styles.statValue}>
                        {stat.value === null ? (
                          <span className={styles.statVoid}>{ui.unmeasured}</span>
                        ) : (
                          <>
                            <span className={styles.statNumber}>
                              {stat.value}
                              <span className={styles.statMax}>/{stat.max}</span>
                            </span>
                            <span
                              className={styles.statBar}
                              aria-hidden
                              style={
                                {
                                  "--pnd-fill": `${Math.round(
                                    (stat.value / stat.max) * 100,
                                  )}%`,
                                } as React.CSSProperties
                              }
                            />
                          </>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className={styles.coreStatsNote}>{ui.statsNote}</p>
              </div>

              {core.frame}
            </article>
          );
        })}
      </div>

      {locked ? null : <p className={styles.deckHint}>{ui.idleHint}</p>}

      {/* Kilit paneli: üçü de tükendiğinde AÇILAN içerik. Hiçbir şey
          gizlenmiyor — sayfaya bir bölüm ekleniyor. */}
      {locked ? (
        <aside className={styles.locked} aria-labelledby="pnd-locked">
          <span className={styles.lockedMark} aria-hidden>
            {lockedGlyph}
          </span>
          <h3 id="pnd-locked" className={styles.lockedTitle}>
            {ui.lockedTitle}
            <span className={styles.lockedNative} lang="ja">
              {ui.lockedNative}
            </span>
          </h3>
          <p className={styles.lockedBody}>{ui.lockedBody}</p>
          <p className={styles.lockedNote}>{ui.lockedNote}</p>
        </aside>
      ) : null}
    </div>
  );
}
