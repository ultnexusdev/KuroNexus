#!/usr/bin/env node
/**
 * KARAKTER DENEYİM SAYFALARI · AYRIŞMA (şablon-kopyası avı).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * 25 Ağustos 2026'da beş JJK sayfası (Gojo/Megumi/Nobara/Nanami/Getō)
 * birbirinin neredeyse birebir kopyası çıktı ve kullanıcı tarafından
 * REDDEDİLDİ. Hepsi tsc'den, eslint'ten, `check:karakter`in dört
 * betiğinden de tertemiz geçmişti — çünkü hiçbiri "bu sayfa ötekiyle aynı
 * görünüyor" sorusunu ölçmüyor.
 *
 * Bu betik tam olarak onu ölçüyor. Kullanıcının tek numaralı şartı:
 * "rastgele iki sayfanın ekran görüntüsü yan yana konduğunda ortak bir
 * şablondan çıktıkları anlaşılmamalı."
 *
 * ── NE ÖLÇÜYOR ───────────────────────────────────────────────────────────
 * Her CSS modülünden altı eksende bir PARMAK İZİ çıkarıyor:
 *
 *   font     → modülün okuduğu var(--font-*) kümesi
 *   izgara   → grid-template-* değerleri + düzen sinyalleri (sticky,
 *              clip-path, columns, aspect-ratio…)
 *   hareket  → @keyframes GÖVDELERİNİN parmak izi (ad değil: "float"
 *              adını "drift"e çevirmek ayrışma sayılmaz)
 *   durum    → seçicilerde kullanılan [data-*] nitelik ADLARI (mod düğmesi)
 *   olcek    → başlık font-size clamp()/rem değerlerinin kümesi
 *   yapi     → en sık 40 "özellik:değer" çiftinin kümesi
 *
 * Sonra her çift için Jaccard benzerliği hesaplanıyor. Yüksek benzerlik
 * "aynı şablondan çıkmış" demek.
 *
 * ── EŞİKLER ──────────────────────────────────────────────────────────────
 * Bunlar mutlak doğrular değil, YAYINDAKİ sayfalardan kalibre edildi:
 * kabul edilmiş (farklı olduğu bilinen) sayfa çiftlerinin gerçek
 * benzerlikleri ölçülüp üstüne pay bırakıldı.
 *
 *   yapi benzerligi >= 0.62  VE  hareket benzerligi >= 0.55  → HATA
 *   yapi benzerligi >= 0.55                                   → uyarı
 *   font kumesi AYNI + durum niteligi AYNI + izgara AYNI      → HATA
 *
 * Tek bir eksende benzeşmek sorun değil (iki sayfa aynı fontu farklı
 * ölçekte kullanabilir); ÜÇ eksende birden benzeşmek şablon demektir.
 *
 * Kullanım:  node scripts/check-karakter-ayrisma.mjs [--detay]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "components/character";
const DETAY = process.argv.includes("--detay");

/** Yorumlar ölçüme girmez — bir notu değiştirmek ayrışma değildir. */
const yorumSil = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Deri bloğu (palet) ayrı ölçülüyor (check-karakter-kontrast), burada dışarıda. */
function deriSil(css) {
  let out = css;
  for (;;) {
    const m = out.match(/\.page\[data-world="[\w-]+"\](\[data-\w+="\w+"\])?\s*\{/);
    if (!m) break;
    const son = out.indexOf("\n}", m.index);
    if (son < 0) break;
    out = out.slice(0, m.index) + out.slice(son + 2);
  }
  return out;
}

/** `prop: value;` çiftleri, boşluk normalize edilmiş. */
function bildirimler(css) {
  const out = [];
  for (const [, prop, value] of css.matchAll(/([-\w]+)\s*:\s*([^;{}]+);/g)) {
    out.push([prop.trim(), value.replace(/\s+/g, " ").trim()]);
  }
  return out;
}

/**
 * @keyframes GÖVDELERİNİN parmak izi.
 *
 * Adı değil içeriği alıyor: bir ajanın `pulse`u `throb` diye yeniden
 * adlandırması ayrışma değil. Duraklar (`0% { … }`) ve içlerindeki
 * özellik adları ölçülüyor; değerler değil, çünkü 12px ile 14px arasındaki
 * fark hareket dilini değiştirmiyor.
 */
function hareketIzi(css) {
  const set = new Set();
  const hepsi = [];
  /* ⚠️ Süslü parantez SAYARAK oku. İlk hâli `[\s\S]*?\n\s*\}` ile
     kesiyordu ve `from { … }`in kapanışına takılıp gövdeyi boş
     yakalıyordu — 41 modülün 41'inde de hareket parmak izi BOŞ çıktı,
     yani eksen hiç ölçülmüyordu (30 Ağustos 2026'da bulundu). */
  const re = /@keyframes\s+[\w-]+\s*\{/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    let derinlik = 1;
    let i = m.index + m[0].length;
    const bas = i;
    while (i < css.length && derinlik > 0) {
      if (css[i] === "{") derinlik += 1;
      else if (css[i] === "}") derinlik -= 1;
      i += 1;
    }
    const govde = css.slice(bas, i - 1);
    const duraklar = [...govde.matchAll(/([\d.]+%|from|to)\s*\{([^}]*)\}/g)];
    hepsi.push(duraklar.length);
    /* ⚠️ İKİ DURAKLI (from/to) animasyonlar parmak izine GİRMİYOR.
       Ölçüldü: choji'nin `from{rotate} to{rotate}`i ile obito'nunki,
       gaara'nın `from{translate,opacity} to{…}`i ile iruka'nınki
       birebir aynı imzayı veriyor ve üç yanlış alarm üretiyordu. Yavaş
       bir dönme ya da süzülme ORTAK BİR İLKEL, şablon kopyası değil.
       Kimlik taşıyan hareket üç ve daha fazla duraklı olandır. */
    if (duraklar.length < 3) {
      re.lastIndex = i;
      continue;
    }
    const imza = duraklar
      .map(([, durak, ic]) => {
        const props = [...ic.matchAll(/([-\w]+)\s*:/g)].map((x) => x[1]).sort();
        return durak + ":" + props.join(",");
      })
      .join("|");
    if (imza) set.add(imza);
    re.lastIndex = i;
  }
  set.toplamKeyframe = hepsi.length;
  return set;
}

