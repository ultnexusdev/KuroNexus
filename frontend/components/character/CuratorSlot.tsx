"use client";

import dynamic from "next/dynamic";

/**
 * Bir yükleme yuvası.
 *
 * `data-curator-slot` işareti kürator anahtarının onu bulmasını sağlıyor
 * (bkz. `CuratorFrame`): anahtar kapalıyken CSS bu düğümü gizliyor.
 *
 * Yükleyicinin kendisi `next/dynamic` + `ssr: false` ile iniyor — sayfada
 * birden çok yuva var ve hepsi aynı parçayı paylaşıyor, yani ek maliyet
 * yalnızca ilk açılışta.
 *
 * `next/dynamic`in `ssr: false` seçeneği sunucu bileşeninde kullanılamıyor;
 * bu dosyanın var olma sebebi o.
 */
const CuratorUpload = dynamic(
  () => import("./CuratorUpload").then((mod) => mod.CuratorUpload),
  { ssr: false },
);

export function CuratorSlot({ slot }: { slot: string }) {
  return (
    <div data-curator-slot>
      <CuratorUpload slot={slot} />
    </div>
  );
}
