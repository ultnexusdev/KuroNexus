import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./HeavenRestrictionExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function HeavenRestrictionExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="touji-fushiguro">
      {detail.character.name}
    </div>
  );
}
