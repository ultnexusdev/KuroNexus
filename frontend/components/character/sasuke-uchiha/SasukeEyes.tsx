/**
 * Sasuke'nin göz diskleri ve Uchiha yelpazesi — elle çizilmiş saf SVG,
 * sunucuda çizilir.
 *
 * ⚠️ Geometri bu arşiv için sıfırdan kuruldu. Itachi sayfasındaki desenler
 * Wikimedia Commons'tan alınmış CC BY-SA çizimlerdir ve **kopyalanmadı**
 * (kullanıcı komutu, 22 Ağustos 2026): buradaki Ebedi Mangekyō altı ayrı
 * bıçaktan ve altıgen bir çekirdekten kuruluyor, tomoe'nin kuyruğu kendi
 * eğrisiyle çiziliyor. Dolayısıyla bu dosyanın atıf yükümlülüğü yok.
 *
 * Renkler yalnızca token: iris gradyanı `--sas-sharingan` / `--sas-rinnegan`
 * ailesinden, desen mürekkebi `--sas-amaterasu` (kara alev gövdesi zaten
 * neredeyse siyah). Bu dosyada da tek hex yok.
 *
 * Her disk İKİ katman çizer — "uyanmamış" ve "uyanmış". Hangisinin görünür
 * olduğuna CSS karar verir (`baseClassName` / `awakenedClassName` çağırandan
 * gelir): intikam yolu seçildiğinde üç tomoe Ebedi Mangekyō'ya, kefaret yolu
 * seçildiğinde çıplak halkalar altı tomoe'li Rinnegan'a döner. Morf yok,
 * çapraz geçiş var — JS'siz ve reduced-motion battaniyesiyle uyumlu.
 */

/** İris gradyanlarının TEK tanımı — sayfa kökünde bir kez çizilir. */
export const SASUKE_IRIS_CRIMSON = "sas-iris-crimson";
export const SASUKE_IRIS_VIOLET = "sas-iris-violet";

export function SasukeEyeDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        {/* Kızıl iris: ortası parlak, kenarı koyu — bakış merkezden gelir */}
        <radialGradient id={SASUKE_IRIS_CRIMSON}>
          <stop offset="0" stopColor="var(--sas-sharingan-text)" />
          <stop offset="0.55" stopColor="var(--sas-sharingan)" />
          <stop offset="1" stopColor="var(--sas-storm)" />
        </radialGradient>
        {/* Mor iris: aynı yapı, kefaret kanadının rengiyle */}
        <radialGradient id={SASUKE_IRIS_VIOLET}>
          <stop offset="0" stopColor="var(--accent-hover)" />
          <stop offset="0.55" stopColor="var(--sas-rinnegan)" />
          <stop offset="1" stopColor="var(--sas-storm)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * Tek tomoe — kendi eğrisi.
 *
 * Nokta + arkasından savrulan kuyruk; kuyruk saat yönünde açılıyor.
 * Merkez çevresinde `rotate` ile çoğaltılır.
 */
function Tomoe({ angle, radius = 21 }: { angle: number; radius?: number }) {
  return (
    <g transform={`rotate(${angle} 50 50)`}>
      <g transform={`translate(50 ${50 - radius})`}>
        <circle r="5.4" fill="var(--sas-amaterasu)" />
        <path
          d="M 4.4 -3.1 C 9.8 -6.6 15.4 -6.2 18.6 -2.4 C 13.4 -3.5 8.6 -1.6 5 2.8 Z"
          fill="var(--sas-amaterasu)"
        />
      </g>
    </g>
  );
}

/**
 * Ebedi Mangekyō — altı bıçaklı yıldız, altıgen çekirdek.
 *
 * Üç uzun ve üç kısa bıçak dönüşümlü yerleşir (60° aralık): uzun olanlar
 * "kendi" deseni, kısa olanlar ağabeyinden gelen katman. İkisi altıgen
 * çekirdekte birleşir — sayfanın bütün fikri gibi, iki desen tek gözde.
 */
const EMS_BLADE_LONG =
  "M 50 50 C 46.2 38 45.4 24 47.6 10.4 C 48.7 6.6 51.3 6.6 52.4 10.4 C 54.6 24 53.8 38 50 50 Z";
const EMS_BLADE_SHORT =
  "M 50 50 C 47.6 42.4 47 33.6 48.4 26.2 C 49.1 23.6 50.9 23.6 51.6 26.2 C 53 33.6 52.4 42.4 50 50 Z";
const EMS_CORE = "M 60.4 56 L 50 62 L 39.6 56 L 39.6 44 L 50 38 L 60.4 44 Z";

