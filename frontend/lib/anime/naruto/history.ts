import type {
  NarutoArchive,
  NarutoBattle,
  NarutoEra,
  NarutoFigureRef,
  NarutoMission,
  NarutoRank,
} from "./types";
import { NARUTO_PEOPLE, type NarutoPersonSlug } from "./people";

/* Figür çipleri: kişi kadro kaydına, klan amblemine bağlanır; Shinju gibi
   kayıt dışı adlar yalnız etiket taşır (çip harfle çizilir). */
const fig = (person: NarutoPersonSlug, label?: string): NarutoFigureRef => ({
  label: label ?? NARUTO_PEOPLE[person].name,
  person,
});
const clanFig = (clan: string, label: string): NarutoFigureRef => ({ label, clan });
const name = (label: string): NarutoFigureRef => ({ label });

/**
 * Naruto Evreni — tarih kaydı (dönemler, savaşlar, rütbeler, mühürler).
 *
 * Dönem sırası ve Konoha'nın kırılma noktaları Narutopedia'nın Türkçe
 * Konohagakure maddesinden denetlendi; anlatı yeniden yazıldı. Zaman
 * çizelgesinin son üç halkası (Uchiha Katliamı, Konoha'nın İşgali,
 * Savaş Sonrası) denetim sonrası eklendi — tasarımda yoktu ve köyün
 * bugünkü hâlini açıklayan halkalar onlar.
 */
export const NARUTO_ERAS: NarutoEra[] = [
  {
    name: "Kaguya'nın Gelişi",
    desc: "Ōtsutsuki Kaguya dünyaya iner, Shinju'nun meyvesini yer ve chakrayı insanlığa taşıyan ilk varlık olur.",
    figures: [fig("kaguya-otsutsuki"), name("Shinju"), name("Ten-Tails")],
  },
  {
    name: "Hagoromo & Hamura",
    desc: "İki kardeş anneyi mühürler. Hagoromo chakrayı ninshū olarak öğretir, Hamura ayı korumaya çekilir.",
    figures: [fig("hagoromo-otsutsuki", "Hagoromo"), fig("hamura-otsutsuki", "Hamura"), name("Ten-Tails")],
  },
  {
    name: "Indra ve Ashura",
    desc: "Hagoromo'nun iki oğlu arasındaki ilk kırılma. Uchiha ve Senju kanının ayrıldığı yer.",
    figures: [fig("indra-otsutsuki", "Indra"), fig("ashura-otsutsuki", "Ashura"), fig("hagoromo-otsutsuki", "Hagoromo")],
  },
  {
    name: "Klan Savaşları Çağı",
    desc: "Gizli köy yok; klanlar paralı savaşçı olarak birbirini yıllarca kırıyor. Çocuklar cepheye gönderiliyor.",
    figures: [clanFig("uchiha", "Uchiha"), clanFig("senju", "Senju"), clanFig("hyuga", "Hyūga"), clanFig("uzumaki", "Uzumaki")],
  },
  {
    name: "Konoha'nın Kuruluşu",
    desc:
      "Hashirama ile Madara'nın anlaşması ilk gizli köyü doğurur; adını Madara koyar. " +
      "Barış kısa sürer, Madara köyü terk eder ve Son Vadisi'nde yenilir.",
    figures: [fig("hashirama-senju"), fig("madara-uchiha"), fig("tobirama-senju", "Tobirama")],
  },
  {
    name: "Birinci Shinobi Dünya Savaşı",
    desc: "Beş büyük ulus arasındaki ilk topyekûn savaş. Hashirama ve ardından Tobirama bu dönemde ölür.",
    figures: [fig("hiruzen-sarutobi"), fig("danzo-shimura", "Danzō"), fig("onoki")],
  },
  {
    name: "İkinci Shinobi Dünya Savaşı",
    desc: "Sannin'in efsaneleştiği savaş. Amegakure cephesinde Hanzō üç genci 'Sannin' diye adlandırır.",
    figures: [fig("jiraiya"), fig("tsunade", "Tsunade"), fig("orochimaru"), fig("hanzo")],
  },
  {
    name: "Üçüncü Shinobi Dünya Savaşı",
    desc: "Kannabi Köprüsü, Obito'nun 'ölümü' ve Minato'nun Sarı Şimşek olarak yükselişi.",
    figures: [fig("minato-namikaze", "Minato"), fig("kakashi-hatake", "Kakashi"), fig("obito-uchiha", "Obito"), fig("rin-nohara", "Rin")],
  },
  {
    name: "Dokuz Kuyruklu'nun Saldırısı",
    desc:
      "Maskeli bir adam Kurama'nın mührünü çözüp köye salar. Minato ve Kushina " +
      "canlarını vererek onu yeni doğan oğullarına mühürler.",
    figures: [fig("minato-namikaze", "Minato"), fig("kushina-uzumaki", "Kushina"), fig("kurama"), fig("obito-uchiha", "Obito")],
  },
  {
    name: "Uchiha Klanı Katliamı",
    desc:
      "Yönetimin dışladığı klan darbe hazırlar. Itachi, kardeşinin hayatı " +
      "karşılığında klanını bir gecede yok eder ve suçu tek başına üstlenir.",
    figures: [fig("itachi-uchiha", "Itachi"), fig("sasuke-uchiha", "Sasuke"), fig("danzo-shimura", "Danzō"), fig("obito-uchiha", "Obito")],
  },
  {
    name: "Akatsuki'nin Yükselişi",
    desc: "Barış örgütü olarak kurulan Akatsuki, Obito'nun gölgesinde bijuu avcısı bir tarikata dönüşür.",
    figures: [fig("pain"), fig("konan"), fig("obito-uchiha", "Obito"), fig("itachi-uchiha", "Itachi")],
  },
  {
    name: "Konoha'nın İşgali",
    desc:
      "Chūnin Sınavı'nın ortasında Oto ve Suna köyü basar. Saldırı püskürtülür " +
      "ama Hiruzen ölür ve köy uzun süre toparlanamaz.",
    figures: [fig("orochimaru"), fig("hiruzen-sarutobi", "Hiruzen"), fig("gaara")],
  },
  {
    name: "Pain'in Konoha Saldırısı",
    desc:
      "Altı Yol köyü yerle bir eder. Naruto, babasının bıraktığı yerden " +
      "Kurama ile bağını kurar; Nagato ölenleri geri getirerek borcunu öder.",
    figures: [fig("pain"), fig("naruto-uzumaki", "Naruto"), fig("tsunade", "Tsunade"), fig("kakashi-hatake", "Kakashi")],
  },
  {
    name: "Dördüncü Shinobi Dünya Savaşı",
    desc: "Beş ulus tek ordu olur. Edo Tensei ordusu, Ten-Tails ve Kaguya'nın dönüşü tek cephede birleşir.",
    figures: [fig("naruto-uzumaki", "Naruto"), fig("sasuke-uchiha", "Sasuke"), fig("madara-uchiha", "Madara"), fig("obito-uchiha", "Obito"), fig("kaguya-otsutsuki", "Kaguya"), fig("might-guy")],
  },
  {
    name: "Savaş Sonrası",
    desc:
      "Konoha 'gizli köy' sıfatını bırakır, Ateş Ülkesi'nin ilk metropolü olur. " +
      "Yıldırım rayları döşenir, askerî bütçe küçülür, nüfusun çoğu artık shinobi değildir.",
    figures: [fig("kakashi-hatake", "Kakashi"), fig("naruto-uzumaki", "Naruto"), fig("sasuke-uchiha", "Sasuke")],
  },
];

