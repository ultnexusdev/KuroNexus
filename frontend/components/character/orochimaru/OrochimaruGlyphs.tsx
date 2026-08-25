/**
 * Orochimaru sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca CSS
 * modülündeki token'lardan geliyor (`--oro-*`), bu dosyada da tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * neyin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durduruyor.
 *
 * ⚠️ Bu dosyada `Math.random` YOK ve olmamalı: yığın ve kıvrım sunucuda
 * çiziliyor, rastgele bir geometri hidrasyonda uyuşmazlık üretirdi. Prosedürel
 * geometrinin tamamı modül düzeyinde BİR KEZ hesaplanıyor (istek başına değil).
 *
 * ⚠️ "use client" YOK: düz JSX olduğu için hem sunucu bölümlerinde (hero,
 * raf) hem de istemci adasında (yığın) ek bağımlılık getirmeden kullanılıyor.
 */

/* ══ Hero: kıvrılan yılan gövdesi ═══════════════════════════════════════════
   Arşimet sarmalı: yarıçap dışarıdan içeriye doğru eriyor, gövde de onunla
   birlikte inceliyor. Tek bir kalın çizgi yerine yedi parça çizilmesinin
   sebebi bu — SVG'de stroke-width bir yol boyunca değişemez, parçalara
   bölmek konikliği elle vermenin tek yolu. */

const COIL_CX = 262;
const COIL_CY = 252;
const COIL_TURNS = 2.55;
const COIL_R_OUT = 236;
const COIL_R_IN = 30;
/** Elipsleştirme: gövde tam daire değil, yatık bir kıvrım */
const COIL_SQUASH = 0.88;
const COIL_W_OUT = 34;
const COIL_W_IN = 7;

function coilPoint(t: number): [number, number] {
  const angle = t * COIL_TURNS * Math.PI * 2 - Math.PI / 2;
  const radius = COIL_R_OUT + (COIL_R_IN - COIL_R_OUT) * t;
  return [
    COIL_CX + Math.cos(angle) * radius,
    COIL_CY + Math.sin(angle) * radius * COIL_SQUASH,
  ];
}

const COIL_SEGMENTS: { d: string; width: number }[] = (() => {
  const parts = 7;
  const stepsPerPart = 24;
  const segments: { d: string; width: number }[] = [];
  for (let part = 0; part < parts; part += 1) {
    const points: string[] = [];
    for (let step = 0; step <= stepsPerPart; step += 1) {
      const t = (part * stepsPerPart + step) / (parts * stepsPerPart);
      const [x, y] = coilPoint(t);
      points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    const t0 = part / parts;
    segments.push({
      d: `M${points.join(" L")}`,
      width: COIL_W_OUT + (COIL_W_IN - COIL_W_OUT) * t0,
    });
  }
  return segments;
})();

/** Gövdeye enine binen pul kaburgaları — yarıçap yönünde kısa çizgiler. */
const COIL_RIBS: string = (() => {
  const total = 58;
  const marks: string[] = [];
  for (let i = 1; i < total; i += 1) {
    const t = i / total;
    const [x, y] = coilPoint(t);
    const angle = t * COIL_TURNS * Math.PI * 2 - Math.PI / 2;
    const half = (COIL_W_OUT + (COIL_W_IN - COIL_W_OUT) * t) * 0.4;
    const nx = Math.cos(angle) * half;
    const ny = Math.sin(angle) * half * COIL_SQUASH;
    marks.push(
      `M${(x - nx).toFixed(1)} ${(y - ny).toFixed(1)} L${(x + nx).toFixed(1)} ${(y + ny).toFixed(1)}`,
    );
  }
  return marks.join(" ");
})();

export function SerpentCoil({
  className,
  bodyClassName,
  ribClassName,
}: {
  className?: string;
  bodyClassName?: string;
  ribClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 524 504"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <g strokeLinecap="round" fill="none">
        {COIL_SEGMENTS.map((segment) => (
          <path
            key={segment.d.slice(0, 24)}
            className={bodyClassName}
            d={segment.d}
            stroke="var(--oro-coil)"
            strokeWidth={segment.width.toFixed(1)}
          />
        ))}
        <path
          className={ribClassName}
          d={COIL_RIBS}
          stroke="var(--oro-scale)"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

/* ══ Sarı gözler — sayfanın tek vurgu noktası ════════════════════════════ */

function almondPath(cx: number, cy: number, rx: number, ry: number): string {
  return [
    `M${cx - rx} ${cy}`,
    `C${cx - rx * 0.55} ${cy - ry * 2} ${cx + rx * 0.55} ${cy - ry * 2} ${cx + rx} ${cy}`,
    `C${cx + rx * 0.55} ${cy + ry * 2} ${cx - rx * 0.55} ${cy + ry * 2} ${cx - rx} ${cy}`,
    "Z",
  ].join(" ");
}

function slitPath(cx: number, cy: number, ry: number): string {
  const w = ry * 0.3;
  return [
    `M${cx} ${cy - ry}`,
    `C${cx + w} ${cy - ry * 0.35} ${cx + w} ${cy + ry * 0.35} ${cx} ${cy + ry}`,
    `C${cx - w} ${cy + ry * 0.35} ${cx - w} ${cy - ry * 0.35} ${cx} ${cy - ry}`,
    "Z",
  ].join(" ");
}

/**
 * İki yılan gözü, dikey gözbebeğiyle. Işıma CSS'te (`drop-shadow`) —
 * SVG filtresi yerine sınıf kullanmanın sebebi mod düğmesinin ışımayı
 * tek bir değişkenle değiştirebilmesi.
 */
export function SerpentEyes({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 132 48"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {[30, 102].map((cx) => (
        <g key={cx}>
          <path
            d={almondPath(cx, 24, 27, 8)}
            fill="var(--gold)"
            fillOpacity="0.9"
          />
          <path
            d={almondPath(cx, 24, 27, 8)}
            stroke="var(--accent-hover)"
            strokeWidth="1.4"
            fill="none"
          />
          <path d={slitPath(cx, 24, 11)} fill="var(--bg)" />
        </g>
      ))}
    </svg>
  );
}

