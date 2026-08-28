/**
 * Salon 04 · Anime — TEK ADRES KAYNAĞI (müzik/spor deseninin aynısı).
 *
 * Kural: hiçbir bileşen `/anime/...` ya da `/dark-stories/category/anime/...`
 * dizesini elle yazmaz; adres buradan okunur. Salon girişi 16 Ağustos 2026'da
 * kendi ağacına taşındı (`/anime`), derin odalar (arşiv, karakterler, seri
 * sayfaları) spor göçünün Faz 1 deseniyle ŞİMDİLİK eski ağaçta duruyor —
 * taşınırlarsa yalnızca bu dosya değişir.
 *
 * ⚠️ Eski ağaçtaki elle yazılmış adresler (AnimeCard, CharacterPlate vb.)
 * henüz süpürülmedi — ayrı temizlik turu (PLAN.md TODO). Yeni kod bu
 * dosyadan okur.
 */

const OLD_TREE = "/dark-stories/category/anime";

export const animeHref = {
  /** Salon girişi — kendi ağacında */
  hall: () => "/anime",
  /** Akatsuki dijital sergisi */
  akatsuki: () => "/anime/akatsuki",
  /** Naruto Evreni — kendi ağacında, arşivdeki seri sayfasından AYRI:
      biri "izlediğim seri" kaydı, bu ise evrenin ansiklopedisi */
  naruto: () => "/anime/naruto",
  /** Bleach Evreni — Naruto ile aynı ayrım: evrenin kendisi, izlediğim seri değil */
  bleach: () => "/anime/bleach",
  /** Slam Dunk Evreni — aynı ayrım, üçüncü evren */
  slamDunk: () => "/anime/slam-dunk",
  /** Six Paths detay sayfası (deva/asura/human/animal/preta/naraka) */
  akatsukiPath: (pathKey: string) => `/anime/akatsuki/six-paths/${pathKey}`,
  /** Anime arşivi (altı raf) */
  archive: () => `${OLD_TREE}/arsiv`,
  shelf: (slug: string) => `${OLD_TREE}/arsiv/${slug}`,
  /** Karakter dizini */
  characters: () => `${OLD_TREE}/karakterler`,
  /** Karakter dosyası — kimlik AniList numarası */
  character: (characterId: number) => `${OLD_TREE}/karakterler/${characterId}`,
  /** Seri sayfası (başlıktan türetilen slug) */
  series: (slug: string) => `${OLD_TREE}/${slug}`,
};

/**
 * `/anime` altına dinamik bir kardeş ([slug]) eklenirse bu statik adlar
 * rezervedir — App Router statik bölümü önce dener ve çakışan kayıt
 * sessizce erişilmez olur (spor/müzik ölçümü).
 */
export const RESERVED_ANIME_SLUGS = new Set(["akatsuki", "naruto", "bleach"]);
