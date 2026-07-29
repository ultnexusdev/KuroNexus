import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPulse } from "@/lib/api/pulse";
import { NexusHub } from "@/components/nexus/NexusHub";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  return { title: t("listTitle") };
}

export const dynamic = "force-dynamic";

export default async function DarkStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pulse = await getPulse();

  return <NexusHub pulse={pulse} locale={locale} />;
}
