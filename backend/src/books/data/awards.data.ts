/**
 * Edebiyat ödülleri — **kod içi küratörlü liste** (kullanıcı kararı, Faz B).
 *
 * Neden kodda: Google Books de Open Library de "bu kitap Hugo aldı mı"
 * sorusuna cevap vermiyor. Ödül listesi bir veri kaynağından çekilemediği
 * için elle derleniyor; dış kaynak yalnızca **kapak ve kimlik** için
 * kullanılıyor (bkz. `awards.service.ts`).
 *
 * Kayıt biçimi bilinçli olarak yalın: yıl + orijinal ad + yazar. Kapak,
 * sayfa sayısı, ISBN gibi her şey Google eşleşmesinden geliyor, burada
 * tutulmuyor — aynı künyeyi iki yerde tutmak `BookEntry` tarafında da
 * kaçınılan şey.
 *
 * `titleTr` bir **arama ipucudur, ekranda gösterilmez.** Elle derlendi ve
 * doğrulanamıyor: 112 Türkçe ad Google'a karşı denendiğinde 61'i "böyle bir
 * baskı yok" döndü, oysa bunların çoğu ("İngiliz Hasta", "Küçük Şeylerin
 * Tanrısı", "Bay Mercedes") gerçekten yayımlanmış çeviriler — Google Türkçe
 * baskıların çoğunu hiç indekslemiyor. Yani buradaki adların doğruluğu
 * ölçülemiyor, o yüzden künye gibi davranmıyorlar.
 *
 * Nerede kullanılıyor: (1) orijinal adla eşleşme bulunamazsa **yedek sorgu**,
 * (2) arşiv eşleştirmesinde ikinci bir ad anahtarı. İkisinde de yanlış olması
 * zararsız — yalnızca o denemenin boşa gitmesi demek. Ekranda görünen Türkçe
 * ad ise eşleşen gerçek cildin adıdır (bkz. `awards.service.ts` → `toCard`).
 *
 * ---
 * **KAPSAM — her ödülde farklı, bilerek.** Listeler elle derlendiği için
 * her ödülde yalnızca doğruluğundan emin olunan aralık var. Eksik yıl
 * eklemek serbest ve güvenli: servis listeyi olduğu gibi okuyor, boşluk
 * hata üretmiyor. Aşağıdaki `coverage` alanı arayüzde de gösteriliyor ki
 * okuyan "1974 nerede?" diye aramasın.
 */

/** Ödül kitaba mı yazara mı veriliyor — Nobel yüzünden gerekli ayrım. */
export type AwardGrantedTo = 'BOOK' | 'AUTHOR';

export interface AwardWinner {
  year: number;
  /** Orijinal ad; Google eşleşmesinde `titleTr` yoksa bu kullanılır */
  title: string;
  author: string;
  /** Türkçe baskının adı — yalnızca çevirisi çıkmışlarda dolu */
  titleTr?: string;
  /**
   * Aynı yıl birden fazla kazanan olabilir (Booker 1992/2019, Hugo 1993/2010,
   * Pulitzer 2023). Bunlar ayrı kayıt olarak duruyor, `shared` ile eşleniyor.
   */
  shared?: boolean;
  /** Nobel yazara verilir; okurun arayacağı temsilci eser */
  notableWork?: string;
}

export interface AwardDefinition {
  key: string;
  /** Türkçe tam ad — arayüzde başlık */
  name: string;
  /** Dar ekranda ve rozette kullanılan kısa ad */
  shortName: string;
  grantedTo: AwardGrantedTo;
  /** Listenin hangi yılları kapsadığı; arayüzde dipnot olarak gösteriliyor */
  coverage: string;
  /** Ödülün ne olduğu — sayfada bir cümlelik tanıtım */
  blurb: string;
  winners: AwardWinner[];
}

