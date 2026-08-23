#!/usr/bin/env node
/**
 * BLEACH · HAREKET DENETİMİ — `prefers-reduced-motion` tam kapsam (P18-b).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Brief her bölüm için "azaltılmış harekette ne olacak" sorusunu ayrı ayrı
 * cevaplatıyor ve P18-b'de yirmi beş modülün hepsi tek tek okundu: kapsam
 * TAMDI. Bu betik o durumu donduruyor — yeni bir bölüm animasyon ekleyip
 * karşılığını yazmayı unutursa `pnpm check:bleach` kırmızı yanıyor.
 *
 * Vestibüler rahatsızlığı olan biri için bu bir süs değil: sayfa boyunca
 * kaydırmaya bağlı sahneler, çapraz geçişler ve yükselen partiküller var.
 *
 * ── İKİ MEŞRU DESEN ──────────────────────────────────────────────────────
 * Depoda ikisi de kullanılıyor ve ikisi de doğru:
 *
 *   1. OPT-IN — animasyon yalnızca `(prefers-reduced-motion: no-preference)`
 *      içinde tanımlanır. En güçlüsü: azaltılmış harekette kural HİÇ
 *      kurulmaz. `BleachHero` ve `Senkaimon` böyle.
 *   2. GERİ ALMA — animasyon dışarıda tanımlanır, `(reduce)` bloğu
 *      `animation-name: none` / `transition: none` ile geri alır.
 *      `HollowEvolution`, `SoulHierarchy`, `StoryTimeline` böyle.
 *
 * ⚠️ Betik hangi seçicinin geri alındığını DOĞRULAMIYOR — CSS'i gerçekten
 * çözmek gerekirdi. Denetlediği şey daha kaba ama regresyonu yakalayan
 * şey: "animasyon var ama azaltılmış hareket hiç ele alınmamış".
 * Kural gevşetilirse yanlış güven verir; sıkılaştırmak isteyen önce
 * gerçek bir CSS çözümleyicisi getirmeli.
 *
 * Kullanım:  node scripts/check-bleach-motion.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "components/anime/bleach";
const problems = [];
const rows = [];

for (const name of readdirSync(DIR).filter((f) => f.endsWith(".module.css"))) {
  const text = readFileSync(join(DIR, name), "utf8");

  /* Yorum satırlarını at: açıklamalarda "animation" kelimesi geçiyor */
  const css = text.replace(/\/\*[\s\S]*?\*\//g, "");

  /* Bildirimleri ayır ve başlangıçlarına bak. Regex yerine `startsWith`:
     `animation:` ile `animation-timeline:` aranıyor, ikisi de bildirimin
     BAŞINDA duruyor ve bu biçim kaçış gerektirmiyor. */
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
