"use client";

import dynamic from "next/dynamic";
import type { CharacterImageSlotName } from "@/lib/api/types";
import { useCuratorMode } from "./CuratorFrame";

/**
 * Bir yükleme yuvası.
 *
 * ── ⚠️ KAPALIYKEN HİÇ ÇİZİLMİYOR (29 Ağustos 2026) ───────────────────────
 * Eskiden yuva her zaman mount ediliyor, küratör anahtarı kapalıyken
 * yalnızca CSS onu gizliyordu (`data-curator-slot` → `display: none`).
 * Yani yükleyici adası indiriliyor, durumunu tutuyor ve DOM'da duruyordu.
 * Kullanıcı isteği bunun tersi: kapalıyken **render edilmesin**.
 *
 * `useCuratorMode()` `CuratorFrame`in gerçek durumunu okuyor. Nitelik
 * işareti KALDIRILMADI: sayfadaki sunucu-tarafı iskeleler (Bleach'in
 * kadraj notları, ızgara açılımları) hâlâ CSS ile açılıp kapanıyor ve
 * ikisi birbirinin yerine geçemez — gerekçesi `CuratorFrame` başlığında.
 *
 * Yükleyicinin kendisi `next/dynamic` + `ssr: false` ile iniyor — sayfada
 * birden çok yuva var ve hepsi aynı parçayı paylaşıyor, yani ek maliyet
 * yalnızca ilk açılışta. Artık o maliyet de yalnızca mod AÇIKKEN doğuyor.
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
  current,
  size,
}: {
  characterId: number;
  slot: CharacterImageSlotName;
  abilityName?: string;
  label: string;
  /**
   * Yuvada ŞU AN duran kare — varsa yükleyici boş kutu yerine önizleme
   * çiziyor. `id` kaldırma çağrısı için gerekli.
   */
  current?: { id: string; url: string } | null;
  /** Önerilen piksel boyutu — küratör kareyi buna göre hazırlasın */
  size?: { w: number; h: number };
}) {
  /* ⚠️ `=== false` — `!curating` DEĞİL. `undefined` "üstte çerçeve yok"
     demek ve o durumda eski davranış sürüyor: yuva çiziliyor, gizlemeyi
     CSS yapıyor. Gerekçesi `CuratorFrame`deki üç durum tablosunda.
     `!curating` yazmak, zinciri bir yerde kopuk olan her yuvayı
     yöneticiden de sessizce silerdi. */
  const curating = useCuratorMode();
  if (curating === false) return null;

  return (
    <div data-curator-slot>
      <CuratorUpload
        characterId={characterId}
        slot={slot}
        abilityName={abilityName}
        label={label}
        current={current}
        size={size}
      />
    </div>
  );
}
