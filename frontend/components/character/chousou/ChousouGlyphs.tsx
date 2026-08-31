/**
 * Chōsō sayfasının elle çizilmiş SVG'leri — SUNUCU BİLEŞENİ.
 *
 * `"use client"` YOK ve olmamalı: burada ne durum ne olay var, yalnızca yol
 * verisi. İstemci adası bütçesi (en fazla 3) bu dosyaya harcanmıyor.
 *
 * ── NEDEN ÇİZİLDİ, İNDİRİLMEDİ ───────────────────────────────────────────
 * Faz 2 §3: sahne/teknik/motif görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Motif gerekiyorsa elle SVG çizilir. Buradaki dört işaret de
 * dekoratif; hiçbiri bilgi taşımıyor ve hepsi `aria-hidden`.
 *
 * Renk YOK: bütün konturlar `currentColor` ya da sınıf üstünden token
 * okuyor, dolayısıyla "Kan Bağı" açıldığında işaretler paletle birlikte
 * doyuyor. Hex burada da yasak (kural 16) — dosyada tek renk değeri yok.
 *
 * ── `pathLength` NEDEN 100 ───────────────────────────────────────────────
 * Akış animasyonu `stroke-dashoffset` ile yürüyor ve CSS'in gerçek yol
 * uzunluğunu bilmesi gerekiyor. `pathLength="100"` yolun ölçüsünü 100
 * birime normalize ediyor: geometri değiştiğinde CSS'teki sayıyı yeniden
 * hesaplamak gerekmiyor, `stroke-dasharray: 100` her zaman doğru.
 */

/**
 * Filigran — damar/dallanma deseni + 脹相.
 *
 * Tek bir gövde damarı yukarıdan aşağı iniyor ve dokuz uçta bitene kadar
 * ikiye ayrılıyor. Dallanma noktaları küçük halkalarla İŞARETLİ: sayfanın
 * ızgarası da aynı kuralı izliyor, o yüzden filigran bir süs değil ızgaranın
 * küçültülmüş hâli.
 */
export function VeinWatermark({
  className,
  trunkClassName,
  branchClassName,
  nodeClassName,
}: {
  className?: string;
  trunkClassName?: string;
  branchClassName?: string;
  nodeClassName?: string;
}) {
  /* Dallanma noktaları: gövdenin üstünde inildikçe seyrelen dört yükseklik.
     Her noktadan sağa ve sola birer dal çıkıyor, dallar da uçlarında
     ikiye ayrılıyor — dokuz uç, dokuz rahim. */
  const forks = [
    { y: 132, reach: 118, drop: 74 },
    { y: 268, reach: 152, drop: 86 },
    { y: 404, reach: 126, drop: 78 },
    { y: 536, reach: 164, drop: 92 },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 520 760"
      fill="none"
      focusable="false"
      aria-hidden
    >
      {/* Gövde damarı — hafif kıvrımlı, tek yönlü */}
      <path
        className={trunkClassName}
        d="M260 24 C252 120 268 176 260 254 C252 332 268 392 260 470 C252 548 266 616 260 724"
      />

      {forks.map(({ y, reach, drop }) => (
        <g key={y}>
          {[-1, 1].map((dir) => (
            <g key={dir}>
              <path
                className={branchClassName}
                d={`M260 ${y} C${260 + dir * reach * 0.45} ${y + 6} ${
                  260 + dir * reach * 0.78
                } ${y + drop * 0.36} ${260 + dir * reach} ${y + drop}`}
              />
              <path
                className={branchClassName}
                d={`M${260 + dir * reach} ${y + drop} l${dir * 34} ${drop * 0.42}`}
              />
              <path
                className={branchClassName}
                d={`M${260 + dir * reach} ${y + drop} l${dir * -6} ${drop * 0.52}`}
              />
            </g>
          ))}
          <circle className={nodeClassName} cx="260" cy={y} r="7" />
        </g>
      ))}

      {/* Dokuzuncu uç: gövdenin kendi dibi, dalsız */}
      <circle className={nodeClassName} cx="260" cy="724" r="5" />
    </svg>
  );
}

/**
 * Dallanma noktası işareti — bölüm başlıklarının damara bağlandığı yer.
 *
 * Ortada bir halka, iki yana çıkan iki kısa kılcal. Halka "Kan Bağı"
 * kapalıyken de duruyor; açıldığında CSS kılcalları uzatıyor, yani durum
 * yalnız renkle değil BİÇİMLE de söyleniyor.
 */
export function BranchNode({
  className,
  ringClassName,
  capillaryClassName,
}: {
  className?: string;
  ringClassName?: string;
  capillaryClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      focusable="false"
      aria-hidden
    >
      <circle className={ringClassName} cx="24" cy="24" r="9" />
      <circle className={ringClassName} cx="24" cy="24" r="3.5" />
      <path className={capillaryClassName} d="M15 24 C9 22 6 26 1 23" />
      <path className={capillaryClassName} d="M33 24 C39 26 42 22 47 25" />
    </svg>
  );
}

/**
 * Mod düğmesinin işareti — bir damla, içinde dallanma.
 *
 * Damla kapalıyken boş kontur; "Kan Bağı" açıkken CSS içindeki dallanmayı
 * görünür kılıyor. Renkle değil dolgu/biçimle konuşuyor.
 */
export function BloodDrop({
  className,
  shellClassName,
  veinClassName,
}: {
  className?: string;
  shellClassName?: string;
  veinClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      focusable="false"
      aria-hidden
    >
      <path
        className={shellClassName}
        d="M24 5 C24 5 38 22 38 31 C38 39 31 44 24 44 C17 44 10 39 10 31 C10 22 24 5 24 5 Z"
      />
      <path className={veinClassName} d="M24 16 L24 39" />
      <path className={veinClassName} d="M24 24 L17 30" />
      <path className={veinClassName} d="M24 29 L31 34" />
    </svg>
  );
}

/**
 * Akış gövdesi — dokuz kardeş mekaniğinin kanı.
 *
 * Sütunun solunda duran dikey yol; halka açıldığında `stroke-dashoffset`
 * 100'den 0'a iniyor ve kan YUKARIDAN AŞAĞI yürüyor. Geriye akış yok —
 * animasyonun yönü mekaniğin kuralı.
 *
 * İki yol üst üste: sönük olan yatağın kendisi, parlak olan akan kan.
 */
export function FlowStem({
  className,
  bedClassName,
  streamClassName,
}: {
  className?: string;
  bedClassName?: string;
  streamClassName?: string;
}) {
  const d = "M8 2 C4 26 12 48 8 72 C4 96 12 122 8 148";
  return (
    <svg
      className={className}
      viewBox="0 0 16 150"
      fill="none"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden
    >
      <path className={bedClassName} d={d} pathLength={100} />
      <path className={streamClassName} d={d} pathLength={100} />
    </svg>
  );
}
