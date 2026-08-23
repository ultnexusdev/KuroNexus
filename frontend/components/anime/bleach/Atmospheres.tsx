import type { LayerId } from "./WorldSection";
import styles from "./Atmospheres.module.css";

/**
 * KATMAN ATMOSFERLERİ — beş dünya, beş ayrı görsel gramer.
 *
 * ── NEDEN AYNI ŞABLON DEĞİL ──────────────────────────────────────────────
 * Brief'in şartı net: "her katman farklı görünmeli, aynı şablon değil".
 * Beş katman aynı düzeni paylaşıp yalnızca renk değiştirseydi, sayfa "beş
 * kez aynı bölüm" olurdu — Naruto'daki ızgaranın dikey hâli. Dünyalar
 * birbirine benzemiyor; sayfanın da benzememesi gerekiyor.
 *
 * ── HEPSİ SAF CSS + INLINE SVG ───────────────────────────────────────────
 * Tek bir dosya inmiyor, tek bir istek gitmiyor. Yağmur bir gradient,
 * mürekkep bir turbulence filtresi, kemik ağacı bir path. Bu hem
 * performans hem CSP kararı (dış kaynak beyaz listede değil).
 *
 * ⚠️ Hepsi `aria-hidden`: atmosfer DEKOR. Anlatıyı katmanın metni
 * taşıyor; ekran okuyucu yağmurun sesini duymuyor.
 */

/* ══════════════════════════════════════════════════════════════════
   現世 KARAKURA — gece + yağmur + sodyum lambası
   ══════════════════════════════════════════════════════════════════ */

/**
 * Yağmur `repeating-linear-gradient` + `translateY` ile: kırk ayrı damla
 * elemanı yerine tek bir kaplama. Elektrik direği sağ altta, ufuk
 * çizgisini kesiyor. Uzakta üç soluk kader zinciri (chain of fate) —
 * Karakura'nın asıl anlatısı bu: ölüm burada görünmüyor ama var.
 */
