"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * SATORU GOJŌ · BÖLÜM EFEKTİ KAPISI.
 *
 * BRIEF iki şey istiyor ve ikisi de aynı gözleme dayanıyor:
 *   · Performans bütçesi — "bölüm efektleri `next/dynamic` +
 *     `IntersectionObserver` ile lazy import edilir".
 *   · Hareket sözleşmesi kural 4 — "viewport dışındaki bölümler
 *     `IntersectionObserver` ile duraklatılır".
 *
 * Bu bileşen o kapı. İçindeki efekt ağacı, bölüm viewport'a YAKLAŞANA
 * kadar hiç çizilmiyor; yani `next/dynamic` ile bölünmüş parça da o ana
 * kadar indirilmiyor.
 *
 * ⚠️ İÇERİK BURADAN GEÇMEZ. Yalnızca EFEKT geçer. Bölümün okunabilir
 * gövdesi sunucuda çizilen statik iskelette duruyor — aksi hâlde JS
 * inmeyen ya da gözlemcinin hiç tetiklenmediği bir ziyarette bilgi
 * kaybolurdu. Sınır net: buradan çıkan hiçbir şey silinirse sayfanın
 * ANLAMI eksilmemeli, yalnızca hareketi.
 *
 * `rootMargin` bilerek cömert: efektin ilk karesi kullanıcı bölüme
 * varmadan hazır olsun, bölüm görünür olduğu anda boş durmasın.
 */
export function SectionEffect({
  children,
  /** Gözlemin ne kadar erken tetikleneceği */
  rootMargin = "200px 0px",
  /** `false` iken efekt hiç mount edilmez (reduced-motion kapısı) */
  enabled = true,
}: {
  children: ReactNode;
  rootMargin?: string;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    /* Gözlemci desteklenmiyorsa efekt doğrudan açılıyor: eski bir
       tarayıcıda "hiç çalışmasın" değil "tembel yüklenmesin" doğru
       davranış. */
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setNear(true);
            /* Tek yönlü: bir kez yaklaştıysa parça zaten indi, tekrar
               sökmek yalnızca yeniden mount maliyeti üretirdi.
               Duraklatma işi ticker'ın `active` bayrağında. */
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return (
    <span ref={ref} data-gojo-effect={near ? "on" : "off"} aria-hidden="true">
      {enabled && near ? children : null}
    </span>
  );
}
