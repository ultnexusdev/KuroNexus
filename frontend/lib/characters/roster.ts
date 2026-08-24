import { getCharacterCards, getCharacterImagesBulk } from "@/lib/api/characters";
import { apiUrl } from "@/lib/api/client";
import type { ArchiveCharacter } from "@/lib/api/types";
import { EXPERIENCE_IDS } from "./experiences";

/**
 * Elle tasarlanmış karakter sayfalarının KADRO KAYDI.
 *
 * Karakter dizini (`/dark-stories/category/anime/karakterler`) kadroyu
 * AniList'ten, arşivdeki serilerin oyuncu listelerinden derliyor. O liste
 * yalnızca 68 kişi: arşivdeki serilerin başrol/yardımcı kadrosu. Elle
 * tasarladığımız 35 sayfanın çoğu orada YOK — Iruka, Konohamaru, Kankurō,
 * Kabuto, Minato, Kushina, Tenten, Temari, Sai, Yamato hiçbir kadro
 * listesine girmiyor. Dolayısıyla dizin onları hiç göstermiyordu.
 *
 * Bu dosya o boşluğu kapatıyor: adlar ve seri etiketi KODDA (dış kaynağa
 * bağlı değil), portre ise iki kaynaktan sırayla çözülüyor. Sonuç hem
 * dizinin ızgarasına karışıyor hem de üstteki "elle tasarlanmış dosyalar"
 * rafını besliyor.
 *
 * ⚠️ Yeni bir deneyim sayfası açarken buraya da bir satır ekle — yoksa
 * sayfa var olur ama dizinde görünmez. `EXPERIENCE_IDS` ile bu kayıt
 * arasındaki tutarlılık `curatedRosterGaps()` ile ölçülebilir.
 */
export interface RosterEntry {
  characterId: number;
  /** Sayfada kullandığımız ad — AniList'inkinden farklı olabilir */
  name: string;
  nameNative: string;
  /** Dizindeki seri çipiyle aynı etiket */
  series: string;
  /** Arşivdeki seri sayfasının slug'ı — yoksa süzgeç dışında kalır */
  seriesSlug: string;
}

const NARUTO = { series: "Naruto", seriesSlug: "naruto" };
const BLEACH = { series: "Bleach", seriesSlug: "bleach" };
const JJK = { series: "JUJUTSU KAISEN", seriesSlug: "jujutsu-kaisen" };

