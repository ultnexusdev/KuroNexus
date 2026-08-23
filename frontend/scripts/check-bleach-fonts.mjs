#!/usr/bin/env node
/**
 * BLEACH · GOTİK FONT DENETİMİ.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * UnifrakturMaguntia'nın Türkçe diyakritikleri YOK. Google Fonts'taki
 * kayıtta yalnızca `latin` dilimi var — ş, ğ, İ, ı, ö, ü, ç harflerinin
 * hiçbiri ailede tanımlı değil (ölçüldü: `font-data.json`). Bu aileye bir
 * Türkçe dize geçerse tarayıcı harf harf yedek fonta düşer ve satır
 * yarı-gotik, yarı-sans olarak çizilir. Gözle fark edilmesi zor, çünkü
 * hata yalnızca BAZI harflerde görünür.
 *
 * Brief'in kuralı net: gotik aile YALNIZCA Wandenreich wordmark'ında ve
 * Schrift harflerinde kullanılacak. Bu betik iki şeyi denetliyor:
 *
 *   1. `--font-gothic` / `--b-gothic` yalnızca izinli CSS kuralında
 *      tanımlanıyor mu (yayılmadı mı?)
 *   2. `world.gothic` sınıfını kullanan her JSX satırında Türkçe harf var mı
 *
 * ── NEDEN `build` ADIMINDA DEĞİL ─────────────────────────────────────────
 * Derlemeyi kırmak, deploy'u kırmak demek. Bu bir DENETİM: elle ya da CI'da
 * koşuluyor, kırmızı verirse insan bakıyor. Aynı gerekçeyle çıkış kodu
 * anlamlı (1 = ihlal var) — bir gün CI'a takılırsa hazır.
 *
 * Kullanım:  node scripts/check-bleach-fonts.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

/** Gotik aileyi TANIMLAMASINA izin verilen tek yer */
const DECLARED_IN = ["components/anime/bleach/world.module.css"];

/** Fontu kök düzende kurmak da meşru — orada `variable` olarak geçiyor */
const SETUP_IN = ["app/[locale]/layout.tsx"];

/** ş ğ ı İ ö ü ç ve büyük harfleri */
const TURKISH = /[şŞğĞıİöÖüÜçÇ]/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

const files = walk(ROOT);
const problems = [];

// ── 1 · Gotik aile nerede TANIMLANIYOR ────────────────────────────────────
for (const file of files) {
  const rel = file.slice(ROOT.length + 1).replace(/\\/g, "/");
  const text = readFileSync(file, "utf8");
  if (!/--(font|b)-gothic\s*:/.test(text)) continue;
  const allowed = [...DECLARED_IN, ...SETUP_IN].some((p) => rel.endsWith(p));
  if (!allowed) {
    problems.push(
      `${rel}: gotik aile burada TANIMLANIYOR. İzinli tek yer: ${DECLARED_IN[0]}`,
    );
  }
}

// ── 2 · Gotik aileyi UYGULAYAN sınıfları CSS'ten türet ────────────────────
//
// ⚠️ Sınıf adı SABİT YAZILMIYOR. İlk sürüm `.gothic` arıyordu ve
// `Atmospheres.module.css` içindeki `.gothicMark` denetimin dışında kaldı:
// `\b` sınırı "gothicM"de eşleşmiyor. Sınıf adı bir gün `.wordmark` olsa
// denetim yine sessizce körleşirdi.
//
// Doğru soru "hangi sınıf `gothic` diye adlandırılmış" değil, "hangi sınıf
// gotik aileyi UYGULUYOR". Cevap CSS'te yazılı; oradan okunuyor.
const gothicClasses = new Set();
for (const file of files) {
  if (!file.endsWith(".css")) continue;
  /* ⚠️ Yorumlar ÖNCE ayıklanıyor. Seçici yakalaması `[^{}]+` olduğu için
     kuralın önündeki yorum bloğunu da yutuyordu ve oradaki
     "check-bleach-fonts.mjs" metninden `.mjs` diye hayalî bir sınıf
     türüyordu (ölçüldü). Zararsız görünüyordu ama denetimin neyi
     izlediğini okunmaz kılıyor. */
  const text = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selector] of text.matchAll(
    /([^{}]+)\{[^{}]*font-family:\s*var\(--(?:b|font)-gothic[^{}]*\}/g,
  )) {
    for (const [, name] of selector.matchAll(/\.([A-Za-z_][\w-]*)/g)) {
      gothicClasses.add(name);
    }
  }
}

if (gothicClasses.size === 0) {
  problems.push(
    "gotik aileyi uygulayan HİÇBİR sınıf bulunamadı — denetim körleşmiş olabilir",
  );
}

// ── 3 · O sınıfları taşıyan satırlarda Türkçe harf var mı ─────────────────
const gothicPattern = new RegExp(
  `\\.(?:${[...gothicClasses].join("|")})\\b`,
);

for (const file of files) {
  if (!file.endsWith(".tsx")) continue;
  const rel = file.slice(ROOT.length + 1).replace(/\\/g, "/");
  const lines = readFileSync(file, "utf8").split("\n");

  lines.forEach((line, i) => {
    if (gothicClasses.size === 0) return;
    // `world.gothic`, `styles.gothicMark` … CSS'ten türetilen her ad
    if (!gothicPattern.test(line)) return;
    // Aynı satırdaki metin içeriği: >...< arası
    const inline = [...line.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]);
    for (const text of inline) {
      if (TURKISH.test(text)) {
        problems.push(
          `${rel}:${i + 1}: gotik aileye Türkçe dize geçiyor → "${text.trim()}"`,
        );
      }
    }
    // Çok satırlı JSX: sonraki satırdaki düz metni de tara
    const next = lines[i + 1] ?? "";
    if (/^\s*[^<>{}\s][^<>{}]*$/.test(next) && TURKISH.test(next)) {
      problems.push(
        `${rel}:${i + 2}: gotik aileye Türkçe dize geçiyor → "${next.trim()}"`,
      );
    }
  });
}

if (problems.length === 0) {
  // Hangi siniflarin izlendigi YAZILIYOR: denetimin kor kalmadigi
  // ciktidan gorulsun, "temiz" cikmasi tek basina yetmesin.
  console.log(
    `✓ gotik font denetimi temiz — izlenen sınıf: ${[...gothicClasses].join(", ") || "yok"}`,
  );
  process.exit(0);
}

console.error("✗ gotik font denetimi DÜŞTÜ:\n");
for (const p of problems) console.error(`  ${p}`);
console.error(
  "\nUnifrakturMaguntia'da ş/ğ/ı/İ/ö/ü/ç YOK. Türkçe metin Inter ya da Jost ile setlenmeli.",
);
process.exit(1);
