import type { TentenArm } from "@/lib/characters/tenten-experience";

/**
 * Tenten sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--ten-*`, kök öğedeki deri bloğu); bu dosyada tek hex
 * yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * neyin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durduruyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama istemci adaları (`WeaponScroll`,
 * `ScrollShell`) onu çağırıyor — düz JSX olduğu için istemci paketine
 * giriyor, ek bağımlılık getirmiyor. Sunucu tarafında (hero püskülü, hedef
 * tahtası) aynı bileşenler kullanılıyor.
 */

type ArmKey = TentenArm["key"];

/* ══ SEKİZ SİLAH ══════════════════════════════════════════════════════════
   Hepsi ORTAK 160×160 kutuda ve hepsi DİK çizildi: döndürme çağıranın işi
   (cephanelik saçılmasında her parça farklı açıda duruyor). Ortak kutu
   sayesinde mühür karesindeki küçük çizim ile panelde büyüyen çizim aynı
   yoldan geliyor — iki ayrı çizim seti bakılamazdı. */

const ARM_ART: Record<ArmKey, React.ReactElement> = {
  /* 苦無 — yaprak ağız, dar sap, halka topuz */
  kunai: (
    <g>
      <path
        d="M80 6 L101 54 L92 71 L68 71 L59 54 Z"
        fill="var(--ten-steel)"
      />
      <path
        d="M80 14 L80 68"
        stroke="var(--ten-scroll)"
        strokeWidth="1.4"
        strokeOpacity="0.5"
      />
      <path d="M71 71 L89 71 L87 120 L73 120 Z" fill="var(--ten-steel)" />
      <path
        d="M73 84 L87 84 M73 98 L87 98 M73 112 L87 112"
        stroke="var(--ten-scroll)"
        strokeWidth="1.2"
        strokeOpacity="0.35"
      />
      <circle
        cx="80"
        cy="136"
        r="12"
        fill="none"
        stroke="var(--ten-steel)"
        strokeWidth="6"
      />
    </g>
  ),

  /* 手裏剣 — dört uzun uç, oyuk bel, ortada delik */
  shuriken: (
    <g>
      <path
        d="M80 6 L95.6 64.4 L154 80 L95.6 95.6 L80 154 L64.4 95.6 L6 80 L64.4 64.4 Z"
        fill="var(--ten-steel)"
      />
      <circle cx="80" cy="80" r="9.5" fill="var(--bg)" />
      <circle
        cx="80"
        cy="80"
        r="9.5"
        fill="none"
        stroke="var(--ten-scroll)"
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />
    </g>
  ),

  /* 千本 — üç iğne, tabandan yelpazelenmiş */
  senbon: (
    <g fill="var(--ten-steel)">
      <path d="M80 8 L84 40 L82 150 L78 150 L76 40 Z" />
      <path
        d="M80 8 L84 40 L82 150 L78 150 L76 40 Z"
        transform="rotate(-9 80 150)"
      />
      <path
        d="M80 8 L84 40 L82 150 L78 150 L76 40 Z"
        transform="rotate(9 80 150)"
      />
    </g>
  ),

  /* 双節棍 — iki sopa, arada zincir */
  nunchaku: (
    <g>
      <rect
        x="-9"
        y="-38"
        width="18"
        height="76"
        rx="6"
        fill="var(--ten-steel)"
        transform="translate(56 52) rotate(-24)"
      />
      <rect
        x="-9"
        y="-38"
        width="18"
        height="76"
        rx="6"
        fill="var(--ten-steel)"
        transform="translate(108 104) rotate(-24)"
      />
      <path
        d="M71.5 86.7 L92.6 69.3"
        stroke="var(--ten-steel)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </g>
  ),

  /* 鎖鎌 — sap, hilal ağız, zincir ve ağırlık */
  kusarigama: (
    <g>
      <rect
        x="34"
        y="30"
        width="13"
        height="68"
        rx="4"
        fill="var(--ten-steel)"
      />
      <path
        d="M40 33 C 72 20, 106 33, 122 62 C 108 43, 74 35, 44 46 Z"
        fill="var(--ten-steel)"
      />
      <path
        d="M40 98 C 62 128, 96 134, 118 124"
        stroke="var(--ten-steel)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="3.5 4"
        fill="none"
      />
      <circle cx="127" cy="120" r="11" fill="var(--ten-steel)" />
    </g>
  ),

  /* 棒 — ağzı olmayan tek silah; iki metal bilezik */
  bo: (
    <g transform="translate(80 80) rotate(34)">
      <rect
        x="-8"
        y="-74"
        width="16"
        height="148"
        rx="5"
        fill="var(--ten-steel)"
      />
      <rect
        x="-9"
        y="-50"
        width="18"
        height="7"
        fill="var(--ten-scroll)"
        fillOpacity="0.55"
      />
      <rect
        x="-9"
        y="43"
        width="18"
        height="7"
        fill="var(--ten-scroll)"
        fillOpacity="0.55"
      />
    </g>
  ),

  /* 鉾 — uzun sap, mızrak ucu, sağda balta ağzı, solda kanca */
  hoko: (
    <g fill="var(--ten-steel)">
      <rect x="74" y="42" width="12" height="114" rx="4" />
      <path d="M80 4 L89 34 L80 44 L71 34 Z" />
      <path d="M86 40 C 113 42, 129 58, 127 84 C 113 70, 99 66, 86 68 Z" />
      <path d="M74 46 C 61 48, 55 57, 57 68 C 64 59, 69 57, 74 57 Z" />
    </g>
  ),

  /* 芭蕉扇 — yaprak yelpaze, teller, sap */
  bashosen: (
    <g>
      <path
        d="M80 6 C 119 18, 141 51, 135 90 L80 105 L25 90 C 19 51, 41 18, 80 6 Z"
        fill="var(--ten-steel)"
      />
      <g
        stroke="var(--ten-scroll)"
        strokeWidth="1.6"
        strokeOpacity="0.45"
        fill="none"
      >
        <path d="M80 103 L80 8" />
        <path d="M80 103 L106 14" />
        <path d="M80 103 L126 33" />
        <path d="M80 103 L134 62" />
        <path d="M80 103 L54 14" />
        <path d="M80 103 L34 33" />
        <path d="M80 103 L26 62" />
      </g>
      <rect
        x="73"
        y="100"
        width="14"
        height="54"
        rx="6"
        fill="var(--ten-steel)"
      />
      <rect
        x="71"
        y="112"
        width="18"
        height="6"
        rx="2"
        fill="var(--ten-scroll)"
        fillOpacity="0.55"
      />
    </g>
  ),
};

