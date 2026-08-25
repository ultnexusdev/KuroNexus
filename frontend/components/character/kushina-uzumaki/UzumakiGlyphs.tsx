/**
 * Kushina sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--kus-*`, CSS modülünün deri bloğu); bu dosyada da
 * tek hex yok.
 *
 * Bileşenler tek bir `className` alıp geometriyi çiziyor; içerideki
 * parçalar `data-part` / `data-strand` nitelikleriyle işaretli. Hareketin
 * ve durumun tamamı CSS'te, o niteliklere bakan seçicilerde — böylece
 * modülün sonundaki reduced-motion battaniyesi hepsini tek yerden
 * durdurabiliyor ve buraya hiç prop yığılmıyor.
 *
 * ⚠️ Bu dosyada "use client" YOK. `BondChain` (istemci adası) `ChainLink`i
 * çağırdığı için o bileşen istemci paketine giriyor; geri kalanı sunucuda
 * çiziliyor ve tarayıcıya JS olarak inmiyor.
 */

/* ══ 1 · UZUMAKI GİRDAP AMBLEMİ ═══════════════════════════════════════════
   Naruto'nun sayfasındaki sarmaldan BİLEREK farklı: orası tek bir spiral,
   burası bir AMBLEM — kalın gövdeli girdap, aşağı-sola uzanan kuyruk ve
   etrafını saran üç dalga yayı. Klanın Konoha yeleklerinin sırtında duran
   işareti bu.

   Spiral, yarıçapı her yarım turda büyüyen altı yaydan kuruldu: bütün uç
   noktalar dikey eksende olduğu için `A` komutlarının hepsi aynı süpürme
   yönünde ve hiçbir kontrol noktası elle hesaplanmadı. ═══════════════ */

const WHIRL_SPIRAL =
  "M100 100 A7 7 0 0 1 100 86 A11 11 0 0 1 100 108 A16 16 0 0 1 100 76 " +
  "A22 22 0 0 1 100 120 A29 29 0 0 1 100 62 A37 37 0 0 1 100 136 " +
  "C100 154 90 163 74 164";

/** Girdabı saran su — üç kırık yay, hiçbiri tam daire değil. */
const WHIRL_WAVES = [
  "M26 120 C18 84 40 46 76 30",
  "M176 82 C183 118 161 154 126 170",
  "M58 178 C92 191 132 184 158 158",
];

