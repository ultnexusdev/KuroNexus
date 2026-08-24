"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { INO_WEB_GEOMETRY, MindWebArt } from "./InoGlyphs";
import styles from "./InoExperience.module.css";

/**
 * Zihin ağı — sayfanın kalbi.
 *
 * ── MEKANİK: BİRİKEN AĞ, DÖNEN SEKME DEĞİL ───────────────────────────────
 * Sitedeki on beş deneyim sayfasının hiçbirinde bu davranış yok ve fark
 * yapısal: burada seçim TEK DEĞİL. Kurulan bağ kurulu kalıyor, ikincisi
 * birincisini söndürmüyor, iki ucu da bağlı olan düğümlerin arasında yeni
 * kirişler beliriyor ve dıştaki ittifak halkası bağ sayısıyla doluyor.
 * Yani ziyaretçi bir hikâyeyi sırayla okumuyor — bir ağ örüyor, ve sayfanın
 * iddiası ("tek zihinden bir cepheye") o örgünün kendisiyle kanıtlanıyor.
 *
 * Bu yüzden ARIA deseni de sekme listesi DEĞİL: her düğüm kendi başına
 * açılıp kapanan bir `aria-pressed` düğmesi, hepsi tab sırasında. Sekme
 * listesi olsaydı "yalnızca biri etkin" sözü verilir ve ekran okuyucu
 * kullanıcısına yanlış bir zihinsel model kurulurdu.
 *
 * ── KLAVYE ───────────────────────────────────────────────────────────────
 *   Tab        : düğümler arasında normal sıra (hepsi odaklanabilir)
 *   ← ↑ / → ↓  : taç üstünde komşu düğüme geç (odak taşınır)
 *   Home / End : ilk / son düğüm
 *   Boşluk, ↵  : bağı kur ya da çöz (gerçek <button>, bedava gelir)
 * Durum değişikliği `role="status"` satırında duyuruluyor: kimle bağ
 * kuruldu ve kaç bağ var.
 *
 * Bütün metinler sunucuda seçilip düz dize olarak iniyor — bu adaya
 * `LocalizedText` girmiyor (BRIEF §5).
 */

export interface MindNodeView {
  key: string;
  kanji: string;
  who: string;
  title: string;
  eyes: string;
  body: string;
  learned: string;
  image: string | null;
  imageAlt: string;
  finale: boolean;
}

/** İttifak halkasındaki nokta sayısı — `MindWebArt` ile aynı sayı. */
const RING_TOTAL = 48;

