import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./RikaExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function RikaExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="yuuta-okkotsu">
      {detail.character.name}
    </div>
  );
}
