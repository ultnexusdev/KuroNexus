"use client";

import { useEffect } from "react";
import { useLinkStatus } from "next/link";
import { beginNavPending } from "@/lib/nav/pending";

/**
 * Her `<Link>`in icine giren gorunmez dinleyici.
 *
 * ── NEDEN HER BAGLANTININ ICINDE ─────────────────────────────────────────
 * `useLinkStatus()` `next/link`in ic context'inden okuyor ve o context
 * yalnizca bir `<Link>`in ALTINDA var. Kok duzende cagrilirsa her zaman
 * `pending: false` doner -- yani gostergeyi tek bir yerden dinlemek
 * mumkun degil, kaynagina gitmek gerekiyor.
 *
 * Site bunu ucuz kiliyor: 143 dosyanin hepsi `@/lib/i18n/navigation`
 * uzerinden gecıyor ve `next/link` hicbir yerde dogrudan kullanilmiyor.
 * Yani tek bir sarmalayici butun baglantilara yetiyor.
 *
 * ── ⚠️ DOM'A HICBIR SEY EKLEMIYOR ────────────────────────────────────────
 * `null` donuyor: `<a>` icinde fazladan bir dugum olusmuyor. Bu onemli --
 * sitede `:only-child`, `a > span` ve flex/gap ile kurulmus onlarca
 * baglanti var ve gorunmez bir `<span>` hepsini sessizce kaydirirdi.
 */
export function NavPendingProbe() {
  const { pending } = useLinkStatus();

  useEffect(() => {
    if (!pending) return;
    /* Temizlik dogrudan serbest birakma islevi: gecis biterse de bilesen
       sokulurse de sayac dusuyor. */
    return beginNavPending();
  }, [pending]);

  return null;
}
