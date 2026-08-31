/**
 * Mahito sayfasının elle çizilmiş SVG'leri — SUNUCU BİLEŞENİ.
 *
 * Dosyada `"use client"` YOK ve olmamalı: burada durum yok, olay yok,
 * yalnızca `path`/`circle` var. İstemci adası sayılsaydı üç ada bütçesinin
 * (FAZ 2 §1) birini boş yere yerdi ve bu geometri kullanıcıya JavaScript
 * olarak inerdi.
 *
 * ── ÜÇ MOTİF, ÜÇ İŞ ──────────────────────────────────────────────────────
 *   PatchWeave — HERO FİLİGRANI. Mahito'nun yüzündeki dikişin büyütülmüş
 *     hâli: birbirine paralel olmayan kenarlarla kesilmiş beş yama ve
 *     aralarında `stroke-dasharray` ile teyellenmiş dikiş çizgileri.
 *   SeamRule — BÖLÜMLER ARASI DİKİŞ. Yatay, hafifçe eğri bir teyel; iki
 *     yamayı birbirine bağlıyor. `preserveAspectRatio="none"` ile kabın
 *     genişliğine yayılıyor, yani her bölümde başka uzunlukta.
 *   StitchMark — BOŞ KADRAJIN İÇİNDEKİ MOTİF. Görsel üretilmediği için
 *     (FAZ 2 §3) kadraj boşken kutu yerine bu duruyor: çapraz iki teyel ve
 *     dört düğüm.
 *
 * Renkler dışarıdan `className` ile veriliyor: SVG'nin içinde tek bir renk
 * değeri yok, hepsi CSS modülünden `stroke`/`fill` olarak geliyor (kural 16).
 * Üçü de dekoratif — çağıran taraf `aria-hidden` ile sarıyor.
 */

/**
 * Hero filigranı: beş yama + aralarındaki teyel.
 *
 * ⚠️ Hiçbir kenar diğerine paralel değil — kilitli eksenin kendisi bu.
 * Koordinatlar elle seçildi; bir yamanın kenarını değiştirirsen komşusunun
 * teyel çizgisini de kaydırman gerekir.
 */
export function PatchWeave({
  className,
  patchClassName,
  seamClassName,
  knotClassName,
}: {
  className?: string;
  patchClassName?: string;
  seamClassName?: string;
  knotClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 320 320" role="presentation" focusable="false">
      {/* Beş yama — hepsi başka bir çokgen, hiçbiri dikdörtgen değil */}
      <path className={patchClassName} d="M22 34 L146 18 L163 121 L36 140 Z" />
      <path className={patchClassName} d="M163 121 L152 20 L296 42 L281 132 Z" />
      <path className={patchClassName} d="M36 140 L163 121 L149 233 L18 249 Z" />
      <path className={patchClassName} d="M163 121 L281 132 L299 240 L149 233 Z" />
      <path className={patchClassName} d="M18 249 L149 233 L299 240 L268 302 L44 296 Z" />

      {/* Dikişler — teyel. `stroke-dasharray` CSS'ten geliyor. */}
      <path className={seamClassName} d="M36 140 L163 121 L281 132" />
      <path className={seamClassName} d="M163 121 L152 20" />
      <path className={seamClassName} d="M18 249 L149 233 L299 240" />
      <path className={seamClassName} d="M149 233 L163 121" />
      <path className={seamClassName} d="M22 34 L36 140" />
      <path className={seamClassName} d="M296 42 L281 132" />

      {/* Düğümler — dikişin başladığı ve bittiği yerler */}
      <circle className={knotClassName} cx="163" cy="121" r="4.5" />
      <circle className={knotClassName} cx="36" cy="140" r="3.5" />
      <circle className={knotClassName} cx="281" cy="132" r="3.5" />
      <circle className={knotClassName} cx="149" cy="233" r="3.5" />
      <circle className={knotClassName} cx="18" cy="249" r="3" />
      <circle className={knotClassName} cx="299" cy="240" r="3" />
    </svg>
  );
}

/**
 * İki bölümü birbirine bağlayan yatay teyel.
 *
 * `preserveAspectRatio="none"` bilerek: çizgi kabın genişliğine göre
 * uzuyor, yani her dikiş başka bir uzunlukta ve hiçbiri diğerinin kopyası
 * gibi görünmüyor. Yükseklik 24 birim, `vector-effect` yok — kalınlık da
 * esniyor ve el çizimi hissini bu bozulma veriyor.
 */
export function SeamRule({
  className,
  lineClassName,
  crossClassName,
}: {
  className?: string;
  lineClassName?: string;
  crossClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 24"
      preserveAspectRatio="none"
      role="presentation"
      focusable="false"
    >
      <path className={lineClassName} d="M4 15 C 96 6, 214 20, 312 10 S 508 19, 596 8" />
      <path className={crossClassName} d="M74 4 L84 20 M78 20 L88 4" />
      <path className={crossClassName} d="M232 6 L242 21 M236 21 L246 6" />
      <path className={crossClassName} d="M396 4 L406 19 M400 19 L410 4" />
      <path className={crossClassName} d="M534 3 L544 18 M538 18 L548 3" />
    </svg>
  );
}

/**
 * Boş kadrajın içindeki motif: çapraz iki teyel ve dört düğüm.
 *
 * FAZ 2 §3 sahne görseli üretmeyi yasaklıyor; kadraj boşken bir yer tutucu
 * kutu yerine bu duruyor, yani bölüm "görselsiz ama ayakta" kalıyor.
 */
export function StitchMark({
  className,
  seamClassName,
  knotClassName,
}: {
  className?: string;
  seamClassName?: string;
  knotClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="presentation" focusable="false">
      <path className={seamClassName} d="M14 26 C 46 40, 76 12, 108 30" />
      <path className={seamClassName} d="M10 62 C 44 48, 78 82, 110 62" />
      <path className={seamClassName} d="M16 96 C 48 108, 74 78, 106 94" />
      <circle className={knotClassName} cx="14" cy="26" r="3" />
      <circle className={knotClassName} cx="108" cy="30" r="3" />
      <circle className={knotClassName} cx="10" cy="62" r="3" />
      <circle className={knotClassName} cx="110" cy="62" r="3" />
      <circle className={knotClassName} cx="16" cy="96" r="3" />
      <circle className={knotClassName} cx="106" cy="94" r="3" />
    </svg>
  );
}
