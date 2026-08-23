import type { SasukeSigil } from "@/lib/characters/sasuke-uchiha-experience";

/**
 * Teknik işaretleri — elle çizilmiş, tek gramajlı çizgi seti.
 *
 * Neden ikon seti: laboratuvar kartlarının görselleri kürator yükleyene
 * kadar boş kalıyor ve boş bir kutu kartı öldürüyor. Emoji ya da hazır
 * ikon kütüphanesi yerine kendi çizgimizi kullanıyoruz — hepsi aynı
 * 32'lik kutuda, aynı 1.6 kalınlıkta, aynı yuvarlak uçlarda. Kart görsel
 * aldığında işaret küçülüp künye rozeti olarak kalır.
 *
 * Renk yok: `currentColor`. Kartın kanadı (intikam/kefaret) rengi CSS'te
 * belirliyor, işaret ona uyuyor.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function SigilBody({ sigil }: { sigil: SasukeSigil }) {
  switch (sigil) {
    /* Chidori — avuçta toplanan yıldırım, iki yanında kıvılcım yayı */
    case "bolt":
      return (
        <g {...STROKE}>
          <path d="M 18.5 3 L 9.5 17 H 15.5 L 12.5 29 L 22.5 14 H 16.5 Z" />
          <path d="M 5.5 10 C 3.5 15 3.8 20 6 24" />
          <path d="M 26.5 10 C 28.5 15 28.2 20 26 24" />
        </g>
      );
    /* Amaterasu — dıştan kara alev, içinde ikinci bir dil */
    case "blackflame":
      return (
        <g {...STROKE}>
          <path d="M 16 3 C 20.5 10 24.5 13.5 24.5 18.8 A 8.5 8.5 0 0 1 7.5 18.8 C 7.5 13.5 12 10 16 3 Z" />
          <path d="M 16 14.5 C 18 17.5 19.2 18.8 19.2 20.6 A 3.2 3.2 0 0 1 12.8 20.6 C 12.8 18.8 14 17.5 16 14.5 Z" />
        </g>
      );
    /* Rinnegan — üç halka, tek tomoe */
    case "rings":
      return (
        <g {...STROKE}>
          <circle cx="16" cy="16" r="11.5" />
          <circle cx="16" cy="16" r="7.5" />
          <circle cx="16" cy="16" r="3.4" />
          <circle cx="16" cy="4.5" r="1.7" fill="currentColor" strokeWidth="0" />
        </g>
      );
    /* Kirin — buluttan inen gerçek yıldırım */
    case "kirin":
      return (
        <g {...STROKE}>
          <path d="M 5 12.5 A 5 5 0 0 1 13.5 8.5 A 6.5 6.5 0 0 1 27 11.5" />
          <path d="M 18 15 L 12.5 22 H 16.5 L 13 29.5" />
          <path d="M 24 16 L 21.5 21" />
        </g>
      );
    /* Katon: Gōkakyū — ateş topu ve üstünden yükselen diller */
    case "flame":
      return (
        <g {...STROKE}>
          <circle cx="16" cy="19.5" r="8.5" />
          <path d="M 8.5 13 C 10 8.5 13 6.5 14 3 C 16 7 18 7 20 4 C 21.5 8 23.5 9.5 23.5 13" />
        </g>
      );
    /* Kusanagi — düz namlu, ince balçak, yuvarlak topuz */
    case "blade":
      return (
        <g {...STROKE}>
          <path d="M 16 2 L 19 8.5 V 19 H 13 V 8.5 Z" />
          <path d="M 9.5 19 H 22.5" />
          <path d="M 16 19 V 26.5" />
          <circle cx="16" cy="28.5" r="1.8" />
        </g>
      );
    /* Juin — boyundaki üç tomoe */
    case "seal":
      return (
        <g {...STROKE}>
          {[0, 120, 240].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <circle cx="16" cy="9" r="2.3" fill="currentColor" strokeWidth="0" />
              <path d="M 18.2 8 C 21 7.2 23 8.2 23.8 10.4" />
            </g>
          ))}
        </g>
      );
  }
}

/**
 * Tek bir işaret. Dekoratif: kartın adı zaten metinde yazıyor, ekran
 * okuyucu aynı bilgiyi iki kez duymasın.
 */
export function SasukeSigilMark({
  sigil,
  className,
}: {
  sigil: SasukeSigil;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <SigilBody sigil={sigil} />
    </svg>
  );
}
