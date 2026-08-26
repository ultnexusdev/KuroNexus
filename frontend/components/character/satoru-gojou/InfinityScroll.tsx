"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionSafe } from "./useMotionSafe";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · INFINITY SCROLL — sayfadaki TEK scroll hijack'i.
 *
 * Kullanıcı bölümden aşağı inmeye çalışırken tekerlek kısa bir süre
 * yanıtsız kalıyor; ekranda `∞` ve tek bir cümle beliriyor; sonra kilit
 * kırılıyor ve scroll normale dönüyor.
 *
 * ══ HAREKET SÖZLEŞMESİ KURAL 3 — MADDE MADDE ═══════════════════════════
 * Aşağıdaki yedi şart pazarlık konusu değil ve her biri kodda ayrı ayrı
 * karşılanıyor:
 *
 *  1. SAYFA BAŞINA 1 KEZ. Tetiklendiği anda `sessionStorage`'a yazılıyor —
 *     üstelik kilit KURULMADAN ÖNCE. Kurulum patlasa bile bir daha
 *     tetiklenmiyor.
 *  2. SÜRE ≤ 1.5sn. İki zamanlayıcı var: yumuşak (1200ms, tasarlanan süre)
 *     ve SERT (1500ms, mutlak tavan). İkisi de kilidi açıyor.
 *  3. `Esc` ANINDA KIRAR. Dinleyici kilit kurulmadan ÖNCE ekleniyor.
 *  4. DOKUNMATİKTE HİÇ ÇALIŞMAZ. `coarsePointer` kapısı; ayrıca sadece
 *     `wheel` engelleniyor, `touchmove` hiç dinlenmiyor.
 *  5. REDUCED-MOTION'DA HİÇ ÇALIŞMAZ. `reducedMotion` kapısı.
 *  6. HATA DURUMUNDA `finally` İLE SERBEST. Kurulum bloğu bir `finally`
 *     taşıyor; kurulum tamamlanamazsa kilit anında açılıyor.
 *  7. TEMİZLİKTE SERBEST. Bileşen sökülürse effect cleanup her dinleyiciyi
 *     ve her zamanlayıcıyı kaldırıp kilidi açıyor.
 *
 * ══ NEDEN `overflow: hidden` DEĞİL ═════════════════════════════════════
 * Yaygın çözüm `body`ye `overflow: hidden` yazmak. BURADA KULLANILMADI:
 * o yöntem düzeni değiştiriyor (kaydırma çubuğu kaybolunca sayfa yatay
 * sıçrıyor) ve geri alınması gereken bir DURUM bırakıyor — yani bir hata
 * anında kullanıcı gerçekten kilitli kalabiliyor.
 *
 * Bunun yerine yalnızca `wheel` olayı `preventDefault` ediliyor. Hiçbir
 * stil değişmiyor, geri alınacak durum YOK; dinleyici kalksa bile sayfa
 * zaten normal. En kötü senaryoda bile kullanıcı kilitli kalmıyor.
 *
 * ══ KLAVYE BİLEREK ENGELLENMİYOR ═══════════════════════════════════════
 * Ok tuşları, Space, PageDown ve Tab hiç dinlenmiyor. Yani klavyeyle gezen
 * kullanıcı kilidi hiç hissetmiyor ve HER AN çıkabiliyor. Bu bir eksik
 * değil bilinçli bir tercih: efekt bir gösteri, bir hapishane değil.
 */

/** Tasarlanan kilit süresi. */
const LOCK_MS = 1200;

/** Mutlak tavan — hiçbir koşulda aşılmaz (BRIEF: ≤1.5sn). */
const HARD_MS = 1500;

/** Oturum bayrağı: bir kez çalıştıysa bir daha çalışmaz. */
const ONCE_KEY = "gojo:infinity-scroll";

