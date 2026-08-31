"use client";

import { useState } from "react";
import styles from "./VolcanoExperience.module.css";

/** Bir okuma — metinler SUNUCUDA çözülmüş düz dize. */
export interface AshReading {
  key: string;
  native: string;
  title: string;
  text: string;
}

/** Kül dolduğunda ulaşılan yoğunluk. Perde `data-ash` ile bu sayıyı okuyor. */
const MAX_ASH = 4;
/** Üfleme üç kez işe yarıyor; dördüncüsü kalkmıyor. */
const MAX_BLOWS = 3;

/**
 * "KÜL" — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Okudukça kül birikiyor. Her açılan katman külü `hız` kadar artırıyor
 * (hız = üfleme sayısı + 1) ve kül metnin üstüne KISMEN düşüyor. "Üfle"
 * külü tamamen kaldırıyor — ama hızı bir kademe yükseltiyor. Bütün
 * katmanlar açıldıktan sonra üfleme anında geri çöküyor, çünkü artık
 * geciktirecek bir okuma kalmıyor. Dördüncü üfleme hiç çalışmıyor ve
 * yenilgi metni orada açılıyor.
 *
 * Bu bir ilerleme değil bir KAYBEDİŞ: gösterge dolmuyor, engel geri
 * geliyor ve her seferinde daha hızlı geliyor.
 *
 * ── NEDEN LEVİ'NİN "TOZ SİLME"Sİ DEĞİL (Dalga 1) ─────────────────────────
 * Levi'de toz KALICI temizleniyordu: sildiğin yer temiz kalıyor, sayfa
 * adım adım açılıyordu — yani bir ilerleme çubuğu. Burada temizlik
 * geçici ve her temizlik bir sonrakini YAKINLAŞTIRIYOR; dördüncüde
 * temizlik diye bir şey kalmıyor. Levi'de kazanıyorsun, burada
 * kaybediyorsun.
 *
 * ── ERİŞİLEBİLİRLİK (görev şartı) ────────────────────────────────────────
 *  · Kül katmanı `aria-hidden` + `pointer-events: none` (CSS) — yalnızca
 *    görsel bir örtü. Metin ekran okuyucuda HER ZAMAN tam okunuyor.
 *  · `prefers-reduced-motion`da kül HİÇ birikmiyor: perdenin opaklığı
 *    yalnızca `no-preference` kapısının içinde tanımlı.
 *  · En yoğun kül bile metni okunamaz yapmıyor — perde `--jgo-ash-max`
 *    ile sınırlı (0.32) ve o değerde ana metnin kontrastı 5.8:1, ikincil
 *    metnin 4.6:1 ölçüldü (ikisi de 4.5 eşiğinin üstünde).
 *  · İki düğme de gerçek `<button>`, klavyeyle erişilebilir ve HİÇBİRİ
 *    `disabled` değil: kullanılamaz durumlar `aria-disabled` + bir
 *    açıklama satırıyla veriliyor (`aria-describedby`), böylece odak
 *    zincirinden düşmüyorlar.
 *  · Durum değişimi `aria-live="polite"` ile duyuruluyor.
 *  · Kadraj ve küratör yuvası perdenin DIŞINDA, listenin altında: kül
 *    yükleme kutusunun üstünü hiçbir durumda kapatmıyor.
 */
