"use client";

import { useEffect, useState } from "react";

/**
 * SATORU GOJŌ · HAREKET VE GİRDİ TESPİTİ — TEK YER.
 *
 * BRIEF · hareket sözleşmesi iki ayrı kapıya dayanıyor ve ikisi sayfanın
 * her yerinde tekrar tekrar sorulacak:
 *
 *   · `prefers-reduced-motion: reduce` → scroll hijack, parallax, otomatik
 *     sekans, partikül ve deformasyon KAPANIR. İçerik statik ve tam okunur
 *     kalır; hiçbir bilgi yalnızca animasyon içinde sunulmaz.
 *   · Dokunmatik → `InfinityField` pasif, scroll hijack HİÇ çalışmaz,
 *     hover mekaniklerinin yerini tap/drag alır.
 *
 * İkisini tek yerde toplamanın sebebi tutarlılık: on bir bölüm aynı soruyu
 * on bir kez kendi yöntemiyle sorarsa bir tanesi kaçınılmaz olarak yanlış
 * sorar. Emsal ev içinde de var — sayfaların animasyon kapısı ya
 * `@media (prefers-reduced-motion: no-preference)` içinde ya da dosya
 * sonunda bir `reduce` battaniyesiyle kapanıyor; JS tarafının karşılığı bu.
 *
 * ── SUNUCUDA HANGİ DEĞER ─────────────────────────────────────────────────
 * Sunucu medya sorgusunu bilemez. Başlangıç değeri BİLEREK "hareket
 * güvenli değil" tarafında: `reducedMotion: true`, `coarsePointer: false`.
 * Yani JS inene kadar hiçbir efekt başlamıyor. Ters varsayım (animasyon
 * açık başlat, sonra kapat) tam olarak korunmak istenen kullanıcıya bir
 * kare de olsa hareket gösterirdi.
 */

export interface MotionSafeState {
  /** `true` iken bütün hareket kapalı olmalı */
  reducedMotion: boolean;
  /** Kaba işaretçi (parmak) — hover mekaniği yok */
  coarsePointer: boolean;
  /** Efekt çalıştırmak serbest mi (kısayol: hareket açık VE ince işaretçi) */
  pointerEffects: boolean;
}

export function useMotionSafe(): MotionSafeState {
  const [state, setState] = useState<MotionSafeState>({
    reducedMotion: true,
    coarsePointer: false,
    pointerEffects: false,
  });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: coarse)");

    /* Tercih ayarlardan DEĞİŞEBİLİR: iki sorgu da dinleniyor, tek
       okumayla bırakılmıyor. */
    const sync = () => {
      const reducedMotion = motion.matches;
      const coarsePointer = pointer.matches;
      setState({
        reducedMotion,
        coarsePointer,
        pointerEffects: !reducedMotion && !coarsePointer,
      });
    };

    sync();
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
    };
  }, []);

  return state;
}
