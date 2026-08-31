"use client";

import { ClockDial, StampMark, TieStripes } from "./NanamiGlyphs";
import { useShift } from "./ClockShell";
import styles from "./OvertimeExperience.module.css";

/**
 * Mesai defterinin üç parçası — sayfanın tek ikinci istemci adası.
 *
 *   ShiftEntry — her bandın sağ (üç birimlik) hücresinde duran açılabilir
 *                kayıt. Açmak BİR SAAT harcıyor.
 *   ShiftStrip — mesai şeridi: kadran, dokuz saatlik ray, durum ve
 *                "yeni bir gün başlat" düğmesi.
 *   ShiftLog   — açılan kayıtların defteri (bandın sol hücresinde).
 *
 * ── ERİŞİLEBİLİRLİK KARARI: KİLİT NEYİ KAPATIYOR ─────────────────────────
 * Mesai bittiğinde kapanan tek şey KENAR NOTU — yani her bandın sağ
 * hücresindeki ek kayıt. Bandın sol hücresindeki asıl metin, başlıklar,
 * replikler, künye, kadrajlar ve bağlantılar hiçbir durumda erişilemez
 * olmuyor: ne `display:none` ile, ne `inert` ile, ne sekme sırasından
 * çıkarılarak. Sayfanın anlatısı kilitten bağımsız okunuyor.
 *
 * Buna ek olarak `ShiftStrip` her zaman görünür bir "yeni bir gün başlat"
 * düğmesi taşıyor: kilit geri alınabilir ve geri alma sayfanın kalıcı bir
 * parçası, gizli bir kaçış yolu değil.
 *
 * Kilitlenme `role="status"` ile bir kez duyuruluyor (şeritte), her kayıtta
 * ayrı ayrı değil: dokuzuncu saat dolduğunda üç kayıt aynı anda kilitlenir
 * ve üç ayrı canlı bölge duyurusu ekran okuyucuda gürültüden başka bir şey
 * üretmez. Kayıt kutularındaki `role="status"` yalnızca KULLANICININ kendi
 * açtığı kayıt için var — o her seferinde tek.
 */

const clock = (h: number) => `${String(h).padStart(2, "0")}:00`;

export function ShiftEntry({
  id,
  label,
  record,
  ledgerLabel,
  openLabel,
  costLabel,
  stampPrefix,
  lockedLabel,
  lockedNote,
  mode = "shift",
  overtimeLockedLabel,
  overtimeLockedNote,
  overtimeStamp,
}: {
  id: string;
  label: string;
  record: string;
  ledgerLabel: string;
  openLabel: string;
  costLabel: string;
  stampPrefix: string;
  lockedLabel: string;
  lockedNote: string;
  mode?: "shift" | "overtime";
  overtimeLockedLabel?: string;
  overtimeLockedNote?: string;
  overtimeStamp?: string;
}) {
  const shift = useShift();

  /* Kabuğun dışında çizilmişse kayıt sessizce durur: sayfa düşmez. */
  if (!shift) return null;

  const opened = shift.isOpen(id);
  const loggedAt = shift.log.find((row) => row.id === id)?.hour ?? null;

  /* Fazla mesai kaydı (Shibuya): mesai içinde AÇILMIYOR, 18:00'de
     kendiliğinden düşüyor. Kullanıcı onu bir saat harcayarak satın
     alamıyor — Nanami'nin son günü bir tercih değildi. */
  const overtimeMode = mode === "overtime";
  const state = overtimeMode
    ? shift.closed
      ? "overtime"
      : "waiting"
    : opened
      ? "open"
      : shift.closed
        ? "locked"
        : "idle";

  return (
    <div className={styles.entry} data-state={state}>
      <p className={styles.entryLedger}>{ledgerLabel}</p>
      <p className={styles.entryName}>{label}</p>

      {state === "idle" ? (
        <button
          type="button"
          className={styles.entryButton}
          onClick={() => shift.open(id, label)}
        >
          <span className={styles.entryButtonLabel}>{openLabel}</span>
          <span className={styles.entryCost}>{costLabel}</span>
        </button>
      ) : null}

      {state === "open" ? (
        <>
          <p className={styles.entryStamp} role="status">
            <StampMark
              className={styles.stampArt}
              frameClassName={styles.stampFrame}
              slashClassName={styles.stampSlash}
            />
            <span className={styles.entryStampText}>
              {stampPrefix} {loggedAt === null ? "" : clock(loggedAt)}
            </span>
          </p>
          <p className={styles.entryRecord}>{record}</p>
        </>
      ) : null}

      {state === "locked" ? (
        <>
          <p className={styles.entryLocked}>{lockedLabel}</p>
          <p className={styles.entryLockedNote}>{lockedNote}</p>
        </>
      ) : null}

      {state === "waiting" ? (
        <>
          <p className={styles.entryLocked}>{overtimeLockedLabel}</p>
          <p className={styles.entryLockedNote}>{overtimeLockedNote}</p>
        </>
      ) : null}

      {state === "overtime" ? (
        <>
          <p className={styles.entryStamp} role="status">
            <StampMark
              className={styles.stampArt}
              frameClassName={styles.stampFrame}
              slashClassName={styles.stampSlash}
            />
            <span className={styles.entryStampText}>{overtimeStamp}</span>
          </p>
          <p className={styles.entryRecord}>{record}</p>
        </>
      ) : null}

      <span className={styles.sideFill} aria-hidden>
        <TieStripes
          className={styles.tieArt}
          stripeClassName={styles.tieBand}
          fineClassName={styles.tieFine}
        />
      </span>
    </div>
  );
}