/** Tek silah — mühür karesinde küçük, panelde büyük; aynı çizim. */
export function WeaponGlyph({
  name,
  className,
}: {
  name: ArmKey;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {ARM_ART[name]}
    </svg>
  );
}

/* ══ CEPHANELİK SAÇILMASI ═════════════════════════════════════════════════
   Bölümün arka planı. Tomar açıldıkça çıkan silahlar burada BİRİKİYOR —
   panelde görünen tek silahın aksine, açılmış her kare kalıcı olarak
   sayfada duruyor. Konum/açı/ölçü tablosu elle ayarlandı: parçalar
   metin sütununun altına gelmeyecek biçimde kenarlara dağıtıldı. */

const SCATTER: { key: ArmKey; x: number; y: number; r: number; s: number }[] = [
  { key: "kunai", x: 168, y: 150, r: -28, s: 1.05 },
  { key: "shuriken", x: 1040, y: 118, r: 14, s: 0.9 },
  { key: "senbon", x: 96, y: 486, r: 22, s: 0.85 },
  { key: "nunchaku", x: 1122, y: 430, r: -18, s: 1 },
  { key: "kusarigama", x: 250, y: 760, r: -8, s: 1.1 },
  { key: "bo", x: 964, y: 726, r: 40, s: 1.15 },
  { key: "hoko", x: 470, y: 858, r: 62, s: 0.95 },
  { key: "bashosen", x: 760, y: 96, r: -12, s: 1.25 },
];

export function ArmoryScatter({
  open,
  className,
  pieceClassName,
}: {
  /** Kaç mühür karesi açıldı (1–8) */
  open: number;
  className?: string;
  pieceClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      {SCATTER.map((item, index) => (
        <g
          key={item.key}
          className={pieceClassName}
          data-on={index < open ? "true" : undefined}
          style={{ transitionDelay: `${index * 40}ms` }}
          transform={`translate(${item.x} ${item.y}) rotate(${item.r}) scale(${item.s}) translate(-80 -80)`}
        >
          {ARM_ART[item.key]}
        </g>
      ))}
    </svg>
  );
}

