import type { ArchiveBook } from "@/lib/api/types";

/**
 * Kitap türlerinin **sabit listesi** ve eşleştirmesi.
 *
 * Neden sabit liste: süzgeç önce yalnızca arşivden türetiliyordu ve arşivde
 * tür yoksa hiç çizilmiyordu — canlıdaki iki kitabın da `genres` alanı boş
 * olduğu için kullanıcı tür süzgecini hiç göremiyordu. Ödül listelerinde
 * verilen kararın aynısı: kaynak veremiyorsa liste kodda durur.
 *
 * Neden takma adlı eşleşme: `BookEntry.genres` serbest metin ve ilk değeri
 * Google dolduruyor — oradan BISAC etiketleri geliyor ("Fiction / Science
 * Fiction / General", "Biography & Autobiography"). Küratör ise Türkçe
 * yazıyor ("Bilimkurgu"). Birebir metin karşılaştırması ikisini ayrı tür
 * sanardı; bu yüzden her tür bir **anahtar kelime kümesi** taşıyor ve
 * kitabın etiketi bu kelimelerden birini içeriyorsa o türe girer.
 *
 * Süzgeç artık tür ADIYLA değil **anahtarıyla** çalışıyor (`scifi` gibi):
 * görünen ad çeviri dosyasından geliyor, İngilizce arayüzde de doğru okunuyor.
 */

export interface BookGenre {
  key: string;
  /**
   * Küçük harfe indirgenmiş anahtar kelimeler. **Kelime sınırıyla** aranır:
   * düz alt dize araması "bilim"i "bilimkurgu" içinde, "din"i "aydınlanma"
   * içinde buluyordu.
   */
  match: string[];
  /**
   * Bu ifadelerden biri geçiyorsa tür sayılmaz. Kelime sınırı iç içe geçen
   * türleri çözmüyor: "science" ifadesi "science fiction" içinde de tam
   * kelime olarak duruyor, o yüzden bilimkurgu kitapları "Bilim" sayılıyordu.
   */
  not?: string[];
}

/**
 * Sıra ekranda göründüğü sıra: önce anlatı türleri, sonra kurgu dışı.
 * Yeni tür eklemek serbest — çeviri anahtarı `book.genreName.<key>`.
 */
export const BOOK_GENRES: BookGenre[] = [
  {
    key: "novel",
    match: ["roman", "literary", "fiction / general", "general fiction"],
    // "Çizgi Roman" da "roman" içeriyor; o kendi türüne gitsin
    not: ["çizgi roman", "grafik roman"],
  },
  { key: "scifi", match: ["bilimkurgu", "bilim kurgu", "science fiction", "sci-fi"] },
  { key: "fantasy", match: ["fantastik", "fantezi", "fantasy"] },
  { key: "horror", match: ["korku", "horror", "gotik", "gothic"] },
  { key: "crime", match: ["polisiye", "gerilim", "cinayet", "crime", "thriller", "suspense", "mystery", "detective"] },
  { key: "dystopia", match: ["distopya", "dystopia", "utopia", "ütopya"] },
  { key: "classic", match: ["klasik", "classic"] },
  { key: "turkish", match: ["türk edebiyat", "turkish literature"] },
  { key: "poetry", match: ["şiir", "poetry", "poems"] },
  { key: "drama", match: ["tiyatro", "oyun", "drama", "plays"] },
  { key: "graphic", match: ["çizgi roman", "grafik roman", "comics", "graphic novel", "manga"] },
  { key: "children", match: ["çocuk", "gençlik", "juvenile", "young adult", "children"] },
  { key: "history", match: ["tarih", "history", "historical"] },
  { key: "biography", match: ["biyografi", "anı", "otobiyografi", "biography", "autobiography", "memoir"] },
  { key: "philosophy", match: ["felsefe", "philosophy"] },
  { key: "psychology", match: ["psikoloji", "psychology", "self-help", "kişisel gelişim"] },
  {
    key: "science",
    match: ["bilim", "science", "mathematics", "matematik", "medical", "tıp"],
    // Bilimkurgu bir edebiyat türü, popüler bilim değil
    not: ["bilimkurgu", "bilim kurgu", "science fiction", "sci-fi"],
  },
  { key: "essay", match: ["deneme", "essay", "criticism", "eleştiri"] },
  { key: "religion", match: ["din", "mitoloji", "religion", "mythology"] },
  { key: "travel", match: ["gezi", "seyahat", "travel"] },
];

/** Karşılaştırma için sadeleştirme: büyük/küçük harf ve noktalama elenir. */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}/-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * **Kelime başı** araması: ifade bir sözcüğün başında geçmeli, sonuna ek
 * gelebilir.
 *
 * Neden tam kelime değil: Türkçe eklemeli. Tam kelime arandığında "Klasikler"
 * → `klasik`, "Tarihi Roman" → `tarih`, "Türk Edebiyatı" → `türk edebiyat`
 * eşleşmelerinin hepsi düşüyordu (ölçümde Türk Edebiyatı sayacının sıfırlandığı
 * görüldü). Neden düz alt dize de değil: o zaman "din" ifadesi "aydınlanma"nın
 * ortasında bulunuyor.
 *
 * `\b` kullanılmıyor — JavaScript'te yalnızca ASCII harf sayar, "şiir"/"tıp"
 * gibi sözcüklerin kenarını yanlış bulur.
 */
function startsWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}`, "u").test(haystack);
}

/**
 * Kitabın girdiği tür anahtarları. Bir kitap birden fazla türe girebilir:
 * "Fiction / Science Fiction" hem `novel` hem `scifi` sayılır ve ikisinde de
 * listelenir — kitaplarda tür zaten iç içe.
 */
export function genreKeysOf(book: ArchiveBook): string[] {
  if (book.genres.length === 0) {
    return [];
  }
  const haystack = book.genres.map(normalize).join(" | ");
  return BOOK_GENRES.filter(
    (genre) =>
      genre.match.some((word) => startsWord(haystack, word)) &&
      !(genre.not ?? []).some((word) => startsWord(haystack, word)),
  ).map((genre) => genre.key);
}

/** Süzgeç eşleşmesi: seçilenlerden **herhangi biri** tutuyorsa kitap geçer. */
export function matchesGenreKeys(
  book: ArchiveBook,
  selected: string[],
): boolean {
  if (selected.length === 0) {
    return true;
  }
  const keys = genreKeysOf(book);
  return selected.some((key) => keys.includes(key));
}

/**
 * Her türün arşivdeki kitap sayısı. Sayısı sıfır olan tür de listede kalır:
 * liste arşivden değil koddan geliyor, "bu arşivde henüz polisiye yok"
 * bilgisi de bir cevaptır ve tür sözlüğünü sabit tutar.
 */
export function genreCounts(books: ArchiveBook[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const genre of BOOK_GENRES) {
    counts.set(genre.key, 0);
  }
  for (const book of books) {
    for (const key of genreKeysOf(book)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
