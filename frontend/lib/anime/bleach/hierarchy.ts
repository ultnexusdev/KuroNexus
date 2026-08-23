import type { Localized } from "./types";
import type { LayerId } from "@/components/anime/bleach/WorldSection";

/**
 * RUH HİYERARŞİSİ — P06'nın verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Bleach'i Naruto'dan ayıran şey hiyerarşidir. Naruto'da güç YATAY dağılır
 * (köyler, klanlar, birbirine denk kıtalar); Bleach'te DİKEY dizilir ve her
 * kat bir üstüne hesap verir. Bu yüzden kayıt bir liste değil bir SÜTUN:
 * dizideki sıra iktidardaki sırayla birebir aynı ve o sıra sayfada
 * yukarıdan aşağı bir iniş olarak çiziliyor.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * Yöntem her zamanki: `bleach.fandom.com/api.php?action=parse&page=<AD>
 * &prop=wikitext`. Sayfanın HTML'i 403 veriyor, API vermiyor.
 *
 * ⚠️ Doğrulama yine üç hata yakaladı — hafızadan yazılsaydı üçü de sayfaya
 * girecekti:
 *   1. Junrinan KUZEY değil **BATI** Rukongai 1. bölge (Hitsugaya, Hinamori).
 *   2. Central 46'nın kanji'si 中央四十六室 değil **中央四十六**; 室'li biçim
 *      külliyenin/odanın adı, kurumun değil. Brief'in şeması 室 yazıyor;
 *      canon kazandı.
 *   3. Royal Guard'ın resmî adı 零番隊 değil **王属特務** (Ōzokutokumu);
 *      零番隊 yaygın ikinci ad. İkisi de kayıtta duruyor.
 *
 * ── BİLİNMEYEN UYDURULMADI ───────────────────────────────────────────────
 * Central 46'nın kırk bilgesi ve altı yargıcı canon'da HİÇ adlandırılmadı:
 * `figures` boş bırakıldı ve arayüz o satırı hiç çizmiyor. Kidō Birliği'nin
 * Tessai'den sonraki komutası da bilinmiyor ve bu `scale` satırında açıkça
 * yazıyor — arşivin en güvenilir yanı bilmediğini söylemesi (`divisions.ts`
 * ile aynı kural).
 */

/**
 * Katın tipografik SESİ.
 *
 * Bölümün tezi "yukarıdan aşağı görsel kalite bilinçli olarak bozulur" ve
 * bunun en görünür taşıyıcısı harfin kendisi. Ses bir CSS indeksinden değil
 * KAYITTAN geliyor: hangi katın ince, hangisinin kaba konuştuğu bir tasarım
 * kararı ve burada, veriyle birlikte duruyor.
 *
 *   fine   — Jost 200, çok geniş harf aralığı, bol boşluk (Reiōkyū)
 *   plain  — Jost 300, ölçülü aralık, düzenli (Seireitei kurumları)
 *   coarse — Inter 700, sıkışık ve hizasız (Akademi'den Rukongai'ye)
 */
export type TierVoice = "fine" | "plain" | "coarse";

export interface HierarchyFigure {
  /** ÇEVRİLMEZ — özel ad (kişi ya da bölge) */
  name: string;
  /** Adın altındaki tek satırlık künye */
  note: Localized;
}

export interface HierarchyTier {
  id: string;
  /** Kurumun kanji'si — çevrilmez */
  kanji: string;
  /** İkinci resmî ad, varsa (王属特務 gibi) */
  also?: string;
  romaji: string;
  /** ÇEVRİLMEZ — sayfanın imza sesi İngilizce (Jost caps) */
  en: string;
  /** Katın hangi dünyanın derisini giydiği */
  layer: Extract<LayerId, "royal" | "soul-society">;
  voice: TierVoice;
  /** 2–3 cümle, arşivci sesi */
  description: Localized;
  /** Katın büyüklüğünü tek satırda veren künye */
  scale?: Localized;
  figures: HierarchyFigure[];
  /** Sayfa içi derin bölüm; yalnızca hedef GERÇEKTEN varsa çiziliyor */
  enter?: { anchor: string; label: Localized };
}

