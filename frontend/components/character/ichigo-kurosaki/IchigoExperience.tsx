import Image from "next/image";
import {
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";

/**
 * Ichigo Kurosaki — deneyim sayfası. **İSKELET SÜRÜM.**
 *
 * Bu dosya 22 Ağustos 2026'da rota dağıtıcısıyla birlikte açıldı ve
 * sayfanın tasarımı ayrı bir dalda (`ichigo-kurosaki-redesign`) yazılıyor.
 * İskelet bilerek ayakta: dal birleşmeden önce adres açılırsa ziyaretçi
 * kırık sayfa değil, en azından künye portresini görür.
 *
 * Dalda yerine geçecek olan sürüm bu imzayı korumalı
 * (`CharacterExperienceProps`) — rota dosyası bu adı ve bu propları
 * bekliyor.
 */
export function IchigoExperience({ detail }: CharacterExperienceProps) {
  const portrait = primaryPortrait(detail);
  return (
    <div data-world="ichigo-kurosaki">
      {portrait ? (
        <Image
          src={portrait}
          alt={detail.character.name}
          width={230}
          height={345}
          unoptimized={!isUploadedPortrait(detail)}
        />
      ) : null}
      <h1>{detail.character.name}</h1>
      {detail.character.nameNative ? <p>{detail.character.nameNative}</p> : null}
    </div>
  );
}
