import type { LocalizedText } from "./types";

/**
 * Ochako Uraraka — "Zero Gravity" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 89221 kaydının ABILITY
 * yuvaları, `urk:*` anahtarlarıyla.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (27 Aralık), boy (156 cm / 5'1"), kan grubu (B), yaş kaydı
 * ("15-"), Quirk adı (Zero Gravity), sınıfı (U.A. Lisesi 1-A) ve takma adı
 * (Uravity / ウラビティ) arşivin kendi kopyasından birebir alındı:
 * `public/assets/anime/karakterler/ochako-uraraka/kaynak.json`
 * (AniList #89221, 31 Ağustos 2026). Quirk'ün işleyişi — beş parmak ucu
 * pedinin katı bir cisme değmesi, cismin ağırlığını kaybetmesi, parmak
 * uçlarının birleştirilmesiyle iptal — aynı künyenin `aciklama` alanında
 * yazılı; sayfa o cümlenin ötesine geçmiyor.
 *
 * ⚠️ DOĞUM YILI KAYITTA YOK (`dogum.year: null`). Yaştan bir yıl
 * TÜRETİLMEDİ ve kader çizelgesine takvim yılı YAZILMADI. Çizelgenin son
 * iki durağı "15–16 yaş" aralığıyla yazıldı; bunun tek gerekçesi künyedeki
 * doğum gününün (27 Aralık) Japon okul yılının ORTASINA düşmesi, yani
 * birinci sınıf devam ederken yaşın bir artması. Aralığın dışında bir sayı
 * uydurulmadı.
 *
 * ⚠️ KAHRAMAN SIRALAMASI KAYITTA YOK. Uraraka bu sayfanın kapsadığı
 * dönemde öğrenci; resmî bir sıralaması yok ve arşiv olmayan bir sıra
 * yazmıyor — künye satırı BOŞ bırakıldı, uydurulmadı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içine alınan Japonca TEK bir söz var:
 *   「リリース！」 — Quirk'ünü iptal ederken söylediği kelime.
 * Bu, belirli bir sahneye değil gücün kendi kullanım sözüne bağlı olduğu
 * için doğrulanabilir. Kahraman olma sebebi (ailesinin inşaat işi, para)
 * sayfada REPLİK olarak değil AKTARIM olarak duruyor ve öyle etiketlendi:
 * arşiv, kelimesi kelimesine doğrulayamadığı bir cümleyi tırnağa almıyor
 * (Eren sayfasındaki aynı kural).
 *
 * ── TERMİNOLOJİ (My Hero Academia evreni, uydurma yok) ───────────────────
 * 個性 (Kosei — Quirk), 無重力 (Mujūryoku — Zero Gravity, Quirk'ün adı),
 * リリース (Release — iptal sözü), ウラビティ (Uravity — Hero Adı),
 * 雄英高校 (Yūei Kōkō — U.A. Lisesi; serinin resmî okul adı, künyedeki
 * "U.A. High School" ile aynı kurum), "Ultimate Move" (Home Run Comet),
 * "Provisional Hero License" (geçici kahraman ehliyeti).
 * "Jutsu" / "teknik" bu evrenin dili DEĞİL — sayfada hiç geçmiyor.
 *
 * ⚠️ Katakana yalnızca künyede yazılı olanlar (ウラビティ) ve ödünç
 * kelime olduğu için tartışmasız olan リリース için kullanıldı. Ultimate
 * Move'un ve dövüş stilinin adları LATİN harfle yazıldı; transliterasyonu
 * doğrulanamayan bir kana dizisi sayfaya girmedi.
 */

export const URK_ID = 89221;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const URK_SITE_URL = "https://anilist.co/character/89221";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink YOK, dosya repoda).
 * Ölçüsü `kaynak.json`'dan: 230×345 — yani KÜÇÜK. Sayfada madalyon
 * boyunda, havada asılı duran bir kadrajda kullanılıyor; büyük kare
 * `urk:hero` yuvasında bekliyor.
 */
