#!/usr/bin/env node
/**
 * KARAKTER DENEYİM SAYFALARI · KAYIT TUTARLILIĞI.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Bir deneyim sayfası DÖRT yerde birden var olmak zorunda:
 *
 *   1. `lib/characters/experiences.ts`  → EXPERIENCE_IDS'te bir satır
 *   2. `lib/characters/roster.ts`       → EXPERIENCE_ROSTER'da bir satır
 *   3. `app/…/karakterler/<id>/page.tsx` → kendi statik rota klasörü
 *   4. `components/character/<dir>/`     → bileşen dosyası
 *
 * Biri unutulursa hata SESSİZ oluyor ve her biri farklı şekilde bozuyor:
 *   - kayıt yoksa (2) sayfa var olur ama dizinde görünmez VE ızgaradan
 *     düşmez, yani karakter sayfada iki kez çıkar
 *   - rota yoksa (3) adres künye dossier'ine düşer, yazılan sayfa hiç
 *     açılmaz
 *   - `EXPERIENCE_IDS`te yoksa (1) yoldaş portresi listesi çözülmez
 *
 * Hiçbiri tsc'nin ya da eslint'in yakalayabileceği bir şey değil: dosyalar
 * kendi başlarına geçerli. 24 Ağustos 2026'da bu yüzden yazıldı.
 *
 * Kullanım:  node scripts/check-karakter-kayit.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";

const IDS_SRC = readFileSync("lib/characters/experiences.ts", "utf8");
const ROSTER_SRC = readFileSync("lib/characters/roster.ts", "utf8");
const ROTA_KOK = "app/[locale]/dark-stories/category/anime/karakterler";

/** `EXPERIENCE_IDS = { ... }` gövdesindeki `ad: 1234` çiftleri. */
function experienceIds() {
  const at = IDS_SRC.indexOf("export const EXPERIENCE_IDS = {");
  if (at < 0) throw new Error("EXPERIENCE_IDS bulunamadi");
  const body = IDS_SRC.slice(at, IDS_SRC.indexOf("\n} as const;", at));
  const out = new Map();
  for (const [, ad, no] of body.matchAll(/^\s{2}(\w+):\s*(\d+),/gm)) {
    out.set(Number(no), ad);
  }
  // ITACHI_ID başka dosyadan geliyor, sayı olarak yazılmıyor
  if (body.includes("itachi: ITACHI_ID")) out.set(14, "itachi");
  return out;
}

/** Kadro kaydındaki `characterId: EXPERIENCE_IDS.x` satırları. */
function rosterIds(ids) {
  const tersi = new Map([...ids].map(([no, ad]) => [ad, no]));
  const out = new Set();
  for (const [, ad] of ROSTER_SRC.matchAll(
    /characterId:\s*EXPERIENCE_IDS\.(\w+)/g,
  )) {
    const no = tersi.get(ad);
    if (no !== undefined) out.add(no);
  }
  return out;
}

const ids = experienceIds();
const roster = rosterIds(ids);
const hatalar = [];

for (const [no, ad] of ids) {
  const rota = `${ROTA_KOK}/${no}/page.tsx`;
  if (!existsSync(rota)) {
    hatalar.push(`${ad} (#${no}): rota klasoru YOK → ${rota}`);
    continue;
  }
  // Rotanın import ettiği bileşen dosyası gerçekten var mı?
  const src = readFileSync(rota, "utf8");
  const imp = src.match(/from "@\/(components\/character\/[\w-]+\/\w+)"/);
  if (!imp) {
    hatalar.push(`${ad} (#${no}): rota bir bilesen import etmiyor`);
  } else if (!existsSync(`${imp[1]}.tsx`)) {
    hatalar.push(`${ad} (#${no}): bilesen dosyasi YOK → ${imp[1]}.tsx`);
  }
  if (!roster.has(no)) {
    hatalar.push(
      `${ad} (#${no}): EXPERIENCE_ROSTER'da YOK → sayfa dizinde gorunmez ` +
        `ve izgaradan dusmez (karakter iki kez cikar)`,
    );
  }
}

for (const no of roster) {
  if (!ids.has(no)) {
    hatalar.push(`#${no}: kadro kaydinda var ama EXPERIENCE_IDS'te YOK`);
  }
}

/* Rota klasörü açılmış ama kayda hiç girmemiş numaralar (ters yönde kaçak) */
for (const ad of readdirSync(ROTA_KOK)) {
  if (!/^\d+$/.test(ad)) continue;
  if (!ids.has(Number(ad))) {
    hatalar.push(`#${ad}: rota klasoru var ama EXPERIENCE_IDS'te YOK`);
  }
}

if (hatalar.length) {
  console.error("KARAKTER KAYIT DENETIMI — HATA\n");
  for (const h of hatalar) console.error(`  ✗ ${h}`);
  console.error(`\n${hatalar.length} sorun.`);
  process.exit(1);
}

console.log(
  `KARAKTER KAYIT DENETIMI — TEMIZ (${ids.size} adres, ${roster.size} kadro satiri)`,
);
