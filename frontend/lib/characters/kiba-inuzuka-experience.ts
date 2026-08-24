import type { LocalizedText } from "./types";

/**
 * Kiba Inuzuka — "İki Beden, Tek Sürü" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi ve Shikamaru emsali): karaktere özel BÜTÜN anlatı kodda,
 * iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1). Görseller
 * veritabanında — characterId 3495 kaydının ABILITY yuvaları, `kiba:*`
 * anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama AYAKTA çizilir.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (7 Temmuz), kan grubu (B), yaş aralığı (12–17), boy
 * (151,2 cm / 169,1 cm), takım satırı ("Team Kurenai") ve Konohagakure
 * bağlılığı AniList künyesinden birebir alındı (24 Ağustos 2026'da çekilen
 * `anilist-detay-22.json`, karakter 3495). Chūnin rütbesi de aynı künyenin
 * açıklama metninde geçiyor. Kilo AniList kaydında YOK, künye şeridinde de
 * yok — uydurulmadı.
 *
 * ── REPLİK DİSİPLİNİ (BRIEF §9) ──────────────────────────────────────────
 * ⚠️ Sayfada TEK bir replik var: 「行くぞ、アカマル!」. Kiba'nın her görev
 * başında Akamaru'ya söylediği, iki dilde de tereddütsüz doğrulanabilen
 * cümle bu. Kader çizelgesine ikinci bir replik KONULMADI: hatırladığım
 * hiçbir ikinci cümlenin birebir lafzından emin değilim ve brief uydurma
 * repliği yasaklıyor. Kapanışın ikinci gövdesi bu yüzden tırnak değil,
 * açıkça "arşivin notu" olarak etiketlenmiş kendi cümlemiz. Dövüşlerin
 * ayrıntıları da düz anlatı hâlinde yazıldı, tırnak içinde değil.
 *
 * ── ÖZEL ADLAR ───────────────────────────────────────────────────────────
 * Jutsu adları çevrilmiyor (Gatsūga, Jūjin Bunshin, Sōtōrō, Garōga,
 * Shikyaku no Jutsu); yanlarındaki Türkçe/İngilizce satır adın AÇIKLAMASI.
 */

export const KIBA_ID = 3495;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const KIBA_SITE_URL = "https://anilist.co/character/3495";

/**
 * Sergi görselleri — hepsi characterId 3495 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `kiba:` önekli (kurator modu şartı).
 */
