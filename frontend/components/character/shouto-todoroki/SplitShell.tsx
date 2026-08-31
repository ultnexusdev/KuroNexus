"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { FlameMark, FrostMark, SeamNotch } from "./TodorokiGlyphs";
import styles from "./HalfAndHalfExperience.module.css";

/**
 * Todoroki sayfasının kabuğu — kök öğe, TEK modu ve sayfanın kalbi.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca doğru sırayla yerleştirir. İstemciye inen tek şey iki durum
 * (bir boolean, bir sayı) ve onları çeviren üç kontrol. Sayfanın TEK istemci
 * adası bu dosya; `TodorokiGlyphs` ada değil (durumu yok).
 *
 * ── NEDEN İKİ DURUM AYNI ADADA ───────────────────────────────────────────
 * Yedi durağın sırası hero → mod düğmesi → künye → laboratuvar → interaktif
 * bölüm. Yani mod düğmesi ile kaydırak sayfanın İKİ AYRI YERİNDE duruyor ama
 * ikisi de aynı kök niteliklerini çeviriyor. İki ayrı ada durumu paylaşamaz;
 * bu yüzden ikisi de burada ve aralarındaki sunucu bölümleri prop olarak
 * geçiyor.
 *
 * ── KÖKTEKİ ÜÇ NİTELİK ───────────────────────────────────────────────────
 *   --tdr-split  → 0–100. Bölünme çizgisinin yeri ve HER bölümün iki
 *                  yarısının genişliği. Satır içi stil, çünkü sürekli bir
 *                  değer; sınıfla ifade edilemez.
 *   data-power   → "half" | "full". Mod düğmesi. Kilitli ızgarayı AÇIP
 *                  KAPATMIYOR (Dalga 1 bulgusu 2): bölünme her iki durumda
 *                  da yerinde; değişen, alev yarısının çalışıp çalışmadığı.
 *                  Varsayılan "half" — karakterin kendi başlangıç ayarı.
 *   data-edge    → "none" | "ice" | "flame". Yalnızca uçlarda (0 / 100).
 *                  O uçta kapanan sütun layout'tan ve erişilebilirlik
 *                  ağacından GERÇEKTEN çıkıyor (`display: none`), yerini
 *                  bedeli anlatan panel alıyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */

const STEP = 5;

export interface SplitBand {
  /** Bu banda düşen en yüksek değer (dâhil). */
  upTo: number;
  title: string;
  text: string;
}

export interface ModeText {
  title: string;
  native: string;
  toFull: string;
  toHalf: string;
  stateHalf: string;
  stateFull: string;
  hintHalf: string;
  hintFull: string;
}

export interface DialText {
  title: string;
  native: string;
  lede: string;
  sliderLabel: string;
  iceEnd: string;
  flameEnd: string;
  iceLabel: string;
  flameLabel: string;
  readoutLabel: string;
  /** `aria-valuetext` kalıbı — `{ice}` ve `{flame}` sayıyla değişiyor. */
  valueText: string;
  presetsLabel: string;
  presetFlame: string;
  presetHalf: string;
  presetIce: string;
  keyboardHint: string;
  costTitle: string;
  frameCaption: string;
}

function bandFor(bands: SplitBand[], value: number): SplitBand {
  return bands.find((band) => value <= band.upTo) ?? bands[bands.length - 1];
}

