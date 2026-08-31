/**
 * Yūta Okkotsu — elle çizilmiş SVG motifleri.
 *
 * Bu dosyada `"use client"` YOK ve olmamalı: hiçbiri durum tutmuyor, hepsi
 * saf çizim. Sunucu ağacında da, istemci adasının (CopyDeck) içinde de aynı
 * bileşenler kullanılabiliyor.
 *
 * Renklerin hepsi ÇAĞIRANDAN geliyor (`className` olarak): CSS Modules'ün
 * sınıfları yerel olduğu için bir SVG'nin içine dışarıdan stil vermenin tek
 * yolu bu. Dosyada tek bir renk yazmıyor — kural 16.
 *
 * Faz 2 görsel politikası: dışarıdan raster indirilmiyor. Sayfadaki bütün
 * motifler burada, konturla çiziliyor. Sayfanın filigranı Rika'nın verdiği
 * YÜZÜK: çok büyük, çok ince, ve hiçbir yere değmiyor.
 */

/**
 * Sayfanın filigranı — yüzük.
 *
 * ⚠️ `viewBox` var ve kare (`0 0 400 400`): halka her ekranda dairesel
 * kalmalı, gerilmemeli. Ölçeği CSS veriyor.
 *
 * Halka üç çemberden oluşuyor — dış kontur, iç kontur ve taşın oturduğu ince
 * tırnak yayı. Üçü ayrı `className` alıyor ki dönen parça yalnızca bir tanesi
 * olsun (hareket dili: halka yavaşça dönüyor, taş onunla birlikte).
 */
export function RingMark({
  className,
  bandClassName,
  innerClassName,
  stoneClassName,
}: {
  className?: string;
  bandClassName?: string;
  innerClassName?: string;
  stoneClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {/* Dış kontur — yüzüğün gövdesi */}
      <circle className={bandClassName} cx="200" cy="214" r="150" />
      {/* İç kontur — parmağın geçtiği delik */}
      <circle className={innerClassName} cx="200" cy="214" r="128" />
      {/* Taşın tırnağı: iki kısa yay ve üstte tek bir elmas.
          Elle çizildi — simetrik bir ikon değil, bir işaret. */}
      <path className={stoneClassName} d="M182 70 L200 40 L218 70 L200 100 Z" />
      <path className={stoneClassName} d="M182 70 L218 70" />
      <path className={stoneClassName} d="M200 40 L200 100" />
    </svg>
  );
}

/**
 * Bölüm başlıklarının ve düğmenin küçük halkası.
 *
 * Aynı motifin küçük hâli, taşsız. Sayfada çok kez kullanıldığı için
 * kimlik (`id`) taşımıyor: `<defs>` yok, yalnızca iki çember.
 */
export function RingSeal({
  className,
  outerClassName,
  innerClassName,
}: {
  className?: string;
  outerClassName?: string;
  innerClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <circle className={outerClassName} cx="24" cy="24" r="19" />
      <circle className={innerClassName} cx="24" cy="24" r="12" />
    </svg>
  );
}

/**
 * Rika — elle çizilmiş siluet.
 *
 * Rika'nın arşivde resmî bir portresi YOK ve olmayacak; onun kadrajı
 * küratör yuvası olarak boş kalıyor. Boş kadrajın içinde bu siluet duruyor:
 * uzun saç, tek bir omuz hattı ve halkanın içinden geçen bir gövde. Yüz
 * çizilmedi — bilerek.
 *
 * `role="img"` + `aria-label` çağırandan geliyor: bu kadraj sayfanın anlamlı
 * bir parçası, dekoratif değil.
 */
export function RikaSilhouette({
  className,
  label,
  haloClassName,
  bodyClassName,
  hairClassName,
}: {
  className?: string;
  /** Verilirse çizim `role="img"` olur; verilmezse dekoratif kalır */
  label?: string;
  haloClassName?: string;
  bodyClassName?: string;
  hairClassName?: string;
}) {
  const labelled = typeof label === "string" && label.length > 0;
  return (
    <svg
      className={className}
      viewBox="0 0 240 340"
      role={labelled ? "img" : "presentation"}
      aria-label={labelled ? label : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {/* Halka — Rika'nın etrafındaki daire, yüzüğün yankısı */}
      <circle className={haloClassName} cx="120" cy="132" r="92" />
      {/* Saç: iki uzun perde, aşağı doğru açılıyor */}
      <path
        className={hairClassName}
        d="M76 92 C70 150 66 214 74 286 L96 286 C90 216 92 152 100 100 Z"
      />
      <path
        className={hairClassName}
        d="M164 92 C170 150 174 214 166 286 L144 286 C150 216 148 152 140 100 Z"
      />
      {/* Baş — yüz yok */}
      <path
        className={bodyClassName}
        d="M120 56 C142 56 158 74 158 100 C158 128 142 148 120 148 C98 148 82 128 82 100 C82 74 98 56 120 56 Z"
      />
      {/* Omuz hattı, aşağı doğru kaybolan gövde */}
      <path
        className={bodyClassName}
        d="M120 150 C152 150 176 178 182 224 C186 256 184 288 180 312 L60 312 C56 288 54 256 58 224 C64 178 88 150 120 150 Z"
      />
    </svg>
  );
}
