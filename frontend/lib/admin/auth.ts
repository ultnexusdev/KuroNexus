// Yalnızca client component'lerde kullanılır (document.cookie erişimi)

const TOKEN_COOKIE = "kuronexus-token";
const TOKEN_MAX_AGE = 60 * 60 * 24; // 1 gün (JWT süresiyle uyumlu)

export function getToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  return match ? match.slice(TOKEN_COOKIE.length + 1) : null;
}

export function setToken(token: string): void {
  document.cookie = `${TOKEN_COOKIE}=${token};path=/;max-age=${TOKEN_MAX_AGE};samesite=lax`;
}

export function clearToken(): void {
  document.cookie = `${TOKEN_COOKIE}=;path=/;max-age=0;samesite=lax`;
}
