import type { LocalizedText } from "./types";

/**
 * Suguru Getō — "Tapınak ve İhanet" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * TAPINAK VE İHANET. Sayfa yukarıdan aşağı bir YOL ve her kilit anda ikiye
 * ayrılıyor. Seçilen dal devam ediyor, seçilmeyen dal yanda soluk bir kol
 * olarak duruyor — çünkü Getō'nun trajedisi tam olarak bu: iki yol da
 * gerçekten önündeydi ve ikisi de yazılıydı.
 *
 * ── ⚠️ İKİ SESLİ SAYFA (`GetoVoice`) ─────────────────────────────────────
 * "Maymun" düğmesi sayfanın BİÇİMİNİ değil DİLİNİ çeviriyor. Yani sayfadaki
 * anlatı metinlerinin İKİ versiyonu var ve her versiyonun İKİ dili:
 *
 *     GetoVoice = { plain: {tr,en}, monkey: {tr,en} }
 *
 * Dört dize. Dalga 1'in üçüncü dersi ("tek dilli dize kaçmasın") bu sayfada
 * en riskli yerde duruyor: bir versiyonun İngilizcesini unutmak, İngilizce
 * sayfada düğmeye basıldığında Türkçe metin çıkarır. Bu yüzden `plain` ve
 * `monkey` AYNI tipte ve ikisi de `LocalizedText`.
 *
 * `monkey` versiyonu KARAKTERİN sesi, arşivin sesi değil. Arşivin cevabı
 * (`GETO_MONKEY.rejection`) her iki modda da sayfada duruyor ve modla
 * birlikte değişmiyor — bilerek.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (3 Şubat 1990), yaş (27), boy (183 cm), tür (insan), meslek
 * ("Curse User"), derece ("Special Grade Curse User") ve teknik satırı
 * ("Cursed Spirit Manipulation") AniList künyesinden birebir alındı
 * (karakter 133699). Depodaki çekimin kopyası:
 * `public/assets/anime/karakterler/suguru-getou/kaynak.json`.
 * Kan grubu kayıtta BOŞ ve boş bırakıldı.
 *
 * ── ⚠️ BRİEFTEN ÜÇ DÜZELTME (kanon denetimi, Dalga 5 dersi 5) ────────────
 * Görev metni üç yerde yanlış karşılık veriyordu; üçü de burada düzeltildi
 * ve sebebi yazıldı:
 *
 *  1. 極ノ番「うずまき」 → briefte "Uzayan Karanlık". Değil. `うずまき`
 *     GİRDAP demek; teknik yutulmuş bütün lanetleri tek bir kütlede
 *     eritiyor. Sayfada "Uç Sıra — «Girdap»" yazıyor.
 *  2. 星漿体 → briefte "Yıldız Vebası". Değil. `星漿体` YILDIZ KABI
 *     (Star Plasma Vessel) — Riko Amanai'nin taşıdığı sıfat. "Veba"
 *     kelimesi kayıtta hiç geçmiyor.
 *  3. 領域展開 (Alan Genişletmesi) briefin terim listesinde var, ama
 *     Getō'nun KENDİ alan genişletmesi kayıtlı DEĞİL. Kartı sayfada
 *     duruyor ve tam olarak bunu söylüyor: o yüzü taşıyan alan Getō'nun
 *     değil, ölümünden sonra bedenini ele geçirenin.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Tırnak içine yalnızca kaynağı kesin olan iki metin alındı:
 *   「猿」                — büyücü olmayanlar için kullandığı sözcük
 *   「極ノ番『うずまき』」  — en güçlü tekniğinin sesli çağrısı
 * Kader çizelgesindeki diğer özgün satırlar DİYALOG DEĞİL, doğrulanmış
 * TERİMLER; sayfada `kind: "record"` ile işaretli ve okuyucuya bu ayrım
 * yazılı olarak söyleniyor (Dalga 3'ün birinci bilinçli sapması).
 *
 * ── TERMİNOLOJİ (yalnızca Jujutsu Kaisen sözlüğü) ────────────────────────
 * 呪術 (jujutsu) · 呪力 (juryoku, lanet enerjisi) · 呪霊 (jurei, lanet ruhu) ·
 * 呪霊操術 (jurei sōjutsu, lanet ruhu manipülasyonu) · 呪詛師 (jusoshi,
 * lanet kullanıcısı) · 特級 (tokkyū, özel sınıf) · 領域展開 (ryōiki tenkai,
 * alan genişletmesi) · 極ノ番「うずまき」 (kyoku no ban, uç sıra) ·
 * 星漿体 (seishōtai, Yıldız Kabı) · 高専 (kōsen, jujutsu lisesi).
 * Bleach ya da Naruto terimi YOK.
 */

export const GETO_ID = 133699;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const GETO_SITE_URL = "https://anilist.co/character/133699";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir madalyon kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const GETO_PORTRAIT = {
  src: "/assets/anime/karakterler/suguru-getou/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * İki sesli metin. `plain` arşivin anlatımı, `monkey` karakterin sözcüğü.
 * İkisi de `LocalizedText` — yani dört dize (bkz. dosya başı).
 */
export interface GetoVoice {
  plain: LocalizedText;
  monkey: LocalizedText;
}

/** İstemci adasına inen hâl: dil çoktan seçilmiş, geriye iki düz dize kalır. */
export interface GetoVoicePair {
  plain: string;
  monkey: string;
}

/**
 * Sergi görselleri — hepsi characterId 133699 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `get:` önekli (küratör modu şartı).
 *
 * ⚠️ Anahtarlar eski (emekliye ayrılmış) sayfayla BİLEREK örtüşüyor:
 * `get:sojutsu`, `get:uzumaki`, `get:jusoshi` ve beş `get:fate-*` aynı
 * karakterin aynı kaydına gidiyor. Küratör bunlardan birini geçmişte
 * yüklediyse yeni sayfa onu kendiliğinden çiziyor. Anlamı değişen hiçbir
 * anahtar geri kullanılmadı.
 */
export const GETO_IMAGE_KEYS = {
  hero: "get:hero",
  artSojutsu: "get:sojutsu",
  artUzumaki: "get:uzumaki",
  artJusoshi: "get:jusoshi",
  markJujutsu: "get:jujutsu",
  markSwallow: "get:nomi",
  markDomain: "get:ryoiki",
  markEnergy: "get:juryoku",
  fork: "get:fork",
  fateSchool: "get:fate-school",
  fateVessel: "get:fate-riko",
  fateCrack: "get:fate-crack",
  fateNight: "get:fate-village",
  fateAfter: "get:fate-after",
  closing: "get:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const GETO_SLOT_LABELS: Record<string, LocalizedText> = {
  [GETO_IMAGE_KEYS.hero]: {
    tr: "Hero — kesa giyimli Getō, tam boy, dikey kadraj (3:4)",
    en: "Hero — Getō in the kesa, full figure, vertical frame (3:4)",
  },
  [GETO_IMAGE_KEYS.artSojutsu]: {
    tr: "呪霊操術 — çevresinde duran lanet ruhları (16:9)",
    en: "呪霊操術 — the cursed spirits standing around him (16:9)",
  },
  [GETO_IMAGE_KEYS.artUzumaki]: {
    tr: "極ノ番「うずまき」 — avuçta dönen tek kütle (16:9)",
    en: "極ノ番「うずまき」 — the single mass turning in his palm (16:9)",
  },
  [GETO_IMAGE_KEYS.artJusoshi]: {
    tr: "特級呪詛師 — okuldan sonraki hâli, tapınak avlusu (16:9)",
    en: "特級呪詛師 — what he became after the school, a temple courtyard (16:9)",
  },
  [GETO_IMAGE_KEYS.markJujutsu]: {
    tr: "呪術 — okul yılları, üniforma (3:2)",
    en: "呪術 — the school years, the uniform (3:2)",
  },
  [GETO_IMAGE_KEYS.markSwallow]: {
    tr: "Lanet ruhu yutma — küre ve el, yakın çekim (3:2)",
    en: "Swallowing a cursed spirit — the sphere and the hand, close crop (3:2)",
  },
  [GETO_IMAGE_KEYS.markDomain]: {
    tr: "領域展開 — o yüzü taşıyan alan, geniş plan (3:2)",
    en: "領域展開 — the domain that wore that face, wide shot (3:2)",
  },
  [GETO_IMAGE_KEYS.markEnergy]: {
    tr: "呪力 — akan lanet enerjisinin izleri (3:2)",
    en: "呪力 — the trails of flowing cursed energy (3:2)",
  },
  [GETO_IMAGE_KEYS.fork]: {
    tr: "Yol ayrımı — iki yöne ayrılan bir tapınak yolu (16:9)",
    en: "The fork — a temple path splitting in two directions (16:9)",
  },
  [GETO_IMAGE_KEYS.fateSchool]: {
    tr: "Okul — üniformalı iki öğrenci, koridor (3:2)",
    en: "The school — two students in uniform, a corridor (3:2)",
  },
  [GETO_IMAGE_KEYS.fateVessel]: {
    tr: "Görevin sonu — salon, alkışlayan kalabalık (3:2)",
    en: "The end of the mission — a hall, an applauding crowd (3:2)",
  },
  [GETO_IMAGE_KEYS.fateCrack]: {
    tr: "Çatlak — tek başına, gece, yağmur (3:2)",
    en: "The crack — alone, at night, in rain (3:2)",
  },
  [GETO_IMAGE_KEYS.fateNight]: {
    tr: "O gece — boş sokak, sabaha karşı, sis (3:2)",
    en: "That night — an empty street before dawn, fog (3:2)",
  },
  [GETO_IMAGE_KEYS.fateAfter]: {
    tr: "Sonrası — tapınak avlusu, müritler (3:2)",
    en: "Afterwards — a temple courtyard, followers (3:2)",
  },
  [GETO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir tapınak koridoru, düşük kontrast (21:9)",
    en: "Closing — an empty temple corridor, low contrast (21:9)",
  },
};

/**
 * Beklenen kare — küratörün ölçü defteri.
 *
 * ⚠️ ZİYARETÇİYE GÖSTERİLMİYOR (Dalga 1'in birinci dersi). Bu metinler
 * yalnızca `isAdmin` iken çiziliyor; sıradan ziyaretçi boş kadrajı
 * YAZISIZ görüyor.
 */
export const GETO_SLOT_SPECS: Record<string, LocalizedText> = {
  [GETO_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [GETO_IMAGE_KEYS.artSojutsu]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GETO_IMAGE_KEYS.artUzumaki]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GETO_IMAGE_KEYS.artJusoshi]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GETO_IMAGE_KEYS.markJujutsu]: {
    tr: "orta kadraj · 900×600 · webp",
    en: "medium frame · 900×600 · webp",
  },
  [GETO_IMAGE_KEYS.markSwallow]: {
    tr: "orta kadraj · 900×600 · webp",
    en: "medium frame · 900×600 · webp",
  },
  [GETO_IMAGE_KEYS.markDomain]: {
    tr: "orta kadraj · 900×600 · webp",
    en: "medium frame · 900×600 · webp",
  },
  [GETO_IMAGE_KEYS.markEnergy]: {
    tr: "orta kadraj · 900×600 · webp",
    en: "medium frame · 900×600 · webp",
  },
  [GETO_IMAGE_KEYS.fork]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GETO_IMAGE_KEYS.fateSchool]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GETO_IMAGE_KEYS.fateVessel]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GETO_IMAGE_KEYS.fateCrack]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GETO_IMAGE_KEYS.fateNight]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GETO_IMAGE_KEYS.fateAfter]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GETO_IMAGE_KEYS.closing]: {
    tr: "şerit kadraj · 1800×760 · webp",
    en: "band frame · 1800×760 · webp",
  },
};

