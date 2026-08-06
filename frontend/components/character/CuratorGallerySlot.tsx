"use client";

import dynamic from "next/dynamic";

/**
 * Yükleyicinin ziyaretçiye inmemesi için ince kabuk.
 *
 * `GalleryUploader` doğrudan import edilseydi, kürator olmayan her ziyaretçi
 * de o JS'i indirirdi: `{isAdmin ? <Uploader/> : null}` çizimi engeller ama
 * paketten çıkarmaz. `next/dynamic` + `ssr: false` ile parça yalnızca kutu
 * gerçekten çizilince çekiliyor.
 *
 * Aynı desen anime sayfasındaki küratör araçlarında da var
 * (`AnimeDetail.tsx`, "ziyaretçi bu JS'i almaz" notu).
 *
 * `next/dynamic`in `ssr: false` seçeneği sunucu bileşeninde kullanılamıyor —
 * bu dosyanın var olma sebebi o: karakter dosyası sunucu bileşeni.
 */
const GalleryUploader = dynamic(
  () => import("./GalleryUploader").then((mod) => mod.GalleryUploader),
  { ssr: false },
);

export function CuratorGallerySlot() {
  return <GalleryUploader />;
}
