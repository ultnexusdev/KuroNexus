/**
 * Okuma sıraları — bir evreni "hangi kitaptan başlayıp nasıl devam etmeli"
 * sorusuna verilen cevap.
 *
 * **Liste kod içinde küratörlü**, ödül listeleriyle aynı gerekçeyle: bu bir
 * kişisel seçki, dış kaynaktan çekilemez ve çekilse de doğrulanamaz. Yeni bir
 * evren eklemek için buraya bir tanım yazmak yeterli — servis, sayfa ve
 * tablonun tamamı ortak (kullanıcı isteği: "benzer tabloyu diğer seri ya da
 * evrenlerde de kullanabilelim").
 *
 * **Adlar olduğu gibi duruyor, düzeltilmiyor.** Türkçe sütunundaki eğik
 * çizgiler aynı kitabın farklı yayınevlerince basılmış **ayrı adları**; hangi
 * baskının hangi ad olduğu tabloda yazmıyor ve tahmin edilmiyor (kural:
 * doğrulanmamış ad künye gibi davranmaz).
 */

/** Kitabın evrendeki yeri: hangi seri, o serinin kaçıncı cildi. */
export interface ReadingOrderPosition {
  /** "Vakıf Serisi", "Robot Serisi", "İmparatorluk Serisi", "Ara Kitap" */
  track: string;
  /** Seri içindeki cilt sırası; ara kitapta yok */
  index: number | null;
}

export interface ReadingOrderEntry {
  /** Okuma sırasındaki yeri — listedeki sıranın kendisi */
  order: number;
  /** Yayım yılı. Okuma sırasıyla kasten uyuşmuyor; ikisi ayrı eksen */
  year: number;
  position: ReadingOrderPosition;
  originalTitle: string;
  /**
   * Türkçe yayımlanmış ad(lar). Birden çoksa aynı kitabın farklı baskıları
   * demek — arayüz hepsini gösteriyor, birini seçmiyor.
   */
  titles: string[];
  /**
   * 1000Kitap sayfa anahtarı. **Her biri tek tek ölçüldü**, tahmin değil:
   * kaynakta arandı, yazarı doğrulandı ve dönen anahtar buraya yazıldı.
   *
   * İki işi var: (1) arşivde olmayan durak künye sayfasına gidebiliyor,
   * (2) arşiv eşleşmesinin **en kesin** adımı — ad üstünden eşleştirme
   * kırılgan (kaynak "Vakıf'ın Sınırı" yazarken liste "Vakfın Sınırı" diyor,
   * kesme işareti yüzünden anahtarlar tutmuyordu).
   *
   * Ölçülemeyen durakta `null` bırakılır; sayfa onsuz da çalışır.
   */
  sourceSlug: string | null;
}

export interface ReadingOrderDefinition {
  /** Adresin kendisi (`/kitap/okuma-sirasi/vakif`) */
  key: string;
  name: string;
  /** Sayfanın bir cümlelik tanıtımı */
  blurb: string;
  /**
   * Evrenin yazarı. `slug` kişi sayfasınınkiyle aynı: portre ve biyografi
   * oradan geliyor, buraya kopyalanmıyor — arşivde kaydı yoksa kaynaktan
   * çekiliyor (bkz. `BooksService.getPerson`).
   */
  author: { name: string; slug: string };
  /**
   * Sol raydaki notlar. **Yalnızca listenin kendisinden okunabilen şeyler**
   * yazılı: kitapların içeriği hakkında hiçbir iddia yok.
   */
  notes: string[];
  entries: ReadingOrderEntry[];
}

/** Seri adı ve cilt sırasını tek satırdan kurar — tablo böyle yazılmıştı. */
function at(track: string, index: number | null = null): ReadingOrderPosition {
  return { track, index };
}

const ARA = 'Ara Kitap';
const VAKIF = 'Vakıf Serisi';
const ROBOT = 'Robot Serisi';
const IMPARATORLUK = 'İmparatorluk Serisi';

