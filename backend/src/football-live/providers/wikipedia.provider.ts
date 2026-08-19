import { Logger } from '@nestjs/common';
import {
  normalizeTeamKey,
  type FootballProvider,
  type LiveScorer,
  type LiveStandings,
  type LiveStandingRow,
  type ProviderCapabilities,
} from './types';

/**
 * Sağlayıcı 1 — Vikipedi (tr.wikipedia.org).
 *
 * ── NEDEN VİKİPEDİ ───────────────────────────────────────────────────────
 * Puan durumu için ölçülmüş TEK ücretsiz ve MEŞRU tam kaynak. 19 Ağustos 2026
 * ölçümü: API-Football ücretsiz planı 2026-27'yi kilitliyor, TheSportsDB
 * ücretsiz anahtarı tabloyu 5 satırda kesiyor (18 takımlık ligde işe yaramaz),
 * SofaScore ise yalnızca bot korumasını atlatarak açılıyor. Vikipedi'nin
 * resmî Action API'si var, açık lisanslı (CC BY-SA) ve maddenin kendisi kaynak
 * olarak TFF'yi gösteriyor.
 *
 * ── NEDEN HTML DEĞİL WIKITEXT ────────────────────────────────────────────
 * `action=parse&prop=text` HTML üretiyor; onu regex'le okumak şablonun görsel
 * düzeni her değiştiğinde kırılır. `prop=wikitext` ise şablonun ÇAĞRI
 * PARAMETRELERİNİ veriyor:
 *
 *   |team9 =GAL |win_GAL= 0 |draw_GAL= 1 |loss_GAL= 0 |gf_GAL= 2 |ga_GAL= 2
 *   |name_GAL = [[Galatasaray (futbol takımı)|Galatasaray]]
 *
 * Bu biçim `Modül:Spor tablosu`nun genel arayüzü — Türkçe Vikipedi'de bütün
 * lig sezonlarında aynı ve yıllardır değişmedi. Puan ve oynanan maç sayısı
 * şablonda YOK, hesaplanıyor (galibiyet×3 + beraberlik); biz de aynısını
 * yapıyoruz, yoksa iki kaynak arasında tutarsızlık üretirdik.
 *
 * ── ATIF ZORUNLU ─────────────────────────────────────────────────────────
 * CC BY-SA kaynağı atıfsız gösterilemez. `attribution` alanı boş dönmüyor ve
 * ön yüz bunu tablo künyesinde çiziyor — depoda Commons portreleri için zaten
 * uygulanan kuralın (lisans+yazar+kaynak dolu değilse görsel çizilmez) aynısı.
 */

const API = 'https://tr.wikipedia.org/w/api.php';

/** Vikipedi kimliksiz isteği reddedebiliyor; kimlik zorunlu ve iletişim içeriyor. */
const UA = 'KuroNexus/1.0 (https://kuronexus.com; ultnexus.dev@gmail.com)';

export interface WikipediaProviderOptions {
  /** "2026-27" — sezon etiketi; sayfa adları bundan türetiliyor */
  seasonLabel: string;
}

export class WikipediaProvider implements FootballProvider {
  readonly name = 'wikipedia';
  private readonly logger = new Logger(WikipediaProvider.name);

  constructor(private readonly options: WikipediaProviderOptions) {}

  /**
   * Vikipedi anahtar istemiyor, dolayısıyla bu iki yetenek HER ZAMAN açık.
   * Canlı skor ve kadro bilinçle kapalı: madde elle güncelleniyor, dakika
   * bilgisi hiç yok ve kadro listesi sezon başında aylarca eskiyor.
   */
  capabilities(): ProviderCapabilities {
    return {
      standings: true,
      fixtures: false,
      liveScore: false,
      squad: false,
      playerSeasonStats: false,
      scorers: true,
    };
  }

  async fetchStandings(): Promise<LiveStandings> {
    const page = `Şablon:${this.options.seasonLabel} Süper Lig puan durumu`;
    const wikitext = await this.fetchWikitext(page);
    const rows = parseStandingsTemplate(wikitext);

    // Süper Lig 18 ya da 19 takım oynuyor. Ölçüt "tam olarak 18" DEĞİL çünkü
    // lig genişleyebilir; ama 10'un altı her hâlükârda ayrıştırma hatasıdır ve
    // yarım tablo göstermektense hiç göstermemek doğrusu.
    if (rows.length < 10) {
      throw new Error(`WIKIPEDIA.STANDINGS_TOO_FEW_ROWS_${rows.length}`);
    }

    return {
      seasonLabel: this.options.seasonLabel,
      rows,
      updateNote: parseNamedParam(wikitext, 'update'),
      attribution:
        'Vikipedi (CC BY-SA 4.0) · kaynak: Türkiye Futbol Federasyonu',
      source: this.name,
    };
  }