export const URK_PORTRAIT = {
  src: "/assets/anime/karakterler/ochako-uraraka/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sahne görselleri — hepsi characterId 89221 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `urk:` önekli (küratör modu şartı).
 */
export const URK_IMAGE_KEYS = {
  hero: "urk:hero",
  quirk: "urk:mujuryoku",
  ultimate: "urk:home-run-comet",
  release: "urk:release",
  gunhead: "urk:gunhead",
  nausea: "urk:bulanti",
  uravity: "urk:uravity",
  license: "urk:ehliyet",
  field: "urk:alan",
  fateExam: "urk:fate-sinav",
  fateFestival: "urk:fate-festival",
  fateGunhead: "urk:fate-staj",
  fateLicense: "urk:fate-ehliyet",
  fateRyukyu: "urk:fate-ryukyu",
  classroom: "urk:sinif",
  closing: "urk:closing",
} as const;

/** Portre yuvası ABILITY değil PORTRAIT — yüklenen kare 230×345'i EZER. */
export const URK_PORTRAIT_SLOT_KEY = "PORTRAIT";

/**
 * Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur.
 *
 * ⚠️ Bu metinler YALNIZCA küratör dalında çiziliyor (isAdmin). Ziyaretçi
 * boş bir kadraj görürse o kadraj YAZISIZ olmalı — Dalga 1 denetiminde
 * Levi sayfasında üretim metadatası ziyaretçiye sızmıştı.
 */
export const URK_SLOT_LABELS: Record<string, LocalizedText> = {
  [URK_PORTRAIT_SLOT_KEY]: {
    tr: "Portre — dikey kare; yüklenen görsel AniList'in 230×345'ini ezer (2:3, webp)",
    en: "Portrait — a vertical frame; an upload overrides AniList's 230×345 (2:3, webp)",
  },
  [URK_IMAGE_KEYS.hero]: {
    tr: "Hero — yatay kare: havada, ayakları yerden kesik bir figür (16:9, webp)",
    en: "Hero — a horizontal plate: a figure in the air, feet off the ground (16:9, webp)",
  },
  [URK_IMAGE_KEYS.quirk]: {
    tr: "Zero Gravity — beş parmak ucunun bir cisme değdiği an, yakın çekim (4:3)",
    en: "Zero Gravity — the moment five fingertips touch an object, close crop (4:3)",
  },
  [URK_IMAGE_KEYS.ultimate]: {
    tr: "Home Run Comet — havada asılı enkazın tek noktaya inişi (4:3)",
    en: "Home Run Comet — suspended debris coming down on one point (4:3)",
  },
  [URK_IMAGE_KEYS.release]: {
    tr: "Release — parmak uçlarının birleştiği an, ağırlığın geri geldiği kare (4:3)",
    en: "Release — fingertips pressed together, the frame where weight returns (4:3)",
  },
  [URK_IMAGE_KEYS.gunhead]: {
    tr: "Yakın dövüş — kavrama ve savurma; kare detay (1:1)",
    en: "Close quarters — a grip and a throw; square detail (1:1)",
  },
  [URK_IMAGE_KEYS.nausea]: {
    tr: "Bulantı — bedelin göründüğü an; kare detay (1:1)",
    en: "Nausea — the moment the cost shows; square detail (1:1)",
  },
  [URK_IMAGE_KEYS.uravity]: {
    tr: "Uravity — kahraman kostümü, yuvarlak başlık; kare detay (1:1)",
    en: "Uravity — the hero costume, the round headgear; square detail (1:1)",
  },
  [URK_IMAGE_KEYS.license]: {
    tr: "Geçici ehliyet — kart ya da sınav alanı; kare detay (1:1)",
    en: "Provisional licence — the card or the exam ground; square detail (1:1)",
  },
  [URK_IMAGE_KEYS.field]: {
    tr: "Alan — havada asılı duran cisimlerle dolu çok geniş kadraj (21:9)",
    en: "The field — an ultra-wide crop full of suspended objects (21:9)",
  },
  [URK_IMAGE_KEYS.fateExam]: {
    tr: "Giriş sınavı — düşen bir figürü havada tutan el (16:9)",
    en: "The entrance exam — a hand holding a falling figure in the air (16:9)",
  },
  [URK_IMAGE_KEYS.fateFestival]: {
    tr: "Spor Festivali — stadyum zemini, havaya kalkmış moloz (16:9)",
    en: "The Sports Festival — the stadium floor, rubble lifted into the air (16:9)",
  },
  [URK_IMAGE_KEYS.fateGunhead]: {
    tr: "Staj — dövüş salonu, kavrama çalışması (16:9)",
    en: "The internship — a training hall, grip practice (16:9)",
  },
  [URK_IMAGE_KEYS.fateLicense]: {
    tr: "Ehliyet sınavı — kalabalık aday alanı (16:9)",
    en: "The licence exam — a crowded field of candidates (16:9)",
  },
  [URK_IMAGE_KEYS.fateRyukyu]: {
    tr: "İş-eğitimi — ajans sahası, gerçek görev (16:9)",
    en: "The work-study — an agency site, a real operation (16:9)",
  },
  [URK_IMAGE_KEYS.classroom]: {
    tr: "Sınıf — 1-A kadrosu, geniş şerit (2:1)",
    en: "The class — the 1-A roster, wide strip (2:1)",
  },
  [URK_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş gökyüzü ya da yere inen bir figür; düşük kontrast (2:1)",
    en: "Closing — an empty sky or a figure touching down; low contrast (2:1)",
  },
};

/** Küratör özetindeki "beklenen kare" satırları (yalnızca küratör görür). */
export const URK_SLOT_SPECS: Record<string, LocalizedText> = {
  [URK_PORTRAIT_SLOT_KEY]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [URK_IMAGE_KEYS.hero]: {
    tr: "yatay hero karesi · 1920×1080 · webp",
    en: "horizontal hero plate · 1920×1080 · webp",
  },
  [URK_IMAGE_KEYS.quirk]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [URK_IMAGE_KEYS.ultimate]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [URK_IMAGE_KEYS.release]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [URK_IMAGE_KEYS.gunhead]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [URK_IMAGE_KEYS.nausea]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [URK_IMAGE_KEYS.uravity]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [URK_IMAGE_KEYS.license]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [URK_IMAGE_KEYS.field]: {
    tr: "çok geniş sahne · 2100×900 · webp",
    en: "ultra-wide scene · 2100×900 · webp",
  },
  [URK_IMAGE_KEYS.fateExam]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [URK_IMAGE_KEYS.fateFestival]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [URK_IMAGE_KEYS.fateGunhead]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [URK_IMAGE_KEYS.fateLicense]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [URK_IMAGE_KEYS.fateRyukyu]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [URK_IMAGE_KEYS.classroom]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
  [URK_IMAGE_KEYS.closing]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const URK_IDENTITY = {
  name: "Ochako Uraraka",
  nativeName: "麗日お茶子",
  heroName: "Uravity",
  heroNameNative: "ウラビティ",
  /** Filigranın kanji yarısı — dekoratif (aria-hidden): 無重力 = yerçekimsizlik */
  watermark: "無重力",
  house: {
    tr: "雄英高校 · 1-A sınıfı · Hero Adı: Uravity",
    en: "雄英高校 (U.A. High School) · Class 1-A · Hero Name: Uravity",
  },
  epigraph: {
    tr: "Gücü bir şeyi havaya kaldırmak değil. Gücü, dokunduğu her şeyin ağırlığını üstlenmek — ve o ağırlığı ne zaman bırakacağına karar vermek.",
    en: "Her power is not lifting a thing into the air. Her power is taking on the weight of everything she touches — and deciding when to let it go.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "27 Aralık", en: "27 December" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "156 cm (5'1\")", en: "156 cm (5'1\")" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Künyedeki yaş", en: "Age in the record" },
      value: { tr: "15-", en: "15-" },
    },
    {
      label: { tr: "Quirk (個性)", en: "Quirk (個性)" },
      value: {
        tr: "Zero Gravity — 無重力",
        en: "Zero Gravity — 無重力",
      },
    },
    {
      label: { tr: "Hero Adı", en: "Hero Name" },
      value: { tr: "Uravity — ウラビティ", en: "Uravity — ウラビティ" },
    },
    {
      label: { tr: "Okul ve sınıf", en: "School and class" },
      value: {
        tr: "雄英高校 (U.A. Lisesi) · 1-A",
        en: "雄英高校 (U.A. High School) · Class 1-A",
      },
    },
    {
      label: { tr: "Kahraman Sıralaması", en: "Hero Ranking" },
      value: { tr: "künyede yok", en: "not in the record" },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "beş parmak ucu pedi",
        en: "the five fingertip pads",
      },
    },
    {
      label: { tr: "Ailesi", en: "Family" },
      value: {
        tr: "küçük bir inşaat işletmesi",
        en: "a small construction business",
      },
    },
  ],
} as const;

export const URK_RECORD_NOTE: LocalizedText = {
  tr: "Künyede doğum YILI ve Kahraman Sıralaması boş. Yaştan bir yıl türetilmedi; kader çizelgesi takvim değil YAŞ kullanıyor ve son iki durakta aralık yazıyor — çünkü künyedeki doğum günü (27 Aralık) okul yılının ortasına düşüyor, yani birinci sınıf sürerken yaş bir artıyor.",
  en: "Birth YEAR and Hero Ranking are blank in the record. No year has been derived from the age; the fate chart runs on AGE, not the calendar, and the last two stops carry a range — the recorded birthday (27 December) falls in the middle of the school year, so the age ticks over while the first year is still running.",
};

export const URK_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
  portraitUploaded: {
    tr: "Ochako Uraraka — arşivin yüklediği portre",
    en: "Ochako Uraraka — portrait uploaded by the archive",
  },
  portraitLocal: {
    tr: "Ochako Uraraka — AniList resmî portresi (depodaki kopya, 230×345)",
    en: "Ochako Uraraka — official AniList portrait (repository copy, 230×345)",
  },
} as const;

