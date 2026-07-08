export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Backend'in döndürdüğü göreli yolları (/uploads/...) mutlak URL'e çevirir
export function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
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

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(apiUrl(path), init);
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
