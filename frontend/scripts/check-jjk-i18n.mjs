#!/usr/bin/env node
/**
 * JJK · İNGİLİZCE SAYFAYA TÜRKÇE SIZMASIN — Bleach betiğinin kardeşi.
 *
 * `lib/anime/jjk` veri dosyalarındaki dizelerde ş/Ş/ğ/Ğ/ı/İ arar ve `tr:`
 * alanının değeri OLMAYAN her eşleşmeyi bildirir. Bu beş harf Türkçeye
 * özgü; romaji ve İngilizce hiçbirini kullanmıyor — sıfır yanlış alarm.
 * (ö/ü/ç bilinçli olarak ARANMIYOR: Japonca romajide ō/ū var, ortak
 * kelimelerde ü geçebiliyor — Bleach'teki aynı ölçüm.)
 *
 * Kullanım:  node scripts/check-jjk-i18n.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "lib/anime/jjk";
const TURKISH = /[şŞğĞıİ]/;
const problems = [];
let scanned = 0;

for (const name of readdirSync(DIR).filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(join(DIR, name), "utf8");

  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, "");

  code.split("\n").forEach((line, i) => {
    for (const match of line.matchAll(/"[^"]*"/g)) {
      scanned++;
      if (!TURKISH.test(match[0])) continue;
      const before = line.slice(0, match.index);
      if (/\btr\s*:\s*$/.test(before)) continue;
      problems.push(`${name}:${i + 1} — ${match[0].slice(0, 60)}`);
    }
  });
}

if (problems.length === 0) {
  console.log(`✓ i18n denetimi temiz — ${scanned} dize, \`tr:\` dışında Türkçe yok`);
  process.exit(0);
}
console.error("✗ `tr:` alanı DIŞINDA Türkçe dize — İngilizce sayfada aynen çıkar:");
for (const problem of problems) console.error(`   ${problem}`);
process.exit(1);