export function AshFall({
  readings,
  openLabel,
  openDoneLabel,
  blowLabel,
  blowNothingLabel,
  blowDeadLabel,
  counterLabel,
  rateLabel,
  depthLabel,
  lead,
  statusOpened,
  statusAsh,
  statusBlown,
  statusBackAtOnce,
  statusNothing,
  statusSealed,
  statusFull,
  blowHint,
  blowDeadHint,
  keyboardHint,
  sealedKicker,
  sealedTitle,
  sealedBody,
  frame,
}: {
  readings: AshReading[];
  openLabel: string;
  openDoneLabel: string;
  blowLabel: string;
  blowNothingLabel: string;
  blowDeadLabel: string;
  counterLabel: string;
  rateLabel: string;
  depthLabel: string;
  lead: string;
  statusOpened: string;
  statusAsh: string;
  statusBlown: string;
  statusBackAtOnce: string;
  statusNothing: string;
  statusSealed: string;
  statusFull: string;
  blowHint: string;
  blowDeadHint: string;
  keyboardHint: string;
  sealedKicker: string;
  sealedTitle: string;
  sealedBody: string[];
  /** Kadraj + küratör yuvası — sunucuda çizilmiş, perdenin DIŞINDA duruyor */
  frame: React.ReactNode;
}) {
  const [opened, setOpened] = useState(0);
  const [blows, setBlows] = useState(0);
  const [ash, setAsh] = useState(0);
  const [sealed, setSealed] = useState(false);
  const [status, setStatus] = useState("");

  const total = readings.length;
  const rate = blows + 1;
  const allOpen = opened >= total;
  const dead = blows >= MAX_BLOWS;

  const openNext = () => {
    if (allOpen) {
      setStatus(statusFull);
      return;
    }
    const next = opened + 1;
    const nextAsh = Math.min(MAX_ASH, ash + rate);
    setOpened(next);
    setAsh(nextAsh);
    setStatus(
      `${statusOpened} ${readings[next - 1].title}. ${statusAsh} ${nextAsh}/${MAX_ASH}.`,
    );
  };

  const blow = () => {
    if (dead) {
      /* Dördüncü üfleme: kül kalkmıyor ve yenilgi metni açılıyor. */
      setSealed(true);
      setAsh(MAX_ASH);
      setStatus(statusSealed);
      return;
    }
    if (ash === 0) {
      setStatus(statusNothing);
      return;
    }
    const nextBlows = blows + 1;
    /* Her temizlemeden sonra kül daha HIZLI biriyor. Okunacak katman
       kalmadıysa geciktirecek bir şey de kalmıyor: kül aynı anda çöküyor. */
    const nextAsh = allOpen ? Math.min(MAX_ASH, nextBlows + 1) : 0;
    setBlows(nextBlows);
    setAsh(nextAsh);
    setStatus(allOpen ? statusBackAtOnce : statusBlown);
  };

  const blowCurrentLabel = dead
    ? blowDeadLabel
    : ash === 0
      ? blowNothingLabel
      : blowLabel;

  return (
    <div className={styles.ash} data-sealed={sealed ? "true" : "false"}>
      <div className={styles.ashBar}>
        <button
          type="button"
          className={styles.ashOpen}
          onClick={openNext}
          aria-disabled={allOpen}
        >
          <span className={styles.ashOpenMark} aria-hidden />
          <span className={styles.ashOpenLabel}>
            {allOpen ? openDoneLabel : openLabel}
          </span>
        </button>

        <button
          type="button"
          className={styles.ashBlow}
          onClick={blow}
          aria-disabled={dead || ash === 0}
          aria-describedby={dead ? "jgo-ash-dead" : "jgo-ash-hint"}
        >
          <span className={styles.ashBlowMark} aria-hidden />
          <span className={styles.ashBlowLabel}>{blowCurrentLabel}</span>
        </button>
      </div>

      <dl className={styles.ashMeters}>
        <div className={styles.ashMeter}>
          <dt className={styles.ashMeterLabel}>{counterLabel}</dt>
          <dd className={styles.ashMeterValue}>
            {opened}/{total}
          </dd>
        </div>
        <div className={styles.ashMeter}>
          <dt className={styles.ashMeterLabel}>{rateLabel}</dt>
          <dd className={styles.ashMeterValue}>×{rate}</dd>
        </div>
        <div className={styles.ashMeter}>
          <dt className={styles.ashMeterLabel}>{depthLabel}</dt>
          <dd className={styles.ashMeterValue}>
            {ash}/{MAX_ASH}
          </dd>
        </div>
      </dl>

      <p className={styles.ashStatus} aria-live="polite">
        {status || lead}
      </p>

      {/* İki açıklama da HER ZAMAN görünür; `aria-describedby` dördüncü
          aşamada ikincisine geçiyor. Klavye/erişilebilirlik notu duruma
          bağlı DEĞİL: mekaniğin nasıl çalıştığını en baştan söylüyor. */}
      <p id="jgo-ash-hint" className={styles.ashHint}>
        {blowHint}
      </p>
      {dead ? (
        <p id="jgo-ash-dead" className={styles.ashDeadHint}>
          {blowDeadHint}
        </p>
      ) : null}
      <p className={styles.ashHint}>{keyboardHint}</p>

      {/* ── KÜL PERDESİ VE ALTINDAKİ METİN ────────────────────────────────
          Perde `aria-hidden` ve `pointer-events: none`: metnin üstünde
          duruyor ama ne okumayı ne tıklamayı engelliyor. Kadraj ve
          küratör yuvası bu panelin DIŞINDA (aşağıda). */}
      <div className={styles.ashPanel} data-ash={ash}>
        <span className={styles.ashVeil} aria-hidden />

        {opened === 0 ? (
          <p className={styles.ashEmpty}>{lead}</p>
        ) : (
          <ol className={styles.ashList}>
            {readings.slice(0, opened).map((reading, index) => (
              <li key={reading.key} className={styles.ashItem}>
                <p className={styles.ashItemIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={styles.ashItemNative} lang="ja" aria-hidden>
                  {reading.native}
                </p>
                <h3 className={styles.ashItemTitle}>{reading.title}</h3>
                <p className={styles.ashItemText}>{reading.text}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* ── DÖRDÜNCÜ KÜL: YENİLGİ METNİ ───────────────────────────────────
          Perdenin dışında ve her zaman tam okunur: bu bölüm bir ödül
          değil, mekaniğin vardığı yer. */}
      {sealed ? (
        <article className={styles.ashSealed} aria-labelledby="jgo-ash-sealed">
          <p className={styles.ashSealedKicker}>{sealedKicker}</p>
          <h3 id="jgo-ash-sealed" className={styles.ashSealedTitle}>
            {sealedTitle}
          </h3>
          {sealedBody.map((line) => (
            <p key={line.slice(0, 24)} className={styles.ashSealedText}>
              {line}
            </p>
          ))}
        </article>
      ) : null}

      {frame}
    </div>
  );
}
