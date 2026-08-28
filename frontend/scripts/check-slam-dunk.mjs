/**
 * SLAM DUNK EVRENİ — DENETİM BETİĞİ.
 *
 * Beş denetim, tek koşu:
 *   1. VERİ      kadro kayıtları, takım referansları, stat aralıkları
 *   2. İKİ DİL   her `Localized` alanının İngilizcesi var mı
 *   3. ÇAPA      skorbordun gösterdiği her bölüm sayfada gerçekten var mı
 *   4. HEX       palet dışına kaçmış renk var mı
 *   5. HAREKET   azaltılmış hareket kapısı yerinde mi
 *
 * ── NEDEN VERİYİ GERÇEKTEN İÇE AKTARIYOR ─────────────────────────────────
 * Bleach'in denetimleri kaynak dosyaları METİN olarak tarıyor ve bu, bir
 * regex'in yakalayamadığı her şeyi kaçırıyor. Node 24 TypeScript'i
 * kendiliğinden soyuyor (`--experimental-strip-types` 23.6'dan beri
 * varsayılan), yani veri modülleri doğrudan import edilebiliyor. Denetim
 * artık dizeleri değil DEĞERLERİ görüyor: bir oyuncunun statı 100'ü aşarsa
 * ya da bir takımın kaptanı kadroda yoksa betik bunu bilerek yakalıyor.
 *
 * ⚠️ Yalnızca metinle yapılabilen üç denetim (çapa, hex, hareket) kaynak
 * taramasında kaldı: onların konusu değer değil, dosyanın kendisi.
 *
 * Koşum: `npm run check:slam-dunk` (frontend dizininde)
 */
