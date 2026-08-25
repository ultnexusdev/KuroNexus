#!/usr/bin/env node
/**
 * KARAKTER DENEYİM SAYFALARI · KONTRAST VE PALET AYRIKLIĞI.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * 36 karakterin 37 ayrı paleti var ve her biri kendi CSS modülünde duruyor.
 * İki risk var, ikisi de gözle yakalanmaz:
 *
 *   1. Yeni bir palet elle yazılırken bir tonun okunmaz kalması. Metin
 *      sayfanın yalnızca bir bölümünde soluk görünür, gözden kaçar.
 *   2. Yeni accent'in mevcut 36'dan birine çok yakın düşmesi. Tek tek
 *      bakıldığında fark edilmez; sayfalar yan yana konduğunda "hepsi aynı"
 *      hissi tam olarak buradan doğar.
 *
 * Betik değerleri modüllerden OKUYOR, kendi kopyasını tutmuyor: tek doğruluk
 * kaynağı CSS (kural 16). Palet orada değişirse denetim yeni değeri ölçer.
 *
 * Eşikler (`check-bleach-contrast.mjs` ile aynı aile):
 *   --text-primary   → AAA (7:1)   bg + surface üzerinde
 *   --text-secondary → AA  (4.5:1) bg + surface + surface-hover üzerinde
 *   --text-muted     → AA  (4.5:1) bg + surface + surface-hover üzerinde
 *   --accent         → 3:1 bg + surface üzerinde
 *   --accent-hover   → AA  (4.5:1) surface üzerinde
 *   --gold           → AA  (4.5:1) surface üzerinde
 *   `--<önek>-…-text` → AA (4.5:1) surface + surface-hover üzerinde
 *
 * ⚠️ YARDIMCI AİLENİN GERİ KALANI ÖLÇÜLMÜYOR — bilerek. O token'lar METİN
 * DEĞİL MALZEME: `--sas-amaterasu` kara alevin gövdesi, `--shk-shadow` gölge,
 * `--vsl-mark` yüzdeki lanet çizgisi, `--sai-ink` mürekkep dolgusu. Hepsi
 * koyu olmak ZORUNDA; onları 4.5:1 ile ölçmek 50 yanlış alarm üretiyordu ve
 * gürültü bir denetimi işe yaramaz hâle getirir.
 *
 * Bunun karşılığı bir ADLANDIRMA SÖZLEŞMESİ: bir yardımcı renk küçük metinde
 * kullanılacaksa `-text` ekli bir kardeşi tanımlanır ve metin ONU okur
 * (emsal: `--ita-crimson-text`, `--sas-sharingan-text`, `--nrt-kurama-text`).
 * Yeni token yazarken bu eki unutmak, ölçümün dışında kalmak demektir.
 *
 * Accent ayrıklığı: iki accent arasındaki RGB uzaklığı 15'ten küçükse hata.
 * (Ölçüldü: 15 altı gerçekten ayırt edilemiyor; 15–20 arası zemin farklıysa
 * kabul edilebilir, o yüzden uyarı olarak listeleniyor.)
 *
 * Kullanım:  node scripts/check-karakter-kontrast.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "components/character";
const GLOBALS = readFileSync("styles/globals.css", "utf8");

/** Seçiciden sonraki ilk blokta geçen `--token: değer` çiftleri. */
function tokensOf(css, selector) {
  const at = css.indexOf(`${selector} {`);
  if (at < 0) return null;
  const body = css.slice(at, css.indexOf("\n}", at));
  const out = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    out[name] = value.split("/*")[0].trim();
  }
  return out;
}

