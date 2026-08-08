/**
 * Salon 06 · F1 — DIŞ VERİ ADAPTÖR KATMANI.
 *
 * Brief'in §6 kuralları burada uygulanıyor:
 *   1. API asla istemciden veya sayfa render'ında çağrılmaz — bu dosyayı
 *      yalnızca senkronizasyon işi kullanır.
 *   2. Veri kendi PostgreSQL'imize yazılır, sayfalar yalnızca onu okur.
 *   3. Sağlayıcı çökerse site bozulmaz: son senkronize veri yerinde durur.
 *   4. Sağlayıcı DEĞİŞTİRİLEBİLİR olmalı → iş mantığı `F1ResultsProvider`
 *      arayüzünü tanır, `JolpicaProvider`ı değil. Kaynak değişirse yalnızca
 *      bu dosyaya yeni bir sınıf eklenir.
 *
 * Bu katmanı Faz 1'in başında BİLEREK yazmamıştım: o sırada çalışan bir
 * sağlayıcı yoktu (API-Football ücretsiz planı 2026'yı vermiyor) ve
 * kullanılmayacak kod üretmek olurdu. Jolpica ölçülüp doğrulanınca yerini
 * hak etti.
 */

/** Bir yarışın tek basamağı. Sağlayıcıdan bağımsız biçim. */
export interface PodiumEntry {
  seasonYear: number;
  round: number | null;
  raceName: string | null;
  raceDate: string | null;
  position: number;
  driverExternalId: string | null;
  driverName: string;
  driverFullName: string | null;
  driverNationality: string | null;
  driverWikiUrl: string | null;
  constructorName: string | null;
  timeText: string | null;
}

/** İş mantığının tanıdığı TEK sözleşme. */
export interface F1ResultsProvider {
  readonly name: string;
  /** Bir pistin bütün tarihindeki podyumları getirir. */
  getCircuitPodiums(circuitRef: string): Promise<PodiumEntry[]>;
}

const UA = 'KuroNexus/1.0 (kisisel kultur arsivi; ultnexus.dev@gmail.com)';

