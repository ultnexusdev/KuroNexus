"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./PrecisionExperience.module.css";

/**
 * Levi sayfasının kabuğu ve TEK modu — "pişmanlıksız seçim" (悔いなき選択).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Işık ya da renk DEĞİL, yapı. `data-clean="true"` olduğunda sayfadaki
 * ikinci dereceden her şey layout'tan da erişilebilirlik ağacından da
 * çıkıyor:
 *
 *   · bölüm açıklamaları (`.aside` sarmalayıcısı)
 *   · Japonca okunuşlar ve etiket şeritleri
 *   · DOLDURULMAMIŞ kadrajlar (`.frameSlot[data-filled="false"]`)
 *   · kanat arması filigranı
 *
 * Kaldırma `display: none` ile değil, `grid-template-rows: 1fr → 0fr` +
 * `visibility: hidden` ile: birincisi geçişi mümkün kılıyor (sayfanın
 * hareket dili "dönen ODM bulanıklığı": kısa bir rotate + blur, sonra tam
 * durgunluk), ikincisi öğeyi sekme sırasından ve ekran okuyucudan gerçekten
 * çıkarıyor. Yalnızca gizlemek yeterli olmazdı — mod "kaldırıyor", "soluklaştırmıyor".
 *
 * Hero düğmenin ÜSTÜNDE duruyor (yedi durağın sırası: hero → mod düğmesi),
 * bu yüzden ayrı bir `hero` yuvası var; `children` düğmeden sonra geliyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function CleanShell({
  isAdmin,
  title,
  native,
  enterLabel,
  exitLabel,
  hintOn,
  hintOff,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  enterLabel: string;
  exitLabel: string;
  hintOn: string;
  hintOff: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [clean, setClean] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="levi"
      data-clean={clean ? "true" : "false"}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. `hero` ve
          `children` sunucuda çizilip prop olarak geliyor; bu bileşen
          onları yalnızca doğru sırayla yerleştiriyor. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="lvi-mode">
          <h2 id="lvi-mode" className={styles.modeTitle}>
            {title}
          </h2>
          <p className={styles.modeNative} lang="ja" aria-hidden>
            {native}
          </p>

          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={clean}
            onClick={() => setClean((value) => !value)}
          >
            {/* Tek işaret: basılıyken çeyrek tur dönüp duran bir kare */}
            <span className={styles.modeMark} aria-hidden />
            <span className={styles.modeLabel}>
              {clean ? exitLabel : enterLabel}
            </span>
          </button>

          {/* Durum yalnızca renkle değil YAZIYLA da veriliyor; mod açıkken de
              okunabilir kalmalı, o yüzden `.aside` sarmalayıcısında DEĞİL. */}
          <p className={styles.modeHint} role="status">
            {clean ? hintOn : hintOff}
          </p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
