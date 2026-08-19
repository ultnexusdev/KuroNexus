/**
 * Salon 06 · Futbol · CANLI VERİ — normalleştirilmiş biçimler ve sağlayıcı sözleşmesi.
 *
 * ── NEDEN AYRI BİR "CANLI" KANADI ────────────────────────────────────────
 * `src/football/` zaten var ama iki ayrı hattı taşıyor: Kaggle/Transfermarkt
 * kadro senkronu ve (artık ölü) Apify aktörü. İkisi de TEK bir sağlayıcıya
 * gömülü yazılmış — `runApifyActor()` servisin içinde, dönüş biçimi de
 * aktörün ham satırı. Sağlayıcı değişince servis baştan yazılıyor; nitekim
 * Apify ücretsiz kotası 4 Ağustos 2026'da tükendiğinde o hat komple durdu ve
 * onu kurtarmanın yolu yoktu.
 *
 * Bu modül o hatayı tekrar etmiyor. Sayfanın gördüğü biçim aşağıda tanımlı ve
 * SAĞLAYICIDAN BAĞIMSIZ; sağlayıcılar bu biçime çeviren adaptörler. Bir kaynak
 * düşerse ya da bir plan yükseltilirse değişen tek şey adaptör dosyası oluyor,
 * ne servis ne de ön yüz.
 *
 * ── ÖLÇÜLMÜŞ KAYNAK DURUMU (19 Ağustos 2026) ─────────────────────────────
 * | Kaynak            | 2026-27 | Kapsam                                   |
 * |-------------------|---------|------------------------------------------|
 * | Wikipedia (TR)    | ✅       | puan durumu (18 takım), gol/asist krallığı |
 * | TheSportsDB free  | ✅       | sonraki/son maç — ama 5 SATIRDA KESİYOR   |
 * | TheSportsDB ücretli| ✅      | tam fikstür, kadro, görseller             |
 * | API-Football free | ❌       | "Free plans do not have access to this    |
 * |                   |         |  season, try from 2022 to 2024" (ölçüldü) |
 * | API-Football ücretli| ✅     | canlı dakika, olaylar, diziliş, oyuncu ist.|
 * | SofaScore         | ✅       | ⛔ KULLANILMIYOR — bot koruması yalnızca   |
 * |                   |         |  TLS parmak izi taklidiyle aşılıyor        |
 *
 * Yani bugün ücretsiz katmanda puan durumu ve sonraki/son maç GERÇEK veriyle
 * dolu; fikstürün tamamı, canlı dakika ve oyuncu istatistikleri anahtar
 * eklenene kadar boş. Boş olan bölüm ÇİZİLMİYOR (kanadın "boş oda yasağı"),
 * uydurma satır asla üretilmiyor.
 */

/** Maçın yaşam döngüsü. Ara biçim: sağlayıcıların kendi kodları buraya çevrilir. */
export type LiveMatchStatus =
  'SCHEDULED' | 'LIVE' | 'HALFTIME' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';

export interface LiveTeamRef {
  /** Görünen ad — Türkçe kaynaktan geldiği gibi ("Galatasaray", "Çaykur Rizespor") */
  name: string;
  /** Kaynaklar arası eşleme için sadeleştirilmiş anahtar (bkz. normalizeTeamKey) */
  key: string;
  /** Arma adresi; yoksa null — placeholder arma ÜRETİLMEZ */
  crest: string | null;
}

export interface LiveMatch {
  /** `<sağlayıcı>:<kaynak id>` — kaynaklar arası çakışmasın diye önekli */
  id: string;
  /** ISO 8601, UTC. Saat bilinmiyorsa null (tarih varsa gün başı DEĞİL, null) */
  kickoffAt: string | null;
  /**
   * `YYYY-MM-DD` — saat bilinmese de GÜN biliniyorsa dolu.
   *
   * ⚠️ AYRI BİR ALAN OLMASI ŞART. `kickoffAt`e gün başı yazmak "00:00'da
   * oynanacak" demek olurdu ve geri sayım saçmalardı. Ölçüm bu ayrımı
   * gerektirdi: Vikipedi 306 maçın 306'sının TARİHİNİ veriyor ama SAATİNİ
   * yalnızca 3'ünün (lig maç saatlerini birkaç hafta önce açıklıyor).
   * Bu alan olmadan fikstür şeridinde 31 maç "saat yok" yazıyordu; artık
   * günü gösteriyor, saati açıklanınca `kickoffAt` devralıyor.
   */
  kickoffDate: string | null;
  /** "Süper Lig", "UEFA Şampiyonlar Ligi", "Türkiye Kupası"… */
  competition: string;
  /** "2. Hafta" / "Ön Eleme" — bilinmiyorsa null */
  round: string | null;
  home: LiveTeamRef;
  away: LiveTeamRef;
  homeGoals: number | null;
  awayGoals: number | null;
  status: LiveMatchStatus;
  /** Yalnızca LIVE/HALFTIME iken dolu */
  minute: number | null;
  venue: string | null;
  /** Hangi adaptör üretti — künye satırında gösteriliyor */
  source: string;
}

