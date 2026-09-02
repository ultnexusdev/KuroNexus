import type { MetadataRoute } from "next";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import { getMovieArchive } from "@/lib/api/movies";
import { getShowArchive } from "@/lib/api/shows";
import { getAnimeArchive } from "@/lib/api/anime";
import { getBookArchive } from "@/lib/api/books";
import { fetchMusicActs } from "@/lib/api/music";
import { fetchF1Hub, fetchFootballHub } from "@/lib/api/sport-archive";
import { FAVOURITE_PLAYERS, isInNotebook } from "@/lib/sport/favourite-players";
import { EXPERIENCE_IDS } from "@/lib/characters/experiences";
import { hallHref } from "@/lib/halls";
import { isMovedUniverse } from "@/lib/sport/routes";
import { SITE_URL } from "@/lib/site";

/**
 * `/sitemap.xml` — bugüne kadar hiç yoktu (404 dönüyordu).
 *
 * Saatte bir yeniden üretilir. Derleme anında sabitlenmemesi bilinçli: yeni bir
 * evren ya da kategori eklendiğinde yeni bir deploy beklemeden listeye girer.
 */
export const revalidate = 3600;

/**
 * Parametresiz, herkese açık sayfalar. Yönetim ekranları burada YOK — onlar
 * `robots.txt`te de kapalı.
 */
const STATIC_PATHS = [
  "",
  "/dark-stories",
  // Salon 06 · Spor — kendi ağacında (bkz. hallHref)
  "/spor",
  "/spor/futbol",
  "/spor/futbol/efsaneler",
  "/spor/formula-1",
  // Salon 06 · Müzik — kendi ağacında (bkz. hallHref)
  "/muzik",
  "/muzik/tur",
  "/muzik/dinleme",
  "/muzik/sanatcilar",
  "/muzik/listeler",
  // Salon 04 · Anime — girişi kendi ağacında (16 Ağustos 2026, bkz. hallHref);
  // derin odalar aşağıda eski ağaçta duruyor
  "/anime",
  "/anime/akatsuki",
  "/anime/naruto",
  /* Bleach Evreni — P18-b'de `noindex` kalktı, sayfa artık indekslenebilir.
     ⚠️ `/anime/bleach/playground` BİLEREK YOK: tasarım denemesi, kendi
     `generateMetadata`sında `noindex` taşıyor. */
  "/anime/bleach",
  /* Slam Dunk Evreni — 28 Ağustos 2026. Kilit yok: sayfa ilk günden
     indekslenebilir, çünkü kırk beş kadro kaydının tamamı ve beş takımın
     verisi yayına girerken hazır (Bleach'te içerik on altı bölüm boyunca
     birikiyordu ve `noindex` o yüzden gerekmişti). */
  "/anime/slam-dunk",
  "/dark-stories/category/kitap",
  "/dark-stories/category/kitap/arsiv",
  "/dark-stories/category/kitap/seriler",
  "/dark-stories/category/kitap/yazarlar",
  "/dark-stories/category/kitap/oduller",
  "/dark-stories/category/kitap/okuma-sirasi",
  "/dark-stories/category/anime/arsiv",
  "/dark-stories/category/anime/karakterler",
  "/dark-stories/category/dizi/arsiv",
  "/dark-stories/category/film/arsiv",
];

/**
 * Bir yolu iki dilli girdiye çevirir.
 *
 * `localePrefix: "as-needed"` (bkz. lib/i18n/routing.ts): Türkçe öneksiz,
 * İngilizce `/en` önekli. Her iki adres de listeye ayrı ayrı girer ve ikisi de
 * aynı `alternates` haritasını taşır — hreflang'in doğru kullanımı bu:
 * her URL, kendisi dahil tüm dil eşlerini bildirir.
 */
