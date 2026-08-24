import type { SaiFigureKey } from "@/lib/characters/sai-experience";

/**
 * Sai sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün mürekkep grafiği burada, saf SVG olarak duruyor —
 * emsal `components/character/itachi/SharinganEyes.tsx` ve
 * `components/character/shikamaru-nara/ShadowGlyphs.tsx`.
 *
 * Renkler yalnızca token'dan: `--sai-ink` (dolgu), `--sai-brush` (yıkama),
 * `--sai-seal` (mühür kızılı), `--accent`. Bu dosyada tek hex yok.
 *
 * ── ÇİZİM SIRASI, YANİ SAYFANIN TEK YAZILMIŞ ANI ─────────────────────────
 * Her figür üç katman: (1) `stroke` yolları — `pathLength={1}` ile
 * normalize edilmiş, CSS `stroke-dashoffset` ile ÇİZİLİYOR; (2) `fill`
 * gövdesi — çizgi bittikten sonra mürekkebini alıyor; (3) mühür + göz.
 * Hangi katmanın ne zaman görüneceğini `data-on` söylüyor, ZAMANLAMA
 * tamamen CSS'te (gecikmeler `data-step` ile). Böylece reduced-motion
 * battaniyesi hepsini tek yerden durdurabiliyor: geçiş kapanınca figür
 * doğrudan tam çizilmiş görünüyor.
 *
 * ⚠️ Bu dosyada "use client" YOK: düz JSX. Hem sunucu bileşeni (hero
 * lekesi) hem istemci adası (`InkScroll`) aynı bileşenleri çağırıyor.
 */

/* ── Hero: büyük mürekkep lekesi ──────────────────────────────────────────
   Düzenli bir daire DEĞİL: kenarları asimetrik, altından iki damla
   sızıyor ve etrafa sıçrama noktaları düşmüş. Fırça kâğıda basılmış, sonra
   biraz beklenmiş — lekenin okuması bu. */

/** Sıçrama noktaları: [x, y, yarıçap] */
const SPLATTER: [number, number, number][] = [
  [352, 92, 9],
  [376, 140, 5],
  [58, 300, 11],
  [30, 246, 4.5],
  [318, 356, 7],
  [122, 386, 5.5],
  [366, 232, 3.5],
  [92, 40, 6],
];

export function InkBlot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g fill="var(--sai-blot)">
        <path d="M198 18 C 254 10 308 42 338 90 C 364 132 388 176 376 228 C 364 280 320 322 268 346 C 220 368 158 372 114 344 C 68 314 38 258 28 204 C 18 148 40 86 84 52 C 118 26 158 24 198 18 Z" />
        {/* Damlalar: leke aşağı doğru akmış */}
        <path d="M262 344 C 272 366 268 388 250 394 C 238 386 238 366 246 348 Z" />
        <path d="M120 358 C 126 374 122 388 110 390 C 102 382 104 368 110 356 Z" />
        {SPLATTER.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      {/* Çekirdek: lekenin en koyu yeri, kenarından biraz içeride */}
      <path
        d="M204 62 C 250 56 292 84 314 124 C 336 164 332 220 302 258 C 272 296 216 314 168 300 C 120 286 86 240 82 194 C 78 148 106 102 148 78 C 166 68 186 64 204 62 Z"
        fill="var(--sai-ink)"
        fillOpacity="0.55"
      />
    </svg>
  );
}

/* ── Hero: lekenin üstünden geçen fırça darbeleri ─────────────────────────
   Üç darbe, üçü de ucu inceltilmiş DOLGU (stroke değil): gerçek bir fırça
   darbesinin kalınlığı boyunca değişir, sabit kalınlıklı bir çizgi değildir. */

