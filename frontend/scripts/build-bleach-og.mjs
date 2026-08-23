#!/usr/bin/env node
/**
 * BLEACH · PAYLAŞIM KARTINI ÜRET (1200×630) — P18-b.
 *
 * ── NEDEN ÜRETİLİYOR, ELLE ÇİZİLMİYOR ────────────────────────────────────
 * Brief "hero'nun dört-parçalı kompozisyonu" istiyor ve o kompozisyonun
 * bütün değerleri zaten kodda: dört kimlik kanjisi `BleachHero.tsx`te,
 * dört ruh rengi `globals.css`te, tipografi ölçeği `world.module.css`te.
 * Kartı elle çizmek o değerlerin ikinci bir kopyasını üretirdi ve palet
 * değişince kart sessizce yalan söylerdi.
 *
 * ── NEDEN STATİK PNG, `opengraph-image.tsx` DEĞİL ────────────────────────
 * `ImageResponse` fontu çalışma anında istiyor; sayfanın dört fontu
 * `next/font/google` ile woff2 olarak geliyor ve Satori woff2 okumuyor.
 * Sunucuda hangi fontun bulunacağına güvenmek yerine kart BİR KEZ burada
 * çiziliyor, PNG depoya giriyor: her ortamda aynı görüntü.
 *
 * ⚠️ Bu betik `pnpm check:bleach`in parçası DEĞİL — çıktı depoda duruyor.
 * Palet ya da kimlikler değişirse elle koştur:
 *     node scripts/build-bleach-og.mjs
 *
 * ⚠️ METİN SİSTEM FONTUYLA çiziliyor (librsvg/pango). Sayfanın Jost'u
 * kurulu değil; en yakın duran "Segoe UI Light" seçildi — ince, geniş
 * aralıklı, Bleach'in sesine uyuyor. Kanji için Yu Gothic. Çıktı depoda
 * durduğu için bu seçim ÜRETİM ANINDA donuyor, sunucuyu ilgilendirmiyor.
 *
 * ⚠️ KİMLİK ADLARI YAZILMADI, yalnızca kanji. Kart iki dilde de aynı
 * dosya ve "İnsan"/"Human" tek karta sığmazdı; kanji zaten çevrilmiyor
 * (karar 2) ve sayfanın görsel dili kanji öncelikli.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const OUT = "public/og/bleach.png";

/* globals.css `[data-world="bleach"]` — DEĞİŞİRSE BURASI DA DEĞİŞMELİ */
const VOID = "#07070A";
const BONE = "#E9E4D9";
const ASH = "#88857E";
const SECONDARY = "#9A968E";
const HAIRLINE = "rgba(233,228,217,0.14)";

/* BleachHero.tsx `IDENTITIES` + globals.css `--soul-*` */
const IDENTITIES = [
  { kanji: "死神", color: "#BA1B23" },
  { kanji: "虚", color: "#EFEDE7" },
  { kanji: "滅却師", color: "#8FB8D6" },
  { kanji: "人間", color: "#8E8B84" },
];

const SANS = "Segoe UI Light, Century Gothic, Arial";
const CJK = "Yu Gothic, Meiryo, MS Gothic";

const band = W / IDENTITIES.length;

const gradients = IDENTITIES.map(
  (id, i) => `
    <linearGradient id="band${i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${id.color}" stop-opacity="0"/>
      <stop offset="62%" stop-color="${id.color}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${id.color}" stop-opacity="0.20"/>
    </linearGradient>`,
).join("");

const bands = IDENTITIES.map(
  (id, i) => `
    <rect x="${i * band}" y="0" width="${band}" height="${H}" fill="url(#band${i})"/>
    ${i > 0 ? `<rect x="${i * band}" y="0" width="1" height="${H}" fill="${HAIRLINE}"/>` : ""}
    <text x="${i * band + band / 2}" y="${H - 84}" font-family="${CJK}" font-size="40"
          fill="${id.color}" fill-opacity="0.92" text-anchor="middle">${id.kanji}</text>`,
).join("");

/* ⚠️ GARGANTA YARIĞI DENENDİ, ÇIKARILDI. Hero'daki çatlağı okutan şey
   uzunluğu ve hareketi; 1200×630'luk durağan bir kartta aynı path önce
   "BLEACH"in içinden geçen bir leke, alt yarıya alınınca da bir dizi
   siyah boncuk oldu. Kompozisyonu dört bant, saç teli ayraçlar ve
   boşluk taşıyor — yarık olmadan daha sessiz ve daha Bleach. */

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${gradients}</defs>
  <rect width="${W}" height="${H}" fill="${VOID}"/>
  ${bands}

  <text x="${W / 2}" y="150" font-family="${SANS}" font-size="19" letter-spacing="11"
        fill="${ASH}" text-anchor="middle">EVERY SOUL LEAVES A SHADOW</text>

  <text x="${W / 2}" y="300" font-family="${SANS}" font-size="132" letter-spacing="30"
        fill="${BONE}" text-anchor="middle">BLEACH</text>

  <rect x="${W / 2 - 260}" y="346" width="520" height="1" fill="${HAIRLINE}"/>

  <text x="${W / 2}" y="396" font-family="${SANS}" font-size="22" letter-spacing="14"
        fill="${SECONDARY}" text-anchor="middle">THE CYCLE OF SOULS</text>

  <text x="48" y="56" font-family="${SANS}" font-size="16" letter-spacing="9"
        fill="${ASH}">KURONEXUS</text>
</svg>`;

mkdirSync(dirname(OUT), { recursive: true });
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(OUT, png);
const meta = await sharp(png).metadata();
console.log(`✓ ${OUT} — ${meta.width}×${meta.height}, ${(png.length / 1024).toFixed(1)}KB`);