/** Nobel: kazanan yazar, kitap değil. `notableWork` okurun kapısı. */
const NOBEL: AwardDefinition = {
  key: 'nobel',
  name: 'Nobel Edebiyat Ödülü',
  shortName: 'Nobel',
  grantedTo: 'AUTHOR',
  coverage: '1990–2024',
  blurb:
    'İsveç Akademisi tarafından bir yazarın tüm eserlerine verilir; tek bir kitaba değil.',
  winners: [
    {
      year: 2024,
      title: 'Han Kang',
      author: 'Han Kang',
      notableWork: 'The Vegetarian',
      titleTr: 'Vejetaryen',
    },
    {
      year: 2023,
      title: 'Jon Fosse',
      author: 'Jon Fosse',
      notableWork: 'Septology',
    },
    {
      year: 2022,
      title: 'Annie Ernaux',
      author: 'Annie Ernaux',
      notableWork: 'The Years',
      titleTr: 'Seneler',
    },
    {
      year: 2021,
      title: 'Abdulrazak Gurnah',
      author: 'Abdulrazak Gurnah',
      notableWork: 'Paradise',
      titleTr: 'Cennet',
    },
    {
      year: 2020,
      title: 'Louise Glück',
      author: 'Louise Glück',
      notableWork: 'The Wild Iris',
    },
    {
      year: 2019,
      title: 'Peter Handke',
      author: 'Peter Handke',
      notableWork: 'The Goalie’s Anxiety at the Penalty Kick',
    },
    {
      year: 2018,
      title: 'Olga Tokarczuk',
      author: 'Olga Tokarczuk',
      notableWork: 'Flights',
      titleTr: 'Koşucular',
    },
    {
      year: 2017,
      title: 'Kazuo Ishiguro',
      author: 'Kazuo Ishiguro',
      notableWork: 'The Remains of the Day',
      titleTr: 'Günden Kalanlar',
    },
    {
      year: 2016,
      title: 'Bob Dylan',
      author: 'Bob Dylan',
      notableWork: 'Chronicles: Volume One',
    },
    {
      year: 2015,
      title: 'Svetlana Aleksiyeviç',
      author: 'Svetlana Alexievich',
      notableWork: 'Secondhand Time',
      titleTr: 'İkinci El Zaman',
    },
    {
      year: 2014,
      title: 'Patrick Modiano',
      author: 'Patrick Modiano',
      notableWork: 'Missing Person',
      titleTr: 'Karanlık Dükkânların Sokağı',
    },
    {
      year: 2013,
      title: 'Alice Munro',
      author: 'Alice Munro',
      notableWork: 'Dear Life',
      titleTr: 'Sevgili Hayat',
    },
    {
      year: 2012,
      title: 'Mo Yan',
      author: 'Mo Yan',
      notableWork: 'Red Sorghum',
      titleTr: 'Kızıl Darı Tarlaları',
    },
    {
      year: 2011,
      title: 'Tomas Tranströmer',
      author: 'Tomas Tranströmer',
      notableWork: 'The Great Enigma',
    },
    {
      year: 2010,
      title: 'Mario Vargas Llosa',
      author: 'Mario Vargas Llosa',
      notableWork: 'The Feast of the Goat',
      titleTr: 'Teke Şenliği',
    },
    {
      year: 2009,
      title: 'Herta Müller',
      author: 'Herta Müller',
      notableWork: 'The Hunger Angel',
      titleTr: 'Açlık Meleği',
    },
    {
      year: 2008,
      title: 'J.M.G. Le Clézio',
      author: 'J. M. G. Le Clézio',
      notableWork: 'Desert',
      titleTr: 'Çöl',
    },
    {
      year: 2007,
      title: 'Doris Lessing',
      author: 'Doris Lessing',
      notableWork: 'The Golden Notebook',
      titleTr: 'Altın Defter',
    },
    {
      year: 2006,
      title: 'Orhan Pamuk',
      author: 'Orhan Pamuk',
      notableWork: 'My Name Is Red',
      titleTr: 'Benim Adım Kırmızı',
    },
    {
      year: 2005,
      title: 'Harold Pinter',
      author: 'Harold Pinter',
      notableWork: 'The Birthday Party',
    },
    {
      year: 2004,
      title: 'Elfriede Jelinek',
      author: 'Elfriede Jelinek',
      notableWork: 'The Piano Teacher',
      titleTr: 'Piyanist',
    },
    {
      year: 2003,
      title: 'J.M. Coetzee',
      author: 'J. M. Coetzee',
      notableWork: 'Disgrace',
      titleTr: 'Utanç',
    },
    {
      year: 2002,
      title: 'Imre Kertész',
      author: 'Imre Kertész',
      notableWork: 'Fatelessness',
      titleTr: 'Kadersizlik',
    },
    {
      year: 2001,
      title: 'V.S. Naipaul',
      author: 'V. S. Naipaul',
      notableWork: 'A House for Mr Biswas',
    },
    {
      year: 2000,
      title: 'Gao Xingjian',
      author: 'Gao Xingjian',
      notableWork: 'Soul Mountain',
      titleTr: 'Ruh Dağı',
    },
    {
      year: 1999,
      title: 'Günter Grass',
      author: 'Günter Grass',
      notableWork: 'The Tin Drum',
      titleTr: 'Teneke Trampet',
    },
    {
      year: 1998,
      title: 'José Saramago',
      author: 'José Saramago',
      notableWork: 'Blindness',
      titleTr: 'Körlük',
    },
    {
      year: 1997,
      title: 'Dario Fo',
      author: 'Dario Fo',
      notableWork: 'Accidental Death of an Anarchist',
    },
    {
      year: 1996,
      title: 'Wisława Szymborska',
      author: 'Wisława Szymborska',
      notableWork: 'View with a Grain of Sand',
    },
    {
      year: 1995,
      title: 'Seamus Heaney',
      author: 'Seamus Heaney',
      notableWork: 'Death of a Naturalist',
    },
    {
      year: 1994,
      title: 'Kenzaburō Ōe',
      author: 'Kenzaburō Ōe',
      notableWork: 'A Personal Matter',
      titleTr: 'Kişisel Bir Sorun',
    },
    {
      year: 1993,
      title: 'Toni Morrison',
      author: 'Toni Morrison',
      notableWork: 'Beloved',
      titleTr: 'Sevilen',
    },
    {
      year: 1992,
      title: 'Derek Walcott',
      author: 'Derek Walcott',
      notableWork: 'Omeros',
    },
    {
      year: 1991,
      title: 'Nadine Gordimer',
      author: 'Nadine Gordimer',
      notableWork: "Burger's Daughter",
    },
    {
      year: 1990,
      title: 'Octavio Paz',
      author: 'Octavio Paz',
      notableWork: 'The Labyrinth of Solitude',
      titleTr: 'Yalnızlık Dolambacı',
    },
  ],
};

