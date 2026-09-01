import { deriveArchiveSlug } from './archive-slug';

/**
 * Slug liste sırasından türetiliyor ve artık İKİ yol onu üretiyor:
 * `withSlugs` (tam arşiv okumaları) ve `getArchiveIndex` (ödül/okuma-sırası
 * rozetleri). İkisi ayrışırsa rozet yanlış kitaba bağlanır ve hiçbir yerde
 * hata görünmez — bu testler o kuralı sabitliyor.
 */
describe('deriveArchiveSlug', () => {
  function slugsFor(
    books: Array<{ title: string; firstPublishedYear: number | null }>,
  ): string[] {
    const used = new Set<string>();
    return books.map((book, index) =>
      deriveArchiveSlug(book.title, book.firstPublishedYear, index, used),
    );
  }

  it('cakisma yoksa dogrudan basliktan uretir', () => {
    expect(
      slugsFor([
        { title: 'Suc ve Ceza', firstPublishedYear: 1866 },
        { title: 'Beyaz Geceler', firstPublishedYear: 1848 },
      ]),
    ).toEqual(['suc-ve-ceza', 'beyaz-geceler']);
  });

  it('ayni baslik ikinci kez gelince yil eklenir', () => {
    expect(
      slugsFor([
        { title: 'Donusum', firstPublishedYear: 1915 },
        { title: 'Donusum', firstPublishedYear: 2011 },
      ]),
    ).toEqual(['donusum', 'donusum-2011']);
  });

  it('yil da cakisirsa sira numarasina duser', () => {
    expect(
      slugsFor([
        { title: 'Donusum', firstPublishedYear: 1915 },
        { title: 'Donusum', firstPublishedYear: 2011 },
        { title: 'Donusum', firstPublishedYear: 2011 },
      ]),
    ).toEqual(['donusum', 'donusum-2011', 'donusum-3']);
  });

  it('yil yoksa cakismada dogrudan sira numarasi kullanilir', () => {
    expect(
      slugsFor([
        { title: 'Adsiz', firstPublishedYear: null },
        { title: 'Adsiz', firstPublishedYear: null },
      ]),
    ).toEqual(['adsiz', 'adsiz-2']);
  });

  it('slugify bos birakirsa kitap-N yedegi devreye girer', () => {
    expect(slugsFor([{ title: '???', firstPublishedYear: null }])).toEqual([
      'kitap-1',
    ]);
  });

  it('Turkce karakterler sadelesir', () => {
    expect(
      slugsFor([{ title: 'Cocukluğum Şiiri', firstPublishedYear: null }]),
    ).toEqual(['cocuklugum-siiri']);
  });

  it('ayni girdi ayni sirayla her zaman ayni slug listesini verir', () => {
    const books = [
      { title: 'Kürk Mantolu Madonna', firstPublishedYear: 1943 },
      { title: 'Kuyucaklı Yusuf', firstPublishedYear: 1937 },
      { title: 'Kürk Mantolu Madonna', firstPublishedYear: 1998 },
    ];
    expect(slugsFor(books)).toEqual(slugsFor(books));
  });
});
