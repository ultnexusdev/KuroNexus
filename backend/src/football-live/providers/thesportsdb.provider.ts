import { Logger } from '@nestjs/common';
import { displayNameWithoutSponsor, normalizeTeamKey } from './types';

/**
 * Sağlayıcı 2 — TheSportsDB. GÖRSEL MALZEME kaynağı.
 *
 * ── NEDEN MAÇ VERİSİ İÇİN DEĞİL ──────────────────────────────────────────
 * 19 Ağustos 2026 ölçümü: ücretsiz anahtar (`3`) 2026-27 için GERÇEK veri
 * veriyor ama her yanıtı **5 satırda kesiyor** — `eventsnext` 1 maç,
 * `lookuptable` 5 takım, `eventsseason` 5 maç. 18 takımlık bir ligde bu
 * tabloyu çizmek "yarım tablo" demek; kanadın boş oda yasağı yarım veriyi de
 * kapsıyor. Maç verisi TFF'den geliyor (bkz. `tff.provider.ts`).
 *
 * ── PEKİ NEDEN DURUYOR ───────────────────────────────────────────────────
 * Çünkü kesme kuralı LİSTE uçlarına uygulanıyor, TEKİL kayda değil.
 * `searchteams.php?t=<ad>` bir takımın TAM künyesini döndürüyor ve içinde
 * sayfanın görsel omurgası var (ölçüldü, Galatasaray kaydı):
 *
 *   strBadge · strLogo · strBanner · strEquipment (forma)
 *   strFanart1..4  ← stadyum/tribün kareleri — RAMS Park bölümünün malzemesi
 *   strStadium "Rams Park" · intStadiumCapacity 52652 · intFormedYear 1905
 *   strKeywords "Cim-Bom, Sarı-Kırmızılılar, Aslanlar"
 *
 * 18 takım için 18 tekil istek = günde bir, ücretsiz katmanda sorunsuz.
 * Böylece puan tablosunda her satırın arması, fikstürde rakip arması ve
 * stadyum bölümünde gerçek fotoğraf oluyor.
 *
 * ── GÖRSELLER HOTLINK EDİLMİYOR ──────────────────────────────────────────
 * ⚠️ Bu adaptör yalnızca ADRES döndürüyor, sayfaya o adresi KOYMUYOR. Deponun
 * ölçülmüş politikası (uploads modülü başlığında yazılı): dış adres asla
 * saklanmaz, görsel indirilip `/uploads/`e yazılır. İki gerekçe — CSP
 * `img-src` yabancı origin'i engelliyor, ve dış adres bir gün ölüyor.
 * İndirme işini servis yapıyor (`ingestImage`), adaptör kaynak listesini verir.
 */

const BASE = 'https://www.thesportsdb.com/api/v1/json';
const UA = 'KuroNexus/1.0 (+https://kuronexus.com)';

export interface TsdbTeamAssets {
  key: string;
  name: string;
  /** TheSportsDB'nin kendi kimliği — ileride tekil çağrılar için */
  id: string;
  badge: string | null;
  logo: string | null;
  banner: string | null;
  jersey: string | null;
  /** Stadyum/tribün kareleri — sıra korunuyor */
  fanart: string[];
  stadium: string | null;
  stadiumCapacity: number | null;
  foundedYear: number | null;
  /** "Cim-Bom, Sarı-Kırmızılılar, Aslanlar" */
  nicknames: string[];
  website: string | null;
}

export class TheSportsDbProvider {
  readonly name = 'thesportsdb';
  private readonly logger = new Logger(TheSportsDbProvider.name);

  /**
   * Anahtar verilmezse herkese açık `3` test anahtarı kullanılıyor. Ücretli
   * Patreon anahtarı `TSDB_API_KEY` ile veriliyor ve TEK DEĞİŞİKLİK o —
   * uçlar ve ayrıştırma aynı kalıyor, yalnızca kesme kuralı kalkıyor.
   */
  constructor(private readonly apiKey: string = '3') {}

