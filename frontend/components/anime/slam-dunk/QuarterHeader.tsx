import court from "./court.module.css";
import styles from "./QuarterHeader.module.css";

/**
 * ÇEYREK BAŞLIĞI — dört bölümün paylaştığı giriş bloğu.
 *
 * Skorbordun çeyrek adı, bölümün kendi başlığı ve bir alt satır. Tek
 * bileşen olması, dört bölümde başlık ölçüsünün ayrışmasını engelliyor —
 * Bleach'te on altı bölümün başlığı tek tek yazılmıştı ve üçü zamanla
 * kaymıştı.
 *
 * ⚠️ `id` BAŞLIKTA DEĞİL BÖLÜMDE. Çapa `<section id="...">` üzerinde
 * duruyor (`anchors.ts` defteri onu arıyor); başlığa koymak, skorbord
 * bağlantısının bölümün ortasına inmesi demekti.
 */
export function QuarterHeader({
  quarter,
  title,
  lede,
  titleId,
  score,
}: {
  /** Skorbordda yazan kısa ad — "2. ÇEYREK" */
  quarter: string;
  title: string;
  lede?: string;
  /** `aria-labelledby` için — bölüm bunu gösteriyor */
  titleId: string;
  /** Bölümün anlattığı maçın skor satırı. ÇEVRİLMEZ (sayı). */
  score?: { line: string; caption: string; won: boolean } | null;
}) {
  return (
    <header className={styles.header}>
      <p className={court.eyebrow}>{quarter}</p>

      <h2 id={titleId} className={`${court.display} ${styles.title}`}>
        {title}
      </h2>

      {lede ? <p className={`${court.body} ${styles.lede}`}>{lede}</p> : null}

      {score ? (
        <p className={styles.score} data-won={score.won ? "" : undefined}>
          <span className={`${court.numeral} ${styles.scoreLine}`}>
            {score.line}
          </span>
          <span className={styles.scoreCaption}>{score.caption}</span>
        </p>
      ) : null}
    </header>
  );
}
