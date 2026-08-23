import type { Localized } from "./types";

/**
 * ESPADA — P08'in verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki karşılığı Akatsuki sergisi ama tasarım kararı tam
 * tersi: orada merkez **portre**, burada merkez **numara**. Baraggan'ın
 * cümlesi bölümün tamamını kuruyor — her Espada ölümün ayrı bir yüzüne
 * hükmediyor; kadro bir karakter galerisi değil, bir ölüm tipolojisi.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * `bleach.fandom.com/api.php?action=parse&page=<AD>&prop=wikitext`.
 * Ölüm yüzleri `Espada` sayfasının "Forms of Death" bölümünden, kanji'leriyle
 * birlikte; maske parçaları ve dövme yerleri her karakterin "Appearance"
 * bölümünden; cero renkleri `Template:CeroColors`tan.
 *
 * ⚠️ Doğrulama brief'i üç yerde düzeltti:
 *   1. **Yammy 0 değil 10.** Dövmesi sol omzunda "10" yazıyor; Resurrección'da
 *      "1" eriyip gidiyor ve geriye "0" kalıyor. Brief onu doğrudan 0 diye
 *      yazmış — kayıt ikisini birden tutuyor (`rank` 10, `releasedRank` 0),
 *      çünkü bu bir hata değil bölümün en iyi ayrıntılarından biri.
 *   2. **Ulquiorra'nın yüzü "boşluk" değil 虚無 — hiçlik.** İkisi Türkçede
 *      yakın ama 虚無 nihilizmin kendisi ve karakterin bütün tezi o.
 *   3. **Sıra adları canon'un kendi içinde tutarsız:** Primera, Segunda,
 *      *Tres*, *Cuatro*, Quinta, Sexta, Séptima, Octava, Noveno, Diez.
 *      Üç ve dört sıra sayısı değil asıl sayı. Düzeltilmedi — canon böyle.
 *
 * ── CERO RENGİ: VERİ, TOKEN DEĞİL ────────────────────────────────────────
 * ⚠️ Kural 16 istisnası, `divisions.ts`teki `reiatsu` ile aynı sınıf: bu renk
 * temanın değil KARAKTERİN. Brief "reiatsuColor" diyor ama canon reiatsu
 * rengini kaydetmiyor; kaydettiği şey **cero rengi** ve bu on kişinin
 * yedisi için yazılı. Kalan üçünde `attested: false` — değer, canon'un
 * "çoğu cero kızıldır" varsayılanı ve arayüz bunu açıkça söylüyor.
 *
 * Renk adları canon'dan, DEĞERLERİ koyulaştırıldı: bölüm Hueco Mundo'nun
 * beyaz zemininde geçiyor ve altın sarısı bir cero orada okunmuyordu.
 */

export interface EspadaCero {
  /** Canon'daki renk ADI — çevriliyor */
  name: Localized;
  /** ⚠️ VERİ. Beyaz zeminde okunacak biçimde koyulaştırılmış hâli. */
  hex: string;
  /** Canon bu kişinin cero rengini yazıyor mu? Hayırsa arayüz söylüyor. */
  attested: boolean;
}

export interface EspadaStage {
  id: "base" | "resurreccion" | "segunda";
  /** Çevrilmez — 帰刃 / 刀剣解放第二階層 */
  kanji: string | null;
  /** Çevrilmez — Spanish ad (Murciélago…) */
  name: string | null;
  /** 2 cümle */
  text: Localized;
}

export interface EspadaRecord {
  /** Dövmedeki sayı — Yammy'de 10 */
  rank: number;
  /** Resurrección'da değişiyorsa (yalnızca Yammy) */
  releasedRank?: number;
  /** ÇEVRİLMEZ — canon'un kendi tutarsız sıra adı */
  ordinal: string;
  name: string;
  /** Ölümün hangi yüzü */
  aspect: { kanji: string; romaji: string; label: Localized };
  /** Numara bedenin neresinde yazılı — canon'dan; bilinmiyorsa `null` */
  tattoo: Localized | null;
  cero: EspadaCero;
  /** `MaskFragment` çizimini seçen anahtar */
  fragment: string;
  /** Maske parçasının canon'daki yeri */
  fragmentNote: Localized;
  stages: EspadaStage[];
}

