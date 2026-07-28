import type { WikiCategory } from "@/lib/api/types";

export interface LoreEntryRef {
  id: string;
  title: string;
  slug: string;
  category: WikiCategory;
  aliases: string[];
}

const WORD_CHARACTER = /[\p{L}\p{N}]/u;

// Türkçe'de I/İ eşlemesi locale'e bağlı — "İSTANBUL" ile "istanbul" eşleşsin
function fold(value: string): string {
  return value.toLocaleLowerCase("tr");
}

function namesOf(entry: LoreEntryRef): string[] {
  return [entry.title, ...entry.aliases].filter((name) => name.trim().length > 0);
}

/** `@...` yazarken açılan öneri listesi: önce baştan eşleşenler. */
export function matchEntries(
  entries: LoreEntryRef[],
  query: string,
  limit = 8,
): LoreEntryRef[] {
  const needle = fold(query.trim());
  if (!needle) {
    return entries.slice(0, limit);
  }
  const scored: Array<{ entry: LoreEntryRef; score: number }> = [];
  for (const entry of entries) {
    let best = -1;
    for (const name of namesOf(entry)) {
      const folded = fold(name);
      if (folded.startsWith(needle)) {
        best = Math.max(best, 2);
      } else if (folded.includes(needle)) {
        best = Math.max(best, 1);
      }
    }
    if (best > 0) {
      scored.push({ entry, score: best });
    }
  }
  return scored
    .sort(
      (a, b) =>
        b.score - a.score || a.entry.title.localeCompare(b.entry.title, "tr"),
    )
    .slice(0, limit)
    .map((item) => item.entry);
}

/** Bir adın metinde sözcük olarak geçip geçmediği (ek almış hâller sayılır). */
function occursAsWord(haystack: string, name: string): boolean {
  const needle = fold(name);
  if (needle.length < 3) {
    return false;
  }
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    const before = index === 0 ? "" : haystack[index - 1];
    // Sonrasına bakılmaz: "Temür'ün", "Otüken'e" gibi ekli hâller de sayılmalı
    if (!before || !WORD_CHARACTER.test(before)) {
      return true;
    }
    index = haystack.indexOf(needle, index + 1);
  }
  return false;
}

/**
 * Metinde adı ya da takma adı geçen kayıtlar — bağlanmamış olsalar bile.
 * Kullanıcının asıl isteği bu: bölümde bir karakterin adı geçtiği anda ona
 * sağ panelden ulaşabilmek, önce elle bağlamak zorunda kalmadan.
 */
export function findMentionedEntries(
  plainText: string,
  entries: LoreEntryRef[],
): LoreEntryRef[] {
  const haystack = fold(plainText);
  if (!haystack.trim()) {
    return [];
  }
  return entries.filter((entry) =>
    namesOf(entry).some((name) => occursAsWord(haystack, name)),
  );
}

/** HTML içeriğinden düz metin — tarama ve kelime sayımı için. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** İçerikteki lore işaretlerinin kayıt id'leri (backend ile aynı desen). */
export function extractEntryIds(html: string): string[] {
  const found = new Set<string>();
  for (const match of html.matchAll(/data-entry-id="([^"]+)"/g)) {
    const id = match[1].trim();
    if (id) {
      found.add(id);
    }
  }
  return [...found];
}