export interface LiveStandingRow {
  position: number;
  team: LiveTeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** "2027-28 UEFA Şampiyonlar Ligi lig aşaması" gibi nitelik notu */
  note: string | null;
}

export interface LiveStandings {
  seasonLabel: string;
  rows: LiveStandingRow[];
  /** Kaynağın kendi beyan ettiği güncellik ("17 Ağustos 2026") — bizim çekim anımız DEĞİL */
  updateNote: string | null;
  /** Atıf zorunlu: Wikipedia CC BY-SA, kaynak da TFF'yi gösteriyor */
  attribution: string;
  source: string;
}

export interface LiveSquadPlayer {
  id: string;
  name: string;
  position: string | null;
  shirtNumber: number | null;
  photo: string | null;
  nationality: string | null;
  birthDate: string | null;
  /** Sezon istatistiği yalnızca sağlayıcı veriyorsa dolu; yoksa alan HİÇ yok */
  season?: LivePlayerSeasonStats;
  /**
   * ── KÜNYE ALANLARI (Transfermarkt veri setinden) ────────────────────────
   * Sezon istatistiği ücretli plana kilitli ama künye ücretsiz katmanda ZATEN
   * elimizde. Kart arka yüzü boş kalmasın diye bunlar gösteriliyor: eksik
   * olan alan çizilmiyor, yerine sıfır ya da tire YAZILMIYOR.
   */
  age?: number | null;
  heightInCm?: number | null;
  foot?: string | null;
  marketValueInEur?: number | null;
  /** "Centre-Forward", "Left-Back" — `position`tan daha ayrıntılı */
  detailedPosition?: string | null;
  /** Küratörün elle eklediği oyuncu mu? Kartta ayırt edilebilsin diye. */
  isManual?: boolean;
}

export interface LivePlayerSeasonStats {
  appearances: number | null;
  minutes: number | null;
  goals: number | null;
  assists: number | null;
  yellowCards: number | null;
  redCards: number | null;
  rating: number | null;
}

export interface LiveScorer {
  name: string;
  team: string | null;
  goals: number;
}

export interface LiveTeamSeasonStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  cleanSheets: number | null;
  /** Ondalık — "1.86" gibi gösterilecek */
  goalsForPerMatch: number | null;
  goalsAgainstPerMatch: number | null;
}

/**
 * Bir adaptörün NE YAPABİLDİĞİ. Servis bunu okuyup hangi kaynağın hangi alanı
 * dolduracağına karar veriyor; "çağır, patlarsa yut" denemesi yapmıyor.
 * Yetenek bildirimi çalışma anında (anahtar var mı, plan yeterli mi) hesaplanır.
 */
export interface ProviderCapabilities {
  standings: boolean;
  fixtures: boolean;
  liveScore: boolean;
  squad: boolean;
  playerSeasonStats: boolean;
  scorers: boolean;
}

export interface FootballProvider {
  /** Kayıt anahtarı — cache anahtarlarında ve künyede görünüyor */
  readonly name: string;
  capabilities(): ProviderCapabilities;

  fetchStandings?(): Promise<LiveStandings>;
  /** Kulübün sezon fikstürü — oynanmış ve gelecek maçlar bir arada */
  fetchClubFixtures?(clubKey: string): Promise<LiveMatch[]>;
  /** Yalnızca şu an oynanan maç(lar); yoksa boş dizi */
  fetchLive?(clubKey: string): Promise<LiveMatch[]>;
  fetchSquad?(clubKey: string): Promise<LiveSquadPlayer[]>;
  fetchScorers?(): Promise<LiveScorer[]>;
}

/**
 * Kaynaklar arası takım eşlemesi.
 *
 * Aynı takım üç kaynakta üç ad taşıyor: Wikipedia "Çaykur Rizespor",
 * TheSportsDB "Rizespor", API-Football "Rizespor". Puan tablosundaki
 * Galatasaray satırını vurgulamak ya da fikstürdeki rakibi armasıyla
 * eşleştirmek için ortak bir anahtar gerekiyor.
 *
 * Kural: küçült → Türkçe harfleri sadeleştir → kulüp son ekleri ve hukuki
 * biçim eklerini at → boşlukları sil. "Çaykur Rizespor" ve "Rizespor" ikisi de
 * `rizespor` oluyor.
 *
 * ⚠️ `toLowerCase()` YALNIZ BAŞINA YETMEZ: Türkçe'de "I".toLowerCase() ASCII
 * kurallarında "i" verir ama "İ".toLowerCase() "i̇" (i + birleşen nokta)
 * verir — iki farklı dize. Bu yüzden harf eşlemesi ELLE yapılıyor.
 */
const TR_MAP: Record<string, string> = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  I: 'i',
  İ: 'i',
  i: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
  â: 'a',
  Â: 'a',
};

