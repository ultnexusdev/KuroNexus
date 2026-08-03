import {
  confirmMatch,
  orderCandidates,
  pickBest,
  remoteCovers,
} from './awards.service';
import type { BookSource } from './google-books.service';
import type { BinKitapDetail, BinKitapEdition } from './bin-kitap.service';
import { AWARDS } from './data/awards.data';
import type { AwardWinner } from './data/awards.data';

/**
 * Ödül rafının doğruluğu üç saf işleve bağlı: `pickBest` (Google bacağı),
 * `orderCandidates` ve `confirmMatch` (1000Kitap bacağı). Yanlış cilt
 * seçilirse raf sessizce saçmalar — "Dune" yerine "Dreamer of Dune" çizilir
 * ve kimse fark etmez. Bu yüzden burada ağ YOK, sabit örneklerle sınanıyor.
 */

function source(partial: Partial<BookSource>): BookSource {
  return {
    googleId: 'x',
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
    provider: 'GOOGLE',
    popularity: 0,
    ...partial,
  };
}

const winner = (partial: Partial<AwardWinner>): AwardWinner => ({
  year: 1966,
  title: 'Dune',
  author: 'Frank Herbert',
  ...partial,
});

describe('pickBest', () => {
  it('yazarı tutmayan kaydı eler', () => {
    const results = [
      source({ googleId: 'a', title: 'Dune', authors: ['Harold Bloom'] }),
    ];
    expect(pickBest(results, winner({}), 'Dune')).toBeNull();
  });

  it('aynı yazarın başka kitabını seçmez', () => {
    const results = [
      source({
        googleId: 'a',
        title: 'Dreamer of Dune',
        authors: ['Brian Herbert'],
      }),
      source({
        googleId: 'b',
        title: 'Children of Dune',
        authors: ['Frank Herbert'],
      }),
    ];
    // "Children of Dune" adı "Dune"u içeriyor; ama asıl eşleşme tam ad
    const best = pickBest(results, winner({}), 'Dune');
    expect(best?.googleId).toBe('b');
  });

  it('kapaklı cildi kapaksıza tercih eder', () => {
    const results = [
      source({
        googleId: 'kapaksiz',
        title: 'Dune',
        authors: ['Frank Herbert'],
      }),
      source({
        googleId: 'kapakli',
        title: 'Dune',
        authors: ['Frank Herbert'],
        coverImage: 'https://ornek/kapak.jpg',
      }),
    ];
    expect(pickBest(results, winner({}), 'Dune')?.googleId).toBe('kapakli');
  });

  it('kapak eşitse Türkçe baskıyı öne alır', () => {
    const cover = 'https://ornek/kapak.jpg';
    const results = [
      source({
        googleId: 'en',
        title: 'Dune',
        authors: ['Frank Herbert'],
        coverImage: cover,
      }),
      source({
        googleId: 'tr',
        title: 'Dune',
        authors: ['Frank Herbert'],
        coverImage: cover,
        language: 'tr',
      }),
    ];
    expect(pickBest(results, winner({}), 'Dune')?.googleId).toBe('tr');
  });

  it('Türkçe ad üzerinden de eşleşir', () => {
    const results = [
      source({
        googleId: 'tr',
        title: 'Karanlığın Sol Eli',
        authors: ['Ursula K. Le Guin'],
        language: 'tr',
      }),
    ];
    const target = winner({
      title: 'The Left Hand of Darkness',
      titleTr: 'Karanlığın Sol Eli',
      author: 'Ursula K. Le Guin',
    });
    expect(
      pickBest(results, target, 'The Left Hand of Darkness')?.googleId,
    ).toBe('tr');
  });

  it('yazar adı farklı yazımla gelse de tutar', () => {
    const results = [
      source({
        googleId: 'a',
        title: 'Disgrace',
        // Listede "J. M. Coetzee", Google'da "J.M. Coetzee" olabiliyor
        authors: ['J.M. Coetzee'],
      }),
    ];
    const target = winner({
      title: 'Disgrace',
      author: 'J. M. Coetzee',
      year: 1999,
    });
    expect(pickBest(results, target, 'Disgrace')?.googleId).toBe('a');
  });

  it('sonuç yoksa null döner', () => {
    expect(pickBest([], winner({}), 'Dune')).toBeNull();
  });
});

/** `BinKitapDetail` iskeleti — yalnızca eşleştirmenin okuduğu alanlar dolu. */
function detail(
  partial: Partial<BookSource>,
  editions: BinKitapEdition[] = [],
): BinKitapDetail {
  return {
    source: source({ provider: 'BINKITAP', googleId: null, ...partial }),
    translator: null,
    credits: { people: [], genres: [], publisher: null, series: null },
    raw: {
      slug: partial.binKitapSlug ?? 'slug',
      binKitapId: null,
      editor: null,
      format: null,
      country: null,
      originalCountry: null,
      originalLanguage: null,
      printedOn: null,
      estimatedReadingTime: null,
      otherEditionCount: editions.length,
      editions,
      genres: [],
      fetchedAt: '2026-08-01T00:00:00.000Z',
    },
  };
}

