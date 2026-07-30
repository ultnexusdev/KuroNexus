/**
 * Dizi salonunun bölümleri — film salonundaki `lib/film/sections.ts` ile
 * aynı desen.
 */
export interface ShowSection {
  slug: string;
  /** `show.sections.<key>.title` / `.desc` çeviri anahtarları */
  key: string;
  href: string;
}

export const SHOW_SECTIONS: ShowSection[] = [
  {
    slug: "arsiv",
    key: "archive",
    href: "/dark-stories/category/dizi/arsiv",
  },
];
