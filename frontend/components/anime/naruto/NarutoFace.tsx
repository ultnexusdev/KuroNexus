import Image from "next/image";
import type { NarutoFigureRef } from "@/lib/anime/naruto";
import { ClanEmblem } from "./ClanEmblems";
import styles from "./NarutoFace.module.css";

/**
 * Kadro yüzleri — sayfanın her yerinde aynı küçük dairesel portre.
 *
 * "use client" YOK, bilinçli: takım kartları sunucuda, chakra/dönem
 * seçicileri istemcide çiziliyor; bileşen iki ağaçta da çalışıyor ve
 * durumu yok. Portre adresi çağırandan hazır gelir (sayfa DB satırlarını
 * tek istekte çözüp `faces` haritası kurar) — çip veri bilmez.
 *
 * Portre yoksa ad baş harfiyle çizilir: kayıt dışı adlar (Shinju) ve
 * henüz portresi yüklenmemiş kişiler sayfayı kırmaz (boş oda yasağının
 * çip hâli — boş çerçeve yerine harf mühürü).
 */
export function NarutoFace({
  src,
  label,
  size = 26,
}: {
  src: string | null;
  label: string;
  size?: number;
}) {
  return (
    <span
      className={styles.face}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${Math.ceil(size * 1.5)}px`} />
      ) : (
        <span className={styles.initial}>{label.charAt(0)}</span>
      )}
    </span>
  );
}

/**
 * Figür çipi: yüz (kişi), amblem (klan) ya da harf + etiket.
 * `faces` haritası sayfada kurulur: slug → mutlak görsel adresi | null.
 */
export function NarutoFigureChip({
  figure,
  faces,
}: {
  figure: NarutoFigureRef;
  faces: Record<string, string | null>;
}) {
  return (
    <span className={styles.chip}>
      {figure.clan ? (
        <span className={styles.chipEmblem} aria-hidden>
          <ClanEmblem clan={figure.clan} />
        </span>
      ) : (
        <NarutoFace
          src={figure.person ? (faces[figure.person] ?? null) : null}
          label={figure.label}
          size={22}
        />
      )}
      <span className={styles.chipLabel}>{figure.label}</span>
    </span>
  );
}
