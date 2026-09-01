import { Logger } from '@nestjs/common';
import { sleep } from '../../common/utils/sleep';
import {
  normalizeTeamKey,
  type FootballProvider,
  type LiveMatch,
  type LiveMatchStatus,
  type LiveStandings,
  type LiveStandingRow,
  type ProviderCapabilities,
} from './types';

/**
 * Sağlayıcı 0 — TÜRKİYE FUTBOL FEDERASYONU (tff.org). BİRİNCİL KAYNAK.
 *
 * ── NEDEN BU, DİĞERLERİ DEĞİL ────────────────────────────────────────────
 * 19 Ağustos 2026'da beş kaynak ölçüldü. TFF hepsini geride bırakıyor ve
 * sebebi tek cümle: ligin RESMÎ kayıt tutucusu burası, geri kalan herkes
 * buradan türetiyor (Vikipedi maddesi bile kaynak olarak TFF'yi gösteriyor).
 *
 * | Kaynak             | 2026-27 | Anahtar | Engel                          |
 * |--------------------|---------|---------|--------------------------------|
 * | TFF                | ✅       | yok     | YOK — sunucu tarafında render   |
 * | API-Football free  | ❌       | var     | plan 2022-2024'e kilitli        |
 * | TheSportsDB free   | ✅       | yok     | yanıtı 5 satırda kesiyor        |
 * | SofaScore          | ✅       | yok     | TLS parmak izi bot koruması ⛔   |
 * | c0ze/super-lig     | ❌       | —       | 2026-06'dan beri donmuş arşiv   |
 *
 * Ölçüm: `GET /Default.aspx?pageID=198` 200 dönüyor, 34 haftanın tamamı ve
 * 18 takımlık puan cetveli HTML'in içinde hazır geliyor; bot koruması,
 * JavaScript render'ı ya da kota yok.
 *
 * ── KODLAMA TUZAĞI ───────────────────────────────────────────────────────
 * ⚠️ Sayfa UTF-8 DEĞİL, `windows-1254` (Türkçe kod sayfası). `res.text()`
 * çağırmak sessizce bozuk metin üretiyor — ölçüldü: UTF-8 olarak okununca
 * "GALATASARAY A.Ş." aranınca BULUNAMIYOR, çünkü Ş baytı geçersiz UTF-8
 * dizisi olup U+FFFD'ye düşüyor. Bu yüzden gövde her zaman `arrayBuffer()`
 * ile alınıp elle çözülüyor.
 *
 * ── NEZAKET ──────────────────────────────────────────────────────────────
 * Kimliğimizi bildiren bir User-Agent gönderiyoruz ve maç detayı isteklerinin
 * arasına gecikme koyuyoruz. Senkron GÜNDE BİR koşuyor (cron), sayfa
 * render'ında TFF'ye HİÇ çıkılmıyor — kanadın kural 4/14 sözü bu.
 */

const BASE = 'https://www.tff.org';
const UA =
  'KuroNexus/1.0 (+https://kuronexus.com; ultnexus.dev@gmail.com) arsiv-senkronu';

/** Süper Lig fikstür + puan cetveli sayfası */
const PAGE_FIXTURE = '/Default.aspx?pageID=198';

/** Maç detayı — tarih, saat, stat, hakem */
const PAGE_MATCH = '/Default.aspx?pageID=29&macId=';

/** Galatasaray'ın TFF kulüp kimliği (ölçüldü: fikstür bağlantılarında kulupId=3604) */
export const TFF_GS_CLUB_ID = '3604';

export interface TffProviderOptions {
  /** Kaç maçın detayı çekilsin (tarih/saat/stat için). Cron başına istek bütçesi. */
  detailBudget?: number;
}

export class TffProvider implements FootballProvider {
  readonly name = 'tff';
  private readonly logger = new Logger(TffProvider.name);

  constructor(private readonly options: TffProviderOptions = {}) {}

  /**
   * Canlı skor KAPALI. Sayfa maç sırasında güncelleniyor olabilir ama dakika
   * bilgisi yok ve yoklama sıklığını resmî siteye yüklemek doğru değil —
   * canlı iş, onu sözleşmesinde taahhüt eden bir sağlayıcıya (API-Football)
   * ait. Kadro da yok: TFF kulüp sayfası mevcut kadroyu listelemiyor.
   *
   * ⛔ GOL KRALLIĞI DA KAPALI — ölçüldü, sayfa ÖLÜ. `pageID=821` 200 dönüyor
   * ama içindeki tek takım listesi 2019-2020 sezonundan kalma bir `<meta
   * keywords>` etiketi; güncel golcü tablosu HTML'de hiç yok. Uç çalışıyor
   * görünüp boş dönmesin diye yetenek bildirimi kapatıldı — krallık verisi
   * Vikipedi adaptöründen geliyor.
   */
  capabilities(): ProviderCapabilities {
    return {
      standings: true,
      fixtures: true,
      liveScore: false,
      squad: false,
      playerSeasonStats: false,
      scorers: false,
    };
  }