export function InfinityScroll({
  line,
  escapeHint,
}: {
  /** Kilit sırasında beliren cümle (sunucuda dile göre seçilmiş) */
  line: string;
  /** `Esc` ipucu — kilit sırasında görünür */
  escapeHint: string;
}) {
  const { reducedMotion, coarsePointer } = useMotionSafe();
  const [locked, setLocked] = useState(false);

  /* Bir kez tetiklendi mi? Ref, çünkü değişimi yeniden çizim
     gerektirmiyor ve effect yeniden kurulsa bile korunmalı. */
  const spent = useRef(false);

  const eligible = !reducedMotion && !coarsePointer;

  useEffect(() => {
    /* KAPI 4 ve 5: dokunmatik ya da azaltılmış hareket → hiç kurulma. */
    if (!eligible) return;

    /* KAPI 1: bu oturumda zaten çalıştıysa hiç kurulma. */
    let already = false;
    try {
      already = window.sessionStorage.getItem(ONCE_KEY) === "done";
    } catch {
      /* Depolama kapalı: bayrak tutulamıyor. `spent` ref'i yine de
         aynı sayfa görüntülemesinde ikinci kez çalışmasını engelliyor. */
    }
    if (already || spent.current) return;

    const section = document.querySelector<HTMLElement>(
      "[data-gojo-limitless]",
    );
    if (!section) return;

    /* `released` kilidin TEK doğruluk kaynağı. React state'i yalnızca
       görüntüyü taşıyor; olay dinleyicisi bu değişkeni okuyor çünkü
       state güncellemesi asenkron. */
    let released = true;
    let softTimer = 0;
    let hardTimer = 0;

    const onWheel = (event: WheelEvent) => {
      if (!released) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      /* ŞART 3: Esc anında kırar. */
      if (event.key === "Escape") release();
    };

    function release() {
      if (released) return;
      released = true;
      window.clearTimeout(softTimer);
      window.clearTimeout(hardTimer);
      window.removeEventListener("wheel", onWheel);
      setLocked(false);
    }

    function engage() {
      if (spent.current) return;
      spent.current = true;

      /* ⚠️ SIRA ÖNEMLİ. Bayrak, kilit kurulmadan ÖNCE yazılıyor: aşağıdaki
         blok herhangi bir sebeple patlarsa bile efekt bir daha
         tetiklenmesin. */
      try {
        window.sessionStorage.setItem(ONCE_KEY, "done");
      } catch {
        /* Depolama yoksa `spent` ref'i devrede. */
      }

      let armed = false;
      try {
        /* Esc dinleyicisi kilitten ÖNCE ekleniyor: kilit kurulur kurulmaz
           çıkış yolu zaten açık olsun. */
        window.addEventListener("wheel", onWheel, { passive: false });
        released = false;
        setLocked(true);
        softTimer = window.setTimeout(release, LOCK_MS);
        /* ŞART 2: sert tavan. Yumuşak zamanlayıcı bir sebeple kurulamadıysa
           ya da temizlenemediyse bu her hâlükârda açar. */
        hardTimer = window.setTimeout(release, HARD_MS);
        armed = true;
      } finally {
        /* ŞART 6: kurulum yarıda kaldıysa kilidi ASLA açık bırakma. */
        if (!armed) release();
      }
    }

    /* Tetikleme: bölümün ortası ekranın orta bandına geldiğinde.
       `rootMargin` ile viewport'un üst ve alt %40'ı kırpılıyor, yani
       kullanıcı gerçekten bölümün içindeyken tetikleniyor. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            engage();
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    window.addEventListener("keydown", onKeyDown);
    observer.observe(section);

    return () => {
      /* ŞART 7: sökülürken her şey geri alınıyor ve kilit AÇILIYOR. */
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(softTimer);
      window.clearTimeout(hardTimer);
      released = true;
    };
  }, [eligible]);

  if (!locked) return null;

  /* Katman tamamen dekoratif: `aria-hidden` ve `pointer-events: none`.
     Aynı cümlenin okunabilir karşılığı bölümün statik iskeletinde
     `sr-only` olarak duruyor — yani bilgi yalnızca animasyonun içinde
     sunulmuyor (hareket sözleşmesi kural 1). */
  return (
    <div className={styles.lockLayer} aria-hidden="true">
      <span className={styles.lockMark}>∞</span>
      <span className={styles.lockLine}>{line}</span>
      <span className={styles.lockHint}>{escapeHint}</span>
    </div>
  );
}
