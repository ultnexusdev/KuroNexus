import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import { RinneganMotif } from "./RinneganMotif";

/**
 * Sergi glif seti (v3-B3).
 *
 * Referans görseldeki küçük illüstrasyonlar AI üretimiydi ve projede görsel
 * üretim hattı YOK (ölçüldü — repo'da Flux/fal/Replicate entegrasyonu
 * bulunamadı, PLAN §5c). Komutun 2. önceliği devrede: ikonlar kod içinde
 * çizilen, TEK çizgi stilinde (24×24, yuvarlak uçlu, currentColor) vektörler.
 * Renk kullanan taraftan/token'dan gelir (kural 16), dosya yok, CSP dostu.
 */
export type AkatsukiGlyphName =
  | "droplet"
  | "scroll"
  | "cloud"
  | "flag"
  | "ring"
  | "rinnegan"
  | "mask"
  | "flame"
  | "butterfly"
  | "dawn";

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function AkatsukiGlyph({
  name,
  className,
}: {
  name: AkatsukiGlyphName;
  className?: string;
}) {
  // İki motif zaten evde çizili — glif seti onları yeniden kullanır
  if (name === "cloud") return <AkatsukiCloud className={className} />;
  if (name === "rinnegan") return <RinneganMotif className={className} />;

  switch (name) {
    case "droplet":
      // Amegakure'nin yağmuru
      return (
        <Frame className={className}>
          <path d="M12 3 C12 3 6 10 6 14 a6 6 0 0 0 12 0 C18 10 12 3 12 3 Z" />
        </Frame>
      );
    case "scroll":
      // Kadim tomar — kuruluş sözü
      return (
        <Frame className={className}>
          <path d="M8 4 H17 A2 2 0 0 1 19 6 V18 A2 2 0 0 1 17 20 H8" />
          <path d="M8 4 A2 2 0 0 0 6 6 V18 A2 2 0 0 0 8 20" />
          <path d="M8 4 V20" />
          <path d="M11 9 H16 M11 12 H16 M11 15 H14" />
        </Frame>
      );
    case "flag":
      // Umut yıllarının sancağı
      return (
        <Frame className={className}>
          <path d="M6 3 V21" />
          <path d="M6 4 H16.5 L14 7.5 L16.5 11 H6" />
        </Frame>
      );
    case "ring":
      // Akatsuki yüzüğü — taşı üstte
      return (
        <Frame className={className}>
          <circle cx="12" cy="13.5" r="6" />
          <rect x="10.4" y="3.6" width="3.2" height="3.2" />
        </Frame>
      );
    case "mask":
      // Tobi'nin spiral maskesi
      return (
        <Frame className={className}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 6.5 a5.5 5.5 0 1 0 5.5 5.5" />
          <path d="M12 9.2 a2.8 2.8 0 1 0 2.8 2.8" />
          <circle cx="14.6" cy="11.2" r="1.1" fill="currentColor" stroke="none" />
        </Frame>
      );
    case "flame":
      // Savaş döneminin ateşi
      return (
        <Frame className={className}>
          <path d="M12 3 C10 7 7 9.4 7 13 a5 5 0 0 0 10 0 C17 10.6 14 7 12 3 Z" />
          <path d="M12 11 C11 12.6 10 13.6 10 15 a2 2 0 0 0 4 0 C14 13.6 13 12.6 12 11 Z" />
        </Frame>
      );
    case "butterfly":
      // Konan'ın kağıdı — şafağın kelebeği
      return (
        <Frame className={className}>
          <path d="M12 7 V16.5" />
          <path d="M12 6.5 L10.4 4.2 M12 6.5 L13.6 4.2" />
          <path d="M12 9.5 C9 5.5 4.5 6.5 5.4 10.2 C6.1 13 9.6 13.4 12 11.8" />
          <path d="M12 9.5 C15 5.5 19.5 6.5 18.6 10.2 C17.9 13 14.4 13.4 12 11.8" />
          <path d="M12 12.5 C10 14.8 7.2 16.4 8.8 18.2 C10.1 19.6 11.7 17.2 12 15.2" />
          <path d="M12 12.5 C14 14.8 16.8 16.4 15.2 18.2 C13.9 19.6 12.3 17.2 12 15.2" />
        </Frame>
      );
    case "dawn":
      // Şafak söker
      return (
        <Frame className={className}>
          <path d="M4 16.5 H20" />
          <path d="M8 16.5 a4 4 0 0 1 8 0" />
          <path d="M12 9.5 V7 M6.8 11.8 L5.2 10.2 M17.2 11.8 L18.8 10.2" />
        </Frame>
      );
    default:
      return null;
  }
}
