import type { LocalizedText } from "./types";

/**
 * Gaara — "Mutlak Savunma — ve Kimin İçin" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 1662 kaydının ABILITY yuvaları,
 * `gaara:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (19 Ocak), boy (146 cm), kan grubu (AB), yaş (12) ve ikinci
 * adlar ("Sabaku no Gaara", "Gaara of the Desert") AniList künyesinden
 * birebir alındı (24 Ağustos 2026'da önbelleğe alınan `anilist-detay-22.json`,
 * karakter 1662). AniList'te Gaara için RÜTBE satırı YOK; künyedeki
 * "Beşinci Kazekage" satırı kronolojiden geliyor ve sayfa bunu saklamıyor.
 * Kilo kayıtta yok, bu yüzden künye şeridinde de yok.
 *
 * ── DOĞRULUK NOTLARI (üçü de sık karıştırılıyor) ─────────────────────────
 * 1. Magnet Release üç kuşakta ÜÇ AYRI malzemede çalıştı: Üçüncü Kazekage
 *    demir kumu (砂鉄), Rasa altın tozu (砂金), Gaara sıradan kum. "Rasa'nın
 *    demir kumu" diye bir şey yok; sayfa ayrımı açıkça yazıyor.
 * 2. Rock Lee, Gaara'ya karşı SEKİZ kapıyı değil BEŞİNCİ kapıyı açtı.
 * 3. Shukaku'nun tam dönüşümü için Gaara'nın uyuması gerekir
 *    (狸寝入りの術, Tanuki Neiri no Jutsu) — sayfadaki uykusuzluk kartı
 *    bu mekaniğin bedeli, süs değil.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik var, ikisi de Gaara'nın ve ikisi de yerleşik
 * çevirileriyle. İkisi bilinçli olarak hem çizelgede hem kapanışta
 * geçiyor: sayfanın tezi zaten "aynı ağız, on yıl arayla".
 */

export const GAARA_ID = 1662;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const GAARA_SITE_URL = "https://anilist.co/character/1662";

/**
 * Sergi görselleri — hepsi characterId 1662 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `gaara:` önekli (kurator modu şartı).
 */
