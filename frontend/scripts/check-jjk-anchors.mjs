#!/usr/bin/env node
/**
 * JJK · SAYFA İÇİ ÇAPA DENETİMİ — Bleach betiğinin kardeşi.
 *
 * `lib/anime/jjk/anchors.ts` üç yeri besliyor: atla listesi, JSON-LD ve
 * kanji rayı. Bir bölümün `id`si değişirse üçü birden ölü bağlantıya
 * döner ve hiçbir yerde hata vermez — bu betik o sınıfı derlemeye verir.
 *
 * Üç kontrol: (1) defterdeki her çapa sayfada var mı, (2) sayfadaki her
 * bölüm defterde var mı, (3) her etiket iki sözlükte de var mı.
 *
 * Kullanım:  node scripts/check-jjk-anchors.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const COMPONENTS = "components/anime/jjk";
const PAGE = "app/[locale]/anime/jujutsu-kaisen/page.tsx";
const MANIFEST = "lib/anime/jjk/anchors.ts";

const problems = [];

/* ── Defter ────────────────────────────────────────────────────────────── */
const manifestSrc = readFileSync(MANIFEST, "utf8");
const declared = [
  ...manifestSrc.matchAll(
    /\{\s*anchor:\s*"([^"]+)",\s*key:\s*"([^"]+)",\s*kanji:\s*"([^"]+)"\s*\}/g,
  ),
].map((m) => ({ anchor: m[1], key: m[2] }));
if (declared.length === 0) {
  console.error("✗ anchors.ts okunamadı — JJK_ANCHORS biçimi mi değişti?");
  process.exit(1);
}

/* ── Sayfada gerçekten basılan kimlikler ───────────────────────────────── */
const sources = readdirSync(COMPONENTS)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => join(COMPONENTS, f));
sources.push(PAGE);

const literal = new Set();
const sectionIds = new Set();
for (const file of sources) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/\sid="([^"${}]+)"/g)) literal.add(m[1]);
  for (const m of text.matchAll(/<(?:section|header)\b[^>]*?\sid="([^"${}]+)"/gs)) {
    sectionIds.add(m[1]);
  }
}

/* ── 1 · Ölü çapa var mı ───────────────────────────────────────────────── */
for (const { anchor } of declared) {
  if (!literal.has(anchor)) {
    problems.push(`ÖLÜ ÇAPA: defterde \`${anchor}\` var, sayfada yok`);
  }
}

/* ── 2 · Deftere yazılmamış bölüm var mı ───────────────────────────────── */
const inManifest = new Set(declared.map((d) => d.anchor));
for (const id of sectionIds) {
  if (inManifest.has(id)) continue;
  problems.push(`DEFTERDE YOK: sayfada \`<section id="${id}">\` var, anchors.ts'te yok`);
}

/* ── 3 · Etiketler iki sözlükte de var mı ──────────────────────────────── */
for (const locale of ["tr", "en"]) {
  const toc = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")).anime?.jjk?.toc;
  if (!toc) {
    problems.push(`\`anime.jjk.toc\` ${locale}.json içinde yok`);
    continue;
  }
  for (const { key } of declared) {
    if (typeof toc[key] !== "string" || toc[key].length === 0) {
      problems.push(`ETİKET EKSİK: ${locale}.json → anime.jjk.toc.${key}`);
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
