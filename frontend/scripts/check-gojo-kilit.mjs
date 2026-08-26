#!/usr/bin/env node
/**
 * GOJŌ SAYFASI · SCROLL KİLİDİ GÜVENLİK DENETİMİ.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Sayfada tek bir scroll hijack var (P03 · Infinity Scroll) ve hareket
 * sözleşmesi ona yedi şart koşuyor. Bu şartların hepsi "kullanıcı sayfada
 * kilitli kalmasın" etrafında dönüyor — yani ihlalin bedeli bozuk bir görsel
 * değil, ERİŞİLEMEZ bir sayfa.
 *
 * Davranışsal test mümkün olmadı: kilit `IntersectionObserver` ile
 * tetikleniyor ve geliştirme ortamındaki tarayıcı paneli kare üretmediği
 * için ne `IntersectionObserver` ne de `requestAnimationFrame` çalışıyor
 * (ölçüldü, 26 Ağustos 2026). Bu betik onun yerine KAYNAĞI denetliyor:
 * tehlikeli desenlerin yokluğunu ve güvenlik ağlarının varlığını.
 *
 * ⚠️ Statik denetim davranışın kanıtı DEĞİL. Kilidin gerçekten kırıldığı
 * canlıda doğrulanmalı. Bu betik yalnızca bilinen tehlikeli desenlerin
 * geri gelmesini engelliyor.
 *
 * Kullanım:  node scripts/check-gojo-kilit.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "components/character/satoru-gojou";
const LOCK_FILE = join(DIR, "InfinityScroll.tsx");

const hatalar = [];
const bildir = (kosul, mesaj) => {
  if (!kosul) hatalar.push(mesaj);
};

const src = readFileSync(LOCK_FILE, "utf8");
/* Yorumları çıkar: bir kuralın YORUMDA geçmesi onu sağlamıyor. */
const kod = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

/* ── ŞART 2 · SÜRE TAVANI ───────────────────────────────────────────── */
const sayi = (ad) => {
  const m = kod.match(new RegExp(`const\\s+${ad}\\s*=\\s*(\\d+)`));
  return m ? Number(m[1]) : null;
};
const LOCK_MS = sayi("LOCK_MS");
const HARD_MS = sayi("HARD_MS");

bildir(LOCK_MS !== null, "LOCK_MS sabiti bulunamadi");
bildir(HARD_MS !== null, "HARD_MS sabiti bulunamadi");
bildir(
  HARD_MS !== null && HARD_MS <= 1500,
  `HARD_MS ${HARD_MS}ms — hareket sozlesmesi tavani 1500ms`,
);
bildir(
  LOCK_MS !== null && HARD_MS !== null && LOCK_MS <= HARD_MS,
  `LOCK_MS (${LOCK_MS}) HARD_MS'i (${HARD_MS}) asiyor — sert tavan islevsiz`,
);

/* ── ŞART 1 · OTURUM BASINA BIR KEZ ─────────────────────────────────── */
bildir(
  /sessionStorage\.setItem\(\s*ONCE_KEY/.test(kod),
  "Oturum bayragi yazilmiyor — kilit tekrar tetiklenebilir",
);
/* Bayrak, kilit kurulumundan ONCE yazilmali: kurulum patlarsa bile
   efekt bir daha calismamali. */
const bayrakYeri = kod.search(/sessionStorage\.setItem\(\s*ONCE_KEY/);
const wheelYeri = kod.search(/addEventListener\(\s*"wheel"/);
bildir(
  bayrakYeri >= 0 && wheelYeri >= 0 && bayrakYeri < wheelYeri,
  "Oturum bayragi kilit kurulumundan SONRA yaziliyor — kurulum hatasinda tekrar tetiklenir",
);

/* ── ŞART 3 · Esc ANINDA KIRAR ──────────────────────────────────────── */
bildir(
  /key\s*===\s*"Escape"/.test(kod) && /release\(\)/.test(kod),
  "Esc ile kirma yolu yok",
);

/* ── ŞART 4 ve 5 · DOKUNMATIK VE REDUCED-MOTION KAPILARI ────────────── */
bildir(
  /reducedMotion/.test(kod) && /coarsePointer/.test(kod),
  "reducedMotion / coarsePointer kapilari eksik",
);
bildir(
  /const\s+eligible\s*=\s*!reducedMotion\s*&&\s*!coarsePointer/.test(kod),
  "Kapilar tek bir 'eligible' kosulunda birlestirilmemis",
);
bildir(
  !/addEventListener\(\s*["']touchmove/.test(kod),
  "touchmove dinleniyor — dokunmatikte kilit HIC olmamali",
);

/* ── ŞART 6 · finally ILE SERBEST BIRAKMA ───────────────────────────── */
bildir(
  /\}\s*finally\s*\{/.test(kod),
  "Kurulum blogunda finally yok — hata durumunda kilit acik kalabilir",
);

/* ── ŞART 7 · TEMIZLIK ──────────────────────────────────────────────── */
bildir(
  /removeEventListener\(\s*"wheel"/.test(kod),
  "wheel dinleyicisi temizlikte kaldirilmiyor",
);
bildir(
  (kod.match(/clearTimeout\(/g) ?? []).length >= 2,
  "Iki zamanlayici da temizlenmiyor",
);

/* ── TEHLIKELI DESENLER · BUTUN KLASOR ──────────────────────────────── */
/* Duzeni degistirerek kilitlemek geri alinmasi gereken DURUM birakiyor;
   bir hata aninda kullanici gercekten kilitli kalabiliyor. Sayfada
   hicbir yerde kullanilmamali. */
const YASAK = [
  [/body\.style\.overflow/, "body.style.overflow — geri alinmasi gereken kilit durumu"],
  [/documentElement\.style\.overflow/, "documentElement.style.overflow — ayni risk"],
  [/body\.style\.position\s*=\s*["']fixed/, "body position:fixed kilidi"],
  [/style\.setProperty\(\s*["']overflow/, "overflow'un stil ozelligi olarak yazilmasi"],
];

for (const dosya of readdirSync(DIR).filter((f) => /\.tsx?$/.test(f))) {
  const govde = readFileSync(join(DIR, dosya), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  for (const [desen, mesaj] of YASAK) {
    bildir(!desen.test(govde), `${dosya}: ${mesaj}`);
  }
}

/* ── IMLEC ASLA GIZLENMEZ ───────────────────────────────────────────── */
const cssDosya = readdirSync(DIR).find((f) => f.endsWith(".module.css"));
if (cssDosya) {
  const css = readFileSync(join(DIR, cssDosya), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  bildir(
    !/cursor\s*:\s*none/.test(css),
    `${cssDosya}: cursor: none — imlec hicbir kosulda gizlenmemeli`,
  );
}

if (hatalar.length) {
  console.error("GOJO KILIT DENETIMI — HATA\n");
  for (const h of hatalar) console.error(`  ✗ ${h}`);
  console.error(
    `\n${hatalar.length} sorun. Hareket sozlesmesi kural 3: kullanici hicbir kosulda sayfada kilitli kalmamali.`,
  );
  process.exit(1);
}

console.log("GOJO KILIT DENETIMI — TEMIZ (7 sart + tehlikeli desenler)");
