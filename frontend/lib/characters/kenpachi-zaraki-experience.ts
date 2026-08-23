import type { LocalizedText } from "./types";

/**
 * 更木剣八 — Kenpachi Zaraki (AniList #909) · DENEYİM katmanı.
 *
 * Bu dosya sayfanın bütün metnini ve verisini taşır; bileşenler yalnızca
 * çizer. Klasik dosya katmanı (`zaraki-kenpachi.ts`) yerinde duruyor ve
 * DEĞİŞMEDİ: orası "künye + tablo" kaydı, burası aynı adamın odası.
 * İkisi bilerek ayrı — biri veriyi, öbürü anlatıyı taşıyor.
 *
 * ── SAYFANIN FİKRİ: ÇENTİK SAYACI ────────────────────────────────────────
 * Nozarashi bakımsız bir kılıç: ağzı çentikli, paslı, hiç bilenmemiş.
 * Sayfanın omurgası o ağız. Her çentik bir savaş; çentiğe basılınca çentik
 * derinleşir, kıvılcım çıkar ve savaş anlatılır (kim · ne oldu · ne
 * öğrendi). Sayaç arttıkça adamın kendisi de değişiyor — sayfa bunu
 * anlatıyor.
 *
 * ── KÜNYE KAYNAĞI ────────────────────────────────────────────────────────
 * Boy, doğum günü, rütbe, ırk, yakınları ve diğer adları AniList künyesinden
 * (22 Ağustos 2026 önbelleği, `anilist-detay.json`). Yaş ve kan grubu
 * kaynakta BOŞ — uydurulmadı, "kayıt yok" olarak yazıldı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada yalnızca iki replik var; ikisi de kanonik ve yerinde
 * (Ichigo düellosunun sonu; Nozarashi'nin serbest bırakma komutu). Emin
 * olunmayan hiçbir söz yazılmadı — anlatının geri kalanı arşivin kendi
 * kalemiyle.
 */

/** AniList karakter numarası — adres ve kürator yuvaları bu numarayla çalışır. */
export const KENPACHI_ID = 909;

/**
 * Görsel anahtarları.
 *
 * ⚠️ İLK İKİSİ ZATEN DOLU ve **ezilmemeli**: küratör bu iki görseli
 * 22 Ağustos 2026'da yükledi ve anahtarları serbest metin olarak
 * ("Bankai", "Shikai — Nozarashi") kaydedildi. Yeni yuvalar `kenpachi:`
 * önekiyle açılıyor; eski iki anahtar olduğu gibi korunuyor, yoksa
 * yüklenmiş görseller sayfadan düşerdi.
 */
export const KENPACHI_IMAGE_KEYS = {
  /** MEVCUT — küratör yüklemesi, anahtar serbest metin */
  shikai: "Shikai — Nozarashi",
  /** MEVCUT — küratör yüklemesi, anahtar serbest metin */
  bankai: "Bankai",
  /** Yeni yuvalar */
  heroBand: "kenpachi:hero-bant",
  reiatsu: "kenpachi:ham-reiatsu",
  notchCaptain: "kenpachi:centik-kaptan",
  notchIchigo: "kenpachi:centik-ichigo",
  notchNnoitra: "kenpachi:centik-nnoitra",
  notchUnohana: "kenpachi:centik-unohana",
  notchGremmy: "kenpachi:centik-gremmy",
} as const;

/** Kürator modunda yükleme kutusunun üstünde görünen etiketler. */
export const KENPACHI_SLOT_LABELS: Record<string, LocalizedText> = {
  [KENPACHI_IMAGE_KEYS.shikai]: {
    tr: "Shikai — Nozarashi (yüklü)",
    en: "Shikai — Nozarashi (uploaded)",
  },
  [KENPACHI_IMAGE_KEYS.bankai]: {
    tr: "Bankai (yüklü)",
    en: "Bankai (uploaded)",
  },
  [KENPACHI_IMAGE_KEYS.heroBand]: {
    tr: "Hero bandı — geniş sahne (yatay)",
    en: "Hero band — wide scene (landscape)",
  },
  [KENPACHI_IMAGE_KEYS.reiatsu]: {
    tr: "Ham reiatsu — kılıçsız güç",
    en: "Raw reiatsu — power without the sword",
  },
  [KENPACHI_IMAGE_KEYS.notchCaptain]: {
    tr: "1. çentik — 11. Bölük'ün koltuğu",
    en: "Notch 1 — the 11th Division's seat",
  },
  [KENPACHI_IMAGE_KEYS.notchIchigo]: {
    tr: "2. çentik — Ichigo Kurosaki",
    en: "Notch 2 — Ichigo Kurosaki",
  },
  [KENPACHI_IMAGE_KEYS.notchNnoitra]: {
    tr: "3. çentik — Nnoitra Gilga",
    en: "Notch 3 — Nnoitra Gilga",
  },
  [KENPACHI_IMAGE_KEYS.notchUnohana]: {
    tr: "4. çentik — Retsu Unohana",
    en: "Notch 4 — Retsu Unohana",
  },
  [KENPACHI_IMAGE_KEYS.notchGremmy]: {
    tr: "5. çentik — Gremmy Thoumeaux",
    en: "Notch 5 — Gremmy Thoumeaux",
  },
};

