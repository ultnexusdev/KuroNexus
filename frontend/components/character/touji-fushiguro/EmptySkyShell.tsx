"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./HeavenRestrictionExperience.module.css";

/**
 * Tōji sayfasının kabuğu ve TEK modu — "Gökyüzü boş".
 *
 * Kompozisyon deseni (Faz 2 §1): çocuklar SUNUCUDA çizilmiş geliyor, bu
 * bileşen onları yalnızca taşıyor. İstemciye inen tek şey bir düğme ve bir
 * boolean.
 *
 * ── DÜĞMENİN NE YAPTIĞI ──────────────────────────────────────────────────
 * Hiçbir sayıyı, hiçbir rengi ve hiçbir yerleşimi değiştirmiyor. Yaptığı
 * tek şey LANET ENERJİSİ SÜTUNUNU görünür kılmak: sayfanın sol kenarından
 * baştan sona inen, hiçbir yerde dolmayan boş bir şerit. Yani düğme bir
 * şeyi AÇMIYOR, olmayan bir şeyi GÖSTERİYOR.
 *
 * ⚠️ Maki Zen'in'in sayfasında da 天与呪縛 bir düğme ve orada
 * `data-restriction` paleti doyuruyor + istatistikleri yükseltiyor
 * (öncesi/sonrası). Burada palet ve istatistik SABİT; değişen tek şey
 * sütunun çizilip çizilmediği. Aynı kavram, başka iş — dalga şartı bu.
 *
 * ⚠️ BOŞ GÖKYÜZÜ DÜĞMEYE BAĞLI DEĞİL. Sayfanın üst üçte biri varsayılan
 * durumda da boş ve düğme onu ne açıyor ne kapatıyor (Onizuka dersi:
 * düğmenin işi yapıyı göstermek, yapıyı doğurmak değil).
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Sütunun kendisi `aria-hidden`: ekran okuyucuda tek başına bir "0"
 * gürültüdür. Anlamı düğmenin altındaki `aria-live="polite"` paragrafı
 * taşıyor ve o paragraf iki durumda da tam cümle yazıyor. Yani sayfanın
 * tezi yalnızca görsel boşluğa yaslanmıyor.
 */
export function EmptySkyShell({
  isAdmin,
  title,
  native,
  nativeReading,
  enterLabel,
  exitLabel,
  hintOn,
  hintOff,
  columnLabel,
  columnNative,
  columnValue,
  columnReading,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  nativeReading: string;
  enterLabel: string;
  exitLabel: string;
  hintOn: string;
  hintOff: string;
  columnLabel: string;
  columnNative: string;
  columnValue: string;
  columnReading: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="touji-fushiguro"
      data-restriction={revealed ? "shown" : "hidden"}
    >
      {/* ── LANET ENERJİSİ SÜTUNU ───────────────────────────────────────
          Sayfanın tamamı boyunca inen boş şerit. Dekoratif (`aria-hidden`):
          anlamı aşağıdaki canlı paragraf söylüyor. `pointer-events: none`
          CSS'te — hiçbir tıklamayı yakalamıyor. */}
      <div className={styles.column} aria-hidden>
        <span className={styles.columnHead}>
          <span className={styles.columnNative} lang="ja">
            {columnNative}
          </span>
          <span className={styles.columnLabel}>{columnLabel}</span>
        </span>
        <span className={styles.columnShaft} />
        <span className={styles.columnValue}>{columnValue}</span>
        <span className={styles.columnFoot}>{columnReading}</span>
      </div>

      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmak
          zorunda (sözleşme) ama mod düğmesi hero ile içerik arasına
          giriyor, yani çerçeveyi sunucuda sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═══════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="toj-mode">
          <div className={styles.sky} aria-hidden />

          <div className={styles.modeBody}>
            <h2 id="toj-mode" className={styles.modeTitle}>
              {title}
            </h2>
            <p className={styles.modeNative} lang="ja">
              {native}
            </p>
            <p className={styles.modeReading}>{nativeReading}</p>

            <button
              type="button"
              className={styles.modeButton}
              onClick={() => setRevealed((v) => !v)}
              aria-pressed={revealed}
            >
              {revealed ? exitLabel : enterLabel}
            </button>

            <p className={styles.modeHint} aria-live="polite">
              {revealed ? hintOn : hintOff}
            </p>
          </div>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
