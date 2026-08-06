"use client";

import dynamic from "next/dynamic";
import type { CharacterImageSlotName } from "@/lib/api/types";

/**
 * Bir yükleme yuvası.
 *
 * `data-curator-slot` işareti kürator anahtarının onu bulmasını sağlıyor
 * (bkz. `CuratorFrame`): anahtar kapalıyken CSS bu düğümü gizliyor.
 *
 * Yükleyicinin kendisi `next/dynamic` + `ssr: false` ile iniyor — sayfada
 * birden çok yuva var ve hepsi aynı parçayı paylaşıyor, yani ek maliyet
 * yalnızca ilk açılışta.
 */
const CuratorUpload = dynamic(
  () => import("./CuratorUpload").then((mod) => mod.CuratorUpload),
  { ssr: false },
);

export function CuratorSlot({
  characterId,
  slot,
  abilityName,
  label,
}: {
  characterId: number;
  slot: CharacterImageSlotName;
  abilityName?: string;
  label: string;
}) {
  return (
    <div data-curator-slot>
      <CuratorUpload
        characterId={characterId}
        slot={slot}
        abilityName={abilityName}
        label={label}
      />
    </div>
  );
}