  /**
   * LİGİN TAMAMININ fikstürü — 306 maç, detay çekmeden.
   *
   * Tek sayfa isteği; maç detayına HİÇ gidilmiyor çünkü buradaki amaç tarih
   * değil SONUÇ. Servis bununla haftalık kümülatif puan tablosunu hesaplayıp
   * Galatasaray'ın sıralama geçmişini çıkarıyor — o veri hiçbir kaynakta hazır
   * yok ama elimizdeki skorlardan TÜRETİLEBİLİR (uydurma değil, toplama).
   */
  async fetchLeagueFixtures(): Promise<LiveMatch[]> {
    return parseTffFixtures(await this.get(PAGE_FIXTURE));
  }

  async fetchStandings(): Promise<LiveStandings> {
    const html = await this.get(PAGE_FIXTURE);
    const rows = parseTffStandings(html);
    if (rows.length < 10) {
      throw new Error(`TFF.STANDINGS_TOO_FEW_ROWS_${rows.length}`);
    }
    return {
      // Sezon etiketi TFF fikstür sayfasında AÇIKÇA YAZMIYOR (başlık
      // "Trendyol Süper Lig <sponsor> Sezonu" diyor, yıl vermiyor). Boş
      // bırakılıyor ve servis kendi takviminden dolduruyor.
      seasonLabel: '',
      rows,
      updateNote: null,
      attribution: 'Türkiye Futbol Federasyonu (tff.org)',
      source: this.name,
    };
  }

