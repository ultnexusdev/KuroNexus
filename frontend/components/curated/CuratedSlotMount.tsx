"use client";

import dynamic from "next/dynamic";
import type { CuratedImageRecord } from "@/lib/api/curated-images";
import type { CuratedSlotView } from "@/lib/curated/contract";

/**
 * Düzenleyicinin İNCE İSKELESİ.
 *
 * Tek işi var: `next/dynamic` + `ssr: false` bir sunucu bileşeninin içinden
 * çağrılamaz, o yüzden araya bir istemci sınırı gerekiyor. `CuratorSlot`
 * (anime kanadı) tam olarak aynı işi aynı gerekçeyle yapıyor.
 *
 * ⚠️ Bu dosya YALNIZCA `isAdmin` iken çiziliyor — kesme sunucuda
 * (`CuratedImage`), yani ziyaretçi bu parçayı hiç indirmiyor. Altmış yuva
 * aynı parçayı paylaşıyor: ek maliyet yalnızca ilk açılışta.
 *
 * `data-curator-slot` işareti küratör anahtarının onu bulmasını sağlıyor
 * (`CuratorFrame`): anahtar kapalıyken CSS bu düğümü gizliyor.
 */
const CuratedSlotEditor = dynamic(
  () => import("./CuratedSlotEditor").then((mod) => mod.CuratedSlotEditor),
  { ssr: false },
);

export function CuratedSlotMount({
  surface,
  slot,
  record,
}: {
  surface: string;
  slot: CuratedSlotView;
  record: CuratedImageRecord | null;
}) {
  return (
    <span data-curator-slot>
      <CuratedSlotEditor surface={surface} slot={slot} record={record} />
    </span>
  );
}
