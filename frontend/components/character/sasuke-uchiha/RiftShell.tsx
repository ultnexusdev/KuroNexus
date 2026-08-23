"use client";

import { useState, type ReactNode } from "react";
import type { SasukePathKey } from "@/lib/characters/sasuke-uchiha-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { SasukeEyeDisc } from "./SasukeEyes";
import { TwinEyes, type TwinEyesContent } from "./TwinEyes";
import styles from "./SasukeExperience.module.css";

/**
 * Sayfanın kabuğu — yarığı taşıyan tek istemci adası.
 *
 * İki durum tutuyor, ikisi de bütün sayfayı ilgilendirdiği için burada:
 *
 *   `mode`  → Rinnegan modu. Sayfa mora döner, Amaterasu'nun kara alevi
 *             kenarlardan sızar. Etkinin tamamı CSS'te (`data-mode`).
 *   `path`  → seçilen yol. Yarık kayar, palet ağırlığı döner, o yolun
 *             paneli açılır (`data-path`; seçilmemişken "balanced").
 *
 * Sayfanın GÖVDESİ sunucuda çizilip buraya ReactNode olarak giriyor
 * (`head` / `tail` ve `twin.panels`) — GenjutsuShell'in kompozisyon dersi:
 * tarayıcıya inen JS yalnızca bu iki durum ve iki düğme, on beş bölümlük
 * metin değil.
 *
 * Çift göz diski gövdenin ORTASINDA duruyor ve `path`i o kuruyor; bu yüzden
 * sayfa "üst yarı + göz + alt yarı" diye üç parça hâlinde geliyor.
 */
export function RiftShell({
  isAdmin,
  modeEnterLabel,
  modeExitLabel,
  head,
  twin,
  tail,
}: {
  /** Kürator anahtarı sayfanın derisinin İÇİNDE kalsın diye burada */
  isAdmin: boolean;
  modeEnterLabel: string;
  modeExitLabel: string;
  /** Hero, künye ve laboratuvar — sunucuda çizilmiş */
  head: ReactNode;
  /** Çift göz bölümünün içeriği (düz dizeler + sunucuda çizilmiş paneller) */
  twin: TwinEyesContent;
  /** Kader çizelgesi ve kapanış — sunucuda çizilmiş */
  tail: ReactNode;
}) {
  const [mode, setMode] = useState(false);
  const [path, setPath] = useState<SasukePathKey | null>(null);

  /* Aynı göze yeniden basmak dengeye döndürür: `aria-pressed` böylece
     dürüst kalıyor — basılı düğme gerçekten geri alınabiliyor. */
  const choose = (key: SasukePathKey) =>
    setPath((current) => (current === key ? null : key));

  /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor. */
  return (
    <div
      className={styles.page}
      data-world="sasuke-uchiha"
      data-path={path ?? "balanced"}
      data-mode={mode ? "rinnegan" : undefined}
    >
      {/* Yarık: sayfa boyunca inen çizgi + kaydırmayla inen kıvılcım */}
      <span className={styles.rift} aria-hidden>
        <span className={styles.riftSpark} />
      </span>
      {/* İki kanadın atmosferi — seçilen yola göre ağırlık değiştirir */}
      <span className={styles.wings} aria-hidden />
      {/* Rinnegan modunun kara alevi — mod kapalıyken tamamen görünmez */}
      <span className={styles.blackFlame} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={mode}
        onClick={() => setMode((value) => !value)}
      >
        <SasukeEyeDisc
          variant="rinnegan"
          className={styles.modeIcon}
          baseClassName={styles.eyeBase}
          awakenedClassName={styles.eyeAwakened}
          spinClassName={styles.eyeSpin}
        />
        <span>{mode ? modeExitLabel : modeEnterLabel}</span>
      </button>

      {/* Kürator anahtarı sayfa derisinin içinde: bar da dünyanın
          token'larıyla boyanıyor, ziyaretçide hiç çizilmiyor. */}
      <CuratorFrame isAdmin={isAdmin}>
        {head}
        <TwinEyes {...twin} active={path} onSelect={choose} />
        {tail}
      </CuratorFrame>
    </div>
  );
}
