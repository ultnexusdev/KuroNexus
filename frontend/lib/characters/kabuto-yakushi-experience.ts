import type { LocalizedText } from "./types";

/**
 * Kabuto Yakushi — "Kim Olduğumu Biliyorum" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2405 kaydının ABILITY yuvaları,
 * `kabuto:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (29 Şubat) ve kan grubu (AB) AniList künyesinden birebir alındı
 * (24 Ağustos 2026 tarihli `anilist-detay-22.json`, karakter 2405). Aynı
 * künyede YAŞ ve BOY alanları BOŞ — bu sayfa o boşluğu uydurmuyor, künye
 * şeridinde "kayıt boş" olarak gösteriyor. Kimliği silinmiş bir adamın
 * dosyasında eksik satır zaten anlatının parçası.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada TIRNAK İÇİNDE TEK BİR REPLİK var: Kabuto'nun Izanami'nin
 * döngüsünden çıkarken vardığı cevap. Kapanıştaki ikinci blok bir karaktere
 * değil, destenin boş kartına — yani arşivin kendi sorusuna — atfedilmiştir
 * ve bunu açıkça söyler. Emin olunmayan hiçbir cümle tırnak içine alınmadı;
 * dövüşlerin ve gecelerin ayrıntısı arşivin kendi anlatımı olarak düz metin.
 */

export const KABUTO_ID = 2405;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const KABUTO_SITE_URL = "https://anilist.co/character/2405";

/**
 * Sergi görselleri — hepsi characterId 2405 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `kabuto:` önekli (kurator modu şartı).
 */