import { readFileSync, readdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS = join(ROOT, "components", "anime", "slam-dunk");

/**
 * TypeScript'in iki alışkanlığını Node'a çeviren çözümleyici.
 *
 * Node 24 TypeScript SÖZDİZİMİNİ soyuyor ama MODÜL ÇÖZÜMLEMESİNİ
 * değiştirmiyor: `./roster` (uzantısız) ve `@/lib/...` (takma ad) ikisi de
 * Node'un bilmediği biçimler. İkisini burada karşılıyoruz — alternatifi
 * veri dosyalarını denetim uğruna değiştirmekti ve o, üretim kodunu bir
 * betiğe göre eğmek olurdu.
 *
 * ⚠️ Takma ad `tsconfig.json`daki `paths` ile aynı olmalı: `@/*` → kök.
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return {
        shortCircuit: true,
        url: pathToFileURL(join(ROOT, specifier.slice(2) + ".ts")).href,
      };
    }
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const problems = [];
const fail = (check, message) => problems.push(`${check}: ${message}`);

const { ROSTER, ROSTER_BY_ID, teamStarters } = await import(
  "../lib/anime/slam-dunk/roster.ts"
);
const { TEAMS, TEAM_ORDER, RIVAL_ORDER } = await import(
  "../lib/anime/slam-dunk/teams.ts"
);
const { SLAM_DUNK_SLOTS, slotDef, playerSlotId, teamSlotId } = await import(
  "../lib/anime/slam-dunk/slots.ts"
);
const { SLAM_DUNK_ANCHORS } = await import(
  "../lib/anime/slam-dunk/anchors.ts"
);
const { QUARTER_SCORES } = await import(
  "../lib/anime/slam-dunk/scoreboard.ts"
);
const { STAT_KEYS, POSITIONS } = await import(
  "../lib/anime/slam-dunk/types.ts"
);

/* ══════════════════════════════════════════════════════════════════
   1 · VERİ
   ══════════════════════════════════════════════════════════════════ */

const ids = new Set();
for (const member of ROSTER) {
  if (ids.has(member.id)) fail("VERİ", `kimlik iki kez: ${member.id}`);
  ids.add(member.id);

  if (!TEAMS[member.team]) {
    fail("VERİ", `${member.id} tanınmayan takıma bağlı: ${member.team}`);
  }

  if (member.role === "player") {
    if (!member.stats) {
      fail("VERİ", `${member.id} oyuncu ama stat taşımıyor`);
    } else {
      for (const key of STAT_KEYS) {
        const value = member.stats[key];
        if (typeof value !== "number" || value < 0 || value > 100) {
          fail("VERİ", `${member.id}.${key} 0-100 dışında: ${value}`);
        }
      }
    }
    if (!POSITIONS.includes(member.position)) {
      fail("VERİ", `${member.id} geçersiz mevki: ${member.position}`);
    }
    if (member.number === null) {
      fail("VERİ", `${member.id} oyuncu ama forma numarası yok`);
    }
  } else {
    /* ⚠️ Bir koçu şut yüzdesiyle puanlamak veriyi uydurmak olurdu. */
    if (member.stats !== null) {
      fail("VERİ", `${member.id} oyuncu değil ama stat taşıyor`);
    }
  }

  /* Yuva kimlikleri `ROSTER`dan türetiliyor, yani ayrışamazlar — yine de
     denetleniyor: bir gün türetme bozulursa küratörün yüklediği kare
     SESSİZCE görünmez olur (Bleach'te ölçülmüş arıza sınıfı). */
  if (!slotDef(playerSlotId(member.id))) {
    fail("VERİ", `${member.id} için küratör yuvası yok`);
  }
}

if (ROSTER.length !== ids.size) fail("VERİ", "kimlik sayımı tutmuyor");

for (const id of TEAM_ORDER) {
  const team = TEAMS[id];
  for (const [role, memberId] of [
    ["kaptan", team.captain],
    ["koç", team.coach],
  ]) {
    const member = ROSTER_BY_ID[memberId];
    if (!member) {
      fail("VERİ", `${id} takımının ${role}ı kadroda yok: ${memberId}`);
    } else if (member.team !== id) {
      fail("VERİ", `${id} takımının ${role}ı başka takımda: ${memberId}`);
    }
  }

  const starters = teamStarters(id);
  if (starters.length !== 5) {
    fail("VERİ", `${id} ilk beşi beş kişi değil: ${starters.length}`);
  }
  const positions = new Set(starters.map((m) => m.position));
  if (positions.size !== 5) {
    fail(
      "VERİ",
      `${id} ilk beşinde mevki tekrarı var: ${starters.map((m) => m.position).join(",")}`,
    );
  }

  if (!slotDef(teamSlotId(id))) fail("VERİ", `${id} takım bandı yuvası yok`);

  /* Shohoku ev sahibi: kendisiyle oynamıyor. Diğer dördünde skor ZORUNLU —
     skorbord ve rakip paneli ikisi de onu okuyor. */
  if (id === "shohoku") {
    if (team.clash !== null) fail("VERİ", "Shohoku kendisiyle eşleşmiş");
  } else if (!team.clash || !/^\d+-\d+$/.test(team.clash.score)) {
    fail("VERİ", `${id} skoru okunmuyor: ${team.clash?.score}`);
  }
}

if (RIVAL_ORDER.includes("shohoku")) {
  fail("VERİ", "Shohoku rakip listesinde — ev sahibi seçilebilir olmamalı");
}

/* Skorbordun her satırı gerçek bir çapaya bakmalı. */
const anchorIds = SLAM_DUNK_ANCHORS.map((a) => a.anchor);
for (const score of QUARTER_SCORES) {
  if (!anchorIds.includes(score.anchor)) {
    fail("VERİ", `skorbord tanınmayan çapa okuyor: ${score.anchor}`);
  }
}

/* ══════════════════════════════════════════════════════════════════
   2 · İKİ DİL

   Yarım çeviri sayfayı BOŞALTMIYOR (`pick` `tr`ye düşüyor) — tam olarak
   bu yüzden tehlikeli: İngilizce sayfa Türkçe çizilir ve kimse fark
   etmez. Bleach'te iki kez oldu ve ikisi de denetimle yakalandı.
   ══════════════════════════════════════════════════════════════════ */

/** `{ tr: "...", en?: "..." }` şeklindeki her düğümü bul ve `en`ini denetle. */
function walk(node, path) {
  if (node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  const keys = Object.keys(node);
  if (typeof node.tr === "string" && keys.length <= 2 && keys.includes("tr")) {
    if (typeof node.en !== "string" || node.en.trim() === "") {
      fail("İKİ DİL", `${path} İngilizcesi yok: "${node.tr.slice(0, 46)}…"`);
    } else if (node.en === node.tr && node.tr.split(/\s+/).length > 6) {
      /* İkinci, DAHA ZAYIF denetim: iki dilde birebir aynı uzun bir cümle
         çevrilmemiş demektir.
         ⚠️ Ölçü karakter değil KELİME sayısı. Karakterle ölçüldüğünde
         "Hanamichi Sakuragi · Shohoku" gibi tamamı ÖZEL ADDAN oluşan yuva
         etiketleri yanlış alarm veriyordu — onların iki dilde aynı olması
         doğru olan. Altı kelimenin üstü artık cümle sayılıyor.
         Kısa ve gerçekten çevrilmemiş bir dize bu denetimden kaçabilir;
         asıl bekçi yukarıdaki "İngilizcesi yok" denetimi. */
      fail("İKİ DİL", `${path} çevrilmemiş: "${node.tr.slice(0, 46)}…"`);
    }
    return;
  }
  for (const key of keys) walk(node[key], `${path}.${key}`);
}

walk(ROSTER, "ROSTER");
walk(TEAMS, "TEAMS");
walk(SLAM_DUNK_SLOTS, "SLOTS");

/* Sözlüğün iki dili de aynı iskeleti taşımalı. */
const tr = JSON.parse(readFileSync(join(ROOT, "messages", "tr.json"), "utf8"));
const en = JSON.parse(readFileSync(join(ROOT, "messages", "en.json"), "utf8"));

function compareShape(a, b, path) {
  for (const key of Object.keys(a)) {
    if (!(key in b)) {
      fail("İKİ DİL", `sözlükte eksik: en.${path}.${key}`);
      continue;
    }
    if (typeof a[key] === "object" && a[key] !== null) {
      compareShape(a[key], b[key], `${path}.${key}`);
    }
  }
}
compareShape(tr.slamDunk, en.slamDunk, "slamDunk");
compareShape(en.slamDunk, tr.slamDunk, "slamDunk");

/* ══════════════════════════════════════════════════════════════════
   3 · ÇAPA

   ⚠️ ÖLÜ ÇAPA YASAK. Skorbord `#matchup`a bağlanıyorsa sayfada
   `id="matchup"` GERÇEKTEN olmalı; yoksa menü ziyaretçiyi sayfanın
   başına fırlatır ve hata sessiz olur.
   ══════════════════════════════════════════════════════════════════ */

const sources = readdirSync(COMPONENTS)
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => readFileSync(join(COMPONENTS, name), "utf8"))
  .join("\n");

for (const { anchor } of SLAM_DUNK_ANCHORS) {
  if (!sources.includes(`id="${anchor}"`)) {
    fail("ÇAPA", `sayfada karşılığı yok: #${anchor}`);
  }
}

/* ══════════════════════════════════════════════════════════════════
   3b · ULAŞILABİLİR KALEM

   ⚠️ ÖLÇÜLMÜŞ ARIZA (kullanıcı bildirimi, 28 Ağustos 2026). Arka plan
   kadrajları `pointer-events: none` + `z-index: -1` taşıyan dekoratif
   sarmalayıcıların içinde duruyor; kalem oraya konunca küratör hiçbir
   bölümün arka plan görselini DEĞİŞTİREMİYORDU. Tıklama sessizce hiçbir
   yere gitmiyordu — ne hata, ne uyarı.

   Kural: bir `<CourtImage>` `noEdit` ile çiziliyorsa (kalemi bastırılmış),
   AYNI dosyada aynı yuva için bir `<CourtSlotPen>` olmak ZORUNDA. Yoksa
   o yuva küratör için erişilemez demektir.
   ══════════════════════════════════════════════════════════════════ */

/** `<CourtImage … slotId={X} … />` bloğundan yuva ifadesini çek. */
function slotTokens(source, tag) {
  const out = [];
  for (const chunk of source.split(`<${tag}`).slice(1)) {
    const block = chunk.slice(0, chunk.indexOf("/>") + 1);
    const m = block.match(/slotId=(?:\{([^}]+)\}|"([^"]+)")/);
    if (m) out.push({ slot: (m[1] ?? m[2]).trim(), noEdit: /\bnoEdit\b/.test(block) });
  }
  return out;
}

