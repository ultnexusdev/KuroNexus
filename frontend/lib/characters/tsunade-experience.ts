import type { LocalizedText } from "./types";

/**
 * Tsunade Senju — "Kumarbazın Bahsi" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2767 kaydının ABILITY yuvaları,
 * `tsunade:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (2 Ağustos), kan grubu (B), yaş satırı (51 (I) · 54-55 (II) ·
 * 70 (III)) ve "bilinen adları" AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 2767).
 *
 * ⚠️ BOY YOK. AniList kaydında Tsunade'nin `traits` dizisi BOŞ — ne boy ne
 * kilo var. Sayfada da yok: BRIEF §9 "künye sayılarını buradan al, uydurma"
 * diyor, Shikamaru sayfasındaki kilo satırı da aynı sebeple yazılmamıştı.
 *
 * ── BAHİS MASASI BİR KURGUDUR, KAYNAK DEĞİL ──────────────────────────────
 * Beş "bahis" arşivin kendi çerçevesi: Tsunade'nin beş kararı birer el gibi
 * yazıldı ve ORANLAR DA BİZİM. Sayfa bunu okuyucuya açıkça söylüyor
 * (`TSUNADE_SECTIONS.table.note`). Kaynaktan gelen tek şey sonuçlar; kartın
 * arkasındaki metinlerde uydurma yok.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada üç alıntı var ve üçü de tırnak içine alınacak kadar sağlam:
 *   · tıbbi ninja yönetmeliğinin dördüncü maddesi (yazılı kural),
 *   · Nawaki ile Dan'ın ortak cümlesi ("Hokage olacağım"),
 *   · kumarhanelerin ona taktığı ad (伝説のカモ).
 * Emin olunmayan hiçbir cümle tırnağa alınmadı; dövüşlerin ve kararların
 * ayrıntısı arşivin kendi anlatımı olarak düz metin hâlinde yazıldı.
 */

export const TSUNADE_ID = 2767;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const TSUNADE_SITE_URL = "https://anilist.co/character/2767";

/**
 * Sergi görselleri — hepsi characterId 2767 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `tsunade:` önekli (kurator modu şartı).
 */
