import { pickBest } from './awards.service';
import type { BookSource } from './google-books.service';
import { AWARDS } from './data/awards.data';
import type { AwardWinner } from './data/awards.data';

/**
 * Ödül rafının doğruluğu tek bir saf işleve bağlı: `pickBest`. Yanlış cilt
 * seçilirse raf sessizce saçmalar — "Dune" yerine "Dreamer of Dune" çizilir
 * ve kimse fark etmez. Bu yüzden burada ağ YOK, sabit örneklerle sınanıyor.
 */

function source(partial: Partial<BookSource>): BookSource {
  return {
    googleId: 'x',
    olKey: null,
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