  async fetchScorers(): Promise<LiveScorer[]> {
    const page = `${this.options.seasonLabel} Süper Lig`;
    const wikitext = await this.fetchWikitext(page);
    return parseScorerTable(wikitext);
  }

  private async fetchWikitext(page: string): Promise<string> {
    const url =
      `${API}?action=parse&page=${encodeURIComponent(page)}` +
      `&prop=wikitext&format=json&formatversion=2&redirects=1`;

    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      throw new Error(`WIKIPEDIA.HTTP_${res.status}`);
    }

    const body = (await res.json()) as {
      error?: { code: string };
      parse?: { wikitext?: string };
    };
    // Vikipedi hata için 200 döndürüp gövdeye `error` koyuyor — durum koduna
    // bakıp geçmek, sezon maddesi henüz açılmamışken sessizce boş tablo
    // üretirdi.
    if (body.error) {
      throw new Error(`WIKIPEDIA.${body.error.code.toUpperCase()}`);
    }
    const text = body.parse?.wikitext;
    if (!text) {
      throw new Error('WIKIPEDIA.EMPTY_WIKITEXT');
    }
    return text;
  }
}

// ---- Ayrıştırıcılar (saf fonksiyon — birim testi kolay olsun diye dışarıda) ----

/** `|update=17 Ağustos 2026` → "17 Ağustos 2026" */
export function parseNamedParam(wikitext: string, key: string): string | null {
  const m = new RegExp(`\\|\\s*${key}\\s*=([^|\\n}]*)`).exec(wikitext);
  const value = m?.[1]?.trim();
  return value ? value : null;
}

/**
 * Şablon parametresinin DEĞERİNİ okur.
 *
 * ⚠️ NAİF `([^|\n}]*)` YAKALAMASI ÇALIŞMIYOR — ölçüldü. Değerin kendisi boru
 * içerebiliyor:
 *
 *   |name_AME = [[Amed SFK|Amed]] |status_AME=
 *
 * `|`de duran bir yakalama `[[Amed SFK` üretiyor ve tablodaki bütün adlar
 * "[[Amed SFK" gibi çıkıyordu. Doğru yol: önce satır sonuna kadar al, sonra
 * içinde tam bir `[[...]]` varsa ONU çöz; yoksa ilk boruda kes.
 */
function readParamValue(wikitext: string, key: string): string | null {
  const hit = new RegExp(`\\|\\s*${key}\\s*=([^\\n]*)`).exec(wikitext);
  if (!hit) return null;

  const line = hit[1];
  const link = /\[\[[^\]]*\]\]/.exec(line);
  const raw = link ? link[0] : line.split('|')[0];
  const value = stripWikiLink(raw);
  return value ? value : null;
}

/**
 * `[[Galatasaray (futbol takımı)|Galatasaray]]` → "Galatasaray"
 * `[[Alanyaspor]]` → "Alanyaspor"
 * Boru varsa GÖRÜNEN ad alınır; madde adı değil (o parantezli teknik ad).
 */