/**
 * Ada yapışık olduğunda TAKIMI ayırt etmeyen parçalar.
 *
 * İki gruba ayrılıyorlar çünkü kaldırma kuralları farklı:
 *
 * `LEGAL` — hukuki biçim ve kulüp niteleyicisi. Nerede geçerse geçsin atılır;
 * hiçbir Süper Lig takımı yalnızca bunlarla anılmıyor.
 *
 * `SPONSOR` — forma sponsoru öneki. YALNIZCA BAŞTA atılır ve liste sabittir.
 * "İlk kelimeyi at" gibi tahmin yürüten bir kural denendi ve REDDEDİLDİ:
 * "istanbul basaksehir"i "basaksehir"e indirir, iki kaynağı birbirinden
 * ayırırdı. Sponsor her sezon değişiyor; listeye eklemek tek satırlık iş ve
 * eklenmezse en kötü sonuç o takımın armasının eşleşmemesi — yanlış veri
 * değil, eksik süs.
 */
const LEGAL = [
  /\bsportif\s+faaliyetler\b/g,
  /\bfutbol\s+kulubu\b/g,
  /\bspor\s+kulubu\b/g,
  /\bfutbol\s+takimi\b/g,
  /\bkulubu\b/g,
  /\ba\s*\.?\s*s\s*\.?(?=\s|$)/g, // "A.Ş." → deaksanlı "a.s." / "a s"
  /\b(sfk|fk|sk|ad)\b/g,
];

const SPONSOR = [
  'caykur',
  'corendon',
  'arca',
  'tumosan',
  'trendyol',
  'bitexen',
  'aytemiz',
  'medipol',
  'atiker',
  'yukatel',
  'evkur',
  'istikbal mobilya',
  'demir grup',
  'mke',
  'gazisehir',
];

export function normalizeTeamKey(raw: string): string {
  let s = '';
  for (const ch of raw.normalize('NFC')) {
    s += TR_MAP[ch] ?? ch.toLowerCase();
  }
  // Parantezli açıklama Wikipedia bağlantılarından geliyor: "Beşiktaş (futbol takımı)"
  s = s.replace(/\([^)]*\)/g, ' ');
  // Noktalama sadeleştiriliyor ama HARF ARASI boşluk korunuyor: LEGAL
  // kalıpları çok kelimeli ("spor kulubu") ve kelime sınırı gerektiriyor.
  s = s
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const pattern of LEGAL) {
    s = s.replace(pattern, ' ');
  }
  s = s.replace(/\s+/g, ' ').trim();

  for (const sponsor of SPONSOR) {
    if (s === sponsor) break; // sponsor adın TAMAMIYSA dokunma
    if (s.startsWith(`${sponsor} `)) {
      s = s.slice(sponsor.length + 1);
      break;
    }
  }

  return s.replace(/\s+/g, '');
}

/**
 * Sponsor ve hukuki eki atılmış GÖRÜNEN ad — diyakritikler ve boşluk korunur.
 *
 * `normalizeTeamKey`ten farkı: o eşleşme anahtarı üretiyor ("corum"), bu ise
 * ARANABİLİR ad üretiyor ("Çorum"). İkisi de gerekli çünkü dış servislerde
 * arama kutusuna anahtar değil ad yazılıyor.
 *
 * Gerekçe ölçümle geldi: TheSportsDB'de 18 takımın 15'i bulundu, bulunamayan
 * üçü tam olarak sponsor önekli olanlardı — "Arca Çorum FK", "Tümosan
 * Konyaspor", "Amed Sportif Faaliyetler". Üçü de eki atılınca bulunuyor.
 */
export function displayNameWithoutSponsor(raw: string): string {
  const tokens = raw
    .replace(/\([^)]*\)/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const plain = (token: string): string => {
    let s = '';
    for (const ch of token.normalize('NFC'))
      s += TR_MAP[ch] ?? ch.toLowerCase();
    return s.replace(/[^a-z0-9]/g, '');
  };

  const LEGAL_TOKENS = new Set([
    'as',
    'fk',
    'sk',
    'sfk',
    'fc',
    'ad',
    'kulubu',
    'kulup',
    'sportif',
    'faaliyetler',
    'takimi',
  ]);

  const kept = tokens.filter((token, index) => {
    const p = plain(token);
    if (LEGAL_TOKENS.has(p)) return false;
    // "futbol" yalnızca "futbol kulübü/takımı" bağlamında gürültü; tek başına
    // bir kulüp adı olamayacağı için baştaki/ortadaki geçişleri atılıyor —
    // ama adın TEK kelimesiyse korunuyor.
    if (p === 'futbol' && tokens.length > 1) return false;
    if (index === 0 && SPONSOR.includes(p) && tokens.length > 1) return false;
    return true;
  });

  const result = kept.join(' ').trim();
  return result || raw;
}

/** Galatasaray'ın kanonik anahtarı — üç kaynakta da bu değere iniyor. */
export const GS_KEY = 'galatasaray';