const PULITZER: AwardDefinition = {
  key: 'pulitzer',
  name: 'Pulitzer Kurgu Ödülü',
  shortName: 'Pulitzer',
  grantedTo: 'BOOK',
  coverage: '1990–2024 (2012’de ödül verilmedi)',
  blurb:
    'Amerikan edebiyatında bir yazarın Amerikan yaşamını ele alan kurgu eserine verilir.',
  winners: [
    { year: 2024, title: 'Night Watch', author: 'Jayne Anne Phillips' },
    {
      year: 2023,
      title: 'Demon Copperhead',
      author: 'Barbara Kingsolver',
      shared: true,
    },
    {
      year: 2023,
      title: 'Trust',
      author: 'Hernan Diaz',
      shared: true,
      titleTr: 'Güven',
    },
    { year: 2022, title: 'The Netanyahus', author: 'Joshua Cohen' },
    { year: 2021, title: 'The Night Watchman', author: 'Louise Erdrich' },
    {
      year: 2020,
      title: 'The Nickel Boys',
      author: 'Colson Whitehead',
      titleTr: 'Nickel Çocukları',
    },
    {
      year: 2019,
      title: 'The Overstory',
      author: 'Richard Powers',
      titleTr: 'Ağaçlar Ülkesi',
    },
    { year: 2018, title: 'Less', author: 'Andrew Sean Greer' },
    {
      year: 2017,
      title: 'The Underground Railroad',
      author: 'Colson Whitehead',
      titleTr: 'Yeraltı Demiryolu',
    },
    {
      year: 2016,
      title: 'The Sympathizer',
      author: 'Viet Thanh Nguyen',
      titleTr: 'Çifte Ajan',
    },
    {
      year: 2015,
      title: 'All the Light We Cannot See',
      author: 'Anthony Doerr',
      titleTr: 'Göremediğimiz Bütün Işıklar',
    },
    {
      year: 2014,
      title: 'The Goldfinch',
      author: 'Donna Tartt',
      titleTr: 'Saka Kuşu',
    },
    { year: 2013, title: "The Orphan Master's Son", author: 'Adam Johnson' },
    {
      year: 2011,
      title: 'A Visit from the Goon Squad',
      author: 'Jennifer Egan',
    },
    { year: 2010, title: 'Tinkers', author: 'Paul Harding' },
    {
      year: 2009,
      title: 'Olive Kitteridge',
      author: 'Elizabeth Strout',
      titleTr: 'Olive Kitteridge',
    },
    {
      year: 2008,
      title: 'The Brief Wondrous Life of Oscar Wao',
      author: 'Junot Díaz',
      titleTr: 'Oscar Wao’nun Tuhaf Kısa Yaşamı',
    },
    {
      year: 2007,
      title: 'The Road',
      author: 'Cormac McCarthy',
      titleTr: 'Yol',
    },
    { year: 2006, title: 'March', author: 'Geraldine Brooks' },
    {
      year: 2005,
      title: 'Gilead',
      author: 'Marilynne Robinson',
      titleTr: 'Gilead',
    },
    { year: 2004, title: 'The Known World', author: 'Edward P. Jones' },
    {
      year: 2003,
      title: 'Middlesex',
      author: 'Jeffrey Eugenides',
      titleTr: 'Middlesex',
    },
    { year: 2002, title: 'Empire Falls', author: 'Richard Russo' },
    {
      year: 2001,
      title: 'The Amazing Adventures of Kavalier & Clay',
      author: 'Michael Chabon',
    },
    {
      year: 2000,
      title: 'Interpreter of Maladies',
      author: 'Jhumpa Lahiri',
      titleTr: 'Dert Yorumcusu',
    },
    {
      year: 1999,
      title: 'The Hours',
      author: 'Michael Cunningham',
      titleTr: 'Saatler',
    },
    {
      year: 1998,
      title: 'American Pastoral',
      author: 'Philip Roth',
      titleTr: 'Amerikan Pastoral',
    },
    { year: 1997, title: 'Martin Dressler', author: 'Steven Millhauser' },
    { year: 1996, title: 'Independence Day', author: 'Richard Ford' },
    { year: 1995, title: 'The Stone Diaries', author: 'Carol Shields' },
    { year: 1994, title: 'The Shipping News', author: 'E. Annie Proulx' },
    {
      year: 1993,
      title: 'A Good Scent from a Strange Mountain',
      author: 'Robert Olen Butler',
    },
    { year: 1992, title: 'A Thousand Acres', author: 'Jane Smiley' },
    { year: 1991, title: 'Rabbit at Rest', author: 'John Updike' },
    {
      year: 1990,
      title: 'The Mambo Kings Play Songs of Love',
      author: 'Oscar Hijuelos',
    },
  ],
};