/* ══ PARŞÖMEN DONANIMI ════════════════════════════════════════════════════
   Kâğıdın kendisi CSS'te (yükseklik durum değişkeniyle büyüyor); ahşap
   silindir ve hâlâ sarılı kalan alt kısım burada. İkisi de kâğıdın
   üstünde/altında akışta duruyor, yani kâğıt uzadıkça alttaki rulo
   kendiliğinden aşağı iniyor — JS hiçbir konum hesaplamıyor. */

/** Üstteki ahşap silindir. */
export function ScrollRod({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 30"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <rect
        x="16"
        y="7"
        width="208"
        height="16"
        rx="8"
        fill="var(--ten-scroll)"
        fillOpacity="0.55"
      />
      <rect
        x="16"
        y="7"
        width="208"
        height="6"
        rx="3"
        fill="var(--ten-scroll)"
        fillOpacity="0.8"
      />
      <circle cx="13" cy="15" r="11" fill="var(--ten-edge)" fillOpacity="0.9" />
      <circle cx="227" cy="15" r="11" fill="var(--ten-edge)" fillOpacity="0.9" />
    </svg>
  );
}

/** Alttaki hâlâ sarılı kalan kısım — açılan kâğıdın peşinden aşağı iner. */
export function ScrollRoll({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 54"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <rect
        x="8"
        y="6"
        width="224"
        height="42"
        rx="21"
        fill="var(--ten-scroll)"
        fillOpacity="0.42"
      />
      <rect
        x="8"
        y="6"
        width="224"
        height="12"
        rx="6"
        fill="var(--ten-scroll)"
        fillOpacity="0.16"
      />
      <g
        stroke="var(--ten-scroll)"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        fill="none"
      >
        <path d="M28 12 C 18 22, 18 34, 28 42" />
        <path d="M212 12 C 222 22, 222 34, 212 42" />
      </g>
    </svg>
  );
}

/* ══ HERO PÜSKÜLÜ ═════════════════════════════════════════════════════════
   İki topuzdan sarkan kırmızı şerit — kadrajı yukarıdan aşağı kesiyor.
   Dolgulu (stroke değil): şerit kıvrıldıkça genişliği değişiyor, bunu
   çizgi kalınlığıyla yapmak mümkün değil. */

export function TasselRibbon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 940"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
      focusable="false"
    >
      <path
        fill="var(--ten-edge)"
        d="M126 -12 C 96 96, 172 152, 144 258 C 118 356, 184 404, 158 508 C 136 598, 190 660, 172 772 C 162 840, 138 884, 128 942 L156 942 C 168 884, 192 840, 202 772 C 220 660, 166 598, 188 508 C 214 404, 148 356, 174 258 C 202 152, 126 96, 156 -12 Z"
      />
      {/* Düğüm — şeridin en dar yerinde */}
      <path
        fill="var(--ten-edge)"
        d="M132 240 C 158 232, 186 244, 190 268 C 168 258, 148 258, 130 266 Z"
      />
      {/* Saçak: üç ince tel, aşağı doğru inceliyor */}
      <g stroke="var(--ten-edge)" strokeLinecap="round" fill="none">
        <path d="M140 860 C 132 890, 128 912, 130 938" strokeWidth="3.5" />
        <path d="M162 866 C 168 894, 172 914, 170 938" strokeWidth="2.6" />
        <path d="M152 872 C 150 900, 150 918, 152 938" strokeWidth="2" />
      </g>
    </svg>
  );
}

/* ══ SŌRYŪ TENSAKAI — İKİZ EJDERHA ŞERİTLERİ ══════════════════════════════
   İki tomar havada açılıp ejderhaya dönüşüyor: gövde parşömen renginde,
   içinden geçen ince hat kırmızı. Yükselme HAREKETİ CSS'te (`strokeDasharray`
   ile çizilme), burada yalnızca geometri var. */

