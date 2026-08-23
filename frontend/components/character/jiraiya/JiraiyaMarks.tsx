/**
 * Jiraiya sayfasının elle çizilmiş SVG seti.
 *
 * Neden vektör: BRIEF madde 3.4 dışarıdan raster indirmeyi ve hotlink'i
 * yasaklıyor (lisans doğrulanamıyor, CSP zaten engelliyor). Sayfanın
 * dekoratif motifleri — Myōbokuzan sırtları, kurbağa, mürekkep lekeleri,
 * fırça darbesi, Rasengan spirali, su halkaları — bu yüzden burada, tek
 * kalınlıkta ve token renkleriyle çiziliyor (ClanEmblems ve SharinganEyes
 * emsali).
 *
 * Hepsi `currentColor` ya da açıkça verilen token üzerinden boyanır: rengi
 * çağıran CSS sınıfı belirler, bileşende sabit renk yok. Hiçbiri metin
 * taşımadığı için hepsi `aria-hidden` — sayfanın anlamı metinde.
 *
 * Sunucu bileşenleri (`"use client"` yok): istemci adaları da import
 * edebilir, ama sunucuda çizildiklerinde tarayıcıya JS olarak inmezler.
 */

/** Myōbokuzan — üç kaba dağ hattı, arkadan öne doğru koyulaşır. */
export function MyobokuRidge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 320"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {/* En arka sırt — en soluk, en yayvan */}
      <path
        d="M0 320 L0 214 L86 152 L158 196 L246 108 L318 168 L402 96 L470 158 L556 82 L640 164 L722 104 L806 172 L890 118 L964 178 L1046 122 L1122 186 L1200 140 L1200 320 Z"
        fill="currentColor"
        opacity="0.28"
      />
      {/* Orta sırt */}
      <path
        d="M0 320 L0 258 L74 210 L142 246 L228 174 L296 224 L386 152 L462 216 L548 148 L628 218 L710 168 L792 226 L884 176 L960 232 L1052 182 L1128 236 L1200 198 L1200 320 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* Ön sırt — en koyu, en sivri: Myōbokuzan'ın kendisi */}
      <path
        d="M0 320 L0 292 L96 254 L176 284 L262 226 L340 272 L430 208 L508 266 L598 196 L682 264 L768 220 L852 270 L942 228 L1024 274 L1112 240 L1200 278 L1200 320 Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Kurbağa silüeti — Myōbokuzan'ın mührü.
 *
 * Gözler `--bg` ile oyuluyor: silüetin içindeki iki delik, sayfanın zemini.
 * Böylece motif hangi zeminde durursa dursun aynı görünüyor.
 */
export function ToadMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      {/* Gövde: iki göz kabartısı + geniş oturuş */}
      <path
        d="M30 33c0-6.4 4.3-11 10-11s10 4.6 10 11c0 1.2-.2 2.3-.5 3.3h1c-.3-1-.5-2.1-.5-3.3 0-6.4 4.3-11 10-11s10 4.6 10 11c0 4-1.7 7.4-4.4 9.4C74.3 48 80 56.3 80 65.6 80 78 66.6 87 50 87S20 78 20 65.6c0-9.3 5.7-17.6 14.4-21.2C31.7 42.4 30 39 30 33Z"
        fill="currentColor"
      />
      {/* Ön ayaklar — oturan kurbağanın iki parmak izi */}
      <path
        d="M22 82c-4.6 1.4-8.6 1.2-11.4-.7-1-.7-.7-2.2.6-2.4 3.4-.5 6.9-1.8 10-3.7ZM78 82c4.6 1.4 8.6 1.2 11.4-.7 1-.7.7-2.2-.6-2.4-3.4-.5-6.9-1.8-10-3.7Z"
        fill="currentColor"
      />
      {/* Göz bebekleri — zemine oyulmuş */}
      <circle cx="40" cy="33" r="3.4" fill="var(--bg)" />
      <circle cx="60" cy="33" r="3.4" fill="var(--bg)" />
    </svg>
  );
}

/**
 * Mürekkep lekesi — kenar boşluğuna düşmüş damla.
 *
 * Üç varyant: aynı fırçanın üç ayrı damlası. `variant` seçilmezse ilki.
 */
export function InkBlot({
  className,
  variant = 1,
}: {
  className?: string;
  variant?: 1 | 2 | 3;
}) {
  const shapes = {
    1: "M52 8c14 2 26 12 30 26 4 15-2 26-13 34-8 6-11 14-19 18-11 5-24 1-31-9C11 66 6 54 9 41 12 27 24 16 38 11c5-2 9-3 14-3Zm22 76c4-1 7 2 6 6-1 3-5 5-8 3-3-2-2-8 2-9ZM24 88c3-1 6 1 6 4s-4 5-6 3c-2-1-2-6 0-7Z",
    2: "M46 6c16-3 32 6 38 21 6 16 0 33-13 42-9 6-13 15-23 17-13 3-26-6-31-18-6-13-4-29 4-40C29 17 36 8 46 6Zm-27 78c4-2 8 1 7 5-1 4-6 5-8 2s-2-6 1-7Z",
    3: "M50 4c18 0 34 14 38 32 4 17-4 34-19 42-11 6-25 5-35-3C22 66 15 51 18 36 21 19 34 4 50 4Zm30 82c3-2 7 0 7 4 0 3-3 5-6 4-3-1-4-6-1-8ZM16 74c3-2 7 0 6 4-1 3-5 4-7 1-1-2-1-4 1-5Z",
  } as const;
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      <path d={shapes[variant]} fill="currentColor" />
    </svg>
  );
}

/**
 * Fırça darbesi — başlıkların altına çekilen tek nefeslik çizgi.
 *
 * Uçları inceliyor, ortası kalınlaşıyor: gerçek bir fırçanın basıncı.
 * `preserveAspectRatio="none"` çünkü başlığın genişliğine geriliyor.
 */
export function BrushRule({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 26"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M2 13c46-7 92-10 148-9 74 1 148 7 222 6 60-1 116-5 172-2v3c-56 5-112 9-172 10-74 1-148-5-222-6-56 0-102 2-148 8Z"
        fill="currentColor"
      />
      {/* Fırçanın kuru ucu — kılların bıraktığı iki ince iz */}
      <path
        d="M330 11c48 1 96 3 144 2v2c-48 1-96-1-144-2Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * Rasengan spirali — art arda gelen yarım çemberlerden büyüyen sarmal.
 *
 * Dönme sınıfı dışarıdan geliyor (`spinClassName`): hareketin kapısı CSS'te,
 * `prefers-reduced-motion` orada karara bağlanıyor.
 */
export function SpiralMark({
  className,
  spinClassName,
}: {
  className?: string;
  spinClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      <g className={spinClassName} style={{ transformOrigin: "50% 50%" }}>
        <path
          d="M50 50A4 4 0 0 1 58 50A8 8 0 0 1 42 50A12 12 0 0 1 66 50A16 16 0 0 1 34 50A20 20 0 0 1 74 50A24 24 0 0 1 26 50A28 28 0 0 1 82 50A32 32 0 0 1 18 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Su halkaları — son yaprağın altına düşen damlanın izi. */
export function RippleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      aria-hidden
      focusable="false"
    >
      <ellipse
        cx="100"
        cy="30"
        rx="18"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <ellipse
        cx="100"
        cy="30"
        rx="42"
        ry="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <ellipse
        cx="100"
        cy="30"
        rx="70"
        ry="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <ellipse
        cx="100"
        cy="30"
        rx="96"
        ry="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.16"
      />
    </svg>
  );
}
