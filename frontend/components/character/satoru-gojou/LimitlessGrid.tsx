import { GOJO_S03 } from "@/lib/characters/satoru-gojou-experience";
import styles from "./GojoExperience.module.css";

/**
 * P03 · ZENO IZGARASI — sunucuda üretilen SVG.
 *
 * ══ HALKALAR MERKEZE NEDEN ULAŞMIYOR ═══════════════════════════════════
 * Yarıçaplar bir Zeno dizisi:
 *
 *     r(n) = R∞ + (Rdış − R∞) / 2ⁿ
 *
 * Her adım merkeze KALAN mesafeyi yarıya bölüyor. Dizi R∞'a yakınsıyor
 * ama hiçbir n için ona EŞİT olmuyor — yani halkalar sıklaşarak
 * yaklaşıyor, hiç girmiyor. Bölümün tezi tam olarak bu ve matematiği
 * dekoratif değil: aynı toplam gövde metninde de anlatılıyor
 * (`GOJO_S03.srText`).
 *
 * 14 halkada son adım R∞ + 0.003 birimde kalıyor; oradan sonrası bir
 * pikselin altına düştüğü için çizilmiyor. "Sonsuz" olan dizi, ekranda
 * ölçülebilir bir sınıra dayanıyor — istenen his de bu.
 *
 * ══ NEDEN WebGL DEĞİL ══════════════════════════════════════════════════
 * BRIEF "WebGL uygun, desteklenmiyorsa statik SVG fallback" diyor. Burada
 * YEDEK yol asıl yol olarak seçildi. Gerekçe:
 *   · Aranan şey bir yakınsama; hareketli bir simülasyon değil. Statik
 *     geometri tezi WebGL'den daha net anlatıyor.
 *   · Sunucuda çiziliyor, yani JS inmeden görünüyor (performans bütçesi).
 *   · Sıfır context, sıfır fallback dalı, sıfır sürücü riski.
 * Hareket sözleşmesi WebGL'e İZİN veriyor, ZORUNLU kılmıyor.
 *
 * ⚠️ Tamamen `aria-hidden`: taşıdığı anlamın tamamı bölümün `sr-only`
 * düz metninde zaten var.
 */

/** Halka sayısı — 14'ten sonrası bir pikselin altına düşüyor. */
const RINGS = 14;

/** Dış yarıçap (kullanıcı birimi, viewBox 100×100). */
const R_OUTER = 62;

/** ⚠️ DOKUNULMAZ YARIÇAP. Hiçbir halka ve hiçbir ışın buraya girmiyor. */
const R_INF = 13;

/**
 * Işınların durduğu yarıçap — sınırın biraz DIŞI.
 *
 * İlk sürümde ışınlar tam `R_INF`te bitiyordu, yani sınıra değiyordu.
 * Kural teknik olarak çiğnenmiyordu ("girmemek" ≠ "değmemek") ama negatif
 * alan bir çizgi demetiyle çevrelendiğinde KAPALI bir kuyu gibi okunuyor;
 * oysa istenen his dokunulmazlık. %8'lik pay, boşluğun kendi kenarını
 * kendisinin çizmesini sağlıyor.
 */
const R_SPOKE_STOP = R_INF * 1.08;

/** Merkezden dışa uzanan ışın sayısı. */
const SPOKES = 24;

const CENTER = 50;

/** Zeno dizisi: kalan mesafeyi her adımda yarıya böl. */
const ringRadii = Array.from(
  { length: RINGS },
  (_, n) => R_INF + (R_OUTER - R_INF) / 2 ** n,
);

/**
 * Dıştan içe spektral geçiş.
 *
 * Gözbağlı modda iki token da aynı değere bağlı (`--g-bf-accent`), yani
 * karışım görsel olarak tek renk veriyor — koşullu çizim yapmadan mod
 * farkı elde ediliyor.
 */
function ringStroke(index: number): string {
  const t = RINGS > 1 ? index / (RINGS - 1) : 0;
  const core = Math.round(t * 100);
  return `color-mix(in srgb, var(--g-s03-grid-core) ${core}%, var(--g-s03-grid))`;
}

/** Formüllerin oturduğu açılar — halkalarla kesiştikleri noktalar. */
const FORMULA_SPOTS = [
  { ring: 1, angle: -58 },
  { ring: 2, angle: 128 },
  { ring: 3, angle: 34 },
  { ring: 4, angle: -142 },
  { ring: 5, angle: 76 },
  { ring: 6, angle: -104 },
];

export function LimitlessGrid() {
  return (
    <svg
      className={styles.limitlessGrid}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* Işınlar — dıştan gelip DOKUNULMAZ YARIÇAPTA duruyorlar. */}
      {Array.from({ length: SPOKES }, (_, i) => {
        const angle = (i / SPOKES) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (
          <line
            key={`spoke-${i}`}
            x1={CENTER + cos * R_SPOKE_STOP}
            y1={CENTER + sin * R_SPOKE_STOP}
            x2={CENTER + cos * R_OUTER}
            y2={CENTER + sin * R_OUTER}
            stroke="var(--g-s03-grid)"
            strokeWidth={0.12}
            opacity={0.5}
          />
        );
      })}

      {/* Zeno halkaları — sıklaşarak yaklaşıyor, asla girmiyor. */}
      {ringRadii.map((r, n) => (
        <circle
          key={`ring-${n}`}
          cx={CENTER}
          cy={CENTER}
          r={r}
          fill="none"
          stroke={ringStroke(n)}
          strokeWidth={Math.max(0.05, 0.34 - n * 0.02)}
        />
      ))}

      {/* Kesişimlere düşen formüller — gerçek matematik, sözde değil. */}
      {FORMULA_SPOTS.map((spot, i) => {
        const formula = GOJO_S03.formulas[i];
        if (!formula) return null;
        const rad = (spot.angle * Math.PI) / 180;
        return (
          <text
            key={formula}
            className={styles.limitlessFormula}
            x={CENTER + Math.cos(rad) * ringRadii[spot.ring]}
            y={CENTER + Math.sin(rad) * ringRadii[spot.ring]}
            fontSize={1.7}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {formula}
          </text>
        );
      })}
    </svg>
  );
}