export function MindWeb({
  nodes,
  groupLabel,
  counterLabel,
  resetLabel,
  linkedBadge,
  eyesLabel,
  learnedLabel,
  idleTitle,
  idleText,
  hint,
  ringNote,
  completeNote,
  webAlt,
  linkedAnnounce,
  releasedAnnounce,
}: {
  nodes: MindNodeView[];
  groupLabel: string;
  counterLabel: string;
  resetLabel: string;
  linkedBadge: string;
  eyesLabel: string;
  learnedLabel: string;
  idleTitle: string;
  idleText: string;
  hint: string;
  ringNote: string;
  completeNote: string;
  webAlt: string;
  linkedAnnounce: string;
  releasedAnnounce: string;
}) {
  /** Bağ kurulmuş düğümler — kuruluş SIRASINDA tutuluyor. */
  const [linked, setLinked] = useState<string[]>([]);
  /** Panelde okunan düğüm; hiç bağ yoksa null (boş ağ hâli). */
  const [reading, setReading] = useState<string | null>(null);
  /** Canlı bölgeye düşen son cümle. */
  const [announce, setAnnounce] = useState("");
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const total = nodes.length;
  const linkedSet = new Set(linked);
  const current = reading
    ? (nodes.find((node) => node.key === reading) ?? null)
    : null;

  /* Halkanın kaç noktası yanıyor: bağ sayısıyla orantılı. Altı bağın
     hepsi kurulduğunda halka tamamlanıyor — sayfanın kapanış anı. */
  const filled = Math.round((linked.length / total) * RING_TOTAL);
  const complete = linked.length === total;

  const toggle = (node: MindNodeView) => {
    const isLinked = linkedSet.has(node.key);
    const next = isLinked
      ? linked.filter((key) => key !== node.key)
      : [...linked, node.key];

    setLinked(next);
    /* Çözülen düğüm okunan düğümse panel bir önceki bağa düşer; hiç bağ
       kalmadıysa ağ boş hâline döner. */
    setReading(
      isLinked
        ? node.key === reading
          ? (next[next.length - 1] ?? null)
          : reading
        : node.key,
    );
    setAnnounce(
      `${node.who} — ${isLinked ? releasedAnnounce : linkedAnnounce} · ${next.length}/${total}`,
    );
  };

  const focusNode = (index: number) => {
    const clamped = (index + total) % total;
    buttons.current[clamped]?.focus();
  };

  /* Tip `HTMLButtonElement`: bu işleyici düğüm DÜĞMELERİNE bağlanıyor,
     sarmalayıcı `div`e değil. `HTMLDivElement` yazılırsa TS olayı
     kabul etmez (div'in `align` alanı button'da yok). */
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusNode(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusNode(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusNode(0);
        break;
      case "End":
        event.preventDefault();
        focusNode(total - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.web} data-complete={complete || undefined}>
      <div className={styles.webStage}>
        <MindWebArt
          linked={linkedSet}
          filled={filled}
          title={webAlt}
          className={styles.webArt}
          linkClassName={styles.webLink}
          chordClassName={styles.webChord}
          dotClassName={styles.webRing}
          coreClassName={styles.webCore}
        />

        <div
          className={styles.webNodes}
          role="group"
          aria-label={groupLabel}
        >
          {nodes.map((node, index) => {
            const point = INO_WEB_GEOMETRY.find(
              (item) => item.key === node.key,
            );
            if (!point) {
              return null;
            }
            const on = linkedSet.has(node.key);
            return (
              <button
                key={node.key}
                type="button"
                aria-pressed={on}
                className={styles.webNode}
                data-finale={node.finale || undefined}
                data-reading={node.key === reading || undefined}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                onClick={() => toggle(node)}
                onKeyDown={(event) => onKeyDown(event, index)}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <span className={styles.webNodeDot} aria-hidden />
                <span className={styles.webNodeKanji} aria-hidden>
                  {node.kanji}
                </span>
                <span className={styles.webNodeWho} aria-hidden>
                  {node.who}
                </span>
                <span className={styles.visuallyHidden}>
                  {`${node.who} — ${node.title}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.webSide}>
        <div className={styles.webMeter}>
          <p className={styles.webCount}>
            <span className={styles.webCountLabel}>{counterLabel}</span>
            <span className={styles.webCountValue}>
              <span className={styles.webCountNow}>{linked.length}</span>
              <span className={styles.webCountTotal}>/ {total}</span>
            </span>
          </p>
          <button
            type="button"
            className={styles.webReset}
            onClick={() => {
              setLinked([]);
              setReading(null);
              setAnnounce("");
            }}
            disabled={linked.length === 0}
          >
            {resetLabel}
          </button>
        </div>

        <div className={styles.webPanel} data-idle={current ? undefined : "true"}>
          {current ? (
            <>
              {current.image ? (
                <span className={styles.webPanelArt}>
                  <Image
                    src={current.image}
                    alt={current.imageAlt}
                    fill
                    sizes="640px"
                  />
                </span>
              ) : null}
              <p className={styles.webPanelMeta}>
                <span className={styles.webPanelKanji} aria-hidden>
                  {current.kanji}
                </span>
                <span className={styles.webPanelWho}>{current.who}</span>
                <span className={styles.webPanelBadge}>{linkedBadge}</span>
              </p>
              <h3 className={styles.webPanelTitle}>{current.title}</h3>
              <p className={styles.webPanelEyes}>
                <span className={styles.webPanelLabel}>{eyesLabel}</span>
                {current.eyes}
              </p>
              <p className={styles.webPanelBody}>{current.body}</p>
              <p className={styles.webPanelLearned}>
                <span className={styles.webPanelLabel}>{learnedLabel}</span>
                {current.learned}
              </p>
            </>
          ) : (
            <>
              <h3 className={styles.webPanelTitle}>{idleTitle}</h3>
              <p className={styles.webPanelBody}>{idleText}</p>
            </>
          )}
        </div>

        <p className={styles.webRingNote}>
          {complete ? completeNote : ringNote}
        </p>
        <p className={styles.webHint}>{hint}</p>
        <p className={styles.visuallyHidden} role="status">
          {announce}
        </p>
      </div>
    </div>
  );
}
