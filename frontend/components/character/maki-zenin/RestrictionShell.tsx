"use client";

import { createContext, useContext, useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import type { MakiRestriction } from "@/lib/characters/maki-zenin-experience";
import styles from "./ArmoryExperience.module.css";

/**
 * Maki sayfasının kabuğu ve TEK modu — "Cennetsel Kısıtlama" (天与呪縛).
 * İstemci adası 1/2.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca doğru sırayla taşır. İstemciye inen tek şey iki düğme ve
 * `"before" | "after"` değerinde tek bir dize.
 *
 * ── DÜĞMENİN NE YAPTIĞI: IŞIK DEĞİL, YAPI ────────────────────────────────
 *   before (半, yarım)  → raf çizgisi İNCE (`--mki-rail-w: 1px`), hücre
 *                         aralığı geniş, palet SOLUK (`--mki-hot` accent'i
 *                         `--text-muted` ile karışıyor), gözlük hücresi
 *                         AÇIK, ölçü sütunları düşük okuyor.
 *   after  (全, tam)    → raf çizgisi KALIN (2px), hücre aralığı daralıyor,
 *                         palet KESKİNLEŞİYOR (`--accent-hover` saf hâliyle),
 *                         gözlük hücresi RAFTAN KALKIYOR (üstü X'le çiziliyor),
 *                         menzil ve hız sütunları YÜKSELİYOR.
 *
 * ⚠️ Dalga 1'in ikinci dersi (Onizuka) burada uygulandı: KİLİTLİ IZGARA
 * VARSAYILANDA DA VAR. `before` "ızgarasız hâl" değil — envanter ızgarası,
 * raf çizgileri ve altı göz iki durumda da yerinde duruyor; değişen yalnızca
 * DERECE. Düğme rafı açıp kapatan bir anahtar olsaydı sayfanın kimliği yarı
 * zamanlı olurdu.
 *
 * ── NEDEN CONTEXT ────────────────────────────────────────────────────────
 * Silah rafı (`WeaponRack`) ayrı bir ada ve sunucuda çizilip `children`
 * olarak buraya geliyor; ölçü sayılarını seçmek için modu bilmesi gerek.
 * Sunucudan prop geçmek mümkün değil (durum burada), o yüzden mod küçük bir
 * context üstünden iniyor. Sunucuda çizilmiş çocuklar da istemci ağacının
 * parçası olduğu için context onlara sorunsuz ulaşıyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */

const RestrictionContext = createContext<MakiRestriction>("before");

/** Silah rafı bunu okuyor; sağlayıcı yoksa güvenli varsayılan `before`. */
export function useRestriction(): MakiRestriction {
  return useContext(RestrictionContext);
}

export interface RestrictionSide {
  id: MakiRestriction;
  /** Kanji işareti — çevrilmez */
  mark: string;
  /** Düz dize (sunucuda `pick()` ile çevrildi) */
  name: string;
  label: string;
}

export function RestrictionShell({
  isAdmin,
  title,
  kanji,
  reading,
  lede,
  sides,
  hints,
  rule,
  source,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  kanji: string;
  reading: string;
  lede: string;
  sides: readonly RestrictionSide[];
  /** Her mod için tek satırlık durum metni — düz dize */
  hints: Record<MakiRestriction, string>;
  rule: string;
  source: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [restriction, setRestriction] = useState<MakiRestriction>("before");

  return (
    <div
      className={styles.page}
      data-world="maki-zenin"
      data-restriction={restriction}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="mki-mode">
          <p className={styles.blockMark} aria-hidden>
            02
          </p>
          <h2 id="mki-mode" className={styles.modeTitle}>
            {title}
          </h2>
          <p className={styles.modeKanji} lang="ja">
            {kanji}
            <span className={styles.modeReading}>{reading}</span>
          </p>
          <p className={styles.modeLede}>{lede}</p>

          <div className={styles.modeSwitch} role="group" aria-labelledby="mki-mode">
            {sides.map((side) => (
              <button
                key={side.id}
                type="button"
                className={styles.modeButton}
                data-side={side.id}
                aria-pressed={restriction === side.id}
                onClick={() => setRestriction(side.id)}
              >
                <span className={styles.modeMark} lang="ja" aria-hidden>
                  {side.mark}
                </span>
                <span className={styles.modeName}>{side.name}</span>
                <span className={styles.modeLabel}>{side.label}</span>
              </button>
            ))}
          </div>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor */}
          <p className={styles.modeHint} role="status">
            {hints[restriction]}
          </p>

          <p className={styles.modeRule}>{rule}</p>
          <p className={styles.modeSource}>{source}</p>
        </section>

        <RestrictionContext.Provider value={restriction}>
          {children}
        </RestrictionContext.Provider>
      </CuratorFrame>
    </div>
  );
}
