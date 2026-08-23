import type { Localized } from "./types";

/**
 * BLEACH EFSANELERİ — P13'ün verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı **numaralı** bir kart dizisi (01, 02,
 * 03…). Burada numara YOK ve bu bilinçli: on isim arasında bir sıra değil
 * bir **denge** var. Üç dünyayı tutan on ağırlık; hangisinin daha ağır
 * olduğu sorusu bu kaydın sorusu değil.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * Kanji adlar ve Zanpakutō/Bankai alanları her karakterin kendi
 * sayfasından okundu.
 *
 * ⚠️ İki "kayıt yok" burada da duruyor ve gizlenmiyor:
 *   • **Aizen'in Bankai'ı canon'da hiç açıklanmadı.**
 *   • **Kenpachi'nin Bankai'ı adsız** — var, ama adı yok.
 * `divisions.ts`teki aynı kural: bilmediğini söylemek bir eksiklik değil.
 *
 * ⚠️ Brief Aizen'in künyesine "Sonsuz Hüzün" yazıyor; canon'da böyle bir
 * unvan bulunamadı. Yerine Kyōka Suigetsu'nun canon'daki yeteneği
 * kullanıldı: **完全催眠**, tam hipnoz. Uydurma bir unvan, doğru bir
 * yetenekten daha zayıf.
 *
 * ── ⚠️ REİATSU RENGİ: VERİ, TOKEN DEĞİL ─────────────────────────────────
 * Kural 16 istisnası, `divisions.ts` ve `espada.ts` ile aynı sınıf: renk
 * temanın değil KARAKTERİN. Değerler brief'ten geldi ve olduğu gibi
 * korundu.
 *
 * ⚠️ İkisi neredeyse siyah — Yhwach `#1A1A20` ve Ichibē `#0A0A0A`. Koyu
 * zeminde %12 karışım neredeyse hiçbir şey yapmıyor ve bu **doğru**:
 * biri gölge, diğeri mürekkep. Atmosferin onlarda susması bir arıza değil,
 * karakterin kendisi.
 */

export interface LegendRecord {
  /** `legendSlotId()` ile aynı — portre yuvası buradan bulunuyor */
  slug: string;
  /** ÇEVRİLMEZ */
  kanji: string;
  /** ÇEVRİLMEZ */
  name: string;
  /** Tek satırlık unvan */
  epithet: Localized;
  /** 3 cümle */
  bio: Localized;
  /** Zanpakutō / güç etiketleri — ÇEVRİLMEZ özel adlar */
  tags: string[];
  /** ⚠️ VERİ, token değil */
  reiatsu: string;
}

