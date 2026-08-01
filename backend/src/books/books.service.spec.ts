import { pickSeed } from './books.service';
import type { BookSource } from './google-books.service';
import type { CreateBookEntryDto } from './dto/create-book-entry.dto';

/**
 * Arşive **yanlış kitabın künyesi** yazılması sessiz ve kalıcı bir hata:
 * kapak, ISBN, arka kapak ve yazar hep birlikte başka bir kitaba ait olur ve
 * ancak kitap sayfası açılınca fark edilir. Kullanıcı tam olarak bunu yaşadı —
 * Open Library'den *Miras* (R. A. Salvatore) seçti, arşive *Kültürel Miras
 * Duyarlılığı…* girdi.
 *
 * Bu yüzden burada ağ YOK: seçimi yapan saf işlev sabit örneklerle sınanıyor.
 */

function source(partial: Partial<BookSource>): BookSource {
  return {
    googleId: null,
    olKey: null,
    binKitapSlug: null,
    isbn13: null,
    title: 'Başlık',
    subtitle: null,
    authors: [],
    publisher: null,
    publishedYear: null,
    firstPublishedYear: null,
    pageCount: null,
    language: 'en',
    coverImage: null,
    description: null,
    genres: [],
    seriesName: null,
    seriesIndex: null,
    originalTitle: null,
    provider: 'OPENLIBRARY',
    popularity: 0,
    ...partial,
  };
}

function dto(partial: Partial<CreateBookEntryDto>): CreateBookEntryDto {
  return { ...partial };
}

describe('pickSeed', () => {
  /** Kullanıcının bildirdiği hatanın kendisi. */
  it('adı tutan ama başka bir kitap olan kaydı SEÇMEZ', () => {
    const results = [
      source({
        title:
          'Kültürel Miras Duyarlılığı ve Somut Olmayan Kültürel Miras Tutumları',
        authors: ['Fatih Dursun', 'Cenk Murat Koçoğlu'],
        provider: 'BINKITAP',
        binKitapSlug: 'kulturel-miras--999',
      }),
    ];
    expect(
      pickSeed(results, dto({ title: 'Miras', author: 'R. A. Salvatore' })),
    ).toBeNull();
  });

  it('seçilen kaydı Open Library anahtarından bulur', () => {
    const wanted = source({
      olKey: '/works/OL27448W',
      title: 'Miras',
      authors: ['R. A. Salvatore'],
    });
    const results = [
      source({ title: 'Kültürel Miras', authors: ['Fatih Dursun'] }),
      wanted,
    ];
    expect(
      pickSeed(
        results,
        dto({
          olKey: '/works/OL27448W',
          title: 'Miras',
          author: 'R. A. Salvatore',
        }),
      ),
    ).toBe(wanted);
  });

  it('kimlik tutmuyorsa ad + yazar doğrulamasına düşer', () => {
    const wanted = source({ title: 'Miras', authors: ['R. A. Salvatore'] });
    expect(
      pickSeed([wanted], dto({ title: 'Miras', author: 'R. A. Salvatore' })),
    ).toBe(wanted);
  });

  /**
   * Ad **birebir** aranıyor. Gevşek eşleşme burada *Dune* yerine *Dune
   * Mesihi*'ni getirirdi — ödül eşleştirmesinde ölçülmüş tuzağın aynısı.
   */
  it('aynı yazarın adı benzeyen başka kitabını seçmez', () => {
    const results = [
      source({ title: 'Dune Mesihi', authors: ['Frank Herbert'] }),
    ];
    expect(
      pickSeed(results, dto({ title: 'Dune', author: 'Frank Herbert' })),
    ).toBeNull();
  });

  it('yazar bilinmiyorsa tahmin yürütmez', () => {
    const results = [source({ title: 'Miras', authors: ['Fatih Dursun'] })];
    expect(pickSeed(results, dto({ title: 'Miras' }))).toBeNull();
  });

  /**
   * `slugify` ASCII dışı yazıyı tamamen eliyor. Guard olmasaydı boş anahtar
   * `includes` ile her şeye tutar ve alakasız kayıt seçilirdi.
   */
  it('katlanınca boşalan adı her şeye eşleştirmez', () => {
    const results = [source({ title: '雪国', authors: ['川端康成'] })];
    expect(
      pickSeed(results, dto({ title: 'Miras', author: 'R. A. Salvatore' })),
    ).toBeNull();
  });

  it('yazar adının kısaltılmış hâlini kabul eder', () => {
    const wanted = source({ title: 'Miras', authors: ['R.A. Salvatore'] });
    expect(
      pickSeed([wanted], dto({ title: 'Miras', author: 'R.A. Salvatore' })),
    ).toBe(wanted);
  });
});
