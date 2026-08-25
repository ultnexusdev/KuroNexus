"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ObitoVoice } from "@/lib/characters/obito-uchiha-experience";
import { MaskGlyph } from "./ObitoGlyphs";
import styles from "./ObitoExperience.module.css";

/**
 * Sayfanın kökü ve TEK durum sahibi.
 *
 * İki bağımsız durum tutuyor ve ikisi de yalnızca bir NİTELİK yazıyor;
 * görsel etkinin tamamı CSS'te (`.page[data-voice="…"]`, `.page[data-fallen]`).
 * JS hiçbir stil hesaplamıyor.
 *
 *   voice   — hangi ad katmanının sesi açık. Sayfanın bütün bölüm
 *             başlıkları ve giriş cümleleri dört sesli yazıldı; dördü de
 *             SUNUCUDA çizilip DOM'a giriyor, CSS yalnızca birini
 *             gösteriyor. `display: none` erişilebilirlik ağacından da
 *             çıkardığı için ekran okuyucu da tek başlık duyuyor ve
 *             `aria-labelledby` hedefi hep aynı düğüm kalıyor.
 *   fallen  — "Maske düşüyor" modu. Maske katmanı tamamen kalkar, yara
 *             izleri görünür, palet ısırır.
 *
 * ── NEDEN İKİSİ AYRI ─────────────────────────────────────────────────────
 * Mod düğmesi seçili adı DEĞİŞTİRMİYOR, bilerek: maske düşmüşken bile
 * sayfayı Madara'nın ağzından okumaya devam edebiliyorsun. Karakterin
 * tamamı zaten bu: yüz ortada, ses hâlâ başkasının.
 *
 * ── KOMPOZİSYON ──────────────────────────────────────────────────────────
 * Çocuklar SUNUCUDA çizilmiş gelir; bu bileşen onları yalnızca taşır.
 * `NameStack` de çocukların arasında duran bir istemci adası — sağlayıcı
 * kökte olduğu için bağlamı oradan alıyor. Sayfanın gövdesi tarayıcıya JS
 * olarak inmiyor.
 *
 * Kök <main> DEĞİL: kök düzen zaten <main id="icerik"> çiziyor.
 */

interface MaskState {
  voice: ObitoVoice;
  setVoice: (next: ObitoVoice) => void;
}

const MaskContext = createContext<MaskState | null>(null);

/** Ad katmanı seçicisinin bağlamı. Sağlayıcı dışında çağrılamaz. */
export function useMaskVoice(): MaskState {
  const value = useContext(MaskContext);
  if (!value) {
    throw new Error("useMaskVoice yalnızca MaskShell içinde kullanılabilir.");
  }
  return value;
}

export function MaskShell({
  enterLabel,
  exitLabel,
  hint,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [voice, setVoice] = useState<ObitoVoice>("tobi");
  const [fallen, setFallen] = useState(false);

  const value = useMemo<MaskState>(() => ({ voice, setVoice }), [voice]);

  return (
    <MaskContext.Provider value={value}>
      <div
        className={styles.page}
        data-world="obito-uchiha"
        data-voice={voice}
        data-fallen={fallen || undefined}
      >
        <button
          type="button"
          className={styles.fallToggle}
          aria-pressed={fallen}
          onClick={() => setFallen((current) => !current)}
        >
          <MaskGlyph
            idPrefix="obi-toggle"
            className={styles.fallToggleGlyph}
            coilClassName={styles.fallToggleCoil}
          />
          <span className={styles.fallToggleLabel}>
            {fallen ? exitLabel : enterLabel}
          </span>
        </button>
        {/* Modun ne yaptığını söyleyen satır. Düğmenin `aria-pressed`i
            durumu, bu satır anlamı veriyor. */}
        <p className={styles.fallHint} role="status">
          {fallen ? hint : ""}
        </p>

        {children}
      </div>
    </MaskContext.Provider>
  );
}
