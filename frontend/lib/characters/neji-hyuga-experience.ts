import type { LocalizedText } from "./types";

/**
 * Neji Hyūga — "Kafesteki Kuş" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 1694 kaydının ABILITY yuvaları,
 * `neji:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama AYAKTA
 * çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── SAYFANIN OMURGASI: KADER ─────────────────────────────────────────────
 * Bölüm başlıkları iki parçadan oluşuyor: değiştirilemezlik iddiasını taşıyan
 * bir ÖN SÖZ (`fate`) ve başlığın kendisi (`title`). "Kafes kırılıyor" modu
 * açıldığında ön sözler başlıklardan çekiliyor (CSS, `.page[data-broken]`),
 * sayfanın kapanışı ise o dili kalıcı olarak geçersiz kılıyor. Yani "kader"
 * bu sayfada bir tema değil, bir arayüz durumu.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (3 Temmuz), boy (172 cm), kan grubu (O), yaş aralığı (14–17) ve
 * rütbe satırı (Genin I; Jōnin II) AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 1694). "Akademi dönem birincisi" de aynı
 * künyenin açıklama metninde geçiyor — uydurma değil. Kilo AniList kaydında
 * YOK, bu yüzden künye şeridinde de yok.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada üç replik var, üçü de Neji'nin ağzından ve üçü de konuşanına
 * atfedilmiş: (1) sekiz trigram sayımı, (2) elemede kuzenine söylediği kader
 * cümlesi, (3) savaş alanında Naruto'ya söylediği son cümle. Türkçe ve
 * İngilizce karşılıklar arşivin kendi çevirisi; emin olunmayan hiçbir cümle
 * tırnak içine alınmadı. Kalan her şey — Hizashi'nin ölümü, mektup, klanla
 * barışma — arşivin kendi anlatımı olarak düz metin hâlinde yazıldı.
 */

export const NEJI_ID = 1694;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const NEJI_SITE_URL = "https://anilist.co/character/1694";

/**
 * Sergi görselleri — hepsi characterId 1694 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `neji:` önekli (kurator modu şartı).
 */