export function SplitShell({
  isAdmin,
  watermarkLeft,
  watermarkRight,
  mode,
  dial,
  bands,
  dialScene,
  dialSceneAlt,
  dialSlot,
  crumb,
  hero,
  dossier,
  lab,
  rest,
}: {
  isAdmin: boolean;
  watermarkLeft: string;
  watermarkRight: string;
  mode: ModeText;
  dial: DialText;
  bands: SplitBand[];
  dialScene: string | null;
  dialSceneAlt: string;
  dialSlot: ReactNode;
  crumb: ReactNode;
  hero: ReactNode;
  dossier: ReactNode;
  lab: ReactNode;
  rest: ReactNode;
}) {
  const [full, setFull] = useState(false);
  const [split, setSplit] = useState(50);

  const edge = split === 0 ? "flame" : split === 100 ? "ice" : "none";
  const band = bandFor(bands, split);

  /* Ekran okuyucu ham yüzdeyi değil ORANI duysun: "yüzde 70 buz, yüzde 30
     alev — Buz ağır basıyor". Kalıp sunucuda `pick` edilip düz dize olarak
     indi; burada yalnızca iki sayı yerine oturuyor. */
  const valueText = `${dial.valueText
    .replace("{ice}", String(split))
    .replace("{flame}", String(100 - split))} — ${band.title}`;

  return (
    <div
      className={styles.page}
      data-world="shouto-todoroki"
      data-power={full ? "full" : "half"}
      data-edge={edge}
      style={{ "--tdr-split": split } as CSSProperties}
    >
      {/* Zemin yıkaması: solda soğuk, sağda sıcak. Hiçbir metnin ALTINDA
          değil — kontrast ölçümü bozulmasın diye yalnızca kökte. */}
      <span className={styles.wash} aria-hidden />

      <CuratorFrame isAdmin={isAdmin}>
        <div className={styles.column}>
          {/* Bölünme çizgisi: sayfanın en üstünden en altına iner ve
              `--tdr-split` ile birlikte kayar. Sayfanın tek sürekli öğesi. */}
          <span className={styles.seam} aria-hidden />

          {/* Filigran: 半分 — çizginin iki yanında, iki ayrı renkte.
              Tek bir kelime, iki yarım. */}
          <span className={styles.watermark} aria-hidden>
            <span className={styles.watermarkIce}>{watermarkLeft}</span>
            <span className={styles.watermarkFlame}>{watermarkRight}</span>
          </span>
          <FrostMark
            className={styles.markIce}
            armClassName={styles.markIceArm}
            coreClassName={styles.markIceCore}
          />
          <FlameMark
            className={styles.markFlame}
            outlineClassName={styles.markFlameOutline}
            tongueClassName={styles.markFlameTongue}
          />

          {crumb}
          {hero}

          {/* ══ 2 · MOD DÜĞMESİ ══════════════════════════════════════════ */}
          <section className={styles.mode} aria-labelledby="tdr-mode">
            <div className={styles.modeHead}>
              <SeamNotch
                className={styles.modeNotch}
                iceClassName={styles.notchIce}
                flameClassName={styles.notchFlame}
              />
              <h2 id="tdr-mode" className={styles.modeTitle}>
                {mode.title}
              </h2>
              <p className={styles.modeNative} lang="ja" aria-hidden>
                {mode.native}
              </p>
            </div>

            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={full}
              onClick={() => setFull((value) => !value)}
            >
              {/* İki kare: soldaki hep canlı, sağdaki modla birlikte
                  yanıyor ya da küle dönüyor. */}
              <span className={styles.modeChipIce} aria-hidden />
              <span className={styles.modeChipFlame} aria-hidden />
              <span className={styles.modeButtonText}>
                {full ? mode.toHalf : mode.toFull}
              </span>
            </button>

            {/* Durum yalnızca renkle değil YAZIYLA da veriliyor. */}
            <p className={styles.modeState} role="status">
              <span className={styles.modeStateName}>
                {full ? mode.stateFull : mode.stateHalf}
              </span>
              <span className={styles.modeStateText}>
                {full ? mode.hintFull : mode.hintHalf}
              </span>
            </p>
          </section>

          {dossier}
          {lab}

          {/* ══ 5 · İNTERAKTİF BÖLÜM — oran kaydırağı ════════════════════ */}
          <section className={styles.dial} aria-labelledby="tdr-dial">
            <header className={styles.sectionHead}>
              <SeamNotch
                className={styles.sectionNotch}
                iceClassName={styles.notchIce}
                flameClassName={styles.notchFlame}
              />
              <h2 id="tdr-dial" className={styles.sectionTitle}>
                {dial.title}
              </h2>
              <p className={styles.sectionNative} lang="ja" aria-hidden>
                {dial.native}
              </p>
              <p className={styles.sectionLede}>{dial.lede}</p>
              <span className={styles.ratioBar} aria-hidden>
                <span className={styles.ratioIce} />
                <span className={styles.ratioFlame} />
              </span>
            </header>

            <div className={styles.dialBoard}>
              {/* ⚠️ SOL uç `flameEnd`, SAĞ uç `iceEnd`. Kaydırağın değeri BUZ
                  sütununun genişliği: 0'da buz yok (yalnız alev), 100'de alev
                  yok (yalnız buz). Etiketler kendi renklerini okuduğu için
                  yerleri de kendi taraflarına denk gelmek zorunda. */}
              <div className={styles.dialTrackRow}>
                <span className={styles.dialEndFlame}>{dial.flameEnd}</span>
                <label className={styles.dialLabel} htmlFor="tdr-range">
                  {dial.sliderLabel}
                </label>
                <span className={styles.dialEndIce}>{dial.iceEnd}</span>
              </div>

              <input
                id="tdr-range"
                className={styles.dialRange}
                type="range"
                min={0}
                max={100}
                step={STEP}
                value={split}
                aria-valuetext={valueText}
                onChange={(event) => setSplit(Number(event.target.value))}
              />

              <div className={styles.dialGauge} aria-hidden>
                <span className={styles.dialGaugeIce}>
                  <span className={styles.dialGaugeName}>{dial.iceLabel}</span>
                  <span className={styles.dialGaugeValue}>{split}</span>
                </span>
                <span className={styles.dialGaugeFlame}>
                  <span className={styles.dialGaugeValue}>{100 - split}</span>
                  <span className={styles.dialGaugeName}>{dial.flameLabel}</span>
                </span>
              </div>

              <div className={styles.presets}>
                <span className={styles.presetsLabel} id="tdr-presets">
                  {dial.presetsLabel}
                </span>
                <span className={styles.presetRow} role="group" aria-labelledby="tdr-presets">
                  <button
                    type="button"
                    className={styles.presetFlame}
                    aria-pressed={split === 0}
                    onClick={() => setSplit(0)}
                  >
                    {dial.presetFlame}
                  </button>
                  <button
                    type="button"
                    className={styles.presetHalf}
                    aria-pressed={split === 50}
                    onClick={() => setSplit(50)}
                  >
                    {dial.presetHalf}
                  </button>
                  <button
                    type="button"
                    className={styles.presetIce}
                    aria-pressed={split === 100}
                    onClick={() => setSplit(100)}
                  >
                    {dial.presetIce}
                  </button>
                </span>
              </div>

              {/* Okuma alanı: her zaman aynı yerde, uçlarda bir başlık daha
                  alıyor. İçindeki metinler SUNUCUDA `pick` ile seçildi —
                  buraya düz dize olarak indi (Dalga 1 bulgusu 3). */}
              <div
                className={styles.readout}
                data-edge={edge}
                role="status"
                aria-live="polite"
              >
                {edge === "none" ? (
                  <p className={styles.readoutLabel}>{dial.readoutLabel}</p>
                ) : (
                  <p className={styles.readoutCost}>{dial.costTitle}</p>
                )}
                <p className={styles.readoutTitle}>{band.title}</p>
                <p className={styles.readoutText}>{band.text}</p>
              </div>

              <p className={styles.dialHint}>{dial.keyboardHint}</p>
            </div>

            {/* Oran karesi — boşken de duruyor, ziyaretçi için YAZISIZ. */}
            <div
              className={styles.dialPlate}
              data-filled={dialScene ? "true" : "false"}
            >
              {dialScene ? (
                <Image
                  className={styles.dialPlateImage}
                  src={dialScene}
                  alt={dialSceneAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 1120px"
                />
              ) : null}
            </div>
            {dialSlot}
            {/* Kadraj künyesi YALNIZCA küratör modunda: ziyaretçi boş bir
                kutunun içinde üretim notu görmez (Dalga 1 bulgusu 1). */}
            {isAdmin ? (
              <p className={styles.plateCaption}>{dial.frameCaption}</p>
            ) : null}
          </section>

          {rest}
        </div>
      </CuratorFrame>
    </div>
  );
}
