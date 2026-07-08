import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // Varsayılan dil (tr) URL'de öneksiz: kuronexus.com → TR, kuronexus.com/en → EN
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
