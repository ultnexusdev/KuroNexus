import Image from "next/image";
import { tmdbImage } from "@/lib/api/tmdb";
import styles from "./Media.module.css";

/**
 * Kadro kartı — film ve dizi sayfalarının ortak parçası (D-F3; iki kanatta
 * birebir kopyaydı).
 *
 * Tip yapısal: `MovieCastMember` ile `ShowCastMember` aynı üç alanı taşıyor,
 * ikisi de olduğu gibi geçirilebiliyor. Ortak bir "CastMember" tipi
 * TANIMLANMADI — iki kanadın API tipleri bilinçli olarak ayrı yaşıyor
 * (backend sözleşmeleri ayrı), burada yalnızca kesişimleri okunuyor.
 */
export function CastCard({
  member,
}: {
  member: { name: string; character: string | null; profilePath: string | null };
}) {
  const photo = tmdbImage(member.profilePath, "w185");
  return (
    <li className={styles.castCard}>
      <span className={styles.castPhoto}>
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="88px"
            className={styles.castImg}
            unoptimized
          />
        ) : (
          <span className={styles.castInitial} aria-hidden>
            {member.name.slice(0, 1)}
          </span>
        )}
      </span>
      <span className={styles.castName}>{member.name}</span>
      {member.character ? (
        <span className={styles.castRole}>{member.character}</span>
      ) : null}
    </li>
  );
}
