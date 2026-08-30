import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  Yuji_Boku,
  Cinzel,
  Bebas_Neue,
  Petrona,
  Cormorant_Garamond,
  Corinthia,
  Noto_Sans_Old_Turkic,
  Anton,
  Inter,
  Shippori_Mincho_B1,
  Jost,
  Archivo_Black,
  UnifrakturMaguntia,
  IBM_Plex_Mono,
} from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { THEMES, DEFAULT_THEME, THEME_COOKIE, type Theme } from "@/lib/theme";
import "../../styles/globals.css";

// Logo'daki 黒 (kuro) için fırça kaligrafisi. Font unicode-range dilimli
// self-host edilir; tarayıcı yalnızca bu karakteri içeren dilimi indirir.
const brushFont = Yuji_Boku({
  weight: "400",
  variable: "--font-brush",
  display: "swap",
  preload: false,
});

// latin-ext 2026-08-22'de eklendi: Cinzel 46 dosyada Türkçe ETİKET fontu
// (İ/Ğ/Ş/Ç/Ö/Ü majüskülleri) ama yalnızca latin dilimi yükleniyordu — Türkçe
// glifler ikinci bir gecikmeli dilimden geliyordu. Diğer aileler zaten latin-ext.
const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cinzel",
  display: "swap",
});

// Spor kanadı: kondanse skor/numara yazısı (forma numaraları, F1 başlıkları)
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-bebas",
  display: "swap",
});

/*
 * Spor kanadının display serifi (8 Ağustos 2026).
 *
 * NEDEN YENİ BİR AİLE: spordaki büyük başlık işini bugün Bebas tutuyor, ama
 * Bebas kondanse bir sans — brief'in istediği "editorial, tarihsel, arşivsel"
 * ses onda yok. Evdeki üç serif de dolu: Cinzel 46 dosyada tracked-out majüskül
 * ETİKET fontu, Cormorant ~30 modülde gövde. Birini ödünç almak iki kanadı
 * birbirine karıştırırdı.
 *
 * Aynı commit'te Lora DÜŞÜRÜLDÜ: her sayfada preload'la iniyor ama yalnızca
 * PaginatedReader'da kullanılıyordu, üstelik Petrona'yla aynı türde (çağdaş,
 * ekran için çizilmiş metin serifi) olduğu için ikisi yan yana ayırt
 * edilemezdi. Okuma ekranı Petrona'ya devredildi → aile sayısı 7'de kaldı.
 *
 * NEDEN PETRONA: yedi aday üç ayrı mercekten (Türkçe/teknik, karakter, sistem
 * uyumu) değerlendirildi; oybirliği bunda çıktı. Belirleyici olan, paletteki
 * boşluğa oturması: ev bugün "kondanse kütle + tracked kapital + narin serif +
 * mono" taşıyor, boşta duran tek bölge GENİŞ ve DÜŞÜK-ORTA KONTRASTLI bölge.
 * İnce/yüksek kontrastlı adaylar (Instrument Serif, Libre Caslon) Cormorant'ın
 * bölgesine geri giriyordu, kondanse olanlar "Bebas'a tırnak takılmış hâli"ne.
 *
 * ⚠️ AĞIRLIK BANDI PAZARLIK KONUSU DEĞİL: Petrona'nın karakteri 700-900 arasında
 * yaşıyor. 400'de jenerik Times/Georgia bölgesine düşüyor — ölçüldü. Kural:
 * 2rem üstünde ASLA wght < 700. Optik boyut (opsz) ekseni YOK, yani font
 * büyüdükçe keskinleşmez; telafi ağırlık ve negatif tracking ile yapılır
 * (4rem üstü letter-spacing: -0.02em … -0.03em).
 *
 * ⚠️ SATIR YÜKSEKLİĞİ: spor modüllerindeki display leading'i 0.92 — o değer
 * Bebas'ın düz kapital kutusuna göre yazılmıştı. Türkçe diyakritikli bir serifte
 * (İ/Ğ/Ü üstte, Ş/Ç sedillası altta) aynı değer kırpma üretir. Bu fontu kullanan
 * her display kuralı line-height >= 1.02 istemeli; test dizesi "BEŞİKTAŞ IĞDIR".
 *
 * İtalik EKLENMEDİ: Petrona'da italik ayrı bir değişken dosya, ikinci bir indirme
 * demek. vietnamese alt kümesi de istenmedi. Ağırlık verilmiyor → değişken sürüm.
 */