/**
 * Hugo: 1990–2024 tam, artı listenin sonunda **dönüm noktası klasikler**.
 * Klasikleri katmanın sebebi kitaba özgü: bir kitap arşivinde Dune'un Hugo
 * aldığını göstermemek, ödül rafını okurun aradığı yerde boş bırakıyor.
 */
const HUGO: AwardDefinition = {
  key: 'hugo',
  name: 'Hugo Ödülü · En İyi Roman',
  shortName: 'Hugo',
  grantedTo: 'BOOK',
  coverage: '1990–2024 tam, ayrıca seçilmiş klasikler',
  blurb:
    'Dünya Bilimkurgu Kongresi katılımcılarının oylarıyla verilir; türün okur ödülü.',
  winners: [
    { year: 2024, title: 'Some Desperate Glory', author: 'Emily Tesh' },
    { year: 2023, title: 'Nettle & Bone', author: 'T. Kingfisher' },
    {
      year: 2022,
      title: 'A Desolation Called Peace',
      author: 'Arkady Martine',
    },
    {
      year: 2021,
      title: 'Network Effect',
      author: 'Martha Wells',
      titleTr: 'Ağ Etkisi',
    },
    { year: 2020, title: 'A Memory Called Empire', author: 'Arkady Martine' },
    {
      year: 2019,
      title: 'The Calculating Stars',
      author: 'Mary Robinette Kowal',
    },
    {
      year: 2018,
      title: 'The Stone Sky',
      author: 'N. K. Jemisin',
      titleTr: 'Taş Gökyüzü',
    },
    {
      year: 2017,
      title: 'The Obelisk Gate',
      author: 'N. K. Jemisin',
      titleTr: 'Dikilitaş Kapısı',
    },
    {
      year: 2016,
      title: 'The Fifth Season',
      author: 'N. K. Jemisin',
      titleTr: 'Beşinci Mevsim',
    },
    {
      year: 2015,
      title: 'The Three-Body Problem',
      author: 'Cixin Liu',
      titleTr: 'Üç Cisim Problemi',
    },
    {
      year: 2014,
      title: 'Ancillary Justice',
      author: 'Ann Leckie',
      titleTr: 'Yardımcı Adalet',
    },
    { year: 2013, title: 'Redshirts', author: 'John Scalzi' },
    { year: 2012, title: 'Among Others', author: 'Jo Walton' },
    { year: 2011, title: 'Blackout / All Clear', author: 'Connie Willis' },
    {
      year: 2010,
      title: 'The Windup Girl',
      author: 'Paolo Bacigalupi',
      shared: true,
      titleTr: 'Kurmalı Kız',
    },
    {
      year: 2010,
      title: 'The City & The City',
      author: 'China Miéville',
      shared: true,
      titleTr: 'Şehir ve Şehir',
    },
    {
      year: 2009,
      title: 'The Graveyard Book',
      author: 'Neil Gaiman',
      titleTr: 'Mezarlık Kitabı',
    },
    {
      year: 2008,
      title: "The Yiddish Policemen's Union",
      author: 'Michael Chabon',
      titleTr: 'Yidiş Polisler Birliği',
    },
    { year: 2007, title: 'Rainbows End', author: 'Vernor Vinge' },
    { year: 2006, title: 'Spin', author: 'Robert Charles Wilson' },
    {
      year: 2005,
      title: 'Jonathan Strange & Mr Norrell',
      author: 'Susanna Clarke',
      titleTr: 'Jonathan Strange ve Bay Norrell',
    },
    { year: 2004, title: 'Paladin of Souls', author: 'Lois McMaster Bujold' },
    { year: 2003, title: 'Hominids', author: 'Robert J. Sawyer' },
    {
      year: 2002,
      title: 'American Gods',
      author: 'Neil Gaiman',
      titleTr: 'Amerikan Tanrıları',
    },
    {
      year: 2001,
      title: 'Harry Potter and the Goblet of Fire',
      author: 'J. K. Rowling',
      titleTr: 'Harry Potter ve Ateş Kadehi',
    },
    { year: 2000, title: 'A Deepness in the Sky', author: 'Vernor Vinge' },
    { year: 1999, title: 'To Say Nothing of the Dog', author: 'Connie Willis' },
    { year: 1998, title: 'Forever Peace', author: 'Joe Haldeman' },
    {
      year: 1997,
      title: 'Blue Mars',
      author: 'Kim Stanley Robinson',
      titleTr: 'Mavi Mars',
    },
    {
      year: 1996,
      title: 'The Diamond Age',
      author: 'Neal Stephenson',
      titleTr: 'Elmas Çağı',
    },
    { year: 1995, title: 'Mirror Dance', author: 'Lois McMaster Bujold' },
    {
      year: 1994,
      title: 'Green Mars',
      author: 'Kim Stanley Robinson',
      titleTr: 'Yeşil Mars',
    },
    {
      year: 1993,
      title: 'A Fire Upon the Deep',
      author: 'Vernor Vinge',
      shared: true,
    },
    {
      year: 1993,
      title: 'Doomsday Book',
      author: 'Connie Willis',
      shared: true,
      titleTr: 'Kıyamet Kitabı',
    },
    { year: 1992, title: 'Barrayar', author: 'Lois McMaster Bujold' },
    { year: 1991, title: 'The Vor Game', author: 'Lois McMaster Bujold' },
    {
      year: 1990,
      title: 'Hyperion',
      author: 'Dan Simmons',
      titleTr: 'Hyperion',
    },
    // --- Dönüm noktası klasikler ---
    {
      year: 1975,
      title: 'The Dispossessed',
      author: 'Ursula K. Le Guin',
      titleTr: 'Mülksüzler',
    },
    {
      year: 1970,
      title: 'The Left Hand of Darkness',
      author: 'Ursula K. Le Guin',
      titleTr: 'Karanlığın Sol Eli',
    },
    { year: 1966, title: 'Dune', author: 'Frank Herbert', titleTr: 'Dune' },
    {
      year: 1962,
      title: 'Stranger in a Strange Land',
      author: 'Robert A. Heinlein',
      titleTr: 'Yabancı Bir Diyarda Yabancı',
    },
    {
      year: 1961,
      title: 'A Canticle for Leibowitz',
      author: 'Walter M. Miller Jr.',
      titleTr: 'Leibowitz İçin Bir İlahi',
    },
    {
      year: 1953,
      title: 'The Demolished Man',
      author: 'Alfred Bester',
      titleTr: 'Yıkılan Adam',
    },
  ],
};

