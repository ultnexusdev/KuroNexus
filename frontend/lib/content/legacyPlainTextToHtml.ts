const HTML_TAG_PATTERN = /</;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Content saved before the rich-text editor was introduced is plain text
// (no tags at all). Wrap each non-empty line as its own paragraph so it
// renders/edits the same way it did under `white-space: pre-wrap`.
export function legacyPlainTextToHtml(content: string): string {
  if (HTML_TAG_PATTERN.test(content)) {
    return content;
  }
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}
