import type { MakiGlyphShape } from "@/lib/characters/maki-zenin-experience";

/**
 * Maki Zen'in sayfasının elle çizilmiş SVG'leri — SUNUCU bileşeni.
 *
 * `"use client"` YOK ve olmamalı: burada durum yok, yalnızca `path` var.
 * Sayfanın istemci adaları (RestrictionShell, WeaponRack) bu dosyadan
 * ÇİZİLMİŞ eleman alıyor, bileşeni değil — böylece siluetlerin hiçbiri
 * istemci paketine inmiyor.
 *
 * ── NEDEN SVG, NEDEN RASTER DEĞİL ────────────────────────────────────────
 * Faz 2 §3: sahne/alet görselleri ÜRETİLMİYOR. Her alet hücresinin bir
 * `mki:` ABILITY yuvası var ve bugün hepsi boş; hücre görselsiz kalınca
 * boş bir kutuya düşmesin diye siluet elle çizildi. Küratör bir kare
 * yüklerse siluetin yerini o alıyor.
 *
 * ── KLAN MÜHRÜ SORUMLULUK NOTU ───────────────────────────────────────────
 * `ZeninSeal` Zen'in klanının GERÇEK armasının kopyası DEĞİL — arşivin
 * kendi soyut mührü: altıgen kabuk, üç yatay kural çizgisi, bir dikey eksen.
 * Üstünde bir X var ve X'in anlamı sayfanın konusu: reddediliş. Filigran
 * `aria-hidden`, yani ekran okuyucu onu hiç görmüyor.
 */

/* ── Zen'in mührü + üstündeki X ─────────────────────────────────────────── */

export function ZeninSeal({
  className,
  sealClassName,
  strikeClassName,
}: {
  className?: string;
  sealClassName?: string;
  strikeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g className={sealClassName} fill="none" strokeLinejoin="miter">
        {/* dış altıgen kabuk */}
        <path d="M120 12 L214 66 L214 174 L120 228 L26 174 L26 66 Z" />
        {/* iç altıgen */}
        <path d="M120 46 L185 84 L185 156 L120 194 L55 156 L55 84 Z" />
        {/* üç yatay kural çizgisi — klan hiyerarşisi */}
        <path d="M78 98 H162 M78 120 H162 M78 142 H162" />
        {/* dikey eksen */}
        <path d="M120 74 V166" />
        {/* köşe çentikleri */}
        <path d="M26 66 L44 76 M214 66 L196 76 M26 174 L44 164 M214 174 L196 164" />
      </g>
      {/* REDDEDİLİŞ: mührün üstüne çizilen X */}
      <g className={strikeClassName} fill="none" strokeLinecap="square">
        <path d="M22 22 L218 218" />
        <path d="M218 22 L22 218" />
      </g>
    </svg>
  );
}

/* ── Raf kuralı: çentikli yatay çizgi ───────────────────────────────────── */

export function RackRule({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 16"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g className={lineClassName} fill="none" strokeLinecap="butt">
        <path d="M0 8 H480" />
        <path d="M0 2 V14 M60 4 V12 M120 2 V14 M180 4 V12 M240 2 V14 M300 4 V12 M360 2 V14 M420 4 V12 M479 2 V14" />
      </g>
    </svg>
  );
}

/* ── Alet siluetleri ────────────────────────────────────────────────────── */

/**
 * Altı biçim, tek viewBox (0 0 160 72). Hepsi konturla çizili, dolgusuz:
 * hücrenin kendisi zaten bir kutu, siluetin ikinci bir kutu olması gerekmiyor.
 */
const TOOL_PATHS: Record<MakiGlyphShape, readonly string[]> = {
  /* 遊雲 — üç bölmeli asa: üç gövde, iki halka bağlantı */
  staff: [
    "M8 36 H50",
    "M62 36 H98",
    "M110 36 H152",
    "M8 30 V42 M50 31 V41 M62 31 V41 M98 31 V41 M110 31 V41 M152 30 V42",
    "M50 36 h6 M98 36 h6",
  ],
  /* 龍骨 — ağır omurga: kalın gövde + omur çentikleri */
  bone: [
    "M14 36 H146",
    "M26 26 V46 M44 24 V48 M62 26 V46 M80 24 V48 M98 26 V46 M116 24 V48 M134 26 V46",
    "M14 30 L6 36 L14 42 Z",
    "M146 28 L156 36 L146 44",
  ],
  /* 薙刀 — uzun sap + kavisli tek ağız */
  naginata: [
    "M6 52 L96 30",
    "M96 30 L104 28",
    "M104 28 C122 20 140 16 154 18 C142 26 126 34 106 40 Z",
    "M92 26 V38",
    "M16 46 V56 M34 42 V52",
  ],
  /* 刀 — kavisli ağız, balçak, kabza */
  katana: [
    "M18 52 H44",
    "M44 46 V58",
    "M48 52 C74 50 106 40 148 22",
    "M48 52 C76 56 108 48 148 30",
    "M148 22 L154 26 L148 30",
    "M22 48 V56 M32 48 V56",
  ],
  /* 眼鏡 — iki cam, köprü, iki sap */
  glasses: [
    "M30 36 h34 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 h-34 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6 z",
    "M96 36 h34 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 h-34 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6 z",
    "M70 42 H90",
    "M24 40 L8 30",
    "M136 40 L152 30",
  ],
  /* 拳 — kapalı el: gövde, dört boğum, başparmak */
  fist: [
    "M44 22 h64 a16 16 0 0 1 16 16 v14 a16 16 0 0 1 -16 16 h-64 a16 16 0 0 1 -16 -16 v-14 a16 16 0 0 1 16 -16 z",
    "M60 22 V38 M78 22 V38 M96 22 V38",
    "M28 40 L14 46 L20 58 L30 56",
    "M44 52 H124",
  ],
};

export function ToolGlyph({
  shape,
  className,
  strokeClassName,
}: {
  shape: MakiGlyphShape;
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 72"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g
        className={strokeClassName}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {TOOL_PATHS[shape].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
