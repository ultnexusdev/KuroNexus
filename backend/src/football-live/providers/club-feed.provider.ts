import { Logger } from '@nestjs/common';

/**
 * Sağlayıcı 4 — KULÜBÜN KENDİ RSS BESLEMESİ.
 *
 * ── NEDEN BU KAYNAK ──────────────────────────────────────────────────────
 * Brief 18. maddede "GALATASARAY LIVE" haber şeridi istiyor ve haberin
 * "mümkünse gerçek veri kaynağından" gelmesini şart koşuyor. Kulübün resmî
 * sitesi zaten bir RSS yayımlıyor:
 *
 *   https://www.galatasaray.org/xml/gs.rss
 *
 * Adres tahmin edilmedi — TheSportsDB takım künyesindeki `strRSS` alanından
 * geldi. RSS SENDİKASYON İÇİN yayımlanan bir biçim, yani bu kaynağı okumak
 * kazıma değil; beslemenin var oluş amacı bu. Ölçüm (19 Ağustos 2026):
 * 200, `application/rss+xml`, 20 haber, en yenisi aynı günün antrenman
 * raporu.
 *
 * ── NEDEN AYRI BİR HABER SAĞLAYICISI YOK ─────────────────────────────────
 * Sakatlık/ceza/transfer için ayrı bir veri kaynağı aranmadı: kulübün kendi
 * duyurusu bu üçünü de zaten yayımlıyor ve İKİNCİL bir kaynağın "sakatlık"
 * dediği şeyi doğrulayacak yolumuz yok. Resmî duyuruyu göstermek, üçüncü
 * taraf bir sitenin yorumunu göstermekten hem doğru hem dürüst.
 */

const FEED_URL = 'https://www.galatasaray.org/xml/gs.rss';
const UA = 'KuroNexus/1.0 (+https://kuronexus.com; ultnexus.dev@gmail.com)';

export interface ClubNewsItem {
  title: string;
  link: string;
  /** ISO 8601; besleme tarihi vermiyorsa ya da çözülemiyorsa null */
  publishedAt: string | null;
  summary: string | null;
}

export class ClubFeedProvider {
  readonly name = 'club-feed';
  private readonly logger = new Logger(ClubFeedProvider.name);

  constructor(private readonly feedUrl: string = FEED_URL) {}

  async fetchNews(limit = 12): Promise<ClubNewsItem[]> {
    const res = await fetch(this.feedUrl, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/rss+xml, application/xml',
      },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`CLUBFEED.HTTP_${res.status}`);
    return parseRss(await res.text(), limit);
  }
}

/**
 * RSS 2.0 ayrıştırıcı — yalnızca ihtiyacımız olan dört alan.
 *
 * XML kütüphanesi eklenmedi: besleme sabit ve sığ bir RSS 2.0, dört alan
 * okumak için bağımlılık eklemek brief'in "gereksiz yere kütüphane ekleme"
 * maddesine aykırı olurdu. Ayrıştırma başarısız olursa boş dizi dönüyor ve
 * şerit hiç çizilmiyor.
 *
 * ⚠️ Regex'ler LİTERAL yazılıyor, `new RegExp('...')` ile DEĞİL. Gerekçe
 * ölçümle bulundu: bu depoda bir kabuk here-doc'u üzerinden yazılan
 * `new RegExp('[\\s\\S]')` çağrısı kaçışı yiyip `[sS]` üretti ve eşleşme
 * sessizce boş döndü. Literal regex o sınıf hatayı tamamen kapatıyor.
 */
export function parseRss(xml: string, limit: number): ClubNewsItem[] {
  const out: ClubNewsItem[] = [];

  for (const item of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = item[1];
    const title = readTag(block, 'title');
    const link = readTag(block, 'link');
    // Başlıksız ya da bağlantısız haber şeride konmuyor — tıklanamayan bir
    // şerit öğesi kullanıcıyı çıkmaza sokar.
    if (!title || !link) continue;

    const pubDate = readTag(block, 'pubDate');
    let publishedAt: string | null = null;
    if (pubDate) {
      const parsed = Date.parse(pubDate);
      if (Number.isFinite(parsed)) publishedAt = new Date(parsed).toISOString();
    }

    out.push({
      title,
      link,
      publishedAt,
      summary: readTag(block, 'description'),
    });

    if (out.length >= limit) break;
  }

  return out;
}

const TAG_PATTERNS: Record<string, RegExp> = {
  title: /<title[^>]*>([\s\S]*?)<\/title>/,
  link: /<link[^>]*>([\s\S]*?)<\/link>/,
  pubDate: /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/,
  description: /<description[^>]*>([\s\S]*?)<\/description>/,
};

function readTag(block: string, tag: string): string | null {
  const hit = TAG_PATTERNS[tag]?.exec(block);
  if (!hit) return null;
  const value = hit[1]
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(Number(d)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return value ? value : null;
}