describe('orderCandidates', () => {
  it('yazarı tutmayan kaydı hiç listeye almaz', () => {
    const results = [source({ title: 'Dune', authors: ['Harold Bloom'] })];
    expect(orderCandidates(results, winner({}), 'Dune')).toHaveLength(0);
  });

  it('adı birebir tutan kaydı okunma sayısı düşük olsa da öne alır', () => {
    // "Dune Mesihi" gevşek eşleşmede "Dune"u içeriyor ve o serinin en çok
    // okunan cildi olabiliyor; tam eşitlik her zaman önce gelmeli
    const results = [
      source({
        binKitapSlug: 'baska',
        title: 'Dune Mesihi',
        authors: ['Frank Herbert'],
        popularity: 9000,
      }),
      source({
        binKitapSlug: 'dogru',
        title: 'Dune',
        authors: ['Frank Herbert'],
        popularity: 10,
      }),
    ];
    expect(orderCandidates(results, winner({}), 'Dune')[0].binKitapSlug).toBe(
      'dogru',
    );
  });

  it('adı tutmayan adayı elemez, sona koyar', () => {
    // "Septology" araması "The Other Name" döndürüyor: doğru kitap olduğu
    // ancak künye açılınca anlaşılıyor, o yüzden aday listede kalmalı
    const results = [
      source({ title: 'The Other Name', authors: ['Jon Fosse'] }),
    ];
    const fosse = winner({ title: 'Jon Fosse', author: 'Jon Fosse' });
    expect(orderCandidates(results, fosse, 'Septology')).toHaveLength(1);
  });

  it('ad tutmuyorsa okunma sayısına göre sıralar', () => {
    const results = [
      source({
        binKitapSlug: 'az',
        title: 'A',
        authors: ['Jon Fosse'],
        popularity: 5,
      }),
      source({
        binKitapSlug: 'cok',
        title: 'B',
        authors: ['Jon Fosse'],
        popularity: 500,
      }),
    ];
    const fosse = winner({ title: 'Jon Fosse', author: 'Jon Fosse' });
    expect(orderCandidates(results, fosse, 'Septology')[0].binKitapSlug).toBe(
      'cok',
    );
  });
});

describe('confirmMatch', () => {
  const fosse = winner({ title: 'Jon Fosse', author: 'Jon Fosse' });

  it('alt başlıktan doğrular — adı bambaşka olan baskıyı kurtarır', () => {
    // Canlıda ölçülen hâl: adı "The Other Name", alt başlığı "Septology I-II"
    const found = detail({
      title: 'The Other Name',
      subtitle: 'Septology I-II',
      authors: ['Jon Fosse'],
      language: 'en',
    });
    expect(confirmMatch(found, fosse, 'Septology')).toBe(true);
  });

  it('diğer baskıların adından doğrular', () => {
    // Türkçe baskının adı ve alt başlığı orijinaliyle hiç örtüşmüyor;
    // bağ ancak İngilizce baskının adı üzerinden kuruluyor
    const found = detail(
      {
        title: 'Öteki İsim',
        subtitle: 'Septoloji I-II',
        authors: ['Jon Fosse'],
        language: 'tr',
      },
      [
        {
          slug: 'the-other-name--406406',
          title: 'The Other Name',
          subtitle: 'Septology I-II',
          language: 'en',
          publisher: 'Fitzcarraldo Editions',
          isMain: false,
        },
      ],
    );
    expect(confirmMatch(found, fosse, 'Septology')).toBe(true);
  });

  it('aynı yazarın alakasız kitabını reddeder', () => {
    const found = detail({
      title: 'Sabahtan Akşama',
      authors: ['Jon Fosse'],
      language: 'tr',
    });
    expect(confirmMatch(found, fosse, 'Septology')).toBe(false);
  });

  it('yazarı tutmayan künyeyi adı tutsa da reddeder', () => {
    const found = detail({
      title: 'Septology',
      authors: ['Karl Ove Knausgård'],
    });
    expect(confirmMatch(found, fosse, 'Septology')).toBe(false);
  });

  it('seri adı kitabın adıyla aynıysa serinin başka cildini kabul etmez', () => {
    // Canlı ölçümde yakalandı: "Wolf Hall" (Booker 2009) aynı üçlemenin
    // ikinci cildi "Bring Up the Bodies"e eşleşiyordu — o cildin seri adı
    // "Wolf Hall". Iska bile bu yanlış eşleşmeden iyidir.
    const target = winner({
      year: 2009,
      title: 'Wolf Hall',
      titleTr: 'Kurt Kapanı',
      author: 'Hilary Mantel',
    });
    const found = detail({
      title: 'Bring Up The Bodies',
      seriesName: 'Wolf Hall',
      seriesIndex: 2,
      authors: ['Hilary Mantel'],
    });
    expect(confirmMatch(found, target, 'Wolf Hall')).toBe(false);
  });

  it('üç harfli adı her şeye tutturmaz', () => {
    // "It" ya da "Us" gibi adlar gevşek eşleşmede her başlığın içinde
    // bulunurdu; kısa anahtarda yalnızca tam eşitlik geçerli
    const target = winner({ title: 'Us', author: 'David Nicholls' });
    const found = detail({
      title: 'Bize Güzel Günler Lazım',
      authors: ['David Nicholls'],
    });
    expect(confirmMatch(found, target, 'Us')).toBe(false);
  });

  it('aksan farkını yazar adında katlar', () => {
    // Ölçümde ıska sebebi buydu: liste "Kenzaburō Ōe" yazıyor, kaynak
    // "Kenzaburo Oe". Katlanmasaydı kitap hiç eşleşmezdi.
    const target = winner({
      title: 'Kenzaburō Ōe',
      author: 'Kenzaburō Ōe',
      titleTr: 'Kişisel Bir Sorun',
    });
    const found = detail({
      title: 'Kişisel Bir Sorun',
      authors: ['Kenzaburo Oe'],
      language: 'tr',
    });
    expect(confirmMatch(found, target, 'A Personal Matter')).toBe(true);
  });

  it('ASCII dışı adlar boşa düşünce alakasız kitabı eşleştirmez', () => {
    // `slugify` Japonca/Kiril yazıyı tamamen eliyor; iki boş anahtar
    // "birebir aynı" sayılsaydı her ikisi de eşleşirdi
    const target = winner({ title: '雪国', author: 'Yasunari Kawabata' });
    const found = detail({
      title: '伊豆の踊子',
      authors: ['Yasunari Kawabata'],
    });
    expect(confirmMatch(found, target, '雪国')).toBe(false);
  });

  it('Türkçe ad üzerinden de doğrular', () => {
    const target = winner({
      title: 'Flights',
      titleTr: 'Koşucular',
      author: 'Olga Tokarczuk',
    });
    const found = detail({
      title: 'Koşucular',
      authors: ['Olga Tokarczuk'],
      language: 'tr',
    });
    expect(confirmMatch(found, target, 'Flights')).toBe(true);
  });
});

