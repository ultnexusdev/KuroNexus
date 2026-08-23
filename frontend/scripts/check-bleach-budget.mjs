#!/usr/bin/env node
/**
 * BLEACH · PERFORMANS BÜTÇESİ DENETİMİ (P18-a).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * P18-a'da sayfa ölçüldü ve brief'in dört hedefinden üçü ZATEN tutuyordu:
 * JS 150,2KB gzip (hedef 220KB), CLS 0, uzun görev yok. Yani o turda
 * yapılacak asıl iş "optimize etmek" değil, **bu durumu kaybetmemek**ti —
 * on altı bölüm bitti ama sayfa hâlâ büyüyor (P18-c üç bölümü yeniden
 * yazacak, ileride One Piece aynı altyapıyı devralacak).
 *
 * Bir bütçe yazılmazsa bir sonraki bölüm paketi 30KB şişirir ve kimse
 * fark etmez: performans gerilemesi görünmez, çünkü sayfa hâlâ "açılıyor".
 * Bu betik o sessiz kaymayı sesli hâle getiriyor.
 *
 * ── NE ÖLÇÜYOR ───────────────────────────────────────────────────────────
 *   1. SERT (brief'in hedefi) — rotanın istemci JS'i < 220KB gzip.
 *      Aşarsa çıkış kodu 1.
 *   2. YUMUŞAK (23 Ağustos 2026 ölçümü + %20 pay) — CSS ve, sunucu
 *      ayaktaysa, HTML belgesi. Aşarsa yalnızca uyarı: bunlar brief'in
 *      koyduğu hedefler değil, gerilemeyi görmek için konmuş çizgiler.
 *
 * ⚠️ DERLEME GEREKTİRİYOR. Ölçüm `.next/app-build-manifest.json` üzerinden
 * yapılıyor; `next build` koşmamışsa betik ATLIYOR (çıkış 0) ve bunu
 * yüksek sesle yazıyor. Derlemeyi zorunlu kılmak `pnpm check:bleach`i
 * her commit öncesi bir dakikalık derlemeye mahkûm ederdi.
 *
 * ⚠️ gzip BURADA BİR VEKİL. Sunucu brotli konuşuyor olabilir; amaç mutlak
 * bayt değil, **turdan tura karşılaştırılabilir** bir sayı üretmek.
 * Ölçüm yöntemi değişirse eşikler de yeniden ölçülmeli.
 *
 * Kullanım:  node scripts/check-bleach-budget.mjs
 *            BLEACH_URL=http://localhost:3100/anime/bleach node scripts/…
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = process.cwd();
const NEXT = join(ROOT, ".next");
const ROUTE = "/[locale]/anime/bleach/page";

/** Brief P18 §1'in hedefi. SERT sınır. */
const JS_BUDGET = 220 * 1024;

/** 23 Ağustos 2026 ölçümü 32,9KB; %20 pay bırakıldı. YUMUŞAK. */
const CSS_BUDGET = 40 * 1024;

/** 23 Ağustos 2026 ölçümü 140,0KB; %20 pay bırakıldı. YUMUŞAK. */
const HTML_BUDGET = 168 * 1024;

const kb = (n) => (n / 1024).toFixed(1) + "KB";

const manifestPath = join(NEXT, "app-build-manifest.json");
if (!existsSync(manifestPath)) {
  console.log("⚠ BÜTÇE DENETİMİ ATLANDI — derleme yok.");
  console.log("  Ölçmek için önce: pnpm build");
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const files = manifest.pages[ROUTE];
if (!files) {
  process.exit(1);
  process.exitCode = 1;
}

let js = 0;
let css = 0;
const rows = [];
for (const rel of files) {
  const path = join(NEXT, rel);
  if (!existsSync(path)) continue;
  const size = gzipSync(readFileSync(path)).length;
  if (rel.endsWith(".js")) js += size;
  else if (rel.endsWith(".css")) css += size;
  rows.push([size, rel]);
}

rows.sort((a, b) => b[0] - a[0]);
console.log("BLEACH · rota yükü (gzip)");
for (const [size, rel] of rows.slice(0, 6)) {
  console.log(`  ${kb(size).padStart(8)}  ${rel}`);
}
if (rows.length > 6) console.log(`  …${rows.length - 6} dosya daha`);

const problems = [];
const warnings = [];

console.log("");
console.log(`  JS   ${kb(js).padStart(8)} / ${kb(JS_BUDGET)} (sert)`);
if (js > JS_BUDGET) {
  problems.push(`İstemci JS bütçeyi aştı: ${kb(js)} > ${kb(JS_BUDGET)}`);
}

console.log(`  CSS  ${kb(css).padStart(8)} / ${kb(CSS_BUDGET)} (yumuşak)`);
if (css > CSS_BUDGET) {
  warnings.push(`CSS büyümüş: ${kb(css)} > ${kb(CSS_BUDGET)}`);
}

/* ── HTML: yalnızca ayakta bir sunucu verilmişse ──────────────────────────
   Sayfa `force-dynamic`; belgenin boyutu ancak çizildiğinde belli oluyor.
   Küratör görselleri yüklendikçe bu sayı büyüyor, o yüzden yumuşak. */
const url = process.env.BLEACH_URL;
if (url) {
  try {
    const res = await fetch(url, { headers: { "accept-encoding": "identity" } });
    const body = Buffer.from(await res.arrayBuffer());
    const gz = gzipSync(body).length;
    console.log(`  HTML ${kb(gz).padStart(8)} / ${kb(HTML_BUDGET)} (yumuşak, ham ${kb(body.length)})`);
    if (gz > HTML_BUDGET) {
      warnings.push(`HTML belgesi büyümüş: ${kb(gz)} > ${kb(HTML_BUDGET)}`);
    }
  } catch (error) {
    console.log(`  HTML  ölçülemedi (${url}): ${error.message}`);
  }
} else {
  console.log("  HTML  ölçülmedi — BLEACH_URL verilmedi");
}

console.log("");
for (const warning of warnings) console.log(`⚠ ${warning}`);

/* ⚠️ `process.exit()` DEĞİL: HTML ölçümünden sonra havuzda kalan soket
   kapanırken Node 24 Windows'ta bir libuv assert'i düşürüyor ve süreç
   127 ile ölüyor — bütçe TUTUYORKEN denetim kırmızı görünüyordu. Çıkış
   kodunu yazıp olay döngüsünün kendi kendine boşalmasını bekliyoruz. */
if (problems.length === 0) {
  console.log(`✓ Bütçe tutuyor${warnings.length ? " (uyarılarla)" : ""}.`);
  process.exitCode = 0;
} else {
  for (const problem of problems) console.error(`✗ ${problem}`);
  console.error("");
  console.error("Ne yapmalı: hangi modülün büyüdüğünü bul — rota parçasının");
  console.error("içindeki modül sınırlarını ölç. P18-a'da bu yöntemle en");
  console.error("büyük iki modülün bileşen değil VERİ olduğu görülmüştü:");
  console.error("zanpakuto.ts 8,9KB gzip, divisions.ts 5,2KB gzip.");
  process.exitCode = 1;
}
