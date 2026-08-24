import type { LocalizedText } from "./types";

/**
 * Madara Uchiha — "Yükselen Ölçek" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi ve Shikamaru emsali): karaktere ait BÜTÜN anlatı kodda,
 * iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1). Görseller
 * veritabanında — characterId 53901 kaydının ABILITY yuvaları, `madara:*`
 * anahtarlarıyla. Yuva boşken bölüm görselsiz ama AYAKTA çizilir.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Madara'nın meselesi göz değil ÖLÇEK. Her aşamada dünya ona biraz daha
 * küçük geliyor: bir nehir kıyısı, bir klan, iki klanın savaş alanı, bir
 * köy, bütün dünya, ay. Sayfanın kalbi bu yüzden bir "yükselen basamaklar"
 * bölümü: kullanıcı alttan yukarı çıktıkça tipografi büyüyor, satır aralığı
 * açılıyor, boşluk genişliyor, kart sayısı azalıyor. En üstte tek cümle ve
 * kül kalıyor. Ölçüyü metin değil DÜZEN anlatıyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (24 Aralık), sınıflandırma (Missing-nin), meslek satırı
 * (Konohagakure'nin kurucu ortağı, Uchiha klan lideri) ve klan bilgisi
 * AniList künyesinden birebir alındı (`anilist-detay-22.json`, karakter
 * 53901). AniList kaydında yaş, boy ve kan grubu YOK — bu yüzden künye
 * şeridinde de yok. Uydurulmadı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik var, ikisi de Madara'ya ait ve ikisi de yaygın olarak
 * bilinen çeviriler. Emin olunmayan hiçbir cümle tırnak içine alınmadı;
 * dövüşlerin ve kararların ayrıntıları arşivin kendi anlatımı olarak düz
 * metin hâlinde yazıldı.
 *
 * ── RÜYA KATMANI (SONSUZ TSUKUYOMI) ──────────────────────────────────────
 * Mod açıkken sayfaya fazladan satırlar geliyor. Bu satırlar OLAN'ı değil
 * GÖSTERİLEN'i anlatıyor ve her biri "rüyada görülen" etiketiyle çiziliyor
 * (`MADARA_DREAM.tag`), üstelik modun kendisi bir uyarı satırı taşıyor.
 * Okuyucunun rüyayı kronolojiyle karıştırmaması bu sayfanın dürüstlük şartı.
 */

export const MADARA_ID = 53901;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MADARA_SITE_URL = "https://anilist.co/character/53901";

/**
 * Sergi görselleri — hepsi characterId 53901 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `madara:` önekli (kurator modu şartı).
 */
