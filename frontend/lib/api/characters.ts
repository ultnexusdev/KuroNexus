import { cache } from "react";
import { apiFetch } from "./client";
import { freshness } from "./freshness";
import type {
  CharacterCard,
  CharacterDetail,
  CharacterImageRow,
  CharacterIndex,
} from "./types";

/**
 * Karakter dizini ve karakter dosyası.
 *
 * Uçlar şimdilik anime kanadının altında (`/anime/characters`) çünkü kaynak
 * AniList. Film/dizi karakterleri geldiğinde bu dosya ikinci bir çağırıcı
 * kazanır; **dönen tipler kaynağa bağlı değil**, bileşenler değişmez.
 */

const EMPTY_INDEX: CharacterIndex = {
  characters: [],
  series: [],
  stats: { characters: 0, series: 0, main: 0 },
};

/**
 * Dizin. Kaynak düşerse salon boş açılır, sayfa çökmez — arşivin geri kalanı
 * (AGENTS.md kural 4) aynı davranışı gösteriyor.
 *
 * ── TAZELİK: KÜRATÖR TAZE, ZİYARETÇİ BEŞ DAKİKA ──────────────────────────
 * Burada bir saatlik önbellek vardı ve küratör modunu ölçülebilir biçimde
 * bozuyordu: küratör bir karakteri dizinden çıkarıyor, sayfayı yeniliyor ve
 * karakter geri geliyordu — dışlama listesi backend'de işlese bile Next
 * önbellekten eski listeyi veriyordu. "Kaldırdım ama duruyor" hatası
 * kullanıcıya rastgele görünüyordu. Çare önce `no-store` oldu; 2 Eylül
 * 2026'da `fresh` desenine geçti (`lib/api/freshness.ts`): sorun yaşayan
 * KÜRATÖRDÜ, o hâlâ taze okuyor — ziyaretçiye önbellek geri geldi.
 *
 * `getCharacterDetail` ve `getCharacterImages` aynı hizada.
 */
const cachedCharacterIndex = cache(
  async (fresh: boolean): Promise<CharacterIndex> => {
    try {
      return await apiFetch<CharacterIndex>(
        "/anime/characters",
        freshness(fresh),
      );
    } catch {
      return EMPTY_INDEX;
    }
  },
);
/** `fresh === true` normalizasyonunun gerekçesi `books.ts`te. */
export function getCharacterIndex(fresh?: boolean): Promise<CharacterIndex> {
  return cachedCharacterIndex(fresh === true);
}

/**
 * Adı geçen karakterlerin portreleri (savaş ve ilişki satırları).
 *
 * Tek istek: her karakter için ayrı çağrı 6 ayrı AniList turu demekti.
 * Alınamazsa boş dizi → bölümler adlarla, portresiz çizilir.
 */
export async function getCharacterCards(
  ids: number[],
): Promise<CharacterCard[]> {
  const unique = [...new Set(ids)].filter((id) => Number.isInteger(id) && id > 0);
  if (unique.length === 0) {
    return [];
  }
  try {
    return await apiFetch<CharacterCard[]>(
      `/anime/characters/cards?ids=${unique.join(",")}`,
      { next: { revalidate: 86400 } },
    );
  } catch {
    return [];
  }
}

/**
 * 50'den fazla karakterin künyesi.
 *
 * ⚠️ BU BÖLME BİR SÜS DEĞİL, ÖLÇÜLMÜŞ BİR HATANIN TAMİRİ (31 Ağustos 2026).
 * Uç `ids` listesini 50'de KESİYOR (`anime.controller.ts`) ve sessizce
 * kesiyor: 66 kimlik gönderen çağıran 50 kayıt alıyor, eksik 16'sı için
 * hiçbir hata görmüyor. Elle tasarlanmış dosyalar rafı tam bu yüzden
 * kırılmıştı — kayıttaki 51. sıradan sonraki bütün karakterler (Ulquiorra,
 * Grimmjow, Yoruichi, JJK ve MHA kadrosu) portresiz, harfli kutu olarak
 * çiziliyordu.
 *
 * `getCharacterImagesBulk`in aynısı ve aynı gerekçeyle: sınırı backend'de
 * gevşetmek yerine burada bölüyoruz, uç herkese açık ve üst sınırın bir
 * savunma değeri var.
 */
