import { matchGenreKeys } from './genres.data';

/**
 * Tür eşleştirmesi sessizce yanlış çalışırsa iki ayrı zarar veriyor: tutması
 * gereken tür süzgeçte görünmez, tutmaması gereken tür de onay beklemeden
 * içeri girer. Kullanıcı kararı gereği eşleşmeyen tür otomatik açılMAdığı
 * için buradaki boş sonuçlar da davranışın parçası.
 */
describe('matchGenreKeys', () => {
  it('1000Kitap türlerini sözlüğe bağlar', () => {
    expect(matchGenreKeys('Roman')).toEqual(['novel']);
    expect(matchGenreKeys('Tarih')).toEqual(['history']);
    expect(matchGenreKeys('Fantastik')).toEqual(['fantasy']);
    expect(matchGenreKeys('Bilimkurgu')).toEqual(['scifi']);
  });

  it('Türkçe eki olan adları da tanır', () => {
    // Kelime BAŞI araması; tam kelime aransaydı bunların hepsi düşerdi
    expect(matchGenreKeys('Klasikler')).toContain('classic');
    expect(matchGenreKeys('Türk Edebiyatı')).toContain('turkish');
    expect(matchGenreKeys('Dünya Klasikleri')).toContain('classic');
  });

  it('tek etiketi birden çok türe bağlayabilir', () => {
    // Ölçüldü: ikinci "fiction" ile " / general" birleşince novel de tutuyor.
    // İlk eşleşmede durulsaydı bu kitap bilimkurgu süzgecinde hiç görünmezdi.
    const keys = matchGenreKeys('Fiction / Science Fiction / General');
    expect(keys).toContain('scifi');
    expect(keys).toContain('novel');
  });

  it('iç içe geçen türleri ayırır', () => {
    // "science" ifadesi "science fiction" içinde de tam kelime olarak geçiyor
    expect(matchGenreKeys('Science Fiction')).toEqual(['scifi']);
    // "roman" ifadesi "çizgi roman" içinde de geçiyor ama o kendi türüne gider
    expect(matchGenreKeys('Çizgi Roman')).toEqual(['graphic']);
  });

  it('sözcük ortasındaki rastlantıyı tür saymaz', () => {
    // "din" ifadesi "aydınlanma"nın ortasında geçiyor
    expect(matchGenreKeys('Aydınlanma')).toEqual([]);
  });

  it('sözlükte karşılığı olmayan tür boş döner', () => {
    // Bunlar otomatik açılMAyacak, onay bekleyen tür olarak kaydedilecek
    expect(matchGenreKeys('Çok Satanlar')).toEqual([]);
    expect(matchGenreKeys('Yeni Çıkanlar')).toEqual([]);
  });
});
