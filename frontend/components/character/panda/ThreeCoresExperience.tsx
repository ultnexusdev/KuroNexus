import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./ThreeCoresExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function ThreeCoresExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="panda">
      {detail.character.name}
    </div>
  );
}
