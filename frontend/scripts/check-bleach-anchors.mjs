#!/usr/bin/env node
/**
 * BLEACH · SAYFA İÇİ ÇAPA DENETİMİ (P18-b).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * `lib/anime/bleach/anchors.ts` üç yeri birden besliyor: "Bölümlere atla"
 * listesi, JSON-LD `ItemList` ve derinlik rayının komşuluğu. Bir bölümün
 * `id`si değişirse üçü birden ölü bağlantıya döner ve bu HİÇBİR YERDE
 * hata vermez — sayfa açılır, bağlantı hiçbir şey yapmaz.
 *
 * `worlds.ts`teki `READY_SECTIONS` aynı dersin elle tutulan hâli: "ölü bir
 * sayfa içi çapası, olmayan bir bağlantıdan kötüdür". Bu betik o kararı
 * insandan alıp derlemeye veriyor.
 *
 * ── ÜÇ KONTROL ───────────────────────────────────────────────────────────
 *   1. Defterdeki her çapa sayfada GERÇEKTEN var mı
 *   2. Sayfadaki her bölüm defterde var mı (yeni bölüm eklenip listeye
 *      yazılmayı unutmuş olabilir)
 *   3. Her çapanın etiketi hem `tr.json` hem `en.json` içinde var mı
 *
 * ⚠️ İKİ KİMLİK KAYNAĞI VAR ve betik ikisini de okumak zorunda:
 *   • bileşen kaynaklarındaki düz `id="..."`
 *   • `WorldSection` `id={layer}` yazıyor, değerler `LAYER_IDS` dizisinde
 * İkincisi unutulursa beş katman "yok" görünür ve betik yanlış alarm verir.
 *
 * Kullanım:  node scripts/check-bleach-anchors.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const COMPONENTS = "components/anime/bleach";
const PAGE = "app/[locale]/anime/bleach/page.tsx";
const MANIFEST = "lib/anime/bleach/anchors.ts";
const WORLD_SECTION = join(COMPONENTS, "WorldSection.tsx");

const problems = [];

/* ── Defter ────────────────────────────────────────────────────────────── */
const manifestSrc = readFileSync(MANIFEST, "utf8");
const declared = [...manifestSrc.matchAll(/\{\s*anchor:\s*"([^"]+)",\s*key:\s*"([^"]+)"\s*\}/g)].map(
  (m) => ({ anchor: m[1], key: m[2] }),
);
if (declared.length === 0) {
  console.error("✗ anchors.ts okunamadı — BLEACH_ANCHORS biçimi mi değişti?");
  process.exit(1);
}

/* ── Sayfada gerçekten basılan kimlikler ───────────────────────────────── */
const sources = readdirSync(COMPONENTS)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => join(COMPONENTS, f));
sources.push(PAGE);

const literal = new Set();
/** `<section id="x">` / `<header id="x">` — yani BÖLÜM sınırı olanlar */
const sectionIds = new Set();
for (const file of sources) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/\sid="([^"${}]+)"/g)) literal.add(m[1]);
  for (const m of text.matchAll(/<(?:section|header)\b[^>]*?\sid="([^"${}]+)"/gs)) {
    sectionIds.add(m[1]);
  }
}

/* `WorldSection` kimliği prop'tan yazıyor: `id={layer}` */
const layerSrc = readFileSync(WORLD_SECTION, "utf8");
const layerBlock = layerSrc.match(/LAYER_IDS\s*=\s*\[([\s\S]*?)\]/);
const layerIds = layerBlock
  ? [...layerBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  : [];
if (layerIds.length === 0) {
  problems.push("`LAYER_IDS` okunamadı — WorldSection.tsx biçimi değişmiş olabilir");
}
for (const id of layerIds) {
  literal.add(id);
  sectionIds.add(id);
}

/* ── 1 · Ölü çapa var mı ───────────────────────────────────────────────── */
for (const { anchor } of declared) {
  if (!literal.has(anchor)) {
    problems.push(`ÖLÜ ÇAPA: defterde \`${anchor}\` var, sayfada yok`);
  }
}

/* ── 2 · Deftere yazılmamış bölüm var mı ───────────────────────────────── */
const inManifest = new Set(declared.map((d) => d.anchor));
/* Üç Dünya beş kardeş katman; deftere yalnızca ilki giriyor (gerekçe
   `anchors.ts` içinde). Kalan dördü bilerek listede değil. */
const EXPECTED_OUTSIDE = new Set(layerIds.slice(1));
for (const id of sectionIds) {
  if (inManifest.has(id) || EXPECTED_OUTSIDE.has(id)) continue;
  problems.push(`DEFTERDE YOK: sayfada \`<section id="${id}">\` var, anchors.ts'te yok`);
}

/* ── 3 · Etiketler iki sözlükte de var mı ──────────────────────────────── */
for (const locale of ["tr", "en"]) {
  const toc = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")).anime?.bleach?.toc;
  if (!toc) {
    problems.push(`\`anime.bleach.toc\` ${locale}.json içinde yok`);
    continue;
  }
  for (const { key } of declared) {
    if (typeof toc[key] !== "string" || toc[key].length === 0) {
      problems.push(`ETİKET EKSİK: ${locale}.json → anime.bleach.toc.${key}`);
    }
  }
}

if (problems.length === 0) {
  console.log(
    `✓ çapa denetimi temiz — ${declared.length} bölüm, ${sectionIds.size} kimlik, iki sözlük`,
  );
  process.exit(0);
}
for (const problem of problems) console.error(`✗ ${problem}`);
process.exit(1);
