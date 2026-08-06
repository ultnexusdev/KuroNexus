import { apiFetch } from "./client";
import type {
  CharacterCard,
  CharacterDetail,
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
 * Önbellek bir saat: liste backend'de zaten günlük cache'li, buradaki kısa
 * pencere yalnızca aynı dakika içindeki tekrar isteklerini eler.
 */
export async function getCharacterIndex(): Promise<CharacterIndex> {
  try {
    return await apiFetch<CharacterIndex>("/anime/characters", {
      next: { revalidate: 3600 },
    });
  } catch {
    return EMPTY_INDEX;
  }
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

/** Karakter dosyası. Bulunamazsa `null` → sayfa 404 verir. */
export async function getCharacterDetail(
  characterId: string,
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
      { cache: "no-store" },
    );
  } catch {
    return null;
  }
}
