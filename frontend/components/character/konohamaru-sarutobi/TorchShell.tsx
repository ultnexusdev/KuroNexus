"use client";

import { createContext, useContext, useState } from "react";
import { TorchGlyph } from "./KonohamaruGlyphs";
import styles from "./KonohamaruExperience.module.css";

/**
 * "Hokage'nin torunu" kabuğu — sayfanın kökü ve iki durumu.
 *
 * `ShadowShell` emsalinin kardeşi (kompozisyon deseni): çocuklar SUNUCUDA
 * çizilmiş gelir, bu bileşen onları yalnızca taşır. Sayfanın gövdesi
 * tarayıcıya JS olarak inmez; istemciye inen tek şey bu düğme, bir boolean
 * ve zincirin sıra numarası.
 *
 * ── İKİ DURUM, İKİ İŞ ────────────────────────────────────────────────────
 * `formal`  → mod düğmesi. Sayfa resmîleşir: başlık ailesi Cinzel'e döner,
 *             unvanlar öne çıkar, ışık meşaleye kayar, atkının mavisi solar.
 *             Etkinin TAMAMI CSS'te (`.page[data-formal]`), JS hiçbir stil
 *             hesaplamıyor.
 * `lit`     → meşale zincirinin kaçıncı halkasında olduğumuz (0-4). Zincir
 *             ayrı bir istemci adası ve sayfanın ORTASINDA duruyor; kökteki
 *             ışığı oradan çevirmenin tek temiz yolu bir bağlam. Değer kökte
 *             `data-lit` olarak duruyor, ışığı yine CSS yükseltiyor.
 *
 * Bağlam değeri `setLit`in kendisi: React bu işlevi kalıcı tutar, yani
 * sağlayıcı yeniden çizim tetiklemiyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */

const TorchLightContext = createContext<((step: number) => void) | null>(null);

/** Zincirin ateşi kaçıncı halkada — sayfanın ışığını çeviren kanca. */
export function useTorchLight(): (step: number) => void {
  const setter = useContext(TorchLightContext);
  return setter ?? (() => {});
}

export function TorchShell({
  enterLabel,
  exitLabel,
  hint,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [formal, setFormal] = useState(false);
  const [lit, setLit] = useState(0);

  return (
    <div
      className={styles.page}
      data-world="konohamaru-sarutobi"
      data-formal={formal || undefined}
      data-lit={lit}
    >
      {/* Gökyüzü: sayfanın üstünde duran soğuk yıkama. Resmî modda söner. */}
      <span className={styles.sky} aria-hidden />
      {/* Meşale ışığı: zincirde yükseldikçe sayfada yukarı çıkar. */}
      <span className={styles.torchWash} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={formal}
        onClick={() => setFormal((value) => !value)}
      >
        <TorchGlyph className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{formal ? exitLabel : enterLabel}</span>
      </button>
      {/* Mod açıkken ne değiştiğini söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.modeHint} role="status">
        {formal ? hint : ""}
      </p>

      <TorchLightContext.Provider value={setLit}>
        {children}
      </TorchLightContext.Provider>
    </div>
  );
}
