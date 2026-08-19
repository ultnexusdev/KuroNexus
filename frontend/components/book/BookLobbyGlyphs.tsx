/**
 * Salon 05 · Kitap — salon girişindeki dört bölüm levhası.
 *
 * Hazır ikon seti DEĞİL, kanadın kendi kazıma çizimleri: hepsi 32×32
 * kutuda, 1.1px `currentColor` konturla ve aynı elden çıkmış gibi çizildi
 * (kapı görseli `public/halls/kitap.svg` ile aynı dil). Renk yok — konturu
 * çağıran taraf `color` ile veriyor, böylece kural 16'daki token sistemi
 * bozulmuyor ve tema değişince levhalar da değişiyor.
 *
 * Her levha bölümün İŞİNİ anlatır, süs değil:
 * - arşiv     → açık kitap, iki yanı satırlı
 * - ödüller   → defne çelengi + madalya + kurdele
 * - okuma sırası → tomar, üstünde ARDIŞIK (noktalı) satırlar
 * - notlar    → tüy kalem, ucu hokkaya değiyor
 */

const BASE = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Açık kitap — Kitap Arşivi. */
function ArchiveGlyph() {
  return (
    <svg {...BASE}>
      <path d="M16 9.4C12.8 7.4 9 7 5.2 7.7v15.6C9 22.6 12.8 23 16 25" />
      <path d="M16 9.4C19.2 7.4 23 7 26.8 7.7v15.6C23 22.6 19.2 23 16 25" />
      <path d="M16 9.4V25" />
      <path d="M8.4 12.5c1.6-.2 3.2-.1 4.6.3" opacity="0.75" />
      <path d="M8.4 16.1c1.6-.2 3.2-.1 4.6.3" opacity="0.55" />
      <path d="M23.6 12.5c-1.6-.2-3.2-.1-4.6.3" opacity="0.75" />
      <path d="M23.6 16.1c-1.6-.2-3.2-.1-4.6.3" opacity="0.55" />
    </svg>
  );
}

/** Defne çelengi içinde madalya — Ödüller. */
function AwardsGlyph() {
  return (
    <svg {...BASE}>
      <circle cx="16" cy="12.4" r="4.4" />
      <circle cx="16" cy="12.4" r="1.7" opacity="0.6" />
      <path d="M12.9 15.9 11.4 26l4.6-2.9 4.6 2.9-1.5-10.1" />
      <path d="M9.6 21.4C6.2 18.6 5.4 13.6 7.6 9.2" opacity="0.85" />
      <path d="M22.4 21.4c3.4-2.8 4.2-7.8 2-12.2" opacity="0.85" />
      <path d="M8.1 12.4c-1.3-.3-2.2-1.1-2.6-2.3" opacity="0.7" />
      <path d="M8.9 16.6c-1.3-.2-2.4-.9-3-2" opacity="0.7" />
      <path d="M23.9 12.4c1.3-.3 2.2-1.1 2.6-2.3" opacity="0.7" />
      <path d="M23.1 16.6c1.3-.2 2.4-.9 3-2" opacity="0.7" />
    </svg>
  );
}

/** Tomar + ardışık duraklar — Okuma Sıraları. */
function ReadingOrdersGlyph() {
  return (
    <svg {...BASE}>
      <path d="M10.2 6.6h13.4v18.8H10.2z" />
      <path d="M10.2 6.6C8.1 6.6 7 7.6 7 9.1s1.1 2.5 3.2 2.5" />
      <path d="M23.6 25.4c2.1 0 3.2-1 3.2-2.5s-1.1-2.5-3.2-2.5" />
      <circle cx="13" cy="12.2" r="0.9" />
      <circle cx="13" cy="15.9" r="0.9" opacity="0.75" />
      <circle cx="13" cy="19.6" r="0.9" opacity="0.55" />
      <path d="M15.6 12.2h5.4" />
      <path d="M15.6 15.9h5.4" opacity="0.75" />
      <path d="M15.6 19.6h3.4" opacity="0.55" />
    </svg>
  );
}

/** Hokkaya değen tüy kalem — Okuma Notları. */
function NotesGlyph() {
  return (
    <svg {...BASE}>
      <path d="M26.8 5.2c-7.4 1-12.3 5.9-13.4 13.3 4-.5 7.5-2.9 9.5-6.4" />
      <path d="M26.8 5.2 14.6 17.4" opacity="0.8" />
      <path d="m19.6 8.4 2 2" opacity="0.6" />
      <path d="m16.7 11.7 2 2" opacity="0.6" />
      <path d="m13.4 18.5-1.6 2.4" />
      <path d="M8.4 20.9h9.2" />
      <path d="M9.6 20.9l.9 5.2c.1 1 1 1.7 2 1.7h3c1 0 1.9-.7 2-1.7l.9-5.2" />
    </svg>
  );
}

/** Bölüm anahtarı → levha. Bilinmeyen anahtarda hiçbir şey çizilmez. */
export const LOBBY_GLYPHS: Record<string, () => React.JSX.Element> = {
  archive: ArchiveGlyph,
  awards: AwardsGlyph,
  readingOrders: ReadingOrdersGlyph,
  notes: NotesGlyph,
};