export function BrushStrokes({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 300"
      fill="var(--sai-brush)"
      aria-hidden
      focusable="false"
    >
      <path d="M8 96 C 96 42 216 24 402 40 C 402 52 402 58 400 68 C 214 56 100 78 16 122 Z" />
      <path d="M18 196 C 120 168 248 168 396 196 C 394 206 392 210 390 216 C 246 194 124 194 26 216 Z" />
      <path d="M46 264 C 130 246 228 244 344 262 C 342 270 340 274 338 278 C 226 266 132 268 52 282 Z" />
    </svg>
  );
}

/* ── Mühür (hanko) ───────────────────────────────────────────────────────
   Kare taş, içine サ (sa) kazınmış. Sayfanın TEK sıcak noktası: figür
   canlandığında kâğıda basılıyor, mod düğmesinde duruyor, hero'da adın
   yanında. Sumi modunda gri düşüyor — imza çekiliyor. */

export function BrushSeal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="2.5" fill="var(--sai-seal)" />
      <g
        stroke="var(--sai-ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M8 12.5 L 24 12.5" />
        <path d="M12.8 7.5 L 11.8 17.5" />
        <path d="M19.6 7.5 C 20.6 15 20.8 20.5 19 24.5" />
      </g>
    </svg>
  );
}

/* ── Fırça ucu: mod düğmesinin gliffi ────────────────────────────────────
   Sap + ucu mürekkebe batmış kıl demeti. Mod açıkken CSS onu eğiyor. */

export function BrushTip({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M20.5 3.5 L 27 10"
        stroke="var(--sai-brushTip)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M9 15 L 15.5 21.5 C 12 25.5 7.5 27.5 4 28 C 4.5 24 6 19 9 15 Z"
        fill="var(--sai-ink)"
      />
      <path
        d="M20.5 3.5 L 27 10 L 17.5 19 L 11.5 13 Z"
        fill="var(--sai-brushTip)"
        fillOpacity="0.45"
      />
    </svg>
  );
}

/* ══ Beş mürekkep figürü ═════════════════════════════════════════════════
   Her figür sumi-e mantığıyla çizildi: az sayıda kararlı darbe, ayrıntı
   yok, yüz hiç yok. Gövde dolguları ayrı yollar — "canlanma" anında
   mürekkep o dolgulara akıyor.

   Ortak tuval: 240 × 160. Bütün yollar bu kutuya göre yazıldı. */

interface FigureArt {
  /** Çizim sırası bu dizinin sırası; `data-step` gecikmeyi buradan alıyor */
  strokes: { d: string; w: number }[];
  /** Canlanınca mürekkebini alan gövde parçaları */
  fills: string[];
  /** Mühür vurulunca açılan göz */
  eye: { cx: number; cy: number; r: number };
  /** Yalnızca kuş sürüsünde: [x, y, ölçek] üçlüleri */
  marks?: [number, number, number][];
}

