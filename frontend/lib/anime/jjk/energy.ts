import type { Localized } from "./types";

/**
 * P02 · LANETLİ ENERJİ — on katmanlı model.
 *
 * Bölümün tezi: JJK'nin güç sistemi bir "seviye listesi" değil, üst üste
 * binen KURALLAR. Liste bilinçli olarak temelden zirveye sıralı: 呪力 →
 * 領域展開. Sıra değişirse merdiven anlatısı bozulur — yeniden sıralama
 * içerik kararıdır, refactor değil.
 *
 * Kaynak: kullanıcının onayladığı "Lanetli Arşiv v2" mockup'ı (30 Ağustos
 * 2026). `who` alanındaki kişi adları çevrilmez; `cost`/`body` çevrilir.
 */
export interface EnergyLayer {
  /** ÇEVRİLMEZ — kanji terim */
  jp: string;
  name: Localized;
  /** Bedel/eşik satırı — kayıt alanı, mono ile basılıyor */
  cost: Localized;
  /** Kimde görüldüğü — özel adlar çevrilmez, ortak adlar çevrilir */
  who: Localized;
  body: Localized;
}

export const ENERGY_LAYERS: readonly EnergyLayer[] = [
  {
    jp: "呪力",
    name: { tr: "Lanetli Enerji", en: "Cursed Energy" },
    cost: { tr: "sürekli sızıntı", en: "a constant leak" },
    who: { tr: "her insan", en: "every human" },
    body: {
      tr: "Negatif duygudan doğar ve bedende dolaşır. İnsanların büyük kısmı bu enerjiyi bilinçsizce sızdırır; toprağa sızan artık, zamanla biçim kazanıp lanetli ruha dönüşür. Büyücüyü sivilden ayıran şey enerjiye sahip olmak değil, akışını görebilmek ve tutabilmektir.",
      en: "It is born from negative emotion and circulates through the body. Most people leak it without knowing; the residue that seeps into the ground takes shape over time and becomes a cursed spirit. What separates a sorcerer from a civilian is not having the energy — it is seeing the flow and holding it.",
    },
  },
  {
    jp: "術式",
    name: { tr: "Lanet Tekniği", en: "Cursed Technique" },
    cost: { tr: "doğuştan sabit", en: "fixed at birth" },
    who: { tr: "büyücüler ve lanetler", en: "sorcerers and curses" },
    body: {
      tr: "Enerjinin kişiye özgü kullanım kalıbı. Kalıtsaldır, sonradan seçilemez ve neredeyse hiç değiştirilemez. Bu yüzden JJK dövüşleri güç yarışı değil, iki sabit kuralın birbirine karşı okunmasıdır.",
      en: "The personal pattern by which the energy is used. It is inherited, cannot be chosen later and almost never changes. This is why fights in JJK are not contests of strength but readings of two fixed rules against each other.",
    },
  },
  {
    jp: "反転術式",
    name: { tr: "Ters Lanet Tekniği", en: "Reverse Cursed Technique" },
    cost: { tr: "yüksek kontrol eşiği", en: "a high control threshold" },
    who: { tr: "Gojo, Sukuna, Yuta", en: "Gojo, Sukuna, Yuta" },
    body: {
      tr: "İki negatif enerjiyi çarpıştırarak pozitif enerji üretmek. Kendi bedeninde uygulamak dahi üst düzey akış kontrolü ister; başkasına uygulamak çok daha zordur. Bir büyücünün ölümlülüğünü belirleyen asıl eşik budur.",
      en: "Colliding two flows of negative energy to produce positive energy. Applying it to your own body already demands elite flow control; applying it to someone else is far harder. This is the threshold that decides how mortal a sorcerer really is.",
    },
  },
  {
    jp: "黒閃",
    name: { tr: "Siyah Şimşek", en: "Black Flash" },
    cost: { tr: "yalnızca doğru anda", en: "only in the exact moment" },
    who: { tr: "Yuji, Nanami, Todo", en: "Yuji, Nanami, Todo" },
    body: {
      tr: "Fiziksel vuruş ile lanetli enerjinin temasının 0.000001 saniye içinde çakışması. Hasarı yaklaşık 2.5 katına çıkarır. Etkisi çıkan hasardan çok sonrasındadır: enerji akışı büyücü için birden okunabilir hâle gelir.",
      en: "A physical blow and cursed energy meeting within 0.000001 seconds. It multiplies damage roughly 2.5 times — but the real effect comes after the hit: the flow of energy suddenly becomes legible to the sorcerer.",
    },
  },
  {
    jp: "縛り",
    name: { tr: "Bağlayıcı Yemin", en: "Binding Vow" },
    cost: { tr: "kalıcı kısıtlama", en: "a permanent restriction" },
    who: { tr: "Mechamaru, Kenjaku, Hakari", en: "Mechamaru, Kenjaku, Hakari" },
    body: {
      tr: "Bir şeyden vazgeçerek güç kazanma sözleşmesi. Kendine karşı gizlice ya da iki taraf arasında açıkça yapılabilir. Şart bozulduğunda bedel pazarlığa açık değildir.",
      en: "A contract that trades something away for power. It can be struck silently with yourself or openly between two parties. When the terms are broken, the price is not negotiable.",
    },
  },
  {
    jp: "天与呪縛",
    name: { tr: "Göksel Kısıtlama", en: "Heavenly Restriction" },
    cost: { tr: "mutlak takas", en: "an absolute trade" },
    who: { tr: "Toji, Maki", en: "Toji, Maki" },
    body: {
      tr: "Bedende doğuştan var olan takas. Lanetli enerjiden tamamen yoksun kalma karşılığında fiziksel olarak insanüstü olmak. Enerjisiz olduğu için lanetler tarafından görülmez; bu, tek başına bir teknikten daha tehlikelidir.",
      en: "A trade written into the body at birth: total absence of cursed energy in exchange for a superhuman physique. Having no energy means curses cannot perceive you — which is more dangerous than any single technique.",
    },
  },
  {
    jp: "極ノ番",
    name: { tr: "Azami Teknik", en: "Maximum Technique" },
    cost: { tr: "uzun hazırlık", en: "long preparation" },
    who: { tr: "Jogo, Sukuna", en: "Jogo, Sukuna" },
    body: {
      tr: "Bir tekniğin taşıyabildiği sınıra kadar yüklenmiş hâli. Genellikle hazırlık süresi, mesafe ve büyük enerji maliyeti gerektirir; isabet ederse alan genişlemesine yakın yıkım üretir.",
      en: "A technique loaded to the limit of what it can carry. It usually demands preparation time, distance and a huge cost of energy; when it lands, the destruction approaches that of a domain expansion.",
    },
  },
  {
    jp: "簡易領域",
    name: { tr: "Basit Alan", en: "Simple Domain" },
    cost: { tr: "hareket kısıtı", en: "restricted movement" },
    who: { tr: "Kyoto ekolü, Miwa", en: "the Kyoto school, Miwa" },
    body: {
      tr: "Beden çevresinde sabit yarıçapta bir alan kurmak. Alan genişlemesinin kesin isabetini iptal eder. Teknik değil, disiplinle öğrenilen bir savunma biçimidir.",
      en: "A fixed-radius field raised around the body. It cancels the sure-hit of a domain expansion. It is not a technique but a defensive form learned through discipline.",
    },
  },
  {
    jp: "領域展延",
    name: { tr: "Alan Yayılımı", en: "Domain Amplification" },
    cost: { tr: "aynı anda teknik yok", en: "no technique at the same time" },
    who: { tr: "Mahito, Kashimo", en: "Mahito, Kashimo" },
    body: {
      tr: "Alanın örtüsünü dışa açmak yerine bedene sarmak. Temas ettiği tekniği nötralize eder; teknik bağımlı rakiplere karşı sessiz bir karşı hamledir.",
      en: "Instead of unfolding the domain outward, the veil is wrapped around the body. It neutralises any technique it touches — a silent counter against technique-dependent opponents.",
    },
  },
  {
    jp: "領域展開",
    name: { tr: "Alan Genişlemesi", en: "Domain Expansion" },
    cost: { tr: "açık bedel", en: "an open price" },
    who: { tr: "özel derece", en: "special grade" },
    body: {
      tr: "Lanetli enerjiyle kapatılmış bir mekân yaratmak. İçindeki her şey alanın kuralına tabidir ve teknik kesin isabet eder. En büyük risk alanın kendisidir: iki alan çakıştığında daha rafine olan diğerini ezer.",
      en: "Sealing a space shut with cursed energy. Everything inside is subject to the domain's rule, and the technique cannot miss. The greatest risk is the domain itself: when two domains collide, the more refined one crushes the other.",
    },
  },
];
