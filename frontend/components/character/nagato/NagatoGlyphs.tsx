/**
 * Nagato sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor —
 * emsal `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--nag-*` ve standart aile, CSS modülünün başındaki
 * deri bloğu); bu dosyada da tek hex yok.
 *
 * Sayfanın bütün geometrisi İKİ biçimden türüyor:
 *   · DİKEY ÇİZGİ — yağmur, boru, çubuk
 *   · EŞ MERKEZLİ HALKA — Rinnegan, damlanın suda açtığı halka, çekim
 * Üçüncü bir biçim yok; bir motif eklemek gerekirse bu ikisinden türetilir.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi katmanın ne zaman kıpırdayacağını `data-*` nitelikleri söylüyor.
 * Böylece dosyanın sonundaki reduce battaniyesi hepsini tek yerden
 * durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama istemci adaları da onu çağırıyor —
 * düz JSX olduğu için ek bağımlılık getirmiyor.
 *
 * ⚠️ Hiçbir yerde `Math.random` YOK: yağmurun "dağınıklığı" elle yazılmış
 * sabit dizilerden geliyor. Rastgele üretim sunucu ve istemci çizimini
 * ayırır ve hidrasyon uyarısı üretirdi.
 */

/* ══ YAĞMUR PERDESİ ══════════════════════════════════════════════════════
   Üç derinlik bandı. Her damla, kadrajın tamamını kesen tek bir dikey
   çizgi; "damla" görüntüsü `stroke-dasharray` ile veriliyor ve düşüş
   `stroke-dashoffset` animasyonundan geliyor. Bunun tekrar eden bir
   döşeme kaydırmasına üstünlüğü: kesiksiz döngü için ek düğüm gerekmiyor,
   üstelik animasyon tek bir özellikte kalıyor (kompozisyon dostu).

   Kesiksizlik şartı: her bandın kayması, o bandın desen periyodunun tam
   katı olmalı. Periyotlar 26 / 36 / 60; CSS'teki keyframe'ler sırasıyla
   -104, -144, -180 (yani 4, 4 ve 3 periyot).
   ══════════════════════════════════════════════════════════════════════ */

const RAIN_BANDS: { band: string; dash: string; width: number; xs: number[] }[] = [
  {
    band: "far",
    dash: "5 21",
    width: 0.34,
    xs: [3, 11, 19, 27, 36, 44, 52, 61, 69, 77, 86, 94],
  },
  {
    band: "mid",
    dash: "9 27",
    width: 0.55,
    xs: [7, 16, 24, 33, 41, 49, 58, 66, 74, 83, 91],
  },
  {
    band: "near",
    dash: "14 46",
    width: 0.9,
    xs: [13, 30, 47, 64, 81, 97],
  },
];