const NEBULA: AwardDefinition = {
  key: 'nebula',
  name: 'Nebula Ödülü · En İyi Roman',
  shortName: 'Nebula',
  grantedTo: 'BOOK',
  coverage: '1995–2024',
  blurb:
    'Amerikan Bilimkurgu ve Fantezi Yazarları Derneği üyelerinin oylarıyla verilir; yazarların ödülü.',
  winners: [
    {
      year: 2024,
      title: 'The Saint of Bright Doors',
      author: 'Vajra Chandrasekera',
    },
    { year: 2023, title: 'Babel', author: 'R. F. Kuang', titleTr: 'Babil' },
    { year: 2022, title: 'A Master of Djinn', author: 'P. Djèlí Clark' },
    {
      year: 2021,
      title: 'Network Effect',
      author: 'Martha Wells',
      titleTr: 'Ağ Etkisi',
    },
    { year: 2020, title: 'A Song for a New Day', author: 'Sarah Pinsker' },
    {
      year: 2019,
      title: 'The Calculating Stars',
      author: 'Mary Robinette Kowal',
    },
    {
      year: 2018,
      title: 'The Stone Sky',
      author: 'N. K. Jemisin',
      titleTr: 'Taş Gökyüzü',
    },
    {
      year: 2017,
      title: 'All the Birds in the Sky',
      author: 'Charlie Jane Anders',
    },
    {
      year: 2016,
      title: 'Uprooted',
      author: 'Naomi Novik',
      titleTr: 'Kökünden Sökülmüş',
    },
    {
      year: 2015,
      title: 'Annihilation',
      author: 'Jeff VanderMeer',
      titleTr: 'Yok Oluş',
    },
    {
      year: 2014,
      title: 'Ancillary Justice',
      author: 'Ann Leckie',
      titleTr: 'Yardımcı Adalet',
    },
    { year: 2013, title: '2312', author: 'Kim Stanley Robinson' },
    { year: 2012, title: 'Among Others', author: 'Jo Walton' },
    { year: 2011, title: 'Blackout / All Clear', author: 'Connie Willis' },
    {
      year: 2010,
      title: 'The Windup Girl',
      author: 'Paolo Bacigalupi',
      titleTr: 'Kurmalı Kız',
    },
    {
      year: 2009,
      title: 'Powers',
      author: 'Ursula K. Le Guin',
      titleTr: 'Güçler',
    },
    {
      year: 2008,
      title: "The Yiddish Policemen's Union",
      author: 'Michael Chabon',
      titleTr: 'Yidiş Polisler Birliği',
    },
    { year: 2007, title: 'Seeker', author: 'Jack McDevitt' },
    { year: 2006, title: 'Camouflage', author: 'Joe Haldeman' },
    { year: 2005, title: 'Paladin of Souls', author: 'Lois McMaster Bujold' },
    {
      year: 2004,
      title: 'The Speed of Dark',
      author: 'Elizabeth Moon',
      titleTr: 'Karanlığın Hızı',
    },
    {
      year: 2003,
      title: 'American Gods',
      author: 'Neil Gaiman',
      titleTr: 'Amerikan Tanrıları',
    },
    { year: 2002, title: 'The Quantum Rose', author: 'Catherine Asaro' },
    { year: 2001, title: "Darwin's Radio", author: 'Greg Bear' },
    {
      year: 2000,
      title: 'Parable of the Talents',
      author: 'Octavia E. Butler',
      titleTr: 'Yetenekler Meseli',
    },
    { year: 1999, title: 'Forever Peace', author: 'Joe Haldeman' },
    { year: 1998, title: 'The Moon and the Sun', author: 'Vonda N. McIntyre' },
    { year: 1997, title: 'Slow River', author: 'Nicola Griffith' },
    {
      year: 1996,
      title: 'The Terminal Experiment',
      author: 'Robert J. Sawyer',
    },
    { year: 1995, title: 'Moving Mars', author: 'Greg Bear' },
  ],
};

