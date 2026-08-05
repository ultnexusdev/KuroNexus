export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
 * Sunucu tarafındaki çağrılar ve üretim her zaman doğrudan API'ye gider.
 */
export function apiFetchUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    return `/api/dev-proxy${path}`;
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
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(apiFetchUrl(path), {
    ...init,
    credentials: "include",
  });
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
    throw new ApiError(response.status, messageKey);
  }
  return response.json() as Promise<T>;
}