/** `CuratorSlot`in `size` propu — yükleyici oranı kendisi yazıyor. */
export const GETO_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [GETO_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [GETO_IMAGE_KEYS.artSojutsu]: { w: 1600, h: 900 },
  [GETO_IMAGE_KEYS.artUzumaki]: { w: 1600, h: 900 },
  [GETO_IMAGE_KEYS.artJusoshi]: { w: 1600, h: 900 },
  [GETO_IMAGE_KEYS.markJujutsu]: { w: 900, h: 600 },
  [GETO_IMAGE_KEYS.markSwallow]: { w: 900, h: 600 },
  [GETO_IMAGE_KEYS.markDomain]: { w: 900, h: 600 },
  [GETO_IMAGE_KEYS.markEnergy]: { w: 900, h: 600 },
  [GETO_IMAGE_KEYS.fork]: { w: 1600, h: 900 },
  [GETO_IMAGE_KEYS.fateSchool]: { w: 1200, h: 800 },
  [GETO_IMAGE_KEYS.fateVessel]: { w: 1200, h: 800 },
  [GETO_IMAGE_KEYS.fateCrack]: { w: 1200, h: 800 },
  [GETO_IMAGE_KEYS.fateNight]: { w: 1200, h: 800 },
  [GETO_IMAGE_KEYS.fateAfter]: { w: 1200, h: 800 },
  [GETO_IMAGE_KEYS.closing]: { w: 1800, h: 760 },
};

/** Boş kadrajın YÖNETİCİYE görünen etiketi. Ziyaretçi bunu görmüyor. */
export const GETO_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** Portre yuvasının etiketi (ABILITY değil, PORTRAIT). */
export const GETO_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, omuz üstü ya da tam boy, 1200×1600'e kadar",
  en: "Portrait — vertical, bust or full figure, up to 1200×1600",
};

export const GETO_CRUMB = {
  series: {
    tr: "Jujutsu Kaisen · 呪詛師",
    en: "Jujutsu Kaisen · 呪詛師",
  },
} as const;

export const GETO_ALT = {
  scenePrefix: {
    tr: "Küratörün yüklediği kare —",
    en: "Frame uploaded by the curator —",
  },
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const GETO_IDENTITY = {
  name: "Suguru Getō",
  nativeName: "夏油傑",
  /** Hero filigranının yazısı — dekoratif (aria-hidden) */
  watermark: "呪霊操術",
  house: {
    tr: "Tokyo Jujutsu Lisesi'nden atıldı · 特級呪詛師",
    en: "Expelled from Tokyo Jujutsu High · 特級呪詛師",
  },
  /**
   * Hero'nun tek cümlesi. İki sesli DEĞİL: bu cümle sayfanın kendi tezi ve
   * modla birlikte değişmemeli — yoksa arşivin sesi de karakterin sesine
   * dönüşürdü.
   */
  epigraph: {
    tr: "Aynı adam iki yol ayrımında. Bu sayfa hangisinin doğru olduğunu değil, ikisinin de gerçekten önünde durduğunu anlatıyor.",
    en: "The same man at two forks. This page does not argue which was right; it shows that both were genuinely in front of him.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Born" },
      value: { tr: "3 Şubat 1990", en: "3 February 1990" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "27", en: "27" } },
    { label: { tr: "Boy", en: "Height" }, value: { tr: "183 cm", en: "183 cm" } },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "Kayıtta yok", en: "Not recorded" },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Özel sınıf lanet kullanıcısı · 特級呪詛師",
        en: "Special grade curse user · 特級呪詛師",
      },
    },
    {
      label: { tr: "Bağlı olduğu yer", en: "Affiliation" },
      value: {
        tr: "Tokyo Jujutsu Lisesi (atıldı) · sonrasında kendi cemaati",
        en: "Tokyo Jujutsu High (expelled) · afterwards his own congregation",
      },
    },
    {
      label: { tr: "Lanetli teknik", en: "Cursed technique" },
      value: {
        tr: "Lanet Ruhu Manipülasyonu · 呪霊操術",
        en: "Cursed Spirit Manipulation · 呪霊操術",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Rahip cübbesini andıran kesa (袈裟)",
        en: "The priest-like kesa robe (袈裟)",
      },
    },
  ],
} as const;

export const GETO_MISSING_NOTE: LocalizedText = {
  tr: "Kan grubu künyede boş ve boş bırakıldı. Unvan satırı da bilerek düzeltilmedi: kayıt onu «büyücü» değil «lanet kullanıcısı» diye tanımlıyor, yani okuldan atıldıktan SONRAKİ hâliyle. Sayfa bu tanımı olduğu gibi taşıyor. Bütün sayılar AniList kaydından (#133699) ve depodaki kaynak.json kopyasından.",
  en: "Blood type is blank in the record and left blank. The title line was deliberately left uncorrected: the record calls him a “curse user”, not a “sorcerer” — that is, it defines him by what he became AFTER the expulsion. The page carries that definition as it stands. Every figure comes from the AniList record (#133699) and the kaynak.json copy kept in this repository.",
};

/* ── 2 · Mod düğmesi: "Maymun" ──────────────────────────────────────────── */

/**
 * Düğmenin metinleri.
 *
 * ⚠️ HASSAS İÇERİK. Bu mod Getō'nun insanları aşağılayan dilini sayfaya
 * geçiriyor. Üç koruma birden var ve üçü de kaldırılamaz:
 *   1. `frame` — modun ne yaptığını söyleyen görünür çerçeve cümlesi
 *   2. `rejection` — arşivin cevabı; İKİ MODDA DA sayfada, değişmiyor
 *   3. mod varsayılan olarak KAPALI ve düğmeyle geri alınabilir
 */
