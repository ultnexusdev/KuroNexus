#!/usr/bin/env node
/**
 * JJK · KONTRAST DENETİMİ — token blokları globals.css'ten OKUNUR.
 *
 * Bleach betiği çiftleri elle listeler; burada bloklar ayrıştırılıyor,
 * çünkü JJK'de 13 palet var (taban + 3 bölge + 9 alan) ve elle liste
 * onüçüncü palette kayardı. Kural seti ev standardı:
 *
 *   text-primary / bg        ≥ 7   (AAA)
 *   text-secondary / bg      ≥ 4.5 (AA)
 *   text-muted / bg          ≥ 4.5
 *   accent / bg              ≥ 3   (büyük/aksan)
 *   accent-hover / bg        ≥ 4.5 (küçük punto kızıl metin bunu okur)
 *   dom-ink / dom-bg1        ≥ 7
 *   dom-body / dom-bg1       ≥ 4.5
 *   dom-muted / dom-bg1      ≥ 4.5
 *   dom-accent / dom-bg1     ≥ 3
 *   paper-ink / paper-bg     ≥ 7
 *   paper-faint / paper-bg   ≥ 4.5
 *   paper-stamp / paper-bg   ≥ 4.5 (damga küçük mono metin taşıyor)
 *   actor-* / bg             ≥ 4.5 (lejant metni iğne rengini giyiyor)
 *
 * ⚠️ Yalnızca HEX değerler çözülür; `color-mix`/rgba türevleri buradan
 * geçmez — onlar dekoratif katmanlar, metin token'ı değil.
 *
 * Kullanım:  node scripts/check-jjk-contrast.mjs
 */
import { readFileSync } from "node:fs";

const css = readFileSync("styles/globals.css", "utf8");

/* ── Blokları çıkar ────────────────────────────────────────────────────── */
function blockOf(selector) {
  const start = css.indexOf(selector);
  if (start === -1) return null;
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

function tokensOf(block) {
  const map = {};
  if (!block) return map;
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g)) {
    map[m[1]] = m[2];
  }
  return map;
}

/* ── WCAG oranı ────────────────────────────────────────────────────────── */
function luminance(hex) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ── Denetim ───────────────────────────────────────────────────────────── */
const problems = [];
let checks = 0;

function expect(name, fg, bg, min) {
  if (!fg || !bg) {
    problems.push(`${name}: token eksik (fg=${fg ?? "yok"}, bg=${bg ?? "yok"})`);
    return;
  }
  checks++;
  const r = ratio(fg, bg);
  if (r < min) {
    problems.push(`${name}: ${fg} / ${bg} = ${r.toFixed(2)} (< ${min})`);
  }
}

const base = tokensOf(blockOf('[data-world="jjk"]'));
if (Object.keys(base).length === 0) {
  console.error('✗ [data-world="jjk"] bloğu bulunamadı');
  process.exit(1);
}

function auditSurface(label, tokens, fallback) {
  const t = (key) => tokens[key] ?? fallback?.[key];
  const bg = t("bg");
  expect(`${label} text-primary`, t("text-primary"), bg, 7);
  expect(`${label} text-secondary`, t("text-secondary"), bg, 4.5);
  expect(`${label} text-muted`, t("text-muted"), bg, 4.5);
  expect(`${label} accent`, t("accent"), bg, 3);
  expect(`${label} accent-hover`, t("accent-hover"), bg, 4.5);
}

auditSurface("taban", base);

/* Kağıt dosya + aktörler yalnızca tabanda tanımlı */
expect("kağıt paper-ink", base["paper-ink"], base["paper-bg"], 7);
expect("kağıt paper-faint", base["paper-faint"], base["paper-bg"], 4.5);
expect("kağıt paper-stamp", base["paper-stamp"], base["paper-bg"], 4.5);
for (const actor of ["gojo", "yuji", "sukuna", "mahito", "kenjaku"]) {
  expect(`aktör ${actor}`, base[`actor-${actor}`], base["bg"], 4.5);
}

for (const zone of ["energy", "spirits", "culling"]) {
  const tokens = tokensOf(blockOf(`[data-world="jjk"] [data-zone="${zone}"]`));
  if (Object.keys(tokens).length === 0) {
    problems.push(`bölge bloğu yok: ${zone}`);
    continue;
  }
  auditSurface(`bölge ${zone}`, tokens, base);
}

const DOMAINS = [
  "gojo",
  "sukuna",
  "mahito",
  "jogo",
  "dagon",
  "higuruma",
  "hakari",
  "megumi",
  "yuta",
];
for (const domain of DOMAINS) {
  const tokens = tokensOf(blockOf(`[data-world="jjk"] [data-domain="${domain}"]`));
  if (Object.keys(tokens).length === 0) {
    problems.push(`alan bloğu yok: ${domain}`);
    continue;
  }
  const bg = tokens["dom-bg1"];
  expect(`alan ${domain} dom-ink`, tokens["dom-ink"], bg, 7);
  expect(`alan ${domain} dom-body`, tokens["dom-body"], bg, 4.5);
  expect(`alan ${domain} dom-muted`, tokens["dom-muted"], bg, 4.5);
  expect(`alan ${domain} dom-accent`, tokens["dom-accent"], bg, 3);
  /* Alan içindeki standart metin token'ları da dönüyor — onlar da geçmeli */
  expect(`alan ${domain} text-primary`, tokens["text-primary"], tokens["bg"], 7);
  expect(`alan ${domain} text-secondary`, tokens["text-secondary"], tokens["bg"], 4.5);
  expect(`alan ${domain} text-muted`, tokens["text-muted"], tokens["bg"], 4.5);
}

if (problems.length === 0) {
  console.log(`✓ kontrast denetimi temiz — ${checks} kontrol, 13 palet`);
  process.exit(0);
}
for (const problem of problems) console.error(`✗ ${problem}`);
process.exit(1);
