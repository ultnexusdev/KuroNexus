"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import {
  FoxSigil,
  StageNode,
  TailFan,
  type StageNodeKind,
} from "./NarutoGlyphs";
import styles from "./NarutoExperience.module.css";

/**
 * Sayfanın TEK istemci adası.
 *
 * İki durum tutar ve ikisini de sayfanın köküne nitelik olarak yazar:
 *   `data-kurama`  — mod düğmesi (mührün içinden bakış)
 *   `data-tail`    — kuyruk rayının aktif kademesi
 *
 * Bütün görsel etki CSS'te: kök nitelikten `--nrt-heat` (sayı) türetiliyor,
 * ondan da sayfanın canlı vurgu rengi. Yani "sayfanın ısınması" tek bir
 * niteliğin değişmesiyle oluyor, JS hiçbir renk hesaplamıyor.
 *
 * ── NEDEN KÜNYE DE BURADA ────────────────────────────────────────────────
 * Künyedeki "chakra basıncı" satırı seçili kademeyle değişiyor, yani rayla
 * aynı durumu okuyor. İki ayrı ada kurup aralarında durum taşımak yerine
 * künyenin dokuz kısa satırı da bu adaya alındı. Sayfanın geri kalanı —
 * hero, laboratuvar, çizelge, kapanış — SUNUCUDA çiziliyor ve buraya
 * `hero` / `children` olarak hazır düğüm hâlinde geliyor: gövde tarayıcıya
 * JS olarak inmiyor (GenjutsuShell emsalindeki kompozisyon deseni).
 *
 * Bütün metinler sunucuda `pick()` ile seçilip düz dize olarak iniyor;
 * `LocalizedText` istemci sınırını geçmiyor (brief kural 5).
 */

export interface ShellStage {
  key: string;
  short: string;
  mark: string;
  tails: number;
  node: StageNodeKind;
  native: string;
  name: string;
  when: string;
  text: string;
  pressure: string;
  cost: string;
  /** Küratörün yüklediği sahne — yoksa panel glifle çizilir */
  image: string | null;
  /** Kademeye bağlı yoldaş portresi (Minato, Kushina, Kurama) */
  face: { src: string | null; name: string } | null;
  /** Sunucuda çizilmiş yükleme yuvası — yalnız kürator modunda dolu */
  slot: React.ReactNode;
}

export interface ChakraShellProps {
  /** Küratör anahtarı sayfanın KÖKÜNÜN İÇİNDE duruyor ki dünya token'larını
      (turuncu accent) miras alsın — dışarıda kalsa varsayılan mor temayla
      çizilirdi. */
  isAdmin: boolean;
  modeEnter: string;
  modeExit: string;
  modeNote: string;
  identity: {
    heading: string;
    pressureLabel: string;
    rows: Array<{ label: string; value: string }>;
  };
  scale: {
    title: string;
    lede: string;
    railLabel: string;
    hint: string;
    whenLabel: string;
    costLabel: string;
    fanLabel: string;
    pressureLabel: string;
  };
  stages: ShellStage[];
  hero: React.ReactNode;
  children: React.ReactNode;
}

const PANEL_ID = "naruto-stage-panel";
const tabId = (key: string) => `naruto-stage-tab-${key}`;

