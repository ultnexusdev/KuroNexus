"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ThrustPair } from "./BakugouGlyphs";
import { useRecoil } from "./DetonationShell";
import styles from "./DetonationExperience.module.css";

/**
 * SAYFANIN KALBİ — geri tepme.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Beş Ultimate Move. Birine basıldığında KART etki yönünde fırlıyor, sayfanın
 * GÖVDESİ aynı vektörün tersine kayıyor (kaydırmayı kabuk yönetiyor,
 * `DetonationShell`). Beş teknik, beş farklı yön; kural her seferinde aynı.
 *
 * Ölçüler bilerek eşit değil:
 *   kart  → birim vektör × 30px  (mermi)
 *   gövde → birim vektör × −9px  (atan)
 * Yani ateşleyen de savruluyor ama daha az. Kartın GÖRÜNEN yer değiştirmesi
 * ikisinin farkı: 30 − 9 = 21px, hep etki yönünde.
 *
 * ⚠️ Bu bir ilerleme rayı ya da kademe seçici DEĞİL: sıra yok, birikim yok,
 * "hepsini tamamla" hâli yok. Aynı düğmeye ikinci kez basmak sayfayı yerine
 * bırakıyor. Ölçülen tek şey YÖN.
 *
 * ── HAREKET KAPISI ───────────────────────────────────────────────────────
 * Yer değiştirmenin tamamı `prefers-reduced-motion: no-preference` kapısında
 * (CSS tarafında). Kapalıyken sayfa kımıldamıyor ama okuma DEĞİŞMİYOR: etki
 * ve tepki yönleri yazıyla da basılıyor, yani mekanik hareketsiz de anlaşılır.
 *
 * Metinler dışarıdan düz dize olarak iniyor (SÖZLEŞME §1: istemci adasına
 * `LocalizedText` inmez).
 */

export interface DeckMove {
  key: string;
  /** Katakana / kanji ad — çevrilmiyor */
  name: string;
  latin: string;
  turkish: string;
  kick: { x: number; y: number };
  actionDir: string;
  reactionDir: string;
  action: string;
  reaction: string;
  cost: string;
}

/** Kartın fırladığı mesafe (px). Gövdenin kaydığı mesafenin üç katı. */
const KICK = 30;

export function RecoilDeck({
  moves,
  stage,
  stageAlt,
  slot,
  listLabel,
  fireHint,
  keyboardHint,
  release,
  actionLabel,
  reactionLabel,
  costLabel,
  idleTitle,
  idleText,
  statusFired,
  statusReleased,
  closingNote,
}: {
  moves: DeckMove[];
  /** Zemin karesinin adresi; yoksa kadraj boş ama ayakta kalıyor */
  stage: string | null;
  stageAlt: string;
  /** Küratör yuvası — yalnızca yöneticide dolu gelir, ziyaretçide null */
  slot: ReactNode;
  listLabel: string;
  fireHint: string;
  keyboardHint: string;
  release: string;
  actionLabel: string;
  reactionLabel: string;
  costLabel: string;
  idleTitle: string;
  idleText: string;
  statusFired: string;
  statusReleased: string;
  closingNote: string;
}) {
  const recoil = useRecoil();
  const activeKey = recoil?.activeKey ?? null;
  const pulse = recoil?.pulse ?? 0;
  const active = moves.find((move) => move.key === activeKey) ?? null;

  return (
    <div className={styles.deck}>
      {/* ── ZEMİN ── */}
      <div className={styles.stage} data-filled={stage ? "true" : "false"}>
        {stage ? (
          <Image
            className={styles.stageArt}
            src={stage}
            alt={stageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 1180px"
          />
        ) : null}
        {/* Perde: yüklenen görselin ÜSTÜNE hem ızgara hem halka biniyor ve
            kabın kenarında metin duruyor. Kontrast betiği görsel bölgelerini
            ölçemiyor — perde bu yüzden zorunlu, opsiyonel değil. */}
        <span className={styles.stageScrim} aria-hidden />
        <span className={styles.stageGrid} aria-hidden />
        {active ? (
          <span
            /* `pulse` ile yeniden monte oluyor: şok dalgası her ateşlemede
               baştan koşsun diye. Sınıfı yeniden atamak yetmiyor. */
            key={`shock-${pulse}`}
            className={styles.shock}
            aria-hidden
          />
        ) : null}
      </div>
      {slot}

      {/* ── BEŞ TEKNİK ── */}
      <h3 className={styles.deckHead}>{listLabel}</h3>
      <ul className={styles.moves}>
        {moves.map((move) => {
          const fired = move.key === activeKey;
          return (
            <li key={move.key} className={styles.moveCell}>
              <button
                type="button"
                className={styles.move}
                data-fired={fired ? "true" : "false"}
                aria-pressed={fired}
                onClick={() => recoil?.fire(move.key, move.kick.x, move.kick.y)}
                style={
                  {
                    "--bkg-kick-x": `${(move.kick.x * KICK).toFixed(1)}px`,
                    "--bkg-kick-y": `${(move.kick.y * KICK).toFixed(1)}px`,
                  } as CSSProperties
                }
              >
                <span className={styles.moveName} lang="ja">
                  {move.name}
                </span>
                <span className={styles.moveLatin}>{move.latin}</span>
                <span className={styles.moveTurkish}>{move.turkish}</span>
                <span className={styles.moveVector} aria-hidden>
                  {move.actionDir}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={styles.deckHint}>{fireHint}</p>

      {/* ── OKUMA ── */}
      <div className={styles.readout} data-live={active ? "true" : "false"}>
        {active ? (
          <>
            <p className={styles.readoutName} lang="ja">
              {active.name}
            </p>
            <p className={styles.readoutLatin}>
              {active.latin} · {active.turkish}
            </p>

            <ThrustPair
              className={styles.thrust}
              actionClassName={styles.thrustAction}
              reactionClassName={styles.thrustReaction}
              axisClassName={styles.thrustAxis}
            />

            <dl className={styles.vectors}>
              <div className={styles.vector} data-side="action">
                <dt>{actionLabel}</dt>
                <dd>
                  <span className={styles.vectorDir}>{active.actionDir}</span>
                  <span className={styles.vectorText}>{active.action}</span>
                </dd>
              </div>
              <div className={styles.vector} data-side="reaction">
                <dt>{reactionLabel}</dt>
                <dd>
                  <span className={styles.vectorDir}>{active.reactionDir}</span>
                  <span className={styles.vectorText}>{active.reaction}</span>
                </dd>
              </div>
            </dl>

            <p className={styles.cost}>
              <span className={styles.costLabel}>{costLabel}</span>
              <span className={styles.costText}>{active.cost}</span>
            </p>
          </>
        ) : (
          <>
            <p className={styles.readoutName}>{idleTitle}</p>
            <p className={styles.readoutIdle}>{idleText}</p>
          </>
        )}
      </div>

      <div className={styles.deckFoot}>
        <button
          type="button"
          className={styles.deckRelease}
          onClick={() => recoil?.release()}
          disabled={!active}
        >
          {release}
        </button>
        <p className={styles.deckKeys}>{keyboardHint}</p>
      </div>

      {/* Hiç ateşlenmemişken boş: "bırakıldı" yalnızca gerçekten bir şey
          bırakıldıysa doğru bir cümle. */}
      <p className={styles.deckStatus} role="status">
        {active
          ? `${active.latin} — ${statusFired}`
          : pulse > 0
            ? statusReleased
            : ""}
      </p>

      <p className={styles.deckClosing}>{closingNote}</p>
    </div>
  );
}