/**
 * Hareketin VARLIĞI da bir sinyal.
 *
 * Reddedilen Faz 1 setinde ölçüldü: nobara / nanami / getō modüllerinde
 * `@keyframes` SIFIR, megumi'de bir tane — üstelik üçünün dosya boyutu
 * 3 KB aralığında. Itachi'de on, Gojo'da üç keyframe var. Yani "hiç
 * hareket yok" o beş sayfanın ortak imzasıydı ve yalnızca benzerlik
 * oranına bakan bir ölçüm bunu göremez: iki BOŞ küme birbirine benzemez,
 * çünkü Jaccard 0/0'ı 0 sayar.
 */
function hareketYok(iz) {
  return (iz.hareket.toplamKeyframe ?? 0) === 0;
}

function parmakIzi(css) {
  const temiz = deriSil(yorumSil(css));
  const decl = bildirimler(temiz);

  const font = new Set();
  for (const [, v] of decl) {
    for (const m of v.matchAll(/var\(--font-([\w-]+)\)/g)) font.add(m[1]);
  }

  const izgara = new Set();
  for (const [p, v] of decl) {
    if (/^grid-template/.test(p)) izgara.add(p + ":" + v);
    if (p === "display" && /grid|flex/.test(v)) izgara.add("display:" + v);
    if (p === "position" && v === "sticky") izgara.add("sticky");
    if (p === "clip-path") izgara.add("clip-path");
    if (p === "columns" || p === "column-count") izgara.add("columns");
    if (p === "aspect-ratio") izgara.add("aspect-ratio");
    if (p === "writing-mode") izgara.add("writing-mode:" + v);
    if (p === "mask-image" || p === "-webkit-mask-image") izgara.add("mask");
  }

  /* Mod düğmesinin niteliği — seçicilerdeki [data-*] adları */
  const durum = new Set();
  for (const m of temiz.matchAll(/\[data-([\w-]+)[\]=]/g)) {
    if (m[1] !== "world" && m[1] !== "curator-slot") durum.add(m[1]);
  }

  const olcek = new Set();
  for (const [p, v] of decl) {
    if (p === "font-size" && /clamp|rem/.test(v)) olcek.add(v);
  }

  /* Yapı: en sık 40 özellik:değer çifti — sayfanın "dokusu" */
  const sayim = new Map();
  for (const [p, v] of decl) {
    const k = p + ":" + v;
    sayim.set(k, (sayim.get(k) ?? 0) + 1);
  }
  const yapi = new Set(
    [...sayim.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([k]) => k),
  );

  return { font, izgara, hareket: hareketIzi(temiz), durum, olcek, yapi };
}

