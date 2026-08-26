import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_S11,
  GOJO_ID,
  GOJO_S06,
  GOJO_S06_SLOTS,
  GOJO_SLOT_LABELS,
  GOJO_TIMELINE,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { EggObject } from "./EggObject";
import styles from "./GojoExperience.module.css";

/**
 * P06 · THE MAKING OF THE STRONGEST — zaman çizelgesi.
 *
 * ── DURAKLAR DEVRALINDI ──────────────────────────────────────────────────
 * Beş durağın tamamı `GOJO_TIMELINE`den geliyor: yaş etiketleri, kaynaklı
 * replik (天上天下唯我独尊) ve akraba bağlantılarıyla birlikte. P06 onların
 * üstüne yalnızca görsel muameleyi ekliyor.
 *
 * ── PALET TEK SAYIYLA KAYIYOR ────────────────────────────────────────────
 * Her durak `--heat` taşıyor (0 → 1). Soğuk gümüşten Shibuya'nın kızılına
 * geçiş bu tek değişkenle oluyor; CSS `color-mix` ile karıştırıyor, yeni
 * renk tanımlanmıyor. Eğim (`--tilt`) de deterministik — üst üste binen
 * yırtık kağıtlar hissi rastgelelikten değil, sabit bir diziden geliyor
 * (rastgelelik sunucu/istemci uyuşmazlığı üretirdi).
 *
 * ── SAYFANIN TEK SERİFİ ──────────────────────────────────────────────────
 * Instrument Serif yalnızca bu bölümde, P07'de ve P11'de kullanılıyor
 * (BRIEF · tipografi). Nostaljinin taşıyıcısı.
 */

/** Durakların ısı katsayıları — soğuk gümüşten kızıla. */
const HEAT: Record<string, number> = {
  born: 0,
  riko: 0.25,
  geto: 0.5,
  teacher: 0.35,
  seal: 1,
};

/** Kadrajların eğimi (derece) — sabit, rastgele değil. */
const TILT: Record<string, number> = {
  born: -1.2,
  riko: 0.9,
  geto: -0.7,
  teacher: 1.4,
  seal: -1.6,
};

export function MakingSection({
  locale,
  isAdmin,
  images,
}: {
  locale: string;
  isAdmin: boolean;
  images: Map<string, string>;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  return (
    <div className={styles.making}>
      <div className={styles.makingInner}>
        <h2 className={styles.makingTitle} id="gojo-making-title">
          {say(GOJO_S06.title)}
        </h2>
        <p className={styles.makingLede}>{say(GOJO_S06.lede)}</p>

        <ol className={styles.stops}>
          {GOJO_TIMELINE.map((stop) => (
            <li
              key={stop.key}
              className={styles.stop}
              style={
                {
                  "--heat": HEAT[stop.key] ?? 0,
                  "--tilt": TILT[stop.key] ?? 0,
                } as React.CSSProperties
              }
            >
              {/* Dev yıl damgası — dekoratif, künye yaşının yerine
                  geçmiyor; onun arkasında duruyor. */}
              <p className={styles.stopStamp} aria-hidden="true">
                {GOJO_S06.stamps[stop.key] ?? ""}
              </p>

              <div className={styles.stopBody}>
                <p className={styles.stopAge}>{say(stop.age)}</p>
                <h3 className={styles.stopTitle}>{say(stop.title)}</h3>
                <p className={styles.stopText}>{say(stop.text)}</p>

                {stop.quote ? (
                  <blockquote className={styles.stopQuote}>
                    {/* Replik Japonca ve çevrilmiyor; kaynağı hemen
                        altında. */}
                    <p className={styles.stopQuoteText} lang="ja">
                      {say(stop.quote.text)}
                    </p>
                    <cite className={styles.stopQuoteBy}>
                      {say(stop.quote.by)}
                    </cite>
                  </blockquote>
                ) : null}

                {stop.kin ? (
                  <p className={styles.stopKin}>
                    {stop.kin.name} — {say(stop.kin.role)}
                  </p>
                ) : null}
              </div>

              <div className={styles.stopFrame}>
                <CuratedImage
                  slotId={stop.imageKey}
                  spec={say(GOJO_SLOT_LABELS[stop.imageKey])}
                  aspect="4 / 3"
                  src={images.get(stop.imageKey) ?? null}
                  isAdmin={isAdmin}
                  characterId={GOJO_ID}
                  curatorLabel={say(GOJO_CURATOR.upload)}
                  statusLabel={say(GOJO_CURATOR.missing)}
                  glyph={GOJO_S06.stamps[stop.key] ?? "記"}
                  sizes="420px"
                />
              </div>
            </li>
          ))}
        </ol>

        {/* Hidden Inventory dönemi kadrajları */}
        <div className={styles.makingPlates}>
          {[GOJO_S06_SLOTS.full, GOJO_S06_SLOTS.portrait].map((slot) => (
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
              glyph="若"
              sizes="360px"
            />
          ))}
        </div>

        <p className={styles.makingOutro}>{say(GOJO_S06.outro)}</p>
      </div>
      {/* P11 · mikro obje — sayfaya serpiştirilmiş üç keşiften biri.
          Bölümün akışını bozmuyor: mutlak konumlu ve kenarda. */}
      <EggObject
        eggKey="mochi"
        mark="◍"
        label={say(GOJO_S11.hiddenObject)}
        side="right"
        tone="var(--g-se-s11-mochi)"
      />
    </div>
  );
}

