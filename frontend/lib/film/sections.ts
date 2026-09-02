import { filmHref } from "@/lib/film/routes";
/**
 * Film salonunun bölümleri.
 *
 * Kapının arkası tek bir sayfa değil, bir salon girişi: buradaki her kayıt
 * lobide bir kapı olur. Yeni başlık eklemek = bu listeye bir satır + o yolda
 * bir sayfa. Başka hiçbir yeri değiştirmek gerekmez.
 */
export interface FilmSection {
  slug: string;
  /** `film.sections.<key>.title` / `.desc` çeviri anahtarları */
  key: string;
  href: string;
}

export const FILM_SECTIONS: FilmSection[] = [
  {
    slug: "arsiv",
    key: "archive",
    href: filmHref.archive(),
  },
];