/** Efsanevi karşılaşmalar — iki tarafın rengi kartın iki yakasını boyar */
export const NARUTO_BATTLES: NarutoBattle[] = [
  {
    place: "SON VADİSİ",
    title: "Hashirama — Madara",
    note: "Kurucu iki gücün son hesabı; vadiye iki heykel bıraktı.",
    left: "rgba(90,170,110,.16)",
    right: "rgba(180,40,45,.16)",
  },
  {
    place: "SON VADİSİ",
    title: "Naruto — Sasuke",
    note: "Aynı vadide, aynı kavganın yeni nesli. İki el, tek yumruk.",
    left: "rgba(230,180,60,.14)",
    right: "rgba(150,90,210,.16)",
  },
  {
    place: "KAMUI BOYUTU",
    title: "Kakashi — Obito",
    note: "Aynı gözü paylaşan iki öğrencinin yüzleşmesi.",
    left: "rgba(190,190,200,.12)",
    right: "rgba(170,50,50,.16)",
  },
  {
    place: "KONOHAGAKURE",
    title: "Naruto — Pain",
    note: "Yıkılmış köyün ortasında acı üzerine bir tartışma.",
    left: "rgba(230,180,60,.14)",
    right: "rgba(140,110,200,.16)",
  },
  {
    place: "UCHIHA SIĞINAĞI",
    title: "Itachi — Sasuke",
    note: "Bir ağabeyin planladığı son ders; parmağı kardeşinin alnına dokunur.",
    left: "rgba(190,40,45,.18)",
    right: "rgba(120,90,190,.14)",
  },
  {
    place: "DÖRDÜNCÜ SAVAŞ",
    title: "Might Guy — Madara",
    note: "Sekizinci Kapı: chakrasız bir adamın tanrıya en yakın yumruğu.",
    left: "rgba(230,140,50,.16)",
    right: "rgba(170,30,40,.16)",
  },
  {
    place: "KONOHA SINIRI",
    title: "Minato — Obito",
    note: "Kurama'nın salındığı gece; bir mühür ve bir veda.",
    left: "rgba(230,190,70,.14)",
    right: "rgba(160,40,40,.16)",
  },
  {
    place: "AMEGAKURE",
    title: "Jiraiya — Pain",
    note: "Öğretmenin altı öğrenciye karşı son mesajı: kurbağanın sırtındaki şifre.",
    left: "rgba(200,200,190,.12)",
    right: "rgba(140,110,200,.16)",
  },
];