for (const name of readdirSync(COMPONENTS).filter((n) => n.endsWith(".tsx"))) {
  const source = readFileSync(join(COMPONENTS, name), "utf8");
  if (!source.includes("<CourtImage")) continue;

  const pens = new Set(slotTokens(source, "CourtSlotPen").map((p) => p.slot));
  for (const { slot, noEdit } of slotTokens(source, "CourtImage")) {
    if (noEdit && !pens.has(slot)) {
      fail(
        "KALEM",
        `${name}: ${slot} \`noEdit\` ile çiziliyor ama karşılığında <CourtSlotPen> yok — küratör o yuvaya erişemez`,
      );
    }
  }
}

/* ══════════════════════════════════════════════════════════════════
   4 · HEX

   Palet TEK dosyada (`court.module.css`). Başka bir modülde hex, iki
   yerde ayrışacak bir renk demek — karakter sayfası sisteminde öğrenilen
   ders, aynı bekçi.
   ══════════════════════════════════════════════════════════════════ */

const HEX = /#[0-9a-fA-F]{3,8}\b/g;

for (const name of readdirSync(COMPONENTS).filter((n) => n.endsWith(".css"))) {
  if (name === "court.module.css") continue; // paletin tek evi
  const css = readFileSync(join(COMPONENTS, name), "utf8")
    /* Veri URI'lerindeki `%23000` bir maske dolgusu, sayfanın rengi değil:
       maskede yalnızca alfa okunuyor ve renk hiçbir yerde görünmüyor. */
    .replace(/url\("data:[^"]*"\)/g, "url(data-uri)");
  const hits = css.match(HEX);
  if (hits) fail("HEX", `${name} palet dışına çıkmış: ${[...new Set(hits)].join(", ")}`);
}

/* Sayfanın kendi kabuğu da paletten okumalı. */
const pageCss = readFileSync(
  join(ROOT, "app", "[locale]", "anime", "slam-dunk", "page.module.css"),
  "utf8",
);
if (pageCss.match(HEX)) fail("HEX", "page.module.css palet dışına çıkmış");

/* ══════════════════════════════════════════════════════════════════
   4b · EFEKT KATMANI İÇERİĞİ GİZLEMEZ

   ⚠️ ÖLÇÜLMÜŞ ARIZA (kullanıcı bildirimi, 28 Ağustos 2026). Miyagi'nin
   şimşek halkası, dönen gradyanın üstüne OPAK bir iç dikdörtgen konarak
   yapılıyordu; o dikdörtgen `.fx` katmanındaydı, yani kadrajın ÜSTÜNDE.
   Hover'da kart açılıyor ve oyuncunun portresi kayboluyordu.

   Kural: `.fx` katmanındaki hiçbir kural sayfanın OPAK zemin
   değişkenlerini `background` olarak basamaz. Saydam katmanlar
   (`color-mix(… transparent)`, `mix-blend-mode`, maske, `box-shadow`)
   serbest — onlar altındakini gizlemiyor.
   ══════════════════════════════════════════════════════════════════ */

/* ⚠️ Yorumlar ÖNCE siliniyor: yoksa bir kuralın seçicisi olarak üstündeki
   yorum bloğu yakalanıyor ve rapor okunmaz oluyor (denetimin kendisi
   yazılırken görüldü). */
const cardCss = readFileSync(
  join(COMPONENTS, "PlayerCard.module.css"),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");
/** `.fx` icin yazilmis her kural blogunu ayikla. */
for (const match of cardCss.matchAll(/([^{}]*\.fx[^{}]*)\{([^}]*)\}/g)) {
  const [, selector, body] = match;
  const bg = body.match(/(?:^|[;\s])background(?:-image)?:\s*([^;]+)/);
  if (!bg) continue;
  /* Opak zemin: saydamlik uretmeyen bir ev degiskeni. `color-mix(...
     transparent)` ve `transparent` saydam oldugu icin serbest. */
  const opaque = /var\(--sd-bg[a-z-]*\)/.test(bg[1]) && !/transparent/.test(bg[1]);
  if (opaque) {
    fail(
      "EFEKT",
      `${selector.trim()} opak zemin basıyor (${bg[1].trim().slice(0, 40)}…) — kadrajın üstünü kapatır`,
    );
  }
}

/* ══════════════════════════════════════════════════════════════════
   5 · HAREKET

   Kapı TEK yerde (`court.module.css`) ve JS ile hareket eden iki ada
   kendi kapısını ayrıca taşımalı: CSS'te gizlemek yetmez, rAF döngüsü
   yine dönerdi.
   ══════════════════════════════════════════════════════════════════ */

const skin = readFileSync(join(COMPONENTS, "court.module.css"), "utf8");
if (!skin.includes("prefers-reduced-motion: reduce")) {
  fail("HAREKET", "court.module.css merkezî azaltılmış hareket kapısını kaybetmiş");
}

for (const name of ["ReactiveCourt.tsx", "BallCursor.tsx"]) {
  const source = readFileSync(join(COMPONENTS, name), "utf8");
  if (!source.includes("prefers-reduced-motion")) {
    fail("HAREKET", `${name} azaltılmış hareketi sormuyor — rAF döngüsü yine dönerdi`);
  }
}

/* ══════════════════════════════════════════════════════════════════
   RAPOR
   ══════════════════════════════════════════════════════════════════ */

const counts = {
  kadro: ROSTER.length,
  takım: TEAM_ORDER.length,
  yuva: SLAM_DUNK_SLOTS.length,
  çeyrek: SLAM_DUNK_ANCHORS.length,
};

if (problems.length === 0) {
  console.log(
    `✓ slam-dunk temiz — ${counts.kadro} kadro kaydı, ${counts.takım} takım, ${counts.yuva} yuva, ${counts.çeyrek} çeyrek`,
  );
  process.exit(0);
}

console.error(`✗ slam-dunk: ${problems.length} sorun`);
for (const problem of problems) console.error(`  · ${problem}`);
process.exit(1);
