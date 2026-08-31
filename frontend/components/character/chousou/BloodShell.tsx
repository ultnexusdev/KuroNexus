"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { BloodDrop } from "./ChousouGlyphs";
import styles from "./BloodlineExperience.module.css";

/**
 * Chōsō sayfasının kabuğu: kök öğe, tek durum ve kılcal damar katmanı.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. İstemciye inen tek şey bir boole, bir
 * düğme ve altı boş `<span>`.
 *
 * ── TEK DURUM: `data-blood="on" | "off"` ─────────────────────────────────
 * "Kan Bağı" düğmesi sayfanın ışığını değil YAPISINI çeviriyor:
 *   · gövde damarı bölüm kenarlarına kılcal damarlar uzatıyor
 *     (`.capillary` katmanı ve her dallanma noktasının iki yan kolu)
 *   · palet doyuyor (`--chs-lit-*` ailesi standart token'ların yerine
 *     geçiyor, yani bütün bölümler aynı anda dönüyor)
 *   · her bölümde o bölüme ait KARDEŞ ADI beliriyor — kapalıyken o
 *     satırlar hiç çizilmiyor (`display: none`, ekran okuyucudan da düşer)
 *
 * ── NEDEN CONTEXT YOK (Rukia'dan ayrılan yer) ────────────────────────────
 * Dokuz kardeş mekaniği kendi durumunu KENDİ bölümünde tutuyor ve sayfanın
 * kökünü hiç ilgilendirmiyor. Kar katmanlarının aksine burada aşağı akan
 * bir durum yok, o yüzden `SnowShell`deki context köprüsüne gerek kalmadı:
 * iki ada birbirinden tamamen bağımsız.
 *
 * Kök `<main>` DEĞİL: kök düzen zaten `<main id="icerik">` çiziyor.
 */

/** Kenarlara uzayan kılcal damar sayısı. Kapalıyken hiçbiri görünmüyor. */
const CAPILLARIES = 6;

export function BloodShell({
  isAdmin,
  bloodTitle,
  bloodNative,
  bloodLede,
  bloodEnter,
  bloodExit,
  bloodHintOn,
  bloodHintOff,
  hero,
  children,
}: {
  isAdmin: boolean;
  bloodTitle: string;
  bloodNative: string;
  bloodLede: string;
  bloodEnter: string;
  bloodExit: string;
  bloodHintOn: string;
  bloodHintOff: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [blood, setBlood] = useState(false);

  return (
    <div className={styles.page} data-world="chousou" data-blood={blood ? "on" : "off"}>
      {/* Kılcal damar katmanı — sayfanın hareket dili.
          `aria-hidden`: altı boş kutu ekran okuyucuda gürültüden başka bir
          şey değil. Her kılcalın yeri ve nabız gecikmesi CSS'te
          `:nth-child()` ile veriliyor; burada satır içi stil YOK (kural 16
          hex yasağının kardeşi: konum da stil dosyasında kalsın). */}
      <span className={styles.capillaries} aria-hidden>
        {Array.from({ length: CAPILLARIES }, (_, i) => (
          <span key={i} className={styles.capillary} />
        ))}
      </span>

      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına giriyor. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ — "Kan Bağı" ═════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="chs-blood">
          <span className={styles.modeStem} aria-hidden />
          <h2 id="chs-blood" className={styles.modeTitle}>
            {bloodTitle}
          </h2>
          <p className={styles.modeNative} lang="ja" aria-hidden>
            {bloodNative}
          </p>
          <p className={styles.modeLede}>{bloodLede}</p>

          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={blood}
            onClick={() => setBlood((value) => !value)}
          >
            <BloodDrop
              className={styles.modeMark}
              shellClassName={styles.modeMarkShell}
              veinClassName={styles.modeMarkVein}
            />
            <span className={styles.modeLabel}>{blood ? bloodExit : bloodEnter}</span>
          </button>

          {/* Durum yalnız renkle değil YAZIYLA da veriliyor. */}
          <p className={styles.modeHint} role="status">
            {blood ? bloodHintOn : bloodHintOff}
          </p>
        </section>

        {children}
      </CuratorFrame>
    </div>
  );
}
