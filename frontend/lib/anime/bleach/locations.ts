import type { Localized } from "./types";
import type { LayerId } from "@/components/anime/bleach/WorldSection";

/**
 * MEKÂNLAR — P15'in verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Mekânlar dünyalarına göre gruplanıyor ve **her grup kendi dünyasının
 * temasını taşıyor**. Yani tek bölümde beş tema kayması oluyor: sayfanın
 * mini bir özeti.
 *
 * ── ⚠️ GÖRSEL KARARI DEĞİŞTİ (29 Ağustos 2026) ──────────────────────────
 * Brief bu bölümü görselsiz istiyordu: "Sayfada zaten çok görsel var; burası
 * nefes alma alanı." Kullanıcı bunu açıkça geri aldı — "Mekânlar kısmında da
 * fotoğrafla görselliği artıralım, mesela Karakura Town resmi de olsun".
 *
 * Karar uygulandı ama bölümün tezi korundu: kart yok, ızgara yok. Her grubun
 * İLK mekânı geniş bir açılış karesi alıyor (grubun kimliği), kalanlar
 * listedeki yerinde küçük bir küçük resimle duruyor. Yani bölüm hâlâ bir
 * liste — resimlenmiş bir liste.
 *
 * ⚠️ `slug` YENİ VE KARARLI: küratörün yuvası `bleach:place:<slug>`. Yeniden
 * adlandırmak yüklenen kareyi koparır (manifesto başlığındaki kural). Ad
 * değişse bile slug DEĞİŞMEZ.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * ⚠️ Brief'in Reiōkyū listesi bir hata taşıyordu: **Ichimonji bir saray
 * değil**, Ichibē Hyōsube'nin Zanpakutō'su (P13'te de öyle kayıtlı).
 * Kraliyet katındaki saraylar 麒麟殿 · 臥豚殿 · 鳳凰殿.
 *
 * ⚠️ İki ad daha düzeldi:
 *   • Karakura Lisesi 空座高校 değil **空座一校** (Karakura Ikkō).
 *   • Kurosaki Kliniği'nin tabelası kanji değil **katakana**: クロサキ医院.
 *
 * ⚠️ Wahrwelt bir Wandenreich şehri gibi görünüyor ama canon'da
 * **Reiōkyū'nun kendisi**: Yhwach kraliyet sarayını yeniden dövüp
 * 真世界城'e çevirdi. Kayıt onu Wandenreich grubunda tutuyor ama bunu
 * söylüyor — yer değiştirmiş bir sarayı iki gruba birden koymak
 * okuyucuyu kaybettirirdi.
 */

export interface LocationRecord {
  /** ÇEVRİLMEZ */
  kanji: string;
  /**
   * ⚠️ KARARLI kimlik — küratör yuvası (`bleach:place:<slug>`) bundan
   * türüyor. Adın ASCII karşılığı; Türkçe/Japonca diyakritik taşımıyor
   * (`Sōkyoku` → `sokyoku`) çünkü backend yuva kimliğini
   * `^[a-z0-9][a-z0-9:-]*$` ile doğruluyor.
   */
  slug: string;
  /** ÇEVRİLMEZ — özel ad */
  name: string;
  /** 2 cümle, arşivci sesi — wiki özeti değil */
  text: Localized;
}

export interface LocationGroup {
  /** Rayın çapa attığı kimlik */
  id: string;
  layer: LayerId;
  kanji: string;
  /** ÇEVRİLMEZ — sayfanın imza sesi İngilizce */
  eyebrow: string;
  places: LocationRecord[];
}

