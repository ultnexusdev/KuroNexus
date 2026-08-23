#!/usr/bin/env node
/**
 * BLEACH · İNGİLİZCE SAYFAYA TÜRKÇE SIZMASIN (P18-b).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * `/en/anime/naruto` bugün TÜRKÇE açılıyor — o sayfada tek bir `t()` çağrısı
 * yok ve bu, AGENTS kural 1'in bilinen bir ihlali (P00 §1.3). Bleach en
 * baştan `Localized<T>` ile kuruldu, ama P18-b'de İngilizce çıktı taranınca
 * yine de iki Türkçe kelime bulundu: `timeline.ts` içindeki
 * `blade: "斬月 · bandajlı"` ve `"斬月 · iki bıçak"`.
 *
 * Kaçak, alanın **ÇEVRİLMEZ** diye işaretli olmasından geldi ve işaret
 * yanlış değildi: kılıcın adı gerçekten çevrilmez. Aynı dizeye bir de
 * NİTELEME sıkıştırılmıştı ve o çevrilmeliydi. Yani hata gözle
 * yakalanacak türden değil — alan doğru, içeriği yanlıştı.
 *
 * ── NASIL BAKIYOR ────────────────────────────────────────────────────────
 * Veri dosyalarındaki dizelerde ş/Ş/ğ/Ğ/ı/İ arıyor ve `tr:` alanının
 * değeri OLMAYAN her eşleşmeyi bildiriyor. Bu beş harf Türkçeye özgü:
 * Japonca romaji (ō, ū), Almanca (Wandenreich terimleri) ve İngilizce
 * hiçbirini kullanmıyor, yani yanlış alarm üretmiyor.
 *
 * ⚠️ ö/ü/ç ARANMIYOR — Almanca ve Türkçe ortak kullanıyor
 * (`Blut Vene`, `Schrift` kayıtlarında geçebilir). Beş harf, sıfır gürültü.
 *
 * ⚠️ Dize çıkarımı basit (`"…"` arası), çünkü bu dosyalarda kaçışlı tırnak
 * YOK (ölçüldü) — metinler tipografik tırnak kullanıyor. Bir gün girerse
 * çıkarım kaçırabilir; o zaman gerçek bir çözümleyici gerekir.
 *
 * Kullanım:  node scripts/check-bleach-i18n.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "lib/anime/bleach";
const TURKISH = /[şŞğĞıİ]/;
const problems = [];
let scanned = 0;

for (const name of readdirSync(DIR).filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(join(DIR, name), "utf8");

  /* Yorumları boşlukla değiştir (satır numaraları korunsun) */
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, "");

  code.split("\n").forEach((line, i) => {
    for (const match of line.matchAll(/"[^"]*"/g)) {
      scanned++;
      if (!TURKISH.test(match[0])) continue;
      /* `tr:` alanının değeri meşru — sözleşme gereği Türkçe */
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
console.error("");
console.error("Çözüm: adı ve nitelemeyi ayır — ad `string` kalsın,");
console.error("niteleme `Localized` olsun (`timeline.ts` → `bladeNote`).");
process.exit(1);