/**
 * Shinobi rütbeleri. `kanji` mühür işareti, `climb` yolun yüzdesi —
 * merdiven görünümü bu ikisiyle çiziliyor (22 Ağustos görsel turu).
 */
export const NARUTO_RANKS: NarutoRank[] = [
  { lvl: "01", name: "AKADEMİ ÖĞRENCİSİ", note: "Henüz göreve çıkmaz", bar: "rgba(232,228,221,.2)", kanji: "学", climb: 10 },
  { lvl: "02", name: "GENIN", note: "Üç kişilik takım · bir sensei", bar: "oklch(0.72 0.1 150)", kanji: "下忍", climb: 26 },
  { lvl: "03", name: "CHŪNIN", note: "Takım lideri olabilir", bar: "oklch(0.78 0.11 100)", kanji: "中忍", climb: 44 },
  { lvl: "04", name: "JŌNIN", note: "Sensei · elit görev", bar: "oklch(0.78 0.12 60)", kanji: "上忍", climb: 64 },
  { lvl: "05", name: "ANBU", note: "Kara operasyon · doğrudan Kage'ye bağlı", bar: "oklch(0.66 0.16 28)", kanji: "暗部", climb: 82 },
  { lvl: "06", name: "KAGE", note: "Köyün gölgesi", bar: "#e6b84c", kanji: "影", climb: 100 },
];

/** Görev dereceleri — `risk` derecelendirme çubuğunun doluluğu */
export const NARUTO_MISSIONS: NarutoMission[] = [
  { letter: "D", desc: "Angarya · düşük risk", bar: "rgba(232,228,221,.2)", risk: 12 },
  { letter: "C", desc: "Küçük çatışma riski", bar: "oklch(0.74 0.1 150)", risk: 32 },
  { letter: "B", desc: "Shinobi'ye karşı", bar: "oklch(0.78 0.11 100)", risk: 54 },
  { letter: "A", desc: "Kritik · elit hedef", bar: "oklch(0.78 0.12 55)", risk: 78 },
  { letter: "S", desc: "Suikast · devlet sırrı", bar: "oklch(0.64 0.18 28)", risk: 97 },
];

/** Yasak parşömenler — evrenin en dip katmanı */
export const NARUTO_ARCHIVES: NarutoArchive[] = [
  {
    seal: "MÜHÜR 01",
    name: "Ōtsutsuki Tarihi",
    desc: "Chakra meyvesinin peşinde gezegenden gezegene giden klan.",
  },
  {
    seal: "MÜHÜR 02",
    name: "Kaguya'nın Gelişi",
    desc: "Bir tanrıçanın dünyaya inişi ve Shinju'yla yaptığı pazarlık.",
  },
  {
    seal: "MÜHÜR 03",
    name: "Kara Zetsu'nun Planı",
    desc: "Bin yıl boyunca tarihi tek bir dirilişe doğru yönlendiren irade.",
  },
  {
    seal: "MÜHÜR 04",
    name: "Infinite Tsukuyomi",
    desc: "Ayın yüzeyine yansıyan göz; bütün dünyayı tek bir rüyaya kilitler.",
  },
  {
    seal: "MÜHÜR 05",
    name: "Altı Yolun Bilgesi",
    desc: "Ninshū'nun kurucusu; chakrayı armağan olarak bırakan adam.",
  },
  {
    seal: "MÜHÜR 06",
    name: "Shinigami · Ölüm Tanrısı",
    desc: "Ölü Şeytan Mührü'nü çağıranın ruhunu bedel olarak alan varlık.",
  },
];
