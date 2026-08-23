/**
 * Sōsuke Aizen — elle çizilmiş SVG seti.
 *
 * BRIEF kural 3.4: dışarıdan raster görsel indirilmiyor, hotlink edilmiyor;
 * dekoratif motiflerin tamamı bu dosyada, kendi elimizle çizildi. Set
 * `SharinganEyes.tsx`in kardeşi ama tek bir çizgi bile ondan alınmadı:
 * Sharingan yuvarlak ve organik, bu set DÜZ ÇİZGİLİ ve optik — mercek,
 * kırık cam, kesme küre.
 *
 * Ortak dil (icon-system disiplini):
 *   · Bütün glifler 1.4–1.8 birim kontur, dolgu yok (küre hariç).
 *   · Renk token'dan: `--azn-mirror`, `--azn-fracture`, `--azn-hogyoku`.
 *     Bu dosyada da hex yok.
 *   · Ölçeklenen SVG'lerde `vectorEffect="non-scaling-stroke"` — kıl
 *     çizgiler her boyutta kıl çizgi kalıyor.
 *
 * Hepsi SUNUCU bileşeni: burada durum yok, `"use client"` yok.
 */

/* ══════════════════════════════════════════════════════════════════
   KIRIK AYNA GEOMETRİSİ

   Beş parça, 100×100 kutuda. Merkezi (50,50), yarıçapı 44 olan bir
   dairenin, (58,36)'daki DARBE NOKTASINDAN çıkan beş kesikle bölünmüş
   hâli — yani parçalar eş merkezli dilimler değil, gerçek kırıkta olduğu
   gibi birbirinden farklı büyüklükte. Çemberin kendisi de düz kirişlerle
   yaklaştırıldı: cam kırıldığında yay bırakmaz, kiriş bırakır.

   Aynı diziler İKİ yerde kullanılıyor:
     · SVG `<polygon points>` — parçanın çizilen yüzü (içe çekilmiş)
     · CSS `clip-path: polygon()` — üstteki gerçek <button>'ın vuruş alanı
   Kutu kare olduğu için birim = yüzde; ikisi piksel piksel örtüşüyor.
   ══════════════════════════════════════════════════════════════════ */

export type ShardPoints = readonly (readonly [number, number])[];

export const MIRROR_SHARDS: Record<string, ShardPoints> = {
  rank: [
    [58, 36],
    [61.4, 7.5],
    [79.7, 17.6],
    [91.3, 35],
  ],
  death: [
    [58, 36],
    [91.3, 35],
    [93.8, 53.8],
    [88.1, 72],
    [75.2, 86],
  ],
  hogyoku: [
    [58, 36],
    [75.2, 86],
    [48.1, 94],
    [21.7, 83.7],
  ],
  allies: [
    [58, 36],
    [21.7, 83.7],
    [7, 59.5],
    [10.1, 31.4],
  ],
  purpose: [
    [58, 36],
    [10.1, 31.4],
    [22.9, 15.3],
    [42.4, 6.7],
    [61.4, 7.5],
  ],
};

/**
 * Parçayı kendi ağırlık merkezine doğru çeker.
 *
 * İki işi birden görüyor: (1) parçalar arasında ince bir karanlık aralık
 * açılıyor — kırık camın görünür çizgisi; (2) çizilen yüz, üstündeki
 * düğmenin `clip-path`inin İÇİNDE kalıyor, yani odak konturu kırpılmıyor.
 * Kırpılan bir odak halkası erişilebilirlik açısından yok sayılır.
 */
export function insetShard(points: ShardPoints, factor = 0.955): ShardPoints {
  const cx = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  return points.map(
    (p) =>
      [
        Math.round((cx + (p[0] - cx) * factor) * 100) / 100,
        Math.round((cy + (p[1] - cy) * factor) * 100) / 100,
      ] as const,
  );
}

/** `<polygon points="…">` biçimi */
export function toPoints(points: ShardPoints): string {
  return points.map((p) => `${p[0]},${p[1]}`).join(" ");
}

/** `clip-path: polygon(…)` biçimi — kutu kare olduğu için birim = yüzde */
export function toClipPath(points: ShardPoints): string {
  return `polygon(${points.map((p) => `${p[0]}% ${p[1]}%`).join(", ")})`;
}

/* ══════════════════════════════════════════════════════════════════
   GÖZLÜK — sayfanın ana motifi
   ══════════════════════════════════════════════════════════════════ */

/**
 * İki ince daire ve bir köprü.
 *
 * `broken` verildiğinde sağ mercek çatlar: üç kırık düz çizgi, hepsi
 * merceğin içinde kalacak şekilde kırpılıyor (`clipPath`), yani çatlak
 * camın dışına taşmıyor. Sap uçları da hafifçe ayrılıyor.
 */
