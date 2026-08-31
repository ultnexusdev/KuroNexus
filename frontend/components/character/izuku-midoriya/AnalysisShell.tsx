"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { SparkMark, UnderlineMark } from "./MidoriyaGlyphs";
import styles from "./NotebookExperience.module.css";

/**
 * Midoriya sayfasının kabuğu ve TEK modu — "Analiz" (分析).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca doğru sırayla taşır. İstemciye inen tek şey bu
 * düğme, bir boolean ve iki SVG.
 *
 * ── MODUN NE YAPTIĞI (brief §Düğme) ──────────────────────────────────────
 * `data-analysis="off" | "on"` sayfaya İÇERİK EKLİYOR, düzen değiştirmiyor:
 *
 *   off → kareli zemin, kenar (marj) çizgisi, asimetrik iki kolon, bölüm
 *         numaraları ve kanji sekmeleri YERİNDE. Sayfa temiz bir defter.
 *   on  → her bölümün kenar sütununa el yazısı bir not (Corinthia), çizilen
 *         bir ok (`stroke-dashoffset`) ve mono bir ölçü etiketi düşüyor;
 *         kartların altına da kendi ölçüleri ve kalem notları geliyor.
 *
 * ⚠️ Dalga 1 dersi (Onizuka): mod düğmesi KİLİTLİ IZGARAYI AÇIP KAPATMAZ.
 * Kapalıyken de kareli zemin, marj çizgisi ve iki kolonluk asimetri
 * duruyor — kapatmak sayfayı tek kolonlu düz bir yığına çevirmiyor.
 * Değişen tek şey yazının VARLIĞI; ölçüler `--mid-margin` ve ızgara
 * tanımları iki durumda da aynı.
 *
 * Hero düğmenin ÜSTÜNDE (yedi durağın sırası: hero → mod düğmesi), bu
 * yüzden ayrı bir `hero` yuvası var.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function AnalysisShell({
  isAdmin,
  label,
  native,
  openLabel,
  closeLabel,
  stateOn,
  stateOff,
  hintOn,
  hintOff,
  note,
  watermark,
  hero,
  children,
}: {
  isAdmin: boolean;
  label: string;
  native: string;
  openLabel: string;
  closeLabel: string;
  stateOn: string;
  stateOff: string;
  hintOn: string;
  hintOff: string;
  note: string;
  /** Filigranın kanji yarısı — dekoratif (個性) */
  watermark: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [analysis, setAnalysis] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="izuku-midoriya"
      data-analysis={analysis ? "on" : "off"}
    >
      {/* ── Filigran: kareli defter ızgarası + 個性 (brief §Filigran) ──
          Izgara `.page`in kendi zemininde (repeating-linear-gradient);
          burada yalnızca kanji ve kıvılcım demeti var. Hiçbiri metnin
          okunurluğuna karışmıyor: ikisi de en alttaki katmanda. */}
      <span className={styles.watermark} aria-hidden>
        {watermark}
      </span>
      <SparkMark
        className={styles.watermarkSpark}
        strokeClassName={styles.sparkStroke}
      />

      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="mid-mode">
          <div className={styles.modeHead}>
            <h2 id="mid-mode" className={styles.modeTitle}>
              {label}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {native}
            </p>
          </div>

          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={analysis}
            onClick={() => setAnalysis((value) => !value)}
          >
            {/* Kalem ucu: basılıyken çizilmiş bir alt çizgi bırakıyor */}
            <span className={styles.modeMark} aria-hidden>
              <UnderlineMark
                className={styles.modeUnderline}
                strokeClassName={styles.pencilStroke}
              />
            </span>
            <span className={styles.modeLabel}>
              {analysis ? closeLabel : openLabel}
            </span>
            <span className={styles.modeState}>
              {analysis ? stateOn : stateOff}
            </span>
          </button>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor. */}
          <p className={styles.modeHint} role="status">
            {analysis ? hintOn : hintOff}
          </p>
          <p className={styles.modeNote}>{note}</p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
