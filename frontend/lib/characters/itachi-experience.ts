import type { LocalizedText } from "./types";

/**
 * Itachi Uchiha — interaktif deneyim sayfasının veri iskeleti.
 *
 * Zaraki emsalinin devamı: karaktere özel BÜTÜN anlatı kodda, iki dilli
 * `LocalizedText` çiftleri olarak (kural 1'in belgelenmiş uygulanışı,
 * 6 Ağustos 2026 kararı). Görseller veritabanında (`CharacterImage`,
 * characterId 14, ABILITY yuvası `itachi:*` anahtarları — Akatsuki
 * sergisindeki `akatsuki:*` deseninin kardeşi).
 *
 * Sayfa /dark-stories/category/anime/karakterler/14 adresinde
 * CharacterDossier'in YERİNE çizilir (rota dalı). Kaynak: Naruto databook
 * künyesi + kullanıcının sağladığı dosya kartı (18 Ağustos 2026).
 */

export const ITACHI_ID = 14;

/** Sergi görselleri — hepsi characterId 14 kaydında ABILITY yuvasında. */
export const ITACHI_IMAGE_KEYS = {
  /** Hero: karanlıkta yüz + kızıl ay + kargalı silüet (16:9) */
  hero: "itachi:hero",
  /** Hero'nun dikey kadrajı (9:16) — dar ekran sanat yönü */
  heroMobile: "itachi:hero-mobile",
  tsukuyomi: "itachi:tsukuyomi",
  amaterasu: "itachi:amaterasu",
  susanoo: "itachi:susanoo",
  eraAnbu: "itachi:era-anbu",
  eraMassacre: "itachi:era-massacre",
  eraAkatsuki: "itachi:era-akatsuki",
  eraFinal: "itachi:era-final",
  eraEdo: "itachi:era-edo",
  userItachi: "itachi:user-itachi",
  userSasuke: "itachi:user-sasuke",
  userMadara: "itachi:user-madara",
  userShisui: "itachi:user-shisui",
} as const;

/**
 * Hero görselindeki GÖZ merkezleri — üretilen kadrajdan elle kalibre
 * (yüzde; kutu sabit en-boy oranında olduğu için her ekranda aynı yere
 * düşer). Görsel kürasyondan değiştirilirse bu sabitler de güncellenmeli.
 *
 * En-boy oranının kendisi ItachiExperience.module.css'te yaşar
 * (.stageBox width + aspect-ratio, iki kadraj) — kadraj değişirse orası
 * da güncellenmeli. `mobile` seti yalnızca dikey görsel BAĞLIYKEN
 * kullanılır (ItachiHero `vertical` koşulu).
 */
export const ITACHI_HERO_EYES = {
  desktop: {
    left: { x: 46.8, y: 33.6 },
    right: { x: 56.15, y: 33.3 },
    /** Göz bölgesi yarıçapı (genişlik yüzdesi) — vuruş alanı */
    radius: 3.2,
  },
  mobile: {
    left: { x: 40.2, y: 28.4 },
    right: { x: 61.7, y: 28.3 },
    radius: 6,
  },
} as const;

/** Göz durumu — hero ve panel aynı sözlüğü konuşur. */
export type EyeStage = "dark" | "ember" | "sharingan" | "mangekyo";

/* ── Kimlik şeridi ──────────────────────────────────────────────────── */

export const ITACHI_IDENTITY = {
  name: "Itachi Uchiha",
  nativeName: "うちはイタチ",
  epigraph: {
    tr: "Kendini affedebilen ve gerçek doğasını kabullenebilenler... güçlü olanlar onlardır.",
    en: "Those who forgive themselves, and are able to accept their true nature... they are the strong ones.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "9 Haziran", en: "June 9" },
    },
    {
      label: { tr: "Boy · Kilo", en: "Height · Weight" },
      value: { tr: "178 cm · 58,1 kg", en: "178 cm · 58.1 kg" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "AB", en: "AB" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "21 — öldüğünde", en: "21 — at death" },
    },
    {
      label: { tr: "Doğa türü", en: "Nature type" },
      value: { tr: "Ateş · Su · Yin", en: "Fire · Water · Yin" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "ANBU yüzbaşısı (13 yaşında)",
        en: "ANBU captain (at 13)",
      },
    },
    {
      label: { tr: "Ortağı", en: "Partner" },
      value: { tr: "Kisame Hoshigaki", en: "Kisame Hoshigaki" },
    },
    {
      label: { tr: "Yüzüğü", en: "Ring" },
      value: { tr: "朱 — shu, sağ yüzük parmağı", en: "朱 — shu, right ring finger" },
    },
  ],
} as const;

