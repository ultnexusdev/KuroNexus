import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_S11,
  GOJO_ID,
  GOJO_S02,
  GOJO_S02_SLOT,
  GOJO_UI,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { EggObject } from "./EggObject";
import { RevealedData } from "./RevealedData";
import styles from "./GojoExperience.module.css";

/**
 * P02 · THE STRONGEST — asimetrik, görünmez dikey duvar.
 *
 * Solda masif metin bloğu, sağda Gojō'nun kadrajı. Aralarında INFINITY
 * kuralının DİKEY varyantı var: sağa hizalı dev başlık kadraja doğru
 * büyüyor ama duvara yaklaştıkça saydamlaşarak kesiliyor.
 *
 * ⚠️ Kesme YALNIZCA dev başlıkta ve yalnızca maske katmanında. Gövde
 * paragrafları sol bloğa hapsedilmiş, duvara hiç yaklaşmıyor ve maskesiz
 * — okunabilirlik pazarlık konusu değil. Başlığın DOM'daki metni bütün,
 * yani kesilen şey boyama, bilgi değil.
 *
 * ── ÜÇ GİZLİ ÖLÇÜM ───────────────────────────────────────────────────────
 * BRIEF P02: "Six Eyes açıldığında bu bölümde en az 3 gizli veri alanı
 * açılır." Üçü de `RevealedData`, yani DOM'da her zaman var ve iki dilde
 * de çevrili; görünürlüğü CSS'e ait.
 */
export function StrongestSection({
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
    <div className={styles.strongest}>
      {/* Sayfa kenarında dikey etiket — aşağıdan yukarıya. Dar ekranda
          CSS onu yatay bir üst satıra çeviriyor. */}
      <p className={styles.strongestEdge}>{say(GOJO_S02.edgeLabel)}</p>

      <div className={styles.strongestGrid}>
        <div className={styles.strongestLeft}>
          {/* Bölümün başlığı — `SectionShell` dışında, çünkü bu başlık
              kompozisyonun kendisi. Başlık düzeyi h2, sayfada tek h1
              hero'da. */}
          <h2 className={styles.strongestTitle} id="gojo-strongest-title">
            {say(GOJO_S02.title)}
          </h2>

          <div className={styles.strongestBody}>
            {GOJO_S02.body.map((para) => (
              <p className={styles.strongestPara} key={para.en.slice(0, 32)}>
                {say(para)}
              </p>
            ))}
          </div>

          {/* `<dl>` DEĞİL `<ul>`: etiket ve değer tek bir `RevealedData`
              düğümünde birlikte duruyor, yani ayrı `<dt>`/`<dd>` çifti
              çıkarılamaz — `<dd>`siz bir `<dl>` geçersiz HTML olurdu. */}
          <ul className={styles.strongestReadings}>
            {GOJO_S02.readings.map((row) => (
              <li className={styles.strongestReading} key={row.label.en}>
                <RevealedData
                  label={say(row.label)}
                  value={say(row.value)}
                  mask={say(GOJO_UI.mask)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.strongestFrame}>
          <span className={styles.strongestMoire} aria-hidden="true" />
          <CuratedImage
            slotId={GOJO_S02_SLOT.key}
            spec={say(GOJO_S02_SLOT.spec)}
            aspect={GOJO_S02_SLOT.aspect}
            src={src}
            alt={say(GOJO_S02_SLOT.alt)}
            isAdmin={isAdmin}
            characterId={GOJO_ID}
            curatorLabel={say(GOJO_CURATOR.upload)}
            statusLabel={say(GOJO_CURATOR.missing)}
            glyph="最強"
            sizes="336px"
          />
        </div>
      </div>
      {/* P11 · mikro obje — sayfaya serpiştirilmiş üç keşiften biri.
          Bölümün akışını bozmuyor: mutlak konumlu ve kenarda. */}
      <EggObject
        eggKey="glasses"
        mark="◠"
        label={say(GOJO_S11.hiddenObject)}
        side="left"
        tone="var(--g-se-s11-glass)"
      />
    </div>
  );
}