/* ══════════════════════════════════════════════════════════════════════
   1 · HERO
   ══════════════════════════════════════════════════════════════════════ */

export const KENPACHI_HERO = {
  name: "Kenpachi Zaraki",
  nativeName: "更木剣八",
  /** Filigran — aria-hidden; adın kendisi, kaligrafi ağırlığında */
  watermark: "更木剣八",
  /** Sağ kenar rozeti: 11. Bölük */
  divisionKanji: "十一番隊",
  epigraph: {
    tr: "Adsız doğdu, adsız büyüdü. Adını bir unvandan aldı — her nesilde yalnızca bir kişinin taşıdığı unvandan.",
    en: "He was born nameless and grew up nameless. He took his name from a title — one only a single swordsman in each generation may carry.",
  },
  portraitAlt: {
    tr: "Kenpachi Zaraki — arşive yüklenmiş kadro portresi",
    en: "Kenpachi Zaraki — cast portrait uploaded to the archive",
  },
  bandAlt: {
    tr: "Kenpachi Zaraki — arşive yüklenmiş geniş sahne bandı",
    en: "Kenpachi Zaraki — wide scene band uploaded to the archive",
  },
  /** Yara izinin, göz bandının ve çıngırakların okunur açıklamaları */
  marks: [
    {
      key: "scar",
      label: { tr: "Yara izi", en: "The scar" },
      note: {
        tr: "Sol gözünden çeneye inen çizgi. Kimin çizdiği kayıtlarda yok; kapanmadığı için yara değil, imza sayılıyor.",
        en: "A line from the left eye down to the jaw. No record says who drew it; because it never closed, the archive files it as a signature rather than a wound.",
      },
    },
    {
      key: "patch",
      label: { tr: "Göz bandı", en: "The eyepatch" },
      note: {
        tr: "Sağ gözde duran bant bir yaranın örtüsü değil: Araştırma Enstitüsü'nün yaptığı, taşıyıcısının reiatsu'sunu durmadan yutan bir emici. Kenpachi onu gücünü saklamak için değil, dövüş uzasın diye takıyor.",
        en: "The patch on his right eye covers no injury: it is a Research Institute device that endlessly devours its wearer's reiatsu. He wears it not to hide his power but to make fights last.",
      },
    },
    {
      key: "bells",
      label: { tr: "Çıngıraklar", en: "The bells" },
      note: {
        tr: "Saçının uçlarındaki üç zil. Yürüdüğü her adımda rakibine nerede olduğunu söylerler; avantajı gönüllü olarak karşı tarafa verir.",
        en: "Three bells at the tips of his hair. With every step they tell his opponent exactly where he is; he hands the advantage over on purpose.",
      },
    },
  ],
} as const;

/** Mod düğmesi — göz bandı düşer, reiatsu taşar. */
export const KENPACHI_MODE = {
  enter: { tr: "Kenpachi modu", en: "Kenpachi mode" },
  exit: { tr: "Bandı geri tak", en: "Strap the patch back on" },
  note: {
    tr: "Bant düştüğünde sayfanın kenarları çatlar.",
    en: "When the patch drops, the page starts to crack at the edges.",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   2 · KÜNYE ŞERİDİ
   ══════════════════════════════════════════════════════════════════════ */

export interface KenpachiFact {
  key: string;
  label: LocalizedText;
  value: LocalizedText;
  /** Kaynakta boş olan alanlar — tabloda solgun çizilir */
  missing?: boolean;
}

export const KENPACHI_IDENTITY = {
  title: { tr: "Künye", en: "Record" },
  lede: {
    tr: "AniList künyesinde ne varsa o. Boş kalan iki satır bilerek boş: kaynakta yok, arşiv de uydurmuyor.",
    en: "Everything the AniList record holds. Two rows stay empty on purpose: the source has no value, and the archive does not invent one.",
  },
  facts: [
    {
      key: "race",
      label: { tr: "Irk", en: "Race" },
      value: { tr: "Shinigami", en: "Shinigami" },
    },
    {
      key: "rank",
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "Gotei 13 · 11. Bölük Kaptanı",
        en: "Gotei 13 · Captain of the 11th Division",
      },
    },
    {
      key: "height",
      label: { tr: "Boy", en: "Height" },
      value: { tr: "202 cm", en: "202 cm (6′7″)" },
    },
    {
      key: "birthday",
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "19 Kasım", en: "19 November" },
    },
    {
      key: "age",
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "Kayıt yok", en: "Not recorded" },
      missing: true,
    },
    {
      key: "blood",
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "Kayıt yok", en: "Not recorded" },
      missing: true,
    },
    {
      key: "home",
      label: { tr: "Geldiği yer", en: "Where he comes from" },
      value: {
        tr: "Kuzey Rukongai · 80. Bölge, Zaraki",
        en: "North Rukongai · District 80, Zaraki",
      },
    },
    {
      key: "sword",
      label: { tr: "Zanpakutō", en: "Zanpakutō" },
      value: { tr: "Nozarashi", en: "Nozarashi" },
    },
    {
      key: "kin",
      label: { tr: "Yakını", en: "Kin" },
      value: {
        tr: "Yachiru Kusajishi — evlat edindiği kız",
        en: "Yachiru Kusajishi — the girl he took in",
      },
    },
    {
      key: "aliases",
      label: { tr: "Diğer adları", en: "Also called" },
      value: {
        tr: "Ken-chan · Kenny · Savaş Şeytanı",
        en: "Ken-chan · Kenny · Demon of Battle",
      },
    },
    {
      key: "objects",
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Saçındaki çıngıraklar ve sağ gözündeki bant",
        en: "The bells in his hair and the patch over his right eye",
      },
    },
    {
      key: "series",
      label: { tr: "Seri", en: "Series" },
      value: {
        tr: "Bleach (2004) · Bin Yıllık Kan Savaşı (2022–)",
        en: "Bleach (2004) · Thousand-Year Blood War (2022–)",
      },
    },
  ] satisfies readonly KenpachiFact[],
} as const;

