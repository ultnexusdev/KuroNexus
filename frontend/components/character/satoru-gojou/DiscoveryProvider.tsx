"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMotionSafe } from "./useMotionSafe";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · KEŞİF DURUMU.
 *
 * Sekiz keşifin hangilerinin bulunduğunu tutuyor ve ikisini kendisi
 * yönetiyor: `P` kısayolu ve Konami kodu. Kalanları ilgili bileşenler
 * `discover()` ile bildiriyor (S → mod düğmesi, D → sekans tetikleyicisi,
 * altı tıklama → hero işareti, üç mikro obje → kendi düğmeleri).
 *
 * ── NEDEN SAYFA DÜZEYİNDE ────────────────────────────────────────────────
 * BRIEF'in düzeltmesi: "gerçek easter egg'ler sayfanın tamamına dağıtılır,
 * bu bölüme değil". Keşifler beş ayrı bölümde tetikleniyor ama TEK bir
 * kayıtta toplanıyor — o yüzden durum en üstte.
 *
 * ── KALICILIK ────────────────────────────────────────────────────────────
 * `sessionStorage`. Mod tercihiyle aynı gerekçe: keşif bir hesap ayarı
 * değil, o ziyaretin bir hâli. Sekme kapanınca sıfırlanıyor ve sayfa
 * yeniden keşfedilebilir oluyor.
 *
 * ── KISAYOLLAR GİZLİ DEĞİL ───────────────────────────────────────────────
 * `S`, `D` ve `P` sayfadaki `sr-only` kısayol listesinde tanımlı. Kilitli
 * KAYIT ipucu vermiyor ama erişilebilirlik listesi veriyor — ekran okuyucu
 * kullanıcısı için erişilemez içerik kalmıyor (BRIEF şartı).
 */

const STORAGE_KEY = "gojo:eggs";

/** Konami: ↑↑↓↓←→←→ B A */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Mor ışının süresi — P04'teki tek geçişle aynı. */
const BEAM_MS = 700;

interface DiscoveryValue {
  found: ReadonlySet<string>;
  discover: (key: string) => void;
  reset: () => void;
}

const DiscoveryContext = createContext<DiscoveryValue | null>(null);

/** Sağlayıcı dışında güvenli varsayılan: hiçbir şey bulunmamış. */
export function useDiscovery(): DiscoveryValue {
  return (
    useContext(DiscoveryContext) ?? {
      found: new Set<string>(),
      discover: () => {},
      reset: () => {},
    }
  );
}

/** Yazı yazılan bir alan odakta mı? */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionSafe();
  const [found, setFound] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const [beam, setBeam] = useState(false);

  const konami = useRef(0);
  const beamTimer = useRef(0);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setFound(new Set<string>(JSON.parse(raw) as string[]));
    } catch {
      /* Depolama kapalı ya da kayıt bozuk: boş başla. */
    }
  }, []);

  const discover = useCallback((key: string) => {
    setFound((current) => {
      if (current.has(key)) return current;
      const next = new Set(current);
      next.add(key);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* Kalıcı olmuyor ama oturum içinde çalışıyor. */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFound(new Set<string>());
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* yukarıdaki gerekçe */
    }
  }, []);

  /* Mor ışın — tek geçiş, üst üste binmiyor (flaş limiti). */
  const firePurple = useCallback(() => {
    discover("purple");
    if (reducedMotion || beam) return;
    setBeam(true);
    window.clearTimeout(beamTimer.current);
    beamTimer.current = window.setTimeout(() => setBeam(false), BEAM_MS);
  }, [discover, reducedMotion, beam]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      /* Konami — sıra bozulunca baştan. Ok tuşları sayfayı kaydırmaya
         devam ediyor: `preventDefault` YOK, yani kod denemek gezinmeyi
         engellemiyor. */
      const expected = KONAMI[konami.current];
      if (event.key.toLowerCase() === expected.toLowerCase()) {
        konami.current += 1;
        if (konami.current === KONAMI.length) {
          konami.current = 0;
          discover("konami");
        }
      } else {
        /* Yanlış tuş: baştan başla — ama ilk tuşsa onu say. */
        konami.current =
          event.key.toLowerCase() === KONAMI[0].toLowerCase() ? 1 : 0;
      }

      if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        firePurple();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(beamTimer.current);
    };
  }, [discover, firePurple]);

  const value = useMemo<DiscoveryValue>(
    () => ({ found, discover, reset }),
    [found, discover, reset],
  );

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
      {beam ? <span className={styles.beam} aria-hidden="true" /> : null}
    </DiscoveryContext.Provider>
  );
}
