"use client";

import dynamic from "next/dynamic";

/**
 * Hero'nun efekt dalı — AYRI PARÇA.
 *
 * BRIEF · kabul kriteri: "Hero, efekt JS'i yüklenmeden tam olarak render
 * oluyor." Bunun kanıtı `ssr: false`: `InfinityField` sunucu çıktısında
 * HİÇ yok, ayrı bir parçada iniyor ve kompozisyon o parça hiç inmese de
 * eksiksiz duruyor (parallax ve itme değerlerinin CSS'te varsayılanı var).
 *
 * Aynı desen ev içinde `CuratorSlot`ta da kullanılıyor.
 */
const InfinityField = dynamic(
  () => import("./InfinityField").then((mod) => mod.InfinityField),
  { ssr: false },
);

export function HeroEffects() {
  return <InfinityField />;
}
