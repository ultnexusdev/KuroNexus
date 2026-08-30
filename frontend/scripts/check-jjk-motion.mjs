#!/usr/bin/env node
/**
 * JJK · HAREKET DENETİMİ — `prefers-reduced-motion` tam kapsam.
 *
 * Bleach betiğinin kardeşi; iki meşru desen aynı: OPT-IN (animasyon
 * yalnızca `no-preference` içinde kurulur) ya da GERİ ALMA (`reduce`
 * bloğu animasyonu/geçişi geri alır). Denetlenen şey kaba ama regresyonu
 * yakalayan şey: "animasyon var ama azaltılmış hareket hiç ele alınmamış".
 *
 * Kullanım:  node scripts/check-jjk-motion.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "components/anime/jjk";
const problems = [];
const rows = [];

for (const name of readdirSync(DIR).filter((f) => f.endsWith(".module.css"))) {
  const text = readFileSync(join(DIR, name), "utf8");
  const css = text.replace(/\/\*[\s\S]*?\*\//g, "");

  const animates = css
    .split(/[;{}]/)
    .map((decl) => decl.trim())
    .some(
      (decl) =>
        decl.startsWith("animation:") ||
        decl.startsWith("animation-name:") ||
        decl.startsWith("animation-timeline:"),
    );

  if (!animates) continue;

  const optIn = css.includes("prefers-reduced-motion: no-preference");
  const undo = css.includes("prefers-reduced-motion: reduce");

  rows.push([name, optIn ? "opt-in" : undo ? "geri alma" : "—"]);
  if (!optIn && !undo) {
    problems.push(
      `${name}: animasyon tanımlıyor ama \`prefers-reduced-motion\` hiç ele alınmamış`,
    );
  }
}

for (const [name, mode] of rows) {
  console.log(`  ${mode.padEnd(10)} ${name}`);
}

if (problems.length === 0) {
  console.log(`✓ hareket denetimi temiz — ${rows.length} modülün hepsinde karşılığı var`);
  process.exit(0);
}
for (const problem of problems) console.error(`✗ ${problem}`);
process.exit(1);
