import type { Localized } from "./types";

/**
 * HOLLOW EVRİMİ — P07'nin verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Brief'in cümlesi: **"Evrim şeması bir ağaç değil, bir maskenin
 * kırılmasıdır."** Naruto Evreni'nde bunun karşılığı yok; bu tamamen
 * Bleach'e özgü. Yedi aşama bir soyağacı gibi dallanmıyor, tek bir nesnenin
 * başına gelenler gibi sıralanıyor: maske takılır, devleşir, daralır,
 * çatlar, kırılır ve geriye bir parça kalır.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * `bleach.fandom.com/api.php?action=parse&page=<AD>&prop=wikitext`.
 *
 * ⚠️ Kanji'ler tek başına bir tasarım hediyesi çıktı: üç Menos sınıfı aynı
 * 大虚 çekirdeğini paylaşıp önüne bir derece ekliyor —
 * **最下**大虚 (en alt) → **中級**大虚 (orta) → **最上**大虚 (en üst).
 * Hiyerarşi kelimenin kendi içinde yazılı; bölüm bunu göstermeden geçemezdi.
 *
 * ⚠️ Doğrulama yine düzeltti: Gillian'ın kanji'si "ギリアン" DEĞİL
 * **最下大虚** (ギリアン yalnızca okunuşu). Aynısı Adjuchas ve Vasto Lorde
 * için de geçerli — katakana ad, kanji sınıf.
 *
 * ── BİLİNMEYEN UYDURULMADI ───────────────────────────────────────────────
 * Bir Adjuchas'ın Vasto Lorde'a nasıl dönüştüğü canon'da **hiç
 * açıklanmadı**. `rule` alanı bunu açıkça yazıyor; Grimmjow'un ekibinin
 * varsayımı bir kayıt değil, o yüzden kaydın içine girmiyor.
 */

export interface HollowFigure {
  /** ÇEVRİLMEZ — özel ad */
  name: string;
  note: Localized;
}

export interface HollowStage {
  id: string;
  /** Sınıfın kanji'si — çevrilmez */
  kanji: string;
  /** Katakana okunuş (varsa); kanji'nin ALTINDA, ondan küçük */
  kana?: string;
  romaji: string;
  /** ÇEVRİLMEZ — sayfanın imza sesi İngilizce (Jost caps) */
  en: string;
  description: Localized;
  /**
   * Bu aşamadan çıkışın KURALI — evrimin bedeli.
   *
   * Bölümün asıl bilgisi burada: Hollow evrimi bir merdiven değil, her
   * basamağı bir yasakla korunan bir dar geçit. "Yemeyi bırakırsan
   * düşersin", "bir parçan yenirse orada bitersin". Açıklamadan ayrı
   * duruyor çünkü tipografide de ayrı duruyor.
   */
  rule?: Localized;
  figures: HollowFigure[];
}