export const KIBA_IMAGE_KEYS = {
  /** Hero: geniş, tozlu; solda figür, sağda boş arazi (16:9) */
  hero: "kiba:hero",
  scent: "kiba:scent",
  gatsuga: "kiba:gatsuga",
  jujin: "kiba:jujin-bunshin",
  sotoro: "kiba:sotoro",
  kitShikyaku: "kiba:kit-shikyaku",
  kitMarking: "kiba:kit-marking",
  kitPill: "kiba:kit-pill",
  kitTrack: "kiba:kit-track",
  syncApart: "kiba:sync-apart",
  syncUnison: "kiba:sync-unison",
  syncRide: "kiba:sync-ride",
  syncClone: "kiba:sync-clone",
  syncWolf: "kiba:sync-wolf",
  fateAkamaru: "kiba:fate-akamaru",
  fateChunin: "kiba:fate-chunin",
  fateSakon: "kiba:fate-sakon",
  fateWound: "kiba:fate-wound",
  fateWar: "kiba:fate-war",
  closing: "kiba:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const KIBA_SLOT_LABELS: Record<string, LocalizedText> = {
  [KIBA_IMAGE_KEYS.hero]: {
    tr: "Hero — tozlu geniş arazi, solda ikili, sağı boş (16:9)",
    en: "Hero — dusty wide ground, the pair at left, empty right (16:9)",
  },
  [KIBA_IMAGE_KEYS.scent]: {
    tr: "Koku izi — havayı okuyan burun, kalkık baş",
    en: "The scent trail — the nose reading the air, head raised",
  },
  [KIBA_IMAGE_KEYS.gatsuga]: {
    tr: "Gatsūga — dönen çift burgu",
    en: "Gatsūga — the two spinning drills",
  },
  [KIBA_IMAGE_KEYS.jujin]: {
    tr: "Jūjin Bunshin — Akamaru Kiba'nın şeklini alırken",
    en: "Jūjin Bunshin — Akamaru taking Kiba's shape",
  },
  [KIBA_IMAGE_KEYS.sotoro]: {
    tr: "Sōtōrō — iki başlı kurt",
    en: "Sōtōrō — the two-headed wolf",
  },
  [KIBA_IMAGE_KEYS.kitShikyaku]: {
    tr: "Shikyaku no Jutsu — dört ayak üstündeki duruş",
    en: "Shikyaku no Jutsu — the four-legged stance",
  },
  [KIBA_IMAGE_KEYS.kitMarking]: {
    tr: "Dinamik İşaretleme — hedefin üstündeki iz",
    en: "Dynamic Marking — the mark left on the target",
  },
  [KIBA_IMAGE_KEYS.kitPill]: {
    tr: "Askerî hap — kızarmış tüy",
    en: "The soldier pill — the reddened coat",
  },
  [KIBA_IMAGE_KEYS.kitTrack]: {
    tr: "Koku takibi — yerde alınan iz",
    en: "Scent tracking — the trail taken off the ground",
  },
  [KIBA_IMAGE_KEYS.syncApart]: {
    tr: "1. kademe — iki ayrı gövde, iki ayrı iş",
    en: "Stage 1 — two separate bodies, two separate jobs",
  },
  [KIBA_IMAGE_KEYS.syncUnison]: {
    tr: "2. kademe — aynı anda, aynı yöne",
    en: "Stage 2 — at the same moment, in the same direction",
  },
  [KIBA_IMAGE_KEYS.syncRide]: {
    tr: "3. kademe — biri diğerinin üstünde",
    en: "Stage 3 — one carried by the other",
  },
  [KIBA_IMAGE_KEYS.syncClone]: {
    tr: "4. kademe — iki Kiba",
    en: "Stage 4 — two Kibas",
  },
  [KIBA_IMAGE_KEYS.syncWolf]: {
    tr: "5. kademe — tek gövde, iki baş",
    en: "Stage 5 — one body, two heads",
  },
  [KIBA_IMAGE_KEYS.fateAkamaru]: {
    tr: "Akamaru ile büyümek — ceketin içindeki yavru",
    en: "Growing up with Akamaru — the pup inside the jacket",
  },
  [KIBA_IMAGE_KEYS.fateChunin]: {
    tr: "Chūnin sınavı — Naruto'ya yenilgi",
    en: "The Chūnin exam — the loss to Naruto",
  },
  [KIBA_IMAGE_KEYS.fateSakon]: {
    tr: "Sasuke kurtarma görevi — Sakon ve Ukon",
    en: "The Sasuke retrieval mission — Sakon and Ukon",
  },
  [KIBA_IMAGE_KEYS.fateWound]: {
    tr: "Akamaru'nun yaralanması — patlamadan sonrası",
    en: "Akamaru wounded — after the blast",
  },
  [KIBA_IMAGE_KEYS.fateWar]: {
    tr: "Savaş — cephede kalkık bir burun",
    en: "The war — a raised nose at the front",
  },
  [KIBA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — tozun içinde uzaklaşan iki siluet",
    en: "Closing — two silhouettes leaving through the dust",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const KIBA_IDENTITY = {
  name: "Kiba Inuzuka",
  nativeName: "犬塚キバ",
  /** Hero filigranı — klan adı, dekoratif (aria-hidden) */
  watermark: "犬塚",
  clan: { tr: "Inuzuka Klanı", en: "Inuzuka Clan" },
  epigraph: {
    tr: "İki beden sayıldı, tek sürü olarak dövüştü. Kiba'nın gücü kendinde değil, aradaki mesafede: o mesafe kapandıkça ikisi bir şeye dönüşüyor.",
    en: "Counted as two bodies, they fought as one pack. Kiba's strength is not in him but in the distance between them: as that distance closes, the two turn into a single thing.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "7 Temmuz", en: "7 July" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "151,2 cm (I) · 169,1 cm (II)",
        en: "151.2 cm (I) · 169.1 cm (II)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "12–17", en: "12–17" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) → Chūnin (II)", en: "Genin (I) → Chūnin (II)" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "8. Takım — Kurenai, Hinata, Shino",
        en: "Team 8 — Kurenai, Hinata, Shino",
      },
    },
    {
      label: { tr: "Bağlılık", en: "Affiliation" },
      value: { tr: "Konohagakure", en: "Konohagakure" },
    },
    {
      label: { tr: "Ayrılmadığı", en: "Never without" },
      value: {
        tr: "Akamaru — ninken, ortak, ikinci beden",
        en: "Akamaru — ninken, partner, second body",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

/**
 * Sayfanın tek boolean'ı. Açıldığında sayfa İKİYE KATLANIR: başlık ve hero
 * ikinci bir kopya kazanır, koku izi çiftlenir, kenarlar pençe rengine döner.
 *
 * ⚠️ Aynı ad kademe merdiveninin 4. kademesinde de geçiyor ve bu bilinçli:
 * teknik bir kez ANLATININ içinde (bir kademe), bir kez de SAYFANIN kendi
 * durumu olarak kullanılıyor. Ziyaretçi tekniği okumadan önce onu bir
 * düğme olarak deneyebilsin diye.
 */
export const KIBA_CLONE_TEXT = {
  enter: { tr: "Beast Human Clone", en: "Beast Human Clone" },
  exit: { tr: "Klonu çöz", en: "Release the clone" },
  hint: {
    tr: "Sayfa ikiye katlandı: her başlığın bir kopyası var, koku izi çiftlendi.",
    en: "The page has doubled: every heading carries a copy, and the scent trail runs twice.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const KIBA_HERO = {
  lede: {
    tr: "Akademiye ceketinin içinde bir köpek yavrusuyla gelen çocuk. Arkadaşları onu şımarık bir hayvan sevdalısı sandı; Inuzuka klanında ise bu, eğitimin başladığı gün demekti.",
    en: "The boy who came to the Academy with a puppy inside his jacket. His classmates took it for a spoiled child's pet; in the Inuzuka clan it meant the training had begun.",
  },
  markCaption: {
    tr: "Yanaklardaki iki üçgen boya değil, klan işareti: Inuzuka olarak doğanın yüzüne ilk yazılan şey.",
    en: "The two triangles on his cheeks are not paint but the clan's mark: the first thing written on the face of anyone born Inuzuka.",
  },
  portraitAlt: {
    tr: "Kiba Inuzuka — arşive yüklenmiş kadro portresi",
    en: "Kiba Inuzuka — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Kiba Inuzuka — AniList künye portresi",
    en: "Kiba Inuzuka — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const KIBA_ALT = {
  packSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const KIBA_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const KIBA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Bir tutanağın söyleyebildikleri. Söyleyemediği şey, satırların hiçbirinde adı geçmeyen ikinci bedendir.",
      en: "What a file can state. What it cannot state is the second body, which appears on none of these lines.",
    },
  },
  scent: {
    title: { tr: "Koku izi", en: "The scent trail" },
    lede: {
      tr: "Kiba dünyayı önce burnuyla okur, sonra gözüyle doğrular. Aşağıdakiler gördüğü şeyler değil, ayırt ettiği şeyler.",
      en: "Kiba reads the world with his nose first and confirms it with his eyes after. What follows is not what he sees but what he tells apart.",
    },
  },
  pack: {
    title: { tr: "Sürü", en: "The pack" },
    lede: {
      tr: "8. Takım bir arama takımıdır: Hinata'nın gözü uzağı, Shino'nun böcekleri geniş alanı, Kiba'nın burnu ise izin tazeliğini verir. Üçünün tek başına yaptığı iş yarımdır.",
      en: "Team 8 is a tracking squad: Hinata's eyes give distance, Shino's insects give area, Kiba's nose gives the age of the trail. Alone, each of the three does half a job.",
    },
  },
  jutsu: {
    title: { tr: "Üç teknik, tek ilke", en: "Three techniques, one principle" },
    lede: {
      tr: "Inuzuka tekniklerinin hepsi aynı cümlenin farklı ayarları: iki gövdeyi tek bir hareketin içine sok. Aşağıdaki üçü o ayarın en uç noktaları.",
      en: "Every Inuzuka technique is the same sentence at a different setting: put two bodies inside one movement. These three are that setting at its limits.",
    },
  },
  kit: {
    title: { tr: "Çantadakiler", en: "In the pouch" },
    lede: {
      tr: "Teknikleri ayakta tutan dört küçük şey. Biri duruş, biri şaka, biri ilaç, biri de mesleğin kendisi.",
      en: "Four small things that keep the techniques standing. One is a stance, one a joke, one a drug, and one is the trade itself.",
    },
  },
  sync: {
    title: { tr: "Eş zamanlama kademeleri", en: "Stages of synchrony" },
    lede: {
      tr: "Bu bölümde sayfa iki sütuna ayrılır: solda Kiba, sağda Akamaru. Kademeyi yükselttikçe iki sütun birbirine yaklaşır ve sonuncusunda tek gövdeye kilitlenir. Düzenin kendisi anlatının parçası.",
      en: "Here the page splits into two columns: Kiba at left, Akamaru at right. Raise the stage and the columns close in on each other until, at the last one, they lock into a single body. The layout itself is part of the story.",
    },
  },
  fate: {
    title: { tr: "Ömür çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. Biri bir başlangıç, ikisi yenilgi, biri neredeyse bir ölüm, sonuncusu bir savaş.",
      en: "Five entries. One beginning, two defeats, one near-death, and a war at the end.",
    },
  },
} as const;

/* ── Koku izi — neyin kokusunu nasıl ayırt ettiği ───────────────────────── */

/**
 * Bu bölüm bilinçli olarak ARŞİVİN YORUMU: tek tek sahnelere değil,
 * Inuzuka burnunun ne tür ayrımlar yaptığına dayanıyor. Sahne iddiası
 * yok, bu yüzden replik de yok.
 */
export const KIBA_SCENT = [
  {
    key: "fear" as const,
    reading: { tr: "Korku", en: "Fear" },
    note: {
      tr: "Bir yüz sakin kalabilir; ter, nefes ve deri kalamaz. Kiba karşısındakinin çözülmeye başladığını, o kişi daha bunu kendine itiraf etmeden bilir. Kavgayı sevmesinin sebebi de kısmen bu: kimin tutunduğunu koklayarak takip edebiliyor.",
      en: "A face can stay calm; sweat, breath and skin cannot. Kiba knows the man across from him has started to come apart before that man admits it to himself. It is part of why he enjoys a fight: he can follow, by smell, who is still holding on.",
    },
  },
  {
    key: "clone" as const,
    reading: { tr: "Klon ile asıl", en: "Clone and original" },
    note: {
      tr: "Bir kopya biçimi ödünç alabilir, kokuyu alamaz. Kiba için kalabalık bir gölge sürüsünün içinde tek gerçek bedeni bulmak bir bilmece değil, bir eleme işlemidir — teknik ne kadar iyiyse burun o kadar işe yarar.",
      en: "A copy can borrow a shape but not a smell. For Kiba, finding the one real body inside a crowd of shadows is not a riddle but an elimination — the better the technique, the more useful the nose.",
    },
  },
  {
    key: "blood" as const,
    reading: { tr: "Kan", en: "Blood" },
    note: {
      tr: "Ne kadar, ne kadar taze, kime ait. Bir arama takımının en acele kararı budur: yaralı hâlâ hareket ediyor mu, yoksa iz artık bir cesedin izi mi?",
      en: "How much, how fresh, whose. This is the most urgent call a tracking squad makes: is the wounded one still moving, or is the trail now the trail of a body?",
    },
  },
  {
    key: "trail" as const,
    reading: { tr: "İz ve zaman", en: "Trail and time" },
    note: {
      tr: "Gözün kaybettiği iz burun için hâlâ sıcaktır. Kiba bir izin ne kadar eskidiğini söyleyebildiği için takım hız kararını ona göre verir: koşulacak mı, beklenecek mi, yön mü değiştirilecek.",
      en: "A trail the eye has lost is still warm to the nose. Because Kiba can say how old a track is, the squad sets its pace by him: run, wait, or turn.",
    },
  },
  {
    key: "crowd" as const,
    reading: { tr: "Kalabalık", en: "The crowd" },
    note: {
      tr: "Yüz kokunun içinden bir tanesini çekip almak, Inuzuka eğitiminin en sıkıcı ve en pahalı kısmı. Klanın burnu bir köpeğinkinden kat kat keskin diye kayda geçmiş; asıl beceri keskinlikte değil, ayıklamada.",
      en: "Pulling one thread out of a hundred is the dullest and most expensive part of Inuzuka training. The clan's sense of smell is recorded as many times sharper than a dog's; the real skill is not the sharpness but the sorting.",
    },
  },
] as const;

/* ── Sürü (yoldaş portreleri) ───────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3495]` listesiyle birebir
 * aynı: 4773 Kurenai, 1555 Hinata, 3428 Shino, 17 Naruto. Portre kaydı
 * olmayan üye adıyla çizilir, bölüm çökmez.
 */
export const KIBA_PACK = [
  {
    characterId: 4773,
    name: "Kurenai Yūhi",
    role: { tr: "Takımı kuran", en: "The one who built the squad" },
    note: {
      tr: "Üç ayrı algı organını tek bir müfrezeye çeviren jōnin. Kiba'nın öfkesini bastırmaya değil, ona bir yön vermeye çalıştı: burun önden gider, karar arkadan gelir.",
      en: "The jōnin who turned three separate sense organs into one unit. She never tried to suppress Kiba's temper, only to give it a direction: the nose goes first, the decision follows.",
    },
  },
  {
    characterId: 1555,
    name: "Hinata Hyūga",
    role: { tr: "Uzağı gören", en: "The one who sees far" },
    note: {
      tr: "Byakugan menzili kilometrelerle ölçülür; Kiba'nın burnu ise izin yaşını verir. Takımın haritası ikisinin kesişiminde çıkar: nerede olduğu Hinata'dan, ne zaman geçtiği Kiba'dan.",
      en: "The Byakugan's range is measured in kilometres; Kiba's nose gives the age of the trail. The squad's map is drawn where the two meet: where, from Hinata — when, from Kiba.",
    },
  },
  {
    characterId: 3428,
    name: "Shino Aburame",
    role: { tr: "Geniş alanı tarayan", en: "The one who sweeps the field" },
    note: {
      tr: "Böcekleri bir alanı Kiba'nın koşarak tarayacağından çok daha geniş tarar, ama sessizdirler. Kiba'nın sabırsızlığı ile Shino'nun soğukluğu takımın iki ucu: aynı takımda durmalarının sebebi de bu.",
      en: "His insects cover more ground than Kiba could ever run, and they do it silently. Kiba's impatience and Shino's coolness are the squad's two ends — which is exactly why they stand in the same squad.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    role: { tr: "Ölçüyü bozan", en: "The one who broke the measure" },
    note: {
      tr: "Chūnin sınavında Kiba'nın karşısına sınıfın en zayıfı olarak çıktı ve kazandı. O yenilgi Kiba'nın kariyerindeki en yararlı kayıt: güç sıralamasının kâğıt üstünde tutulmadığını ilk oradan öğrendi.",
      en: "He stepped up in the Chūnin exam as the weakest of the class, and won. That defeat is the most useful entry in Kiba's file: it was the first place he learned that the ranking does not hold on paper.",
    },
  },
] as const;

/* ── Üç büyük teknik ────────────────────────────────────────────────────── */

export const KIBA_JUTSU = [
  {
    key: "gatsuga" as const,
    imageKey: KIBA_IMAGE_KEYS.gatsuga,
    kanji: "牙通牙",
    name: "Gatsūga",
    turkish: { tr: "Çift Kurt Kesiği", en: "Fang Passing Fang" },
    tagline: {
      tr: "İki gövde kendi ekseninde döner ve iki ayrı burgu hâline gelir.",
      en: "Two bodies spin on their own axes and become two separate drills.",
    },
    text: {
      tr: "Tekniğin gövdesi basit: dört ayak duruşundan alınan hız, dönüşe çevrilir ve beden bir matkap ucuna dönüşür. Asıl mesele iki burgunun aynı hedefe farklı açılardan girmesi — biri savuşturulduğunda diğeri zaten yoldadır. Kiba bunu tek başına da yapabilir, ama tek burgu yalnızca bir saldırıdır; iki burgu bir kıskaçtır. Sayfanın bütün fikri bu farkta duruyor.",
      en: "The body of the technique is simple: the speed taken from the four-legged stance is converted into spin, and the body becomes a drill bit. What matters is that the two drills enter the same target from different angles — parry one and the other is already on its way. Kiba can do it alone, but a single drill is only an attack; two drills are a pincer. The whole idea of this page sits in that difference.",
    },
    traits: [
      { tr: "İki açı, tek hedef", en: "Two angles, one target" },
      { tr: "Dört ayak duruşu şart", en: "Requires the four-legged stance" },
      { tr: "Savuşturulması pahalı", en: "Expensive to parry" },
    ],
  },
  {
    key: "jujin" as const,
    imageKey: KIBA_IMAGE_KEYS.jujin,
    kanji: "獣人分身",
    name: "Jūjin Bunshin",
    turkish: { tr: "Canavar İnsan Klonu", en: "Beast Human Clone" },
    tagline: {
      tr: "Akamaru Kiba'nın şeklini alır — kopya değil, ikinci bir asıl.",
      en: "Akamaru takes Kiba's shape — not a copy, a second original.",
    },
    text: {
      tr: "Diğer klon tekniklerinden ayrıldığı yer şurası: ortaya çıkan şey bir yanılsama değil, gerçekten oradaki bir beden. Vurur, vurulur, kendi kararını verir. Bu yüzden teknik iki kişiyi bir kişiye indirmiyor, bir kişiyi iki kişiye çıkarıyor — ve bunun bedelini Akamaru ödüyor: kendi biçiminden vazgeçip ortağının biçimine giriyor. Sayfanın üstündeki mod düğmesi tam olarak bunu yapıyor.",
      en: "Here is where it parts from every other clone technique: what appears is not an illusion but a body that is genuinely there. It strikes, it can be struck, it decides for itself. So the technique does not reduce two people to one — it raises one person to two, and Akamaru pays for it, giving up his own shape to enter his partner's. The mode button on this page does exactly that.",
    },
    traits: [
      { tr: "Yanılsama değil, beden", en: "A body, not an illusion" },
      { tr: "İki asıl, tek koku", en: "Two originals, one scent" },
      { tr: "Bedeli Akamaru öder", en: "Akamaru pays the price" },
    ],
  },
  {
    key: "sotoro" as const,
    imageKey: KIBA_IMAGE_KEYS.sotoro,
    kanji: "双頭狼",
    name: "Sōtōrō",
    turkish: { tr: "İki Başlı Kurt", en: "Two-Headed Wolf" },
    tagline: {
      tr: "İki klon birleşir: tek gövde, iki baş, tek karar.",
      en: "The two clones merge: one body, two heads, one decision.",
    },
    text: {
      tr: "Ortaklığın gidebildiği en uç nokta. Jūjin Bunshin'den sonra iki beden birbirinden ayrı durmayı bırakır ve tek bir kurt gövdesinde birleşir; iki baş kalır, çünkü hâlâ iki zihin vardır. Bu hâlden çıkan Garōga, Gatsūga'nın çok daha büyük ve çok daha pahalı sürümüdür. Kiba bu tekniği seyrek kullanır: birleşmek, iki bedenin de aynı anda yorulması demek — biri düşerse diğerinin taşıyacak yeri kalmaz.",
      en: "The furthest the partnership can go. After Jūjin Bunshin the two bodies stop standing apart and merge into a single wolf; two heads remain, because there are still two minds. What comes out of that form, Garōga, is a far larger and far costlier version of Gatsūga. Kiba uses it rarely: merging means both bodies tire at the same moment — if one falls, the other has nothing left to carry it with.",
    },
    traits: [
      { tr: "Tek gövde, iki zihin", en: "One body, two minds" },
      { tr: "Garōga'nın kapısı", en: "The door to Garōga" },
      { tr: "İkisi birden yorulur", en: "Both tire at once" },
    ],
  },
] as const;

/* ── Dört küçük ─────────────────────────────────────────────────────────── */

export const KIBA_KIT = [
  {
    key: "shikyaku" as const,
    imageKey: KIBA_IMAGE_KEYS.kitShikyaku,
    name: { tr: "Shikyaku no Jutsu", en: "Shikyaku no Jutsu" },
    gloss: { tr: "Dört Ayak Tekniği", en: "Four Legs Technique" },
    note: {
      tr: "Çakra dört uzva birden dağıtılır; duruş alçalır, tırnaklar uzar, hız ve koku alma keskinleşir. Diğer bütün Inuzuka teknikleri bu duruşun üstüne kurulur — önce hayvan gibi durursun, sonra hayvan gibi dövüşürsün.",
      en: "Chakra is spread across all four limbs; the stance drops, the nails lengthen, speed and smell sharpen. Every other Inuzuka technique is built on this posture — first you stand like an animal, then you fight like one.",
    },
  },
  {
    key: "marking" as const,
    imageKey: KIBA_IMAGE_KEYS.kitMarking,
    name: { tr: "Dinamik İşaretleme", en: "Dynamic Marking" },
    gloss: { tr: "Akamaru'nun katkısı", en: "Akamaru's contribution" },
    note: {
      tr: "Akamaru hedefin üstüne işer. Sayfanın tek şakası ama işlevi ciddi: işaretlenen kişi kaçamaz, saklanamaz, kalabalığa karışamaz — koku artık onun kendi kokusu değildir. Klanın en kaba tekniği aynı zamanda en pratik olanı.",
      en: "Akamaru urinates on the target. It is the only joke on this page, and its function is entirely serious: a marked man cannot run, hide, or lose himself in a crowd — the smell is no longer his own. The clan's crudest technique is also its most practical.",
    },
  },
  {
    key: "pill" as const,
    imageKey: KIBA_IMAGE_KEYS.kitPill,
    name: { tr: "Askerî hap", en: "The soldier pill" },
    gloss: { tr: "Akamaru için", en: "For Akamaru" },
    note: {
      tr: "Şinobinin çakrasını zorla toparlayan hap, Akamaru'ya verildiğinde tüylerini kızıla çevirir ve gücünü katlar. Kiba bunu ancak sıkıştığında yapar; çünkü hap bir kaynak yaratmaz, kalanı hızlıca harcar — bedeli sonra ödenir.",
      en: "The pill that forces a shinobi's chakra back together turns Akamaru's coat red and multiplies his strength. Kiba only reaches for it when cornered: the pill creates nothing, it spends what is left faster — and the bill arrives afterwards.",
    },
  },
  {
    key: "track" as const,
    imageKey: KIBA_IMAGE_KEYS.kitTrack,
    name: { tr: "Koku takibi", en: "Scent tracking" },
    gloss: { tr: "Mesleğin kendisi", en: "The trade itself" },
    note: {
      tr: "Kiba'nın savaş alanı dışındaki asıl işi. Bir arama takımının değeri kaç düşman devirdiğiyle değil, kaç saat kazandırdığıyla ölçülür; Inuzuka burnu köyün kazandığı saatlerin adıdır.",
      en: "Kiba's real job, away from the battlefield. A tracking squad is not measured by how many enemies it puts down but by how many hours it saves; the Inuzuka nose is the name of the village's saved hours.",
    },
  },
] as const;

/* ── Eş zamanlama kademeleri — sayfanın kalbi ───────────────────────────── */

export const KIBA_SYNC_UI = {
  groupLabel: { tr: "Eş zamanlama kademesi", en: "Stage of synchrony" },
  stageWord: { tr: "kademe", en: "stage" },
  prev: { tr: "Bir kademe geri", en: "One stage back" },
  next: { tr: "Bir kademe ileri", en: "One stage forward" },
  kibaColumn: { tr: "Kiba", en: "Kiba" },
  akamaruColumn: { tr: "Akamaru", en: "Akamaru" },
  kibaRole: { tr: "İnsan taraf", en: "The human side" },
  akamaruRole: { tr: "Hayvan taraf", en: "The animal side" },
  bondLabel: { tr: "Ortak olan", en: "What is shared" },
  keyboardHint: {
    tr: "Kademeler arasında ok tuşlarıyla da gezebilirsin; Home ilk, End son kademeye gider.",
    en: "The arrow keys move between stages; Home jumps to the first and End to the last.",
  },
  diagramAlt: {
    tr: "Şema: iki ayrı bağ, kademe yükseldikçe birbirine yaklaşır ve son kademede tek bir gövdede iki baş olarak birleşir.",
    en: "Diagram: two separate cords draw closer as the stage rises and merge, at the last stage, into two heads on a single body.",
  },
} as const;

export interface KibaSyncStage {
  key: string;
  imageKey: string;
  kanji: string;
  romaji: string;
  title: LocalizedText;
  kiba: LocalizedText;
  akamaru: LocalizedText;
  bond: LocalizedText;
}

/**
 * Beş kademe.
 *
 * Kademe numarası düzenin kendisini sürüyor (bkz. `.duet[data-stage]`):
 * 0'da iki sütun en uzak, 4'te tek sütun. Metin ile düzenin aynı şeyi
 * söylemesi bu bölümün varlık sebebi.
 */
export const KIBA_SYNC: KibaSyncStage[] = [
  {
    key: "apart",
    imageKey: KIBA_IMAGE_KEYS.syncApart,
    kanji: "単独",
    romaji: "tandoku",
    title: { tr: "Ayrı", en: "Apart" },
    kiba: {
      tr: "Kavgayı arar, ilk giren odur, hata da ilk onda olur. Öfkelendiğinde hesabı kaçırdığı defalarca kayda geçmiş; takımın en hızlı uzvu aynı zamanda en kırılgan kararıdır.",
      en: "He looks for the fight, he goes in first, and the first mistake is his too. It is on record more than once that he loses the arithmetic when he gets angry; the squad's fastest limb is also its most brittle decision.",
    },
    akamaru: {
      tr: "Kendi başına da bir şinobidir: kendi kararını verir, kendi kaçış yolunu seçer, gerektiğinde Kiba'nın emrini beklemez. Bir bineğe değil, bir ortağa bakıyorsun.",
      en: "He is a shinobi in his own right: his own decisions, his own way out, and no waiting for Kiba's order when it matters. You are looking at a partner, not a mount.",
    },
    bond: {
      tr: "Bu kademede ortak olan tek şey güven. İki gövde, iki karar, iki risk.",
      en: "At this stage the only thing shared is trust. Two bodies, two decisions, two risks.",
    },
  },
  {
    key: "unison",
    imageKey: KIBA_IMAGE_KEYS.syncUnison,
    kanji: "連携",
    romaji: "renkei",
    title: { tr: "Aynı anda", en: "In unison" },
    kiba: {
      tr: "Hedefi seçer ve zamanı söyler. Sözle değil: duruşuyla, nefesiyle, ağırlığını hangi ayağa verdiğiyle. Akamaru bu işaretleri Kiba'nın kendisinden daha hızlı okuyor.",
      en: "He picks the target and calls the moment. Not with words: with his stance, his breath, which foot he puts his weight on. Akamaru reads those signals faster than Kiba issues them.",
    },
    akamaru: {
      tr: "Aynı anda, ama aynı yerden değil. İki gövdenin değeri tam olarak burada: bir hedefe iki yönden aynı saniyede girmek, tek gövdenin asla yapamayacağı şey.",
      en: "At the same moment, but not from the same place. This is exactly what two bodies are worth: entering one target from two directions in the same second, which one body can never do.",
    },
    bond: {
      tr: "Ortak olan zamanlama. Kararlar hâlâ iki, ama saat tek.",
      en: "What is shared is timing. Still two decisions, but a single clock.",
    },
  },
  {
    key: "ride",
    imageKey: KIBA_IMAGE_KEYS.syncRide,
    kanji: "四脚",
    romaji: "shikyaku",
    title: { tr: "Üstüne binme", en: "Riding" },
    kiba: {
      tr: "Shikyaku no Jutsu ile duruş alçalır ve iki gövde tek bir zeminde hareket etmeye başlar. Sıra önemli: önce insan hayvan gibi durmayı öğrenir, sonra ikisi birbirinin ağırlığını taşır.",
      en: "With Shikyaku no Jutsu the stance drops and the two bodies begin moving on one ground. The order matters: first the human learns to stand like an animal, then the two carry each other's weight.",
    },
    akamaru: {
      tr: "Çocukken Kiba'nın başında duran yavru, Shippūden'de Kiba'yı sırtında taşıyan bir hayvana dönüştü. Ortaklığın en açık ölçüsü bu tersine dönüş: kimin kimi taşıdığı yıllar içinde yer değiştirdi.",
      en: "The pup that rode on Kiba's head as a child becomes, by Shippūden, the animal that carries Kiba on its back. That reversal is the clearest measure of the partnership: who carries whom changed places over the years.",
    },
    bond: {
      tr: "Ortak olan ağırlık merkezi. İki gövde artık tek bir dengeyi paylaşıyor.",
      en: "What is shared is the centre of gravity. Two bodies now hold one balance.",
    },
  },
  {
    key: "clone",
    imageKey: KIBA_IMAGE_KEYS.syncClone,
    kanji: "獣人分身",
    romaji: "jūjin bunshin",
    title: { tr: "Jūjin Bunshin", en: "Jūjin Bunshin" },
    kiba: {
      tr: "Karşı taraf artık iki Kiba görüyor ve hangisinin asıl olduğunu bilmiyor — çünkü ikisi de asıl. Bu, Kiba'nın karşısındakine verdiği en zor soru.",
      en: "The other side now sees two Kibas and cannot tell which is the original — because both are. This is the hardest question Kiba ever puts to an opponent.",
    },
    akamaru: {
      tr: "Kendi biçiminden vazgeçiyor. Teknik ona bir kostüm giydirmiyor, ortağının bedenini veriyor; sürünün içinde bir hayvanın verebileceği en büyük taviz bu.",
      en: "He gives up his own shape. The technique does not dress him in a costume, it hands him his partner's body — the largest concession an animal can make inside a pack.",
    },
    bond: {
      tr: "Ortak olan biçim. İki gövde aynı silueti taşıyor, kokusu bile karışıyor.",
      en: "What is shared is the shape. Two bodies wear one silhouette, and even the scent runs together.",
    },
  },
  {
    key: "wolf",
    imageKey: KIBA_IMAGE_KEYS.syncWolf,
    kanji: "双頭狼",
    romaji: "sōtōrō",
    title: { tr: "Sōtōrō", en: "Sōtōrō" },
    kiba: {
      tr: "İki baştan biri. Karar hâlâ ikisinin, ama gövde tek: birinin dönmek istediği yere diğeri de gitmek zorunda. Bu kademede geri adım diye bir şey yok.",
      en: "One of two heads. The decision still belongs to both, but the body is single: wherever one wants to turn, the other must go. At this stage there is no step back.",
    },
    akamaru: {
      tr: "Öteki baş. Birleşme ikisini de aynı anda yoruyor ve çıkışı ikisi birden ödüyor; Kiba bu tekniği bu yüzden seyrek kullanıyor.",
      en: "The other head. The merge tires them both at once and they both pay for the exit; that is why Kiba reaches for it rarely.",
    },
    bond: {
      tr: "Ortak olan gövdenin kendisi. İki beden sayılmayı bıraktı — geriye tek sürü kaldı.",
      en: "What is shared is the body itself. The two have stopped being counted as two — what is left is one pack.",
    },
  },
];

/* ── Ömür çizelgesi ─────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı; Shikamaru emsali).
 */
export interface KibaFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; native: string; by: LocalizedText };
}

export const KIBA_TIMELINE: KibaFateEntry[] = [
  {
    key: "akamaru",
    imageKey: KIBA_IMAGE_KEYS.fateAkamaru,
    age: { tr: "Akademi", en: "Academy" },
    title: {
      tr: "Ceketin içinde bir yavru",
      en: "A pup inside the jacket",
    },
    text: {
      tr: "Inuzuka çocukları ninken'leriyle birlikte büyür; eğitim iki tarafa aynı anda verilir. Kiba akademiye Akamaru'yu ceketinin içinde taşıyarak geldi ve sınıf bunu bir çocuk şımarıklığı sandı. Klanın bakışıyla ise ortada tek bir öğrenci yoktu: iki tane vardı ve ikisi de aynı gün başlamıştı.",
      en: "Inuzuka children grow up alongside their ninken; the training is given to both sides at once. Kiba came to the Academy carrying Akamaru inside his jacket and the class read it as a spoiled child's habit. From the clan's side there was never one student in that room: there were two, and both had started the same day.",
    },
    quote: {
      native: "行くぞ、アカマル!",
      text: { tr: "Gidiyoruz, Akamaru!", en: "Let's go, Akamaru!" },
      by: { tr: "Kiba Inuzuka", en: "Kiba Inuzuka" },
    },
  },
  {
    key: "chunin",
    imageKey: KIBA_IMAGE_KEYS.fateChunin,
    age: { tr: "12 yaş", en: "Age 12" },
    title: { tr: "Sınıfın en zayıfına yenilmek", en: "Losing to the weakest in the class" },
    text: {
      tr: "Chūnin sınavının eleme turunda karşısına Naruto çıktı ve Kiba maçı kazanılmış saydı. Kaybetti. Yenilginin sebebi güç farkı değildi: Kiba hesabı öfkeyle yaptı, Naruto ise hesabı hiç yapmadan doğru anı buldu. O gün Kiba'nın dosyasına giren şey bir kayıp değil, bir ölçü hatasıydı.",
      en: "In the preliminary round of the Chūnin exam he drew Naruto and considered the match already won. He lost. The reason was not a gap in strength: Kiba did his arithmetic in anger, and Naruto found the right moment without doing any at all. What entered Kiba's file that day was not a defeat but an error of measurement.",
    },
  },
  {
    key: "sakon",
    imageKey: KIBA_IMAGE_KEYS.fateSakon,
    age: { tr: "12 yaş", en: "Age 12" },
    title: { tr: "Sasuke kurtarma görevi — Sakon ve Ukon", en: "The Sasuke retrieval mission — Sakon and Ukon" },
    text: {
      tr: "Beş kişilik takımın parçası olarak yola çıktı ve karşısına iki gövdeyi tek bedende taşıyan bir düşman çıktı: Sakon ve Ukon. Ortaklığın aynadaki karanlık hâli. Kiba, düşmanın kendi bedenine sızmasını durdurmak için bıçağı kendi üstünde kullandı; ormandan çıkmadı, uçurumdan aşağı düştü.",
      en: "He went out as part of a five-man squad and drew an enemy who carried two bodies inside one: Sakon and Ukon — the partnership's dark reflection. To stop the enemy from spreading inside his own body, Kiba turned the blade on himself. He did not walk out of that forest; he went over the edge of a ravine.",
    },
  },
  {
    key: "wound",
    imageKey: KIBA_IMAGE_KEYS.fateWound,
    age: { tr: "Ara dönem", en: "Between the arcs" },
    title: { tr: "Yaralanan Akamaru", en: "Akamaru wounded" },
    text: {
      tr: "Bir görev sırasında patlamanın altında kalan Akamaru ağır yaralandı ve tedavi için köye geri gönderildi. Kiba'nın en kötü hâli budur: dövüşemediği için değil, ikinci bedeni olmadan kendi tekniklerinin yarısını bile kuramadığı için. Ortaklık bir avantaj değil, bir bağımlılık — sayfa bunu gizlemiyor.",
      en: "Caught under a blast on a mission, Akamaru was badly wounded and sent back to the village for treatment. This is Kiba at his worst: not because he cannot fight, but because without his second body he cannot even assemble half of his own techniques. The partnership is not an advantage but a dependency, and this page does not hide it.",
    },
  },
  {
    key: "war",
    imageKey: KIBA_IMAGE_KEYS.fateWar,
    age: { tr: "Savaş", en: "The war" },
    title: { tr: "Bir burun, ordu ölçeğinde", en: "One nose, at the scale of an army" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda Inuzuka klanının işi değişmedi, yalnızca ölçeği değişti: tek bir izi bulmak yerine bir cepheyi koklamak. Kiba müttefik kuvvetlerin saflarında dövüştü ve ortaklığın en uç hâline — Sōtōrō'ya — orada başvurdu. Akademiye ceketinde bir yavruyla gelen çocuk, savaş alanına iki başlı bir kurt olarak girdi.",
      en: "In the Fourth Great Shinobi War the Inuzuka clan's job did not change, only its scale: not finding a single trail but reading an entire front. Kiba fought in the ranks of the allied forces and it was there that he reached for the partnership's furthest form, Sōtōrō. The boy who came to the Academy with a pup in his jacket walked onto that field as a two-headed wolf.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * ⚠️ Kapanışın ikinci gövdesi bilinçli olarak TIRNAK DEĞİL. Kiba'nın
 * doğrulanabilir tek repliği yukarıda, çizelgede duruyor; ikinci bir
 * cümleyi uydurmak yerine arşivin kendi notu olarak, açık etiketle yazıldı.
 * Motto da replik değil: 双頭狼, sayfanın tezini orijinal dilde söyleyen
 * teknik adı.
 */
export const KIBA_CLOSING = {
  quote: {
    native: "行くぞ、アカマル!",
    text: { tr: "Gidiyoruz, Akamaru!", en: "Let's go, Akamaru!" },
    by: { tr: "Kiba Inuzuka", en: "Kiba Inuzuka" },
    note: {
      tr: "Her görevin başladığı cümle. Dikkat edilecek yer birinci çoğul şahıs: Kiba tek bir kere bile “gidiyorum” demiyor.",
      en: "The sentence every mission starts with. The thing to notice is the first person plural: not once does Kiba say “I'm going.”",
    },
  },
  record: {
    label: { tr: "Arşivin notu", en: "The archive's note" },
    text: {
      tr: "Kiba Inuzuka'nın kayıtlardaki en iyi tarafı hiçbir zaman en yüksek rakamı olmadı. En iyi tarafı, gücünü tek başına ölçmenin mümkün olmaması.",
      en: "The best thing in Kiba Inuzuka's file was never his highest number. It is that his strength cannot be measured on its own.",
    },
  },
  motto: "双頭狼",
  mottoNote: {
    tr: "Sōtōrō — “iki başlı kurt”",
    en: "Sōtōrō — “two-headed wolf”",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, takım, bağlılık) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; klan işaretleri, Akamaru silueti, koku izi ve eş zamanlama şeması bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, team, affiliation) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the clan marks, Akamaru's silhouette, the scent trail and the synchrony diagram are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
