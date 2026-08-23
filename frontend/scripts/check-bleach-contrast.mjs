#!/usr/bin/env node
/**
 * BLEACH · KONTRAST DENETİMİ.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Sayfa scroll boyunca BEŞ paleti birbirine bağlıyor ve biri (Hueco Mundo)
 * negatif. Bir palette bir tonu elle değiştirmek, o dünyada okunmayan bir
 * metin bırakmanın en kolay yolu — ve hata yalnızca o katmana inildiğinde
 * görünür. Gözle bakarak yakalanacak bir şey değil.
 *
 * Betik değerleri `globals.css`ten OKUYOR, kendi kopyasını tutmuyor: tek
 * doğruluk kaynağı stil dosyası (kural 16). Palet orada değişirse denetim
 * kendiliğinden yeni değeri ölçüyor.
 *
 * Eşikler:
 *   --text-primary    → AAA (7:1)   her üç zeminde
 *   --text-secondary  → AA  (4.5:1) her üç zeminde
 *   --text-muted      → AA  (4.5:1) her üç zeminde
 *   --accent          → 3:1 zemin üzerinde (büyük öğe / grafik sınırı)
 *
 * Kullanım:  node scripts/check-bleach-contrast.mjs
 */
import { readFileSync } from "node:fs";

const CSS = readFileSync("styles/globals.css", "utf8");

/**
 * Denetlenen bloklar — sayfa derisi + beş katman + iki kan zemini.
 *
 * ⚠️ P12 (23 Ağustos 2026) iki zemin daha ekledi: bölüm sayfayı siyahtan
 * kana çeviriyor ve iki ara durak `[data-layer]` değil `[data-blood]`
 * kimliğinde (gerekçesi `globals.css`te). Denetime dahil edilmeselerdi
 * sayfanın en riskli iki zemini ölçüm dışında kalırdı — kırmızı üzerine
 * metin, gözle "olur gibi" görünüp 4.5:1'in altına düşmesi en kolay yer.
 */
const BLOCKS = [
  '[data-world="bleach"]',
  '[data-layer="living"]',
  '[data-layer="soul-society"]',
  '[data-layer="hueco-mundo"]',
  '[data-layer="wandenreich"]',
  '[data-layer="royal"]',
  '[data-world="bleach"] [data-blood="dark"]',
  '[data-world="bleach"] [data-blood="full"]',
];

/** Seçicinin gövdesindeki token'ları oku */
function tokensOf(selector) {
  const at = CSS.indexOf(`\n${selector} {`);
  if (at < 0) throw new Error(`blok bulunamadi: ${selector}`);
  const body = CSS.slice(at, CSS.indexOf("\n}", at));
  const out = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
    out[name] = value;
  }
  return out;
}

const hex = (c) => {
  const n = c.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const lum = (c) => {
  const [r, g, b] = hex(c).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const SURFACES = ["bg", "surface", "surface-hover"];
const TEXTS = [
  ["text-primary", 7],
  ["text-secondary", 4.5],
  ["text-muted", 4.5],
];

let checks = 0;
const failures = [];

for (const selector of BLOCKS) {
  const t = tokensOf(selector);
  for (const surface of SURFACES) {
    for (const [role, min] of TEXTS) {
      if (!t[role] || !t[surface]) {
        failures.push(`${selector}: ${role} ya da ${surface} EKSIK (kural 16)`);
        continue;
      }
      checks += 1;
      const r = ratio(t[role], t[surface]);
      if (r < min) {
        failures.push(
          `${selector}  ${role} / ${surface}  ${r.toFixed(2)} < ${min}`,
        );
      }
    }
  }
  checks += 1;
  const a = ratio(t.accent, t.bg);
  if (a < 3) {
    failures.push(`${selector}  accent / bg  ${a.toFixed(2)} < 3`);
  }
}

if (failures.length === 0) {
  console.log(`✓ kontrast denetimi temiz — ${checks} kontrol, ${BLOCKS.length} palet`);
  process.exit(0);
}

console.error(`✗ kontrast denetimi DÜŞTÜ (${checks} kontrol):\n`);
for (const f of failures) console.error(`  ${f}`);
process.exit(1);