  /**
   * Kulübün sezon fikstürü.
   *
   * İki aşama: (1) fikstür sayfasından 34 haftanın TAMAMI okunur ve kulübün
   * maçları süzülür, (2) yalnızca O maçların detay sayfasından tarih/saat/stat
   * alınır.
   *
   * ── İKİNCİ AŞAMA NEDEN GEREKLİ VE NEDEN PAHALI ──────────────────────────
   * Fikstür listesinde tarih, saat ve stat YOK — üçü de maç detay sayfasında.
   * Yani geri sayım ve "hangi statta" satırı maç başına bir istek demek.
   *
   * ── ÖLÇÜM: SEZONUN ÇOĞU HENÜZ TARİHSİZ ──────────────────────────────────
   * 19 Ağustos 2026'da 34 maçın tamamının detayı çekildi ve YALNIZCA 3'ünde
   * saat vardı (1., 2. ve 3. hafta). Süper Lig maç saatlerini birkaç hafta
   * önce açıklıyor; geri kalan 31 maçta detay sayfası statı veriyor ama
   * tarihi vermiyor. Bu GERÇEK durum — o maçlar için saat UYDURULMUYOR,
   * `kickoffAt` null kalıyor ve ön yüz o satırda saat göstermiyor.
   *
   * ── BU YÜZDEN `known` PARAMETRESİ ───────────────────────────────────────
   * Her gün 34 sayfa çekip 3 tarih öğrenmek nezaketsiz. Servis, önceki
   * senkronda öğrenilenleri buraya veriyor; tarihi VE statı zaten bilinen maç
   * atlanıyor. Sezon ilerledikçe istek sayısı kendiliğinden düşüyor, yeni
   * açıklanan saatler ise ilk senkronda yakalanıyor.
   */
  async fetchClubFixtures(
    clubKey: string,
    known?: ReadonlyMap<
      string,
      { kickoffAt: string | null; venue: string | null }
    >,
  ): Promise<LiveMatch[]> {
    const html = await this.get(PAGE_FIXTURE);
    const all = parseTffFixtures(html);
    const mine = all.filter(
      (m) => m.home.key === clubKey || m.away.key === clubKey,
    );

    // Detay bütçesi: varsayılan 40 — bir sezonda 34 lig maçı var, üstüne pay.
    // Bütçe biterse kalan maçlar tarihsiz kalıyor; uydurma saat üretilmiyor.
    const budget = this.options.detailBudget ?? 40;
    let spent = 0;

    for (const match of mine) {
      const macId = match.id.startsWith('tff:') ? match.id.slice(4) : null;
      if (!macId) continue;

      // Önceden bilineni geri koy ve gerekiyorsa isteği tamamen atla.
      const cached = known?.get(match.id);
      if (cached) {
        match.kickoffAt = cached.kickoffAt;
        match.kickoffDate = cached.kickoffAt
          ? cached.kickoffAt.slice(0, 10)
          : null;
        match.venue = cached.venue;
        if (cached.kickoffAt && cached.venue) continue;
      }

      if (spent >= budget) continue;
      try {
        const detail = await this.get(`${PAGE_MATCH}${macId}`);
        const parsed = parseTffMatchDetail(detail);
        if (parsed.kickoffAt) {
          match.kickoffAt = parsed.kickoffAt;
          match.kickoffDate = parsed.kickoffAt.slice(0, 10);
        }
        if (parsed.venue) match.venue = parsed.venue;
        spent += 1;
        // Ardışık isteklerin arasında nefes: resmî siteyi dövmüyoruz.
        await sleep(350);
      } catch (error) {
        // Tek maçın detayı alınamazsa fikstürün tamamını düşürmüyoruz —
        // o maç tarihsiz kalır, diğerleri doğru gösterilir.
        this.logger.warn(
          `TFF maç detayı alınamadı (${macId}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return mine;
  }

  private async get(path: string): Promise<string> {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) {
      throw new Error(`TFF.HTTP_${res.status}`);
    }
    return decodeTurkish(Buffer.from(await res.arrayBuffer()));
  }
}

// ---- Kodlama ---------------------------------------------------------------

/**
 * `windows-1254` çözücü. Node resmî imajları full-ICU ile geliyor ve bu kod
 * sayfası destekleniyor (ölçüldü: node 24, icu 78.3). Yine de kurulum
 * small-icu ile derlenmiş olabilir — o durumda `TextDecoder` fırlatıyor ve
 * `latin1`e düşüyoruz. latin1 Türkçe'ye özgü altı harfi (Ğ ğ İ ı Ş ş) yanlış
 * verir ama sayı ve yapı bozulmaz; tablo yine okunur, yalnız adlar bozuk
 * görünür. Sessizce bozuk metin döndürmektense bunu logluyoruz.
 */
function decodeTurkish(buf: Buffer): string {
  try {
    return new TextDecoder('windows-1254').decode(buf);
  } catch {
    new Logger('TffProvider').error(
      'windows-1254 çözücü yok (small-icu build) — latin1 ile devam, Türkçe harfler bozuk gelecek',
    );
    return buf.toString('latin1');
  }
}

// ---- Ayrıştırıcılar (saf; test edilebilir olsun diye dışarıda) --------------

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, ' ')
    .trim();
}

function cells(rowHtml: string): string[] {
  return [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) =>
    stripTags(m[1]),
  );
}

function rows(tableHtml: string): string[] {
  return [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(
    (m) => m[1],
  );
}

/**
 * Puan cetveli.
 *
 * Tabloyu başlık hücrelerinden buluyoruz: `>AV<` (averaj) sayfada BİR kez
 * geçiyor ve yalnızca puan cetveli başlığında. Sabit bir tablo indeksi
 * (ör. "88 tablodan 12.si") kullanmak, TFF sayfaya bir kutu eklediği gün
 * sessizce yanlış tabloyu okurdu.
 *
 * Satır biçimi: `1.AMED SPORTİF FAALİYETLER | 1 | 1 | 0 | 0 | 3 | 0 | 3 | 3`
 * yani ilk hücre "sıra.ADI", ardından O G B M A Y AV P.
 */
export function parseTffStandings(html: string): LiveStandingRow[] {
  const marker = html.indexOf('>AV<');
  if (marker < 0) return [];
  const start = html.lastIndexOf('<table', marker);
  const end = html.indexOf('</table>', marker);
  if (start < 0 || end < 0) return [];

  const out: LiveStandingRow[] = [];
  for (const row of rows(html.slice(start, end))) {
    const c = cells(row);
    if (c.length < 9) continue;

    // "9.GALATASARAY A.Ş." → sıra 9, ad "GALATASARAY A.Ş."
    const head = /^(\d+)\s*\.\s*(.+)$/.exec(c[0]);
    if (!head) continue;

    const nums = c.slice(1, 9).map((v) => {
      const n = Number(v.replace(/[^\d-]/g, ''));
      return Number.isFinite(n) && v.trim() !== '' ? n : null;
    });
    if (nums.some((n) => n === null)) continue;
    const [played, won, drawn, lost, goalsFor, goalsAgainst, , points] =
      nums as number[];

    const name = titleCaseClub(head[2]);
    out.push({
      position: Number(head[1]),
      team: { name, key: normalizeTeamKey(name), crest: null },
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      // Averaj sütununu okumak yerine hesaplıyoruz: TFF bu hücreyi bazı
      // sezonlarda "+3" biçiminde yazıyor ve işaret ayrıştırması gereksiz
      // bir kırılma noktası. gf-ga her zaman doğru.
      goalDifference: goalsFor - goalsAgainst,
      points,
      note: null,
    });
  }
  return out;
}

/**
 * Fikstür — 34 haftanın tamamı.
 *
 * Sayfada hafta başlıkları `N.Hafta` biçiminde geçiyor ama ⚠️ İLK GEÇİŞ
 * FİKSTÜR DEĞİL: üstteki hafta seçici açılır menüsü de aynı metni yazıyor
 * (ölçüldü: "2.Hafta" ilk kez 83620. karakterde, gerçek fikstür bloğu ise
 * 162485'te). Bu yüzden bloklar hafta metniyle değil, İÇİNDE `macId=` geçen
 * satırlarla bulunuyor — menüde maç bağlantısı yok.
 *
 * Satır biçimi: [ev sahibi(kulupId)] [skor(macId)] [deplasman(kulupId)]
 * Oynanmamış maçta skor hücresi "-" geliyor.
 */
export function parseTffFixtures(html: string): LiveMatch[] {
  const out: LiveMatch[] = [];
  const seen = new Set<string>();

  // Hafta başlıklarının konumları — bir maçın hangi haftaya ait olduğunu
  // "kendinden ÖNCEKİ en yakın hafta başlığı" kuralıyla belirliyoruz.
  const weekMarks = [...html.matchAll(/(\d+)\s*\.\s*Hafta/g)].map((m) => ({
    week: Number(m[1]),
    at: m.index ?? 0,
  }));
  const weekAt = (index: number): number | null => {
    let found: number | null = null;
    for (const w of weekMarks) {
      if (w.at <= index) found = w.week;
      else break;
    }
    return found;
  };

  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html)) !== null) {
    const rowHtml = m[1];
    if (!rowHtml.includes('macId=')) continue;

    const clubIds = [...rowHtml.matchAll(/kulupId=(\d+)[^>]*>([^<]+)</g)];
    const macId = /macId=(\d+)/.exec(rowHtml)?.[1];
    if (!macId || clubIds.length < 2) continue;
    if (seen.has(macId)) continue;
    seen.add(macId);

    const homeName = titleCaseClub(stripTags(clubIds[0][2]));
    const awayName = titleCaseClub(stripTags(clubIds[1][2]));

    // Skor hücresi maç bağlantısının metni: "2 - 2" ya da "-"
    const scoreText = stripTags(
      /macId=\d+[^>]*>([\s\S]*?)<\/a>/.exec(rowHtml)?.[1] ?? '',
    );
    const score = /^(\d+)\s*-\s*(\d+)$/.exec(scoreText);

    const status: LiveMatchStatus = score ? 'FINISHED' : 'SCHEDULED';
    const week = weekAt(m.index ?? 0);

    out.push({
      id: `tff:${macId}`,
      kickoffAt: null, // detay sayfasından dolduruluyor
      kickoffDate: null,
      competition: 'Süper Lig',
      round: week ? `${week}. Hafta` : null,
      home: { name: homeName, key: normalizeTeamKey(homeName), crest: null },
      away: { name: awayName, key: normalizeTeamKey(awayName), crest: null },
      homeGoals: score ? Number(score[1]) : null,
      awayGoals: score ? Number(score[2]) : null,
      status,
      minute: null,
      venue: null,
      source: 'tff',
    });
  }

  return out;
}

/**
 * Maç detayı — tarih/saat ve stat.
 *
 * Ölçülen biçim (macId=317790):
 *   ALİ SAMİ YEN SPOR KOMPLEKSİ RAMS PARK - İSTANBUL - | 14.08.2026 - 21:30
 *
 * Saat TÜRKİYE YEREL saati (UTC+3, yıl boyu sabit — Türkiye 2016'dan beri
 * yaz saati uygulamıyor, bu yüzden sabit ofset GÜVENLİ ve `Intl` zaman dilimi
 * hesabına gerek yok).
 */
export function parseTffMatchDetail(html: string): {
  kickoffAt: string | null;
  venue: string | null;
  competition: string | null;
} {
  // ⚠️ KONUM TAHMİNİ KULLANMIYORUZ. İlk sürüm "tarihten 160 karakter geriye
  // git, ilk ' - ' parçasını stat say" diyordu ve ölçümde skor tablosunun
  // yarısını stat adı olarak döndürdü ("TASARAY A.Ş. 2 ARCA ÇORUM FK 2 …").
  // Sayfa ASP.NET WebForms ve kontrol kimlikleri KARARLI: `_lblTarih`,
  // `_lnkStad`, `_lblOrganizasyonAdi`. Kimliğe tutunmak hem doğru hem de
  // sayfa düzeni değiştiğinde sessizce yanlış veri üretmek yerine boş dönüyor.
  const byId = (suffix: string): string | null => {
    const re = new RegExp(
      `<(?:span|a)[^>]*id="[^"]*${suffix}"[^>]*>([\\s\\S]*?)<\\/(?:span|a)>`,
      'i',
    );
    const hit = re.exec(html);
    const value = hit ? stripTags(hit[1]) : '';
    return value ? value : null;
  };

  let kickoffAt: string | null = null;
  const raw = byId('_lblTarih');
  if (raw) {
    const when = /(\d{2})\.(\d{2})\.(\d{4})\s*-\s*(\d{2}):(\d{2})/.exec(raw);
    if (when) {
      const [, dd, mm, yyyy, hh, mi] = when;
      // Türkiye UTC+3 (2016'dan beri yaz saati YOK — sabit ofset güvenli).
      const utc = Date.UTC(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        Number(hh) - 3,
        Number(mi),
      );
      if (Number.isFinite(utc)) kickoffAt = new Date(utc).toISOString();
    }
  }

  // "ALİ SAMİ YEN SPOR KOMPLEKSİ RAMS PARK - İSTANBUL -" → stat adı + il.
  // Sondaki boş " -" ve il parçası atılıyor; il ayrı bir bilgi ve stat adının
  // parçası değil.
  let venue: string | null = null;
  const stad = byId('_lnkStad');
  if (stad) {
    const parts = stad
      .split(' - ')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (parts.length > 0) venue = titleCaseClub(parts[0]);
  }

  return {
    kickoffAt,
    venue,
    competition: byId('_lblOrganizasyonAdi'),
  };
}

/**
 * TFF her adı BÜYÜK HARF yazıyor ("GALATASARAY A.Ş."). Sayfada büyük harf
 * kullanımı tipografik bir karardır, veriden gelmemeli — bu yüzden burada
 * başlık düzenine çevriliyor ve ön yüz istediğinde CSS ile tekrar büyütüyor.
 *
 * ⚠️ Türkçe küçültme ASCII değildir: "I".toLowerCase() ASCII'de "i" verir ama
 * Türkçe'de "ı" olmalı; "İ" ise "i" olmalı. `toLocaleLowerCase('tr')` bunu
 * doğru yapıyor — düz `toLowerCase()` "İSTANBUL"u "i̇stanbul" (birleşen
 * noktalı) hâline getirirdi.
 */
const ABBREVIATIONS = new Set([
  'A.Ş.',
  'AŞ',
  'FK',
  'SK',
  'SFK',
  'FC',
  'MKE',
  'TFF',
  'PFDK',
]);

export function titleCaseClub(raw: string): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  return cleaned
    .split(' ')
    .map((word) => {
      // Büyük kalacak kısaltmalar AÇIK LİSTE.
      //
      // ⚠️ İKİ SEZGİSEL KURAL DENENDİ VE İKİSİ DE ÖLÇÜMDE KALDI:
      // (1) "tamamı büyük harfse kısaltmadır" → "GALATASARAY"ı da kısaltma
      //     saydı, hiçbir ad çevrilmedi.
      // (2) "≤3 harfse kısaltmadır" → stat adında "ALİ" ve "YEN" büyük kaldı
      //     ("ALİ Sami YEN Spor Kompleksi").
      // Kısaltma kümesi küçük ve kapalı; tahmin etmek yerine saymak doğrusu.
      if (ABBREVIATIONS.has(word)) return word;
      const lower = word.toLocaleLowerCase('tr');
      return lower.charAt(0).toLocaleUpperCase('tr') + lower.slice(1);
    })
    .join(' ');
}
