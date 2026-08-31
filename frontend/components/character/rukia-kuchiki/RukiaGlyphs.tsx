/**
 * Rukia sayfasının elle çizilmiş SVG'leri — SUNUCU BİLEŞENİ.
 *
 * `"use client"` YOK ve olmamalı: burada durum da olay da yok, yalnızca
 * yol verisi. İstemci adası bütçesi (en fazla 3) bu dosyaya harcanmıyor.
 *
 * ── NEDEN ÇİZİLDİ, İNDİRİLMEDİ ───────────────────────────────────────────
 * Faz 2 §3: sahne/teknik/motif görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Motif gerekiyorsa elle SVG çizilir. Buradaki üç işaret de
 * dekoratif: üçü de `aria-hidden` bir sarmalayıcının içinde duruyor ve
 * hiçbiri bilgi taşımıyor.
 *
 * ⚠️ Hane arması BİR YORUM. Kuchiki hanesinin işaretini birebir kopyalayan
 * bir vektör değil, ince konturlu bir mon eskizi: dış halka (hane), altı
 * yaprak (kar kristalinin altı kolu) ve içteki altıgen çekirdek. Sayfada
 * hiçbir yerde "resmî arma budur" denmiyor; künyede de armanın elle
 * çizildiği yazılı.
 *
 * Renk YOK: bütün konturlar `currentColor` okuyor, dolayısıyla ay ışığı
 * modunda ve kar katmanları düştüğünde işaretler zeminle birlikte dönüyor.
 * `vector-effect="non-scaling-stroke"` kullanılmadı — filigran çok büyük
 * ölçekleniyor ve konturun onunla birlikte incelmesi İSTENEN etki.
 */

/** Hane arması — filigran. Dolgusuz, tek renkli, çok ince kontur. */
export function HouseCrest({
  className,
  ringClassName,
  petalClassName,
  coreClassName,
}: {
  className?: string;
  ringClassName?: string;
  petalClassName?: string;
  coreClassName?: string;
}) {
  /* Altı yaprak 60°'lik dönüşlerle tek bir yol şablonundan türetiliyor:
     elle altı ayrı `d` yazmak aynı şeyi altı kez yanlış yazma riski. */
  const petals = [0, 60, 120, 180, 240, 300];

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      focusable="false"
      aria-hidden
    >
      <circle className={ringClassName} cx="100" cy="100" r="88" />
      <circle className={ringClassName} cx="100" cy="100" r="79" />

      {petals.map((deg) => (
        <path
          key={deg}
          className={petalClassName}
          transform={`rotate(${deg} 100 100)`}
          d="M100 26 C112 50 118 66 118 80 C118 94 110 102 100 108 C90 102 82 94 82 80 C82 66 88 50 100 26 Z"
        />
      ))}

      <path
        className={coreClassName}
        d="M100 78 L119 89 L119 111 L100 122 L81 111 L81 89 Z"
      />
      <circle className={coreClassName} cx="100" cy="100" r="7" />
    </svg>
  );
}

/**
 * Kar kristali — bölüm ayıraçlarındaki küçük işaret.
 *
 * Altı kol, her kolda iki çatal. Kristal büyümesi CSS tarafında
 * `clip-path` ile yapılıyor (hareket dili: sert hiçbir şey yok), bu yüzden
 * burada animasyon yok — yalnızca geometri.
 */
export function SnowCrystal({
  className,
  armClassName,
}: {
  className?: string;
  armClassName?: string;
}) {
  const arms = [0, 60, 120, 180, 240, 300];

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      focusable="false"
      aria-hidden
    >
      {arms.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <path className={armClassName} d="M60 60 L60 12" />
          <path className={armClassName} d="M60 26 L48 16" />
          <path className={armClassName} d="M60 26 L72 16" />
          <path className={armClassName} d="M60 40 L51 32" />
          <path className={armClassName} d="M60 40 L69 32" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Ay yayı — mod düğmesinin işareti.
 *
 * İki yay: dıştaki tam daire (kapalı ay), içteki kavis dolunayın kesildiği
 * yer. Düğme basılıyken CSS içteki kavsi kaydırıyor, yani işaret durumu
 * RENKLE değil BİÇİMLE söylüyor (kural: durum yalnız renkle verilmez).
 */
export function MoonArc({
  className,
  discClassName,
  arcClassName,
}: {
  className?: string;
  discClassName?: string;
  arcClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      focusable="false"
      aria-hidden
    >
      <circle className={discClassName} cx="24" cy="24" r="15" />
      <path className={arcClassName} d="M24 9 A15 15 0 0 1 24 39 A19 19 0 0 0 24 9 Z" />
    </svg>
  );
}