const BOOKER: AwardDefinition = {
  key: 'booker',
  name: 'Booker Ödülü',
  shortName: 'Booker',
  grantedTo: 'BOOK',
  coverage: '1990–2024',
  blurb:
    'İngilizce yazılmış ve Birleşik Krallık ya da İrlanda’da yayımlanmış en iyi romana verilir.',
  winners: [
    {
      year: 2024,
      title: 'Orbital',
      author: 'Samantha Harvey',
      titleTr: 'Yörünge',
    },
    { year: 2023, title: 'Prophet Song', author: 'Paul Lynch' },
    {
      year: 2022,
      title: 'The Seven Moons of Maali Almeida',
      author: 'Shehan Karunatilaka',
    },
    {
      year: 2021,
      title: 'The Promise',
      author: 'Damon Galgut',
      titleTr: 'Vaat',
    },
    {
      year: 2020,
      title: 'Shuggie Bain',
      author: 'Douglas Stuart',
      titleTr: 'Shuggie Bain',
    },
    {
      year: 2019,
      title: 'The Testaments',
      author: 'Margaret Atwood',
      shared: true,
      titleTr: 'Vasiyetler',
    },
    {
      year: 2019,
      title: 'Girl, Woman, Other',
      author: 'Bernardine Evaristo',
      shared: true,
      titleTr: 'Kız, Kadın, Öteki',
    },
    { year: 2018, title: 'Milkman', author: 'Anna Burns', titleTr: 'Sütçü' },
    {
      year: 2017,
      title: 'Lincoln in the Bardo',
      author: 'George Saunders',
      titleTr: 'Lincoln Bardo’da',
    },
    { year: 2016, title: 'The Sellout', author: 'Paul Beatty' },
    {
      year: 2015,
      title: 'A Brief History of Seven Killings',
      author: 'Marlon James',
    },
    {
      year: 2014,
      title: 'The Narrow Road to the Deep North',
      author: 'Richard Flanagan',
      titleTr: 'Kuzeye Giden Dar Yol',
    },
    {
      year: 2013,
      title: 'The Luminaries',
      author: 'Eleanor Catton',
      titleTr: 'Işıklar',
    },
    {
      year: 2012,
      title: 'Bring Up the Bodies',
      author: 'Hilary Mantel',
      titleTr: 'Cesetleri Çıkarın',
    },
    {
      year: 2011,
      title: 'The Sense of an Ending',
      author: 'Julian Barnes',
      titleTr: 'Bir Son Duygusu',
    },
    { year: 2010, title: 'The Finkler Question', author: 'Howard Jacobson' },
    {
      year: 2009,
      title: 'Wolf Hall',
      author: 'Hilary Mantel',
      titleTr: 'Kurt Kapanı',
    },
    {
      year: 2008,
      title: 'The White Tiger',
      author: 'Aravind Adiga',
      titleTr: 'Beyaz Kaplan',
    },
    { year: 2007, title: 'The Gathering', author: 'Anne Enright' },
    {
      year: 2006,
      title: 'The Inheritance of Loss',
      author: 'Kiran Desai',
      titleTr: 'Kayıp Mirası',
    },
    { year: 2005, title: 'The Sea', author: 'John Banville', titleTr: 'Deniz' },
    { year: 2004, title: 'The Line of Beauty', author: 'Alan Hollinghurst' },
    { year: 2003, title: 'Vernon God Little', author: 'DBC Pierre' },
    {
      year: 2002,
      title: 'Life of Pi',
      author: 'Yann Martel',
      titleTr: 'Pi’nin Yaşamı',
    },
    {
      year: 2001,
      title: 'True History of the Kelly Gang',
      author: 'Peter Carey',
    },
    {
      year: 2000,
      title: 'The Blind Assassin',
      author: 'Margaret Atwood',
      titleTr: 'Kör Suikastçı',
    },
    {
      year: 1999,
      title: 'Disgrace',
      author: 'J. M. Coetzee',
      titleTr: 'Utanç',
    },
    {
      year: 1998,
      title: 'Amsterdam',
      author: 'Ian McEwan',
      titleTr: 'Amsterdam',
    },
    {
      year: 1997,
      title: 'The God of Small Things',
      author: 'Arundhati Roy',
      titleTr: 'Küçük Şeylerin Tanrısı',
    },
    { year: 1996, title: 'Last Orders', author: 'Graham Swift' },
    { year: 1995, title: 'The Ghost Road', author: 'Pat Barker' },
    { year: 1994, title: 'How Late It Was, How Late', author: 'James Kelman' },
    { year: 1993, title: 'Paddy Clarke Ha Ha Ha', author: 'Roddy Doyle' },
    {
      year: 1992,
      title: 'The English Patient',
      author: 'Michael Ondaatje',
      shared: true,
      titleTr: 'İngiliz Hasta',
    },
    {
      year: 1992,
      title: 'Sacred Hunger',
      author: 'Barry Unsworth',
      shared: true,
    },
    {
      year: 1991,
      title: 'The Famished Road',
      author: 'Ben Okri',
      titleTr: 'Aç Yol',
    },
    {
      year: 1990,
      title: 'Possession',
      author: 'A. S. Byatt',
      titleTr: 'Sahip Olmak',
    },
  ],
};