function LivingAtmosphere() {
  return (
    <div className={styles.living} aria-hidden="true">
      <span className={styles.rain} />
      <span className={styles.rainFar} />

      {/* Kader zincirleri: göğüsten sarkan halkalar, çok soluk */}
      <svg className={styles.chains} viewBox="0 0 400 300" fill="none">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${40 + i * 130} ${20 + i * 34})`}>
            {[0, 1, 2, 3, 4].map((j) => (
              <ellipse
                key={j}
                cx="0"
                cy={j * 26}
                rx={j % 2 === 0 ? 7 : 4}
                ry="12"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Elektrik direği — Karakura'nın imzası */}
      <svg className={styles.pole} viewBox="0 0 160 400" fill="none">
        <path
          d="M80 400V40M40 66h80M48 100h64M56 134h48"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path d="M80 66q-80 30-80 74" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <path d="M80 100q80 26 80 66" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   尸魂界 SEIREITEI — sumi mürekkep + haori kumaşı
   ══════════════════════════════════════════════════════════════════ */

/**
 * Mürekkep dokusu üretilmiş bir turbulence; üzerine yatay bir kaligrafi
 * fırça vuruşu, başlığın altını çiziyormuş gibi. Fırça bir dikdörtgen
 * değil: iki ucu inceliyor ve kenarları düzensiz — gerçek bir vuruşun
 * bıraktığı iz.
 */
function SoulSocietyAtmosphere() {
  return (
    <div className={styles.soulSociety} aria-hidden="true">
      <span className={styles.sumi} />
      <span className={styles.haori} />

      <svg className={styles.brush} viewBox="0 0 1000 60" fill="currentColor">
        <path d="M6 34q64-19 150-22 118-4 236 8 132 13 262 9 118-4 208-19 78-13 132-4-46 22-132 30-104 10-216 8-128-2-254-12-102-8-186-6-118 3-200 12Z" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   虚圏 HUECO MUNDO — TAM BOŞLUK
   ══════════════════════════════════════════════════════════════════ */

/**
 * ⚠️ BURADA HİÇBİR DOKU YOK VE OLMAYACAK.
 *
 * Brief: "Sadece beyaz zemin + tek bir kırık kemik ağacı silüeti + ay.
 * Hiçbir doku, hiçbir gradient. Cesareti boşlukta harca."
 *
 * Diğer dört atmosfer katman katman inşa edilirken bu bilinçli olarak
 * fakir. Sayfanın negatife döndüğü tek yer burası ve boşluğun kendisi
 * anlatı: "hiçbir şey yok" cümlesini dokuyla yumuşatmak onu yalan yapar.
 *
 * Ay dolgusuz, tek piksel konturlu bir daire. Ağaç tek parça bir path.
 */
function HuecoMundoAtmosphere() {
  return (
    <div className={styles.hueco} aria-hidden="true">
      <svg className={styles.moon} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" />
      </svg>

      <svg className={styles.boneTree} viewBox="0 0 300 500" fill="currentColor">
        <path d="M140 500v-236l-52-64 8-10 44 54v-72l-34-44 8-10 26 34V90l-30-40 9-9 21 28V0h12v58l30-38 9 9-39 49v76l38-46 8 10-46 56v78l58-70 8 10-66 80v228Z" />
      </svg>

      {/* Kum çizgisi: ekranın altında tek bir yatay iz. Gradient değil,
          düz bir çizgi — burada yumuşak geçiş yok. */}
      <span className={styles.sand} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   霊王宮 REIŌKYŪ — renksizlik
   ══════════════════════════════════════════════════════════════════ */

/**
 * İnce beyaz çizgilerden bir tapınak planı. Dolgu yok, doku yok, renk yok
 * — yalnızca geometri. Brief: "En sessiz katman, kasıtlı olarak."
 *
 * Plan bir bina değil bir ŞEMA: yukarıdan bakılmış, ölçekli, insansız.
 * Reiōkyū hakkında bilinen şey de bu kadar.
 */
function RoyalAtmosphere() {
  return (
    <div className={styles.royal} aria-hidden="true">
      <svg className={styles.temple} viewBox="0 0 600 600" fill="none">
        <g stroke="currentColor" strokeWidth="1">
          {/* Dış sınır */}
          <rect x="60" y="60" width="480" height="480" />
          {/* İç avlu */}
          <rect x="150" y="150" width="300" height="300" />
          {/* Merkez — mühür */}
          <rect x="255" y="255" width="90" height="90" />
          <circle cx="300" cy="300" r="26" />
          {/* Eksenler */}
          <path d="M300 60v90M300 450v90M60 300h90M450 300h90" />
          {/* Köşe pavyonları */}
          <rect x="96" y="96" width="42" height="42" />
          <rect x="462" y="96" width="42" height="42" />
          <rect x="96" y="462" width="42" height="42" />
          <rect x="462" y="462" width="42" height="42" />
          {/* Çapraz hatlar — çok soluk */}
          <path d="M150 150 60 60M450 150l90-90M150 450l-90 90M450 450l90 90" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   見えざる帝国 SILBERN — gotik buz
   ══════════════════════════════════════════════════════════════════ */

/**
 * Sivri kemer maskesi `clip-path` ile: içerik bloğunun üstü gotik bir ark
 * biçiminde kesiliyor. Altın hairline, buz mavisi parlama ve soldan sağa
 * uzayan sert gölgeler (Schatten Bereich — gölge dünyası).
 *
 * ⚠️ UnifrakturMaguntia YALNIZCA burada ve yalnızca "Wandenreich"
 * wordmark'ında. Aile Türkçe diyakritik taşımıyor;
 * `scripts/check-bleach-fonts.mjs` bunu denetliyor.
 */
function WandenreichAtmosphere() {
  return (
    <div className={styles.wandenreich} aria-hidden="true">
      <span className={styles.arch} />
      <span className={styles.frost} />
      <span className={styles.gothicMark} lang="de">
        Wandenreich
      </span>
    </div>
  );
}

const ATMOSPHERES: Record<LayerId, () => React.JSX.Element> = {
  living: LivingAtmosphere,
  "soul-society": SoulSocietyAtmosphere,
  "hueco-mundo": HuecoMundoAtmosphere,
  royal: RoyalAtmosphere,
  wandenreich: WandenreichAtmosphere,
};

/** Katmanın atmosferi — kimlikten seçiliyor */
export function Atmosphere({ layer }: { layer: LayerId }) {
  const Component = ATMOSPHERES[layer];
  return <Component />;
}