export const MADARA_IMAGE_KEYS = {
  /** Hero: soğuk, gri, geniş kadraj; figür küçük ve kenarda (16:9) */
  hero: "madara:hero",
  susanoo: "madara:susanoo",
  rinnegan: "madara:rinnegan",
  mokuton: "madara:mokuton",
  katon: "madara:katon",
  gunbai: "madara:gunbai",
  limbo: "madara:limbo",
  moonPlan: "madara:moon-plan",
  climb1: "madara:climb-1",
  climb2: "madara:climb-2",
  climb3: "madara:climb-3",
  climb4: "madara:climb-4",
  climb5: "madara:climb-5",
  fateRiver: "madara:fate-river",
  fateIzuna: "madara:fate-izuna",
  fateVillage: "madara:fate-village",
  fateValley: "madara:fate-valley",
  fateReturn: "madara:fate-return",
  closing: "madara:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const MADARA_SLOT_LABELS: Record<string, LocalizedText> = {
  [MADARA_IMAGE_KEYS.hero]: {
    tr: "Hero — soğuk gri geniş kadraj, kül yağarken (16:9)",
    en: "Hero — cold grey wide frame, falling ash (16:9)",
  },
  [MADARA_IMAGE_KEYS.susanoo]: {
    tr: "Tam bedenli Susanoo — dağ ölçeğinde siluet",
    en: "Complete Susanoo — a silhouette at mountain scale",
  },
  [MADARA_IMAGE_KEYS.rinnegan]: {
    tr: "Gedō Mazō — zincirlenmiş heykel",
    en: "Gedō Mazō — the chained statue",
  },
  [MADARA_IMAGE_KEYS.mokuton]: {
    tr: "Mokuton — bir vadiyi dolduran orman",
    en: "Mokuton — a forest filling a valley",
  },
  [MADARA_IMAGE_KEYS.katon]: {
    tr: "Katon: Gōka Mekkyaku — alev duvarı",
    en: "Katon: Gōka Mekkyaku — the wall of flame",
  },
  [MADARA_IMAGE_KEYS.gunbai]: {
    tr: "Gunbai — savaş yelpazesi, yakın plan",
    en: "Gunbai — the war fan, close up",
  },
  [MADARA_IMAGE_KEYS.limbo]: {
    tr: "Limbo — görünmeyen gölgelerin izi",
    en: "Limbo — the trace of the unseen shadows",
  },
  [MADARA_IMAGE_KEYS.moonPlan]: {
    tr: "Ay Gözü Planı — gökyüzündeki ay",
    en: "Eye of the Moon Plan — the moon in the sky",
  },
  [MADARA_IMAGE_KEYS.climb1]: {
    tr: "1. basamak — Nakano nehrinin kıyısı",
    en: "Step 1 — the bank of the Nakano river",
  },
  [MADARA_IMAGE_KEYS.climb2]: {
    tr: "2. basamak — Uchiha klanının önündeki lider",
    en: "Step 2 — the leader at the head of the Uchiha",
  },
  [MADARA_IMAGE_KEYS.climb3]: {
    tr: "3. basamak — iki klanın savaş alanı",
    en: "Step 3 — the battlefield of two clans",
  },
  [MADARA_IMAGE_KEYS.climb4]: {
    tr: "4. basamak — kurulan köy ve Sonun Vadisi",
    en: "Step 4 — the founded village and the Valley of the End",
  },
  [MADARA_IMAGE_KEYS.climb5]: {
    tr: "5. basamak — mağaradaki yıllar",
    en: "Step 5 — the years in the cave",
  },
  [MADARA_IMAGE_KEYS.fateRiver]: {
    tr: "Çizelge — nehirde sektirilen taş",
    en: "Timeline — the stone skipped across the river",
  },
  [MADARA_IMAGE_KEYS.fateIzuna]: {
    tr: "Çizelge — Izuna'nın son anı",
    en: "Timeline — Izuna's last moment",
  },
  [MADARA_IMAGE_KEYS.fateVillage]: {
    tr: "Çizelge — Konoha'nın kuruluşu",
    en: "Timeline — the founding of Konoha",
  },
  [MADARA_IMAGE_KEYS.fateValley]: {
    tr: "Çizelge — Sonun Vadisi",
    en: "Timeline — the Valley of the End",
  },
  [MADARA_IMAGE_KEYS.fateReturn]: {
    tr: "Çizelge — Edo Tensei ile dönüş",
    en: "Timeline — the return by Edo Tensei",
  },
  [MADARA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — kül ve ay",
    en: "Closing — ash and the moon",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const MADARA_IDENTITY = {
  name: "Madara Uchiha",
  nativeName: "うちはマダラ",
  /** Hero filigranı — klan adı, dekoratif (aria-hidden) */
  watermark: "うちは",
  clan: { tr: "Uchiha Klanı", en: "Uchiha Clan" },
  epigraph: {
    tr: "Hiçbir aşamada yenilmedi diye büyümedi. Her aşamada dünya ona biraz daha küçük geldi.",
    en: "He did not grow because he kept winning. At every stage the world simply got smaller around him.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "24 Aralık", en: "24 December" },
    },
    {
      label: { tr: "Klan", en: "Clan" },
      value: { tr: "Uchiha", en: "Uchiha" },
    },
    {
      label: { tr: "Sınıflandırma", en: "Classification" },
      value: { tr: "Kaçak nin", en: "Missing-nin" },
    },
    {
      label: { tr: "Unvan", en: "Office" },
      value: {
        tr: "Konohagakure'nin kurucu ortağı · Uchiha klan lideri",
        en: "Co-founder of Konohagakure · leader of the Uchiha clan",
      },
    },
    {
      label: { tr: "Kardeşi", en: "Brother" },
      value: {
        tr: "Izuna Uchiha — beş kardeşten sağ kalan tek biri",
        en: "Izuna Uchiha — the only one of five who lasted",
      },
    },
    {
      label: { tr: "Silahı", en: "Weapon" },
      value: {
        tr: "Gunbai — zincirli savaş yelpazesi",
        en: "Gunbai — a war fan on a chain",
      },
    },
    {
      label: { tr: "Gözün seyri", en: "The eye's course" },
      value: {
        tr: "Sharingan → Mangekyō → Ebedî Mangekyō → Rinnegan",
        en: "Sharingan → Mangekyō → Eternal Mangekyō → Rinnegan",
      },
    },
    {
      label: { tr: "Göründüğü yapımlar", en: "Appears in" },
      value: {
        tr: "Naruto · Naruto: Shippūden",
        en: "Naruto · Naruto: Shippūden",
      },
    },
  ],
  /**
   * AniList kaydında olmayanlar açıkça yazılıyor: künye şeridinde boş satır
   * bırakmak yerine eksikliğin kendisi bir satır oluyor (arşiv sesi).
   */
  missing: {
    tr: "AniList künyesinde yaş, boy ve kan grubu kaydı yok; bu yüzden burada da yok.",
    en: "The AniList record carries no age, height or blood type — so neither does this table.",
  },
} as const;

/* ── Mod düğmesi: Sonsuz Tsukuyomi ──────────────────────────────────────── */

export const MADARA_DREAM = {
  enter: { tr: "Sonsuz Tsukuyomi", en: "Infinite Tsukuyomi" },
  exit: { tr: "Rüyadan çık", en: "Leave the dream" },
  /** Mod açıkken görünen uyarı — dürüstlük şartı */
  notice: {
    tr: "Bu katman rüyanın gösterdiğidir: olan değil, gösterilen. Kronolojiye dâhil değildir.",
    en: "This layer is what the dream shows: not what happened, but what is shown. It is not part of the record.",
  },
  /** Her rüya satırının yanındaki etiket */
  tag: { tr: "rüyada görülen", en: "seen in the dream" },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const MADARA_HERO = {
  lede: {
    tr: "Savaşan Devletler döneminde doğdu, dört kardeşini gömdü, bir köy kurdu ve o köyün dışında kaldı. Kalan ömrünü dünyayı kendi ölçüsüne getirmeye harcadı.",
    en: "Born in the Warring States era, he buried four brothers, founded a village and was left outside it. He spent the rest of his life cutting the world down to his own measure.",
  },
  ashNote: {
    tr: "Sayfanın zemini soğuk ve gri; tek sıcaklık kalan kor.",
    en: "The ground of this page is cold and grey; the only warmth left is an ember.",
  },
  portraitAlt: {
    tr: "Madara Uchiha — arşive yüklenmiş kadro portresi",
    en: "Madara Uchiha — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Madara Uchiha — AniList künye portresi",
    en: "Madara Uchiha — AniList profile portrait",
  },
  dream: {
    tr: "Nehrin iki yakası yok; tek bir kıyı var ve iki çocuk hâlâ taş sektiriyor.",
    en: "The river has no two banks; there is one shore, and two boys are still skipping stones.",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §4.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin hepsi kendi veritabanımızdan (PORTRAIT yuvası).
 */
export const MADARA_ALT = {
  measureSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const MADARA_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const MADARA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Bir efsanenin kâğıt üstündeki hâli. Rakamların çoğu tutulmamış; tutulanlar bunlar.",
      en: "A legend as it looks on paper. Most of the numbers were never kept; these are the ones that were.",
    },
    dream: {
      tr: "Bu tabloda kaçak nin satırı yok. Uchiha adının yanında kimsenin çekincesi yok.",
      en: "In this table there is no missing-nin line, and no one hesitates beside the Uchiha name.",
    },
  },
  measures: {
    title: { tr: "Ölçüsü olanlar", en: "Those who were his measure" },
    lede: {
      tr: "Madara kendini hep bir başkasıyla ölçtü. Beş kişi: biri denk, biri bedel, ikisi araç, sonuncusu ölçüyü kıran.",
      en: "He always measured himself against someone else. Five people: one equal, one price, two instruments, and the last one who broke the scale.",
    },
    dream: {
      tr: "Beşi de aynı masada oturuyor ve hiçbiri ölmemiş.",
      en: "All five are at the same table, and not one of them has died.",
    },
  },
  arsenal: {
    title: { tr: "Üç büyük ölçek", en: "Three great scales" },
    lede: {
      tr: "Üç teknik, üç ayrı büyüklük: bir zırh, bir heykel, bir orman. Hiçbiri tek kişiyi hedef almıyor.",
      en: "Three techniques at three magnitudes: an armour, a statue, a forest. Not one of them is aimed at a single person.",
    },
    dream: {
      tr: "Kimsenin Susanoo'ya ihtiyacı yok; zırh bir müzede duruyor.",
      en: "Nobody needs a Susanoo here; the armour stands in a museum.",
    },
  },
  tools: {
    title: { tr: "Dört küçük ölçek", en: "Four smaller scales" },
    lede: {
      tr: "Elin altında duranlar: bir alev duvarı, bir yelpaze, görünmeyen dört gölge ve kâğıda yazılmış bir plan.",
      en: "What stayed within reach: a wall of flame, a fan, four unseen shadows, and a plan written down.",
    },
  },
  ascent: {
    title: { tr: "Yükselen basamaklar", en: "The rising steps" },
    lede: {
      tr: "Altı basamak, alttan yukarı. Her basamakta ölçü büyüyor ve sayfa seyrelip soğuyor: metin irileşiyor, boşluk açılıyor, kart azalıyor. En üstte tek cümle kalıyor.",
      en: "Six steps, from the bottom up. At every step the measure grows and the page thins out and cools: the type swells, the space opens, the cards drop away. At the top a single sentence is left.",
    },
    dream: {
      tr: "Basamak yok. Herkes zaten en üstte ve kimse tırmanmadı.",
      en: "There are no steps. Everyone is already at the top and no one had to climb.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The record of a fate" },
    lede: {
      tr: "Beş kayıt: bir tanışma, bir cenaze, bir kuruluş, bir yenilgi ve bir dönüş.",
      en: "Five entries: a meeting, a funeral, a founding, a defeat and a return.",
    },
    dream: {
      tr: "Bu çizelgenin beş satırı da boş; anlatılacak bir kayıp kalmamış.",
      en: "All five rows of this record are blank; no loss is left to enter.",
    },
  },
} as const;

/* ── Ölçüsü olanlar (yoldaş portreleri) ─────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[53901]` listesiyle birebir
 * aynı: 12464 Hashirama, 3149 Obito, 3180 Nagato, 16406 Izuna, 17 Naruto.
 * Portre kaydı olmayan kişi adıyla çizilir, bölüm çökmez.
 */
export const MADARA_MEASURES = [
  {
    characterId: 12464,
    name: "Hashirama Senju",
    weight: "equal" as const,
    role: { tr: "Tek denk", en: "The only equal" },
    note: {
      tr: "Çocukken nehrin karşı kıyısındaki arkadaşı, sonra tek gerçek rakibi. Madara'nın bütün ölçüleri onun boyuna göre ayarlandı; öldükten sonra bile hücreleri ölçünün parçası olarak kaldı.",
      en: "The friend on the far bank in childhood, then the only true rival. Every measure Madara used was cut to this man's height — and after his death his cells stayed part of the measure.",
    },
  },
  {
    characterId: 16406,
    name: "Izuna Uchiha",
    weight: "price" as const,
    role: { tr: "Ödenen bedel", en: "The price paid" },
    note: {
      tr: "Küçük kardeşi ve yanındaki son kişi. Mangekyō'nun körlüğü geldiğinde Izuna gözlerini ona bıraktı; Madara bir daha karanlık görmedi ama kardeşi de kalmadı.",
      en: "His younger brother and the last person beside him. When the Mangekyō's blindness came, Izuna left him his eyes; Madara never saw darkness again — and never had a brother again either.",
    },
  },
  {
    characterId: 3149,
    name: "Obito Uchiha",
    weight: "tool" as const,
    role: { tr: "Devreden el", en: "The hand he handed off to" },
    note: {
      tr: "Ölmek üzereyken kurtardığı çocuk. Madara planı ona yazdırmadı, ona taşıttı: yıllarca kendi adıyla dolaşan biri oldu ve mağarada bırakılan hesabı yürüttü.",
      en: "The boy he pulled out of a rockfall. Madara did not have him draft the plan, only carry it: for years someone walked the world under Madara's name and ran the arithmetic left behind in a cave.",
    },
  },
  {
    characterId: 3180,
    name: "Nagato",
    weight: "tool" as const,
    role: { tr: "Ödünç verilen gözler", en: "The eyes he lent out" },
    note: {
      tr: "Rinnegan çocuk yaşta ona nakledildi; Nagato o gözlerin kendisine ait olduğunu sanarak bir ömür kullandı. Planın en uzun vadeli hamlesi buydu: göz sahibini bekledi.",
      en: "The Rinnegan was placed in him as a child, and Nagato spent a lifetime using eyes he believed were his own. It was the plan's most patient move: the eyes waited for their owner.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    weight: "break" as const,
    role: { tr: "Ölçüyü kıran", en: "The one who broke the scale" },
    note: {
      tr: "Madara'nın hesabında böyle bir kalem yoktu: gücü tek başına taşımayan, paylaşan biri. Ölçek yarışını kaybettiği için değil, yarışın kuralı değiştiği için durdu.",
      en: "No line in Madara's arithmetic accounted for him: someone who does not carry power alone but hands it out. The scaling contest ended not because he lost it, but because its rule changed.",
    },
  },
] as const;

/* ── Üç büyük ölçek ─────────────────────────────────────────────────────── */

export const MADARA_ARSENAL = [
  {
    key: "susanoo" as const,
    imageKey: MADARA_IMAGE_KEYS.susanoo,
    kanji: "須佐能乎",
    name: "Susanoo",
    turkish: { tr: "Tam bedenli hâl", en: "The complete body" },
    tagline: {
      tr: "Çakradan bir dev: kaburgadan başlayıp bir dağ boyuna çıkan zırh.",
      en: "A giant made of chakra: armour that starts at a ribcage and ends at the height of a mountain.",
    },
    text: {
      tr: "Mangekyō'nun iki gözü birden açıldığında beliren dev savaşçı. Çoğu kullanıcı iskelet ya da yarım gövdede kalır; Madara onu tam bedene çıkardı ve dört kolla, birden çok kılıçla kullandı. Ölçek meselesi tam da burada görünür: Susanoo tek bir rakibi vurmak için değil, karşıdaki ordunun ne kadar küçük olduğunu göstermek için çizilmiştir.",
      en: "The giant warrior that appears when both Mangekyō eyes open. Most users never get past a skeleton or a half torso; Madara took it to a complete body and fought with several arms and several blades. The question of scale shows itself exactly here: a Susanoo is not drawn to strike one opponent, but to show how small the army opposite it is.",
    },
    traits: [
      { tr: "Tam beden", en: "Complete body" },
      { tr: "Dağ ölçeğinde", en: "At mountain scale" },
      { tr: "Kurama'nın üstünde", en: "Mounted on Kurama" },
    ],
  },
  {
    key: "rinnegan" as const,
    imageKey: MADARA_IMAGE_KEYS.rinnegan,
    kanji: "外道魔像",
    name: "Rinnegan · Gedō Mazō",
    turkish: { tr: "Çağrılan heykel", en: "The statue he called up" },
    tagline: {
      tr: "Ömrünün sonuna doğru açılan göz ve o gözün çağırdığı şey.",
      en: "The eye that opened near the end of his life — and the thing that eye can summon.",
    },
    text: {
      tr: "Rinnegan, Madara'da doğuştan değil sonradan uyandı: yıllarca Hashirama'nın hücreleriyle yaşadıktan sonra, artık savaşamayacak kadar yaşlıyken. İşe yarar tarafı bir dövüş üstünlüğü değildi; on kuyruklunun kabuğu olan Gedō Mazō'yu çağırabilmekti. Bir kişinin gücü orada biter, bir sistemin gücü orada başlar.",
      en: "Madara's Rinnegan was not inborn; it woke late, after years of living with Hashirama's cells, when he was already too old to fight. Its value was never an edge in combat — it was the ability to summon the Gedō Mazō, the husk of the Ten-Tails. That is where one man's strength ends and a system's begins.",
    },
    traits: [
      { tr: "Geç uyandı", en: "Woke late" },
      { tr: "Hashirama hücresiyle", en: "By way of Hashirama's cells" },
      { tr: "Heykeli çağırır", en: "Summons the statue" },
    ],
  },
  {
    key: "mokuton" as const,
    imageKey: MADARA_IMAGE_KEYS.mokuton,
    kanji: "木遁",
    name: "Mokuton",
    turkish: { tr: "Ödünç alınan miras", en: "The borrowed inheritance" },
    tagline: {
      tr: "Rakibinin kanından yapılmış bir yetenek — ve bir vadiyi dolduran orman.",
      en: "A gift made out of his rival's flesh — and a forest that fills a valley.",
    },
    text: {
      tr: "Ahşap salımı Senju'nun kan mirasıydı ve hiçbir Uchiha'ya geçmedi. Madara bunu istisna yaptı: Sonun Vadisi'nde Hashirama'nın hücrelerini alıp kendi bedenine yerleştirdi. Aradan geçen yıllarda o hücreler hem Rinnegan'ı açtı hem de ona bir savaş alanını tek hamlede ormana çeviren tekniği kazandırdı. Rakibini yenemeyince ondan bir parça aldı.",
      en: "Wood release was the Senju bloodline and it passed to no Uchiha. Madara made himself the exception: at the Valley of the End he took Hashirama's cells and put them in his own body. Over the years those cells opened the Rinnegan and gave him the technique that turns a battlefield into a forest in one motion. Unable to beat his rival, he took a piece of him instead.",
    },
    traits: [
      { tr: "Senju kan mirası", en: "A Senju bloodline" },
      { tr: "Nakledilmiş", en: "Transplanted" },
      { tr: "Araziyi değiştirir", en: "Rewrites the terrain" },
    ],
  },
] as const;

/* ── Dört küçük ölçek ───────────────────────────────────────────────────── */

export const MADARA_TOOLS = [
  {
    key: "katon" as const,
    imageKey: MADARA_IMAGE_KEYS.katon,
    name: { tr: "Katon: Gōka Mekkyaku", en: "Katon: Gōka Mekkyaku" },
    note: {
      tr: "Uchiha'nın ateşi tek bir top hâlinde değil, önündeki her şeyi silen bir duvar hâlinde çıkar. Bir bölgeyi yok saymanın en kısa yolu.",
      en: "The Uchiha fire does not leave as a single ball but as a wall that erases whatever stands in front of it. The shortest way to write off a whole area.",
    },
  },
  {
    key: "gunbai" as const,
    imageKey: MADARA_IMAGE_KEYS.gunbai,
    name: { tr: "Gunbai", en: "Gunbai" },
    note: {
      tr: "Zincire bağlı savaş yelpazesi: hem kalkan, hem sopa, hem de rakibin saldırısını olduğu gibi geri gönderen bir yüzey. Madara'nın elindeki en eski alet.",
      en: "A war fan on a chain: a shield, a club, and a surface that returns an attack exactly as it came. The oldest instrument in his hands.",
    },
  },
  {
    key: "limbo" as const,
    imageKey: MADARA_IMAGE_KEYS.limbo,
    name: { tr: "Limbo: Hengoku", en: "Limbo: Border Jail" },
    note: {
      tr: "Rinnegan'ın açtığı komşu düzlemde duran gölge klonları. Vururlar, tutarlar, engellerler — ama Altı Yol çakrasını görmeyen biri onları hiç göremez.",
      en: "Shadow clones standing on the neighbouring plane the Rinnegan opens. They strike, hold and block — and anyone without Six Paths chakra never sees them at all.",
    },
  },
  {
    key: "moonPlan" as const,
    imageKey: MADARA_IMAGE_KEYS.moonPlan,
    name: { tr: "Ay Gözü Planı", en: "Eye of the Moon Plan" },
    note: {
      tr: "Bir teknik değil, bir kurgu: on kuyrukluyu toplamak, gözü aya çevirmek ve herkesi aynı anda uyutmak. Madara'nın en büyük ölçekli işi kâğıda yazılmış olanıdır.",
      en: "Not a technique but a construction: gather the Ten-Tails, turn the eye onto the moon, put everyone to sleep at once. His largest-scale work is the one that was written down.",
    },
  },
] as const;

/* ── Yükselen basamaklar — sayfanın kalbi ───────────────────────────────── */

export const MADARA_CLIMB_UI = {
  railLabel: { tr: "Altı basamak", en: "Six steps" },
  stepWord: { tr: "basamak", en: "step" },
  up: { tr: "Bir basamak yukarı", en: "One step up" },
  down: { tr: "Bir basamak aşağı", en: "One step down" },
  scaleLabel: { tr: "O anda dünyası", en: "His world at that moment" },
  keyboardHint: {
    tr: "Yukarı ve aşağı ok tuşlarıyla da tırmanabilirsin; Home en alta, End en üste gider.",
    en: "The up and down arrow keys climb too; Home returns to the bottom, End goes to the top.",
  },
} as const;

/** Bir basamağın küçük kartı — üst basamaklarda sayıları azalıyor. */
export interface MadaraStepCard {
  title: LocalizedText;
  note: LocalizedText;
}

export interface MadaraStep {
  key: string;
  imageKey?: string;
  /** Basamağın kendi ölçüsü — merdiven basamağının etiketi */
  reach: LocalizedText;
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  cards: MadaraStepCard[];
}

/**
 * Altı basamak. Kart sayısı bilerek düşüyor: 5 → 4 → 3 → 2 → 1 → 0.
 * Metinler de kısalıyor; en üstte tek cümle kalıyor. Bu bir üslup süsü
 * değil, bölümün mekaniğinin kendisi (bkz. dosya başı).
 */
export const MADARA_STEPS: MadaraStep[] = [
  {
    key: "child",
    imageKey: MADARA_IMAGE_KEYS.climb1,
    reach: { tr: "bir nehir kıyısı", en: "one river bank" },
    era: { tr: "Savaşan Devletler dönemi · çocukluk", en: "Warring States era · childhood" },
    title: { tr: "Nehrin iki yakası", en: "Two banks of one river" },
    text: {
      tr: "O dönemde çocukluk diye ayrı bir yaş yoktu: klanlar çocuklarını asker olarak sahaya sürüyordu ve kimse kaç yaşında olduğunu değil, kaç kardeşinin kaldığını sayıyordu. Madara beş kardeşin en büyüğüydü; dördünü sırayla gömdü. Nakano nehrinin kıyısında taş sektirirken tanıştığı yaşıtı da aynı işi yapıyordu — iki çocuk soyadlarını söylemeden arkadaş oldu, çünkü soyadı söylenirse arkadaşlık bitecekti.",
      en: "Childhood was not a separate age then: clans sent their children into the field as soldiers, and nobody counted years — they counted how many brothers were left. Madara was the eldest of five; he buried four of them. The boy his own age he met skipping stones by the Nakano river was doing exactly the same thing. The two became friends without giving surnames, because the surname would have ended it.",
    },
    cards: [
      {
        title: { tr: "Tajima Uchiha", en: "Tajima Uchiha" },
        note: {
          tr: "Babası ve klan reisi. Oğullarını evlat olarak değil, sıradaki asker olarak yetiştirdi.",
          en: "His father and the clan head, who raised his sons not as children but as the next soldiers in line.",
        },
      },
      {
        title: { tr: "Dört mezar", en: "Four graves" },
        note: {
          tr: "Beş kardeşten dördü savaşta öldü. Sağ kalan tek kardeş Izuna'ydı.",
          en: "Four of the five brothers died in the fighting. The one who lasted was Izuna.",
        },
      },
      {
        title: { tr: "İlk Sharingan", en: "The first Sharingan" },
        note: {
          tr: "Gözleri çocuk yaşta, kayıpla açıldı — Uchiha'da yeteneğin bedeli hep aynıdır.",
          en: "His eyes opened young, and through loss — in the Uchiha the price of talent is always the same.",
        },
      },
      {
        title: { tr: "Sektirilen taş", en: "The skipped stone" },
        note: {
          tr: "Nehirde kaç sıçrama yapılacağına dair bir yarış. İki düşman klanın çocukları böyle tanıştı.",
          en: "A contest over how many skips a stone could take. That is how the children of two enemy clans met.",
        },
      },
      {
        title: { tr: "Söylenmeyen soyadı", en: "The unspoken surname" },
        note: {
          tr: "Uchiha ve Senju. İkisi de tahmin etti, ikisi de bir süre söylemedi.",
          en: "Uchiha and Senju. Both guessed it, and for a while neither said it.",
        },
      },
    ],
  },
  {
    key: "clan",
    imageKey: MADARA_IMAGE_KEYS.climb2,
    reach: { tr: "bir klan", en: "one clan" },
    era: { tr: "Klan liderliği", en: "Leadership of the clan" },
    title: { tr: "Klanın önüne geçmek", en: "Stepping in front of the clan" },
    text: {
      tr: "Babasının ardından Uchiha'nın başına geçti ve klan onu tartışmasız kabul etti: kimse Madara kadar kazanmıyordu. Ölçü büyümüştü — artık kendi hayatı değil, bir klanın hayatta kalma oranı hesaplanıyordu. Aynı yıllarda karşı kıyıdaki arkadaşının adı da öğrenilmişti; iki çocuk aynı savaş alanında, iki klanın önünde karşılaştı.",
      en: "After his father he took the head of the Uchiha, and the clan accepted him without argument: nobody won as often as Madara did. The measure had grown — what he now calculated was not his own life but a clan's survival rate. In the same years the name of the friend on the far bank had come out, and the two boys met again on a battlefield, each in front of a clan.",
    },
    cards: [
      {
        title: { tr: "Klan reisliği", en: "Head of the clan" },
        note: {
          tr: "En güçlü olduğu için değil, en çok geri döndüğü için seçildi.",
          en: "Chosen not because he was the strongest, but because he came back the most often.",
        },
      },
      {
        title: { tr: "Uchiha ile Senju", en: "Uchiha and Senju" },
        note: {
          tr: "Dönemin en büyük iki klanı. Aralarındaki savaşın başlangıcını kimse hatırlamıyordu.",
          en: "The two largest clans of the era, in a war whose beginning nobody could remember.",
        },
      },
      {
        title: { tr: "Karşı taraftaki arkadaş", en: "The friend on the other side" },
        note: {
          tr: "Hashirama'nın adı öğrenildiğinde arkadaşlık bitmedi, sadece savaş alanına taşındı.",
          en: "Learning Hashirama's name did not end the friendship; it only moved it onto the battlefield.",
        },
      },
      {
        title: { tr: "Bitmeyen hesap", en: "The account that never closed" },
        note: {
          tr: "Her galibiyet ertesi gün yeni bir cenaze getirdi. Kazanmak bir çözüm değildi.",
          en: "Every victory brought a new funeral the next day. Winning was not a solution.",
        },
      },
    ],
  },
  {
    key: "eyes",
    imageKey: MADARA_IMAGE_KEYS.climb3,
    reach: { tr: "iki klanın savaş alanı", en: "the battlefield of two clans" },
    era: { tr: "Mangekyō ve Ebedî Mangekyō", en: "Mangekyō and the Eternal Mangekyō" },
    title: { tr: "Görmek için ödenen bedel", en: "What sight cost" },
    text: {
      tr: "Kayıp Uchiha'da gözü açar: Mangekyō, kardeşlerinin ardından geldi. Ama bu gözün kendi cezası var — kullandıkça ışığı alır. Madara körlüğe yaklaştığında Izuna gözlerini ona bıraktı. Ebedî Mangekyō'yla artık ne kararan bir görüş ne de yanında bir kardeş vardı.",
      en: "In the Uchiha, loss opens the eye: the Mangekyō came after his brothers. But that eye carries its own sentence — every use takes some of the light. As Madara approached blindness, Izuna left him his eyes. With the Eternal Mangekyō there was no more dimming sight, and no more brother either.",
    },
    cards: [
      {
        title: { tr: "Mangekyō Sharingan", en: "Mangekyō Sharingan" },
        note: {
          tr: "Bedeli ödenmiş göz. Uchiha'da açılış anı hep bir cenazeye denk gelir.",
          en: "The eye whose price is paid in advance. In the Uchiha it always opens on the day of a funeral.",
        },
      },
      {
        title: { tr: "Kararan görüş", en: "The dimming sight" },
        note: {
          tr: "Aşırı kullanım ışığı alır. Klanın en güçlüsü kör olmaya en yakın olandı.",
          en: "Overuse takes the light. The strongest of the clan was the one closest to blindness.",
        },
      },
      {
        title: { tr: "Izuna'nın gözleri", en: "Izuna's eyes" },
        note: {
          tr: "Kardeşinin bıraktığı göz Ebedî Mangekyō'yu açtı: sonsuz görüş, tek seferlik bedel.",
          en: "His brother's eyes opened the Eternal Mangekyō: sight without end, paid for once.",
        },
      },
    ],
  },
  {
    key: "village",
    imageKey: MADARA_IMAGE_KEYS.climb4,
    reach: { tr: "bir köy, sonra bir vadi", en: "a village, then a valley" },
    era: { tr: "Konoha'nın kuruluşu · Sonun Vadisi", en: "The founding of Konoha · the Valley of the End" },
    title: { tr: "Kurduğu şeyin dışında kalmak", en: "Left outside the thing he built" },
    text: {
      tr: "Barışı iki eski arkadaş imzaladı ve iki klan aynı çatı altına girdi: Konohagakure. Köy Hokage olarak Hashirama'yı seçti; Madara bunu bir tercih değil, Uchiha'nın geleceğine dair bir işaret saydı. Kimse onu ikna edemedi. Köyü terk etti, Dokuz Kuyruklu'yla döndü ve vadide yenildi — sonra öldüğü sanıldı.",
      en: "Two old friends signed the peace and two clans moved under one roof: Konohagakure. The village chose Hashirama as Hokage; Madara read that not as a preference but as a verdict on the Uchiha's future. No one could talk him out of it. He left, came back with the Nine-Tails, lost in the valley — and was believed dead.",
    },
    cards: [
      {
        title: { tr: "Konohagakure", en: "Konohagakure" },
        note: {
          tr: "Kurucularından biri oldu, sonra kurduğu köyün ilk kaçağı.",
          en: "He was one of its founders, then the first defector from the village he founded.",
        },
      },
      {
        title: { tr: "Sonun Vadisi", en: "The Valley of the End" },
        note: {
          tr: "Yenilgi kesin, ölüm sahteydi. Ayrılırken rakibinin hücrelerini yanına aldı.",
          en: "The defeat was real, the death was not. On his way out he took his rival's cells with him.",
        },
      },
    ],
  },
  {
    key: "plan",
    imageKey: MADARA_IMAGE_KEYS.climb5,
    reach: { tr: "bütün dünya", en: "the whole world" },
    era: { tr: "Ölü sayıldığı yıllar", en: "The years he was counted dead" },
    title: { tr: "Bir mağarada kurulan hesap", en: "An account drawn up in a cave" },
    text: {
      tr: "Yıllarca bir mağarada, kendi bedeninde büyüttüğü yabancı hücrelerle yaşadı. Rinnegan orada açıldı, heykel oradan çağrıldı, plan orada yazıldı ve ölürken bir başkasının eline verildi. Artık ölçü bir klan ya da bir köy değildi: hesabın birimi dünyanın tamamıydı.",
      en: "For years he lived in a cave with another man's cells growing inside his body. The Rinnegan opened there, the statue was summoned there, the plan was written there and handed to someone else as he died. The unit of measure was no longer a clan or a village: it was the whole world.",
    },
    cards: [
      {
        title: { tr: "Ay Gözü Planı", en: "Eye of the Moon Plan" },
        note: {
          tr: "Tek kart kaldı, çünkü bu aşamada tek bir iş vardı: herkesi aynı anda uyutacak kurguyu kurmak.",
          en: "Only one card is left, because at this stage there was only one piece of work: building the construction that puts everyone to sleep at once.",
        },
      },
    ],
  },
  {
    key: "juubi",
    reach: { tr: "ay", en: "the moon" },
    era: { tr: "Jūbi jinchūriki", en: "Jinchūriki of the Ten-Tails" },
    title: { tr: "Ölçü kalmadı", en: "No measure left" },
    text: {
      tr: "Ölçecek bir şey kalmadığında geriye tek bir yüzey kaldı: gökyüzü — ve o da artık onun rüyasını gösteriyordu.",
      en: "When there was nothing left to measure against, one surface remained: the sky — and it was showing his dream.",
    },
    cards: [],
  },
];

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel; `age` alanı Madara'da YAŞ değil DÖNEM
 * taşıyor — AniList kaydında yaş yok ve kaynaklarda güvenilir bir sayı
 * bulunmuyor, uydurmak yerine dönem yazıldı (BRIEF §9).
 */
export interface MadaraFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const MADARA_TIMELINE: MadaraFateEntry[] = [
  {
    key: "river",
    imageKey: MADARA_IMAGE_KEYS.fateRiver,
    age: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Nakano nehrinde bir arkadaş", en: "A friend at the Nakano river" },
    text: {
      tr: "Taş sektirme yarışında tanıştığı çocukla, iki düşman klanın çocuğu olduklarını bilmeden arkadaş oldular. İkisi de aynı şeyi anlattı: kardeşlerini gömmekten yorulmuşlardı ve çocukların savaşa sürülmediği bir yer hayal ediyorlardı. Konoha fikri bu kıyıda doğdu — ve aynı kıyıda ikisinin de babası ötekini öldürmelerini emretti.",
      en: "They met over a stone-skipping contest and became friends without knowing they belonged to enemy clans. Both said the same thing: they were tired of burying brothers and imagined a place where children were not sent to war. The idea of Konoha was born on that bank — and on the same bank each boy's father ordered him to kill the other.",
    },
  },
  {
    key: "izuna",
    imageKey: MADARA_IMAGE_KEYS.fateIzuna,
    age: { tr: "Gençlik", en: "Youth" },
    title: { tr: "Izuna'nın ölümü ve Ebedî Mangekyō", en: "Izuna's death and the Eternal Mangekyō" },
    text: {
      tr: "Kardeşinin ölümü Madara'nın son bağını kopardı ve aynı anda ona sınırsız bir göz bıraktı. Ebedî Mangekyō'dan sonra karşısında duran hiç kimse onu yormadı; ama savaş alanına giderken artık kimseyi geride bırakmıyordu, çünkü geride kimse kalmamıştı.",
      en: "His brother's death cut his last tie and, in the same motion, left him an eye without limits. After the Eternal Mangekyō no opponent tired him; but he no longer left anyone behind when he went to the field, because there was no one left behind.",
    },
  },
  {
    key: "village",
    imageKey: MADARA_IMAGE_KEYS.fateVillage,
    age: { tr: "Kuruluş", en: "The founding" },
    title: { tr: "Köyün kuruluşu ve kaybedilen liderlik", en: "The village founded, the leadership lost" },
    text: {
      tr: "Barış imzalandı, klanlar tek bir köye taşındı ve köy ilk Hokage'sini seçti: Hashirama. Madara için bu bir oylama sonucu değil, Uchiha'nın köyün içindeki yerine dair bir cevaptı. Uyarılarını kimse ciddiye almadı; ısrar edince de kendi kurduğu yerde yabancı sayıldı.",
      en: "The peace was signed, the clans moved into a single village, and the village chose its first Hokage: Hashirama. To Madara that was not the outcome of a vote but an answer about where the Uchiha would stand inside it. Nobody took his warnings seriously, and when he pressed them he became a stranger in the place he had built.",
    },
  },
  {
    key: "valley",
    imageKey: MADARA_IMAGE_KEYS.fateValley,
    age: { tr: "Sonun Vadisi", en: "The Valley of the End" },
    title: { tr: "Yenilgi ve sahte ölüm", en: "Defeat, and a death that was not one" },
    text: {
      tr: "Köyden ayrıldıktan sonra Dokuz Kuyruklu'yu alıp geri döndü ve vadide Hashirama'yla son kez karşılaştı. Kaybetti. Ölümü herkesin gördüğü şeydi; yaptığı şeyse kimsenin görmediği: rakibinin hücrelerini alıp kendi bedeninde saklamak. Sonraki bütün planları o gizli yaranın üstüne kuruldu.",
      en: "After leaving the village he took the Nine-Tails and came back, and met Hashirama for the last time in the valley. He lost. His death was the part everyone saw; what nobody saw was the part he did — taking his rival's cells and hiding them in his own body. Every later plan was built on that concealed wound.",
    },
  },
  {
    key: "return",
    imageKey: MADARA_IMAGE_KEYS.fateReturn,
    age: { tr: "Dördüncü Savaş", en: "The Fourth War" },
    title: { tr: "Edo Tensei, Rinnegan ve Jūbi", en: "Edo Tensei, the Rinnegan and the Ten-Tails" },
    text: {
      tr: "Ölülerden çağrıldı, sonra çağıranın bağını kendi eliyle çözdü. Rinnegan'ıyla heykeli topladı, on kuyruklunun kabına dönüştü ve Sonsuz Tsukuyomi'yi başlattı. Ölçek yolculuğunun sonu buydu: bir nehir kıyısında başlayan hesap, göğe asılmış tek bir göze indirgendi.",
      en: "He was called back from the dead, then untied the summoner's leash himself. With the Rinnegan he assembled the statue, became the vessel of the Ten-Tails and set the Infinite Tsukuyomi going. That was the end of the journey in scale: an account that opened on a river bank was reduced to a single eye hung in the sky.",
    },
    quote: {
      text: {
        tr: "Gerçeğe uyan. Bu lanetli dünyada hiçbir şey planlandığı gibi gitmez.",
        en: "Wake up to reality. Nothing ever goes as planned in this accursed world.",
      },
      by: { tr: "Madara Uchiha", en: "Madara Uchiha" },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const MADARA_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Bu dünyada ışığın olduğu her yerde gölge de vardır.",
        en: "In this world, wherever there is light, there are also shadows.",
      },
      by: { tr: "Madara Uchiha", en: "Madara Uchiha" },
      note: {
        tr: "Bir teselli değil, bir ölçü cümlesi: kazananın olduğu yerde kaybedenin de sayılması gerektiğini söylüyor.",
        en: "Not a consolation but a statement of measure: where there are winners, the losers have to be counted too.",
      },
    },
    {
      text: {
        tr: "Gerçeğe uyan. Bu lanetli dünyada hiçbir şey planlandığı gibi gitmez.",
        en: "Wake up to reality. Nothing ever goes as planned in this accursed world.",
      },
      by: { tr: "Madara Uchiha", en: "Madara Uchiha" },
      note: {
        tr: "Kendi planına da uyguladı: yazdığı hesabın sonunu, onu yürüten kişi bile göremedi.",
        en: "It applied to his own plan as well: not even the man who ran it got to see how the arithmetic ended.",
      },
    },
  ],
  motto: "無限月読",
  mottoNote: {
    tr: "Mugen Tsukuyomi — “Sonsuz Ay Okuma”",
    en: "Mugen Tsukuyomi — “Infinite Moon Reading”",
  },
  dream: {
    tr: "Burada kimse uyanmıyor ve kimse kimseyi ölçmüyor.",
    en: "Here nobody wakes, and nobody measures anybody.",
  },
  credit: {
    tr: "Künye verileri (doğum günü, klan, sınıflandırma, unvan) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; kül serpintisi, saç silueti, ay işareti, gunbai, Susanoo iskeleti ve rüya kökleri bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, clan, classification, office) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the falling ash, the hair silhouette, the moon mark, the gunbai, the Susanoo frame and the dream roots are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
