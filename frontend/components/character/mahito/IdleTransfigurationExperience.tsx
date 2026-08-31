import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./IdleTransfigurationExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function IdleTransfigurationExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="mahito">
      {detail.character.name}
    </div>
  );
}
