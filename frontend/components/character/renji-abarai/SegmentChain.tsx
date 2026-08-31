"use client";

import { useState } from "react";
import styles from "./ZabimaruExperience.module.css";

/** Bir eklemin taşıdığı bölüm. Metinler SUNUCUDA çözülmüş düz dize. */
export interface ChainItem {
  key: string;
  /** Kanji ya da işaret; beşinci eklemde bilerek "—" */
  native: string;
  stage: string;
  title: string;
  reach: string;
  text: string;
  note: string;
  /** Kadraj + HEMEN ALTINDA kendi küratör yuvası — sunucuda çizilmiş */
  frame: React.ReactNode;
}

/** Bir eklemi kuran küçük çubuklar. Gecikmeyi CSS `--ren-i`den okuyor. */
const JOINT_BARS = [0, 1, 2, 3, 4];

/**
 * "UZAT" — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Her tıklamada zincir BİR EKLEM daha uzuyor ve o eklem sayfada YENİ BİR
 * BÖLÜM açıyor. Açılan her bölüm bir öncekinin TERS tarafına kayıyor, yani
 * zikzağın yönü her eklemde değişiyor. Uzayan şey bir gösterge ya da bir
 * sayaç değil, **sayfanın kendi düzeni**: zincir uzadıkça belge uzuyor ve
 * salınıyor.
 *
 * Altı eklem = Renji'nin altı kademesi (mühür → shikai → iki ruh → bankai →
 * kırık → gerçek ad). Beşincisi bilerek bir GERİ adım: eklem yine uzuyor
 * ama açtığı bölümde menzil sıfır. Zincirin uzaması ilerleme demek değil.
 *
 * ── NEDEN BAŞKA SAYFALARIN MEKANİĞİ DEĞİL ────────────────────────────────
 * Neji'de 2→64 giden bir VURUŞ SAYACI var (sayı büyüyor, düzen sabit).
 * Konohamaru'da dikey bir DEVİR zinciri var (halkalar bir kuşak aktarımını
 * gösteriyor, sayfa yerinde duruyor). Kenpachi'de çentikli bir kılıç RAYI
 * var (sabit bir ray üzerinde gezinme). Burada gezilecek bir ray, sayılacak
 * bir vuruş ve aktarılacak bir kuşak yok: her tıklama belgeye yeni bir
 * gövde ekliyor ve okuma yönünü çeviriyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Gerçek `<button>`, gerçek `<article>` + `<h3>`. Açılan bölüm sayfa
 * akışına giriyor (pencere/katman yok), yani ekran okuyucu onu normal
 * okuma sırasında buluyor. Ne olduğunu `role="status"` satırı da söylüyor.
 */
export function SegmentChain({
  items,
  extendLabel,
  extendDoneLabel,
  retractLabel,
  counterLabel,
  emptyLead,
  keyboardHint,
  statusOpened,
  statusFull,
  statusRetracted,
  sideLeftLabel,
  sideRightLabel,
  closingLine,
}: {
  items: ChainItem[];
  extendLabel: string;
  extendDoneLabel: string;
  retractLabel: string;
  counterLabel: string;
  emptyLead: string;
  keyboardHint: string;
  statusOpened: string;
  statusFull: string;
  statusRetracted: string;
  sideLeftLabel: string;
  sideRightLabel: string;
  closingLine: string;
}) {
  const [open, setOpen] = useState(0);
  const [status, setStatus] = useState("");

  const total = items.length;
  const full = open >= total;

  const extend = () => {
    if (full) return;
    const next = open + 1;
    setOpen(next);
    setStatus(
      next >= total ? statusFull : `${statusOpened} ${items[next - 1].title}`,
    );
  };

  const retract = () => {
    setOpen(0);
    setStatus(statusRetracted);
  };

  return (
    <div className={styles.chain}>
      <div className={styles.chainBar}>
        <button
          type="button"
          className={styles.chainButton}
          onClick={extend}
          disabled={full}
        >
          <span className={styles.chainButtonMark} aria-hidden />
          <span className={styles.chainButtonLabel}>
            {full ? extendDoneLabel : extendLabel}
          </span>
        </button>

        <p className={styles.chainCount}>
          <span className={styles.chainCountLabel}>{counterLabel}</span>
          <span className={styles.chainCountValue}>
            {open}/{total}
          </span>
        </p>

        <button
          type="button"
          className={styles.chainReset}
          onClick={retract}
          disabled={open === 0}
        >
          {retractLabel}
        </button>
      </div>

      <p className={styles.chainStatus} role="status">
        {status || emptyLead}
      </p>
      <p className={styles.chainHint}>{keyboardHint}</p>

      {/* Açılan eklemler — her biri bir öncekinin TERS tarafına kayıyor */}
      <ol className={styles.chainList}>
        {items.slice(0, open).map((item, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <li key={item.key} className={styles.chainItem} data-side={side}>
              {/* Eklem parçası: beş çubuk sırayla uzuyor (scaleX zinciri) */}
              <span
                className={styles.joint}
                data-side={side}
                aria-label={side === "left" ? sideLeftLabel : sideRightLabel}
                role="img"
              >
                {JOINT_BARS.map((bar) => (
                  <span
                    key={bar}
                    className={styles.jointBar}
                    style={{ "--ren-i": bar } as React.CSSProperties}
                  />
                ))}
              </span>

              <article
                className={styles.segment}
                aria-labelledby={`ren-seg-${item.key}`}
              >
                <p className={styles.segmentStage}>{item.stage}</p>
                <p className={styles.segmentNative} lang="ja" aria-hidden>
                  {item.native}
                </p>
                <h3 id={`ren-seg-${item.key}`} className={styles.segmentTitle}>
                  {item.title}
                </h3>
                <p className={styles.segmentReach}>{item.reach}</p>
                <p className={styles.segmentText}>{item.text}</p>
                <p className={styles.segmentNote}>{item.note}</p>
                {item.frame}
              </article>
            </li>
          );
        })}
      </ol>

      {full ? <p className={styles.chainClosing}>{closingLine}</p> : null}
    </div>
  );
}
