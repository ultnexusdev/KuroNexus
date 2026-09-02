/**
 * Konoha klan amblemleri — el çizimi SVG seti.
 *
 * Neden görsel değil vektör: amblemler 16px çipten 160px filigrana kadar
 * dört ayrı ölçekte kullanılıyor; raster üretim (nano-banana) logolarda
 * geometriyi bozuyor ve her boyut için ayrı dosya isterdi. SVG tek kaynak,
 * `currentColor` ile kartın rengine uyar (AkatsukiCloud emsali).
 *
 * Çizimler kullanıcının verdiği referans levhadan stilize edildi — birebir
 * kopya değil, arşivin tek kalınlıkta, mühür havasında yorumu. Uchiha ve
 * Uzumaki kendi kanonik renklerini taşır (yelpazenin kırmızısı içerik,
 * tema kararı değil); geri kalanı bulunduğu yerin rengini alır.
 */

const STROKE = 6.5;

/** Ortak kabuk — başlıksızsa dekoratif (aria-hidden) */
function Shell({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const EMBLEMS: Record<string, React.ReactNode> = {
  /* Uchiha — uchiwa yelpazesi: üst yarım kanonik kızıl, sap aşağıda */
  uchiha: (
    <>
      <path
        d="M26 50 A24 24 0 0 1 74 50 Z"
        fill="var(--emblem-crimson, #c0392f)"
        stroke="none"
      />
      <path
        d="M26 50 A24 24 0 0 0 74 50 Z"
        fill="var(--emblem-paper, #ddd8cd)"
        stroke="none"
      />
      <path
        d="M46 73 h8 v15 h-8 Z"
        fill="var(--emblem-paper, #ddd8cd)"
        stroke="none"
      />
    </>
  ),
  /* Senju — orta hat, dışa bakan iki hilal ve iki uç noktası */
  senju: (
    <>
      <path d="M22 50 H78" />
      <path d="M36 29 A23 23 0 0 0 36 71" />
      <path d="M64 29 A23 23 0 0 1 64 71" />
      <circle cx="14" cy="50" r="4" fill="currentColor" stroke="none" />
      <circle cx="86" cy="50" r="4" fill="currentColor" stroke="none" />
    </>
  ),
  /* Uzumaki — girdap; kanonik bordo, Konoha yaprağının atası */
  uzumaki: (
    <path
      d="M50 50 a5 5 0 0 1 10 0 a10 10 0 0 1 -20 0 a15 15 0 0 1 30 0 a20 20 0 0 1 -40 0 a25 25 0 0 1 50 0 a30 30 0 0 1 -33 29.8"
      stroke="var(--emblem-maroon, #9c4650)"
      strokeWidth="8"
    />
  ),
  /* Hyūga — açık yelpaze ve içindeki alev */
  hyuga: (
    <>
      <path d="M13 25 Q50 41 87 25 L50 87 Z" />
      <circle cx="50" cy="45" r="6" fill="currentColor" stroke="none" />
      <path d="M50 30 q8 6 2 15" strokeWidth="5" />
    </>
  ),
  /* Aburame — gövde, iki yan kanca ve duyargalar */
  aburame: (
    <>
      <ellipse cx="50" cy="54" rx="8" ry="13" />
      <path d="M31 22 C13 34 13 66 31 78" />
      <path d="M69 22 C87 34 87 66 69 78" />
      <path d="M31 22 l9 7 M69 22 l-9 7 M31 78 l9 -7 M69 78 l-9 -7" strokeWidth="5" />
      <path d="M44 28 l4 11 M56 28 l-4 11" strokeWidth="5" />
    </>
  ),
  /* Akimichi — çember içinde kanat açan dağ çizgisi */
  akimichi: (
    <>
      <circle cx="50" cy="50" r="31" strokeWidth="7" />
      <path d="M31 63 L42 35 L50 51 L58 35 L69 63" strokeWidth="6" />
    </>
  ),
  /* Nara — dolu disk ve pençe izi oyuklar (oyuk rengi kart zemininden) */
  nara: (
    <>
      <circle cx="50" cy="50" r="29" fill="currentColor" stroke="none" />
      <path
        d="M27 41 Q50 31 73 39 M25 53 Q52 45 75 51 M29 65 Q52 59 71 63"
        stroke="var(--emblem-ground, #101318)"
        strokeWidth="5"
      />
    </>
  ),
  /* Yamanaka — çember içinde dört taçyaprağı ve göbek */
  yamanaka: (
    <>
      <circle cx="50" cy="50" r="31" strokeWidth="7" />
      <circle cx="50" cy="34" r="6" fill="currentColor" stroke="none" />
      <circle cx="66" cy="50" r="6" fill="currentColor" stroke="none" />
      <circle cx="50" cy="66" r="6" fill="currentColor" stroke="none" />
      <circle cx="34" cy="50" r="6" fill="currentColor" stroke="none" />
      <circle cx="50" cy="50" r="4.5" fill="currentColor" stroke="none" />
    </>
  ),
  /* Inuzuka — çift diş izi */
  inuzuka: (
    <>
      <path
        d="M34 16 C20 42 26 68 56 84 C38 62 36 42 48 22 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M62 22 C54 40 56 56 76 68 C64 52 63 38 70 26 Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  /* Sarutobi — halka başlı gövde, kıvrık kollar ve iki bacak */
  sarutobi: (
    <>
      <circle cx="50" cy="19" r="8" />
      <path d="M50 27 V62" />
      <path d="M50 42 C36 42 30 33 33 24" />
      <path d="M50 42 C64 42 70 33 67 24" />
      <path d="M50 62 L35 84 M50 62 L65 84" />
      <path d="M35 84 q-7 3 -10 -2 M65 84 q7 3 10 -2" strokeWidth="5" />
    </>
  ),
  /* Hatake — eşkenar kafes (pirinç tarlası mührü) */
  hatake: (
    <>
      <path d="M50 13 L87 50 L50 87 L13 50 Z" />
      <path d="M50 31 L69 50 L50 69 L31 50 Z" strokeWidth="5" />
      <path d="M31.5 31.5 L68.5 68.5 M68.5 31.5 L31.5 68.5" strokeWidth="5" />
    </>
  ),
  /* Shimura — kızıl mühür: çerçeve içinde 志村 */
  shimura: (
    <>
      <rect
        x="20"
        y="8"
        width="60"
        height="84"
        rx="6"
        stroke="var(--emblem-seal, #b3342e)"
        strokeWidth="5"
      />
      <text
        x="50"
        y="44"
        textAnchor="middle"
        fontSize="34"
        fontFamily="var(--font-brush), serif"
        fill="var(--emblem-seal, #b3342e)"
        stroke="none"
      >
        志
      </text>
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontSize="34"
        fontFamily="var(--font-brush), serif"
        fill="var(--emblem-seal, #b3342e)"
        stroke="none"
      >
        村
      </text>
    </>
  ),
  /* Kaguya — alnın iki noktası ve altındaki yay */
  kaguya: (
    <>
      <circle cx="36" cy="38" r="7" fill="currentColor" stroke="none" />
      <circle cx="64" cy="38" r="7" fill="currentColor" stroke="none" />
      <path d="M22 60 Q50 76 78 60" />
    </>
  ),
  /* Hōzuki — damla ve içindeki dalga (sıvılaşma) */
  hozuki: (
    <>
      <path d="M50 14 C65 36 74 49 74 61 A24 24 0 0 1 26 61 C26 49 35 36 50 14 Z" />
      <path d="M36 62 Q43 55 50 62 T64 62" strokeWidth="5" />
    </>
  ),
};

/**
 * Tek amblem. Tanınmayan kimlikte hiçbir şey çizmez (boş oda yasağının
 * çip hâli: olmayan amblem için yer tutulmaz).
 */
export function ClanEmblem({
  clan,
  className,
  title,
}: {
  clan: string;
  className?: string;
  title?: string;
}) {
  const art = EMBLEMS[clan];
  if (!art) return null;
  return (
    <Shell title={title} className={className}>
      {art}
    </Shell>
  );
}

/**
 * Uzumaki girdabı — hero'nun malzeme katmanındaki motif (RinneganMotif
 * emsali). Amblemden farkı: tek renk, `currentColor`, iri fırça izi.
 */
export function UzumakiSpiral({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    >
      <path d="M50 50 a5 5 0 0 1 10 0 a10 10 0 0 1 -20 0 a15 15 0 0 1 30 0 a20 20 0 0 1 -40 0 a25 25 0 0 1 50 0 a30 30 0 0 1 -60 0 a35 35 0 0 1 70 0 a40 40 0 0 1 -44 39.8" />
    </svg>
  );
}
