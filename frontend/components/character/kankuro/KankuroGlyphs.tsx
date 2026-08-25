/**
 * Kankurō sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §4.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca token'dan
 * geliyor (`--kan-*`, modülün başındaki deri bloğu); bu dosyada da tek hex yok.
 *
 * ── ORTAK GEOMETRİ ──────────────────────────────────────────────────────────
 * Dört kuklanın dördü de AYNI kutuya çiziliyor: `viewBox="0 0 140 350"`,
 * merkez ekseni x=70, ip yukarıdan y=0'da giriyor. Böylece dördü yan yana
 * dizildiğinde omuz hizaları ve ip girişleri tutuyor.
 *
 * Parçaların açılma mesafesi BURADA DEĞİL, CSS'te: her `<g>` bir
 * `data-part` taşıyor (`head`, `chest`, `shellL`, `shellR`, `armL`, `armR`,
 * `hip`, `legs`, `tail`) ve modül o niteliğe göre `translate` veriyor. Sebep:
 * açılma bir HAREKET kararı, geometri değil — reduced-motion battaniyesi
 * tek yerden kapatabilsin diye hepsi CSS'te tutuluyor.
 *
 * ⚠️ SVG'de `rotate` KULLANILMIYOR. SVG öğelerinde `transform-origin`
 * varsayılanı kullanıcı uzayının başlangıcıdır (0 0); bağımsız bir dönüş
 * parçayı kutunun dışına fırlatır. Yer değiştirme (`translate`) başlangıç
 * noktasından bağımsız olduğu için güvenli (Shikamaru modülünde ölçülmüş
 * ev kuralı).
 *
 * ⚠️ Bu dosyada "use client" YOK. `PuppetChest` (istemci adası) çağırdığı
 * için düz JSX olarak istemci paketine giriyor, ek bağımlılık getirmiyor;
 * aynı bileşenlerin bir kısmı sunucuda da (hero, atölye) kullanılıyor.
 */

/* ══════════════════════════════════════════════════════════════════════════
   ORTAK PARÇALAR
   ══════════════════════════════════════════════════════════════════════════ */

/** Pirinç mafsal pimi — bütün kuklalarda aynı ölçü. */
function Joint({ x, y, r = 2.6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="var(--kan-joint)" fillOpacity="0.9" />
      <circle cx={x} cy={y} r={r * 2.1} fill="none" stroke="var(--kan-joint)" strokeOpacity="0.28" strokeWidth="0.6" />
    </g>
  );
}

/** Numaralı işaret — silah listesindeki sırayla birebir aynı. */
function Mark({
  n,
  x,
  y,
  className,
  textClassName,
}: {
  n: number;
  x: number;
  y: number;
  className?: string;
  textClassName?: string;
}) {
  return (
    <g className={className} data-mark={n}>
      <circle cx={x} cy={y} r="7.4" fill="var(--bg)" stroke="var(--kan-joint)" strokeWidth="1" />
      <text
        className={textClassName}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--kan-joint)"
      >
        {n}
      </text>
    </g>
  );
}

