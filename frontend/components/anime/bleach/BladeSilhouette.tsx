import type { BladeForm } from "@/lib/anime/bleach/zanpakuto";
import styles from "./BladeSilhouette.module.css";

/**
 * KILIÇ SİLÜETİ — parametreden üretilen, MORPH EDİLEBİLİR path.
 *
 * ── NEDEN ÜRETİLİYOR, ELLE ÇİZİLMİYOR ────────────────────────────────────
 * Brief: "her aşamanın SVG path'i aynı sayıda node içersin, path
 * interpolation ile geçiş yapılsın." Bu teknik bir zorunluluk, estetik bir
 * tercih değil: iki path yalnızca AYNI komut dizisine sahipse birbirine
 * dönüşebilir.
 *
 * Kırk aşama (on kılıç × dört durak) elle çizilseydi hiçbiri diğerine
 * dönüşemezdi — her çizim kendi düğüm sayısını getirirdi. Burada şablon
 * TEK ve sabit; aşamalar yalnızca ALTI SAYIYLA ayrışıyor. Böylece her
 * geçiş kendiliğinden morph edilebilir hâle geliyor.
 *
 * ── BEDELİ, AÇIKÇA ───────────────────────────────────────────────────────
 * Silüet bir ŞEMA, illüstrasyon değil. Senbonzakura'nın bin bıçağı,
 * Ryūjin Jakka'nın alevi ve Suzumebachi'nin eldiveni burada soyut bir
 * biçim değişimi olarak görünüyor. Anlatıyı ad, komut ve tek cümlelik not
 * taşıyor; silüet onları destekliyor, yerlerini almıyor.
 *
 * ── ŞABLON ───────────────────────────────────────────────────────────────
 * Kabza dibinden başlayıp saat yönünde: sol kabza → sol balçak → sol namlu
 * (kuadratik, eğrilik buradan) → uç → sağ namlu (kuadratik) → sağ balçak →
 * sağ kabza → kapat. Dokuz düğüm, her zaman.
 */

/** viewBox: 0 0 100 200 — dikey, kabza altta */
const W = 100;
const H = 200;

export function bladePath(form: BladeForm): string {
  const cx = W / 2;
  /* Kabza dipten yukarı; namlu balçaktan uca. Bütün ölçüler oranla. */
  const hiltH = form.hilt * H;
  const guardY = H - hiltH;
  const guardW = 6 + form.guard * 34;
  const bladeH = form.len * H;
  const tipY = Math.max(4, guardY - bladeH);
  const halfW = 2 + form.width * 30;
  /* Uç sivriliği: 1 → iğne, 0 → küt */
  const tipW = halfW * (1 - form.tip * 0.92);
  /* Eğrilik namlunun ortasını yana itiyor (katana kavisi) */
  const bow = form.curve * 26;
  const midY = (guardY + tipY) / 2;
  const hiltW = 3.4;

  const n = (v: number) => Number(v.toFixed(2));

  return [
    `M${n(cx - hiltW)} ${n(H)}`,
    `L${n(cx - hiltW)} ${n(guardY)}`,
    `L${n(cx - guardW)} ${n(guardY - 3)}`,
    `L${n(cx - halfW)} ${n(guardY - 8)}`,
    `Q${n(cx - halfW - bow)} ${n(midY)} ${n(cx - tipW)} ${n(tipY)}`,
    `L${n(cx + tipW - bow * 0.35)} ${n(tipY - 3)}`,
    `Q${n(cx + halfW - bow)} ${n(midY)} ${n(cx + halfW)} ${n(guardY - 8)}`,
    `L${n(cx + guardW)} ${n(guardY - 3)}`,
    `L${n(cx + hiltW)} ${n(guardY)}`,
    `L${n(cx + hiltW)} ${n(H)}`,
    "Z",
  ].join(" ");
}

/**
 * ⚠️ MORPH CSS'TE, JS'TE DEĞİL.
 *
 * `d` özelliği CSS'ten geçişlenebiliyor ve iki path aynı yapıdaysa tarayıcı
 * ara kareleri kendisi üretiyor — kompozisyon katmanında, ana iş parçacığına
 * dokunmadan. Bir JS interpolasyon kütüphanesi (flubber vb.) aynı işi
 * yapardı ama pakete girer ve her karede JS koşardı.
 *
 * Desteklemeyen tarayıcıda (bugün Firefox) geçiş anlık olur: kılıç
 * doğrudan yeni biçimine atlar. Sahne yine doğru, yalnızca hareketsiz —
 * brief'in izin verdiği yedek de zaten buydu.
 */
export function BladeSilhouette({
  form,
  className,
}: {
  form: BladeForm;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={[styles.blade, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <path
        className={styles.path}
        d={bladePath(form)}
        style={{ d: `path("${bladePath(form)}")` } as React.CSSProperties}
      />
    </svg>
  );
}
