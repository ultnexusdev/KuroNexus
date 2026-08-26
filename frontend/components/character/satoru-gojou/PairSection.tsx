import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_S07,
  GOJO_S07_SLOT,
  GOJO_S11,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { EggObject } from "./EggObject";
import { PairEffects } from "./PairEffects";
import styles from "./GojoExperience.module.css";

/**
 * P07 · GOJŌ × GETŌ — split-screen, ortada çatlak.
 *
 * Sol taraf (Gojō) devasa negatif alanla nefes alıyor; sağ taraf (Getō)
 * dar, sıkışık, kalabalık. Ayrım düz çizgi değil KIRIK bir poligon.
 *
 * ── ÇARPIŞAN TİPOGRAFİNİN DOM KARŞILIĞI ──────────────────────────────────
 * İki dev isim çatlağa doğru büyüyüp kenarında maskeyle kesiliyor.
 * Kesilen şey yalnızca boyama: `SATORU` ve `SUGURU` DOM'da bütün duruyor.
 * Ayrıca bölümün tamamının düz anlatımı `sr-only` olarak başta veriliyor
 * (BRIEF · erişilebilirlik şartı).
 *
 * ── İKİ SÜTUN BİRBİRİNE CEVAP VERİYOR ────────────────────────────────────
 * DOM sırası sol-1, sol-2, sağ-1, sağ-2 DEĞİL; sol ve sağ panellerin
 * içeriği ayrı ayrı okunuyor. Bu bilinçli: metinler karşılıklı iki
 * pozisyon, diyalog değil. Ekran okuyucu önce Gojō'nun cevabını, sonra
 * Getō'nunkini bütün olarak duyuyor.
 *
 * ── AYRILMA ADASI ────────────────────────────────────────────────────────
 * `SplitDrift` yalnızca `--split` yazıyor ve `ssr: false`. CSS varsayılanı
 * 1, yani ada hiç inmezse bölüm ayrılmış ve kırılmış hâlde duruyor —
 * anlatının sonucu her koşulda görünür.
 */

export function PairSection({
  locale,
  isAdmin,
  src,
}: {
  locale: string;
  isAdmin: boolean;
  src: string | null;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  return (
    <div className={styles.pair} data-gojo-pair>
      <div className={styles.pairInner}>
        <h2 className={styles.pairTitle} id="gojo-pair-title">
          {say(GOJO_S07.title)}
        </h2>

        {/* Bölümün tamamının düz karşılığı — çatlak, ayrılma ve kapanış
            satırı dâhil. */}
        <p className={styles.srOnly}>{say(GOJO_S07.srSummary)}</p>

        <div className={styles.pairSplit}>
          <div className={`${styles.pairPanel} ${styles.pairLeft}`}>
            <p className={styles.pairName}>{say(GOJO_S07.leftName)}</p>
            {GOJO_S07.left.map((para) => (
              <p className={styles.pairPara} key={para.en.slice(0, 28)}>
                {say(para)}
              </p>
            ))}
          </div>

          {/* Çatlak — kırık poligon, düz çizgi değil. */}
          <svg
            className={styles.pairRift}
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className={styles.pairRiftLine}
              d="M5 0 L3 9 L7 19 L4 27 L6 38 L2 47 L8 56 L4 65 L6 74 L3 83 L7 92 L5 100"
            />
          </svg>

          <div className={`${styles.pairPanel} ${styles.pairRight}`}>
            <p className={styles.pairName}>{say(GOJO_S07.rightName)}</p>
            {GOJO_S07.right.map((para) => (
              <p className={styles.pairPara} key={para.en.slice(0, 28)}>
                {say(para)}
              </p>
            ))}
          </div>
        </div>

        <p className={styles.pairEmotional}>{say(GOJO_S07.emotional)}</p>
        <p className={styles.pairFinale}>{say(GOJO_S07.finale)}</p>

        <div className={styles.pairPlate}>
          <CuratedImage
            slotId={GOJO_S07_SLOT.key}
            spec={say(GOJO_S07_SLOT.spec)}
            aspect={GOJO_S07_SLOT.aspect}
            src={src}
            alt={say(GOJO_S07_SLOT.alt)}
            isAdmin={isAdmin}
            characterId={GOJO_ID}
            curatorLabel={say(GOJO_CURATOR.upload)}
            statusLabel={say(GOJO_CURATOR.missing)}
            glyph="友"
            sizes="900px"
          />
        </div>
      </div>

      {/* P11 · mikro obje — sayfaya serpiştirilmiş üç keşiften biri.
          Bölümün akışını bozmuyor: mutlak konumlu ve kenarda. */}
      <EggObject
        eggKey="polaroid"
        mark="▧"
        label={say(GOJO_S11.hiddenObject)}
        side="left"
      />

      <PairEffects />
    </div>
  );
}
