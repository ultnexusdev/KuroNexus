"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./ZabimaruExperience.module.css";

/**
 * Renji sayfasının kabuğu ve TEK modu — "Bankai".
 *
 * ── İSTEMCİYE İNEN TEK ŞEY ───────────────────────────────────────────────
 * Bir boolean ve bir düğme. Bütün içerik SUNUCUDA çizilip `hero`, `spine` ve
 * `children` yuvalarından prop olarak geliyor (Faz 2 §1 kompozisyon deseni);
 * bu ada onları yalnızca doğru sırayla yerleştiriyor. Metinler de çözülmüş
 * DÜZ DİZE olarak iniyor — `LocalizedText` istemci sınırını geçmiyor.
 *
 * ── MOD NE YAPIYOR ───────────────────────────────────────────────────────
 * `data-release="shikai" | "bankai"` kök öğede duruyor ve YAPI değiştiriyor,
 * ışık değil:
 *
 *   shikai → `--ren-swing` dar, `--ren-joint` kısa. Zikzak DURUYOR ama
 *            sayfa kabzaya yakın; omurga motifi görünmez.
 *   bankai → `--ren-swing` iki katına çıkıyor (sayfa daha geniş salınıyor),
 *            eklem parçaları uzuyor, kemik beyazı omurga beliriyor,
 *            başlıklar bir kademe büyüyor.
 *
 * ⚠️ Dalga 1'in İKİNCİ dersi burada: varsayılan durumda da kilitli ızgara
 * VAR. `shikai` düz tek kolona düşmüyor — yalnızca genliği küçülüyor. Mod
 * kapalıyken sayfanın kimliği kaybolursa kimlik moda ait demektir, sayfaya
 * değil.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function JointShell({
  isAdmin,
  title,
  native,
  toBankaiLabel,
  toShikaiLabel,
  hintShikai,
  hintBankai,
  markLabel,
  hero,
  spine,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  toBankaiLabel: string;
  toShikaiLabel: string;
  hintShikai: string;
  hintBankai: string;
  markLabel: string;
  /** Sunucuda çizilmiş hero — düğmenin ÜSTÜNDE duruyor (yedi durağın sırası) */
  hero: React.ReactNode;
  /** Kemik beyazı omurga motifi; görünürlüğünü CSS `data-release`ten okuyor */
  spine: React.ReactNode;
  children: React.ReactNode;
}) {
  const [bankai, setBankai] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="renji-abarai"
      data-release={bankai ? "bankai" : "shikai"}
    >
      {/* Omurga sayfanın sağ kenarında sabit bir şerit; `aria-hidden` çünkü
          taşıdığı bilgi zaten düğmenin durum satırında yazıyor. */}
      <span className={styles.spine} aria-hidden>
        {spine}
      </span>

      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içeriğin arasına giriyor, yani
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.release} aria-labelledby="ren-release">
          <h2 id="ren-release" className={styles.releaseTitle}>
            {title}
          </h2>
          <p className={styles.releaseNative} lang="ja" aria-hidden>
            {native}
          </p>

          <button
            type="button"
            className={styles.releaseButton}
            aria-pressed={bankai}
            onClick={() => setBankai((value) => !value)}
          >
            {/* Üç parçalı eklem göstergesi: basılıyken parçalar aralanıyor */}
            <span className={styles.releaseMark} role="img" aria-label={markLabel}>
              <span className={styles.releaseMarkPart} />
              <span className={styles.releaseMarkPart} />
              <span className={styles.releaseMarkPart} />
            </span>
            <span className={styles.releaseLabel}>
              {bankai ? toShikaiLabel : toBankaiLabel}
            </span>
          </button>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor. */}
          <p className={styles.releaseHint} role="status">
            {bankai ? hintBankai : hintShikai}
          </p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