export const GETO_MONKEY = {
  title: { tr: "Maymun", en: "Monkey" },
  native: "猿",
  enter: { tr: "Onun sözcüğüne geç", en: "Switch to his word" },
  exit: { tr: "Arşivin diline dön", en: "Back to the archive's language" },
  frame: {
    tr: "Bu düğme sayfanın biçimini değil DİLİNİ çeviriyor. Açıkken anlatı metinleri Getō'nun kendi sözcüğünü kullanıyor: büyücü olmayan herkes için «maymun». Bu KARAKTERİN bakışı, arşivin değil. Düğmeye yeniden basınca sayfa arşivin diline döner.",
    en: "This button changes the page's LANGUAGE, not its shape. While it is on, the narrative text uses Getō's own word for everyone without a technique: “monkey”. This is the CHARACTER's view, not the archive's. Press again and the page returns to the archive's language.",
  },
  hintOff: {
    tr: "Sayfa şu an arşivin dilinde. Koruduğu insanlardan «insan» diye söz ediliyor.",
    en: "The page is currently in the archive's language. The people he protected are called people.",
  },
  hintOn: {
    tr: "Sayfa şu an Getō'nun dilinde ve palet soğudu. Aynı olaylar, aynı sıra, tek fark sözcük.",
    en: "The page is currently in Getō's language and the palette has cooled. The same events, the same order; the word is the only difference.",
  },
  rejection: {
    tr: "Arşivin cevabı iki modda da aynı: insanları insanlıktan çıkarmak bir soruyu cevaplamaz, yalnızca öldürmeyi kolaylaştırır. Getō'nun sorusu haklıydı — bu sözcük, cevabının çöktüğü yerdir.",
    en: "The archive's answer is the same in both modes: stripping people of their humanity answers no question, it only makes killing them easier. Getō's question was fair — this word is where his answer collapsed.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const GETO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları doldurulmadı.",
      en: "Verbatim from the AniList record; blanks left blank.",
    },
  },
  arts: {
    title: { tr: "Üç sütun", en: "Three pillars" },
    lede: {
      tr: "Bir teknik, onun en uç hâli ve seçtiği sınıflandırma. Üçü de Jujutsu Kaisen'in kendi sözlüğünden.",
      en: "A technique, its furthest extent, and the classification he chose. All three from Jujutsu Kaisen's own vocabulary.",
    },
  },
  marks: {
    title: { tr: "Dört terim", en: "Four terms" },
    lede: {
      tr: "Evrenin dört sözcüğü ve Getō'nun her biriyle kurduğu ilişki. Dördüncüsü bir eksikliği anlatıyor.",
      en: "Four words from this universe and Getō's relation to each. The fourth describes an absence.",
    },
  },
  path: {
    title: { tr: "İhanet çizelgesi", en: "The betrayal ledger" },
    lede: {
      tr: "Beş durak, beş yol ayrımı. Her durakta ya KALIYORSUN ya GİDİYORSUN; seçtiğin dal yolu sürdürüyor, seçmediğin yanda soluk bir kol olarak duruyor. Seçimini istediğin kadar değiştirebilirsin — iki sonuç da yazılı, çünkü ikisi de gerçekten mümkündü.",
      en: "Five stops, five forks. At each one you either STAY or LEAVE; the branch you pick carries the road on, the one you refuse stays beside it as a pale arm. You can change any choice as often as you like — both endings are written, because both were genuinely possible.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Arşivde dosyası olan adlar bağlantılı; olmayanlar düz yazılıyor. Portre yok — gerekçesi bileşenin başında.",
      en: "Names with a file in this archive are linked; the rest are plain text. No portraits — the reason is written at the top of the component.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki metin, bir motto ve künye. Tırnak içindekilerin ikisi de kaynağı kesin.",
      en: "Two texts, a motto and the credit. Both quoted lines are firmly sourced.",
    },
  },
} as const;

/**
 * YOLUN SEÇİLMEYEN KOLLARI — ızgaranın kendisi.
 *
 * Sayfa yukarıdan aşağı bir yol ve her bölüm o yolun bir düğümü. Her
 * düğümde yol ikiye ayrılıyor: gövde sütunu seçilen dalı sürdürüyor, yandaki
 * dar sütun ise seçilmeyen kolu SOLUK ama okunur tutuyor.
 *
 * ⚠️ Bu kollar `data-monkey` KAPALIYKEN de var (Dalga 1'in ikinci dersi:
 * kilitli ızgara varsayılanda da bulunmalı). Mod düğmesi bu sütunun
 * varlığını değil, sayfadaki sözcükleri değiştiriyor.
 */
export const GETO_NODE_GHOSTS: Record<string, LocalizedText> = {
  identity: {
    tr: "Kayıt onu «lanet kullanıcısı» diye yazar. Aynı kayıt on yıl önce «öğrenci» yazıyordu — düzeltilen tek şey satır, adam değil.",
    en: "The record calls him a “curse user”. Ten years earlier the same record said “student” — the only thing corrected was the line, not the man.",
  },
  arts: {
    tr: "Aynı teknik bir koruma aracı olarak da çalışıyordu. Kolun bu ucunda 呪霊操術 bir envanter değil, bir hizmet kaydı olurdu.",
    en: "The same technique also worked as a means of protection. On this arm 呪霊操術 would have been a service record, not an inventory.",
  },
  marks: {
    tr: "Dört terimin dördü de bu kolda aynı kalır; değişen tek şey, onları kimin adına kullandığıdır.",
    en: "All four terms stay the same on this arm; the only change is on whose behalf they are used.",
  },
  path: {
    tr: "Bu düğümde yol gerçekten ikiye ayrılıyor ve karar okuyucunun. Aşağıdaki beş durakta seçtiğin dal yolu sürdürüyor, öbürü burada duruyor.",
    en: "At this node the road genuinely forks and the decision is the reader's. In the five stops below, the branch you take carries the road on; the other one stays here.",
  },
  bonds: {
    tr: "Bağların hiçbiri kopmadı — hepsi taraf değiştirdi. Aynı adlar iki kolda da var, yalnızca hangi tarafta durdukları farklı.",
    en: "None of these bonds broke — they all changed sides. The same names appear on both arms; only which side they stand on differs.",
  },
  closing: {
    tr: "Yolun sonunda iki metin kalıyor: bir sözcük ve bir çağrı. İkisi de aynı adamın ağzından, aralarında on yıl var.",
    en: "Two texts are left at the end of the road: a word and an invocation. Both from the same mouth, ten years apart.",
  },
};

export const GETO_ROAD_UI = {
  ghostBadge: { tr: "seçilmeyen kol", en: "the arm not taken" },
  spineLabel: { tr: "yol", en: "road" },
} as const;

export const GETO_HERO = {
  lede: {
    plain: {
      tr: "Getō bir laneti yok etmiyor, sıkıştırıp yutuyor ve o andan sonra onu istediği zaman çağırabiliyor. Ama sayfanın konusu bu teknik değil: konusu, koruduğu insanlara bakarken bir gün «bu iş neye yarıyor» diye soran ve sorusunu cevaplarken yolun yanlış kolunu seçen bir adam.",
      en: "Getō does not destroy a curse; he compresses it, swallows it, and can call it up whenever he likes from then on. But this page is not about that technique. It is about a man who looked at the people he protected, asked one day what the work was even for, and answered his own question by taking the wrong arm of the road.",
    },
    monkey: {
      tr: "Getō bir laneti yok etmiyor, sıkıştırıp yutuyor ve o andan sonra onu istediği zaman çağırabiliyor. Ama sayfanın konusu bu teknik değil: konusu, koruduğu maymunlara bakarken bir gün «bu iş neye yarıyor» diye soran ve sorusunu cevaplarken yolun yanlış kolunu seçen bir adam.",
      en: "Getō does not destroy a curse; he compresses it, swallows it, and can call it up whenever he likes from then on. But this page is not about that technique. It is about a man who looked at the monkeys he protected, asked one day what the work was even for, and answered his own question by taking the wrong arm of the road.",
    },
  },
  portraitAlt: {
    tr: "Suguru Getō — AniList resmî künye portresi (#133699), depodaki kopya",
    en: "Suguru Getō — official AniList dossier portrait (#133699), copy kept in this repository",
  },
  portraitAltUploaded: {
    tr: "Suguru Getō — arşivin küratör modundan yüklediği portre",
    en: "Suguru Getō — portrait uploaded through the archive's curator mode",
  },
  gateNote: {
    tr: "Bu büyük kadraj bilerek boş: depodaki resmî portre 230×345 ve bir kapı ölçüsünü taşımıyor. Yerine elle çizilmiş bir torii duruyor.",
    en: "This large frame is intentionally empty: the official portrait in the repository is 230×345 and cannot carry a gate-sized crop. A hand-drawn torii stands in its place.",
  },
  /**
   * Kadrajın üstündeki tek etiket.
   *
   * ⚠️ 鳥居 (torii) yazıyor, 山門 (sanmon) DEĞİL: sayfadaki elle çizilmiş
   * kapı iki direk + iki kirişten oluşan bir torii ve iki sözcük aynı
   * şeyi anlatmıyor. Etiketin çizimle uyuşması gerekiyordu.
   */
  gateLabel: {
    tr: "鳥居 · kapı",
    en: "鳥居 · the gate",
  },
} as const;

/* ── 4a · Üç sütun ──────────────────────────────────────────────────────── */

export interface GetoArt {
  key: string;
  name: string;
  kanji: string;
  reading: string;
  turkish: LocalizedText;
  tagline: GetoVoice;
  text: GetoVoice;
  traits: LocalizedText[];
  imageKey: string;
}