const petrona = Petrona({
  subsets: ["latin", "latin-ext"],
  variable: "--font-petrona",
  display: "swap",
});

/*
 * Aşağıdaki üç font 5 Ağustos 2026'da `globals.css`teki `@import`tan buraya
 * taşındı. Eskiden doğrudan Google'dan çekiliyorlardı, yani **her ziyaretçinin
 * IP adresi Google'a gidiyordu**. Buradan self-host ediliyorlar: dış istek yok.
 */

// Gövde yazısı — kanatların çoğunda kullanılıyor (~30 CSS modülü).
// `fallback` eski `globals.css` tanımından korundu.
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Yalnızca hikâye metinlerinde, editörden seçilerek kullanılıyor →
// `preload: false`: ziyaretçilerin çoğu bu fontu hiç görmüyor.
const corinthia = Corinthia({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-corinthia",
  display: "swap",
  preload: false,
});

// Göktürk (Orhun) yazısı — nadir kullanılıyor, aynı gerekçeyle preload yok.
const orhun = Noto_Sans_Old_Turkic({
  weight: "400",
  subsets: ["old-turkic"],
  variable: "--font-orhun",
  display: "swap",
  preload: false,
});

/*
 * ── FUTBOLCU SAYFALARININ İKİLİSİ (20 Ağustos 2026) ──────────────────────
 *
 * Anton + Inter yalnızca `/spor/futbol/futbolcular/*` ağacında kullanılıyor.
 * İkisi de `preload: false`: ziyaretçilerin büyük çoğunluğu o sayfalara hiç
 * girmiyor, `<link rel=preload>` yazmak onlara bedava iki dosya indirtirdi.
 * `next/font` self-host ediyor — dış istek ve Google'a giden IP yok.
 *
 * NEDEN YENİ AİLE GEREKTİ: kanadın display sesi Petrona, editoryal bir serif.
 * Futbolcu sayfası bir arşiv künyesi değil, bir POSTER — istenen ses forma
 * numarası ve stadyum tabelası ağırlığında, sıkışık ve kapital. Petrona'yı
 * o boya çıkarmak karakterini bozuyor (ölçüldü: 900 ağırlıkta bile harf
 * aralıkları poster yoğunluğuna inmiyor). Anton tam olarak o iş için var.
 *
 * Inter ise gövde: kanadın geri kalanı Cormorant/sistem sansı kullanıyor ama
 * bu sayfada rakam yoğun künye satırları var ve Inter'in tabular rakamları
 * hizalı duruyor. Ağırlıklar 400/600/700 ile sınırlı — 8 ağırlıklı değişken
 * dosya bu sayfanın ihtiyacının çok üstünde.
 *
 * ⚠️ Bu ikili kanat ölçeğini EZMİYOR: `--font-anton` / `--font-inter` yalnızca
 * futbolcu sayfasının kendi CSS modüllerinden okunuyor. Spor kabuğu
 * (`layout.module.css`) ve diğer beş salon tek harfle bile etkilenmedi.
 */
const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
  preload: false,
});

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

/*
 * SALON 04 · BLEACH EVRENİ — dört aile (23 Ağustos 2026).
 *
 * ⚠️ DÖRDÜ DE `preload: false`. Yalnızca `/anime/bleach` altında
 * kullanılıyorlar ve kök düzen SİTENİN TAMAMINI sarıyor: preload açık
 * olsaydı ana sayfayı açan biri hiç görmeyeceği dört fontu indirirdi.
 * Brief "Jost'u preload et" diyor (hero'da kullanılıyor) ama o karar
 * Bleach'i tek başına bir site sanıyor; burada bedeli diğer altı salon
 * ödüyor. `display: swap` ile ilk boyama zaten engellenmiyor.
 *
 * ⚠️ TÜRKÇE KAPSAMI ÖLÇÜLDÜ, tahmin edilmedi (`font-data.json`):
 *   Shippori Mincho B1 → latin + latin-ext  ✅ Türkçe GÜVENLİ
 *   Jost               → latin + latin-ext  ✅ Türkçe GÜVENLİ
 *   Archivo Black      → latin + latin-ext  ✅ (zaten yalnız rakam)
 *   UnifrakturMaguntia → latin              ❌ ş/ğ/İ/ı YOK
 *
 * Yani brief'in uyarısı yalnızca SONUNCUSU için geçerli. Gotik aile
 * Wandenreich wordmark'ı ve Schrift harfleri dışında hiçbir yerde
 * kullanılmayacak; `scripts/check-bleach-fonts.mjs` bunu denetliyor.
 */

