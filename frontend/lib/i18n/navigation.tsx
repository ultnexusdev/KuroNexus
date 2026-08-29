import type { ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";
import { NavPendingProbe } from "@/components/ui/NavPendingProbe";

const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);

export { redirect, usePathname, useRouter, getPathname };

/**
 * SITENIN TEK BAGLANTISI — ve rota yukleme katmaninin tek kaynagi.
 *
 * ── NEDEN BURASI SARILDI ─────────────────────────────────────────────────
 * `useLinkStatus()` yalnizca bir `<Link>`in ALTINDA calisiyor (`next/link`
 * ic context'i). Yani "gecis suruyor mu" bilgisini toplamak icin her
 * baglantinin icine girmek gerekiyor.
 *
 * Sitede bunun tek bir kapisi var: 143 dosyanin hepsi buradan import
 * ediyor ve `next/link` HICBIR yerde dogrudan kullanilmiyor (olculdu,
 * 29 Agustos 2026). Yani tek bir sarmalayici butun gezinmeyi kapsiyor --
 * 143 dosyaya dokunmadan.
 *
 * ⚠️ `NavPendingProbe` DOM'a hicbir sey eklemiyor (`null` donuyor), yani
 * `<a>`nin icerigi degismiyor: `:only-child`, `a > span` ve flex/gap ile
 * kurulmus baglantilarin hicbiri kaymiyor.
 *
 * ⚠️ Dosya `.ts` iken `.tsx` oldu; import yollari uzantisiz oldugu icin
 * cagiran tarafta hicbir sey degismedi.
 *
 * ⚠️ Sarmalayici KANCA KULLANMIYOR: hem sunucu hem istemci bilesenlerinden
 * cagrilabiliyor, tipki oncesinde oldugu gibi. `"use client"` sinirini
 * yalnizca `NavPendingProbe` tasiyor.
 */
export function Link({
  children,
  ...props
}: ComponentProps<typeof IntlLink>) {
  return (
    <IntlLink {...props}>
      {children}
      <NavPendingProbe />
    </IntlLink>
  );
}
