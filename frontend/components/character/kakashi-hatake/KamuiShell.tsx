"use client";

import { useState } from "react";
import { KamuiGlyph } from "./LedgerMarks";
import styles from "./KakashiExperience.module.css";

/**
 * Kamui modu kabuğu.
 *
 * İnce bir istemci sarmalayıcı: sayfanın kökünü çizer ve TEK durum tutar
 * (`data-kamui`). Modun bütün etkisi CSS'te — kenarlar merkeze doğru
 * emiliyormuş gibi geometrik burulma (transform + clip-path) ve palet
 * mora kayıyor. Titreşim ve kromatik sapma bilerek YOK: Itachi'nin modu
 * bağırır, Kakashi'ninki susar.
 *
 * Çocuklar sunucuda çizilmiş gelir; kabuk onları yalnızca taşır, yani
 * sayfanın gövdesi tarayıcıya JS olarak inmez (GenjutsuShell emsali).
 *
 * Anahtarın kendisi bir DOLAP KOLU: sayfanın sağ kenarına yaslanmış,
 * dikey yazılmış ince bir plaka. Kartoteks fikrinin devamı, üstelik
 * yuvarlak yüzen düğmeden farklı bir yerde durduğu için Itachi'nin
 * madalyonuyla karışmıyor.
 */
export function KamuiShell({
  enterLabel,
  exitLabel,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor */
  return (
    <div
      className={styles.page}
      data-world="kakashi-hatake"
      data-kamui={active || undefined}
    >
      <button
        type="button"
        className={styles.kamuiPull}
        aria-pressed={active}
        onClick={() => setActive((value) => !value)}
      >
        <KamuiGlyph className={styles.kamuiPullMark} />
        <span className={styles.kamuiPullText}>
          {active ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Girdap örtüsü: mod kapalıyken tamamen saydam, tıklama geçirmez */}
      <span className={styles.kamuiVeil} aria-hidden />
      {children}
    </div>
  );
}