export const LEGEND_RECORDS: readonly LegendRecord[] = [
  {
    slug: "ichigo-kurosaki",
    kanji: "黒崎一護",
    name: "ICHIGO KUROSAKI",
    epithet: { tr: "死神代行 · Vekil Shinigami", en: "死神代行 · Substitute Soul Reaper" },
    bio: {
      tr: "Ne tam Shinigami, ne tam insan, ne tam Quincy, ne tam Hollow — dördü birden. Rukia'nın gücünü ödünç aldığı gece başlayan hikâye, kendi kanındaki dört mirasın hesaplaşmasına döndü. Sonunda kimseyi kurtarmak için değil, kimsenin kaybetmemesi için savaştı.",
      en: "Not fully Shinigami, not fully human, not fully Quincy, not fully Hollow — all four at once. The story that began the night he borrowed Rukia's power became a reckoning with the four inheritances in his own blood. In the end he fought not to save anyone, but so that no one would be lost.",
    },
    tags: ["斬月 Zangetsu", "天鎖斬月 Tensa Zangetsu"],
    reiatsu: "#1E4C8A",
  },
  {
    slug: "sousuke-aizen",
    kanji: "藍染惣右介",
    name: "SŌSUKE AIZEN",
    epithet: { tr: "完全催眠 · Tam Hipnoz", en: "完全催眠 · Complete Hypnosis" },
    bio: {
      tr: "Yüz yıldan uzun süre Soul Society'nin en güvenilir kaptanıydı ve bunun tamamı hazırlıktı. Kyōka Suigetsu bir kez görülünce artık hiçbir şey görülemez: kılıcın yeteneği yaralamak değil, beş duyuyu birden ele geçirmek. Tahtta oturanların olmadığını fark ettiğinde, boş tahta kendisi oturmaya karar verdi.",
      en: "For more than a century he was Soul Society's most trusted captain, and all of it was preparation. Once Kyōka Suigetsu has been seen, nothing can be seen again: the blade's gift is not wounding but seizing all five senses at once. When he realised no one was sitting on the throne, he decided to sit there himself.",
    },
    tags: ["鏡花水月 Kyōka Suigetsu", "崩玉 Hōgyoku"],
    reiatsu: "#6B4E9E",
  },
  {
    slug: "genryusai-yamamoto",
    kanji: "山本元柳斎重國",
    name: "GENRYŪSAI YAMAMOTO",
    epithet: { tr: "総隊長 · Başkomutan", en: "総隊長 · Captain-Commander" },
    bio: {
      tr: "Akademi'yi 2.100 yıl önce kurdu ve Gotei 13'ün başında bin yüz yıl durdu. Ryūjin Jakka bilinen en güçlü ateş türü Zanpakutō ve onu çekmesi çoğu zaman gereksizdi — varlığı yetiyordu. Bin yıl önce Yhwach'ı yendi ama öldürmedi; bugünkü savaşın faturası o eksik vuruşa kesildi.",
      en: "He founded the Academy 2,100 years ago and stood at the head of the Gotei 13 for eleven hundred years. Ryūjin Jakka is the strongest known fire-type Zanpakutō, and most of the time drawing it was unnecessary — his presence sufficed. A thousand years ago he beat Yhwach but did not kill him; the bill for this war was written against that unfinished blow.",
    },
    tags: ["流刃若火 Ryūjin Jakka", "残火の太刀 Zanka no Tachi"],
    reiatsu: "#C4341A",
  },
  {
    slug: "yhwach",
    kanji: "ユーハバッハ",
    name: "YHWACH",
    epithet: { tr: "Mühürlü Kral", en: "The Sealed King" },
    bio: {
      tr: "Ruh Kralı'nın oğlu ve bütün Quincy'lerin atası: gücünü paylaştırarak bir ırk yarattı ve sonra Auswählen ile geri aldı. Dokuz yüz yılda nabzını, doksan yılda aklını, dokuz yılda gücünü kazandı. Açtığı Kutsanmış Hâl geleceğin tamamını görüyor ve gördüğü her sonucu yeniden yazabiliyordu.",
      en: "Son of the Soul King and forefather of every Quincy: he created a race by distributing his power, then took it back with Auswählen. Nine hundred years for his pulse, ninety for his mind, nine for his power. The Almighty he unfolded saw the whole of the future and could rewrite every outcome it saw.",
    },
    tags: ["全知全能 The Almighty", "聖別 Auswählen"],
    reiatsu: "#1A1A20",
  },
  {
    slug: "kisuke-urahara",
    kanji: "浦原喜助",
    name: "KISUKE URAHARA",
    epithet: { tr: "技術開発局'un kurucusu", en: "Founder of the R&D Institute" },
    bio: {
      tr: "On İkinci Bölük'ün kaptanıydı ve Shinigami Araştırma Enstitüsü'nü o kurdu; Hōgyoku'yu da o yaptı. Aizen'in Hollowfication deneyleri yüzünden suçlanıp sürgüne gönderildi ve Karakura'da bir şekerci dükkânı açtı. Savaşın hemen her dönüm noktasında elinden çıkmış bir alet vardır — çoğu zaman kimse onu istemeden önce hazırlanmıştır.",
      en: "He was captain of the Twelfth Division, founded the Shinigami Research Institute, and made the Hōgyoku. Blamed for Aizen's Hollowfication experiments, he was exiled and opened a sweet shop in Karakura. At nearly every turning point of the war there is a device that came from his hands — usually prepared before anyone asked for it.",
    },
    tags: ["紅姫 Benihime", "観音開紅姫改メ Kannonbiraki Benihime Aratame"],
    reiatsu: "#8E1F2B",
  },
  {
    slug: "kenpachi-zaraki",
    kanji: "更木剣八",
    name: "KENPACHI ZARAKI",
    epithet: { tr: "剣八 · unvanın kendisi", en: "剣八 · the title itself" },
    bio: {
      tr: "Rukongai'nin en dip bölgesinden, seksen numaradan geldi ve adını oradan aldı. “Kenpachi” bir isim değil bir unvan: en çok öldürene veriliyor ve onu kılıç dersi almadan kazandı. Bankai'ı var — ama adı canon'da hiç söylenmedi.",
      en: "He came from the very bottom of Rukongai, district eighty, and took his name from it. “Kenpachi” is not a name but a title: it goes to whoever has killed the most, and he won it without a single sword lesson. He has a Bankai — but its name was never spoken in canon.",
    },
    /* ⚠️ "Bankai · kayıt yok" ETİKETİ KALDIRILDI. `tags` çevrilmeyen özel
       adlar için ve oraya Türkçe bir ibare koymak İngilizce sayfaya da
       Türkçe basılması demekti (SSR çıktısında yakalandı). Bankai'ın adsız
       olduğu bilgisi zaten iki dilde de biyografide duruyor. */
    tags: ["野晒 Nozarashi"],
    reiatsu: "#D9C89A",
  },
  {
    slug: "byakuya-kuchiki",
    kanji: "朽木白哉",
    name: "BYAKUYA KUCHIKI",
    epithet: { tr: "朽木家当主 · Kuchiki hanesinin reisi", en: "朽木家当主 · Head of the Kuchiki house" },
    bio: {
      tr: "Dört asil haneden birinin reisi ve Altıncı Bölük'ün kaptanı; yasayı kendi ailesinin üstünde tutmaya yeminli. Rukia'yı evlat edinmesi o yemini bir kez çiğnemesiydi, idamına karşı çıkmaması ikinci kez çiğnememek içindi. Senbonzakura bin yaprağa ayrılıyor ve her yaprak bir bıçak.",
      en: "Head of one of the four noble houses and captain of the Sixth Division, sworn to hold the law above his own family. Adopting Rukia was breaking that oath once; not opposing her execution was refusing to break it twice. Senbonzakura scatters into a thousand petals, and every petal is a blade.",
    },
    tags: ["千本桜 Senbonzakura", "千本桜景厳 Senbonzakura Kageyoshi"],
    reiatsu: "#C2536B",
  },
  {
    slug: "rukia-kuchiki",
    kanji: "朽木ルキア",
    name: "RUKIA KUCHIKI",
    epithet: { tr: "十三番隊隊長", en: "Captain of the Thirteenth Division" },
    bio: {
      tr: "Inuzuri'de, Güney Rukongai'nin yetmiş sekizinci bölgesinde büyüdü ve asil bir haneye evlatlık gitti. Bütün hikâyeyi başlatan karar onunki: gücünü bir insana verdi ve bunun cezası idamdı. Sode no Shirayuki en güzel Zanpakutō sayılıyor; Bankai'ı bir alanı mutlak sıfıra indiriyor.",
      en: "She grew up in Inuzuri, the seventy-eighth district of South Rukongai, and was adopted into a noble house. The decision that begins the whole story is hers: she gave her power to a human, and the sentence for that was death. Sode no Shirayuki is reckoned the most beautiful Zanpakutō; her Bankai takes an area to absolute zero.",
    },
    tags: ["袖白雪 Sode no Shirayuki", "白霞罸 Hakka no Togame"],
    reiatsu: "#DCEAF2",
  },
  {
    slug: "shunsui-kyoraku",
    kanji: "京楽春水",
    name: "SHUNSUI KYŌRAKU",
    epithet: { tr: "Yamamoto'dan sonraki başkomutan", en: "Captain-Commander after Yamamoto" },
    bio: {
      tr: "Akademi'nin ilk mezunlarından ve Gotei 13'ün en eski iki kaptanından biri; hasır şapkasıyla tembel görünmesi bilinçli bir örtü. Katen Kyōkotsu dövüşü bir çocuk oyununa çevirir ve oyunun kuralını kaybeden ölür. Yamamoto düştükten sonra başkomutanlığı devraldı.",
      en: "One of the Academy's first graduates and one of the two oldest captains of the Gotei 13; the straw hat and the idleness are a deliberate cover. Katen Kyōkotsu turns a fight into a children's game, and whoever loses the game dies. He took over the command after Yamamoto fell.",
    },
    tags: ["花天狂骨 Katen Kyōkotsu", "花天狂骨枯松心中 Karamatsu Shinjū"],
    reiatsu: "#C88A2E",
  },
  {
    slug: "ichibe-hyosube",
    kanji: "兵主部一兵衛",
    name: "ICHIBĒ HYŌSUBE",
    epithet: { tr: "真名呼和尚 · Gerçek adı çağıran keşiş", en: "真名呼和尚 · The monk who calls the real name" },
    bio: {
      tr: "Sıfırıncı Bölük'ün başı ve bütün adları veren kişi: “Shinigami” sözcüğünü, Zanpakutō'ların adını, karanlığın adını o koydu. Bir şeyin adını bilmek onu yönetmek demek — Ichimonji bir düşmanın adını silerse gücü de siliniyor. Yhwach onu yenmek için Kutsanmış Hâl'i açmak zorunda kaldı.",
      en: "Head of the Zero Division and the one who gives all names: the word “Shinigami”, the names of the Zanpakutō, the name of black itself. To know a thing's name is to rule it — if Ichimonji erases an enemy's name, their power is erased with it. Yhwach had to unfold The Almighty to beat him.",
    },
    /* ⚠️ しら筆一文字, 白打 DEĞİL. Hafızadan 白打 yazılmıştı; o Hakuda'nın
       kanjisi. Doğrulama yakaladı (fandom, 23 Ağustos 2026). */
    tags: ["一文字 Ichimonji", "しら筆一文字 Shirafude Ichimonji"],
    reiatsu: "#0A0A0A",
  },
];