describe('ödül listesi', () => {
  it('her ödülün anahtarı benzersiz', () => {
    const keys = AWARDS.map((award) => award.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('Nobel yazara verilir ve her kaydında temsilci eser var', () => {
    const nobel = AWARDS.find((award) => award.key === 'nobel');
    expect(nobel?.grantedTo).toBe('AUTHOR');
    // notableWork olmadan Google'da yazar adı aranır ve kapak gelmez
    for (const laureate of nobel?.winners ?? []) {
      expect(laureate.notableWork).toBeTruthy();
    }
  });

  it('kitaba verilen ödüllerde aynı yıl+ad iki kez geçmez', () => {
    for (const award of AWARDS) {
      const seen = new Set<string>();
      for (const item of award.winners) {
        const key = `${item.year}|${item.title}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it('aynı yılda birden çok kazanan varsa hepsi shared işaretli', () => {
    for (const award of AWARDS) {
      const byYear = new Map<number, number>();
      for (const item of award.winners) {
        byYear.set(item.year, (byYear.get(item.year) ?? 0) + 1);
      }
      for (const item of award.winners) {
        if ((byYear.get(item.year) ?? 0) > 1) {
          expect(item.shared).toBe(true);
        }
      }
    }
  });
});

/**
 * Kapakların **kendi diskimizde** durması kullanıcı kararı ("hotlink yok").
 * Ödül rafı bunu geriye dönük de yapmak zorunda: cache'te 90 gün boyunca
 * kaynağın CDN adresiyle duran eşleşmeler var ve kullanıcı "kapaklar sayfa
 * yenilendikçe yükleniyor" diye bildirdi. `remoteCovers` o kuyruğu kuruyor —
 * yanlış süzerse ya iş hiç yapılmaz ya da her açılışta boşuna dönülür.
 */
describe('remoteCovers', () => {
  const match = (coverImage: string | null) => ({
    book: source({ coverImage }),
    authorSeo: null,
  });

  it('yalnızca dış adresli kapakları kuyruğa alır', () => {
    const queue = remoteCovers(
      new Map([
        ['a', match('https://1k-cdn.com/resimler/kitaplar/1_buyuk.jpg')],
        ['b', match('/uploads/books/abc.jpg')],
        ['c', match(null)],
      ]),
    );
    expect(queue.map((item) => item.cacheKey)).toEqual(['a']);
  });

  it('cache anahtarını taşır — güncellenecek satır o', () => {
    const queue = remoteCovers(
      new Map([['books:award:v2:dune|herbert', match('http://x/1.jpg')]]),
    );
    expect(queue[0]).toMatchObject({
      cacheKey: 'books:award:v2:dune|herbert',
      authorSeo: null,
    });
  });
});
