import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_HERO,
  GOJO_ID,
  GOJO_IDENTITY,
  GOJO_S01,
  GOJO_S01_DISPLAY,
  GOJO_S01_JA,
  GOJO_S01_SCAN,
  GOJO_S01_SLOT,
  GOJO_UI,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { HeroEffects } from "./HeroEffects";
import { RevealedData } from "./RevealedData";
import styles from "./GojoExperience.module.css";

/**
 * P01 · HERO — radyal, merkezkaç.
 *
 * Gojō tam merkezde sabit; koordinatlar, gövde metni ve tarama paneli
 * devasa bir negatif alanla köşelere itilmiş. Katman sırası derinden
 * yüzeye: boşluk → maskelenmiş dev tipografi → en üstte net portre.
 *
 * ── SAYFANIN TEK `<h1>`'İ BURADA ─────────────────────────────────────────
 * Dev yazı bir dekorasyon değil, sayfanın başlığı. Ama görsel hâli
 * merkezde kesiliyor (Infinity maskesi), yani tek başına güvenilir bir
 * başlık değil. Bu yüzden ikiye ayrıldı:
 *   · `sr-only` bir açıklık — ekran okuyucunun ve arama motorunun okuduğu
 *   · `aria-hidden` görsel katman — insanın gördüğü
 * BRIEF · erişilebilirlik: "görsel olarak bükülmüş tipografinin HER ZAMAN
 * okunabilir bir DOM karşılığı olacak."
 *
 * ── EFEKT JS'İ OLMADAN TAM ───────────────────────────────────────────────
 * Aşağıdaki her şey sunucuda çiziliyor. `HeroEffects` ayrı bir parça ve
 * `ssr: false`; inmezse `--g-par-*` ve `--g-push` CSS'teki varsayılanlarında
 * kalıyor, kompozisyon aynı duruyor.
 */
export function HeroSection({
  locale,
  isAdmin,
  heroSrc,
  displayName,
}: {
  locale: string;
  isAdmin: boolean;
  /** Küratörün bağladığı hero karesi; yoksa `null` */
  heroSrc: string | null;
  /** Künyeden gelen ad — `sr-only` başlığın kaynağı */
  displayName: string;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  return (
    <div className={styles.hero} data-gojo-hero>
      {/* Dev başlık — ızgaranın dışında, portrenin arkasında. */}
      <h1 className={styles.heroTitleLayer}>
        <span className={styles.srOnly}>{displayName}</span>
        <span className={styles.heroTitle} aria-hidden="true">
          {GOJO_S01_DISPLAY}
        </span>
      </h1>

      <div className={styles.heroGrid}>
        {/* Sağ üst — ekran kenarına yapışık tarama çıktısı */}
        <p className={styles.heroCoords}>
          {GOJO_S01.coords.line1}
          <br />
          {say(GOJO_S01.coords.line2)}
        </p>

        {/* Merkez — Gojō'ya ayrılmış alan */}
        <div className={styles.heroCenter}>
          <div className={styles.heroPortrait}>
            <span className={styles.heroHalo} aria-hidden="true" />
            <CuratedImage
              slotId={GOJO_S01_SLOT.key}
              spec={say(GOJO_S01_SLOT.spec)}
              aspect={GOJO_S01_SLOT.aspect}
              src={heroSrc}
              alt={say(GOJO_S01_SLOT.alt)}
              isAdmin={isAdmin}
              characterId={GOJO_ID}
              curatorLabel={say(GOJO_CURATOR.upload)}
              statusLabel={say(GOJO_CURATOR.missing)}
              glyph={GOJO_IDENTITY.nativeName}
              sizes="368px"
              /* Hero'nun kadrajı LCP adayı: küratör bir kare bağladığında
                 öncelikli inmeli. */
              priority
            />
          </div>

          <p className={styles.titleNative} lang="ja">
            {GOJO_IDENTITY.nativeName}
          </p>

          {/* Japonca satır atmosfer öğesi — iki dilde de aynı kalıyor.
              Okunabilir karşılığı hemen yanında, `sr-only`. */}
          <p className={styles.heroJa}>
            <span lang="ja">{GOJO_S01_JA}</span>
            <span className={styles.srOnly}> — {say(GOJO_S01.jaGloss)}</span>
          </p>

          <p className={styles.heroStrongest}>{say(GOJO_S01.strongest)}</p>
        </div>

        {/* Sol alt — gövde metni */}
        <p className={styles.heroLede}>{say(GOJO_HERO.lede)}</p>

        {/* Sağ alt — tarama paneli */}
        <div className={styles.heroPanel}>
          <p className={styles.heroPanelTitle}>{say(GOJO_S01_SCAN.title)}</p>

          <dl className={styles.heroPanelList}>
            {GOJO_S01_SCAN.rows.map((row) => (
              <div className={styles.heroPanelRow} key={row.label.en}>
                <dt className={styles.heroPanelLabel}>{say(row.label)}</dt>
                <dd className={styles.heroPanelValue}>{say(row.value)}</dd>
              </div>
            ))}
          </dl>

          {/* Six Eyes açılınca panele düşen ölçüm. DOM'da her zaman var. */}
          <p className={styles.heroPanelHidden}>
            <RevealedData
              label={say(GOJO_S01_SCAN.hidden.label)}
              value={say(GOJO_S01_SCAN.hidden.value)}
              mask={say(GOJO_UI.mask)}
            />
          </p>
        </div>
      </div>

      <HeroEffects />
    </div>
  );
}