/* Cero renkleri — canon adı → koyulaştırılmış değer. Tek yerde durmalı ki
   iki Espada'nın "altın sarısı"ı birbirinden kaymasın. */
const CRIMSON = "#B01218";
const BLUE = "#1B4F9C";
const GOLD = "#8A6B08";
const GREEN = "#1C7A3C";
const PINK = "#A81F6B";

const crimsonDefault: EspadaCero = {
  name: { tr: "Kızıl", en: "Crimson" },
  hex: CRIMSON,
  attested: false,
};

export const ESPADA: readonly EspadaRecord[] = [
  {
    rank: 1,
    ordinal: "Primera",
    name: "Coyote Starrk",
    aspect: {
      kanji: "孤独",
      romaji: "kodoku",
      label: { tr: "Yalnızlık", en: "Solitude" },
    },
    tattoo: {
      tr: "Sol elinin üstünde, eldivenin altında saklı",
      en: "On the back of his left hand, hidden under a glove",
    },
    cero: { name: { tr: "Mavi", en: "Blue" }, hex: BLUE, attested: true },
    fragment: "jaw-neck",
    fragmentNote: {
      tr: "Dişli bir alt çene, boynu boyunca uzanıyor",
      en: "A fanged lower jaw, running along his neck",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Ölümün yalnızlık yüzü ve onu reddeden tek Espada. Hollow'ken gücü o kadar fazlaydı ki yanına gelen ruhlar sönüyordu; kimse kalamadığı için kendini ikiye böldü.",
          en: "The face of death called solitude — and the one Espada who refuses it. As a Hollow his power was so great that souls near him simply drained away; because no one could stay, he split himself in two.",
        },
      },
      {
        id: "resurreccion",
        kanji: "群狼",
        name: "Los Lobos",
        text: {
          tr: "Ayrıldığı yarısı Lilynette'le yeniden birleşiyor ve ortaya iki tabancalı tek bir avcı çıkıyor. Sürü onun etrafında değil, onun içinde: yalnızlığı silahına dönüşmüş hâli.",
          en: "The half he separated, Lilynette, rejoins him and a single hunter with two pistols steps out. The pack is not around him but inside him: his solitude turned into a weapon.",
        },
      },
    ],
  },
  {
    rank: 2,
    ordinal: "Segunda",
    name: "Baraggan Louisenbairn",
    aspect: {
      kanji: "老い",
      romaji: "oi",
      label: { tr: "Yaşlanma", en: "Old age" },
    },
    tattoo: null,
    cero: crimsonDefault,
    fragment: "crown",
    fragmentNote: {
      tr: "Alnının hemen üstünde beş uçlu bir taç",
      en: "A five-pointed crown just above his forehead",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Aizen gelmeden önce Hueco Mundo'nun kralıydı ve tahtını hâlâ kaybetmiş saymıyor. Ona göre yaşlanma kaçınılmazdır: Shinigami bile eninde sonunda ona teslim olur.",
          en: "He was king of Hueco Mundo before Aizen arrived, and he still does not consider the throne lost. To him senescence is inescapable: even Shinigami will yield to it in the end.",
        },
      },
      {
        id: "resurreccion",
        kanji: "髑髏大帝",
        name: "Arrogante",
        text: {
          tr: "Taç bütün bedeni sarıyor ve geriye zırhlı bir iskelet kalıyor. Nefesi 死の息吹 dokunduğu her şeyi çürütüyor — sonunda kendi gücü onu da yaşlandırıp bitiriyor.",
          en: "The crown swallows his whole body and an armoured skeleton is left. His breath, 死の息吹, rots whatever it touches — and in the end his own power ages him to nothing.",
        },
      },
    ],
  },
  {
    rank: 3,
    ordinal: "Tres",
    name: "Tier Harribel",
    aspect: {
      kanji: "犠牲",
      romaji: "gisei",
      label: { tr: "Fedakârlık", en: "Sacrifice" },
    },
    tattoo: {
      tr: "Sağ göğsünün sol yanında",
      en: "On the left side of her right breast",
    },
    cero: {
      name: { tr: "Altın sarısı", en: "Golden-yellow" },
      hex: GOLD,
      attested: true,
    },
    fragment: "mouth-guard",
    fragmentNote: {
      tr: "Yüzünün yanları ve ağzı; boynundan aşağı uzanıyor",
      en: "The sides of her face and her mouth, extending down her neck",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Fedakârlığın her dünyada kaçınılmaz olduğunu düşünüyor ama anlamsız kan dökmede bir değer görmüyor. Güç için başkasını harcamayı reddeden tek Espada o.",
          en: "She holds that sacrifice is unavoidable in any world, yet sees no worth in pointless bloodshed. She is the one Espada who refuses to spend others for power.",
        },
      },
      {
        id: "resurreccion",
        kanji: "皇鮫后",
        name: "Tiburón",
        text: {
          tr: "Maske düşüyor ve altından bir köpekbalığı hükümdarı çıkıyor. Suyu bir kılıç gibi kullanıyor: 波蒼砲 denizin kendisini fırlatıyor.",
          en: "The mask falls away and a shark sovereign steps out. She wields water like a blade: 波蒼砲 hurls the sea itself.",
        },
      },
    ],
  },
  {
    rank: 4,
    ordinal: "Cuatro",
    name: "Ulquiorra Cifer",
    aspect: {
      kanji: "虚無",
      romaji: "kyomu",
      label: { tr: "Hiçlik", en: "Nihility" },
    },
    tattoo: { tr: "Göğsünün sol yanında", en: "On the left side of his chest" },
    cero: { name: { tr: "Yeşil", en: "Green" }, hex: GREEN, attested: true },
    fragment: "helm",
    fragmentNote: {
      tr: "Başının sol üst yanında kırık boynuzlu bir miğfer",
      en: "A broken horned helmet on the upper left of his head",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Gözle görülemeyen hiçbir şeyin var olmadığını söylüyor ve buna kalp de dahil. Duyguyu bir yanılsama sayıyor; ona göre yalnızca acı getiriyor ve o acı öldürücü.",
          en: "He says nothing exists that the eye cannot see — and that includes the heart. He counts emotion an illusion; to him it brings only suffering, and that suffering is fatal.",
        },
      },
      {
        id: "resurreccion",
        kanji: "黒翼大魔",
        name: "Murciélago",
        text: {
          tr: "Yarasa kanatları açılıyor ve Las Noches'in gecesi bir kat daha koyulaşıyor. Cero'su siyaha dönüyor: 黒虚閃, yalnızca onun çıkarabildiği renk.",
          en: "Bat wings open and the night over Las Noches thickens another shade. His cero turns black: 黒虚閃, a colour only he can produce.",
        },
      },
      {
        id: "segunda",
        kanji: "刀剣解放第二階層",
        name: "Segunda Etapa",
        text: {
          tr: "Espada içinde ikinci bir salıverişe ulaşabilen tek isim. Bunu güç için değil bir soruyu kanıtlamak için açıyor: karşısındakine gerçek umutsuzluğu göstermek.",
          en: "The only name among the Espada able to reach a second release. He opens it not for power but to prove a point: to show his opponent true despair.",
        },
      },
    ],
  },
  {
    rank: 5,
    ordinal: "Quinta",
    name: "Nnoitra Gilga",
    aspect: {
      kanji: "絶望",
      romaji: "zetsubō",
      label: { tr: "Umutsuzluk", en: "Despair" },
    },
    tattoo: { tr: "Dilinin üstünde", en: "On his tongue" },
    cero: {
      name: { tr: "Altın sarısı", en: "Golden-yellow" },
      hex: GOLD,
      attested: true,
    },
    fragment: "eyepatch",
    fragmentNote: {
      tr: "Göz bandının altında, Hollow deliğini çevreleyen küçük bir çene ve diş takımı",
      en: "Under the eyepatch: a small set of jawbones and teeth ringing his Hollow hole",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Ne kendisi ne de türü için bir kurtuluş olduğuna inanıyor; dövüşmek onun için amaç, ölmek de plan. Umutsuzluğu yalnızca taşımıyor, karşısındakine de bulaştırıyor.",
          en: "He believes there is no salvation for himself or his kind; fighting is his purpose and dying is the plan. He does not merely carry despair, he infects his opponent with it.",
        },
      },
      {
        id: "resurreccion",
        kanji: "聖哭螳螂",
        name: "Santa Teresa",
        text: {
          tr: "Altı kol, altı tırpan: bir peygamberdevesi. Tırpanlardan biri kesilse yenisi çıkıyor, yani bitiş hep bir adım öteye kayıyor.",
          en: "Six arms, six scythes: a praying mantis. Cut one scythe away and another grows, so the ending keeps sliding one step further off.",
        },
      },
    ],
  },
  {
    rank: 6,
    ordinal: "Sexta",
    name: "Grimmjow Jaegerjaquez",
    aspect: {
      kanji: "破壊",
      romaji: "hakai",
      label: { tr: "Yıkım", en: "Destruction" },
    },
    tattoo: {
      tr: "Sırtında, Hollow deliğinin sağ yanında",
      en: "On his back, to the right of his Hollow hole",
    },
    cero: { name: { tr: "Kızıl", en: "Crimson" }, hex: CRIMSON, attested: true },
    fragment: "jaw-right",
    fragmentNote: {
      tr: "Sağ çene kemiği",
      en: "The right jawbone",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Dövüş biçiminin tamamı yıkım üzerine kurulu; ölçülü bir hamlesi yok. Arrancar olmadan önce panter biçimli bir Adjuchas'tı ve bir sürünün başındaydı.",
          en: "His entire way of fighting is built on devastation; he has no measured move. Before he was an Arrancar he was a panther-like Adjuchas at the head of a pack.",
        },
      },
      {
        id: "resurreccion",
        kanji: "豹王",
        name: "Pantera",
        text: {
          tr: "Adjuchas hâline geri dönüyor ama bu sefer akıl yerinde. 豹王の爪 ile havayı on parçaya bölüyor — her biri bir pençe izi.",
          en: "He returns to his Adjuchas shape, but this time the mind stays. With 豹王の爪 he splits the air into ten pieces — each one a claw mark.",
        },
      },
    ],
  },
  {
    rank: 7,
    ordinal: "Séptima",
    name: "Zommari Rureaux",
    aspect: {
      kanji: "陶酔",
      romaji: "tōsui",
      label: { tr: "Sarhoşluk", en: "Intoxication" },
    },
    tattoo: null,
    cero: crimsonDefault,
    fragment: "spine-crest",
    fragmentNote: {
      tr: "Başının tepesinde bir sıra kemik diken ve kafatası biçimli küpeler",
      en: "A row of bony spikes along the crest of his head, with skull-shaped earrings",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Espada'nın en hızlısı olduğunu söylüyor ve sonído'yu bir teknik değil bir ibadet gibi kullanıyor. Ölümün sarhoşluk yüzü onda bir büyücü hekim görüntüsüyle geliyor.",
          en: "He claims to be the fastest of the Espada and uses sonído less like a technique than a devotion. Death's intoxicated face arrives on him with the look of a witch doctor.",
        },
      },
      {
        id: "resurreccion",
        kanji: "呪眼僧伽",
        name: "Brujería",
        text: {
          tr: "Bedeni elli göze bölünüyor ve baktığı her şeyin iradesini alıyor. 愛 dediği şey bir sevgi değil bir mülkiyet: gözünün değdiği uzuv artık onun.",
          en: "His body opens into fifty eyes and takes the will of whatever he looks at. What he calls 愛 is not love but ownership: the limb his eye touches is his now.",
        },
      },
    ],
  },
  {
    rank: 8,
    ordinal: "Octava",
    name: "Szayelaporro Granz",
    aspect: {
      kanji: "狂気",
      romaji: "kyōki",
      label: { tr: "Delilik", en: "Madness" },
    },
    tattoo: null,
    cero: { name: { tr: "Pembe", en: "Pink" }, hex: PINK, attested: true },
    fragment: "glasses",
    fragmentNote: {
      tr: "Dikdörtgen çerçeveli bir gözlük",
      en: "A pair of rectangular-framed glasses",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Las Noches'in bilim adamı ve kendi ölümünü bile bir deney sayacak kadar kendine hayran. Delilik onda bir çöküş değil bir yöntem.",
          en: "Las Noches' scientist, and vain enough to count even his own death an experiment. Madness in him is not a collapse but a method.",
        },
      },
      {
        id: "resurreccion",
        kanji: "邪淫妃",
        name: "Fornicarás",
        text: {
          tr: "Karşısındakini yutup bir kopyasını üretiyor ve o kopyayı kendi elleriyle parçalıyor. Amacı öldürmek değil, düşmanına kendi ölümünü seyrettirmek.",
          en: "He swallows his opponent, produces a copy of them, and takes that copy apart with his own hands. The aim is not to kill but to make the enemy watch their own death.",
        },
      },
    ],
  },
  {
    rank: 9,
    ordinal: "Noveno",
    name: "Aaroniero Arruruerie",
    aspect: {
      kanji: "強欲",
      romaji: "gōyoku",
      label: { tr: "Açgözlülük", en: "Greed" },
    },
    tattoo: {
      tr: "Kapsülün içindeki iki Hollow başının ikisinde birden",
      en: "On both of the two Hollow heads inside the capsule",
    },
    cero: crimsonDefault,
    fragment: "capsule",
    fragmentNote: {
      tr: "Sekiz delikli uzun beyaz bir maske; altında kırmızı sıvı dolu cam bir kapsül",
      en: "A long white mask with eight holes; beneath it a glass capsule filled with red liquid",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Espada'nın Gillian sınıfından gelen tek üyesi — yani yüzlerce Hollow'un tek gövdede sıkışmış hâli. Rukia ile karşılaştığında yediği Hollow sayısı 33.650'ye ulaşmıştı.",
          en: "The only member of the Espada of Gillian class — hundreds of Hollows pressed into a single body. By the time he met Rukia he had devoured 33,650 of them.",
        },
      },
      {
        id: "resurreccion",
        kanji: "喰虚",
        name: "Glotonería",
        text: {
          tr: "Yediği her Hollow'un gücünü üstünde taşıyor; salıverdiğinde o yığın dışarı taşıyor. Açgözlülük burada bir huy değil, bedenin kendisi.",
          en: "He carries the power of every Hollow he has eaten; when he releases, that heap spills outward. Here greed is not a habit but the body itself.",
        },
      },
    ],
  },
  {
    rank: 10,
    releasedRank: 0,
    ordinal: "Diez",
    name: "Yammy Llargo",
    aspect: {
      kanji: "憤怒",
      romaji: "funnu",
      label: { tr: "Öfke", en: "Rage" },
    },
    tattoo: {
      tr: "Sol omzunda “10”; salıverdiğinde “1” eriyip gidiyor ve geriye “0” kalıyor",
      en: "A “10” on his left shoulder; on release the “1” melts away and a “0” is left",
    },
    cero: { name: { tr: "Kızıl", en: "Crimson" }, hex: CRIMSON, attested: true },
    fragment: "jaw-chin",
    fragmentNote: {
      tr: "Çenesinde duran, sekiz dişli bir alt çene kemiği",
      en: "A jawbone with eight teeth, resting on his chin",
    },
    stages: [
      {
        id: "base",
        kanji: null,
        name: null,
        text: {
          tr: "Onuncu sırada duruyor ve sıralamanın en tartışmalı adı o: gücü öfkesiyle birlikte büyüyor, yani sabit bir yeri yok. Kolay kızıyor ve kızdıkça büyüyor.",
          en: "He stands tenth, and he is the most disputed name on the list: his power grows with his anger, so he has no fixed place. He angers easily, and grows as he does.",
        },
      },
      {
        id: "resurreccion",
        kanji: "憤獣",
        name: "Ira",
        text: {
          tr: "Salıverdiğinde omzundaki “1” eriyor ve numara sıfıra iniyor — sıralamanın dibi değil, dışı. Öfkesi doruğa çıktığında bu biçim bir kez daha büyüyor.",
          en: "On release the “1” on his shoulder melts and the number drops to zero — not the bottom of the ranking but outside it. When his rage peaks, this form grows once more.",
        },
      },
    ],
  },
];

/**
 * Ulquiorra sahnesinin kimliği.
 *
 * Sahne yalnızca bu kayda bağlı ve öyle kalmalı: brief'in kendi kuralı
 * "başka hiçbir yerde böyle bir sahne YAPMA — tekil olduğu için değerli".
 * Karşılaştırma bir dizeyle değil bu sabitle yapılıyor ki adı bir gün
 * değişirse derleme kırılsın, sahne sessizce kaybolmasın.
 */
export const SCENE_ESPADA_RANK = 4;
