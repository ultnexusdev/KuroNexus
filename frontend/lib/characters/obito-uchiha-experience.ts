import type { LocalizedText } from "./types";

/**
 * Obito Uchiha — "Maskenin Ardındaki İsim" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 3149 kaydının ABILITY yuvaları,
 * `obito:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Bu karakterin dosyası dört ad taşıyor ve adlar üst üste duruyor. Sayfa
 * onları bir yığın gibi kuruyor: dıştan içe "Tobi" → "Madara" → "Kimse" →
 * "Obito". Ziyaretçi bir katman seçtiğinde yalnızca maskenin saydamlığı
 * değişmiyor, SAYFANIN DİLİ de değişiyor: bölüm başlıkları ve giriş
 * cümleleri o adın ağzından yeniden yazılıyor. Bu yüzden aşağıdaki her
 * bölüm başlığı tek bir metin değil, dört sesli bir `VoiceText`.
 *
 * ── ADIN KAYNAĞI ─────────────────────────────────────────────────────────
 * AniList bu numarayı "Tobi" (トビ) adıyla tutuyor — yani maskeli hâliyle.
 * Sayfa GERÇEK adı taşıyor (Obito Uchiha / うちはオビト); AniList'in adı
 * künye şeridinde ayrı bir satır olarak duruyor. `detail.character.name`
 * bilinçli olarak başlıkta KULLANILMIYOR (bkz. ObitoExperience.tsx).
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (10 Şubat), boy (175–182 cm), kan grubu (O), yaş (31) ve
 * alternatif adlar listesi AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 3149). Kilo kayıtta YOK, künyede de
 * yok. Klan, takım ve simge satırları serinin kendi bilgisi.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA iki replik var ve ikisi de konuşanına
 * atfedilmiş (kapanış bölümü). Ad katmanlarının "ses" satırları tırnak
 * içinde DEĞİL: onlar arşivin o personayı özetleyen kendi cümleleri, bir
 * diyalog alıntısı değil. Emin olunmayan hiçbir cümle repliğe çevrilmedi.
 */

export const OBITO_ID = 3149;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const OBITO_SITE_URL = "https://anilist.co/character/3149";

/* ── Ad katmanları ──────────────────────────────────────────────────────── */

/**
 * Dört ad katmanı. Sıra DIŞTAN İÇE: en dışta maskenin bağırdığı ad, en
 * içte kimsenin uzun süre söylemediği ad. Kronolojik sıra DEĞİL — sayfa
 * bir zaman çizelgesi değil, bir soyma işlemi.
 *
 * `veil` maskenin o katmandaki kalınlığı (1 = maske tam, 0 = maske yok).
 * Sayı burada durmuyor: CSS `.page[data-voice="…"]` üzerinden aynı değeri
 * yeniden yazıyor — burada yalnızca belgeleme amacıyla listelendi ki veri
 * dosyasını okuyan kişi sıranın anlamını görsün.
 */
export type ObitoVoice = "tobi" | "madara" | "none" | "obito";

export const OBITO_VOICES: readonly ObitoVoice[] = [
  "tobi",
  "madara",
  "none",
  "obito",
];

/** Aynı metnin dört ağızdan söylenmiş hâli. */
export type VoiceText = Record<ObitoVoice, LocalizedText>;

export interface ObitoLayer {
  key: ObitoVoice;
  /** Katmanın adı. Üçü özel ad (çevrilmez); "Kimse" bir ad değil, yokluk. */
  label: LocalizedText;
  /** Dekoratif (aria-hidden) — katmanın Japoncası */
  native: string;
  role: LocalizedText;
  /** Personanın kendi kaydı — tırnak içinde DEĞİL, arşivin özeti */
  voice: LocalizedText;
  note: LocalizedText;
}

export const OBITO_LAYERS: ObitoLayer[] = [
  {
    key: "tobi",
    label: { tr: "Tobi", en: "Tobi" },
    native: "トビ",
    role: { tr: "Akatsuki'nin çaylağı", en: "Akatsuki's newcomer" },
    voice: { tr: "Tobi iyi çocuktur.", en: "Tobi is a good boy." },
    note: {
      tr: "Sesi yüksek, hareketleri sakar, cümleleri kendi adıyla kurulu. Örgütün en tehlikeli adamı yıllarca en zararsız üyesi gibi göründü: düşmek, çarpmak ve ortadan kaybolmak, faz geçişiyle aynı harekete benziyor. Kimse maskenin altında bir plan olabileceğini düşünmedi, çünkü düşünmemeleri için elinden gelen her şeyi yaptı.",
      en: "Loud, clumsy, forever speaking of himself in the third person. For years the most dangerous man in the organisation looked like its most harmless member: tripping, colliding and vanishing all look the same as phasing out of matter. Nobody suspected a plan under the mask, because he worked very hard to make sure they wouldn't.",
    },
  },
  {
    key: "madara",
    label: { tr: "Madara", en: "Madara" },
    native: "マダラ",
    role: { tr: "Ödünç alınan ad", en: "The borrowed name" },
    voice: { tr: "Ben Madara Uchiha'yım.", en: "I am Madara Uchiha." },
    note: {
      tr: "Ölü bir efsanenin adını taktı, çünkü kendi adı kimsede bir karşılık uyandırmıyordu. Beş Kage'nin karşısına o adla çıktı, savaşı o adla ilan etti, bir dünyayı o adla tehdit etti. Adın gerçek sahibi bütün bunları bir mezardan izliyor ve kendi planının yürüdüğünü görüyordu.",
      en: "He put on a dead legend's name, because his own name meant nothing to anyone. He stood before the five Kage under it, declared a war under it, threatened a world under it. The name's actual owner watched all of this from a grave, and saw his own plan walking.",
    },
  },
  {
    key: "none",
    label: { tr: "Kimse", en: "No One" },
    native: "誰でもない",
    role: { tr: "Adın gerekmediği yıllar", en: "The years a name stopped mattering" },
    voice: { tr: "Bir ada ihtiyacım yok.", en: "I have no need of a name." },
    note: {
      tr: "Maskeyle yüz arasında kalan uzun boşluk. Ne Tobi'nin gürültüsü ne Madara'nın ağırlığı: yalnızca bir plan ve onu yürüten bir beden. Ad, kaybedecek bir şeyi olanlara lazımdır — bu katmanda kaybedilecek hiçbir şey kalmamıştı. AniList künyesi bu hâli bugün hâlâ ayrı bir ad olarak kaydediyor: “No One”.",
      en: "The long gap between the mask and the face. Neither Tobi's noise nor Madara's weight: only a plan, and a body carrying it. A name is for those with something left to lose, and at this layer nothing was left. The AniList record still files this state as a name of its own: “No One”.",
    },
  },
  {
    key: "obito",
    label: { tr: "Obito", en: "Obito" },
    native: "オビト",
    role: { tr: "Altta kalan ad", en: "The name underneath" },
    voice: { tr: "Ben Uchiha Obito'yum.", en: "I am Obito Uchiha." },
    note: {
      tr: "Konoha'da doğdu, derse hep geç kaldı, gecikmelerinin sebebi genellikle yolda birine yardım etmesiydi, Hokage olmak istedi ve bunu söylerken kimse gülmeyi bırakmadı. On üç yaşında bir kayanın altında kaldı; o günden sonra yıllarca kimse ona bu adla seslenmedi. Maske düştüğünde karşısındaki adam adı hatırladı — ve sayfa da o yüzden bu adı taşıyor.",
      en: "Born in Konoha, always late to class, usually because he had stopped to help someone on the way; he wanted to be Hokage, and nobody stopped laughing when he said it. At thirteen he was pinned under a rock, and for years afterwards nobody called him by this name. When the mask came off, the man in front of him remembered it — which is why this page carries it.",
    },
  },
];

