/**
 * Rock Lee sayfasının elle çizilmiş işaret seti.
 *
 * Dört motif: kapı (八門), bandajlı yumruk, nilüfer (蓮華) ve çetele.
 * Hiçbiri dışarıdan gelmiyor — BRIEF kural 3.4: fandom/wiki görseli yasak,
 * dekoratif motif elle çizilir (emsal: `itachi/SharinganEyes.tsx`,
 * `anime/naruto/ClanEmblems.tsx`).
 *
 * ── RENK ─────────────────────────────────────────────────────────────
 * Çizimlerin hiçbirinde renk YOK: hepsi `currentColor` ile boyanıyor ve
 * rengi çağıran sınıf veriyor (`color: var(--lee-bandage)` gibi). Böylece
 * kural 16 SVG'de de tutuyor ve aynı çizim ısı rampasında renk
 * değiştirebiliyor.
 *
 * Bunlar sunucu bileşeni: durum tutmuyorlar, istemci adalarından da
 * çağrılabiliyorlar (ikisi de aynı dosyayı paylaşıyor, ek yük yok).
 */

/**
 * Kapı. Kapalıyken iki kanat ortada birleşir; `data-leaf` işaretleri
 * CSS'e kanatları menteşelerinden açma imkânı verir (bkz. modülde
 * `.gateGlyph [data-leaf]`). Çizim kasıtlı olarak bir torii değil: torii
 * bir geçit, bu ise bir KİLİT — üst kirişin altında kapanan iki kanat.
 */
export function GateGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {/* üst kiriş — iki kat, dışta taşan */}
      <path d="M4 12h56" strokeWidth={3.4} />
      <path d="M10 18h44" />
      {/* direkler */}
      <path d="M13 18v40M51 18v40" strokeWidth={3} />
      {/* eşik */}
      <path d="M7 58h50" strokeWidth={3.4} />
      {/* kanatlar — menteşeler dış kenarlarda */}
      <g data-leaf="left">
        <path d="M14.5 20.5h17v36h-17z" />
        <path d="M18 27v23M24.5 27v23" strokeWidth={1.3} opacity={0.72} />
      </g>
      <g data-leaf="right">
        <path d="M32.5 20.5h17v36h-17z" />
        <path d="M39.5 27v23M46 27v23" strokeWidth={1.3} opacity={0.72} />
      </g>
      {/* kilidin halkası — kanatlar açılınca CSS onu söndürür */}
      <circle data-lock cx="32" cy="38" r="4.2" strokeWidth={2} />
    </svg>
  );
}

/**
 * Bandajlı yumruk — hero'nun detayı.
 *
 * Bir anatomi çizimi değil, bir MÜREKKEP çizimi: yumruk kütlesi tek bir
 * kapalı eğriyle, sargı ise onun üstünden geçen bantlarla veriliyor.
 * Sargının ucu bilerek serbest bırakıldı (sarılmayı bitirmemiş el).
 */
export function BandagedFist({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 210"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {/* yumruk kütlesi */}
      <path
        d="M46 74c-9-16 4-34 24-36l44-4c22-2 38 12 39 32l2 40c1 22-15 37-36 36l-46-2C52 139 38 124 39 104z"
        strokeWidth={3}
      />
      {/* parmak boğumları — sol kenarda dört tümsek */}
      <path
        d="M43 76c7-7 17-7 24 0M42 96c7-7 17-7 24 0M43 116c7-7 17-7 24 0"
        strokeWidth={2}
        opacity={0.85}
      />
      {/* başparmağın çizgisi */}
      <path d="M74 140c10-9 12-24 6-36" strokeWidth={2} opacity={0.7} />
      {/* önkol */}
      <path
        d="M150 66l86 44c9 5 12 16 7 25l-6 10c-5 9-16 12-25 8l-64-30"
        strokeWidth={3}
      />
      {/* ── sargı bantları: yumruğun üstünden geçen kalın şeritler ── */}
      <g data-wrap strokeWidth={7} opacity={0.95}>
        <path d="M58 60c26 10 52 16 78 18" />
        <path d="M50 84c30 12 60 19 92 21" />
        <path d="M52 108c30 12 60 18 90 20" />
        <path d="M62 130c26 9 52 14 78 16" />
        <path d="M150 84l60 31" />
        <path d="M146 106l58 30" />
      </g>
      {/* bantların arasındaki ince gölge çizgileri */}
      <g strokeWidth={1.2} opacity={0.5}>
        <path d="M54 72c28 11 56 17 84 19" />
        <path d="M50 96c30 12 60 18 91 20" />
        <path d="M56 119c28 10 56 16 84 18" />
      </g>
      {/* sargının serbest ucu */}
      <path
        d="M140 146c16 6 26 16 28 30 1 8-4 15-12 16-7 1-13-4-13-11 0-6 4-10 10-10"
        strokeWidth={4}
        opacity={0.9}
      />
    </svg>
  );
}

/**
 * Nilüfer — Omote/Ura Renge'nin işareti. Yedi yaprak, ortada tomurcuk;
 * alt yapraklar daha açık, üst yapraklar daha dik: çiçek "açıyor".
 */
export function LotusMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 90"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {/* dış yapraklar */}
      <path d="M60 78C36 78 12 68 4 54c14-8 34-8 48 2" />
      <path d="M60 78c24 0 48-10 56-24-14-8-34-8-48 2" />
      {/* orta yapraklar */}
      <path d="M60 78C44 74 30 60 28 42c14 0 27 9 32 22" />
      <path d="M60 78c16-4 30-18 32-36-14 0-27 9-32 22" />
      {/* iç yapraklar */}
      <path d="M60 78c-8-8-12-22-8-34 8 6 12 18 8 34" />
      <path d="M60 78c8-8 12-22 8-34-8 6-12 18-8 34" />
      {/* tomurcuk */}
      <path d="M60 76c-6-12-6-26 0-38 6 12 6 26 0 38" strokeWidth={2.4} />
    </svg>
  );
}

/**
 * Çetele — tekrar motifinin işareti. Üç grup beşlik, sağa doğru soluyor:
 * sayaç satırındaki rakamın "devamı var" demesi için.
 */
export function TallyMarks({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 132 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      <g>
        <path d="M5 6v22M13 6v22M21 6v22M29 6v22" />
        <path d="M2 25L33 7" strokeWidth={2.2} />
      </g>
      <g opacity={0.62}>
        <path d="M49 6v22M57 6v22M65 6v22M73 6v22" />
        <path d="M46 25L77 7" strokeWidth={2.2} />
      </g>
      <g opacity={0.3}>
        <path d="M93 6v22M101 6v22M109 6v22M117 6v22" />
        <path d="M90 25L121 7" strokeWidth={2.2} />
      </g>
    </svg>
  );
}
