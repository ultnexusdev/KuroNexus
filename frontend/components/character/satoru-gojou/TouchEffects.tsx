"use client";

import dynamic from "next/dynamic";

/**
 * P10'un efekt dalı — AYRI PARÇA.
 *
 * `ssr: false`: dokunma denemesi sunucu çıktısında hiç yok. Bölümün
 * anlatısı (`prose`) ondan tamamen bağımsız ve her koşulda DOM'da.
 */
const TouchWall = dynamic(
  () => import("./TouchWall").then((mod) => mod.TouchWall),
  { ssr: false },
);

export function TouchEffects(props: {
  distanceLabel: string;
  attemptsLabel: string;
  stoppedLabel: string;
  hintPointer: string;
  hintTouch: string;
  triggerLabel: string;
}) {
  return <TouchWall {...props} />;
}
