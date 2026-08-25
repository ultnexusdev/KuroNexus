#!/usr/bin/env node
/**
 * KARAKTER DENEYİM SAYFALARI · CSS SINIF KARŞILIĞI.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * `styles.foo` yazıp CSS'te `.foo` tanımlamamak SESSİZ bir hata:
 * `className={undefined}` geçerli JSX, tsc de eslint de bir şey demiyor.
 * Sonuç, sayfanın bir bölümünün stilsiz kalması — ve o bölüm çoğu zaman
 * ekranın altında olduğu için gözle de yakalanmıyor.
 *
 * 33 sayfalık iki turda EN SIK bulgu bu oldu (Chōji'de `ruleMark`,
 * Kankurō'da `kumadoriLine` ve `markRing`, Minato'da `railHint`,
 * Kenpachi'de `modeLabel`). Beşi de ajanın kendi tsc/eslint denetiminden
 * temiz geçmişti.
 *
 * ⚠️ Ters yön (CSS'te tanımlı ama kullanılmayan sınıf) BİLEREK ölçülmüyor:
 * bir sınıf `data-*` durum seçicileriyle ya da başka bir sınıfın içinden
 * `composes` benzeri kalıplarla anlam kazanabiliyor; "kullanılmıyor" demek
 * her zaman doğru olmuyor ve yanlış alarm üretiyor.
 *
 * Kullanım:  node scripts/check-karakter-sinif.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "components/character";

const hatalar = [];
let taranan = 0;

for (const dir of readdirSync(BASE)) {
  const p = join(BASE, dir);
  if (!statSync(p).isDirectory()) continue;
  const dosyalar = readdirSync(p);
  const cssFile = dosyalar.find((f) => f.endsWith(".module.css"));
  if (!cssFile) continue;
  taranan += 1;

  const css = readFileSync(join(p, cssFile), "utf8");
  const tanimli = new Set();
  for (const [, ad] of css.matchAll(/\.([A-Za-z_][\w-]*)/g)) tanimli.add(ad);

  /** Hangi sınıf hangi dosyada okunuyor — hata mesajı yerini söylesin. */
  const kullanilan = new Map();
  for (const f of dosyalar.filter((f) => f.endsWith(".tsx"))) {
    const src = readFileSync(join(p, f), "utf8");
    for (const [, ad] of src.matchAll(/styles\.([A-Za-z_]\w*)/g)) {
      if (!kullanilan.has(ad)) kullanilan.set(ad, f);
    }
    for (const [, ad] of src.matchAll(/styles\[["'`]([^"'`]+)["'`]\]/g)) {
      if (!kullanilan.has(ad)) kullanilan.set(ad, f);
    }
  }

  for (const [ad, dosya] of kullanilan) {
    if (!tanimli.has(ad)) {
      hatalar.push(`${dir}/${dosya}: styles.${ad} okunuyor ama ${cssFile} icinde .${ad} YOK`);
    }
  }
}

if (hatalar.length) {
  console.error("KARAKTER SINIF DENETIMI — HATA\n");
  for (const h of hatalar) console.error(`  ✗ ${h}`);
  console.error(
    `\n${hatalar.length} tanimsiz sinif. Her biri sessizce className={undefined} uretiyor.`,
  );
  process.exit(1);
}

console.log(`KARAKTER SINIF DENETIMI — TEMIZ (${taranan} modul tarandi)`);
