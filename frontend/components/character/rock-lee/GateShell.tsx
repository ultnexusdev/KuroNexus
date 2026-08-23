"use client";

import { useState, type ReactNode } from "react";
import { GateGlyph } from "./LeeMarks";
import { GateLadder, type GateCopy, type GateRow } from "./GateLadder";
import styles from "./RockLeeExperience.module.css";

/**
 * Sayfanın kabuğu — ve sayfadaki TEK durum.
 *
 * `open` (0–8) kaç kapının açık olduğunu tutuyor ve köke `data-gates`
 * olarak yazılıyor. Isının tamamı oradan CSS'le geliyor: `--lee-mix`
 * (accent → kapı kızılı karışım oranı), `--lee-fire` (ısı yıkaması),
 * `--lee-steam` (buhar), `--lee-wght` (tipografi ağırlığı). Hiçbiri renk
 * değişkeni değil — hepsi ölçü (BRIEF kural 4).
 *
 * Mod düğmesi merdivenin KISAYOLU: kapalıyken sekiz kapıyı birden açar,
 * açıkken hepsini kapatır. İkinci bir durum eklemiyoruz — "sekizinci kapı
 * modu" zaten `open === 8` demek.
 *
 * ── KOMPOZİSYON ──────────────────────────────────────────────────────
 * `head` ve `tail` SUNUCUDA çizilmiş düğümler olarak geliyor (GenjutsuShell
 * emsali): sayfanın gövdesi tarayıcıya JS olarak inmiyor, yalnızca merdiven
 * ve bu kabuk iniyor. Kök `<main>` DEĞİL — kök layout zaten `<main>` çiziyor.
 */
export function GateShell({
  rows,
  copy,
  modeEnter,
  modeExit,
  modeHint,
  characterId,
  eighthImage,
  eighthAlt,
  curatorLabel,
  head,
  tail,
}: {
  rows: GateRow[];
  copy: GateCopy;
  modeEnter: string;
  modeExit: string;
  modeHint: string;
  characterId: number;
  eighthImage: string | null;
  eighthAlt: string;
  curatorLabel?: string;
  head: ReactNode;
  tail: ReactNode;
}) {
  const [open, setOpen] = useState(0);
  const full = open === rows.length;

  return (
    <div
      className={styles.page}
      data-world="rock-lee"
      data-gates={open}
      data-eighth={full ? "true" : undefined}
    >
      {/* Isı katmanları — üçü de sabit, hiçbiri tıklama geçirmiyor.
          Görünürlükleri yalnızca `--lee-fire` / `--lee-steam` ile ayarlanır. */}
      <span className={styles.heatWash} aria-hidden />
      <span className={styles.steam} aria-hidden />
      <span className={styles.emberEdge} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={full}
        title={modeHint}
        onClick={() => setOpen(full ? 0 : rows.length)}
      >
        <GateGlyph className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{full ? modeExit : modeEnter}</span>
      </button>

      {head}

      <GateLadder
        rows={rows}
        copy={copy}
        open={open}
        onOpen={setOpen}
        characterId={characterId}
        eighthImage={eighthImage}
        eighthAlt={eighthAlt}
        curatorLabel={curatorLabel}
      />

      {tail}
    </div>
  );
}