/** Arşiv galerisinden gelen kareler — küratörün yüklediği dört görsel. */
export const KENPACHI_GALLERY = {
  title: { tr: "Arşiv kareleri", en: "Archive frames" },
  note: {
    tr: "Küratör yüklemesi. Hangi sahneden geldikleri kayıtlı olmadığı için altlarına sahne adı yazılmıyor.",
    en: "Curator uploads. The archive does not record which scene each frame comes from, so none of them is captioned with one.",
  },
  alt: {
    tr: "Kenpachi Zaraki — arşiv galerisi karesi (küratör yüklemesi)",
    en: "Kenpachi Zaraki — archive gallery frame (curator upload)",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   3 · KESME ODASI (güç laboratuvarı)
   ══════════════════════════════════════════════════════════════════════ */

export interface KenpachiPower {
  key: string;
  /** Özel ad — çevrilmez */
  name: string;
  kanji?: string;
  release?: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: readonly LocalizedText[];
  imageKey?: string;
  imageAlt?: LocalizedText;
}

export const KENPACHI_LAB = {
  title: { tr: "Kesme Odası", en: "The Cutting Room" },
  lede: {
    tr: "Üç güç, dört kısıt. Kenpachi'nin dosyasında ikisi aynı ağırlıkta: neyi yapabildiği kadar, neyi bilerek yapmadığı da onu anlatıyor.",
    en: "Three powers, four restraints. In his file both weigh the same: what he can do explains him no better than what he deliberately refuses to do.",
  },
  powers: [
    {
      key: "shikai",
      name: "Shikai — Nozarashi",
      kanji: "野晒",
      release: { tr: "Yut hepsini, Nozarashi!", en: "Drink up, Nozarashi!" },
      tagline: {
        tr: "Adını duyması yüz yıldan fazla sürdü",
        en: "It took him over a century to hear its name",
      },
      text: {
        tr: "Adın anlamı açıkta bırakılmış, yağmurda paslanmış demek — kılıcın hâli tam olarak bu. Serbest bırakıldığında devasa, tek ağızlı bir balta-kılıca dönüşür; kesme gücü tek darbede bir yamacı ikiye bölecek kadar büyüktür. Kenpachi bu adı, Bin Yıllık Kan Savaşı'nda kendi ölümüne yaklaştığı gece öğrendi.",
        en: "The name means weather-beaten, left out to rust — which is exactly the state of the blade. Released, it becomes a vast single-edged axe-sword whose cut can split a hillside in one stroke. He only learned that name on the night he came closest to his own death, during the Thousand-Year Blood War.",
      },
      traits: [
        { tr: "Tek darbede alan yıkımı", en: "One stroke, area destruction" },
        { tr: "Savunma tanımaz", en: "Ignores defences" },
        { tr: "Ağırlık hızını düşürmez", en: "Weight costs him no speed" },
        { tr: "Bakım görmemiş ağız", en: "An edge that was never maintained" },
      ],
      imageKey: KENPACHI_IMAGE_KEYS.shikai,
      imageAlt: {
        tr: "Nozarashi'nin shikai hâli — arşive yüklenmiş görsel",
        en: "Nozarashi in shikai — image uploaded to the archive",
      },
    },
    {
      key: "bankai",
      name: "Bankai",
      kanji: "卍解",
      tagline: {
        tr: "Adı hâlâ kayıtlarda yok",
        en: "Its name is still not on record",
      },
      text: {
        tr: "Bin Yıllık Kan Savaşı'nın son perdesinde, Gerard Valkyrie'ye karşı ilk kez açıldı. Teni koyulaşır, başında boynuza benzer çıkıntılar belirir, reiatsu artık bir hâle değil bir basınç duvarıdır. Kontrol yoktur: bu form rakibi kadar taşıyıcısını da parçalar. Bleach'in bütün bankai'leri arasında adı açıklanmayan tek bankai bu.",
        en: "It opened for the first time in the last act of the Thousand-Year Blood War, against Gerard Valkyrie. His skin darkens, horn-like growths rise from his head, and his reiatsu stops being an aura and becomes a wall of pressure. There is no control: the form tears at its bearer as much as at his opponent. Of every bankai in Bleach, it is the only one whose name was never revealed.",
      },
      traits: [
        { tr: "Kontrol edilemez", en: "Cannot be controlled" },
        { tr: "Taşıyıcısına hasar verir", en: "Damages its bearer" },
        { tr: "Kısa süre ayakta kalır", en: "Holds for a short time only" },
        { tr: "Adsız", en: "Unnamed" },
      ],
      imageKey: KENPACHI_IMAGE_KEYS.bankai,
      imageAlt: {
        tr: "Kenpachi'nin bankai hâli — arşive yüklenmiş görsel",
        en: "Kenpachi in bankai — image uploaded to the archive",
      },
    },
    {
      key: "reiatsu",
      name: "Ham reiatsu",
      kanji: "霊圧",
      tagline: {
        tr: "Kılıç olmadan da kesiyor",
        en: "It cuts with no sword involved",
      },
      text: {
        tr: "Kenpachi'nin gücü zanpakutō'suna bağlı değil. Reiatsu'su odaya girdiği anda zayıf ruhlar ayakta duramaz; keskin bir bıçağı çıplak avucuyla tutup durdurabilir, ağzı kör bir kılıçla kaptan zırhını kesebilir. Ölçüldüğü hiçbir kayıt yok — ölçmeye çalışan aletler onun yanında anlamını yitiriyor.",
        en: "His power does not depend on his zanpakutō. The moment his reiatsu enters a room, weaker souls cannot stay standing; he can catch a live blade in a bare palm, and cut through a captain's guard with a sword that has no edge left. No measurement of it exists — instruments simply stop meaning anything next to him.",
      },
      traits: [
        { tr: "Çıplak elle bıçak tutar", en: "Catches a blade bare-handed" },
        { tr: "Basınç bir silahtır", en: "Pressure is a weapon" },
        { tr: "Kılıçtan bağımsız", en: "Independent of the sword" },
        { tr: "Ölçüm yok", en: "No measurement exists" },
      ],
      imageKey: KENPACHI_IMAGE_KEYS.reiatsu,
      imageAlt: {
        tr: "Kenpachi'nin ham reiatsu'su — arşive yüklenmiş görsel",
        en: "Kenpachi's raw reiatsu — image uploaded to the archive",
      },
    },
  ] satisfies readonly KenpachiPower[],

  restraintsTitle: { tr: "Dört kısıt", en: "Four restraints" },
  restraintsNote: {
    tr: "Hiçbiri ona dışarıdan takılmadı. Dördünü de kendi seçti.",
    en: "None of these were put on him. He chose all four.",
  },
  restraints: [
    {
      key: "onehand",
      mark: "blade" as const,
      name: { tr: "Tek elle kesiş", en: "One hand on the hilt" },
      note: {
        tr: "Kılıcı hep tek elle tutar. İkinci eli, rakip onu buna zorladığında devreye girer — ve o an dövüşün bittiği andır.",
        en: "He holds the sword in one hand, always. The second hand joins only when an opponent forces it — and that is the moment the fight is over.",
      },
    },
    {
      key: "bells",
      mark: "bells" as const,
      name: { tr: "Çıngıraklar", en: "The bells" },
      note: {
        tr: "Saçının uçlarındaki ziller yerini ele verir. Sessiz yaklaşmak isteseydi çıkarması yeterdi; istemiyor.",
        en: "The bells at the tips of his hair give his position away. If he wanted to approach quietly he would simply take them off; he does not want to.",
      },
    },
    {
      key: "patch",
      mark: "patch" as const,
      name: { tr: "Göz bandı", en: "The eyepatch" },
      note: {
        tr: "Yarası kapatan bir bez değil, reiatsu emen bir alet. Gücünü boşa akıtır ki dövüş uzasın. Onu çıkarmak bir hazırlık değil, bir bitiş işaretidir.",
        en: "Not cloth over a wound but a device that drinks reiatsu. It bleeds his power away so fights last longer. Taking it off is not a preparation; it is a closing signal.",
      },
    },
    {
      key: "title",
      mark: "title" as const,
      name: { tr: "“Kenpachi” unvanı", en: "The title Kenpachi" },
      note: {
        tr: "Bir isim değil bir sayaç: her nesilde yalnızca bir kişi taşır, en çok öldüren kişi. Unvanı ilk taşıyan Retsu Unohana'ydı; Zaraki onu ondan aldı.",
        en: "Not a name but a counter: only one person per generation carries it, the one who has killed the most. Retsu Unohana carried it first; Zaraki took it from her.",
      },
    },
  ],
} as const;

/* ══════════════════════════════════════════════════════════════════════
   4 · ÇENTİK SAYACI — sayfanın kalbi
   ══════════════════════════════════════════════════════════════════════ */

export type KenpachiOutcome = "WIN" | "LOSS";

export interface KenpachiNotch {
  key: string;
  /** Ağız üzerindeki sırası — 1'den 5'e */
  index: number;
  /** Özel ad — çevrilmez */
  opponent: string;
  /** Arşivde sayfası varsa çentik oraya bağlanır */
  opponentCharacterId?: number;
  arc: LocalizedText;
  outcome: KenpachiOutcome;
  /** Ne oldu */
  what: LocalizedText;
  /** Ne öğrendi */
  learned: LocalizedText;
  imageKey: string;
  imageAlt: LocalizedText;
}

export const KENPACHI_OUTCOME: Record<KenpachiOutcome, LocalizedText> = {
  WIN: { tr: "Kazandı", en: "Won" },
  LOSS: { tr: "Kaybetti", en: "Lost" },
};

export const KENPACHI_RAIL = {
  title: { tr: "Çentik Sayacı", en: "The Notch Counter" },
  lede: {
    tr: "Nozarashi hiç bilenmedi. Ağzındaki her çentik bir dövüşten kaldı ve Kenpachi hiçbirini kapattırmadı. Bir çentiğe bas: kim, ne oldu, ne öğrendi.",
    en: "Nozarashi was never sharpened. Every notch in its edge was left there by a fight, and he never had a single one filed out. Press a notch: who, what happened, what he learned.",
  },
  counterLabel: { tr: "Çentik", en: "Notch" },
  hint: {
    tr: "Çentikler arasında ok tuşlarıyla gezinebilirsin.",
    en: "Use the arrow keys to move between the notches.",
  },
  bladeAlt: {
    tr: "Nozarashi'nin çentikli ağzı — bu sayfa için elle çizilmiş grafik",
    en: "Nozarashi's notched edge — vector drawn by hand for this page",
  },
  whatLabel: { tr: "Ne oldu", en: "What happened" },
  learnedLabel: { tr: "Ne öğrendi", en: "What he learned" },
  notches: [
    {
      key: "captain",
      index: 1,
      opponent: "11. Bölük'ün adı bilinmeyen kaptanı",
      arc: { tr: "Hikâyeden önce · Seireitei", en: "Before the story · Seireitei" },
      outcome: "WIN",
      what: {
        tr: "Rukongai'nin dibinden Seireitei'ye yürüdü ve Gotei 13'e girmenin bir yolunu buldu: kaptanı düelloda öldürmek. Yendiği adamın adı hiçbir kayıtta geçmiyor; koltuğu o gün aldı ve bir daha bırakmadı.",
        en: "He walked out of the bottom of Rukongai into the Seireitei and found the one route into the Gotei 13: kill the captain in a duel. The man he beat is named in no record. He took the seat that day and never gave it back.",
      },
      learned: {
        tr: "Bu yerin kapısı bir sınav değil, bir düelloymuş. Kuralları öğrenmesine gerek kalmadı.",
        en: "The door to this place was not an examination but a duel. He never needed to learn the rules.",
      },
      imageKey: KENPACHI_IMAGE_KEYS.notchCaptain,
      imageAlt: {
        tr: "11. Bölük'ün koltuğu — arşive yüklenmiş sahne görseli",
        en: "The 11th Division's seat — scene image uploaded to the archive",
      },
    },
    {
      key: "ichigo",
      index: 2,
      opponent: "Ichigo Kurosaki",
      opponentCharacterId: 5,
      arc: { tr: "Soul Society arkı · Bölüm 36–41", en: "Soul Society arc · Episodes 36–41" },
      outcome: "LOSS",
      what: {
        tr: "Ölmek üzere olan bir çocuk ona kaptanlardan hiçbirinin veremediği şeyi verdi: zorlanmak. Kenpachi bandı çıkardı, ikinci elini kılıca koydu ve yine de önce o düştü. Yerde yatarken kaybettiğini kendi söyledi.",
        en: "A boy who was almost dead gave him the one thing no captain had managed to: difficulty. He took off the patch, put his second hand on the hilt, and still went down first. Lying there, he said it himself: he lost.",
      },
      learned: {
        tr: "Yenilgi diye bir şey varmış — ve o şey, kazanmaktan daha ilginçmiş.",
        en: "Defeat turned out to exist — and to be more interesting than winning.",
      },
      imageKey: KENPACHI_IMAGE_KEYS.notchIchigo,
      imageAlt: {
        tr: "Ichigo Kurosaki düellosu — arşive yüklenmiş sahne görseli",
        en: "The duel with Ichigo Kurosaki — scene image uploaded to the archive",
      },
    },
    {
      key: "nnoitra",
      index: 3,
      opponent: "Nnoitra Gilga",
      arc: { tr: "Hueco Mundo arkı · Bölüm 198–202", en: "Hueco Mundo arc · Episodes 198–202" },
      outcome: "WIN",
      what: {
        tr: "Espada'nın en sert derisi, yenilmemiş olmakla övünen bir adamın üstündeydi. Nnoitra ölmekten korkmuyordu; kaybettiğini kabul etmekten korkuyordu. Kenpachi ona ikisini birden verdi ve bunu bir hakaret gibi değil, bir nezaket gibi yaptı.",
        en: "The hardest skin among the Espada belonged to a man who boasted of never having lost. Nnoitra was not afraid of dying; he was afraid of admitting a loss. Kenpachi handed him both at once, and did it as a courtesy rather than an insult.",
      },
      learned: {
        tr: "Bir rakibe verilebilecek en büyük saygı, onu ciddiye alıp sonuna kadar götürmek.",
        en: "The greatest respect you can pay an opponent is to take him seriously and carry it to the end.",
      },
      imageKey: KENPACHI_IMAGE_KEYS.notchNnoitra,
      imageAlt: {
        tr: "Nnoitra Gilga düellosu — arşive yüklenmiş sahne görseli",
        en: "The duel with Nnoitra Gilga — scene image uploaded to the archive",
      },
    },
    {
      key: "unohana",
      index: 4,
      opponent: "Retsu Unohana",
      opponentCharacterId: 3845,
      arc: { tr: "Bin Yıllık Kan Savaşı", en: "Thousand-Year Blood War" },
      outcome: "WIN",
      what: {
        tr: "Soul Society'nin ilk Kenpachi'si, aynı zamanda en iyi iyileştiricisi. Onu bir yeraltı odasında defalarca öldürdü ve her seferinde geri getirdi. Kadın son kez düştüğünde Zaraki, yıllardır duymamak için kendini sağır ettiği sesi duydu: kılıcının adını.",
        en: "The first Kenpachi Soul Society ever had, and also its finest healer. In an underground chamber she killed him again and again and brought him back every time. When she finally fell, Zaraki heard the voice he had spent a lifetime deafening himself to: his sword saying its name.",
      },
      learned: {
        tr: "Gücünü kimse kısıtlamıyormuş. Dövüş bitmesin diye kendini kısıtlayan kendisiymiş.",
        en: "Nobody had been holding his power back. He had been holding it back himself, so that the fight would not end.",
      },
      imageKey: KENPACHI_IMAGE_KEYS.notchUnohana,
      imageAlt: {
        tr: "Retsu Unohana düellosu — arşive yüklenmiş sahne görseli",
        en: "The duel with Retsu Unohana — scene image uploaded to the archive",
      },
    },
    {
      key: "gremmy",
      index: 5,
      opponent: "Gremmy Thoumeaux",
      arc: {
        tr: "Bin Yıllık Kan Savaşı · Sternritter “V”",
        en: "Thousand-Year Blood War · Sternritter “V”",
      },
      outcome: "WIN",
      what: {
        tr: "Hayal ettiği her şeyi gerçeğe çeviren bir Quincy. Meteor düşürdü, kendini çoğalttı, sonunda Kenpachi'nin kaslarını kendi bedeninde hayal etti. Beden o hayali taşıyamadı ve içeriden dağıldı — Kenpachi ona dokunmadan kazandı.",
        en: "A Quincy who turned anything he imagined into fact. He dropped a meteor, multiplied himself, and finally imagined Kenpachi's muscles onto his own body. The body could not carry the thought and came apart from the inside — Kenpachi won without touching him.",
      },
      learned: {
        tr: "Hayal gücünün yetişemediği tek şey, bir bedenin gerçekten neye dayandığı.",
        en: "The one thing imagination cannot reach is what a body has actually survived.",
      },
      imageKey: KENPACHI_IMAGE_KEYS.notchGremmy,
      imageAlt: {
        tr: "Gremmy Thoumeaux düellosu — arşive yüklenmiş sahne görseli",
        en: "The duel with Gremmy Thoumeaux — scene image uploaded to the archive",
      },
    },
  ] satisfies readonly KenpachiNotch[],
} as const;

/* ══════════════════════════════════════════════════════════════════════
   5 · KADER ÇİZELGESİ
   ══════════════════════════════════════════════════════════════════════ */

export interface KenpachiEra {
  key: string;
  /** Yaş yerine dönem işareti — kaynakta yaş yok (bkz. bölüm ledesi) */
  marker: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: LocalizedText;
  quoteNote?: LocalizedText;
}

export const KENPACHI_FATE = {
  title: { tr: "Kader Çizelgesi", en: "The Fate Chart" },
  lede: {
    tr: "Zaraki'nin yaşı hiçbir kayıtta yok. Bu yüzden çizelge yıllarla değil, çentiklerle ilerliyor.",
    en: "No record anywhere gives Zaraki's age. So this chart advances not in years but in notches.",
  },
  eras: [
    {
      key: "district80",
      marker: { tr: "80. Bölge", en: "District 80" },
      title: { tr: "Adsızlık", en: "Namelessness" },
      text: {
        tr: "Kuzey Rukongai'nin sekseninci bölgesi listenin en dibi: hırsızların ve katillerin yeri, kanunun hiç uğramadığı yer. Orada büyüyen çocuğun adı yoktu, ailesi yoktu, bir tek kılıcı vardı. Kılıç kullanmayı kimse ona öğretmedi; hayatta kalanların hepsi kendi kendine öğrendi.",
        en: "District 80 of North Rukongai sits at the very bottom of the list: the place of thieves and murderers, where law never arrives. The boy who grew up there had no name, no family, and one sword. Nobody taught him how to use it; everyone who survived there taught themselves.",
      },
    },
    {
      key: "yachiru",
      marker: { tr: "Adlandırma günü", en: "The naming day" },
      title: { tr: "İki ad, bir çocuk", en: "Two names and a child" },
      text: {
        tr: "80. Bölge'nin dışında, kılıcına bakıp korkmayan küçük bir kız buldu. Ona hayranlık duyduğu tek kişinin adını verdi: Yachiru. Aynı gün kendine de ad seçti — geldiği bölgeden Zaraki, unvandan Kenpachi. O güne kadar adsız olan adam, adını iki ölçüden aldı: nereden geldiği ve kaç kişiyi öldürdüğü.",
        en: "Outside District 80 he found a small girl who looked at his sword and was not afraid. He gave her the name of the only person he ever admired: Yachiru. The same day he chose names for himself — Zaraki from the district he came from, Kenpachi from the title. The man who had been nameless took his name from two measurements: where he was from, and how many he had killed.",
      },
    },
    {
      key: "ichigo",
      marker: { tr: "Bölüm 36–41", en: "Episodes 36–41" },
      title: { tr: "İlk kayıp", en: "The first loss" },
      text: {
        tr: "Kaptan olduğundan beri kimse onu zorlamamıştı. Turuncu saçlı çocuk bunu bir dövüşte değiştirdi ve Kenpachi hayatında ilk kez sırtüstü yattı. Kaybettiğini kimse ona söylemedi; kendisi söyledi ve gülerek söyledi.",
        en: "Nobody had pushed him since the day he became a captain. An orange-haired boy changed that in a single fight, and Kenpachi ended up on his back for the first time in his life. Nobody had to tell him he had lost: he said it himself, and he said it laughing.",
      },
      quote: { tr: "Kaybettim.", en: "I lost." },
      quoteNote: {
        tr: "Soul Society arkı, düellonun sonu",
        en: "Soul Society arc, the end of the duel",
      },
    },
    {
      key: "unohana",
      marker: { tr: "TYBW · yeraltı odası", en: "TYBW · the underground chamber" },
      title: { tr: "Ölümüne ders", en: "A lesson to the death" },
      text: {
        tr: "Unvanı ilk taşıyan kişi, onu öldürerek öğretti. Retsu Unohana ölmeyi kabul etti ki Zaraki kendi gücünü serbest bıraksın; her ölümde bir kısıt daha düştü. Kadın son nefesini verdiğinde Zaraki, yüz yıldır kulaklarını tıkadığı sesi duydu ve kılıcının adını ilk kez ağzına aldı.",
        en: "The first person to carry the title taught him by killing him. Retsu Unohana accepted her own death so that Zaraki would let his power out; with every death one more restraint fell away. As she breathed her last, he heard the voice he had shut out for a century, and said his sword's name aloud for the first time.",
      },
      quote: { tr: "Yut hepsini, Nozarashi!", en: "Drink up, Nozarashi!" },
      quoteNote: {
        tr: "Nozarashi'nin serbest bırakma komutu",
        en: "Nozarashi's release command",
      },
    },
    {
      key: "tybw",
      marker: { tr: "TYBW · son perde", en: "TYBW · final act" },
      title: { tr: "Bandın gereksizleştiği gün", en: "The day the patch became useless" },
      text: {
        tr: "Bin Yıllık Kan Savaşı'nda sıra bankai'ye geldi ve Kenpachi kendi gücünü ilk kez tam açtı. Bedeli yalnızca kırılan kemikler olmadı: kılıcın adını öğrendiği geceden sonra Yachiru bir daha görünmedi. Arşiv bunu bir cevapla değil, bir soruyla kapatıyor — o çocuk kimdi.",
        en: "In the Thousand-Year Blood War it was bankai's turn, and Kenpachi opened his own power all the way for the first time. The cost was not only broken bones: after the night he learned his sword's name, Yachiru was never seen again. The archive closes this entry with a question rather than an answer — who was that child.",
      },
    },
  ] satisfies readonly KenpachiEra[],
} as const;

/* ══════════════════════════════════════════════════════════════════════
   6 · BAĞLAR
   ══════════════════════════════════════════════════════════════════════ */

export interface KenpachiBond {
  /** Özel ad — çevrilmez */
  name: string;
  /** Portre haritası bu numarayla aranıyor; kayıt yoksa kart adla çizilir */
  characterId?: number;
  role: LocalizedText;
  note: LocalizedText;
}

export const KENPACHI_BONDS = {
  title: { tr: "Yanındakiler", en: "The ones beside him" },
  lede: {
    tr: "Bleach kadrosunun portreleri arşivde henüz yok; bu kartlar adla ayakta duruyor, portre yüklendiği gün kendiliğinden dolacaklar.",
    en: "Portraits of the Bleach cast are not in the archive yet; these cards stand on the names alone and will fill themselves in the day a portrait is uploaded.",
  },
  portraitAlt: {
    tr: "arşive yüklenmiş portre",
    en: "portrait uploaded to the archive",
  },
  bonds: [
    {
      name: "Yachiru Kusajishi",
      characterId: 910,
      role: { tr: "Evlat edindiği kız · 11. Bölük teğmeni", en: "The girl he took in · lieutenant of the 11th" },
      note: {
        tr: "Kılıcına bakıp korkmayan tek kişi. Omzunda taşıdı, adını verdi, yolunu ona sordu. Kenpachi'nin yumuşadığı tek yer.",
        en: "The only person who looked at his sword without fear. He carried her on his shoulder, gave her her name, and asked her for directions. The single place where Kenpachi goes soft.",
      },
    },
    {
      name: "Retsu Unohana",
      characterId: 3845,
      role: { tr: "İlk Kenpachi · 4. Bölük kaptanı", en: "The first Kenpachi · captain of the 4th" },
      note: {
        tr: "Unvanı ondan aldı, dersi de. Onu yenebilen tek kişi ve bunun için ölmeyi kabul eden tek kişi.",
        en: "He took the title from her, and the lesson too. The only person who could beat him, and the only one who accepted death to do it.",
      },
    },
    {
      name: "Ichigo Kurosaki",
      characterId: 5,
      role: { tr: "İlk kaybettiği rakip", en: "The first opponent to beat him" },
      note: {
        tr: "İki dövüşçü de o gün yerde kaldı, ama Kenpachi kaybedenin kendisi olduğunu söyledi. O günden sonra ona rakipten fazlası gözüyle baktı.",
        en: "Both fighters ended up on the ground that day, but Kenpachi said the loser was him. From then on he saw the boy as more than an opponent.",
      },
    },
    {
      name: "Ikkaku Madarame",
      role: { tr: "11. Bölük · 3. koltuk", en: "11th Division · 3rd seat" },
      note: {
        tr: "Kaptan olmadan önce yendiği adam. Ikkaku o gün ona hizmet etmeye yemin etti — bir gün onu ölümüne dövüşe çağırmak şartıyla.",
        en: "A man he beat before he was ever a captain. Ikkaku swore to serve him that day — on the condition that he could one day call him out to a fight to the death.",
      },
    },
  ] satisfies readonly KenpachiBond[],
} as const;

/* ══════════════════════════════════════════════════════════════════════
   7 · KAPANIŞ
   ══════════════════════════════════════════════════════════════════════ */

export const KENPACHI_CLOSING = {
  /** Sayfada yalnızca bu iki replik var; ikisi de kanonik */
  quotes: [
    {
      text: { tr: "Kaybettim.", en: "I lost." },
      note: {
        tr: "Soul Society arkı — Ichigo Kurosaki düellosunun sonunda, gülerek",
        en: "Soul Society arc — at the end of the duel with Ichigo Kurosaki, laughing",
      },
    },
    {
      text: { tr: "Yut hepsini, Nozarashi!", en: "Drink up, Nozarashi!" },
      note: {
        tr: "Bin Yıllık Kan Savaşı — kılıcın adını ilk kez söylediği an",
        en: "Thousand-Year Blood War — the first time he said his sword's name",
      },
    },
  ],
  motto: {
    glyph: "剣八",
    reading: "Kenpachi",
    meaning: {
      tr: "Bir unvan, bir ad değil: her nesilde yalnızca bir kişi taşır.",
      en: "A title, not a name: only one person in each generation carries it.",
    },
  },
  closingLine: {
    tr: "Sevinç ve şiddet onda aynı şey. Bu sayfa gülümseyerek kanıyor.",
    en: "In him, joy and violence are the same thing. This page bleeds while it grins.",
  },
  credit: {
    tr: "Künye bilgileri ve yedek portre AniList'ten (karakter #909) alınmıştır. Portre, galeri kareleri, shikai ve bankai görselleri arşivin kendi yüklemeleridir. Sayfadaki bütün grafikler — çentikli kılıç ağzı, yara izi, göz bandı, çıngıraklar, kısıt işaretleri — bu sayfa için elle çizildi; dışarıdan görsel alınmadı.",
    en: "Record data and the fallback portrait come from AniList (character #909). The portrait, gallery frames, shikai and bankai images are the archive's own uploads. Every graphic on this page — the notched edge, the scar, the eyepatch, the bells, the restraint marks — was drawn by hand for this page; no external artwork was used.",
  },
  creditLinkLabel: {
    tr: "AniList künyesi #909",
    en: "AniList record #909",
  },
  creditHref: "https://anilist.co/character/909",
} as const;
