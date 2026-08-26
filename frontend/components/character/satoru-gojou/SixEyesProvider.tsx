"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · İKİLİ MOD DURUMU + SAYFA KÖKÜ.
 *
 * Sayfanın iki modu var: `blindfold` ve `sixeyes`. Bu bir tema değişimi
 * DEĞİL — Six Eyes ikinci bir bilgi katmanını da açıyor (`RevealedData`).
 *
 * ── NEDEN KÖKÜ BU BİLEŞEN ÇİZİYOR ────────────────────────────────────────
 * Mod, sayfa kökündeki `data-mode` özniteliği. O özniteliğin React
 * durumundan gelmesi için kökü çizen bileşenin istemci bileşeni olması
 * gerekiyor. Ev emsali aynı: Nanami'nin `OvertimeShell`i ve Sukuna'nın kap
 * kabuğu da sayfa kökünü çizen küçük istemci sarmalayıcıları.
 *
 * ⚠️ SAYFANIN GERİ KALANI SUNUCUDA KALIYOR. `children` sunucuda çizilmiş
 * olarak buraya prop geçiyor; istemci sınırı yalnızca bu sarmalayıcının
 * kendisinde. Yani on bir bölümün hiçbiri istemciye inmiyor.
 *
 * ── RENGİ REACT DEĞİL CSS TAŞIYOR ────────────────────────────────────────
 * Bu bileşen tek bir öznitelik değiştiriyor; gerisini token'lar yapıyor
 * (`GojoExperience.module.css`, ikinci blok). Hiçbir bileşen moda göre
 * koşullu render yapmıyor — tek istisna `RevealedData` ve o da farkı JS
 * ile değil CSS ile üretiyor.
 *
 * ── KALICILIK ────────────────────────────────────────────────────────────
 * Tercih `sessionStorage`'da: oturum boyunca ve sayfa içi gezinmede
 * korunuyor, sekme kapanınca sıfırlanıyor — mod bir hesap ayarı değil,
 * o ziyaretin bir hâli.
 *
 * ⚠️ Sunucu HER ZAMAN `blindfold` çiziyor. Depoda `sixeyes` yazıyorsa geçiş
 * mount'tan sonra oluyor ve 400ms'lik token geçişi olarak görünüyor. Bunu
 * engellemenin yolu `<head>`e bloklayıcı bir satır içi betik koymak;
 * KONULMADI — sitenin CSP'si satır içi betiğe nonce şart koşuyor ve bu
 * sayfa için kök düzene dokunmak gerekirdi (sözleşme: paylaşılan dosya
 * değişmiyor). Görünen etki bir yanıp sönme değil, tasarlanmış bir geçiş.
 */

export type GojoMode = "blindfold" | "sixeyes";

/** Depolama anahtarı — sayfaya özel, çakışmasın diye önekli. */
const STORAGE_KEY = "gojo:mode";

interface SixEyesValue {
  mode: GojoMode;
  sixEyes: boolean;
  toggle: () => void;
  setMode: (mode: GojoMode) => void;
}

const SixEyesContext = createContext<SixEyesValue | null>(null);

/**
 * Mod durumunu okur.
 *
 * Sağlayıcı dışında çağrılırsa `blindfold` döner ve `toggle` sessizce
 * hiçbir şey yapmaz. Fırlatmak yerine güvenli varsayılana düşmek bilinçli:
 * bir ada yanlışlıkla sağlayıcı dışında çizilirse sayfa çökmemeli,
 * yalnızca gözbağlı kalmalı.
 */
export function useSixEyes(): SixEyesValue {
  const ctx = useContext(SixEyesContext);
  return (
    ctx ?? {
      mode: "blindfold",
      sixEyes: false,
      toggle: () => {},
      setMode: () => {},
    }
  );
}

/** Depoya yaz — gizli sekmede ya da depolama kapalıyken sessizce geç. */
function persist(mode: GojoMode) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* Yazılamazsa mod yine çalışıyor, sadece kalıcı olmuyor. */
  }
}

export function SixEyesProvider({
  fontClassName,
  children,
}: {
  /** Rotaya scope'lu font değişkenleri — kök öğede tek yerde uygulanır */
  fontClassName: string;
  children: ReactNode;
}) {
  /* Sunucuyla aynı başlangıç: hidrasyon uyuşmazlığı olmasın. */
  const [mode, setModeState] = useState<GojoMode>("blindfold");

  /* Depodaki tercihi mount'tan sonra uygula. */
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
      /* Gizli sekme ya da depolama kapalı: tercih yok, varsayılan kalır. */
    }
    if (saved === "sixeyes" || saved === "blindfold") {
      setModeState(saved);
    }
  }, []);

  const setMode = useCallback((next: GojoMode) => {
    setModeState(next);
    persist(next);
  }, []);

  const toggle = useCallback(() => {
    setModeState((current) => {
      const next: GojoMode = current === "sixeyes" ? "blindfold" : "sixeyes";
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo<SixEyesValue>(
    () => ({ mode, sixEyes: mode === "sixeyes", toggle, setMode }),
    [mode, toggle, setMode],
  );

  return (
    <SixEyesContext.Provider value={value}>
      {/* Kök öğe: ev sözleşmesi gereği `styles.page` + `data-world`
          ikilisini taşıyor, `<main>` DEĞİL (kök düzen zaten çiziyor). */}
      <div
        className={`${styles.page} ${fontClassName}`}
        data-world="satoru-gojou"
        data-mode={mode}
        data-gojo-root
      >
        {children}
      </div>
    </SixEyesContext.Provider>
  );
}
