import { request as httpsRequest } from 'node:https';
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib';
import { Injectable, Logger } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import type { BookSource } from './google-books.service';

/**
 * **1000Kitap** — Türkçe künyenin ana kaynağı (kullanıcı kararı).
 *
 * Google Books ve Open Library'yi DEĞİŞTİRMEZ, onların yanına eklenir. Üçü
 * birlikte koşar; bu kaynak listenin başında ayrılmış kontenjan alır.
 *
 * Neden bu kaynak eklendi — ölçülmüş üç sebep:
 *  1. **Çevirmen.** `BookEntry.translator` için "hiçbir API güvenilir
 *     vermiyor" diye not düşülmüştü; 1000Kitap künyede standart olarak
 *     veriyor ("Bülbülü Öldürmek" → Ülker İnce).
 *  2. **Önek araması.** `"bül"` sorgusu *Bülbülü Öldürmek*'i buluyor ve
 *     aksan katlıyor. Google Books önek motoru değil (ölçüldü), bu yüzden
 *     Open Library dump'ını kendi Postgres'imize indirme planı gereksizleşti.
 *  3. **Türkçe baskı.** Ad, kapak, yayınevi ve ISBN doğrudan Türkçe baskıdan
 *     geliyor; Open Library'de bunun için iki ayrı sorgu gerekiyordu.
 *
 * **Scrape değil, okuma.** Site Next.js: sayfanın tüm verisi
 * `__NEXT_DATA__` etiketinde hazır JSON olarak duruyor. HTML ayrıştırıcıya
 * (cheerio vb.) gerek yok, yeni bağımlılık eklenmedi.
 *
 * `robots.txt` kitap ve arama sayfalarına açıkça izin veriyor (`Allow: /`).
 */

const BINKITAP_BASE = 'https://1000kitap.com';

/**
 * **Başlıklar bilerek sade tutuluyor — bu bir tercih değil, zorunluluk.**
 *
 * Bot koruması iki ayrı şeye bakıyor, ikisi de ölçüldü. Birincisi istemci
 * (bkz. `requestHtml`); ikincisi başlıklar ve orada kural terse işliyor —
 * `node:https` üzerinden:
 *  - Normal tarayıcı `User-Agent`'ı + joker `Accept`  → 200
 *  - Tam tarayıcı seti (`Accept-Language`, `Sec-Fetch-…`,
 *    `Upgrade-Insecure-Requests`…)                    → **403**
 *  - `curl/8.x` gibi bot `User-Agent`'ı               → **403**
 *
 * Yani "daha çok tarayıcıya benzeyelim" diye başlık eklemek burada isteği
 * öldürür. Bu listeye ekleme yapmadan önce canlıda ölçün.
 *
 * `accept-encoding` güvenli ve değerli: sayfa ~270 KB, gzip'le ~50 KB'a
 * iniyor (ölçüldü).
 */
const REQUEST_HEADERS: Record<string, string> = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
  accept: '*/*',
  'accept-encoding': 'gzip',
};

/** Beklenmedik büyüklükte bir gövdeye karşı üst sınır (sayfa ~270 KB). */
const MAX_PAGE_BYTES = 12 * 1024 * 1024;

/**
 * Arama sonucu bir gün taze sayılır: yeni kitap eklendiğinde bir gün gecikme
 * kişisel arşiv için sorun değil, aynı sorguyu tekrar tekrar sormak ise
 * gereksiz yük.
 */
const SEARCH_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Künye 30 gün taze sayılır. Kural 14'teki 7 günlük varsayılandan uzun,
 * çünkü basılmış bir kitabın ISBN'i, sayfa sayısı ve çevirmeni değişmiyor —
 * değişen tek şey okunma sayacı, o da künyede kullanılmıyor.
 */
const DETAIL_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Kullanıcı yazarken atılan istek; uzun beklemektense bacağı düşürmek iyi. */
const REQUEST_TIMEOUT_MS = 10_000;

