"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import styles from "./QuincyExperience.module.css";

/**
 * NİŞANGÂH — sayfanın kalbi (istemci adası 2/2).
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Sayfa bir hedefleme arayüzü. Panoda BEŞ hedef duruyor; birine
 * tıklandığında (ya da sekmeyle gelinip Enter'a basıldığında) üç şey aynı
 * anda oluyor:
 *
 *   1. Reticle o hedefe TAŞINIYOR ve halkaları dönerek daralıyor
 *      (`uryLock` — kısa, mekanik, sıçramalı; ara duraklarda BEKLİYOR).
 *   2. Hedef BÜYÜTÜLÜYOR — kanji ölçeği artıyor, komşu hedefler soluyor:
 *      nişangâh yalnızca bir şeye bakabilir.
 *   3. Yan panelde ÖLÇÜ okumaları açılıyor (mesafe · açı · ok sayısı) ve
 *      altında o hedefin metni.
 *
 * Yani eksen ZOOM + ÖLÇÜM. Yayındaki 41 mekaniğin hiçbiri iki boyutlu bir
 * koordinat panosu üzerinde bir şeye kilitlenip onu ölçmüyor.
 *
 * ── NEDEN DURUM BURADA ───────────────────────────────────────────────────
 * `data-blut` sayfanın tamamını çeviriyor ve `BlutShell`de duruyor; kilit
 * ise yalnızca bu bölümü ilgilendiriyor. İkisini tek adaya toplamak, mod
 * düğmesine her basışta panonun da yeniden çizilmesi demekti.
 *
 * ── ÇEVİRİ ───────────────────────────────────────────────────────────────
 * Bu adaya `LocalizedText` İNMİYOR: her etiket sunucuda `pick()` ile düz
 * dizeye çevrilip prop olarak geliyor (FAZ 2 §1). Ölçü panelindeki
 * "mesafe / açı / ok sayısı" başlıkları dâhil — Dalga 1'in üçüncü dersi
 * tam olarak buydu.
 */

export interface ReticleTarget {
  key: string;
  /** Panodaki sıra işareti — çevrilmez (I, II, III…) */
  mark: string;
  /** Hedefin kanjisi — çevrilmez */
  kanji: string;
  name: string;
  distance: string;
  angle: string;
  arrows: string;
  verdict: string;
  text: string;
  /** Arşivde kendi dosyası varsa adres, yoksa `null` (sunucuda hesaplandı) */
  href: string | null;
  /** Pano yüzdesi — 14..86 aralığında tutuluyor ki 360 px'te taşmasın */
  x: number;
  y: number;
}

export interface ReticleLabels {
  boardLabel: string;
  boardHint: string;
  idleTitle: string;
  idleText: string;
  panelTitle: string;
  distanceLabel: string;
  angleLabel: string;
  arrowsLabel: string;
  verdictLabel: string;
  lockedLabel: string;
  releaseLabel: string;
  statusLocked: string;
  statusReleased: string;
  linkLabel: string;
  readingNote: string;
}

