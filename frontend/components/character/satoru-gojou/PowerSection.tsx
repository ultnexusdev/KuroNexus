import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_RINGS,
  GOJO_S09,
  GOJO_S09_SLOT,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { PowerRings } from "./PowerRings";
import styles from "./GojoExperience.module.css";

/**
 * P09 · POWER ANALYSIS — HUD.
 *
 * Altı halka ekranın kenarlarına yapışıyor, ortada Gojō'ya ayrılmış
 * pürüzsüz ve bomboş bir alan kalıyor. ⚠️ BÖLÜMÜN TEZİ: VERİLER GOJŌ'YU
 * ANALİZ EDEMİYOR — merkezde okunabilir tek şey "VERİ YOK".
 *
 * ── UYDURMA İSTATİSTİK YOK ───────────────────────────────────────────────
 * Radar sayı ister ama seride bu niteliklerin hiçbiri sayıyla verilmiyor.
 * Çözüm tezin kendisi: sayaçlar tırmanıyor, tavana dayanıyor ve bir ölçüm
 * değeriyle değil bir TAŞMA işaretiyle (`∞` / `ERR`) duruyor. Ekranda
 * görünen şey Gojō'nun puanı değil, aygıtın yetersizliği.
 *
 * ── GÖVDE METNİ LOG ──────────────────────────────────────────────────────
 * BRIEF: "Gövde SADECE JetBrains Mono, sistem log / hata mesajı bloğu
 * formunda." Bölümün anlatısı altı log satırında; sonuncusu ölçümün
 * iptali. Halka detayları da aynı dilde.
 *
 * ── KENAR, MERKEZ DEĞİL ──────────────────────────────────────────────────
 * Dinamik dövüş kadrajı bilerek merkeze KONMUYOR: merkez ayrılmış alan.
 * Kadraj log bloğunun altında, çemberin dışında duruyor.
 */
export function PowerSection({
  locale,
  isAdmin,
  src,
}: {
  locale: string;
  isAdmin: boolean;
  src: string | null;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  const rings = GOJO_RINGS.map((ring) => ({
    key: ring.key,
    label: say(ring.label),
    readout: ring.readout,
    ceiling: ring.ceiling,
    detail: say(ring.detail),
  }));

  return (
    <div className={styles.hud} data-gojo-hud>
      <div className={styles.hudInner}>
        <h2 className={styles.hudTitle} id="gojo-power-title">
          {say(GOJO_S09.title)}
        </h2>

        {/* ⚠️ TEK ADA. Altı halka da buradan geliyor; sütunlara ızgara
            dağıtıyor. İki ayrı ada olsaydı her biri kendi üçlüsünü
            çalıştırır ve aynı anda altı sayaç ilerlerdi. */}
        <div className={styles.hudRing}>
          <PowerRings
            rings={rings}
            overflowLabel={say(GOJO_S09.overflow)}
            statusIdle="···"
          />

          {/* MERKEZ. Hiçbir halka, hiçbir sayı burada değil. */}
          <div className={styles.hudZero}>
            <p className={styles.hudZeroLabel}>{say(GOJO_S09.zeroLabel)}</p>
            <p className={styles.hudZeroValue}>{say(GOJO_S09.zeroValue)}</p>
          </div>
        </div>

        <p className={styles.hudHint}>{say(GOJO_S09.keyHint)}</p>

        <div className={styles.hudLog}>
          <p className={styles.hudLogLabel}>{say(GOJO_S09.logLabel)}</p>
          <ol className={styles.hudLogList}>
            {GOJO_S09.log.map((line) => (
              <li key={line.en}>{say(line)}</li>
            ))}
          </ol>
        </div>

        <div className={styles.hudPlate}>
          <CuratedImage
            slotId={GOJO_S09_SLOT.key}
            spec={say(GOJO_S09_SLOT.spec)}
            aspect={GOJO_S09_SLOT.aspect}
            src={src}
            alt={say(GOJO_S09_SLOT.alt)}
            isAdmin={isAdmin}
            characterId={GOJO_ID}
            curatorLabel={say(GOJO_CURATOR.upload)}
            statusLabel={say(GOJO_CURATOR.missing)}
            glyph="力"
            sizes="420px"
          />
        </div>
      </div>
    </div>
  );
}
