import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_S05,
  GOJO_S05_DOMAIN_KANJI,
  GOJO_S05_KANJI,
  GOJO_S05_SLOT,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { VoidTrigger } from "./VoidTrigger";
import styles from "./GojoExperience.module.css";

/**
 * P05 · UNLIMITED VOID — statik pano + sekansın tetikleyicisi.
 *
 * ── PANO SEKANSIN ÖZETİ DEĞİL, KENDİSİ ───────────────────────────────────
 * BRIEF: "Reduced-motion: sekans hiç oynamaz. Yerine aynı içeriği taşıyan
 * statik bir Unlimited Void panosu gösterilir — bilgi kaybı olmaz."
 *
 * Bu şart burada bir DAL olarak değil, YAPININ kendisi olarak karşılanıyor:
 * pano her zaman çiziliyor ve sekansın taşıdığı her şeyi taşıyor — alan
 * adı, gövde metni, boşluğa akan bilgi parçalarının TAM listesi ve göz
 * kadrajı. Sekans bu panonun oynatılmış hâli; kapalıyken eksik kalan bir
 * şey yok. İki ayrı içerik olsaydı biri güncellenip diğeri unutulurdu.
 *
 * Akan parçalar tek bir kaynaktan (`GOJO_S05.fragments`) geliyor: panoda
 * liste, sekansta akış.
 */
export function VoidSection({
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
    <div className={styles.void}>
      <div className={styles.voidInner}>
        <div>
          {/* Japonca atmosfer öğesi — iki dilde de aynı, okunabilir
              karşılığı hemen yanında. */}
          <p className={styles.voidKanji} lang="ja">
            {GOJO_S05_KANJI}
          </p>
          <h2 className={styles.voidTitle} id="gojo-void-title">
            {say(GOJO_S05.title)}
            <span className={styles.srOnly}> — {say(GOJO_S05.kanjiGloss)}</span>
          </h2>
          <p className={styles.voidName}>
            <span lang="ja">{GOJO_S05_DOMAIN_KANJI}</span> ·{" "}
            {say(GOJO_S05.domainName)}
          </p>

          <p className={styles.voidBody}>{say(GOJO_S05.body)}</p>

          {/* Sekansta akan parçaların OKUNABİLİR hâli. Sekans hiç
              açılmasa da burada duruyor. */}
          <p className={styles.voidListLabel}>
            {say(GOJO_S05.ui.staticLabel)}
          </p>
          <ul className={styles.voidList}>
            {GOJO_S05.fragments.map((fragment) => (
              <li key={fragment.text} lang={fragment.lang ?? undefined}>
                {fragment.text}
              </li>
            ))}
          </ul>

          <VoidTrigger
            label={say(GOJO_S05.ui.trigger)}
            hint={say(GOJO_S05.ui.triggerHint)}
            kanji={GOJO_S05_KANJI}
            kanjiGloss={say(GOJO_S05.kanjiGloss)}
            freezeLine={say(GOJO_S05.freezeLine)}
            skipLabel={say(GOJO_S05.ui.skip)}
            escapeLabel={say(GOJO_S05.ui.escape)}
            fragments={GOJO_S05.fragments}
          />
        </div>

        <CuratedImage
          slotId={GOJO_S05_SLOT.key}
          spec={say(GOJO_S05_SLOT.spec)}
          aspect={GOJO_S05_SLOT.aspect}
          src={src}
          alt={say(GOJO_S05_SLOT.alt)}
          isAdmin={isAdmin}
          characterId={GOJO_ID}
          curatorLabel={say(GOJO_CURATOR.upload)}
          statusLabel={say(GOJO_CURATOR.missing)}
          glyph="無"
          sizes="560px"
        />
      </div>
    </div>
  );
}
