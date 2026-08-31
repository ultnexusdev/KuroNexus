/**
 * Panda sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın bütün grafik malzemesi bu dosyada.
 *
 * Renk buradan GELMİYOR: her `stroke`/`fill` `currentColor` okuyor ya da
 * sınıfı dışarıdan alıyor. Hex disiplini (kural 16) böyle korunuyor.
 *
 * Hiçbiri bilgi taşımıyor; hepsi çağıran tarafta `aria-hidden` bir kapta
 * duruyor.
 */

/**
 * Bambu korusu — filigranın gövdesi.
 *
 * Beş sap, her birinde boğumlar ve iki yaprak. Saplar `stalkClassName` ile
 * ayrı ayrı eğilebilsin diye tek tek `<g>` içinde: hareket dili "bambu
 * salınımı" ve salınım her sapta kendi gecikmesiyle koşuyor.
 */
export function BambooGrove({
  className,
  stalkClassName,
  nodeClassName,
  leafClassName,
}: {
  className?: string;
  stalkClassName?: string;
  nodeClassName?: string;
  leafClassName?: string;
}) {
  /* x konumu, boğum yükseklikleri, yaprak yönü — elle dizildi ki aralıklar
     düzenli görünmesin (bir koru ızgara değildir). */
  const stalks = [
    { x: 26, nodes: [70, 132, 198, 262], leaf: -1 },
    { x: 74, nodes: [54, 118, 176, 244], leaf: 1 },
    { x: 128, nodes: [88, 146, 210, 268], leaf: -1 },
    { x: 178, nodes: [62, 126, 190, 250], leaf: 1 },
    { x: 228, nodes: [96, 158, 216, 274], leaf: -1 },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 260 320"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {stalks.map((stalk, index) => (
          <g
            key={stalk.x}
            className={stalkClassName}
            style={{ "--pnd-stalk": index } as React.CSSProperties}
          >
            <path d={`M${stalk.x} 316 L${stalk.x} 8`} />
            <g className={nodeClassName}>
              {stalk.nodes.map((y) => (
                <path
                  key={y}
                  d={`M${stalk.x - 7} ${y} L${stalk.x + 7} ${y}`}
                />
              ))}
            </g>
            <g className={leafClassName}>
              <path
                d={`M${stalk.x} ${stalk.nodes[1]} q ${stalk.leaf * 30} -14 ${
                  stalk.leaf * 46
                } -34`}
              />
              <path
                d={`M${stalk.x} ${stalk.nodes[2]} q ${stalk.leaf * 22} 10 ${
                  stalk.leaf * 38
                } 4`}
              />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * Üç halka — üç çekirdeğin şeması, bir üçgenin köşelerinde.
 *
 * Üçgen çizgisi kesik: üçüncü köşe kayıtta karanlık ve çizim bunu söylüyor.
 */
export function ThreeRings({
  className,
  ringClassName,
  linkClassName,
}: {
  className?: string;
  ringClassName?: string;
  linkClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 190"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className={linkClassName}>
          <path d="M52 62 L148 62" />
          <path d="M148 62 L100 146" />
          <path d="M100 146 L52 62" />
        </g>
        <g className={ringClassName}>
          <circle cx="52" cy="62" r="24" />
          <circle cx="148" cy="62" r="24" />
          <circle cx="100" cy="146" r="24" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Gövde silueti — çekirdeğe göre değişen kaba dış hat.
 *
 * `broad`  ağabeyin geniş omuzları
 * `round`  Panda'nın kendi yuvarlak hâli
 * `unknown` üçüncü çekirdek: kesik çizgi, çünkü kayıt onu hiç göstermiyor
 */
export function CoreSilhouette({
  shape,
  className,
  bodyClassName,
  markClassName,
}: {
  shape: "broad" | "round" | "unknown";
  className?: string;
  bodyClassName?: string;
  markClassName?: string;
}) {
  const body =
    shape === "broad"
      ? "M60 34 q26 0 30 22 l14 10 q16 12 12 34 l-8 44 q-4 26 -22 32 l4 32 h-60 l4 -32 q-18 -6 -22 -32 l-8 -44 q-4 -22 12 -34 l14 -10 q4 -22 30 -22 z"
      : shape === "round"
        ? "M60 36 q24 0 28 20 l10 8 q12 10 10 28 l-6 42 q-4 26 -20 32 l3 30 h-50 l3 -30 q-16 -6 -20 -32 l-6 -42 q-2 -18 10 -28 l10 -8 q4 -20 28 -20 z"
        : "M60 40 q22 0 26 18 l8 8 q10 10 8 26 l-6 40 q-4 24 -18 30 l3 28 h-42 l3 -28 q-14 -6 -18 -30 l-6 -40 q-2 -16 8 -26 l8 -8 q4 -18 26 -18 z";

  return (
    <svg
      className={className}
      viewBox="0 0 120 210"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path className={bodyClassName} d={body} data-shape={shape} />
        {/* Kulaklar — üç siluette de var, çünkü gövde hep aynı bebek */}
        <path className={bodyClassName} d="M32 34 a11 11 0 0 1 18 -6" />
        <path className={bodyClassName} d="M88 34 a11 11 0 0 0 -18 -6" />
        {/* Çekirdeğin yeri: göğsün ortasında tek işaret */}
        <g className={markClassName}>
          <circle cx="60" cy="106" r="13" />
          {shape === "unknown" ? null : <circle cx="60" cy="106" r="4" />}
        </g>
      </g>
    </svg>
  );
}

/**
 * Anatomik kesit — "Lanetli ceset" kipinde çekirdek göstergelerinin yerine
 * geçen çizim.
 *
 * Sıcak kipte üç halka bir amblem gibi duruyor; bu kipte aynı üç çekirdek
 * bir gövdenin İÇİNDE, dikiş hattı ve dolgu çizgileriyle birlikte
 * gösteriliyor. Aynı bilgi, ameliyat masasındaki hâli.
 */
export function CorpseAnatomy({
  className,
  shellClassName,
  seamClassName,
  coreClassName,
}: {
  className?: string;
  shellClassName?: string;
  seamClassName?: string;
  coreClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 190"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Gövde kabuğu — açılmış bir bebek, kesit görünümü */}
        <path
          className={shellClassName}
          d="M100 12 q42 0 50 34 l14 16 q18 20 12 46 l-10 46 q-8 26 -30 32 h-72 q-22 -6 -30 -32 l-10 -46 q-6 -26 12 -46 l14 -16 q8 -34 50 -34 z"
        />
        {/* Dikiş hattı — ortadan aşağı, teyel adımlarıyla */}
        <path className={seamClassName} d="M100 22 L100 182" />
        <g className={seamClassName}>
          <path d="M92 46 L108 46" />
          <path d="M92 78 L108 78" />
          <path d="M92 110 L108 110" />
          <path d="M92 142 L108 142" />
        </g>
        {/* Üç çekirdek — üçgenin köşeleri, gövdenin içinde */}
        <g className={coreClassName}>
          <circle cx="66" cy="74" r="16" />
          <circle cx="134" cy="74" r="16" />
          <circle cx="100" cy="134" r="16" />
          <path d="M66 74 L134 74" />
          <path d="M134 74 L100 134" />
          <path d="M100 134 L66 74" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Kırık bambu — kilit açıldığında (üç çekirdek de tükendiğinde) çıkan işaret.
 * Sap ortadan kırılmış, lifler dışarı çıkmış; yerine yenisi gelmiyor.
 */
export function SnappedStalk({
  className,
  stalkClassName,
  fiberClassName,
}: {
  className?: string;
  stalkClassName?: string;
  fiberClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 60"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className={stalkClassName}>
          <path d="M6 30 L54 30" />
          <path d="M54 30 L62 22" />
          <path d="M86 38 L94 30" />
          <path d="M94 30 L134 30" />
          <path d="M22 24 L22 36" />
          <path d="M118 24 L118 36" />
        </g>
        <g className={fiberClassName}>
          <path d="M62 22 L74 18" />
          <path d="M62 26 L78 26" />
          <path d="M64 30 L72 34" />
          <path d="M86 34 L74 30" />
          <path d="M86 38 L72 40" />
        </g>
      </g>
    </svg>
  );
}