export function RainCurtain({
  className,
  bandClassName,
}: {
  className?: string;
  bandClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      /* Kadrajı doldurması ŞART: perde sayfanın tamamına iniyor. Dikey
         gerilme damlaları uzatıyor — istenen etki bu. */
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {RAIN_BANDS.map((row) => (
        <g
          key={row.band}
          className={bandClassName}
          data-band={row.band}
          strokeLinecap="round"
          strokeDasharray={row.dash}
          strokeWidth={row.width}
        >
          {row.xs.map((x) => (
            <line
              key={x}
              x1={x}
              y1={-6}
              x2={x}
              y2={106}
              /* ⚠️ `vector-effect` KALITILMAZ: gruba yazmak işe yaramaz,
                 her çizgiye ayrı ayrı gerekiyor. Olmazsa yatay gerilme
                 damlaları kalın bir çubuğa çevirir. */
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ══ RINNEGAN ════════════════════════════════════════════════════════════
   Eş merkezli halkalar; ortada küçük bir bebek. Nagato'nun gözünde tomoe
   YOK — düz halkalar (Altı Yol Rinnegan'ıyla karıştırılmamalı).
   `rings` ile halka sayısı azaltılabiliyor: kader çizelgesinin madde
   işaretleri birden beşe doğru açılıyor.
   ══════════════════════════════════════════════════════════════════════ */

const RINNEGAN_RADII = [11, 19.5, 28.5, 38, 47.5];

export function RinneganEye({
  rings = 5,
  className,
  ringClassName,
  coreClassName,
}: {
  /** 1–5 arası halka sayısı */
  rings?: number;
  className?: string;
  ringClassName?: string;
  coreClassName?: string;
}) {
  const count = Math.min(Math.max(rings, 1), RINNEGAN_RADII.length);
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle className={coreClassName} cx="50" cy="50" r="4.4" />
      {RINNEGAN_RADII.slice(0, count).map((r, index) => (
        <circle
          key={r}
          className={ringClassName}
          data-ring={index + 1}
          cx="50"
          cy="50"
          r={r}
          strokeWidth={index === 0 ? 1.6 : 1.1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* ══ DAMLA HALKASI ═══════════════════════════════════════════════════════
   Sorunun yanındaki işaret: suya düşen damlanın açtığı halka. Soru
   açıldığında halkalar dışa doğru genişliyor (CSS).
   ══════════════════════════════════════════════════════════════════════ */

/* En içteki halka bilerek GENİŞ: ortasına sorunun sırası oturuyor ve
   kapalı hâlde (ölçek 0.72) bile rakamı kesmemesi gerekiyor. */
const RIPPLE_RADII = [28, 38, 47, 55];

export function RippleRings({
  className,
  ringClassName,
  coreClassName,
}: {
  className?: string;
  ringClassName?: string;
  coreClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle className={coreClassName} cx="60" cy="60" r="4.6" />
      {RIPPLE_RADII.map((r, index) => (
        <circle
          key={r}
          className={ringClassName}
          data-ring={index + 1}
          cx="60"
          cy="60"
          r={r}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* ══ TEKNİK MÜHÜRLERİ ════════════════════════════════════════════════════
   Üç büyük tekniğin her biri için tek bir geometrik işaret. Üçü de aynı
   merkezden çiziliyor (50,50) ve üçü de halka ailesinden:
     rings    — Rinnegan: eş merkezli halkalar
     collapse — Chibaku Tensei: merkeze sarılan parçalar
     pushpull — Shinra Tensei / Banshō Ten'in: dışa iten, içe çeken yaylar
   ══════════════════════════════════════════════════════════════════════ */

/** Chibaku Tensei: çekirdeğin etrafına sarılan kaya parçaları */
const COLLAPSE_SHARDS: { a: number; r: number }[] = [
  { a: 0, r: 34 },
  { a: 32, r: 22 },
  { a: 64, r: 31 },
  { a: 96, r: 19 },
  { a: 128, r: 29 },
  { a: 160, r: 24 },
  { a: 192, r: 33 },
  { a: 224, r: 21 },
  { a: 256, r: 30 },
  { a: 288, r: 25 },
  { a: 320, r: 34 },
  { a: 344, r: 20 },
];

export function TechniqueSigil({
  kind,
  className,
  strokeClassName,
  fillClassName,
}: {
  kind: "rings" | "collapse" | "pushpull";
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {kind === "rings" ? (
        <>
          <circle className={fillClassName} cx="50" cy="50" r="5" />
          {[13, 21, 29.5, 38, 46].map((r, index) => (
            <circle
              key={r}
              className={strokeClassName}
              cx="50"
              cy="50"
              r={r}
              strokeWidth={index === 0 ? 1.8 : 1.1}
            />
          ))}
        </>
      ) : null}

      {kind === "collapse" ? (
        <>
          {/* Dış sınır: küre buraya kadar büyüyor */}
          <circle
            className={strokeClassName}
            cx="50"
            cy="50"
            r="44"
            strokeWidth="0.9"
            strokeDasharray="2 5"
          />
          <circle
            className={strokeClassName}
            cx="50"
            cy="50"
            r="13"
            strokeWidth="1.1"
          />
          {/* Çekirdek — sayfanın tek dolu siyah dairesi */}
          <circle className={fillClassName} cx="50" cy="50" r="7.5" />
          {COLLAPSE_SHARDS.map((shard) => (
            <g key={`${shard.a}-${shard.r}`} transform={`rotate(${shard.a} 50 50)`}>
              <rect
                className={strokeClassName}
                x="47.6"
                y={50 - shard.r - 3.4}
                width="4.8"
                height="6.8"
                strokeWidth="0.9"
              />
            </g>
          ))}
        </>
      ) : null}

      {kind === "pushpull" ? (
        <>
          <circle className={fillClassName} cx="50" cy="50" r="4.2" />
          {/* Üst yarı: dışa iten üç yay + dışa bakan tırnaklar */}
          <g className={strokeClassName} strokeWidth="1.3" strokeLinecap="round">
            <path d="M35.9 44.87 A15 15 0 0 1 64.1 44.87" />
            <path d="M27.45 41.79 A24 24 0 0 1 72.55 41.79" />
            <path d="M18.99 38.71 A33 33 0 0 1 81.01 38.71" />
            <path d="M33.5 21.42 L30.5 16.23" />
            <path d="M50 17 L50 11" />
            <path d="M66.5 21.42 L69.5 16.23" />
          </g>
          {/* Alt yarı: içe çeken üç yay + içe bakan tırnaklar */}
          <g className={strokeClassName} strokeWidth="1.3" strokeLinecap="round">
            <path d="M64.1 55.13 A15 15 0 0 1 35.9 55.13" />
            <path d="M72.55 58.21 A24 24 0 0 1 27.45 58.21" />
            <path d="M81.01 61.29 A33 33 0 0 1 18.99 61.29" />
            <path d="M66.5 78.58 L63.5 73.38" />
            <path d="M50 83 L50 77" />
            <path d="M33.5 78.58 L36.5 73.38" />
          </g>
        </>
      ) : null}
    </svg>
  );
}

/* ══ ÇİVİLİ BEDEN ════════════════════════════════════════════════════════
   Sayfanın duygusal merkezindeki şema: makine çerçevesi, çerçeveye bağlı
   oturan gövde ve omurgaya giren altı kara çubuk.

   Şema anatomik değil ARAÇSAL: gövde tek bir kapalı siluet, geri kalanı
   boru ve kablo. Amaç bir portre çizmek değil, "bu adam bir aygıtın
   parçası" cümlesini tek bakışta okutmak.

   `title` verilirse şema ekran okuyucuya `role="img"` olarak iniyor;
   verilmezse tamamen dekoratif.
   ══════════════════════════════════════════════════════════════════════ */

/** Omurgaya giren çubuklar: dış uç (kaynak) → iç uç (omurga) */
const RODS: { x1: number; y1: number; x2: number; y2: number }[] = [
  { x1: 56, y1: 126, x2: 112, y2: 140 },
  { x1: 54, y1: 152, x2: 110, y2: 162 },
  { x1: 56, y1: 178, x2: 110, y2: 184 },
  { x1: 54, y1: 204, x2: 110, y2: 206 },
  { x1: 56, y1: 230, x2: 110, y2: 228 },
  { x1: 54, y1: 256, x2: 110, y2: 250 },
];

export function WiredBody({
  className,
  title,
  frameClassName,
  bodyClassName,
  rodClassName,
  eyeClassName,
}: {
  className?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
  frameClassName?: string;
  bodyClassName?: string;
  rodClassName?: string;
  eyeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 320"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Makine: iki dikey ray, üç kuşak, taban plakası */}
      <g className={frameClassName} strokeWidth="1.4" strokeLinecap="square">
        <line x1="44" y1="34" x2="44" y2="300" />
        <line x1="216" y1="34" x2="216" y2="300" />
        <line x1="44" y1="46" x2="216" y2="46" />
        <line x1="44" y1="182" x2="216" y2="182" />
        <line x1="44" y1="298" x2="216" y2="298" />
        <rect x="64" y="290" width="132" height="12" strokeWidth="1.1" />
        {/* Kablolar: raydan gövdeye */}
        <path d="M216 92 C 190 100 176 112 168 126" strokeWidth="0.9" />
        <path d="M216 176 C 196 178 184 184 176 194" strokeWidth="0.9" />
        <path d="M216 262 C 200 264 188 262 176 256" strokeWidth="0.9" />
      </g>

      {/* Gövde: tek kapalı siluet + kollar + katlanmış bacaklar */}
      <g className={bodyClassName} strokeWidth="1.3">
        <path d="M114 124 C 102 132 96 152 94 176 C 92 204 96 240 100 268 L 168 268 C 172 240 176 204 174 176 C 172 152 166 132 154 124 Z" />
        <circle cx="132" cy="104" r="18" />
        <path d="M104 152 C 92 174 92 200 100 218" fill="none" />
        <path d="M164 152 C 176 174 176 200 168 218" fill="none" />
        <path d="M96 258 C 110 276 156 276 172 258" fill="none" />
      </g>

      {/* Çubuklar: dış uçta bağlantı halkası, iç uç omurgada */}
      <g className={rodClassName} strokeLinecap="round" strokeWidth="3.4">
        {RODS.map((rod) => (
          <g key={`${rod.y1}-${rod.y2}`}>
            <line x1={rod.x1} y1={rod.y1} x2={rod.x2} y2={rod.y2} />
            <circle cx={rod.x1} cy={rod.y1} r="3.2" strokeWidth="1.2" />
          </g>
        ))}
      </g>

      {/* Göz: gövdedeki tek halka ailesi */}
      <g className={eyeClassName} strokeWidth="1.1">
        <circle cx="132" cy="104" r="4" />
        <circle cx="132" cy="104" r="8.5" />
        <circle cx="132" cy="104" r="13" />
      </g>
    </svg>
  );
}

/* ══ ÇUBUK İŞARETİ ═══════════════════════════════════════════════════════
   Dört küçük kaydın madde işareti: tek bir çubuk ve ucundaki halka.
   ══════════════════════════════════════════════════════════════════════ */

export function RodMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle cx="5" cy="19" r="3" strokeWidth="1.2" />
      <line x1="6.9" y1="17.1" x2="20" y2="4" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