/* Ruh dünyasının mürekkep/hat sesi: bölüm başlıkları, karakter adları,
   卍 gibi tekil işaretler.

   `subsets` BİLİNÇLİ olarak yazılmadı — Yuji Boku ile aynı desen: liste
   verilmeyince next/font Google'ın unicode-range dilimli CSS'ini alıyor ve
   tarayıcı yalnızca sayfada geçen karakterlerin dilimini indiriyor. Japon
   bir ailede subset listelemek ya kanji'yi dışarıda bırakır ya da megabaytlık
   tek bir dosya indirtir. */
const shippori = Shippori_Mincho_B1({
  weight: ["600", "700"],
  variable: "--font-shippori",
  display: "swap",
  preload: false,
});

/* Sayfanın imza sesi: SADECE büyük harf, geniş harf aralığı. Eyebrow'lar,
   İngilizce alt başlıklar, "THE WORLD OF THE HOLLOW" gibi sinematik
   satırlar. Naruto'nun ağır blok başlıklarının tam tersi — zıtlık kasıtlı. */
const jost = Jost({
  weight: ["200", "300"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-jost",
  display: "swap",
  preload: false,
});

/* Espada numaraları ve Bölük rakamları için dev tipografik zemin.
   Yalnızca 0–9 basılıyor; ailenin geri kalanı hiç çizilmiyor. */
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-numeral",
  display: "swap",
  preload: false,
});

/* ⚠️ YALNIZCA Wandenreich wordmark'ı ve Schrift harfleri. Başka hiçbir
   yerde kullanma — aşırıya kaçarsa bölüm ucuzlar (brief). Ayrıca Türkçe
   diyakritikleri YOK: bu aileye Türkçe dize geçemez. */
const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gothic",
  display: "swap",
  preload: false,
});

/*
 * SALON 04 · JUJUTSU KAISEN EVRENİ — arşiv kayıt sesi (30 Ağustos 2026).
 *
 * Sayfanın tezi "Lanetli Arşiv": derece, durum, saat, koloni numarası gibi
 * her KAYIT alanı mono ile basılıyor — kod süsü değil, sicil dili. Yalnızca
 * `/anime/jujutsu-kaisen` altında kullanılıyor; `preload: false` gerekçesi
 * yukarıdaki dört Bleach ailesiyle aynı. latin-ext ✅ Türkçe GÜVENLİ.
 */
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-plexmono",
  display: "swap",
  preload: false,
});

