/**
 * Anime salonunun bölümleri (film salonundaki desen).
 *
 * Kapının arkası tek sayfa değil, bir salon girişi: buradaki her kayıt lobide
 * bir kapı olur. Yeni başlık eklemek = bu listeye bir satır + o yolda bir sayfa.
 */
import { animeHref } from "./routes";

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
    href: animeHref.archive(),
  },
  {
    slug: "karakterler",
    key: "characters",
    href: animeHref.characters(),
  },
];