export function TwinDragon({
  className,
  bodyClassName,
  side,
}: {
  className?: string;
  bodyClassName?: string;
  /** "left" ya da "right" — sağ taraf aynalanır */
  side: "left" | "right";
}) {
  const SPINE =
    "M56 726 C 28 646, 88 598, 62 514 C 36 430, 94 386, 70 302 C 52 236, 98 194, 82 128 C 72 86, 56 58, 66 10";

  return (
    <svg
      className={className}
      viewBox="0 0 140 730"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      data-side={side}
      aria-hidden
      focusable="false"
    >
      {/* Gövde: kalın parşömen şeridi */}
      <path
        className={bodyClassName}
        data-layer="body"
        d={SPINE}
        stroke="var(--ten-scroll)"
        strokeOpacity="0.5"
        strokeWidth="15"
        strokeLinecap="round"
        pathLength={1}
      />
      {/* İç hat: kırmızı kenar */}
      <path
        className={bodyClassName}
        data-layer="edge"
        d={SPINE}
        stroke="var(--ten-edge)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
      />
      {/* Sırt kanatçıkları */}
      <g className={bodyClassName} data-layer="fins" fill="var(--ten-edge)">
        <path d="M64 640 L84 620 L70 660 Z" />
        <path d="M58 468 L80 452 L64 490 Z" />
        <path d="M70 292 L92 278 L76 314 Z" />
        <path d="M78 140 L98 128 L84 162 Z" />
      </g>
      {/* Baş — şeridin tepesinde */}
      <g className={bodyClassName} data-layer="head">
        <path
          d="M66 26 C 54 18, 52 4, 62 -2 C 70 -6, 84 0, 86 12 C 88 24, 78 32, 66 26 Z"
          fill="var(--ten-scroll)"
          fillOpacity="0.75"
        />
        <circle cx="72" cy="10" r="3" fill="var(--ten-edge)" />
        <path
          d="M84 6 C 98 -6, 112 -8, 122 -2"
          stroke="var(--ten-edge)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/** Mod düğmesinin gliffi: birbirine sarılmış iki tomar. */
export function TwinScrollKnot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M9 27 C 3 20, 13 17, 10 11 C 8.5 8, 10 5, 13 4"
        stroke="var(--ten-scroll)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23 27 C 29 20, 19 17, 22 11 C 23.5 8, 22 5, 19 4"
        stroke="var(--ten-scroll)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="13" cy="4" r="2.4" fill="var(--ten-edge)" />
      <circle cx="19" cy="4" r="2.4" fill="var(--ten-edge)" />
    </svg>
  );
}

/* ══ HEDEF TAHTASI ════════════════════════════════════════════════════════
   İsabet bölümünün tek grafiği. Halkalar eşit aralıklı DEĞİL: dışa doğru
   açılıyorlar, böylece merkez optik olarak daha küçük ve daha "zor"
   görünüyor. İzler tam ortada, hepsi 8 birimlik bir dairenin içinde. */

/** İsabet izleri — merkeze göre ofset, hepsi 8 birim yarıçapın içinde. */
const HITS: [number, number, number][] = [
  [0, -4, 18],
  [3, 2, -34],
  [-4, 1, 62],
  [1, -1, 8],
  [-2, -5, -12],
  [5, -3, 44],
  [-1, 5, -58],
];

export function TargetBoard({
  className,
  ringClassName,
  hitClassName,
  title,
}: {
  className?: string;
  ringClassName?: string;
  hitClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Ahşap tahta */}
      <rect
        x="6"
        y="6"
        width="228"
        height="228"
        rx="14"
        fill="var(--ten-scroll)"
        fillOpacity="0.08"
        stroke="var(--ten-scroll)"
        strokeOpacity="0.25"
        strokeWidth="1.2"
      />
      <g className={ringClassName} stroke="var(--ten-steel)" fill="none">
        <circle cx="120" cy="120" r="106" strokeWidth="1" strokeOpacity="0.28" />
        <circle cx="120" cy="120" r="82" strokeWidth="1.2" strokeOpacity="0.4" />
        <circle cx="120" cy="120" r="58" strokeWidth="1.4" strokeOpacity="0.55" />
        <circle cx="120" cy="120" r="36" strokeWidth="1.6" strokeOpacity="0.75" />
        <circle cx="120" cy="120" r="17" strokeWidth="1.8" strokeOpacity="0.95" />
      </g>
      {/* Tam orta */}
      <circle cx="120" cy="120" r="6.5" fill="var(--ten-edge)" />
      {/* İsabet izleri — her biri bir çentik */}
      <g
        className={hitClassName}
        stroke="var(--ten-edge)"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        {HITS.map(([dx, dy, angle], index) => (
          <path
            key={`${dx}-${dy}-${index}`}
            data-hit={index}
            d="M-5 0 L5 0"
            transform={`translate(${120 + dx} ${120 + dy}) rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  );
}
