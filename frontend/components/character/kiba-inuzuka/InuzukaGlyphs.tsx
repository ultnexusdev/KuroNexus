/**
 * Kiba Inuzuka sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §4.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor —
 * emsal `components/character/itachi/SharinganEyes.tsx` ve
 * `components/character/shikamaru-nara/ShadowGlyphs.tsx`. Renkler yalnızca
 * token'dan geliyor (`--kib-*` ve standart aile), bu dosyada da tek hex yok.
 *
 * Hareketin tamamı CSS'te: bileşenler yalnızca `className` alıp geometriyi
 * çiziyor, neyin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * modülün sonundaki reduced-motion battaniyesi hepsini tek yerden durduruyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama `SyncLadder` (istemci adası) onu
 * çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Sunucu tarafında da (hero) aynı bileşenler kullanılıyor.
 */

/* ── Klan işareti: yanaktaki iki üçgen ───────────────────────────────────
   Inuzuka'nın yüze yazılan imzası. Kenarları bilerek düz değil — dövme
   değil, fırça darbesi gibi hafif kavisli. Hero'da büyük bir grafik, bölüm
   başlıklarında ve kademe rozetlerinde küçük bir işaret olarak geçiyor. */

const FANG_LEFT =
  "M6 7 C 24 2 43 5 55 12 C 45 30 34 51 27 70 C 19 49 11 27 6 7 Z";
const FANG_RIGHT =
  "M114 7 C 96 2 77 5 65 12 C 75 30 86 51 93 70 C 101 49 109 27 114 7 Z";

export function FangMarks({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 74"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path className={markClassName} data-mark="left" d={FANG_LEFT} fill="var(--kib-claw)" />
      <path className={markClassName} data-mark="right" d={FANG_RIGHT} fill="var(--kib-claw)" />
    </svg>
  );
}

/* ── Mod düğmesinin gliffi: ikiye ayrılan işaret ─────────────────────────
   Kapalıyken iki üçgen üst üste bindirilmiş tek bir kütle gibi duruyor;
   `aria-pressed="true"` olduğunda CSS onları birbirinden ayırıyor — düğme
   tekniğin kendisini yapıyor. */

export function CloneGlyph({
  className,
  halfClassName,
}: {
  className?: string;
  halfClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 74"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g className={halfClassName} data-half="ghost">
        <path d={FANG_LEFT} fill="var(--kib-fur)" />
        <path d={FANG_RIGHT} fill="var(--kib-fur)" />
      </g>
      <g className={halfClassName} data-half="real">
        <path d={FANG_LEFT} fill="var(--kib-claw)" />
        <path d={FANG_RIGHT} fill="var(--kib-claw)" />
      </g>
    </svg>
  );
}

/* ── Akamaru silueti ─────────────────────────────────────────────────────
   Profilden, başı kalkık: koku alan duruş. Tek bir yolla değil, birkaç
   dolgu şekliyle çizildi — hepsi aynı token'la boyandığı için ekranda tek
   siluet olarak okunuyor, ama kulak ve bacak açılarını ayrı ayrı ayarlamak
   mümkün kaldı. Hero'da tozun içinde, düşük opaklıkta duruyor. */

