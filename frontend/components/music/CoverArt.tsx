import Image from "next/image";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import styles from "./CoverArt.module.css";

/**
 * Albüm/sanatçı görseli — kapak inmemişse çizgili yer tutucu.
 *
 * ── NEDEN `next/image` GÜVENLE KULLANILIYOR ───────────────────────────────
 * Müzik görselleri **her zaman** kendi sunucumuzda (`/uploads/music/…`):
 * `music-artwork.service.ts` Spotify CDN'inden indirip yerelleştiriyor,
 * hotlink yok. `next.config.ts` `remotePatterns` bizim `/uploads/**` yolunu
 * kapsadığı için optimize edilebiliyorlar — yani `unoptimized` gerekmiyor.
 * Dış bir adres gelirse (yerelleştirme kapatılmışsa) yer tutucuya düşüyor:
 * CSP `img-src` Spotify CDN'ine izin vermediği için o görsel zaten çizilmezdi
 * ve kırık bir kutu göstermek yer tutucudan kötüdür.
 *
 * ── `sizes` İÇİNDE YÜZDE YOK ──────────────────────────────────────────────
 * `next.config.ts`teki uyarı: `sizes` içinde bir yüzde görünürse Next aday
 * listesini `640 × en_küçük_yüzde` altındaki bütün basamakları eleyerek kurar
 * ve 128/144/176 basamakları erişilemez olur. Kapaklar dar bir bantta
 * çizildiği için sabit px yazmak hem doğru hem bu tuzağı kapatıyor.
 */
export function CoverArt({
  src,
  alt,
  size,
  rounded = "md",
  priority = false,
}: {
  src: string | null | undefined;
  /** Boş dize kabul edilir: yer tutucu dekoratiftir, ekran okuyucu atlar */
  alt: string;
  /** Kutunun px genişliği — `sizes` ve `width/height` bundan türetiliyor */
  size: number;
  rounded?: "sm" | "md" | "full";
  priority?: boolean;
}) {
  const local = isLocalUpload(src);
  const radius =
    rounded === "full" ? styles.full : rounded === "sm" ? styles.sm : styles.md;

  if (!local) {
    return (
      <div
        className={`${styles.box} ${styles.hatch} ${radius}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`${styles.box} ${radius}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={apiUrl(src as string)}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className={styles.image}
      />
    </div>
  );
}

/**
 * Oranı korunan esnek kapak (ızgara hücresi). Sabit px yerine hücreyi
 * dolduruyor; `cellPx` yalnızca `sizes` için ölçülen tipik genişlik.
 */
export function CoverTile({
  src,
  alt,
  cellPx,
}: {
  src: string | null | undefined;
  alt: string;
  cellPx: number;
}) {
  const local = isLocalUpload(src);
  if (!local) {
    return <div className={`${styles.tile} ${styles.hatch}`} aria-hidden="true" />;
  }
  return (
    <div className={styles.tile}>
      <Image
        src={apiUrl(src as string)}
        alt={alt}
        fill
        sizes={`${cellPx}px`}
        className={styles.image}
      />
    </div>
  );
}
