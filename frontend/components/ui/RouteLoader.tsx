"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useDelayedVisible } from "@/hooks/useDelayedVisible";
import {
  getNavPending,
  getNavPendingServer,
  subscribeNavPending,
} from "@/lib/nav/pending";
import KuroLoader from "./KuroLoader";

/**
 * ROTA GECIS KATMANI — kok duzende, sayfalarin ustunde.
 *
 * ── NEDEN `loading.tsx` DEGIL ────────────────────────────────────────────
 * Ilk tasarim her salon segmentine bir `loading.tsx` koymakti. YAPILMADI:
 * `loading.tsx` bulundugu segmenti akisa (streaming) ceviriyor, HTTP
 * basliklari govde cozulmeden gidiyor ve alttaki `notFound()` artik durum
 * kodunu degistiremiyor. Depoda bu olculmus bir tutanak (2026-08-06,
 * dark-stories arsivleri); kok segmente konsaydi sitedeki **41
 * `notFound()` rotasinin hepsi 404 yerine 200** donerdi -- yani olmayan
 * her adres indekslenebilir bir sayfaya donusurdu.
 *
 * Bu katman rotalara hic dokunmuyor: gecisi istemci tarafinda dinliyor,
 * sunucu yanitini hic degistirmiyor. 404'ler oldugu gibi kaliyor.
 *
 * ── ⚠️ CLS'YE DOKUNMUYOR ─────────────────────────────────────────────────
 * `position: fixed` -- akisin disinda. Gorunmedigi surece `null` donuyor,
 * yani DOM'da bir dugum bile yok.
 */
export function RouteLoader() {
  const t = useTranslations("common");

  const pending = useSyncExternalStore(
    subscribeNavPending,
    getNavPending,
    getNavPendingServer,
  );

  const phase = useDelayedVisible(pending);
  const visible = phase !== "hidden";

  /* ── ARKA PLAN ODAKLANAMAZ ──────────────────────────────────────────
     Katman ekrani kapatiyor ama klavye onu bilmiyor: Tab tusu altta
     kalan baglantilarda gezmeye devam ederdi ve odak, birazdan
     sokulecek bir agacin icinde kalirdi.

     ⚠️ HANGI OGELERI KAPATTIGIMIZI KAYDEDIYORUZ. Temizlikte "hepsinden
     inert'i kaldir" demek, baska bir sebeple (acik bir modal) zaten
     inert olan bir ogeyi de acardi. Yalnizca kendi bastigimiz nitelik
     geri aliniyor. */
  const inerted = useRef<Element[]>([]);

  useEffect(() => {
    if (!visible) return;

    const overlay = document.querySelector("[data-route-loader]");
    const touched: Element[] = [];

    for (const child of Array.from(document.body.children)) {
      if (child === overlay) continue;
      if (child.hasAttribute("inert")) continue;
      child.setAttribute("inert", "");
      touched.push(child);
    }
    inerted.current = touched;

    return () => {
      for (const child of inerted.current) child.removeAttribute("inert");
      inerted.current = [];
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div data-route-loader>
      <KuroLoader
        overlay
        /* ⚠️ 0: giris zamanlamasini burada `useDelayedVisible` yapiyor.
           Bilesenin kendi CSS gecikmesi de acik kalsaydi katman 180+180
           = 360ms sonra gorunurdu. */
        enterDelay={0}
        leaving={phase === "leaving"}
        label={t("routeLoading")}
      />
    </div>
  );
}