/** Nezaket: istekler sıraya girer ve aralarında en az bu kadar boşluk kalır. */
const MIN_REQUEST_GAP_MS = 1_000;

/** Aramadan kaç kayıt alınır (kontenjan `google-books.service` tarafında). */
const SEARCH_LIMIT = 15;

// --- Sitenin JSON yapısı (yalnızca kullandığımız alanlar) ---

interface BinKitapPerson {
  id?: string;
  adi?: string;
  resim?: string;
  seo_adi?: string;
}

/** `turId`: 1 = Yazar, 2 = Çevirmen, 3 = Editör (ölçüldü). */
interface BinKitapPersonGroup {
  turId?: number;
  turAdi?: string;
  yazarlar?: BinKitapPerson[];
}

interface BinKitapLabelled {
  kod?: string;
  baslik?: string;
}

/** Arama sonucundaki ve künyedeki ortak kitap başlığı kaydı. */
interface BinKitapBookHead {
  id?: string;
  adi?: string;
  seo_adi?: string;
  resim?: string;
  resimB?: string;
  altbaslik?: string;
  isbn?: string;
  baskiyili?: string;
  ilkYazar?: string;
  yazarlar?: BinKitapPerson[];
  yazarGruplari?: BinKitapPersonGroup[];
  /** Okunma sayısı — popülerlik sinyali olarak kullanılıyor */
  okuduDuz?: number;
  puan?: number;
}

/** Kitap sayfasındaki "Genel Bakış" künyesi. */
interface BinKitapEditionInfo {
  adi?: string;
  altBaslik?: string;
  orijinalAdi?: string;
  baskiGunu?: string;
  baskiAyi?: string;
  baskiYili?: string;
  baskiYazi?: string;
  ilkBaskiYili?: string;
  dil?: BinKitapLabelled;
  orijinalDil?: BinKitapLabelled;
  ulke?: BinKitapLabelled;
  orijinalUlke?: BinKitapLabelled;
  yayinevi?: string;
  isbn?: string;
  sayfaSayisi?: string;
  tahminiSure?: string;
  format?: { id?: string; baslik?: string };
}

interface BinKitapAbout {
  kidDizi?: Array<{ adi?: string }>;
  baskiBilgileri?: BinKitapEditionInfo;
  bilgiParse?: { parse?: string[] };
  digerBaskilar?: unknown[];
}

interface BinKitapResult {
  kitap?: BinKitapBookHead;
  liste?: Array<BinKitapBookHead & { hakkinda?: BinKitapAbout }>;
}

interface BinKitapPageProps {
  response?: { _sonuc?: BinKitapResult };
}

interface BinKitapNextData {
  props?: { pageProps?: BinKitapPageProps };
}

/** Kaynağın kimlik verdiği bir künye kişisi (yazar / çevirmen / editör). */
export interface BinKitapPersonCredit {
  /**
   * 1000Kitap kişi kimliği — ilişkisel modelde **birincil eşleştirme
   * anahtarı**. Ad üstünden eşleştirme kırılgan ("Erikson, Steven" ile
   * "Steven Erikson" ayrı kişi sanılırdı).
   */
  binKitapId: string | null;
  name: string;
  /** Kaynak yazar fotoğrafını da veriyor; indirilip yerelleştirilir */
  photo: string | null;
  role: 'AUTHOR' | 'TRANSLATOR' | 'EDITOR';
  /** Künyede görünme sırası — ilk yazar başta kalsın */
  orderIndex: number;
}

/** Kaynağın tür kaydı; kimliği var (`kidDizi[].id`, ölçüldü). */
export interface BinKitapGenreCredit {
  binKitapId: string | null;
  name: string;
}

/**
 * İlişkisel künyeyi besleyen yapısal veri. Yayınevi ve seri düz metin
 * geliyor (kaynak kimlik vermiyor, ölçüldü) — onlar ada göre eşleşecek.
 */