export function WhirlCrest({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g
        data-part="wave"
        stroke="var(--kus-whirl)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      >
        {WHIRL_WAVES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path
        data-part="spiral"
        d={WHIRL_SPIRAL}
        stroke="var(--kus-whirl)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ══ 2 · KADRAJIN DIŞINA TAŞAN SAÇ ════════════════════════════════════════
   Hero portresinin üstüne binen yedi tel. Hepsi kadrajın üstünden giriyor
   ve altından çıkıyor — kutunun içinde başlayıp biten tek tel yok, taşma
   kasıtlı. Kalınlık farkı derinlik veriyor.

   `preserveAspectRatio` "slice": kutu hangi orana gelirse gelsin teller
   yassılmıyor, çizim kırpılıyor. Orantısız gerilen bir saç teli saç
   olmaktan çıkardı. ═══════════════════════════════════════════════════ */

const HAIR_STRANDS: { strand: number; width: number; d: string }[] = [
  {
    strand: 1,
    width: 5,
    d: "M240 -12 C250 90 196 150 208 236 C218 316 158 362 168 448 C176 520 128 566 118 652",
  },
  {
    strand: 2,
    width: 3.4,
    d: "M262 -12 C274 78 232 138 246 222 C258 300 206 350 218 430 C228 500 186 552 178 652",
  },
  {
    strand: 3,
    width: 4.4,
    d: "M216 -12 C224 96 168 158 178 246 C188 330 128 380 138 466 C146 540 96 584 86 652",
  },
  {
    strand: 4,
    width: 2.4,
    d: "M288 -12 C296 84 262 130 274 208 C286 288 244 334 254 412 C260 470 232 508 226 560",
  },
  {
    strand: 5,
    width: 2.8,
    d: "M192 -12 C198 88 142 142 148 224 C154 300 96 348 100 428 C104 486 72 520 66 572",
  },
  {
    strand: 6,
    width: 1.8,
    d: "M168 -12 C172 74 118 122 122 196 C126 258 88 292 90 344",
  },
  {
    strand: 7,
    width: 1.5,
    d: "M308 -12 C314 70 288 116 296 178 C302 232 278 262 282 308",
  },
];

export function HairFall({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 640"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--kus-hair)" strokeLinecap="round" fill="none">
        {HAIR_STRANDS.map((strand) => (
          <path
            key={strand.strand}
            data-strand={strand.strand}
            d={strand.d}
            strokeWidth={strand.width}
          />
        ))}
      </g>
    </svg>
  );
}

/* ══ 3 · DOKUZ TEL — "KIZIL HABANERO" ÖRTÜSÜ ══════════════════════════════
   Kanonik ayrıntı: Kushina kızdığında saçı DOKUZ ayrı tele ayrılıp havada
   dururdu; köyün ona taktığı ad da oradan geliyor. Mod açıkken bu dokuz
   tel sayfanın üstüne yayılıyor.

   Yelpaze tepede dar bir yerden çıkıp aşağı doğru açılıyor ve BİLEREK
   asimetrik: simetrik bir yelpaze amblem gibi durur, saç gibi durmaz. ══ */

const NINE_TAILS = [
  "M700 -40 C690 140 560 220 470 330 C380 440 300 520 150 604",
  "M716 -40 C712 150 604 244 528 356 C452 468 380 560 250 664",
  "M732 -40 C734 160 652 268 592 386 C532 504 480 596 372 716",
  "M748 -40 C756 168 700 292 660 416 C620 540 596 640 528 768",
  "M764 -40 C778 176 748 316 728 446 C708 576 706 680 672 816",
  "M780 -40 C800 172 796 320 796 452 C796 584 818 690 820 830",
  "M796 -40 C822 166 844 312 864 442 C884 572 928 676 962 804",
  "M812 -40 C844 158 892 296 930 420 C968 544 1032 640 1092 754",
  "M828 -40 C866 150 940 280 992 396 C1044 512 1130 596 1206 696",
];

export function NineStrands({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 880"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--kus-hair)" strokeLinecap="round" fill="none">
        {NINE_TAILS.map((d, index) => (
          <path
            key={d}
            data-strand={index + 1}
            d={d}
            strokeWidth={index % 3 === 0 ? 3.2 : index % 3 === 1 ? 2.2 : 1.5}
          />
        ))}
      </g>
    </svg>
  );
}

/* ══ 4 · SAÇ YELPAZESİ (küçük glif) ═══════════════════════════════════════
   Mod düğmesinde ve "ad" halkasında kullanılıyor. Dokuz tel 32 pikselde
   okunmuyor, o yüzden sayı çağırana bırakıldı. ════════════════════════ */

export function HairFan({
  className,
  strands = 9,
}: {
  className?: string;
  /** Kaç tel çizilsin — düğmede 9, küçük yerlerde 5-7 */
  strands?: number;
}) {
  const count = Math.max(3, strands);
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--kus-hair)" strokeLinecap="round" fill="none">
        {Array.from({ length: count }, (_, index) => {
          /* Yelpaze: -62° ile +62° arası, kökten (16,29) yukarı açılıyor.
             Her tel ortada hafif bir S yapıyor — düz ışın değil, saç. */
          const spread = -62 + (124 * index) / (count - 1);
          const rad = (spread * Math.PI) / 180;
          const tipX = 16 + Math.sin(rad) * 15;
          const tipY = 29 - Math.cos(rad) * 26;
          const midX = 16 + Math.sin(rad) * 6.5 - Math.cos(rad) * 2.4;
          const midY = 29 - Math.cos(rad) * 13;
          return (
            <path
              key={spread}
              data-strand={index + 1}
              d={`M16 29 Q${midX.toFixed(1)} ${midY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`}
              strokeWidth={index % 2 === 0 ? 1.5 : 1}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ══ 5 · ZİNCİR HALKASI ═══════════════════════════════════════════════════
   Sayfanın kalbindeki beş halkanın tek bir tanesi.

   İki duruş sırayla kullanılıyor: `face` geniş (halkaya karşıdan bakıyoruz),
   `edge` dar (halka yan dönmüş). Gerçek bir zincirde ardışık halkalar 90°
   dönüktür; kutular CSS'te negatif kenar boşluğuyla birbirinin üstüne
   bindiği için bu iki duruş art arda gelince zincir kenetlenmiş okunuyor.

   Her halkanın İKİ çizimi olabiliyor:
     [data-part="closed"] → kapalı halka + üst-sol ışık yayı
     [data-part="open"]   → aynı halkanın koparak açılmış hâli, iki ucunda
                            kopma çentiği
   İkincisi yalnızca kopma noktasındaki halkaya çiziliyor (`broken`) ve
   normalde görünmez; zincir koptuğunda CSS ikisini takas ediyor.

   Şekillerdeki küçük asimetriler (sol omuz sağdan bir birim aşağıda)
   kasıtlı: pergelle değil elle çizilmiş görünsün diye. ═══════════════ */

const LINK_SHAPES = {
  face: {
    ring:
      "M32 9 C46 9 55 21 55 35 L55 61 C55 76 46 88 32 88 " +
      "C18 88 9 76 9 62 L9 34 C9 20 18 9 32 9 Z",
    gleam: "M14 58 L14 34 C14 23 21 15 30 14",
    /* Kopmuş hâl: üst-sağda boşluk, iki uç dışa savrulmuş */
    open:
      "M29 10 C16 12 9 22 9 35 L9 62 C9 76 18 88 32 88 " +
      "C46 88 55 76 55 61 L55 46",
    tipA: [29, 10] as const,
    tipB: [55, 46] as const,
  },
  edge: {
    ring:
      "M32 9 C40 9 45 21 45 35 L45 61 C45 76 40 88 32 88 " +
      "C24 88 19 76 19 62 L19 34 C19 20 24 9 32 9 Z",
    gleam: "M23 58 L23 34 C23 23 26 16 31 14",
    open:
      "M30 10 C23 13 19 23 19 35 L19 62 C19 76 24 88 32 88 " +
      "C40 88 45 76 45 61 L45 46",
    tipA: [30, 10] as const,
    tipB: [45, 46] as const,
  },
} as const;

export function ChainLink({
  pose,
  broken = false,
  className,
}: {
  pose: "face" | "edge";
  /** Kopma çiziminin VAR OLUP OLMADIĞI; görünürlüğü CSS'te */
  broken?: boolean;
  className?: string;
}) {
  const shape = LINK_SHAPES[pose];
  return (
    <svg
      className={className}
      viewBox="0 0 64 97"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g data-part="closed">
        <path
          data-part="ring"
          d={shape.ring}
          strokeLinejoin="round"
          fill="none"
        />
        <path
          data-part="gleam"
          d={shape.gleam}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {broken ? (
        <g data-part="open">
          <path
            data-part="ring"
            d={shape.open}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Kopma çentikleri: kırılan iki uçtan dışa fırlayan kısa tüyler */}
          <path data-part="notch" d={`M${shape.tipA[0]} ${shape.tipA[1]} l-4 -5`} />
          <path data-part="notch" d={`M${shape.tipB[0]} ${shape.tipB[1]} l5 4`} />
        </g>
      ) : null}
    </svg>
  );
}
