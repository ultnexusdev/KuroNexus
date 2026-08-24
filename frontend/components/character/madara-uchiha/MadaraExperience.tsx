import Image from "next/image";
import {
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import styles from "./MadaraExperience.module.css";

/**
 * Madara Uchiha — deneyim sayfası. **İSKELET SÜRÜM.**
 *
 * 24 Ağustos 2026'da rota ve deri ile birlikte açıldı; sayfanın tasarımı
 * ayrı bir dalda (`madara-redesign`) yazılıyor. İskelet bilerek ayakta: dal
 * birleşmeden adres açılırsa ziyaretçi kırık sayfa değil künye portresini
 * görür ve doğru paletle görür.
 *
 * Yerine geçecek sürüm bu imzayı korumalı (`CharacterExperienceProps`)
 * ve kök öğede `className={styles.page}` + `data-world="madara-uchiha"`
 * ikilisini korumalı — deri bloğu o seçiciye bağlı.
 */
export function MadaraExperience({ detail }: CharacterExperienceProps) {
  const portrait = primaryPortrait(detail);
  return (
    <div className={styles.page} data-world="madara-uchiha">
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
      <p>うちはマダラ</p>
    </div>
  );
}