  /** Ücretsiz test anahtarı mı? Liste uçlarına güvenip güvenmeyeceğimizi belirler. */
  get isFreeTier(): boolean {
    return this.apiKey === '3';
  }

  /**
   * Takım künyesi + görselleri.
   *
   * Ad ile arama yapılıyor çünkü elimizde TFF adı var, TheSportsDB kimliği
   * yok. Arama birden çok sonuç dönebilir (ör. alt takımlar); doğru kaydı
   * `normalizeTeamKey` eşleşmesiyle seçiyoruz — "Galatasaray" araması
   * "Galatasaray Youth"u da getirebilir ve ilkini körlemesine almak yanlış
   * armayı sayfaya koyardı.
   */
  async fetchTeamAssets(teamName: string): Promise<TsdbTeamAssets | null> {
    const wanted = normalizeTeamKey(teamName);

    // ── İKİ AŞAMALI ARAMA ──────────────────────────────────────────────────
    // TFF adları sponsorlu: "Arca Çorum FK", "Tümosan Konyaspor", "Amed
    // Sportif Faaliyetler". TheSportsDB bu adları TANIMIYOR — ölçüldü, üçü de
    // "SONUÇ YOK" döndü ve 18 takımın tam olarak bu üçü armasız kaldı.
    // Sadeleştirilmiş ad ("Çorum", "Konyaspor", "Amed") ise bulunuyor.
    // Tam ad önce deneniyor çünkü o daha spesifik; boş dönerse sadeleşene
    // düşülüyor.
    const candidates = [teamName];
    const simplified = displayNameWithoutSponsor(teamName);
    if (simplified !== teamName) candidates.push(simplified);

    let teams: TsdbRawTeam[] = [];
    for (const candidate of candidates) {
      const url = `${BASE}/${this.apiKey}/searchteams.php?t=${encodeURIComponent(candidate)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`TSDB.HTTP_${res.status}`);
      const body = (await res.json()) as { teams?: TsdbRawTeam[] | null };
      teams = body.teams ?? [];
      if (teams.length > 0) break;
    }
    if (teams.length === 0) return null;

    const exact = teams.find(
      (t) => normalizeTeamKey(t.strTeam ?? '') === wanted,
    );
    // Ad eşleşmesi tutmuyorsa ve tek sonuç varsa onu kabul etmiyoruz: yanlış
    // takımın armasını basmaktansa armasız satır göstermek doğrusu.
    const team = exact ?? null;
    if (!team) {
      this.logger.warn(
        `TheSportsDB'de "${teamName}" için birebir ad eşleşmesi yok (${teams.length} sonuç) — arma atlandı`,
      );
      return null;
    }

    const fanart = [
      team.strFanart1,
      team.strFanart2,
      team.strFanart3,
      team.strFanart4,
    ].filter((u): u is string => typeof u === 'string' && u.length > 0);

    return {
      key: wanted,
      name: team.strTeam ?? teamName,
      id: team.idTeam ?? '',
      badge: nonEmpty(team.strBadge),
      logo: nonEmpty(team.strLogo),
      banner: nonEmpty(team.strBanner),
      jersey: nonEmpty(team.strEquipment),
      fanart,
      stadium: nonEmpty(team.strStadium),
      stadiumCapacity: toInt(team.intStadiumCapacity),
      foundedYear: toInt(team.intFormedYear),
      nicknames: (team.strKeywords ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      website: nonEmpty(team.strWebsite),
    };
  }
}

interface TsdbRawTeam {
  idTeam?: string;
  strTeam?: string;
  strBadge?: string;
  strLogo?: string;
  strBanner?: string;
  strEquipment?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strStadium?: string;
  intStadiumCapacity?: string;
  intFormedYear?: string;
  strKeywords?: string;
  strWebsite?: string;
}

function nonEmpty(value: string | undefined): string | null {
  const v = value?.trim();
  return v ? v : null;
}

function toInt(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
