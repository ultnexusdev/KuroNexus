/**
 * Jōgo — elle çizilmiş SVG motifleri. SUNUCU BİLEŞENİ: `"use client"` yok,
 * istemciye tek bayt inmiyor.
 *
 * Faz 2 §3: sahne/teknik görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Bir motif gerekiyorsa elle çizilir — bu dosyadaki dört
 * çizim de path'i tek tek yazılmış, düzensiz bırakılmış (cetvelle çizilmiş
 * gibi görünmemesi için köşe noktaları bilerek eşit aralıklı değil).
 *
 * Renk YOK: her path `className` ile geliyor ve boyayı modül alıyor
 * (kural 16 — bileşende hex yok, `currentColor` bile yazılmıyor çünkü
 * çizgilerin bir kısmı magma, bir kısmı bazalt).
 *
 * Hepsi dekoratif: çağıran taraf `aria-hidden` sarmalıyor.
 */

/**
 * FİLİGRAN — tek göz.
 *
 * Jōgo'nun kafası bir krater ve o kraterin ortasında tek bir göz var.
 * Çizim iki halkadan kuruluyor: kırık bir krater ağzı (dış) ve badem
 * biçimli tek göz (iç). Krater ağzı kapalı bir daire DEĞİL — üç yerinden
 * kopuk, çünkü bir kraterin kenarı da kapalı değil.
 */
export function EyeMark({
  className,
  rimClassName,
  eyeClassName,
  irisClassName,
}: {
  className?: string;
  rimClassName?: string;
  eyeClassName?: string;
  irisClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 260 180" fill="none" focusable="false">
      {/* Krater ağzı — üç kopuk yay */}
      <path
        className={rimClassName}
        d="M18 96 L31 64 L52 42 L79 27 L104 21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={rimClassName}
        d="M139 20 L168 27 L196 44 L216 68 L227 92"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={rimClassName}
        d="M226 110 L209 136 L182 154 L150 163 L119 164 L88 157 L57 141 L33 118 L23 105"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Kraterin iç duvarı — kısa, düzensiz çentikler */}
      <path className={rimClassName} d="M62 66 L70 79" strokeLinecap="round" />
      <path className={rimClassName} d="M190 71 L181 84" strokeLinecap="round" />
      <path className={rimClassName} d="M124 152 L126 138" strokeLinecap="round" />

      {/* Tek göz — badem, üstü aşağıdan daha keskin */}
      <path
        className={eyeClassName}
        d="M52 92 C86 55 174 55 209 92 C174 129 86 129 52 92 Z"
        strokeLinejoin="round"
      />
      {/* İris ve içindeki dikey yarık */}
      <circle className={irisClassName} cx="130" cy="92" r="27" />
      <path className={eyeClassName} d="M130 71 L130 113" strokeLinecap="round" />
      {/* Üst kapağın çizgisi — bakış yönünü veriyor */}
      <path
        className={eyeClassName}
        d="M69 84 C99 61 161 61 192 84"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * MAGMA ÇATLAĞI — katmanlar arasındaki ayıraç.
 *
 * `preserveAspectRatio="none"`: çizgi kabın genişliğine yayılıyor, yani
 * 360 px'te de 1400 px'te de kesitin tamamını kat ediyor. İki path var:
 * kırık bazalt hattı (üstte) ve altındaki magma damarı — ikincisi
 * nabız gibi parlıyor (animasyon modülde, `prefers-reduced-motion`
 * kapısının arkasında).
 */
export function CrackRule({
  className,
  lineClassName,
  glowClassName,
  branchClassName,
}: {
  className?: string;
  lineClassName?: string;
  glowClassName?: string;
  branchClassName?: string;
}) {
  const d =
    "M0 22 L58 17 L96 25 L152 12 L214 24 L268 9 L331 21 L392 14 L448 26 L512 11 L575 23 L641 15 L702 27 L764 13 L829 24 L888 16 L951 26 L1014 12 L1077 22 L1138 15 L1200 21";
  return (
    <svg
      className={className}
      viewBox="0 0 1200 36"
      preserveAspectRatio="none"
      fill="none"
      focusable="false"
    >
      <path className={glowClassName} d={d} strokeLinecap="round" strokeLinejoin="round" />
      <path className={lineClassName} d={d} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dallanmalar — çatlak düz bir çizgi değil, bir ağ */}
      <path className={branchClassName} d="M152 12 L164 2" strokeLinecap="round" />
      <path className={branchClassName} d="M448 26 L436 35" strokeLinecap="round" />
      <path className={branchClassName} d="M764 13 L779 3" strokeLinecap="round" />
      <path className={branchClassName} d="M1014 12 L1002 2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * BOŞ KADRAJ MOTİFİ — çatlamış bazalt levha.
 *
 * Görsel yokken kadraj "görselsiz ama ayakta" kalıyor (Faz 2 §3). İçinde
 * ölçü/üretim metni YOK: o metin yalnızca küratör dalında yazılıyor
 * (Dalga 1'de Levi'de tam tersi yapılmıştı ve ziyaretçiye sızmıştı).
 */
export function SlabCrack({
  className,
  slabClassName,
  crackClassName,
  emberClassName,
}: {
  className?: string;
  slabClassName?: string;
  crackClassName?: string;
  emberClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      focusable="false"
    >
      {/* Levhanın kenarı */}
      <path
        className={slabClassName}
        d="M12 14 L388 10 L392 208 L8 205 Z"
        strokeLinejoin="round"
      />
      {/* Ana çatlak — köşeden köşeye, düzensiz */}
      <path
        className={emberClassName}
        d="M42 206 L86 152 L74 118 L118 74 L104 44 L138 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={crackClassName}
        d="M42 206 L86 152 L74 118 L118 74 L104 44 L138 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* İkinci çatlak, ters yönde */}
      <path
        className={crackClassName}
        d="M392 96 L338 112 L306 92 L262 118 L228 104 L196 132 L182 172 L206 208"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Kılcallar */}
      <path className={crackClassName} d="M118 74 L154 66" strokeLinecap="round" />
      <path className={crackClassName} d="M262 118 L254 148" strokeLinecap="round" />
      <path className={crackClassName} d="M86 152 L52 148" strokeLinecap="round" />
    </svg>
  );
}

/**
 * KONİ — künye şeridindeki sembolik obje.
 *
 * Jōgo'nun kafası bir volkan konisi; kesit çizimi olarak veriliyor (yan
 * kesit + içindeki baca), çünkü bu sayfanın bütün ızgarası bir yer kesiti.
 */
export function ConeMark({
  className,
  outlineClassName,
  ventClassName,
  layerClassName,
}: {
  className?: string;
  outlineClassName?: string;
  ventClassName?: string;
  layerClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 200 140" fill="none" focusable="false">
      {/* Koninin dış hattı — tepesi kesik (krater) */}
      <path
        className={outlineClassName}
        d="M8 128 L74 34 L88 22 L112 22 L126 36 L192 128"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Yer yüzeyi */}
      <path className={outlineClassName} d="M0 128 L200 128" strokeLinecap="round" />
      {/* İç katmanlar — kesitin kendisi */}
      <path className={layerClassName} d="M32 106 L168 106" strokeLinecap="round" />
      <path className={layerClassName} d="M48 86 L152 86" strokeLinecap="round" />
      <path className={layerClassName} d="M62 66 L138 66" strokeLinecap="round" />
      {/* Baca — aşağıdan yukarı, düzensiz */}
      <path
        className={ventClassName}
        d="M100 138 L96 112 L104 88 L98 62 L100 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
