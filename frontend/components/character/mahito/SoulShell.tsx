"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./IdleTransfigurationExperience.module.css";

/**
 * Mahito sayfasının kabuğu ve TEK modu: "Ruhun şekli" (`data-soul`).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bir düğme ve bir boolean.
 *
 * ── DÜĞME NE YAPIYOR: IŞIK DEĞİL, KENAR ──────────────────────────────────
 * Kök öğedeki `data-soul="true"` CSS'te üç şeyi birden çeviriyor ve üçü de
 * YAPI:
 *   1. Bütün yamaların köşe yarıçapı ikinci kümeye geçiyor — kutular başka
 *      bir şekle sürünüyor (`--mht-r*` token'ları).
 *   2. Dikişler (`.seam`) görünür hâle geliyor: kapalıyken teyel neredeyse
 *      sönük, açıkken çizgi ve düğümler ortaya çıkıyor.
 *   3. Ten tonu (`--mht-flesh`) öne çıkıyor: yamaların dolgusu gri
 *      yüzeyden deri rengine kayıyor.
 *
 * ⚠️ Mod bir bilgi GİZLEMİYOR. Sayfadaki hiçbir metin yalnızca mod açıkken
 * okunabilir değil; düğme yalnızca sayfanın bedenini değiştiriyor. Bu,
 * dalga 1'in ikinci dersi: kilitli yapı varsayılanda da var olmalı.
 */
export function SoulShell({
  isAdmin,
  modeTitle,
  modeNative,
  modeEnter,
  modeExit,
  modeHintOn,
  modeHintOff,
  hero,
  children,
}: {
  isAdmin: boolean;
  modeTitle: string;
  modeNative: string;
  modeEnter: string;
  modeExit: string;
  modeHintOn: string;
  modeHintOff: string;
  /** Hero — sunucuda çizilmiş, buraya yalnızca taşınıyor */
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [soul, setSoul] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="mahito"
      data-soul={soul ? "true" : "false"}
    >
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═══════════════════════════════════════════
            Kendi yaması: sayfadaki en dar ve en eğri kutu. Düğmenin
            durumu `aria-pressed` ile veriliyor ve altındaki satır aynı
            durumu YAZIYLA da söylüyor — biçim tek başına bilgi taşımıyor. */}
        <section className={styles.mode} aria-labelledby="mht-mode">
          <div className={styles.modeInner}>
            <h2 id="mht-mode" className={styles.modeTitle}>
              {modeTitle}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {modeNative}
            </p>

            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={soul}
              onClick={() => setSoul((value) => !value)}
            >
              <span className={styles.modeStitch} aria-hidden>
                <span className={styles.modeStitchLine} />
              </span>
              <span className={styles.modeLabel}>{soul ? modeExit : modeEnter}</span>
            </button>

            <p className={styles.modeHint}>{soul ? modeHintOn : modeHintOff}</p>
          </div>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
