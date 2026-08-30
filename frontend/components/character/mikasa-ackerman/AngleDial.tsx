"use client";

import Image from "next/image";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HookDiagram } from "./ScarfGlyphs";
import { useScarf } from "./ScarfShell";
import styles from "./ScarfExperience.module.css";

/**
 * "Kanca açısı" — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Üç kademeli bir açı seçici (0° / 22° / 45°). Seçim yalnızca bu bölümü
 * değil SAYFANIN TAMAMINI değiştiriyor: kökteki `--mks-angle` ile bütün ODM
 * kabloları dönüyor, `--mks-shift` ile de kartların dizilim eğimi kayıyor.
 * Tek kontrol, sayfa geneli geometri.
 *
 * ⚠️ Kushina'nın "gerilen ve kopan zincir halkaları" mekaniğiyle
 * karıştırılmasın: buradaki çizgi hiç kopmuyor, hiç kısalmıyor, hiç
 * çoğalmıyor. Değişen tek şey bir AÇI. Madara'nın ölçek değiştiren
 * basamaklarından farkı da bu: burada hiçbir şey büyümüyor.
 *
 * ── NEDEN ÜÇ PANEL DE ÇİZİLİYOR ──────────────────────────────────────────
 * Seçim yalnızca hangisinin ÖNDE olduğunu değiştiriyor; üçünün metni de
 * DOM'da duruyor. Böylece klavye ve ekran okuyucu için içerik gizlenmiyor,
 * küratör yuvaları da mod ne olursa olsun erişilebilir kalıyor.
 *
 * Metinlerin hepsi düz dize olarak iniyor (sözleşme: `pick` sunucuda).
 */

export interface DialAngle {
  key: string;
  deg: number;
  name: string;
  readout: string;
  geometry: string;
  scene: string;
  note: string;
  imageKey: string;
  slotLabel: string;
  slotSize: { w: number; h: number };
  image: string | null;
  imageAlt: string;
}

export function AngleDial({
  angles,
  characterId,
  isAdmin,
  groupLabel,
  anchorLabel,
  anchorValue,
  slopeLabel,
  activeLabel,
  keyboardHint,
  diagramAlt,
}: {
  angles: DialAngle[];
  characterId: number;
  isAdmin: boolean;
  groupLabel: string;
  anchorLabel: string;
  anchorValue: string;
  slopeLabel: string;
  activeLabel: string;
  keyboardHint: string;
  diagramAlt: string;
}) {
  const { angleIndex, selectAngle } = useScarf();
  const active = angles[angleIndex] ?? angles[0];

  return (
    <div className={styles.dial}>
      <div className={styles.dialLayout}>
        <div className={styles.dialArt}>
          <HookDiagram
            active={active?.deg ?? 0}
            degrees={angles.map((angle) => angle.deg)}
            title={diagramAlt}
            className={styles.dialDiagram}
            railClassName={styles.dialRail}
            rayClassName={styles.dialRay}
            activeRayClassName={styles.dialRayActive}
            nodeClassName={styles.dialNode}
            targetClassName={styles.dialTarget}
            arcClassName={styles.dialArc}
          />
        </div>

        <div className={styles.dialControls}>
          <div className={styles.dialGroup} role="group" aria-label={groupLabel}>
            {angles.map((angle, index) => (
              <button
                key={angle.key}
                type="button"
                className={styles.dialButton}
                aria-pressed={index === angleIndex}
                onClick={() => selectAngle(index)}
              >
                <span className={styles.dialDeg}>{angle.deg}°</span>
                <span className={styles.dialName}>{angle.name}</span>
              </button>
            ))}
          </div>

          <dl className={styles.dialMeta}>
            <div className={styles.dialMetaRow}>
              <dt className={styles.dialMetaLabel}>{anchorLabel}</dt>
              <dd className={styles.dialMetaValue}>{anchorValue}</dd>
            </div>
            <div className={styles.dialMetaRow}>
              <dt className={styles.dialMetaLabel}>{activeLabel}</dt>
              <dd className={styles.dialMetaValue}>{active?.name ?? ""}</dd>
            </div>
            <div className={styles.dialMetaRow}>
              <dt className={styles.dialMetaLabel}>{slopeLabel}</dt>
              <dd className={styles.dialMetaValue}>{active?.readout ?? ""}</dd>
            </div>
          </dl>

          <p className={styles.dialHint}>{keyboardHint}</p>
        </div>
      </div>

      <ol className={styles.dialPanels}>
        {angles.map((angle, index) => (
          <li
            key={angle.key}
            className={styles.dialPanel}
            data-active={index === angleIndex ? "true" : "false"}
            style={{ ["--i" as string]: index }}
          >
            <p className={styles.dialPanelHead}>
              <span className={styles.dialPanelDeg}>{angle.deg}°</span>
              <span className={styles.dialPanelName}>{angle.name}</span>
            </p>
            <p className={styles.dialGeometry}>{angle.geometry}</p>
            <p className={styles.dialScene}>{angle.scene}</p>
            <p className={styles.dialNote}>{angle.note}</p>

            <span
              className={styles.frame}
              data-filled={angle.image ? "true" : "false"}
              data-shape="scene"
            >
              {angle.image ? (
                <Image
                  src={angle.image}
                  alt={angle.imageAlt}
                  fill
                  sizes="(max-width: 900px) 92vw, 420px"
                />
              ) : (
                <span className={styles.frameLabel} aria-hidden>
                  {angle.deg}°
                </span>
              )}
            </span>

            {isAdmin ? (
              <CuratorSlot
                characterId={characterId}
                slot="ABILITY"
                abilityName={angle.imageKey}
                label={angle.slotLabel}
                size={angle.slotSize}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