export const URK_CRUMB = {
  series: { tr: "My Hero Academia", en: "My Hero Academia" },
} as const;

/* ── Mod düğmesi: Zero Gravity ──────────────────────────────────────────── */

/**
 * Düğme sayfanın RENGİNİ değil YAPISINI çeviriyor (Faz 2 §Ayrışma, eksen 5).
 * `data-gravity="off"` VARSAYILAN: kartlar farklı yüksekliklerde asılı ve
 * salınıyor. `data-gravity="on"`: aynı kartlar yer çizgisine iniyor, üst
 * üste biniyor, boşluklar kapanıyor ve başlık ölçeği bir kademe küçülüyor.
 *
 * ⚠️ Serbest yüzen kart alanı İKİ durumda da duruyor — düğme onu açıp
 * kapatmıyor, DERECESİNİ değiştiriyor (Dalga 1 dersi: Onizuka'da kilitli
 * ızgara varsayılan durumda yoktu ve sayfa düz bir yığına düşüyordu).
 */
export const URK_GRAVITY_TEXT = {
  label: { tr: "Zero Gravity · 無重力", en: "Zero Gravity · 無重力" },
  toOn: { tr: "Ağırlığı geri ver", en: "Give the weight back" },
  toOff: { tr: "Ağırlığı al", en: "Take the weight away" },
  stateOff: { tr: "無重力 — ağırlık alınmış", en: "無重力 — weight taken" },
  stateOn: { tr: "重力 — ağırlık yerinde", en: "重力 — weight in place" },
  hintOff: {
    tr: "Kartların hiçbiri hizada değil: her biri kendi yüksekliğinde asılı ve kendi fazında salınıyor. Yer çizgisi kesik — dokunan yok.",
    en: "None of the cards are aligned: each hangs at its own height and sways in its own phase. The ground line is dashed — nothing is touching it.",
  },
  hintOn: {
    tr: "Aynı kartlar yer çizgisine indi, üst üste bindi ve aralarındaki boşluk kapandı; başlık ölçeği de bir kademe küçüldü. Ağırlık yalnızca bir renk değil, bir DÜZEN.",
    en: "The same cards have come down to the ground line, overlapped, and the space between them has closed; the display scale has dropped a step too. Weight is not a colour but an ARRANGEMENT.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const URK_HERO = {
  lede: {
    tr: "Ochako Uraraka'nın Quirk'ü bir saldırı gücü değil, bir TERS ÇEVİRME: beş parmak ucundaki pedler katı bir cisme değdiğinde o cisim ağırlığını kaybediyor. Yani sayfadaki her şey ya yüzüyor ya düşüyor, arası yok. Üstteki düğme bu sayfanın tamamını o iki hâl arasında çeviriyor; aşağıdaki alanda ise gerçek karar sende: bir kere bıraktığın şey, bıraktığın sıraya göre değil, ağırlığına göre yere iniyor.",
    en: "Ochako Uraraka's Quirk is not an attacking power but an INVERSION: when the pads on her five fingertips touch a solid object, that object loses its weight. So everything on this page is either floating or falling, with nothing in between. The button above turns the whole page between those two states; in the field below the real decision is yours — what you let go of lands not in the order you dropped it, but in the order of its weight.",
  },
  heroFrameCaption: {
    tr: "Büyük hero karesi küratör yuvası olarak bekliyor. Yüklenene kadar kadraj boş ama ayakta duruyor — havada duran her şey gibi.",
    en: "The large hero plate waits as a curator slot. Until one is uploaded the frame stays empty but standing — like everything else in the air.",
  },
  groundCaption: {
    tr: "Her bölümün altında aynı yer çizgisi var ve kartların hiçbiri ona değmiyor. Değdikleri tek an, düğmeyi çevirdiğin an.",
    en: "The same ground line runs under every section and not one card touches it. The only moment they do is the moment you turn the button.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const URK_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları boş bırakıldı.",
      en: "Verbatim from the AniList record; blanks left blank.",
    },
  },
  quirk: {
    title: { tr: "Quirk laboratuvarı", en: "The Quirk lab" },
    lede: {
      tr: "Üç büyük kart gücün kendisini anlatıyor: dokunuş, Ultimate Move ve iptal. Dördü küçük kart ise gücün etrafındaki şeyler — bir dövüş stili, bir bedel, bir ad ve bir belge.",
      en: "Three large cards describe the power itself: the touch, the Ultimate Move and the cancel. Four small cards hold what sits around it — a fighting style, a cost, a name and a document.",
    },
  },
  field: {
    title: { tr: "Beş ped", en: "Five pads" },
    lede: {
      tr: "Sayfanın kalbi. Beş kart havada asılı; her biri onun kaldırdığı bir şey. «Release» dediğinde beşi birden ivmelenerek düşüyor ve yerde BAŞKA bir sırayla diziliyor: kaldırma sırası değil, bedel sırası.",
      en: "The heart of the page. Five cards hang in the air; each is something she lifts. Say “Release” and all five accelerate down and land in a DIFFERENT order: not the order she lifted them, but the order of what they cost.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Yaşla ilerliyor, takvimle değil: künyede doğum yılı yok ve arşiv olmayan bir sayıyı yazmıyor.",
      en: "It runs on age, not the calendar: the record has no birth year and the archive does not write a number it does not have.",
    },
  },
  bonds: {
    title: { tr: "Aynı sınıf", en: "The same class" },
    lede: {
      tr: "1-A'nın içinden dört kişi ve dışından bir kişi. Beşi de onun ağırlık fikrini bir yerinden çekiştiriyor.",
      en: "Four people from inside Class 1-A and one from outside. All five pull at her idea of weight from some direction.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Bir kelime ve bir aktarım. Biri kaynağıyla doğrulanabiliyor, diğeri doğrulanamadığı için tırnağa alınmadı.",
      en: "One word and one report. The first can be verified against a source; the second is not put in quotation marks because it cannot.",
    },
  },
} as const;

/* ── Quirk laboratuvarı: üç büyük kart ──────────────────────────────────── */

