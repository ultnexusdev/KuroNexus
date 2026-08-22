/**
 * Salon 06 · Futbol — GÖRSEL KÜNYE DEFTERİ.
 *
 * ── NEDEN DOSYA SİSTEMİNDE, BACKEND'DE DEĞİL ─────────────────────────────
 * Kulüp kapağı ve efsane portresi küratörün yüklediği kayıtlar; onlar
 * backend'de duruyor ve orada kalmalı. Buradakiler farklı bir sınıf: sayfanın
 * ATMOSFERİNİ kuran plakalar (gece stadyumu, oyuncu figürü, kariyer kareleri).
 * Bunlar tasarımın parçası, içeriğin değil — bir bölümü silersen görsel de
 * gider. O yüzden depoda duruyorlar (`public/spor/futbol/*`) ve `img-src
 * 'self'` sayesinde CSP'den sorunsuz geçiyorlar.
 *
 * ⚠️ DIŞ ADRESE BAĞLANMA. `next.config.ts` içindeki CSP bir BEYAZ LİSTE:
 * `upload.wikimedia.org` orada YOK. Commons'tan bir görseli doğrudan hotlink
 * etmek sayfayı kırmaz, görseli sessizce kaybeder. Bütün kaynaklar indirilip
 * webp'e çevrildi ve depoya kondu.
 *
 * ⚠️ KÜNYE ZORUNLU. Buradaki karelerin çoğu CC BY / CC BY-SA — atıfsız
 * gösterim telif ihlali. `credit` alanı doluysa görselin künyesi sayfada
 * GÖRÜNMEK ZORUNDA (`MediaCredits` bileşeni bunu yapıyor). Kanadın F1
 * tarafındaki `portraitLicense/portraitAuthor/portraitSourceUrl` üçlüsü aynı
 * kuralı veri katmanında uyguluyor; bu dosya onun statik karşılığı.
 * `credit: null` yalnızca CC0 ve kamu malı kareler için.
 */

export interface MediaCredit {
  /** "CC BY-SA 3.0" — kısa lisans adı, künyede aynen basılıyor */
  license: string;
  author: string;
  /** Commons dosya sayfası — künyedeki bağlantının hedefi */
  sourceUrl: string;
}

export interface MediaAsset {
  /** `public/` köküne göre mutlak yol */
  src: string;
  width: number;
  height: number;
  /** Boş dize = dekoratif; bileşen `alt=""` + `aria-hidden` basıyor */
  alt: string;
  caption?: string;
  /**
   * `null` = künye gerekmiyor (CC0 / kamu malı / küratörün kendi karesi).
   * `undefined` = alan hiç yazılmamış, aynı anlama geliyor. İkisi de
   * `collectCredits()` tarafından eleniyor; ayrımı yazan kişi için: `null`
   * "baktım, gerekmiyor" der, boş bırakmak "bakmadım" der.
   */
  credit?: MediaCredit | null;
}

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

/**
 * Atmosfer plakaları ve kariyer kareleri.
 *
 * Boyutlar dosyanın GERÇEK ölçüleri — `<img width height>` olarak basılıyor ki
 * tarayıcı yer ayırsın ve sayfa yüklenirken zıplamasın (CLS).
 */
