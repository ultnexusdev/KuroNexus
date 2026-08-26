"use client";

import dynamic from "next/dynamic";

/**
 * P07'nin efekt dalı — AYRI PARÇA.
 *
 * ⚠️ Bu sarmalayıcı gerekli: `next/dynamic` + `ssr: false` bir SUNUCU
 * bileşeninin içinde kullanılamıyor (Next 15 App Router). Aynı desen
 * sayfada üç yerde daha var (`HeroEffects`, `LimitlessEffects`,
 * `VoidTrigger`).
 *
 * `SplitDrift` yalnızca `--split` yazıyor; CSS varsayılanı 1 olduğu için
 * bu parça hiç inmese de bölüm ayrılmış ve çatlak kırılmış duruyor.
 */
const SplitDrift = dynamic(
  () => import("./SplitDrift").then((mod) => mod.SplitDrift),
  { ssr: false },
);

export function PairEffects() {
  return <SplitDrift />;
}
