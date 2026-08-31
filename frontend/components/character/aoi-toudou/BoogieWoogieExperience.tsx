import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./BoogieWoogieExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function BoogieWoogieExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="aoi-toudou">
      {detail.character.name}
    </div>
  );
}
