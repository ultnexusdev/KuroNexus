"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { FallTrace, GroundMark } from "./UrarakaGlyphs";
import styles from "./ZeroGravityExperience.module.css";

/**
 * "Release" — sayfanın kalbi (brief §Mekanik).
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Beş kart havada asılı duruyor; her biri Uraraka'nın kaldırdığı bir şey.
 * Tek bir «Release» düğmesi var ve basıldığında BEŞİ BİRDEN ivmelenerek
 * düşüyor, yer çizgisinde üst üste yığılıyor.
 *
 * Yığın rastgele değil: düşerken kartların sırası DEĞİŞİYOR. Havadayken
 * sıra kaldırma sırası (01→05), yerdeyken bedel sırası (en ağır en üstte).
 * Aynı kart iki durumda İKİ AYRI metin veriyor — `lifted` havada,
 * `cost` yerde. Yani düşmüş dizilim gerçekten ayrı bir OKUMA.
 *
 * ── BULANTI ──────────────────────────────────────────────────────────────
 * Künyeye göre gücün bedeli mide bulantısı. Kaldırma sayacı üçe ulaşınca
 * bir «yeter» uyarısı düşüyor (`role="status"`) ve alan hafifçe sallanıyor.
 * Sayaç geri alınmıyor: bir kere yorulduysan yorgunsun.
 *
 * ── NEDEN İSTEMCİ ────────────────────────────────────────────────────────
 * Üç durum tutuyor (düştü mü, kaç kez kaldırıldı, hangi kart açık) ve
 * üçü de kullanıcı etkileşimine bağlı. Metinler sunucuda `pick` ile
 * seçilip buraya DÜZ DİZE olarak iniyor — bu ada hiç `LocalizedText`
 * görmüyor.
 *
 * ── PERDE ────────────────────────────────────────────────────────────────
 * `scene` küratörün yüklediği bir kare olabiliyor ve durum satırı onun
 * üstünde duruyor. Kontrast betiği yüklenen görselin üstünü ÖLÇEMEZ, o
 * yüzden görselle metin arasına opak bir perde (`fieldScrim`) konuyor.
 */

export interface ReleaseCard {
  key: string;
  numeral: string;
  fallNumeral: string;
  floatOrder: number;
  fallOrder: number;
  title: string;
  lifted: string;
  cost: string;
  weight: string;
  span: string;
  drift: number;
}

export interface ReleaseUi {
  release: string;
  lift: string;
  stageLabel: string;
  listLabel: string;
  stateFloating: string;
  stateFallen: string;
  liftedLabel: string;
  costLabel: string;
  orderLabel: string;
  fallOrderLabel: string;
  weightLabel: string;
  selectHint: string;
  liftCountLabel: string;
  nausea: string;
  closingNote: string;
}

/** Bulantı eşiği — künyedeki "sınırı aşınca Quirk dağılıyor" kuralının sayfa karşılığı. */
const NAUSEA_AT = 3;

export function ReleaseField({
  cards,
  ui,
  scene,
  slot,
}: {
  cards: ReleaseCard[];
  ui: ReleaseUi;
  /** Küratörün yüklediği geniş sahne — yoksa alan görselsiz ama ayakta */
  scene: string | null;
  /** Küratör yuvası; ziyaretçide `null` olarak geliyor */
  slot: ReactNode;
}) {
  const [fallen, setFallen] = useState(false);
  const [lifts, setLifts] = useState(0);
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const warned = lifts >= NAUSEA_AT;

  const toggle = () => {
    setTouched(true);
    setFallen((was) => {
      /* Kaldırma = düşmüş hâlden havaya dönmek. Sayaç YALNIZCA orada
         artıyor; bırakmak bedava, kaldırmak değil. */
      if (was) setLifts((count) => count + 1);
      return !was;
    });
  };

  return (
    <div
      className={styles.field}
      data-fallen={fallen ? "true" : "false"}
      data-touched={touched ? "true" : "false"}
      data-warned={warned ? "true" : "false"}
    >
      <div className={styles.fieldSky} data-filled={scene ? "true" : "false"}>
        {scene ? (
          <Image
            src={scene}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 1180px"
          />
        ) : null}
        {/* Perde: yüklenen görselle metin arasına giren opak katman */}
        <span className={styles.fieldScrim} aria-hidden />
        <FallTrace className={styles.fieldTrace} />
      </div>

      {slot}

      <div className={styles.fieldControls}>
        <button type="button" className={styles.releaseButton} onClick={toggle}>
          <span className={styles.releaseRing} aria-hidden>
            <span className={styles.releaseDot} />
          </span>
          <span className={styles.releaseText}>
            {fallen ? ui.lift : ui.release}
          </span>
        </button>
        <p className={styles.fieldCount}>
          <span className={styles.fieldCountLabel}>{ui.liftCountLabel}</span>
          <span className={styles.fieldCountValue}>{lifts}</span>
        </p>
      </div>

      <p className={styles.fieldState} role="status">
        {fallen ? ui.stateFallen : ui.stateFloating}
      </p>

      {warned ? (
        <p className={styles.fieldNausea} role="status">
          {ui.nausea}
        </p>
      ) : null}

      <ol className={styles.lifts} aria-label={ui.listLabel}>
        {cards.map((card) => {
          const isOpen = open === card.key;
          const bodyId = `urk-lift-${card.key}`;
          return (
            <li
              key={card.key}
              className={styles.lift}
              data-span={card.span}
              data-drift={card.drift}
              style={
                {
                  "--urk-order": fallen ? card.fallOrder : card.floatOrder,
                } as CSSProperties
              }
            >
              <div className={styles.liftInner}>
                <button
                  type="button"
                  className={styles.liftButton}
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen((was) => (was === card.key ? null : card.key))}
                >
                  <span className={styles.liftIndex}>
                    {fallen ? card.fallNumeral : card.numeral}
                  </span>
                  <span className={styles.liftHead}>
                    <span className={styles.liftOrderLabel}>
                      {fallen ? ui.fallOrderLabel : ui.orderLabel}
                    </span>
                    <span className={styles.liftTitle}>{card.title}</span>
                    <span className={styles.liftWeight}>
                      {ui.weightLabel} · {card.weight}
                    </span>
                  </span>
                </button>
                <div id={bodyId} className={styles.liftBody} hidden={!isOpen}>
                  <p className={styles.liftBodyLabel}>
                    {fallen ? ui.costLabel : ui.liftedLabel}
                  </p>
                  <p className={styles.liftBodyText}>
                    {fallen ? card.cost : card.lifted}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <span className={styles.fieldGround} aria-hidden>
        <GroundMark className={styles.fieldGroundMark} />
      </span>

      <p className={styles.fieldHint}>{ui.selectHint}</p>
      <p className={styles.fieldNote}>{ui.closingNote}</p>
      <p className={styles.srOnly}>{ui.stageLabel}</p>
    </div>
  );
}
