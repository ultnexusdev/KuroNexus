"use client";

import { useState } from "react";
import { HammerMark } from "./NailGlyphs";
import styles from "./ResonanceExperience.module.css";

/**
 * Ses kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Nobara'nın karakter çekirdeği kendini küçültmeyi reddetmek. Mod açıldığında
 * sayfa da bunu yapıyor: `--nob-assert` çarpanı 1'den 1.18'e çıkıyor ve
 * bütün display ölçüleri onunla birlikte büyüyor; kenarlar yumuşak
 * bakırdan sert demire dönüyor; `--nob-heat` bütün sıcak karışımları
 * açıyor. Üstte de kendi cümlesi bir şerit hâlinde beliriyor.
 *
 * Gojō'nun ölçüm modundan ve Megumi'nin ışık modundan farkı: burada mod ne
 * bilgi açıyor ne ışık düşürüyor — sayfanın SESİNİ yükseltiyor. Hiçbir bilgi
 * moda bağlı değil.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function AssertShell({
  enterLabel,
  exitLabel,
  hint,
  banner,
  bannerNote,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  banner: string;
  bannerNote: string;
  children: React.ReactNode;
}) {
  const [loud, setLoud] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="nobara-kugisaki"
      data-loud={loud ? "true" : "false"}
    >
      <button
        type="button"
        className={styles.moodToggle}
        aria-pressed={loud}
        onClick={() => setLoud((value) => !value)}
      >
        <HammerMark
          className={styles.moodGlyph}
          headClassName={styles.moodHammerHead}
          handleClassName={styles.moodHammerHandle}
          raised={loud}
        />
        <span className={styles.moodLabel}>{loud ? exitLabel : enterLabel}</span>
      </button>

      <p className={styles.moodHint} role="status">
        {loud ? hint : ""}
      </p>

      {/* Kendi cümlesi: mod kapalıyken yüksekliği sıfır, açıkken sayfanın
          en geniş satırı. Gizleme CSS'te `visibility` ile yapılıyor, yani
          kapalıyken erişilebilirlik ağacında da YOK — ekran okuyucu
          söylenmemiş bir cümleyi okumuyor. `aria-hidden` yazılmadı çünkü
          açıkken bu bir süs değil, sayfanın o anda söylediği şey. */}
      <p className={styles.banner} data-open={loud ? "true" : undefined}>
        <span className={styles.bannerInner}>
          <span className={styles.bannerJa} lang="ja">
            {banner}
          </span>
          <span className={styles.bannerNote}>{bannerNote}</span>
        </span>
      </p>

      {children}
    </div>
  );
}