/* ══ Mod düğmesinin gliffi: kıvrılmış yılan ═════════════════════════════ */

export function SerpentMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M5 26 C5 18.5 11 16.5 16 19.5 C21 22.5 27 21 27 14.5 C27 8.6 22 5.4 16.6 6.6"
        stroke="var(--oro-scale)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16.6 6.6 C14.2 7.2 12.6 8.4 11.8 10"
        stroke="var(--oro-scale)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="11.4" cy="10.6" r="2.5" fill="var(--oro-scale)" />
      <circle cx="10.6" cy="10" r="0.9" fill="var(--bg)" />
    </svg>
  );
}

/* ══ Laboratuvar camı: deney tüpü ══════════════════════════════════════════
   Cam, ölçek çizgileri ve sıvı ayrı katmanlar. Sıvının yüksekliği tek bir
   sayıdan (`level`, 0-100) hesaplanıyor; tüpün geometrisi sabit. */

const TUBE_TOP = 34;
const TUBE_FLOOR = 176;

export function TestTube({
  level,
  className,
  glassClassName,
  liquidClassName,
  bubbleClassName,
}: {
  /** Sıvı yüksekliği, 0-100 */
  level: number;
  className?: string;
  glassClassName?: string;
  liquidClassName?: string;
  bubbleClassName?: string;
}) {
  const clamped = Math.min(Math.max(level, 0), 100);
  const surface = TUBE_FLOOR - ((TUBE_FLOOR - TUBE_TOP) * clamped) / 100;
  const liquid = [
    `M17 ${surface.toFixed(1)}`,
    `L17 ${TUBE_FLOOR}`,
    `A15 15 0 0 0 47 ${TUBE_FLOOR}`,
    `L47 ${surface.toFixed(1)}`,
    "Z",
  ].join(" ");

  return (
    <svg
      className={className}
      viewBox="0 0 64 206"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      focusable="false"
    >
      {/* Sıvı — camın ARDINDA, kenarları camın içinde kalıyor */}
      <g className={liquidClassName}>
        <path d={liquid} fill="var(--accent)" fillOpacity="0.3" />
        <ellipse
          cx="32"
          cy={surface.toFixed(1)}
          rx="15"
          ry="3.2"
          fill="var(--accent-hover)"
          fillOpacity="0.55"
        />
      </g>

      {/* Yükselen kabarcıklar — hareket CSS'te, no-preference kapısında */}
      <g className={bubbleClassName} fill="var(--accent-hover)" fillOpacity="0.5">
        <circle data-bubble="1" cx="27" cy="160" r="2.2" />
        <circle data-bubble="2" cx="36" cy="168" r="1.5" />
        <circle data-bubble="3" cx="31" cy="150" r="1.1" />
      </g>

      {/* Cam gövde */}
      <g className={glassClassName}>
        <path
          d={`M16 18 L16 ${TUBE_FLOOR} A16 16 0 0 0 48 ${TUBE_FLOOR} L48 18`}
          stroke="var(--oro-glass)"
          strokeOpacity="0.5"
          strokeWidth="1.6"
          fill="none"
        />
        {/* Ağız halkası */}
        <path
          d="M11 12 L53 12"
          stroke="var(--oro-glass)"
          strokeOpacity="0.65"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M16 18 L11 12 M48 18 L53 12"
          stroke="var(--oro-glass)"
          strokeOpacity="0.5"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Ölçek çentikleri */}
        <g stroke="var(--oro-glass)" strokeOpacity="0.32" strokeWidth="1.1">
          {[60, 88, 116, 144].map((y) => (
            <line key={y} x1="41" y1={y} x2="48" y2={y} />
          ))}
        </g>
        {/* Camın sol kenarındaki ışık şeridi */}
        <path
          d="M21 30 L21 158"
          stroke="var(--oro-glass)"
          strokeOpacity="0.24"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* ══ Dökülen deri: boş kabuk siluetleri ════════════════════════════════════
   Beş katmanın beşi de aynı viewBox'ta (0 0 220 348), yani üst üste
   bindiklerinde omuzlar ve baş hizalı duruyor. Dört ayrı gövde çizildi;
   BEŞİNCİSİ BİLEREK BİRİNCİNİN AYNISI — sayfanın söylediği şey bu: yığının
   en üstündeki en yeni deri, en eskisiyle aynı bedendir. */

interface HuskShape {
  outline: string;
  split: string;
  tears: string[];
  curl?: string;
  eye: { left: number; right: number; y: number; rx: number; ry: number };
  /** Hiç giyilmemiş deri kesik çizgiyle çiziliyor */
  ghost?: boolean;
}

const HUSK_INTACT: HuskShape = {
  outline: [
    "M110 22",
    "C127 22 139 36 139 54",
    "C139 67 133 78 123 84",
    "C148 93 164 114 168 142",
    "C172 170 166 197 160 222",
    "C156 240 154 256 157 272",
    "C161 299 151 322 129 331",
    "C113 338 95 338 79 331",
    "C58 322 48 300 52 274",
    "C56 250 61 234 59 214",
    "C55 186 49 158 53 130",
    "C57 104 73 88 97 84",
    "C87 78 81 67 81 54",
    "C81 36 93 22 110 22 Z",
  ].join(" "),
  split:
    "M110 86 C104 108 115 126 107 148 C99 172 112 190 104 214 C96 238 108 258 101 282",
  tears: [
    "M59 212 C68 208 76 212 85 208",
    "M161 224 C152 220 144 224 136 220",
    "M126 330 C121 321 113 321 108 330",
  ],
  curl: "M101 330 C90 344 100 358 116 354 C127 351 129 340 120 336",
  eye: { left: 98, right: 122, y: 52, rx: 9, ry: 3 },
};

const HUSK_BROAD: HuskShape = {
  outline: [
    "M110 26",
    "C129 26 142 40 142 59",
    "C142 72 135 83 125 89",
    "C154 99 172 122 175 152",
    "C178 182 170 208 163 232",
    "C159 249 158 264 161 279",
    "C165 305 153 326 130 333",
    "C112 339 94 338 78 330",
    "C55 319 46 296 51 270",
    "C56 246 62 231 59 211",
    "C54 182 46 154 51 126",
    "C56 100 73 86 96 89",
    "C86 83 78 72 78 59",
    "C78 40 91 26 110 26 Z",
  ].join(" "),
  split:
    "M110 91 C101 112 116 130 106 152 C96 176 113 194 103 218 C93 242 108 262 99 286",
  tears: [
    "M52 200 C63 195 72 201 82 196",
    "M174 158 C165 156 158 160 150 157",
    "M164 240 C154 236 146 241 138 237",
    "M129 332 C123 322 114 322 108 331",
  ],
  curl: "M99 331 C86 345 96 360 113 356 C125 353 127 341 117 337",
  eye: { left: 98, right: 124, y: 57, rx: 10, ry: 3.4 },
};

const HUSK_SLIM: HuskShape = {
  outline: [
    "M110 34",
    "C124 34 134 46 134 62",
    "C134 73 129 82 121 88",
    "C142 97 154 116 157 140",
    "C160 165 156 188 151 210",
    "C147 226 146 240 149 254",
    "C152 277 144 297 126 305",
    "C112 311 97 311 84 305",
    "C66 297 58 278 61 256",
    "C64 236 69 222 67 205",
    "C63 181 58 157 61 133",
    "C64 111 77 95 98 88",
    "C88 82 84 73 84 62",
    "C84 46 95 34 110 34 Z",
  ].join(" "),
  split:
    "M110 90 C105 108 114 124 108 144 C101 165 110 181 104 202 C98 222 107 240 101 260",
  tears: ["M62 240 C70 236 77 240 85 236", "M152 208 C145 205 138 208 131 205"],
  curl: "M103 304 C94 316 102 328 115 325 C124 322 125 313 117 310",
  eye: { left: 100, right: 121, y: 58, rx: 8, ry: 2.7 },
  ghost: true,
};

const HUSK_RESIDUE: HuskShape = {
  outline: [
    "M110 30",
    "C127 30 140 44 140 62",
    "C140 76 132 87 122 93",
    "C146 102 162 122 167 148",
    "C170 164 168 180 164 196",
    "C150 203 132 207 112 207",
    "C92 207 74 203 60 196",
    "C55 178 54 160 58 143",
    "C63 117 79 99 98 93",
    "C88 87 80 76 80 62",
    "C80 44 93 30 110 30 Z",
  ].join(" "),
  split: "M110 95 C103 116 114 134 106 156 C99 176 110 190 104 204",
  tears: [
    "M61 176 C70 172 78 176 87 172",
    "M166 170 C157 167 149 171 141 167",
  ],
  eye: { left: 98, right: 123, y: 60, rx: 9.5, ry: 3.2 },
};

/** Sıra ESKİDEN YENİYE — veri dosyasındaki `OROCHIMARU_SKINS` ile birebir. */
const HUSKS: HuskShape[] = [
  HUSK_INTACT,
  HUSK_BROAD,
  HUSK_SLIM,
  HUSK_RESIDUE,
  HUSK_INTACT,
];

export function ShedHusk({
  variant,
  lit,
  className,
  outlineClassName,
  splitClassName,
  eyeClassName,
}: {
  /** 0 tabanlı katman sırası (eskiden yeniye) */
  variant: number;
  /** Seçili deri: göz çukurları yanar, kabuğun kime ait olduğu görünür */
  lit?: boolean;
  className?: string;
  outlineClassName?: string;
  splitClassName?: string;
  eyeClassName?: string;
}) {
  const husk = HUSKS[Math.min(Math.max(variant, 0), HUSKS.length - 1)] ?? HUSK_INTACT;
  const { eye } = husk;

  return (
    <svg
      className={className}
      viewBox="0 0 220 366"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <path
        className={outlineClassName}
        d={husk.outline}
        fill="var(--oro-shed)"
        fillOpacity="0.05"
        stroke="var(--oro-shed)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeDasharray={husk.ghost ? "7 6" : undefined}
      />
      <path
        className={splitClassName}
        d={husk.split}
        stroke="var(--oro-shed)"
        strokeOpacity="0.7"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <g
        stroke="var(--oro-shed)"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      >
        {husk.tears.map((tear) => (
          <path key={tear} d={tear} />
        ))}
        {husk.curl ? <path d={husk.curl} strokeOpacity="0.6" /> : null}
      </g>
      <g className={eyeClassName} data-lit={lit ? "true" : undefined}>
        {[eye.left, eye.right].map((cx) => (
          <g key={cx}>
            <path
              d={almondPath(cx, eye.y, eye.rx, eye.ry)}
              fill={lit ? "var(--gold)" : "var(--bg)"}
              fillOpacity={lit ? 0.92 : 0.8}
              stroke="var(--oro-shed)"
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
            {lit ? (
              <path d={slitPath(cx, eye.y, eye.ry * 1.25)} fill="var(--bg)" />
            ) : null}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ══ Çizelgenin omurgası: dökülmüş bir deri halkası ══════════════════════ */

export function MoltRing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M14.4 3.6 C18.4 4.8 21 8.2 21 12 C21 17 17 21 12 21 C7 21 3 17 3 12 C3 7.6 6.2 3.9 10.4 3.2"
        stroke="var(--oro-scale)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10.4 3.2 C12.4 2.2 14.6 2.2 16.6 3"
        stroke="var(--oro-scale)"
        strokeOpacity="0.45"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
