import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./ArmoryExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function ArmoryExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="maki-zenin">
      {detail.character.name}
    </div>
  );
}
