import type { Localized } from "./types";

/**
 * P04 · JUJUTSU TOPLUMU — üç kurum, yirmi yedi dosya.
 *
 * Bölümün tezi: kurumlar bina değil, sorumluluk dağıtma biçimleri. Tokyo
 * bireyi, Kyoto geleneği, Karargâh ise sorumsuzluğu örgütlüyor. Kişi
 * satırındaki `line` bir biyografi değil, dosyanın kenar notu.
 *
 * ⚠️ Canon düzeltmesi (30 Ağustos 2026): mockup "Kenta Nanami" yazıyordu,
 * doğrusu **Kento Nanami** (fandom doğrulandı — Bleach'in "kadro listesine
 * güvenme" kuralı gereği tüm adlar tek tek kontrol edildi).
 */
export interface SocietyMember {
  /** ÇEVRİLMEZ */
  name: string;
  /** Resmî derece — kayıt alanı; "—" derecesiz demek */
  grade: Localized;
  /** Teknik adı: özel adlar çevrilmez, tanımlayıcılar çevrilir */
  tech: Localized;
  /** Alan adı ÇEVRİLMEZ ("Unlimited Void"); yoksa "—" */
  domain: string;
  status: Localized;
  line: Localized;
  /**
   * Karakter sayfası köprüsü — AniList kimliği. Sayfası olmayanlarda yok;
   * köprü `animeHref.character(id)` üzerinden kurulur (rota tek kaynaktan).
   */
  characterId?: number;
}

export interface SocietyBranch {
  key: "tokyo" | "kyoto" | "hq";
  /** ÇEVRİLMEZ — kurumun kanjisi */
  jp: string;
  /** ÇEVRİLMEZ — yerleşik ad */
  en: string;
  note: Localized;
  /** Kayıt sayaçları: [etiket, değer] — etiket çevrilir */
  stats: readonly { label: Localized; value: string }[];
  people: readonly SocietyMember[];
}

