import { apiUrl } from "@/lib/api/client";
import type {
  CharacterDetail,
  CharacterImage,
  CharacterImageRow,
} from "@/lib/api/types";
import { ITACHI_ID } from "./itachi-experience";

/**
 * Karakter DENEYİM sayfaları — ortak kayıt.
 *
 * Itachi (18 Ağustos 2026) tek başına bir istisnaydı: rota dosyası
 * `characterId === ITACHI_ID` diye dallanıyordu. 22 Ağustos'ta on üç sayfa
 * daha geldi (kullanıcı komutu) ve o `if` on dört kollu bir merdivene
 * dönerdi. Bu dosya merdiveni tek bir haritaya indiriyor.
 *
 * ── NEDEN BURADA, BİLEŞEN HARİTASI ROTADA ────────────────────────────────
 * Bu dosya yalnızca VERİ tutuyor (numaralar, yoldaş listeleri, görsel
 * çözümleyicileri). Bileşen haritası rota dosyasında, çünkü orada `import`
 * edilen her bileşen sayfanın paketinde yer alıyor: veri katmanını
 * bileşenlerden ayrı tutmak, bu dosyayı istemci adalarının da güvenle
 * çağırabileceği hâle getiriyor.
 *
 * ── KURATÖR MODU ŞARTI ───────────────────────────────────────────────────
 * On üç sayfanın hiçbiri bir diğeriyle bileşen paylaşmıyor (kullanıcı
 * komutu, 22 Ağustos 2026). Paylaşılan tek şey bu dosyadaki üç yardımcı
 * ve `CuratorFrame`/`CuratorSlot` — ikisi de tasarım değil altyapı.
 */

/**
 * AniList karakter numaraları. Adres bu numaranın kendisi
 * (`/dark-stories/category/anime/karakterler/<id>`), çünkü aynı adı taşıyan
 * karakterler yaygın ve numara kaynağın kendi kimliği.
 *
 * Numaralar 22 Ağustos 2026'da kendi arşivimizin karakter dizininden
 * doğrulandı (AniList GraphQL o gün kapalıydı; dizin 30 günlük önbellekten
 * geliyor ve doğrulama için yeterli).
 */
export const EXPERIENCE_IDS = {
  itachi: ITACHI_ID,
  narutoUzumaki: 17,
  sasukeUchiha: 13,
  ichigoKurosaki: 5,
  kakashiHatake: 85,
  sakuraHaruno: 145,
  kisukeUrahara: 210,
  shikamaruNara: 2007,
  sousukeAizen: 1086,
  jiraiya: 2423,
  hinataHyuuga: 1555,
  kenpachiZaraki: 909,
  rockLee: 306,
  /** Kap sayfasının iki adresi — ikisi de AYNI bileşene çıkar */
  yuujiItadori: 127212,
  sukuna: 133701,

  /* ── İkinci tur (24 Ağustos 2026): Naruto evreninden 22 kişi daha.
     Numaralar AniList GraphQL'den doğrulandı; ad tek başına güvenilmez
     olduğu için her aramada medya listesinde Naruto/Boruto süzgeci
     uygulandı (Kurama'nın YuYu Hakusho'ya çarpması emsali).

     İki numara AniList'te BAŞKA ADLA kayıtlı ve bu bilinçli korunuyor:
       obitoUchiha → #3149, AniList'teki adı "Tobi" (maskeli hâli)
       nagato      → #3180, AniList'teki adı "Pain" (altı yolun personası)
     Sitedeki `NARUTO_PEOPLE` kaydı da yıllardır bu eşleşmeyi kullanıyor;
     sayfa başlığı karakterin gerçek adını taşıyor, künye AniList'inkini. ── */
  sai: 1901,
  yamato: 2006,
  irukaUmino: 2011,
  konohamaruSarutobi: 3889,
  chojiAkimichi: 2008,
  inoYamanaka: 2009,
  kibaInuzuka: 3495,
  shinoAburame: 3428,
  nejiHyuga: 1694,
  tenten: 3710,
  gaara: 1662,
  temari: 2174,
  kankuro: 4694,
  tsunade: 2767,
  orochimaru: 2455,
  kabutoYakushi: 2405,
  obitoUchiha: 3149,
  madaraUchiha: 53901,
  nagato: 3180,
  konan: 3179,
  minatoNamikaze: 2535,
  kushinaUzumaki: 7302,
} as const;