export function AkamaruSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 170"
      fill="var(--kib-fur)"
      aria-hidden
      focusable="false"
    >
      {/* Kuyruk — yukarı kıvrık */}
      <path d="M46 84 C 30 78 18 62 20 42 C 21 34 26 28 32 27 C 30 40 34 54 44 62 C 50 66 52 74 50 82 Z" />
      {/* Gövde */}
      <path d="M40 92 C 44 70 68 58 102 56 C 138 54 168 60 184 72 C 196 81 198 96 190 106 C 172 120 128 126 92 122 C 60 118 38 108 40 92 Z" />
      {/* Boyun ve baş — kalkık, burun havada */}
      <path d="M176 80 C 180 62 190 48 204 41 C 212 37 222 37 228 41 C 240 46 250 40 256 32 C 254 46 246 56 236 60 C 240 68 240 78 234 85 C 226 94 210 96 198 91 C 190 92 182 90 176 86 Z" />
      {/* Kulaklar — sivri, arkaya yatık */}
      <path d="M198 44 L 190 20 L 212 36 Z" />
      <path d="M216 40 L 216 16 L 232 34 Z" />
      {/* Bacaklar */}
      <path d="M62 112 C 68 128 68 142 64 156 L 78 156 C 80 140 80 126 76 110 Z" />
      <path d="M96 118 C 100 134 100 146 96 158 L 110 158 C 112 144 112 130 110 116 Z" />
      <path d="M154 116 C 158 132 158 146 154 158 L 168 158 C 170 144 170 128 168 114 Z" />
      <path d="M182 108 C 188 124 188 140 184 154 L 198 154 C 200 138 198 122 194 106 Z" />
    </svg>
  );
}

/* ── Koku ipliği ─────────────────────────────────────────────────────────
   Havada dalgalanan tek bir çizgi. Koku bölümünün başlığının yanında ve
   hero'nun altında yatay bir ayraç olarak geçiyor. Çizgi CSS'te
   `stroke-dasharray` ile yavaşça akıyor (no-preference kapısında). */