const FIGURE_ART: Record<SaiFigureKey, FigureArt> = {
  /* Çömelmiş bir muhafız aslanı: yele solda kütle, gövde sağa uzanıyor */
  lion: {
    strokes: [
      { d: "M96 44 C 128 32 168 40 188 66 C 200 82 202 102 196 122", w: 3.4 },
      { d: "M74 88 C 72 108 76 126 84 140", w: 2.8 },
      { d: "M88 118 C 118 132 156 132 184 118", w: 2.2 },
      { d: "M182 112 C 192 124 192 136 184 146", w: 2.8 },
      { d: "M196 106 C 216 100 224 78 210 66 C 200 58 188 66 192 78", w: 2.4 },
      { d: "M96 44 C 76 30 52 32 40 48", w: 3.6 },
      { d: "M40 48 C 26 64 30 86 46 96", w: 3.6 },
      { d: "M46 96 C 60 106 82 102 90 88", w: 3.2 },
      { d: "M52 74 C 60 84 74 86 84 80", w: 2 },
      { d: "M40 66 C 48 62 58 64 62 70", w: 2 },
    ],
    fills: [
      "M66 28 C 88 26 102 42 100 62 C 98 84 82 102 62 100 C 42 98 28 82 30 62 C 32 42 46 30 66 28 Z",
      "M92 52 C 124 40 166 46 186 70 C 200 88 200 112 192 132 C 168 140 116 140 88 128 C 78 106 78 74 92 52 Z",
    ],
    eye: { cx: 52, cy: 66, r: 3.4 },
  },

  /* Sürü: önde tek büyük kuş, arkasında küçülen kanat işaretleri */
  birds: {
    strokes: [
      { d: "M150 62 C 128 40 104 34 78 40", w: 3.2 },
      { d: "M150 62 C 168 42 190 36 212 44", w: 3.2 },
      { d: "M150 62 C 148 78 152 90 160 100", w: 2.4 },
    ],
    fills: [
      "M150 56 C 157 56 161 63 159 72 C 157 83 151 93 147 100 C 142 91 140 78 142 68 C 143 61 146 56 150 56 Z",
    ],
    eye: { cx: 152, cy: 61, r: 2.6 },
    marks: [
      [36, 86, 0.95],
      [70, 114, 0.72],
      [104, 128, 0.55],
      [118, 86, 0.46],
      [192, 112, 0.82],
      [216, 86, 0.5],
      [154, 130, 0.36],
    ],
  },

  /* Tek kıvrımla çizilen yılan: fırça kâğıttan hiç kalkmıyor */
  snake: {
    strokes: [
      {
        d: "M14 134 C 50 134 52 98 86 94 C 120 90 122 56 156 52 C 174 50 184 56 190 66",
        w: 4.2,
      },
      { d: "M18 124 C 48 124 50 90 84 86", w: 1.8 },
      {
        d: "M188 64 C 200 56 216 60 220 72 C 223 83 216 93 204 93 C 194 93 188 86 190 78",
        w: 3,
      },
      { d: "M219 76 C 227 76 231 72 235 68", w: 1.6 },
      { d: "M219 78 C 227 80 231 84 235 88", w: 1.6 },
    ],
    fills: [
      "M14 140 C 50 140 52 104 86 100 C 120 96 122 62 156 58 C 176 55 188 62 196 72 C 188 80 182 80 174 74 C 166 68 156 68 146 72 C 128 80 124 106 96 112 C 70 118 62 150 18 150 Z",
      "M188 62 C 202 54 218 58 222 72 C 225 84 217 95 204 95 C 194 95 187 87 189 78 C 196 84 206 84 212 78 C 216 73 214 66 208 63 Z",
    ],
    eye: { cx: 208, cy: 72, r: 2.6 },
  },

  /* En küçük ve en çok çizilen figür: yuvarlak gövde, iki kulak, uzun kuyruk */
  mouse: {
    strokes: [
      { d: "M74 116 C 66 92 84 74 108 76 C 128 78 140 92 138 110", w: 3 },
      { d: "M74 116 C 90 128 124 128 138 110", w: 2.4 },
      { d: "M92 74 C 84 62 90 52 100 54 C 108 56 110 66 104 74", w: 2.4 },
      { d: "M118 78 C 114 66 120 58 128 60 C 136 62 136 72 130 80", w: 2.4 },
      { d: "M138 108 C 162 116 186 108 194 88 C 200 72 190 60 178 60", w: 2 },
      { d: "M74 104 C 62 102 54 106 50 112", w: 2 },
      { d: "M92 122 C 90 132 92 140 98 144", w: 1.8 },
      { d: "M124 122 C 124 132 128 140 134 142", w: 1.8 },
    ],
    fills: [
      "M76 114 C 68 92 86 76 108 78 C 128 80 138 94 136 110 C 120 124 92 124 76 114 Z",
      "M93 73 C 86 62 91 53 100 55 C 107 57 109 66 104 73 C 100 70 97 70 93 73 Z",
      "M119 77 C 115 66 121 59 128 61 C 135 63 135 72 130 79 C 126 76 123 75 119 77 Z",
    ],
    eye: { cx: 74, cy: 100, r: 2.4 },
  },

  /* Tomarın bir ucundan öbürüne uzanan tek gövde */
  dragon: {
    strokes: [
      {
        d: "M14 138 C 44 138 50 108 78 102 C 106 96 112 66 140 60 C 162 55 174 64 182 76",
        w: 4,
      },
      { d: "M18 128 C 44 128 50 100 76 94 C 102 88 108 60 134 54", w: 1.8 },
      {
        d: "M180 70 C 192 58 212 60 218 72 C 224 84 216 96 202 96 C 190 96 182 88 182 78",
        w: 3,
      },
      { d: "M198 60 C 200 46 208 38 220 36", w: 2.2 },
      { d: "M207 62 C 213 50 223 46 233 48", w: 2.2 },
      { d: "M186 88 C 170 94 156 90 146 80", w: 1.8 },
      { d: "M203 95 C 199 111 187 121 171 123", w: 1.8 },
      { d: "M60 110 C 58 104 57 100 56 96", w: 1.6 },
      { d: "M88 98 C 87 91 87 87 86 83", w: 1.6 },
      { d: "M118 84 C 118 77 118 73 118 69", w: 1.6 },
      { d: "M148 70 C 149 63 150 59 151 55", w: 1.6 },
      { d: "M96 100 C 92 112 94 124 102 130", w: 2 },
    ],
    fills: [
      "M12 144 C 44 144 50 114 78 108 C 106 102 112 72 140 66 C 160 62 172 68 180 78 C 172 86 164 86 156 80 C 146 72 134 74 124 82 C 108 96 104 118 76 124 C 50 130 44 150 14 150 Z",
      "M180 68 C 194 56 214 59 220 72 C 226 85 217 98 202 98 C 191 98 183 90 183 80 C 190 88 202 89 209 82 C 214 76 212 69 205 66 Z",
    ],
    eye: { cx: 205, cy: 74, r: 2.8 },
  },
};

