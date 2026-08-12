/**
 * Müzik tür taksonomisi — 17 ana tür (oda) ve alt türleri.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN KODDA, VERİTABANINDA DEĞİL
 *
 * Bu liste kullanıcının verdiği sabit taksonomi (13 Ağustos 2026). Elle 130+
 * kayıt açmak makul değildi; bir uç kuruyor ve tekrar çalıştırmak güvenli
 * (slug üzerinden upsert). Küratör yine de panelden yeni tür ekleyebilir —
 * bu liste bir başlangıç, kilit değil.
 *
 * ── NEDEN `prisma/seed.ts` DEĞİL, `src/` ALTINDA BİR UÇ ───────────────────
 * Önce seed'e konmuştu ve **yerelde çalıştı, üretimde çalışmadı**: konteynerde
 * `ts-node prisma/seed.ts` betiği ESM olarak ayrıştırıyor ve `./_client`
 * uzantısız içe aktarımı çözülemiyor (`ERR_MODULE_NOT_FOUND`, 13 Ağustos
 * canlı çıktısı). Kovalamak yerine projenin kendi deseni kullanıldı: rol
 * sözlüğü de aynı sebeple `POST /admin/music/roles/seed` ucundan kuruluyor
 * ("seed çalıştırmadan kurulmuş bir veritabanı için").
 *
 * Kazanç: tek kopya. Rol sözlüğü iki yerde duruyor (seed + servis) ve
 * ayrışma riski taşıyor; taksonomi yalnızca burada.
 *
 * ── RENK ──────────────────────────────────────────────────────────────────
 * `accentKey` yalnızca ANA türlerde tanımlı. Alt türler kendi renklerini
 * taşımıyor; seed onlara **üst türün anahtarını yazıyor** (kullanıcı kararı:
 * "alt türlere ayrıca renge gerek yok, ana türün rengini alsın").
 *
 * ⚠️ Bu bilinçli bir denormalizasyon. Alternatifi her okuma yolunda üst türe
 * bakmaktı — rozet, oda derisi, karışım çubuğu ve sol ray dört ayrı yerde
 * `accentKey` okuyor ve dördünü de değiştirmek gerekirdi. Bedeli: bir ana
 * türün rengi DEĞİŞİRSE çocukları eski renkte kalır. Bugün taksonomi sabit
 * olduğu için bedel ödenmiyor; renk değiştirme ihtiyacı doğarsa
 * `updateGenre` içinde çocuklara yayma eklenmeli.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface TaxonomyGenre {
  name: string;
  /** `globals.css` içindeki `[data-genre="…"]` anahtarı — renk DEĞİL */
  accentKey: string;
  children: string[];
}

export const MUSIC_TAXONOMY: TaxonomyGenre[] = [
  {
    name: 'Pop',
    accentKey: 'pop',
    children: [
      'Pop',
      'Synth-pop',
      'Electropop',
      'Dance-pop',
      'Indie Pop',
      'Dream Pop',
      'Art Pop',
      'K-Pop',
      'J-Pop',
    ],
  },
  {
    name: 'Rock',
    accentKey: 'rock',
    children: [
      'Classic Rock',
      'Alternative Rock',
      'Indie Rock',
      'Hard Rock',
      'Progressive Rock',
      'Psychedelic Rock',
      'Punk Rock',
      'Post-Rock',
      'Grunge',
      'Garage Rock',
    ],
  },
  {
    name: 'Metal',
    accentKey: 'metal',
    children: [
      'Heavy Metal',
      'Thrash Metal',
      'Death Metal',
      'Black Metal',
      'Doom Metal',
      'Power Metal',
      'Progressive Metal',
      'Folk Metal',
      'Symphonic Metal',
      'Metalcore',
    ],
  },
  {
    name: 'Hip-Hop',
    accentKey: 'hiphop',
    children: [
      'Hip-Hop',
      'Rap',
      'Boom Bap',
      'Trap',
      'Drill',
      'Gangsta Rap',
      'Alternative Hip-Hop',
      'Conscious Hip-Hop',
      'Experimental Hip-Hop',
    ],
  },
  {
    name: 'Electronic',
    accentKey: 'electronic',
    children: [
      'House',
      'Techno',
      'Trance',
      'Drum & Bass',
      'Dubstep',
      'Ambient',
      'IDM',
      'Breakbeat',
      'Electro',
      'Downtempo',
    ],
  },
  {
    name: 'R&B / Soul',
    accentKey: 'rnb',
    children: ['R&B', 'Contemporary R&B', 'Soul', 'Neo-Soul', 'Funk', 'Motown'],
  },
  {
    name: 'Jazz',
    accentKey: 'jazz',
    children: [
      'Traditional Jazz',
      'Swing',
      'Bebop',
      'Cool Jazz',
      'Fusion',
      'Free Jazz',
      'Smooth Jazz',
      'Vocal Jazz',
    ],
  },
  {
    name: 'Blues',
    accentKey: 'blues',
    children: [
      'Delta Blues',
      'Chicago Blues',
      'Electric Blues',
      'Blues Rock',
      'Country Blues',
    ],
  },
  {
    name: 'Classical',
    accentKey: 'classical',
    children: [
      'Baroque',
      'Classical Period',
      'Romantic',
      'Modern Classical',
      'Contemporary Classical',
      'Opera',
      'Orchestral',
    ],
  },
  {
    name: 'Folk',
    accentKey: 'folk',
    children: [
      'Traditional Folk',
      'Contemporary Folk',
      'Celtic Folk',
      'Nordic Folk',
      'Balkan Folk',
      'American Folk',
      'British Folk',
    ],
  },
  {
    name: 'Country',
    accentKey: 'country',
    children: [
      'Traditional Country',
      'Country Pop',
      'Country Rock',
      'Outlaw Country',
      'Alternative Country',
      'Bluegrass',
    ],
  },
  {
    name: 'Latin',
    accentKey: 'latin',
    children: [
      'Salsa',
      'Bachata',
      'Reggaeton',
      'Cumbia',
      'Tango',
      'Bossa Nova',
      'Latin Pop',
      'Merengue',
    ],
  },
  {
    name: 'Reggae',
    accentKey: 'reggae',
    children: [
      'Reggae',
      'Roots Reggae',
      'Dub',
      'Dancehall',
      'Ska',
      'Rocksteady',
    ],
  },
  {
    name: 'World',
    accentKey: 'world',
    children: [
      'Turkish Music',
      'Arabic Music',
      'Persian Music',
      'Indian Music',
      'African Music',
      'Japanese Music',
      'Chinese Music',
      'Korean Music',
      'Central Asian Music',
      'Balkan Music',
    ],
  },
  {
    name: 'Gospel / Religious',
    accentKey: 'gospel',
    children: [
      'Gospel',
      'Christian Music',
      'Islamic Music',
      'Spiritual',
      'Religious Folk',
    ],
  },
  {
    name: 'Soundtrack',
    accentKey: 'soundtrack',
    children: [
      'Film Score',
      'TV Score',
      'Video Game Music',
      'Anime Music',
      'Musical',
      'Trailer Music',
    ],
  },
  {
    name: 'Experimental',
    accentKey: 'experimental',
    children: ['Experimental', 'Avant-Garde', 'Noise', 'Drone', 'Industrial'],
  },
];
