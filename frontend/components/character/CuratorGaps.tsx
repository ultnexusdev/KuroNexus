"use client";

import { useCuratorMode } from "./CuratorFrame";
import styles from "./CuratorGaps.module.css";

/**
 * "Hangi yuvalar boş" özeti — sayfanın en altında, DÜZENLEYİCİSİZ.
 *
 * ── NEDEN PAYLAŞILAN ALTYAPI ─────────────────────────────────────────────
 * Karakter sayfaları arasında bileşen paylaşımı YASAK (kullanıcı komutu,
 * 22 Ağustos 2026) — ama yasak TASARIM bileşenleri için. `CuratorFrame`,
 * `CuratorSlot` ve `CuratorUpload` baştan beri istisna: onlar sayfanın
 * görünüşünü değil küratör mekanizmasını taşıyor. Bu özet de aynı ailenin
 * dördüncü parçası: yükleme yuvalarının envanteri.
 *
 * Sayfaya özgü tek şey İÇERİĞİ (hangi yuvalar, ne ölçüde) ve o zaten
 * çağıran taraftan prop olarak geliyor.
 *
 * ── NEDEN YUVALARIN KENDİSİ YETMİYOR ─────────────────────────────────────
 * Her görselin altında zaten bir yükleme yuvası var (kullanıcı şartı). Ama
 * bir evren sayfası 20–30 yuva taşıyor ve hepsi sayfaya dağılmış durumda:
 * "bugün neyi yüklemem gerekiyor" sorusunun cevabı ancak sayfanın tamamı
 * kaydırılarak bulunuyordu. Bu blok o soruyu tek bakışta cevaplıyor.
 *
 * Yükleyici İÇERMİYOR (kullanıcı şartı: "düzenleyicisiz"). Dolu/boş
 * ayrımını gösteriyor, doldurma işi yuvanın kendisinde kalıyor.
 */
export interface CuratorGapRow {
  /** ABILITY anahtarı — `<önek>:<ad>` (yuvanın kendisiyle aynı) */
  key: string;
  /** Yuvanın sayfadaki adı; yuvadaki etiketle aynı metin */
  label: string;
  /** Beklenen kare: tip + ölçü (örn. "dikey portre · 1200×1600 · webp") */
  spec: string;
  /** O anahtarda görsel var mı */
  filled: boolean;
}

export function CuratorGaps({
  title,
  emptyLabel,
  filledLabel,
  allFilledLabel,
  rows,
}: {
  title: string;
  /** "boş" rozeti */
  emptyLabel: string;
  /** "dolu" rozeti */
  filledLabel: string;
  /** Hiç boş yuva kalmadığında yazılacak tek satır */
  allFilledLabel: string;
  rows: CuratorGapRow[];
}) {
  /* ⚠️ `=== false` — `!curating` DEĞİL. `undefined` "üstte çerçeve yok"
     demek ve o durumda blok çizilir; gerekçesi `CuratorFrame`deki üç
     durum tablosunda. Çağıran zaten `isAdmin` ile kesiyor. */
  const curating = useCuratorMode();
  if (curating === false) return null;
  if (rows.length === 0) return null;

  const bos = rows.filter((row) => !row.filled);

  return (
    <section className={styles.gaps} aria-labelledby="curator-gaps" data-curator-slot>
      <h2 id="curator-gaps" className={styles.title}>
        {title}
        <span className={styles.count}>
          {bos.length}/{rows.length}
        </span>
      </h2>
      {bos.length === 0 ? (
        <p className={styles.done}>{allFilledLabel}</p>
      ) : null}
      <ul className={styles.list}>
        {rows.map((row) => (
          <li key={row.key} className={styles.row} data-filled={row.filled ? "true" : "false"}>
            <span className={styles.badge}>
              {row.filled ? filledLabel : emptyLabel}
            </span>
            <span className={styles.body}>
              <span className={styles.label}>{row.label}</span>
              <span className={styles.spec}>{row.spec}</span>
              <code className={styles.key}>{row.key}</code>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