/** Bütün dünyalar: modüllerdeki `.page[data-world=…]` + globals'taki itachi. */
function worlds() {
  const out = [];
  for (const dir of readdirSync(BASE)) {
    const p = join(BASE, dir);
    if (!statSync(p).isDirectory()) continue;
    const file = readdirSync(p).find((f) => f.endsWith(".module.css"));
    if (!file) continue;
    const css = readFileSync(join(p, file), "utf8");
    for (const [, slug] of css.matchAll(/\.page\[data-world="([\w-]+)"\]\s*\{/g)) {
      const t = tokensOf(css, `.page[data-world="${slug}"]`);
      if (t) out.push({ ad: slug, tokens: t, nerede: `${dir}/${file}` });
    }
    /* Kap sayfasının ikinci derisi: aynı ağaç, ikinci nitelik */
    const vessel = tokensOf(
      css,
      `.page[data-world="sukuna-itadori"][data-vessel="sukuna"]`,
    );
    if (vessel) {
      const taban = out.find((w) => w.ad === "sukuna-itadori");
      out.push({
        ad: "sukuna-itadori · sukuna",
        tokens: { ...(taban?.tokens ?? {}), ...vessel },
        nerede: `${dir}/${file}`,
      });
    }
  }
  /* Itachi'nin derisi globals.css'te kaldı (18 Ağustos emsali, dosyalarına
     dokunulmuyor) — denetim dışında bırakmak onu kör nokta yapardı. */
  const itachi = tokensOf(GLOBALS, '[data-world="itachi"]');
  if (itachi) out.push({ ad: "itachi", tokens: itachi, nerede: "globals.css" });
  return out;
}

const lin = (v) => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const L = (hex) => {
  const h = hex.replace("#", "");
  const p = (i) => parseInt(h.slice(i, i + 2), 16);
  return 0.2126 * lin(p(0)) + 0.7152 * lin(p(2)) + 0.0722 * lin(p(4));
};
const C = (a, b) => {
  const [x, y] = [L(a), L(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v);

const hatalar = [];
const uyarilar = [];
const accents = [];

for (const { ad, tokens: t, nerede } of worlds()) {
  const olc = (renk, zemin, esik, etiket) => {
    if (!isHex(renk) || !isHex(zemin)) return;
    const v = C(renk, zemin);
    if (v < esik) {
      hatalar.push(
        `${ad} (${nerede}) → ${etiket} = ${v.toFixed(2)} (en az ${esik})`,
      );
    }
  };
  const { bg, surface } = { bg: t.bg, surface: t.surface };
  const hover = t["surface-hover"];

  olc(t["text-primary"], bg, 7, "text-primary / bg");
  olc(t["text-primary"], surface, 7, "text-primary / surface");
  for (const ad2 of ["text-secondary", "text-muted"]) {
    olc(t[ad2], bg, 4.5, `${ad2} / bg`);
    olc(t[ad2], surface, 4.5, `${ad2} / surface`);
    olc(t[ad2], hover, 4.5, `${ad2} / surface-hover`);
  }
  olc(t.accent, bg, 3, "accent / bg");
  olc(t.accent, surface, 3, "accent / surface");
  olc(t["accent-hover"], surface, 4.5, "accent-hover / surface");
  olc(t.gold, surface, 4.5, "gold / surface");

  /* Yalnızca `-text` ekli yardımcılar: sözleşme gereği metin taşıyan tek
     aile onlar (gerekçe dosya başında). Geri kalan malzeme, ölçülmüyor. */
  for (const [name, value] of Object.entries(t)) {
    if (!name.endsWith("-text") || !isHex(value)) continue;
    olc(value, surface, 4.5, `--${name} / surface`);
    olc(value, hover, 4.5, `--${name} / surface-hover`);
  }

  if (isHex(t.accent)) accents.push({ ad, accent: t.accent });
}

/**
 * BİLEREK KABUL EDİLMİŞ YAKINLIKLAR.
 *
 * Bu iki sayfa ilk turdan (23 Ağustos 2026) geliyor ve accent'leri gerçekten
 * yakın. Zeminleri ve yapıları çok farklı olduğu için (Urahara sepya bir
 * dükkân + çekmece ızgarası, Jiraiya sıcak siyah bir el yazması + çevrilen
 * sayfalar) yan yana karışmıyorlar; yayındaki iki sayfayı kurcalamak yerine
 * karar kayda geçirildi. Yeni bir çift buraya EKLENMEDEN geçmemeli — liste
 * uzuyorsa palet düzeni gözden geçirilmeli.
 */
const KABUL_EDILEN = new Set(["jiraiya|kisuke-urahara"]);

/* Accent'ler birbirinden yeterince uzak mı */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
for (let i = 0; i < accents.length; i++) {
  for (let j = i + 1; j < accents.length; j++) {
    const [a, b] = [accents[i], accents[j]];
    if (a.ad.startsWith(b.ad) || b.ad.startsWith(a.ad)) continue; // kap sayfası
    if (KABUL_EDILEN.has([a.ad, b.ad].sort().join("|"))) continue;
    const d = Math.hypot(
      ...rgb(a.accent).map((v, k) => v - rgb(b.accent)[k]),
    );
    const satir = `${a.ad} (${a.accent}) ~ ${b.ad} (${b.accent}) — uzaklik ${d.toFixed(0)}`;
    if (d < 15) hatalar.push(`accent COK YAKIN: ${satir}`);
    else if (d < 20) uyarilar.push(satir);
  }
}

if (uyarilar.length) {
  console.log("Yakin accent'ler (kabul edilebilir, zeminler farkliysa):");
  for (const u of uyarilar) console.log(`  · ${u}`);
  console.log("");
}

if (hatalar.length) {
  console.error("KARAKTER KONTRAST DENETIMI — HATA\n");
  for (const h of hatalar) console.error(`  ✗ ${h}`);
  console.error(`\n${hatalar.length} sorun.`);
  process.exit(1);
}

console.log(
  `KARAKTER KONTRAST DENETIMI — TEMIZ (${accents.length} palet olculdu)`,
);
