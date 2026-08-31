"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { HammerMark } from "./NobaraGlyphs";
import styles from "./StrawDollExperience.module.css";

/**
 * Nobara sayfasının kabuğu ve TEK modu — "Rezonans" (共鳴り).
 *
 * Kompozisyon deseni (FAZ 2 §1): `hero` ve `children` SUNUCUDA çizilip prop
 * olarak geliyor; bu ada onları yalnızca doğru sırayla yerleştiriyor ve tek
 * bir boolean tutuyor. İstemciye inen JS bu düğmeden ibaret.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Işık değil YAPI (Faz 2 §0, eksen 5). `data-resonance="true"` olduğunda üç
 * şey birden oluyor ve üçü de CSS'te:
 *
 *   1. BAĞ ÇİZGİLERİ GÖRÜNÜR OLUYOR. Çivi alanındaki üç geçerli üçgen
 *      (`.fieldLink`) 0 opaklıktan çıkıyor. Yani mod, mekaniğin cevabını
 *      gösteren şey: kapalıyken üçlüyü metinden çıkarman gerekiyor.
 *   2. PALET SICAK PEMBEYE DOYUYOR. Deri bloğunun ikinci hâli devreye
 *      giriyor (`.page[data-world="…"][data-resonance="true"]`) ve zemin,
 *      kenar, plaka renkleri accent'e doğru kayıyor. ⚠️ O blokta HEX YOK:
 *      hepsi `color-mix(in srgb, var(--accent) …%, var(--nob-…))` — çünkü
 *      hex muafiyeti yalnızca birinci deri bloğunu kapsıyor.
 *   3. DERGİ DÜZENİ SIKIŞIYOR. `--nob-gutter`, `--nob-pad` ve
 *      `--nob-step` küçülüyor; başlıkların harf aralığı negatife
 *      iniyor. Sayfa dar bir baskıya geçmiş gibi oluyor.
 *
 * ⚠️ Metin ölçüleri (`--text-*` token'ları) kasten neredeyse hiç değişmiyor:
 * ölçüldü, `--surface`i accent'e %5'ten fazla kaydırdığında `--text-muted`
 * 4.5:1'in altına düşüyor. "Doygunluk" bu yüzden metin taşıyan yüzeylerde
 * değil, PLAKALARDA ve çizgilerde yapılıyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function ResonanceShell({
  isAdmin,
  title,
  native,
  enterLabel,
  exitLabel,
  hintOn,
  hintOff,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  enterLabel: string;
  exitLabel: string;
  hintOn: string;
  hintOff: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [resonance, setResonance] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="nobara-kugisaki"
      data-resonance={resonance ? "true" : "false"}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına giriyor, yani
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════
            Dergi düzeninde bu bir "editörün notu" şeridi: sayfa
            genişliğinde, tek satır, mono etiketli. */}
        <section className={styles.mode} aria-labelledby="nob-mode">
          <p className={styles.modeKicker} lang="ja" aria-hidden>
            {native}
          </p>
          <h2 id="nob-mode" className={styles.modeTitle}>
            {title}
          </h2>

          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={resonance}
            onClick={() => setResonance((value) => !value)}
          >
            <span className={styles.modeMark} aria-hidden>
              <HammerMark
                className={styles.modeMarkArt}
                headClassName={styles.modeMarkHead}
                handleClassName={styles.modeMarkHandle}
              />
            </span>
            <span className={styles.modeLabel}>
              {resonance ? exitLabel : enterLabel}
            </span>
          </button>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor. */}
          <p className={styles.modeHint} role="status">
            {resonance ? hintOn : hintOff}
          </p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