function localizedEntries(
  path: string,
  lastModified: Date,
  priority: number,
): MetadataRoute.Sitemap {
  const tr = `${SITE_URL}${path}`;
  // Yalnız Türkçe sayfa: `/en` adresi aynı içeriğin kopyası, haritaya girmez
  // ve dil eşi olarak bildirilmez (sayfanın `alternates`ı da TR'ye kilitli).
  if (TURKISH_ONLY_PATHS.has(path)) {
    return [{ url: tr, lastModified, priority, alternates: { languages: { tr } } }];
  }
  const en = `${SITE_URL}/en${path}`;
  const languages = { tr, en };
  return [
    { url: tr, lastModified, priority, alternates: { languages } },
    { url: en, lastModified, priority, alternates: { languages } },
  ];
}

/**
 * İçeriği baştan sona Türkçe gömülü sayfalar — BİLİNÇLİ İSTİSNA (H-F6,
 * 2 Eylül 2026, kullanıcı kararı). Bleach/JJK deseninin (`Localized` veri +
 * sözlük) uygulanması ~15 KB lore metninin İngilizce yeniden yazımı demek;
 * o iş yapılana kadar İngilizce adres dürüstçe "Türkçe kayıt" olarak
 * işaretlenir: `lang="tr"`, `noindex`, hreflang'de yalnız TR. Sayfa
 * çevrilince buradan ve `generateMetadata`sından `turkishOnly` kalkar.
 */