const jaccard = (a, b) => {
  if (a.size === 0 && b.size === 0) return 0;
  let kesisim = 0;
  for (const x of a) if (b.has(x)) kesisim += 1;
  return kesisim / (a.size + b.size - kesisim);
};

/* ── modülleri topla ──────────────────────────────────────────────────── */
const sayfalar = [];
for (const dir of readdirSync(BASE)) {
  if (dir.startsWith(".")) continue; // .deprecated
  const p = join(BASE, dir);
  if (!statSync(p).isDirectory()) continue;
  const file = readdirSync(p).find((f) => f.endsWith(".module.css"));
  if (!file) continue;
  sayfalar.push({ ad: dir, iz: parmakIzi(readFileSync(join(p, file), "utf8")) });
}

if (DETAY) {
  console.log("PARMAK IZLERI\n");
  for (const s of sayfalar) {
    console.log(
      `${s.ad.padEnd(24)} font=${[...s.iz.font].join("/") || "-"}` +
        `  durum=${[...s.iz.durum].join("/") || "-"}` +
        `  keyframe=${s.iz.hareket.size}  izgara=${s.iz.izgara.size}`,
    );
  }
  console.log("");
}

/* ── çiftleri ölç ─────────────────────────────────────────────────────── */
const hatalar = [];
const uyarilar = [];

for (let i = 0; i < sayfalar.length; i++) {
  for (let j = i + 1; j < sayfalar.length; j++) {
    const [a, b] = [sayfalar[i], sayfalar[j]];
    const yapi = jaccard(a.iz.yapi, b.iz.yapi);
    const hareket = jaccard(a.iz.hareket, b.iz.hareket);
    const font = jaccard(a.iz.font, b.iz.font);
    const izgara = jaccard(a.iz.izgara, b.iz.izgara);
    const durum = jaccard(a.iz.durum, b.iz.durum);

    const satir =
      `${a.ad} ~ ${b.ad} → yapi ${yapi.toFixed(2)} · hareket ${hareket.toFixed(2)}` +
      ` · font ${font.toFixed(2)} · izgara ${izgara.toFixed(2)} · durum ${durum.toFixed(2)}`;

    /* Üç eksende birden aynı olmak: kimlik yok demektir */
    const ucEksenAyni =
      font === 1 && durum === 1 && izgara >= 0.9 && a.iz.font.size > 0;

    /* İkisinde de hiç hareket yoksa "hareket dili" ekseni hiç
       kullanılmamış demektir — Jaccard bunu 0 (ayrı) sanır, oysa ortak
       bir EKSİKLİK. Yapı da benzeşiyorsa bu tam olarak Faz 1'in imzası. */
    const ikisiDeHareketsiz = hareketYok(a.iz) && hareketYok(b.iz);

    if (
      (yapi >= 0.62 && hareket >= 0.55) ||
      ucEksenAyni ||
      (ikisiDeHareketsiz && yapi >= 0.6)
    ) {
      hatalar.push(
        satir +
          (ucEksenAyni ? "  ← font+durum+izgara AYNI" : "") +
          (ikisiDeHareketsiz ? "  ← IKISINDE DE @keyframes YOK" : ""),
      );
    } else if (yapi >= 0.55 || (ikisiDeHareketsiz && yapi >= 0.5)) {
      uyarilar.push(satir + (ikisiDeHareketsiz ? "  (ikisi de hareketsiz)" : ""));
    }
  }
}

if (uyarilar.length) {
  console.log("Yakin cift (kabul edilebilir, kalan eksenler ayrisiyorsa):");
  for (const u of uyarilar) console.log(`  · ${u}`);
  console.log("");
}

if (hatalar.length) {
  console.error("KARAKTER AYRISMA DENETIMI — HATA\n");
  for (const h of hatalar) console.error(`  ✗ ${h}`);
  console.error(
    `\n${hatalar.length} cift ayni sablondan cikmis gorunuyor.\n` +
      `Kullanicinin tek numarali sarti: iki sayfa yan yana konuldugunda ortak\n` +
      `bir sablondan ciktiklari ANLASILMAMALI. Ayrisma eksenlerinden en az\n` +
      `dordunu gercekten degistir (izgara, tipografi, hareket, palet, dugme, filigran).`,
  );
  process.exit(1);
}

console.log(
  `KARAKTER AYRISMA DENETIMI — TEMIZ (${sayfalar.length} sayfa, ` +
    `${(sayfalar.length * (sayfalar.length - 1)) / 2} cift olculdu)`,
);
