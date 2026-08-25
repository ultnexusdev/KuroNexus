#!/usr/bin/env node
/**
 * KARAKTER DENEYİM SAYFALARI · HEX DİSİPLİNİ (kural 16).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Kural 16: bileşenler doğrudan hex kullanmaz, yalnızca token okur. Karakter
 * modüllerinde TEK istisna var — dosyanın başındaki DERİ BLOĞU, çünkü paletin
 * kendisi orada tanımlanıyor (globals.css'ten 24 Ağustos 2026'da taşındı).
 *
 * Bu betik tam olarak o ayrımı ölçüyor: deri bloklarını çıkarıp geriye kalan
 * her yerde hex arıyor. Elle bakmakla bulunmaz — 50 KB'lık bir modülde tek
 * bir `#c0392b` gözden kaçar ve tema değiştiğinde o renk yerinde donar.
 *
 * ── NEYİ İHLAL SAYMIYOR (ve neden) ───────────────────────────────────────
 * Betiğin ilk hâli 36 modülün 36'sında da hata veriyordu; hepsi yanlış
 * alarmdı. Üç ayrım eklendi:
 *
 *  1. `mask-image` / `mask` / `-webkit-mask-*` içindeki `black` ve `white`
 *     RENK DEĞİL, alfa kanalı. `mask-image: linear-gradient(…, black 100%)`
 *     "burası tamamen görünür" demek; token'a çevirmek yanlış olurdu.
 *  2. `white-space`, `border-block` gibi ÖZELLİK ADLARI. Betik yalnızca
 *     bildirimin değer tarafına bakıyor.
 *  3. NÖTR `rgb()/rgba()` — yani r=g=b olanlar. Gölge ve perde malzemesi
 *     (`inset 0 0 60px rgb(0 0 0 / 0.5)`); temayla kaymaları beklenmiyor.
 *     Rengi olan `rgb()` hâlâ ihlal.
 *
 * `color-mix(…)` her zaman serbest: girdisi token olduğu sürece tema ile
 * birlikte kayar.
 *
 * Kullanım:  node scripts/check-karakter-hex.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "components/character";

/** Deri bloklarını (ve yalnızca onları) metinden çıkarır. */
function deriBloklariniSil(css) {
  let out = css;
  for (;;) {
    const m = out.match(
      /\.page\[data-world="[\w-]+"\](\[data-vessel="\w+"\])?\s*\{/,
    );
    if (!m) break;
    const son = out.indexOf("\n}", m.index);
    if (son < 0) break;
    out = out.slice(0, m.index) + out.slice(son + 2);
  }
  return out;
}

/** Yorumdaki hex bir ihlal değil, bir not. */
const yorumSil = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** `prop: value;` çiftleri — maske bildirimleri elenmiş hâlde. */
function bildirimler(css) {
  const out = [];
  for (const [, prop, value] of css.matchAll(/([-\w]+)\s*:\s*([^;{}]+);/g)) {
    if (/mask/i.test(prop)) continue;
    out.push({ prop, value });
  }
  return out;
}

const RENK_ADI = /\b(white|black|red|blue|green|gray|grey|silver|gold|orange|purple|pink|yellow|cyan|magenta)\b/;
const NOTR = /rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/;

const hatalar = [];
let taranan = 0;

for (const dir of readdirSync(BASE)) {
  const p = join(BASE, dir);
  if (!statSync(p).isDirectory()) continue;
  const file = readdirSync(p).find((f) => f.endsWith(".module.css"));
  if (!file) continue;
  taranan += 1;

  const govde = yorumSil(deriBloklariniSil(readFileSync(join(p, file), "utf8")));
  const hex = new Set();
  const fonksiyon = new Set();
  const adlandirilmis = new Set();

  for (const { value } of bildirimler(govde)) {
    for (const m of value.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) hex.add(m[0]);

    for (const m of value.matchAll(/\b(rgba?|hsla?)\s*\([^)]*\)/g)) {
      const n = m[0].match(NOTR);
      /* Nötr (r=g=b) olan gölge/perde malzemesi serbest; rengi olan değil */
      if (n && n[1] === n[2] && n[2] === n[3]) continue;
      if (/^hsl/.test(m[1])) fonksiyon.add(m[0]);
      else if (!n) fonksiyon.add(m[0]);
      else fonksiyon.add(m[0]);
    }

    /* Adlandırılmış renk YALNIZCA değerin tamamıysa sayılır: gradyan
       durakları ve maske dışı degradeler ayrı bir tartışma, buradaki hedef
       `color: white` türü doğrudan atamalar. */
    if (RENK_ADI.test(value.trim()) && /^[a-z]+$/i.test(value.trim())) {
      adlandirilmis.add(value.trim());
    }
  }

  if (hex.size) {
    hatalar.push(
      `${dir}/${file}: deri blogu DISINDA hex → ${[...hex].slice(0, 6).join(", ")}`,
    );
  }
  if (fonksiyon.size) {
    hatalar.push(
      `${dir}/${file}: renkli rgb()/hsl() → ${[...fonksiyon].slice(0, 3).join(" ")}`,
    );
  }
  if (adlandirilmis.size) {
    hatalar.push(
      `${dir}/${file}: adlandirilmis renk atamasi → ${[...adlandirilmis].join(", ")}`,
    );
  }
}

if (hatalar.length) {
  console.error("KARAKTER HEX DENETIMI — HATA\n");
  for (const h of hatalar) console.error(`  ✗ ${h}`);
  console.error(
    `\n${hatalar.length} sorun. Ara ton gerekiyorsa color-mix(in srgb, …) ile token'lardan turet.`,
  );
  process.exit(1);
}

console.log(`KARAKTER HEX DENETIMI — TEMIZ (${taranan} modul tarandi)`);