export const GAARA_IMAGE_KEYS = {
  /** Hero: geniş çöl kadrajı, ufuk çizgisi yüksek (16:9) */
  hero: "gaara:hero",
  tate: "gaara:tate",
  sabaku: "gaara:sabaku",
  jiton: "gaara:jiton",
  gourd: "gaara:gourd",
  cloud: "gaara:cloud",
  insomnia: "gaara:insomnia",
  robe: "gaara:robe",
  layer1: "gaara:layer-1",
  layer2: "gaara:layer-2",
  layer3: "gaara:layer-3",
  layer4: "gaara:layer-4",
  layer5: "gaara:layer-5",
  /** 愛 bölümünün arka planı — alın yakın çekimi */
  ai: "gaara:ai",
  fateBirth: "gaara:fate-birth",
  fateYashamaru: "gaara:fate-yashamaru",
  fateChunin: "gaara:fate-chunin",
  fateKazekage: "gaara:fate-kazekage",
  fateAlliance: "gaara:fate-alliance",
  closing: "gaara:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const GAARA_SLOT_LABELS: Record<string, LocalizedText> = {
  [GAARA_IMAGE_KEYS.hero]: {
    tr: "Hero — çöl ufku, figür küçük ve sağda (16:9)",
    en: "Hero — desert horizon, small figure at the right (16:9)",
  },
  [GAARA_IMAGE_KEYS.tate]: {
    tr: "Suna no Tate — kumun kendiliğinden yükselişi",
    en: "Suna no Tate — the sand rising on its own",
  },
  [GAARA_IMAGE_KEYS.sabaku]: {
    tr: "Sabaku Sōsō — kapanan avuç",
    en: "Sabaku Sōsō — the closing palm",
  },
  [GAARA_IMAGE_KEYS.jiton]: {
    tr: "Magnet Release — altın toz ile kum aynı gökyüzünde",
    en: "Magnet Release — gold dust and sand in one sky",
  },
  [GAARA_IMAGE_KEYS.gourd]: {
    tr: "Sırttaki kum kabağı",
    en: "The gourd on his back",
  },
  [GAARA_IMAGE_KEYS.cloud]: {
    tr: "Uçan kum bulutu — ayaklar yerden kesik",
    en: "The floating sand cloud — feet off the ground",
  },
  [GAARA_IMAGE_KEYS.insomnia]: {
    tr: "Uykusuzluk — gözlerin çevresindeki halkalar",
    en: "Insomnia — the rings around the eyes",
  },
  [GAARA_IMAGE_KEYS.robe]: {
    tr: "Kazekage cübbesi ve şapkası",
    en: "The Kazekage robe and hat",
  },
  [GAARA_IMAGE_KEYS.layer1]: {
    tr: "1. katman — otomatik kum kalkanı",
    en: "Layer 1 — the automatic sand shield",
  },
  [GAARA_IMAGE_KEYS.layer2]: {
    tr: "2. katman — çatlayan kum zırhı",
    en: "Layer 2 — the cracking sand armour",
  },
  [GAARA_IMAGE_KEYS.layer3]: {
    tr: "3. katman — köyün üstüne kalkan gerilmiş kum dalgası",
    en: "Layer 3 — the sand wave shielding the village",
  },
  [GAARA_IMAGE_KEYS.layer4]: {
    tr: "4. katman — kapanan kum tabutu",
    en: "Layer 4 — the closing sand coffin",
  },
  [GAARA_IMAGE_KEYS.layer5]: {
    tr: "5. katman — kum kabuğu ve tek göz",
    en: "Layer 5 — the sand shell and the single eye",
  },
  [GAARA_IMAGE_KEYS.ai]: {
    tr: "Alındaki 愛 yarası — yakın çekim",
    en: "The 愛 scar on his forehead — close crop",
  },
  [GAARA_IMAGE_KEYS.fateBirth]: {
    tr: "Doğum — mühür ve Karura",
    en: "Birth — the seal and Karura",
  },
  [GAARA_IMAGE_KEYS.fateYashamaru]: {
    tr: "Yashamaru gecesi",
    en: "The night of Yashamaru",
  },
  [GAARA_IMAGE_KEYS.fateChunin]: {
    tr: "Chūnin sınavı — Naruto ile karşılaşma",
    en: "The Chūnin exam — meeting Naruto",
  },
  [GAARA_IMAGE_KEYS.fateKazekage]: {
    tr: "Kazekage — Deidara'ya karşı köyün üstünde",
    en: "Kazekage — above the village against Deidara",
  },
  [GAARA_IMAGE_KEYS.fateAlliance]: {
    tr: "İttifak — beş köyün ordusuna konuşma",
    en: "The alliance — speaking to the five villages",
  },
  [GAARA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş çöl, tek bir iz",
    en: "Closing — empty desert, a single trail",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const GAARA_IDENTITY = {
  name: "Gaara",
  nativeName: "我愛羅",
  /** Hero filigranı — dev, dekoratif (aria-hidden) */
  watermark: "我愛羅",
  village: { tr: "Sunagakure — Kum Köyü", en: "Sunagakure — the Village Hidden in the Sand" },
  epithet: {
    tr: "Sabaku no Gaara — Çölün Gaara'sı",
    en: "Sabaku no Gaara — Gaara of the Desert",
  },
  epigraph: {
    tr: "Kum onu, o istemeden bile korudu. Sorun hiçbir zaman nasıl korunduğu değildi — kimin için korunduğuydu.",
    en: "The sand protected him even when he did not ask it to. The question was never how he was defended — it was for whom.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "19 Ocak", en: "19 January" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "146 cm", en: "146 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "AB", en: "AB" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "12 (I. bölüm)", en: "12 (Part I)" },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Beşinci Kazekage — 15 yaşında",
        en: "Fifth Kazekage — at fifteen",
      },
    },
    {
      label: { tr: "Kardeşleri", en: "Siblings" },
      value: {
        tr: "Temari ve Kankurō — öğretmenleri Baki",
        en: "Temari and Kankurō — trained by Baki",
      },
    },
    {
      label: { tr: "Taşıdığı", en: "What he carries" },
      value: {
        tr: "Sırtında bir kum kabağı",
        en: "A gourd of sand on his back",
      },
    },
    {
      label: { tr: "İçindeki", en: "What is inside him" },
      value: {
        tr: "Ichibi no Shukaku — tek kuyruklu",
        en: "Ichibi no Shukaku — the One-Tail",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const GAARA_SHUKAKU_TEXT = {
  enter: { tr: "Shukaku", en: "Shukaku" },
  exit: { tr: "Shukaku'yu bastır", en: "Push Shukaku back" },
  hint: {
    tr: "Kum sertleşiyor, renk sarıya kayıyor ve kenarda tek bir göz açılıyor.",
    en: "The sand hardens, the colour slides to yellow, and a single eye opens at the edge.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const GAARA_HERO = {
  lede: {
    tr: "Altı yaşında alnına «sevgi» kazıdı — kimse sevmediği için, kendini sevmek üzere. Kum her darbeyi durdurdu; durduramadığı tek şey içeriden geldi.",
    en: "At six he carved «love» into his forehead — with no one left to love him, he would love himself. The sand stopped every blow; the only one it could not stop came from inside.",
  },
  horizonCaption: {
    tr: "Sayfanın zemini çöl: 22 kardeş dosyanın en sıcak, en açık olanı.",
    en: "This page stands on desert ground — the warmest, lightest of its twenty-two sibling files.",
  },
  portraitAlt: {
    tr: "Gaara — arşive yüklenmiş kadro portresi",
    en: "Gaara — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Gaara — AniList künye portresi",
    en: "Gaara — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Dört yoldaş portresinin dördü de kendi veritabanımızdan (PORTRAIT yuvası),
 * bu yüzden tek bir son ek yetiyor.
 */
export const GAARA_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const GAARA_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const GAARA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "146 santim, on iki yaş, bir köyün en korkulan şinobisi. Rakamlar bir çocuğu, unvan bir silahı anlatıyor.",
      en: "A hundred and forty-six centimetres, twelve years old, the most feared shinobi of a village. The numbers describe a child; the title describes a weapon.",
    },
  },
  strata: {
    title: { tr: "Kum katmanları", en: "The layers of sand" },
    lede: {
      tr: "Gaara'nın savunması tek bir kalkan değil, üst üste binmiş beş tabakadır. Aşağıdaki kesitte bir tabaka seç: altındaki bütün tabakalar da yanar, çünkü hiçbir kat kendinden öncekiler olmadan durmuyor.",
      en: "His defence is not one shield but five strata pressed on top of each other. Pick a band in the cross-section below: everything beneath it lights up too, because no layer stands without the ones under it.",
    },
  },
  lab: {
    title: { tr: "Kumun grameri", en: "The grammar of sand" },
    lede: {
      tr: "Üç teknik ailesi. İlki Gaara'ya «mutlak savunma» adını verdi, ikincisi o adı ürkütücü kıldı, üçüncüsü ise babasından kalan bir kan mirasının adı.",
      en: "Three families of technique. The first earned him the name «absolute defence», the second made that name frightening, and the third is the bloodline his father left behind.",
    },
  },
  kit: {
    title: { tr: "Taşıdıkları", en: "What he carries" },
    lede: {
      tr: "Sırtındaki kabak, ayağının altındaki bulut, uyumadığı geceler ve on beş yaşında giydiği cübbe.",
      en: "The gourd on his back, the cloud under his feet, the nights he did not sleep, and the robe he put on at fifteen.",
    },
  },
  ai: {
    title: { tr: "Alnındaki harf", en: "The letter on his forehead" },
  },
  forWhom: {
    title: { tr: "Kimin için", en: "For whom" },
    lede: {
      tr: "Mutlak savunmanın cevabı teknikte değil bu dört kişide: onu silah yapan, ondan korkan iki kardeş ve onu ikna eden çocuk.",
      en: "The answer to the absolute defence is not in the techniques but in these four: the man who made him a weapon, the two siblings who feared him, and the boy who talked him out of it.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The ledger of a fate" },
    lede: {
      tr: "Beş kayıt. İkisi doğumdan önce yazıldı, biri bir gecede, biri bir sınav salonunda, sonuncusu bir savaş meydanında.",
      en: "Five entries. Two were written before he was born, one in a single night, one on an exam floor, and the last one on a battlefield.",
    },
  },
} as const;

/* ── Kum katmanları — SAYFANIN KALBİ ────────────────────────────────────── */

export const GAARA_STRATA_UI = {
  listLabel: { tr: "Savunma katmanları", en: "Layers of defence" },
  layerWord: { tr: "katman", en: "layer" },
  costLabel: { tr: "Bedeli", en: "The price" },
  litLabel: { tr: "Yanan katman", en: "Layers lit" },
  keyboardHint: {
    tr: "Yukarı/aşağı ok tuşlarıyla da gezebilirsin; Home ilk, End son katmana gider.",
    en: "The up and down arrow keys work too; Home goes to the first layer, End to the last.",
  },
  sectionAlt: {
    tr: "Kum kesiti: yandan görünüm, üst üste beş kum tabakası. Seçilen tabaka ve altındakiler aydınlanır.",
    en: "Cross-section of sand: a side view of five stacked bands. The selected band and everything below it light up.",
  },
} as const;

/**
 * Beş tabaka — kesitte AŞAĞIDAN YUKARIYA dizilir.
 *
 * `order` 1 en alttaki (her zaman açık olan otomatik kalkan), 5 en üstteki
 * (Shukaku'nun kabuğu). Bir tabaka seçilince altındaki bütün tabakalar da
 * yanar: savunma birikimli, yani beşinci kat ilk dördünün üstünde duruyor.
 * DOM sırası 1→5 (tırmanış sırası, ekran okuyucunun okuduğu sıra); kesitin
 * ters dizilişi yalnızca CSS'te (`column-reverse`).
 */
export const GAARA_LAYERS = [
  {
    key: "tate" as const,
    imageKey: GAARA_IMAGE_KEYS.layer1,
    kanji: "砂の盾",
    name: "Suna no Tate",
    turkish: { tr: "Otomatik kum kalkanı", en: "Automatic sand shield" },
    tag: {
      tr: "İstemsiz. Gaara uyanık olmasa bile çalışır.",
      en: "Involuntary. It works even when he is not awake.",
    },
    text: {
      tr: "Kabaktaki kum tehlikeyi Gaara'dan önce görür ve araya girer. Kalkan bir karar değil bir reflekstir; sahibinin iradesinden bağımsız çalıştığı için Gaara yıllarca tek bir darbe yemedi. Köy ona bu yüzden dokunulmaz dedi — ve ilk kanadığı gün, Rock Lee beşinci kapıyı açtığında, aynı köy sustu.",
      en: "The sand in the gourd sees a threat before Gaara does and steps in. The shield is not a decision but a reflex, and because it works without his will he went years without taking a single hit. That is why the village called him untouchable — and why the same village went quiet the day he first bled, when Rock Lee opened the fifth gate.",
    },
    cost: {
      tr: "Kum onun yerine karar verdiği için Gaara tehlikeyi tanımayı hiç öğrenmedi.",
      en: "Because the sand decided for him, he never learned to recognise danger.",
    },
  },
  {
    key: "yoroi" as const,
    imageKey: GAARA_IMAGE_KEYS.layer2,
    kanji: "砂の鎧",
    name: "Suna no Yoroi",
    turkish: { tr: "Kum zırhı", en: "Sand armour" },
    tag: {
      tr: "İkinci deri: bedene yapışan ince bir kum tabakası.",
      en: "A second skin: a thin coat of sand pressed onto the body.",
    },
    text: {
      tr: "Kalkan aşıldığında ikinci kat devreye girer. Zırh otomatik değildir: Gaara onu bilinçli kurar ve ayakta tutmak sürekli çakra ister. Kırıldığında altından çatlamış, tozlu bir yüz çıkar — Chūnin sınavında önce Lee'nin tekmeleri, sonra Sasuke'nin Chidori'si o yüzü ilk kez açığa çıkardı.",
      en: "When the shield is beaten the second layer takes over. The armour is not automatic: he raises it deliberately and holding it up costs chakra without pause. When it breaks, a cracked and dusty face comes out from under it — during the Chūnin exam Lee's kicks and then Sasuke's Chidori uncovered that face for the first time.",
    },
    cost: {
      tr: "Kesintisiz çakra ve kesintisiz yorgunluk. Zırh Gaara'yı ağırlaştırır, yani onu koruyan şey aynı zamanda yavaşlatır.",
      en: "Chakra without pause, fatigue without pause. The armour weighs him down: the thing that protects him is the same thing that slows him.",
    },
  },
  {
    key: "tsunami" as const,
    imageKey: GAARA_IMAGE_KEYS.layer3,
    kanji: "砂瀑大瀑布",
    name: "Sabaku Daibakufu",
    turkish: { tr: "Kum tsunamisi", en: "Sand tsunami" },
    tag: {
      tr: "Savunma artık örtmüyor: bir dalga hâlinde yükseliyor.",
      en: "The defence stops covering and starts rising, as a wave.",
    },
    text: {
      tr: "Üçüncü katta kabağın kumu yetmez. Gaara ayağının bastığı toprağı çakrasıyla öğütüp kuma çevirir ve bütün araziyi tek bir dalgayla kaldırır. Ölçek artık bir bedeni değil bir yerleşimi kapsar: Deidara köyün üstüne bomba yağdırdığında Gaara'nın açtığı şey bir kalkan değil, kasabanın tamamını örten bir kum çatısıydı.",
      en: "At the third layer the gourd is not enough. He grinds the ground under his feet into sand with his own chakra and lifts the whole terrain in a single wave. The scale is no longer a body but a settlement: when Deidara rained bombs over the village, what Gaara raised was not a shield but a roof of sand over the entire town.",
    },
    cost: {
      tr: "Bu ölçekte kullanılan kum kabağın değil köyün toprağıdır — ve onu kaldırmak Gaara'yı dizlerinin üstüne düşürür.",
      en: "At this scale the sand is not the gourd's but the village's own ground — and lifting it drops him to his knees.",
    },
  },
  {
    key: "sabakusoso" as const,
    imageKey: GAARA_IMAGE_KEYS.layer4,
    kanji: "砂瀑送葬",
    name: "Sabaku Sōsō",
    turkish: { tr: "Çölün cenazesi", en: "Desert funeral" },
    tag: {
      tr: "Kum kapanır. Geriye ses kalmaz.",
      en: "The sand closes. No sound is left over.",
    },
    text: {
      tr: "Önce 砂縛柩 (Sabaku Kyū): kum hedefin çevresinde bir tabut gibi kapanır ve hareketi keser. Sonra Gaara avucunu kapatır. Tekniğin adı bir cenaze törenidir çünkü tam olarak odur — kum kanı bile dışarı bırakmaz. Bu katman hâlâ savunma sayılır, çünkü Gaara onu yalnızca ilk iki kat aşıldığında kullanır; sayıldığı yer ise sayfanın en tartışmalı satırıdır.",
      en: "First 砂縛柩 (Sabaku Kyū): the sand shuts around the target like a coffin and takes away movement. Then he closes his palm. The technique is named after a funeral rite because that is exactly what it is — the sand does not even let the blood out. It still counts as defence, since he reaches for it only when the first two layers have failed; whether it belongs here at all is the most arguable line on this page.",
    },
    cost: {
      tr: "Bu katmanda savunmayı cinayetten ayıran tek şey Gaara'nın o anki niyetidir.",
      en: "At this layer the only thing separating defence from murder is what he happens to intend.",
    },
  },
  {
    key: "shukaku" as const,
    imageKey: GAARA_IMAGE_KEYS.layer5,
    kanji: "守鶴",
    name: "Shukaku",
    turkish: { tr: "Shukaku'nun kabuğu", en: "Shukaku's shell" },
    tag: {
      tr: "Son kat: kum artık örtü değil, beden.",
      en: "The last layer: the sand stops being a cover and becomes a body.",
    },
    text: {
      tr: "Kum önce kolu, sonra yarım gövdeyi, sonunda tamamını kaplar ve dışarıya içeriden bir başkası bakar. Tam dönüşüm için Gaara'nın uyuması gerekir: 狸寝入りの術 (Tanuki Neiri no Jutsu) kendi bilincini uyutup Ichibi'yi sahaya çıkarır. Gaara'nın yıllarca uyumamasının sebebi de budur — uyku, savunmanın son katını onun elinden alıyordu.",
      en: "The sand takes the arm, then half the body, then all of it, and something else looks out from inside. The full transformation requires him to fall asleep: 狸寝入りの術 (Tanuki Neiri no Jutsu) puts his own mind to sleep and lets the One-Tail out. This is why he did not sleep for years — sleep handed the last layer of his defence to someone else.",
    },
    cost: {
      tr: "Bu kat açıldığında korunan kişi artık Gaara değildir; karşısında kimin durduğunun da bir önemi kalmaz.",
      en: "Once this layer opens, the one being protected is no longer Gaara — and it stops mattering who is standing in front of him.",
    },
  },
] as const;

/* ── Kumun grameri — üç büyük ───────────────────────────────────────────── */

export const GAARA_TECHNIQUES = [
  {
    key: "tate" as const,
    imageKey: GAARA_IMAGE_KEYS.tate,
    kanji: "砂の盾・砂の鎧",
    name: "Suna no Tate · Suna no Yoroi",
    turkish: { tr: "Kum Kalkanı · Kum Zırhı", en: "Sand Shield · Sand Armour" },
    tagline: {
      tr: "«Mutlak savunma» tek bir teknik değil, üst üste binen iki tekniktir.",
      en: "The «absolute defence» is not one technique but two, stacked.",
    },
    text: {
      tr: "Birincisi Gaara'nın iradesine sorulmadan çalışır: kum, sahibi tepki veremeden araya girer, üstelik hedefe ulaşmayı deneyen şeyin hızıyla orantılı sertleşir. İkincisi bilinçli kurulur ve bedenin üstüne ince bir kabuk olarak yapışır. Aradaki fark bu sayfanın en önemli ayrımı: birincisi Gaara'ya bir çocukluk boyunca dokunulmazlık verdi, ikincisi ise onu her an biraz daha yordu. Mutlak savunma yenilmez değildi — yalnızca yeterince hızlı, yeterince ağır ya da yeterince yakından gelen bir şeyi hiç görmemişti.",
      en: "The first works without asking him: the sand intervenes before he can react and hardens in proportion to whatever is trying to reach him. The second is raised deliberately and clings to the body as a thin crust. The distinction matters more than anything else on this page: the first gave him an untouchable childhood, the second wore him down a little more with every hour. The absolute defence was not unbeatable — it had simply never met something fast enough, heavy enough, or close enough.",
    },
    traits: [
      { tr: "Biri istemsiz, biri iradeli", en: "One reflex, one decision" },
      { tr: "Hıza göre sertleşir", en: "Hardens with speed" },
      { tr: "İkincisi çakra yakar", en: "The second burns chakra" },
    ],
  },
  {
    key: "sabaku" as const,
    imageKey: GAARA_IMAGE_KEYS.sabaku,
    kanji: "砂縛柩・砂瀑送葬",
    name: "Sabaku Kyū → Sabaku Sōsō",
    turkish: { tr: "Kum Tabutu → Çölün Cenazesi", en: "Sand Coffin → Desert Funeral" },
    tagline: {
      tr: "İki hamlelik bir cümle: önce kapan, sonra kapan.",
      en: "A sentence in two moves: first the trap, then the closing.",
    },
    text: {
      tr: "Sabaku Kyū hedefi kumla sarar; kaçış yollarını değil, hareketin kendisini alır. Sabaku Sōsō ise o tabutu kapatan tek bir el hareketidir. Gaara'nın en çok tekrarlanan görüntüsü budur: avucun havada kapanışı ve ardından gelen sessizlik. Chūnin sınavına kadar bu iki teknik onun için bir tartışmayı bitirme biçimiydi; sınavdan sonra kırk sekiz saatte bir kullanmadığı, tuttuğu ama kapatmadığı bir teknik oldu.",
      en: "Sabaku Kyū wraps the target in sand and takes away not the escape routes but movement itself. Sabaku Sōsō is the single gesture that shuts that coffin. It is his most repeated image: a palm closing in the air, and the silence after it. Until the Chūnin exam these two were his way of ending an argument; after it, they became something he holds without closing.",
    },
    traits: [
      { tr: "Önce bağla, sonra kapat", en: "Bind first, close after" },
      { tr: "Menzil kumun gittiği yer", en: "Range is wherever sand reaches" },
      { tr: "Tek el hareketi", en: "One gesture" },
    ],
  },
  {
    key: "jiton" as const,
    imageKey: GAARA_IMAGE_KEYS.jiton,
    kanji: "磁遁",
    name: "Jiton — Magnet Release",
    turkish: { tr: "Mıknatıs Salımı", en: "Magnet Release" },
    tagline: {
      tr: "Suna'nın kan mirası. Üç kuşak, üç ayrı malzeme — ve sürekli karıştırılan bir ayrım.",
      en: "Suna's bloodline. Three generations, three different materials — and a distinction that gets confused constantly.",
    },
    text: {
      tr: "Üçüncü Kazekage bu mirası DEMİR KUMUNA (砂鉄, satetsu) uyguladı ve köyün tarihindeki en güçlü şinobi sayıldı. Gaara'nın babası Dördüncü Kazekage Rasa ise ALTIN TOZUNU (砂金, sakin) taşıdı: Rasa'nın çevresinde havada asılı duran şey kum değil, altındı. Gaara'nınki ise ne demir ne altın — sıradan kum; ve onu tutan şey babasının kanından çok içine mühürlenen Shukaku'ya bağlanır. Dördüncü Büyük Şinobi Savaşı'nda baba ile oğul aynı cephede savaştı: altın toz ile kum aynı gökyüzünde asılı kaldı. Ağırlık babadan, hacim oğuldan.",
      en: "The Third Kazekage applied this bloodline to IRON SAND (砂鉄, satetsu) and was counted the strongest shinobi in the village's history. Gaara's father, the Fourth Kazekage Rasa, carried GOLD DUST (砂金, sakin): what hung in the air around Rasa was not sand but gold. Gaara's is neither iron nor gold — it is ordinary sand, and his grip on it owes less to his father's blood than to the One-Tail sealed inside him. In the Fourth Great Shinobi War father and son fought on the same front, and gold dust and sand hung in one sky. The weight came from the father, the volume from the son.",
    },
    traits: [
      { tr: "Suna'ya özgü kan mirası", en: "A bloodline only Suna has" },
      { tr: "Demir kum ≠ altın toz", en: "Iron sand ≠ gold dust" },
      { tr: "Gaara'nınki sıradan kum", en: "Gaara's is ordinary sand" },
    ],
  },
] as const;

/* ── Taşıdıkları — dört küçük ───────────────────────────────────────────── */

export const GAARA_KIT = [
  {
    key: "gourd" as const,
    imageKey: GAARA_IMAGE_KEYS.gourd,
    name: { tr: "Kum kabağı", en: "The sand gourd" },
    note: {
      tr: "Kabağın kendisi de kumdan: gerektiğinde çözülüp savunmaya katılır. İçindeki kum yıllar içinde Gaara'nın çakrasına alışmış, ondan hızlı tepki veren bir kumdur; bittiğinde ayağının altındaki toprağı öğütür ama o kum daha ağır, daha yavaş gelir.",
      en: "The gourd itself is sand too, and unravels into the defence when needed. The sand inside has spent years getting used to his chakra and answers faster than any other; when it runs out he grinds the ground beneath him, but that sand comes heavier and slower.",
    },
  },
  {
    key: "cloud" as const,
    imageKey: GAARA_IMAGE_KEYS.cloud,
    name: { tr: "Uçan kum bulutu", en: "The floating sand cloud" },
    note: {
      tr: "砂漠浮遊 (Sabaku Fuyū): kabaktan çıkan kum bir platform hâline gelir ve Gaara onun üstünde durur. Savaşlarının çoğunda ayakları yere değmez — yükseklik hem menzil hem mesafedir, ve mesafe onun için hep bir savunma biçimi olmuştur.",
      en: "砂漠浮遊 (Sabaku Fuyū): the sand leaves the gourd as a platform and he stands on it. In most of his fights his feet never touch the ground — height is both reach and distance, and distance was always a form of defence for him.",
    },
  },
  {
    key: "insomnia" as const,
    imageKey: GAARA_IMAGE_KEYS.insomnia,
    name: { tr: "Uykusuzluk", en: "Sleeplessness" },
    note: {
      tr: "Shukaku'nun bedeli. Gaara uyursa mühür gevşer ve Ichibi bilincin yerine geçer; bu yüzden çocukluğunun tamamına yakınını uyanık geçirdi. Gözlerinin çevresindeki halkalar makyaj değil, on iki yılın kaydıdır.",
      en: "The One-Tail's price. If he sleeps the seal loosens and the beast takes his place; so he spent nearly all of his childhood awake. The rings around his eyes are not make-up — they are the record of twelve years.",
    },
  },
  {
    key: "robe" as const,
    imageKey: GAARA_IMAGE_KEYS.robe,
    name: { tr: "Kazekage cübbesi", en: "The Kazekage robe" },
    note: {
      tr: "On beş yaşında, kendisinden yıllarca korkmuş bir köyün Beşinci Kazekage'si oldu. Cübbeyi giymek bir terfi değil bir savunma değişikliğiydi: korunacak olan artık kendisi değil, onu dışarıda bırakan insanlardı.",
      en: "At fifteen he became the Fifth Kazekage of a village that had feared him for years. Putting on the robe was not a promotion but a change of defence: the thing to be protected was no longer himself but the people who had kept him outside.",
    },
  },
] as const;

/* ── 愛 — sayfanın duygusal merkezi ─────────────────────────────────────── */

export const GAARA_AI = {
  glyphLabel: {
    tr: "愛 — «ai», sevgi. Gaara'nın alnına kendi kumuyla kazıdığı harf.",
    en: "愛 — «ai», love. The character Gaara carved into his own forehead with his sand.",
  },
  firstLine: {
    tr: "Bu harfi kendini sevebilmek için kazıdı: onu sevecek kimse kalmamıştı, o hâlde iş kendisine düşüyordu.",
    en: "He carved it so that he could love himself: no one was left to do it, so the work fell to him.",
  },
  secondLine: {
    tr: "Aynı harf yıllar sonra anlamını değiştirdi. Gaara harfi silmedi — sonunda başkalarını sevmeyi öğrendi ve yara olduğu yerde kaldı.",
    en: "Years later the same character changed meaning. He never removed it — he learned to love other people instead, and the scar stayed exactly where it was.",
  },
  footnote: {
    tr: "Yarayı kendi kumuyla açtı. Kalkan alnını korumadı, çünkü darbe dışarıdan gelmiyordu.",
    en: "He opened the wound with his own sand. The shield did not protect his forehead, because the blow was not coming from outside.",
  },
} as const;

/* ── Kimin için — dört portre ───────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[1662]` listesiyle birebir
 * aynı: 17 Naruto, 2174 Temari, 4694 Kankurō, 22920 Rasa. Portre kaydı
 * olmayan kişi adıyla çizilir, bölüm çökmez.
 *
 * `distance`: portrenin kesitteki uzaklığı — "far" olan yoldaş sayfada
 * daha soğuk ve daha uzakta durur (Rasa), "near" olan öne çıkar (Naruto).
 */
export const GAARA_COMPANIONS = [
  {
    characterId: 22920,
    name: "Rasa",
    distance: "far" as const,
    role: { tr: "Babası — Dördüncü Kazekage", en: "His father — the Fourth Kazekage" },
    note: {
      tr: "Oğlunu doğmadan önce bir silaha çevirdi: Shukaku, Gaara daha ana rahmindeyken içine mühürlendi. Altı yaşındayken onu öldürmeye karar verdi. Yıllar sonra savaş alanında diriltildiğinde ilk yaptığı şey özür dilemek oldu.",
      en: "He turned his son into a weapon before birth: Shukaku was sealed into Gaara while he was still unborn. At six, he decided to have him killed. Years later, brought back onto a battlefield, the first thing he did was apologise.",
    },
  },
  {
    characterId: 2174,
    name: "Temari",
    distance: "mid" as const,
    role: { tr: "Ablası", en: "His older sister" },
    note: {
      tr: "Yıllarca kardeşinin yanında konuşurken sesini alçalttı — korkudan. Chūnin sınavından sonra bu korkuyu bırakan ilk kişi oldu ve Gaara Kazekage olduğunda en sık onun yanında duran şinobi yine oydu.",
      en: "For years she lowered her voice beside her own brother, out of fear. After the Chūnin exam she was the first to put that fear down, and when he became Kazekage she was the shinobi most often standing next to him.",
    },
  },
  {
    characterId: 4694,
    name: "Kankurō",
    distance: "mid" as const,
    role: { tr: "Ağabeyi", en: "His older brother" },
    note: {
      tr: "Kardeşinden ablası kadar korktu, ama Akatsuki Gaara'yı kaçırdığında peşlerinden giden ilk kişi o oldu. Sasori'nin zehrini yedi ve ölümün eşiğinden ancak Chiyo'nun panzehiriyle döndü.",
      en: "He feared his brother as much as his sister did, yet when Akatsuki took Gaara he was the first to go after them. Sasori's poison nearly finished him; only Chiyo's antidote brought him back.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    distance: "near" as const,
    role: { tr: "Onu ikna eden", en: "The one who talked him out of it" },
    note: {
      tr: "Aynı yalnızlığı taşıyan, ondan zayıf ve çok daha inatçı bir çocuk. Gaara'nın savunmasını ilk kez dışarıdan bir teknik değil, içeriden bir soru aştı: aynı acıyı taşıyan biri neden başkaları için ayağa kalkıyordu? Gaara bu sorunun cevabını bulmak için hayatının geri kalanını harcadı.",
      en: "A boy carrying the same loneliness, weaker than him and far more stubborn. His defence was breached for the first time not by a technique from outside but by a question from within: why would someone with the same wound stand up for other people? Gaara spent the rest of his life answering it.",
    },
  },
] as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın ikisinde replik var
 * (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için satır
 * tipi burada açıkça yazıldı).
 */
export interface GaaraFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const GAARA_TIMELINE: GaaraFateEntry[] = [
  {
    key: "birth",
    imageKey: GAARA_IMAGE_KEYS.fateBirth,
    age: { tr: "Doğum", en: "Birth" },
    title: {
      tr: "Doğmadan mühürlendi, annesi doğumda öldü",
      en: "Sealed before birth, and his mother died bearing him",
    },
    text: {
      tr: "Sunagakure'nin Dördüncü Kazekage'si Rasa, köyüne bir caydırıcı güç lazım olduğuna karar verdi ve üçüncü çocuğunu daha doğmadan seçti: Ichibi no Shukaku, Gaara ana rahmindeyken içine mühürlendi. Mührü kuran Chiyo'ydu. Annesi Karura doğumda öldü; ölmeden önce çocuğuna «yalnızca kendini seven asura» anlamına gelen bir ad verdi. O günden sonra köy bebeğe değil, içindekine baktı.",
      en: "Rasa, the Fourth Kazekage of Sunagakure, decided his village needed a deterrent and chose his third child before that child was born: Ichibi no Shukaku was sealed into Gaara in the womb. Chiyo set the seal. His mother Karura died in childbirth, and before she went she gave him a name meaning «an asura who loves only himself». From that day on the village looked at what was inside the baby, not the baby.",
    },
  },
  {
    key: "yashamaru",
    imageKey: GAARA_IMAGE_KEYS.fateYashamaru,
    age: { tr: "6 yaş", en: "Age 6" },
    title: {
      tr: "Yashamaru gecesi ve alna kazınan harf",
      en: "The night of Yashamaru, and the letter cut into a forehead",
    },
    text: {
      tr: "Dayısı Yashamaru, Gaara'nın hayatındaki tek şefkatti; annesinin kardeşiydi ve çocuğa iyi davranan tek yetişkindi. Rasa'nın emriyle onu öldürmeye geldi. Başaramayınca kendini patlattı ve son sözleriyle çocuğa annesinin onu hiç sevmediğini söyledi. O gece Gaara kendi kumuyla alnına 愛 harfini kazıdı: madem kimse sevmeyecek, sevgiyi kendisi taşıyacaktı.",
      en: "His uncle Yashamaru was the only tenderness in his life — his mother's brother, and the one adult who treated the child kindly. On Rasa's order he came to kill him. When he failed he blew himself up, and with his last words he told the boy that his mother had never loved him. That night Gaara carved the character 愛 into his forehead with his own sand: if no one would love him, he would carry the love himself.",
    },
  },
  {
    key: "chunin",
    imageKey: GAARA_IMAGE_KEYS.fateChunin,
    age: { tr: "12 yaş", en: "Age 12" },
    title: { tr: "Chūnin sınavı ve Naruto", en: "The Chūnin exam, and Naruto" },
    text: {
      tr: "Konoha'ya bir sınav için geldi, aslında bir yıkım planının parçası olarak. Rock Lee beşinci kapıyı açtığında kalkanı ilk kez aşıldı; Sasuke'nin Chidori'si zırhı deldi ve Gaara ilk kez kendi kanını gördü. Ama onu asıl durduran teknik değildi. Ondan zayıf, aynı yalnızlığı taşıyan bir çocuk arkadaşları için ayağa kalktı ve Gaara kaybetmekten daha rahatsız edici bir şeyle karşılaştı: başka bir ihtimal.",
      en: "He came to Konoha for an exam, and in truth as part of a plan to level it. When Rock Lee opened the fifth gate his shield was beaten for the first time; Sasuke's Chidori punched through the armour and he saw his own blood. But it was not a technique that stopped him. A weaker boy carrying the same loneliness stood up for his friends, and Gaara met something more unsettling than defeat: an alternative.",
    },
    quote: {
      text: {
        tr: "Yalnızca kendimi severim, yalnızca kendim için savaşırım.",
        en: "I love only myself and I fight only for myself.",
      },
      by: { tr: "Gaara", en: "Gaara" },
    },
  },
  {
    key: "kazekage",
    imageKey: GAARA_IMAGE_KEYS.fateKazekage,
    age: { tr: "15 yaş", en: "Age 15" },
    title: { tr: "Kazekage oldu, sonra öldürüldü", en: "He became Kazekage, then he was killed" },
    text: {
      tr: "Köy onu Beşinci Kazekage seçti — yıllarca canavar dediği çocuğu. Akatsuki geldiğinde Gaara kasabanın üstünde tek başına durdu: Deidara'nın bombalarını kumla karşıladı, halkı korudu ve tam da bu yüzden yakalandı. Ichibi bedeninden çekilirken öldü. Onu geri isteyen ve peşinden giden köy, bir zamanlar kapısını yüzüne kapatan köydü.",
      en: "The village elected him Fifth Kazekage — the child it had called a monster for years. When Akatsuki came he stood over the town alone: he met Deidara's bombs with sand, kept the people safe, and was taken precisely because of it. He died as the One-Tail was pulled out of him. The village that wanted him back and went after him was the same one that had shut its door in his face.",
    },
  },
  {
    key: "alliance",
    imageKey: GAARA_IMAGE_KEYS.fateAlliance,
    age: { tr: "Sonrası", en: "After" },
    title: {
      tr: "Diriltilme ve ittifakın komutanlığı",
      en: "Brought back, and given a command",
    },
    text: {
      tr: "Shukaku'yu ona mühürleyen kuşağın son temsilcisi Chiyo, kendi hayatını vererek Gaara'yı geri getirdi: mührü kuran el, borcunu ödeyen el oldu. Dördüncü Büyük Şinobi Savaşı'nda beş köyün birleşik ordusunda Dördüncü Tümen'in komutanı olarak görev aldı. Cephede yaptığı konuşma savaşın en çok tekrarlanan sözü oldu — çünkü onu söyleyen, o beş köyün yıllarca dışladığı çocuktu.",
      en: "Chiyo — the last of the generation that had sealed Shukaku into him — gave her own life to bring him back: the hand that set the seal became the hand that paid for it. In the Fourth Great Shinobi War he served as commander of the Fourth Division of the allied army. The speech he gave at the front became the most repeated line of that war, because the one saying it was the child those five villages had kept outside.",
    },
    quote: {
      text: {
        tr: "Ortada ne Kum var ne Yaprak. Yalnızca şinobiler var.",
        en: "There is no Sand and no Leaf. There are only shinobi.",
      },
      by: { tr: "Gaara", en: "Gaara" },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const GAARA_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Yalnızca kendimi severim, yalnızca kendim için savaşırım.",
        en: "I love only myself and I fight only for myself.",
      },
      by: { tr: "Gaara", en: "Gaara" },
      note: {
        tr: "Altı yaşında verilmiş bir karar. Alnındaki harf de o gece kazındı.",
        en: "A decision taken at six. The letter on his forehead was cut the same night.",
      },
    },
    {
      text: {
        tr: "Ortada ne Kum var ne Yaprak. Yalnızca şinobiler var.",
        en: "There is no Sand and no Leaf. There are only shinobi.",
      },
      by: { tr: "Gaara", en: "Gaara" },
      note: {
        tr: "Aynı ağız, on yıl sonra, beş köyün ordusunun önünde. Kum hiç değişmedi; kimin için kalktığı değişti.",
        en: "The same mouth, ten years later, in front of the armies of five villages. The sand never changed; who it rose for did.",
      },
    },
  ],
  motto: "我愛羅",
  mottoNote: {
    tr: "Gaara — 我 (ben) · 愛 (sevgi) · 羅 (asura). Annesinin verdiği ad: yalnızca kendini seven asura.",
    en: "Gaara — 我 (self) · 愛 (love) · 羅 (asura). The name his mother gave him: an asura who loves only himself.",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, ikinci adlar) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; çöl ufku, kum kesiti, kum taneleri, tek gözlü siluet ve alındaki 愛 bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, alternative names) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the desert horizon, the sand cross-section, the grains, the one-eyed silhouette and the 愛 are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
