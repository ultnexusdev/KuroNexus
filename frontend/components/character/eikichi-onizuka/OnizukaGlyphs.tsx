/**
 * Onizuka sayfasının elle çizilmiş SVG motifleri.
 *
 * ── NEDEN ÇİZİLDİ, İNDİRİLMEDİ ───────────────────────────────────────────
 * Faz 2 görsel politikası: sahne/dönem/teknik görselleri üretilmez ve
 * dışarıdan raster indirilmez; motif gerekiyorsa ELLE SVG çizilir. Bu
 * dosyadaki dört motif de o kuralın karşılığı:
 *
 *   BikeMark     → filigran motosiklet silueti (Kawasaki 750RS'in yandan
 *                  duruşuna bakan, dolgusuz kontur)
 *   BellMark     → ders zili (mod düğmesinin ikonu)
 *   CassetteMark → VHS kaseti (kaset bölümünün başlığı ve OSD rozeti)
 *   ChalkRule    → tebeşir çizgisi; kara tahta DOKUSUNUN tek kalıntısı
 *                  (mekanik olarak kara tahta YASAK — Iruka'nın sayfası)
 *
 * Hiçbirinde durum yok, hiçbiri `"use client"` değil: sunucuda çiziliyorlar
 * ve istemci adalarından da çağrılabiliyorlar (Nanami'nin `RatioGlyphs`
 * emsali). Renk yok — hepsi `currentColor` ya da çağıranın verdiği sınıf
 * üzerinden boyanıyor, yani deri bloğunun dışına tek hex çıkmıyor.
 *
 * Hepsi dekoratif: çağıran taraf `aria-hidden` veriyor.
 */

/** Yandan motosiklet konturu — hero filigranı. */
export function BikeMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 128"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden
    >
      {/* tekerlekler */}
      <circle cx="46" cy="88" r="30" />
      <circle cx="46" cy="88" r="15" strokeWidth="1.4" />
      <circle cx="194" cy="88" r="30" />
      <circle cx="194" cy="88" r="15" strokeWidth="1.4" />

      {/* ön çatal ve gidon */}
      <path d="M46 88 L80 40" />
      <path d="M80 40 L62 30" />
      <path d="M80 40 L98 36" />
      <path d="M74 48 L52 78" strokeWidth="1.4" />

      {/* depo ve sele */}
      <path d="M92 50 L132 42 L152 48 L152 60 L98 62 Z" />
      <path d="M152 48 L190 46 L196 56 L154 60" />

      {/* motor bloğu ve zincir hattı */}
      <path d="M108 62 L148 62 L152 82 L112 84 Z" strokeWidth="1.8" />
      <path d="M152 54 L192 86" strokeWidth="1.4" />
      <path d="M150 82 L194 88" strokeWidth="1.4" />
      <circle cx="194" cy="88" r="6" strokeWidth="1.4" />

      {/* egzoz */}
      <path d="M112 84 C 142 102, 176 102, 206 92" strokeWidth="1.8" />
    </svg>
  );
}

/** Ders zili — mod düğmesinin ikonu. `swung` çaldığı ânı işaretliyor. */
export function BellMark({
  className,
  bodyClassName,
  clapperClassName,
}: {
  className?: string;
  bodyClassName?: string;
  clapperClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden
    >
      <path className={bodyClassName} d="M24 9 C33 9, 38 17, 38 27 L41 34 L7 34 L10 27 C10 17, 15 9, 24 9 Z" />
      <path d="M20 6.5 L28 6.5" />
      <path d="M24 6.5 L24 9" />
      <path className={clapperClassName} d="M19 34 C19 39, 29 39, 29 34" />
    </svg>
  );
}

/** VHS kaseti — kaset bölümünün rozeti. */
export function CassetteMark({
  className,
  reelClassName,
}: {
  className?: string;
  reelClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 52"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden
    >
      <path d="M4 6 L76 6 L76 46 L4 46 Z" />
      <path d="M14 14 L66 14 L66 34 L14 34 Z" strokeWidth="1.4" />
      <circle className={reelClassName} cx="28" cy="24" r="7" strokeWidth="1.6" />
      <circle className={reelClassName} cx="52" cy="24" r="7" strokeWidth="1.6" />
      <circle cx="28" cy="24" r="2.4" strokeWidth="1.2" />
      <circle cx="52" cy="24" r="2.4" strokeWidth="1.2" />
      <path d="M22 41 L58 41" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Tebeşir çizgisi — kara tahtanın sayfada kalan TEK izi.
 *
 * ⚠️ Iruka'nın sayfası "kara tahta + tebeşirle yazılan beş ders" mekaniğini
 * kullanıyor (SÖZLEŞME §2). Burada kara tahta bir mekanik değil, yalnızca
 * başlık altındaki bu titrek çizgi kadar bir doku.
 */
export function ChalkRule({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 10"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      focusable="false"
      aria-hidden
    >
      <path d="M2 6 C 40 3, 70 8, 108 5 C 150 2, 182 8, 224 5 C 262 2, 292 7, 318 4" />
      <path d="M12 8.4 C 52 7, 96 9, 140 7.6" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