export const EXPERIENCE_ROSTER: RosterEntry[] = [
  { characterId: EXPERIENCE_IDS.itachi, name: "Itachi Uchiha", nameNative: "うちはイタチ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.narutoUzumaki, name: "Naruto Uzumaki", nameNative: "うずまきナルト", ...NARUTO },
  { characterId: EXPERIENCE_IDS.sasukeUchiha, name: "Sasuke Uchiha", nameNative: "うちはサスケ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.kakashiHatake, name: "Kakashi Hatake", nameNative: "はたけカカシ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.sakuraHaruno, name: "Sakura Haruno", nameNative: "春野サクラ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.shikamaruNara, name: "Shikamaru Nara", nameNative: "奈良シカマル", ...NARUTO },
  { characterId: EXPERIENCE_IDS.jiraiya, name: "Jiraiya", nameNative: "自来也", ...NARUTO },
  { characterId: EXPERIENCE_IDS.hinataHyuuga, name: "Hinata Hyūga", nameNative: "日向ヒナタ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.rockLee, name: "Rock Lee", nameNative: "ロック・リー", ...NARUTO },
  { characterId: EXPERIENCE_IDS.sai, name: "Sai", nameNative: "サイ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.yamato, name: "Yamato", nameNative: "ヤマト", ...NARUTO },
  { characterId: EXPERIENCE_IDS.irukaUmino, name: "Iruka Umino", nameNative: "うみのイルカ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.konohamaruSarutobi, name: "Konohamaru Sarutobi", nameNative: "猿飛木ノ葉丸", ...NARUTO },
  { characterId: EXPERIENCE_IDS.chojiAkimichi, name: "Chōji Akimichi", nameNative: "秋道チョウジ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.inoYamanaka, name: "Ino Yamanaka", nameNative: "山中いの", ...NARUTO },
  { characterId: EXPERIENCE_IDS.kibaInuzuka, name: "Kiba Inuzuka", nameNative: "犬塚キバ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.shinoAburame, name: "Shino Aburame", nameNative: "油女シノ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.nejiHyuga, name: "Neji Hyūga", nameNative: "日向ネジ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.tenten, name: "Tenten", nameNative: "テンテン", ...NARUTO },
  { characterId: EXPERIENCE_IDS.gaara, name: "Gaara", nameNative: "我愛羅", ...NARUTO },
  { characterId: EXPERIENCE_IDS.temari, name: "Temari", nameNative: "テマリ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.kankuro, name: "Kankurō", nameNative: "カンクロウ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.tsunade, name: "Tsunade Senju", nameNative: "綱手", ...NARUTO },
  { characterId: EXPERIENCE_IDS.orochimaru, name: "Orochimaru", nameNative: "大蛇丸", ...NARUTO },
  { characterId: EXPERIENCE_IDS.kabutoYakushi, name: "Kabuto Yakushi", nameNative: "薬師カブト", ...NARUTO },
  /* AniList'te "Tobi" adıyla kayıtlı (#3149) — sayfa gerçek adı taşıyor */
  { characterId: EXPERIENCE_IDS.obitoUchiha, name: "Obito Uchiha", nameNative: "うちはオビト", ...NARUTO },
  { characterId: EXPERIENCE_IDS.madaraUchiha, name: "Madara Uchiha", nameNative: "うちはマダラ", ...NARUTO },
  /* AniList'te "Pain" adıyla kayıtlı (#3180) — sayfa Nagato'yu anlatıyor */
  { characterId: EXPERIENCE_IDS.nagato, name: "Nagato", nameNative: "長門", ...NARUTO },
  { characterId: EXPERIENCE_IDS.konan, name: "Konan", nameNative: "小南", ...NARUTO },
  { characterId: EXPERIENCE_IDS.minatoNamikaze, name: "Minato Namikaze", nameNative: "波風ミナト", ...NARUTO },
  { characterId: EXPERIENCE_IDS.kushinaUzumaki, name: "Kushina Uzumaki", nameNative: "うずまきクシナ", ...NARUTO },
  { characterId: EXPERIENCE_IDS.ichigoKurosaki, name: "Ichigo Kurosaki", nameNative: "黒崎一護", ...BLEACH },
  { characterId: EXPERIENCE_IDS.kisukeUrahara, name: "Kisuke Urahara", nameNative: "浦原喜助", ...BLEACH },
  { characterId: EXPERIENCE_IDS.sousukeAizen, name: "Sōsuke Aizen", nameNative: "藍染惣右介", ...BLEACH },
  { characterId: EXPERIENCE_IDS.kenpachiZaraki, name: "Kenpachi Zaraki", nameNative: "更木剣八", ...BLEACH },
  /* Kap sayfası tek sayfa ama İKİ adres; rafta ikisi de görünür ve
     ziyaretçi hangi modda açılacağını seçmiş olur. */
  { characterId: EXPERIENCE_IDS.yuujiItadori, name: "Yuuji Itadori", nameNative: "虎杖悠仁", ...JJK },
  { characterId: EXPERIENCE_IDS.sukuna, name: "Ryōmen Sukuna", nameNative: "両面宿儺", ...JJK },
];

/** Rozet ve süzgeç için: elle tasarlanmış sayfası olan numaralar. */
export const CURATED_IDS: ReadonlySet<number> = new Set(
  EXPERIENCE_ROSTER.map((entry) => entry.characterId),
);

/**
 * Kayıt ile rota kaydı arasındaki boşluklar.
 *
 * `EXPERIENCE_IDS`e bir numara eklenip buraya satır eklenmezse sayfa var
 * olur ama dizinde görünmez — sessiz bir hata. Bu yardımcı onu görünür
 * kılıyor; şimdilik yalnızca geliştirme sırasında okunuyor.
 */
export function curatedRosterGaps(): number[] {
  return Object.values(EXPERIENCE_IDS).filter((id) => !CURATED_IDS.has(id));
}

/**
 * Kadroyu portreleriyle birlikte getirir.
 *
 * Portre iki kaynaktan sırayla çözülüyor:
 *   1. Kendi veritabanımız (`CharacterImage` PORTRAIT) — küratörün yüklediği
 *      tam boy görsel. Naruto kadrosunun 54 portresi burada.
 *   2. AniList kartı (~230 px) — kendi kaydımız yoksa.
 * İkisi de yoksa `image: null` → kart portresiz, harfli çiziliyor.
 *
 * Her iki getirici de hata durumunda boş dizi döndürüyor, yani kaynak
 * düşse bile raf adlarla ayakta kalır (AGENTS.md kural 4).
 */
export async function loadCuratedRoster(): Promise<ArchiveCharacter[]> {
  const ids = EXPERIENCE_ROSTER.map((entry) => entry.characterId);
  const [rows, cards] = await Promise.all([
    getCharacterImagesBulk(ids),
    getCharacterCards(ids),
  ]);

  const uploaded = new Map<number, string>();
  for (const row of rows) {
    if (row.slot === "PORTRAIT") {
      uploaded.set(row.characterId, apiUrl(row.url));
    }
  }
  const anilist = new Map<number, string | null>(
    cards.map((card) => [card.characterId, card.image]),
  );

  return EXPERIENCE_ROSTER.map((entry) => ({
    characterId: entry.characterId,
    name: entry.name,
    nameNative: entry.nameNative,
    image: uploaded.get(entry.characterId) ?? anilist.get(entry.characterId) ?? null,
    /* Rol BİLEREK boş: "başrol/yardımcı" AniList'in kadro listesindeki
       ölçüsü ve bu kayıtta yok. `"MAIN"` yazmak Kankurō'ya ya da Iruka'ya
       başrol rozeti takardı — dizindeki gerçek rollerle karışırdı. Boş
       bırakılınca kart rol çipini hiç çizmiyor. */
    role: null,
    voiceActor: null,
    /* Favori sayısı AniList'in kendi ölçüsü ve bu kayıtta yok. `null`
       bırakmak dürüst olan: kart bu alanı zaten çizmiyor, uydurma bir
       sayı basmak dizindeki gerçek sayılarla karışırdı. */
    favourites: null,
    series: [{ slug: entry.seriesSlug, title: entry.series }],
  }));
}