/* ── Hero arayüz metinleri (istemciye sunucudan seçilip iner) ───────── */

export const ITACHI_HERO_TEXT = {
  hint: {
    tr: "Karanlığı işaretçinle tara",
    en: "Sweep the darkness with your pointer",
  },
  hintTouch: {
    tr: "Karanlığa dokun — gözleri bul",
    en: "Touch the darkness — find the eyes",
  },
  eyesLabel: {
    tr: "Itachi'nin gözleri — Sharingan'ı uyandır",
    en: "Itachi's eyes — awaken the Sharingan",
  },
  stageNames: {
    dark: { tr: "Karanlık", en: "Darkness" },
    ember: { tr: "Kor", en: "Ember" },
    sharingan: { tr: "Sharingan", en: "Sharingan" },
    mangekyo: { tr: "Mangekyō Sharingan", en: "Mangekyō Sharingan" },
  },
} as const;

export const ITACHI_GENJUTSU_TEXT = {
  enter: { tr: "Genjutsu modu", en: "Genjutsu mode" },
  exit: { tr: "Genjutsu'dan çık", en: "Leave the genjutsu" },
} as const;

/* ── Jutsu laboratuvarı ─────────────────────────────────────────────── */

export interface ItachiJutsu {
  key: "tsukuyomi" | "amaterasu" | "susanoo";
  kanji: string;
  name: string;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const ITACHI_JUTSU: ItachiJutsu[] = [
  {
    key: "tsukuyomi",
    kanji: "月読",
    name: "Tsukuyomi",
    tagline: {
      tr: "Zamanın kontrolü sende değil.",
      en: "Time is not yours to keep.",
    },
    text: {
      tr: "Tek bir göz temasıyla kurbanı zihinsel bir dünyaya hapseder. Orada saniyeler günler gibi akar: Itachi üç günlük işkenceyi gerçek dünyanın tek bir anına sığdırır.",
      en: "A single moment of eye contact traps the victim in a mental world where seconds stretch into days: Itachi fits three days of torment into one real-world instant.",
    },
    traits: [
      { tr: "Mangekyō genjutsu'su", en: "Mangekyō genjutsu" },
      { tr: "72 saat · tek an", en: "72 hours · one instant" },
      { tr: "Kırılması neredeyse imkânsız", en: "Nearly impossible to break" },
    ],
  },
  {
    key: "amaterasu",
    kanji: "天照",
    name: "Amaterasu",
    tagline: {
      tr: "Gözün gördüğü her şey yanar.",
      en: "Everything the eye beholds, burns.",
    },
    text: {
      tr: "Bakışın odaklandığı noktada tutuşan söndürülemez kara alevler. Hedefini küle çevirene dek yanar; ateşin kendisi bile bu alevlerin yakıtıdır.",
      en: "Inextinguishable black flames ignite at the focus of the user's gaze and burn until the target is ash; even fire itself is fuel for them.",
    },
    traits: [
      { tr: "Söndürülemez kara alev", en: "Unquenchable black fire" },
      { tr: "Yedi gün yedi gece yanar", en: "Burns seven days and nights" },
      { tr: "Bedeli: sol gözün ışığı", en: "Price: the left eye's light" },
    ],
  },
  {
    key: "susanoo",
    kanji: "須佐能乎",
    name: "Susanoo",
    tagline: {
      tr: "Etrafındaki devasa muhafız.",
      en: "The colossal guardian around him.",
    },
    text: {
      tr: "İki Mangekyō gözün uyandırdığı çakra devi. Itachi'nin Susanoo'su iki efsane taşır: dokunduğunu sonsuz bir rüyaya mühürleyen Totsuka Kılıcı ve her saldırıyı geri çeviren Yata Aynası.",
      en: "The chakra colossus awakened by both Mangekyō eyes. Itachi's Susanoo bears two legends: the Totsuka Blade that seals whatever it pierces into an endless dream, and the Yata Mirror that turns aside every attack.",
    },
    traits: [
      { tr: "Totsuka Kılıcı — mühürleyen sarhoş kılıç", en: "Totsuka Blade — the sealing sake sword" },
      { tr: "Yata Aynası — bütün doğaları yansıtır", en: "Yata Mirror — reflects all natures" },
      { tr: "Tam vücut savunma ve saldırı", en: "Full-body defence and offence" },
    ],
  },
];

/** Küçük teknik çipleri — laboratuvarın alt sırası. */
export const ITACHI_MINOR_JUTSU: Array<{ name: string; note: LocalizedText }> = [
  {
    name: "Karasu Bunshin",
    note: { tr: "Kargalara dağılan klon", en: "A clone that scatters into crows" },
  },
  {
    name: "Izanami",
    note: { tr: "Kaderi kilitleyen döngü", en: "The loop that locks fate" },
  },
  {
    name: "Katon: Gōkakyū",
    note: { tr: "Uchiha'nın ateş mirası", en: "The Uchiha fire legacy" },
  },
  {
    name: "Shurikenjutsu",
    note: { tr: "Klanın en keskin eli", en: "The clan's sharpest hand" },
  },
];

/* ── Gözler bölümü — Sharingan paneli (referans infografiğin içeriği) ── */

export type EyeGlyph =
  | "tomoe1"
  | "tomoe2"
  | "tomoe3"
  | "mangekyoItachi"
  | "mangekyoSasuke"
  | "mangekyoShisui"
  | "mangekyoObito"
  | "eternal"
  | "rinneganLike";

export const ITACHI_SHARINGAN = {
  title: { tr: "Sharingan", en: "Sharingan" },
  subtitle: { tr: "Ötesini gören göz", en: "The eye that sees beyond" },
  kanji: "写輪眼",
  intro: {
    tr: "Sharingan, Uchiha klanının kekkei genkai'ıdır (kan mirası). Kullanıcısına keskinleşmiş algı, gördüğü teknikleri kopyalama yeteneği ve güçlü genjutsu bahşeder.",
    en: "The Sharingan is the kekkei genkai (bloodline limit) of the Uchiha clan. It grants the user heightened perception, the ability to copy techniques on sight, and powerful genjutsu.",
  },
  introQuote: {
    text: {
      tr: "Kendi benliğini kabullenemeyenler, başarısızlığa mahkûmdur.",
      en: "Those who cannot acknowledge their own selves are bound to fail.",
    },
    by: "Itachi Uchiha",
  },
  openHint: {
    tr: "Gözü uyandırmak için tıkla",
    en: "Click to awaken the eye",
  },
  closeLabel: { tr: "Gözü kapat", en: "Close the eye" },
  evolutionTitle: { tr: "Gözün Evrimi", en: "Evolution of the Eye" },
  evolution: [
    {
      key: "t1",
      glyph: "tomoe1" as EyeGlyph,
      name: { tr: "1 Tomoe", en: "1 Tomoe" },
      text: {
        tr: "İlk uyanış. Odağı ve farkındalığı keskinleştirir.",
        en: "The first awakening. Sharpens focus and awareness.",
      },
    },
    {
      key: "t2",
      glyph: "tomoe2" as EyeGlyph,
      name: { tr: "2 Tomoe", en: "2 Tomoe" },
      text: {
        tr: "Gelişmiş algı; hareketleri çözümleme yeteneği.",
        en: "Improved perception and the ability to read movement.",
      },
    },
    {
      key: "t3",
      glyph: "tomoe3" as EyeGlyph,
      name: { tr: "3 Tomoe", en: "3 Tomoe" },
      text: {
        tr: "Tam Sharingan. Jutsu kopyalar, hamleleri önceden görür.",
        en: "The complete Sharingan. Copies jutsu and predicts moves.",
      },
    },
    {
      key: "ms",
      glyph: "mangekyoItachi" as EyeGlyph,
      name: { tr: "Mangekyō", en: "Mangekyō" },
      text: {
        tr: "En yakınını kaybetmenin bedeliyle uyanır; her göz kendine özgü bir güç taşır.",
        en: "Awakened at the price of losing what is dearest; each eye carries a unique power.",
      },
    },
    {
      key: "ems",
      glyph: "eternal" as EyeGlyph,
      name: { tr: "Ebedi Mangekyō", en: "Eternal Mangekyō" },
      text: {
        tr: "Bir kardeşin gözleriyle nakledilir; körlük olmadan sonsuz güç verir.",
        en: "Transplanted from a sibling's eyes; grants boundless power without blindness.",
      },
    },
  ],
  abilitiesTitle: { tr: "Kilit Yetenekler", en: "Key Abilities" },
  abilities: [
    {
      key: "perception",
      name: { tr: "Keskin Algı", en: "Enhanced Perception" },
      text: {
        tr: "Çakrayı, hareketi ve en ince ayrıntıyı görür.",
        en: "Sees chakra, movement and the subtlest detail.",
      },
    },
    {
      key: "copy",
      name: { tr: "Kopyalama", en: "Copy Ability" },
      text: {
        tr: "Gördüğü ninja tekniklerini anında kopyalar.",
        en: "Copies ninja techniques the moment they are seen.",
      },
    },
    {
      key: "genjutsu",
      name: { tr: "Genjutsu Ustalığı", en: "Genjutsu Mastery" },
      text: {
        tr: "Zihni ele geçiren güçlü illüzyonlar örer.",
        en: "Weaves powerful illusions that seize the mind.",
      },
    },
    {
      key: "foresight",
      name: { tr: "Öngörü", en: "Prediction" },
      text: {
        tr: "Rakibin hamlesini olmadan önce okur.",
        en: "Reads the opponent's move before it happens.",
      },
    },
  ],
  mangekyoTitle: { tr: "Mangekyō Yetenekleri", en: "Mangekyō Abilities" },
  mangekyo: [
    {
      key: "amaterasu",
      glyph: "mangekyoItachi" as EyeGlyph,
      name: "Amaterasu",
      user: "Itachi Uchiha",
      text: {
        tr: "Her şeyi yakan kara alevler.",
        en: "Black flames that burn everything.",
      },
    },
    {
      key: "tsukuyomi",
      glyph: "mangekyoItachi" as EyeGlyph,
      name: "Tsukuyomi",
      user: "Itachi Uchiha",
      text: {
        tr: "Zaman algısını büken güçlü genjutsu.",
        en: "A powerful genjutsu that distorts time.",
      },
    },
    {
      key: "kamui",
      glyph: "mangekyoObito" as EyeGlyph,
      name: "Kamui",
      user: "Obito Uchiha (Kakashi)",
      text: {
        tr: "Başka bir boyuta geçiş.",
        en: "Warping into another dimension.",
      },
    },
    {
      key: "susanoo",
      glyph: "mangekyoSasuke" as EyeGlyph,
      name: "Susano'o",
      user: "Sasuke Uchiha (Madara)",
      text: {
        tr: "Savunma ve saldırı için dev savaşçı avatar.",
        en: "A giant warrior avatar for defence and attack.",
      },
    },
    {
      key: "kotoamatsukami",
      glyph: "mangekyoShisui" as EyeGlyph,
      name: "Kotoamatsukami",
      user: "Shisui Uchiha",
      text: {
        tr: "Hedefin haberi olmadan zihin kontrolü.",
        en: "Mind control without the target's knowledge.",
      },
    },
  ],
  usersTitle: { tr: "Ünlü Kullanıcılar", en: "Famous Users" },
  users: [
    {
      name: "Itachi Uchiha",
      imageKey: ITACHI_IMAGE_KEYS.userItachi,
      glyph: "mangekyoItachi" as EyeGlyph,
      note: {
        tr: "Genjutsu'nun ve stratejik zekânın ustası.",
        en: "Master of genjutsu and strategic intelligence.",
      },
    },
    {
      name: "Sasuke Uchiha",
      imageKey: ITACHI_IMAGE_KEYS.userSasuke,
      glyph: "eternal" as EyeGlyph,
      note: {
        tr: "İntikamla bilenen göz; gücün ve gerçeğin peşinde.",
        en: "An eye honed by revenge, chasing power and truth.",
      },
    },
    {
      name: "Madara Uchiha",
      imageKey: ITACHI_IMAGE_KEYS.userMadara,
      glyph: "eternal" as EyeGlyph,
      note: {
        tr: "Gelmiş geçmiş en güçlü Uchiha'lardan; EMS'nin sahibi.",
        en: "Among the strongest Uchiha to ever live; wielder of the EMS.",
      },
    },
    {
      name: "Shisui Uchiha",
      imageKey: ITACHI_IMAGE_KEYS.userShisui,
      glyph: "mangekyoShisui" as EyeGlyph,
      note: {
        tr: "\"Işınlanan Shisui\" — Itachi'nin yol göstereni.",
        en: "\"Shisui of the Body Flicker\" — Itachi's guiding light.",
      },
    },
  ],
  strengthsTitle: { tr: "Güçlü Yönler", en: "Strengths" },
  strengths: [
    { tr: "Eşsiz algı", en: "Unmatched perception" },
    { tr: "Her jutsu'yu kopyalar", en: "Copies any jutsu" },
    { tr: "Güçlü genjutsu", en: "Powerful genjutsu" },
    { tr: "Yüksek savaş zekâsı", en: "High battle IQ" },
  ],
  weaknessesTitle: { tr: "Zayıf Yönler", en: "Weaknesses" },
  weaknesses: [
    { tr: "Çakrayı tüketir", en: "Drains chakra" },
    { tr: "Duygusal bedel", en: "Emotional strain" },
    { tr: "Aşırı kullanımda körlük", en: "Blindness with overuse" },
    { tr: "Güçlü irade ister", en: "Requires strong will" },
  ],
  closing: {
    text: {
      tr: "Sharingan yalnızca bir güç değil... Uchiha'nın yüküdür.",
      en: "The Sharingan is not just a power... it is the burden of the Uchiha.",
    },
  },
  /**
   * Mangekyō deseninin künyesi. Itachi'nin Mangekyō çizimi Wikimedia
   * Commons'tan birebir alındı ve CC BY-SA 3.0 atıf ŞARTI taşıyor —
   * bu satır lisansın gereği, kaldırılamaz (bkz. SharinganEyes.tsx).
   */
  credit: {
    tr: "Mangekyō deseni: ShounenSuki / Narutopedia — CC BY-SA 3.0",
    en: "Mangekyō pattern: ShounenSuki / Narutopedia — CC BY-SA 3.0",
  },
} as const;

/* ── Fedakârlık çizelgesi ───────────────────────────────────────────── */

export interface ItachiEra {
  key: "anbu" | "massacre" | "akatsuki" | "final" | "edo";
  imageKey: string;
  glyph: EyeGlyph;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: LocalizedText;
}

export const ITACHI_TIMELINE: ItachiEra[] = [
  {
    key: "anbu",
    imageKey: ITACHI_IMAGE_KEYS.eraAnbu,
    glyph: "tomoe3",
    age: { tr: "7–13 yaş", en: "Age 7–13" },
    title: { tr: "Gölgenin Çocuğu — ANBU", en: "Child of the Shadows — ANBU" },
    text: {
      tr: "Akademiyi yedi yaşında birincilikle bitirdi; sekizinde Sharingan'ı uyandırdı, onunda Chūnin oldu. On birinde ANBU'ya girdi, on üçünde yüzbaşıydı. Köyü gölgeden koruyan kusursuz asker — ve savaşın tanıklığıyla erken büyüyen bir çocuk.",
      en: "Top of his Academy class at seven; Sharingan at eight, Chūnin at ten. He entered the ANBU at eleven and captained a squad at thirteen. The perfect soldier guarding the village from the shadows — and a child grown old too early by war.",
    },
  },
  {
    key: "massacre",
    imageKey: ITACHI_IMAGE_KEYS.eraMassacre,
    glyph: "mangekyoItachi",
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Uchiha Katliamı", en: "The Uchiha Massacre" },
    text: {
      tr: "Shisui'nin ölümü Mangekyō'yu uyandırdı. Darbeyle iç savaşın eşiğine gelen köy için Itachi görevlerin en ağırını seçti: bir gecede kendi klanını sonlandırdı. Yalnızca kardeşini sağ bıraktı — ve suçu tek başına sırtlandı.",
      en: "Shisui's death awakened the Mangekyō. With the village on the edge of civil war, Itachi chose the heaviest of duties: in a single night he ended his own clan. He spared only his brother — and shouldered the crime alone.",
    },
    quote: {
      tr: "Beni affet Sasuke... Bir dahaki sefere.",
      en: "Forgive me, Sasuke... there will be no next time.",
    },
  },
  {
    key: "akatsuki",
    imageKey: ITACHI_IMAGE_KEYS.eraAkatsuki,
    glyph: "mangekyoItachi",
    age: { tr: "13–21 yaş", en: "Age 13–21" },
    title: { tr: "Kızıl Bulutların Ardında", en: "Behind the Red Clouds" },
    text: {
      tr: "Katliamın gecesinde köyden bir hain olarak ayrıldı ve Akatsuki'ye katıldı: 朱 yüzüğünü taktı, Kisame'yle eşleşti. Gerçekteyse iki efendisi vardı — örgütün içinden Konoha'ya bilgi taşıyan bir casus olarak Sasuke için zaman kazandı.",
      en: "He left the village a traitor that same night and joined the Akatsuki: the 朱 ring, Kisame at his side. In truth he served two masters — a spy feeding Konoha from inside the organisation, buying time for Sasuke.",
    },
  },
  {
    key: "final",
    imageKey: ITACHI_IMAGE_KEYS.eraFinal,
    glyph: "mangekyoItachi",
    age: { tr: "21 yaş", en: "Age 21" },
    title: { tr: "Son Dövüş — Sasuke", en: "The Last Fight — Sasuke" },
    text: {
      tr: "Hastalıkla tükenmiş bedeniyle kardeşinin karşısına son kez çıktı. Amaterasu'yu, Tsukuyomi'yi, Susanoo'yu ardı ardına kullandı — kazanmak için değil, Sasuke'nin gözünde bir kahraman olarak ölmek için. Son hamlesi bir saldırı değil, alnına dokunan iki parmaktı.",
      en: "His body ruined by illness, he faced his brother one last time. Amaterasu, Tsukuyomi, Susanoo, one after another — not to win, but to die a villain so his brother could live a hero. His final move was not an attack, but two fingers touching Sasuke's forehead.",
    },
    quote: {
      tr: "Beni affet Sasuke... Bu son.",
      en: "Forgive me, Sasuke... this is the last time.",
    },
  },
  {
    key: "edo",
    imageKey: ITACHI_IMAGE_KEYS.eraEdo,
    glyph: "eternal",
    age: { tr: "Savaş — Edo Tensei", en: "The War — Edo Tensei" },
    title: { tr: "Şafağa Dönüş", en: "Return at Dawn" },
    text: {
      tr: "Kabuto'nun dirilttiği beden, Izanami ile zincirini kırdı ve Edo Tensei'yi kendi eliyle sonlandırdı. Sasuke'ye gerçeğin tamamını verdi; ardından ışığa ve kargalara karışarak veda etti — bu kez kendi seçimiyle.",
      en: "Raised by Kabuto, he broke his chains with Izanami and ended the Edo Tensei with his own hand. He gave Sasuke the whole truth, then dissolved into light and crows — this time by his own choice.",
    },
    quote: {
      tr: "Beni affetmek zorunda değilsin. Bundan sonra ne yaparsan yap — seni daima seveceğim.",
      en: "You don't ever have to forgive me. No matter what you do from here on out — I will love you forever.",
    },
  },
];

export const ITACHI_TIMELINE_TITLE = {
  title: { tr: "Fedakârlık Çizelgesi", en: "The Sacrifice Timeline" },
  lede: {
    tr: "Bir hainin değil, iki kez ölen bir kahramanın kronolojisi.",
    en: "Not a traitor's record — the chronology of a hero who died twice.",
  },
} as const;

export const ITACHI_JUTSU_TITLE = {
  title: { tr: "Jutsu Laboratuvarı", en: "Jutsu Laboratory" },
  lede: {
    tr: "Üç göz tekniği, iki efsanevi silah, tek bir irade.",
    en: "Three ocular arts, two legendary arms, a single will.",
  },
} as const;

export const ITACHI_EYES_TITLE = {
  title: { tr: "Gözler", en: "The Eyes" },
  lede: {
    tr: "Klanın mirası, Itachi'nin yükü. Gözü uyandır — gerisi kendini anlatır.",
    en: "The clan's inheritance, Itachi's burden. Awaken the eye — it tells the rest itself.",
  },
} as const;

/** Kapanış sözleri — miras şeridi. */
export const ITACHI_QUOTES: Array<{ text: LocalizedText; note?: LocalizedText }> = [
  {
    text: {
      tr: "İnsanlar doğru ve gerçek saydıkları şeylere tutunarak yaşar — gerçeklik dedikleri budur.",
      en: "People live their lives bound by what they accept as correct and true — that is how they define reality.",
    },
  },
  {
    text: {
      tr: "Uchiha klanının onurunu ben taşıyacağım.",
      en: "I will protect the honor of the Uchiha clan.",
    },
    note: { tr: "うちは一族の名誉は、私が守る", en: "うちは一族の名誉は、私が守る" },
  },
];

/** Küratör yuva etiketleri (admin arayüzü — iki dilli). */
export const ITACHI_SLOT_LABELS: Record<string, LocalizedText> = {
  [ITACHI_IMAGE_KEYS.hero]: {
    tr: "Hero sahnesi (16:9 — karanlık yüz + ay)",
    en: "Hero scene (16:9 — face in darkness + moon)",
  },
  [ITACHI_IMAGE_KEYS.heroMobile]: {
    tr: "Hero sahnesi — dikey (9:16)",
    en: "Hero scene — vertical (9:16)",
  },
  [ITACHI_IMAGE_KEYS.tsukuyomi]: { tr: "Tsukuyomi kartı", en: "Tsukuyomi card" },
  [ITACHI_IMAGE_KEYS.amaterasu]: { tr: "Amaterasu kartı", en: "Amaterasu card" },
  [ITACHI_IMAGE_KEYS.susanoo]: { tr: "Susanoo kartı", en: "Susanoo card" },
  [ITACHI_IMAGE_KEYS.eraAnbu]: { tr: "Dönem — ANBU", en: "Era — ANBU" },
  [ITACHI_IMAGE_KEYS.eraMassacre]: { tr: "Dönem — Katliam", en: "Era — Massacre" },
  [ITACHI_IMAGE_KEYS.eraAkatsuki]: { tr: "Dönem — Akatsuki", en: "Era — Akatsuki" },
  [ITACHI_IMAGE_KEYS.eraFinal]: { tr: "Dönem — Son Dövüş", en: "Era — Last Fight" },
  [ITACHI_IMAGE_KEYS.eraEdo]: { tr: "Dönem — Edo Tensei", en: "Era — Edo Tensei" },
  [ITACHI_IMAGE_KEYS.userItachi]: { tr: "Kullanıcı — Itachi", en: "User — Itachi" },
  [ITACHI_IMAGE_KEYS.userSasuke]: { tr: "Kullanıcı — Sasuke", en: "User — Sasuke" },
  [ITACHI_IMAGE_KEYS.userMadara]: { tr: "Kullanıcı — Madara", en: "User — Madara" },
  [ITACHI_IMAGE_KEYS.userShisui]: { tr: "Kullanıcı — Shisui", en: "User — Shisui" },
};
