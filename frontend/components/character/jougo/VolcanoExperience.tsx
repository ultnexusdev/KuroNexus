import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./VolcanoExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function VolcanoExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="jougo">
      {detail.character.name}
    </div>
  );
}