export const TSUNADE_IMAGE_KEYS = {
  /** Hero: loş bir salon, masa kenarı, dağınık fişler (16:9) */
  hero: "tsunade:hero",
  sozoSaisei: "tsunade:sozo-saisei",
  byakugo: "tsunade:byakugo",
  katsuyu: "tsunade:katsuyu",
  kitStrength: "tsunade:kairiki",
  kitDoctrine: "tsunade:doktrin",
  kitNecklace: "tsunade:kolye",
  kitDebt: "tsunade:kumar-borclari",
  betNawaki: "tsunade:bahis-nawaki",
  betDan: "tsunade:bahis-dan",
  betOrochimaru: "tsunade:bahis-orochimaru",
  betNaruto: "tsunade:bahis-naruto",
  betPain: "tsunade:bahis-pain",
  fateSenju: "tsunade:kader-senju",
  fateNawaki: "tsunade:kader-nawaki",
  fateDan: "tsunade:kader-dan",
  fateHokage: "tsunade:kader-hokage",
  fatePain: "tsunade:kader-pain",
  closing: "tsunade:kapanis",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const TSUNADE_SLOT_LABELS: Record<string, LocalizedText> = {
  [TSUNADE_IMAGE_KEYS.hero]: {
    tr: "Hero — loş kumar salonu, masa kenarı ve dağılmış fişler (16:9)",
    en: "Hero — a dim gambling hall, the table edge, scattered chips (16:9)",
  },
  [TSUNADE_IMAGE_KEYS.sozoSaisei]: {
    tr: "Sōzō Saisei — mühürden yayılan çizgiler, kapanan yara",
    en: "Sōzō Saisei — the seal's lines spreading, a wound closing",
  },
  [TSUNADE_IMAGE_KEYS.byakugo]: {
    tr: "Byakugō no In — alındaki eşkenar dörtgen, yakın kadraj",
    en: "Byakugō no In — the forehead rhombus, close crop",
  },
  [TSUNADE_IMAGE_KEYS.katsuyu]: {
    tr: "Kuchiyose: Katsuyu — bölünmüş salyangoz, köyün üstünde",
    en: "Kuchiyose: Katsuyu — the divided slug over the village",
  },
  [TSUNADE_IMAGE_KEYS.kitStrength]: {
    tr: "Kairiki — yumruğun değdiği anda çatlayan zemin",
    en: "Kairiki — the ground splitting at the point of impact",
  },
  [TSUNADE_IMAGE_KEYS.kitDoctrine]: {
    tr: "Tıbbi ninja doktrini — sedye, dört kişilik takım",
    en: "The medic-nin doctrine — a stretcher, a four-man squad",
  },
  [TSUNADE_IMAGE_KEYS.kitNecklace]: {
    tr: "Birinci Hokage'nin kolyesi — yakın kadraj, yeşil taş",
    en: "The First Hokage's necklace — close crop, the green stone",
  },
  [TSUNADE_IMAGE_KEYS.kitDebt]: {
    tr: "Kumar borçları — fişler, sake, Şizune ve Tonton",
    en: "Gambling debts — chips, sake, Shizune and Tonton",
  },
  [TSUNADE_IMAGE_KEYS.betNawaki]: {
    tr: "Bahis 1 — Nawaki ve doğum günü hediyesi",
    en: "Bet 1 — Nawaki and the birthday gift",
  },
  [TSUNADE_IMAGE_KEYS.betDan]: {
    tr: "Bahis 2 — Dan Katō, cephe, kan",
    en: "Bet 2 — Dan Katō, the front line, blood",
  },
  [TSUNADE_IMAGE_KEYS.betOrochimaru]: {
    tr: "Bahis 3 — Orochimaru'nun teklifi, çürümüş kollar",
    en: "Bet 3 — Orochimaru's offer, the withered arms",
  },
  [TSUNADE_IMAGE_KEYS.betNaruto]: {
    tr: "Bahis 4 — Naruto'nun avucunda Rasengan",
    en: "Bet 4 — the Rasengan in Naruto's palm",
  },
  [TSUNADE_IMAGE_KEYS.betPain]: {
    tr: "Bahis 5 — Pain saldırısı, çözülen mühür",
    en: "Bet 5 — Pain's assault, the seal released",
  },
  [TSUNADE_IMAGE_KEYS.fateSenju]: {
    tr: "Kader 1 — Senju kanı, Birinci'nin gölgesi",
    en: "Fate 1 — Senju blood, the First's shadow",
  },
  [TSUNADE_IMAGE_KEYS.fateNawaki]: {
    tr: "Kader 2 — Nawaki'nin on ikinci doğum günü",
    en: "Fate 2 — Nawaki's twelfth birthday",
  },
  [TSUNADE_IMAGE_KEYS.fateDan]: {
    tr: "Kader 3 — Dan'ın ölümü ve köyden ayrılış",
    en: "Fate 3 — Dan's death and leaving the village",
  },
  [TSUNADE_IMAGE_KEYS.fateHokage]: {
    tr: "Kader 4 — Beşinci Hokage'nin şapkası",
    en: "Fate 4 — the Fifth Hokage's hat",
  },
  [TSUNADE_IMAGE_KEYS.fatePain]: {
    tr: "Kader 5 — yıkılmış Konoha, komadaki Tsunade",
    en: "Fate 5 — Konoha in ruins, Tsunade in a coma",
  },
  [TSUNADE_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boşalmış masa, tek bir fiş",
    en: "Closing — the emptied table, a single chip",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const TSUNADE_IDENTITY = {
  name: "Tsunade Senju",
  nativeName: "綱手",
  clan: { tr: "Senju Klanı", en: "Senju Clan" },
  /** AniList'in `alternativeNames` dizisi — üçü de kaynaktan geliyor */
  aliases: [
    { tr: "Prenses Tsunade", en: "Princess Tsunade" },
    { tr: "Efsanevi Sannin", en: "The Legendary Sannin" },
    { tr: "Salyangoz Prensesi", en: "Slug Princess" },
  ],
  epigraph: {
    tr: "Kaybettiği her el ona yalnızca acı verdi. Kazandığı iki el her şeyini aldı.",
    en: "Every hand she lost cost her only pain. The two she won took everything.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "2 Ağustos", en: "2 August" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "51 (I) · 54–55 (II) · 70 (III)",
        en: "51 (I) · 54–55 (II) · 70 (III)",
      },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Beşinci Hokage · Sannin'in üçüncüsü",
        en: "Fifth Hokage · the third of the Sannin",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Hiruzen Sarutobi'nin takımı — Jiraiya, Orochimaru",
        en: "Hiruzen Sarutobi's team — Jiraiya, Orochimaru",
      },
    },
    {
      label: { tr: "Soy", en: "Lineage" },
      value: {
        tr: "Birinci Hokage'nin torunu",
        en: "Granddaughter of the First Hokage",
      },
    },
    {
      label: { tr: "Kuchiyose", en: "Summon" },
      value: {
        tr: "Katsuyu — Shikkotsu Ormanı",
        en: "Katsuyu — the Shikkotsu Forest",
      },
    },
    {
      label: { tr: "Yanında taşıdığı", en: "What she carries" },
      value: {
        tr: "Bir sake kadehi ve ödenmemiş bir borç destesi",
        en: "A sake cup and a stack of unpaid debts",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const TSUNADE_REBIRTH_TEXT = {
  enter: { tr: "Sōzō Saisei", en: "Sōzō Saisei" },
  exit: { tr: "Mührü kapat", en: "Seal it back" },
  hint: {
    tr: "Mühür çözüldü: çizgiler yüzden yayılıyor, sayfa canlanıyor.",
    en: "The seal is open: the lines spread from her face and the page comes alive.",
  },
  cost: {
    tr: "Her yenilenmenin bedeli ömürden düşer.",
    en: "Every rebirth is paid for out of her lifespan.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const TSUNADE_HERO = {
  lede: {
    tr: "Dünyanın en iyi tıbbi ninjası, ölümü durdurmayı öğrenmiş bir kadın. Aynı kadın kan gördüğünde donuyor ve masaya oturduğunda neredeyse hep kaybediyor.",
    en: "The finest medical ninja alive, a woman who learned how to stop death. The same woman freezes at the sight of blood, and at the table she almost always loses.",
  },
  sealCaption: {
    tr: "Alnındaki eşkenar dörtgen bir süs değil: yıllarca gün gün biriktirilmiş çakranın durduğu yer.",
    en: "The rhombus on her forehead is not an ornament: it is where years of daily-hoarded chakra sit waiting.",
  },
  portraitAlt: {
    tr: "Tsunade Senju — arşive yüklenmiş kadro portresi",
    en: "Tsunade Senju — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Tsunade Senju — AniList künye portresi",
    en: "Tsunade Senju — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Masadaki portrelerin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const TSUNADE_ALT = {
  seatSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const TSUNADE_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const TSUNADE_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Kasa fişi gibi okunsun diye böyle dizildi: solda ne sorulduğu, sağda ne çıktığı.",
      en: "Laid out like a cashier's slip: the question on the left, what came back on the right.",
    },
  },
  seats: {
    title: { tr: "Masadakiler", en: "At the table" },
    lede: {
      tr: "Beş kişi. Biri eli dağıttı, biri hep aynı taraftan oynadı, biri karşı tarafa geçti, biri bahsi kazandı, biri de masayı devraldı.",
      en: "Five people. One dealt the hand, one always played from the same side, one crossed over, one won the wager, and one inherited the table.",
    },
  },
  jutsu: {
    title: { tr: "Ömürle ödenen üç teknik", en: "Three techniques paid in years" },
    lede: {
      tr: "Üçü de aynı hesabın parçası: bir yerde biriktiriyorsun, başka bir yerde harcıyorsun. Tsunade'nin tıbbı bir şefkat değil, bir muhasebe.",
      en: "All three belong to the same ledger: you save in one place and spend in another. Her medicine is not tenderness — it is bookkeeping.",
    },
  },
  kit: {
    title: { tr: "Masadaki geri kalan", en: "The rest of the table" },
    lede: {
      tr: "Bir yumruk, bir yönetmelik, bir kolye ve bir borç yığını. Tsunade'yi Tsunade yapan dört şey.",
      en: "A fist, a rulebook, a necklace and a pile of debt. The four things that make her who she is.",
    },
  },
  table: {
    title: { tr: "Bahis masası", en: "The betting table" },
    lede: {
      tr: "Beş el. Her birinde bir hayat masaya sürüldü ve her birinin bir oranı var. Kartı çevir: ne oynadığını, kazanıp kazanmadığını ve gerçekte ne olduğunu göreceksin.",
      en: "Five hands. Each one puts a life on the table, and each one carries odds. Turn a card: you will see what she played, whether it came in, and what actually happened.",
    },
    note: {
      tr: "Bu masa arşivin kendi kurgusu: kararları birer bahis gibi yazdık, oranları da biz koyduk. Kaynaktan gelen tek şey sonuçlar.",
      en: "This table is the archive's own framing: we wrote her decisions up as wagers and we set the odds ourselves. Only the outcomes come from the source.",
    },
  },
  blood: {
    title: { tr: "Kan korkusu", en: "The fear of blood" },
  },
  fate: {
    title: { tr: "Ömür çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. İkisi cenaze, biri bir bahis, biri bir şapka, sonuncusu bir koma.",
      en: "Five entries. Two funerals, one wager, one hat, and a coma at the end.",
    },
  },
} as const;

/* ── Masadakiler (yoldaş portreleri) ────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[2767]` listesiyle birebir
 * aynı: 2423 Jiraiya, 2455 Orochimaru, 145 Sakura, 17 Naruto, 7571 Hiruzen.
 * Portre kaydı olmayan sandalye adıyla çizilir, bölüm çökmez.
 *
 * `side`: masadaki yeri. "dealer" eli dağıtan, "with" aynı taraf,
 * "against" karşı taraf. Bileşende `data-side` olarak iniyor.
 */
export const TSUNADE_SEATS = [
  {
    characterId: 7571,
    name: "Hiruzen Sarutobi",
    side: "dealer" as const,
    role: { tr: "Eli dağıtan", en: "The one who dealt" },
    note: {
      tr: "Üçünün de öğretmeni. Sannin adını Hanzō verdi ama masayı kuran Üçüncü'ydü. Tsunade köye döndüğünde onun boş bıraktığı şapkayı giydi.",
      en: "Teacher to all three. Hanzō gave them the name Sannin, but it was the Third who set the table. When Tsunade came back, she put on the hat he had left empty.",
    },
  },
  {
    characterId: 2423,
    name: "Jiraiya",
    side: "with" as const,
    role: { tr: "Aynı elden çıkan", en: "Dealt into the same hand" },
    note: {
      tr: "Ömür boyu yanında duran takım arkadaşı. Onu kumarhanelerden çıkarıp köye geri getiren de o oldu. Ame'ye giderken görev emrini Tsunade imzaladı; geriye şifreli bir mesaj kaldı.",
      en: "The teammate who stood beside her for a lifetime, and the one who pulled her out of the gambling halls and brought her home. Tsunade signed the orders that sent him to Ame; what came back was a coded message.",
    },
  },
  {
    characterId: 2455,
    name: "Orochimaru",
    side: "against" as const,
    role: { tr: "Karşı taraf", en: "The other side" },
    note: {
      tr: "Sannin'in üçüncüsü. Tek teklifini tam olarak Tsunade'nin en zayıf yerine yaptı: ölüleri geri getirmek. Reddedilen tek bahis oydu.",
      en: "The third Sannin. He aimed his single offer exactly at her weakest point: bringing back the dead. It is the only wager she ever refused.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    side: "with" as const,
    role: { tr: "Bahsi kazanan", en: "The one who won the bet" },
    note: {
      tr: "Bir haftalık bahsi kaybettiren çocuk. Tsunade kolyeyi ondan aldı, yıllar sonra şapkayı da ona bıraktı.",
      en: "The boy who made her lose a week-long wager. She took the necklace off him, and years later she left him the hat as well.",
    },
  },
  {
    characterId: 145,
    name: "Sakura Haruno",
    side: "with" as const,
    role: { tr: "Masayı devralan", en: "The one who took over the table" },
    note: {
      tr: "Çırağı. Kairiki'yi, tıbbi doktrini ve yıllar sonra kendi Byakugō mührünü ondan aldı. Tsunade'nin tuttuğu tek yatırım.",
      en: "Her apprentice. She took the fist, the doctrine and — years later — a Byakugō seal of her own from her. The one investment of Tsunade's that paid out.",
    },
  },
] as const;

/* ── Ömürle ödenen üç teknik ────────────────────────────────────────────── */

export const TSUNADE_JUTSU = [
  {
    key: "sozoSaisei" as const,
    kanji: "創造再生",
    name: "Sōzō Saisei",
    turkish: { tr: "Yaratılış Yenilenmesi", en: "Creation Rebirth" },
    tagline: {
      tr: "Yara kapanmıyor; hücre yenileniyor. Fark, bedelin nereden ödendiğinde.",
      en: "The wound is not closed; the cell is remade. The difference is where the bill is paid from.",
    },
    text: {
      tr: "Alındaki mühürde biriktirilmiş çakra tek seferde salınır ve bedenin her hücresi zorla bölünmeye başlar. Kesik açılırken kapanır, kırık daha yere düşmeden kaynar; teknik iyileştirmiyor, yeniden yazıyor. Bedeli hücre bölünmesinin sayılı oluşudur: bir bedenin ömrü boyunca bölünebileceği kadar bölünme vardır ve bu teknik onların bir kısmını peşin harcar. Tsunade her açtığında yaşayacağı yılları masaya sürüyor.",
      en: "The chakra hoarded in the forehead seal is released in one stroke and every cell in her body is forced to divide. A cut closes as it opens; a bone knits before the body hits the ground. The technique does not heal — it rewrites. The cost is that cell division is finite: a body has only so many divisions in it, and this one spends a share of them up front. Every time she opens it she is putting her remaining years on the table.",
    },
    traits: [
      { tr: "Yara açılırken kapanır", en: "Closes as it opens" },
      { tr: "Çakra mühürden gelir", en: "Fuelled by the seal" },
      { tr: "Bedeli ömür", en: "Paid in years" },
    ],
  },
  {
    key: "byakugo" as const,
    kanji: "百豪の印",
    name: "Byakugō no In",
    turkish: { tr: "Yüz Gücün Mührü", en: "Strength of a Hundred Seal" },
    tagline: {
      tr: "Bir teknik değil, bir kasa: yıllara yayılmış günlük mevduat.",
      en: "Not a technique but a vault: a daily deposit spread across years.",
    },
    text: {
      tr: "Tsunade yıllar boyunca her gün çakrasının bir kısmını alnındaki tek bir noktaya yatırdı. Mühürde duran şey o birikimdir; Sōzō Saisei'yi de Katsuyu'nun binlerce parçaya bölünmesini de besleyen kaynak orası. Aynı hassasiyetin ters ucunda Ranshinshō var: hedefe dokunup sinir sinyallerini karıştıran, bedenin sağını soluna çeviren bir vuruş. Aynı el hem biriktiriyor hem bozuyor — tıbbi ninjanın gerçek tanımı bu.",
      en: "For years she deposited part of her chakra, every single day, into one point on her forehead. What sits in the seal is that balance; it is what feeds Sōzō Saisei and what lets Katsuyu split into thousands. The same precision has an opposite end: Ranshinshō, a touch that scrambles the nervous signals so the body answers left when it is told right. The same hand saves and ruins — which is the real definition of a medical ninja.",
    },
    traits: [
      { tr: "Yıllara yayılan birikim", en: "Years of deposits" },
      { tr: "Ranshinshō — sinirleri karıştırır", en: "Ranshinshō — scrambles the nerves" },
      { tr: "Sakura da kendi mührünü kazandı", en: "Sakura earned a seal of her own" },
    ],
  },
  {
    key: "katsuyu" as const,
    kanji: "口寄せ・蛞蝓",
    name: "Kuchiyose: Katsuyu",
    turkish: { tr: "Çağırı: Katsuyu", en: "Summoning: Katsuyu" },
    tagline: {
      tr: "Diğer iki Sannin'in çağırısı saldırır. Bu çağırı bölünür.",
      en: "The other two Sannin summon something that attacks. This one divides.",
    },
    text: {
      tr: "Shikkotsu Ormanı'nın kraliçesi Katsuyu, Tsunade'nin sözleşmeli çağırısı. Yılan ve kurbağa hasmı biçmek için gelirken Katsuyu kendini binlerce küçük parçaya ayırıp aynı anda binlerce kişiye tutunabiliyor; her parça Tsunade'nin çakrasını taşıyor ve yaraları ustasından kilometrelerce uzakta kapatıyor. Gerektiğinde asit de püskürtüyor — ama sayfaya adını yazdıran özelliği bu değil: Pain saldırısında köyün her sakininin üstünde bir Katsuyu parçası vardı.",
      en: "Katsuyu, queen of the Shikkotsu Forest, is Tsunade's contracted summon. Where the snake and the toad arrive to cut an enemy down, Katsuyu breaks herself into thousands of pieces and clings to thousands of people at once; each fragment carries Tsunade's chakra and closes wounds kilometres away from her. She can spit acid when she has to — but that is not what earns her a place here: during Pain's assault there was a piece of Katsuyu on every single villager.",
    },
    traits: [
      { tr: "Binlerce parçaya bölünür", en: "Divides into thousands" },
      { tr: "Uzaktan iyileştirir", en: "Heals at range" },
      { tr: "Bütün bir köyü örttü", en: "Covered an entire village" },
    ],
  },
] as const;

/* ── Masadaki geri kalan — dört küçük ───────────────────────────────────── */

export const TSUNADE_KIT = [
  {
    key: "strength" as const,
    imageKey: TSUNADE_IMAGE_KEYS.kitStrength,
    kanji: "怪力",
    name: { tr: "Kairiki — pekiştirilmiş güç", en: "Kairiki — reinforced strength" },
    note: {
      tr: "Yumruğun kendisi değil, zamanlaması: biriktirilen çakra tam değme anında salınıyor, bu yüzden rakiple birlikte zemin de kırılıyor. Aynı kontrolü ilk öğrettiği kişi Sakura oldu. Tsunade'nin adıyla anılan tekme ise Tsūtenkyaku.",
      en: "It is not the fist, it is the timing: the stored chakra is released at the exact instant of contact, which is why the ground breaks along with the opponent. Sakura was the first person she taught it to. The kick that carries her name is Tsūtenkyaku.",
    },
  },
  {
    key: "doctrine" as const,
    imageKey: TSUNADE_IMAGE_KEYS.kitDoctrine,
    kanji: "医療忍者",
    name: { tr: "Tıbbi ninja doktrini", en: "The medic-nin doctrine" },
    note: {
      tr: "Konoha'nın her dört kişilik takımına bir tıbbi ninja koyan sistemi Tsunade kurdu. Yönetmelik dört maddeydi: arkadaşının canı bitmeden tedaviyi bırakma, ön safta durma, müfrezenin son kişisi olmadan ölme — ve dördüncü madde, ilk üçünü yalnızca Byakugō'yu tamamlamış birinin çiğneyebileceğini söyler. Kuralı yazan kişi, onu çiğneyebilen tek kişiydi.",
      en: "It was Tsunade who put a medic into every four-man squad in Konoha. The code ran to four rules: never stop treatment while a comrade still lives, never stand on the front line, never die before you are the last of your platoon — and a fourth, which says only someone who has completed Byakugō may break the first three. The person who wrote the rules was the only one allowed to break them.",
    },
  },
  {
    key: "necklace" as const,
    imageKey: TSUNADE_IMAGE_KEYS.kitNecklace,
    kanji: "初代の首飾り",
    name: { tr: "Birinci'nin kolyesi", en: "The First's necklace" },
    note: {
      tr: "Hashirama Senju'dan kalan taş; söylenene göre üç dağ satın alacak değerde. Tsunade onu üç kez verdi: Nawaki'ye, Dan'a, Naruto'ya. İlk ikisi öldü — kolyeye lanetli demesinin sebebi bu. Üçüncüsü yaşadı.",
      en: "The stone left behind by Hashirama Senju, said to be worth enough to buy three mountains. She gave it away three times: to Nawaki, to Dan, to Naruto. The first two died — which is why she called it cursed. The third lived.",
    },
  },
  {
    key: "debt" as const,
    imageKey: TSUNADE_IMAGE_KEYS.kitDebt,
    kanji: "伝説のカモ",
    name: { tr: "Kumar borçları", en: "The gambling debts" },
    note: {
      tr: "Şizune ve Tonton'la kasabadan kasabaya, çoğu zaman alacaklılardan kaçarak dolaştı. Masalardaki adı Efsanevi Enayi'ydi: neredeyse hep kaybederdi. Onu korkutan geceler kazandığı gecelerdi — çünkü kazanmak, kötü bir haberin habercisiydi.",
      en: "She drifted from town to town with Shizune and Tonton, most of the time keeping ahead of her creditors. At the tables they called her the Legendary Sucker: she almost always lost. The nights that frightened her were the nights she won — because winning was how bad news announced itself.",
    },
  },
] as const;

/* ── Bahis masası — sayfanın kalbi ──────────────────────────────────────── */

export const TSUNADE_TABLE_UI = {
  listLabel: { tr: "Beş bahis", en: "Five wagers" },
  oddsLabel: { tr: "Oran", en: "Odds" },
  stakeLabel: { tr: "Masaya sürdüğü", en: "What she staked" },
  truthLabel: { tr: "Gerçekte ne oldu", en: "What actually happened" },
  open: { tr: "Kartı çevir", en: "Turn the card" },
  close: { tr: "Kartı kapat", en: "Turn it back" },
  wonStamp: { tr: "Kazandı", en: "Won" },
  lostStamp: { tr: "Kaybetti", en: "Lost" },
  ledgerLabel: { tr: "Hesap", en: "The ledger" },
  wonWord: { tr: "kazanç", en: "won" },
  lostWord: { tr: "kayıp", en: "lost" },
  closedWord: { tr: "kapalı", en: "face down" },
  dealAll: { tr: "Bütün eli aç", en: "Turn the whole hand" },
  collectAll: { tr: "Masayı topla", en: "Clear the table" },
  rule: {
    tr: "Masanın kuralı ters işler: kaybettiği eller ona acı verdi, kazandığı eller her şeyini aldı.",
    en: "The rule of this table runs backwards: the hands she lost cost her pain, the hands she won cost her everything.",
  },
  verdict: {
    tr: "Beş el açık. İki kazanç, üç kayıp — ve kazançların bedeli kayıpların hepsinden ağır.",
    en: "Five hands face up. Two won, three lost — and the two she won cost more than all three losses together.",
  },
  keyboardHint: {
    tr: "Sekme tuşuyla kartlar arasında gez, Enter ya da boşlukla çevir.",
    en: "Tab between the cards, Enter or Space to turn one over.",
  },
} as const;

/**
 * Beş bahis.
 *
 * `suit` / `rank`: elle çizilmiş kart yüzünün nişanı ve rakamı
 * (bkz. `TsunadeGlyphs.tsx`). Rakamlar keyfi değil — her biri kartın
 * anlattığı sayıya bağlı: Nawaki on iki yaşındaydı, kolye ikinci kez
 * verildi, Sannin üç kişiydi, bahis yedi gündü, mühür yüz gücün mührü.
 *
 * `result`: "won" | "lost". Sayfanın tezi bu alanda duruyor — kazanan iki
 * kart, Tsunade'nin en pahalı iki kartı.
 */
export interface TsunadeBet {
  key: string;
  imageKey: string;
  suit: "crystal" | "drop" | "serpent" | "spiral" | "slug";
  rank: string;
  odds: LocalizedText;
  title: LocalizedText;
  call: LocalizedText;
  stake: LocalizedText;
  result: "won" | "lost";
  truth: LocalizedText;
}

export const TSUNADE_BETS: TsunadeBet[] = [
  {
    key: "nawaki",
    imageKey: TSUNADE_IMAGE_KEYS.betNawaki,
    suit: "crystal",
    rank: "12",
    odds: { tr: "12 : 1", en: "12 : 1" },
    title: { tr: "Nawaki'nin rüyası", en: "Nawaki's dream" },
    call: {
      tr: "Kardeşim Hokage olacak.",
      en: "My brother is going to be Hokage.",
    },
    stake: {
      tr: "Birinci Hokage'nin kolyesi — bir doğum günü hediyesi olarak",
      en: "The First Hokage's necklace, handed over as a birthday present",
    },
    result: "lost",
    truth: {
      tr: "Nawaki on iki yaşına bastığı gün Tsunade üç dağ değerindeki taşı boynuna taktı; kardeşinin hayalini masaya sürdüğü an oydu. Nawaki ertesi gün cepheye çıktı ve geri dönmedi. Kolye Tsunade'ye geri geldi — bu, kolyenin geri dönme alışkanlığının ilk seferiydi.",
      en: "On the day Nawaki turned twelve she hung a stone worth three mountains around his neck; that was the moment she put her brother's dream on the table. He went up to the front the next day and did not come back. The necklace returned to her — the first time it would make that trip.",
    },
  },
  {
    key: "dan",
    imageKey: TSUNADE_IMAGE_KEYS.betDan,
    suit: "drop",
    rank: "2",
    odds: { tr: "2 : 1", en: "2 : 1" },
    title: { tr: "Dan'ın sözü", en: "Dan's promise" },
    call: { tr: "Bu sefer tutar.", en: "This time it holds." },
    stake: {
      tr: "Aynı kolye, ikinci kez — ve kendi ellerine duyduğu güven",
      en: "The same necklace a second time — and her faith in her own hands",
    },
    result: "lost",
    truth: {
      tr: "Dan Katō da Hokage olmak istiyordu ve Tsunade kolyeyi ikinci kez bir hayale bağladı. Dan cephede ağır yaralandı; dünyanın en iyi tıbbi ninjası ellerini onun kanının içine soktu ve kanamayı durduramadı. O gün iki şey kaybetti: sevdiği adamı ve kan görmeye dayanabilen bir beden.",
      en: "Dan Katō wanted to be Hokage too, and she tied the necklace to a second dream. He was cut down at the front; the best medical ninja in the world put her hands into his blood and could not stop it. She lost two things that day: the man, and a body that could stand the sight of blood.",
    },
  },
  {
    key: "orochimaru",
    imageKey: TSUNADE_IMAGE_KEYS.betOrochimaru,
    suit: "serpent",
    rank: "3",
    odds: { tr: "1 : 2", en: "1 : 2" },
    title: { tr: "Orochimaru'nun teklifi", en: "Orochimaru's offer" },
    call: {
      tr: "Kollarımı iyileştir, ikisini de geri getireyim.",
      en: "Heal my arms and I will bring them both back.",
    },
    stake: {
      tr: "İki eli — karşılığında iki ölü",
      en: "Her two hands — against two dead men",
    },
    result: "won",
    truth: {
      tr: "Üçüncü'nün mührü Orochimaru'nun kollarını kullanılmaz hâle getirmişti ve teklif tam olarak Tsunade'nin en zayıf yerine oturuyordu: Nawaki ve Dan, geri. Bir hafta düşündü, kadehi doldurdu — sonra Naruto'nun avucunda dönen Rasengan'da iki ölünün aynı hayalini gördü ve masayı devirdi. Kazandı: ölüleri reddedip yaşayanı seçti. Kural yine işledi — o eli kazanan kişi köye Beşinci Hokage olarak döndü ve o şapka onu bitirecekti.",
      en: "The Third's seal had left Orochimaru's arms useless, and the offer was aimed exactly at her weakest point: Nawaki and Dan, returned. She thought about it for a week and poured the cup — then saw the same dream, held by both dead men, spinning in Naruto's palm, and turned the table over. She won: she refused the dead and chose the living. And the rule held — the woman who won that hand walked back into the village as Fifth Hokage, and that hat would be the end of her.",
    },
  },
  {
    key: "naruto",
    imageKey: TSUNADE_IMAGE_KEYS.betNaruto,
    suit: "spiral",
    rank: "7",
    odds: { tr: "7 : 1", en: "7 : 1" },
    title: { tr: "Naruto'nun bahsi", en: "Naruto's wager" },
    call: {
      tr: "Bir haftada Rasengan'ı öğrenemezsin.",
      en: "You cannot learn the Rasengan in a week.",
    },
    stake: {
      tr: "Birinci'nin kolyesi — üçüncü ve son kez",
      en: "The First's necklace, for the third and final time",
    },
    result: "lost",
    truth: {
      tr: "Yedi gün yetmedi; Naruto tekniği süre dolduğunda hâlâ tamamlayamamıştı. Ama Kabuto'nun karşısında, kırık bir avuçla o Rasengan çalıştı. Tsunade bahsi kaybettiğini kabul etti ve kolyeyi üçüncü kez bir Hokage adayının boynuna taktı. Hayatında memnun olduğu tek kayıp buydu.",
      en: "Seven days were not enough; when the clock ran out the technique was still unfinished. But standing in front of Kabuto, with a broken hand, that Rasengan worked. She conceded the bet and hung the necklace on a third candidate for Hokage. It is the only loss of her life she was glad about.",
    },
  },
  {
    key: "pain",
    imageKey: TSUNADE_IMAGE_KEYS.betPain,
    suit: "slug",
    rank: "百",
    odds: { tr: "TAMAMI", en: "ALL IN" },
    title: { tr: "Pain'e karşı koyduğu", en: "What she staked against Pain" },
    call: {
      tr: "Bu köyde kimse ölmeyecek.",
      en: "No one in this village dies.",
    },
    stake: {
      tr: "Ömrünün geri kalanı ve Hokage'liği",
      en: "The rest of her lifespan, and the hat",
    },
    result: "won",
    truth: {
      tr: "Altı Yol Pain Konoha'yı yerle bir ederken Tsunade alnındaki mührü çözdü, Katsuyu'yu binlerce parçaya böldü ve her sakinin üstüne bir parça bıraktı. Yıllara yayılmış birikim tek bir saatte harcandı. Köy ayakta kaldı; Tsunade yaşlı bedenine dönüp komaya girdi ve şapkayı elinde tutamadı. Masadaki en büyük kazancı, elindeki her şeye mal oldu.",
      en: "While the Six Paths of Pain flattened Konoha, she broke the seal on her forehead, split Katsuyu into thousands of pieces and put one on every villager. A balance saved across years was spent inside a single hour. The village stood; Tsunade fell back into her aged body, went into a coma, and could not hold on to the hat. Her biggest win at that table cost her everything she was still holding.",
    },
  },
];

/* ── Kan korkusu — sayfanın duygusal merkezi ────────────────────────────── */

export const TSUNADE_BLOOD = {
  lines: [
    {
      tr: "Dünyanın en iyi tıbbi ninjası kandan korkuyor. Adı hemofobi; sebebi bir tanı değil, bir oda: Dan'ın kanının avuçlarında ısındığı an.",
      en: "The finest medical ninja in the world is afraid of blood. The name for it is hemophobia; the cause is not a diagnosis but a room — the moment Dan's blood went warm in her hands.",
    },
    {
      tr: "Kan gördüğünde elleri kilitleniyor, nefesi kısalıyor. Ölümü durdurmayı öğrenen kadın, yıllarca ölümün rengine dokunamadı.",
      en: "At the sight of it her hands lock and her breath goes short. The woman who learned to hold death back could not, for years, touch the colour of it.",
    },
    {
      tr: "Korku yıllar sonra tek bir yerde kırıldı: Naruto'yu Kabuto'dan korurken. Kanın içinde durdu, elleri titremedi ve iki ölünün adını bir kez daha andı.",
      en: "It broke, years later, in exactly one place: standing between Naruto and Kabuto. She stood in the blood, her hands held steady, and she said two dead names one more time.",
    },
  ],
  colourNote: {
    tr: "Bu sayfada bu renk yalnızca iki şeye ayrıldı: kazanan el ve kan. Sayfanın söylediği de bu — ikisi Tsunade için aynı şey.",
    en: "On this page that colour is reserved for two things: a winning hand, and blood. Which is the whole point — for her they are the same thing.",
  },
} as const;

/* ── Ömür çizelgesi ─────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde alıntı
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı, Shikamaru emsali).
 *
 * `age`: ilk üç kayıtta AniList'te sayı YOK, o yüzden dönem etiketi
 * kullanıldı; son ikisi künyedeki 51 (I) ve 54-55 (II) değerleri.
 */
export interface TsunadeFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const TSUNADE_TIMELINE: TsunadeFateEntry[] = [
  {
    key: "senju",
    imageKey: TSUNADE_IMAGE_KEYS.fateSenju,
    age: { tr: "Senju kuşağı", en: "The Senju generation" },
    title: { tr: "Birinci'nin torunu", en: "The First's granddaughter" },
    text: {
      tr: "Konoha'yı kuran Hashirama Senju'nun torunu olarak doğdu; İkinci Hokage Tobirama da büyük amcasıydı. Üçüncü Hokage Hiruzen'in takımında Jiraiya ve Orochimaru'yla eğitildi. İkinci Şinobi Savaşı'nda Hanzō üçünü birden ayakta bıraktığı gün onlara Sannin adını verdi — Tsunade'nin taşıdığı ilk unvan bir savaş meydanında verildi.",
      en: "She was born granddaughter to Hashirama Senju, who founded Konoha; Tobirama, the Second Hokage, was her great-uncle. She trained on the Third Hokage's team alongside Jiraiya and Orochimaru. In the Second Shinobi World War, on the day Hanzō left all three of them standing, he named them the Sannin — the first title she ever carried was handed to her on a battlefield.",
    },
  },
  {
    key: "nawaki",
    imageKey: TSUNADE_IMAGE_KEYS.fateNawaki,
    age: { tr: "Savaş yılları", en: "The war years" },
    title: { tr: "Nawaki'nin on ikinci doğum günü", en: "Nawaki's twelfth birthday" },
    text: {
      tr: "Kardeşi Nawaki Hokage olmak istiyordu ve Tsunade doğum gününde ona Birinci'nin kolyesini verdi. Nawaki ertesi gün cephede öldü; on iki yaşındaydı. Kolye kardeşinin boynundan çıkarılıp Tsunade'ye geri verildi.",
      en: "Her brother Nawaki wanted to be Hokage, and for his birthday she gave him the First's necklace. He died at the front the next day, twelve years old. The necklace was taken off his neck and handed back to her.",
    },
    quote: {
      text: { tr: "Hokage olacağım.", en: "I'm going to be Hokage." },
      by: {
        tr: "Nawaki — aynı cümleyi Dan da kuracaktı",
        en: "Nawaki — Dan would say the same sentence",
      },
    },
  },
  {
    key: "dan",
    imageKey: TSUNADE_IMAGE_KEYS.fateDan,
    age: { tr: "Savaş yılları", en: "The war years" },
    title: { tr: "Dan'ın kanı ve köyden ayrılış", en: "Dan's blood, and leaving" },
    text: {
      tr: "Dan Katō'ya aynı kolyeyi verdi ve aynı cümleyi dinledi. Dan cephede ağır yaralandığında Tsunade onu tutmaya çalıştı ve başaramadı. O günden sonra kan görmeye dayanamadı, Hokage fikrinden nefret etti ve Şizune'yi alıp köyden çıktı. Sonraki yılları kumar masalarında ve alacaklıların önünde geçti.",
      en: "She gave Dan Katō the same necklace and listened to the same sentence. When he was cut down she tried to hold him together and failed. After that day she could not stand the sight of blood, she despised the whole idea of Hokage, and she took Shizune and walked out of the village. The years that followed were spent at gambling tables and one step ahead of creditors.",
    },
  },
  {
    key: "hokage",
    imageKey: TSUNADE_IMAGE_KEYS.fateHokage,
    age: { tr: "51 yaş", en: "Age 51" },
    title: { tr: "Bir bahis, bir kolye, bir şapka", en: "A wager, a necklace, a hat" },
    text: {
      tr: "Jiraiya onu köye çağırmaya geldiğinde Tsunade borç içindeydi. Aynı hafta Orochimaru'nun ölüleri geri getirme teklifini reddetti, Kabuto'nun karşısında kan korkusunu kırdı ve Naruto'ya bahsi kaybedip kolyeyi onun boynuna taktı. Konoha'ya Beşinci Hokage olarak girdi — ömrü boyunca nefret ettiği şapkayla.",
      en: "When Jiraiya came to fetch her home she was deep in debt. In the same week she refused Orochimaru's offer to raise the dead, broke her fear of blood in front of Kabuto, lost her bet with Naruto and hung the necklace around his neck. She entered Konoha as the Fifth Hokage — wearing the hat she had hated her whole life.",
    },
  },
  {
    key: "pain",
    imageKey: TSUNADE_IMAGE_KEYS.fatePain,
    age: { tr: "54–55 yaş", en: "Age 54–55" },
    title: { tr: "Pain saldırısı ve koma", en: "Pain's assault, and the coma" },
    text: {
      tr: "Altı Yol Pain köyü yerle bir ederken Tsunade Byakugō'yu çözdü ve Katsuyu'yu her sakinin üstüne bıraktı. Yıllara yayılmış birikim bir saatte tükendi. Köy ayakta kaldı; Tsunade yaşlı bedenine döndü, komaya girdi ve şapkayı elinde tutamadı. Dördüncü maddeyi kullandığı gün, o maddeyi yazmasının sebebini de kanıtlamış oldu.",
      en: "As the Six Paths of Pain levelled the village she released Byakugō and left a piece of Katsuyu on every resident. A balance built over years was gone in an hour. The village stood; she reverted to her aged body, went into a coma, and could not keep the hat. The day she invoked the fourth rule she also proved why she had written it.",
    },
    quote: {
      text: {
        tr: "Byakugō'yu tamamlamamış hiçbir tıbbi ninja ilk üç maddeyi çiğneyemez.",
        en: "No medical ninja who has not completed Byakugō may break the first three rules.",
      },
      by: {
        tr: "Tıbbi ninja yönetmeliği, dördüncü madde — Tsunade'nin kaleminden",
        en: "The medic-nin code, fourth rule — written by Tsunade herself",
      },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const TSUNADE_CLOSING = {
  quotes: [
    {
      text: { tr: "Hokage olacağım.", en: "I'm going to be Hokage." },
      by: {
        tr: "Nawaki ve Dan — ikisi de aynı cümleyi kurdu",
        en: "Nawaki and Dan — both of them said the same sentence",
      },
      note: {
        tr: "Kolyeyi ikisine de Tsunade taktı, ikisi de sözünü tutamadı. Sonra aynı cümleyi bir çocuk daha kurdu ve Tsunade bahsi ona kaybetti.",
        en: "She hung the necklace on both of them, and neither kept the promise. Then a third child said it, and she lost the bet to him.",
      },
    },
    {
      text: { tr: "Efsanevi Enayi.", en: "The Legendary Sucker." },
      by: {
        tr: "Kumarhanelerin ona taktığı ad — 伝説のカモ",
        en: "What the gambling houses called her — 伝説のカモ",
      },
      note: {
        tr: "Neredeyse hiç kazanmazdı. Kazandığı geceler ise kötü haberin geldiği gecelerdi — Tsunade'nin gerçekten inandığı tek istatistik bu.",
        en: "She almost never won. The nights she did were the nights bad news arrived — the only statistic she genuinely believed in.",
      },
    },
  ],
  motto: "創造再生",
  mottoNote: {
    tr: "Sōzō Saisei — “yaratılış yenilenmesi”: yarayı kapatır, bedeli ömürden düşer.",
    en: "Sōzō Saisei — “creation rebirth”: it closes the wound and takes the payment out of her life.",
  },
  credit: {
    tr: "Künye verileri (doğum günü, kan grubu, yaş satırı, bilinen adlar) ve yedek portre AniList'ten alınmıştır; AniList kaydında boy bilgisi bulunmadığı için künyede de yoktur. Sayfadaki tam boy portre arşivin kendi yüklemesidir. Kartlar, fişler, mühür ve damla bu sayfa için elle çizilmiş SVG'lerdir; bahis oranları arşivin kendi kurgusudur, kaynaktan gelmez.",
    en: "Profile data (birthday, blood type, the age line, the alternative names) and the fallback portrait come from AniList; the AniList record carries no height, so neither does the record strip here. The full-size portrait is the archive's own upload. The cards, chips, seal and drop are SVGs drawn by hand for this page; the betting odds are the archive's own invention and come from no source.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
