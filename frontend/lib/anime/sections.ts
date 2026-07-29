/**
 * Anime salonunun bölümleri (film salonundaki desen).
 *
 * Kapının arkası tek sayfa değil, bir salon girişi: buradaki her kayıt lobide
 * bir kapı olur. Yeni başlık eklemek = bu listeye bir satır + o yolda bir sayfa.
 */
export interface AnimeSection {
  slug: string;
  /** `anime.sections.<key>.title` / `.desc` çeviri anahtarları */
  key: string;
  href: string;
}

export const ANIME_SECTIONS: AnimeSection[] = [
  {
    slug: "arsiv",
    key: "archive",
    href: "/dark-stories/category/anime/arsiv",
  },
];
