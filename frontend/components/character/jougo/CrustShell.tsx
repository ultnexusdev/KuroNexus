"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./VolcanoExperience.module.css";

/** Süzülen kül parçacıkları — sayı sabit, gecikmeyi CSS `--jgo-mote` veriyor. */
const MOTES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/**
 * Jōgo sayfasının kabuğu ve TEK modu — "Erime noktası".
 *
 * ── İSTEMCİYE İNEN TEK ŞEY ───────────────────────────────────────────────
 * Bir boolean, bir düğme ve on dört boş `span`. Bütün içerik SUNUCUDA
 * çizilip `hero` ve `children` yuvalarından prop olarak geliyor; metinler
 * de çözülmüş DÜZ DİZE iniyor — `LocalizedText` istemci sınırını geçmiyor.
 *
 * ── DÜĞME NE YAPIYOR ─────────────────────────────────────────────────────
 * `data-molten="off" | "on"` kök öğede duruyor ve kesitin SICAKLIĞINI
 * değiştiriyor:
 *
 *   off → katmanlar soğuk: çatlaklar ince (`--jgo-crack-w`), zemin
 *         obsidyen, kül açık renk düşüyor.
 *   on  → çatlaklar genişliyor, her katmanın zemini magma yatağına doğru
 *         karışıyor (`--jgo-melt`), kül koyulaşıyor, çatlaklardaki nabız
 *         hızlanıyor.
 *
 * ⚠️ Kilitli ızgara MODA BAĞLI DEĞİL (Onizuka dersi): katmanlı yer kesiti
 * `off` durumunda da tam olarak duruyor — üst üste yatay katmanlar,
 * aralarında çatlaklar, aşağı indikçe koyulaşma. Düğme yalnızca ISI
 * değiştiriyor. Mod kapalıyken sayfanın kimliği kaybolursa kimlik moda
 * ait demektir, sayfaya değil.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function CrustShell({
  isAdmin,
  title,
  native,
  toMoltenLabel,
  toCoolLabel,
  hintCool,
  hintMolten,
  markLabel,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  toMoltenLabel: string;
  toCoolLabel: string;
  hintCool: string;
  hintMolten: string;
  markLabel: string;
  /** Sunucuda çizilmiş hero — düğmenin ÜSTÜNDE (yedi durağın sırası) */
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [molten, setMolten] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="jougo"
      data-molten={molten ? "on" : "off"}
    >
      {/* Kül yağışı — sayfanın hareket dili. Tamamen dekoratif ve
          `pointer-events: none`; `prefers-reduced-motion`da hiç görünmüyor. */}
      <span className={styles.ashfall} aria-hidden>
        {MOTES.map((mote) => (
          <span
            key={mote}
            className={styles.mote}
            style={{ "--jgo-mote": mote } as React.CSSProperties}
          />
        ))}
      </span>

      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmak
          zorunda (sözleşme) ama mod düğmesi hero ile içeriğin arasına
          giriyor, yani çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ — "Erime noktası" ═══════════════════════════ */}
        <section className={styles.melt} aria-labelledby="jgo-melt">
          <div className={styles.meltHead}>
            <h2 id="jgo-melt" className={styles.meltTitle}>
              {title}
            </h2>
            <p className={styles.meltNative} lang="ja" aria-hidden>
              {native}
            </p>
          </div>

          <button
            type="button"
            className={styles.meltButton}
            aria-pressed={molten}
            onClick={() => setMolten((value) => !value)}
          >
            {/* Üç katmanlı sıcaklık göstergesi: basılıyken katmanlar
                aralanıp kızarıyor */}
            <span className={styles.meltGauge} role="img" aria-label={markLabel}>
              <span className={styles.meltGaugeBand} />
              <span className={styles.meltGaugeBand} />
              <span className={styles.meltGaugeBand} />
            </span>
            <span className={styles.meltLabel}>
              {molten ? toCoolLabel : toMoltenLabel}
            </span>
          </button>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor. */}
          <p className={styles.meltHint} role="status">
            {molten ? hintMolten : hintCool}
          </p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