export function Spectacles({
  className,
  broken = false,
  idPrefix = "azn-spec",
}: {
  className?: string;
  broken?: boolean;
  idPrefix?: string;
}) {
  const clipId = `${idPrefix}-lens`;
  return (
    <svg
      viewBox="0 0 200 76"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="139" cy="38" r="27" />
        </clipPath>
      </defs>
      <g
        fill="none"
        stroke="var(--azn-mirror)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <circle cx="61" cy="38" r="27" />
        <circle cx="139" cy="38" r="27" />
        {/* köprü — düz değil, hafif kemerli */}
        <path d="M 88 33 C 94 28 106 28 112 33" />
        {/* saplar */}
        <path d="M 34 33 L 12 25" />
        <path d="M 166 33 L 188 25" />
      </g>
      {broken ? (
        <g
          clipPath={`url(#${clipId})`}
          fill="none"
          stroke="var(--azn-mirror)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          <path d="M 112 14 L 133 36 L 124 63" />
          <path d="M 133 36 L 168 30" />
          <path d="M 133 36 L 158 60" />
        </g>
      ) : null}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   KATMAN İŞARETLERİ — mühür (Resmî Kayıt) ve parça (Kırılan Yansıma)
   ══════════════════════════════════════════════════════════════════ */

/** Resmî kaydın mührü: kusursuz daire, yatay kiriş, dört çentik. */
export function SealMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" vectorEffect="non-scaling-stroke" />
      <path d="M 5 12 H 19" vectorEffect="non-scaling-stroke" />
      <path d="M 12 3 V 6 M 12 18 V 21" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Kırılan yansımanın işareti: aynı daire, ama kirişten sonrası kaymış. */
export function ShardMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M 12 3 A 9 9 0 0 1 20.5 15"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 10.6 21 A 9 9 0 0 1 3.4 8.6"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M 4 10 L 13 12.6 L 19.4 8" vectorEffect="non-scaling-stroke" />
      <path d="M 13 12.6 L 11 21.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HŌGYOKU — kesme küre
   ══════════════════════════════════════════════════════════════════ */

/**
 * Küre tek dolgulu glif: kırılgan bir taş, üstünde kesme yüzeyleri.
 * `--azn-hogyoku` doygun bir mor; gövde bu rengin kararmışı, kesikler
 * `--azn-mirror`.
 */
export function HogyokuOrb({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="color-mix(in srgb, var(--azn-hogyoku) 55%, transparent)"
      />
      <g
        fill="none"
        stroke="var(--azn-mirror)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <circle cx="24" cy="24" r="15" />
        {/* kesme yüzeyleri — altıgen kesit */}
        <path d="M 24 9 L 36 17 L 36 31 L 24 39 L 12 31 L 12 17 Z" />
        <path d="M 12 17 L 24 24 L 36 17" />
        <path d="M 24 24 L 24 39" />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   KIRIK ÇİZGİ ÖRTÜSÜ — sayfanın üstüne yayılan kırıklar
   ══════════════════════════════════════════════════════════════════ */

/**
 * Kırılan Yansıma modunda sayfanın üstünde beliren cam kırıkları.
 *
 * `preserveAspectRatio="none"` ile bütün alana geriliyor; çizgiler o yüzden
 * ekran oranına göre eğiliyor — istenen de bu, kırık camın "yerinde" değil
 * "her yerde" olması. Kalınlığı `non-scaling-stroke` koruyor.
 *
 * Görünürlüğü tamamen CSS'in: bu bileşen her zaman çiziliyor, `.page`
 * durumu opaklığını sürüyor. Tıklama geçirmiyor, `aria-hidden`.
 */
export function FractureVeil({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
      stroke="var(--azn-fracture)"
      strokeWidth="1"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {/* Ana kırık: sol üstten sağ alta, üç kırılma noktasıyla */}
      <path
        d="M -2 12 L 23 27 L 34 21 L 58 44 L 71 39 L 102 66"
        vectorEffect="non-scaling-stroke"
      />
      {/* İkinci kırık: sağ üstten aşağı */}
      <path
        d="M 102 8 L 76 24 L 79 37 L 63 58 L 68 76 L 54 102"
        vectorEffect="non-scaling-stroke"
      />
      {/* Üçüncü kırık: soldan aşağı kaçan */}
      <path
        d="M -2 54 L 19 61 L 22 74 L 8 88 L 13 102"
        vectorEffect="non-scaling-stroke"
      />
      {/* Kılcallar — ana kırıklardan ayrılan kısa çizgiler */}
      <g
        stroke="color-mix(in srgb, var(--azn-fracture) 55%, transparent)"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M 23 27 L 26 44" vectorEffect="non-scaling-stroke" />
        <path d="M 58 44 L 45 52" vectorEffect="non-scaling-stroke" />
        <path d="M 79 37 L 92 42" vectorEffect="non-scaling-stroke" />
        <path d="M 19 61 L 32 66" vectorEffect="non-scaling-stroke" />
        <path d="M 68 76 L 84 82" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AYNA ÇERÇEVESİ — panelin arkasındaki halka
   ══════════════════════════════════════════════════════════════════ */

/**
 * Parçaların altında duran zemin: dış halka, iç pah ve solgun bir
 * yansıma. Parçalar kırıldıkça bu zemin görünür hâle geliyor — kırığın
 * arkasında "hiçbir şey yok" hissi CSS tarafından, burada yalnız geometri.
 */
export function MirrorBed({
  className,
  idPrefix = "azn-bed",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const gradId = `${idPrefix}-sheen`;
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id={gradId} cx="0.62" cy="0.3" r="0.85">
          <stop offset="0" stopColor="var(--azn-glass)" />
          <stop
            offset="0.55"
            stopColor="color-mix(in srgb, var(--azn-cold) 22%, transparent)"
          />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill={`url(#${gradId})`} />
      <circle
        cx="50"
        cy="50"
        r="46.4"
        fill="none"
        stroke="color-mix(in srgb, var(--azn-mirror) 34%, transparent)"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="50"
        cy="50"
        r="48.6"
        fill="none"
        stroke="color-mix(in srgb, var(--azn-mirror) 16%, transparent)"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