function stripWikiLink(raw: string): string {
  const s = raw.trim();
  const linked = /\[\[([^\]]+)\]\]/.exec(s);
  if (!linked) return s.replace(/'''/g, '').trim();
  const inner = linked[1];
  const pipe = inner.lastIndexOf('|');
  return (pipe >= 0 ? inner.slice(pipe + 1) : inner).trim();
}

/**
 * `Modül:Spor tablosu` çağrısını satırlara çevirir.
 *
 * Sıralama şablondaki `team1..teamN` sırasıdır — bu sıra ZATEN resmî sıralama
 * (madde "sıralama için takım numarasını değiştirmek yeterlidir" diyor). Puanı
 * kendimiz hesaplayıp yeniden sıralamıyoruz: TFF'nin eşitlik bozma kuralı
 * sezon sonunda ikili averaja bakıyor ve o bilgi şablonda yok. Kaynağın
 * sırasına uymak, kendi ürettiğimiz yanlış sıradan iyidir.
 */
export function parseStandingsTemplate(wikitext: string): LiveStandingRow[] {
  const order: string[] = [];
  const teamRe = /\|\s*team(\d+)\s*=\s*([^\s|\n}]+)/g;
  const seen = new Map<number, string>();
  let m: RegExpExecArray | null;
  while ((m = teamRe.exec(wikitext)) !== null) {
    seen.set(Number(m[1]), m[2].trim());
  }
  for (const key of [...seen.keys()].sort((a, b) => a - b)) {
    const code = seen.get(key);
    if (code) order.push(code);
  }

  const rows: LiveStandingRow[] = [];
  for (let i = 0; i < order.length; i += 1) {
    const code = order[i];
    // Kod Türkçe harf içeriyor (İBF, ÇYR, GÖZ, EYÜ) — regex'te kaçırılmalı.
    const esc = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const num = (field: string): number | null => {
      const hit = new RegExp(`\\|\\s*${field}_${esc}\\s*=\\s*(-?\\d+)`).exec(
        wikitext,
      );
      return hit ? Number(hit[1]) : null;
    };

    const won = num('win');
    const drawn = num('draw');
    const lost = num('loss');
    const goalsFor = num('gf');
    const goalsAgainst = num('ga');

    // Beş alanın biri bile okunamadıysa satır ATILIYOR. Yarım satırı sıfırla
    // doldurmak, tabloda "0 maç oynadı" diye GERÇEK OLMAYAN bir bilgi üretir.
    if (
      won === null ||
      drawn === null ||
      lost === null ||
      goalsFor === null ||
      goalsAgainst === null
    ) {
      continue;
    }

    const name = readParamValue(wikitext, `name_${esc}`) ?? code;
    const note = readParamValue(wikitext, `status_${esc}`);

    rows.push({
      position: i + 1,
      team: { name, key: normalizeTeamKey(name), crest: null },
      played: won + drawn + lost,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
      note,
    });
  }

  return rows;
}

/**
 * "Gol krallığı" wikitable'ını okur.
 *
 * ⚠️ SEZON BAŞINDA TABLO DEJENERE. 19 Ağustos 2026'da ölçüldü: 2. haftada
 * satır `''17 futbolcu''` (takım hücresi boş, 1 gol) diyor — yani gerçek bir
 * golcü listesi değil, "hepsi eşit" özeti. O satırı krallık tablosu diye
 * çizmek uydurma veri göstermekle aynı şey.
 *
 * Bu yüzden doğrulama KATI: oyuncu adı bir isim gibi görünmeli (rakamla
 * başlamamalı, "futbolcu" özet ifadesi olmamalı) ve takım hücresi dolu olmalı.
 * Hiçbir satır geçmezse boş dizi döner ve ön yüz bölümü hiç çizmez. Sezon
 * ilerleyip tablo gerçek adlarla dolduğunda aynı kod çalışmaya başlar.
 */
export function parseScorerTable(wikitext: string): LiveScorer[] {
  const start = wikitext.search(/==+\s*Gol krallığı\s*==+/);
  if (start < 0) return [];
  const tableStart = wikitext.indexOf('{|', start);
  if (tableStart < 0) return [];
  const tableEnd = wikitext.indexOf('|}', tableStart);
  if (tableEnd < 0) return [];
  const table = wikitext.slice(tableStart, tableEnd);

  const out: LiveScorer[] = [];
  for (const block of table.split(/\n\|-/)) {
    // Hücreler `||` ile ayrılıyor; satır başındaki `|` de bir ayraç.
    const cells = block
      .split(/\|\||\n\|/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0 && !c.startsWith('-'));
    if (cells.length < 4) continue;

    // Biçim: Sıra | Oyuncu | Takım | Maç | Gol | Ortalama
    // Sıra hücresi `rowspan=1 align=center|1` gibi gelebiliyor — son parçayı al.
    const player = cleanCell(cells[1]);
    const team = cleanCell(cells[2]);
    const goals = firstInteger(cells[4] ?? '');

    // ⚠️ DOĞRULAMA KATI VE ÖLÇÜMLE SIKILAŞTIRILDI. İlk sürüm yalnızca
    // "goals === null" bakıyordu ve şu çöp satırı geçirdi:
    //   { name: 'Galatasaray', team: '1', goals: 0 }
    // — yani takım adını oyuncu, sıra numarasını takım sanmıştı. Gol sayısı
    // sıfır olan bir "gol kralı" zaten anlamsız; takım hücresi de yalnızca
    // rakamdan oluşamaz.
    if (!player || !team || goals === null) continue;
    if (goals <= 0) continue;
    if (/^\d+$/.test(team)) continue;
    if (/futbolcu|oyuncu$/i.test(player)) continue; // "17 futbolcu" özet satırı
    if (/^\d/.test(player)) continue;

    out.push({ name: player, team, goals });
  }

  // Gol sayısına göre azalan; kaynak zaten sıralı ama rowspan'lı satırlarda
  // sıra kayabiliyor.
  return out.sort((a, b) => b.goals - a.goals).slice(0, 10);
}

function cleanCell(raw: string): string {
  let s = raw;
  s = s.replace(/rowspan\s*=\s*\d+/gi, '');
  s = s.replace(/align\s*=\s*\w+/gi, '');
  s = s.replace(/\{\{[^{}]*\}\}/g, ' ');
  s = s.replace(/<[^>]*>/g, ' ');
  s = stripWikiLink(s);
  s = s.replace(/'''|''/g, '');
  s = s.replace(/^\|+/, '');
  return s.replace(/\s+/g, ' ').trim();
}

function firstInteger(raw: string): number | null {
  const m = /(\d+)/.exec(cleanCell(raw));
  return m ? Number(m[1]) : null;
}