export const NEJI_IMAGE_KEYS = {
  /** Hero fonu: Hyūga konağının koridoru ya da avlusu, gece (16:9) */
  hero: "neji:hero",
  seal: "neji:seal",
  juken: "neji:juken",
  hakke64: "neji:hakke-64",
  kaiten: "neji:kaiten",
  byakugan: "neji:byakugan",
  kusho: "neji:kusho",
  sealMark: "neji:seal-mark",
  tenketsu: "neji:tenketsu",
  counter: "neji:counter",
  fateSeal: "neji:fate-seal",
  fateHinata: "neji:fate-hinata",
  fateNaruto: "neji:fate-naruto",
  fateLetter: "neji:fate-letter",
  fateWar: "neji:fate-war",
  closing: "neji:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const NEJI_SLOT_LABELS: Record<string, LocalizedText> = {
  [NEJI_IMAGE_KEYS.hero]: {
    tr: "Hero fonu — Hyūga konağının koridoru, gece (16:9)",
    en: "Hero backdrop — the Hyūga compound corridor at night (16:9)",
  },
  [NEJI_IMAGE_KEYS.seal]: {
    tr: "Alın bandı ve altındaki mühür — yakın kadraj",
    en: "The forehead protector and the seal beneath it — close crop",
  },
  [NEJI_IMAGE_KEYS.juken]: {
    tr: "Jūken — açık avuç vuruşunun anı",
    en: "Jūken — the moment of the open-palm strike",
  },
  [NEJI_IMAGE_KEYS.hakke64]: {
    tr: "Hakke Rokujūyon Shō — sekiz trigram alanı kurulurken",
    en: "Hakke Rokujūyon Shō — the eight trigrams field taking shape",
  },
  [NEJI_IMAGE_KEYS.kaiten]: {
    tr: "Kaiten — dönen chakra kubbesi",
    en: "Kaiten — the spinning dome of chakra",
  },
  [NEJI_IMAGE_KEYS.byakugan]: {
    tr: "Byakugan — damarları kabarmış göz, yakın kadraj",
    en: "Byakugan — the eye with raised veins, close crop",
  },
  [NEJI_IMAGE_KEYS.kusho]: {
    tr: "Hakke Kūshō — avuçtan çıkan basınç dalgası",
    en: "Hakke Kūshō — the pressure wave leaving the palm",
  },
  [NEJI_IMAGE_KEYS.sealMark]: {
    tr: "Yan dal mührü — alında, bant kalkmış hâlde",
    en: "The branch-house seal — forehead bare, protector lifted",
  },
  [NEJI_IMAGE_KEYS.tenketsu]: {
    tr: "Kapanan tenketsu — Byakugan'ın gördüğü chakra ağı",
    en: "A tenketsu shutting — the chakra network as the Byakugan sees it",
  },
  [NEJI_IMAGE_KEYS.counter]: {
    tr: "Altmış dört avuç dizisi — vuruş anı",
    en: "The sixty-four palms sequence — mid-strike",
  },
  [NEJI_IMAGE_KEYS.fateSeal]: {
    tr: "Çizelge 1 — dört yaşında mühürleme",
    en: "Entry 1 — the branding at four",
  },
  [NEJI_IMAGE_KEYS.fateHinata]: {
    tr: "Çizelge 2 — eleme, Hinata'nın karşısında",
    en: "Entry 2 — the preliminary, facing Hinata",
  },
  [NEJI_IMAGE_KEYS.fateNaruto]: {
    tr: "Çizelge 3 — final, Naruto'ya yenilgi",
    en: "Entry 3 — the final, the defeat by Naruto",
  },
  [NEJI_IMAGE_KEYS.fateLetter]: {
    tr: "Çizelge 4 — Hizashi'nin mektubu, ana dalla antrenman",
    en: "Entry 4 — Hizashi's letter, training with the main house",
  },
  [NEJI_IMAGE_KEYS.fateWar]: {
    tr: "Çizelge 5 — savaş alanı, son duruş",
    en: "Entry 5 — the battlefield, the last stand",
  },
  [NEJI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş alın bandı",
    en: "Closing — the empty forehead protector",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

/**
 * Ad AniList'ten DEĞİL buradan geliyor (Hinata sayfasının emsali): AniList
 * kaydı "Neji Hyuuga" yazıyor, arşivin yazımı ise makronlu — "Hyūga". Aynı
 * klanın iki sayfası aynı adı iki türlü yazamaz.
 */
export const NEJI_IDENTITY = {
  givenName: "Neji",
  clanName: "Hyūga",
  nativeName: "日向ネジ",
  /** Hero filigranı — klan adı, dekoratif (aria-hidden) */
  watermark: "日向",
  branch: { tr: "Hyūga — yan dal", en: "Hyūga — branch house" },
  epigraph: {
    tr: "Kaderin doğumda yazıldığını söyleyen çocuk, o cümleyi yıkmak için değil kanıtlamak için dövüştü. Sonunda onu kendi eliyle yanlışladı.",
    en: "The boy who said fate is written at birth fought not to break that sentence but to prove it. In the end he disproved it himself.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "3 Temmuz", en: "3 July" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "172 cm", en: "172 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "14 – 17 (künye aralığı)", en: "14 – 17 (profile range)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) · Jōnin (II)", en: "Genin (I) · Jōnin (II)" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Takım Guy — Might Guy, Rock Lee, Tenten",
        en: "Team Guy — Might Guy, Rock Lee, Tenten",
      },
    },
    {
      label: { tr: "Klan", en: "Clan" },
      value: {
        tr: "Hyūga — yan dal (分家)",
        en: "Hyūga — branch house (分家)",
      },
    },
    {
      label: { tr: "Akademi", en: "Academy" },
      value: { tr: "Dönem birincisi", en: "Top of his year" },
    },
    {
      label: { tr: "Taşıdığı", en: "What he carries" },
      value: {
        tr: "Alın bandı — mührün üstünü örten bez",
        en: "A forehead protector — the cloth over the seal",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const NEJI_CAGE_TEXT = {
  enter: { tr: "Kafes kırılıyor", en: "The cage breaks" },
  exit: { tr: "Kafesi geri kur", en: "Rebuild the cage" },
  hint: {
    tr: "Mühür çatlıyor, parmaklıklar ortasından ayrılıyor ve bölüm başlıklarındaki kader dili geri çekiliyor.",
    en: "The seal cracks, the bars part in the middle, and the language of fate withdraws from the section headings.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const NEJI_HERO = {
  lede: {
    tr: "Alnında bir mühür var ve o mühür tek bir cümle söylüyor: bu ev senin değil, sen bu evinsin. Neji o cümleyi on üç yıl boyunca yalnızca kendine değil, karşısına çıkan herkese uyguladı.",
    en: "There is a seal on his forehead, and it says one sentence: this house is not yours, you belong to it. For thirteen years Neji applied that sentence not only to himself but to everyone who stood in front of him.",
  },
  veinCaption: {
    tr: "Damar ağı alından geriye doğru açılır: Byakugan çalışırken görünen tek dış işaret.",
    en: "The veins open backwards from the forehead: the only outward sign that the Byakugan is working.",
  },
  portraitAlt: {
    tr: "Neji Hyūga — arşive yüklenmiş kadro portresi",
    en: "Neji Hyūga — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Neji Hyūga — AniList künye portresi",
    en: "Neji Hyūga — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const NEJI_ALT = {
  bondSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const NEJI_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

/**
 * Her başlığın `fate` alanı değiştirilemezlik iddiasını taşıyor ve başlığın
 * içinde, aynı satırda duruyor (üstünde DEĞİL — ayrı bir etiket satırı bu
 * sayfada yok). Kafes kırıldığında bu parça genişliğini kaybedip siliniyor,
 * geriye tek başına ayakta durabilen bir başlık kalıyor.
 */
export const NEJI_SECTIONS = {
  seal: {
    fate: { tr: "Doğuştan yazılı —", en: "Written at birth —" },
    title: {
      tr: "Alnın altındaki mühür",
      en: "The seal beneath the forehead",
    },
    lede: {
      tr: "Bu sayfanın geri kalanı teknik anlatır. Burası anlatmıyor: burası sayfanın sebebi.",
      en: "The rest of this page explains techniques. This part does not: this part is why the page exists.",
    },
  },
  identity: {
    fate: { tr: "Değiştirilemez —", en: "Unchangeable —" },
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Dokuz satır. Yedisi AniList'in verdiği ölçüler, biri sınıf sıralaması, sonuncusu bir bez parçası.",
      en: "Nine lines. Seven are measurements from AniList, one is a class ranking, and the last is a piece of cloth.",
    },
  },
  arts: {
    fate: { tr: "Kaçınılmaz —", en: "Inevitable —" },
    title: { tr: "Avucun üç biçimi", en: "Three shapes of the palm" },
    lede: {
      tr: "Hyūga dövüşü tek bir fikirdir: içeriyi gör, içeriyi kapat. Üç biçim o fikrin üç ayarı — ve üçünü de kimse Neji'ye öğretmedi.",
      en: "Hyūga combat is a single idea: see the inside, shut the inside. These three are that idea at three settings — and no one taught Neji any of them.",
    },
  },
  small: {
    fate: { tr: "Baştan belli —", en: "Settled in advance —" },
    title: { tr: "Dört küçük kesinlik", en: "Four small certainties" },
    lede: {
      tr: "Bir gözün menzili, bir avucun boşluğu, bir mührün işleyişi ve vücuttaki üç yüz altmış bir kapı.",
      en: "The reach of an eye, the vacuum in a palm, the mechanics of a seal, and the three hundred and sixty-one gates in a body.",
    },
  },
  counter: {
    fate: { tr: "Sayısı önceden verilmiş —", en: "The count already given —" },
    title: { tr: "Sekiz trigram, altmış dört kapı", en: "Eight trigrams, sixty-four gates" },
    lede: {
      tr: "Dizinin adı sayının kendisidir: her turda ikiye katlanır ve nerede biteceği ilk vuruştan önce bellidir. Bir kademeye bas — vuruşlar oraya kadar sırayla işlensin.",
      en: "The sequence is named after its own arithmetic: it doubles every round, and where it ends is known before the first strike lands. Press a stage — the strikes will be marked up to it, in order.",
    },
  },
  bonds: {
    fate: { tr: "Boşuna —", en: "In vain —" },
    title: { tr: "Kafesin dışındakiler", en: "Those outside the cage" },
    lede: {
      tr: "Beş kişi. Hiçbiri Neji'yle kader üstüne tartışmaya girmedi; beşi de sadece kendi hayatını yaşayarak tezini çürüttü.",
      en: "Five people. Not one of them argued with Neji about fate; all five refuted him simply by living their own lives.",
    },
  },
  fate: {
    fate: { tr: "Önceden yazılmış —", en: "Written in advance —" },
    title: { tr: "Beş kayıtlık ömür", en: "A life in five entries" },
    lede: {
      tr: "Dördü on üç yaşından önce ya da o yaşta geçiyor. Beşincisi dört yıl sonra ve sayfadaki tek gönüllü satır.",
      en: "Four of them happen at thirteen or earlier. The fifth comes four years later and is the only voluntary line on this page.",
    },
  },
} as const;

/* ── Kafes mührü — sayfanın duygusal merkezi ────────────────────────────── */

export const NEJI_SEAL = {
  name: "Kago no Naka no Tori",
  native: "籠の中の鳥",
  gloss: { tr: "Kafesteki Kuş", en: "Caged Bird" },
  /** SVG şemasının altındaki dürüstlük satırı (BRIEF §3.4) */
  caption: {
    tr: "Elle çizilmiş şema: alın bandının ardında duran mühür. Arşivin kendi çizimi, orijinal işaretin kopyası değil.",
    en: "Hand-drawn diagram: the seal standing behind the forehead protector. The archive's own drawing, not a copy of the original mark.",
  },
  figureLabel: {
    tr: "Yan dal mührünün şeması: parmaklıkların ardında bir kuş, üstünde alın bandı.",
    en: "Diagram of the branch-house seal: a bird behind bars, with the forehead protector across it.",
  },
  paragraphs: [
    {
      tr: "Hyūga klanı ikiye ayrılır: ana dal (宗家) ve yan dal (分家). Ayrımı yetenek değil doğum sırası yapar. Yan dalda doğan çocuğun alnına dört yaşında yeşil bir mühür işlenir ve o mührün adı Kafesteki Kuş'tur. Görevi tek cümleyle anlatılabilir: Byakugan'ın klan dışına çıkmasını engellemek.",
      en: "The Hyūga clan is split in two: the main house (宗家) and the branch house (分家). The split is decided by birth order, not by talent. A child born into the branch house is marked at four with a green seal on the forehead, and that seal is called the Caged Bird. Its job fits in one sentence: to keep the Byakugan from ever leaving the clan.",
    },
    {
      tr: "Mühür ana dalın bir el işaretiyle uzaktan çalıştırılabilir; çalıştığında beynin içindeki chakra yollarını yakar. Taşıyan öldüğünde ise kendiliğinden kapanır ve gözü kullanılamaz hâle getirir. Yani yan dal, ana dalı hem hayattayken hem öldükten sonra korumakla yükümlüdür. Neji'nin alın bandı bu mührün üstünü örtüyor: kimse onu görmüyor, herkes orada olduğunu biliyor.",
      en: "The seal can be triggered from a distance with a hand sign from the main house; when it fires, it burns the chakra pathways inside the brain. When its bearer dies, it closes on its own and renders the eye unusable. The branch house, in other words, is bound to protect the main house both alive and dead. Neji's forehead protector covers this seal: no one sees it, everyone knows it is there.",
    },
    {
      tr: "Neji dört yaşındayken babası Hizashi öldü. Hizashi, klan lideri Hiashi'nin ikiziydi — birkaç dakika sonra doğduğu için yan dala düşmüştü. Kumogakure'nin başarısız kaçırma girişiminden sonra köy, ölen elçisinin karşılığında Hiashi'nin cesedini istedi; giden Hizashi oldu. Neji'ye bunun bir emir olduğu söylendi ve yıllarca öyle bildi: babası, birkaç dakikalık bir doğum farkı yüzünden ağabeyinin yerine öldürülmüştü. Alnındaki mühür o günden sonra bir klan kuralı değil, bir kanıt oldu.",
      en: "Neji was four when his father Hizashi died. Hizashi was the twin of Hiashi, the clan head — born a few minutes later, and so born into the branch house. After Kumogakure's failed abduction attempt the village demanded Hiashi's body in exchange for their dead envoy; the one who went was Hizashi. Neji was told it had been an order, and for years that was what he knew: his father had been killed in his brother's place over a few minutes of birth order. From that day the seal on his forehead stopped being a clan rule and became evidence.",
    },
  ],
} as const;

/* ── Avucun üç biçimi ───────────────────────────────────────────────────── */

export const NEJI_ARTS = [
  {
    key: "juken" as const,
    imageKey: NEJI_IMAGE_KEYS.juken,
    native: "柔拳",
    name: "Jūken",
    turkish: { tr: "Nazik Yumruk", en: "Gentle Fist" },
    tagline: {
      tr: "Deriyi geçer, kasla hiç uğraşmaz, içerideki yolu kapatır.",
      en: "It passes the skin, ignores the muscle, and shuts the pathway inside.",
    },
    text: {
      tr: "Klanın imza dövüş biçimi. Avuçtan salınan chakra bedene girer ve doğrudan chakra yollarına ya da organın kendisine iner; dışarıda bir iz kalmayabilir, içeride bir kapı kapanmıştır. Bu yüzden Jūken önce bir görme meselesidir: nereye vuracağını görmeyen el, ne kadar nazik olursa olsun boşa vurur. Neji bunu kimseden ders alarak öğrenmedi. Yan dal çocuklarına klanın asıl teknikleri anlatılmaz; o da ana dalın avlusundaki antrenmanları uzaktan izleyip kendi başına söktü.",
      en: "The clan's signature form. Chakra released from the palm enters the body and lands directly on the chakra pathways or on the organ itself; there may be no mark outside, while inside a gate has closed. So Jūken is a matter of sight first: a hand that cannot see where it is striking strikes nothing, however gentle it is. Neji did not learn this from a teacher. Branch-house children are not taught the clan's real techniques; he watched the main house train from across the courtyard and worked it out alone.",
    },
    traits: [
      { tr: "Avuçtan salınan chakra", en: "Chakra released from the palm" },
      { tr: "Hedef: tenketsu", en: "The target is the tenketsu" },
      { tr: "Kendi kendine öğrenildi", en: "Taught to himself" },
    ],
  },
  {
    key: "hakke64" as const,
    imageKey: NEJI_IMAGE_KEYS.hakke64,
    native: "八卦六十四掌",
    name: "Hakke Rokujūyon Shō",
    turkish: {
      tr: "Sekiz Trigram Altmış Dört Avuç",
      en: "Eight Trigrams Sixty-Four Palms",
    },
    tagline: {
      tr: "Sayı her turda ikiye katlanır ve nerede biteceği ilk vuruştan önce bellidir.",
      en: "The count doubles each round, and where it ends is known before the first strike.",
    },
    text: {
      tr: "Rakip sekiz trigramın merkezine alınır, ayağının altına alan çizilir ve dizi başlar: iki, dört, sekiz, on altı, otuz iki, altmış dört. Sonunda altmış dört tenketsu kapanmıştır; hedef ayakta kalabilir ama chakrasını kullanamaz, yani geçici olarak ninja olmaktan çıkar. Dizinin asıl zorluğu vuruş sayısı değil, hız artarken hiç sapmadan doğru noktaya inmektir. Ana dalın en çok övündüğü teknik budur — ve onu Neji'ye öğreten kimse olmadı.",
      en: "The opponent is placed at the centre of the eight trigrams, the field is drawn under their feet, and the sequence begins: two, four, eight, sixteen, thirty-two, sixty-four. At the end, sixty-four tenketsu are shut; the target may still be standing but cannot use chakra, which is to say they have temporarily stopped being a ninja. The hard part is not the number of strikes but landing every one of them exactly as the tempo climbs. This is the technique the main house is proudest of — and nobody taught it to Neji.",
    },
    traits: [
      { tr: "2 · 4 · 8 · 16 · 32 · 64", en: "2 · 4 · 8 · 16 · 32 · 64" },
      { tr: "64 tenketsu kapanır", en: "Sixty-four tenketsu shut" },
      { tr: "Öğretmensiz sökülmüş", en: "Worked out without a teacher" },
    ],
  },
  {
    key: "kaiten" as const,
    imageKey: NEJI_IMAGE_KEYS.kaiten,
    native: "八卦掌回天",
    name: "Hakkeshō Kaiten",
    turkish: {
      tr: "Sekiz Trigram Göğü Döndürme",
      en: "Eight Trigrams Revolving Heaven",
    },
    tagline: {
      tr: "Saldırı sanatı olan bir klanın tek savunması: chakrayı dışarı ver ve dön.",
      en: "The only defence of a clan built on attack: release the chakra outward, and spin.",
    },
    text: {
      tr: "Jūken içeriyi kapatmak için chakrayı ölçüyle salar; Kaiten aynı chakrayı bütün tenketsu'lardan aynı anda dışarı boşaltır ve gövde dönerken çevresinde bir kubbe kurar. Gelen şey saplanmaz, teğet geçer. Klan içinde neredeyse kusursuz savunma sayılır ve ana dalın sırrıdır — Hiashi'nin tekniğidir. Neji onu izleyerek çıkardı; Tenten aylarca karşısına geçip silah fırlatarak kubbenin gerçekten kapanıp kapanmadığını sınadı.",
      en: "Jūken releases chakra by measure in order to shut things down; Kaiten empties that same chakra out of every tenketsu at once, and the spinning body raises a dome around itself. What arrives does not lodge — it glances off. Inside the clan it counts as very nearly perfect defence, and it is a main-house secret: it is Hiashi's technique. Neji reconstructed it by watching. Tenten spent months standing opposite him, throwing weapons, testing whether the dome actually closed.",
    },
    traits: [
      { tr: "Bütün tenketsu'lardan salınım", en: "Released from every tenketsu" },
      { tr: "Kusursuza yakın savunma", en: "Near-perfect defence" },
      { tr: "Gözle çıkarılmış ana dal sırrı", en: "A main-house secret, read off by eye" },
    ],
  },
] as const;

/* ── Dört küçük kesinlik ────────────────────────────────────────────────── */

export const NEJI_SMALL = [
  {
    key: "byakugan" as const,
    imageKey: NEJI_IMAGE_KEYS.byakugan,
    native: "白眼",
    name: { tr: "Byakugan — menzil ve kör nokta", en: "Byakugan — reach and blind spot" },
    note: {
      tr: "Neredeyse tam çevresel görüş, kilometrelerce menzil, duvarın ardını ve chakra ağını okuma. Ama boynun arkasında, ilk omurun hizasında kapanmayan bir kör nokta var. Neji menzilini kendi başına genişletti, kör noktayı daralttı — kapatamadı. Hiçbir Hyūga kapatamadı.",
      en: "Almost complete peripheral vision, kilometres of reach, sight through walls and straight into the chakra network. But behind the neck, level with the first vertebra, there is a blind spot that never closes. Neji widened his reach alone and narrowed that spot — he never sealed it. No Hyūga ever has.",
    },
  },
  {
    key: "kusho" as const,
    imageKey: NEJI_IMAGE_KEYS.kusho,
    native: "八卦空掌",
    name: { tr: "Hakke Kūshō — Boşluk Avucu", en: "Hakke Kūshō — Vacuum Palm" },
    note: {
      tr: "Jūken'in menzil sorununa Neji'nin kendi cevabı: avucundaki chakrayı bedene değil havaya boşaltır ve basınç dalgası olarak fırlatır. Klanın envanterinde olmayan, tamamen ona ait bir satır — dokunmadan kapatabilen tek Hyūga tekniği.",
      en: "Neji's own answer to Jūken's range problem: he empties the chakra in his palm into the air instead of a body and throws it as a pressure wave. A line that does not exist in the clan's inventory — the only Hyūga technique that can shut something down without touching it.",
    },
  },
  {
    key: "sealMark" as const,
    imageKey: NEJI_IMAGE_KEYS.sealMark,
    native: "籠の中の鳥",
    name: { tr: "Yan dal mührü — işleyişi", en: "The branch-house seal — mechanics" },
    note: {
      tr: "Ana dalın bir el işareti mührü uzaktan çalıştırır ve beynin chakra yollarını yakar; ceza olarak da, ölüm olarak da kullanılabilir. Taşıyanın ölümünde kendiliğinden kapanarak Byakugan'ı kullanılamaz hâle getirir. İki işlevi var ve ikisi de aynı şeyi koruyor: gözü.",
      en: "A hand sign from the main house triggers the seal from a distance and burns the chakra pathways in the brain; it can be used as punishment or as an execution. On the bearer's death it closes by itself and makes the Byakugan unusable. It has two functions, and both protect the same thing: the eye.",
    },
  },
  {
    key: "tenketsu" as const,
    imageKey: NEJI_IMAGE_KEYS.tenketsu,
    native: "経穴",
    name: { tr: "Tenketsu — chakra noktası kapatma", en: "Tenketsu — shutting a chakra point" },
    note: {
      tr: "Bedende üç yüz altmış bir tenketsu var: chakra ağının dışarı açılan kapıları. Doğru açıyla inen bir Jūken vuruşu bir kapıyı kapatır ve o noktadan chakra çıkmaz. Altmış dördü kapanınca el mührü kurmak da, chakra toplamak da imkânsızlaşır. Neji'nin bütün dövüş matematiği bu tek cümlenin üstüne kurulu.",
      en: "There are three hundred and sixty-one tenketsu in a body: the doors where the chakra network opens outward. A Jūken strike landing at the right angle shuts one, and no chakra leaves that point again. Shut sixty-four of them and forming a hand sign or gathering chakra both become impossible. All of Neji's combat arithmetic rests on that one sentence.",
    },
  },
] as const;

/* ── Sekiz trigram sayacı — sayfanın kalbi ──────────────────────────────── */

/**
 * Kademeler. `strikes` toplam vuruş, `points` kapanan tenketsu sayısı —
 * 128'de aynı altmış dört nokta ikinci kez vuruluyor, yani `points` 64'te
 * duruyor. Sayaç bileşeni bu ayrımı okuyup iki ayrı sayı gösteriyor.
 */
export interface NejiStage {
  key: string;
  strikes: number;
  /** 128 kademesi diziden AYRI çizilir: kendi başına bir teknik */
  separate?: boolean;
  label: LocalizedText;
  note: LocalizedText;
}

export const NEJI_STAGES: NejiStage[] = [
  {
    key: "s2",
    strikes: 2,
    label: { tr: "İki avuç", en: "Two palms" },
    note: {
      tr: "Alan kurulur. Rakip sekiz trigramın merkezine alınır; ilk iki avuç yalnızca yeri işaretler.",
      en: "The field is set. The opponent is placed at the centre of the eight trigrams; the first two palms only mark the spot.",
    },
  },
  {
    key: "s4",
    strikes: 4,
    label: { tr: "Dört avuç", en: "Four palms" },
    note: {
      tr: "İkiye katlama başladı. Bu noktadan sonra diziyi durdurmak Neji'nin bile elinde değil.",
      en: "The doubling has started. Past this point not even Neji can stop the sequence.",
    },
  },
  {
    key: "s8",
    strikes: 8,
    label: { tr: "Sekiz avuç", en: "Eight palms" },
    note: {
      tr: "İlk trigram tamamlandı. Sekiz kapı kapalı; chakra ilk kez aksamaya başlar.",
      en: "The first trigram is complete. Eight gates are shut, and the chakra stutters for the first time.",
    },
  },
  {
    key: "s16",
    strikes: 16,
    label: { tr: "On altı avuç", en: "Sixteen palms" },
    note: {
      tr: "İki trigram. Kollardaki yollar kesildi — el mührü kurmak artık zor.",
      en: "Two trigrams. The pathways in the arms are cut — forming a hand sign is already hard.",
    },
  },
  {
    key: "s32",
    strikes: 32,
    label: { tr: "Otuz iki avuç", en: "Thirty-two palms" },
    note: {
      tr: "Dört trigram. Gövde susar; ayakta kalmak artık chakranın değil iradenin işi.",
      en: "Four trigrams. The torso goes quiet; staying upright is no longer chakra's work but will's.",
    },
  },
  {
    key: "s64",
    strikes: 64,
    label: { tr: "Altmış dört avuç", en: "Sixty-four palms" },
    note: {
      tr: "Sekiz trigram, altmış dört tenketsu. Hedef ayakta olabilir — ama artık ninja değildir.",
      en: "Eight trigrams, sixty-four tenketsu. The target may still be standing — but is no longer a ninja.",
    },
  },
  {
    key: "s128",
    strikes: 128,
    separate: true,
    label: { tr: "Yüz yirmi sekiz avuç", en: "One hundred twenty-eight palms" },
    note: {
      tr: "Hakke Hyakunijūhachi Shō. Aynı altmış dört nokta, ikinci kez. Diziyi ikiye katlamak klanın kayıtlarında yoktu; Neji bunu kendisi ekledi.",
      en: "Hakke Hyakunijūhachi Shō. The same sixty-four points, struck a second time. Doubling the sequence was not in the clan's records; Neji added it himself.",
    },
  },
];

export const NEJI_COUNTER_UI = {
  /** Sayacın üstündeki replik — Neji'nin kendi sayımı */
  shout: {
    text: {
      tr: "İki avuç! Dört avuç! Sekiz avuç! On altı avuç! Otuz iki avuç! Altmış dört avuç!",
      en: "Two palms! Four palms! Eight palms! Sixteen palms! Thirty-two palms! Sixty-four palms!",
    },
    by: { tr: "Neji Hyūga", en: "Neji Hyūga" },
  },
  railLabel: { tr: "Vuruş kademeleri", en: "Strike stages" },
  strikeWord: { tr: "vuruş", en: "strikes" },
  sealedLabel: { tr: "kapanan tenketsu", en: "tenketsu shut" },
  emptyNote: {
    tr: "Dizi henüz başlamadı. Bir kademe seç: vuruşlar oraya kadar sırayla işlenecek.",
    en: "The sequence has not started. Pick a stage: the strikes will be marked up to it, in order.",
  },
  hint: {
    tr: "Sol/sağ ok tuşlarıyla kademeler arasında gezebilir, boşluk ya da Enter ile diziyi yeniden başlatabilirsin.",
    en: "Use the left and right arrow keys to move between stages; space or Enter replays the sequence.",
  },
  figureLabel: {
    tr: "Şema: bir bedendeki altmış dört tenketsu, sekiz trigram grubuna bölünmüş. Seçilen kademeye kadar olan noktalar işaretli.",
    en: "Diagram: sixty-four tenketsu on a body, divided into eight trigram groups. Points up to the selected stage are marked.",
  },
} as const;

/* ── Kafesin dışındakiler ───────────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[1694]` listesiyle birebir
 * aynı: 1555 Hinata, 306 Rock Lee, 3710 Tenten, 307 Might Guy, 17 Naruto.
 * Portre kaydı olmayan kişi adıyla çizilir, bölüm çökmez.
 */
export const NEJI_BONDS = [
  {
    characterId: 1555,
    name: "Hinata Hyūga",
    role: { tr: "Ana dal", en: "The main house" },
    note: {
      tr: "Elemede karşısına çıkan kuzeni. Neji ona kaderini değiştiremeyeceğini söyledi ve neredeyse öldürüyordu. Dört yıl sonra aynı kızın yanında, onu korurken öldü.",
      en: "The cousin who drew him in the preliminary. Neji told her she could not change her fate, and very nearly killed her. Four years later he died beside that same girl, shielding her.",
    },
  },
  {
    characterId: 306,
    name: "Rock Lee",
    role: { tr: "Karşı sav", en: "The counter-argument" },
    note: {
      tr: "Chakra kullanamayan, klanı olmayan, kendisine hiçbir şey verilmemiş çocuk. Neji'nin kader tezini çürüten ilk kanıt oydu — ve Neji bunu ona hiç itiraf etmedi.",
      en: "A boy who cannot mould chakra, has no clan, and was given nothing. He was the first piece of evidence against Neji's thesis on fate — and Neji never once admitted it to him.",
    },
  },
  {
    characterId: 3710,
    name: "Tenten",
    role: { tr: "Sınayan el", en: "The one who tested it" },
    note: {
      tr: "Antrenmanda karşısına dikilen tek kişi. Kaiten'i çalışırken ona binlerce silah fırlattı; kubbenin gerçekten kapandığını ilk gören o oldu.",
      en: "The only person who stood opposite him in training. She threw thousands of weapons at him while he worked on Kaiten; she was the first to see the dome actually close.",
    },
  },
  {
    characterId: 307,
    name: "Might Guy",
    role: { tr: "Öğretmen", en: "The teacher" },
    note: {
      tr: "Ona kaderin olmadığını hiç söylemedi. Sadece iki öğrencisini aynı sahaya çıkardı — biri dâhi, biri yeteneksiz — ve ikisini de aynı terin içinde bıraktı.",
      en: "He never told Neji that fate does not exist. He simply put two students on the same field — one a genius, one a failure — and left them both in the same sweat.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    role: { tr: "Yenilgi", en: "The defeat" },
    note: {
      tr: "Sınav finalinde onu yendi. Neji'nin kaybettiği şey bir maç değil bir cümleydi; o günden sonra 'kader' kelimesini bir daha aynı anlamda kullanmadı.",
      en: "He beat Neji in the exam final. What Neji lost was not a match but a sentence; after that day he never used the word fate in the same sense again.",
    },
  },
] as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca ikisinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı).
 */
export interface NejiFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const NEJI_TIMELINE: NejiFateEntry[] = [
  {
    key: "seal",
    imageKey: NEJI_IMAGE_KEYS.fateSeal,
    age: { tr: "4 yaş", en: "Age 4" },
    title: { tr: "Mühür ve babanın gidişi", en: "The seal, and the father who went" },
    text: {
      tr: "Alnına yan dal mührü işlendi. Aynı dönemde babası Hizashi, ikiz ağabeyi Hiashi'nin yerine Kumogakure'ye teslim edildi. Neji'ye anlatılan hikâye kısaydı: ana dal istedi, yan dal gitti. Dört yaşında bir çocuğun eline verilen bu cümle, on üç yıl boyunca dünyayı açıklamak için kullanacağı tek araç oldu.",
      en: "The branch-house seal was set on his forehead. In the same period his father Hizashi was handed over to Kumogakure in place of his twin brother Hiashi. The story Neji was told was short: the main house asked, the branch house went. That sentence, handed to a four-year-old, became the only instrument he had for explaining the world for the next thirteen years.",
    },
  },
  {
    key: "hinata",
    imageKey: NEJI_IMAGE_KEYS.fateHinata,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Elemede kuzeninin karşısında", en: "Facing his cousin in the preliminary" },
    text: {
      tr: "Chūnin sınavının elemesinde kura onu Hinata'yla eşleştirdi. Neji dövüşten önce ona vâris olamayacağını, sonra da kaderini değiştiremeyeceğini söyledi; dövüşü kazandıktan sonra da vurmaya devam etti ve araya jōnin'ler girdi. Ana dala duyduğu öfkenin faturası, o kararların hiçbirinde payı olmayan bir kıza kesilmişti.",
      en: "The draw for the Chūnin exam preliminaries put him against Hinata. Before the fight he told her she would never be heir, and then that she could not change her fate; after he had already won he kept striking, and the jōnin had to step in. The bill for his anger at the main house was handed to a girl who had no part in any of those decisions.",
    },
    quote: {
      text: { tr: "Kaderini değiştiremezsin.", en: "You cannot change your fate." },
      by: {
        tr: "Neji Hyūga — Chūnin sınavı elemesi",
        en: "Neji Hyūga — Chūnin exam preliminary",
      },
    },
  },
  {
    key: "naruto",
    imageKey: NEJI_IMAGE_KEYS.fateNaruto,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Finalde tezin çöküşü", en: "The thesis collapses in the final" },
    text: {
      tr: "Finalde karşısına Akademi'nin en kötü öğrencisi çıktı. Neji dönemin birincisiydi, klanın dâhisiydi, tekniklerin hepsini tek başına sökmüştü — ve kaybetti. Kaybettiği bir maç değildi: on üç yıldır tek dayanağı olan cümle, kum ve toz içinde, herkesin gözü önünde çürütülmüştü.",
      en: "In the final he drew the Academy's worst student. Neji was top of his year, the clan's prodigy, the boy who had worked out every technique alone — and he lost. What he lost was not a match: the one sentence he had leaned on for thirteen years was refuted in the dirt, in front of everyone.",
    },
  },
  {
    key: "letter",
    imageKey: NEJI_IMAGE_KEYS.fateLetter,
    age: { tr: "13 yaş sonrası", en: "After thirteen" },
    title: { tr: "Mektup ve ana dalla antrenman", en: "The letter, and training with the main house" },
    text: {
      tr: "Sınavdan sonra Hiashi ona babasının bıraktığı mektubu verdi. Hizashi'yi kimse zorlamamıştı: gitmeyi kendi seçmişti — klan için değil, kardeşi ve oğlu için. Neji on üç yıl boyunca bir emir sandığı şeyin bir karar olduğunu öğrendi. Ana dal onu antrenmana çağırdı, iki dal arasındaki gerilim ilk kez gevşedi ve Neji dönemindeki ilk jōnin oldu.",
      en: "After the exam Hiashi gave him the letter his father had left. No one had forced Hizashi: he had chosen to go — not for the clan, but for his brother and for his son. What Neji had taken for an order for thirteen years turned out to have been a decision. The main house called him in to train, the tension between the two branches eased for the first time, and Neji became the first jōnin of his year.",
    },
  },
  {
    key: "war",
    imageKey: NEJI_IMAGE_KEYS.fateWar,
    age: { tr: "17 yaş", en: "Age 17" },
    title: { tr: "Savaşta, kendi ayağıyla", en: "In the war, of his own accord" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda On Kuyruklu'nun fırlattığı ahşap mızraklar Naruto ile Hinata'ya yöneldiğinde Neji araya girdi. Kimse ondan bunu istememişti, hiçbir emir yoktu, hiçbir mühür çalıştırılmamıştı. Hayatını yan dalın kuralı için değil, kendi seçtiği iki kişi için verdi — babasının mektubunda anlattığı şeyin aynısını yaparak.",
      en: "In the Fourth Great Shinobi War, when the Ten-Tails' wooden spears turned towards Naruto and Hinata, Neji stepped into their path. No one had asked him to, there was no order, no seal had been triggered. He gave his life not for the rule of the branch house but for two people he had chosen himself — doing exactly what his father's letter had described.",
    },
    quote: {
      text: {
        tr: "Çünkü senin hayatın artık yalnızca sana ait değil.",
        en: "Because your life is not yours alone any more.",
      },
      by: {
        tr: "Neji Hyūga — Naruto'ya, savaş alanında",
        en: "Neji Hyūga — to Naruto, on the battlefield",
      },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const NEJI_CLOSING = {
  quotes: [
    {
      text: { tr: "Kaderini değiştiremezsin.", en: "You cannot change your fate." },
      by: { tr: "Neji Hyūga, 13", en: "Neji Hyūga, aged 13" },
      note: {
        tr: "Kuzeninin karşısında, elemede. O gün buna kendisi de inanıyordu.",
        en: "Said to his cousin, in the preliminary. That day he believed it himself.",
      },
    },
    {
      text: {
        tr: "Çünkü senin hayatın artık yalnızca sana ait değil.",
        en: "Because your life is not yours alone any more.",
      },
      by: { tr: "Neji Hyūga, 17", en: "Neji Hyūga, aged 17" },
      note: {
        tr: "Naruto'nun önüne atıldıktan sonra. Aynı ağızdan çıkan iki cümle; ikincisi birincisini geçersiz kılıyor.",
        en: "Said after throwing himself in front of Naruto. Two sentences from the same mouth; the second one voids the first.",
      },
    },
  ],
  motto: "籠の中の鳥",
  mottoNote: {
    tr: "kago no naka no tori — “kafesteki kuş”, yan dal mührünün adı",
    en: "kago no naka no tori — “caged bird”, the name of the branch-house seal",
  },
  /** Kader dilini kıran kapanış — sayfanın omurgası burada tersine dönüyor */
  breaks: [
    {
      tr: "Bu sayfanın bölüm başlıkları kaderin değişmediğini söyleyen bir dille yazıldı. O dil arşivin değil, Neji'nin kendi diliydi.",
      en: "The section headings on this page were written in a language that says fate does not change. That language was not the archive's — it was Neji's own.",
    },
    {
      tr: "Ama sonuna kadar taşımadı. On üç yaşında bir kızın karşısında kaderin doğumda yazıldığını söyleyen çocuk, on yedi yaşında kimsenin ondan istemediği bir yere kendi ayağıyla yürüdü.",
      en: "He did not carry it to the end. The boy who told a girl at thirteen that fate is written at birth walked, at seventeen, of his own accord to a place no one had asked him to go.",
    },
    {
      tr: "Mühür alnında kaldı; ölürken bile oradaydı. Kırılan kafes değildi — cümleydi.",
      en: "The seal stayed on his forehead; it was there even as he died. What broke was not the cage. It was the sentence.",
    },
  ],
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, rütbe) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; damar ağı, yan dal mührü, sekiz trigram çubukları ve altmış dört tenketsu şeması bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, rank) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the vein network, the branch-house seal, the eight trigram bars and the sixty-four tenketsu diagram are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