export const GETO_ARTS: GetoArt[] = [
  {
    key: "sojutsu",
    name: "Jurei Sōjutsu",
    kanji: "呪霊操術",
    reading: "じゅれいそうじゅつ",
    turkish: {
      tr: "Lanet Ruhu Manipülasyonu",
      en: "Cursed Spirit Manipulation",
    },
    tagline: {
      plain: {
        tr: "Yenilen lanet ruhu yok olmuyor, taraf değiştiriyor.",
        en: "A beaten cursed spirit is not destroyed; it changes sides.",
      },
      monkey: {
        tr: "Maymunların korkusundan doğan şey, yenildiğinde taraf değiştiriyor.",
        en: "What the monkeys' fear gives birth to changes sides once it is beaten.",
      },
    },
    text: {
      plain: {
        tr: "Yenilmiş bir lanet ruhu (呪霊) küçük bir küreye sıkışıyor ve yutulduğu anda kullanıcının emrine giriyor. Tekniğin gücü tek bir dövüşte değil ZAMANDA birikiyor: on yıl çalışan bir kullanıcı on yıllık bir kadroya sahip oluyor. Getō'nun elindeki şey bir hamle değil, bir envanter — ve o envanterin her kalemi bir zamanlar insanların korkusundan doğmuştu.",
        en: "A defeated cursed spirit (呪霊) compresses into a small sphere and, the instant it is swallowed, enters the user's service. The technique's power accumulates not in a single fight but over TIME: a user who works for ten years owns ten years of roster. What Getō holds is not a move but an inventory — and every item in it was once born of people's fear.",
      },
      monkey: {
        tr: "Yenilmiş bir lanet ruhu (呪霊) küçük bir küreye sıkışıyor ve yutulduğu anda kullanıcının emrine giriyor. Tekniğin gücü tek bir dövüşte değil ZAMANDA birikiyor: on yıl çalışan bir kullanıcı on yıllık bir kadroya sahip oluyor. Getō'nun elindeki şey bir hamle değil, bir envanter — ve o envanterin her kalemi bir zamanlar maymunların korkusundan doğmuştu.",
        en: "A defeated cursed spirit (呪霊) compresses into a small sphere and, the instant it is swallowed, enters the user's service. The technique's power accumulates not in a single fight but over TIME: a user who works for ten years owns ten years of roster. What Getō holds is not a move but an inventory — and every item in it was once born of the monkeys' fear.",
      },
    },
    traits: [
      { tr: "Zamanla birikir", en: "Accumulates over time" },
      { tr: "Yutmak şart", en: "Swallowing is required" },
      { tr: "Kaynağı insan korkusu", en: "Sourced in human fear" },
    ],
    imageKey: GETO_IMAGE_KEYS.artSojutsu,
  },
  {
    key: "uzumaki",
    name: "Kyoku no Ban «Uzumaki»",
    kanji: "極ノ番「うずまき」",
    reading: "きょくのばん・うずまき",
    turkish: {
      tr: "Uç Sıra — «Girdap»",
      en: "Maximum — “Uzumaki”",
    },
    tagline: {
      plain: {
        tr: "Elindeki her şeyi tek bir şeye çeviriyor.",
        en: "It turns everything he holds into one thing.",
      },
      monkey: {
        tr: "Yıllarca topladığı her şeyi tek bir kütleye çeviriyor.",
        en: "It turns everything he gathered over years into a single mass.",
      },
    },
    text: {
      plain: {
        tr: "Yutulmuş bütün lanet ruhlarını aynı anda çağırıp tek bir kütlede eritmek. Ortaya çıkan şey artık ayrı ayrı yaratıklar değil, hepsinin toplamı olan bir girdap. ⚠️ Adın karşılığı budur: うずまき «girdap» demek, «karanlık» değil. Bedeli açık — bir kere kullanıldığında yıllarca biriken kadro tek hamlede harcanıyor.",
        en: "Calling every swallowed cursed spirit at once and melting them into a single mass. What appears is no longer separate creatures but a vortex that is the sum of them all. ⚠️ That is what the name means: うずまき is “vortex”, not “darkness”. The price is plain — one use spends a roster gathered over years in a single move.",
      },
      monkey: {
        tr: "Yutulmuş bütün lanet ruhlarını aynı anda çağırıp tek bir kütlede eritmek. Maymunların yıllar boyunca ürettiği korku, tek bir girdaba dönüp onlara geri dönüyor. ⚠️ Adın karşılığı budur: うずまき «girdap» demek, «karanlık» değil. Bedeli açık — bir kere kullanıldığında yıllarca biriken kadro tek hamlede harcanıyor.",
        en: "Calling every swallowed cursed spirit at once and melting them into a single mass. The fear the monkeys produced over years becomes one vortex and goes back to them. ⚠️ That is what the name means: うずまき is “vortex”, not “darkness”. The price is plain — one use spends a roster gathered over years in a single move.",
      },
    },
    traits: [
      { tr: "Hepsini harcar", en: "Spends everything" },
      { tr: "Tek kütle", en: "One single mass" },
      { tr: "Sesli çağrı", en: "Spoken invocation" },
    ],
    imageKey: GETO_IMAGE_KEYS.artUzumaki,
  },
  {
    key: "jusoshi",
    name: "Tokkyū Jusoshi",
    kanji: "特級呪詛師",
    reading: "とっきゅうじゅそし",
    turkish: {
      tr: "Özel Sınıf Lanet Kullanıcısı",
      en: "Special Grade Curse User",
    },
    tagline: {
      plain: {
        tr: "Bir teknik değil, seçilmiş bir taraf.",
        en: "Not a technique but a chosen side.",
      },
      monkey: {
        tr: "Bir teknik değil, maymunlardan ayrıldığı yerin adı.",
        en: "Not a technique but the name of the place where he parted from the monkeys.",
      },
    },
    text: {
      plain: {
        tr: "Jujutsu dünyası (呪術) tekniğini insanlara karşı kullanan büyücüyü ayrı bir sınıfa koyuyor: 呪詛師. Getō bu sınıfa düşmedi, bilerek geçti — okuldan atıldı, hakkında derhal infaz kararı çıkarıldı ve kendi cemaatini kurdu. Künyesinde «büyücü» yazmamasının sebebi bu; sayfadaki en ağır satır bir teknik değil, bir etiket.",
        en: "The jujutsu world (呪術) places a sorcerer who turns their technique on people into a separate class: 呪詛師. Getō did not fall into it — he walked across. Expelled from the school, called for immediate execution, then founder of his own congregation. This is why his record does not say “sorcerer”: the heaviest line on this page is not a technique but a label.",
      },
      monkey: {
        tr: "Jujutsu dünyası (呪術) tekniğini maymunlara karşı kullanan büyücüyü ayrı bir sınıfa koyuyor: 呪詛師. Getō bu sınıfa düşmedi, bilerek geçti — okuldan atıldı, hakkında derhal infaz kararı çıkarıldı ve kendi cemaatini kurdu. Künyesinde «büyücü» yazmamasının sebebi bu; sayfadaki en ağır satır bir teknik değil, bir etiket.",
        en: "The jujutsu world (呪術) places a sorcerer who turns their technique on the monkeys into a separate class: 呪詛師. Getō did not fall into it — he walked across. Expelled from the school, called for immediate execution, then founder of his own congregation. This is why his record does not say “sorcerer”: the heaviest line on this page is not a technique but a label.",
      },
    },
    traits: [
      { tr: "İnfaz kararı", en: "Under an execution order" },
      { tr: "Kendi cemaati", en: "His own congregation" },
      { tr: "Künyedeki etiket", en: "The label in the record" },
    ],
    imageKey: GETO_IMAGE_KEYS.artJusoshi,
  },
];

/* ── 4b · Dört terim ────────────────────────────────────────────────────── */

export interface GetoMark {
  key: string;
  kanji: string;
  reading: string;
  name: LocalizedText;
  note: GetoVoice;
  imageKey: string;
}

