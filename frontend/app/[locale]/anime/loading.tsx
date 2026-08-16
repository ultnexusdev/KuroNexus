import { HallSkeleton } from "@/components/hall/HallSkeleton";

/**
 * Anime kanadının yükleme iskeleti. Paylaşılan `HallSkeleton`,
 * `category="anime"` ile — iskelet salonun derisinde çizilsin, yükleme
 * sırasında tema atlaması olmasın (müzik kanadındaki kararın aynısı).
 */
export default function AnimeHallLoading() {
  return <HallSkeleton category="anime" tiles={8} stats={0} />;
}
