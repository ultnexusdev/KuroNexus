import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./HalfAndHalfExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 2 ajanı bu dosyayı baştan yazacak. */
export function HalfAndHalfExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="shouto-todoroki">
      {detail.character.name}
    </div>
  );
}
