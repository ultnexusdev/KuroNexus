"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { RainCurtain, RinneganEye } from "./NagatoGlyphs";
import styles from "./NagatoExperience.module.css";

/**
 * "Yağmur" kabuğu — sayfanın kökü ve iki durumun tek sahibi.
 *
 * `ShadowShell` emsalinin kardeşi (kompozisyon deseni): çocuklar SUNUCUDA
 * çizilmiş gelir, bu bileşen onları yalnızca taşır. Sayfanın gövdesi
 * tarayıcıya JS olarak inmez; istemciye inen tek şey bu düğme, yağmur
 * perdesi ve iki sayı.
 *
 * ── NEDEN İKİ DURUM ──────────────────────────────────────────────────────
 * `pouring`  — mod düğmesinin kendisi (kullanıcının açıp kapattığı yağmur)
 * `depth`    — üç sorunun kaçının açıldığı (0–3); yağmurun ŞİDDETİ
 * İkisi ayrı şeyler ve ikisi de kökteki bir `data-*` niteliğine iniyor.
 * Etkinin tamamı CSS'te: JS tek bir stil hesaplamıyor.
 *
 * ── NEDEN CONTEXT ────────────────────────────────────────────────────────
 * Yağmur BÜTÜN sayfaya iniyor, yani perde kökte durmak zorunda; soruları
 * açan ada ise sayfanın ortasında, sunucuda çizilmiş `children` ağacının
 * içinde. Sunucu bileşenine geri arama geçirilemez — ama sunucuda çizilmiş
 * ağaç bu istemci sağlayıcısının ALTINDA hidratlandığı için context oradan
 * aşağı akıyor. Sağlayıcı yoksa varsayılan değer sessiz bir no-op: soru
 * bölümü yağmursuz da çalışır.
 */

export interface RainApi {
  /** 0 = kuru, 1–2 = artan yağmur, 3 = dindi */
  setDepth: (depth: number) => void;
}

const RainContext = createContext<RainApi>({ setDepth: () => {} });

export function useRainDepth(): RainApi {
  return useContext(RainContext);
}

export function RainShell({
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
  const [pouring, setPouring] = useState(false);
  const [depth, setDepth] = useState(0);

  /* Kimlik sabit kalsın: her çizimde yeni bir nesne göndermek, context'i
     okuyan adayı boş yere yeniden çizerdi. */
  const api = useMemo<RainApi>(() => ({ setDepth }), []);

  return (
    <RainContext.Provider value={api}>
      <div
        className={styles.page}
        data-world="nagato"
        data-step={depth}
        data-rain={pouring || undefined}
      >
        {/* Ame'nin zemini: paslanmış boru sütunları. Sayfanın arkasında
            durur, hiçbir metin taşımaz. */}
        <span className={styles.pipes} aria-hidden />

        {/* Yağmur perdesi: kadraja sabit — sayfa kayarken yağmur yerinde
            kalır, camdan bakıyormuş gibi. Yoğunluğu `data-step` ve
            `data-rain` belirliyor (CSS). */}
        <span className={styles.curtain} aria-hidden>
          <RainCurtain
            className={styles.curtainArt}
            bandClassName={styles.rainBand}
          />
        </span>

        <button
          type="button"
          className={styles.rainToggle}
          aria-pressed={pouring}
          onClick={() => setPouring((value) => !value)}
        >
          <span className={styles.rainToggleGlyph} aria-hidden>
            <RinneganEye
              rings={3}
              className={styles.rainToggleArt}
              ringClassName={styles.rainToggleRing}
              coreClassName={styles.rainToggleCore}
            />
          </span>
          <span className={styles.rainToggleLabel}>
            {pouring ? exitLabel : enterLabel}
          </span>
        </button>

        {/* Mod açıkken ne değiştiğini söyleyen satır. Düğmenin
            `aria-pressed`i durumu, bu satır anlamı veriyor. */}
        <p className={styles.rainHint} role="status">
          {pouring ? hint : ""}
        </p>

        {children}
      </div>
    </RainContext.Provider>
  );
}