const VAKIF_EVRENI: ReadingOrderDefinition = {
  key: 'vakif',
  name: 'Vakıf Evreni Okuma Sırası',
  blurb:
    'Vakıf, Robot ve İmparatorluk serileri tek bir evrende birleşiyor. Bu sıra ' +
    'yayım sırası değil: okurun evreni baştan sona takip edebilmesi için ' +
    'dizilmiş bir yol.',
  author: { name: 'Isaac Asimov', slug: 'isaac-asimov' },
  notes: [
    'Sıra yayım sırasıyla kasten uyuşmuyor. Liste 1955 tarihli bir kitapla ' +
      'başlıyor, serinin ilk cildi (1951) ikinci sırada geliyor ve son üç ' +
      'durak 1986–1993 arasında yazılmış kitaplar.',
    'Türkçe adlar sütununda eğik çizgiyle ayrılmış adlar aynı kitabın farklı ' +
      'yayınevlerince basılmış hâlleri. Hangi baskının hangi ad olduğu ' +
      'listede yazmıyor, o yüzden burada da bir tanesi seçilmiyor.',
    'Üç seri ve aralarına giren üç bağımsız kitap var; renk şeridi hangi ' +
      'durakta hangi seride olduğunu gösteriyor.',
  ],
  /**
   * Sıra tablodaki satır sırasının **birebir** aynısı. Yıla ya da seriye göre
   * yeniden dizilmiyor: okuma sırası zaten bu listenin kendisi.
   */
  entries: [
    {
      order: 1,
      year: 1955,
      position: at(ARA),
      originalTitle: 'The End of Eternity',
      titles: ['Sonsuzluğun Sonu', 'Evrenin Çanları'],
      sourceSlug: 'sonsuzlugun-sonu--35383',
    },
    {
      order: 2,
      year: 1951,
      position: at(VAKIF, 1),
      originalTitle: 'Foundation',
      titles: ['Vakıf', 'İmparatorluk'],
      sourceSlug: 'vakif--110835',
    },
    {
      order: 3,
      year: 1952,
      position: at(VAKIF, 2),
      originalTitle: 'Foundation and Empire / The Man Who Upset the Universe',
      titles: ['Vakıf ve İmparatorluk', 'Altın Galaksi'],
      sourceSlug: 'vakif-ve-imparatorluk--20570',
    },
    {
      order: 4,
      year: 1953,
      position: at(VAKIF, 3),
      originalTitle: 'Second Foundation',
      titles: ['İkinci Vakıf', 'Gizli Tanrılar'],
      sourceSlug: 'ikinci-vakif--22986',
    },
    {
      order: 5,
      year: 1982,
      position: at(VAKIF, 4),
      originalTitle: "Foundation's Edge",
      titles: ['Vakfın Sınırı', 'Galaksi Çöküyor'],
      sourceSlug: 'vakifin-siniri--272474',
    },
    {
      order: 6,
      year: 1950,
      position: at(ARA),
      originalTitle: 'I, Robot',
      titles: ['Ben, Robot', 'Ben Bir Robotum', 'Robotlar'],
      sourceSlug: 'ben-robot--24182',
    },
    {
      order: 7,
      year: 1989,
      position: at(ARA),
      originalTitle: 'Nemesis',
      titles: ['İntikam Tanrıçası'],
      sourceSlug: 'intikam-tanricasi--23072',
    },
    {
      order: 8,
      year: 1954,
      position: at(ROBOT, 1),
      originalTitle: 'The Caves of Steel',
      titles: ['Çelik Mağaralar', 'Ölü Gezegen'],
      sourceSlug: 'celik-magaralar--308685',
    },
    {
      order: 9,
      year: 1956,
      position: at(ROBOT, 2),
      originalTitle: 'The Naked Sun',
      titles: ['Güneşin Tanrıları', 'Çıplak Güneş'],
      sourceSlug: 'ciplak-gunes--314638',
    },
    {
      order: 10,
      year: 1983,
      position: at(ROBOT, 3),
      originalTitle: 'The Robots of Dawn',
      titles: ['Şafağın Robotları'],
      sourceSlug: 'safagin-robotlari--320434',
    },
    {
      order: 11,
      year: 1985,
      position: at(ROBOT, 4),
      originalTitle: 'Robots and Empire',
      titles: ['Kurtarıcı'],
      sourceSlug: 'kurtarici--21235',
    },
    {
      order: 12,
      year: 1951,
      position: at(IMPARATORLUK, 1),
      originalTitle: 'The Stars Like Dust / The Rebellious Stars',
      titles: ['Sonsuzun Tohumları', 'Asi Gezegen Tyrann'],
      sourceSlug: 'sonsuzun-tohumlari--193381',
    },
    {
      order: 13,
      year: 1952,
      position: at(IMPARATORLUK, 2),
      originalTitle: 'The Currents of Space',
      titles: ['Tanrılar ve İmparatorlar', 'Kainat Fatihi'],
      sourceSlug: 'tanrilar-ve-imparatorlar--20732',
    },
    {
      order: 14,
      year: 1950,
      position: at(IMPARATORLUK, 3),
      originalTitle: 'Pebble in the Sky',
      titles: ['Zamandan Kaçış', 'Uğursuz Gezegen Galactica'],
      sourceSlug: 'zamandan-kacis--86530',
    },
    {
      order: 15,
      year: 1986,
      position: at(VAKIF, 5),
      originalTitle: 'Foundation and Earth',
      titles: ['Vakıf ve Dünya'],
      sourceSlug: 'vakif-ve-dunya--280610',
    },
    {
      order: 16,
      year: 1988,
      position: at(VAKIF, 6),
      originalTitle: 'Prelude to Foundation',
      titles: ['Vakıf Kurulurken', 'İmparatorluk Kurulurken'],
      sourceSlug: 'vakif-kurulurken--17701',
    },
    {
      order: 17,
      year: 1993,
      position: at(VAKIF, 7),
      originalTitle: 'Forward the Foundation',
      titles: ['Vakıf İleri', 'Erişilmez İmparatorluk'],
      sourceSlug: 'vakif-ileri--22988',
    },
  ],
};

export const READING_ORDERS: ReadingOrderDefinition[] = [VAKIF_EVRENI];

export function findReadingOrder(
  key: string,
): ReadingOrderDefinition | undefined {
  return READING_ORDERS.find((order) => order.key === key);
}
