import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Yuji_Boku, Cinzel, Lora } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { THEMES, DEFAULT_THEME, THEME_COOKIE, type Theme } from "@/lib/theme";
import "../../styles/globals.css";

// Logo'daki 黒 (kuro) için fırça kaligrafisi. Font unicode-range dilimli
// self-host edilir; tarayıcı yalnızca bu karakteri içeren dilimi indirir.
const brushFont = Yuji_Boku({
  weight: "400",
  variable: "--font-brush",
  display: "swap",
  preload: false,
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lora",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: "KuroNexus",
      template: "%s | KuroNexus",
    },
    description: t("description"),
  };
}

import { GlobalAmbientPlayer } from "@/components/story/GlobalAmbientPlayer";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Tema cookie'si SSR'da okunur ve <html>'e ilk boyamadan önce yazılır —
  // FOUC/tema flash'ı yok (AGENTS.md kural 16).
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE)?.value;
  const theme: Theme = THEMES.includes(cookieTheme as Theme)
    ? (cookieTheme as Theme)
    : DEFAULT_THEME;

  return (
    <html lang={locale} data-theme={theme} className={`${brushFont.variable} ${cinzel.variable} ${lora.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SiteHeader initialTheme={theme} />
          <main>{children}</main>
          <SiteFooter />
          <GlobalAmbientPlayer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
