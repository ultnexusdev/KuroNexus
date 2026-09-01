/**
 * `jsonwebtoken` süre söz diziminin (`'1d'`, `'12h'`, `'900'`) milisaniye
 * karşılığı.
 *
 * Birimsiz sayı SANİYE sayılır — kütüphanenin kendi kuralı budur; `'900'`
 * 900 saniyedir, 900 ms değil. Tanınmayan biçimde `null` döner: çağıran
 * sessizce yanlış bir süreye düşmesin, sorunu açıkça görsün.
 */
export function parseDurationMs(value: string): number | null {
  const match = /^(\d+)\s*(ms|s|m|h|d|w)?$/i.exec(value.trim());
  if (!match) {
    return null;
  }
  const factors: Record<string, number> = {
    ms: 1,
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
  };
  return Number(match[1]) * factors[(match[2] ?? 's').toLowerCase()];
}