export const KABUTO_IMAGE_KEYS = {
  /** Hero: karanlık koridor / ameliyat masası; figür küçük (16:9) */
  hero: "kabuto:hero",
  edoTensei: "kabuto:edo-tensei",
  medical: "kabuto:medical",
  sage: "kabuto:sage",
  infoCards: "kabuto:info-cards",
  disguise: "kabuto:disguise",
  deadSoul: "kabuto:dead-soul",
  graft: "kabuto:graft",
  cardOrphan: "kabuto:card-orphan",
  cardExam: "kabuto:card-exam",
  cardRoot: "kabuto:card-root",
  cardMedic: "kabuto:card-medic",
  cardShadow: "kabuto:card-shadow",
  cardPact: "kabuto:card-pact",
  cardArmy: "kabuto:card-army",
  fateFound: "kabuto:fate-found",
  fateRoot: "kabuto:fate-root",
  fateNono: "kabuto:fate-nono",
  fateSnake: "kabuto:fate-snake",
  fateIzanami: "kabuto:fate-izanami",
  closing: "kabuto:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const KABUTO_SLOT_LABELS: Record<string, LocalizedText> = {
  [KABUTO_IMAGE_KEYS.hero]: {
    tr: "Hero — loş bir laboratuvar koridoru, figür küçük (16:9)",
    en: "Hero — a dim laboratory corridor, small figure (16:9)",
  },
  [KABUTO_IMAGE_KEYS.edoTensei]: {
    tr: "Edo Tensei — açılan tabutlar sırası",
    en: "Edo Tensei — the row of opening coffins",
  },
  [KABUTO_IMAGE_KEYS.medical]: {
    tr: "Chakra no Mesu — parmak ucundaki çakra bıçağı",
    en: "Chakra no Mesu — the chakra blade at his fingertips",
  },
  [KABUTO_IMAGE_KEYS.sage]: {
    tr: "Yılan Sennin Modu — pullu yüz ve yarık gözbebeği",
    en: "Snake Sage Mode — scaled face and slit pupil",
  },
  [KABUTO_IMAGE_KEYS.infoCards]: {
    tr: "Bilgi kartları — parmak arasında açılan boş kart",
    en: "Info cards — a blank card fanned between fingers",
  },
  [KABUTO_IMAGE_KEYS.disguise]: {
    tr: "Kimlik değiştirme — dönüşüm dumanı",
    en: "Changing identity — the smoke of transformation",
  },
  [KABUTO_IMAGE_KEYS.deadSoul]: {
    tr: "Shiryō no Jutsu — ayağa kalkan ceset",
    en: "Shiryō no Jutsu — the corpse rising",
  },
  [KABUTO_IMAGE_KEYS.graft]: {
    tr: "Nakil — Orochimaru'nun kalıntısını taşıyan kol",
    en: "The graft — the arm carrying Orochimaru's remains",
  },
  [KABUTO_IMAGE_KEYS.cardOrphan]: {
    tr: "Kart 1 — savaş alanındaki adsız çocuk",
    en: "Card 1 — the nameless child on the battlefield",
  },
  [KABUTO_IMAGE_KEYS.cardExam]: {
    tr: "Kart 2 — sınav salonundaki yardımsever aday",
    en: "Card 2 — the helpful candidate in the exam hall",
  },
  [KABUTO_IMAGE_KEYS.cardRoot]: {
    tr: "Kart 3 — Kök'ün maskesi",
    en: "Card 3 — the mask of Root",
  },
  [KABUTO_IMAGE_KEYS.cardMedic]: {
    tr: "Kart 4 — yaraya değen tıbbi el",
    en: "Card 4 — the medic's hand on the wound",
  },
  [KABUTO_IMAGE_KEYS.cardShadow]: {
    tr: "Kart 5 — Orochimaru'nun arkasındaki gölge",
    en: "Card 5 — the shadow behind Orochimaru",
  },
  [KABUTO_IMAGE_KEYS.cardPact]: {
    tr: "Kart 6 — maskeli adamla kurulan ortaklık",
    en: "Card 6 — the pact with the masked man",
  },
  [KABUTO_IMAGE_KEYS.cardArmy]: {
    tr: "Kart 7 — diriltilmiş ordu",
    en: "Card 7 — the reincarnated army",
  },
  [KABUTO_IMAGE_KEYS.fateFound]: {
    tr: "Kikyō Geçidi — savaştan sonraki alan",
    en: "Kikyō Pass — the field after the battle",
  },
  [KABUTO_IMAGE_KEYS.fateRoot]: {
    tr: "Kök — silinen kayıt",
    en: "Root — the erased record",
  },
  [KABUTO_IMAGE_KEYS.fateNono]: {
    tr: "Nono'nun öldüğü gece",
    en: "The night Nono died",
  },
  [KABUTO_IMAGE_KEYS.fateSnake]: {
    tr: "Otogakure yılları — Orochimaru'nun laboratuvarı",
    en: "The Otogakure years — Orochimaru's laboratory",
  },
  [KABUTO_IMAGE_KEYS.fateIzanami]: {
    tr: "Izanami — döngünün kırıldığı an",
    en: "Izanami — the moment the loop breaks",
  },
  [KABUTO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — masaya bırakılmış boş kart",
    en: "Closing — the blank card left on the table",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const KABUTO_IDENTITY = {
  name: "Kabuto Yakushi",
  nativeName: "薬師カブト",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "薬師",
  epigraph: {
    tr: "Yedi kimlik taşıdı. Hiçbiri onun değildi — sonunda hepsinin onun olduğunu kabul etmesi gerekti.",
    en: "He carried seven identities. Not one of them was his — and in the end he had to admit that all of them were.",
  },
  lede: {
    tr: "Kikyō Geçidi'ndeki savaştan sonra alanda adı bile olmayan bir çocuk bulundu. Sonraki yıllarda sırayla herkes oldu: yetimhanenin çocuğu, güler yüzlü sınav adayı, Kök'ün ajanı, cerrah, bir yılanın gölgesi, bir ordunun sahibi. Bu sayfa o destenin kartlarını tek tek çeviriyor.",
    en: "After the battle at Kikyō Pass a boy was found on the field who could not even give his name. In the years that followed he was everyone in turn: the orphanage child, the friendly exam candidate, Root's agent, the surgeon, a serpent's shadow, the owner of an army. This page turns that deck over, one card at a time.",
  },
  portraitAlt: {
    tr: "Kabuto Yakushi — AniList künye portresi",
    en: "Kabuto Yakushi — AniList profile portrait",
  },
  portraitAltUploaded: {
    tr: "Kabuto Yakushi — arşive yüklenmiş kadro portresi",
    en: "Kabuto Yakushi — cast portrait uploaded to the archive",
  },
  portraitCaption: {
    tr: "Künye portresi · AniList · ~230 piksel",
    en: "Profile portrait · AniList · ~230 px",
  },
} as const;

/**
 * Künye satırı. `struck` olan satırın DEĞERİ üstü çizili çizilir — Danzō'nun
 * sildiği kayıt sayfada da silinmiş görünüyor. `note` küçük dipnot.
 */
export interface KabutoFact {
  label: LocalizedText;
  value: LocalizedText;
  note?: LocalizedText;
  struck?: boolean;
}

export const KABUTO_FACTS: KabutoFact[] = [
  {
    label: { tr: "Doğum", en: "Birthday" },
    value: { tr: "29 Şubat", en: "29 February" },
    note: {
      tr: "Dört yılda bir gelen tarih. AniList künyesinde yıl yok.",
      en: "A date that comes round once in four years. The AniList record carries no year.",
    },
  },
  {
    label: { tr: "Yaş", en: "Age" },
    value: { tr: "Kayıt boş", en: "No entry" },
    note: {
      tr: "AniList künyesinde yaş alanı boş; arşiv de doldurmuyor.",
      en: "The age field on the AniList record is empty; the archive leaves it empty too.",
    },
  },
  {
    label: { tr: "Kan grubu", en: "Blood type" },
    value: { tr: "AB", en: "AB" },
  },
  {
    label: { tr: "Kayıtlı rütbe", en: "Rank on file" },
    value: { tr: "Genin", en: "Genin" },
    note: {
      tr: "Konoha kütüğünde hiç yükselmedi.",
      en: "He never rose a step in the Konoha registry.",
    },
  },
  {
    label: { tr: "Chūnin sınavı", en: "Chūnin exam" },
    value: { tr: "Yedi kez girdi", en: "Entered seven times" },
    note: {
      tr: "Terfi için değil: sınav onun için bir toplama alanıydı.",
      en: "Not for promotion: the exam was a collection ground for him.",
    },
  },
  {
    label: { tr: "Bağlılık sırası", en: "Chain of allegiance" },
    value: {
      tr: "Konoha Tıbbi Birliği → Kök → Otogakure → Akatsuki (ortak)",
      en: "Konoha Medical Unit → Root → Otogakure → Akatsuki (as a partner)",
    },
  },
  {
    label: { tr: "Kütükteki kaydı", en: "His entry in the registry" },
    value: { tr: "Silindi", en: "Erased" },
    struck: true,
    note: {
      tr: "Kök'e alındığı gün silindi — bir ajan için en değerli özellik.",
      en: "Erased the day Root took him — the most valuable trait an agent can have.",
    },
  },
  {
    label: { tr: "Yanında taşıdığı", en: "What he carries" },
    value: {
      tr: "Yuvarlak bir gözlük ve bir deste bilgi kartı",
      en: "A pair of round glasses and a deck of info cards",
    },
  },
  {
    label: { tr: "Göründüğü yapımlar", en: "Appears in" },
    value: {
      tr: "Naruto (2002) · Shippuden (2007) · Boruto (2017)",
      en: "Naruto (2002) · Shippuden (2007) · Boruto (2017)",
    },
  },
];

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const KABUTO_SAGE_TEXT = {
  enter: { tr: "Sennin modu — yılan", en: "Sage mode — serpent" },
  exit: { tr: "Sennin modundan çık", en: "Leave sage mode" },
  hint: {
    tr: "Pullar yüzü kaplıyor, camların ardındaki göz açılıyor. Sayfa artık kim olduğunu bilen birinin sesiyle konuşuyor: başlıkların ikinci gölgesi kayboldu.",
    en: "Scales close over the face and the eye behind the lenses opens. The page now speaks in the voice of someone who knows who he is: the second shadow under every heading is gone.",
  },
  glyphAlt: {
    tr: "Yuvarlak gözlük camı; sennin modunda pullarla doluyor.",
    en: "A round spectacle lens; it fills with scales in sage mode.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const KABUTO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

/**
 * Bölüm başlığı. `margin` sol kenar boşluğundaki sayısal not — dosya
 * kâğıdının kenarına düşülmüş işaret gibi; süs değil, sayım.
 */
export const KABUTO_SECTIONS = {
  identity: {
    title: { tr: "Dosya", en: "The file" },
    margin: { tr: "9 satır · 2'si boş", en: "9 rows · 2 empty" },
    lede: {
      tr: "AniList kütüğünde iki alan dolu, ikisi boş. Boş olanları uydurmak yerine boş bıraktık: kimliği silinmiş bir adamın dosyasında eksik satır zaten anlatının kendisi.",
      en: "Two fields on the AniList record are filled and two are empty. Rather than invent the empty ones we left them empty: on the file of a man whose identity was erased, a missing row is the story itself.",
    },
  },
  lab: {
    title: { tr: "Laboratuvar", en: "The laboratory" },
    margin: { tr: "3 büyük teknik", en: "3 major techniques" },
    lede: {
      tr: "Üçü de aynı fikrin farklı ayarları: bir bedeni açmak, içine bakmak ve istediğini oraya yerleştirmek. Kabuto'nun tıbbı ile büyüsü arasında sınır yok.",
      en: "All three are settings of a single idea: open a body, look inside, and put what you want in there. In Kabuto's hands there is no border between medicine and jutsu.",
    },
  },
  tools: {
    title: { tr: "Küçük aletler", en: "The smaller instruments" },
    margin: { tr: "4 kalem", en: "4 items" },
    lede: {
      tr: "Sayfayı dolduran teknikler değil, işi bitiren aletler. Dördü de bilgiye ya da başkasının bedenine dayanıyor.",
      en: "Not the techniques that fill a page — the instruments that finish a job. All four run on information or on somebody else's body.",
    },
  },
  deck: {
    title: { tr: "Kimlik destesi", en: "The identity deck" },
    margin: { tr: "8 kart · 7 kimlik + 1 boş", en: "8 cards · 7 identities + 1 blank" },
    lede: {
      tr: "Kabuto'nun hayatı taktik kimliklerden ibaret. Desteden kart çek: çekilen kimlik ortaya gelir, öncekiler yana yığılır, kalan sayısı azalır. Sekizinci kartta yazı yok.",
      en: "Kabuto's life is made of tactical identities. Draw from the deck: the drawn identity comes to the centre, the earlier ones stack aside, the remaining count falls. There is nothing written on the eighth card.",
    },
  },
  info: {
    title: { tr: "Bilgi kartları", en: "The info cards" },
    margin: { tr: "3 kayıt · 1'i kendisi", en: "3 records · 1 is his own" },
    lede: {
      tr: "Kartlar boş doğar; üstündeki yazı yalnızca Kabuto'nun çakrasıyla ortaya çıkar. Chūnin sınavında rakiplerinin dosyasını böyle taşıdı. Bilgi güçtür — ama her kartın arkası boştur.",
      en: "The cards are born blank; the writing surfaces only under Kabuto's own chakra. This is how he carried his rivals' files into the Chūnin exam. Information is power — and the back of every card is empty.",
    },
  },
  fate: {
    title: { tr: "Dosyanın beş sayfası", en: "Five pages of the file" },
    margin: { tr: "5 kayıt", en: "5 entries" },
    lede: {
      tr: "Beş kayıt: bir buluntu, bir silinme, bir cinayet, uzun bir hizmet ve sonunda kırılan bir döngü.",
      en: "Five entries: a foundling, an erasure, a killing, a long service, and at the end a loop that breaks.",
    },
  },
} as const;

/* ── Laboratuvar — üç büyük ─────────────────────────────────────────────── */

/** `mark` alanı elle çizilmiş SVG işaret setinden bir anahtar. */
export const KABUTO_JUTSU = [
  {
    key: "edoTensei" as const,
    imageKey: KABUTO_IMAGE_KEYS.edoTensei,
    mark: "coffin" as const,
    kanji: "穢土転生",
    name: "Kuchiyose: Edo Tensei",
    turkish: { tr: "Kirli Toprak Yeniden Doğuşu", en: "Impure World Reincarnation" },
    tagline: {
      tr: "Orochimaru'nun yarım bıraktığı teknik. Tamamlayan Kabuto oldu.",
      en: "The technique Orochimaru left unfinished. Kabuto is the one who completed it.",
    },
    text: {
      tr: "Ruhu öbür dünyadan geri çağırır, yaşayan bir kurbanın bedenine bağlar ve ölüyü hayattayken sahip olduğu bütün güçle sahaya çıkarır. Orochimaru bu tekniği iki Hokage'yi çağıracak kadar götürebilmişti; Kabuto onu ordu ölçeğine taşıdı. Kendi eklediği kilit ise en soğuk kısmı: dirilenin kişiliğini bastırıp bedeni itiraz edemeyen bir kuklaya çevirebiliyor. Dördüncü Şinobi Savaşı'nda savaşın yarısını tek başına o taşıdı — kendi elleriyle değil, başkalarının cesetleriyle.",
      en: "It calls a soul back from the other world, binds it into a living sacrifice, and returns the dead to the field with every power they held in life. Orochimaru could push the technique as far as two Hokage; Kabuto took it to the scale of an army. The lock he added himself is the coldest part: he can suppress the revived person's will and reduce the body to a puppet that cannot refuse. In the Fourth Great Shinobi War he carried half the war alone — not with his own hands, but with other people's corpses.",
    },
    traits: [
      { tr: "Ölüyü tam gücüyle çağırır", en: "Returns the dead at full strength" },
      { tr: "Beden ölmez, çakra tükenmez", en: "The body cannot die, the chakra cannot run out" },
      { tr: "İrade bastırılabilir", en: "The will can be suppressed" },
    ],
  },
  {
    key: "medical" as const,
    imageKey: KABUTO_IMAGE_KEYS.medical,
    mark: "suture" as const,
    kanji: "チャクラのメス",
    name: "Iryō Ninjutsu · Chakra no Mesu",
    turkish: { tr: "Tıbbi Ninjutsu ve Çakra Neşteri", en: "Medical Ninjutsu & Chakra Scalpel" },
    tagline: {
      tr: "Aynı el hem diker hem keser; hangisini yaptığı elinde değil, niyetinde.",
      en: "The same hand stitches and cuts; which one it does is a matter of intent, not of skill.",
    },
    text: {
      tr: "Kabuto çakrasını avucunda yayıp bir yarayı kapatabildiği gibi, aynı çakrayı bıçak inceliğinde toplayıp deriyi hiç yırtmadan içerideki kası, damarı ve siniri kesebiliyor. Mühür gerektirmediği için dövüşün ortasında, tokalaşır gibi çalışıyor. Tıbbi ninjanın teşhis refleksi onda bir silaha dönüşmüş durumda: karşısındakinin nerede zayıf olduğunu, o kişi fark etmeden önce biliyor.",
      en: "Kabuto can spread chakra across his palm to close a wound, or gather the same chakra to the thinness of a blade and cut the muscle, vessel and nerve inside without ever breaking the skin. It needs no hand seals, so it works mid-fight, at the distance of a handshake. The medic's diagnostic reflex has become a weapon in him: he knows where an opponent is weak before that opponent does.",
    },
    traits: [
      { tr: "Deri yırtılmadan kesen bıçak", en: "A blade that cuts without breaking skin" },
      { tr: "Mühür gerektirmez", en: "Needs no hand seals" },
      { tr: "Teşhis = zayıf nokta", en: "Diagnosis is the weak point" },
    ],
  },
  {
    key: "sage" as const,
    imageKey: KABUTO_IMAGE_KEYS.sage,
    mark: "coil" as const,
    kanji: "仙人モード",
    name: "Sennin Mōdo",
    turkish: { tr: "Yılan Sennin Modu", en: "Snake Sage Mode" },
    tagline: {
      tr: "Ryūchi Mağarası'nda beyaz yılanın hazmedemediği tek konuk.",
      en: "The one guest the white snake of Ryūchi Cave could not digest.",
    },
    text: {
      tr: "Ryūchi Mağarası'nda senjutsu çakrasını toplamayı öğrendi ve dönüşü kalıcı oldu: derisi pullandı, gözbebeği yarıldı, alnında boynuz çıktı. Sennin modu ona yalnızca güç değil, algı verdi — çevresindeki her çakrayı okuyabildiği bir duyu. Sayfanın kendi mod düğmesi de bu: Kabuto'nun kimlik arayışının bittiği, bedeninin bile artık başka birininkine benzemek zorunda olmadığı hâl.",
      en: "In Ryūchi Cave he learned to gather senjutsu chakra, and the change stayed with him: scales across the skin, a split pupil, a horn at the brow. Sage mode gave him not only power but perception — a sense that reads every chakra around him. It is also the page's own mode switch: the state in which Kabuto's search for an identity ends, and his body no longer has to resemble anyone else's.",
    },
    traits: [
      { tr: "Ryūchi Mağarası", en: "Ryūchi Cave" },
      { tr: "Pullar ve yarık gözbebeği", en: "Scales and a slit pupil" },
      { tr: "Kalıcı dönüşüm", en: "A permanent transformation" },
    ],
  },
] as const;

/* ── Küçük aletler — dört ───────────────────────────────────────────────── */

export const KABUTO_TOOLS = [
  {
    key: "cards" as const,
    imageKey: KABUTO_IMAGE_KEYS.infoCards,
    mark: "fan" as const,
    name: { tr: "Bilgi kartları", en: "Info cards" },
    note: {
      tr: "Kartlar bomboş görünür; üstündeki yazı yalnızca Kabuto'nun çakrasıyla ortaya çıkar. Yani deste çalınsa bile okunamaz — bilgi kartın değil, taşıyanın malıdır.",
      en: "The cards look entirely blank; the writing surfaces only under Kabuto's chakra. Steal the deck and you still cannot read it — the information belongs to the carrier, not to the card.",
    },
  },
  {
    key: "disguise" as const,
    imageKey: KABUTO_IMAGE_KEYS.disguise,
    mark: "mask" as const,
    name: { tr: "Kimlik değiştirme", en: "Changing identity" },
    note: {
      tr: "Teknik kısmı sıradan: Henge no Jutsu'yu her genin bilir. Kabuto'yu ayıran, dönüşümü aylarca sürdürebilmesi — bir yüzü değil, bir hayatı taklit ediyor.",
      en: "The technique itself is ordinary: every genin knows Henge no Jutsu. What sets Kabuto apart is holding the disguise for months — he imitates not a face but a life.",
    },
  },
  {
    key: "deadSoul" as const,
    imageKey: KABUTO_IMAGE_KEYS.deadSoul,
    mark: "puppet" as const,
    name: { tr: "Shiryō no Jutsu", en: "Shiryō no Jutsu" },
    note: {
      tr: "Ölü bir bedeni çakrayla ayağa kaldırıp kukla gibi yürütür. Sınav ormanında karşısındakilere kendi ölülerini gönderdi: dövüşmesi gereken hiçbir an olmadan bilgi topladı.",
      en: "It raises a dead body with chakra and walks it like a puppet. In the Forest of Death he sent his own corpses at his opponents and gathered what he needed without having to fight at all.",
    },
  },
  {
    key: "graft" as const,
    imageKey: KABUTO_IMAGE_KEYS.graft,
    mark: "graft" as const,
    name: { tr: "Nakil", en: "The graft" },
    note: {
      tr: "Orochimaru öldükten sonra kalıntılarını kendi bedenine kattı; ardından efendisinin eski deneklerinden topladığı hücrelerle kendini yeniden yazdı. Kendi bedeni bile bir başkasının parçalarından kurulu.",
      en: "After Orochimaru died he took his master's remains into his own body, then rewrote himself with cells harvested from his master's former subjects. Even his body is assembled out of other people's parts.",
    },
  },
] as const;

/* ── Kimlik destesi — sayfanın kalbi ────────────────────────────────────── */

export const KABUTO_DECK_UI = {
  drawLabel: { tr: "Kart çek", en: "Draw a card" },
  drawnListLabel: { tr: "Çekilen kimlikler", en: "Identities drawn" },
  remainingLabel: { tr: "kalan kimlik", en: "identities left" },
  deckAlt: {
    tr: "Yüzü aşağı dönük kimlik kartları destesi — elle çizilmiş kart sırtı.",
    en: "A face-down stack of identity cards — hand-drawn card backs.",
  },
  useLabel: { tr: "Ne işe yaradı", en: "What it was for" },
  residueLabel: { tr: "Geriye kalan", en: "What it left behind" },
  resetLabel: { tr: "Desteyi topla", en: "Gather the deck" },
  emptyDeckLabel: { tr: "Deste bitti", en: "The deck is empty" },
  hint: {
    tr: "Çekilen kartlara yığından dönebilir, sol/sağ ok tuşlarıyla aralarında gezebilirsin.",
    en: "You can go back into any drawn card from the stack, and move between them with the left and right arrow keys.",
  },
  cardWord: { tr: "kart", en: "card" },
} as const;

export interface KabutoIdentityCard {
  key: string;
  imageKey?: string;
  /** Elle çizilmiş SVG işaret setinden anahtar */
  mark: string;
  /** Portresi kartın üstünde görünecek yoldaş (EXPERIENCE_COMPANIONS[2405]) */
  faceId?: number;
  faceName?: string;
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  use: LocalizedText;
  residue: LocalizedText;
  /** Son kart: yazısı yok, tek soru taşıyor */
  blank?: boolean;
  question?: LocalizedText;
}

export const KABUTO_CARDS: KabutoIdentityCard[] = [
  {
    key: "orphan",
    imageKey: KABUTO_IMAGE_KEYS.cardOrphan,
    mark: "ring",
    era: { tr: "Kikyō Geçidi, savaştan sonra", en: "Kikyō Pass, after the battle" },
    title: { tr: "Adı olmayan çocuk", en: "The child with no name" },
    text: {
      tr: "Bulunduğunda ne adını ne nereden geldiğini söyleyebiliyordu. Konoha Tıbbi Birliği'nden Nono Yakushi onu köye getirdi, yetimhanesine aldı ve kendi soyadını verdi. Yuvarlak gözlüğü de o yıllarda taktı. İlk kimliği bile bir başkasının armağanıydı.",
      en: "When he was found he could give neither his name nor where he had come from. Nono Yakushi of the Konoha Medical Unit brought him back to the village, took him into her orphanage and gave him her own surname. The round glasses come from those years too. Even his first identity was somebody else's gift.",
    },
    use: { tr: "Bir yer edinmek.", en: "To have somewhere to be." },
    residue: { tr: "Bir soyadı ve bir gözlük.", en: "A surname and a pair of glasses." },
  },
  {
    key: "exam",
    imageKey: KABUTO_IMAGE_KEYS.cardExam,
    mark: "fan",
    faceId: 17,
    faceName: "Naruto Uzumaki",
    era: { tr: "Chūnin sınavı, yedinci deneme", en: "Chūnin exam, the seventh attempt" },
    title: { tr: "Yardımsever sınav adayı", en: "The helpful exam candidate" },
    text: {
      tr: "Sınav salonundaki güler yüzlü kıdemli: acemilere kartlarını gösteren, kuralları anlatan, kimin kimden korkması gerektiğini söyleyen kişi. Naruto'nun rakiplerini ilk kez onun kartlarından öğrendik. Yedi kez girmiş, bir kez bile terfi etmemişti — çünkü sınav onun için bir basamak değil, bir toplama alanıydı.",
      en: "The friendly senior in the exam hall: the one who shows the rookies his cards, explains the rules, tells them who ought to be afraid of whom. We first learned Naruto's rivals from those cards. He had entered seven times and never once been promoted — because for him the exam was not a step up, it was a collection ground.",
    },
    use: { tr: "Güven toplamak.", en: "To gather trust." },
    residue: {
      tr: "Başkalarının hayatıyla dolu bir deste.",
      en: "A deck filled with other people's lives.",
    },
  },
  {
    key: "root",
    imageKey: KABUTO_IMAGE_KEYS.cardRoot,
    mark: "root",
    era: { tr: "Danzō'nun emrinde", en: "Under Danzō's command" },
    title: { tr: "Kök ajanı", en: "Root agent" },
    text: {
      tr: "Kök onu daha çocukken devraldı ve casus olarak yetiştirdi. Danzō'nun ondan istediği tek şey vardı: hiç kimse olmak. Kütükteki kaydı silindi, yetimhanedeki çocukluğu bir örtüye dönüştü, adı bir görevden diğerine değişti. Bir ajan için en değerli özellik, geride kanıt bırakmayan bir geçmiştir.",
      en: "Root took him while he was still a child and raised him as a spy. Danzō wanted one thing from him: to be nobody. His entry in the registry was erased, his childhood at the orphanage became a cover story, his name changed from one mission to the next. The most valuable thing an agent can own is a past that leaves no evidence.",
    },
    use: { tr: "Görünmez olmak.", en: "To become invisible." },
    residue: { tr: "Silinmiş bir kayıt.", en: "An erased record." },
  },
  {
    key: "medic",
    imageKey: KABUTO_IMAGE_KEYS.cardMedic,
    mark: "suture",
    era: { tr: "Sahada, her iki taraf için", en: "In the field, for both sides" },
    title: { tr: "Tıbbi ninja", en: "Medical ninja" },
    text: {
      tr: "Nono'nun mesleği. Kabuto'nun elindeki en gerçek beceri de bu: kesmeyi ve dikmeyi aynı anda bilen bir el. Yıllarca hem savaş alanından yaralı taşıdı hem de aynı bilgiyle karşı tarafın sinirlerini kesti. Kimliklerinin arasında rol olmayan tek şey buydu — ona anne dediği kadından kalan tek miras.",
      en: "Nono's profession, and the truest skill Kabuto owns: a hand that knows cutting and stitching at the same time. For years he carried the wounded off battlefields and used the same knowledge to sever an enemy's nerves. Of all his identities this is the only one that was never a role — the single inheritance left by the woman he called mother.",
    },
    use: { tr: "Bir işe yaramak.", en: "To be of use." },
    residue: { tr: "Annesinden kalan tek şey.", en: "The only thing left of his mother." },
  },
  {
    key: "shadow",
    imageKey: KABUTO_IMAGE_KEYS.cardShadow,
    mark: "coil",
    faceId: 2455,
    faceName: "Orochimaru",
    era: { tr: "Otogakure yılları", en: "The Otogakure years" },
    title: { tr: "Orochimaru'nun sağkolu", en: "Orochimaru's right hand" },
    text: {
      tr: "Orochimaru onu ne öğrencisi ne kölesi yaptı: gölgesi yaptı. Kabuto ilaçları hazırladı, denekleri kaydetti, kapları seçti, ölüleri temizledi, dışarıya taşınacak yalanı kurdu. Yıllarca kendi cümlesini kurmadı; efendisinin cümlesini tamamladı. Bu kimlik hepsinin en rahatıydı, çünkü içinde soru yoktu.",
      en: "Orochimaru made him neither a student nor a slave: he made him a shadow. Kabuto mixed the drugs, filed the test subjects, picked the vessels, cleared away the dead and built the lie that would be carried outside. For years he did not finish a sentence of his own; he finished his master's. This identity was the most comfortable of them all, because it contained no questions.",
    },
    use: { tr: "Bir yere ait olmak.", en: "To belong somewhere." },
    residue: { tr: "Efendisinin sesi.", en: "His master's voice." },
  },
  {
    key: "pact",
    imageKey: KABUTO_IMAGE_KEYS.cardPact,
    mark: "pact",
    faceId: 13,
    faceName: "Sasuke Uchiha",
    era: { tr: "Dördüncü Savaş'ın arifesi", en: "On the eve of the Fourth War" },
    title: { tr: "Akatsuki'nin ortağı", en: "Akatsuki's partner" },
    text: {
      tr: "Orochimaru öldükten sonra kalıntılarını kendi bedenine kattı ve ilk kez masanın karşı tarafına oturdu. Maskeli adama diriltilmiş bir ordu sundu; karşılığında istediği tek şey Sasuke'ydi. Hayatında ilk defa hizmet eden değil pazarlık eden taraftaydı — ama istediği şey yine bir başkasının bedeniydi.",
      en: "After Orochimaru's death he took the remains into his own body and sat, for the first time, on the other side of the table. He offered the masked man an army of the dead; the only thing he asked in return was Sasuke. For the first time in his life he was bargaining rather than serving — and what he bargained for was, again, somebody else's body.",
    },
    use: { tr: "Eşit sayılmak.", en: "To be counted as an equal." },
    residue: { tr: "Bir ordu ve ordunun bedeli.", en: "An army, and the price of an army." },
  },
  {
    key: "army",
    imageKey: KABUTO_IMAGE_KEYS.cardArmy,
    mark: "coffin",
    faceId: 53901,
    faceName: "Madara Uchiha",
    era: { tr: "Dördüncü Şinobi Savaşı", en: "The Fourth Great Shinobi War" },
    title: { tr: "Edo Tensei ustası", en: "Master of Edo Tensei" },
    text: {
      tr: "Mezarları açtı: Akatsuki'nin ölüleri, eski Kage'ler, jinchūriki'ler ve nihayet Madara Uchiha. Tek bir adam savaşın yarısını taşıdı ve bunu kendi elleriyle değil, başkalarının cesetleriyle yaptı. En büyük gücü aynı zamanda en açık itirafıydı: hâlâ başkalarının bedeninden konuşuyordu.",
      en: "He opened the graves: Akatsuki's dead, the old Kage, the jinchūriki and finally Madara Uchiha. One man carried half a war, and he did it not with his own hands but with other people's corpses. His greatest power was also his plainest confession: he was still speaking out of somebody else's body.",
    },
    use: { tr: "Herkesten güçlü olmak.", en: "To be stronger than everyone." },
    residue: { tr: "Yine bir başkasının bedeni.", en: "Somebody else's body, again." },
  },
  {
    key: "blank",
    mark: "blank",
    blank: true,
    era: { tr: "Izanami'nin içinde", en: "Inside Izanami" },
    title: { tr: "Boş kart", en: "The blank card" },
    question: { tr: "peki sen kimsin?", en: "so who are you?" },
    text: {
      tr: "Itachi Uchiha ona yeni bir düşman değil, cevaplanana kadar tekrar edecek tek bir soru bıraktı. Izanami bir kaderi değiştirmez; kişinin kendi kaderini kabul etmesini bekler. Deste bittiğinde geriye kalan kartın üstünde yazı yoktu — Kabuto'nun yıllardır çevirmediği tek kart buydu.",
      en: "Itachi Uchiha left him not a new enemy but a single question that would repeat until it was answered. Izanami does not change a fate; it waits for a person to accept their own. When the deck ran out, the card left over had nothing written on it — the one card Kabuto had spent years refusing to turn.",
    },
    use: { tr: "Hiçbir şey.", en: "Nothing." },
    residue: { tr: "Cevap.", en: "The answer." },
  },
];

/* ── Bilgi kartları ─────────────────────────────────────────────────────── */

export interface KabutoInfoCard {
  key: string;
  subject: string;
  squad: LocalizedText;
  line: LocalizedText;
  note: LocalizedText;
  /** Kendi kartı: alanları boş, arşivin yorumuyla kapanır */
  self?: boolean;
}

export const KABUTO_INFO_UI = {
  subjectLabel: { tr: "Kayıt", en: "Record" },
  squadLabel: { tr: "Takım", en: "Squad" },
  lineLabel: { tr: "Kartın satırı", en: "The card's line" },
  backLabel: { tr: "Kartın arkası", en: "Back of the card" },
  backEmpty: { tr: "boş", en: "blank" },
} as const;

export const KABUTO_INFO_CARDS: KabutoInfoCard[] = [
  {
    key: "lee",
    subject: "Rock Lee",
    squad: { tr: "Takım Guy — Konohagakure", en: "Team Guy — Konohagakure" },
    line: {
      tr: "Ninjutsu ve genjutsu kullanamıyor. Elinde yalnızca taijutsu var.",
      en: "Cannot use ninjutsu or genjutsu. All he has is taijutsu.",
    },
    note: {
      tr: "Bu satırı sınav öncesinde Konoha'nın acemilerine kendi okudu; kartın işi rakibi küçültmek değil, dinleyeni borçlandırmaktı.",
      en: "He read this line out to Konoha's rookies himself before the exam; the card's job was not to belittle a rival but to put the listener in his debt.",
    },
  },
  {
    key: "gaara",
    subject: "Gaara",
    squad: { tr: "Sunagakure — kum kardeşler", en: "Sunagakure — the sand siblings" },
    line: {
      tr: "Çıktığı hiçbir görevden tek bir çizik almadan döndü.",
      en: "He has come back from every mission without a single scratch.",
    },
    note: {
      tr: "Kartın en tehlikeli satırı bir güç ölçüsü değil, bir yokluk: hasar kaydının hiç olmaması.",
      en: "The most dangerous line on the card is not a measure of power but an absence: no record of damage at all.",
    },
  },
  {
    key: "self",
    self: true,
    subject: "Kabuto Yakushi",
    squad: { tr: "—", en: "—" },
    line: { tr: "—", en: "—" },
    note: {
      tr: "Bilgi kartı, kaydettiği kişi hakkında her şeyi söyler; kartı hazırlayan hakkında hiçbir şey. Kabuto'nun kendi satırı yıllarca boş kaldı — ve bunu boş bırakan da kendisiydi.",
      en: "An info card tells you everything about the person it records and nothing about the person who wrote it. Kabuto's own line stayed empty for years — and he was the one who kept it empty.",
    },
  },
];

/* ── Dosyanın beş sayfası ───────────────────────────────────────────────── */

export interface KabutoFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  /** Sayfanın kenarında portresi görünen karakter */
  faceId?: number;
  faceName?: string;
}

export const KABUTO_TIMELINE: KabutoFateEntry[] = [
  {
    key: "found",
    imageKey: KABUTO_IMAGE_KEYS.fateFound,
    age: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Adsız bulundu", en: "Found without a name" },
    text: {
      tr: "Kikyō Geçidi'ndeki çarpışma bittiğinde alanda ayakta kalan tek çocuktu ve kim olduğunu söyleyemiyordu. Konoha Tıbbi Birliği'nden Nono Yakushi onu topladı, yetimhaneye getirdi, adını ve soyadını verdi. Kimliğinin ilk harfini bile bir başkası yazdı.",
      en: "When the fighting at Kikyō Pass ended he was the only child left standing on the field, and he could not say who he was. Nono Yakushi of the Konoha Medical Unit gathered him up, brought him to the orphanage and gave him a name and a surname. Even the first letter of his identity was written by someone else.",
    },
  },
  {
    key: "root",
    imageKey: KABUTO_IMAGE_KEYS.fateRoot,
    age: { tr: "Çocukluğun sonu", en: "The end of childhood" },
    title: { tr: "Danzō kaydı siler", en: "Danzō erases the record" },
    text: {
      tr: "Kök onu casus olarak devraldı. Danzō'nun karşılığında verdiği şey koruma değildi: yokluktu. Konoha kütüğündeki kaydı silindi, yetimhanedeki çocukluğu bir örtüye çevrildi ve Kabuto yıllarca başka insanların hayatlarını giyerek çalıştı. Her göreve giderken bir isim seçiyor, dönerken bırakıyordu.",
      en: "Root took him over as a spy. What Danzō gave in return was not protection but absence. His entry in the Konoha registry was erased, his childhood at the orphanage turned into a cover, and for years he worked by wearing other people's lives. He picked a name on the way to every mission and left it behind on the way back.",
    },
  },
  {
    key: "nono",
    imageKey: KABUTO_IMAGE_KEYS.fateNono,
    age: { tr: "Gençlik", en: "Youth" },
    title: { tr: "Tanımadığı kadın", en: "The woman he did not recognise" },
    text: {
      tr: "Bir Kök görevinde karşısına maskeli bir düşman ajanı çıktı; ikisi de sahte bir kimlikle oradaydı. Kabuto onu öldürdükten sonra maskenin altındakinin Nono olduğunu gördü — ve Nono, ölürken onu tanımadı. O gece kimliğinin son bağı da koptu: geride onu hatırlayacak kimse kalmamıştı.",
      en: "On a Root mission he came up against a masked enemy agent; both of them were there under a false identity. After he killed her, Kabuto saw that the face beneath the mask was Nono's — and Nono, dying, did not recognise him. That night the last tether of his identity snapped: no one was left who remembered him.",
    },
  },
  {
    key: "snake",
    imageKey: KABUTO_IMAGE_KEYS.fateSnake,
    age: { tr: "Uzun yıllar", en: "The long years" },
    title: { tr: "Bir gölgenin içinde yaşamak", en: "Living inside a shadow" },
    faceId: 2455,
    faceName: "Orochimaru",
    text: {
      tr: "Orochimaru ona sığınak değil bir rol verdi, Kabuto da o rolü memnuniyetle giydi: ilaçları hazırladı, denekleri kaydetti, casusluğu sürdürdü, kendi adına tek bir hamle yapmadı. Efendisi Sasuke'nin eliyle düştüğünde geriye kalanları kendi bedenine kattı ve ilk defa kendi adına konuşmayı denedi. O sesin ne kadarının kendisine ait olduğu belirsizdi.",
      en: "Orochimaru gave him a role rather than a refuge, and Kabuto put it on gladly: he mixed the drugs, filed the subjects, kept up the spying and never made a single move on his own account. When his master fell to Sasuke he took the remains into his own body and tried, for the first time, to speak for himself. How much of that voice was his own remained unclear.",
    },
  },
  {
    key: "izanami",
    imageKey: KABUTO_IMAGE_KEYS.fateIzanami,
    age: { tr: "Savaş", en: "The war" },
    title: { tr: "Döngü kırılır", en: "The loop breaks" },
    faceId: 14,
    faceName: "Itachi Uchiha",
    text: {
      tr: "Dördüncü Şinobi Savaşı'na diriltilmiş bir orduyla girdi ve savaşın yönünü tek başına belirledi. Onu durduran şey bir teknik üstünlüğü olmadı: Itachi Uchiha, Izanami ile onu kendi anlarına kilitledi. Döngü ancak Kabuto kendini olduğu gibi kabul ettiğinde sona erdi. Edo Tensei'yi kendi eliyle bozdu, savaştan sonra Nono'nun yetimhanesine döndü ve orada kaldı.",
      en: "He entered the Fourth Great Shinobi War with an army of the dead and set the direction of the war by himself. What stopped him was not a superior technique: Itachi Uchiha locked him inside his own moments with Izanami. The loop only ended when Kabuto accepted himself as he was. He undid Edo Tensei with his own hands, and after the war returned to Nono's orphanage and stayed there.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const KABUTO_CLOSING = {
  quotes: [
    {
      text: { tr: "Ben benim.", en: "I am me." },
      original: "僕は僕だ",
      by: { tr: "Kabuto Yakushi", en: "Kabuto Yakushi" },
      note: {
        tr: "Izanami'nin döngüsünden çıkarken vardığı cevap. Türkçesi arşivin çevirisi; sayfadaki tek replik budur.",
        en: "The answer he reached on his way out of Izanami's loop. The rendering is the archive's own, and this is the only quoted line on the page.",
      },
    },
    {
      text: { tr: "peki sen kimsin?", en: "so who are you?" },
      original: null,
      by: { tr: "Destenin son kartı", en: "The last card in the deck" },
      note: {
        tr: "Bu satır bir karaktere ait değil: destenin boş kartına, yani arşivin okura sorusuna aittir.",
        en: "This line belongs to no character: it belongs to the blank card in the deck — the archive's question to the reader.",
      },
    },
  ],
  motto: "穢土転生",
  mottoNote: {
    tr: "edo tensei — “kirli toprakta yeniden doğuş”. En büyük tekniğinin adı, aynı zamanda kendi hikâyesinin özeti.",
    en: "edo tensei — “rebirth from impure earth”. The name of his greatest technique is also the summary of his own life.",
  },
  credit: {
    tr: "Künye verileri (doğum tarihi, kan grubu) ve kapak portresi AniList'ten alınmıştır; bu karakterin arşivde yüklenmiş tam boy portresi yok, bu yüzden portre küçük kadrajda ve kendi ölçüsünde tutuldu. Gözlük, kart sırtları, kimlik işaretleri, pul dokusu ve dikiş nişanları bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, blood type) and the cover portrait come from AniList; this character has no full-size portrait uploaded to the archive, so the portrait is kept small and at its own scale. The spectacles, card backs, identity marks, scale texture and suture marks are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;

/** Yoldaş portrelerinin ortak alt eki — hepsi kendi veritabanımızdan. */
export const KABUTO_ALT = {
  faceSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;
