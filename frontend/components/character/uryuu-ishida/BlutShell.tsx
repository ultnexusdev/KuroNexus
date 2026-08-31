"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./QuincyExperience.module.css";

/**
 * Uryū sayfasının kabuğu ve TEK modu — "Blut" (血装).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca doğru sırayla taşır. İstemciye inen tek şey iki düğme ve
 * `"vene" | "arterie"` değerinde tek bir dize.
 *
 * ── DÜĞMENİN NE YAPTIĞI: IŞIK DEĞİL, YAPI ────────────────────────────────
 * Canon kuralı sert — Blut Vene (静血装, savunma) ile Blut Arterie
 * (動血装, saldırı) AYNI ANDA açılamaz. Bu yüzden düğme bir aç/kapat değil
 * bir TARAF SEÇİMİ: sayfa hiçbir zaman ikisini birden gösteremiyor.
 *
 *   vene (savunma) → ızgara çizgileri KALINLAŞIR (`--ury-rule-w` 1.1px),
 *                    ızgara gözü daralır, kutular dört kenardan KAPANIR
 *                    (zemin + tam çerçeve), nişangâh halkaları daralır.
 *   arterie (saldırı) → ızgara İNCELİR (0.5px), göz açılır, kutuların
 *                    zemini ve iki kenarı KALKAR (yalnız sol + alt kural
 *                    çizgisi kalır), nişangâh halkaları AÇILIR ve mavi
 *                    haçlar keskinleşir.
 *
 * ⚠️ Dalga 1'in ikinci dersi burada uygulandı: KİLİTLİ IZGARA VARSAYILANDA
 * DA VAR. `vene` "ızgarasız hâl" değil — blueprint ızgara iki durumda da
 * duruyor, yalnızca kalınlığı ve gözü değişiyor. Mod, ızgarayı açıp
 * kapatan bir anahtar olsaydı sayfanın kimliği yarı zamanlı olurdu.
 *
 * Hero düğmenin ÜSTÜNDE duruyor (yedi durağın sırası: hero → mod düğmesi),
 * bu yüzden ayrı bir `hero` yuvası var; `children` düğmeden sonra geliyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export type BlutMode = "vene" | "arterie";

export function BlutShell({
  isAdmin,
  title,
  veneName,
  arterieName,
  veneKanji,
  arterieKanji,
  veneLabel,
  arterieLabel,
  veneHint,
  arterieHint,
  rule,
  source,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  /** Gotik aileye basılan iki ad — ASCII, Türkçe harf GEÇEMEZ */
  veneName: string;
  arterieName: string;
  veneKanji: string;
  arterieKanji: string;
  veneLabel: string;
  arterieLabel: string;
  veneHint: string;
  arterieHint: string;
  rule: string;
  source: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [blut, setBlut] = useState<BlutMode>("vene");

  const sides: readonly {
    id: BlutMode;
    name: string;
    kanji: string;
    label: string;
  }[] = [
    { id: "vene", name: veneName, kanji: veneKanji, label: veneLabel },
    { id: "arterie", name: arterieName, kanji: arterieKanji, label: arterieLabel },
  ];

  return (
    <div className={styles.page} data-world="uryuu-ishida" data-blut={blut}>
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="ury-mode">
          <h2 id="ury-mode" className={styles.modeTitle}>
            {title}
          </h2>

          <div className={styles.modeSwitch} role="group" aria-labelledby="ury-mode">
            {sides.map((side) => (
              <button
                key={side.id}
                type="button"
                className={styles.modeButton}
                data-side={side.id}
                aria-pressed={blut === side.id}
                onClick={() => setBlut(side.id)}
              >
                <span className={styles.modeName} aria-hidden>
                  {side.name}
                </span>
                <span className={styles.modeKanji} lang="ja" aria-hidden>
                  {side.kanji}
                </span>
                <span className={styles.modeLabel}>{side.label}</span>
              </button>
            ))}
          </div>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor */}
          <p className={styles.modeHint} role="status">
            {blut === "vene" ? veneHint : arterieHint}
          </p>

          <p className={styles.modeRule}>{rule}</p>
          <p className={styles.modeSource}>{source}</p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