/* ── Görsel yuvaları ────────────────────────────────────────────────────── */

/**
 * Sergi görselleri — hepsi characterId 3149 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `obito:` önekli (küratör modu şartı).
 *
 * ⚠️ Bu karakterde `akatsuki:obito` anahtarlı bir görsel ZATEN var; o
 * Akatsuki sayfasına ait. Önek ayrımı sayesinde çakışma yok.
 */
export const OBITO_IMAGE_KEYS = {
  /** Hero zemini — geniş, karanlık, figür küçük (16:9) */
  hero: "obito:hero",
  /** Maskenin ALTINDAKİ yüz: dar kadraj, yara izli sağ taraf görünür */
  face: "obito:face",
  kamui: "obito:kamui",
  mokuton: "obito:mokuton",
  jubi: "obito:jubi",
  izanagi: "obito:izanagi",
  gedo: "obito:gedo",
  yagura: "obito:yagura",
  moonEye: "obito:moon-eye",
  kannabi: "obito:kannabi",
  eye: "obito:eye",
  fateAcademy: "obito:fate-academy",
  fateKannabi: "obito:fate-kannabi",
  fateRin: "obito:fate-rin",
  fateMask: "obito:fate-mask",
  fateWar: "obito:fate-war",
  closing: "obito:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const OBITO_SLOT_LABELS: Record<string, LocalizedText> = {
  [OBITO_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş karanlık kadraj, maskeli figür küçük (16:9)",
    en: "Hero — wide dark frame, masked figure small (16:9)",
  },
  [OBITO_IMAGE_KEYS.face]: {
    tr: "Maskenin altındaki yüz — dar kadraj, sağ taraftaki yara izleri görünsün (1:1)",
    en: "The face under the mask — tight crop, the scarring on his right side visible (1:1)",
  },
  [OBITO_IMAGE_KEYS.kamui]: {
    tr: "Kamui — girdaba çekilen beden ya da faz geçişi anı",
    en: "Kamui — the body drawn into the spiral, or the moment of phasing",
  },
  [OBITO_IMAGE_KEYS.mokuton]: {
    tr: "Mokuton ve Rinnegan — ahşap dallar, halkalı göz",
    en: "Mokuton and Rinnegan — wooden growth, the ringed eye",
  },
  [OBITO_IMAGE_KEYS.jubi]: {
    tr: "Jūbi jinchūriki biçimi — tam gövde",
    en: "The Ten-Tails jinchūriki form — full body",
  },
  [OBITO_IMAGE_KEYS.izanagi]: {
    tr: "Izanagi — kapanan Sharingan",
    en: "Izanagi — the closing Sharingan",
  },
  [OBITO_IMAGE_KEYS.gedo]: {
    tr: "Gedō Mazō — zincirli heykel",
    en: "Gedō Mazō — the chained statue",
  },
  [OBITO_IMAGE_KEYS.yagura]: {
    tr: "Yagura'nın gözündeki kontrol",
    en: "The control behind Yagura's eye",
  },
  [OBITO_IMAGE_KEYS.moonEye]: {
    tr: "Ay Gözü Planı — ayın yüzeyindeki göz",
    en: "The Eye of the Moon Plan — the eye on the moon's face",
  },
  [OBITO_IMAGE_KEYS.kannabi]: {
    tr: "Kannabi Köprüsü — çöken mağara, kayanın altındaki taraf",
    en: "The Kannabi Bridge — the collapsing cave, the side under the rock",
  },
  [OBITO_IMAGE_KEYS.eye]: {
    tr: "Kakashi'ye verilen sol göz — nakil anı",
    en: "The left eye given to Kakashi — the transplant",
  },
  [OBITO_IMAGE_KEYS.fateAcademy]: {
    tr: "Akademi — geç kalan, gözlüklü çocuk",
    en: "The Academy — the late boy in goggles",
  },
  [OBITO_IMAGE_KEYS.fateKannabi]: {
    tr: "Kannabi — üç kişilik takımın son fotoğrafı",
    en: "Kannabi — the last picture of a three-person team",
  },
  [OBITO_IMAGE_KEYS.fateRin]: {
    tr: "Rin'in ölümü — yağmur",
    en: "Rin's death — the rain",
  },
  [OBITO_IMAGE_KEYS.fateMask]: {
    tr: "Maskeli yıllar — Akatsuki pelerini",
    en: "The masked years — the Akatsuki cloak",
  },
  [OBITO_IMAGE_KEYS.fateWar]: {
    tr: "Son savaş — kırılan maske",
    en: "The last battle — the broken mask",
  },
  [OBITO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş maske, ışığa dönük",
    en: "Closing — the empty mask, turned toward the light",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const OBITO_IDENTITY = {
  /** AniList "Tobi" diyor; sayfa gerçek adı taşıyor (bkz. dosya başı) */
  name: "Obito Uchiha",
  nativeName: "うちはオビト",
  /** Hero filigranı — AniList'in alternatif ad listesinden, dekoratif */
  watermark: "仮面の男",
  clan: { tr: "Uchiha Klanı", en: "Uchiha Clan" },
  epigraph: {
    tr: "Dört adı vardı ve üçü de onu bir başkasından saklamak için takılmıştı.",
    en: "He had four names, and three of them were worn to hide him from somebody.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "10 Şubat", en: "10 February" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "175–182 cm", en: "175–182 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "31 (savaş sırasında)", en: "31 (at the time of the war)" },
    },
    {
      label: { tr: "Klan", en: "Clan" },
      value: { tr: "Uchiha", en: "Uchiha" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Minato'nun takımı — Kakashi, Rin",
        en: "Minato's squad — Kakashi, Rin",
      },
    },
    {
      label: { tr: "AniList adı", en: "AniList name" },
      value: {
        tr: "“Tobi” (トビ) — künye maskeyi kaydetmiş",
        en: "“Tobi” (トビ) — the record filed the mask",
      },
    },
    {
      label: { tr: "Künyedeki öteki adlar", en: "Other names on file" },
      value: {
        tr: "Kamen no Otoko (仮面の男) · Masked Man · No One · Kyūseishu (救世主)",
        en: "Kamen no Otoko (仮面の男) · Masked Man · No One · Kyūseishu (救世主)",
      },
    },
    {
      label: { tr: "Simge", en: "Emblem" },
      value: {
        tr: "Turuncu spiral maske; altında bir çift gözlük",
        en: "An orange spiral mask; a pair of goggles underneath",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const OBITO_FALL_TEXT = {
  enter: { tr: "Maske düşüyor", en: "The mask falls" },
  exit: { tr: "Maskeyi geri tak", en: "Put the mask back" },
  hint: {
    tr: "Maske tamamen kalktı: yara izleri görünür, sayfaya umut tonu geri geldi. Hangi adın sesiyle okuduğun değişmedi.",
    en: "The mask is off: the scarring shows and the page's warm tone is back. Whose voice you are reading in has not changed.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const OBITO_HERO = {
  lede: {
    tr: "On üç yaşında bir kayanın altında kaldı, gözünü arkadaşına verdi ve öldüğü sanıldı. On sekiz yıl sonra aynı çocuk, dünyayı uyutmak için bir savaş başlattı.",
    en: "At thirteen he was pinned under a rock, gave his eye to his friend, and was believed dead. Eighteen years later that same boy started a war to put the world to sleep.",
  },
  portraitAlt: {
    tr: "Obito Uchiha — arşive yüklenmiş kadro portresi",
    en: "Obito Uchiha — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Obito Uchiha — AniList künye portresi (künyede “Tobi” adıyla kayıtlı)",
    en: "Obito Uchiha — AniList profile portrait (filed under the name “Tobi”)",
  },
  swirlAlt: {
    tr: "Kamui girdabı şeması: kare bir spiralden kopup dağılan parçalar",
    en: "Kamui spiral diagram: fragments breaking away from a square spiral",
  },
} as const;

/** Görsel alt metinleri — BRIEF §4.5: her alt iki dilli ve kaynağını söyler. */
export const OBITO_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
  faceAlt: {
    tr: "Maskenin altındaki yüz — arşive yüklenmiş görsel",
    en: "The face under the mask — image uploaded to the archive",
  },
} as const;

export const OBITO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

/* ── Ad yığını (sayfanın kalbi) ─────────────────────────────────────────── */

export const OBITO_STACK_UI = {
  title: { tr: "Adın katmanları", en: "The layers of a name" },
  lede: {
    tr: "Dıştan içe dört ad. Birini seç: maske o kadar incelir, altındaki yüz o kadar görünür ve sayfanın geri kalanı o adın ağzından yeniden yazılır.",
    en: "Four names, outermost first. Choose one: the mask thins by that much, the face beneath shows by that much, and the rest of the page is rewritten in that name's voice.",
  },
  listLabel: { tr: "Ad katmanları", en: "Name layers" },
  maskAlt: {
    tr: "Elle çizilmiş spiral maske şeması: seçilen katman derinleştikçe spiral dıştan içe çözülür ve altındaki yüz açılır.",
    en: "Hand-drawn spiral mask diagram: as the chosen layer goes deeper, the spiral unwinds from the outside and the face beneath opens up.",
  },
  layerWord: { tr: "katman", en: "layer" },
  voiceLabel: { tr: "Bu adın sesi", en: "This name's voice" },
  keyboardHint: {
    tr: "Yukarı/aşağı ok tuşlarıyla da katman değiştirebilirsin.",
    en: "The up and down arrow keys change layers too.",
  },
  depthLabel: { tr: "Maskenin kalınlığı", en: "Thickness of the mask" },
} as const;

/* ── Dört sesli bölüm başlıkları ────────────────────────────────────────── */

export interface ObitoSection {
  title: VoiceText;
  lede: VoiceText;
}

export const OBITO_SECTIONS: Record<
  "identity" | "heard" | "lab" | "kannabi" | "fate",
  ObitoSection
> = {
  identity: {
    title: {
      tobi: { tr: "Tobi'nin künyesi", en: "Tobi's file" },
      madara: { tr: "Bir kabuğun ölçüleri", en: "Measurements of a shell" },
      none: { tr: "Boş dosya", en: "An empty file" },
      obito: { tr: "Benim künyem", en: "My own record" },
    },
    lede: {
      tobi: {
        tr: "Tobi'nin dosyası kısadır: adı Tobi, işi Tobi olmak, gerisi senpai'nin problemi.",
        en: "Tobi's file is short: name Tobi, occupation being Tobi, everything else is senpai's problem.",
      },
      madara: {
        tr: "Bu bedenin rakamları önemsiz. Tek anlamlı ölçü, plana kaç yıl dayandığıdır.",
        en: "The numbers of this body are of no consequence. The only meaningful measurement is how many years it held the plan.",
      },
      none: {
        tr: "Bir boy. Bir kan grubu. Bir tarih. Hiçbiri bir araya gelip bir kişi etmiyor.",
        en: "A height. A blood type. A date. None of them add up to a person.",
      },
      obito: {
        tr: "On üçüme kadar hepsi doğruydu: yaş, boy, doğum günü, takım. Sonrasında geriye yalnızca rakamlar kaldı.",
        en: "Up to the age of thirteen all of it was true: age, height, birthday, squad. After that only the numbers were left.",
      },
    },
  },
  heard: {
    title: {
      tobi: { tr: "Tobi'yi tanıyanlar", en: "People who knew Tobi" },
      madara: { tr: "Beni bu adla çağıranlar", en: "Those who called me by this name" },
      none: { tr: "Çağıran kimse yok", en: "No one calling" },
      obito: { tr: "Adımı bilen beş kişi", en: "Five people who knew my name" },
    },
    lede: {
      tobi: {
        tr: "Tobi'nin tanıdığı çoktur. Hiçbiri Tobi'nin kim olduğunu bilmez ve bu Tobi'yi hiç üzmez.",
        en: "Tobi knows lots of people. Not one of them knows who Tobi is, and that never once upset Tobi.",
      },
      madara: {
        tr: "Bir adı yeterince uzun taşırsan o adın düşmanları da, korkuları da sana geçer. Bedava gelen tek miras budur.",
        en: "Carry a name long enough and its enemies — and the fear it carries — transfer to you. It is the only inheritance that costs nothing.",
      },
      none: {
        tr: "Bu adla kimse çağrılmıyor. Çağıran olmayınca dönüp bakmak da gerekmiyor.",
        en: "Nobody is called by this name. With no one calling, there is no need to turn around.",
      },
      obito: {
        tr: "Beş kişi. Üçü ona kendi adıyla seslendi, biri ona takması için bir ad verdi, sonuncusu da adını en sonunda geri verdi.",
        en: "Five people. Three called him by his own name, one handed him a name to wear, and the last one gave the name back at the end.",
      },
    },
  },
  lab: {
    title: {
      tobi: { tr: "Tobi'nin numaraları", en: "Tobi's little tricks" },
      madara: { tr: "Ödünç alınan güçler", en: "Borrowed powers" },
      none: { tr: "Sahibi olmayan güçler", en: "Powers without an owner" },
      obito: { tr: "Elimde kalanlar", en: "What was left in my hands" },
    },
    lede: {
      tobi: {
        tr: "Tobi hiçbir şey yapamaz. Tobi sadece düşer, çarpar ve kaybolur. Sonra yine ortaya çıkar. Hepsi bu.",
        en: "Tobi can't do anything. Tobi just trips, bumps into things and disappears. Then he turns up again. That's all.",
      },
      madara: {
        tr: "Hiçbiri doğuştan değildi: orman bir ölünün hücrelerinden, halkalı göz bir başkasının bedeninden, dev heykel de bir mezardan geldi.",
        en: "None of it was born in him: the forest came from a dead man's cells, the ringed eye from another man's body, the great statue from a grave.",
      },
      none: {
        tr: "Bu tekniklerin hepsi çalışıyor. Hiçbiri kimseye ait değil.",
        en: "Every one of these techniques works. Not one of them belongs to anybody.",
      },
      obito: {
        tr: "Bir gözüm Kakashi'de kaldı. Geri kalan her şeyi başkalarından aldım ve hiçbiri o gözün yerini tutmadı.",
        en: "One of my eyes stayed with Kakashi. Everything else I took from other people, and none of it ever replaced that eye.",
      },
    },
  },
  kannabi: {
    title: {
      tobi: { tr: "Tobi'nin bilmediği yer", en: "The place Tobi doesn't know about" },
      madara: { tr: "Kayanın altında bulduğum çocuk", en: "The boy I found under the rock" },
      none: { tr: "Buradan sonrası yok", en: "Nothing continues past here" },
      obito: { tr: "Kannabi Köprüsü", en: "The Kannabi Bridge" },
    },
    lede: {
      tobi: {
        tr: "Tobi bu bölümü atlamak ister. Tobi burayı hatırlamaz. Tobi hiçbir şeyi hatırlamaz.",
        en: "Tobi would like to skip this part. Tobi doesn't remember this place. Tobi doesn't remember anything.",
      },
      madara: {
        tr: "Bir bedenin yarısı ezilmişti; kalan yarısı kullanılabilir durumdaydı. Kurtarmak dediğiniz şey budur.",
        en: "Half a body had been crushed; the remaining half was serviceable. That is what you people call a rescue.",
      },
      none: {
        tr: "Kaya düştü. Altında kalan kişi bir daha ayağa kalkmadı; kalkan başkasıydı.",
        en: "The rock came down. The person underneath never stood up again; someone else did.",
      },
      obito: {
        tr: "Sağ tarafım kayanın altındaydı ve acımıyordu bile. Sadece Kakashi'nin yüzünü görebiliyordum, onu da yarım.",
        en: "My right side was under the rock and it didn't even hurt. All I could see was Kakashi's face, and only half of that.",
      },
    },
  },
  fate: {
    title: {
      tobi: { tr: "Tobi'nin hikâyesi", en: "Tobi's story" },
      madara: { tr: "Planın takvimi", en: "The plan's calendar" },
      none: { tr: "Tarihler", en: "Dates" },
      obito: { tr: "Benim ömrüm", en: "My life, in five entries" },
    },
    lede: {
      tobi: {
        tr: "Bir varmış bir yokmuş. Sonu güzel bitiyor, söz. Tobi öyle diyorsa öyledir.",
        en: "Once upon a time. It ends happily, promise. If Tobi says so then so it is.",
      },
      madara: {
        tr: "Beş tarih. Hiçbiri onun seçimi değildi; her biri zamanı geldiğinde oldu.",
        en: "Five dates. Not one of them was his choice; each happened when its time came.",
      },
      none: {
        tr: "Beş kayıt. Aralarında kimse yok.",
        en: "Five entries. Nobody in between them.",
      },
      obito: {
        tr: "Geç kalmakla başladı. Bir kere, bir tek kere zamanında yetişebilseydim, gerisi hiç olmayacaktı.",
        en: "It started with being late. If I had arrived on time once — just once — none of the rest would have happened.",
      },
    },
  },
};

/* ── Adını bilenler ─────────────────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3149]` listesiyle birebir
 * aynı: 85 Kakashi, 14082 Rin, 2535 Minato, 53901 Madara, 17 Naruto.
 * Portre kaydı olmayan kişi adıyla çizilir, bölüm çökmez.
 *
 * `knew`: bu kişinin hangi ad katmanlarıyla karşılaştığı. Bölüm seçili
 * katmana göre kendini yeniden diziyor — bu yüzden liste dekorasyon değil,
 * sayfanın mekaniğinin bir parçası.
 */
export interface ObitoWitness {
  characterId: number;
  name: string;
  knew: ObitoVoice[];
  role: LocalizedText;
  note: LocalizedText;
}

export const OBITO_WITNESSES: ObitoWitness[] = [
  {
    characterId: 85,
    name: "Kakashi Hatake",
    knew: ["tobi", "madara", "none", "obito"],
    role: { tr: "Dördünü de gören tek kişi", en: "The only one who met all four" },
    note: {
      tr: "Takım arkadaşıydı, sonra yıllarca yasını tuttu, sonra maskeli adamla dövüştü, sonunda maskeyi kırdı ve altında çocukluk arkadaşını buldu. Sol gözünde on sekiz yıl boyunca Obito'nun Sharingan'ını taşıdı.",
      en: "He was his teammate, then mourned him for years, then fought the masked man, and finally broke the mask and found his childhood friend under it. For eighteen years he carried Obito's Sharingan in his left eye.",
    },
  },
  {
    characterId: 14082,
    name: "Rin Nohara",
    knew: ["obito"],
    role: { tr: "Yalnızca Obito'yu tanıdı", en: "She only ever knew Obito" },
    note: {
      tr: "Takımın üçüncü üyesi ve Obito'nun sevdiği kişi. Gözü Kakashi'ye nakleden eller onunkiydi. Öldüğü an sayfadaki bütün öteki adların başladığı andır — ve o adların hiçbirini duymadı.",
      en: "The third member of the squad, and the person Obito loved. Hers were the hands that transplanted the eye into Kakashi. The moment she died is the moment every other name on this page begins — and she heard none of them.",
    },
  },
  {
    characterId: 2535,
    name: "Minato Namikaze",
    knew: ["obito"],
    role: { tr: "Öğretmeni", en: "His teacher" },
    note: {
      tr: "Takımın ustası ve Dördüncü Hokage. Obito'nun olmak istediği şeyin canlı hâliydi. Yıllar sonra maskeli adamla Konoha'nın üstünde karşılaştı ve karşısındakinin kim olduğunu asla öğrenemedi.",
      en: "The squad's teacher and the Fourth Hokage — the living version of what Obito wanted to become. Years later he faced the masked man above Konoha, and never learned who he was facing.",
    },
  },
  {
    characterId: 53901,
    name: "Madara Uchiha",
    knew: ["madara", "none", "obito"],
    role: { tr: "Adını ödünç veren", en: "The one who lent the name" },
    note: {
      tr: "Kayanın altındaki çocuğu bulan ve ona yeni bir sağ taraf veren kişi. Karşılığında bir plan, bir örgüt ve takması için kendi adını verdi. Bu sayfadaki tek borç ilişkisi budur.",
      en: "The one who found the boy under the rock and gave him a new right side. In return he handed over a plan, an organisation, and his own name to wear. It is the only debt on this page.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    knew: ["tobi", "madara", "obito"],
    role: { tr: "Adı geri veren", en: "The one who gave the name back" },
    note: {
      tr: "Önce Tobi'yle, sonra Madara adını taşıyan adamla dövüştü. Maskeyi kıran darbe onundu. Savaşın sonunda karşısındaki kişiye çocukluk hayalini hatırlattı ve onu geri çevirdi.",
      en: "He fought Tobi first, then the man carrying Madara's name. The blow that broke the mask was his. At the end of the war he reminded the man in front of him of a boyhood dream, and turned him back.",
    },
  },
];

/* ── Güç laboratuvarı ───────────────────────────────────────────────────── */

export interface ObitoTechnique {
  key: "kamui" | "mokuton" | "jubi";
  kanji: string;
  name: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const OBITO_TECHNIQUES: ObitoTechnique[] = [
  {
    key: "kamui",
    kanji: "神威",
    name: "Kamui",
    turkish: { tr: "Faz geçişi ve kendi boyutu", en: "Phase shift and a private dimension" },
    tagline: {
      tr: "Mangekyō Sharingan'ın ona verdiği tek teknik; on sekiz yıl boyunca dokunulmaz kalmasının tek sebebi.",
      en: "The only technique his Mangekyō Sharingan gave him — and the only reason he stayed untouchable for eighteen years.",
    },
    text: {
      tr: "İki iş yapıyor. Birincisi maddesizleşme: beden bir an için maddeyle ilişkisini kesiyor, saldırı içinden geçiyor, o da hiçbir şeye dokunamıyor. İkincisi bir kapı: aynı gözün açtığı ayrı bir boyuta girip çıkmak, kendisini ya da devasa bir cismi oraya yollamak. Sakarlığı yıllarca bunun kamuflajı oldu — düşmek, çarpmak ve maddesizleşmek dışarıdan aynı harekete benziyor. Ve tekniğin en acı tarafı şu: Kakashi'nin sol gözündeki Kamui aynı boyutun öteki kapısı. İki eski takım arkadaşı, farkında olmadan aynı odanın iki anahtarını taşıdı.",
      en: "It does two things. The first is intangibility: for an instant the body stops interacting with matter — an attack passes through him, and he can touch nothing either. The second is a door: the same eye opens a separate dimension he can step into, or send himself and enormous objects through. His clumsiness was the camouflage for years, because tripping, colliding and phasing out all look identical from outside. And the cruellest part: the Kamui in Kakashi's left eye is the other door to the same dimension. Two old teammates carried the two keys to one room without knowing it.",
    },
    traits: [
      { tr: "Faz geçişi", en: "Intangibility" },
      { tr: "Kendine ait boyut", en: "A dimension of his own" },
      { tr: "Kakashi'yle ortak kapı", en: "A door shared with Kakashi" },
    ],
  },
  {
    key: "mokuton",
    kanji: "木遁・輪廻眼",
    name: "Mokuton · Rinnegan",
    turkish: { tr: "Madara'dan devraldıkları", en: "What he inherited from Madara" },
    tagline: {
      tr: "Ezilen sağ tarafı Hashirama'nın hücreleriyle onarıldı; halkalı göz el değiştire değiştire ona ulaştı.",
      en: "His crushed right side was rebuilt with Hashirama's cells; the ringed eye reached him after passing through several hands.",
    },
    text: {
      tr: "Mokuton, Uchiha kanının hiçbir zaman taşımadığı bir doğa dönüşümü — ona kan yoluyla değil, onarım yoluyla geldi. Rinnegan'ın yolculuğu daha da dolambaçlı: Madara onu Nagato'ya vermişti, Nagato ölünce Obito geri aldı ve kendi gözüne yerleştirdi; Gedō Mazō'yu ancak o gözle çağırabiliyordu. Sayfadaki en tuhaf gerçek burada duruyor: dünyayı tehdit eden bu güç yığınının neredeyse hiçbiri ona ait değildi. Doğuştan tek bir şeyi vardı, onu da on üç yaşında verdi.",
      en: "Mokuton is a nature transformation Uchiha blood never carried — it reached him through repair, not inheritance. The Rinnegan's route was more convoluted still: Madara had given it to Nagato, and when Nagato died Obito took it back and set it in his own eye; only that eye could summon the Gedō Mazō. The strangest fact on this page sits here: almost none of the power that threatened a world was his. He was born with exactly one thing, and he gave that away at thirteen.",
    },
    traits: [
      { tr: "Hashirama hücreleri", en: "Hashirama's cells" },
      { tr: "İkinci elden Rinnegan", en: "A second-hand Rinnegan" },
      { tr: "Uchiha'da bulunmayan doğa", en: "A nature no Uchiha had" },
    ],
  },
  {
    key: "jubi",
    kanji: "十尾の人柱力",
    name: "Jūbi Jinchūriki",
    turkish: { tr: "On Kuyruklu'nun kabı", en: "Vessel of the Ten-Tails" },
    tagline: {
      tr: "Savaşın en güçlü tek gövdesi — ve o gövdenin içindeki kişi hâlâ on üç yaşındaydı.",
      en: "The single strongest body in the war — and the person inside it was still thirteen.",
    },
    text: {
      tr: "Dokuz bijū'yu Gedō Mazō'da birleştirip On Kuyruklu'yu dirilttikten sonra onu kendi bedenine mühürledi. Bu biçimde Rikudō çakrası taşıdı, hakikat arayan küreleri kullandı, bir kıtayı ormana çevirebilecek ağaçlar büyüttü; ittifak ordusunun tamamı onu durduramadı. Ama teknik tarafı hikâyenin yalnızca yarısı: dünyanın en büyük gücünü toplamış olan kişinin istediği şey hâlâ tek bir öğleden sonraydı — üç kişilik bir takımın hep birlikte eve döndüğü bir öğleden sonra.",
      en: "After fusing nine tailed beasts in the Gedō Mazō and reviving the Ten-Tails, he sealed it into his own body. In that form he carried Six Paths chakra, wielded truth-seeking orbs, grew trees that could turn a continent into forest; the entire allied army could not stop him. But the technical half is only half the story: the man who had gathered the greatest power in the world still wanted one particular afternoon — the one where a three-person squad walks home together.",
    },
    traits: [
      { tr: "Rikudō çakrası", en: "Six Paths chakra" },
      { tr: "Gudōdama", en: "Truth-seeking orbs" },
      { tr: "Tek gövde, tüm ordu", en: "One body against an army" },
    ],
  },
];

export interface ObitoMinor {
  key: "izanagi" | "gedo" | "yagura" | "moonEye";
  kanji: string;
  name: string;
  imageKey: string;
  note: LocalizedText;
}

export const OBITO_MINOR: ObitoMinor[] = [
  {
    key: "izanagi",
    kanji: "イザナギ",
    name: "Izanagi",
    imageKey: OBITO_IMAGE_KEYS.izanagi,
    note: {
      tr: "Olan biteni bir süreliğine yalan sayan genjutsu: aldığın yara gerçek olmaktan çıkar. Bedeli sabit — teknik biterken kullanılan Sharingan sonsuza kadar kapanır. Konan'ın kurduğu patlayıcı tuzaktan bu şekilde çıktı ve karşılığında bir göz bıraktı.",
      en: "A genjutsu that declares what just happened to be false: the wound you took stops being real. The price is fixed — when it ends, the Sharingan that cast it closes for good. This is how he walked out of Konan's explosive trap, and he left an eye behind for it.",
    },
  },
  {
    key: "gedo",
    kanji: "外道魔像",
    name: "Gedō Mazō",
    imageKey: OBITO_IMAGE_KEYS.gedo,
    note: {
      tr: "On Kuyruklu'nun boş kabuğu. Akatsuki'nin yıllarca topladığı her bijū bu heykele mühürlendi; heykeli çağıran, zincirlerini yöneten ve mühür törenini yürüten kişi hep aynı maskeli adamdı.",
      en: "The empty husk of the Ten-Tails. Every tailed beast Akatsuki collected over the years was sealed into this statue; the one who summoned it, drove its chains and ran the sealing ritual was always the same masked man.",
    },
  },
  {
    key: "yagura",
    kanji: "写輪眼",
    name: "Sharingan · Yagura",
    imageKey: OBITO_IMAGE_KEYS.yagura,
    note: {
      tr: "Dördüncü Mizukage Yagura'yı Sharingan ile kontrol altına aldı ve Kirigakure yıllarca “Kanlı Sis” adıyla anılan hâlde kaldı. Bir köyün bütün bir dönemi tek bir gözün altında yazıldı; köy bunu çok sonra öğrendi.",
      en: "He took control of the Fourth Mizukage, Yagura, with the Sharingan, and Kirigakure spent years known as the Bloody Mist. An entire era of a village was written under a single eye; the village found out long afterwards.",
    },
  },
  {
    key: "moonEye",
    kanji: "月の眼計画",
    name: "Tsuki no Me Keikaku",
    imageKey: OBITO_IMAGE_KEYS.moonEye,
    note: {
      tr: "Ay Gözü Planı: ayın yüzeyine yansıtılan sonsuz bir genjutsu, Mugen Tsukuyomi. Herkes uyur, herkes istediği rüyayı görür, kimse kimseyi kaybetmez. Planın adı kâinat kadar büyük; istediği şey ise bir tek kişinin yaşadığı bir dünyaydı.",
      en: "The Eye of the Moon Plan: an endless genjutsu projected onto the moon's face, the Infinite Tsukuyomi. Everyone sleeps, everyone gets the dream they want, nobody loses anybody. The plan's name is as large as the cosmos; what it actually wanted was a world with one particular person alive in it.",
    },
  },
];

export const OBITO_LAB_UI = {
  minorTitle: { tr: "Dört küçük kayıt", en: "Four smaller entries" },
  minorLede: {
    tr: "Sayfanın geri kalanı kadar bilinmeyen ama plan için hepsinden gerekli dört teknik.",
    en: "Four techniques less known than the rest of this page, and more necessary to the plan than any of them.",
  },
} as const;

/* ── Kannabi Köprüsü — ezilen taraf ─────────────────────────────────────── */

export const OBITO_KANNABI = {
  weightLabel: { tr: "Üstünde kalan", en: "What stayed on top of him" },
  beats: [
    {
      key: "rock",
      label: { tr: "Kaya", en: "The rock" },
      text: {
        tr: "Mağara çökerken Kakashi'yi ittiği için sağ tarafı altında kaldı. Kırılan yalnızca kemik değildi: o ağırlığın altında insan bir yerden sonra bağırmayı da bırakıyor. Görev başarıyla tamamlanmış sayıldı; köprü yıkıldı, savaşın gidişatı değişti, üç kişilik takımdan ikisi döndü.",
        en: "He pushed Kakashi clear as the cave came down, and his right side stayed underneath. It was not only bone that broke: past a certain weight a person stops shouting too. The mission was logged as a success; the bridge fell, the war turned, and two of a three-person squad came back.",
      },
    },
    {
      key: "eye",
      label: { tr: "Göz", en: "The eye" },
      text: {
        tr: "Kakashi'nin sol gözü aynı görevde parçalanmıştı. Obito, jōnin terfisi için ona verecek bir hediyesi olmadığını söyledi ve kalan Sharingan'ını Rin'e söktürüp o boş göz çukuruna yerleştirtti. O günden sonra Kakashi'nin sol gözü Obito'nun gözüydü — ve yıllar sonra ikisi de aynı boyuta açılan iki kapı olduğunu öğrenecekti.",
        en: "Kakashi's left eye had been cut open on the same mission. Obito said he had no gift for his promotion to jōnin, and had Rin take out his remaining Sharingan and set it into that empty socket. From that day Kakashi's left eye was Obito's eye — and years later both of them would learn the two eyes were two doors into the same dimension.",
      },
    },
    {
      key: "word",
      label: { tr: "Söz", en: "The word" },
      text: {
        tr: "Kayanın altından çıkan son cümle bir emirdi: Rin'e göz kulak ol. Kakashi bu sözü tuttuğunu sandığı gün Rin öldü — ve Obito, kurtarmaya tam zamanında yetiştiğini sandığı anda bunu uzaktan izledi. Kahraman olamadı. Ama o gün, kahramanların yaptığı tek şeyi yaptı: arkadaşının yerine altta kaldı.",
        en: "The last sentence from under the rock was an order: look after Rin. The day Kakashi believed he was keeping it was the day Rin died — and Obito, arriving exactly when he thought he was in time, watched it from a distance. He never became a hero. But that day he did the only thing heroes actually do: he stayed underneath in his friend's place.",
      },
    },
  ],
  quote: {
    text: {
      tr: "Görevi çiğneyenler çöp sayılabilir. Ama arkadaşlarını terk edenler çöpten de beterdir.",
      en: "Those who break the rules may be called trash. But those who abandon their friends are worse than trash.",
    },
    by: { tr: "Obito Uchiha — Kannabi Köprüsü", en: "Obito Uchiha — the Kannabi Bridge" },
  },
} as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

export interface ObitoFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

export const OBITO_TIMELINE: ObitoFateEntry[] = [
  {
    key: "academy",
    imageKey: OBITO_IMAGE_KEYS.fateAcademy,
    age: { tr: "Akademi", en: "The Academy" },
    title: { tr: "Geç kalan çocuk", en: "The boy who was always late" },
    text: {
      tr: "Sınıfın en zayıf öğrencisiydi ve derse hep geç kalırdı; gecikmelerinin sebebi genellikle yolda birine yardım etmesiydi. Ağladığını da saklamazdı. Hokage olacağını söylediğinde kimse gülmeyi bırakmadı — Kakashi de gülmedi ama inanmadı, ki bu daha ağırdı.",
      en: "He was the weakest student in the class and always late; the delay was usually someone he had stopped to help. He never hid his crying either. When he said he would become Hokage nobody stopped laughing — Kakashi did not laugh, but he did not believe him either, which was worse.",
    },
  },
  {
    key: "kannabi",
    imageKey: OBITO_IMAGE_KEYS.fateKannabi,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Kannabi Köprüsü ve verilen göz", en: "The Kannabi Bridge and the given eye" },
    text: {
      tr: "Üçüncü Şinobi Savaşı'nın bir görevinde mağara çöktü. Kakashi'yi ittiği için sağ tarafı kayanın altında kaldı; Sharingan'ını Kakashi'ye verdirdi ve ikisini Rin'le birlikte oradan gönderdi. Konoha'nın anıtına o gün adı yazıldı. Onu bulan kişi ise Konoha değildi.",
      en: "On a mission in the Third Shinobi War, a cave collapsed. He had pushed Kakashi clear, and his right side stayed under the rock; he had his Sharingan given to Kakashi and sent the two of them out with Rin. His name went onto Konoha's memorial stone that day. The one who found him was not Konoha.",
    },
  },
  {
    key: "rin",
    imageKey: OBITO_IMAGE_KEYS.fateRin,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Rin'in ölümü, dünyanın bırakılışı", en: "Rin's death, and letting the world go" },
    text: {
      tr: "Kayanın altından Madara ve Zetsu çıkardı; yeni bir sağ taraf, yeni bir beden, aylarca süren bir toparlanma. Kendi ayakları üstünde durabildiği ilk gün Rin'i kurtarmaya gitti ve tam zamanında yetişti: Kakashi'nin eli Rin'in göğsündeydi. İkinci kez geç kalmıştı. Yağmurun altında ayakta kalan kişi artık başka biriydi.",
      en: "Madara and Zetsu pulled him out from under the rock: a new right side, a new body, months of putting himself back together. The first day he could stand on his own he went to save Rin and arrived exactly in time — Kakashi's hand was in her chest. He was late for the second time. The person left standing in the rain was somebody else.",
    },
  },
  {
    key: "mask",
    imageKey: OBITO_IMAGE_KEYS.fateMask,
    age: { tr: "Maskeli yıllar", en: "The masked years" },
    title: { tr: "Tobi, sonra Madara", en: "Tobi, and then Madara" },
    text: {
      tr: "Kirigakure'yi Yagura üzerinden yönetti, Akatsuki'yi gölgesinden yürüttü, Nagato'ya Rinnegan'ı taşıttı, Konoha'nın üstüne bir Dokuz Kuyruklu saldı. Bu on sekiz yıl boyunca kendi adını bir kez bile kullanmadı: önce hiç kimse oldu, sonra bir çaylak, sonra ölü bir efsane. Sayfanın ad yığını tam olarak bu sıranın tersidir.",
      en: "He ruled Kirigakure through Yagura, ran Akatsuki from its shadow, had Nagato carry the Rinnegan, and loosed a Nine-Tails on Konoha. Across eighteen years he never once used his own name: first he was no one, then a clumsy newcomer, then a dead legend. The stack of names on this page is exactly that order, reversed.",
    },
  },
  {
    key: "war",
    imageKey: OBITO_IMAGE_KEYS.fateWar,
    age: { tr: "31 yaş", en: "Age 31" },
    title: { tr: "Maskenin düşmesi ve taraf değiştirmesi", en: "The mask falls, and he changes sides" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda maske Naruto'nun darbesiyle kırıldı ve altındaki yüzü Kakashi tanıdı. Jūbi'yi bedenine mühürledi, ittifakın tamamına tek başına dayandı — ve sonra vazgeçti. Kalan gücünü Kakashi'ye açtı: bir süreliğine iki Kamui de aynı anda çalıştı. Adına dönerek öldü.",
      en: "In the Fourth Great Shinobi War the mask broke under Naruto's strike, and Kakashi recognised the face beneath it. He sealed the Ten-Tails into his body and held off the whole alliance alone — and then he stopped. He opened what power he had left to Kakashi: for a while both Kamui worked at once. He died having come back to his own name.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const OBITO_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Görevi çiğneyenler çöp sayılabilir. Ama arkadaşlarını terk edenler çöpten de beterdir.",
        en: "Those who break the rules may be called trash. But those who abandon their friends are worse than trash.",
      },
      by: { tr: "Obito Uchiha", en: "Obito Uchiha" },
      note: {
        tr: "Kakashi bu cümleyi ömrünün geri kalanında tekrarladı — söyleyeni öldü sanarak.",
        en: "Kakashi repeated this line for the rest of his life, believing the person who said it was dead.",
      },
    },
    {
      text: {
        tr: "Bu dünyada umut diye bir şey yok.",
        en: "There is no such thing as hope in this world.",
      },
      by: { tr: "Maskeli adam", en: "The masked man" },
      note: {
        tr: "Aynı cümleyi kuran adam, savaşın sonunda umudu Naruto'ya bırakarak öldü.",
        en: "The man who said it died at the end of the war leaving hope to Naruto.",
      },
    },
  ],
  motto: "俺はうちはオビトだ",
  mottoNote: {
    tr: "ore wa Uchiha Obito da — “ben Uchiha Obito'yum”",
    en: "ore wa Uchiha Obito da — “I am Obito Uchiha”",
  },
  credit: {
    tr: "Künye verileri (doğum günü, boy, kan grubu, yaş, alternatif adlar) ve yedek portre AniList'ten alınmıştır; AniList bu numarayı “Tobi” adıyla kaydediyor, sayfa gerçek adı taşıyor. Tam boy portre arşivin kendi yüklemesidir. Spiral maske, Kamui girdabı, yara izi ağı ve moloz alanı bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, alternative names) and the fallback portrait come from AniList, which files this entry under the name “Tobi”; this page carries the real one. The full-size portrait is the archive's own upload. The spiral mask, the Kamui vortex, the scar web and the rubble field are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