export const SOCIETY: readonly SocietyBranch[] = [
  {
    key: "tokyo",
    jp: "東京呪術高専",
    en: "Tokyo Jujutsu High",
    note: {
      tr: "Bireysellik teşvik edilir. Kadro küçüktür, kayıplar büyüktür.",
      en: "Individuality is encouraged. The roster is small; the losses are not.",
    },
    stats: [
      { label: { tr: "aktif öğrenci", en: "active students" }, value: "09" },
      { label: { tr: "özel derece", en: "special grade" }, value: "02" },
      { label: { tr: "öğretim kadrosu", en: "teaching staff" }, value: "04" },
    ],
    people: [
      {
        name: "Yuji Itadori",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "Sukuna'nın kabı", en: "Sukuna's vessel" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Ölmeyi hak eden kimse yok derken kendi ölümünü hesaba katmıyordu.",
          en: "When he said no one deserves to die, he was not counting his own death.",
        },
      },
      {
        name: "Megumi Fushiguro",
        grade: { tr: "2. Derece", en: "Grade 2" },
        tech: { tr: "On Gölge Tekniği", en: "Ten Shadows Technique" },
        domain: "Chimera Shadow Garden",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Kurtaracağı insanı seçtiğini kabul eden tek öğrenci.",
          en: "The only student who admits he chooses whom to save.",
        },
      },
      {
        name: "Nobara Kugisaki",
        grade: { tr: "3. Derece", en: "Grade 3" },
        tech: { tr: "Saman Bebek Tekniği", en: "Straw Doll Technique" },
        domain: "—",
        status: { tr: "Shibuya — durum belirsiz", en: "Shibuya — status unknown" },
        line: {
          tr: "Kendi kendine yeter olmayı Tokyo'ya gelmeden önce öğrenmişti.",
          en: "She had learned to be enough for herself long before Tokyo.",
        },
      },
      {
        name: "Maki Zenin",
        grade: { tr: "4. Derece", en: "Grade 4" },
        tech: { tr: "Göksel Kısıtlama", en: "Heavenly Restriction" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Resmî derecesi ile gerçek tehdit seviyesi arasındaki en büyük fark.",
          en: "The widest gap on record between official grade and actual threat.",
        },
      },
      {
        name: "Panda",
        grade: { tr: "2. Derece", en: "Grade 2" },
        tech: { tr: "Mutant Lanetli Ceset", en: "Mutated Cursed Corpse" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Yaga'nın yaptığı, kendi çekirdeğini geliştiren lanetli ceset.",
          en: "Yaga's creation — a cursed corpse that grows its own cores.",
        },
      },
      {
        name: "Toge Inumaki",
        grade: { tr: "2. Derece", en: "Grade 2" },
        tech: { tr: "Lanetli Söz", en: "Cursed Speech" },
        domain: "—",
        status: { tr: "aktif — yaralı", en: "active — injured" },
        line: {
          tr: "Konuştuğu her kelimenin bedelini kendi bedeni ödüyor.",
          en: "Every word he speaks is billed to his own body.",
        },
      },
      {
        name: "Yuta Okkotsu",
        grade: { tr: "Özel Derece", en: "Special Grade" },
        tech: { tr: "Kopyalama", en: "Copy" },
        domain: "Authentic Mutual Love",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Rika ile geçirdiği bir yıl onu okulun en tehlikeli öğrencisi yaptı.",
          en: "One year with Rika made him the most dangerous student in the school.",
        },
      },
      {
        name: "Kinji Hakari",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "Aylak Ölüm Kumarı", en: "Idle Death Gamble" },
        domain: "Idle Death Gamble",
        status: { tr: "uzaklaştırılmış", en: "suspended" },
        line: {
          tr: "Okuldan atıldı, sonra okulun en büyük kozu oldu.",
          en: "Expelled from the school, then became its strongest card.",
        },
      },
      {
        name: "Kirara Hoshi",
        grade: { tr: "—", en: "—" },
        tech: { tr: "Aşk Buluşması", en: "Love Rendezvous" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Kıyım Oyunu'nda Hakari'nin yanında kayda geçti.",
          en: "Entered the record at Hakari's side during the Culling Game.",
        },
      },
      {
        name: "Satoru Gojo",
        grade: { tr: "Özel Derece", en: "Special Grade" },
        tech: { tr: "Sınırsızlık / Altı Göz", en: "Limitless / Six Eyes" },
        domain: "Unlimited Void",
        status: { tr: "mühürlü", en: "sealed" },
        line: {
          tr: "Öğretmenlik yapma nedeni basitti: yanında güçlü müttefikler yetiştirmek.",
          en: "His reason for teaching was simple: to raise strong allies beside him.",
        },
        characterId: 127691,
      },
      {
        name: "Masamichi Yaga",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "Lanetli Ceset Kontrolü", en: "Cursed Corpse Control" },
        domain: "—",
        status: { tr: "infaz edildi", en: "executed" },
        line: {
          tr: "Panda'yı yapan müdür. Shibuya sonrası karargâh tarafından susturuldu.",
          en: "The principal who built Panda. Silenced by headquarters after Shibuya.",
        },
      },
      {
        name: "Shoko Ieiri",
        grade: { tr: "—", en: "—" },
        tech: { tr: "Ters Lanet Tekniği", en: "Reverse Cursed Technique" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Ters lanet tekniğini başkasına uygulayabilen sayılı kişiden biri.",
          en: "One of the few who can apply reverse cursed technique to others.",
        },
      },
      {
        name: "Atsuya Kusakabe",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "Yeni Gölge Stili", en: "New Shadow Style" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Alan kurmaz; basit alanla kurulmuş alanı boşa çıkarır.",
          en: "He raises no domain; with simple domain he voids everyone else's.",
        },
      },
    ],
  },
  {
    key: "kyoto",
    jp: "京都呪術高専",
    en: "Kyoto Jujutsu High",
    note: {
      tr: "Gelenek ve aile hiyerarşisi. Kadro Tokyo'dan büyük, inisiyatif daha küçük.",
      en: "Tradition and family hierarchy. A larger roster than Tokyo, with less initiative.",
    },
    stats: [
      { label: { tr: "aktif öğrenci", en: "active students" }, value: "06" },
      { label: { tr: "özel derece", en: "special grade" }, value: "00" },
      { label: { tr: "öğretim kadrosu", en: "teaching staff" }, value: "02" },
    ],
    people: [
      {
        name: "Aoi Todo",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "Boogie Woogie", en: "Boogie Woogie" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Kadın tipi sorusu bir sohbet değil, ittifak testidir.",
          en: "His 'type of woman' question is not small talk — it is an alliance test.",
        },
      },
      {
        name: "Noritoshi Kamo",
        grade: { tr: "Yarı 1. Derece", en: "Semi-Grade 1" },
        tech: { tr: "Kan Kontrolü", en: "Blood Manipulation" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Kamo adının ağırlığını taşımak zorunda bırakılmış öğrenci.",
          en: "A student made to carry the weight of the Kamo name.",
        },
      },
      {
        name: "Mai Zenin",
        grade: { tr: "3. Derece", en: "Grade 3" },
        tech: { tr: "İnşa Tekniği", en: "Construction Technique" },
        domain: "—",
        status: { tr: "vefat etti", en: "deceased" },
        line: {
          tr: "Ürettiği tek kurşun ikizinin gücünü belirledi.",
          en: "The single bullet she made decided her twin's strength.",
        },
      },
      {
        name: "Kasumi Miwa",
        grade: { tr: "3. Derece", en: "Grade 3" },
        tech: { tr: "Yeni Gölge Stili", en: "New Shadow Style" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Yeteneğinden çok dayanıklılığıyla ayakta kalan sıradan kılıç.",
          en: "An ordinary sword kept standing by endurance more than talent.",
        },
      },
      {
        name: "Momo Nishimiya",
        grade: { tr: "3. Derece", en: "Grade 3" },
        tech: { tr: "Kara Kuş Kontrolü", en: "Crow Manipulation" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Havadan gözlem ve nakil; ekibin görmeyen gözü.",
          en: "Aerial watch and courier work — the team's unseen eye.",
        },
      },
      {
        name: "Kokichi Muta",
        grade: { tr: "Yarı 1. Derece", en: "Semi-Grade 1" },
        tech: {
          tr: "Kukla Kontrolü / Göksel Kısıtlama",
          en: "Puppet Manipulation / Heavenly Restriction",
        },
        domain: "—",
        status: { tr: "vefat etti", en: "deceased" },
        line: {
          tr: "Mechamaru. Bedeninin bedelini bir bağlayıcı yeminle ödedi.",
          en: "Mechamaru. He paid for a body with a binding vow.",
        },
      },
      {
        name: "Utahime Iori",
        grade: { tr: "Yarı 1. Derece", en: "Semi-Grade 1" },
        tech: { tr: "destek — solo takım", en: "support — Solo Solo Unit" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Gojo'nun tek dinlediği eleştiri kaynağı.",
          en: "The one source of criticism Gojo actually hears.",
        },
      },
      {
        name: "Yoshinobu Gakuganji",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "ses ile enerji aktarımı", en: "cursed energy through sound" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Müdür ve karargâh yaşlılarından biri; iki masada oturur.",
          en: "Principal and one of the elders — he sits at both tables.",
        },
      },
    ],
  },
  {
    key: "hq",
    jp: "総監部",
    en: "Jujutsu Headquarters",
    note: {
      tr: "Kararlar burada alınır; sorumluluk hiçbir zaman burada kalmaz.",
      en: "Decisions are made here; responsibility never stays.",
    },
    stats: [
      { label: { tr: "yetkililer", en: "officials" }, value: "∞" },
      { label: { tr: "büyük aileler", en: "great clans" }, value: "03" },
      { label: { tr: "hesap verebilirlik", en: "accountability" }, value: "00" },
    ],
    people: [
      {
        name: "Kento Nanami",
        grade: { tr: "1. Derece", en: "Grade 1" },
        tech: { tr: "Oran Tekniği", en: "Ratio Technique" },
        domain: "—",
        status: { tr: "vefat etti — Shibuya", en: "deceased — Shibuya" },
        line: {
          tr: "Yetişkin olmanın anlamını en net anlatan karakter.",
          en: "No one in the story explains adulthood more clearly.",
        },
      },
      {
        name: "Naobito Zenin",
        grade: { tr: "Özel Derece", en: "Special Grade" },
        tech: { tr: "İzdüşüm Büyüsü", en: "Projection Sorcery" },
        domain: "—",
        status: { tr: "vefat etti — Shibuya", en: "deceased — Shibuya" },
        line: {
          tr: "Zenin ailesinin başı; ailesini kendinden sonra düşünmedi.",
          en: "Head of the Zenin clan; his family came second to himself.",
        },
      },
      {
        name: "Kiyotaka Ijichi",
        grade: { tr: "4. Derece", en: "Grade 4" },
        tech: { tr: "Perde (帳) kurulumu", en: "raising the curtain (帳)" },
        domain: "—",
        status: { tr: "aktif", en: "active" },
        line: {
          tr: "Perdeyi kuran adam. Arşivin görünmez altyapısı.",
          en: "The man who raises the curtain — the archive's invisible plumbing.",
        },
      },
      {
        name: "Kenjaku",
        grade: { tr: "sınıflandırma dışı", en: "unclassifiable" },
        tech: {
          tr: "Yerçekimi Karşıtı Düzen / beden değiştirme",
          en: "Antigravity System / body hopping",
        },
        domain: "—",
        status: { tr: "sızmış", en: "embedded" },
        line: {
          tr: "Bin yıldır karargâhın içinde bekleyen asıl plan.",
          en: "The real plan, waiting inside headquarters for a thousand years.",
        },
      },
      {
        name: "Yuki Tsukumo",
        grade: { tr: "Özel Derece", en: "Special Grade" },
        tech: { tr: "Yıldız Öfkesi", en: "Star Rage" },
        domain: "—",
        status: { tr: "vefat etti", en: "deceased" },
        line: {
          tr: "Sistemi düzeltmek yerine lanetlerin kaynağını kurutmayı önerdi.",
          en: "She proposed drying up the source of curses instead of patching the system.",
        },
      },
      {
        name: "Suguru Geto",
        grade: { tr: "Özel Derece", en: "Special Grade" },
        tech: { tr: "Lanet Ruh Kontrolü", en: "Cursed Spirit Manipulation" },
        domain: "—",
        status: { tr: "ölü — beden gasp edildi", en: "dead — body stolen" },
        line: {
          tr: "Karargâhın ürettiği en tutarlı düşman.",
          en: "The most coherent enemy headquarters ever produced.",
        },
      },
    ],
  },
];