export function ReticleBoard({
  targets,
  labels,
}: {
  targets: readonly ReticleTarget[];
  labels: ReticleLabels;
}) {
  const [lockedKey, setLockedKey] = useState<string | null>(null);
  /* Ekran okuyucu duyurusu: "bırakıldı" da bir olay, boş dize değil. */
  const [announced, setAnnounced] = useState<string>("");

  const locked = targets.find((t) => t.key === lockedKey) ?? null;

  /* Reticle boştayken panonun merkezinde bekliyor — bir nişangâh kapalıyken
     de bir yere bakar. */
  const reticleX = locked ? locked.x : 50;
  const reticleY = locked ? locked.y : 50;

  const toggle = (target: ReticleTarget) => {
    if (target.key === lockedKey) {
      setLockedKey(null);
      setAnnounced(labels.statusReleased);
      return;
    }
    setLockedKey(target.key);
    setAnnounced(`${labels.statusLocked} ${target.name}`);
  };

  return (
    <div className={styles.scope}>
      <div className={styles.board} data-locked={locked ? "true" : "false"}>
        {/* Tarama çizgisi — boştayken panoyu soldan sağa geçiyor */}
        <span className={styles.boardSweep} aria-hidden />

        {/* Blueprint ekseni: iki eksen çizgisi ve üç menzil halkası */}
        <svg
          className={styles.boardGrid}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="none" vectorEffect="non-scaling-stroke">
            <path className={styles.boardAxis} d="M50 0 V100 M0 50 H100" />
          </g>
        </svg>

        <p className={styles.boardCaption} id="ury-board-label">
          {labels.boardLabel}
        </p>

        <div className={styles.field}>
          {/* NİŞANGÂH — kilitlenince hedefe taşınıyor, halkaları daralıyor */}
          <span
            className={styles.reticle}
            style={{ left: `${reticleX}%`, top: `${reticleY}%` }}
            data-locked={locked ? "true" : "false"}
            aria-hidden
          >
            <svg
              className={styles.reticleArt}
              viewBox="0 0 120 120"
              role="presentation"
              focusable="false"
            >
              <g fill="none" strokeLinecap="butt">
                <circle className={styles.reticleRingOuter} cx="60" cy="60" r="52" />
                <circle className={styles.reticleRingMid} cx="60" cy="60" r="36" />
                <circle className={styles.reticleRingInner} cx="60" cy="60" r="18" />
                <path
                  className={styles.reticleTick}
                  d="M60 0 V22 M60 98 V120 M0 60 H22 M98 60 H120"
                />
                <path className={styles.reticleDot} d="M60 57 V63 M57 60 H63" />
              </g>
            </svg>
          </span>

          <ul className={styles.targets} aria-labelledby="ury-board-label">
            {targets.map((target) => {
              const isLocked = target.key === lockedKey;
              return (
                <li
                  key={target.key}
                  className={styles.targetSeat}
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                >
                  <button
                    type="button"
                    className={styles.target}
                    data-locked={isLocked ? "true" : "false"}
                    data-dimmed={locked && !isLocked ? "true" : "false"}
                    aria-pressed={isLocked}
                    onClick={() => toggle(target)}
                  >
                    <span className={styles.targetKanji} lang="ja" aria-hidden>
                      {target.kanji}
                    </span>
                    <span className={styles.targetMark} aria-hidden>
                      {target.mark}
                    </span>
                    <span className={styles.targetName}>{target.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ── ÖLÇÜ PANELİ ─────────────────────────────────────────────────
          Dar ekranda panonun ALTINA iniyor (360 px'te yan yana durmuyor);
          kural CSS'te tek bir `grid-template-columns` eşiğiyle yazılı. */}
      <aside className={styles.panel} data-locked={locked ? "true" : "false"}>
        <p className={styles.panelTitle}>{labels.panelTitle}</p>

        {locked ? (
          /* `key` bilerek: hedef değişince okumalar YENİDEN çiziliyor ve
             `uryReadout` animasyonu baştan koşuyor. Aynı düğümü güncellemek
             sayıların "yerine oturmasını" göstermezdi. */
          <div className={styles.readout} key={locked.key}>
            <p className={styles.readoutHead}>
              <span className={styles.readoutKanji} lang="ja" aria-hidden>
                {locked.kanji}
              </span>
              <span className={styles.readoutName}>{locked.name}</span>
              <span className={styles.readoutFlag}>{labels.lockedLabel}</span>
            </p>

            <dl className={styles.readings}>
              <div className={styles.reading}>
                <dt className={styles.readingLabel}>{labels.distanceLabel}</dt>
                <dd className={styles.readingValue}>{locked.distance}</dd>
              </div>
              <div className={styles.reading}>
                <dt className={styles.readingLabel}>{labels.angleLabel}</dt>
                <dd className={styles.readingValue}>{locked.angle}</dd>
              </div>
              <div className={styles.reading}>
                <dt className={styles.readingLabel}>{labels.arrowsLabel}</dt>
                <dd className={styles.readingValue}>{locked.arrows}</dd>
              </div>
              <div className={styles.reading}>
                <dt className={styles.readingLabel}>{labels.verdictLabel}</dt>
                <dd className={styles.readingValue}>{locked.verdict}</dd>
              </div>
            </dl>

            <p className={styles.readoutText}>{locked.text}</p>

            {locked.href ? (
              <Link className={styles.readoutLink} href={locked.href}>
                {labels.linkLabel}
              </Link>
            ) : null}

            <button
              type="button"
              className={styles.release}
              onClick={() => {
                setLockedKey(null);
                setAnnounced(labels.statusReleased);
              }}
            >
              {labels.releaseLabel}
            </button>
          </div>
        ) : (
          <div className={styles.readout}>
            <p className={styles.readoutHead}>
              <span className={styles.readoutName}>{labels.idleTitle}</span>
            </p>
            <p className={styles.readoutText}>{labels.idleText}</p>
          </div>
        )}
      </aside>

      <p className={styles.boardHint}>{labels.boardHint}</p>
      <p className={styles.readingNote}>{labels.readingNote}</p>

      {/* Durum yalnızca görsel değil: her kilit ve her bırakma duyuruluyor */}
      <p className={styles.srStatus} role="status">
        {announced}
      </p>
    </div>
  );
}