export const SOUL_HIERARCHY: readonly HierarchyTier[] = [
  {
    id: "soul-king",
    kanji: "霊王",
    romaji: "Reiō",
    en: "SOUL KING",
    layer: "royal",
    voice: "fine",
    description: {
      tr: "Tepede bir hükümdar değil bir mühür var: üç dünyayı ayrı tutan şey onun varlığı, yerinden oynarsa yapı çöker. Shinigami onu çağlar önce mühürledi — kolları, kalbi ve sağ eli sökülmüş, hükmetmeyen, yalnızca duran bir tanrı.",
      en: "At the top there is not a ruler but a seal: what holds the three worlds apart is his existence, and if it moves the structure collapses. The Shinigami sealed him eons ago — arms, heart and right hand cut away, a god who does not rule but merely holds.",
    },
    scale: {
      tr: "1.000.000+ yıl · varlığın kilit taşı",
      en: "1,000,000+ years · the linchpin of existence",
    },
    figures: [
      {
        name: "Adnyeus",
        note: {
          tr: "アドナイェウス — gerçek ad; yalnızca anime'de söylendi",
          en: "アドナイェウス — the true name; spoken only in the anime",
        },
      },
    ],
  },
  {
    id: "royal-guard",
    kanji: "零番隊",
    also: "王属特務 · Ōzokutokumu",
    romaji: "Zerobantai",
    en: "ROYAL GUARD",
    layer: "royal",
    voice: "fine",
    description: {
      tr: "Beş kişi, hepsi eski kaptan, yetkileri Soul Society'deki herkesin üstünde. Gotei 13'ün işlerine karışmazlar — Aizen'in Arrancar ordusuna karşı bile — çünkü tek görevleri kilidin kendisini korumak. Kyōraku'nun cümlesi şu: beşinin toplam gücü on üç bölüğün tamamından fazla.",
      en: "Five members, all former captains, and their authority supersedes everyone in Soul Society. They do not interfere in the Gotei 13's affairs — not even against Aizen's Arrancar army — because their only duty is the linchpin itself. In Kyōraku's words: the five of them together outweigh the whole of the Gotei 13.",
    },
    scale: {
      tr: "5 üye · her biri Shinigami varlığının bir direğini icat etti",
      en: "5 members · each invented one pillar of Shinigami existence",
    },
    figures: [
      {
        name: "Ichibē Hyōsube",
        note: {
          tr: "真名呼和尚 · zümrenin başı; adları o verdi",
          en: "真名呼和尚 · head of the guard; he gave things their names",
        },
      },
      {
        name: "Ōetsu Nimaiya",
        note: {
          tr: "刀神 · her Zanpakutō'nun ham hâli olan Asauchi'yi o dövdü",
          en: "刀神 · he forged the Asauchi, the blank of every Zanpakutō",
        },
      },
      {
        name: "Tenjirō Kirinji",
        note: {
          tr: "泉湯鬼 · şifa sanatı Kaidō'yu o kurdu",
          en: "泉湯鬼 · he founded Kaidō, the healing art",
        },
      },
      {
        name: "Kirio Hikifune",
        note: {
          tr: "穀王 · yapay ruh Gikon'u o buldu",
          en: "穀王 · she devised Gikon, the artificial soul",
        },
      },
      {
        name: "Senjumaru Shutara",
        note: {
          tr: "大織守 · ölüm cübbesi Shihakushō'yu o dokudu",
          en: "大織守 · she wove the Shihakushō, the robe of death",
        },
      },
    ],
  },
  {
    id: "central-46",
    kanji: "中央四十六",
    romaji: "Chūō Shijūroku",
    en: "CENTRAL 46",
    layer: "soul-society",
    voice: "plain",
    description: {
      tr: "Kırk bilge ve altı yargıç, Ruh Kralı'ndan aldıkları vekâletle Soul Society'yi yönetir; Gotei 13'e, Onmitsukidō'ya ve Kidō Birliği'ne ölümcül güç emrini verebilen tek merci burasıdır. Bir karar verildiğinde neredeyse hiç bozulmaz. Aizen bütün odayı öldürüp yerine geçtiğinde kimse aylarca fark etmedi.",
      en: "Forty wise men and six judges rule Soul Society under a mandate from the Soul King; this is the only body that can order the Gotei 13, the Onmitsukidō or the Kidō Corps to use lethal force. Once a decision is made it is almost never overturned. When Aizen killed the entire chamber and took its place, no one noticed for months.",
    },
    scale: {
      tr: "40 bilge + 6 yargıç · Royal Guard ve Akademi yetki alanı DIŞINDA",
      en: "40 wise men + 6 judges · the Royal Guard and the Academy lie outside its reach",
    },
    /* Canon kırk altısının HİÇBİRİNİ adlandırmadı. Boş kalıyor. */
    figures: [],
  },
  {
    id: "gotei-13",
    kanji: "護廷十三隊",
    romaji: "Gotei Jūsantai",
    en: "GOTEI 13",
    layer: "soul-society",
    voice: "plain",
    description: {
      tr: "Ruh dünyasının görünen ordusu: on üç bölük, her birinin bir kaptanı ve bir teğmeni var. Açıkta çalışırlar ve Rukongai'nin bölgelerini savunmak da onların görevi — hangi bölüğün hangi bölgeden sorumlu olduğu ise hiç söylenmedi.",
      en: "The visible army of the spirit world: thirteen divisions, each with a captain and a lieutenant. They operate in the open, and defending the districts of Rukongai is part of their duty — though which division answers for which district was never stated.",
    },
    scale: {
      tr: "13 bölük · dışa dönük muhafız",
      en: "13 divisions · the outward guard",
    },
    figures: [
      {
        name: "Genryūsai Shigekuni Yamamoto",
        note: {
          tr: "総隊長 · kurucu ve 1.100 yıl boyunca başkomutan",
          en: "総隊長 · founder, and Captain-Commander for 1,100 years",
        },
      },
      {
        name: "Shunsui Kyōraku",
        note: {
          tr: "ondan sonraki başkomutan",
          en: "the Captain-Commander who followed him",
        },
      },
    ],
    enter: {
      anchor: "#gotei",
      label: { tr: "On üç kapıya git", en: "Go to the thirteen gates" },
    },
  },
  {
    id: "onmitsukido",
    kanji: "隠密機動",
    romaji: "Onmitsukidō",
    en: "STEALTH FORCE",
    layer: "soul-society",
    voice: "plain",
    description: {
      tr: "Gotei 13 açıkta çalışıyorsa Onmitsukidō içeride çalışır: gözetleme, suikast ve yasayı çiğneyen Shinigami'nin infazı. Komuta nesiller boyu Shihōin Klanı'nda kaldı ve bugün de İkinci Bölük'e bağlı — beş birliğin başındaki adlar, aynı bölüğün ilk beş koltuğu.",
      en: "If the Gotei 13 works in the open, the Onmitsukidō works inside it: surveillance, assassination, and the execution of Shinigami who break the law. Command stayed with the Shihōin Clan for generations and is still tied to the 2nd Division — the heads of its five corps are that division's top five seats.",
    },
    scale: {
      tr: "5 birlik · 刑軍 · 警邏隊 · 檻理隊 · 飛諜隊 · 裏廷隊",
      en: "5 corps · 刑軍 · 警邏隊 · 檻理隊 · 飛諜隊 · 裏廷隊",
    },
    figures: [
      {
        name: "Suì-Fēng",
        note: {
          tr: "総司令官 · bugünkü başkomutan",
          en: "総司令官 · Commander-in-Chief today",
        },
      },
      {
        name: "Yoruichi Shihōin",
        note: {
          tr: "ondan önceki başkomutan; aynı anda 2. Bölük kaptanıydı",
          en: "her predecessor; captain of the 2nd Division at the same time",
        },
      },
    ],
  },
  {
    id: "kido-corps",
    kanji: "鬼道衆",
    romaji: "Kidōshū",
    en: "KIDŌ CORPS",
    layer: "soul-society",
    voice: "plain",
    description: {
      tr: "Senkaimon'u açan, mühürleri ve bariyerleri ayakta tutan uzmanlar birliği; işleri mutlak gizlilikle yürür. Akademi'nin Kidō'da parlayan öğrencilerini alırlar. Ukitake bir keresinde birlikten birini görmenin ne kadar nadir olduğunu söylemişti — kaptanını görmek ise neredeyse hiç olmadı.",
      en: "The specialists who open the Senkaimon and hold the seals and barriers in place; their operations run in absolute secrecy. They take the Academy students who excel at Kidō. Ukitake once remarked how rare it was to see anyone from the Corps — and its captain, rarer still.",
    },
    scale: {
      tr: "Tessai'nin sürgününden beri komuta kaydı YOK",
      en: "NO record of command since Tessai's exile",
    },
    figures: [
      {
        name: "Tessai Tsukabishi",
        note: {
          tr: "鬼道長 · 102 yıl önceki başkumandan; sürgüne gitti",
          en: "鬼道長 · Grand Kidō Chief 102 years ago; he went into exile",
        },
      },
      {
        name: "Hachigen Ushōda",
        note: {
          tr: "yardımcısı; o da sürgünde",
          en: "his vice-chief; exiled with him",
        },
      },
    ],
  },
  {
    id: "shino-academy",
    kanji: "真央霊術院",
    romaji: "Shinōreijutsuin",
    en: "SPIRITUAL ARTS ACADEMY",
    layer: "soul-society",
    voice: "coarse",
    description: {
      tr: "Yamamoto'nun 2.100 yıl önce 元字塾 adıyla kurduğu okul; üç askerî kolun da öğrencisi buradan çıkar. Central 46'nın doğrudan denetiminde değildir. Rukongai'de hâlâ eski adıyla anılır: Shinigami Akademisi.",
      en: "The school Yamamoto founded 2,100 years ago as the 元字塾; students of all three military branches come out of it. It is not under Central 46's direct control. In Rukongai it is still called by its old name: the Shinigami Academy.",
    },
    scale: {
      tr: "≈2.100 yıl · Gotei 13, Onmitsukidō ve Kidō Birliği'ne öğrenci verir",
      en: "≈2,100 years · it feeds the Gotei 13, the Onmitsukidō and the Kidō Corps",
    },
    figures: [
      {
        name: "Genryūsai Shigekuni Yamamoto",
        note: {
          tr: "kurucu ve ilk büyük ustası",
          en: "founder and first grandmaster",
        },
      },
    ],
  },
  {
    id: "rukongai",
    kanji: "流魂街",
    romaji: "Rukongai",
    en: "WANDERING SOUL CITY",
    layer: "soul-society",
    voice: "coarse",
    description: {
      tr: "Duvarın dışı ve Soul Society'nin en kalabalık yeri: dört yöne seksener, toplam 320 bölge. Bir numara sakin ve yasalı; ellinciden sonra yaşam koşulları hızla düşer, elli dokuzuncunun ötesinde kimse ayakkabı giymez. Ruhlar öldükleri ana göre bir bilet alıp savrulur — buradaki aileler kan bağıyla kurulmaz.",
      en: "Outside the wall, and the most crowded part of Soul Society: eighty districts in each of the four quadrants, 320 in all. District 1 is calm and lawful; past the fiftieth, living standards fall away, and beyond the fifty-ninth nobody wears sandals. Souls are handed a ticket according to the moment they died and scattered — families here are not made of blood.",
    },
    scale: {
      tr: "320 bölge · 80. bölge en dip",
      en: "320 districts · the 80th is the bottom",
    },
    figures: [
      {
        name: "Junrinan",
        note: {
          tr: "潤林安 · Batı 1 — Hitsugaya ve Hinamori buradan",
          en: "潤林安 · West 1 — Hitsugaya and Hinamori are from here",
        },
      },
      {
        name: "Inuzuri",
        note: {
          tr: "戌吊 · Güney 78 — Rukia ve Renji burada büyüdü",
          en: "戌吊 · South 78 — Rukia and Renji grew up here",
        },
      },
      {
        name: "Kusajishi",
        note: {
          tr: "草鹿 · Kuzey 79 — Yachiru adını buradan aldı",
          en: "草鹿 · North 79 — Yachiru was named after it",
        },
      },
      {
        name: "Zaraki",
        note: {
          tr: "更木 · Kuzey 80, en dip — Kenpachi oradan çıktı",
          en: "更木 · North 80, the very bottom — Kenpachi came out of it",
        },
      },
    ],
  },
];
