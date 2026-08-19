import { apiUrl } from "@/lib/api/client";
import type { ClubLineup, ClubLineupSlot } from "@/lib/api/football-live";
import { Reveal } from "@/components/sport/Reveal";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./FavouriteEleven.module.css";

/**
 * Küratörün favori ilk 11'i — kuş bakışı saha.
 *
 * ── BU BİR MAÇ KADROSU DEĞİL ─────────────────────────────────────────────
 * ⚠️ Başlık ve alt metin bunu AÇIKÇA söylüyor. Teknik direktörün gerçek
 * dizilişi elimizde yok (maç kadrosu ücretli sağlayıcıda) ve "ilk 11" diye
 * sunmak, uydurma veri göstermenin en sinsi hâli olurdu: sayfadaki her şey
 * gerçek veriyken aradaki tek kurgu fark edilmezdi. Bu bölüm küratörün
 * seçimi ve öyle etiketli.
 *
 * ── NEDEN KOORDİNAT TABLOSU ──────────────────────────────────────────────
 * Yuvalar sahaya yüzde koordinatlarla konuyor, ızgarayla değil. Futbol sahası
 * bir ızgara değil: stoperler birbirine yakın, bekler kenara yapışık, ön
 * libero ikilisi orta çizginin hemen altında. Izgara bunların hepsini eşit
 * aralıklı yapardı ve diziliş "diziliş" gibi görünmezdi.
 *
 * y=0 rakip kalesi, y=100 kendi kalemiz — yani forvet YUKARIDA. Kullanıcının
 * örnek verdiği diziliş görselleri de bu yönde.
 */

/** 4-2-3-1 yuva koordinatları: [x%, y%] */
const FORMATION_4231: Record<string, [number, number]> = {
  ST: [50, 9],
  LAM: [17, 27],
  CAM: [50, 31],
  RAM: [83, 27],
  LDM: [34, 53],
  RDM: [66, 53],
  LB: [9, 74],
  LCB: [36, 79],
  RCB: [64, 79],
  RB: [91, 74],
  GK: [50, 93],
};

export function FavouriteEleven({
  lineup,
  labels,
}: {
  lineup: ClubLineup;
  labels: ElevenLabels;
}) {
  // Hiç yuva doldurulmamışsa bölüm çizilmiyor: boş bir saha, kurulmamış bir
  // 11'i "kurulmuş ama herkes kayıp" gibi gösterirdi.
  if (lineup.filled === 0) return null;

  return (
    <Reveal as="section" className={styles.section}>
      <header className={styles.head}>
        <div>
          <p className={shell.eyebrow}>{labels.eyebrow}</p>
          <h2 className={`${shell.display} ${shell.title}`}>{labels.title}</h2>
        </div>
        <p className={`${shell.data} ${styles.formation}`}>{lineup.formation}</p>
      </header>

      {labels.note ? <p className={styles.note}>{labels.note}</p> : null}

      <div className={styles.pitchWrap}>
        <div className={styles.pitch}>
          <PitchMarkings />
          {lineup.slots.map((slot) => {
            const at = FORMATION_4231[slot.slot];
            // Tanınmayan yuva çizilmiyor — koordinatı olmayan bir oyuncuyu
            // sahanın köşesine atmaktansa göstermemek doğrusu.
            if (!at) return null;
            return (
              <Spot
                key={slot.slot}
                slot={slot}
                x={at[0]}
                y={at[1]}
                emptyLabel={labels.emptySlot}
              />
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Saha çizgileri — tek bir SVG.
 *
 * Kütüphane yok, görsel yok: çizgiler `viewBox` içinde vektör. Böylece her
 * ölçekte keskin, indirilecek dosya sıfır ve renk token'dan geliyor.
 */
function PitchMarkings() {
  return (
    <svg
      className={styles.markings}
      viewBox="0 0 100 150"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* dış çizgi */}
      <rect x="2" y="2" width="96" height="146" />
      {/* orta saha */}
      <line x1="2" y1="75" x2="98" y2="75" />
      <circle cx="50" cy="75" r="12" />
      <circle cx="50" cy="75" r="0.8" className={styles.spotMark} />
      {/* üst ceza sahası (rakip kale) */}
      <rect x="26" y="2" width="48" height="20" />
      <rect x="38" y="2" width="24" height="8" />
      {/* alt ceza sahası (kendi kalemiz) */}
      <rect x="26" y="128" width="48" height="20" />
      <rect x="38" y="140" width="24" height="8" />
    </svg>
  );
}

function Spot({
  slot,
  x,
  y,
  emptyLabel,
}: {
  slot: ClubLineupSlot;
  x: number;
  y: number;
  emptyLabel: string;
}) {
  const player = slot.player;

  return (
    <div
      className={styles.spot}
      style={{ left: `${x}%`, top: `${y}%` }}
      data-empty={player ? undefined : ""}
    >
      <div className={styles.badge}>
        {player?.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={apiUrl(player.photo)}
            alt=""
            className={styles.photo}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={styles.photo} aria-hidden="true" />
        )}
        {player?.shirtNumber !== null && player?.shirtNumber !== undefined ? (
          <span className={`${shell.figure} ${styles.number}`}>
            {player.shirtNumber}
          </span>
        ) : null}
      </div>

      <p className={styles.name}>
        {player ? player.name : <span className={styles.empty}>{emptyLabel}</span>}
      </p>
      <p className={styles.slotLabel}>{slot.slot}</p>
    </div>
  );
}

export interface ElevenLabels {
  eyebrow: string;
  title: string;
  emptySlot: string;
  /** Küratörün notu — yoksa satır çizilmiyor */
  note: string | null;
}
