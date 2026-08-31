"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./ShunkoExperience.module.css";

/**
 * Yoruichi sayfasının kabuğu ve TEK durumu — "Kedi formu" (猫).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir dize.
 *
 * ── DÜĞMENİN NE YAPTIĞI ──────────────────────────────────────────────────
 * Işık ya da renk DEĞİL, VERİ. `data-form="cat"` olduğunda:
 *
 *   · hero kadrajı değişiyor — insan karesi çıkıyor, kedi karesi giriyor
 *     (iki AYRI küratör yuvası; aynı kareyi paylaşmıyorlar)
 *   · künye şeridindeki on üç satır tek tek çevriliyor (her satırın kendi
 *     gecikmesi var: `--yor-row` özel özelliği, `nth-child` değil)
 *   · beş satır ölçülemez hâle düşüp griye iniyor ve "—" gösteriyor
 *
 * ⚠️ ÇEVİRME İŞİ CSS'TE, JS'TE DEĞİL. İki formun değerleri de sunucuda
 * çizilip DOM'a giriyor; görünmeyen taraf `visibility: hidden` ile hem
 * ekran okuyucudan hem sekme sırasından çıkıyor. Sebebi tek: sayfanın
 * bütün metni `LocalizedText` çiftlerinden geliyor ve iki formun iki dilli
 * metinlerini istemciye taşımak, kabuğu bir metin deposuna çevirirdi.
 * Burada yalnızca "human" | "cat" dizesi duruyor.
 *
 * Hero düğmenin ÜSTÜNDE (yedi durağın sırası: hero → mod düğmesi), bu
 * yüzden ayrı bir `hero` yuvası var; `children` düğmeden sonra geliyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function FormShell({
  isAdmin,
  title,
  native,
  enterLabel,
  exitLabel,
  hintHuman,
  hintCat,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  enterLabel: string;
  exitLabel: string;
  hintHuman: string;
  hintCat: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [cat, setCat] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="yoruichi-shihouin"
      data-form={cat ? "cat" : "human"}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="yor-mode">
          <div className={styles.modeInner}>
            <h2 id="yor-mode" className={styles.modeTitle}>
              {title}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {native}
            </p>

            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={cat}
              onClick={() => setCat((value) => !value)}
            >
              {/* İki gövdenin şeması: dolu daire insan, ince halka kedi.
                  Basıldığında art-görüntü izi sözde öğeden geliyor. */}
              <span className={styles.modeMark} aria-hidden />
              <span className={styles.modeLabel}>
                {cat ? exitLabel : enterLabel}
              </span>
            </button>

            {/* Durum yalnızca renkle değil YAZIYLA da veriliyor; ekran
                okuyucu formun değiştiğini buradan duyuyor. */}
            <p className={styles.modeHint} role="status">
              {cat ? hintCat : hintHuman}
            </p>
          </div>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
