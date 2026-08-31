import type { CharacterExperienceProps } from "@/lib/characters/experiences";
import styles from "./BloodlineExperience.module.css";

/** GEÇİCİ İSKELET — Dalga 4 ajanı bu dosyayı baştan yazacak. */
export function BloodlineExperience({ detail }: CharacterExperienceProps) {
  return (
    <div className={styles.page} data-world="chousou">
      {detail.character.name}
    </div>
  );
}