export function ChakraShell({
  isAdmin,
  modeEnter,
  modeExit,
  modeNote,
  identity,
  scale,
  stages,
  hero,
  children,
}: ChakraShellProps) {
  const [kurama, setKurama] = useState(false);
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const stage = stages[active];

  /* Sekme deseni: seçim odağı izler. Dikey de kabul ediliyor çünkü ray dar
     ekranda yatay kaydırıcıya dönüşüyor ve kullanıcı yukarı/aşağı okla da
     denemeye eğilimli (WAI-ARIA tabs deseninin izin verdiği genişletme). */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const last = stages.length - 1;
      let next: number;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = active === last ? 0 : active + 1;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = active === 0 ? last : active - 1;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = last;
          break;
        default:
          return;
      }
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    },
    [active, stages.length],
  );

  return (
    /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor. */
    <div
      className={styles.page}
      data-world="naruto-uzumaki"
      data-kurama={kurama || undefined}
      data-tail={stage.key}
    >
      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={kurama}
        title={modeNote}
        onClick={() => setKurama((value) => !value)}
      >
        <FoxSigil className={styles.modeIcon} />
        <span>{kurama ? modeExit : modeEnter}</span>
      </button>

      {/* Mühür kafesi — yalnız Kurama modunda görünür, tıklama geçirmez */}
      <span className={styles.sealCage} aria-hidden />

      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ KÜNYE — canlı ölçü şeridi ══ */}
        <section className={styles.gauge} aria-labelledby="naruto-record">
          <h2 id="naruto-record" className={styles.visuallyHidden}>
            {identity.heading}
          </h2>
          <dl className={styles.gaugeRow}>
            {identity.rows.map((row) => (
              <div key={row.label} className={styles.gaugeCell}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
            <div className={styles.gaugeCell} data-live="true">
              <dt>{identity.pressureLabel}</dt>
              <dd>
                {stage.pressure}
                <span className={styles.gaugeBar} aria-hidden />
              </dd>
            </div>
          </dl>
        </section>

        {/* ══ KUYRUK RAYI — sayfanın kalbi ══ */}
        <section className={styles.scale} aria-labelledby="naruto-scale">
          <header className={styles.sectionHead}>
            <h2 id="naruto-scale" className={styles.sectionTitle}>
              {scale.title}
            </h2>
            <p className={styles.sectionLede}>{scale.lede}</p>
          </header>

          <div className={styles.fanStage}>
            <TailFan
              tails={stage.tails}
              className={styles.fan}
              tailClassName={styles.tail}
            />
            <p className={styles.visuallyHidden}>
              {scale.fanLabel}: {stage.tails}
            </p>
          </div>

          <div className={styles.railViewport}>
            <div
              className={styles.rail}
              role="tablist"
              aria-label={scale.railLabel}
              onKeyDown={onKeyDown}
            >
              <span className={styles.railLine} aria-hidden />
              <span
                className={styles.railFill}
                style={{ "--pos": active } as React.CSSProperties}
                aria-hidden
              />
              {stages.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  id={tabId(item.key)}
                  role="tab"
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className={styles.stop}
                  data-node={item.node}
                  data-beyond={index >= 7 ? "true" : undefined}
                  aria-selected={index === active}
                  aria-controls={PANEL_ID}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  <StageNode kind={item.node} className={styles.stopNode} />
                  <span className={styles.stopMark}>{item.mark}</span>
                  <span className={styles.stopName}>{item.short}</span>
                </button>
              ))}
            </div>
          </div>

          <p className={styles.railHint}>{scale.hint}</p>

          <div
            id={PANEL_ID}
            className={styles.stagePanel}
            role="tabpanel"
            aria-labelledby={tabId(stage.key)}
            tabIndex={0}
          >
            <div className={styles.stageArt}>
              {stage.image ? (
                <Image src={stage.image} alt="" fill sizes="(max-width: 900px) 100vw, 620px" />
              ) : (
                <StageNode kind={stage.node} className={styles.stageArtGlyph} />
              )}
              {stage.face?.src ? (
                <span className={styles.stageFace}>
                  <Image src={stage.face.src} alt={stage.face.name} fill sizes="120px" />
                </span>
              ) : null}
            </div>

            <div className={styles.stageBody}>
              <p className={styles.stageNative} aria-hidden>
                {stage.native}
              </p>
              <h3 className={styles.stageName}>{stage.name}</h3>
              <p className={styles.stageWhen}>
                <span>{scale.whenLabel}</span>
                {stage.when}
              </p>
              <p className={styles.stageText}>{stage.text}</p>
              <dl className={styles.stageMeta}>
                <div>
                  <dt>{scale.pressureLabel}</dt>
                  <dd>{stage.pressure}</dd>
                </div>
                <div>
                  <dt>{scale.costLabel}</dt>
                  <dd>{stage.cost}</dd>
                </div>
              </dl>
              {stage.face?.src ? (
                <p className={styles.stageFaceName}>{stage.face.name}</p>
              ) : null}
            </div>

            {stage.slot}
          </div>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