export const FOOTBALL_MEDIA = {
  /** Gece stadyumu — ışık huzmeleri, tribün, sis. Hero'nun fotoğraf katmanı. */
  stadiumNight: {
    src: "/spor/futbol/stadyum-gece.webp",
    width: 1400,
    height: 614,
    alt: "",
    credit: null,
  },
  stadiumNightSmall: {
    src: "/spor/futbol/stadyum-gece-sm.webp",
    width: 960,
    height: 421,
    alt: "",
    credit: null,
  },
  /** Kuş bakışı stadyum — kulüp kapısının derinlik katmanı */
  stadiumAerial: {
    src: "/spor/futbol/stadyum-kus.webp",
    width: 1600,
    height: 900,
    alt: "",
    credit: {
      license: "CC BY 3.0",
      author: "beIN SPORTS Türkiye",
      sourceUrl: `${COMMONS}Ali_Sami_Yen_Spor_Kompleksi_Nef_Stadyumu_%E2%80%93_D%C4%B1%C5%9F_manzara.png`,
    },
  },
  stadiumInside: {
    src: "/spor/futbol/stadyum-ic.webp",
    width: 1024,
    height: 768,
    alt: "",
    credit: null,
  },

  /** Icardi — saydam zeminli figür. Sayfanın taşıyıcı görseli. */
  icardiFigure: {
    src: "/spor/futbol/icardi-figur.webp",
    width: 900,
    height: 1082,
    alt: "Mauro Icardi, Galatasaray forması ve gol sevinci",
    credit: {
      license: "CC BY 4.0",
      author: "AhmetSaidKaylan",
      sourceUrl: `${COMMONS}Mauro_%C4%B0cardi.png`,
    },
  },
  icardiInter: {
    src: "/spor/futbol/icardi-inter.webp",
    width: 349,
    height: 895,
    alt: "Icardi, Inter forması ve kaptanlık pazubendiyle",
    caption: "Inter · kaptanlık pazubendi",
    credit: {
      license: "CC BY-SA 3.0",
      author: "Вячеслав Евдокимов",
      sourceUrl: `${COMMONS}Zen-Int_(2).jpg`,
    },
  },
  icardiYoung: {
    src: "/spor/futbol/icardi-genc.webp",
    width: 452,
    height: 712,
    alt: "Genç Icardi, Sampdoria eşofmanıyla",
    caption: "Başlangıç · Sampdoria yılları",
    credit: {
      license: "CC BY-SA 3.0",
      author: "Palombo90",
      sourceUrl: `${COMMONS}Mauroicardi.jpg`,
    },
  },
  icardiSampdoria: {
    src: "/spor/futbol/icardi-samp.webp",
    width: 677,
    height: 976,
    alt: "Icardi, Sampdoria formasıyla sahada",
    caption: "Sampdoria · ilk Serie A yılları",
    credit: null,
  },
  icardiPsg: {
    src: "/spor/futbol/icardi-psg.webp",
    width: 640,
    height: 1206,
    alt: "Icardi, Paris Saint-Germain formasıyla",
    caption: "Paris · deplasman forması",
    credit: {
      license: "CC BY-SA 4.0",
      author: "Liondartois",
      sourceUrl: `${COMMONS}Mauro_Icardi_(PSG).jpg`,
    },
  },
  icardiField: {
    src: "/spor/futbol/icardi-dnepr.webp",
    width: 233,
    height: 496,
    alt: "Icardi, Avrupa kupası maçında",
    caption: "Avrupa gecesi",
    credit: {
      license: "CC BY-SA 3.0",
      author: "Илья Хохлов",
      sourceUrl: `${COMMONS}Dnepr-Inter_(2).jpg`,
    },
  },
  icardiRecent: {
    src: "/spor/futbol/icardi-2025.webp",
    width: 520,
    height: 729,
    alt: "Icardi, yakın dönem portresi",
    caption: "Portre",
    credit: {
      license: "CC BY 3.0",
      author: "Telefe",
      sourceUrl: `${COMMONS}Mauro_Icardi_en_2025.jpg`,
    },
  },

  /** Hagi — efsaneler bölümünün fotoğraf katmanı */
  hagiPortrait: {
    src: "/spor/futbol/hagi-portre.webp",
    width: 1000,
    height: 1500,
    alt: "Gheorghe Hagi",
    credit: {
      license: "CC BY-SA 3.0",
      author: "Dan Avraham",
      sourceUrl: `${COMMONS}Gheorghe_Hagi_1.jpg`,
    },
  },
  hagiPitch: {
    src: "/spor/futbol/hagi-saha.webp",
    width: 1600,
    height: 790,
    alt: "",
    credit: {
      license: "CC BY 2.0",
      author: "dan_avraham2000",
      sourceUrl: `${COMMONS}Last_photo_before_the_game_with_Gheorghe_Hagi.jpg`,
    },
  },
  hagiClose: {
    src: "/spor/futbol/hagi-2.webp",
    width: 700,
    height: 827,
    alt: "Gheorghe Hagi, yakın plan",
    credit: {
      license: "CC BY 2.0",
      author: "dan_avraham2000",
      sourceUrl: `${COMMONS}Gica_Hagi.jpg`,
    },
  },
  // `credit` her kayıtta AÇIKÇA yazılı (gerekmediğinde `null`) — bir kare
  // künyesiz eklendiğinde bu bir unutma mı bilinçli bir karar mı, okurken
  // ayırt edilebilsin diye.
} satisfies Record<string, MediaAsset>;

/*
 * LEGEND_PLATES ve LEGEND_PORTRAIT_FALLBACK haritaları 2026-08-22'de
 * KALDIRILDI (kullanıcı onayı): hiçbir bileşen bu haritaları okumuyordu —
 * üstlerindeki "buraya satır yazmak yeterli" mekanizması, Hagi 21 Ağustos'ta
 * deftere taşınınca fiilen ölmüştü (kareleri artık `lib/sport/players/hagi.ts`
 * doğrudan `FOOTBALL_MEDIA`dan okuyor; o kayıtlar CANLI ve duruyor). Yeni bir
 * arşiv efsanesine plaka gerekirse doğru yer defter dosyası ya da küratör
 * yuvası — slug haritası değil.
 */

/**
 * Bir yüzeyde kullanılan görsellerin künyelerini tekilleştirip döndürür.
 *
 * Aynı fotoğrafçı iki kareyle geçiyorsa künye satırı iki kez yazılmaz — künye
 * bir yasal zorunluluk, bir liste değil; tekrar okunurluğu düşürür.
 */
export function collectCredits(
  /**
   * Boş girdiye (`null` / `undefined`) İZİN VAR ve bu bilinçli: çağıran taraf
   * çoğu zaman `player.career.map(s => s.media)` gibi isteğe bağlı alanları
   * topluyor. Süzmeyi burada yapmak, her çağrı yerinde bir tip koruyucu
   * yazmaktan kısa ve `.filter(Boolean)`in tipi daraltmaması tuzağını da
   * kapatıyor.
   */
  assets: ReadonlyArray<{ credit?: MediaCredit | null } | null | undefined>,
): MediaCredit[] {
  const seen = new Set<string>();
  const out: MediaCredit[] = [];
  for (const asset of assets) {
    if (!asset?.credit) continue;
    const key = `${asset.credit.author}|${asset.credit.license}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(asset.credit);
  }
  return out;
}