/**
 * Her deneyim sayfasının ortak imzası.
 *
 * `companions`: sayfada adı geçen karakterlerin **bizim** veritabanımızdaki
 * görselleri. Neden AniList kartları değil: `getCharacterCards` her yeni
 * kimlik kümesi için canlı bir AniList turu atıyor ve kaynak düştüğünde boş
 * dönüyor (22 Ağustos 2026'da ölçüldü — AniList API'si o gün kapalıydı ve
 * uç boş liste veriyordu). Kendi `CharacterImage` kaydımız her zaman ayakta
 * ve Naruto kadrosunun portreleri zaten orada, üstelik AniList'in ~230
 * piksellik portresinden çok daha büyük.
 */
export interface CharacterExperienceProps {
  detail: CharacterDetail;
  isAdmin: boolean;
  companions: CharacterImageRow[];
}

/**
 * Sayfada portresi görünecek karakterler.
 *
 * Rota bu listeyi künye isteğiyle PARALEL çekiyor (tek istek, kendi
 * veritabanımız). Liste kodda çünkü "kimin portresi hangi sayfada görünür"
 * bir tasarım kararı, veri değil.
 *
 * Kayıt yoksa bölüm portresiz çizilir — hiçbir sayfa bu listeye bağımlı
 * olmamalı.
 */