export interface BinKitapCredits {
  people: BinKitapPersonCredit[];
  genres: BinKitapGenreCredit[];
  publisher: string | null;
  series: { name: string; index: number | null } | null;
}

/**
 * Künyenin tamamı. `BookSource`a sığmayan alanlar (ülke, editör, format,
 * orijinal dil…) burada durur ve `externalData`ya ham olarak yazılır —
 * kullanıcı kararı: şema büyütmek yerine ham veri saklansın, ileride gereken
 * sütuna terfi ettirilsin.
 */
export interface BinKitapDetail {
  source: BookSource;
  /**
   * `BookSource`ta karşılığı yok, `BookEntry`de sütunu var — bu kaynağın
   * eklenmesinin başlıca sebebi ("hiçbir API güvenilir vermiyor").
   */
  translator: string | null;
  /** İlişkisel künyeyi (Faz 2) besleyen yapısal hâl — kimlikleriyle birlikte */
  credits: BinKitapCredits;
  raw: {
    slug: string;
    binKitapId: string | null;
    editor: string | null;
    format: string | null;
    country: string | null;
    originalCountry: string | null;
    originalLanguage: string | null;
    printedOn: string | null;
    estimatedReadingTime: string | null;
    otherEditionCount: number;
    genres: string[];
    fetchedAt: string;
  };
}

@Injectable()
export class BinKitapService {
  private readonly logger = new Logger(BinKitapService.name);

  /**
   * İstek kuyruğu. Tek kullanıcılı bir arşiv için ağır bir kısıtlayıcıya
   * gerek yok; istekleri tek sıraya dizip aralarına boşluk koymak hem nazik
   * hem de bot korumasına takılma riskini düşürüyor.
   */
  private queue: Promise<unknown> = Promise.resolve();
  private lastRequestAt = 0;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Küratör aramasının 1000Kitap bacağı.
   *
   * Arama sonucu künye taşımıyor (yayınevi, ISBN, sayfa sayısı yok) — onlar
   * yalnızca kitap sayfasında var. Bu yüzden sonuçlar ad, yazar, kapak ve
   * okunma sayısıyla dönüyor; künyenin tamamı ancak küratör "ekle" dediğinde
   * `getDetail` ile çekiliyor. Böylece bir aramada tek istek atılıyor.
   */
  async search(query: string): Promise<BookSource[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const cacheKey = `books:1k:search:v1:${slugKey(trimmed)}`;
    const cached = await this.readCache<BookSource[]>(cacheKey, SEARCH_TTL_MS);
    if (cached) {
      return cached;
    }

    const data = await this.fetchNextData(
      `/ara?q=${encodeURIComponent(trimmed)}&bolum=kitaplar`,
    );
    const list = data?.props?.pageProps?.response?._sonuc?.liste ?? [];
    const results = list
      .map((item) => toSearchResult(item))
      .filter((item): item is BookSource => item !== null)
      .slice(0, SEARCH_LIMIT);

    await this.writeCache(cacheKey, results);
    return results;
  }