/**
 * Tür ödülleri. Bunlarda kapsam bilerek **daha dar**: elle derlenen listede
 * emin olunmayan yıl bırakmaktansa aralığı kısa tutmak yeğleniyor. Eksik yıl
 * eklemek serbest — servis boşluğa takılmıyor.
 */
const WORLD_FANTASY: AwardDefinition = {
  key: 'world-fantasy',
  name: 'World Fantasy Ödülü · En İyi Roman',
  shortName: 'World Fantasy',
  grantedTo: 'BOOK',
  coverage: '2005–2023',
  blurb:
    'Fantastik edebiyatın jüri ödülü; tür içinde edebi ağırlığıyla anılır.',
  winners: [
    {
      year: 2023,
      title: 'The Spear Cuts Through Water',
      author: 'Simon Jimenez',
    },
    { year: 2022, title: 'The Jasmine Throne', author: 'Tasha Suri' },
    { year: 2021, title: 'Trouble the Saints', author: 'Alaya Dawn Johnson' },
    { year: 2020, title: 'Queen of the Conquered', author: 'Kacen Callender' },
    { year: 2019, title: 'Witchmark', author: 'C. L. Polk' },
    { year: 2018, title: 'The Changeling', author: 'Victor LaValle' },
    {
      year: 2017,
      title: 'The Sudden Appearance of Hope',
      author: 'Claire North',
    },
    { year: 2016, title: 'The Chimes', author: 'Anna Smaill' },
    {
      year: 2015,
      title: 'The Bone Clocks',
      author: 'David Mitchell',
      titleTr: 'Kemik Saatler',
    },
    { year: 2014, title: 'A Stranger in Olondria', author: 'Sofia Samatar' },
    { year: 2013, title: 'Alif the Unseen', author: 'G. Willow Wilson' },
    { year: 2012, title: 'Osama', author: 'Lavie Tidhar' },
    {
      year: 2011,
      title: 'Who Fears Death',
      author: 'Nnedi Okorafor',
      titleTr: 'Ölümden Kim Korkar',
    },
    {
      year: 2010,
      title: 'The City & The City',
      author: 'China Miéville',
      titleTr: 'Şehir ve Şehir',
    },
    { year: 2009, title: 'The Shadow Year', author: 'Jeffrey Ford' },
    { year: 2008, title: 'Ysabel', author: 'Guy Gavriel Kay' },
    { year: 2007, title: 'Soldier of Sidon', author: 'Gene Wolfe' },
    {
      year: 2006,
      title: 'Kafka on the Shore',
      author: 'Haruki Murakami',
      titleTr: 'Sahilde Kafka',
    },
    {
      year: 2005,
      title: 'Jonathan Strange & Mr Norrell',
      author: 'Susanna Clarke',
      titleTr: 'Jonathan Strange ve Bay Norrell',
    },
  ],
};

