import {
  Archivo,
  Instrument_Serif,
  JetBrains_Mono,
  Noto_Sans_JP,
} from "next/font/google";

/**
 * SATORU GOJŌ · TİPOGRAFİ KAYDI — rotaya scope'lu.
 *
 * ── NEDEN KÖK DÜZENDE DEĞİL ──────────────────────────────────────────────
 * Sitenin diğer 13 ailesi `app/[locale]/layout.tsx` içinde kayıtlı, çünkü
 * kök düzen SİTENİN TAMAMINI sarıyor. Orada kayıtlı bir aile, o sayfaya hiç
 * girmeyecek ziyaretçinin HTML'ine de bir `<link>` yazma riski taşıyor —
 * ev kuralı bu yüzden "kanada özel aile ⇒ `preload: false`" (bkz. futbolcu
 * ikilisi ve Bleach dörtlüsü, layout.tsx dosya içi notlar).
 *
 * Bu modül o dengeyi hiç kurmak zorunda kalmıyor: `next/font` çağrısı
 * yalnızca BU rotanın modül grafiğinde olduğu için üretilen CSS de yalnızca
 * bu rotanın HTML'ine giriyor. Yani Archivo'yu `preload: true` yapmak
 * güvenli — bedelini yalnızca Gojō sayfasını açan kişi ödüyor. Aynı
 * gerekçe karakter sayfalarının statik rota klasörlerinin gerekçesiyle
 * birebir aynı (`lib/characters/experience-page.tsx` dosya başı).
 *
 * ⚠️ KÖK DÜZENE TEK SATIR EKLENMEDİ. Sözleşme: bu sayfa paylaşılan hiçbir
 * dosyaya dokunmuyor.
 *
 * ── INTER YENİDEN YÜKLENMİYOR ────────────────────────────────────────────
 * Gövde metni Inter. Aile kök düzende ZATEN kayıtlı (`--font-inter`,
 * layout.tsx) ve değişkeni `<html>` üzerinde duruyor, yani buradan
 * okunabiliyor. İkinci kez kaydetmek aynı dosyayı iki ayrı `@font-face`
 * adıyla indirtirdi.
 */

/**
 * Display — sayfadaki bütün dev başlıklar.
 *
 * `axes: ["wdth"]` ile değişken genişlik ekseni açık: brief'in istediği
 * "expanded / brutalist" his AYRI bir sıkıştırılmış aile yüklemeden,
 * tek dosyanın 100–125 genişlik aralığından geliyor. Ağırlık yazılmıyor —
 * değişken eksenli çağrıda `weight` vermek ekseni dondurur.
 *
 * Tek `preload: true` bu: hero'nun ilk boyamasında görünen yazı bu ailede
 * ve LCP hedefi < 2.5sn (BRIEF · performans bütçesi).
 */
export const gojoDisplay = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--gojo-font-display",
  display: "swap",
  preload: true,
});

/**
 * Veri / HUD — koordinatlar, sayaçlar, log blokları, etiketler.
 * İlk ekranda görünmüyor (sağ üst künye paneli hero'nun altında kalıyor),
 * bu yüzden preload kapalı.
 */
export const gojoMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--gojo-font-mono",
  display: "swap",
  preload: false,
});

/**
 * Aksan serifi — YALNIZCA P06, P07 ve P11.
 *
 * Brief'in "el yazısı font" talebi iptal edildi; onun yerine bu ailenin
 * italiği kullanılacak (P11 keşif notları). `style` ikisini birden
 * istiyor çünkü P11 italik, P06 düz kullanıyor.
 *
 * ⚠️ TÜRKÇE KAPSAMI ÖLÇÜLDÜ, tahmin edilmedi (`font-data.json`):
 * aile `latin` + `latin-ext` taşıyor ve `latin-ext` YAZILMAK ZORUNDA —
 * bu üç bölümde duygusal replikler Türkçe ve `ş/ğ/İ/ı` yalnızca ikinci
 * dilimde. Yazılmazsa harfler sessizce yedek aileden gelir. Aynı hata
 * Cinzel'de bir kez yapıldı ve 22 Ağustos 2026'da düzeltildi.
 */
export const gojoSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--gojo-font-serif",
  display: "swap",
  preload: false,
});

/**
 * Japonca — 領域展開 ve その眼は、すべてを見ている。
 *
 * ⚠️ `subsets` BİLEREK YAZILMADI. Brief "yalnızca kullanılan glif seti
 * subset edilerek" diyor; `next/font/google` glif düzeyinde subset
 * ETMİYOR. Ama liste verilmediğinde Google'ın unicode-range dilimli
 * CSS'ini alıyor ve tarayıcı SADECE sayfada geçen karakterleri içeren
 * dilimi indiriyor — pratikte istenen sonuç. Japon bir ailede subset
 * listelemek ya kanji'yi dışarıda bırakır ya da megabaytlık tek dosya
 * indirtir. Aynı desen sitede iki yerde daha kullanılıyor (Yuji Boku
 * logo karakteri, Shippori Mincho Bleach salonu).
 */
export const gojoJp = Noto_Sans_JP({
  weight: ["400", "700"],
  variable: "--gojo-font-jp",
  display: "swap",
  preload: false,
});

/** Dört ailenin değişken sınıfı — sayfa kökünde tek yerde uygulanır. */
export const GOJO_FONT_CLASS = [
  gojoDisplay.variable,
  gojoMono.variable,
  gojoSerif.variable,
  gojoJp.variable,
].join(" ");