async function getJson(url: string): Promise<any> {
  const response = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${url}`);
  }
  return response.json();
}

/** İstekler arasında nefes payı — ücretsiz uçlara saygı. */
const bekle = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Jolpica-F1 (Ergast'ın açık kaynaklı halefi).
 * Ücretsiz, kimlik doğrulaması yok, 1950'den bugüne tüm sezonlar.
 *
 * ÖLÇÜLDÜ: bir pistin bütün podyum tarihi ÜÇ istekte geliyor —
 * `/circuits/<ref>/results/<1|2|3>` her basamak için bütün sezonları
 * döndürüyor. Monza için 75 yarış × 3 basamak = 3 istek.
 * Yarış yarış dolaşmak 75 kat daha fazla istek olurdu.
 */
export class JolpicaProvider implements F1ResultsProvider {
  readonly name = 'jolpica';
  private readonly base = 'https://api.jolpi.ca/ergast/f1';

  async getCircuitPodiums(circuitRef: string): Promise<PodiumEntry[]> {
    const hepsi: PodiumEntry[] = [];

    for (const position of [1, 2, 3]) {
      const url = `${this.base}/circuits/${encodeURIComponent(circuitRef)}/results/${position}.json?limit=100`;
      const data = await getJson(url);
      const races = data?.MRData?.RaceTable?.Races ?? [];

      for (const race of races) {
        const sonuc = race.Results?.[0];
        if (!sonuc) continue;
        hepsi.push({
          seasonYear: Number(race.season),
          round: race.round ? Number(race.round) : null,
          raceName: race.raceName ?? null,
          raceDate: race.date ?? null,
          position,
          driverExternalId: sonuc.Driver?.driverId ?? null,
          driverName:
            [sonuc.Driver?.givenName, sonuc.Driver?.familyName]
              .filter(Boolean)
              .join(' ') || 'Bilinmiyor',
          driverFullName: sonuc.Driver?.familyName ?? null,
          driverNationality: sonuc.Driver?.nationality ?? null,
          driverWikiUrl: sonuc.Driver?.url ?? null,
          constructorName: sonuc.Constructor?.name ?? null,
          // Kazananda toplam süre, diğerlerinde fark; yarışı bitiremediyse durum
          timeText: sonuc.Time?.time ?? sonuc.status ?? null,
        });
      }
      await bekle(1200);
    }

    return hepsi.sort((a, b) => a.seasonYear - b.seasonYear || a.position - b.position);
  }
}

// ---------------------------------------------------------------------------

/** Lisanslı portre — üçü de dolu değilse görsel KULLANILMAZ. */
export interface Portrait {
  imageUrl: string;
  sourceUrl: string;
  license: string;
  author: string;
}

/**
 * Wikimedia Commons portre çözücü.
 *
 * ⚠️ NEDEN formula1.com DEĞİL: oradaki sürücü fotoğrafları ajans lisanslı
 * (Getty vb.) ve sitenin kullanım şartları otomatik erişimi yasaklıyor.
 * Commons görselleri ise açık lisanslı — ama çoğu CC BY / CC BY-SA, yani
 * KAYNAK VE FOTOĞRAFÇI GÖSTERMEK ZORUNLU. Bu yüzden bu çözücü lisans ve
 * sanatçı bilgisini alamazsa görseli hiç döndürmüyor: atıfsız yayın,
 * telifli görseli izinsiz kullanmakla aynı kapıya çıkar.
 *
 * ⚠️ DOSYA ADI THUMBNAIL URL'İNDEN TÜRETİLMEZ. İlk denemede öyle yapılmıştı
 * ve altı sürücünün beşinde başarısız oldu: özetteki adres kırpılmış sürüme
 * işaret ediyor ve adı tutmuyor. Kanonik ad `prop=pageimages&piprop=name`
 * ile sorulmalı. `pageimages` boş dönerse özet uca düşülür (Farina böyle
 * bulunuyor).
 */
export class CommonsPortraitResolver {
  async resolve(wikiUrl: string | null): Promise<Portrait | null> {
    if (!wikiUrl) return null;
    const title = decodeURIComponent(wikiUrl.split('/wiki/')[1] ?? '');
    if (!title) return null;

    const fileName =
      (await this.canonicalFileName(title)) ?? (await this.summaryFileName(title));
    if (!fileName) return null;

    const api =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
      '&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=640&titles=' +
      encodeURIComponent('File:' + fileName);

    let page: any;
    try {
      page = Object.values((await getJson(api)).query.pages)[0];
    } catch {
      return null;
    }
    const info = page?.imageinfo?.[0];
    if (!info) return null;

    const meta = info.extmetadata ?? {};
    const oku = (k: string): string | null =>
      meta[k]?.value
        ? String(meta[k].value)
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        : null;

    const license = oku('LicenseShortName');
    const author = oku('Artist');
    const imageUrl = info.thumburl ?? info.url;
    // Üçü birden yoksa görsel yok — bilinçli sertlik
    if (!license || !author || !imageUrl) return null;

    return {
      imageUrl,
      sourceUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${fileName}`,
      license,
      author: author.slice(0, 180),
    };
  }

  private async canonicalFileName(title: string): Promise<string | null> {
    try {
      const j = await getJson(
        'https://en.wikipedia.org/w/api.php?action=query&format=json' +
          '&prop=pageimages&piprop=name&titles=' +
          encodeURIComponent(title),
      );
      const page: any = Object.values(j.query.pages)[0];
      return page?.pageimage ?? null;
    } catch {
      return null;
    }
  }

  private async summaryFileName(title: string): Promise<string | null> {
    try {
      const j = await getJson(
        'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title),
      );
      const src: string | undefined = j?.originalimage?.source;
      return src ? decodeURIComponent(src.split('/').pop() as string) : null;
    } catch {
      return null;
    }
  }
}
