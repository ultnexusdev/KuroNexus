import type { MetadataRoute } from "next";

/**
 * `/manifest.webmanifest` — telefonda "ana ekrana ekle" dendiğinde kullanılan
 * kimlik. Next bu dosyanın varlığını görüp `<link rel="manifest">` etiketini
 * kendisi basıyor; layout'ta ayrıca tanımlamaya gerek yok.
 *
 * Renkler burada hex yazılı çünkü manifest bir CSS dosyası değil — tarayıcı
 * uygulama açılırken, henüz hiçbir stil yüklenmemişken okuyor. Değerler
 * `globals.css`teki hol token'larının (`--hub-ink`) birebir karşılığıdır;
 * orası değişirse buranın da elle güncellenmesi gerekir.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KuroNexus",
    short_name: "KuroNexus",
    description:
      "Kişisel kültür arşivi — film, dizi, spor, anime, kitap, müzik ve karanlık evrenler.",
    start_url: "/",
    display: "standalone",
    background_color: "#101116",
    theme_color: "#101116",
    icons: [
      {
        src: "/brand/pwa-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
