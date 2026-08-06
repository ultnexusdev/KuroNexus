import type { CharacterOverlay } from "./types";

/**
 * 更木剣八 — Zaraki Kenpachi (AniList #909).
 *
 * Portre kanadının ilk elle tasarlanmış karakteri. Bölümler kullanıcının
 * gönderdiği referans düzeninden çıkarıldı: künye, hakkında, güç profili,
 * zanpakutō, önemli savaşlar, galeri, ikonik replikler, izleme rehberi,
 * ilişkiler.
 *
 * ⚠️ GALERİ ŞU AN BOŞ. Görseller kürator modundaki yükleme kutusundan
 * gönderilip dönen adres buraya yazılacak. AniList'in verdiği en büyük
 * karakter portresi ~230px olduğu için yüksek çözünürlüklü görsel bu yoldan
 * başka türlü gelemiyor (ölçüldü, 6 Ağustos 2026).
 */
export const ZARAKI_KENPACHI: CharacterOverlay = {
  characterId: 909,

  epigraph: {
    tr: "Savaşmadan yaşamanın ne anlamı var?",
    en: "What is the point of living without a fight?",
  },

  tags: [
    { tr: "Shinigami", en: "Shinigami" },
    { tr: "Gotei 13", en: "Gotei 13" },
    { tr: "11. Bölük Kaptanı", en: "Captain of the 11th Division" },
  ],

  facts: [
    { label: { tr: "Seri", en: "Series" }, value: { tr: "Bleach", en: "Bleach" } },
    {
      label: { tr: "İlk görünüm", en: "First appearance" },
      value: {
        tr: "Soul Society arkı — Bölüm 20",
        en: "Soul Society arc — Episode 20",
      },
    },
    { label: { tr: "Irk", en: "Race" }, value: { tr: "Shinigami", en: "Shinigami" } },
    {
      label: { tr: "Bağlılık", en: "Affiliation" },
      value: { tr: "Gotei 13", en: "Gotei 13" },
    },
    { label: { tr: "Bölük", en: "Division" }, value: { tr: "11. Bölük", en: "11th Division" } },
    { label: { tr: "Rütbe", en: "Rank" }, value: { tr: "Kaptan", en: "Captain" } },
    { label: { tr: "Durum", en: "Status" }, value: { tr: "Aktif", en: "Active" } },
    { label: { tr: "Zanpakutō", en: "Zanpakutō" }, value: { tr: "Nozarashi", en: "Nozarashi" } },
  ],

  about: [
    {
      tr: "Zaraki Kenpachi, Gotei 13'ün 11. Bölük kaptanı ve Soul Society'nin en korkulan savaşçılarından biri. Güçlü rakiplerle dövüşmeyi bir görev değil, yaşama sebebi olarak görüyor.",
      en: "Zaraki Kenpachi is the captain of the Gotei 13's 11th Division and one of Soul Society's most feared fighters. He treats fighting strong opponents not as a duty but as the reason to live.",
    },
    {
      tr: "Strateji ya da kurallar onu sınırlamaz; tek istediği en güçlü rakiple karşılaşmak ve onu aşmak. Bu yüzden gücünü uzun süre bilinçli olarak kısıtladı — dövüş çabuk bitmesin diye.",
      en: "Strategy and rules do not constrain him; all he wants is to meet the strongest opponent and surpass them. For years he deliberately held his own power back, so that fights would not end too quickly.",
    },
  ],

  stats: {
    title: { tr: "Güç Profili", en: "Power Profile" },
    rows: [
      { label: { tr: "Fiziksel güç", en: "Physical strength" }, value: 10, max: 10 },
      { label: { tr: "Dayanıklılık", en: "Endurance" }, value: 10, max: 10 },
      { label: { tr: "Hız", en: "Speed" }, value: 8, max: 10 },
      { label: { tr: "Zekâ / taktik", en: "Intelligence / tactics" }, value: 7, max: 10 },
      { label: { tr: "Reiatsu", en: "Reiatsu" }, value: 10, max: 10 },
    ],
  },

  abilities: {
    title: { tr: "Zanpakutō", en: "Zanpakutō" },
    cards: [
      {
        name: "Shikai — Nozarashi",
        release: { tr: "Yut onları, Nozarashi!", en: "Drink up, Nozarashi!" },
        summary: {
          tr: "Devasa kesme gücüne sahip bir balta/kılıç formuna dönüşür. Kenpachi'nin zaten aşırı yüksek olan fiziksel gücünü korkutucu bir seviyeye çıkarır.",
          en: "Transforms into a massive axe-like blade. It raises Kenpachi's already extreme physical power to a terrifying level.",
        },
        traits: [
          { tr: "Aşırı yıkıcı kesme gücü", en: "Overwhelming cutting power" },
          { tr: "Devasa alan hasarı", en: "Enormous area damage" },
          { tr: "Savunmaları parçalama yeteneği", en: "Shatters defences outright" },
          { tr: "Ham güce dayalı kullanım", en: "Built entirely on raw force" },
        ],
      },
      {
        name: "Bankai",
        summary: {
          tr: "Bankai formunda görünümü şeytani bir hâl alır: kırmızı ten, boynuz benzeri çıkıntılar ve kontrol edilmesi güç bir güç ortaya çıkar.",
          en: "In Bankai his appearance turns demonic — red skin, horn-like protrusions, and a power that is barely controllable.",
        },
        traits: [
          { tr: "Güçte dramatik artış", en: "Dramatic jump in raw power" },
          {
            tr: "Neredeyse durdurulamaz yakın dövüş",
            en: "Near-unstoppable close combat",
          },
          {
            tr: "Kendi bedenine zarar verebilecek enerji çıkışı",
            en: "Output strong enough to damage his own body",
          },
        ],
      },
    ],
  },

  battles: [
    {
      opponent: "Ichigo Kurosaki",
      arc: { tr: "Soul Society arkı", en: "Soul Society arc" },
      outcome: "DRAW",
      opponentCharacterId: 5,
    },
    {
      opponent: "Kaname Tōsen",
      arc: { tr: "Soul Society arkı", en: "Soul Society arc" },
      outcome: "WIN",
    },
    {
      opponent: "Nnoitra Gilga",
      arc: { tr: "Hueco Mundo arkı", en: "Hueco Mundo arc" },
      outcome: "WIN",
    },
    {
      opponent: "Gremmy Thoumeaux",
      arc: { tr: "Bin Yıllık Kan Savaşı", en: "Thousand-Year Blood War" },
      outcome: "WIN",
    },
    {
      opponent: "Retsu Unohana",
      arc: { tr: "Bin Yıllık Kan Savaşı", en: "Thousand-Year Blood War" },
      outcome: "WIN",
    },
  ],

  quotes: [
    {
      text: {
        tr: "Güçlü olan yaşar. Ben de güçlü olduğum için yaşıyorum.",
        en: "The strong live. I live because I am strong.",
      },
    },
    {
      text: {
        tr: "Dövüş bittiğinde hâlâ nefes alıyorsan, devam edebiliriz.",
        en: "If you are still breathing when the fight ends, we can keep going.",
      },
    },
    {
      text: { tr: "Acı mı? Bu sadece savaşın tadı.", en: "Pain? That is just the taste of battle." },
    },
    {
      text: {
        tr: "Hak etmeden kazanılan zafer, gerçek bir zafer değildir.",
        en: "A victory that was not earned is no victory at all.",
      },
    },
  ],

  // Kürator modundaki yükleme kutusundan gelen adresler buraya yazılacak.
  gallery: [],

  guide: {
    anime: [
      {
        range: { tr: "Bölüm 20–21", en: "Episodes 20–21" },
        note: { tr: "İlk tanıtım", en: "First appearance" },
      },
      {
        range: { tr: "Bölüm 36–41", en: "Episodes 36–41" },
        note: { tr: "Ichigo savaşı", en: "The fight with Ichigo" },
      },
      {
        range: { tr: "Bölüm 118–121", en: "Episodes 118–121" },
        note: { tr: "Nnoitra savaşının başlangıcı", en: "Nnoitra fight begins" },
      },
      {
        range: { tr: "Bölüm 198–202", en: "Episodes 198–202" },
        note: { tr: "Nnoitra savaşının finali", en: "Nnoitra fight concludes" },
      },
      {
        range: { tr: "Bleach: TYBW", en: "Bleach: TYBW" },
        note: {
          tr: "Unohana ve Gremmy savaşları",
          en: "The Unohana and Gremmy fights",
        },
      },
    ],
  },

  bonds: [
    {
      name: "Yachiru Kusajishi",
      summary: {
        tr: "En yakın yol arkadaşı. Kenpachi'nin nadir görülen yumuşak yönünü ortaya çıkaran tek kişi.",
        en: "His closest companion, and the only one who brings out the rare soft side of him.",
      },
    },
    {
      name: "Retsu Unohana",
      summary: {
        tr: "Kenpachi'yi yenebilen kişi ve onun gerçek potansiyeline ulaşmasını sağlayan karakter.",
        en: "The one person able to defeat him — and the reason he reached his true potential.",
      },
    },
    {
      name: "Ichigo Kurosaki",
      characterId: 5,
      summary: {
        tr: "İlk karşılaşmaları berabere bitti; Kenpachi o günden sonra ona bir rakipten fazlası olarak baktı.",
        en: "Their first clash ended in a draw; from that day Kenpachi saw him as more than an opponent.",
      },
    },
  ],
};
