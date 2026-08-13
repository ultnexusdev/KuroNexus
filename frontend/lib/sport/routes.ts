/**
 * Salon 06 · Spor — TEK ADRES KAYNAĞI.
 *
 * `lib/halls.ts`in spor karşılığı ve aynı gerekçeyle var: bugün
 * `/dark-stories/category/${slug}` adresi ÜÇ ayrı dosyada elle yazılı
 * (`app/[locale]/page.tsx` üç kez, `NexusHub`, `SiteFooter`) — aynı hatayı
 * spor tarafında tekrarlamamak için bütün spor adresleri buradan üretilir.
 *
 * Kural: hiçbir bileşen `/spor/...` dizesini elle yazmaz.
 */

/** `/spor` ağacının bütün adresleri. Rota dosyaları bunlarla birebir eşleşir. */
export const sportHref = {
  root: () => "/spor",

  football: () => "/spor/futbol",
  club: (slug: string) => `/spor/futbol/${slug}`,
  legends: () => "/spor/futbol/efsaneler",
  legend: (slug: string) => `/spor/futbol/efsaneler/${slug}`,
  /** Eski `/futbol/oyuncu/[id]` rotasının yeni yeri */
  player: (id: string) => `/spor/futbol/oyuncu/${id}`,

  f1: () => "/spor/formula-1",
  circuits: () => "/spor/formula-1/pistler",
  circuit: (slug: string) => `/spor/formula-1/pistler/${slug}`,
  /**
   * F1 sürücüsü — futbol efsanesinin karşılığı ama KENDİ KANADINDA.
   * Ortak bir `/spor/efsaneler/[slug]` ağacı ölçüldü ve reddedildi: iki farklı
   * veri modeli (FootballLegend / F1Driver) tek sayfada birleşmek zorunda
   * kalırdı ve kırıntı hangi dünyaya döneceğini bilemezdi.
   */
  drivers: () => "/spor/formula-1/surucular",
  driver: (slug: string) => `/spor/formula-1/surucular/${slug}`,
} as const;

/**
 * Panteon kartının adresi. İki dünya iki ağaç; `world` alanı hangisi
 * olduğunu söylüyor ve bu fonksiyon tek karar noktası.
 */
export function legendHref(world: "football" | "f1", slug: string): string {
  return world === "f1" ? sportHref.driver(slug) : sportHref.legend(slug);
}

/**
 * Kulüp slug'ıyla çakışamayacak yollar.
 *
 * `/spor/futbol/[clubSlug]` dinamik bir segment; "efsaneler" adında bir kulüp
 * kaydı açılırsa `/spor/futbol/efsaneler` iki şeyi birden gösterebilir. App
 * Router statik segmenti önceliklendirir, yani kulüp sayfası ERİŞİLEMEZ olur —
 * sessiz bir kayıp. Kulüp oluşturma bu listeye karşı doğrulanmalı.
 */
export const RESERVED_CLUB_SLUGS = new Set([
  "efsaneler",
  "oyuncular",
  "kulupler",
  "maclar",
  "turnuvalar",
  "tarih",
  "oyuncu",
]);

/**
 * Adresi değişmiş evrenler.
 *
 * `galatasaray` ve `formula-1` birer `WikiUniverse` kaydı ve API'den evren
 * listesi çeken her yüzey onları hâlâ `/dark-stories/${slug}` ile basıyor
 * (`NexusHub` evren rafı, `SiteFooter` evren sütunu — yani HER sayfanın
 * altında). Yönlendirmeler devreye girdiğinde bunlar çalışmaya devam eder ama
 * her tıklama fazladan bir 301 turu olur ve `<Link>` prefetch'i yönlendirilen
 * adrese ısınır.
 *
 * Bu harita o yüzeylerin doğrudan yeni adresi basmasını sağlıyor. Yönlendirme
 * yine de duruyor — o, dışarıdan gelen bağlantılar ve tarayıcı geçmişi için.
 */
export const MOVED_UNIVERSES: Record<string, string> = {
  galatasaray: "/spor/futbol/galatasaray",
  "formula-1": "/spor/formula-1",
};

/** Evren adresi: taşınmışsa yeni yeri, değilse eski ağaç. */
export function universeHref(slug: string): string {
  return MOVED_UNIVERSES[slug] ?? `/dark-stories/${slug}`;
}

/** Bu evren yeni spor ağacına taşındı mı (sitemap süzgeci bunu okuyor). */
export function isMovedUniverse(slug: string): boolean {
  return slug in MOVED_UNIVERSES;
}