export interface UrarakaPower {
  key: string;
  /** Çeviri gerektirmeyen özel ad */
  name: string;
  /** Japonca yazımı — yalnızca doğrulanabilir olanlar (bkz. dosya başı) */
  native?: string;
  term: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const URK_POWERS: UrarakaPower[] = [
  {
    key: "zero-gravity",
    name: "Zero Gravity",
    native: "無重力",
    term: { tr: "Quirk (個性)", en: "Quirk (個性)" },
    tagline: {
      tr: "Beş parmak ucu değdi mi, ağırlık gider.",
      en: "Five fingertips touch it, and the weight is gone.",
    },
    text: {
      tr: "Künyenin kendi cümlesiyle: parmak uçlarındaki pedler katı bir cisme değdiğinde cisim yerçekimsel çekimini kaybediyor ve ağırlıksız kalıyor. Dikkat edilecek yer şu — güç bir itme ya da çekme değil, bir İPTAL. Ochako hiçbir şeyi havaya fırlatmıyor; yalnızca yere basma sebebini alıyor ve kalanı fizik yapıyor. Bu yüzden Zero Gravity kavga gücü olarak zayıf, kurtarma gücü olarak sınıfının en güçlülerinden biri: bir enkazın altındaki insana ulaşmak için enkazı kırmak gerekmiyor, kaldırmak yetiyor.",
      en: "In the record's own words: when the pads on her fingertips touch a solid object, the object loses its gravitational pull and is left weightless. Note what that means — the power is not a push or a pull but a CANCELLATION. Ochako throws nothing into the air; she only removes the reason it presses down, and physics does the rest. That is why Zero Gravity is a weak power in a fight and one of the strongest rescue powers in her class: to reach the person under the rubble you do not have to break the rubble, only lift it.",
    },
    traits: [
      { tr: "Beş parmak ucu pedi", en: "Five fingertip pads" },
      { tr: "Yalnızca katı cisimler", en: "Solid objects only" },
      { tr: "İtme değil, iptal", en: "A cancellation, not a push" },
    ],
    imageKey: URK_IMAGE_KEYS.quirk,
  },
  {
    key: "home-run-comet",
    name: "Home Run Comet",
    term: { tr: "Ultimate Move", en: "Ultimate Move" },
    tagline: {
      tr: "Bütün alanı kaldır, sonra tek noktaya bırak.",
      en: "Lift the whole field, then drop it on one point.",
    },
    text: {
      tr: "Uraraka'nın Ultimate Move'u gücün mantığını sonuna kadar götürüyor: etraftaki her şeyi tek tek ağırlıksız hâle getir, hepsini yukarıda tut, sonra hepsini AYNI ANDA bırak. Vuruşu yapan Ochako değil, biriktirilmiş yerçekimi. Adı da tam olarak bunu söylüyor — havadaki her şey aynı anda inince ortaya bir kuyruklu yıldız yağmuru çıkıyor. Sayfadaki mekaniğin fikri buradan geliyor: bu sayfada da bırakma anı tek ve toplu.",
      en: "Uraraka's Ultimate Move takes the logic of the power all the way: make everything around you weightless one piece at a time, hold it all up there, then let it ALL go at once. The blow is not struck by Ochako but by accumulated gravity. The name says exactly that — when everything in the air comes down together, what you get is a shower of comets. The mechanic on this page comes from here: the moment of release is single and collective.",
    },
    traits: [
      { tr: "Toplu bırakma", en: "A collective release" },
      { tr: "Vuran: yerçekimi", en: "The one who strikes: gravity" },
      { tr: "Hazırlık, darbeden uzun", en: "The setup outlasts the blow" },
    ],
    imageKey: URK_IMAGE_KEYS.ultimate,
  },
  {
    key: "release",
    name: "Release",
    native: "リリース",
    term: { tr: "İptal sözü", en: "The cancel word" },
    tagline: {
      tr: "Parmak uçları birleşir, ağırlık geri gelir.",
      en: "The fingertips meet, and the weight comes back.",
    },
    text: {
      tr: "Künyeye göre Ochako etkiyi parmaklarını birbirine kapatarak başlatıp iptal edebiliyor ve elleriyle sürekli dikkatli davranıyor, çünkü kazara bir dokunuş gücü çalıştırıyor. Sayfanın kalbindeki düğmenin adı da bu: 「リリース！」. Karakterin en çok yanlış anlaşılan tarafı burada — asıl beceri kaldırmak değil, bırakacağı ANI seçmek. Bir şeyi havada tutmak yorucu; bırakmak ise geri alınamaz.",
      en: "According to the record Ochako can start and cancel the effect by closing her fingers together, and she is constantly careful with her hands because an accidental touch activates the Quirk. That is the name of the button at the heart of this page: 「リリース！」. Here is the most misread part of the character — the real skill is not the lifting but choosing the MOMENT of release. Holding a thing up is exhausting; letting it go cannot be undone.",
    },
    traits: [
      { tr: "Parmakları kapatarak", en: "By closing the fingers" },
      { tr: "Elleri sürekli tedbirli", en: "Her hands stay guarded" },
      { tr: "Geri alınamaz", en: "It cannot be undone" },
    ],
    imageKey: URK_IMAGE_KEYS.release,
  },
];

/* ── Quirk laboratuvarı: dört küçük kart ────────────────────────────────── */

export interface UrarakaTrait {
  key: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const URK_TRAITS: UrarakaTrait[] = [
  {
    key: "gunhead",
    name: {
      tr: "Gunhead yakın dövüşü",
      en: "Gunhead close-quarters combat",
    },
    note: {
      tr: "Stajını, adı silah çağrıştırdığı hâlde yakın dövüş uzmanı olan kahraman Gunhead'in yanında yaptı ve oradan bir kavrama-savurma repertuvarıyla döndü. Sonuç sandığından büyük oldu: Zero Gravity'nin şartı DOKUNMAK ve dokunmayı garantileyen şey tam olarak yakın dövüş. Gücünü değil, gücüne ulaşma yolunu geliştirdi.",
      en: "She took her internship with Gunhead — a hero whose name suggests firearms but who specialises in close combat — and came back with a repertoire of grips and throws. The result mattered more than it looked: Zero Gravity requires TOUCH, and close-quarters fighting is exactly what guarantees touch. She did not upgrade the power; she upgraded the route to it.",
    },
    imageKey: URK_IMAGE_KEYS.gunhead,
  },
  {
    key: "nausea",
    name: { tr: "Bulantı", en: "Nausea" },
    note: {
      tr: "Gücün bedeli acı değil, mide. Ağırlıksız tuttuğu kütle büyüdükçe ve süre uzadıkça bulantı artıyor; sınırı aştığında Quirk kendiliğinden dağılıyor. Sayfadaki alan bu yüzden üçüncü kaldırışta uyarı veriyor — kaldırmak ücretsiz değil.",
      en: "The cost of the power is not pain but the stomach. The more mass she holds weightless and the longer she holds it, the worse the nausea; past her limit the Quirk breaks on its own. That is why the field on this page warns you on the third lift — lifting is not free.",
    },
    imageKey: URK_IMAGE_KEYS.nausea,
  },
  {
    key: "uravity",
    name: { tr: "Hero Adı: Uravity", en: "Hero Name: Uravity" },
    note: {
      tr: "ウラビティ — soyadının başı ile «gravity» kelimesinin birleşimi. Ad seçimi bu evrende küçük bir tören: öğrenci kendi adını kendisi koyuyor ve o ad, mesleğe hangi yüzle gireceğinin ilk beyanı oluyor. Ochako'nunki gücünü doğrudan söyleyen, süssüz bir ad.",
      en: "ウラビティ — the front of her surname joined to the word “gravity”. Choosing the name is a small ceremony in this world: the student names herself, and that name is the first statement of the face she will bring to the job. Ochako's says her power outright, with no ornament.",
    },
    imageKey: URK_IMAGE_KEYS.uravity,
  },
  {
    key: "license",
    name: {
      tr: "Geçici kahraman ehliyeti",
      en: "Provisional Hero Licence",
    },
    note: {
      tr: "Bu evrende Quirk'ünü halkın içinde kullanmak izne bağlı; öğrenciler geçici ehliyet sınavına giriyor ve geçenler gerçek sahaya çıkabiliyor. Uraraka geçti. Kahraman Sıralaması'nda ise adı yok — o sıralama profesyonellerin, o hâlâ öğrenci; künye de bu yüzden boş.",
      en: "In this world using your Quirk in public requires permission; students sit a provisional licence exam and those who pass may go out onto real ground. Uraraka passed. She has no place in the Hero Ranking, though — that ranking belongs to professionals and she is still a student, which is why the record leaves it blank.",
    },
    imageKey: URK_IMAGE_KEYS.license,
  },
];

/* ── Sayfanın kalbi: beş ped ────────────────────────────────────────────── */

/**
 * Beş kart, iki okuma sırası.
 *
 * `floatOrder` — havadayken görünen sıra: gücün ölçeği küçükten büyüğe
 *                (bir insan → bir alan → kendisi → bir enkaz → bir yük).
 * `fallOrder`  — düştüklerinde dizildikleri sıra: BEDELE göre, ağırdan
 *                hafife. İki sıra bilerek örtüşmüyor; mekaniğin bütün
 *                anlamı "kaldırdığın sıra ile ödediğin sıra aynı değil"
 *                cümlesinde.
 *
 * `lifted` havadayken, `cost` düştükten sonra okunuyor: aynı kart iki
 * durumda İKİ AYRI metin veriyor.
 *
 * ⚠️ Beşincisi (ailenin yükü) tek MECAZİ kart ve metninde açıkça öyle
 * yazıyor — arşiv mecazı gerçek bir Quirk kullanımı gibi göstermiyor.
 */
export interface UrarakaLift {
  key: string;
  floatOrder: number;
  fallOrder: number;
  /** Ekranda okunan sıra numarası — dilden bağımsız */
  numeral: string;
  fallNumeral: string;
  title: LocalizedText;
  /** Havadayken okunan metin */
  lifted: LocalizedText;
  /** Düştükten sonra okunan metin */
  cost: LocalizedText;
  /** Kısa ağırlık etiketi (düşmüş dizilimde rozet) */
  weight: LocalizedText;
  span: "wide" | "mid" | "narrow";
  drift: 1 | 2 | 3 | 4 | 5;
}

export const URK_LIFTS: UrarakaLift[] = [
  {
    key: "person",
    floatOrder: 1,
    fallOrder: 5,
    numeral: "01",
    fallNumeral: "05",
    title: { tr: "Bir insan", en: "A person" },
    lifted: {
      tr: "U.A. giriş sınavında, düşen bir aday tam yere çarpacakken ona dokundu ve ağırlığını aldı. Sınavda tanımadığı biriydi; kaldırma kararını hiç düşünmeden verdi. Gücün en saf hâli bu: bir eli uzatmak, gerisini fiziğe bırakmak.",
      en: "At the U.A. entrance exam, with a falling candidate about to hit the ground, she touched him and took his weight away. He was a stranger to her at the exam; she made the decision to lift without a pause. This is the purest form of the power: put out a hand, leave the rest to physics.",
    },
    cost: {
      tr: "Bedeli en hafif olan. Sınavdan sonra kendi puanlarının bir kısmını o adaya vermeyi teklif etti — kaybettiği tek şey kendi hanesindeki sayıydı.",
      en: "The lightest cost of the five. After the exam she offered to hand part of her own points to that candidate — the only thing she lost was a number in her own column.",
    },
    weight: { tr: "en hafif", en: "lightest" },
    span: "mid",
    drift: 3,
  },
  {
    key: "field",
    floatOrder: 2,
    fallOrder: 3,
    numeral: "02",
    fallNumeral: "03",
    title: { tr: "Bir alanın tamamı", en: "An entire field" },
    lifted: {
      tr: "Spor Festivali'nin birebir turunda, dövüşürken zeminin molozunu fark ettirmeden tek tek ağırlıksız hâle getirdi ve hepsini yukarıda tuttu. Rakibi Katsuki Bakugō'ydu ve plan tam olarak Ultimate Move'unun fikriydi: hepsini aynı anda bırakmak.",
      en: "In the one-on-one round of the Sports Festival she quietly made the arena's loose rubble weightless, piece by piece, while fighting, and held it all overhead. Her opponent was Katsuki Bakugō, and the plan was exactly the idea behind her Ultimate Move: let it all go at once.",
    },
    cost: {
      tr: "Yağmur tek bir patlamayla dağıldı ve Ochako ayakta kalamadı. Turu kaybetti — ama bütün stadyum o güne kadar «tatlı kız» diye bakılan birinin nasıl dövüştüğünü ilk kez orada gördü.",
      en: "The shower was scattered by a single explosion and Ochako could not stay on her feet. She lost the round — but that was the first time the whole stadium saw how someone they had written off as “the sweet girl” actually fights.",
    },
    weight: { tr: "ağır", en: "heavy" },
    span: "wide",
    drift: 1,
  },
  {
    key: "self",
    floatOrder: 3,
    fallOrder: 2,
    numeral: "03",
    fallNumeral: "02",
    title: { tr: "Kendisi", en: "Herself" },
    lifted: {
      tr: "Quirk'ü kendi bedenine de işliyor: kendine dokunduğunda ağırlığını kaybediyor ve zeminden kesiliyor. Bu, gücünün en özgür görünen kullanımı — ve sınırı en çabuk gösteren kullanım.",
      en: "The Quirk works on her own body too: touch herself and she loses her weight and comes off the ground. It is the freest-looking use of the power — and the one that shows its limit soonest.",
    },
    cost: {
      tr: "Kendi ağırlığını taşımak bulantıyı en hızlı getiren yük. Bu yüzden havada kalmak onun için bir üstünlük değil, sayılı saniyelik bir borç.",
      en: "Carrying her own weight is the load that brings the nausea on fastest. Staying in the air is not an advantage for her but a debt measured in seconds.",
    },
    weight: { tr: "çok ağır", en: "very heavy" },
    span: "narrow",
    drift: 5,
  },
  {
    key: "rubble",
    floatOrder: 4,
    fallOrder: 4,
    numeral: "04",
    fallNumeral: "04",
    title: { tr: "Bir enkazın altındakiler", en: "Whoever is under the rubble" },
    lifted: {
      tr: "İş-eğitimini ejderha kahraman Ryukyu'nun ajansında, sınıf arkadaşı Tsuyu Asui ile birlikte yaptı ve orada gerçek bir operasyonun içine girdi. Zero Gravity bu alanda eşsiz: kurtarma için kırmak gerekmiyor, kaldırmak yetiyor.",
      en: "She did her work-study at the agency of the Dragon Hero Ryukyu together with her classmate Tsuyu Asui, and there she walked into a real operation. Zero Gravity is unmatched on that ground: rescue does not require breaking anything, only lifting it.",
    },
    cost: {
      tr: "Gerçek sahada karşısına çıkan şey enkaz değil bir insandı: kendisine takıntılı, kanla beslenen bir düşman. Kaldırma gücü orada işe yaramıyor — ve Ochako bunu ilk kez orada öğrendi.",
      en: "What she met on real ground was not rubble but a person: an enemy fixated on her, feeding on blood. A lifting power is no use there — and that is where Ochako learned it first.",
    },
    weight: { tr: "ağır", en: "heavy" },
    span: "mid",
    drift: 2,
  },
  {
    key: "burden",
    floatOrder: 5,
    fallOrder: 1,
    numeral: "05",
    fallNumeral: "01",
    title: { tr: "Bir ailenin yükü", en: "A family's burden" },
    lifted: {
      tr: "Beşincisi tek MECAZİ kart — arşiv bunu bir Quirk kullanımı gibi göstermiyor. Uraraka kahraman olmayı seçme sebebini kendisi anlatıyor: annesiyle babasının küçük inşaat işletmesi zor durumda ve o, kazandığı parayla ikisini rahat ettirmek istiyor. Kaldırmaya çalıştığı en büyük kütle bu.",
      en: "The fifth is the one FIGURATIVE card — the archive does not present it as a use of the Quirk. Uraraka states her own reason for choosing to be a hero: her parents' small construction business is struggling, and she wants to make life easy for both of them with what she earns. This is the largest mass she is trying to lift.",
    },
    cost: {
      tr: "Bu yüzden düşmüş dizilimde en başta duruyor. Bunu yüksek sesle söylemek ona ucuz gelmedi: kahramanlık bu evrende idealle anlatılan bir meslek ve o, sebebini para diye açıkladı. Diğer dört kart bir gün yere iniyor; bu inmiyor.",
      en: "That is why it sits first in the fallen order. Saying it out loud did not come cheap: heroism in this world is a profession people explain with ideals, and she explained hers with money. The other four cards land eventually; this one does not.",
    },
    weight: { tr: "en ağır", en: "heaviest" },
    span: "wide",
    drift: 4,
  },
];

export const URK_FIELD_UI = {
  release: { tr: "Release — hepsini bırak", en: "Release — let them all go" },
  lift: { tr: "Hepsini yeniden kaldır", en: "Lift them all again" },
  stageLabel: {
    tr: "Beş ped alanı — kartlar havada asılı ya da yere inmiş",
    en: "The five-pad field — cards suspended in the air or landed",
  },
  listLabel: { tr: "Beş ped", en: "The five pads" },
  stateFloating: {
    tr: "Beşi de havada. Okuma sırası kaldırma sırası: 01 → 05.",
    en: "All five are in the air. The reading order is the order she lifted them: 01 → 05.",
  },
  stateFallen: {
    tr: "Beşi de yerde. Okuma sırası değişti — artık bedel sırası: en ağır en üstte.",
    en: "All five have landed. The reading order has changed — it is the order of cost now: heaviest first.",
  },
  liftedLabel: { tr: "Kaldırdığı", en: "What she lifts" },
  costLabel: { tr: "Bedeli", en: "What it costs" },
  orderLabel: { tr: "Kaldırma sırası", en: "Lift order" },
  fallOrderLabel: { tr: "Bedel sırası", en: "Cost order" },
  weightLabel: { tr: "Ağırlık", en: "Weight" },
  selectHint: {
    tr: "Beş kartın hepsi sekmeyle geziliyor; bir karta basınca o kartın metni açılıyor ve metin sayfanın hâline göre değişiyor.",
    en: "All five cards are reachable by tab; pressing one opens its text, and the text changes with the state of the page.",
  },
  liftCountLabel: { tr: "Kaldırma sayısı", en: "Lifts" },
  nausea: {
    tr: "Yeter. Üçüncü kaldırış — künyedeki sınır tam olarak burada başlıyor ve bundan sonrası mide bulantısı. Bırakmak da bir karar.",
    en: "Enough. That is the third lift — this is exactly where the limit in the record begins, and past it comes the nausea. Letting go is a decision too.",
  },
  closingNote: {
    tr: "Mekanik bunun için var: bırakma anı tek, ama iniş sırası senin bıraktığın sıra değil. Kaldırdığın şeyi seçebiliyorsun, ödeyeceğin sırayı seçemiyorsun.",
    en: "That is what the mechanic is for: the moment of release is single, but the landing order is not the order you released. You can choose what you lift; you cannot choose the order in which you pay.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface UrarakaStop {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  imageKey: string;
  /** Yer çizgisinden yüksekliği: 5 en yüksek, 1 yere değiyor */
  altitude: 1 | 2 | 3 | 4 | 5;
}

export const URK_TIMELINE: UrarakaStop[] = [
  {
    key: "exam",
    age: { tr: "15 yaş", en: "age fifteen" },
    title: { tr: "Giriş sınavı", en: "The entrance exam" },
    text: {
      tr: "U.A.'nın giriş sınavında robotlarla dolu bir sahaya çıkıyor. Sınav puan üzerine kurulu ama Ochako'nun ilk refleksi puan toplamak değil, düşen birini tutmak oluyor; sonra da kendi puanlarının bir kısmını ona vermeyi teklif ediyor. Sayfanın bütün tezinin başlangıcı bu durak: gücü kaldırmakla ilgili, ama kararı hep bırakmakla ilgili.",
      en: "She walks onto a field full of robots at U.A.'s entrance exam. The exam runs on points, but Ochako's first reflex is not to collect them — it is to catch someone who is falling; afterwards she offers to hand part of her own points over to him. This stop is where the whole thesis of the page begins: her power is about lifting, but her decisions are always about letting go.",
    },
    imageKey: URK_IMAGE_KEYS.fateExam,
    altitude: 5,
  },
  {
    key: "festival",
    age: { tr: "15 yaş", en: "age fifteen" },
    title: {
      tr: "Spor Festivali: kaybedilen tur",
      en: "The Sports Festival: the round she lost",
    },
    text: {
      tr: "Birebir turun ilk maçında karşısına sınıfın en saldırgan Quirk'ü çıkıyor. Ochako yardım tekliflerini reddediyor ve tek başına giriyor: dövüşürken zeminin molozunu gizlice ağırlıksız hâle getiriyor, sonra hepsini birden bırakıyor. Yağmur tek bir patlamayla dağılıyor, tur kaybediliyor — ama o gün stadyumun ona bakışı değişiyor. Kaybettiği maç, tanındığı maç oluyor.",
      en: "In the first bout of the one-on-one round she draws the most aggressive Quirk in the class. Ochako turns down every offer of help and goes in alone: while fighting she quietly makes the arena's rubble weightless, then lets all of it go at once. The shower is scattered by a single explosion and the round is lost — but that day the stadium's view of her changes. The match she lost is the match that made her visible.",
    },
    quote: {
      text: "「リリース！」",
      reading: {
        tr: "«Release!» — havada tuttuğu her şeyi aynı anda bırakırken söylediği kelime.",
        en: "“Release!” — the word she says as she lets go of everything she is holding in the air, all at once.",
      },
      by: {
        tr: "Ochako Uraraka — Quirk'ünü iptal ederken söylediği söz (belirli bir sahneye değil, gücün kendi kullanımına bağlı)",
        en: "Ochako Uraraka — the word she says to cancel her Quirk (tied to the power's own use, not to one particular scene)",
      },
    },
    imageKey: URK_IMAGE_KEYS.fateFestival,
    altitude: 4,
  },
  {
    key: "gunhead",
    age: { tr: "15 yaş", en: "age fifteen" },
    title: { tr: "Staj: yumruk mesafesi", en: "The internship: punching range" },
    text: {
      tr: "Stajını yakın dövüş uzmanı Gunhead'in yanında yapıyor ve oradan bambaşka bir dövüş diliyle dönüyor. Sınıfın çoğu Quirk'ünü büyütmeye çalışırken Ochako Quirk'üne ULAŞMA yolunu çözüyor: Zero Gravity'nin şartı dokunmak, dokunmayı garantileyen şey ise mesafeyi kapatmak. Bu durak sayfadaki tek sessiz durak — ve karakterin en çok değiştiği yer.",
      en: "She interns with the close-combat specialist Gunhead and comes back with an entirely different fighting language. While most of the class tries to grow their Quirk, Ochako solves the problem of REACHING hers: Zero Gravity requires touch, and what guarantees touch is closing the distance. It is the quietest stop on this page — and the place the character changes most.",
    },
    imageKey: URK_IMAGE_KEYS.fateGunhead,
    altitude: 3,
  },
  {
    key: "license",
    age: { tr: "15–16 yaş", en: "age fifteen to sixteen" },
    title: { tr: "Geçici ehliyet", en: "The provisional licence" },
    text: {
      tr: "Quirk'ü halkın içinde kullanabilmek bu evrende izne bağlı; öğrenciler geçici kahraman ehliyeti sınavına giriyor. Uraraka geçiyor. Bu, sayfadaki ilk KAĞIT üstü eşik: o güne kadar yaptığı her şey okulun içindeydi, bundan sonrası sahanın içinde. Kahraman Sıralaması'na girmiyor — o liste profesyonellerin ve künyesi de bu yüzden boş.",
      en: "Using a Quirk in public requires permission in this world; students sit the provisional hero licence exam. Uraraka passes. This is the first threshold on this page written on PAPER: everything up to that day happened inside a school, everything after happens on real ground. She does not enter the Hero Ranking — that list belongs to professionals, and that is why her record leaves it blank.",
    },
    imageKey: URK_IMAGE_KEYS.fateLicense,
    altitude: 2,
  },
  {
    key: "ryukyu",
    age: { tr: "15–16 yaş", en: "age fifteen to sixteen" },
    title: {
      tr: "İş-eğitimi ve karşısındaki",
      en: "The work-study and the one across from her",
    },
    text: {
      tr: "İş-eğitimi için ejderha kahraman Ryukyu'nun ajansını seçiyor ve sınıf arkadaşı Tsuyu Asui ile birlikte gerçek bir operasyonun içine giriyor. Orada karşısına enkaz değil bir insan çıkıyor: Himiko Toga, ona takıntılı bir düşman. Kaldırma gücünün işe yaramadığı ilk yer burası — ve Uraraka bu duraktan sonra artık «kurtaran» değil, «karar veren» tarafta duruyor. Sayfanın yer çizgisine değen tek durak da bu.",
      en: "For her work-study she picks the agency of the Dragon Hero Ryukyu and walks into a real operation alongside her classmate Tsuyu Asui. What she meets there is not rubble but a person: Himiko Toga, an enemy fixated on her. It is the first place a lifting power is of no use — and after this stop Uraraka stands on the side that decides rather than the side that rescues. It is also the only stop on this page that touches the ground line.",
    },
    imageKey: URK_IMAGE_KEYS.fateRyukyu,
    altitude: 1,
  },
];

/* ── Aynı sınıf ─────────────────────────────────────────────────────────── */

/**
 * ⚠️ Buradaki her kimlik `EXPERIENCE_COMPANIONS[89221]` listesinde
 * DOĞRULANDI (31 Ağustos 2026): [89028, 88892, 89223, 125619, 89220].
 * Listede olmayan bir kimlik yazılırsa portresi girildiğinde bile kadraj
 * sonsuza kadar boş kalır (Dalga 1'de Armin sayfasında bu olmuştu).
 *
 * 89223 (Tsuyu Asui) ve 125619 (Himiko Toga) `isExperienceCharacter`
 * süzgecinden `false` dönüyor — kendi sayfaları yok, o yüzden bağ
 * verilmiyor, yalnızca ad yazılıyor (Dalga 2 şartı).
 */
export interface UrarakaBond {
  characterId: number;
  name: string;
  nativeName: string;
  role: LocalizedText;
  note: LocalizedText;
}

export const URK_BONDS: UrarakaBond[] = [
  {
    characterId: 89028,
    name: "Izuku Midoriya",
    nativeName: "緑谷出久",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    note: {
      tr: "İlk karşılaşmaları bir düşüş: Ochako onu okulun kapısında tökezlerken havada tutuyor, sonra sınavda aynısını bir kez daha yapıyor. Aralarındaki bağ bu yüzden simetrik değil — biri kaldırıyor, diğeri devraldığı gücün altında eziliyor. Sayfadaki tek çift yönlü ilişki bu.",
      en: "Their first meeting is a fall: Ochako catches him in mid-stumble at the school gate, then does the same thing again at the exam. That is why the bond is not symmetrical — one of them lifts, the other is crushed under a power he inherited. It is the only two-way relationship on this page.",
    },
  },
  {
    characterId: 88892,
    name: "Katsuki Bakugou",
    nativeName: "爆豪勝己",
    role: { tr: "Festivaldeki rakibi", en: "Her opponent at the Festival" },
    note: {
      tr: "Birebir turun ilk maçında karşısına çıkan kişi. Ochako'nun bütün planını tek patlamayla dağıtıyor — ama maçtan sonra onu küçümseyen seyirciye karşı çıkan da o oluyor. Bu sayfadaki «ağır» kavramının en net karşılığı: Uraraka'nın kaldıramadığı tek kütle.",
      en: "The person she draws in the first bout of the one-on-one round. He scatters her entire plan with a single explosion — yet he is also the one who pushes back against the crowd that belittles her afterwards. He is the clearest reading of the word “heavy” on this page: the one mass Uraraka could not lift.",
    },
  },
  {
    characterId: 89220,
    name: "Shouto Todoroki",
    nativeName: "轟焦凍",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    note: {
      tr: "Aynı sınıfın en uzağa düşen iki ucu: biri ailesinin ağırlığını taşımak için kahraman olmayı seçiyor, diğeri ailesinden kaçmak için. İkisinin de sebebi eve bakıyor ve ikisinin de yönü ters — 1-A'yı tek bir «kahraman olma sebebi» ile açıklamanın neden mümkün olmadığını en iyi bu ikisi gösteriyor.",
      en: "The two ends of the same class that fall furthest apart: one chooses to be a hero in order to carry the weight of her family, the other in order to get away from his. Both reasons point at a home and both point in opposite directions — no pair shows better why Class 1-A cannot be explained with a single “reason for becoming a hero”.",
    },
  },
  {
    characterId: 89223,
    name: "Tsuyu Asui",
    nativeName: "蛙吹梅雨",
    role: { tr: "En yakın arkadaşı", en: "Her closest friend" },
    note: {
      tr: "Künyenin adını verdiği yakın arkadaşlarından biri ve iş-eğitimini birlikte yaptığı kişi. Sayfada tek başına duran ad: kendi dosyası henüz açılmadı, o yüzden kadrajı boş, bağı yok.",
      en: "One of the close friends the record names, and the person she did her work-study with. A name that stands on its own here: her own file has not been opened yet, so the frame is empty and there is no link.",
    },
  },
  {
    characterId: 125619,
    name: "Himiko Toga",
    nativeName: "渡我被身子",
    role: { tr: "Karşısına çıkan", en: "The one who came against her" },
    note: {
      tr: "İş-eğitimi sırasındaki gerçek operasyonda karşısına çıkan düşman; Uraraka'ya takıntılı ve sevgi ile zarar arasındaki farkı hiç kurmamış biri. Kaldırma gücünün karşılığı olmayan tek şey — bu yüzden sayfanın en ağır kartı yerde en üstte duruyor.",
      en: "The enemy she meets in the real operation during her work-study; fixated on Uraraka, and someone who has never drawn a line between love and harm. The one thing a lifting power has no answer for — which is why the heaviest card on this page sits on top of the pile.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * İki satır, iki AYRI güven düzeyi — ve sayfa bunu okuyucuya söylüyor.
 *
 * `text` dolu olan satır tırnak içinde bir REPLİK: kaynağı gücün kendi
 * kullanım sözü, yani doğrulanabilir. `text` boş olan satır AKTARIM:
 * içeriği künyeden ve serinin bilinen olay örgüsünden geliyor, ama arşiv
 * kelimesi kelimesine bir cümleyi doğrulayamadığı için tırnağa almıyor.
 */
export const URK_CLOSING = {
  quotes: [
    {
      text: "「リリース！」",
      reading: {
        tr: "«Release!»",
        en: "“Release!”",
      },
      by: { tr: "Ochako Uraraka", en: "Ochako Uraraka" },
      kind: { tr: "replik", en: "quotation" },
      note: {
        tr: "Quirk'ünü iptal ederken söylediği kelime; künyedeki «parmakları birbirine kapatarak iptal edebiliyor» cümlesinin sesli hâli. Bu sayfanın bütün mekaniği tek bir kelimeden ibaret — çünkü karakterin de öyle: kaldırmak kolay, bırakmak karar.",
        en: "The word she says as she cancels her Quirk; the spoken form of the record's sentence that she “can cancel the effect by closing her fingers together”. The whole mechanic of this page is one word — because so is the character: lifting is easy, letting go is a decision.",
      },
    },
    {
      reading: {
        tr: "Kahraman olma sebebi para: annesiyle babasının küçük inşaat işletmesi zor durumda ve kazandığıyla ikisini rahat ettirmek istiyor.",
        en: "Her reason for becoming a hero is money: her parents' small construction business is struggling and she wants to make life easy for both of them with what she earns.",
      },
      by: { tr: "Ochako Uraraka", en: "Ochako Uraraka" },
      kind: { tr: "aktarım — tırnağa alınmadı", en: "reported — not quoted" },
      note: {
        tr: "Bu cümle sayfada tırnak içinde DEĞİL, çünkü arşiv kelimesi kelimesine bir replik doğrulayamıyor. İçeriği doğru ve karakterin en bilinen tarafı; yazımı ise aktarım. Kahramanlığın ideallerle anlatıldığı bir evrende sebebini para diye açıklamak, bu sayfadaki en ağır kartın neden yerde en üstte durduğunu da açıklıyor.",
        en: "This sentence is NOT in quotation marks on the page, because the archive cannot verify a line word for word. Its content is accurate and it is the best-known thing about the character; its wording is a report. In a world where heroism is explained with ideals, explaining yours with money is also why the heaviest card on this page sits on top of the pile.",
      },
    },
  ],
  motto: "無重力",
  mottoNote: {
    tr: "Mujūryoku — «yerçekimsizlik». Sayfanın filigranı da motto da aynı kelime ve bu bilinçli: burada her şey ya havada ya yerde, arası yok. Uraraka'nın hikâyesi güçlenme hikâyesi değil, bir AĞIRLIK hikâyesi — neyi kaldıracağını değil, ne zaman bırakacağını öğrenmesi.",
    en: "Mujūryoku — “zero gravity”. The page's watermark and its motto are the same word, deliberately: here everything is either in the air or on the ground, with nothing in between. Uraraka's story is not one of growing stronger but a story of WEIGHT — learning not what to lift, but when to let go.",
  },
  credit: {
    tr: "Künye, portre, doğum, boy, kan grubu ve Quirk bilgileri AniList'ten; portre dosyası depoya indirildi (hotlink yok). Sayfadaki bütün grafikler — beş parmak ucu pedi, yer çizgisi, düşüş izleri — elle çizilmiş SVG.",
    en: "Dossier, portrait, birth, height, blood type and Quirk data from AniList; the portrait file was downloaded into the repository (no hotlinking). Every graphic on this page — the five fingertip pads, the ground line, the fall traces — is hand-drawn SVG.",
  },
  creditLink: {
    tr: "AniList · Ochako Uraraka #89221",
    en: "AniList · Ochako Uraraka #89221",
  },
} as const;

/* ── Küratör boşluk özeti ───────────────────────────────────────────────── */

export const URK_GAPS = {
  title: {
    tr: "Ochako Uraraka — görsel yuvaları",
    en: "Ochako Uraraka — image slots",
  },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yuvalar dolu. Sayfada eksik kadraj kalmadı.",
    en: "Every slot is filled. No frame on this page is missing.",
  },
} as const;