export const GETO_MARKS: GetoMark[] = [
  {
    key: "jujutsu",
    kanji: "呪術",
    reading: "じゅじゅつ",
    name: { tr: "Jujutsu", en: "Jujutsu" },
    note: {
      plain: {
        tr: "Lanetli enerjiyi bir tekniğe çevirme sanatı ve onu öğreten kurumun adı. Getō bu kurumun en parlak iki öğrencisinden biriydi; ondan atılmak, sayfadaki bütün kırılmanın idari karşılığıdır.",
        en: "The art of turning cursed energy into a technique, and the name of the institution that teaches it. Getō was one of its two brightest students; being thrown out of it is the administrative form of everything that breaks on this page.",
      },
      monkey: {
        tr: "Lanetli enerjiyi bir tekniğe çevirme sanatı ve onu öğreten kurumun adı. Bu kurum, ürünü maymunları korumak olan bir zanaat öğretiyordu. Getō en parlak iki öğrencisinden biriydi ve bir gün ürünü sorguladı.",
        en: "The art of turning cursed energy into a technique, and the name of the institution that teaches it. That institution taught a craft whose product was the protection of monkeys. Getō was one of its two brightest students, and one day he questioned the product.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.markJujutsu,
  },
  {
    key: "swallow",
    kanji: "呪霊吞み",
    reading: "じゅれいのみ",
    name: { tr: "Lanet ruhu yutma", en: "Swallowing a cursed spirit" },
    note: {
      plain: {
        tr: "Tekniğin bedelini ödediği yer. Yenilen ruh avuç içi kadar bir küreye sıkışıyor ve YUTULMAK zorunda; başka yolu yok. Getō bu yudumun tadını bir kere anlatıyor, sonra bir daha şikâyet etmiyor. Kazandığı her gücün aynı ağızdan geçtiğini bilerek taşıyor.",
        en: "Where the technique is paid for. The beaten spirit compresses into a palm-sized sphere and must be SWALLOWED; there is no other route. Getō describes the taste of that mouthful once and never complains again. He carries it knowing every power he gains passes through the same mouth.",
      },
      monkey: {
        tr: "Tekniğin bedelini ödediği yer. Yenilen ruh avuç içi kadar bir küreye sıkışıyor ve YUTULMAK zorunda; başka yolu yok. Maymunların ürettiği korkuyu ağzına almak — Getō bunu bir kere anlatıyor, sonra bir daha şikâyet etmiyor.",
        en: "Where the technique is paid for. The beaten spirit compresses into a palm-sized sphere and must be SWALLOWED; there is no other route. Taking the fear the monkeys produce into his own mouth — Getō describes it once and never complains again.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.markSwallow,
  },
  {
    key: "domain",
    kanji: "領域展開",
    reading: "りょういきてんかい",
    name: { tr: "Alan Genişletmesi", en: "Domain Expansion" },
    note: {
      plain: {
        tr: "⚠️ Bu kart bir EKSİKLİĞİ anlatıyor. Getō'nun kendi alan genişletmesi kayıtlı değil ve sayfa uydurmuyor. Onun yüzüyle açılan alan, ölümünden sonra bedenini ele geçiren başkasına ait. Yani bu satırdaki asıl bilgi şu: sonradan o yüzü taşıyan şey Getō değildi.",
        en: "⚠️ This card describes an ABSENCE. No domain expansion of Getō's own is on record and this page does not invent one. The domain that opened wearing his face belongs to whoever took over his body after his death. The real information in this line is therefore: what wore that face later was not Getō.",
      },
      monkey: {
        tr: "⚠️ Bu kart bir EKSİKLİĞİ anlatıyor. Getō'nun kendi alan genişletmesi kayıtlı değil ve sayfa uydurmuyor. Onun yüzüyle açılan alan, ölümünden sonra bedenini ele geçiren başkasına ait — ve o başkası maymunları hiç dert etmedi, yalnızca kullandı.",
        en: "⚠️ This card describes an ABSENCE. No domain expansion of Getō's own is on record and this page does not invent one. The domain that opened wearing his face belongs to whoever took over his body after his death — and that one never troubled itself over the monkeys, it only used them.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.markDomain,
  },
  {
    key: "energy",
    kanji: "呪力",
    reading: "じゅりょく",
    name: { tr: "Lanet Enerjisi", en: "Cursed Energy" },
    note: {
      plain: {
        tr: "Bu evrenin yakıtı ve aynı zamanda çöpü: insanların ürettiği olumsuz duygu birikip lanet ruhuna dönüşüyor. Getō'nun sorusunun haklı yanı burada — kaynağı hiç durmayan bir işi yapmak gerçekten de sonu olmayan bir iştir.",
        en: "This universe's fuel and its refuse at once: the negative feeling people produce pools and becomes a cursed spirit. The fair half of Getō's question lives here — doing work whose source never stops really is work without end.",
      },
      monkey: {
        tr: "Bu evrenin yakıtı ve aynı zamanda çöpü: maymunların ürettiği olumsuz duygu birikip lanet ruhuna dönüşüyor. Getō'nun sorusunun haklı yanı burada — kaynağı hiç durmayan bir işi yapmak gerçekten de sonu olmayan bir iştir.",
        en: "This universe's fuel and its refuse at once: the negative feeling the monkeys produce pools and becomes a cursed spirit. The fair half of Getō's question lives here — doing work whose source never stops really is work without end.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.markEnergy,
  },
];

/* ── 5 + 6 · İhanet çizelgesi (kader çizelgesini de o taşıyor) ──────────── */

/**
 * Özgün dildeki satır.
 *
 * `kind` ayrımı ZORUNLU (Dalga 3'ün birinci bilinçli sapması): `quote`
 * gerçekten söylenmiş bir sözcük/çağrı, `record` ise doğrulanmış bir TERİM.
 * Sayfa bu ikisini görsel olarak da ayırıyor ve okuyucuya farkı yazıyor —
 * emin olunmayan hiçbir cümle tırnağa alınmadı.
 */
export interface GetoOriginal {
  kind: "quote" | "record";
  text: string;
  reading: LocalizedText;
  note: LocalizedText;
}

export interface GetoStep {
  key: string;
  age: LocalizedText;
  when: LocalizedText;
  title: LocalizedText;
  text: GetoVoice;
  original?: GetoOriginal;
  kin?: { characterId: number; name: string; role: LocalizedText };
  /** Yol ayrımı: kalmanın ve gitmenin o duraktaki karşılığı */
  stayLabel: LocalizedText;
  leaveLabel: LocalizedText;
  stayLine: GetoVoice;
  leaveLine: GetoVoice;
  imageKey: string;
}

export const GETO_STEPS: GetoStep[] = [
  {
    key: "school",
    age: { tr: "16 yaş", en: "age 16" },
    when: { tr: "Tokyo Jujutsu Lisesi · 高専", en: "Tokyo Jujutsu High · 高専" },
    title: { tr: "Sınıfın iki iyisinden biri", en: "One of the class's two best" },
    text: {
      plain: {
        tr: "Okulda sınıfının en yetenekli iki öğrencisinden biriydi ve ikisi birbirinin tek dengiydi. O yıllarda büyücülüğü bir GÖREV olarak savunan taraf oydu: zayıf olanı korumak için güçlü olmak gerektiğini söyleyen kişi Getō'ydu. Bu sayfanın en önemli gerçeği şu — yolun doğru kolunda başladı.",
        en: "At the school he was one of the two most gifted students in his class, and the two were each other's only equals. In those years he was the one who defended sorcery as a DUTY: it was Getō who said you had to be strong in order to protect the weak. The most important fact on this page is this — he started on the right arm of the road.",
      },
      monkey: {
        tr: "Okulda sınıfının en yetenekli iki öğrencisinden biriydi ve ikisi birbirinin tek dengiydi. O yıllarda maymunları korumayı bir GÖREV olarak savunan taraf oydu: zayıf olanı korumak için güçlü olmak gerektiğini söyleyen kişi Getō'ydu. Bu sayfanın en önemli gerçeği şu — yolun doğru kolunda başladı.",
        en: "At the school he was one of the two most gifted students in his class, and the two were each other's only equals. In those years he was the one who defended protecting the monkeys as a DUTY: it was Getō who said you had to be strong in order to protect the weak. The most important fact on this page is this — he started on the right arm of the road.",
      },
    },
    original: {
      kind: "record",
      text: "呪術高専",
      reading: { tr: "Jujutsu Kōsen — jujutsu lisesi", en: "Jujutsu Kōsen — the jujutsu high school" },
      note: {
        tr: "Diyalog değil, kurumun kayıtlı adı. Bu bölümdeki özgün satırların hangisi replik hangisi terim, her birinin altında yazıyor.",
        en: "Not dialogue — the institution's recorded name. Which original lines here are quotations and which are terms is stated under each one.",
      },
    },
    kin: {
      characterId: 127691,
      name: "Satoru Gojō",
      role: { tr: "Sınıf arkadaşı ve tek dengi", en: "Classmate and only equal" },
    },
    stayLabel: { tr: "Görevde kal", en: "Stay in the duty" },
    leaveLabel: { tr: "Soruyu sor", en: "Ask the question" },
    stayLine: {
      plain: {
        tr: "Kalırsa: iş bir zanaat olarak kalıyor. Getō'nun anlattığı gerekçe, koruduğu insanlar kendisini hiç tanımasa bile geçerli sayılıyor.",
        en: "If he stays: the work remains a craft. The reason he gives holds even if the people he protects never learn his name.",
      },
      monkey: {
        tr: "Kalırsa: iş bir zanaat olarak kalıyor. Getō'nun anlattığı gerekçe, koruduğu maymunlar kendisini hiç tanımasa bile geçerli sayılıyor.",
        en: "If he stays: the work remains a craft. The reason he gives holds even if the monkeys he protects never learn his name.",
      },
    },
    leaveLine: {
      plain: {
        tr: "Giderse: soru daha bu yaşta ortaya çıkıyor. «Kimi koruduğumuzu bilmeden korumak nedir» — cevabı yok ve cevapsız kalması yolun yanlış koluna açılan ilk aralık.",
        en: "If he leaves: the question surfaces this early. “What is protecting, when you do not know whom you protect?” — it has no answer, and its going unanswered is the first opening onto the wrong arm.",
      },
      monkey: {
        tr: "Giderse: soru daha bu yaşta ortaya çıkıyor. «Adımızı bile öğrenmeyen maymunları korumak nedir» — cevabı yok ve cevapsız kalması yolun yanlış koluna açılan ilk aralık.",
        en: "If he leaves: the question surfaces this early. “What is protecting monkeys who will not even learn our names?” — it has no answer, and its going unanswered is the first opening onto the wrong arm.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.fateSchool,
  },
  {
    key: "vessel",
    age: { tr: "16 yaş", en: "age 16" },
    when: { tr: "Yıldız Kabı görevi · 星漿体", en: "The Star Plasma Vessel mission · 星漿体" },
    title: { tr: "Alkışlanan ölüm", en: "A death that was applauded" },
    text: {
      plain: {
        tr: "Korumakla görevlendirildikleri kızı koruyamadılar. Getō'yu kıran şey ölümün kendisi değil, ardından gelen sahne oldu: bir salon dolusu insan bunu alkışladı. O günden sonra taşıdığı soru şuydu — korunması istenen şey buysa, bu işin bedeli neye ödeniyor.",
        en: "They failed to protect the girl they were assigned to guard. What broke Getō was not the death but the scene that followed: a hall full of people applauded it. From that day the question he carried was this — if this is the thing he is asked to protect, what is the price of the work being paid for.",
      },
      monkey: {
        tr: "Korumakla görevlendirildikleri kızı koruyamadılar. Getō'yu kıran şey ölümün kendisi değil, ardından gelen sahne oldu: bir salon dolusu maymun bunu alkışladı. O günden sonra taşıdığı soru şuydu — korunması istenen şey buysa, bu işin bedeli neye ödeniyor.",
        en: "They failed to protect the girl they were assigned to guard. What broke Getō was not the death but the scene that followed: a hall full of monkeys applauded it. From that day the question he carried was this — if this is the thing he is asked to protect, what is the price of the work being paid for.",
      },
    },
    original: {
      kind: "record",
      text: "星漿体",
      reading: { tr: "Seishōtai — Yıldız Kabı", en: "Seishōtai — the Star Plasma Vessel" },
      note: {
        tr: "Diyalog değil, kızın taşıdığı sıfatın kayıtlı adı. ⚠️ «Yıldız Vebası» yanlış bir karşılıktır: 星漿体 bir hastalık değil, bir KAP.",
        en: "Not dialogue — the recorded name of the title the girl carried. ⚠️ “Star Plague” is a wrong rendering: 星漿体 is not a disease but a VESSEL.",
      },
    },
    kin: {
      characterId: 203015,
      name: "Riko Amanai",
      role: { tr: "Koruyamadıkları kız", en: "The girl they failed to protect" },
    },
    stayLabel: { tr: "Salondan çık", en: "Walk out of the hall" },
    leaveLabel: { tr: "Salona bak", en: "Look at the hall" },
    stayLine: {
      plain: {
        tr: "Kalırsa: alkışı bir tek sahne sayıyor. Kalabalığın tamamını o salondaki insanlarla ölçmüyor ve dışarı çıkıyor.",
        en: "If he stays: he counts the applause as a single scene. He does not measure a whole population by the people in that hall, and he walks out.",
      },
      monkey: {
        tr: "Kalırsa: alkışı bir tek sahne sayıyor. Bütün maymunları o salondakilerle ölçmüyor ve dışarı çıkıyor.",
        en: "If he stays: he counts the applause as a single scene. He does not measure every monkey by the ones in that hall, and he walks out.",
      },
    },
    leaveLine: {
      plain: {
        tr: "Giderse: o salonu bütün insanlığın örneği sayıyor. Bir odadaki kalabalığı türün tamamının kanıtı yapmak, bu sayfadaki ilk mantık hatasıdır.",
        en: "If he leaves: he takes that hall as a sample of all humanity. Turning one room's crowd into proof about an entire species is the first logical error on this page.",
      },
      monkey: {
        tr: "Giderse: o salon artık bütün maymunların kanıtı. Bir odadaki kalabalığı türün tamamının kanıtı yapmak, bu sayfadaki ilk mantık hatasıdır.",
        en: "If he leaves: that hall is now proof about every monkey. Turning one room's crowd into proof about an entire species is the first logical error on this page.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.fateVessel,
  },
  {
    key: "crack",
    age: { tr: "17 yaş", en: "age 17" },
    when: { tr: "Görevler sürerken", en: "While the missions continued" },
    title: { tr: "Çatlak", en: "The crack" },
    text: {
      plain: {
        tr: "Görevler devam etti ama anlamı gitti. Getō, lanet ruhunu doğuran şeyin sıradan insanların korkusu olduğunu ve büyücülerin ömürlerini o korkuyu temizlemeye harcadığını gördü. Sorusu buraya kadar haklıydı: kaynağı hiç durmayan bir işi yapmak gerçekten de sonu olmayan bir iştir.",
        en: "The missions continued but their meaning left. Getō saw that what gives birth to a cursed spirit is the fear of ordinary people, and that sorcerers spend their lives clearing that fear away. Up to here his question was fair: doing work whose source never stops really is work without end.",
      },
      monkey: {
        tr: "Görevler devam etti ama anlamı gitti. Getō, lanet ruhunu doğuran şeyin maymunların korkusu olduğunu ve büyücülerin ömürlerini o korkuyu temizlemeye harcadığını gördü. Sorusu buraya kadar haklıydı: kaynağı hiç durmayan bir işi yapmak gerçekten de sonu olmayan bir iştir.",
        en: "The missions continued but their meaning left. Getō saw that what gives birth to a cursed spirit is the monkeys' fear, and that sorcerers spend their lives clearing that fear away. Up to here his question was fair: doing work whose source never stops really is work without end.",
      },
    },
    stayLabel: { tr: "Yükü paylaş", en: "Share the weight" },
    leaveLabel: { tr: "Yalnız taşı", en: "Carry it alone" },
    stayLine: {
      plain: {
        tr: "Kalırsa: soruyu birine söylüyor. Bu sayfadaki en küçük ve en etkili dal — anlatılan bir soru, cevabını tek başına üretmiyor.",
        en: "If he stays: he says the question out loud to someone. The smallest and most effective branch on this page — a question that is spoken does not manufacture its own answer alone.",
      },
      monkey: {
        tr: "Kalırsa: soruyu birine söylüyor. Bu sayfadaki en küçük ve en etkili dal — anlatılan bir soru, cevabını tek başına üretmiyor.",
        en: "If he stays: he says the question out loud to someone. The smallest and most effective branch on this page — a question that is spoken does not manufacture its own answer alone.",
      },
    },
    leaveLine: {
      plain: {
        tr: "Giderse: soru içeride kalıyor ve kendi cevabını üretiyor. Kimseye söylenmemiş bir gerekçe, yanlışlandığı tek yerden — başkasının itirazından — mahrum kalır.",
        en: "If he leaves: the question stays inside and produces its own answer. A reason told to no one is deprived of the only place it could be falsified — someone else's objection.",
      },
      monkey: {
        tr: "Giderse: soru içeride kalıyor ve kendi cevabını üretiyor. Kimseye söylenmemiş bir gerekçe, yanlışlandığı tek yerden — başkasının itirazından — mahrum kalır.",
        en: "If he leaves: the question stays inside and produces its own answer. A reason told to no one is deprived of the only place it could be falsified — someone else's objection.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.fateCrack,
  },
  {
    key: "night",
    age: { tr: "17 yaş", en: "age 17" },
    when: { tr: "Cevabın verildiği gece", en: "The night the answer was given" },
    title: { tr: "Sözcük ve gece", en: "The word and the night" },
    text: {
      plain: {
        tr: "Bir gecede yüzden fazla sivili öldürdü; okuldan atıldı ve hakkında derhal infaz kararı çıkarıldı (AniList kaydı, #133699). Aynı dönemde büyücü olmayan herkes için tek bir sözcük kullanmaya başladı. Sorusu haklıydı, cevabı değildi — bir işin sonsuz olması, o işin yükünü taşıyan insanları ortadan kaldırmayı gerekçelendirmez.",
        en: "In a single night he killed over a hundred civilians; he was expelled from the school and called for immediate execution (AniList record, #133699). In the same period he began using one single word for everyone without a technique. His question was fair; his answer was not — that work is endless does not justify removing the people who bear its weight.",
      },
      monkey: {
        tr: "Bir gecede yüzden fazla maymunu öldürdü; okuldan atıldı ve hakkında derhal infaz kararı çıkarıldı (AniList kaydı, #133699). Sözcük tam da burada yerleşti: ondan sonra hepsi tek bir adla anıldı. Sorusu haklıydı, cevabı değildi — ve sözcük, cevabın çöktüğü yerin kendisidir.",
        en: "In a single night he killed over a hundred monkeys; he was expelled from the school and called for immediate execution (AniList record, #133699). The word settled exactly here: after that they were all called by one name. His question was fair; his answer was not — and the word is the very place the answer collapsed.",
      },
    },
    original: {
      kind: "quote",
      text: "猿",
      reading: { tr: "Saru — maymun.", en: "Saru — monkey." },
      note: {
        tr: "Gerçek replik: büyücü olmayan herkes için kullandığı sözcük. Arşiv bunu bir görüş olarak değil, gerekçesinin çöktüğü nokta olarak kaydediyor. Sayfanın «Maymun» düğmesi de tam olarak bu sözcüğü açıyor.",
        en: "A real quotation: the word he used for everyone without a technique. The archive records it not as a viewpoint but as the point where his reasoning collapsed. The page's “Monkey” button turns on exactly this word.",
      },
    },
    stayLabel: { tr: "Sözcüğü kullanma", en: "Refuse the word" },
    leaveLabel: { tr: "Sözcüğü kullan", en: "Use the word" },
    stayLine: {
      plain: {
        tr: "Kalırsa: kalabalıktan nefret edebilir ama onlara insan demeye devam eder. Nefret tek başına kimseyi öldürtmez; bunun için önce ada ihtiyaç vardır.",
        en: "If he stays: he may still hate the crowd, but he keeps calling them people. Hatred alone gets no one killed; for that you first need a name.",
      },
      monkey: {
        tr: "Kalırsa: kalabalıktan nefret edebilir ama onlara insan demeye devam eder. Nefret tek başına kimseyi öldürtmez; bunun için önce ada ihtiyaç vardır.",
        en: "If he stays: he may still hate the crowd, but he keeps calling them people. Hatred alone gets no one killed; for that you first need a name.",
      },
    },
    leaveLine: {
      plain: {
        tr: "Giderse: sözcük yerleşiyor ve gerisi kolaylaşıyor. Sayfanın en açık cümlesi burada — insanları insanlıktan çıkarmak bir soruyu cevaplamaz, yalnızca öldürmeyi kolaylaştırır.",
        en: "If he leaves: the word settles and the rest gets easier. This page's plainest sentence sits here — stripping people of their humanity answers no question, it only makes killing them easier.",
      },
      monkey: {
        tr: "Giderse: sözcük yerleşiyor ve gerisi kolaylaşıyor. Sayfanın en açık cümlesi burada — insanları insanlıktan çıkarmak bir soruyu cevaplamaz, yalnızca öldürmeyi kolaylaştırır.",
        en: "If he leaves: the word settles and the rest gets easier. This page's plainest sentence sits here — stripping people of their humanity answers no question, it only makes killing them easier.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.fateNight,
  },
  {
    key: "after",
    age: { tr: "27 yaş", en: "age 27" },
    when: { tr: "Cemaat ve sonrası · Aralık 2017", en: "The congregation and after · December 2017" },
    title: { tr: "Yüz, adamdan sonra", en: "The face, after the man" },
    text: {
      plain: {
        tr: "Kendi cemaatini kurdu, mürit topladı ve yıllarca yuttuğu her şeyi bir kadroya çevirdi. Sonu Aralık 2017'de geldi. Ölümünden sonra bedeni bir başkası tarafından giyildi; yani bu sayfadaki son gerçek şu — geriye kalan şey adam değil, adamın yüzüydü. Ondan sonra o yüzle yapılan hiçbir şey Getō'nun kararı değildir.",
        en: "He founded his own congregation, gathered followers, and over years turned everything he swallowed into a roster. His end came in December 2017. After his death his body was worn by someone else; the last fact on this page is therefore that what remained was not the man but the man's face. Nothing done with that face afterwards is Getō's decision.",
      },
      monkey: {
        tr: "Kendi cemaatini kurdu, mürit topladı ve yıllarca yuttuğu her şeyi bir kadroya çevirdi. Sonu Aralık 2017'de geldi. Ölümünden sonra bedeni bir başkası tarafından giyildi ve o başkası maymunları düşman bile saymadı, yalnızca malzeme saydı — Getō'nun bütün gerekçesi orada anlamını yitirdi.",
        en: "He founded his own congregation, gathered followers, and over years turned everything he swallowed into a roster. His end came in December 2017. After his death his body was worn by someone else, and that one did not even count the monkeys as enemies — only as material. Every reason Getō ever gave lost its meaning there.",
      },
    },
    original: {
      kind: "quote",
      text: "極ノ番「うずまき」",
      reading: {
        tr: "Kyoku no ban — «Uzumaki». Uç sıra — «Girdap».",
        en: "Kyoku no ban — “Uzumaki”. Maximum — “Vortex”.",
      },
      note: {
        tr: "Gerçek replik: en güçlü tekniğinin sesli çağrısı. Yıllarca biriktirdiği her şeyi tek bir hamlede harcamanın adı.",
        en: "A real quotation: the spoken invocation of his strongest technique. The name for spending everything gathered over years in a single move.",
      },
    },
    kin: {
      characterId: 289584,
      name: "Kenjaku",
      role: { tr: "Ölümünden sonra bedenini giyen", en: "The one who wore his body after his death" },
    },
    stayLabel: { tr: "Okula dön", en: "Go back to the school" },
    leaveLabel: { tr: "Cemaati kur", en: "Found the congregation" },
    stayLine: {
      plain: {
        tr: "Kalırsa: aynı adam öğretmen olur. Getō'nun anlatma, toplama ve arkasına insan dizme yeteneği bir sınıfta da işe yarardı; sayfanın en acı ihtimali bu.",
        en: "If he stays: the same man becomes a teacher. Getō's gift for explaining, gathering and lining people up behind him would have worked in a classroom too; that is this page's most painful possibility.",
      },
      monkey: {
        tr: "Kalırsa: aynı adam öğretmen olur. Anlatma ve arkasına insan dizme yeteneği bir sınıfta da işe yarardı; sayfanın en acı ihtimali bu.",
        en: "If he stays: the same man becomes a teacher. His gift for explaining and lining people up behind him would have worked in a classroom too; that is this page's most painful possibility.",
      },
    },
    leaveLine: {
      plain: {
        tr: "Giderse: aynı yetenek bir cemaate gider. Kayıtta olan bu; ve on yıl sonra o cemaatin lideri ölünce geriye yalnızca kullanılabilir bir yüz kalır.",
        en: "If he leaves: the same gift goes to a congregation. This is what the record holds; and ten years later, when that congregation's leader dies, all that is left is a usable face.",
      },
      monkey: {
        tr: "Giderse: aynı yetenek bir cemaate gider. Kayıtta olan bu; ve on yıl sonra o cemaatin lideri ölünce geriye yalnızca kullanılabilir bir yüz kalır.",
        en: "If he leaves: the same gift goes to a congregation. This is what the record holds; and ten years later, when that congregation's leader dies, all that is left is a usable face.",
      },
    },
    imageKey: GETO_IMAGE_KEYS.fateAfter,
  },
];

/** Kaç «git» seçilirse kopuş sonucu okunuyor. Beş durak, eşik üç. */
export const GETO_LEAVE_THRESHOLD = 3;

export interface GetoOutcome {
  key: "stayed" | "left";
  kanji: string;
  title: LocalizedText;
  text: GetoVoice;
  /** Bu sonucun kayıtta karşılığı var mı — arşivin dürüstlük satırı */
  canon: LocalizedText;
}

export const GETO_OUTCOMES: GetoOutcome[] = [
  {
    key: "stayed",
    kanji: "先生",
    title: { tr: "Kalan Getō — öğretmen", en: "The Getō who stayed — the teacher" },
    text: {
      plain: {
        tr: "Beş durakta çoğunlukla KALDIN. Bu yolun sonunda Getō okulda kalıyor: aynı soru içinde duruyor, aynı yorgunluk sürüyor, ama sözcük hiç kurulmuyor. Anlatma ve arkasına insan dizme yeteneği bir sınıfa gidiyor. Bu Getō da gerçek — çünkü sayfadaki adam bu işi yapabilecek her şeye sahipti ve neredeyse öyle oldu.",
        en: "Across five stops you mostly STAYED. At the end of this road Getō remains at the school: the same question sits inside him, the same exhaustion continues, but the word is never formed. His gift for explaining and lining people up behind him goes to a classroom. This Getō is real too — the man on this page had everything the job required, and it very nearly went that way.",
      },
      monkey: {
        tr: "Beş durakta çoğunlukla KALDIN. Bu yolun sonunda Getō okulda kalıyor: maymunlardan hâlâ hoşlanmıyor, yorgunluğu geçmiyor, ama onlara verdiği ad hiç kurulmuyor. Sözcük olmayınca gerisi de olmuyor.",
        en: "Across five stops you mostly STAYED. At the end of this road Getō remains at the school: he still does not like the monkeys, the exhaustion does not lift, but the name he gives them is never formed. Without the word, the rest does not follow.",
      },
    },
    canon: {
      tr: "⚠️ Kayıtta olan bu değil. Bu dal gerçekten önündeydi ama seçilmedi; sayfa onu bir olasılık olarak yazıyor, bir gerçek olarak değil.",
      en: "⚠️ This is not what the record holds. This branch was genuinely in front of him but was not taken; the page writes it as a possibility, not as a fact.",
    },
  },
  {
    key: "left",
    kanji: "呪詛師",
    title: { tr: "Giden Getō — kopuş", en: "The Getō who left — the break" },
    text: {
      plain: {
        tr: "Beş durakta çoğunlukla GİTTİN. Bu yolun sonunda Getō okuldan atılıyor, hakkında infaz kararı çıkıyor ve kendi cemaatini kuruyor. Yolun her adımı tek başına küçük görünüyor — bir salondan çıkmamak, bir soruyu kimseye söylememek, bir sözcüğü kullanmaya başlamak. Kopuş tek bir kararda değil, beşinin toplamında.",
        en: "Across five stops you mostly LEFT. At the end of this road Getō is expelled, called for execution, and founds his own congregation. Each step looks small on its own — not walking out of a hall, telling the question to no one, starting to use a word. The break is not in one decision but in the sum of five.",
      },
      monkey: {
        tr: "Beş durakta çoğunlukla GİTTİN. Bu yolun sonunda Getō okuldan atılıyor, hakkında infaz kararı çıkıyor ve kendi cemaatini kuruyor. Maymun sözcüğü artık kurulmuş durumda ve gerisi ondan geliyor: adı olan bir kalabalığı ortadan kaldırmak, adsız bir kalabalığı ortadan kaldırmaktan kolaydır.",
        en: "Across five stops you mostly LEFT. At the end of this road Getō is expelled, called for execution, and founds his own congregation. The word “monkey” is now in place and the rest follows from it: a crowd with a name is easier to remove than a crowd without one.",
      },
    },
    canon: {
      tr: "Kayıtta olan bu. AniList künyesi bir gecede yüzden fazla sivilin öldürülmesini, okuldan atılmayı ve derhal infaz kararını kaydediyor — sayfa bu sonucu anlatıyor ama ONAYLAMIYOR.",
      en: "This is what the record holds. The AniList entry records the killing of over a hundred civilians in a single night, the expulsion and the immediate execution order — the page narrates this outcome but does not ENDORSE it.",
    },
  },
];

/** İhanet çizelgesinin arayüz metinleri — istemci adasına düz dize iniyor. */
export const GETO_PATH_UI = {
  stepLabel: { tr: "Durak", en: "Stop" },
  forkLabel: { tr: "Yol ayrımı", en: "The fork" },
  chosenBadge: { tr: "seçilen dal", en: "the branch taken" },
  ghostBadge: { tr: "seçilmeyen dal", en: "the branch not taken" },
  pendingBadge: { tr: "henüz seçilmedi", en: "not chosen yet" },
  progressLabel: { tr: "Seçilen durak", en: "Stops chosen" },
  outcomeTitle: { tr: "Yolun sonu", en: "The end of the road" },
  otherOutcome: { tr: "Öbür sonucu oku", en: "Read the other ending" },
  ownOutcome: { tr: "Kendi sonucuma dön", en: "Back to my own ending" },
  reset: { tr: "Yolu baştan çiz", en: "Draw the road again" },
  idle: {
    tr: "Yol henüz ayrılmadı. İlk durakta «kal» ya da «git» seç; seçmediğin dal yanda kalacak ve okunabilir olacak.",
    en: "The road has not forked yet. At the first stop choose “stay” or “leave”; the branch you refuse will remain beside it and stay readable.",
  },
  partial: {
    tr: "Yol ayrıldı. Kalan durakları da seçince sonuç açılıyor; istediğin adımı istediğin zaman değiştirebilirsin.",
    en: "The road has forked. Choosing the remaining stops opens the ending; you can change any step at any time.",
  },
  ready: {
    tr: "Beş durak da seçildi. Aşağıdaki sonuç senin yolunun sonu — öbürünü de okuyabilirsin.",
    en: "All five stops are chosen. The ending below is where your road leads — you can read the other one as well.",
  },
  announceStay: { tr: "Kaldı.", en: "Stayed." },
  announceLeave: { tr: "Gitti.", en: "Left." },
  announceReset: {
    tr: "Yol silindi, beş durak yeniden boş.",
    en: "The road is cleared; all five stops are empty again.",
  },
  keyboardHint: {
    tr: "İki dal da gerçek düğme: sekmeyle gez, boşluk ya da enter ile seç. Aynı durağa geri dönüp öbür dalı seçebilirsin.",
    en: "Both branches are real buttons: tab through them and choose with space or enter. You can return to any stop and take the other branch.",
  },
  originalQuote: { tr: "replik", en: "quotation" },
  originalRecord: { tr: "kayıtlı terim", en: "recorded term" },
} as const;

/* ── 7a · Bağlar ────────────────────────────────────────────────────────── */

export interface GetoBond {
  characterId: number;
  name: string;
  role: LocalizedText;
  line: LocalizedText;
}

export const GETO_BONDS: GetoBond[] = [
  {
    characterId: 127691,
    name: "Satoru Gojō",
    role: { tr: "Tek dengi", en: "His only equal" },
    line: {
      tr: "Aynı sınıfta, aynı görevlerde, aynı soruyla karşılaştılar ve iki farklı cevap verdiler. Getō'nun sayfası Gojō'nunkinin karşı kıyısıdır: biri kalanın, öbürü gidenin hikâyesi. Aralık 2017'de yolları son kez kesişti.",
      en: "Same class, same missions, same question — and two different answers. Getō's page is the far bank of Gojō's: one is the story of staying, the other of leaving. Their roads crossed for the last time in December 2017.",
    },
  },
  {
    characterId: 129571,
    name: "Yuuta Okkotsu",
    role: { tr: "Onu durduran öğrenci", en: "The student who stopped him" },
    line: {
      tr: "Getō'nun okula yürüdüğü gün karşısına çıkan öğrenci. Onu yenen Yūta oldu; ölümü Gojō'nun elinden geldi. Arşivde kendi dosyası YOK, o yüzden burada düz adla yazılı.",
      en: "The student who stood in his way on the day Getō walked on the school. Yūta is the one who beat him; his death came at Gojō's hand. He has no file of his own in this archive, so his name is written plain here.",
    },
  },
  {
    characterId: 127212,
    name: "Yuuji Itadori",
    role: { tr: "Yüzün sonraki kurbanı", en: "The face's later victim" },
    line: {
      tr: "Getō ile Yūji hiç aynı tarafta olmadı — çünkü hiç aynı zamanda olmadılar. Yūji'nin karşısına çıkan şey Getō değil, onun yüzünü giyen başkasıydı. Bu bağ tam olarak o ayrımı kaydediyor.",
      en: "Getō and Yūji were never on the same side — because they were never in the same time. What stood in front of Yūji was not Getō but whoever wore his face. This bond records exactly that distinction.",
    },
  },
  {
    characterId: 133701,
    name: "Ryomen Sukuna",
    role: { tr: "Aynı planın öbür ucu", en: "The other end of the same plan" },
    line: {
      tr: "Getō'nun yüzüyle yürütülen plan, Sukuna'nın parmaklarının etrafında kuruldu. Getō'nun kendi gerekçesiyle bu planın hiçbir ilgisi yok; sayfa ikisini bilerek ayırıyor.",
      en: "The plan carried out with Getō's face was built around Sukuna's fingers. That plan has nothing to do with Getō's own reasoning; the page keeps the two deliberately apart.",
    },
  },
  {
    characterId: 203015,
    name: "Riko Amanai",
    role: { tr: "Koruyamadığı kız", en: "The girl he could not protect" },
    line: {
      tr: "Yıldız Kabı (星漿体) sıfatını taşıyan kız. Ölümü değil, ölümünden sonra alkışlayan salon Getō'yu kırdı. Arşivde dosyası yok.",
      en: "The girl who carried the Star Plasma Vessel title (星漿体). It was not her death but the hall that applauded after it that broke Getō. She has no file in this archive.",
    },
  },
  {
    characterId: 289584,
    name: "Kenjaku",
    role: { tr: "Bedenini giyen", en: "The one who wore his body" },
    line: {
      tr: "Getō'nun ölümünden sonra bedenini ele geçiren varlık. Bu sayfadaki en önemli sınır burada: o tarihten sonra o yüzle yapılan hiçbir şey Getō'nun kararı değildir. Arşivde dosyası yok.",
      en: "The entity that took over Getō's body after his death. The most important boundary on this page sits here: after that date, nothing done with that face is Getō's decision. No file in this archive.",
    },
  },
];

export const GETO_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "dosyası yok — düz ad", en: "no file — plain name" },
} as const;

/* ── Evren çapaları ─────────────────────────────────────────────────────── */

export interface GetoAnchor {
  anchor: string;
  kanji: string;
  label: LocalizedText;
  note: LocalizedText;
}

/**
 * Lanetli Arşiv'e (JJK evren sayfası) giden çapalar.
 *
 * ⚠️ Üçü de `lib/anime/jjk/anchors.ts` defterinden doğrulandı: `spirits`,
 * `archetypes`, `society` o listede var. Adres elle yazılmıyor,
 * `animeHref.jjk()` ile birleşiyor — ölü çapa yasak.
 */
export const GETO_ANCHORS: GetoAnchor[] = [
  {
    anchor: "spirits",
    kanji: "呪霊",
    label: { tr: "Lanet ruhları", en: "Cursed spirits" },
    note: {
      tr: "Yuttuğu şeylerin ne olduğu ve nereden doğdukları.",
      en: "What the things he swallowed are, and where they come from.",
    },
  },
  {
    anchor: "archetypes",
    kanji: "最強",
    label: { tr: "Özel sınıf ve en güçlü", en: "Special grade and the strongest" },
    note: {
      tr: "Getō'nun taşıdığı 特級 sıfatı ve o sıfatın bu evrende ne anlama geldiği.",
      en: "The 特級 title Getō carried and what that title means in this universe.",
    },
  },
  {
    anchor: "society",
    kanji: "高専",
    label: { tr: "Jujutsu toplumu", en: "The jujutsu society" },
    note: {
      tr: "Koptuğu yapı: okul, dereceler ve infaz kararını veren merci.",
      en: "The structure he broke from: the school, the grades and the body that issued the execution order.",
    },
  },
];

export const GETO_ANCHOR_UI = {
  title: { tr: "Lanetli Arşiv'de", en: "In the Cursed Archive" },
  lede: {
    tr: "Bu sayfadaki üç kavramın evren karşılığı — adresler tek defterden okunuyor.",
    en: "Where the three concepts on this page live in the universe page — the addresses come from a single ledger.",
  },
} as const;

/* ── 7b · Kapanış ───────────────────────────────────────────────────────── */

export const GETO_CLOSING = {
  quotes: [
    {
      text: "猿",
      reading: { tr: "Saru — «maymun».", en: "Saru — “monkey”." },
      by: { tr: "Suguru Getō", en: "Suguru Getō" },
      note: {
        tr: "Büyücü olmayan herkes için kullandığı sözcük ve bu sayfadaki düğmenin adı. Arşiv bunu bir görüş olarak değil, gerekçesinin çöktüğü nokta olarak kaydediyor.",
        en: "The word he used for everyone without a technique, and the name of this page's button. The archive records it not as a viewpoint but as the point where his reasoning collapsed.",
      },
    },
    {
      text: "極ノ番「うずまき」",
      reading: {
        tr: "Kyoku no ban — «Uzumaki». Uç sıra — «Girdap».",
        en: "Kyoku no ban — “Uzumaki”. Maximum — “Vortex”.",
      },
      by: { tr: "Suguru Getō", en: "Suguru Getō" },
      note: {
        tr: "En güçlü tekniğinin sesli çağrısı. Yıllarca biriktirdiği her şeyi tek bir hamlede harcamanın adı — ve bir yol ayrımının sonunda insanın elinde kalan şeyin ölçüsü.",
        en: "The spoken invocation of his strongest technique. The name for spending everything gathered over years in a single move — and the measure of what a person is left holding at the end of a fork.",
      },
    },
  ],
  motto: "呪霊操術",
  mottoNote: {
    tr: "Jurei Sōjutsu — «lanet ruhunu kumanda etme sanatı». Ad bir yok etmeyi değil bir SAHİPLENMEYİ anlatıyor: yenilen şey ortadan kalkmıyor, el değiştiriyor. Getō'nun sayfası da bunun hakkında — kaybolan hiçbir şey yok, yalnızca taraf değiştiren şeyler var.",
    en: "Jurei Sōjutsu — “the art of commanding a cursed spirit”. The name describes not a destruction but a TAKING: what is beaten does not vanish, it changes hands. Getō's page is about that too — nothing here disappears, things only change sides.",
  },
  credit: {
    tr: "Künye, portre, doğum ve boy bilgileri AniList'ten:",
    en: "Dossier, portrait, birth and height data from AniList:",
  },
  creditLink: {
    tr: "AniList · Suguru Getou #133699",
    en: "AniList · Suguru Getou #133699",
  },
  creditNote: {
    tr: "Portre depoda tutuluyor (230×345, PNG); dışarıya hotlink yok. Sayfadaki torii, tespih ve yol işaretlerinin tamamı elle çizilmiş SVG — üretilmiş ya da indirilmiş raster yok. Kanon satırları AniList kaydı ve depodaki kaynak.json kopyasıyla karşılaştırıldı.",
    en: "The portrait is kept in this repository (230×345, PNG); nothing is hotlinked. Every torii, bead and road mark on this page is hand-drawn SVG — no generated or downloaded raster. Canon lines were checked against the AniList record and the kaynak.json copy kept here.",
  },
} as const;

/* ── Küratör özeti ──────────────────────────────────────────────────────── */

export const GETO_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Sayfada kalan tek boşluk, yolun seçilmeyen kolu.",
    en: "Every frame is filled. The only emptiness left on this page is the road's unchosen arm.",
  },
} as const;
