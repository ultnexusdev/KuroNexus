import type { Localized } from "./types";

/**
 * BİN YILLIK KAN SAVAŞI — P12'nin verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki "Dönemler" halkasının karşılığı, ama bir halka değil
 * bir SAVAŞ. Asıl fikir renk: bölüm boyunca sayfa **siyahtan kana**
 * dönüyor. Dört durak, dört zemin — ve her durakta metin o zemine göre
 * yeniden ölçülmüş.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * `Quincy Blood War`, `Yhwach` ve `Quincy` sayfalarının wikitext'i.
 *
 * ⚠️ Sayılar bir üslup tercihi değil canon: Yhwach mühürlendikten sonra
 * **900** yılda nabzını, **90** yılda aklını, **9** yılda gücünü geri
 * aldı — ve Kaiser Gesang'ın ikinci kıtası "dokuz gün içinde dünyayı"
 * diyor. 900 · 90 · 9 · 9. Bölümün ritmi bu diziden çıkıyor.
 *
 * ⚠️ İki tarih ayrı: Yamamoto–Yhwach ilk karşılaşması **bin yıl önce**
 * (Mayuri bunu yüzüne söylüyor: "bin yıl önce onu öldürememen"), Quincy
 * soykırımı ise **iki yüz yıldan fazla** önce. Brief ikisini aynı satırda
 * anıyor; kayıt ayırıyor çünkü aralarında sekiz yüz yıl var.
 */

export interface WarEvent {
  id: string;
  /**
   * Zeminin hangi durakta olduğu (0–3).
   *
   * ⚠️ Bir renk değeri DEĞİL bir sıra numarası: renkler `globals.css`te
   * (kural 16), burada yalnızca hangi olayın hangi durağa düştüğü yazılı.
   */
  stage: 0 | 1 | 2 | 3;
  /** ÇEVRİLMEZ — sağ hizalı dev rakam */
  yearKanji: string;
  /** Rakamın altındaki okunur karşılık */
  yearLabel: Localized;
  /** ÇEVRİLMEZ — sayfanın imza sesi İngilizce */
  name: string;
  /** 2–3 cümle, arşivci sesi */
  text: Localized;
  /** Sayfa içi çapa; yalnızca hedef GERÇEKTEN varsa çiziliyor */
  anchor?: string;
}