const LOCUS_SF: AwardDefinition = {
  key: 'locus-sf',
  name: 'Locus Ödülü · En İyi Bilimkurgu Romanı',
  shortName: 'Locus BK',
  grantedTo: 'BOOK',
  coverage: '2010–2024',
  blurb:
    'Locus dergisi okurlarının oylarıyla verilir; türün en geniş katılımlı oylaması.',
  winners: [
    { year: 2024, title: 'Translation State', author: 'Ann Leckie' },
    {
      year: 2023,
      title: 'The Kaiju Preservation Society',
      author: 'John Scalzi',
    },
    {
      year: 2022,
      title: 'A Desolation Called Peace',
      author: 'Arkady Martine',
    },
    {
      year: 2021,
      title: 'Network Effect',
      author: 'Martha Wells',
      titleTr: 'Ağ Etkisi',
    },
    {
      year: 2020,
      title: 'The City in the Middle of the Night',
      author: 'Charlie Jane Anders',
    },
    {
      year: 2019,
      title: 'The Calculating Stars',
      author: 'Mary Robinette Kowal',
    },
    { year: 2018, title: 'The Collapsing Empire', author: 'John Scalzi' },
    {
      year: 2017,
      title: 'Death’s End',
      author: 'Cixin Liu',
      titleTr: 'Ölümsüz Ölüm',
    },
    {
      year: 2016,
      title: 'Ancillary Mercy',
      author: 'Ann Leckie',
      titleTr: 'Yardımcı Merhamet',
    },
    {
      year: 2015,
      title: 'Ancillary Sword',
      author: 'Ann Leckie',
      titleTr: 'Yardımcı Kılıç',
    },
    {
      year: 2014,
      title: 'Abaddon’s Gate',
      author: 'James S. A. Corey',
      titleTr: 'Abaddon’un Kapısı',
    },
    { year: 2013, title: 'Redshirts', author: 'John Scalzi' },
    {
      year: 2012,
      title: 'Embassytown',
      author: 'China Miéville',
      titleTr: 'Elçilik Şehri',
    },
    { year: 2011, title: 'The Dervish House', author: 'Ian McDonald' },
    { year: 2010, title: 'Boneshaker', author: 'Cherie Priest' },
  ],
};

const BRAM_STOKER: AwardDefinition = {
  key: 'bram-stoker',
  name: 'Bram Stoker Ödülü · En İyi Roman',
  shortName: 'Bram Stoker',
  grantedTo: 'BOOK',
  coverage: '2014–2023',
  blurb:
    'Amerikan Korku Yazarları Derneği’nin ödülü; korku edebiyatının başlıca nişanı.',
  winners: [
    { year: 2023, title: 'Black Sheep', author: 'Rachel Harrison' },
    { year: 2022, title: 'The Spite House', author: 'Johnny Compton' },
    {
      year: 2021,
      title: 'My Heart Is a Chainsaw',
      author: 'Stephen Graham Jones',
    },
    {
      year: 2020,
      title: 'The Only Good Indians',
      author: 'Stephen Graham Jones',
    },
    { year: 2019, title: 'The Toll', author: 'Cherie Priest' },
    {
      year: 2018,
      title: 'The Cabin at the End of the World',
      author: 'Paul Tremblay',
      titleTr: 'Dünyanın Sonundaki Kulübe',
    },
    { year: 2017, title: 'Ararat', author: 'Christopher Golden' },
    { year: 2016, title: 'The Fisherman', author: 'John Langan' },
    {
      year: 2015,
      title: 'A Head Full of Ghosts',
      author: 'Paul Tremblay',
      titleTr: 'Hayaletlerle Dolu Bir Kafa',
    },
    { year: 2014, title: 'Blood Kin', author: 'Steve Rasnic Tem' },
  ],
};

const EDGAR: AwardDefinition = {
  key: 'edgar',
  name: 'Edgar Ödülü · En İyi Roman',
  shortName: 'Edgar',
  grantedTo: 'BOOK',
  coverage: '2015–2024',
  blurb:
    'Amerikan Polisiye Yazarları’nın ödülü; Edgar Allan Poe’nun adını taşır.',
  winners: [
    { year: 2024, title: 'Flags on the Bayou', author: 'James Lee Burke' },
    { year: 2023, title: 'Secret Identity', author: 'Alex Segura' },
    { year: 2022, title: 'Five Decembers', author: 'James Kestrel' },
    {
      year: 2021,
      title: 'Djinn Patrol on the Purple Line',
      author: 'Deepa Anappara',
    },
    { year: 2020, title: 'The Stranger Diaries', author: 'Elly Griffiths' },
    {
      year: 2019,
      title: 'Down the River unto the Sea',
      author: 'Walter Mosley',
    },
    { year: 2018, title: 'Bluebird, Bluebird', author: 'Attica Locke' },
    {
      year: 2017,
      title: 'Before the Fall',
      author: 'Noah Hawley',
      titleTr: 'Düşüşten Önce',
    },
    { year: 2016, title: 'Let Me Die in His Footsteps', author: 'Lori Roy' },
    {
      year: 2015,
      title: 'Mr. Mercedes',
      author: 'Stephen King',
      titleTr: 'Bay Mercedes',
    },
  ],
};

export const AWARDS: AwardDefinition[] = [
  NOBEL,
  PULITZER,
  BOOKER,
  HUGO,
  NEBULA,
  WORLD_FANTASY,
  LOCUS_SF,
  BRAM_STOKER,
  EDGAR,
];

export function findAward(key: string): AwardDefinition | undefined {
  return AWARDS.find((award) => award.key === key);
}
