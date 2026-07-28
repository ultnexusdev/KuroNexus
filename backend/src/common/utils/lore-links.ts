const ENTRY_ID_PATTERN = /data-entry-id="([^"]+)"/g;

// El yazması metnindeki lore işaretlerinden kayıt id'lerini toplar.
// İşaretler yalnızca gösterimdir; sorgulanabilir ilişki StoryEntryLink'tir.
export function extractEntryIds(content: string): string[] {
  const found = new Set<string>();
  for (const match of content.matchAll(ENTRY_ID_PATTERN)) {
    const id = match[1].trim();
    if (id) {
      found.add(id);
    }
  }
  return [...found];
}

// Künye panelinde gösterilecek kısa özet — HTML etiketleri atılır.
export function buildPlainExcerpt(content: string, maxLength = 280): string {
  const text = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