export const WAR_EVENTS: readonly WarEvent[] = [
  {
    id: "first-clash",
    stage: 0,
    yearKanji: "千年前",
    yearLabel: { tr: "bin yıl önce", en: "a thousand years ago" },
    name: "YAMAMOTO — YHWACH",
    text: {
      tr: "Gotei 13'ün başkomutanı ile Quincy imparatoru ilk kez karşı karşıya geldi ve Yamamoto kazandı — ama öldüremedi. Mayuri bunu bin yıl sonra yüzüne söyleyecek: bugünkü her şeyin sebebi o eksik vuruş.",
      en: "The Captain-Commander of the Gotei 13 and the Quincy emperor met for the first time, and Yamamoto won — but did not kill. A thousand years later Mayuri says it to his face: everything happening now comes from that unfinished blow.",
    },
    anchor: "#gotei",
  },
  {
    id: "extermination",
    stage: 0,
    yearKanji: "二百年前",
    yearLabel: { tr: "iki yüz yıldan fazla önce", en: "over two hundred years ago" },
    name: "THE EXTERMINATION",
    text: {
      tr: "Soul Society Quincy'lerin çoğunu kılıçtan geçirdi. Gerekçe intikam değil denge: Quincy Hollow'u yok ediyor, yok edilen ruh geri dönmüyor ve dünyalar birbirine akmaya başlıyordu. Bir soykırımın gerekçesi bir denklemdi.",
      en: "Soul Society put most of the Quincy to the sword. The reason was not revenge but balance: a Quincy annihilates a Hollow, the annihilated soul never returns, and the worlds begin bleeding into one another. The justification for a genocide was an equation.",
    },
  },
  {
    id: "sealed-king",
    stage: 0,
    yearKanji: "九〇〇 · 九〇 · 九",
    yearLabel: { tr: "mühürlü kral", en: "the sealed king" },
    name: "THE SEALED KING",
    text: {
      tr: "Yenilen imparator gölgeye çekildi ve Wandenreich'i Soul Society'nin kendi gölgesinin içinde kurdu. Quincy halk anlatısı geri dönüşü tarif ediyordu: dokuz yüz yılda nabzı, doksan yılda aklı, dokuz yılda gücü. Kimse bunu bir takvim olarak okumadı.",
      en: "The defeated emperor withdrew into shadow and built the Wandenreich inside Soul Society's own shadow. Quincy folklore described the return: nine hundred years for his pulse, ninety for his mind, nine for his power. No one read it as a calendar.",
    },
    anchor: "#empire",
  },
  {
    id: "five-days",
    stage: 1,
    yearKanji: "五日",
    yearLabel: { tr: "beş gün", en: "five days" },
    name: "FIVE DAYS",
    text: {
      tr: "Savaş ilanı bir mektupla gelmedi: Yamamoto'nun odasında teğmeni Chōjirō Sasakibe bir mızrakla delindi ve maskeli adam Soul Society'nin beş günde yok edileceğini söyledi. Beş gün beklemediler.",
      en: "The declaration of war did not arrive by letter: in Yamamoto's own office his lieutenant Chōjirō Sasakibe was run through with a javelin, and a masked man announced that Soul Society would be destroyed in five days. They did not wait five days.",
    },
  },
  {
    id: "medallion",
    stage: 1,
    yearKanji: "卍解",
    yearLabel: { tr: "çalınan bankai", en: "the stolen bankai" },
    name: "THE MEDALLION",
    text: {
      tr: "Kaptanlar Bankai'larını açtı ve Sternritter avuç içi kadar madalyonları kaldırdı: Bankai sahibinin elinde dağıldı. Soul Society'nin en üst silahı bir anda düşmanın envanterine geçti — mühürlenmediler, ÇALINDILAR.",
      en: "The captains released their Bankai and the Sternritter raised medallions the size of a palm: the Bankai crumbled in its owner's hands. Soul Society's highest weapon passed into the enemy's inventory in an instant — they were not sealed, they were STOLEN.",
    },
    anchor: "#bankai",
  },
  {
    id: "zero-division",
    stage: 1,
    yearKanji: "零番隊",
    yearLabel: { tr: "sıfırıncı bölük", en: "the zero division" },
    name: "THE ZERO DIVISION",
    text: {
      tr: "Yamamoto öldü ve bin yıllık başkomutanlık bir günde bitti. Bunun üzerine bugüne kadar hiçbir tehdide karışmayan Sıfırıncı Bölük Reiōkyū'da toplandı: Aizen'in ordusuna kılını kıpırdatmayanlar, bu kez indi.",
      en: "Yamamoto died and a thousand years of command ended in a day. At that, the Zero Division — which had never intervened in any threat until then — assembled in the Reiōkyū: the ones who did not lift a finger against Aizen's army came down this time.",
    },
    anchor: "#hierarchy",
  },
  {
    id: "reforging",
    stage: 2,
    yearKanji: "斬月",
    yearLabel: { tr: "yeniden dövülen kılıç", en: "the reforged blade" },
    name: "THE REFORGING",
    text: {
      tr: "Ōetsu Nimaiya, Ichigo'ya yıllardır Zangetsu sandığı adamın aslında kendi Quincy gücünün sureti olduğunu söyledi. Kılıç yeniden dövüldü ve ortaya iki bıçak çıktı: biri Shinigami, diğeri Quincy. Ichigo'nun düşmanı kendi kanındaydı.",
      en: "Ōetsu Nimaiya told Ichigo that the man he had taken for Zangetsu all those years was in fact the shape of his own Quincy power. The sword was reforged and two blades came out of it: one Shinigami, one Quincy. Ichigo's enemy was in his own blood.",
    },
    anchor: "#zanpakuto",
  },
  {
    id: "nine-days",
    stage: 2,
    yearKanji: "九日",
    yearLabel: { tr: "dokuz gün", en: "nine days" },
    name: "NINE DAYS",
    text: {
      tr: "İkinci istilada Wandenreich Seireitei'yi kuşatmadı — yerine geçti. Silbern beyaz duvarların üstüne indi ve şehir ortadan kayboldu. Yhwach Kaiser Gesang'ın ikinci kıtasını okudu: dokuz yılda gücünü, dokuz günde dünyayı.",
      en: "In the second invasion the Wandenreich did not besiege the Seireitei — it took its place. Silbern came down over the white walls and the city simply vanished. Yhwach recited the second verse of the Kaiser Gesang: nine years for his power, nine days for the world.",
    },
    anchor: "#empire",
  },
  {
    id: "almighty",
    stage: 3,
    yearKanji: "全知全能",
    yearLabel: { tr: "her şeyi bilen", en: "the almighty" },
    name: "THE ALMIGHTY",
    text: {
      tr: "Yhwach adları veren Ichibē'yi yendi, Ruh Kralı'nı bıçakladı ve son darbeyi Ichigo'ya vurdurdu. Açtığı güç geleceğin tamamını görüyor ve gördüğü her sonucu değiştirebiliyordu — yani onu yenmenin yolu, onun göremediği bir an bulmaktı.",
      en: "Yhwach defeated Ichibē, the one who gives names, stabbed the Soul King, and made Ichigo strike the final blow. The power he unfolded saw the whole of the future and could rewrite every outcome it saw — so beating him meant finding the one moment he could not see.",
    },
  },
];