export const LOCATION_GROUPS: readonly LocationGroup[] = [
  {
    id: "loc-living",
    layer: "living",
    kanji: "現世",
    eyebrow: "WORLD OF THE LIVING",
    places: [
      {
        kanji: "空座町",
        slug: "karakura-town",
        name: "Karakura Town",
        text: {
          tr: "Sıradan bir taşra kasabası gibi görünüyor ama ruhsal yoğunluğu olağandışı: hem Hollow'ları hem onları avlayanları kendine çekiyor. Savaşın büyük bölümü burada, hiçbir şeyden haberi olmayan insanların üstünde geçti.",
          en: "It looks like an ordinary provincial town, but its spiritual density is not: it draws both Hollows and the ones who hunt them. Much of the war was fought here, over the heads of people who never knew.",
        },
      },
      {
        kanji: "クロサキ医院",
        slug: "kurosaki-clinic",
        name: "Kurosaki Clinic",
        text: {
          tr: "Bir aile kliniği ve aynı zamanda eski bir kaptanın sığınağı. Tabelası kanji değil katakana — kasabanın en sıradan görünen yerinin en sıra dışı sakinleri var.",
          en: "A family clinic and, at the same time, a former captain's hiding place. Its sign is in katakana rather than kanji — the most ordinary-looking address in town keeps the least ordinary residents.",
        },
      },
      {
        kanji: "浦原商店",
        slug: "urahara-shop",
        name: "Urahara Shop",
        text: {
          tr: "Dışarıdan bakınca sokak arasında küçük bir şekerci. Altında bir eğitim mağarası, arkasında Soul Society'ye açılan kapıyı kuran adam var.",
          en: "From the street, a small sweet shop down a side road. Beneath it lies a training cavern, and behind the counter stands the man who built the door to Soul Society.",
        },
      },
      {
        kanji: "空座一校",
        slug: "karakura-ikko",
        name: "Karakura Ikkō",
        text: {
          tr: "Ichigo'nun ve arkadaşlarının lisesi; hikâyenin başladığı sınıf burada. Ruhları görebilen bir avuç öğrenci, aynı sıraları görmeyenlerle paylaşıyor.",
          en: "The high school of Ichigo and his friends; the classroom where the story starts is here. A handful of students who can see spirits share the same desks with those who cannot.",
        },
      },
    ],
  },
  {
    id: "loc-soul-society",
    layer: "soul-society",
    kanji: "尸魂界",
    eyebrow: "SOUL SOCIETY",
    places: [
      {
        kanji: "瀞霊廷",
        slug: "seireitei",
        name: "Seireitei",
        text: {
          tr: "“Arınmış Ruhlar Divanı”: beyaz duvarların içinde on üç bölük, bir bürokrasi ve asil haneler. Duvarın içine doğmak ile dışına doğmak arasındaki fark, ölümden sonra bile sürüyor.",
          en: "The “Court of Pure Souls”: thirteen divisions, a bureaucracy and the noble houses, all inside white walls. The difference between being born inside the wall and outside it survives even death.",
        },
      },
      {
        kanji: "流魂街",
        slug: "rukongai",
        name: "Rukongai",
        text: {
          tr: "Duvarın dışı ve Soul Society'nin asıl kalabalığı: dört yöne seksener, 320 bölge. Bir numara sakin ve yasalı; seksen numarada yasa diye bir şey yok.",
          en: "Outside the wall, and where Soul Society's real crowd lives: eighty districts in each of four quadrants, 320 in all. District one is calm and lawful; in district eighty there is no such thing as law.",
        },
      },
      {
        kanji: "双殛の丘",
        slug: "sokyoku-hill",
        name: "Sōkyoku Hill",
        text: {
          tr: "İnfaz için seçilmiş tek yer: Seireitei'nin tam ortasında kayalık bir yayla. Bir milyon Zanpakutō gücündeki mızrak burada kırıldı ve kırıldığı gün Soul Society'nin de bir şeyi kırıldı.",
          en: "The one place chosen for executions: a rocky mesa at the very centre of the Seireitei. The halberd with the strength of a million Zanpakutō was broken here — and on the day it broke, something in Soul Society broke too.",
        },
      },
      {
        kanji: "双殛",
        slug: "sokyoku",
        name: "Sōkyoku",
        text: {
          tr: "Tepeye adını veren dev naginata; adı “ikili ceza” demek. Serbest bırakıldığında bir ateş anka kuşuna dönüşüyor ve tek bir ruhu değil, o ruhun bütün olasılıklarını siliyor.",
          en: "The giant naginata the hill is named after; its name means “twinned punishment”. Released, it becomes a phoenix of fire and erases not one soul but every possibility that soul held.",
        },
      },
      {
        kanji: "懺罪宮",
        slug: "senzaikyu",
        name: "Senzaikyū",
        text: {
          tr: "“Tövbe Sarayı”: infazı bekleyenlerin tutulduğu beyaz kule, tepeye tepeden bakıyor. Rukia oradan çıkarıldığında hikâye bir kurtarma operasyonundan bir iç savaşa döndü.",
          en: "The “Palace of Penitence”: the white tower where those awaiting execution are held, looking down on the hill. When Rukia was taken out of it, the story turned from a rescue into a civil war.",
        },
      },
      {
        kanji: "中央四十六室",
        slug: "central-46",
        name: "Central 46 Compound",
        text: {
          tr: "Kırk bilge ve altı yargıcın kapatıldığı külliye; çoğu yer altında ve dışarıya kapalı. Aizen içerideki herkesi öldürüp yerlerine geçtiğinde kimse aylarca fark etmedi — kapalılığın bedeli.",
          en: "The compound where forty wise men and six judges are sealed in; most of it lies underground and shut off. When Aizen killed everyone inside and took their place, no one noticed for months — the price of being sealed off.",
        },
      },
      {
        kanji: "真央霊術院",
        slug: "shinoreijutsuin",
        name: "Shinōreijutsuin",
        text: {
          tr: "Yamamoto'nun 2.100 yıl önce kurduğu okul; Gotei 13, Onmitsukidō ve Kidō Birliği'nin üçü de öğrencisini buradan alıyor. Central 46'nın yetki alanı dışındaki iki yerden biri.",
          en: "The school Yamamoto founded 2,100 years ago; the Gotei 13, the Onmitsukidō and the Kidō Corps all take their students from it. One of the two places outside Central 46's jurisdiction.",
        },
      },
    ],
  },
  {
    id: "loc-royal",
    layer: "royal",
    kanji: "霊王宮",
    eyebrow: "THE ROYAL REALM",
    places: [
      {
        kanji: "霊王宮",
        slug: "reiokyu",
        name: "Reiōkyū",
        text: {
          tr: "Soul Society'nin üzerinde, kimsenin göremediği bir kat. Oraya çıkmanın tek yolu Ōken ve Ōken bir anahtar değil, canlı bir kemikten yapılmış bir madde.",
          en: "One floor above Soul Society, which no one can see. The only way up is the Ōken — and the Ōken is not a key but a substance made from living bone.",
        },
      },
      {
        kanji: "霊王大内裏",
        slug: "reio-daidairi",
        name: "Reiō Daidairi",
        text: {
          tr: "Ana tapınak: havada duran dev silindirik yapı ve Ruh Kralı'nın bulunduğu yer. Bir taht odası değil bir mühür odası.",
          en: "The main shrine: the vast cylindrical structure hanging in the air, where the Soul King is. Not a throne room but a sealing chamber.",
        },
      },
      {
        kanji: "麒麟殿",
        slug: "kirinden",
        name: "Kirinden",
        text: {
          tr: "Tenjirō Kirinji'nin karargâhı ve içinde şifa veren kaplıcalar var. Yaraların iyileştiği yer değil, iyileşmenin zorla yaptırıldığı yer.",
          en: "Tenjirō Kirinji's headquarters, with healing hot springs inside. Not a place where wounds heal, but a place where healing is forced on you.",
        },
      },
      {
        kanji: "臥豚殿",
        slug: "gatonden",
        name: "Gatonden",
        text: {
          tr: "Kirio Hikifune'nin karargâhı. Ruh gücünü yemek yoluyla besleyen bir mutfak — yapay ruhu icat eden kişinin sarayı bir laboratuvar değil, bir sofra.",
          en: "Kirio Hikifune's headquarters. A kitchen that feeds spiritual power through food — the palace of the one who invented the artificial soul is not a laboratory but a table.",
        },
      },
      {
        kanji: "鳳凰殿",
        slug: "hooden",
        name: "Hōōden",
        text: {
          tr: "Ōetsu Nimaiya'nın karargâhı ve her Zanpakutō'nun doğduğu yer. Asauchi'ler burada dövülüyor; yani Soul Society'nin bütün kılıçları tek bir adamın elinden çıkmış.",
          en: "Ōetsu Nimaiya's headquarters, and the place where every Zanpakutō is born. The Asauchi are forged here — which means every sword in Soul Society came from one man's hands.",
        },
      },
    ],
  },
  {
    id: "loc-hueco",
    layer: "hueco-mundo",
    kanji: "虚圏",
    eyebrow: "THE WORLD OF THE HOLLOW",
    places: [
      {
        kanji: "虚夜宮",
        slug: "las-noches",
        name: "Las Noches",
        text: {
          tr: "Adı “boşluğun gece sarayı” demek ve içeride gerçekten yapay bir gökyüzü var: Aizen'in kurduğu tavan hep gündüz gösteriyor. Dışarıda hiç bitmeyen gecenin altında, içeride hiç gelmeyen bir gündüz.",
          en: "Its name means “hollow night palace”, and inside there really is an artificial sky: the ceiling Aizen built always shows daylight. Under a night that never ends outside, a day that never comes inside.",
        },
      },
      {
        kanji: "メノスの森",
        slug: "forest-of-menos",
        name: "Forest of Menos",
        text: {
          tr: "Çölün altında, sıradan Hollow'ların Arrancar'lardan saklandığı bir orman. Yukarısı bir imparatorluksa burası onun bodrumu.",
          en: "A forest beneath the desert where ordinary Hollows hide from the Arrancar. If what is above is an empire, this is its cellar.",
        },
      },
      {
        kanji: "黒腔",
        slug: "garganta",
        name: "Garganta",
        text: {
          tr: "“Kara boğaz”: dünyalar arasında yırtılan geçit. Senkaimon'un aksine bir kapı değil bir yarık — Hollow'ların yolu düzenli değil, yırtıktır.",
          en: "“Black cavity”: the passage torn between worlds. Unlike the Senkaimon it is not a door but a rip — the Hollow road is not built, it is torn.",
        },
      },
      {
        kanji: "白い砂漠",
        slug: "white-desert",
        name: "The white desert",
        text: {
          tr: "Sonsuz beyaz kum, kırılmayan bir ay ve kuru kemik ağaçları. Hueco Mundo'da mekân denince akla gelen ilk şey bir yapı değil, bu boşluğun kendisi.",
          en: "Endless white sand, a moon that never sets and dry bone trees. In Hueco Mundo the first thing that counts as a place is not a building but this emptiness itself.",
        },
      },
    ],
  },
  {
    id: "loc-wandenreich",
    layer: "wandenreich",
    kanji: "見えざる帝国",
    eyebrow: "THE INVISIBLE EMPIRE",
    places: [
      {
        kanji: "銀架城",
        slug: "silbern",
        name: "Silbern",
        text: {
          tr: "“Gümüş çatkı kalesi”: Wandenreich'in merkezi ve Sternritter'ın kışlası. Soul Society'nin gölgesinin içinde duruyor, yani düşman hep oradaydı — yalnızca görünmüyordu.",
          en: "The “silver frame castle”: the Wandenreich's centre and the barracks of the Sternritter. It stands inside Soul Society's own shadow — the enemy was always there, merely unseen.",
        },
      },
      {
        kanji: "影の領域",
        slug: "schatten-bereich",
        name: "Schatten Bereich",
        text: {
          tr: "İmparatorluğun içinde bulunduğu gölge alanı ve aynı zamanda ordunun yolu. Quincy'ler bir mesafeyi yürüyerek değil, gölgeden girip gölgeden çıkarak geçiyor.",
          en: "The shadow region the empire sits in, and at the same time the army's road. The Quincy do not cross a distance by walking it; they step into shadow and out of shadow.",
        },
      },
      {
        kanji: "真世界城",
        slug: "wahrwelt",
        name: "Wahrwelt",
        text: {
          tr: "“Gerçek dünya şehri” — ama yeni bir şehir değil: Yhwach kraliyet sarayını ele geçirip yeniden dövdü ve Reiōkyū bu hâle geldi. Yani imparatorluğun son başkenti, tanrının evinin kendisi.",
          en: "The “true world city” — but not a new city: Yhwach seized the royal palace and reforged it, and the Reiōkyū became this. The empire's final capital is the god's own house.",
        },
      },
    ],
  },
];
