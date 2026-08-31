"use client";

import { createContext, useContext, useMemo, useState, type CSSProperties } from "react";
import { BlastStar } from "./BakugouGlyphs";
import styles from "./DetonationExperience.module.css";

/**
 * Sayfanın kabuğu — kökü, TEK modu ve geri tepme durumu.
 *
 * Kompozisyon deseni: çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları
 * yalnızca taşır. İstemciye inen tek şey iki durum ve bir düğme.
 *
 * ── MOD: NİTROGLİSERİN (brief §Düğme) ────────────────────────────────────
 * `data-sweat="dry" | "primed"`. Düğme uyarı ızgarasını AÇIP KAPATMIYOR —
 * DERECESİNİ değiştiriyor. Dört ölçü birden çeviriyor:
 *   --bkg-band   6px → 13px    (hazard bandı kalınlaşır)
 *   --bkg-notch  0px → 20px    (kenarlar clip-path ile çentiklenir)
 *   --bkg-type   1    → 1.14   (başlık ölçeği bir kademe büyür)
 *   --bkg-sat    0.18 → 0.5    (turuncu doygunluk)
 * Renk tek gösterge değil: durum satırı modun ne yaptığını YAZIYLA da
 * söylüyor ve düğme `aria-pressed` taşıyor.
 *
 * ── GERİ TEPME (brief §Mekanik) ──────────────────────────────────────────
 * Ateşlenen teknik bir birim vektör veriyor. Sayfanın gövdesi o vektörün
 * TERSİNE kayıyor (`--bkg-shove-x/y`), kart ise vektörün kendi yönünde
 * fırlıyor (ölçüsü kartın içinde). Etki ve tepki her zaman zıt.
 *
 * ⚠️ KAYDIRMA KÖKE DEĞİL BLOKLARA UYGULANIYOR. `.page` üzerine bir
 * `transform` koymak, `position: fixed` olan küratör hapını bu ağaca
 * hapsederdi (dönüşümlü bir ata, fixed torunun kapsayan bloğu olur) ve hap
 * ekranın sağ altından sayfanın sonuna düşerdi. O yüzden kök yalnızca
 * DEĞİŞKENİ taşıyor; kaydırmayı `.slab` blokları ve filigran kendisi
 * uyguluyor. Küratör çerçevesi bir blok değil, dolayısıyla hiç kaymıyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */

export interface RecoilState {
  /** Şu an ateşlenmiş tekniğin anahtarı; hiçbiri değilse null */
  activeKey: string | null;
  /** Bir tekniği ateşler; aynı anahtar tekrar gelirse bırakır */
  fire: (key: string, x: number, y: number) => void;
  release: () => void;
  /**
   * Her ateşlemede artan sayaç. Şok dalgası animasyonunun BAŞTAN koşması
   * için `key` olarak kullanılıyor — aynı sınıfı yeniden atamak animasyonu
   * yeniden başlatmıyor, düğümü yeniden monte etmek başlatıyor.
   */
  pulse: number;
}

const RecoilContext = createContext<RecoilState | null>(null);

/**
 * Geri tepme durumu.
 *
 * Sunucuda çizilmiş `children` bu sağlayıcının ALTINDA kaldığı için,
 * aradaki sunucu bileşenleri istemciye çekilmeden context istemci
 * torunlarına iniyor (`CuratorFrame` emsali). Sağlayıcı yoksa `null`
 * dönüyor ve çağıran kendi güvenli varsayılanını kullanıyor.
 */
export function useRecoil(): RecoilState | null {
  return useContext(RecoilContext);
}

/** Gövdenin kaydığı mesafe (px). Kartın fırladığı mesafenin üçte biri. */
const SHOVE = 9;

export function DetonationShell({
  label,
  toPrimed,
  toDry,
  stateDry,
  statePrimed,
  hintDry,
  hintPrimed,
  watermark,
  children,
}: {
  label: string;
  toPrimed: string;
  toDry: string;
  stateDry: string;
  statePrimed: string;
  hintDry: string;
  hintPrimed: string;
  /** Filigranın kanji yarısı — dekoratif, dikey yazılıyor */
  watermark: string;
  children: React.ReactNode;
}) {
  const [primed, setPrimed] = useState(false);
  const [shot, setShot] = useState<{ key: string; x: number; y: number } | null>(
    null,
  );
  const [pulse, setPulse] = useState(0);

  const recoil = useMemo<RecoilState>(
    () => ({
      activeKey: shot?.key ?? null,
      fire: (key, x, y) => {
        setPulse((value) => value + 1);
        setShot((old) => (old?.key === key ? null : { key, x, y }));
      },
      release: () => {
        setPulse((value) => value + 1);
        setShot(null);
      },
      pulse,
    }),
    [shot, pulse],
  );

  /* Gövde, atışın TERSİNE kayıyor. İki ondalık yeterli: piksel altı
     değerler zaten yuvarlanıyor, uzun kuyruk yalnızca stili şişiriyor. */
  const shove = {
    "--bkg-shove-x": `${(-(shot?.x ?? 0) * SHOVE).toFixed(2)}px`,
    "--bkg-shove-y": `${(-(shot?.y ?? 0) * SHOVE).toFixed(2)}px`,
  } as CSSProperties;

  return (
    <RecoilContext.Provider value={recoil}>
      <div
        className={styles.page}
        data-world="katsuki-bakugou"
        data-sweat={primed ? "primed" : "dry"}
        style={shove}
      >
        {/* Zemin yıkaması — hiçbir metnin üstünde değil, yalnız zeminde:
            kontrast ölçümü bozulmasın diye. */}
        <span className={styles.wash} aria-hidden />

        {/* Filigran: dikey 爆豪 + elle çizilmiş patlama poligonu */}
        <span className={styles.watermark} aria-hidden>
          {watermark}
        </span>
        <BlastStar
          className={styles.watermarkStar}
          fillClassName={styles.watermarkStarFill}
          edgeClassName={styles.watermarkStarEdge}
        />

        <div className={styles.sweatBar}>
          <p className={styles.sweatLabel}>{label}</p>
          <button
            type="button"
            className={styles.sweatToggle}
            aria-pressed={primed}
            onClick={() => setPrimed((value) => !value)}
          >
            <span className={styles.sweatBead} aria-hidden />
            <span className={styles.sweatToggleText}>
              {primed ? toDry : toPrimed}
            </span>
          </button>
          <p className={styles.sweatState} lang="ja">
            {primed ? statePrimed : stateDry}
          </p>
        </div>

        {/* Durum satırı: modun etkisini YAZIYLA da söylüyor */}
        <p className={styles.sweatHint} role="status">
          {primed ? hintPrimed : hintDry}
        </p>

        {children}
      </div>
    </RecoilContext.Provider>
  );
}
