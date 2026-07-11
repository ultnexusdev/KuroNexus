// Yalnızca client component'lerde kullanılır (document.cookie erişimi)

const COOKIE_PREFIX = "kuronexus-spoiler-";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 yıl

// "all" = tüm spoiler'ları göster; sayı = bu kitaba kadar okudum (üstü gizli).
// Cookie yoksa 0 varsayılır — güvenli taraf: spoiler'lı her şey gizli başlar.
export type SpoilerLevel = number | "all";

export function getSpoilerLevel(universeSlug: string): SpoilerLevel {
  if (typeof document === "undefined") {
    return 0;
  }
  const name = `${COOKIE_PREFIX}${universeSlug}`;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));
  if (!match) {
    return 0;
  }
  const value = match.slice(name.length + 1);
  if (value === "all") {
    return "all";
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

export function setSpoilerLevel(
  universeSlug: string,
  level: SpoilerLevel,
): void {
  document.cookie = `${COOKIE_PREFIX}${universeSlug}=${level};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

export function isSpoilerHidden(
  spoilerTier: number | null,
  level: SpoilerLevel,
): boolean {
  if (spoilerTier === null || level === "all") {
    return false;
  }
  return spoilerTier > level;
}
