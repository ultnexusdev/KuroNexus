"use client";

import { useRef } from "react";
import Image from "next/image";
import { FoldMark, LeafDiagram, PaperFlower } from "./PaperGlyphs";
import { useFold } from "./PaperShell";
import styles from "./KonanExperience.module.css";

/**
 * Katlama masası — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Sayfa bir kabı açmıyor, bir DÜZLEMİ açıyor. Şemadaki kâğıt başlangıçta
 * dört yaprağı da göbeğin üstüne katlanmış küçük bir tomar; her adımda bir
 * yaprak menteşesinden kalkıp yerine yatıyor ve kâğıt büyüyor. Beşinci
 * adımda kâğıt tam açık, düz bir haç. Kap yok, kapak yok, ray yok:
 * yalnızca kendi üstüne kırılan bir yüzey.
 *
 * Katlanma İKİ AŞAMALI: her yaprak iç içe iki döndürmeden oluşuyor
 * (`.leaf` ve `.leafInner`, ikisi de aynı menteşe kenarında -90°). Açılırken
 * önce dış yarım kalkıyor, kısa bir gecikmeyle iç yarım yatıyor — origami
 * bir katı açarken elin yaptığı iki hareketin aynısı. Hareketin tamamı
 * CSS'te; burada yalnızca `data-open` niteliği değişiyor.
 *
 * Adım sayısı KÖKTE tutuluyor (`useFold`), çünkü sayfanın zemindeki kat
 * izleri de aynı sayıyı okuyor: kâğıt açıldıkça sayfanın kırışıkları artar.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: DİKEY tab listesi (otomatik etkinleştirme). Her adım tam genişlikte
 * bir kat çizgisi; üstünde origami notasyonu (vadi/dağ katı) ve dönem adı.
 * Gezinme:
 *   ↑ ↓ ← → : önceki/sonraki kat      Home/End : ilk/son kat
 * Ayrıca iki gerçek düğme (ileri/geri) var. Roving tabindex: yalnızca etkin
 * sekme tab sırasında.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 */

export interface FoldView {
  key: string;
  kanji: string;
  kind: "core" | "valley" | "mountain";
  kindLabel: string;
  era: string;
  title: string;
  text: string;
  image: string | null;
}

/** Yaprakların şemaları — göbek (0. adım) çiçeğin kendisi, kalan dördü bunlar. */
const LEAF_VARIANTS = ["wings", "sea", "tags", "last"] as const;
/** Menteşe kenarları: kuzey, doğu, güney, batı */
const LEAF_SIDES = ["n", "e", "s", "w"] as const;

export function FoldTable({
  folds,
  listLabel,
  foldWord,
  prevLabel,
  nextLabel,
  eraLabel,
  keyboardHint,
  sheetAlt,
}: {
  folds: FoldView[];
  listLabel: string;
  foldWord: string;
  prevLabel: string;
  nextLabel: string;
  eraLabel: string;
  keyboardHint: string;
  sheetAlt: string;
}) {
  const { fold, setFold } = useFold();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = folds[fold] ?? folds[0];
  if (!active) {
    return null;
  }

  /* Sekmeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     sekmenin üstünde kalmalı (roving tabindex şartı). */
  const focusTab = (next: number) => {
    const clamped = (next + folds.length) % folds.length;
    setFold(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(fold + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(fold - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(folds.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.fold}>
      <div className={styles.sheetSide}>
        <div
          className={styles.stage}
          role="img"
          aria-label={sheetAlt}
          data-open={fold}
        >
          <div className={styles.sheet}>
            {/* Göbek: katlanmış tomar. Hiç dönmez — kâğıdın sabit noktası. */}
            <span className={styles.core}>
              <PaperFlower
                className={styles.coreFlower}
                petalClassName={styles.petal}
                shadeClassName={styles.petalShade}
                creaseClassName={styles.petalCrease}
                coreClassName={styles.petalCore}
              />
            </span>

            {LEAF_SIDES.map((side, index) => (
              <span
                key={side}
                className={styles.leaf}
                data-side={side}
                data-open={fold > index ? "true" : undefined}
              >
                <span className={styles.leafInner}>
                  <span className={styles.leafFace}>
                    <LeafDiagram
                      variant={LEAF_VARIANTS[index]}
                      className={styles.leafArt}
                      lineClassName={styles.leafLine}
                      markClassName={styles.leafMark}
                    />
                    <span className={styles.leafKanji}>
                      {folds[index + 1]?.kanji ?? ""}
                    </span>
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        <p className={styles.foldCount}>
          <span className={styles.foldCountNumber}>{fold + 1}</span>
          <span className={styles.foldCountTotal}>/ {folds.length}</span>
          <span className={styles.foldCountWord}>{foldWord}</span>
        </p>
      </div>

      <div className={styles.foldPanelSide}>
        {/* Kat çizgileri: her biri bir adım. Tıklanan kat açılır. */}
        <div
          className={styles.creaseList}
          role="tablist"
          aria-orientation="vertical"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {folds.map((step, position) => (
            <button
              key={step.key}
              type="button"
              role="tab"
              id={`knn-fold-tab-${step.key}`}
              aria-selected={position === fold}
              aria-controls="knn-fold-panel"
              tabIndex={position === fold ? 0 : -1}
              data-state={
                position === fold ? "on" : position < fold ? "past" : "ahead"
              }
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.creaseRow}
              onClick={() => setFold(position)}
            >
              <FoldMark kind={step.kind} className={styles.creaseMark} />
              <span className={styles.creaseEra}>{step.era}</span>
              <span className={styles.creaseTitle}>{step.title}</span>
              <span className={styles.creaseKind}>{step.kindLabel}</span>
            </button>
          ))}
        </div>

        <div
          id="knn-fold-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`knn-fold-tab-${active.key}`}
          className={styles.foldPanel}
        >
          {active.image ? (
            <span className={styles.foldArt} aria-hidden>
              <Image src={active.image} alt="" fill sizes="720px" />
            </span>
          ) : null}
          <span className={styles.foldKanji} aria-hidden>
            {active.kanji}
          </span>
          <p className={styles.foldEra}>
            <span className={styles.foldEraLabel}>{eraLabel}</span>
            <span className={styles.foldEraValue}>{active.era}</span>
          </p>
          <h3 className={styles.foldTitle}>{active.title}</h3>
          <p className={styles.foldText}>{active.text}</p>
        </div>

        <div className={styles.foldNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setFold(Math.max(fold - 1, 0))}
            disabled={fold === 0}
          >
            <span aria-hidden>↑</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setFold(Math.min(fold + 1, folds.length - 1))}
            disabled={fold === folds.length - 1}
          >
            {nextLabel}
            <span aria-hidden>↓</span>
          </button>
        </div>
        <p className={styles.foldHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
