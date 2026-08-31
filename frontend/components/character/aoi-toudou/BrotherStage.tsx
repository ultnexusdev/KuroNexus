"use client";

import { useState, type ReactNode } from "react";
import styles from "./BoogieWoogieExperience.module.css";

/**
 * "Kardeşim!" — sayfanın tamamını çeviren tek durum.
 *
 * ── DÜĞMENİN YAPTIĞI İŞ ──────────────────────────────────────────────────
 * Işık değil YAPI değişiyor (Faz 2 §0, eksen 5). Açıkken:
 *   · sayfadaki İKİNCİ KİŞİ (Yūji) her bölümde Tōdō'nun yanında beliriyor —
 *     yani her bölüm bir satır daha uzuyor, ızgara gerçekten büyüyor;
 *   · palet fuşyaya doyuyor: `--accent` ailesi ve poster çerçevesi
 *     `--tdo-fuchsia`e dönüyor (kural CSS'te, `[data-brother="true"]`).
 *
 * ── KÖK ÖĞE BURADA ───────────────────────────────────────────────────────
 * Sözleşme kök öğede `className={styles.page}` + `data-world="aoi-toudou"`
 * istiyor ve durum kökte olmak zorunda (bütün sayfa ona bakıyor), o yüzden
 * kök bu adanın içinde. Giriş bileşeni yine SUNUCU bileşeni: hero ve bütün
 * bölümler ona prop olarak iniyor, buraya yalnızca düz dize geliyor.
 *
 * ⚠️ Kök `<main>` DEĞİL — kök layout zaten `<main id="icerik">` çiziyor.
 *
 * ── YŪJİ ŞERİTLERİ NİYE BURADA DEĞİL ─────────────────────────────────────
 * Şeritler bölümlerin İÇİNDE, sunucuda çiziliyor; bu ada onları hiç
 * görmüyor. Mod kapalıyken CSS `display: none` uyguluyor, yani şeritler hem
 * ekrandan hem erişilebilirlik ağacından çıkıyor. Yalnızca `opacity` ile
 * gizlemek, ekran okuyucuya kapalı modda da Yūji'yi okuturdu.
 */
export function BrotherStage({
  title,
  native,
  nativeReading,
  enterLabel,
  exitLabel,
  hintOn,
  hintOff,
  note,
  glyph,
  hero,
  children,
}: {
  title: string;
  native: string;
  nativeReading: string;
  enterLabel: string;
  exitLabel: string;
  hintOn: string;
  hintOff: string;
  note: string;
  /** Düğmenin içindeki el motifi — SUNUCUDA çizilmiş SVG */
  glyph: ReactNode;
  hero: ReactNode;
  children: ReactNode;
}) {
  const [brother, setBrother] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="aoi-toudou"
      data-brother={brother ? "true" : "false"}
    >
      {hero}

      <section
        className={styles.poster}
        data-block="mode"
        aria-labelledby="tdo-mode"
      >
        <p className={styles.eyebrow}>{nativeReading}</p>
        <h2 id="tdo-mode" className={styles.posterTitle}>
          {title}
        </h2>
        <p className={styles.modeNative} lang="ja">
          {native}
        </p>

        <button
          type="button"
          className={styles.modeButton}
          aria-pressed={brother}
          onClick={() => setBrother((current) => !current)}
        >
          <span className={styles.modeGlyph} aria-hidden>
            {glyph}
          </span>
          <span className={styles.modeWord}>
            {brother ? exitLabel : enterLabel}
          </span>
        </button>

        <p className={styles.modeHint} role="status" aria-live="polite">
          {brother ? hintOn : hintOff}
        </p>
        <p className={styles.modeNote}>{note}</p>
      </section>

      {children}
    </div>
  );
}
