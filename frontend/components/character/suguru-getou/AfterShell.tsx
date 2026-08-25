"use client";

import { useState } from "react";
import { KesaMark } from "./CurseGlyphs";
import styles from "./SwallowExperience.module.css";

/**
 * Dönem kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Getō'nun hayatı ikiye ayrılıyor ve mod o çizgiyi geçiyor. Etkisi TEK bir
 * değişkende: `--get-chrome`. Sayfadaki bütün DEKORATİF renk (kenarlar,
 * filigranlar, kanji, çizgiler) o değişkeni okuyor.
 *
 *   öncesi  → --get-chrome: var(--accent)      (yeşil hâlâ yerinde)
 *   sonrası → --get-chrome: var(--text-muted)  (renk çekiliyor)
 *
 * Geriye renkli kalan tek şey haznedeki lanetler oluyor — sayfanın söylemek
 * istediği cümle de bu: taraf değiştirdikten sonra elinde kalan tek renkli
 * şey yuttuklarıydı.
 *
 * ⚠️ METİN TOKEN'LARINA DOKUNULMUYOR. `--text-*`, `--bg` ve `--surface`
 * modla değişmiyor; yani ölçülmüş kontrastların hiçbiri bozulmuyor. Mod
 * yalnızca süsü soluyor, okunabilirliği değil.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function AfterShell({
  enterLabel,
  exitLabel,
  hint,
  beforeTag,
  afterTag,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  beforeTag: string;
  afterTag: string;
  children: React.ReactNode;
}) {
  const [after, setAfter] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="suguru-getou"
      data-after={after ? "true" : "false"}
    >
      <div className={styles.moodBar}>
        <button
          type="button"
          className={styles.moodToggle}
          aria-pressed={after}
          onClick={() => setAfter((value) => !value)}
        >
          <KesaMark
            className={styles.moodGlyph}
            clothClassName={styles.moodKesaCloth}
            seamClassName={styles.moodKesaSeam}
            after={after}
          />
          <span className={styles.moodLabel}>
            {after ? exitLabel : enterLabel}
          </span>
        </button>

        {/* Dönem etiketi: modun ne olduğunu YAZIYLA söyleyen satır —
            renk tek gösterge olmasın. */}
        <p className={styles.era}>{after ? afterTag : beforeTag}</p>
      </div>

      <p className={styles.moodHint} role="status">
        {after ? hint : ""}
      </p>

      {children}
    </div>
  );
}
