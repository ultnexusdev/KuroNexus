export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Görsel bizim yükleme klasörümüzde mi?
 *
 * Önemi: `next.config.ts` içindeki `images.remotePatterns` yalnızca kendi
 * sunucumuzun `/uploads/**` yolunu ve TMDB'yi kapsıyor. Oradan gelen bir
 * görsel `next/image` ile **yeniden boyutlandırılabilir**; AniList görselleri
 * listede olmadığı için `unoptimized` kalmak zorunda.
 *
 * Kürator yüklemeleri (karakter portresi, Shikai/Bankai kareleri, galeri) tam
 * boy dosyalar — 200 KB'lik bir görseli 300px'lik bir kutuda ham hâliyle
 * indirmek gereksiz. Bu yardımcı, hangi görselin optimize edilebileceğini tek
 * yerden söylüyor.
 */
export function isLocalUpload(path: string | null | undefined): boolean {
  return typeof path === "string" && path.startsWith("/uploads/");
}

// Backend'in döndürdüğü göreli yolları (/uploads/...) mutlak URL'e çevirir.
// Görsel/ses kaynakları için kullanılır — bunlar CORS'a takılmaz.
export function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

/**
 * Veri isteklerinin gideceği adres.
 *
 * Geliştirmede tarayıcıdan giden istekler `/api/dev-proxy` üzerinden kendi
 * sunucumuza uğrar (canlı API localhost kaynağını CORS'ta tanımıyor).
 * Tarayıcıdan giden üretim istekleri doğrudan `API_BASE_URL`e gider.
 *
 * SUNUCU TARAFI AYRI (9 Ağustos 2026): SSR'da `API_BASE_URL` kullanılınca Next
 * konteyneri veriyi Docker iç ağından değil, internete çıkıp Traefik üzerinden
 * geri girerek alıyordu — her sayfa render'ında gereksiz bir DNS + TLS el
 * sıkışması + ters proxy turu, üstelik iki konteyner aynı ağda yan yana
 * dururken. `API_INTERNAL_URL` tanımlıysa sunucu çağrıları o adrese gider.
 *
 * ⚠️ DEĞİŞKEN ADI `NEXT_PUBLIC_` ÖNEKLİ OLMAMALI. Önek olsaydı Next değeri
 * istemci paketine gömerdi, tarayıcı da `http://backend:3001` gibi yalnızca
 * Docker ağının çözebildiği bir adrese gitmeye çalışırdı — sitedeki bütün veri
 * çağrıları ölürdü. Önekin yokluğu bu fonksiyonun doğruluk şartı.
 *
 * Env tanımlı değilse davranış birebir eskisi gibi: geriye dönük uyumlu.
 * `apiUrl()` bilerek dışarıda bırakıldı — o görsel/ses adresleri üretiyor,
 * onlar HTML'e yazılıp TARAYICIDA çözülüyor; iç ağ adresine çevrilirse bütün
 * kapaklar kırılır.
 */
export function apiFetchUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    return `/api/dev-proxy${path}`;
  }
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    const internalUrl = process.env.API_INTERNAL_URL;
    if (internalUrl) {
      return `${internalUrl}${path}`;
    }
  }
  return `${API_BASE_URL}${path}`;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * `credentials: "include"` tüm isteklere veriliyor.
 *
 * Oturum token'ı HttpOnly çerezde duruyor; JavaScript onu okuyup başlığa
 * koyamaz (koyamaması zaten amaç). Tarayıcının çerezi kendiliğinden eklemesi
 * için bu izin şart — API ayrı bir alan adında olduğundan varsayılan davranış
 * çerezi göndermemek. Sunucu tarafındaki çağrılarda bu alan yok sayılır.
 */
/**
 * SSR isteklerinin üst sınırı (1 Eylül 2026 denetimi, bulgu API-01).
 *
 * Önceden hiç sınır yoktu. Sitedeki bütün sunucu tarafı veri çağrıları bu
 * fonksiyondan geçiyor ve 120 sayfa `force-dynamic`; backend asılı kalırsa
 * (DB kilidi, bellek baskısı) her SSR isteği Node'un varsayılanına kadar
 * bekliyor ve 2 çekirdekli kutuda istek yığılıyordu. Backend'in kendi dış
 * istekleri istisnasız `AbortSignal.timeout` taşıyor; aynı disiplin ön yüzde
 * yoktu.
 *
 * 10 sn bilinçli olarak geniş: sağlıklı bir uç 2 sn'nin altında dönüyor, yani
 * bu sınır yalnızca gerçekten asılmış isteği keser. Süre dolunca çağrı
 * `ApiError(504)`e dönüyor ve `lib/api/*`'deki mevcut `catch { return [] }`
 * yedekleri onu aynen devralıyor — davranış değişmiyor, bekleme bitiyor.
 */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Sessiz bozulmanın tek görünürlük noktası (denetim bulgusu SEC-02).
 *
 * Kütüphane genelinde her API hatası boş rafa/`null`'a çevriliyor ve hiçbir
 * yere yazılmıyordu; 429 ya da 5xx durumunda site "çalışıyor" görünüp raflar
 * boşalıyor, geriye iz kalmıyordu (projenin Ö-8 diye adlandırdığı arıza
 * sınıfı). Log'u tek tek `catch` bloklarına serpmek yerine buraya koymak
 * yeterli: bütün çağrılar zaten buradan geçiyor.
 *
 * Yalnızca sunucuda yazıyor — tarayıcı konsolunu kirletmiyor, çıktı Coolify
 * Logs'ta görünüyor.
 */
function logApiFailure(path: string, detail: string): void {
  if (typeof window !== "undefined") {
    return;
  }
  console.error(`[api] ${path} -> ${detail}`);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiFetchUrl(path), {
      ...init,
      credentials: "include",
      // Çağıran kendi sinyalini verdiyse ona dokunulmuyor (iptal edilebilir
      // istemci istekleri bu yolu kullanıyor).
      signal: init?.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    logApiFailure(path, timedOut ? `timeout ${DEFAULT_TIMEOUT_MS}ms` : String(error));
    throw timedOut ? new ApiError(504, "API.TIMEOUT") : error;
  }
  if (!response.ok) {
    let messageKey = "API.REQUEST_FAILED";
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (typeof body.message === "string") {
        messageKey = body.message;
      } else if (Array.isArray(body.message) && body.message.length > 0) {
        messageKey = body.message[0];
      }
    } catch {
      // gövde JSON değilse varsayılan anahtar kullanılır
    }
    // 429 ayrıca işaretleniyor: throttle kovasının dolması boş rafın en olası
    // sebebi ve log'da diğer hatalarla karışmaması gerekiyor.
    logApiFailure(
      path,
      response.status === 429
        ? "429 RATE LIMIT (throttle kovasi doldu)"
        : `${response.status} ${messageKey}`,
    );
    throw new ApiError(response.status, messageKey);
  }
  return response.json() as Promise<T>;
}