/*
 * API kaynağına preconnect (9 Ağustos 2026).
 *
 * ÖLÇÜM: canlı sitede kitap rafı sayfasının HTML'inde tek bir `preconnect` ya
 * da `dns-prefetch` yoktu. Kapaklar `api.kuronexus.com` üzerinde, yani belgeden
 * AYRI bir origin'de duruyor; tarayıcı HTML'i ayrıştırıp ilk <img>'a gelene
 * kadar o origin için DNS + TCP + TLS turuna hiç başlamıyor. Bu ipucu turu
 * <head> okunurken, ilk kapak istenmeden önce başlatıyor.
 *
 * ⚠️ crossOrigin="anonymous" SÜS DEĞİL: kapaklar düz <img> ile, yani anonim
 * modda (CORS'suz) çekiliyor. Öznitelik yazılmazsa tarayıcı bağlantıyı
 * kimlik-bilgili (credentialed) havuza açar, <img> ise ayrı bir anonim havuz
 * açar — bağlantı yeniden kullanılmaz ve preconnect tamamen boşa gider.
 *
 * Adres sabit yazılmadı: aynı değişken `next.config.ts` ve `lib/api/client.ts`
 * içinde de okunuyor, üçünün ayrışması sessiz bir hata olurdu. `dns-prefetch`
 * fallback'i BİLEREK eklenmedi — preconnect'i anlamayan tarayıcı payı ölçülebilir
 * seviyenin altında, fazladan satır yalnızca bakım yükü.
 */
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    /**
     * Paylaşım görselinin adresi mutlak olmak zorunda — WhatsApp, X ve
     * Discord göreli yol kabul etmiyor. `metadataBase` verilince Next
     * aşağıdaki göreli yolları kendisi mutlaklaştırıyor.
     */
    metadataBase: new URL(SITE_URL),
    title: {
      default: "KuroNexus",
      template: "%s | KuroNexus",
    },
    description: t("description"),
    // favicon.ico ve apple-icon.png `app/` altında duruyor; Next onları
    // kendiliğinden bağlar. Burada yalnızca dosya adı geçmeyenler var.
    icons: {
      icon: [{ url: "/brand/icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      type: "website",
      siteName: "KuroNexus",
      title: "KuroNexus",
      description: t("description"),
      locale: locale === "en" ? "en_US" : "tr_TR",
      url: locale === "en" ? `${SITE_URL}/en` : SITE_URL,
      images: [
        {
          url: "/brand/og.png",
          width: 1200,
          height: 630,
          alt: "KuroNexus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "KuroNexus",
      description: t("description"),
      images: ["/brand/og.png"],
    },
  };
}

import { GlobalAmbientPlayer } from "@/components/story/GlobalAmbientPlayer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RouteLoader } from "@/components/ui/RouteLoader";
import { MusicQueueProvider } from "@/components/player/MusicQueue";
import { MusicPlayerBar } from "@/components/player/MusicPlayerBar";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Tema cookie'si SSR'da okunur ve <html>'e ilk boyamadan önce yazılır —
  // FOUC/tema flash'ı yok (AGENTS.md kural 16).
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE)?.value;
  const theme: Theme = THEMES.includes(cookieTheme as Theme)
    ? (cookieTheme as Theme)
    : DEFAULT_THEME;

  // Düzenleme kontrolleri sayfaların üstünde de görünüyor — bu karar tek
  // yerden okunuyor (lib/auth/session.ts, imza doğrulaması neden yok orada yazılı)
  const isAdmin = await readIsAdmin();

  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${brushFont.variable} ${cinzel.variable} ${bebas.variable} ${petrona.variable} ${cormorant.variable} ${corinthia.variable} ${orhun.variable} ${anton.variable} ${inter.variable} ${shippori.variable} ${jost.variable} ${archivoBlack.variable} ${unifraktur.variable} ${plexMono.variable}`}
    >
      <head>
        <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />
      </head>
      <body>
        <NextIntlClientProvider>
          {/* Müzik kuyruğu KÖK DÜZENDE: sayfalar arası gezinmede bu ağaç
              yeniden mount edilmediği için çalar iframe'i hayatta kalıyor ve
              film/dizi sayfalarında gezinirken müzik kesilmiyor (kullanıcı
              isteği). Bir sayfanın içine konsaydı her bağlantıda susardı. */}
          <MusicQueueProvider>
            {/* Klavyeyle gelen biri her sayfada önce header ve footer
                bağlantılarını geçmek zorunda kalmasın. Yalnızca odaklanınca
                görünür (globals.css .skipLink). */}
            <a href="#icerik" className="skipLink">
              {t("skipToContent")}
            </a>
            <SiteHeader initialTheme={theme} isAdmin={isAdmin} />
            {/* tabIndex={-1}: atlama bağlantısı buraya odaklanabilsin —
                yoksa Safari/Firefox hedefe kaydırır ama odağı taşımaz */}
            <main id="icerik" tabIndex={-1}>
              {children}
            </main>
            <GlobalAmbientPlayer />
            <SiteFooter />
            {/* Şerit en sonda: sabit konumlu ve içeriğin üstüne biniyor;
                kuyruk boşken hiçbir şey çizmiyor */}
            <MusicPlayerBar />
            {/* Rota geçiş katmanı EN SONDA ve kök düzende: sayfa ağacı
                değişirken bu ağaç yeniden mount edilmiyor, yani gösterge
                geçişin iki ucunda da hayatta kalıyor. Bir sayfanın içine
                konsaydı tam da göstermesi gereken anda sökülürdü.

                ⚠️ `loading.tsx` DEĞİL: o mekanizma segmenti akışa çevirip
                alttaki `notFound()` çağrılarının durum kodunu yutuyor
                (ölçülmüş tutanak, 2026-08-06). Gerekçenin tamamı
                `RouteLoader` başlığında. */}
            <RouteLoader />
          </MusicQueueProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
