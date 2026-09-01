#!/usr/bin/env node
/**
 * İSTEMCİ MESAJ BÜTÇESİ BEKÇİSİ (2026-09-01 denetimi, B-02).
 *
 * Kök layout artık istemciye kataloğun tamamını değil,
 * `lib/i18n/clientMessages.ts` içindeki CLIENT_MESSAGE_PATHS listesini taşıyor.
 * Listede olmayan bir namespace'le useTranslations() çağıran yeni bir bileşen
 * derlemede DEĞİL, canlıda MISSING_MESSAGE olarak patlar — bu betik o boşluğu
 * derlemeden önce kapatır:
 *
 *   1. Repodaki tüm useTranslations("...") literal argümanlarını toplar ve
 *      her birinin listedeki bir yol tarafından kapsandığını doğrular.
 *   2. Literal OLMAYAN (değişkenli/argümansız) çağrıyı hata sayar — statik
 *      analiz kapsayamıyorsa bütçe de garanti edilemez.
 *   3. Listedeki her yolun tr.json ve en.json'da gerçekten var olduğunu
 *      doğrular (yeniden adlandırma/yazım hatası yakalar).
 *
 * Kullanım:  node scripts/check-i18n-client.mjs   (repo kökü: frontend/)
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const WHITELIST_FILE = "lib/i18n/clientMessages.ts";
const SCAN_ROOTS = ["components", "app"];
const SKIP_DIRS = new Set([".deprecated", "node_modules", ".next"]);

// 1) Whitelist'i kaynak metinden oku (Node'a TS import ettirmeden — metin yeter)
const whitelistSource = readFileSync(WHITELIST_FILE, "utf8");
const arrayBlock = whitelistSource.match(
  /CLIENT_MESSAGE_PATHS\s*=\s*\[([\s\S]*?)\]/,
);
if (!arrayBlock) {
  console.error(`✗ ${WHITELIST_FILE} içinde CLIENT_MESSAGE_PATHS bulunamadı`);
  process.exit(1);
}
const whitelist = [...arrayBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const covered = (ns) =>
  whitelist.some((p) => ns === p || ns.startsWith(`${p}.`));

// 2) Kaynak taraması
const problems = [];
let calls = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name)) continue;

    const src = readFileSync(path, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
      .replace(/\/\/[^\n]*/g, "");

    src.split("\n").forEach((line, i) => {
      for (const match of line.matchAll(/useTranslations\(\s*([^)]*)/g)) {
        calls++;
        const arg = match[1].trim();
        const literal = arg.match(/^["']([^"']+)["']\s*$/);
        if (!literal) {
          problems.push(
            `${path}:${i + 1} — literal olmayan namespace: useTranslations(${arg || ""})`,
          );
          continue;
        }
        if (!covered(literal[1])) {
          problems.push(
            `${path}:${i + 1} — "${literal[1]}" CLIENT_MESSAGE_PATHS'te kapsanmıyor`,
          );
        }
      }
    });
  }
}
for (const root of SCAN_ROOTS) walk(root);

// 3) Whitelist yolları her iki katalogda da var mı?
for (const localeFile of ["messages/tr.json", "messages/en.json"]) {
  const catalog = JSON.parse(readFileSync(localeFile, "utf8"));
  for (const p of whitelist) {
    let node = catalog;
    for (const segment of p.split(".")) {
      node = node?.[segment];
    }
    if (node === undefined) {
      problems.push(`${localeFile} — whitelist yolu katalogda yok: "${p}"`);
    }
  }
}

if (problems.length === 0) {
  console.log(
    `✓ i18n istemci bütçesi temiz — ${calls} useTranslations çağrısı, ${whitelist.length} yol kapsıyor`,
  );
  process.exit(0);
}
console.error(
  "✗ İstemci mesaj bütçesi ihlali — canlıda MISSING_MESSAGE üretir:",
);
for (const problem of problems) console.error(`   ${problem}`);
process.exit(1);