/** Sürüdeki tek kuş: iki kanat, tek darbe. Ölçek `transform` ile veriliyor,
    kalınlık `vectorEffect` sayesinde sabit kalıyor. */
const FLOCK_MARK = "M-11 5 C -5 -3 -2 -3 0 3 C 2 -3 5 -3 11 5";

export function InkBeast({
  figure,
  active,
  className,
  strokeClassName,
  fillClassName,
  eyeClassName,
}: {
  figure: SaiFigureKey;
  /** Etkin durak mı — çizim, dolgu ve göz buna bakıyor */
  active: boolean;
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
  eyeClassName?: string;
}) {
  const art = FIGURE_ART[figure];
  const on = active ? "true" : undefined;

  return (
    <svg
      className={className}
      viewBox="0 0 240 160"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* 2 · gövde mürekkebi — çizgi bittikten sonra akıyor */}
      <g className={fillClassName} data-on={on} fill="var(--sai-ink)">
        {art.fills.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* 1 · çizgi — sayfanın tek yazılmış anı */}
      <g stroke="var(--sai-ink)" strokeLinecap="round" strokeLinejoin="round">
        {art.strokes.map((stroke, index) => (
          <path
            key={stroke.d}
            className={strokeClassName}
            data-step={index}
            data-on={on}
            d={stroke.d}
            strokeWidth={stroke.w}
            pathLength={1}
          />
        ))}
        {art.marks?.map(([x, y, scale], index) => (
          <path
            key={`${x}-${y}`}
            className={strokeClassName}
            data-step={art.strokes.length + index}
            data-on={on}
            d={FLOCK_MARK}
            transform={`translate(${x} ${y}) scale(${scale})`}
            strokeWidth={2.6}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
          />
        ))}
      </g>

      {/* 3 · göz — çizilmez, mühür vurulunca açılır */}
      <circle
        className={eyeClassName}
        data-on={on}
        cx={art.eye.cx}
        cy={art.eye.cy}
        r={art.eye.r}
        fill="var(--sai-seal)"
      />
    </svg>
  );
}