  /**
   * Kitap sayfasının tam künyesi. Küratör "ekle" dediğinde bir kez çağrılır;
   * sonrası tamamen kendi veritabanımızdan okunur (kullanıcı kararı).
   *
   * Dış istek düşerse bayat cache sunulur, kullanıcıya hata gösterilmez
   * (kural 14).
   */
  async getDetail(slug: string): Promise<BinKitapDetail | null> {
    const cacheKey = `books:1k:book:v1:${slugKey(slug)}`;
    const cached = await this.readCache<BinKitapDetail>(
      cacheKey,
      DETAIL_TTL_MS,
    );
    if (cached) {
      return cached;
    }

    let data: BinKitapNextData | null;
    try {
      data = await this.fetchNextData(`/kitap/${encodeURI(slug)}`);
    } catch (error) {
      const stale = await this.readCache<BinKitapDetail>(cacheKey, Infinity);
      if (stale) {
        this.logger.warn(
          `1000Kitap ${slug} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return stale;
      }
      throw error;
    }

    const detail = toDetail(data, slug);
    if (detail) {
      await this.writeCache(cacheKey, detail);
    }
    return detail;
  }

  // --- Ağ katmanı ---

  /**
   * Sayfayı çekip `__NEXT_DATA__` içeriğini çözer.
   *
   * İstekler `queue` üzerinden tek sıraya dizilir ve aralarında en az
   * `MIN_REQUEST_GAP_MS` boşluk bırakılır; timeout `AbortSignal` ile
   * uygulanır, çünkü asılı kalan bir istek arama bacağını da askıda tutar.
   */
  private async fetchNextData(path: string): Promise<BinKitapNextData | null> {
    const run = this.queue.then(async () => {
      const gap = Date.now() - this.lastRequestAt;
      if (gap < MIN_REQUEST_GAP_MS) {
        await sleep(MIN_REQUEST_GAP_MS - gap);
      }
      this.lastRequestAt = Date.now();
      return extractNextData(await this.requestHtml(path));
    });

    // Kuyruk bir hatada kırılmasın: sıradaki istek yine çalışabilmeli
    this.queue = run.catch(() => undefined);
    return run;
  }

  /**
   * Sayfayı indirir. **`fetch` kullanılamıyor — ölçülmüş bir kısıt.**
   *
   * Sitenin bot koruması Node'un `fetch` gerçeklemesini (undici) başlıktan
   * bağımsız olarak engelliyor; aynı adres `node:https` ile sorunsuz açılıyor:
   *
   * | İstemci                      | Sonuç |
   * |------------------------------|-------|
   * | `node:https` + sade başlık   | 200   |
   * | `fetch` + sade başlık        | 403   |
   * | `fetch` + yalnızca UA        | 403   |
   * | `fetch` + hiç başlık yok     | 403   |
   *
   * Bu yüzden burada bilerek düşük seviyeli istemci kullanılıyor. Kapak
   * indirme (`book-cover.service.ts`) `fetch` ile devam ediyor: CDN sunucusu
   * (`1k-cdn.com`) aynı korumanın arkasında değil, ölçüldü.
   */
  private requestHtml(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const url = new URL(`${BINKITAP_BASE}${path}`);
      const request = httpsRequest(
        {
          hostname: url.hostname,
          path: `${url.pathname}${url.search}`,
          method: 'GET',
          headers: REQUEST_HEADERS,
          timeout: REQUEST_TIMEOUT_MS,
        },
        (response) => {
          const status = response.statusCode ?? 0;
          if (status !== 200) {
            response.resume();
            this.logger.warn(`1000Kitap ${path} → ${status}`);
            reject(new Error(`1000Kitap ${status}`));
            return;
          }

          const encoding = response.headers['content-encoding'];
          const stream =
            encoding === 'gzip'
              ? response.pipe(createGunzip())
              : encoding === 'deflate'
                ? response.pipe(createInflate())
                : encoding === 'br'
                  ? response.pipe(createBrotliDecompress())
                  : response;

          const chunks: Buffer[] = [];
          let size = 0;
          stream.on('data', (chunk: Buffer) => {
            size += chunk.length;
            // Sayfa ~270 KB; bu sınır beklenmedik bir gövdeye karşı
            if (size > MAX_PAGE_BYTES) {
              request.destroy();
              reject(new Error('1000Kitap yanıtı çok büyük'));
              return;
            }
            chunks.push(chunk);
          });
          stream.on('end', () =>
            resolve(Buffer.concat(chunks).toString('utf8')),
          );
          stream.on('error', reject);
        },
      );

      request.on('timeout', () =>
        request.destroy(new Error('1000Kitap zaman aşımı')),
      );
      request.on('error', reject);
      request.end();
    });
  }

  // --- Cache (kural 4/14) ---

  private async readCache<T>(
    cacheKey: string,
    ttlMs: number,
  ): Promise<T | null> {
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (!cached) {
      return null;
    }
    if (Date.now() - cached.fetchedAt.getTime() >= ttlMs) {
      return null;
    }
    return cached.payload as unknown as T;
  }

  private async writeCache(cacheKey: string, payload: unknown): Promise<void> {
    const value = payload as never;
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: { cacheKey, payload: value, fetchedAt: new Date() },
      update: { payload: value, fetchedAt: new Date() },
    });
  }
}

// --- Dönüştürücüler ---

/**
 * `__NEXT_DATA__` çıkarımı **düz dize araması** ile yapılıyor, düzenli ifade
 * ile değil: sayfa ~270 KB ve büyük girdilerde geri izlemeli bir kalıp hem
 * yavaş hem de riskli. `indexOf` her iki sorunu da ortadan kaldırıyor.
 */
export function extractNextData(html: string): BinKitapNextData | null {
  const opening = '<script id="__NEXT_DATA__" type="application/json">';
  const start = html.indexOf(opening);
  if (start === -1) {
    return null;
  }
  const from = start + opening.length;
  const end = html.indexOf('</script>', from);
  if (end === -1) {
    return null;
  }
  try {
    return JSON.parse(html.slice(from, end)) as BinKitapNextData;
  } catch {
    return null;
  }
}

/** Arama sonucundaki tek kayıt. Künye alanları burada YOK, yalnız kimlik. */
function toSearchResult(item: BinKitapBookHead): BookSource | null {
  if (!item.adi || !item.seo_adi || !item.id) {
    return null;
  }
  const authors = readAuthors(item);
  const series = readSeries(item.altbaslik, item.adi);
  return {
    googleId: null,
    olKey: null,
    isbn13: item.isbn ?? null,
    title: item.adi,
    subtitle: null,
    authors,
    publisher: null,
    publishedYear: toYear(item.baskiyili),
    firstPublishedYear: null,
    pageCount: null,
    /**
     * 1000Kitap Türkçe bir okur sitesi: aramada dönen baskılar Türkçe. Künye
     * çekilince gerçek dil koduyla değiştiriliyor.
     */
    language: 'tr',
    coverImage: pickCover(item),
    description: null,
    genres: [],
    seriesName: series.name,
    seriesIndex: series.index,
    originalTitle: null,
    provider: 'BINKITAP',
    binKitapSlug: `${item.seo_adi}--${item.id}`,
    /** Okunma sayısı: "89.456 kişi okumuş" gürültüden ayırmanın en iyi sinyali */
    popularity: item.okuduDuz ?? 0,
  };
}

/** Kitap sayfasının tamamı: künye + `externalData`ya yazılacak ham alanlar. */
export function toDetail(
  data: BinKitapNextData | null,
  slug: string,
): BinKitapDetail | null {
  const result = data?.props?.pageProps?.response?._sonuc;
  const head = result?.kitap;
  if (!head?.adi) {
    return null;
  }

  const about = result?.liste?.find((item) => item.hakkinda)?.hakkinda ?? {};
  const info = about.baskiBilgileri ?? {};
  const genreCredits = (about.kidDizi ?? [])
    .filter((item): item is { id?: string; adi: string } => Boolean(item.adi))
    .map((item) => ({ binKitapId: item.id ?? null, name: item.adi }));
  const genres = genreCredits.map((item) => item.name);
  const series = readSeries(head.altbaslik ?? info.altBaslik, head.adi);

  const rawSubtitle = head.altbaslik ?? info.altBaslik;
  const source: BookSource = {
    googleId: null,
    olKey: null,
    isbn13: head.isbn ?? info.isbn ?? null,
    title: head.adi,
    /**
     * Cilt işareti taşımayan `altbaslik` seri değil, düz alt başlıktır
     * (bkz. `readSeries`) — kaybolmasın diye buraya yazılıyor.
     */
    subtitle:
      !series.name && rawSubtitle && slugify(rawSubtitle) !== slugify(head.adi)
        ? rawSubtitle
        : null,
    authors: readAuthors(head),
    publisher: info.yayinevi ?? null,
    publishedYear: toYear(info.baskiYili ?? head.baskiyili),
    firstPublishedYear: toYear(info.ilkBaskiYili),
    pageCount: toCount(info.sayfaSayisi),
    language: info.dil?.kod ?? null,
    coverImage: pickCover(head),
    description: readDescription(about.bilgiParse?.parse),
    genres,
    seriesName: series.name,
    seriesIndex: series.index,
    /**
     * Türkçe telifte site orijinal adı kitabın adıyla aynı yazıyor
     * ("Kürk Mantolu Madonna"); o durumda alan boş bırakılıyor, yoksa künyede
     * aynı satır iki kez görünür.
     */
    originalTitle:
      info.orijinalAdi && info.orijinalAdi !== head.adi
        ? info.orijinalAdi
        : null,
    provider: 'BINKITAP',
    binKitapSlug: slug,
    popularity: head.okuduDuz ?? 0,
  };

  return {
    source,
    translator: readRole(head, 2),
    credits: {
      people: readPeople(head),
      genres: genreCredits,
      publisher: info.yayinevi ?? null,
      series: series.name ? { name: series.name, index: series.index } : null,
    },
    raw: {
      slug,
      binKitapId: head.id ?? null,
      editor: readRole(head, 3),
      format: info.format?.baslik ?? null,
      country: info.ulke?.baslik ?? null,
      originalCountry: info.orijinalUlke?.baslik ?? null,
      originalLanguage: info.orijinalDil?.baslik ?? null,
      printedOn: info.baskiYazi ?? null,
      estimatedReadingTime: info.tahminiSure ?? null,
      otherEditionCount: about.digerBaskilar?.length ?? 0,
      genres,
      fetchedAt: new Date().toISOString(),
    },
  };
}

/** `yazarGruplari` yoksa (aramada olmuyor) düz `yazarlar` listesine düşer. */
function readAuthors(item: BinKitapBookHead): string[] {
  const grouped = readRole(item, 1);
  if (grouped) {
    return grouped.split(', ');
  }
  const flat = (item.yazarlar ?? [])
    .map((person) => person.adi)
    .filter((name): name is string => Boolean(name));
  if (flat.length > 0) {
    return flat;
  }
  return item.ilkYazar ? [item.ilkYazar] : [];
}

/**
 * Künyedeki bütün kişileri rolleriyle çıkarır — ilişkisel modelin girdisi.
 *
 * Aynı kişi iki rolde birden görünebiliyor (yazar-çevirmen), o yüzden
 * tekilleştirme YAPILMIYOR: `BookPersonOnEntry` kısıtı role dahil.
 */
function readPeople(item: BinKitapBookHead): BinKitapPersonCredit[] {
  const roles: Array<[number, BinKitapPersonCredit['role']]> = [
    [1, 'AUTHOR'],
    [2, 'TRANSLATOR'],
    [3, 'EDITOR'],
  ];
  const people: BinKitapPersonCredit[] = [];
  for (const [turId, role] of roles) {
    const group = (item.yazarGruplari ?? []).find(
      (entry) => entry.turId === turId,
    );
    (group?.yazarlar ?? []).forEach((person, index) => {
      if (!person.adi) {
        return;
      }
      people.push({
        binKitapId: person.id ?? null,
        name: person.adi,
        photo: person.resim ?? null,
        role,
        orderIndex: index,
      });
    });
  }
  return people;
}

/** `turId`: 1 = Yazar, 2 = Çevirmen, 3 = Editör. */
export function readRole(item: BinKitapBookHead, turId: number): string | null {
  const group = (item.yazarGruplari ?? []).find(
    (entry) => entry.turId === turId,
  );
  const names = (group?.yazarlar ?? [])
    .map((person) => person.adi)
    .filter((name): name is string => Boolean(name));
  return names.length > 0 ? names.join(', ') : null;
}

/**
 * Kapak. Ölçüldü: `resim` ve `resimB` **aynı** dosyayı gösteriyor (345×499,
 * ~37 KB) ve `_b` sonekli ya da parametreli bir büyük sürüm yok. Yani tek
 * çözünürlük var; ikisi de denenmesinin sebebi yalnızca biri boş gelirse
 * diğerine düşmek.
 */
function pickCover(item: BinKitapBookHead): string | null {
  return item.resimB ?? item.resim ?? null;
}

/**
 * Açıklama paragraf paragraf geliyor; paragraflar korunuyor (kullanıcı
 * isteği) ve metin `sanitize-html` ile etiketlerden arındırılıyor. Alan
 * `@db.Text` ve düz metin olarak gösteriliyor, bu yüzden hiçbir etiket
 * bırakılmıyor.
 */
function readDescription(paragraphs: string[] | undefined): string | null {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }
  const text = paragraphs
    .map((paragraph) =>
      sanitizeHtml(paragraph, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim(),
    )
    .filter((paragraph) => paragraph.length > 0)
    .join('\n\n');
  return text.length > 0 ? text : null;
}

/**
 * `altbaslik` alanının cilt işareti biçimleri. Site **iki ayrı biçim**
 * kullanıyor, ikisi de canlıda ölçüldü:
 *  - `"Malazan Yitikler Kitabı #1"`
 *  - `"Dune 2. Kitap"` (Türkçe sıra sayısı)
 *
 * İkincisi tanınmazsa cilt numarası seri adının içinde kalıyordu: *Dune
 * Mesihi* için seri adı "Dune 2. Kitap" çıkıyor ve her cilt AYRI bir seri
 * oluyordu — seri gruplaması tamamen bozulurdu.
 */
const SERIES_PATTERNS: RegExp[] = [
  /^(.*?)\s*#\s*(\d+)\s*$/,
  /^(.*?)\s*(\d+)\s*\.\s*(?:kitap|cilt)\s*$/i,
];

/**
 * Seri adı ve cilt sırası.
 *
 * **Cilt işareti yoksa seri de yoktur.** `altbaslik` alanı iki ayrı şeyi
 * taşıyor: seri bilgisi ("Malazan Yitikler Kitabı #1") ve düz alt başlık
 * ("Türkiye'de Transgender, Aktivizm ve Altkültürel Pratikler" — canlıda
 * ölçüldü). İşaret aranmasaydı her alt başlık tek kitaplık bir "seri"
 * üretirdi ve `BookSeries` tablosu çöple dolardı. İşaretsiz alt başlık
 * `BookSource.subtitle`a gidiyor, serisiz kalıyor.
 *
 * **Kitabın kendi adıyla aynı olan seri de yok sayılır** (kullanıcı kararı):
 * site tekil kitaplara da "Bülbülü Öldürmek #1" diyor.
 */
export function readSeries(
  subtitle: string | undefined,
  title: string,
): { name: string | null; index: number | null } {
  if (!subtitle) {
    return { name: null, index: null };
  }
  for (const pattern of SERIES_PATTERNS) {
    const match = subtitle.match(pattern);
    if (!match) {
      continue;
    }
    const name = match[1].trim();
    const index = Number.parseInt(match[2], 10);
    if (!name || slugify(name) === slugify(title)) {
      return { name: null, index: null };
    }
    return { name, index: Number.isFinite(index) ? index : null };
  }
  return { name: null, index: null };
}

function toYear(value: string | undefined): number | null {
  const year = Number.parseInt(value ?? '', 10);
  return Number.isFinite(year) && year > 0 ? year : null;
}

function toCount(value: string | undefined): number | null {
  const count = Number.parseInt(value ?? '', 10);
  return Number.isFinite(count) && count > 0 ? count : null;
}

function slugKey(value: string): string {
  return slugify(value).slice(0, 60);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
