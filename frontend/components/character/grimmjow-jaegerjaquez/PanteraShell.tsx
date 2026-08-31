"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./DesgarronExperience.module.css";

/**
 * Grimmjow sayfasının kabuğu ve TEK modu — Resurrección (帰刃).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Işık DEĞİL, yapı. `data-ressurect="true"` olduğunda:
 *
 *   · `--grm-rip` (yırtık derinliği) 1 → 2.1 → bantlar birbirine daha çok
 *     giriyor, alt kenarlardaki `clip-path` çentikleri iki kat derinleşiyor
 *   · `--grm-title-scale` 1 → 1.16 → bütün başlıklar bir kademe büyüyor
 *   · `--grm-lap` (bantların üst üste binme payı) artıyor → sayfanın dikey
 *     ritmi kısalıyor, düzen sıkışıyor
 *   · `--grm-charge` 0 → 1 → elektrik mavisi doyuyor ve kenarlarda pençe
 *     izi gölgeleri beliriyor
 *
 * ⚠️ Kapalıyken yırtıklar KAYBOLMUYOR, yalnızca SIĞ. Kilitli ızgara
 * varsayılanda da var (Dalga 1 dersi 2) — mod onu getirmiyor, derinleştiriyor.
 *
 * Hero düğmenin ÜSTÜNDE duruyor (yedi durağın sırası: hero → mod düğmesi),
 * bu yüzden ayrı bir `hero` yuvası var; `children` düğmeden sonra geliyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function PanteraShell({
  isAdmin,
  title,
  native,
  nativeReading,
  releaseCommand,
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
  nativeReading: string;
  releaseCommand: string;
  enterLabel: string;
  exitLabel: string;
  hintOn: string;
  hintOff: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [released, setReleased] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="grimmjow-jaegerjaquez"
      data-ressurect={released ? "true" : "false"}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. `hero` ve
          `children` sunucuda çizilip prop olarak geliyor; bu bileşen
          onları yalnızca doğru sırayla yerleştiriyor. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.band} data-band="mode" aria-labelledby="grm-mode">
          <div className={styles.bandInner}>
            <h2 id="grm-mode" className={styles.bandTitle}>
              {title}
            </h2>
            <p className={styles.bandNative} lang="ja">
              {native}
            </p>
            <p className={styles.bandReading}>{nativeReading}</p>

            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={released}
              onClick={() => setReleased((value) => !value)}
            >
              {/* Tek işaret: basılınca kendi içinde yırtılan bir dilim.
                  Dekorasyon — okunabilir karşılığı yanındaki etiket. */}
              <span className={styles.modeMark} aria-hidden />
              <span className={styles.modeLabel}>
                {released ? exitLabel : enterLabel}
              </span>
              <span className={styles.modeCommand} lang="ja" aria-hidden>
                {releaseCommand}
              </span>
            </button>

            {/* Durum yalnızca yapıyla değil YAZIYLA da veriliyor. */}
            <p className={styles.modeHint} role="status">
              {released ? hintOn : hintOff}
            </p>
          </div>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
