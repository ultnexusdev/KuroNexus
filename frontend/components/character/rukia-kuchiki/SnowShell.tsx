"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { MoonArc } from "./RukiaGlyphs";
import styles from "./ShirayukiExperience.module.css";

/**
 * Rukia sayfasının kabuğu: kök öğe, iki durum ve kar katmanı.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. İstemciye inen tek şey iki durum, bir
 * düğme ve on dört boş `<span>`.
 *
 * ── İKİ DURUM, İKİ AYRI İŞ ───────────────────────────────────────────────
 *   `data-moon="on|off"`  → mod düğmesi. Bu dalganın TERSİNE giden tek
 *                           sayfası: açıkken zemin bir kademe AYDINLANIYOR,
 *                           gölgeler mavileşiyor, kar yoğunlaşıyor
 *                           (görünen tanecik 8 → 14).
 *   `data-snow="0|1|2|3"` → üç dansın bıraktığı KALICI kar katmanları.
 *                           3'te zemin bembeyaz ve kontrast tersine dönüyor.
 *
 * İkisi bağımsız: ay ışığı açıkken de kar birikebiliyor, kar üçe çıktığında
 * ay ışığı düğmesi hâlâ çalışıyor (beyaz zeminde gölgelerin mavisi değişiyor).
 *
 * ── NEDEN CONTEXT ────────────────────────────────────────────────────────
 * Üç dans bölümü sayfanın ORTASINDA, sunucuda çizilmiş bölümlerin arasında
 * duruyor. Durumu burada tutup aşağı prop geçirmek mümkün değil: aradaki
 * çocuklar sunucu bileşeni ve bir fonksiyon prop'u sunucu/istemci sınırını
 * geçemez. Context bu sınırı geçiyor — sağlayıcı da tüketici de istemci,
 * arada duran sunucu ağacı yalnızca `children` olarak taşınıyor.
 *
 * Kök `<main>` DEĞİL: kök düzen zaten `<main id="icerik">` çiziyor.
 */

/** En fazla 14 tanecik (dalga kilidi). Sekizi hep açık, altısı ay ışığında. */
const FLAKES = 14;

/** Üç dansın kimlikleri — veri dosyasındaki `RUKIA_DANCES[*].key` ile aynı. */
export type DanceKey = "tsukishiro" | "hakuren" | "shirafune";

interface SnowState {
  /** Çağrılma SIRASINDA katmanlar — geri alma sondan başlıyor */
  fallen: readonly DanceKey[];
  call: (key: DanceKey) => void;
  lift: () => void;
}

const SnowContext = createContext<SnowState | null>(null);

/**
 * Dans durumunu okuyan kanca.
 *
 * Sağlayıcı yoksa `null` DÖNMÜYOR, hata atıyor: bu sayfada `ThreeDances`
 * her zaman `SnowShell`in altında ve sessiz bir "hiç çalışmayan düğme"
 * bulunması en zor hata türü (emsal: tanımsız CSS sınıfı — sayfa stilsiz
 * kalıyor ama ne tsc ne eslint bir şey diyor).
 */
export function useSnow(): SnowState {
  const value = useContext(SnowContext);
  if (!value) {
    throw new Error("useSnow yalnizca SnowShell agacinin icinde kullanilir");
  }
  return value;
}

export function SnowShell({
  isAdmin,
  moonTitle,
  moonNative,
  moonEnter,
  moonExit,
  moonHintOn,
  moonHintOff,
  hero,
  children,
}: {
  isAdmin: boolean;
  moonTitle: string;
  moonNative: string;
  moonEnter: string;
  moonExit: string;
  moonHintOn: string;
  moonHintOff: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [moon, setMoon] = useState(false);
  const [fallen, setFallen] = useState<readonly DanceKey[]>([]);

  const call = useCallback((key: DanceKey) => {
    setFallen((list) => (list.includes(key) ? list : [...list, key]));
  }, []);

  /* Geri alma KATMAN KATMAN (kullanıcı şartı): son düşen kalkıyor. */
  const lift = useCallback(() => {
    setFallen((list) => list.slice(0, -1));
  }, []);

  const snow = useMemo<SnowState>(() => ({ fallen, call, lift }), [fallen, call, lift]);

  return (
    <div
      className={styles.page}
      data-world="rukia-kuchiki"
      data-moon={moon ? "on" : "off"}
      data-snow={String(fallen.length)}
    >
      {/* Kar taneciği katmanı — sayfanın hareket dili.
          `aria-hidden`: on dört boş kutu ekran okuyucuda gürültüden başka
          bir şey değil. Her taneciğin gecikmesi ve yatay yeri CSS'te
          `:nth-child()` ile veriliyor; burada satır içi stil YOK (kural 16
          hex yasağının kardeşi: konum da stil dosyasında kalsın). */}
      <span className={styles.snowfall} aria-hidden>
        {Array.from({ length: FLAKES }, (_, i) => (
          <span key={i} className={styles.flake} />
        ))}
      </span>

      {/* Kenarlardaki buz kristali büyümesi — `clip-path` ile.
          Kar katmanı arttıkça kristal içeri doğru büyüyor. */}
      <span className={styles.rime} aria-hidden>
        <span className={styles.rimeLeft} />
        <span className={styles.rimeRight} />
      </span>

      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına giriyor. */}
      <CuratorFrame isAdmin={isAdmin}>
        <SnowContext.Provider value={snow}>
          {hero}

          {/* ══ 2 · MOD DÜĞMESİ — "Ay ışığı" ══════════════════════════════ */}
          <section className={styles.moon} aria-labelledby="ruk-moon">
            <h2 id="ruk-moon" className={styles.sectionTitle}>
              {moonTitle}
            </h2>
            <p className={styles.moonNative} lang="ja" aria-hidden>
              {moonNative}
            </p>

            <button
              type="button"
              className={styles.moonButton}
              aria-pressed={moon}
              onClick={() => setMoon((value) => !value)}
            >
              <MoonArc
                className={styles.moonMark}
                discClassName={styles.moonDisc}
                arcClassName={styles.moonShadow}
              />
              <span className={styles.moonLabel}>{moon ? moonExit : moonEnter}</span>
            </button>

            {/* Durum yalnız renkle değil YAZIYLA da veriliyor. */}
            <p className={styles.moonHint} role="status">
              {moon ? moonHintOn : moonHintOff}
            </p>
          </section>

          {children}
        </SnowContext.Provider>
      </CuratorFrame>
    </div>
  );
}