export function ScentThread({
  className,
  pathClassName,
}: {
  className?: string;
  pathClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 40"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        className={pathClassName}
        data-strand="1"
        d="M0 26 C 46 26 62 10 108 10 C 154 10 168 30 214 30 C 260 30 274 8 320 8 C 366 8 382 28 428 28 C 452 28 466 22 480 16"
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className={pathClassName}
        data-strand="2"
        d="M0 16 C 40 16 58 32 104 32 C 150 32 166 12 212 12 C 258 12 272 34 318 34 C 364 34 380 14 426 14 C 452 14 468 20 480 26"
        stroke="var(--kib-fur)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Eş zamanlama şeması — sayfanın kalbindeki omurga ─────────────────────
   Dikey iki bağ: solda Kiba, sağda Akamaru. Kademe yükseldikçe iki grup
   CSS ile birbirine yaklaşıyor (`translate`, kullanıcı birimiyle), ortadaki
   dikişler tek tek beliriyor ve son kademede tek bir gövde şekli arkalarında
   yanıyor.

   ⚠️ `rotate` bilerek KULLANILMIYOR: SVG öğelerinde CSS dönüşünün
   `transform-origin` varsayılanı kullanıcı uzayının başlangıcı (0 0), yani
   bağımsız bir dönüş grubu kadrajın dışına fırlatırdı. `translate` başlangıç
   noktasından bağımsız olduğu için güvenli (ShadowGlyphs emsali).

   Nominal x = 36 (kadrajın ortası). Her iki grup da kendi içinde ortada
   çizildi; ayrılığı yalnızca CSS'teki yatay ötelemeler üretiyor. */

/**
 * Ortadaki dikişler — kademe yükseldikçe biri daha bağlanır.
 *
 * ⚠️ Her dikiş TEK parça değil, iki YARIM: biri Kiba'nın bağ grubunun,
 * diğeri Akamaru'nunkinin içinde. İki grup birbirine yaklaştıkça yarımlar
 * kavuşup tek bir bağ hâline geliyor. Tek parça bir çizgi olsaydı,
 * yakınlaşmayla birlikte onu da ayrıca ölçeklendirmek gerekirdi ve
 * `transform-origin`i SVG kullanıcı uzayına oturtmak kırılgan bir iş.
 */
const STITCHES = [118, 178, 238, 298];

/** Bir bağın kendi yarım dikişleri; `reach` içeri doğru uzanma yönü. */
function HalfStitches({
  stage,
  reach,
  className,
}: {
  stage: number;
  reach: number;
  className?: string;
}) {
  return (
    <g strokeLinecap="round">
      {STITCHES.map((y, index) => (
        <line
          key={y}
          className={className}
          data-tie={index + 1}
          data-on={stage >= index + 1 ? "true" : undefined}
          x1="36"
          y1={y}
          x2={36 + reach}
          y2={y}
          stroke="var(--accent)"
          strokeWidth="1.6"
        />
      ))}
    </g>
  );
}

function KibaHead() {
  return (
    <g data-form="human">
      <circle cx="36" cy="40" r="12" fill="var(--kib-fang)" fillOpacity="0.9" />
      <path d="M28 34 L 33 35 L 30 45 Z" fill="var(--kib-claw)" />
      <path d="M44 34 L 39 35 L 42 45 Z" fill="var(--kib-claw)" />
    </g>
  );
}

function AkamaruHead() {
  return (
    <g data-form="beast">
      <circle cx="36" cy="41" r="11" fill="var(--kib-fur)" />
      <path d="M27 33 L 25 21 L 35 29 Z" fill="var(--kib-fur)" />
      <path d="M45 33 L 47 21 L 37 29 Z" fill="var(--kib-fur)" />
      <circle cx="36" cy="47" r="2.4" fill="var(--bg)" />
    </g>
  );
}

export function PackDiagram({
  stage,
  className,
  cordClassName,
  stitchClassName,
  bodyClassName,
  groundClassName,
  title,
}: {
  /** 0 tabanlı kademe sırası */
  stage: number;
  className?: string;
  cordClassName?: string;
  stitchClassName?: string;
  bodyClassName?: string;
  groundClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
}) {
  /* Dördüncü kademede (Jūjin Bunshin) Akamaru'nun başı Kiba'nınkine
     dönüşüyor: iki şekil de ağaçta duruyor, hangisinin görüneceğini CSS
     `data-form` üzerinden seçiyor. */
  const cloned = stage >= 3;

  return (
    <svg
      className={className}
      viewBox="0 0 72 400"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Tek gövde — yalnızca son kademede yanar */}
      <path
        className={bodyClassName}
        data-on={stage >= 4 ? "true" : undefined}
        d="M22 62 C 14 130 14 250 22 356 L 50 356 C 58 250 58 130 50 62 Z"
        fill="var(--kib-scent)"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {/* Zemin çizgisi — iki bağın da bastığı yer */}
      <line
        className={groundClassName}
        x1="8"
        y1="366"
        x2="64"
        y2="366"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />

      {/* Dikişler: kademe yükseldikçe biri daha bağlanır */}
      <g strokeLinecap="round">
        {STITCHES.map((y, index) => (
          <line
            key={y}
            className={stitchClassName}
            data-tie={index + 1}
            data-on={stage >= index + 1 ? "true" : undefined}
            x1="26"
            y1={y}
            x2="46"
            y2={y}
            stroke="var(--accent)"
            strokeWidth="1.6"
          />
        ))}
      </g>

      {/* Kiba'nın bağı */}
      <g className={cordClassName} data-side="kiba">
        <path
          d="M36 54 C 30 116 42 176 36 236 C 30 292 42 330 36 362"
          stroke="var(--kib-fang)"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M30 362 L 42 362 L 39 372 L 33 372 Z" fill="var(--kib-fang)" fillOpacity="0.6" />
        <KibaHead />
      </g>

      {/* Akamaru'nun bağı — dördüncü kademede başı Kiba'nınkine döner */}
      <g className={cordClassName} data-side="akamaru" data-cloned={cloned ? "true" : undefined}>
        <path
          d="M36 54 C 42 112 30 172 36 232 C 42 288 30 328 36 362"
          stroke="var(--kib-fur)"
          strokeOpacity="0.65"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <g fill="var(--kib-fur)" fillOpacity="0.7">
          <circle cx="33" cy="368" r="2.2" />
          <circle cx="39" cy="368" r="2.2" />
          <circle cx="36" cy="373" r="2.6" />
        </g>
        <AkamaruHead />
        <KibaHead />
      </g>
    </svg>
  );
}