export const EXPERIENCE_COMPANIONS: Record<number, number[]> = {
  // Naruto: takım, ustalar, kader ortağı, Kurama
  [EXPERIENCE_IDS.narutoUzumaki]: [
    13, 145, 85, 2423, 1555, 2535, 7302, 7407, 1662, 3180,
  ],
  // Sasuke: ağabey, takım, yılan, Taka
  [EXPERIENCE_IDS.sasukeUchiha]: [14, 17, 145, 85, 2455, 53901, 3149, 1903],
  // Ichigo: Bleach çekirdeği (portre kaydımız yok — künye adla çizilir)
  [EXPERIENCE_IDS.ichigoKurosaki]: [6, 7, 564, 906, 210, 1086, 909, 1081],
  // Kakashi: takımı, kendi takımı, Obito ve Rin
  [EXPERIENCE_IDS.kakashiHatake]: [17, 13, 145, 3149, 14082, 2535, 14],
  // Sakura: ustası, takımı, arkadaşı
  [EXPERIENCE_IDS.sakuraHaruno]: [2767, 17, 13, 85, 2009, 1662],
  // Urahara: dükkânın çevresi
  [EXPERIENCE_IDS.kisukeUrahara]: [908, 5, 1086, 6, 1081],
  // Shikamaru: sensei, Ino-Shika-Cho, Temari
  [EXPERIENCE_IDS.shikamaruNara]: [4775, 2008, 2009, 2174, 17, 3178],
  // Aizen: kurbanları ve rakipleri
  [EXPERIENCE_IDS.sousukeAizen]: [5, 210, 908, 6, 1081, 1080],
  // Jiraiya: öğrencileri, takım arkadaşları, Nagato
  [EXPERIENCE_IDS.jiraiya]: [17, 2767, 2455, 2535, 3180, 7571],
  // Hinata: Naruto, Neji, takım 8
  [EXPERIENCE_IDS.hinataHyuuga]: [17, 1694, 3495, 3428, 4773],
  // Kenpachi: Bleach 11. Bölük çevresi
  [EXPERIENCE_IDS.kenpachiZaraki]: [5, 906, 910, 3845, 1081],
  // Rock Lee: Guy, Takım Guy, Gaara
  [EXPERIENCE_IDS.rockLee]: [307, 1694, 3710, 1662, 17],
  // Kap sayfası — iki adres de aynı yoldaş listesini alır
  [EXPERIENCE_IDS.yuujiItadori]: [
    133701, 127691, 126635, 133700, 133704, 133702, 157116,
  ],
  [EXPERIENCE_IDS.sukuna]: [
    127212, 127691, 126635, 133700, 133704, 133702, 157116,
  ],

  /* ── İkinci tur (24 Ağustos 2026) ── */
  // Sai: Takım 7'nin sonradan geleni + Kök
  [EXPERIENCE_IDS.sai]: [17, 13, 145, 2006, 23424, 85],
  // Yamato: Kakashi'nin yerine geçen ANBU + Hashirama hücresi zinciri
  [EXPERIENCE_IDS.yamato]: [85, 17, 1901, 12464, 2455, 23424],
  // Iruka: öğrencisi ve öğretmeni
  [EXPERIENCE_IDS.irukaUmino]: [17, 7571, 3889, 85],
  // Konohamaru: dede, amca, usta
  [EXPERIENCE_IDS.konohamaruSarutobi]: [17, 7571, 4775, 13],
  // Chōji: Ino-Shika-Chō + sensei
  [EXPERIENCE_IDS.chojiAkimichi]: [2007, 2009, 4775, 17],
  // Ino: Ino-Shika-Chō + rakip/dost + Sai
  [EXPERIENCE_IDS.inoYamanaka]: [2007, 2008, 145, 4775, 1901],
  // Kiba: Takım 8
  [EXPERIENCE_IDS.kibaInuzuka]: [1555, 3428, 4773, 17],
  // Shino: Takım 8
  [EXPERIENCE_IDS.shinoAburame]: [1555, 3495, 4773, 17],
  // Neji: Takım Guy + Hyūga kanadı
  [EXPERIENCE_IDS.nejiHyuga]: [1555, 306, 3710, 307, 17],
  // Tenten: Takım Guy + silah dostu
  [EXPERIENCE_IDS.tenten]: [306, 1694, 307, 2174],
  // Gaara: kardeşleri, babası, onu değiştiren çocuk
  [EXPERIENCE_IDS.gaara]: [17, 2174, 4694, 22920],
  // Temari: kardeşleri, babası, gölge
  [EXPERIENCE_IDS.temari]: [1662, 4694, 2007, 22920],
  // Kankurō: kardeşleri, kukla ustası
  [EXPERIENCE_IDS.kankuro]: [1662, 2174, 1900, 22920],
  // Tsunade: Sannin + çırağı + öğrettiği köy
  [EXPERIENCE_IDS.tsunade]: [2423, 2455, 145, 17, 7571],
  // Orochimaru: Sannin + kaplar + öğrencisi
  [EXPERIENCE_IDS.orochimaru]: [2423, 2767, 13, 2405, 7571, 14],
  // Kabuto: efendisi, dirilttikleri
  [EXPERIENCE_IDS.kabutoYakushi]: [2455, 13, 14, 53901, 17],
  // Obito: takımı ve onu kullanan
  [EXPERIENCE_IDS.obitoUchiha]: [85, 14082, 2535, 53901, 17],
  // Madara: rakibi, kaplarını kullandığı, kardeşi
  [EXPERIENCE_IDS.madaraUchiha]: [12464, 3149, 3180, 16406, 17],
  // Nagato: Ame yetimleri + ustası + onu ikna eden
  [EXPERIENCE_IDS.nagato]: [23050, 3179, 2423, 17, 3149],
  // Konan: Ame yetimleri + ustası
  [EXPERIENCE_IDS.konan]: [3180, 23050, 2423, 3149],
  // Minato: eşi, oğlu, ustası, öğrencileri
  [EXPERIENCE_IDS.minatoNamikaze]: [7302, 17, 2423, 85, 3149, 14082],
  // Kushina: eşi, oğlu, önceki jinchūriki hattı
  [EXPERIENCE_IDS.kushinaUzumaki]: [2535, 17, 2767, 7407],
};

