/**
 * Tür sözlüğü ve kaynaktan gelen serbest metni bu sözlüğe bağlayan eşleştirme.
 *
 * **Neden sabit liste:** kaynaklar tür alanında serbest metin veriyor —
 * Google BISAC etiketleri ("Fiction / Science Fiction / General"), 1000Kitap
 * Türkçe adlar ("Dünya Klasikleri", "Fantastik Roman"). Bunlar doğrudan tür
 * kaydına çevrilseydi süzgeç birkaç ayda aynı kavramın onlarca varyantıyla
 * dolardı; kullanıcı kararı "eşleşmeyen tür otomatik AÇILMASIN, önerilsin".
 *
 * **Bilerek ön yüzdeki `frontend/lib/book/genres.ts` ile aynı liste.** İki
 * kopya iyi değil ama bu monorepoda paylaşılan paket yok; Faz 2b'de süzgeç
 * türleri API'den okumaya geçince ön yüzdeki kopya silinecek ve tek kaynak
 * burası kalacak.
 */

export interface BookGenreDefinition {
  key: string;
  /** Küçük harfe indirgenmiş anahtar kelimeler; kelime BAŞInda aranır */
  match: string[];
  /**
   * Bu ifadelerden biri geçiyorsa tür sayılmaz. İç içe geçen türleri ayırır:
   * "science" ifadesi "science fiction" içinde de geçiyor.
   */
  not?: string[];
}

export const BOOK_GENRES: BookGenreDefinition[] = [
  {
    key: 'novel',
    match: ['roman', 'literary', 'fiction / general', 'general fiction'],
    // "Çizgi Roman" da "roman" içeriyor; o kendi türüne gitsin
    not: ['çizgi roman', 'grafik roman'],
  },
  {
    key: 'scifi',
    match: ['bilimkurgu', 'bilim kurgu', 'science fiction', 'sci-fi'],
  },
  { key: 'fantasy', match: ['fantastik', 'fantezi', 'fantasy'] },
  { key: 'horror', match: ['korku', 'horror', 'gotik', 'gothic'] },
  {
    key: 'crime',
    match: [
      'polisiye',
      'gerilim',
      'cinayet',
      'crime',
      'thriller',
      'suspense',
      'mystery',
      'detective',
    ],
  },
  { key: 'dystopia', match: ['distopya', 'dystopia', 'utopia', 'ütopya'] },
  { key: 'classic', match: ['klasik', 'classic'] },
  { key: 'turkish', match: ['türk edebiyat', 'turkish literature'] },
  { key: 'poetry', match: ['şiir', 'poetry', 'poems'] },
  { key: 'drama', match: ['tiyatro', 'oyun', 'drama', 'plays'] },
  {
    key: 'graphic',
    match: ['çizgi roman', 'grafik roman', 'comics', 'graphic novel', 'manga'],
  },
  {
    key: 'children',
    match: ['çocuk', 'gençlik', 'juvenile', 'young adult', 'children'],
  },
  { key: 'history', match: ['tarih', 'history', 'historical'] },
  {
    key: 'biography',
    match: [
      'biyografi',
      'anı',
      'otobiyografi',
      'biography',
      'autobiography',
      'memoir',
    ],
  },
  { key: 'philosophy', match: ['felsefe', 'philosophy'] },
  {
    key: 'psychology',
    match: ['psikoloji', 'psychology', 'self-help', 'kişisel gelişim'],
  },
  {
    key: 'science',
    match: ['bilim', 'science', 'mathematics', 'matematik', 'medical', 'tıp'],
    // Bilimkurgu bir edebiyat türü, popüler bilim değil
    not: ['bilimkurgu', 'bilim kurgu', 'science fiction', 'sci-fi'],
  },
  { key: 'essay', match: ['deneme', 'essay', 'criticism', 'eleştiri'] },
  { key: 'religion', match: ['din', 'mitoloji', 'religion', 'mythology'] },
  { key: 'travel', match: ['gezi', 'seyahat', 'travel'] },
];

/** Karşılaştırma için sadeleştirme: büyük/küçük harf ve noktalama elenir. */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .replace(/[^\p{L}\p{N}/-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * **Kelime başı** araması: ifade bir sözcüğün başında geçmeli, sonuna ek
 * gelebilir.
 *
 * Neden tam kelime değil: Türkçe eklemeli. Tam kelime arandığında
 * "Klasikler" → `klasik`, "Tarihi Roman" → `tarih`, "Türk Edebiyatı" →
 * `türk edebiyat` eşleşmelerinin hepsi düşüyordu. Neden düz alt dize de
 * değil: o zaman "din" ifadesi "aydınlanma"nın ortasında bulunuyor.
 *
 * `\b` kullanılmıyor — JavaScript'te yalnızca ASCII harf sayar, "şiir"/"tıp"
 * gibi sözcüklerin kenarını yanlış bulur.
 */
function startsWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}`, 'u').test(haystack);
}

/**
 * Serbest metin bir tür adının düştüğü sözlük anahtarları.
 *
 * **Birden fazla anahtar dönebilir ve bu bilinçli.** Tek etiket birden çok
 * türe girebiliyor: Google'ın "Fiction / Science Fiction / General" etiketi
 * hem `novel` hem `scifi`; ilkinde durulsaydı bilimkurgu süzgeci o kitabı
 * hiç görmezdi. Ön yüzdeki `genreKeysOf` de aynı şekilde davranıyor —
 * kitaplarda tür zaten iç içe.
 *
 * Boş dizi dönerse sözlükte karşılığı yok demektir; çağıran onu **onay
 * bekleyen** tür olarak açar (kullanıcı kararı: otomatik tür üretilmesin).
 */
export function matchGenreKeys(name: string): string[] {
  const haystack = normalize(name);
  return BOOK_GENRES.filter(
    (genre) =>
      genre.match.some((word) => startsWord(haystack, word)) &&
      !(genre.not ?? []).some((word) => startsWord(haystack, word)),
  ).map((genre) => genre.key);
}
