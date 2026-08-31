"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./ReliquaryExperience.module.css";

/**
 * Getō sayfasının kabuğu ve TEK modu — "Maymun" (猿).
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── ⚠️ MODUN NE YAPTIĞI: BİÇİM DEĞİL, DİL ────────────────────────────────
 * Arşivdeki diğer mod düğmeleri yapıyı ya da ışığı değiştiriyor. Bu düğme
 * sayfanın METNİNİ değiştiriyor: Getō'nun büyücü olmayanlar için kullandığı
 * sözcük anlatının içine giriyor. Palet de soğuyor, ama o ikincil — asıl
 * olay içerik.
 *
 * Teknik çözüm: her iki versiyon da SUNUCUDA çiziliyor ve kök öğedeki
 * `data-monkey` niteliği hangisinin görüneceğine karar veriyor
 * (`.voicePlain` / `.voiceMonkey`, `display: none` ile). Neden böyle:
 *
 *   · Metinleri istemciye taşımak, sayfanın anlatı gövdesinin tamamını
 *     istemci sınırının içine çekerdi (yedi durakta yüzlerce cümle).
 *   · `display: none` öğeyi erişilebilirlik ağacından da çıkarıyor, yani
 *     ekran okuyucu iki versiyonu ARKA ARKAYA okumuyor — gerçekten tek
 *     metin var. `visibility` ya da `opacity` bunu vermezdi.
 *   · Sunucu varsayılanı `false`, yani ilk boyamada arşivin dili görünüyor
 *     ve hidrasyon uyuşmazlığı doğmuyor.
 *
 * ── ⚠️ HASSAS İÇERİK KORUMALARI ──────────────────────────────────────────
 * Üçü de burada ve kaldırılamaz:
 *   1. `frame` cümlesi — düğmenin ne yaptığını ve BU DİLİN KİME AİT
 *      olduğunu söylüyor; mod açıkken de kapalıyken de görünür.
 *   2. `rejection` — arşivin cevabı; modla DEĞİŞMİYOR, iki durumda da aynı
 *      cümle duruyor. Bu yüzden `voice` çiftine hiç girmedi.
 *   3. Mod varsayılan KAPALI ve tek tuşla geri alınabilir; `aria-pressed`
 *      durumu okuyucuya da veriyor.
 *
 * Hero düğmenin ÜSTÜNDE (yedi durağın sırası: hero → mod düğmesi), bu yüzden
 * ayrı bir `hero` yuvası var; `children` düğmeden sonra geliyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function MonkeyShell({
  isAdmin,
  title,
  native,
  enterLabel,
  exitLabel,
  frameLine,
  hintOn,
  hintOff,
  rejection,
  hero,
  children,
}: {
  isAdmin: boolean;
  title: string;
  native: string;
  enterLabel: string;
  exitLabel: string;
  frameLine: string;
  hintOn: string;
  hintOff: string;
  rejection: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [monkey, setMonkey] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="suguru-getou"
      data-monkey={monkey ? "true" : "false"}
    >
      {/* Duman katmanları — SAYFANIN EN ALTINDA, metnin arkasında.
          `pointer-events: none` + negatif z-index CSS'te; buradaki tek iş
          onları erişilebilirlik ağacından çıkarmak. Üç katman farklı
          hızda ve farklı bulanıklıkta yükseliyor. */}
      <div className={styles.smoke} aria-hidden>
        <span className={styles.smokeLayerA} />
        <span className={styles.smokeLayerB} />
        <span className={styles.smokeLayerC} />
      </div>

      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ ═════════════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="get-mode">
          <div className={styles.modeHead}>
            <h2 id="get-mode" className={styles.modeTitle}>
              {title}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {native}
            </p>
          </div>

          {/* Çerçeve cümlesi düğmenin ÜSTÜNDE: kullanıcı ne açtığını
              basmadan önce okusun. */}
          <p className={styles.modeFrame}>{frameLine}</p>

          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={monkey}
            onClick={() => setMonkey((value) => !value)}
          >
            <span className={styles.modeMark} aria-hidden />
            <span className={styles.modeLabel}>
              {monkey ? exitLabel : enterLabel}
            </span>
          </button>

          <p className={styles.modeHint} role="status">
            {monkey ? hintOn : hintOff}
          </p>

          {/* Arşivin cevabı — İKİ MODDA DA aynı. `voice` çifti DEĞİL. */}
          <p className={styles.modeAnswer}>{rejection}</p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
