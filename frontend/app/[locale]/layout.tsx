import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  Yuji_Boku,
  Cinzel,
  Lora,
  Bebas_Neue,
  Cormorant_Garamond,
  Corinthia,
  Noto_Sans_Old_Turkic,
} from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
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

// Spor kanadı: kondanse skor/numara yazısı (forma numaraları, F1 başlıkları)
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-bebas",
  display: "swap",
});

/*
 * Aşağıdaki üç font 5 Ağustos 2026'da `globals.css`teki `@import`tan buraya
 * taşındı. Eskiden doğrudan Google'dan çekiliyorlardı, yani **her ziyaretçinin
 * IP adresi Google'a gidiyordu**. Buradan self-host ediliyorlar: dış istek yok.
 */

// Gövde yazısı — kanatların çoğunda kullanılıyor (~30 CSS modülü).
// `fallback` eski `globals.css` tanımından korundu.
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Yalnızca hikâye metinlerinde, editörden seçilerek kullanılıyor →
// `preload: false`: ziyaretçilerin çoğu bu fontu hiç görmüyor.
const corinthia = Corinthia({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-corinthia",
  display: "swap",
  preload: false,
});

// Göktürk (Orhun) yazısı — nadir kullanılıyor, aynı gerekçeyle preload yok.
const orhun = Noto_Sans_Old_Turkic({
  weight: "400",
  subsets: ["old-turkic"],
  variable: "--font-orhun",
  display: "swap",
  preload: false,
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

  // Düzenleme kontrolleri sayfaların üstünde de görünüyor — bu karar tek
  // yerden okunuyor (lib/auth/session.ts, imza doğrulaması neden yok orada yazılı)
  const isAdmin = await readIsAdmin();

  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${brushFont.variable} ${cinzel.variable} ${lora.variable} ${bebas.variable} ${cormorant.variable} ${corinthia.variable} ${orhun.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          {/* Klavyeyle gelen biri her sayfada önce header ve footer
              bağlantılarını geçmek zorunda kalmasın. Yalnızca odaklanınca
              görünür (globals.css .skipLink). */}
          <a href="#icerik" className="skipLink">
            {t("skipToContent")}
          </a>
          <SiteHeader initialTheme={theme} isAdmin={isAdmin} />
          {/* tabIndex={-1}: atlama bağlantısı buraya odaklanabilsin —
              yoksa Safari/Firefox hedefe kaydırır ama odağı taşımaz */}
          <main id="icerik" tabIndex={-1}>
            {children}
          </main>
          <GlobalAmbientPlayer />
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
