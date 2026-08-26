import type { ReactNode } from "react";
import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_MERGE,
  GOJO_POLES,
  GOJO_S04,
  GOJO_S04_SLOTS,
  GOJO_SLOT_LABELS,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { TechniqueBands } from "./TechniqueBands";
import styles from "./GojoExperience.module.css";

/**
 * P04 · CURSED TECHNIQUES — üç şerit.
 *
 * Anlatının tamamı sunucuda çiziliyor ve etkileşim adasına `ReactNode`
 * olarak geçiyor (`TechniqueBands`). Yani ada hiç inmese bile üç teknik
 * de tam okunur — brief'in reduced-motion şartı özel bir dal değil,
 * VARSAYILAN durum.
 *
 * ── ANLATI DEVRALINDI, YENİDEN YAZILMADI ─────────────────────────────────
 * 蒼 / 赫 / 茈 metinleri `GOJO_POLES` ve `GOJO_MERGE` bloklarından geliyor;
 * onlar 25 Ağustos 2026'da serinin kendi terminolojisiyle yazıldı. P04
 * onların üstüne yalnızca teknik özellik matrisini ve kabuğu ekliyor.
 *
 * ── MATRİS NEDEN PARAGRAF DEĞİL ──────────────────────────────────────────
 * BRIEF: "Gövde paragraf değil, kolonlu teknik özellik matrisi." Vektör
 * satırı italik kalın mono ve ilişkisel: çeken uç −1, iten uç +1, ikisinin
 * çarpışması hayalî üçüncü teknik. Uydurma güç istatistiği YOK — seride
 * bu tekniklerin çıktısı sayıyla verilmiyor.
 */
export function TechniquesSection({
  locale,
  isAdmin,
  images,
}: {
  locale: string;
  isAdmin: boolean;
  images: Map<string, string>;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  const matrixRow = (label: string, value: ReactNode) => (
    <>
      <dt className={styles.bandMatrixLabel}>{label}</dt>
      <dd className={styles.bandMatrixValue}>{value}</dd>
    </>
  );

  const bandInner = (
    key: "blue" | "red" | "purple",
    kanji: string,
    name: string,
    reading: string,
    caption: string,
    text: string,
    slotKey: string,
    slotAspect: string,
  ) => {
    const cells = GOJO_S04.matrix[key];
    const L = GOJO_S04.matrixLabels;
    return (
      <div className={styles.bandInner}>
        <div>
          <p className={styles.bandKanji} lang="ja">
            {kanji}
          </p>
          <h3 className={styles.bandTitle}>{say(GOJO_S04.displays[key])}</h3>
          <p className={styles.bandName}>
            {name} · {reading} · {caption}
          </p>
          <p className={styles.bandText}>{text}</p>

          <dl className={styles.bandMatrix}>
            {matrixRow(
              say(L.vector),
              <span className={styles.bandVector}>{cells.vector}</span>,
            )}
            {matrixRow(say(L.output), say(cells.output))}
            {matrixRow(say(L.range), say(cells.range))}
            {matrixRow(
              say(L.base),
              <span lang="ja">{cells.base}</span>,
            )}
          </dl>
        </div>

        <div className={styles.bandSlot}>
          <CuratedImage
            slotId={slotKey}
            spec={say(GOJO_SLOT_LABELS[slotKey] ?? GOJO_S04_SLOTS.handseal.spec)}
            aspect={slotAspect}
            src={images.get(slotKey) ?? null}
            isAdmin={isAdmin}
            characterId={GOJO_ID}
            curatorLabel={say(GOJO_CURATOR.upload)}
            statusLabel={say(GOJO_CURATOR.missing)}
            glyph={kanji}
            sizes="360px"
          />
        </div>
      </div>
    );
  };

  const blue = GOJO_POLES[0];
  const red = GOJO_POLES[1];

  return (
    <div className={styles.techniques}>
      <div className={styles.techniquesInner}>
        <h2 className={styles.techniquesTitle} id="gojo-techniques-title">
          {say(GOJO_S04.title)}
        </h2>

        <TechniqueBands
          blue={bandInner(
            "blue",
            blue.kanji,
            blue.name,
            blue.reading,
            say(blue.sign),
            say(blue.text),
            blue.imageKey,
            "16 / 9",
          )}
          red={bandInner(
            "red",
            red.kanji,
            red.name,
            red.reading,
            say(red.sign),
            say(red.text),
            red.imageKey,
            "16 / 9",
          )}
          purple={bandInner(
            "purple",
            GOJO_MERGE.kanji,
            GOJO_MERGE.name,
            GOJO_MERGE.reading,
            say(GOJO_MERGE.turkish),
            say(GOJO_MERGE.text),
            GOJO_MERGE.imageKey,
            "16 / 9",
          )}
          labels={{
            charge: say(GOJO_S04.ui.chargeLabel),
            chargeHint: say(GOJO_S04.ui.chargeHint),
            dragHint: say(GOJO_S04.ui.dragHint),
            keyHint: say(GOJO_S04.ui.keyHint),
            fired: say(GOJO_S04.ui.fired),
            reset: say(GOJO_S04.ui.reset),
            spherePull: say(GOJO_S04.ui.spherePull),
            spherePush: say(GOJO_S04.ui.spherePush),
          }}
        />

        {/* Brief'in ayrıca istediği iki makro kadraj — şeritlerin altında,
            anlatıya bağlı değil, atmosfer. */}
        <div className={styles.techniquesPlates}>
          {[GOJO_S04_SLOTS.handseal, GOJO_S04_SLOTS.silhouette].map((slot) => (
            <CuratedImage
              key={slot.key}
              slotId={slot.key}
              spec={say(slot.spec)}
              aspect={slot.aspect}
              src={images.get(slot.key) ?? null}
              alt={say(slot.alt)}
              isAdmin={isAdmin}
              characterId={GOJO_ID}
              curatorLabel={say(GOJO_CURATOR.upload)}
              statusLabel={say(GOJO_CURATOR.missing)}
              glyph="茈"
              sizes="480px"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
