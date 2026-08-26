"use client";

import dynamic from "next/dynamic";

/**
 * P03'ün efekt dalı — AYRI PARÇA.
 *
 * `ssr: false`: scroll kilidi sunucu çıktısında hiç yok. Bölümün
 * okunabilir iskeleti (ızgara, kutucuklar, `sr-only` düz metin) bu parça
 * hiç inmese de eksiksiz duruyor — kilit bir gösteri, taşıyıcı değil.
 */
const InfinityScroll = dynamic(
  () => import("./InfinityScroll").then((mod) => mod.InfinityScroll),
  { ssr: false },
);

export function LimitlessEffects({
  line,
  escapeHint,
}: {
  line: string;
  escapeHint: string;
}) {
  return <InfinityScroll line={line} escapeHint={escapeHint} />;
}