const TURKISH_ONLY_PATHS = new Set(["/anime/naruto"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push(...localizedEntries(path, now, path === "" ? 1 : 0.8));
  }

  /**
   * Dinamik bölümler API'den geliyor. `allSettled` bilinçli: API'ye
   * ulaşılamazsa sitemap **boş dönmez**, sabit sayfalarla yayınlanır.
   * Bu projede sessiz boş yanıt bilinen bir tuzak (bulgu Ö-8) — burada
   * kabul edilebilir olmasının sebebi, alternatifin hiç sitemap olmaması.
   */
  const [categories, universes] = await Promise.allSettled([
    fetchCategories(),
    fetchUniverses(),
  ]);

  /*
   * ⚠️ TAŞINMIŞ ADRESLER SİTEMAP'E GİRMEZ (8 Ağustos 2026).
   *
   * Bu iki döngü kategori ve evren listesinin TAMAMINI dolaşıyor. Spor kanadı
   * `/spor` ağacına taşınıp `next.config.ts`e kalıcı yönlendirmeler eklendiği
   * an, süzgeç olmadan sitemap üç adet 301'lenen adres ilan etmeye başlardı
   * (× 2 dil = altı hatalı girdi): kategori sayfası, Galatasaray ve Formula 1.
   * Search Console bunları "Yönlendirmeli sayfa" diye işaretler ve sitemap'in
   * taşıdığı güven düşer.
   *
   * Süzgeçler adresin kendisinden değil `hallHref`/`isMovedUniverse` tek
   * kaynağından okuyor — ikinci bir salon taşındığında burası kendiliğinden
   * doğru kalsın diye.
   */
  if (categories.status === "fulfilled") {
    for (const category of categories.value) {
      const path = hallHref(category.slug);
      // Taşınmış salonun yeni adresi STATIC_PATHS'te elle duruyor; buradan
      // ikinci kez (ve eski adresiyle) eklenmesin.
      if (!path.startsWith("/dark-stories/")) continue;
      entries.push(
        ...localizedEntries(path, new Date(category.updatedAt), 0.7),
      );
    }
  }

  if (universes.status === "fulfilled") {
    for (const universe of universes.value) {
      if (isMovedUniverse(universe.slug)) continue;
      entries.push(
        ...localizedEntries(
          `/dark-stories/${universe.slug}`,
          new Date(universe.updatedAt),
          0.7,
        ),
      );
    }
  }

  /**
   * ── YAPRAK İÇERİK SAYFALARI (2026-08-22 denetimi) ────────────────────────
   *
   * Sitemap bugüne kadar yalnızca salon kapılarını listeliyordu; asıl uzun
   * kuyruk — film/dizi/anime/kitap detayları, sanatçılar, kulüpler, pistler,
   * futbolcular — ancak raf sayfalarından taranarak bulunabiliyordu. Aynı
   * `allSettled` sözleşmesi geçerli: bir koleksiyonun ucu düşerse sitemap o
   * koleksiyonsuz yayınlanır, boş dönmez.
   *
   * BİLE BİLE EKLENMEYENLER (uç ya da liste yok / N+1 gerektirir):
   * evren içi hikâye ve wiki sayfaları (evren başına ayrı istek isterdi),
   * müzik albüm/liste/tür odaları, kitap kişi/yayınevi/seri/kaynak alt
   * ağaçları, anime karakter dosyaları, F1 sürücüleri (hiçbir uç sürücü
   * LİSTESİ vermiyor — denetim raporunda not).
   *
   * `lastModified` olarak `now` basılıyor: arşiv uçları kayıt başına
   * güncellenme tarihi taşımıyor; yanlış (bayat) bir tarih basmaktansa
   * üretim anı basılıyor.
   */
  const [movies, shows, anime, books, acts, f1, football] =
    await Promise.allSettled([
      getMovieArchive(),
      getShowArchive(),
      getAnimeArchive(),
      getBookArchive(),
      fetchMusicActs(),
      fetchF1Hub(),
      fetchFootballHub(),
    ]);

  const leaf = (path: string) => entries.push(...localizedEntries(path, now, 0.6));

  if (movies.status === "fulfilled") {
    for (const m of movies.value.movies) leaf(`/dark-stories/category/film/${m.slug}`);
  }
  if (shows.status === "fulfilled") {
    for (const s of shows.value.shows) leaf(`/dark-stories/category/dizi/${s.slug}`);
  }
  if (anime.status === "fulfilled") {
    for (const a of anime.value.entries) leaf(`/dark-stories/category/anime/${a.slug}`);
  }
  if (books.status === "fulfilled") {
    for (const b of books.value.books) leaf(`/dark-stories/category/kitap/${b.slug}`);
  }
  if (acts.status === "fulfilled") {
    for (const act of acts.value) leaf(`/muzik/${act.slug}`);
  }
  if (f1.status === "fulfilled") {
    for (const c of f1.value.circuits) leaf(`/spor/formula-1/pistler/${c.slug}`);
  }
  if (football.status === "fulfilled") {
    for (const c of football.value.clubs) leaf(`/spor/futbol/${c.slug}`);
    /* Defterde karşılığı olan arşiv efsanesi ELENİYOR — salonlarla aynı
       kural: o kişinin kanonik sayfası artık futbolcu profili. */
    for (const l of football.value.legends) {
      if (!isInNotebook(l.slug)) leaf(`/spor/futbol/efsaneler/${l.slug}`);
    }
  }
  // Futbolcu defteri tamamen yerel veri — ağ isteği yok.
  for (const p of FAVOURITE_PLAYERS) leaf(`/spor/futbol/futbolcular/${p.slug}`);

  /*
   * Elle tasarlanmış karakter deneyim sayfaları (22 Ağustos 2026).
   *
   * Yukarıdaki notta "anime karakter dosyaları" bile bile dışarıda
   * bırakılmıştı — 195 karakterin tamamı için doğru karar, çünkü çoğu
   * yalnızca AniList künyesi. Ama BU on dört adres öyle değil: her biri
   * elle yazılmış, kendi bileşen setiyle çizilen bir sayfa. Liste kodda
   * ve sabit, yani ek ağ isteği yok.
   */
  for (const id of Object.values(EXPERIENCE_IDS)) {
    leaf(`/dark-stories/category/anime/karakterler/${id}`);
  }

  // Kategori listesi sabit yollarla çakışabilir (ör. "kitap" hem elle yazılı
  // hem API'den geliyor); son yazan kazanır, tekrar eden adres kalmaz.
  const unique = new Map(entries.map((entry) => [entry.url, entry]));
  return [...unique.values()];
}
