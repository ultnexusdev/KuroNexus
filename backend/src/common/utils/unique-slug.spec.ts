import { buildUniqueSlug } from './unique-slug';

/** Verilen slug'lari "dolu" sayan bir varlik kontrolu uretir. */
function taken(...slugs: string[]) {
  const set = new Set(slugs);
  return (candidate: string) => Promise.resolve(set.has(candidate));
}

describe('buildUniqueSlug', () => {
  it('cakisma yoksa taban slugu doner', async () => {
    await expect(
      buildUniqueSlug('Kayip Sehir', 'story', taken()),
    ).resolves.toBe('kayip-sehir');
  });

  it('ilk cakismada sonek 2 - categories 1 ile basliyordu, hizalandi', async () => {
    await expect(
      buildUniqueSlug('Kayip Sehir', 'story', taken('kayip-sehir')),
    ).resolves.toBe('kayip-sehir-2');
  });

  it('ardisik cakismalarda sayac ilerler', async () => {
    await expect(
      buildUniqueSlug(
        'Kayip Sehir',
        'story',
        taken('kayip-sehir', 'kayip-sehir-2', 'kayip-sehir-3'),
      ),
    ).resolves.toBe('kayip-sehir-4');
  });

  it('slugify bos birakirsa YEDEK AD kullanilir - categories bos slug yaziyordu', async () => {
    await expect(buildUniqueSlug('...', 'category', taken())).resolves.toBe(
      'category',
    );
    await expect(
      buildUniqueSlug('!!!', 'category', taken('category')),
    ).resolves.toBe('category-2');
  });

  it('Turkce karakterler sadelesir', async () => {
    await expect(
      buildUniqueSlug('Gölgede Kalanlar', 'entry', taken()),
    ).resolves.toBe('golgede-kalanlar');
  });

  it('ust sinir asilirsa sonsuz donguye girmez', async () => {
    // Her adayi "dolu" diyen bir kontrol: eski `for(;;)` surumleri burada
    // sonsuza kadar donerdi.
    const result = await buildUniqueSlug('ad', 'fallback', () =>
      Promise.resolve(true),
    );
    expect(result).toMatch(/^ad-\d{10,}$/);
  });
});