export const HOLLOW_STAGES: readonly HollowStage[] = [
  {
    id: "plus",
    kanji: "整",
    kana: "プラス",
    romaji: "Purasu",
    en: "PLUS",
    description: {
      tr: "Ölmüş ama gitmemiş bir ruh. Göğsünden çıkan 因果の鎖 onu bedenine ve geride bıraktığına bağlar; bağ koptuğunda zincir yavaş yavaş çürümeye başlar. Bir Shinigami zamanında gelip konsō yapmazsa çürüme sonuna kadar gider.",
      en: "A soul that has died but has not left. The 因果の鎖 running from its chest binds it to its body and to what it left behind; once that bond is cut the chain begins to corrode. If no Shinigami arrives in time to perform konsō, the corrosion runs its course.",
    },
    rule: {
      tr: "侵食 — çürümenin adı. Zincirin son halkası göğse ulaştığında ruh yarılır.",
      en: "侵食 — the name of the corrosion. When the last link reaches the chest, the soul tears open.",
    },
    figures: [
      {
        name: "Sora Inoue",
        note: {
          tr: "Kız kardeşine bağlı kaldı; onu ilk kurbanı yapan şey tam olarak o bağdı.",
          en: "He stayed bound to his sister — and that very bond made her his first victim.",
        },
      },
    ],
  },
  {
    id: "hollow",
    kanji: "虚",
    kana: "ホロウ",
    romaji: "Horō",
    en: "HOLLOW",
    description: {
      tr: "Zincirin koptuğu yerde bir delik kalır ve o delik kalbin durduğu yerdir. Maske yüzü bütünüyle kapatır: içeride kimin olduğu artık okunamaz. Açlık yalnızca ruh yiyerek bastırılabilir ve çoğu Hollow en çok sevdiğinden başlar.",
      en: "Where the chain tore away, a hole remains — and the hole is where the heart used to be. The mask closes over the whole face: who is inside can no longer be read. The hunger can only be quieted by devouring souls, and most Hollows begin with whoever they loved most.",
    },
    figures: [
      {
        name: "Acidwire",
        note: {
          tr: "アシッドワイヤー · Sora Inoue'nin Hollow hâli",
          en: "アシッドワイヤー · Sora Inoue's Hollow form",
        },
      },
    ],
  },
  {
    id: "gillian",
    kanji: "最下大虚",
    kana: "ギリアン",
    romaji: "Girian",
    en: "GILLIAN",
    description: {
      tr: "Bir Hollow'un içindeki boşluk insan ruhlarıyla doyamayacak kadar büyüdüğünde kendi türünü yemeye başlar. Birbirini yiyen yüzlerce Hollow tek bir gövdede birleşir. Devasadırlar, yavaştırlar ve hepsi birbirinin aynısıdır — Soul Society'nin ders kitaplarında “Menos” denince kastedilen budur.",
      en: "When the void inside a Hollow grows too large for human souls to fill, it starts eating its own kind. Hundreds of mutually devouring Hollows fuse into a single body. They are enormous, slow, and identical to one another — this is what Soul Society's textbooks mean when they say “Menos”.",
    },
    rule: {
      tr: "Yüzlerce Hollow, tek gövde. Bireysel irade henüz yok: hepsi aynı yüzü taşıyor.",
      en: "Hundreds of Hollows, one body. No individual will yet: they all wear the same face.",
    },
    figures: [
      {
        name: "Aaroniero Arruruerie",
        note: {
          tr: "Dokuzuncu Espada; 十刃'ın Gillian sınıfından gelen tek üyesi",
          en: "The Ninth Espada; the only member of the 十刃 of Gillian class",
        },
      },
    ],
  },
  {
    id: "adjuchas",
    kanji: "中級大虚",
    kana: "アジューカス",
    romaji: "Ajūkasu",
    en: "ADJUCHAS",
    description: {
      tr: "Gillian'ı oluşturan yüzlerce bilinçten biri diğerlerini bastırabilirse gövde küçülür, akıl keskinleşir ve Adjuchas doğar. Sayıları azdır, çoğu yalnız yaşar ve Gillian sürülerini savaşa onlar sürer.",
      en: "If one of the hundreds of minds that make up a Gillian can suppress the others, the body shrinks, the intellect sharpens, and an Adjuchas is born. They are few, mostly solitary, and it is they who lead the Gillian into battle.",
    },
    rule: {
      tr: "Durmak yok: yemeyi bıraktığı an bastırdığı bilinçler geri döner ve Gillian'a düşer — düşen bir daha çıkamaz. Bedeninden bir parça yenirse evrim orada biter.",
      en: "No stopping: the moment it stops devouring, the suppressed minds return and it falls back to Gillian — and what falls never rises again. If any part of its body is eaten, the evolution ends there.",
    },
    figures: [
      {
        name: "Grimmjow Jaegerjaquez",
        note: {
          tr: "Arrancar olmadan önce panter biçimli bir Adjuchas'tı ve bir sürünün başındaydı",
          en: "Before he was an Arrancar he was a panther-like Adjuchas, at the head of a pack",
        },
      },
    ],
  },
  {
    id: "vasto-lorde",
    kanji: "最上大虚",
    kana: "ヴァストローデ",
    romaji: "Vasuto Rōde",
    en: "VASTO LORDE",
    description: {
      tr: "Evrimin en üstü ve en nadiri: Hueco Mundo'daki sayılarının bir elin parmaklarını geçmediği söylenir. Devleşme burada tersine döner ve insan boyuna inerler — güç arttıkça biçim küçülür. Bir Vasto Lorde'un savaş gücü Gotei 13 kaptanlarının üstünde sayılır.",
      en: "The top of the evolution and the rarest of it: their number in all of Hueco Mundo is said to fit on one hand. Here the growing reverses and they shrink to human size — the more power, the smaller the form. A Vasto Lorde's combat strength is reckoned above that of the Gotei 13's captains.",
    },
    rule: {
      tr: "Bir Adjuchas'ın buraya nasıl çıktığı canon'da hiç açıklanmadı. Kayıt yok.",
      en: "How an Adjuchas reaches this stage was never explained in canon. No record.",
    },
    figures: [
      {
        name: "Tier Harribel",
        note: {
          tr: "Üçüncü Espada; Vasto Lorde olduğu doğrulanmış birkaç addan biri",
          en: "The Third Espada; one of the few confirmed to have been a Vasto Lorde",
        },
      },
    ],
  },
  {
    id: "arrancar",
    kanji: "破面",
    kana: "アランカル",
    romaji: "Arankaru",
    en: "ARRANCAR",
    description: {
      tr: "Maskeyi yırtıp atmak. Arrancar bir Hollow'un maskesini kendi eliyle sökmesiyle doğar; geriye insansı bir beden, Shinigami'ninkine benzer güçler ve maskeden bir parça kalır. Aizen'in Hōgyoku'su bu geçişi zorlanabilir hâle getirene kadar tam gelişmiş Arrancar neredeyse yoktu.",
      en: "Tearing the mask off. An Arrancar is born when a Hollow removes its own mask; what remains is a humanoid body, powers close to a Shinigami's, and a fragment of the mask. Until Aizen's Hōgyoku made the crossing forceable, fully developed Arrancar were almost unheard of.",
    },
    rule: {
      tr: "破面 — “yırtılmış maske”. Kalan parça hâlâ kimin ne olduğunu söylüyor.",
      en: "破面 — “ripped mask”. The remaining fragment still says what someone was.",
    },
    figures: [
      {
        name: "Ulquiorra Cifer",
        note: {
          tr: "Kalan maskesi başının sol üstünde kırık boynuzlu bir miğfer; deliği göğüs kemiğinde",
          en: "His mask remnant is a broken horned helmet on the upper left of his head; his hole sits on the sternum",
        },
      },
    ],
  },
  {
    id: "espada",
    kanji: "十刃",
    kana: "エスパーダ",
    romaji: "Esupāda",
    en: "ESPADA",
    description: {
      tr: "Aizen'in ordusundaki en güçlü on Arrancar. Numaralar 0'dan 9'a iner ve numara küçüldükçe reiryoku büyür; her biri numarasını bedeninin bir yerinde dövme olarak taşır. Baraggan'ın cümlesi: her biri ölümün ayrı bir biçimine hükmeder.",
      en: "The ten strongest Arrancar in Aizen's army. The numbers run from 0 to 9 and the lower the number the greater the reiryoku; each carries their number tattooed somewhere on the body. In Baraggan's words: each of them holds dominion over a different form of death.",
    },
    rule: {
      tr: "十刃 — “on kılıç”. Maskeden kalan parça ile dövme yan yana durur: biri neydin, diğeri nesin.",
      en: "十刃 — “ten blades”. The mask fragment and the tattoo sit side by side: one says what you were, the other what you are.",
    },
    figures: [
      {
        name: "Coyote Starrk",
        note: {
          tr: "Bir · dövmesi sol elinin üstünde",
          en: "One · his tattoo is on the back of his left hand",
        },
      },
      {
        name: "Grimmjow Jaegerjaquez",
        note: {
          tr: "Altı · dövmesi belinin altında",
          en: "Six · his tattoo is on his lower back",
        },
      },
    ],
  },
];
