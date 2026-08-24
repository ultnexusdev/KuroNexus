/**
 * Iruka sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--iru-chalk`, `--iru-scar`, `--iru-ramen`); bu
 * dosyada da tek hex yok.
 *
 * ── ÇİZİM DİLİ ───────────────────────────────────────────────────────────
 * Hepsi TEBEŞİR: yalnızca kontur, dolgu yok, yuvarlak uç, kalınlık 1.6–3.
 * Bir öğretmenin tahtaya çizeceği kadar kaba; ölçülü teknik çizim değil.
 * Bütün çizgiler `pathLength={1}` taşıyor, böylece CSS tek bir formülle
 * (`stroke-dasharray: 1`) hepsini çizdirebiliyor — uzunluk hesabı yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi çizginin ne zaman görüneceğini `data-on` / `data-order` söylüyor.
 * `data-order` çizim sırası (0–8), CSS'teki gecikme merdiveniyle eşleşiyor:
 * bir ders seçilince çizgiler sırayla iniyor, hepsi birden değil.
 *
 * ⚠️ Bu dosyada "use client" YOK ama `Blackboard` (istemci adası) onu
 * çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Hero'daki yara çizgisi ve tebeşir tozu sunucuda çiziliyor.
 */

/* ═══════════════════════════════════════════════════════════════════════
   1 · HERO — YARA VE TEBEŞİR TOZU
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Burnun üzerinden geçen yara.
 *
 * İki üst üste çizgi: altta kalın ve soluk (izin kendisi), üstte ince ve
 * parlak (taze kenar). Tek çizgi çizilseydi grafik bir "eğik çizgi" gibi
 * okunurdu; iki katman ona bir DERİNLİK veriyor.
 *
 * Portrenin üstünden geçiyor ve sayfanın sol kenarındaki kırmızı defter
 * çizgisiyle aynı token'ı kullanıyor (`--iru-scar`) — sayfanın fikri bu.
 */
