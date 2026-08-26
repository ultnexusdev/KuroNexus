import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_S10,
  GOJO_S10_SLOT,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { TouchEffects } from "./TouchEffects";
import styles from "./GojoExperience.module.css";

/**
 * P10 · CAN YOU TOUCH GOJŌ? — görünmez bariyerin sınırı.
 *
 * Ekranın neredeyse tamamı saf negatif alan; hiçbir harf düz yatay
 * kalmıyor. Başlık harf harf döndürülüyor — silindire sarılmış gibi.
 *
 * ── BÜKÜLMÜŞ BAŞLIĞIN DOM KARŞILIĞI ──────────────────────────────────────
 * Görsel katman `aria-hidden` ve harflere bölünmüş; ekran okuyucunun
 * okuduğu başlık `sr-only` bir bütün cümle. Harf harf bölünmüş bir metni
 * doğrudan okutmak bazı ekran okuyucularda harf harf hecelenmeye yol
 * açıyor — bu yüzden ikisi ayrı.
 *
 * ── GEMINI'NİN "GÖVDE METNİ YOK" YÖNÜ DÜZELTİLDİ ─────────────────────────
 * BRIEF'in kendi düzeltmesi: bu bölümün düz metin karşılığı olmak zorunda
 * (SEO + i18n). `prose` her zaman DOM'da, normalde `sr-only`; hareket
 * azaltılmışsa GÖRÜNÜR oluyor — o modda etkileşim hiç çalışmadığı için
 * bölümün söylediği şey okunabilir kalmalı.
 */

/** Harf açıları — silindir sarımı. Sabit dizi, rastgele değil. */
function glyphAngle(index: number, total: number): { a: number; d: number } {
  /* -1 → +1 arası konum; uçlarda daha çok dönüyor, ortada düz. */
  const t = total > 1 ? (index / (total - 1)) * 2 - 1 : 0;
  return {
    a: Number((t * 14).toFixed(2)),
    d: Number((Math.abs(t) * 6).toFixed(2)),
  };
}

export function TouchSection({
  locale,
  isAdmin,
  src,
}: {
  locale: string;
  isAdmin: boolean;
  src: string | null;
}) {
  const say = (text: LocalizedText) => pick(text, locale);
  const title = say(GOJO_S10.title);
  const letters = [...title];

  return (
    <div className={styles.touch}>
      <div className={styles.touchInner}>
        <h2 id="gojo-touch-title">
          <span className={styles.srOnly}>{title}</span>
          <span className={styles.touchTitle} aria-hidden="true">
            {letters.map((letter, index) => {
              const { a, d } = glyphAngle(index, letters.length);
              return (
                <span
                  key={`${letter}-${index}`}
                  className={styles.touchGlyph}
                  style={{ "--a": a, "--d": d } as React.CSSProperties}
                >
                  {letter === " " ? " " : letter}
                </span>
              );
            })}
          </span>
        </h2>

        {/* Etkileşim kutusu — dinleyiciler YALNIZCA burada. */}
        <div className={styles.touchField} data-gojo-touch>
          <span className={styles.touchBarrier} aria-hidden="true" />
          <span className={styles.touchRing} aria-hidden="true" />

          <div className={styles.touchPlate}>
            <CuratedImage
              slotId={GOJO_S10_SLOT.key}
              spec={say(GOJO_S10_SLOT.spec)}
              aspect={GOJO_S10_SLOT.aspect}
              src={src}
              alt={say(GOJO_S10_SLOT.alt)}
              isAdmin={isAdmin}
              characterId={GOJO_ID}
              curatorLabel={say(GOJO_CURATOR.upload)}
              statusLabel={say(GOJO_CURATOR.missing)}
              glyph="触"
              sizes="544px"
            />
          </div>
        </div>

        <TouchEffects
          distanceLabel={say(GOJO_S10.distanceLabel)}
          attemptsLabel={say(GOJO_S10.attemptsLabel)}
          stoppedLabel={say(GOJO_S10.stopped)}
          hintPointer={say(GOJO_S10.hintPointer)}
          hintTouch={say(GOJO_S10.hintTouch)}
          triggerLabel={say(GOJO_S10.trigger)}
        />

        {/* Bölümün İÇERİĞİ — bir erişilebilirlik eki değil.
            Normalde `sr-only`, hareket kapalıyken görünür. */}
        <p className={`${styles.touchProse} ${styles.srOnly}`}>
          {say(GOJO_S10.prose)}
        </p>
      </div>
    </div>
  );
}
