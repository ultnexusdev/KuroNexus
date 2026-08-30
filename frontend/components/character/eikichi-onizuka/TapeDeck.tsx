"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CassetteMark } from "./OnizukaGlyphs";
import styles from "./TrackingExperience.module.css";

/**
 * KASET — sayfanın kalbi.
 *
 * ── MEKANİK: İKİ EKSENLİ BİR KASET ───────────────────────────────────────
 * Bu bölüm bir "seçilen kart açılır" listesi DEĞİL. İki bağımsız kolu var
 * ve ikincisi olmadan birincisi eksik kalıyor:
 *
 *   1. KONUM — kasette beş kayıt (00:04 … 01:02). Konum değiştiğinde
 *      ekranın üstünden sert bir tracking gürültüsü geçiyor (yumuşak
 *      geçiş yok; `steps()` ile kesme).
 *   2. TRACKING — kaset YIPRANMIŞ. Her konum kendi izleme ayarını
 *      hatırlıyor ve ayar bozukken kaydın altındaki satırlar HİÇ
 *      ÇİZİLMİYOR; yerlerinde bir gürültü bandı duruyor.
 *        0 → yalnızca "görüntü" satırı okunuyor
 *        1 → "kayıt" satırı açılıyor
 *        2 → "iz" satırı da açılıyor, band kalkıyor
 *
 * Yani ziyaretçi bir şeyi seçmiyor, bir şeyi DÜZELTİYOR — ve düzeltmeyi
 * her konum için ayrı ayrı yapıyor. Beş konum × üç kademe, hepsi
 * hatırlanıyor.
 *
 * ⚠️ ERİŞİLEBİLİRLİK KARARI: kilitli satır bulanıklaştırılmıyor, hiç
 * çizilmiyor. Bulanık metin DOM'da kalsaydı ekran okuyucu onu okur,
 * gören kullanıcı okuyamazdı — mekanik yalnızca görenler için var olurdu.
 * Bandın kendisi `aria-hidden`; kilidin ne olduğunu `.bandNote` yazıyor.
 *
 * ⚠️ Iruka'nın sayfası "kara tahta + tebeşirle yazılan beş ders"
 * mekaniğini kullanıyor (SÖZLEŞME §2). Burada kara tahta yok; kaset var,
 * ve asıl iş metni açmak değil GÖRÜNTÜYÜ DÜZELTMEK.
 *
 * Metinler sunucuda `pick` ile seçilip buraya düz dize olarak iniyor.
 */

export interface TapeDeckSegment {
  key: string;
  counter: string;
  name: string;
  romaji: string;
  role: string;
  picture: string;
  record: string;
  afterword: string;
  image: string | null;
  slotKey: string;
  slotLabel: string;
  slotWidth: number;
  slotHeight: number;
}

export interface TapeDeckUi {
  groupLabel: string;
  positionsLabel: string;
  prev: string;
  next: string;
  counterLabel: string;
  recLabel: string;
  trackingLabel: string;
  trackingUp: string;
  trackingDown: string;
  trackingStates: readonly string[];
  recordLabel: string;
  afterLabel: string;
  pictureLabel: string;
  lockedNote: string;
  halfNote: string;
  cleanNote: string;
  hint: string;
  frameEmpty: string;
}

const MAX_TRACK = 2;

