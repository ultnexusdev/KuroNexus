"use client";

import { useState } from "react";
import { FractureVeil, Spectacles } from "./AizenGlyphs";
import styles from "./AizenExperience.module.css";

/**
 * İki gerçeklik katmanının kabuğu.
 *
 * Sayfanın kökünü çizer ve TEK bir durum tutar: `data-layer`. Katmanın
 * bütün görsel etkisi CSS'te — bölüm başlıkları, künye değerleri, dönem
 * adları ikisi de SUNUCUDA çizilmiş hâlde duruyor ve `.page[data-layer=…]`
 * hangisinin görüneceğine karar veriyor.
 *
 * ⚠️ Kapalı katman `visibility: hidden` ile kapanıyor, `opacity: 0` ile
 * değil: saydam metin ekran okuyucuda okunmaya devam ederdi ve iki katman
 * birbirine karışırdı. `visibility` erişilebilirlik ağacından da çıkarıyor.
 *
 * Çocuklar sunucuda çizilmiş gelir — kompozisyon deseni (`GenjutsuShell`
 * emsali): sayfanın gövdesi tarayıcıya JS olarak inmiyor, yalnızca bu
 * kabuk ve ayna paneli iniyor.
 *
 * `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function ReflectionShell({
  recordName,
  reflectionName,
  nowReadingLabel,
  toReflectionLabel,
  toRecordLabel,
  liveRecord,
  liveReflection,
  children,
}: {
  recordName: string;
  reflectionName: string;
  nowReadingLabel: string;
  toReflectionLabel: string;
  toRecordLabel: string;
  liveRecord: string;
  liveReflection: string;
  children: React.ReactNode;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="sousuke-aizen"
      data-layer={broken ? "reflection" : "record"}
    >
      {/* Kırık cam örtüsü: her zaman çizili, opaklığı katmana bağlı */}
      <FractureVeil className={styles.fractureVeil} />
      {/* İkinci gerçekliğin yıkaması — tıklama geçirmez */}
      <span className={styles.lieWash} aria-hidden />

      <div className={styles.control}>
        <p className={styles.controlState}>
          <span className={styles.controlStateLabel}>{nowReadingLabel}</span>
          <span className={styles.controlStateValue}>
            {broken ? reflectionName : recordName}
          </span>
        </p>
        <button
          type="button"
          className={styles.controlButton}
          aria-pressed={broken}
          onClick={() => setBroken((value) => !value)}
        >
          <Spectacles className={styles.controlGlasses} broken={broken} />
          <span>{broken ? toRecordLabel : toReflectionLabel}</span>
        </button>
      </div>

      {/* Katman değişimi ekran okuyucuya duyurulur — düğmenin kendi adı
          değişmiyor, değişen sayfanın tamamı */}
      <p className={styles.visuallyHidden} role="status" aria-live="polite">
        {broken ? liveReflection : liveRecord}
      </p>

      {children}
    </div>
  );
}
