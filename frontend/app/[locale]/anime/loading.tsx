import { AnimeHallSkeleton } from "@/components/anime/AnimeHallSkeleton";

/**
 * Anime kanadının yükleme iskeleti.
 *
 * Eskiden paylaşılan `HallSkeleton` (poster ızgarası) çiziliyordu; salonun
 * gerçek düzeni poster ızgarası olmadığı için veri indiğinde sayfa
 * zıplıyordu. Artık kanadın kendi iskeleti — ölçüler `page.module.css`ten.
 * `HallSkeleton` diğer salonlarda olduğu gibi duruyor.
 */
export default function AnimeHallLoading() {
  return <AnimeHallSkeleton />;
}
