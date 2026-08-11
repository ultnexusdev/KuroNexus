import { HallSkeleton } from "@/components/hall/HallSkeleton";

/**
 * Müzik kanadının yükleme iskeleti.
 *
 * Paylaşılan `HallSkeleton` kullanılıyor: altı salonun hepsi aynı iskeleti
 * kendi derisiyle çiziyor, yani kanat başına ayrı bir iskelet yazmak yok.
 * `category="muzik"` deriyi açıyor — iskelet de salonun renklerinde görünsün,
 * yükleme sırasında tema atlaması olmasın.
 */
export default function MusicLoading() {
  return <HallSkeleton category="muzik" tiles={12} stats={3} />;
}