function EternalStar() {
  return (
    <g>
      {[0, 120, 240].map((angle) => (
        <path
          key={`long-${angle}`}
          transform={`rotate(${angle} 50 50)`}
          d={EMS_BLADE_LONG}
          fill="var(--sas-amaterasu)"
        />
      ))}
      {[60, 180, 300].map((angle) => (
        <path
          key={`short-${angle}`}
          transform={`rotate(${angle} 50 50)`}
          d={EMS_BLADE_SHORT}
          fill="var(--sas-amaterasu)"
        />
      ))}
      <path d={EMS_CORE} fill="var(--sas-amaterasu)" />
      <circle cx="50" cy="50" r="5.6" fill="var(--sas-sharingan)" />
    </g>
  );
}

/** Rinnegan halkaları — dört eşmerkezli çember, göz bebeği ortada. */
function RinneganRings() {
  return (
    <g>
      {[13, 22, 31, 40].map((r) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--sas-amaterasu)"
          strokeWidth="1.9"
        />
      ))}
      <circle cx="50" cy="50" r="5.4" fill="var(--sas-amaterasu)" />
    </g>
  );
}

/** Uyanmış Rinnegan: halkaların üstünde altı tomoe döner. */
function RinneganTomoe() {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <g transform="translate(50 28)">
            <circle r="2.8" fill="var(--sas-amaterasu)" />
            <path
              d="M 2.3 -1.6 C 5.1 -3.4 8 -3.2 9.6 -1.2 C 6.9 -1.8 4.4 -0.8 2.6 1.4 Z"
              fill="var(--sas-amaterasu)"
            />
          </g>
        </g>
      ))}
    </g>
  );
}

/**
 * Göz diski — iris + halka + iki desen katmanı.
 *
 * `title` verilirse `role="img"`; verilmezse tamamen dekoratif (çağıran
 * düğmenin kendi erişilebilir adı var, disk ikinci kez okunmasın).
 */
export function SasukeEyeDisc({
  variant,
  className,
  baseClassName,
  awakenedClassName,
  spinClassName,
  title,
}: {
  variant: "sharingan" | "rinnegan";
  className?: string;
  /** Uyanmamış katman: üç tomoe / çıplak halkalar */
  baseClassName?: string;
  /** Uyanmış katman: Ebedi Mangekyō / altı tomoe'li Rinnegan */
  awakenedClassName?: string;
  /** Dönme animasyonunu taşıyan sınıf — çağıranın CSS modülünde yaşar */
  spinClassName?: string;
  title?: string;
}) {
  const crimson = variant === "sharingan";
  const iris = crimson
    ? `url(#${SASUKE_IRIS_CRIMSON}) var(--sas-sharingan)`
    : `url(#${SASUKE_IRIS_VIOLET}) var(--sas-rinnegan)`;

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle cx="50" cy="50" r="47" fill={iris} />
      {/* Kenar halkası: gözün karanlık çerçevesi */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="var(--sas-amaterasu)"
        strokeWidth="3.4"
      />
      <g className={spinClassName}>
        <g className={baseClassName}>
          {crimson ? (
            <>
              <Tomoe angle={0} />
              <Tomoe angle={120} />
              <Tomoe angle={240} />
              <circle cx="50" cy="50" r="6.2" fill="var(--sas-amaterasu)" />
            </>
          ) : (
            <RinneganRings />
          )}
        </g>
        <g className={awakenedClassName}>
          {crimson ? (
            <EternalStar />
          ) : (
            <>
              <RinneganRings />
              <RinneganTomoe />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

/**
 * Uchiha yelpazesi (uchiwa) — hero'nun ardındaki filigran.
 *
 * Üç parça: üstte geniş kızıl kubbe, altta dar beyaz yarım daire, altta
 * kısa sap. Renk gelmiyor — `topClassName` ve `baseClassName` ile CSS
 * boyuyor, böylece filigran opaklığı tek yerden yönetiliyor.
 */
export function UchihaCrest({
  className,
  topClassName,
  baseClassName,
}: {
  className?: string;
  topClassName?: string;
  baseClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      {/* Üst kanat — geniş kubbe */}
      <path className={topClassName} d="M 15 47 A 35 35 0 0 1 85 47 Z" />
      {/* Alt kanat — dar yarım daire */}
      <path className={baseClassName} d="M 27 47 A 23 23 0 0 0 73 47 Z" />
      {/* Sap */}
      <path className={baseClassName} d="M 45.5 69 L 54.5 69 L 56.5 90 L 47 91 Z" />
    </svg>
  );
}