export function TapeDeck({
  characterId,
  isAdmin,
  segments,
  ui,
}: {
  characterId: number;
  isAdmin: boolean;
  segments: TapeDeckSegment[];
  ui: TapeDeckUi;
}) {
  const [index, setIndex] = useState(0);
  /** Her konumun KENDİ izleme ayarı — konum değişince sıfırlanmıyor. */
  const [levels, setLevels] = useState<number[]>(() => segments.map(() => 0));
  const [sweep, setSweep] = useState(false);

  /* Konum değiştiğinde kısa bir gürültü geçişi. Süre CSS'teki
     `onzSweep` ile aynı (320ms + küçük pay); `prefers-reduced-motion`
     kapısı CSS tarafında, burada yalnızca nitelik var. */
  useEffect(() => {
    setSweep(true);
    const timer = window.setTimeout(() => setSweep(false), 360);
    return () => window.clearTimeout(timer);
  }, [index]);

  const active = segments[index];
  const level = levels[index] ?? 0;

  if (!active) return null;

  const setLevel = (next: number) => {
    setLevels((current) =>
      current.map((value, i) =>
        i === index ? Math.min(MAX_TRACK, Math.max(0, next)) : value,
      ),
    );
  };

  const stateText = ui.trackingStates[level];
  const note =
    level === 0 ? ui.lockedNote : level === 1 ? ui.halfNote : ui.cleanNote;

  return (
    <div className={styles.deck} role="group" aria-label={ui.groupLabel}>
      <div className={styles.deckTop}>
        <CassetteMark
          className={styles.deckBadge}
          reelClassName={styles.deckReel}
        />
        <span className={styles.transportLabel}>{ui.positionsLabel}</span>
        <div className={styles.transport}>
          <button
            type="button"
            className={styles.transportBtn}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
          >
            {ui.prev}
          </button>
          <button
            type="button"
            className={styles.transportBtn}
            onClick={() =>
              setIndex((value) => Math.min(segments.length - 1, value + 1))
            }
            disabled={index === segments.length - 1}
          >
            {ui.next}
          </button>
        </div>
      </div>

      {/* Beş konum — hepsi gerçek düğme, hepsi klavyeyle geziliyor */}
      <div className={styles.positionsWrap}>
        <ul className={styles.positions}>
          {segments.map((segment, i) => (
            <li key={segment.key}>
              <button
                type="button"
                className={styles.pos}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <span className={styles.posCounter}>{segment.counter}</span>
                <span className={styles.posName}>{segment.name}</span>
                <span className={styles.posTrk}>
                  {ui.trackingLabel} {levels[i] ?? 0}/{MAX_TRACK}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Ekran */}
      <div className={styles.screen} data-sweep={sweep ? "true" : "false"}>
        {active.image ? (
          <span className={styles.screenArt} aria-hidden>
            <Image src={active.image} alt="" fill sizes="(max-width: 60rem) 100vw, 1024px" />
          </span>
        ) : (
          <span className={styles.screenEmpty} aria-hidden>
            {ui.frameEmpty}
          </span>
        )}

        <p className={styles.osd}>
          <span className={styles.osdRec}>
            <span className={styles.osdDot} aria-hidden />
            {ui.recLabel}
          </span>
          <span className={styles.osdCounter}>
            {ui.counterLabel} {active.counter}
          </span>
          <span className={styles.osdState}>
            {ui.trackingLabel} {level}/{MAX_TRACK}
          </span>
        </p>

        <div className={styles.segHead}>
          <h3 className={styles.segName} lang="ja">
            {active.name}
            <span className={styles.segRomaji} lang="en">
              {active.romaji}
            </span>
          </h3>
          <p className={styles.segRole}>{active.role}</p>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>{ui.pictureLabel}</span>
          <p className={styles.fieldText}>{active.picture}</p>
        </div>

        {level >= 1 ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{ui.recordLabel}</span>
            <p className={styles.fieldText}>{active.record}</p>
          </div>
        ) : null}

        {level >= 2 ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{ui.afterLabel}</span>
            <p className={styles.fieldTextMuted}>{active.afterword}</p>
          </div>
        ) : null}

        {level < MAX_TRACK ? (
          <div className={styles.band}>
            {/* Bandın altındaki satır hiç çizilmiyor; bu not neyin
                kilitli olduğunu YAZIYLA söylüyor. */}
            <p className={styles.bandNote}>{note}</p>
          </div>
        ) : null}
      </div>

      {/* Görselin HEMEN ALTINDA yuva (kullanıcı şartı): aktif konumun
          karesi hangisiyse onun yuvası. */}
      {isAdmin ? (
        <div className={styles.deckSlot}>
          <CuratorSlot
            characterId={characterId}
            slot="ABILITY"
            abilityName={active.slotKey}
            label={active.slotLabel}
            size={{ w: active.slotWidth, h: active.slotHeight }}
          />
        </div>
      ) : null}

      {/* TRACKING kolu */}
      <div className={styles.trk}>
        <span className={styles.trkLabel}>{ui.trackingLabel}</span>
        <button
          type="button"
          className={styles.trkBtn}
          onClick={() => setLevel(level - 1)}
          disabled={level === 0}
          aria-label={ui.trackingDown}
        >
          −
        </button>
        <span className={styles.trkMeter} aria-hidden>
          {Array.from({ length: MAX_TRACK }, (_, i) => (
            <span
              key={i}
              className={`${styles.trkCell} ${i < level ? styles.trkCellOn : ""}`}
            />
          ))}
        </span>
        <button
          type="button"
          className={styles.trkBtn}
          onClick={() => setLevel(level + 1)}
          disabled={level === MAX_TRACK}
          aria-label={ui.trackingUp}
        >
          +
        </button>
        <p className={styles.trkState}>{stateText}</p>
      </div>

      <p className={styles.deckStatus} role="status">
        {active.counter} · {active.romaji} · {stateText}
      </p>
      <p className={styles.deckHint}>{ui.hint}</p>
    </div>
  );
}