/** Lake gövde parçası — dolgu + sıcak kenar. Bütün kuklalarda aynı reçete. */
function Lacquer({ d, opacity = 1 }: { d: string; opacity?: number }) {
  return (
    <>
      <path d={d} fill="var(--kan-lacquer)" fillOpacity={opacity} />
      <path d={d} fill="none" stroke="var(--kan-joint)" strokeOpacity="0.5" strokeWidth="1.1" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   İPLER
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Sayfanın üst kenarından inen dört ip.
 *
 * `preserveAspectRatio="none"`: kutu sayfa boyu kadar uzuyor, ipler de onunla
 * birlikte geriliyor. Çizgiler hafifçe dalgalı — cetvelle çizilmiş dört dikey
 * çizgi "ip" gibi okunmuyordu, elin titremesi burada bilinçli.
 */
export function PageRig({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--kan-string)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path className={lineClassName} data-line="1" d="M12.5 0 C 13.4 210 11.6 420 12.9 630 C 13.6 800 12.2 900 12.5 1000" />
        <path className={lineClassName} data-line="2" d="M37.5 0 C 36.6 190 38.5 400 37.1 610 C 36.3 790 38 900 37.5 1000" />
        <path className={lineClassName} data-line="3" d="M62.5 0 C 63.5 200 61.4 410 62.8 620 C 63.5 800 62.1 900 62.5 1000" />
        <path className={lineClassName} data-line="4" d="M87.5 0 C 86.5 220 88.4 430 87.1 640 C 86.4 810 88 900 87.5 1000" />
      </g>
    </svg>
  );
}

/**
 * Tek kuklanın ipi — kartın üstünden gövdenin başına iner.
 *
 * `data-taut` niteliği CSS'te kalınlığı ve titremeyi açıyor; geometri
 * değişmiyor, yalnızca çizginin kendisi geriliyor.
 */
export function PuppetString({
  className,
  strandClassName,
  taut,
}: {
  className?: string;
  strandClassName?: string;
  taut?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 200"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        className={strandClassName}
        data-taut={taut ? "true" : undefined}
        d="M20 0 C 21.4 46 18.4 92 20.6 138 C 21.4 166 19.4 184 20 200"
        stroke="var(--kan-thread)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** İpin ucundaki düğüm — "öbür uçtaki eller" bölümünde de kullanılıyor. */
export function StringKnot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path
        d="M12 1 C 12 6 12 7 12 9"
        stroke="var(--kan-thread)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8.4 11.4 C 8.4 8.6 15.6 8.6 15.6 11.4 C 15.6 14.4 8.4 14.4 8.4 17 C 8.4 19.6 15.6 19.6 15.6 17"
        stroke="var(--kan-joint)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Arka plandaki lake kukla gövdesi silueti.
 *
 * Yüzü yok, eklemleri var: hero'nun arkasında duran şey bir figür değil,
 * bir gövde. Boyutu büyük, opaklığı düşük — okunacak bir şey değil, sayfanın
 * zemininde duran madde.
 */
export function PuppetSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 620"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <g fill="var(--kan-lacquer)">
        {/* baş ve boyun */}
        <path d="M150 34 L186 56 L182 106 L150 128 L118 106 L114 56 Z" />
        <rect x="142" y="128" width="16" height="16" />
        {/* gövde */}
        <path d="M108 148 L192 148 L202 250 L150 274 L98 250 Z" />
        {/* kalça */}
        <path d="M112 284 L188 284 L180 340 L120 340 Z" />
        {/* kollar */}
        <path d="M104 158 L70 176 L54 262 L78 270 L96 184 Z" />
        <path d="M196 158 L230 176 L246 262 L222 270 L204 184 Z" />
        <path d="M56 278 L48 372 L72 378 L82 284 Z" />
        <path d="M244 278 L252 372 L228 378 L218 284 Z" />
        {/* bacaklar */}
        <path d="M122 350 L112 470 L118 574 L142 574 L138 468 L142 350 Z" />
        <path d="M178 350 L188 470 L182 574 L158 574 L162 468 L158 350 Z" />
      </g>
      <g opacity="0.55">
        <Joint x={150} y={140} r={4} />
        <Joint x={104} y={162} r={4} />
        <Joint x={196} y={162} r={4} />
        <Joint x={60} y={272} r={4} />
        <Joint x={240} y={272} r={4} />
        <Joint x={124} y={346} r={4} />
        <Joint x={176} y={346} r={4} />
        <Joint x={116} y={468} r={4} />
        <Joint x={184} y={468} r={4} />
      </g>
    </svg>
  );
}

/**
 * Kumadori planı — yüz boyasının elle çizilmiş şeması.
 *
 * Portrenin ÜSTÜNE bindirilmiyor: AniList portresinin kadrajı bilinmiyor ve
 * üstüne oturtulmuş bir çizgi kümesi her portrede kayardı. Bunun yerine
 * yanına asılan bir plan olarak duruyor — tezgâhın duvarına iğnelenmiş
 * makyaj şeması gibi. Portreye giden iki ince kılavuz çizgi CSS'te.
 */
export function KumadoriChart({
  className,
  lineClassName,
  title,
}: {
  className?: string;
  lineClassName?: string;
  title: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 190"
      fill="none"
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* yüz hattı */}
      <path
        d="M80 12 C 108 12 122 34 122 66 C 122 104 104 138 80 152 C 56 138 38 104 38 66 C 38 34 52 12 80 12 Z"
        fill="var(--kan-lacquer)"
        fillOpacity="0.5"
        stroke="var(--kan-joint)"
        strokeOpacity="0.4"
        strokeWidth="0.9"
      />
      {/* eksen ve ölçü çentikleri — plan olduğunu söyleyen şey bunlar */}
      <g stroke="var(--kan-joint)" strokeOpacity="0.35" strokeWidth="0.6">
        <path d="M80 4 V 160" strokeDasharray="3 5" />
        <path d="M30 66 H 130" strokeDasharray="3 5" />
        <path d="M34 66 v 5 M46 66 v 4 M114 66 v 4 M126 66 v 5" />
      </g>
      {/* kumadori — mor boya çizgileri */}
      <g
        className={lineClassName}
        stroke="var(--kan-thread)"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      >
        <path data-stroke="1" d="M56 40 C 62 50 64 60 62 72" />
        <path data-stroke="2" d="M104 40 C 98 50 96 60 98 72" />
        <path data-stroke="3" d="M46 62 C 52 74 54 86 52 98" />
        <path data-stroke="4" d="M114 62 C 108 74 106 86 108 98" />
        <path data-stroke="5" d="M66 104 C 72 110 88 110 94 104" />
        <path data-stroke="6" d="M72 124 C 76 130 84 130 88 124" />
      </g>
      {/* göz yuvaları */}
      <g fill="var(--kan-joint)" fillOpacity="0.7">
        <path d="M62 82 C 68 78 76 78 80 82 C 76 86 68 86 62 82 Z" />
        <path d="M98 82 C 92 78 84 78 80 82 C 84 86 92 86 98 82 Z" />
      </g>
      <text
        x="80"
        y="176"
        textAnchor="middle"
        fill="var(--kan-joint)"
        fillOpacity="0.65"
        style={{ fontSize: "13px", letterSpacing: "0.3em" }}
      >
        隈取
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MOD DÜĞMESİ — kukla çubuğu (control bar)
   ══════════════════════════════════════════════════════════════════════════ */

export function ControlBar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden focusable="false">
      <g stroke="var(--kan-joint)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M6 9 H26" />
        <path d="M16 4 V 12" />
      </g>
      <g stroke="var(--kan-thread)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M8 10 C 8.6 17 7.4 22 8 28" />
        <path d="M16 12.5 C 15.4 18 16.6 23 16 28" />
        <path d="M24 10 C 23.4 17 24.6 22 24 28" />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ATÖLYE ALETLERİ — dört küçük kartın ikonu
   Hepsi 32'lik kutuda, 1.6 kalınlıkta, aynı uçlarla: tek bir set.
   ══════════════════════════════════════════════════════════════════════════ */

export function ToolGlyph({
  kind,
  className,
}: {
  kind: "thread" | "blade" | "joint" | "corps";
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden focusable="false">
      {kind === "thread" ? (
        <g strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M6 5 C 6 9 10 8 10 12 C 10 16 6 15 6 19" stroke="var(--kan-thread)" />
          <path d="M14 4 C 14 9 18 8 18 13 C 18 18 14 17 14 22" stroke="var(--kan-thread)" />
          <path d="M22 5 C 22 10 26 9 26 14 C 26 19 22 18 22 24" stroke="var(--kan-thread)" />
          <path d="M4 27 H28" stroke="var(--kan-joint)" />
        </g>
      ) : null}
      {kind === "blade" ? (
        <g strokeWidth="1.6" strokeLinejoin="round" fill="none">
          <path d="M9 27 L7 21 L19 5 L23 8 L13 24 Z" stroke="var(--kan-joint)" />
          <path d="M8.4 22.6 L21.4 6.6" stroke="var(--kan-poison)" strokeWidth="2.2" />
          <path d="M24 20 C 26 23 27 24.6 27 26 C 27 27.6 25.6 28.6 24 28.6 C 22.4 28.6 21 27.6 21 26 C 21 24.6 22 23 24 20 Z" stroke="var(--kan-poison)" />
        </g>
      ) : null}
      {kind === "joint" ? (
        <g strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M11 4 V 12" stroke="var(--kan-joint)" />
          <path d="M21 20 V 28" stroke="var(--kan-joint)" />
          <circle cx="11" cy="16" r="4" stroke="var(--kan-joint)" />
          <circle cx="21" cy="16" r="4" stroke="var(--kan-joint)" />
          <path d="M15 16 H17" stroke="var(--kan-thread)" />
          <path d="M4 24 C 7 24 8 26 11 26" stroke="var(--kan-thread)" strokeDasharray="2 3" />
        </g>
      ) : null}
      {kind === "corps" ? (
        <g strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M8 4 V 10 M16 4 V 10 M24 4 V 10" stroke="var(--kan-thread)" />
          <path d="M4 12 H12 L11 22 L9 28 H7 L5 22 Z" stroke="var(--kan-joint)" />
          <path d="M12 12 H20 L19 22 L17 28 H15 L13 22 Z" stroke="var(--kan-joint)" />
          <path d="M20 12 H28 L27 22 L25 28 H23 L21 22 Z" stroke="var(--kan-joint)" />
        </g>
      ) : null}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ZEHİR MASASI
   ══════════════════════════════════════════════════════════════════════════ */

/** Bıçağın ağzındaki tabaka ve yanındaki panzehir şişesi — tek çizim. */
export function PoisonTable({
  className,
  coatClassName,
  title,
}: {
  className?: string;
  coatClassName?: string;
  title: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 150"
      fill="none"
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* masa yüzeyi */}
      <path d="M8 122 H312" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" />
      <g stroke="var(--kan-joint)" strokeOpacity="0.22" strokeWidth="0.7">
        <path d="M24 122 v 12 M64 122 v 8 M256 122 v 8 M296 122 v 12" />
      </g>

      {/* bıçak — kukla kolundan çıkan ağız */}
      <g>
        <path
          d="M22 108 L34 96 L150 40 L166 46 L162 60 L46 116 L28 118 Z"
          fill="var(--kan-lacquer)"
          stroke="var(--kan-joint)"
          strokeOpacity="0.6"
          strokeWidth="1.1"
        />
        <path
          className={coatClassName}
          d="M32 100 L148 44"
          stroke="var(--kan-poison)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <Joint x={30} y={110} r={3} />
      </g>

      {/* damla */}
      <path
        className={coatClassName}
        data-drop="true"
        d="M186 60 C 192 70 195 75 195 80 C 195 85.5 190.9 89 186 89 C 181.1 89 177 85.5 177 80 C 177 75 180 70 186 60 Z"
        fill="var(--kan-poison)"
        fillOpacity="0.75"
      />

      {/* panzehir şişesi */}
      <g>
        <path d="M244 30 H272 V 40 H268 V 54 L286 86 C 292 96 286 112 274 112 H242 C 230 112 224 96 230 86 L248 54 V 40 H244 Z"
          fill="none"
          stroke="var(--kan-joint)"
          strokeOpacity="0.75"
          strokeWidth="1.4"
        />
        <path
          d="M236 82 L280 82 L286 92 C 291 100 286 108 275 108 H241 C 230 108 225 100 230 92 Z"
          fill="var(--accent)"
          fillOpacity="0.5"
        />
        <path d="M244 30 H272" stroke="var(--kan-joint)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DÖRT KUKLA
   Ortak kutu: 0 0 140 350 · merkez x=70 · ip y=0'da giriyor.
   ══════════════════════════════════════════════════════════════════════════ */

export interface PuppetFigureProps {
  kind: "karasu" | "kuroari" | "sanshouo" | "sasori";
  open: boolean;
  /**
   * Ekran okuyucuya inen açıklama. VERİLMEZSE şema tamamen dekoratiftir —
   * sekme düğmesinin içindeyken adı düğmenin kendi metni taşıyor, şemanın
   * ikinci bir ad üretmesi erişilebilirlik ağacını kirletirdi.
   */
  title?: string;
  className?: string;
  partClassName?: string;
  weaponClassName?: string;
  markClassName?: string;
  markTextClassName?: string;
  stringClassName?: string;
}

export function PuppetFigure({
  kind,
  open,
  title,
  className,
  partClassName,
  weaponClassName,
  markClassName,
  markTextClassName,
  stringClassName,
}: PuppetFigureProps) {
  /* Parça sarmalayıcısı: `data-part` CSS'teki açılma mesafesini seçiyor,
     `data-open` da anahtarı. İkisi burada tek yerden yazılıyor ki dört
     kuklanın açılma sözlüğü ayrışmasın. */
  const part = (name: string, children: React.ReactNode) => (
    <g
      className={partClassName}
      data-part={name}
      data-open={open ? "true" : undefined}
      key={name}
    >
      {children}
    </g>
  );

  const weapon = (n: number, children: React.ReactNode) => (
    <g
      className={weaponClassName}
      data-weapon={n}
      data-open={open ? "true" : undefined}
      key={`w${n}`}
    >
      {children}
    </g>
  );

  const mark = (n: number, x: number, y: number) => (
    <g
      className={weaponClassName}
      data-weapon={n}
      data-open={open ? "true" : undefined}
      key={`m${n}`}
    >
      <Mark n={n} x={x} y={y} className={markClassName} textClassName={markTextClassName} />
    </g>
  );

  return (
    <svg
      className={className}
      viewBox="0 0 140 350"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* kuklanın kendi ipi — kartın üstündeki uzun ip burada devam ediyor */}
      <path
        className={stringClassName}
        data-taut={open ? "true" : undefined}
        d="M70 0 C 71 10 69 18 70 26"
        stroke="var(--kan-thread)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {kind === "karasu" ? <Karasu part={part} weapon={weapon} mark={mark} /> : null}
      {kind === "kuroari" ? <Kuroari part={part} weapon={weapon} mark={mark} /> : null}
      {kind === "sanshouo" ? <Sanshouo part={part} weapon={weapon} mark={mark} /> : null}
      {kind === "sasori" ? <Sasori part={part} weapon={weapon} mark={mark} /> : null}
    </svg>
  );
}

type PartFn = (name: string, children: React.ReactNode) => React.ReactElement;
type WeaponFn = (n: number, children: React.ReactNode) => React.ReactElement;
type MarkFn = (n: number, x: number, y: number) => React.ReactElement;

interface FigureParts {
  part: PartFn;
  weapon: WeaponFn;
  mark: MarkFn;
}

/* ── 烏 Karasu — dört kollu, gagalı, açısal ─────────────────────────────── */

function Karasu({ part, weapon, mark }: FigureParts) {
  return (
    <>
      {part(
        "head",
        <>
          <Lacquer d="M70 28 L88 40 L86 60 L70 70 L54 60 L52 40 Z" />
          <path d="M54 54 L36 62 L55 64 Z" fill="var(--kan-lacquer)" stroke="var(--kan-joint)" strokeOpacity="0.5" strokeWidth="1" />
          <path d="M59 46 L67 48 L59 51 Z" fill="var(--kan-thread)" fillOpacity="0.75" />
          <path d="M81 46 L73 48 L81 51 Z" fill="var(--kan-thread)" fillOpacity="0.75" />
          <Joint x={70} y={70} />
        </>,
      )}

      {part(
        "chest",
        <>
          <Lacquer d="M52 76 L88 76 L92 112 L70 124 L48 112 Z" />
          <path d="M70 78 V 122" stroke="var(--kan-joint)" strokeOpacity="0.35" strokeWidth="0.8" />
          <Joint x={52} y={80} />
          <Joint x={88} y={80} />
        </>,
      )}

      {part(
        "armL",
        <>
          <Lacquer d="M50 80 L36 84 L30 104 L42 108 Z" />
          <Lacquer d="M32 106 L27 134 L38 138 L43 110 Z" />
          <Lacquer d="M52 94 L42 100 L38 118 L47 120 Z" opacity={0.75} />
          <Joint x={34} y={106} />
        </>,
      )}
      {part(
        "armR",
        <>
          <Lacquer d="M90 80 L104 84 L110 104 L98 108 Z" />
          <Lacquer d="M108 106 L113 134 L102 138 L97 110 Z" />
          <Lacquer d="M88 94 L98 100 L102 118 L93 120 Z" opacity={0.75} />
          <Joint x={106} y={106} />
        </>,
      )}

      {part(
        "hip",
        <>
          <Lacquer d="M52 128 L88 128 L84 154 L56 154 Z" />
          <Joint x={58} y={132} />
          <Joint x={82} y={132} />
        </>,
      )}

      {part(
        "legs",
        <>
          <Lacquer d="M58 158 L54 212 L58 252 L68 252 L66 210 L67 158 Z" />
          <Lacquer d="M82 158 L86 212 L82 252 L72 252 L74 210 L73 158 Z" />
          <Joint x={60} y={208} />
          <Joint x={80} y={208} />
        </>,
      )}

      {/* 1 · ayrılabilir uzuvlar — kopan ön kol, kesikli teliyle */}
      {weapon(
        1,
        <g>
          <path d="M14 152 L9 180 L20 184 L25 156 Z" fill="var(--kan-lacquer)" stroke="var(--kan-thread)" strokeWidth="1.1" />
          <path d="M30 140 C 24 144 20 148 17 152" stroke="var(--kan-thread)" strokeWidth="0.9" strokeDasharray="2 3" />
        </g>,
      )}
      {mark(1, 30, 176)}

      {/* 2 · gizli bıçak yuvaları — sağ ön koldan açılan demet */}
      {weapon(
        2,
        <g stroke="var(--kan-thread)" strokeWidth="1.4" strokeLinecap="round">
          <path d="M110 140 L126 158" />
          <path d="M108 144 L120 166" />
          <path d="M105 147 L112 172" />
          <path d="M102 149 L104 174" />
        </g>,
      )}
      {mark(2, 122, 180)}

      {/* 3 · zehirli duman — karın boşluğundan çıkan bulut */}
      {weapon(
        3,
        <g stroke="var(--kan-poison)" strokeWidth="1.3" strokeLinecap="round" fill="none">
          <path d="M62 132 C 52 136 50 146 58 148 C 48 152 50 162 60 160" />
          <path d="M78 134 C 88 138 90 148 82 150 C 92 154 90 164 80 162" />
          <path d="M70 138 C 64 144 66 152 70 156" strokeOpacity="0.6" />
        </g>,
      )}
      {mark(3, 70, 174)}

      {/* 4 · fırlatma iğneleri — baş ile gövde arasındaki boşluktan */}
      {weapon(
        4,
        <g stroke="var(--kan-poison)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M64 52 L44 40" />
          <path d="M66 58 L42 52" />
          <path d="M76 52 L96 40" />
          <path d="M74 58 L98 52" />
        </g>,
      )}
      {mark(4, 70, 14)}
    </>
  );
}

/* ── 黒蟻 Kuroari — içi boş kapan ───────────────────────────────────────── */

function Kuroari({ part, weapon, mark }: FigureParts) {
  return (
    <>
      {part(
        "head",
        <>
          <Lacquer d="M70 30 L86 42 L84 62 L70 70 L56 62 L54 42 Z" />
          <path d="M60 52 H80" stroke="var(--kan-thread)" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.8" />
          <Joint x={70} y={70} />
        </>,
      )}

      {part(
        "shellL",
        <>
          <Lacquer d="M70 76 C 55 76 45 90 45 108 C 45 128 55 142 70 144 Z" />
          <path d="M52 92 C 49 100 49 118 52 128" stroke="var(--kan-joint)" strokeOpacity="0.3" strokeWidth="0.8" />
          <Joint x={70} y={78} />
        </>,
      )}
      {part(
        "shellR",
        <>
          <Lacquer d="M70 76 C 85 76 95 90 95 108 C 95 128 85 142 70 144 Z" />
          <path d="M88 92 C 91 100 91 118 88 128" stroke="var(--kan-joint)" strokeOpacity="0.3" strokeWidth="0.8" />
          <Joint x={70} y={142} />
        </>,
      )}

      {part(
        "armL",
        <>
          <path d="M50 88 C 36 94 30 110 34 126" stroke="var(--kan-lacquer)" strokeWidth="7" strokeLinecap="round" />
          <path d="M50 88 C 36 94 30 110 34 126" stroke="var(--kan-joint)" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <Joint x={34} y={126} />
        </>,
      )}
      {part(
        "armR",
        <>
          <path d="M90 88 C 104 94 110 110 106 126" stroke="var(--kan-lacquer)" strokeWidth="7" strokeLinecap="round" />
          <path d="M90 88 C 104 94 110 110 106 126" stroke="var(--kan-joint)" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <Joint x={106} y={126} />
        </>,
      )}

      {part(
        "hip",
        <>
          <Lacquer d="M57 148 L83 148 L79 170 L61 170 Z" />
          <Joint x={62} y={152} />
          <Joint x={78} y={152} />
        </>,
      )}

      {part(
        "legs",
        <>
          <path d="M62 174 C 56 204 56 230 62 252" stroke="var(--kan-lacquer)" strokeWidth="8" strokeLinecap="round" />
          <path d="M78 174 C 84 204 84 230 78 252" stroke="var(--kan-lacquer)" strokeWidth="8" strokeLinecap="round" />
          <path d="M62 174 C 56 204 56 230 62 252" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <path d="M78 174 C 84 204 84 230 78 252" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <Joint x={58} y={214} />
          <Joint x={82} y={214} />
        </>,
      )}

      {/* 1 · içi boş gövde — kabuklar açılınca ortada kalan boşluk */}
      {weapon(
        1,
        <ellipse
          cx="70"
          cy="106"
          rx="17"
          ry="32"
          fill="none"
          stroke="var(--kan-thread)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />,
      )}
      {mark(1, 70, 106)}

      {/* 2 · kilitleyen mandallar */}
      {weapon(
        2,
        <g stroke="var(--kan-thread)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M28 136 C 20 138 20 148 28 150 L36 150" />
          <path d="M112 136 C 120 138 120 148 112 150 L104 150" />
        </g>,
      )}
      {mark(2, 20, 160)}

      {/* 3 · işaretli delik noktaları — kabuklar AÇIK konumdayken oldukları yerde */}
      {weapon(
        3,
        <g stroke="var(--kan-thread)" strokeWidth="1.3" strokeLinecap="round">
          <path d="M33 90 l5 5 M38 90 l-5 5" />
          <path d="M33 118 l5 5 M38 118 l-5 5" />
          <path d="M102 90 l5 5 M107 90 l-5 5" />
          <path d="M102 118 l5 5 M107 118 l-5 5" />
        </g>,
      )}
      {mark(3, 120, 104)}

      {/* 4 · testere ağızları */}
      {weapon(
        4,
        <g fill="none" stroke="var(--kan-thread)" strokeWidth="1.2">
          <circle cx="52" cy="176" r="9" />
          <path d="M52 165 v -4 M63 176 h 4 M52 187 v 4 M41 176 h -4 M60 168 l 3 -3 M60 184 l 3 3 M44 184 l -3 3 M44 168 l -3 -3" strokeLinecap="round" />
          <circle cx="52" cy="176" r="2.4" fill="var(--kan-thread)" stroke="none" />
        </g>,
      )}
      {mark(4, 30, 190)}
    </>
  );
}

/* ── 山椒魚 Sanshōuo — geniş, alçak, zırhlı ─────────────────────────────── */

function Sanshouo({ part, weapon, mark }: FigureParts) {
  return (
    <>
      {part(
        "head",
        <>
          <Lacquer d="M70 52 C 54 52 44 60 44 71 C 44 82 56 89 70 89 C 84 89 96 82 96 71 C 96 60 86 52 70 52 Z" />
          <circle cx="59" cy="68" r="2.6" fill="var(--kan-thread)" fillOpacity="0.8" />
          <circle cx="81" cy="68" r="2.6" fill="var(--kan-thread)" fillOpacity="0.8" />
          <Joint x={70} y={92} />
        </>,
      )}

      {part(
        "shellL",
        <>
          <Lacquer d="M70 96 C 50 96 34 116 34 144 C 34 170 50 186 70 186 Z" />
          <g stroke="var(--kan-joint)" strokeOpacity="0.28" strokeWidth="0.8" fill="none">
            <path d="M44 122 C 52 126 60 128 70 128" />
            <path d="M40 144 C 50 148 60 150 70 150" />
            <path d="M44 166 C 52 170 60 172 70 172" />
          </g>
        </>,
      )}
      {part(
        "shellR",
        <>
          <Lacquer d="M70 96 C 90 96 106 116 106 144 C 106 170 90 186 70 186 Z" />
          <g stroke="var(--kan-joint)" strokeOpacity="0.28" strokeWidth="0.8" fill="none">
            <path d="M96 122 C 88 126 80 128 70 128" />
            <path d="M100 144 C 90 148 80 150 70 150" />
            <path d="M96 166 C 88 170 80 172 70 172" />
          </g>
        </>,
      )}

      {part(
        "armL",
        <>
          <path d="M44 118 L22 106 L14 112" stroke="var(--kan-lacquer)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M44 118 L22 106 L14 112" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <Joint x={22} y={106} />
        </>,
      )}
      {part(
        "armR",
        <>
          <path d="M96 118 L118 106 L126 112" stroke="var(--kan-lacquer)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M96 118 L118 106 L126 112" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <Joint x={118} y={106} />
        </>,
      )}

      {part(
        "legs",
        <>
          <path d="M44 168 L22 182 L14 178" stroke="var(--kan-lacquer)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M96 168 L118 182 L126 178" stroke="var(--kan-lacquer)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M44 168 L22 182 L14 178" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <path d="M96 168 L118 182 L126 178" stroke="var(--kan-joint)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <Joint x={22} y={182} />
          <Joint x={118} y={182} />
        </>,
      )}

      {part(
        "tail",
        <>
          <path d="M70 190 C 72 214 78 234 66 256" stroke="var(--kan-lacquer)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M70 190 C 72 214 78 234 66 256" stroke="var(--kan-joint)" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        </>,
      )}

      {/* 1 · ağır zırh kabuğu — kenar boyunca zırh dilimleri */}
      {weapon(
        1,
        <g stroke="var(--kan-thread)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M18 128 l 8 3 M16 142 l 9 1 M18 156 l 8 -2" />
          <path d="M122 128 l -8 3 M124 142 l -9 1 M122 156 l -8 -2" />
        </g>,
      )}
      {mark(1, 16, 112)}

      {/* 2 · içine girilebilen boşluk — saklanan ustanın silueti */}
      {weapon(
        2,
        <g stroke="var(--kan-thread)" strokeWidth="1.3" strokeLinecap="round" fill="none">
          <circle cx="70" cy="126" r="6" />
          <path d="M70 133 V 152" />
          <path d="M60 140 H 80" />
          <path d="M63 166 L70 152 L77 166" />
        </g>,
      )}
      {mark(2, 70, 100)}

      {/* 3 · yere yayılan duruş */}
      {weapon(
        3,
        <g stroke="var(--kan-thread)" strokeWidth="1.1" strokeLinecap="round">
          <path d="M12 196 H 128" strokeDasharray="4 5" />
          <path d="M22 188 v 6 M70 188 v 6 M118 188 v 6" />
        </g>,
      )}
      {mark(3, 70, 214)}
    </>
  );
}

/* ── 蠍 Sasori — devralınan gövde ───────────────────────────────────────── */

function Sasori({ part, weapon, mark }: FigureParts) {
  return (
    <>
      {part(
        "head",
        <>
          <Lacquer d="M70 26 C 59 26 52 35 52 47 C 52 60 60 70 70 70 C 80 70 88 60 88 47 C 88 35 81 26 70 26 Z" />
          <path d="M52 42 C 56 28 84 28 88 42" stroke="var(--kan-joint)" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
          <circle cx="62" cy="48" r="2.4" fill="var(--kan-thread)" fillOpacity="0.8" />
          <circle cx="78" cy="48" r="2.4" fill="var(--kan-thread)" fillOpacity="0.8" />
          <Joint x={70} y={72} />
        </>,
      )}

      {part(
        "chest",
        <>
          <Lacquer d="M56 76 L84 76 L88 116 L70 126 L52 116 Z" />
          <circle cx="70" cy="96" r="11" fill="none" stroke="var(--kan-joint)" strokeOpacity="0.6" strokeWidth="1.2" />
          <Joint x={56} y={80} />
          <Joint x={84} y={80} />
        </>,
      )}

      {part(
        "armL",
        <>
          <Lacquer d="M54 82 L40 88 L34 114 L44 118 Z" />
          <Lacquer d="M35 116 L31 142 L41 145 L45 120 Z" />
          <Joint x={38} y={116} />
        </>,
      )}
      {part(
        "armR",
        <>
          <Lacquer d="M86 82 L100 88 L106 114 L96 118 Z" />
          <Lacquer d="M105 116 L109 142 L99 145 L95 120 Z" />
          <Joint x={102} y={116} />
        </>,
      )}

      {part(
        "hip",
        <>
          <Lacquer d="M56 130 L84 130 L80 154 L60 154 Z" />
          <Joint x={62} y={134} />
          <Joint x={78} y={134} />
        </>,
      )}

      {part(
        "legs",
        <>
          <Lacquer d="M60 158 L56 210 L60 252 L69 252 L67 208 L68 158 Z" />
          <Lacquer d="M80 158 L84 210 L80 252 L71 252 L73 208 L72 158 Z" />
          <Joint x={61} y={206} />
          <Joint x={79} y={206} />
        </>,
      )}

      {part(
        "tail",
        <>
          <path
            d="M86 126 C 106 122 116 106 112 88 C 110 76 104 68 97 64"
            stroke="var(--kan-lacquer)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M86 126 C 106 122 116 106 112 88 C 110 76 104 68 97 64"
            stroke="var(--kan-joint)"
            strokeOpacity="0.45"
            strokeWidth="0.9"
            fill="none"
          />
          <Joint x={104} y={116} r={2.2} />
          <Joint x={113} y={98} r={2.2} />
          <Joint x={108} y={78} r={2.2} />
          <path d="M97 64 L88 52 L100 56 Z" fill="var(--kan-poison)" fillOpacity="0.85" />
        </>,
      )}

      {/* 1 · boş çekirdek yuvası */}
      {weapon(
        1,
        <g>
          <circle cx="70" cy="96" r="7" fill="none" stroke="var(--kan-thread)" strokeWidth="1.2" strokeDasharray="3 3" />
          <text
            x="70"
            y="96"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--kan-thread)"
            fillOpacity="0.85"
            style={{ fontSize: "9px" }}
          >
            蠍
          </text>
        </g>,
      )}
      {mark(1, 46, 92)}

      {/* 2 · çekilebilen kuyruk — ucundaki iğne ve damlası */}
      {weapon(
        2,
        <g>
          <path d="M97 64 L82 44" stroke="var(--kan-poison)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M80 38 C 83 42 84 44 84 45.6 C 84 47.4 82.6 48.6 81 48.6 C 79.4 48.6 78 47.4 78 45.6 C 78 44 79 42 80 38 Z" fill="var(--kan-poison)" fillOpacity="0.8" />
        </g>,
      )}
      {mark(2, 122, 70)}

      {/* 3 · kol bıçakları */}
      {weapon(
        3,
        <g stroke="var(--kan-thread)" strokeWidth="1.4" strokeLinecap="round">
          <path d="M33 148 L20 172" />
          <path d="M38 150 L32 176" />
          <path d="M107 148 L120 172" />
          <path d="M102 150 L108 176" />
        </g>,
      )}
      {mark(3, 18, 186)}

      {/* 4 · tel çıkışları — parmak uçlarındaki delikler */}
      {weapon(
        4,
        <g fill="var(--kan-thread)" fillOpacity="0.85">
          <circle cx="33" cy="147" r="1.5" />
          <circle cx="37" cy="149" r="1.5" />
          <circle cx="41" cy="147" r="1.5" />
          <circle cx="107" cy="147" r="1.5" />
          <circle cx="103" cy="149" r="1.5" />
          <circle cx="99" cy="147" r="1.5" />
        </g>,
      )}
      {mark(4, 122, 186)}
    </>
  );
}
