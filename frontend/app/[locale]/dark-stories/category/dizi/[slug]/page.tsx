import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getShowDetail } from "@/lib/api/shows";
import { ShowDetail } from "@/components/show/ShowDetail";

// Dizi sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik
// segmenti dinamik segmentten önce dener) — film salonundaki düzenin aynısı.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getShowDetail(slug);
  return detail ? { title: detail.show.title } : {};
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, isAdmin] = await Promise.all([
    getShowDetail(slug),
    readIsAdmin(),
  ]);
  if (!detail) {
    notFound();
  }

  return <ShowDetail detail={detail} isAdmin={isAdmin} />;
}
