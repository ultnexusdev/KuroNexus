import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPulse } from "@/lib/api/pulse";
import { readIsAdmin } from "@/lib/auth/session";
import { NexusHub } from "@/components/nexus/NexusHub";
import { shareCard } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  const title = t("listTitle");
  return {
    title,
    ...shareCard({ title, locale, path: "/dark-stories" }),
  };
}

export const dynamic = "force-dynamic";

export default async function DarkStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Küratör taze okur, ziyaretçi 300 sn önbellekten (gerekçe lib/api/pulse.ts)
  const pulse = await getPulse(await readIsAdmin());

  return <NexusHub pulse={pulse} locale={locale} />;
}
