import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./NotebookExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 2 ajanı bu dosyayı baştan yazacak. */
export function NotebookExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="izuku-midoriya">
      {detail.character.name}
    </div>
  );
}
