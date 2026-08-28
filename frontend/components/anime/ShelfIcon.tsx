import type { ShelfKey } from "@/lib/anime/shelves";

/**
 * Raf işaretleri.
 *
 * Önceden emojiydiler (▶️ ⏳ 📅 ✅ ❤️ 📌) ve iki sorunu vardı: her işletim
 * sistemi kendi çizimini basıyor (Windows'ta düz, macOS'ta parlak, Android'de
 * bambaşka), üstelik hiçbiri sitenin kendi çizgisine ait değildi — perdenin
 * ince tipografisinin yanında yapıştırma duruyorlardı.
 *
 * Altısı da aynı kurala göre çizildi: 24'lük kare, yalnızca çizgi (dolgu yok),
 * 1.5 kalınlık, yuvarlatılmış uç ve köşe. Renk `currentColor` — raf başlığının
 * rengini miras alıyorlar, dolayısıyla tema değişince onlar da değişiyor ve
 * bileşende tek bir renk değeri yazılı değil (kural 16).
 *
 * `aria-hidden`: işaretin söylediği her şeyi yanındaki başlık zaten yazıyor.
 */
const PATHS: Record<ShelfKey, React.ReactNode> = {
  // İzliyorum — oynatma üçgeni
  watching: <path d="M9.5 7.2 17 12l-7.5 4.8V7.2Z" />,
  // Beklemede — duraklat
  paused: (
    <>
      <path d="M10 7.5v9" />
      <path d="M14 7.5v9" />
    </>
  ),
  // Devamı gelecek — takvim: bir sonraki yayın tarihi bekleniyor
  upcoming: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10.5h16" />
      <path d="M8.5 4v3M15.5 4v3" />
    </>
  ),
  // Bitirdiklerim — onay
  completed: <path d="m6 12.4 4 4L18 8" />,
  // Favorilerim — kalp
  favorites: (
    <path d="M12 19.5c-.9-.7-6.5-4.6-6.5-8.8A3.6 3.6 0 0 1 12 8.4a3.6 3.6 0 0 1 6.5 2.3c0 4.2-5.6 8.1-6.5 8.8Z" />
  ),
  // Planlıyorum — sıraya konmuş, yer imi
  planned: <path d="M7 4.5h10v15l-5-3.8-5 3.8v-15Z" />,
};

export function ShelfIcon({
  shelf,
  className,
}: {
  shelf: ShelfKey;
  /** Konum ve solgunluk çağıranın CSS modülünden gelir */
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {PATHS[shelf]}
    </svg>
  );
}
