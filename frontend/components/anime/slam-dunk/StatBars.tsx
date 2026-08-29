import { getTranslations } from "next-intl/server";
import { STAT_KEYS, type Stats } from "@/lib/anime/slam-dunk/types";
import styles from "./StatBars.module.css";

/**
 * DÖRT BAR — şut, savunma, ribaunt, hız.
 *
 * ── ⚠️ BU SAYILAR CANON DEĞİL ────────────────────────────────────────────
 * Slam Dunk'ın hiçbir resmî kaynağı oyuncuları sayısal derecelendirmiyor.
 * Değerler fandom künyelerindeki "Abilities / Strengths / Weakness"
 * bölümlerinden çıkarılmış ARŞİV DEĞERLENDİRMESİ.
 *
 * ⚠️ Bunu söyleyen kaynak notu kadro ızgarasının altında duruyordu ve
 * 29 Ağustos 2026'da kullanıcı kararıyla KALDIRILDI (gerekçe
 * `RosterGrid.tsx` başlığında). Yani sayfa artık bunu yazmıyor —
 * kaydın kendisi burada duruyor ve öyle kalmalı: bir gün bu değerleri
 * "canon veri" sanıp bir yere taşımak isteyen olursa duracağı yer burası.
 *
 * Boy, kilo, forma numarası ve mevki bunun DIŞINDA: onlar kaynağa sadık
 * ve kaynakta olmayan alan uydurulmuyor, "kayıt yok" yazıyor.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * Bar bir `<div>`in genişliği; hesaplanacak bir şey yok. Dolum animasyonu
 * `animation-timeline: view()` ile SAF CSS: destekleyen tarayıcı barları
 * göründükçe dolduruyor, desteklemeyen doğrudan dolu çiziyor. Hiçbir
 * durumda JS inmiyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Bar görsel bir süs değil, VERİ — o yüzden bir tanım listesi
 * (`<dl>` / `<dt>` / `<dd>`) ve sayı METİN olarak basılı. Ekran okuyucu
 * "Şut, 95" diyor; çubuğun kendisi görsel bir tekrar.
 *
 * ⚠️ `role="meter"` denenmedi ve bilerek: `aria-valuenow` taşıyan kırk beş
 * kartlık bir sayfada her kart dört ölçer açardı ve sayı zaten okunuyor.
 * Tanım listesi hem daha az ARIA hem daha doğru semantik.
 */
export async function StatBars({
  stats,
  locale,
  compact,
}: {
  stats: Stats;
  locale: string;
  /** Izgara kartlarında etiketler kısalıyor: dört harf, tek satır */
  compact?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "slamDunk.stats" });

  return (
    <dl className={styles.bars} data-compact={compact ? "" : undefined}>
      {STAT_KEYS.map((key) => {
        const value = stats[key];
        return (
          <div key={key} className={styles.row}>
            <dt className={styles.label}>
              {compact ? t(`${key}Short`) : t(key)}
            </dt>
            <dd className={styles.track}>
              <span
                className={styles.fill}
                /* ⚠️ Genişlik satır içinde: değer VERİDEN geliyor ve bir
                   CSS sınıfına indirgenemez. Renk yine de sınıftan —
                   satır içi stilde tek bir hex yok. */
                style={{ "--value": `${value}%` } as React.CSSProperties}
                data-high={value >= 90 ? "" : undefined}
                data-low={value < 50 ? "" : undefined}
              />
              <span className={styles.value}>{value}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
