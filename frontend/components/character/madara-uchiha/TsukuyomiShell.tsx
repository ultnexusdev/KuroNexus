"use client";

import { useState } from "react";
import { MoonMark, DreamRoots } from "./MadaraGlyphs";
import styles from "./MadaraExperience.module.css";

/**
 * "Sonsuz Tsukuyomi" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (ev kuralı, BRIEF §8): çocuklar SUNUCUDA çizilmiş
 * gelir, bu bileşen onları yalnızca taşır. İstemciye inen tek şey bir
 * boolean, bir düğme ve iki dekoratif SVG.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-dream]`): kenarlardan kök
 * ve dal desenleri giriyor, zemin mor-maviye kayıyor, rüya satırları
 * görünür oluyor. JS hiçbir stil hesaplamıyor.
 *
 * ── DÜRÜSTLÜK ŞARTI ──────────────────────────────────────────────────────
 * Mod açıkken sayfaya gelen her satır "rüyada görülen" etiketiyle çiziliyor
 * (bkz. `MadaraExperience`), üstelik düğmenin yanında modun ne olduğunu
 * söyleyen bir uyarı beliriyor. Okuyucu rüyayı kayıtla karıştırmamalı.
 *
 * Kök <main> DEĞİL: kök düzen zaten <main id="icerik"> çiziyor.
 */
export function TsukuyomiShell({
  enterLabel,
  exitLabel,
  notice,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  notice: string;
  children: React.ReactNode;
}) {
  const [dreaming, setDreaming] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="madara-uchiha"
      data-dream={dreaming || undefined}
    >
      {/* Rüya katmanı: yıkama + iki kenardaki kök deseni. Mod kapalıyken
          opaklığı sıfır, yani DOM'da duruyor ama hiç görünmüyor. */}
      <span className={styles.dreamLayer} aria-hidden>
        <DreamRoots className={styles.dreamRootsStart} />
        <DreamRoots className={styles.dreamRootsEnd} />
      </span>

      <button
        type="button"
        className={styles.dreamToggle}
        aria-pressed={dreaming}
        onClick={() => setDreaming((value) => !value)}
      >
        <MoonMark className={styles.dreamToggleGlyph} />
        <span className={styles.dreamToggleLabel}>
          {dreaming ? exitLabel : enterLabel}
        </span>
      </button>

      {/* Uyarı satırı hem gören hem duyan ziyaretçi için: düğmenin
          aria-pressed'i durumu, bu satır anlamı veriyor. */}
      <p className={styles.dreamNotice} role="status">
        {dreaming ? notice : ""}
      </p>

      {children}
    </div>
  );
}
