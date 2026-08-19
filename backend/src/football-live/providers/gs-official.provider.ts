import { Logger } from '@nestjs/common';
import type { LiveSquadPlayer } from './types';

/**
 * Sağlayıcı 5 — KULÜBÜN RESMÎ SİTESİ (galatasaray.org). KADRONUN KAYNAĞI.
 *
 * ── NEDEN TRANSFERMARKT'IN YERİNİ ALDI ───────────────────────────────────
 * Kadro önce Kaggle'daki Transfermarkt yayın setinden okunuyordu. O set
 * 5 Ağustos anlık görüntüsüydü ve sezon 14 Ağustos'ta başlamıştı; sonuç
 * kullanıcı tarafından yakalandı: **Icardi hâlâ kadrodaydı, Uğurcan Çakır
 * hiç yoktu.** Yani liste bir sezon geriden geliyordu.
 *
 * Kulübün kendi kadro sayfası bunu kökünden çözüyor — ölçüm (19 Ağustos 2026,
 * `/pl/futbol-takim-kadrosu/9`):
 *   · 31 oyuncu, 31'inde forma numarası, 31'inde mevki, 31'inde resmî portre
 *   · Icardi YOK, Uğurcan Çakır #1 VAR
 *   · Transfermarkt setinde bulunmayan transferler burada: İlkay Gündoğan #20,
 *     Lesley Ugochukwu #18, Victor Nelsson #25, Kazımcan Karataş #88, Eyüp Aydın #5
 *
 * Kaynak kulübün KENDİSİ olduğu için "veri ne kadar taze" sorusu ortadan
 * kalkıyor: transfer açıklandığı gün burada.
 *
 * ── BİÇİM ────────────────────────────────────────────────────────────────
 * Sayfa sunucu tarafında render ediliyor, UTF-8 ve yapı sabit:
 *
 *   <div class="photolist_block">
 *     <a href="/p/1-ugurcan-cakir/3548"><img src="https://…/profiles/….jpeg"></a>
 *     <div class="photolist_single_content left">
 *       <p class="title">1 - Uğurcan Çakır</p>
 *       <p class="desc"> Kaleci </p>
 *     </div>
 *   </div>
 *
 * ⚠️ PORTRELER DIŞ ORIGIN (`hlkiurt3.rocketcdn.com`). CSP `img-src` onu
 * engelliyor; adres olduğu gibi sayfaya konursa 31 kartın 31'i boş çerçeve
 * olur. Servis bunları indirip `/uploads/`e yazıyor (aynı kural arma ve
 * stadyum kareleri için de uygulanıyor).
 */

const UA =
  'KuroNexus/1.0 (+https://kuronexus.com; ultnexus.dev@gmail.com) arsiv-senkronu';

export interface GsOfficialOptions {
  /** Kadro sayfasının tam adresi — başka bir kulüp eklenirse env'den gelir. */
  squadUrl: string;
}

export class GsOfficialProvider {
  readonly name = 'gs-official';
  private readonly logger = new Logger(GsOfficialProvider.name);

  constructor(private readonly options: GsOfficialOptions) {}

  async fetchSquad(): Promise<LiveSquadPlayer[]> {
    const res = await fetch(this.options.squadUrl, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: AbortSignal.timeout(25_000),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`GSOFFICIAL.HTTP_${res.status}`);

    const players = parseOfficialSquad(await res.text());
    // Kadro 20'nin altına düşerse sayfa yapısı değişmiş demektir; yarım kadro
    // göstermektense hata verip bir önceki cache'te kalmak doğrusu.
    if (players.length < 20) {
      throw new Error(`GSOFFICIAL.TOO_FEW_PLAYERS_${players.length}`);
    }
    return players;
  }
}

// ---- Ayrıştırıcı (saf; test edilebilir olsun diye dışarıda) ----------------

/**
 * Kulüp sayfasındaki mevki etiketini ara biçime çevirir.
 *
 * ⚠️ Sayfada YAZIM TUTARSIZ: "Orta Saha" ve "Orta saha" ikisi de geçiyor
 * (ölçüldü: 7 + 1). Küçük harfe indirip karşılaştırmak şart; aksi hâlde bir
 * oyuncu saha görünümünde kendi hattını bulamıyor.
 *
 * Dönen değerler `SquadBoard`'un beklediği İngilizce anahtarlar — ön yüz
 * hatları onlarla eşliyor ve etiketi kendi çeviri dosyasından yazıyor.
 */
export function mapOfficialPosition(raw: string | null): string | null {
  if (!raw) return null;
  const s = raw.toLocaleLowerCase('tr').replace(/\s+/g, ' ').trim();
  if (s.startsWith('kaleci')) return 'Goalkeeper';
  if (s.startsWith('defans')) return 'Defender';
  if (s.startsWith('orta saha')) return 'Midfielder';
  if (s.startsWith('forvet')) return 'Attacker';
  return null;
}

export function parseOfficialSquad(html: string): LiveSquadPlayer[] {
  const out: LiveSquadPlayer[] = [];

  for (const [, body] of html.matchAll(
    /<div class="photolist_block">([\s\S]*?)<\/div>\s*<\/div>/g,
  )) {
    const href = /<a href="([^"]+)"/.exec(body)?.[1] ?? null;
    const photo = /<img src="([^"]+)"/.exec(body)?.[1] ?? null;
    const title = decodeEntities(
      /<p class="title">([\s\S]*?)<\/p>/.exec(body)?.[1] ?? '',
    );
    const desc = decodeEntities(
      /<p class="desc">([\s\S]*?)<\/p>/.exec(body)?.[1] ?? '',
    );
    if (!title) continue;

    // "1 - Uğurcan Çakır" — numara ve ad tek alanda. Numarasız kayıt da
    // olabilir (yeni transfer henüz numara almamış olabilir); o durumda
    // numara null kalıyor, UYDURULMUYOR.
    const parsed = /^(\d{1,2})\s*-\s*(.+)$/.exec(title);
    const name = parsed ? parsed[2].trim() : title;
    if (!name) continue;

    // Kimlik profil adresinin sonundaki resmî oyuncu numarası:
    // "/p/1-ugurcan-cakir/3548" → 3548. Yoksa ada düşülüyor ki liste
    // içinde anahtar çakışmasın.
    const officialId = /\/(\d+)\s*$/.exec(href ?? '')?.[1] ?? null;

    out.push({
      id: `gs:${officialId ?? slugify(name)}`,
      name,
      position: mapOfficialPosition(desc),
      shirtNumber: parsed ? Number(parsed[1]) : null,
      photo,
      nationality: null,
      birthDate: null,
      // Sayfa yaş/boy/ayak/piyasa değeri vermiyor. Uydurulmuyor: kart arka
      // yüzü yalnızca gerçekten bilinen alanları çiziyor.
      detailedPosition: desc || null,
    });
  }

  return out;
}

function decodeEntities(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(name: string): string {
  const map: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    I: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };
  let s = '';
  for (const ch of name.normalize('NFC')) s += map[ch] ?? ch.toLowerCase();
  return s.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