export function ScarLine({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 48"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        className={strokeClassName}
        data-layer="under"
        d="M6 30 C 42 16 74 12 100 14 C 130 16 164 24 194 18"
        stroke="var(--iru-scar)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeOpacity="0.42"
        pathLength={1}
      />
      <path
        className={strokeClassName}
        data-layer="over"
        d="M10 29 C 44 17 74 13 100 15 C 130 17 162 25 190 19"
        stroke="var(--iru-scar)"
        strokeWidth="1.8"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/** Tebeşir tozu — akşam ışığının içinde asılı kalan zerreler. */
const DUST_MOTES = [
  [12, 78, 1.5],
  [27, 34, 1],
  [38, 88, 2.1],
  [46, 18, 1.2],
  [55, 62, 1.6],
  [63, 42, 1],
  [71, 91, 1.3],
  [78, 24, 1.8],
  [84, 66, 1.1],
  [91, 46, 1.5],
  [96, 82, 1],
  [20, 55, 1.2],
] as const;

export function ChalkDust({
  className,
  moteClassName,
}: {
  className?: string;
  moteClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="var(--iru-chalk)"
      aria-hidden
      focusable="false"
    >
      {DUST_MOTES.map(([x, y, r], index) => (
        <circle
          key={`${x}-${y}`}
          className={moteClassName}
          data-mote={index % 4}
          cx={x}
          cy={y}
          r={r}
          fillOpacity="0.5"
        />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   2 · MOD DÜĞMESİ — TAHTA SİLGİSİ
   ═══════════════════════════════════════════════════════════════════════ */

/** "Ders bitti" düğmesinin gliffi: ahşap sırtlı tahta silgisi ve tozu. */
export function EraserGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g transform="rotate(-8 16 16)">
        <path
          d="M6 10.5 H26 A1.6 1.6 0 0 1 27.6 12.1 V16 H4.4 V12.1 A1.6 1.6 0 0 1 6 10.5 Z"
          stroke="var(--iru-chalk)"
          strokeWidth="1.4"
          strokeOpacity="0.75"
        />
        <path
          d="M4.4 16 H27.6 V19.6 A1.6 1.6 0 0 1 26 21.2 H6 A1.6 1.6 0 0 1 4.4 19.6 Z"
          fill="var(--iru-chalk)"
          fillOpacity="0.22"
          stroke="var(--iru-chalk)"
          strokeWidth="1.4"
        />
      </g>
      <g fill="var(--iru-chalk)" fillOpacity="0.55">
        <circle cx="9" cy="26" r="1.1" />
        <circle cx="15.5" cy="28" r="0.8" />
        <circle cx="22" cy="25.5" r="1.3" />
      </g>
    </svg>
  );
}

/** Tebeşir oluğundaki iki nesne: bir tebeşir kütüğü ve silgi. */
export function ChalkTray({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 18"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Tebeşir kütüğü — bir ucu kullanılmaktan yuvarlanmış */}
      <path
        d="M8 7.5 H30 A2.4 2.4 0 0 1 32.4 9.9 V11.4 A2.4 2.4 0 0 1 30 13.8 H8 Z"
        fill="var(--iru-chalk)"
        fillOpacity="0.72"
      />
      {/* Silgi */}
      <g transform="translate(78 0)">
        <path
          d="M0 6.4 H30 V10 H0 Z"
          fill="var(--iru-chalk)"
          fillOpacity="0.28"
          stroke="var(--iru-chalk)"
          strokeOpacity="0.5"
          strokeWidth="0.9"
        />
        <path
          d="M0 10 H30 V13.6 H0 Z"
          fill="var(--iru-chalk)"
          fillOpacity="0.12"
          stroke="var(--iru-chalk)"
          strokeOpacity="0.35"
          strokeWidth="0.9"
        />
      </g>
      {/* Oluğa dökülmüş toz */}
      <g fill="var(--iru-chalk)" fillOpacity="0.4">
        <circle cx="42" cy="13" r="0.9" />
        <circle cx="50" cy="14" r="0.6" />
        <circle cx="62" cy="13.4" r="1" />
        <circle cx="70" cy="14.2" r="0.7" />
        <circle cx="114" cy="13.6" r="0.8" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   3 · DERSLERİN TEBEŞİR ÇİZİMLERİ
   Hepsi 200×150 kutuda; CSS tek ölçüyle hepsini yerleştiriyor.
   ═══════════════════════════════════════════════════════════════════════ */

/** Tek bir tebeşir çizgisi — çizim sırası `order`, açık/kapalı `drawn`. */
type Stroke = {
  d: string;
  order: number;
  width?: number;
};

/** 1 · Kunai tutuşu — kunai, halkadan geçen parmak, titreme işaretleri */
const GRIP_STROKES: Stroke[] = [
  { d: "M100 16 L114 52 L114 78 L86 78 L86 52 Z", order: 0, width: 2.2 },
  { d: "M93 78 L93 110 M107 78 L107 110", order: 1, width: 2 },
  {
    d: "M100 110 C 89 110 80 118 80 128 C 80 138 89 146 100 146 C 111 146 120 138 120 128 C 120 118 111 110 100 110 Z",
    order: 2,
    width: 2,
  },
  { d: "M80 74 C 68 80 65 98 72 112 C 78 124 92 128 101 122", order: 3, width: 2.4 },
  { d: "M79 84 C 87 80 97 80 107 84", order: 4, width: 1.8 },
  { d: "M79 95 C 87 91 97 91 107 95", order: 5, width: 1.8 },
  { d: "M80 106 C 88 102 98 102 108 106", order: 6, width: 1.8 },
  { d: "M58 82 C 53 88 53 96 58 102", order: 7, width: 1.5 },
  { d: "M48 76 C 40 86 40 100 48 110", order: 7, width: 1.2 },
];

/** 2 · Hedef tahtası — üç halka, saplanmış shuriken, kesik atış yayı */
const TARGET_STROKES: Stroke[] = [
  {
    d: "M118 30 C 142 30 162 50 162 74 C 162 98 142 118 118 118 C 94 118 74 98 74 74 C 74 50 94 30 118 30 Z",
    order: 0,
    width: 2.2,
  },
  {
    d: "M118 46 C 133 46 146 59 146 74 C 146 89 133 102 118 102 C 103 102 90 89 90 74 C 90 59 103 46 118 46 Z",
    order: 1,
    width: 1.8,
  },
  {
    d: "M118 61 C 125 61 131 67 131 74 C 131 81 125 87 118 87 C 111 87 105 81 105 74 C 105 67 111 61 118 61 Z",
    order: 2,
    width: 1.8,
  },
  { d: "M114 74 L122 74 M118 70 L118 78", order: 3, width: 1.6 },
  {
    d: "M152 30 L157 41 L168 44 L157 47 L152 58 L147 47 L136 44 L147 41 Z",
    order: 4,
    width: 1.9,
  },
  { d: "M22 122 C 30 118 38 113 46 108", order: 5, width: 1.4 },
  { d: "M56 100 C 63 95 70 89 77 83", order: 6, width: 1.4 },
  { d: "M88 74 C 94 69 100 64 106 59", order: 7, width: 1.4 },
  { d: "M118 50 C 124 46 130 43 136 41", order: 8, width: 1.4 },
];

/** 3 · El mühürleri — çapraz iki parmak, avuç yayları, çakra çentikleri */
const SEAL_STROKES: Stroke[] = [
  { d: "M92 100 L92 36 C 92 27 108 27 108 36 L108 100", order: 0, width: 2.4 },
  { d: "M58 58 L142 58 C 151 58 151 74 142 74 L58 74", order: 1, width: 2.4 },
  { d: "M70 100 C 76 118 90 126 100 126", order: 2, width: 2.2 },
  { d: "M130 100 C 124 118 110 126 100 126", order: 3, width: 2.2 },
  { d: "M118 28 L126 18", order: 4, width: 1.4 },
  { d: "M82 28 L74 18", order: 5, width: 1.4 },
  { d: "M152 44 L166 38", order: 6, width: 1.4 },
  { d: "M48 44 L34 38", order: 7, width: 1.4 },
];

/** 4 · Yoklama — çizgili defter sayfası, isimler, onay, daire içine alınan satır */
const ROLLCALL_STROKES: Stroke[] = [
  { d: "M40 18 L162 18 L162 132 L40 132 Z", order: 0, width: 2.2 },
  { d: "M54 18 L54 132", order: 1, width: 1.6 },
  { d: "M62 42 L152 42", order: 2, width: 1.3 },
  { d: "M62 62 L152 62", order: 2, width: 1.3 },
  { d: "M62 82 L152 82", order: 3, width: 1.3 },
  { d: "M62 102 L152 102", order: 3, width: 1.3 },
  { d: "M66 37 C 74 32 82 40 92 34 C 98 31 104 36 110 33", order: 4, width: 1.6 },
  { d: "M66 57 C 73 52 80 60 89 55 C 95 52 100 56 106 54", order: 5, width: 1.6 },
  { d: "M66 77 C 74 72 81 80 90 75", order: 6, width: 1.6 },
  { d: "M132 74 L138 81 L150 66", order: 7, width: 2.2 },
  {
    d: "M60 96 C 84 88 132 88 154 97 C 162 101 158 114 144 117 C 114 122 78 120 64 114 C 55 110 54 99 60 96",
    order: 8,
    width: 1.9,
  },
];

/** 5 · Boş satır — bir çizgi, bir nokta, bekleyen bir köşeli ayraç */
const BLANK_STROKES: Stroke[] = [
  { d: "M32 92 L168 92", order: 0, width: 2.2 },
  { d: "M42 80 L42 80.6", order: 1, width: 4.5 },
  { d: "M160 76 L168 76 L168 108 L160 108", order: 2, width: 1.4 },
];

const LESSON_STROKES: Record<string, Stroke[]> = {
  grip: GRIP_STROKES,
  target: TARGET_STROKES,
  seals: SEAL_STROKES,
  rollcall: ROLLCALL_STROKES,
  blank: BLANK_STROKES,
};

/**
 * Bir dersin tahtadaki çizimi.
 *
 * `drawn` açıkken bütün çizgiler `data-on` alır ve CSS onları sırayla
 * çizer; kapalıyken çizgiler yerinde durur ama uzunlukları sıfırdır, yani
 * tahtada hiç yoktur. Reduced-motion battaniyesi geçişi kapattığında çizim
 * anında tam görünür — çizginin KENDİSİ kaybolmaz, yalnızca yazılma
 * hareketi kalkar.
 */
export function LessonDrawing({
  lesson,
  drawn,
  className,
  strokeClassName,
  title,
}: {
  lesson: string;
  drawn: boolean;
  className?: string;
  strokeClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa çizim tamamen dekoratiftir */
  title?: string;
}) {
  const strokes = LESSON_STROKES[lesson] ?? BLANK_STROKES;
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g stroke="var(--iru-chalk)" strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((stroke, index) => (
          <path
            key={`${lesson}-${index}`}
            className={strokeClassName}
            data-order={stroke.order}
            data-on={drawn ? "true" : undefined}
            d={stroke.d}
            strokeWidth={stroke.width ?? 2}
            pathLength={1}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Seçili dersin başlığının altına çekilen tebeşir çizgisi.
 *
 * Düz bir `border-bottom` olabilirdi; olmadı, çünkü tahtaya çekilen çizgi
 * düz değildir ve tek hamlede çizilir. Yazının ALTINI çizmek bu sayfada
 * bir vurgu değil, "bu ders şu an işleniyor" demenin yolu.
 */
export function ChalkUnderline({
  drawn,
  className,
  strokeClassName,
}: {
  drawn: boolean;
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 10"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        className={strokeClassName}
        data-order="0"
        data-on={drawn ? "true" : undefined}
        d="M2 6.5 C 46 3.4 92 3 130 4.6 C 156 5.7 178 6.4 198 4.2"
        stroke="var(--iru-chalk)"
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   4 · ICHIRAKU — İKİ KÂSE
   ═══════════════════════════════════════════════════════════════════════ */

/** Tek kâse: kenar, gövde, erişte, narutomaki dilimi. */
function Bowl({ chopsticks }: { chopsticks: boolean }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Gövde */}
      <path
        d="M20 86 C 24 126 44 150 74 150 C 104 150 124 126 128 86"
        stroke="var(--iru-ramen)"
        strokeWidth="2.6"
      />
      {/* Ağız */}
      <path
        d="M74 72 C 104 72 128 78 128 86 C 128 94 104 100 74 100 C 44 100 20 94 20 86 C 20 78 44 72 74 72 Z"
        stroke="var(--iru-ramen)"
        strokeWidth="2.6"
      />
      {/* Kâidesi */}
      <path d="M58 150 L58 158 M90 150 L90 158 M54 158 L94 158" stroke="var(--iru-ramen)" strokeWidth="2" />
      {/* Erişte — ağzın içinde üç yay */}
      <g stroke="var(--iru-ramen)" strokeWidth="1.6" strokeOpacity="0.7">
        <path d="M36 84 C 46 90 60 92 74 92" />
        <path d="M92 90 C 102 88 110 84 114 80" />
        <path d="M46 78 C 58 82 70 83 82 82" />
      </g>
      {/* Narutomaki: dilim ve içindeki spiral. Kâsedeki tek beyaz şey. */}
      <g transform="translate(96 82)">
        <circle r="11" stroke="var(--iru-chalk)" strokeWidth="2" />
        <path
          d="M0 -6 C 3.6 -6 6 -3.4 6 0 C 6 3 3.6 5 1 5 C -1 5 -2.6 3.4 -2.6 1.4 C -2.6 -0.2 -1.4 -1.4 0 -1.4"
          stroke="var(--iru-chalk)"
          strokeWidth="1.6"
        />
      </g>
      {chopsticks ? (
        <g stroke="var(--iru-ramen)" strokeWidth="2.2">
          <path d="M24 46 L96 84" />
          <path d="M32 40 L104 78" />
        </g>
      ) : null}
    </g>
  );
}

/** Bir kâsenin üstünden yükselen üç buhar teli. */
function Steam({ strandClassName }: { strandClassName?: string }) {
  return (
    <g
      stroke="var(--iru-chalk)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity="0.45"
      fill="none"
    >
      <path
        className={strandClassName}
        data-strand="1"
        d="M54 66 C 48 54 60 46 54 32 C 50 22 58 16 56 6"
      />
      <path
        className={strandClassName}
        data-strand="2"
        d="M76 62 C 82 50 70 42 78 28 C 82 20 76 14 78 4"
      />
      <path
        className={strandClassName}
        data-strand="3"
        d="M98 68 C 92 58 102 50 96 38"
      />
    </g>
  );
}

/**
 * Tezgâhtaki iki kâse.
 *
 * Yan yana ve AYNI boyda: sayfanın bütün fikri bu eşitlikte. Solda
 * çubukları duran kâse çocuğun, sağdaki öğretmenin. Aralarında tezgâhın
 * tahta çizgisi geçiyor.
 */
export function RamenBowls({
  className,
  steamClassName,
  title,
}: {
  className?: string;
  steamClassName?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 200"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Tezgâh */}
      <path
        d="M4 178 L336 178"
        stroke="var(--iru-ramen)"
        strokeWidth="2"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
      <g transform="translate(14 20)">
        <Steam strandClassName={steamClassName} />
        <Bowl chopsticks />
      </g>
      <g transform="translate(178 20)">
        <Steam strandClassName={steamClassName} />
        <Bowl chopsticks={false} />
      </g>
    </svg>
  );
}