/**
 * Mesai şeridi — 09:00'dan 18:00'e dokuz saat.
 *
 * Ray TIKLANABİLİR DEĞİL ve bilerek öyle: kullanıcı zamanı doğrudan
 * çeviremiyor, yalnızca kayıt açarak harcıyor. Şeritte tek etkileşim
 * "yeni bir gün başlat" düğmesi ve o da geri sarma değil, sıfırlama.
 */
export function ShiftStrip({
  stripLabel,
  nowLabel,
  spentLabel,
  leftLabel,
  openedLabel,
  ruleText,
  resetLabel,
  resetHint,
  statusRunning,
  statusClosed,
  statusReset,
  emptyMark,
}: {
  stripLabel: string;
  nowLabel: string;
  spentLabel: string;
  leftLabel: string;
  openedLabel: string;
  ruleText: string;
  resetLabel: string;
  resetHint: string;
  statusRunning: string;
  statusClosed: string;
  statusReset: string;
  /** Boş saat satırının işareti — çevrilmez */
  emptyMark: string;
}) {
  const shift = useShift();
  if (!shift) return null;

  const span = shift.end - shift.start;
  const rows: number[] = [];
  for (let i = 0; i < span; i += 1) rows.push(shift.start + i);

  const spent = shift.log.length;

  return (
    <div className={styles.strip}>
      <p className={styles.sideLabel}>{nowLabel}</p>
      <p className={styles.sideClock}>{clock(shift.hour)}</p>

      {/* ⚠️ DURUM ve SIFIRLAMA DÜĞMESİ KADRANDAN ÖNCE geliyor ve bu bir
          erişilebilirlik kararı, estetik değil: dar ekranda defter payı
          bandın yüksekliğinin 3/7'si ve içeriği sığmazsa kendi içinde
          kayıyor. Kilidi geri alan düğme o kaydırmanın altında kalamaz. */}
      <p className={styles.stripStatus} role="status">
        {shift.closed ? statusClosed : spent === 0 ? statusReset : statusRunning}
      </p>

      <button
        type="button"
        className={styles.resetButton}
        onClick={shift.reset}
        disabled={spent === 0}
      >
        {resetLabel}
      </button>
      <p className={styles.stripHint}>{resetHint}</p>

      <ClockDial
        hour={shift.hour}
        start={shift.start}
        end={shift.end}
        className={styles.dial}
        faceClassName={styles.dialFace}
        tickClassName={styles.dialTick}
        tickPastClassName={styles.dialTickPast}
        handClassName={styles.dialHand}
        pivotClassName={styles.dialPivot}
      />

      <ol className={styles.rail} aria-label={stripLabel}>
        {rows.map((h, index) => {
          const row = shift.log[index];
          return (
            <li
              key={h}
              className={styles.railRow}
              data-spent={row ? "true" : "false"}
            >
              <span className={styles.railHour}>{clock(h)}</span>
              <span className={styles.railBar} aria-hidden />
              <span className={styles.railEntry}>
                {row ? row.label : emptyMark}
              </span>
            </li>
          );
        })}
      </ol>

      <dl className={styles.meter}>
        <div className={styles.meterRow}>
          <dt className={styles.meterKey}>{spentLabel}</dt>
          <dd className={styles.meterValue}>{spent}</dd>
        </div>
        <div className={styles.meterRow}>
          <dt className={styles.meterKey}>{leftLabel}</dt>
          <dd className={styles.meterValue}>{span - spent}</dd>
        </div>
        <div className={styles.meterRow}>
          <dt className={styles.meterKey}>{openedLabel}</dt>
          <dd className={styles.meterValue}>{spent}</dd>
        </div>
      </dl>

      <p className={styles.stripRule}>{ruleText}</p>
    </div>
  );
}

/**
 * Kayıt defteri — açılan kayıtların sırayla düştüğü liste.
 * Bandın SOL (yedi birimlik) hücresinde duruyor; şeritten farkı, saatlerin
 * değil işlerin listesi olması.
 */
export function ShiftLog({
  title,
  emptyText,
  hourColumn,
  entryColumn,
}: {
  title: string;
  emptyText: string;
  hourColumn: string;
  entryColumn: string;
}) {
  const shift = useShift();
  if (!shift) return null;

  return (
    <div className={styles.log}>
      <h3 className={styles.logTitle}>{title}</h3>

      {shift.log.length === 0 ? (
        <p className={styles.logEmpty}>{emptyText}</p>
      ) : (
        <ol className={styles.logList}>
          <li className={styles.logHead} aria-hidden>
            <span className={styles.logHour}>{hourColumn}</span>
            <span className={styles.logEntry}>{entryColumn}</span>
          </li>
          {shift.log.map((row) => (
            <li key={row.id} className={styles.logRow}>
              <span className={styles.logHour}>{clock(row.hour)}</span>
              <span className={styles.logEntry}>{row.label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