const EXPERIENCE_ID_SET: ReadonlySet<number> = new Set<number>(
  Object.values(EXPERIENCE_IDS),
);

/**
 * Bu numara elle tasarlanmış bir deneyim sayfasına mı çıkıyor?
 *
 * Sayfalar birbirine bağ verirken kullanıyor: adı geçen karakterin elle
 * yazılmış bir sayfası varsa kart bağlantılı çizilir, yoksa düz künye
 * dosyasına göndermek yerine sadece ad gösterilir.
 */
export function isExperienceCharacter(characterId: number): boolean {
  return EXPERIENCE_ID_SET.has(characterId);
}

/** Rota bu listeyi künyeyle paralel isteğe koyar; kayıt yoksa boş dizi. */
export function experienceCompanionIds(characterId: number): number[] {
  return EXPERIENCE_COMPANIONS[characterId] ?? [];
}

/**
 * ABILITY yuvalarını anahtar → adres haritasına çevirir.
 *
 * Satırlar `orderIndex`+`createdAt` artan sıralı geliyor, yani aynı anahtara
 * iki görsel yüklenmişse **son yazan kazanır** — küratörün yeni yüklediği
 * görselin eskisini ezmesi bekleniyor (Itachi emsali).
 *
 * Dönen adresler `apiUrl()` ile mutlaklaştırılmış: `/uploads/...` yolları
 * tarayıcıda çözülmeli, `next/image`e göreli yol vermek üretimde kırılır.
 */
export function collectAbilityImages(
  images: CharacterImage[] | undefined,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of images ?? []) {
    if (row.slot === "ABILITY" && row.abilityName) {
      map.set(row.abilityName, apiUrl(row.url));
    }
  }
  return map;
}

/**
 * Karakterin kapak portresi — en iyi kaynaktan.
 *
 * Sıra bilinçli:
 *   1. Kendi veritabanımızdaki PORTRAIT yuvası (küratörün yüklediği tam boy
 *      görsel; Naruto kadrosunun 54 portresi 22 Ağustos'ta buraya yüklendi)
 *   2. AniList portresi (~230 piksel, ama her karakterde var)
 *
 * İkisi de yoksa `null` → sayfa portresiz ama ayakta çizilir.
 */
export function primaryPortrait(detail: CharacterDetail): string | null {
  const uploaded = (detail.images ?? []).find((row) => row.slot === "PORTRAIT");
  if (uploaded) {
    return apiUrl(uploaded.url);
  }
  return detail.character.image ?? null;
}

/** Portre kendi yüklememiz mi? `next/image`in `unoptimized` kararı buna bağlı. */
export function isUploadedPortrait(detail: CharacterDetail): boolean {
  return (detail.images ?? []).some((row) => row.slot === "PORTRAIT");
}

/**
 * Yoldaş portreleri: kimlik → adres.
 *
 * Yalnızca PORTRAIT yuvası okunur; galeri ve yetenek görselleri başka
 * karakterin sayfasında yanıltıcı olurdu. Kaydı olmayan karakter haritada
 * hiç görünmez — çağıran `?? null` yazmak zorunda kalır ve bölüm adla
 * çizilir.
 */
export function companionPortraits(
  rows: CharacterImageRow[] | undefined,
): Map<number, string> {
  const map = new Map<number, string>();
  for (const row of rows ?? []) {
    if (row.slot === "PORTRAIT") {
      map.set(row.characterId, apiUrl(row.url));
    }
  }
  return map;
}