export async function getCharacterCardsBulk(
  ids: number[],
): Promise<CharacterCard[]> {
  const unique = [...new Set(ids)].filter(
    (id) => Number.isInteger(id) && id > 0,
  );
  const chunks: number[][] = [];
  for (let i = 0; i < unique.length; i += 50) {
    chunks.push(unique.slice(i, i + 50));
  }
  const results = await Promise.all(
    chunks.map((chunk) => getCharacterCards(chunk)),
  );
  return results.flat();
}

/**
 * Verilen karakterlerin küratör görselleri (CharacterImage) tek istekte.
 *
 * Akatsuki sergisinin görsel kaynağı: portreler ve sergi görselleri buradan,
 * kayıt yoksa AniList portresine (`getCharacterCards`) düşülür. Küratörün /
 * kurulum ucunun yüklediği görsel KÜRATÖRE anında görünür (`fresh`), ziyaretçi
 * beş dakikalık önbellekten okur (dizinle aynı karar). Alınamazsa boş dizi:
 * sergi portresiz ama ayakta kalır.
 */
export async function getCharacterImages(
  ids: number[],
  fresh?: boolean,
): Promise<CharacterImageRow[]> {
  const unique = [...new Set(ids)].filter(
    (id) => Number.isInteger(id) && id > 0,
  );
  if (unique.length === 0) {
    return [];
  }
  try {
    return await apiFetch<CharacterImageRow[]>(
      `/anime/characters/images?ids=${unique.join(",")}`,
      freshness(fresh),
    );
  } catch {
    return [];
  }
}

/**
 * 50'den fazla karakterin görselleri. Uç, `ids` listesini 50'de kesiyor
 * (`anime.controller.ts` — cards ucuyla aynı üst sınır); Naruto Evreni'nin
 * kadro kaydı ~60 kişi olduğu için liste 50'lik parçalara bölünüp paralel
 * istenir. Sınırı backend'de gevşetmek yerine burada bölmek seçildi:
 * uç herkese açık ve üst sınırın bir savunma değeri var.
 */
export async function getCharacterImagesBulk(
  ids: number[],
  fresh?: boolean,
): Promise<CharacterImageRow[]> {
  const unique = [...new Set(ids)].filter(
    (id) => Number.isInteger(id) && id > 0,
  );
  const chunks: number[][] = [];
  for (let i = 0; i < unique.length; i += 50) {
    chunks.push(unique.slice(i, i + 50));
  }
  const results = await Promise.all(
    chunks.map((chunk) => getCharacterImages(chunk, fresh)),
  );
  return results.flat();
}

/** Karakter dosyası. Bulunamazsa `null` → sayfa 404 verir. */
const cachedCharacterDetail = cache(async function (
  characterId: string,
  fresh: boolean,
): Promise<CharacterDetail | null> {
  // Sayısal olmayan kimlik backend'e hiç gitmesin: rota parametresi elle
  // yazılabilir bir yer ve `ParseIntPipe` orada 400 üretirdi — kullanıcıya
  // 404 göstermek doğru cevap, 400 değil
  if (!/^\d+$/.test(characterId)) {
    return null;
  }
  try {
    /*
     * `no-store` — ÖNBELLEK YOK, bilinçli.
     *
     * İlk sürümde 24 saat önbellekliydi. Karakterin AniList künyesi gerçekten
     * o kadar seyrek değişiyor, ama yanıt artık **kürator tarafından yüklenen
     * görselleri de** taşıyor. Önbellekle: kürator bir görsel yükler,
     * `router.refresh()` sunucu bileşenlerini yeniden çizer, ama içerideki
     * `fetch` önbellekten eski yanıtı döndürür ve görsel 24 saat boyunca
     * görünmez. Ölçüldü, 6 Ağustos 2026.
     *
     * Maliyet düşük: pahalı olan AniList turu backend'de 30 gün cache'li,
     * buradaki istek yalnızca bir veritabanı okuması. Anime arşivinde de
     * aynı karar aynı gerekçeyle alınmış ("+1 bölümden sonra ilerlemeyi
     * anında görmek gerekiyor", `lib/api/anime.ts`).
     */
    return await apiFetch<CharacterDetail>(
      `/anime/characters/${characterId}`,
      freshness(fresh),
    );
  } catch {
    return null;
  }
});
/** `fresh === true` normalizasyonunun gerekçesi `books.ts`te. */
export function getCharacterDetail(
  characterId: string,
  fresh?: boolean,
): Promise<CharacterDetail | null> {
  return cachedCharacterDetail(characterId, fresh === true);
}
