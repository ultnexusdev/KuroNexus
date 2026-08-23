import styles from "./HollowMask.module.css";

/**
 * MASKE — Hollow evriminin yedi durumu.
 *
 * ── NEDEN TEK PARÇA PATH ─────────────────────────────────────────────────
 * Brief: "Ekranın ortasında tek bir Hollow maskesi (SVG, tek parça path)."
 * Göz ve ağız ayrı renkli parçalar DEĞİL, aynı `d` dizesinin içinde
 * `fill-rule="evenodd"` ile açılan oyuklar. Böylece maske gerçekten tek bir
 * siluet: zemin neyse gözün içi de o. Hueco Mundo'nun beyazı deliklerden
 * geçiyor ve maske "kesilmiş" görünüyor — boyanmış değil.
 *
 * Bunun ikinci faydası tema: negatif katmanda `--world-paper` siyah,
 * `--world-ink` beyaz. Oyuklara renk yazsaydık iki değeri de elle takip
 * etmek gerekirdi (kural 16'nın tam olarak yasakladığı şey).
 *
 * ── DURUMLAR BİR AĞAÇ DEĞİL, BİR KIRILMA ─────────────────────────────────
 * 整 zincir (maske yok) → 虚 maske tam → 最下大虚 devleşir → 中級大虚
 * daralır, gözde bilinç ışığı → 最上大虚 insansılaşır, ilk çatlaklar →
 * 破面 kırılır, altından yüz çıkar → 十刃 kalan parça + on kılıç.
 *
 * ⚠️ Hepsi `aria-hidden`: anlatıyı aşamanın METNİ taşıyor. Ekran okuyucu
 * yedi kez "maske" duymuyor.
 */

/* ══════════════════════════════════════════════════════════════════
   YARDIMCILAR — `d` dizesi üreten küçük parçalar
   ══════════════════════════════════════════════════════════════════ */

const n = (value: number) => Number(value.toFixed(1));

/**
 * Ağız: beyaz bir bant ve içinden yukarı bakan dişler.
 *
 * `evenodd` sayesinde bant oyuk (zemin rengi), dişler tekrar dolu oluyor —
 * yani klasik Hollow sırıtışı tek bir alt-yol dizisiyle çiziliyor.
 */
function mouth(x0: number, x1: number, top: number, bottom: number, count: number) {
  const step = (x1 - x0) / count;
  let d = `M${n(x0)} ${n(top)}H${n(x1)}V${n(bottom)}H${n(x0)}Z`;
  for (let i = 0; i < count; i += 1) {
    const a = x0 + i * step;
    d += `M${n(a)} ${n(bottom)}L${n(a + step / 2)} ${n(top)}L${n(a + step)} ${n(bottom)}Z`;
  }
  return d;
}

/** Göz oyuğu — eğik bir dörtgen. `dir` 1 sol, -1 sağ. */
function eye(cx: number, cy: number, w: number, h: number, dir: number) {
  return (
    `M${n(cx - (dir * w) / 2)} ${n(cy + h / 2)}` +
    `L${n(cx + (dir * w) / 2)} ${n(cy - h / 2)}` +
    `L${n(cx + (dir * w) / 2)} ${n(cy + h / 2)}` +
    `L${n(cx - (dir * w) / 2)} ${n(cy + h * 1.1)}Z`
  );
}

/* ══════════════════════════════════════════════════════════════════
   整 PLUS — maske yok, yalnızca zincir
   ══════════════════════════════════════════════════════════════════ */

/**
 * Bu aşamada gösterilecek bir maske YOK ve boşluk bilinçli.
 *
 * 因果の鎖: yukarıdan sarkan halkalar. Üsttekiler sağlam, aşağı indikçe
 * çürüyor — son üçü kopmuş parçalar hâlinde savruluyor. 侵食'ün kendisi
 * bu: zincir aşağıdan değil, göğse doğru yenir.
 */
function PlusChain() {
  const links = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g className={styles.line}>
      {links.map((i) => {
        const y = 30 + i * 30;
        const decayed = i > 4;
        return (
          <ellipse
            key={i}
            cx={150 + (decayed ? (i - 4) * (i % 2 ? 9 : -7) : 0)}
            cy={y}
            rx={i % 2 === 0 ? 15 : 8}
            ry={17}
            transform={decayed ? `rotate(${(i - 4) * 11} 150 ${y})` : undefined}
            strokeWidth={3}
            strokeDasharray={decayed ? `${30 - (i - 4) * 8} 9` : undefined}
            opacity={decayed ? 1 - (i - 4) * 0.22 : 1}
          />
        );
      })}
      {/* Kopan iki halka: zincirin gövdeden ayrıldığı an */}
      <path d="M196 254l14 16M212 244l10 20" strokeWidth={3} opacity={0.5} />
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   虚 HOLLOW — maske tam
   ══════════════════════════════════════════════════════════════════ */

const HOLLOW_D =
  // Dış plaka: üstü yuvarlak, çenesi sivri
  "M150 24c58 0 94 46 94 108 0 78-46 148-94 148S56 210 56 132 92 24 150 24Z" +
  eye(112, 122, 52, 26, 1) +
  eye(188, 122, 52, 26, -1) +
  mouth(86, 214, 176, 222, 7);

function HollowFull() {
  return <path className={styles.plate} d={HOLLOW_D} fillRule="evenodd" />;
}

/* ══════════════════════════════════════════════════════════════════
   最下大虚 GILLIAN — maske devleşir
   ══════════════════════════════════════════════════════════════════ */

/**
 * Aynı maske, ama çerçeveyi taşıracak kadar büyük: tepesi kadrajın
 * dışında kalıyor. Uzun sivri burun Menos'un imzası.
 *
 * "Hepsi birbirinin aynısıdır" cümlesi de çizimde: arkada iki soluk
 * kopya daha duruyor, hiçbiri diğerinden ayırt edilemiyor.
 */
function Gillian() {
  const face =
    "M150 -70c66 0 104 60 104 140 0 96-48 172-104 172S46 166 46 70 84-70 150-70Z" +
    eye(114, 96, 46, 22, 1) +
    eye(186, 96, 46, 22, -1) +
    // Uzun burun: çeneden aşağı sivrilen dar üçgen
    "M150 150l26 96-26 40-26-40Z" +
    mouth(96, 204, 168, 200, 5);

  return (
    <>
      <g className={styles.echo} aria-hidden="true">
        <path d={face} fillRule="evenodd" transform="translate(-64 40) scale(0.72)" />
        <path d={face} fillRule="evenodd" transform="translate(232 40) scale(0.72)" />
      </g>
      <path className={styles.plate} d={face} fillRule="evenodd" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   中級大虚 ADJUCHAS — maske daralır, gözde bilinç ışığı
   ══════════════════════════════════════════════════════════════════ */

/**
 * Gövde küçülüyor, biçim hayvana kayıyor: dar plaka, iki boynuz.
 * Gözlerin içindeki iki nokta bölümün tek renkli işareti — Hueco
 * Mundo'nun aksanı `--world-glow` (cero kızılı, asit yeşili DEĞİL).
 */
function Adjuchas() {
  const face =
    "M150 40c44 0 72 38 72 92 0 68-34 130-72 130S78 200 78 132 106 40 150 40Z" +
    eye(120, 128, 40, 22, 1) +
    eye(180, 128, 40, 22, -1) +
    mouth(100, 200, 180, 218, 5);

  return (
    <>
      {/* Boynuzlar: plakadan önce, arkasından çıkıyormuş gibi */}
      <path
        className={styles.plate}
        d="M112 56 78 6l46 26ZM188 56l34-50-46 26Z"
      />
      <path className={styles.plate} d={face} fillRule="evenodd" />
      <g className={styles.spark}>
        <circle cx={124} cy={126} r={5} />
        <circle cx={176} cy={126} r={5} />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   最上大虚 VASTO LORDE — insansılaşır, ilk çatlaklar
   ══════════════════════════════════════════════════════════════════ */

/**
 * Güç arttıkça biçim küçülüyor: plaka insan yüzü oranına iniyor, boynuz
 * bir taca dönüşüyor, dişler inceliyor. Çatlaklar burada başlıyor ama
 * henüz kırılma yok — bunlar zemin renginde ince yarıklar, yani maskeden
 * ARTIK EKSİLEN yerler.
 */
function VastoLorde() {
  const face =
    "M150 52c38 0 62 32 62 82 0 62-28 116-62 116s-62-54-62-116 24-82 62-82Z" +
    eye(126, 132, 32, 18, 1) +
    eye(174, 132, 32, 18, -1) +
    mouth(114, 186, 186, 214, 4);

  return (
    <>
      <path
        className={styles.plate}
        d="M124 62 108 22l24 24ZM150 54l0-40 12 38ZM176 62l16-40-24 24Z"
      />
      <path className={styles.plate} d={face} fillRule="evenodd" />
      {/* Catlaklar: maskenin uzerinde zemin renginde ince yariklar */}
      <path
        className={styles.crack}
        d="M118 78l14 26-8 20 16 22M186 92l-12 30 10 18-14 24M150 60l-6 22 8 14"
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   破面 ARRANCAR — maske kırılır, altından yüz çıkar
   ══════════════════════════════════════════════════════════════════ */

/**
 * Bölümün dönüm noktası. Plaka artık bütün değil: sol üstte kırık bir
 * miğfer parçası kaldı (Ulquiorra'nın kaydı) ve altından ince çizgili bir
 * insan yüzü çıkıyor. Sağa savrulan parçalar hâlâ havada.
 *
 * ⚠️ Yüz DOLU değil ÇİZGİ: Arrancar'ın yeni hâli bir siluet değil bir
 * kişi. Bölüm boyunca dolu siyah olan şey burada ilk kez içini gösteriyor.
 */
function Arrancar() {
  return (
    <>
      {/* Insan yuzu: ince kontur */}
      <path
        className={styles.line}
        d="M150 56c36 0 58 30 58 78 0 60-26 112-58 112s-58-52-58-112 22-78 58-78Z"
        strokeWidth={2}
      />
      <path
        className={styles.line}
        d="M118 132h26M156 132h26M132 196q18 10 36 0"
        strokeWidth={2}
      />

      {/* Kalan maske parcasi: sol ust, kirik boynuzlu migfer */}
      <path
        className={styles.plate}
        d="M92 128c-4-44 14-74 44-80l16 4-10 26-8-6-14 18 6 12-16 10 4 16-22-10Zm38-84L102 8l34 22Z"
      />

      {/* Savrulan parcalar */}
      <g className={styles.shard}>
        <path d="M214 76l30-18-12 30Z" />
        <path d="M236 122l26 6-20 18Z" />
        <path d="M206 40l18-22 2 24Z" />
        <path d="M244 168l20 14-24 6Z" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   十刃 ESPADA — kalan parça + on kılıç
   ══════════════════════════════════════════════════════════════════ */

/**
 * Kalan maske parçası küçüldü, yüz neredeyse tamamen açık. Altta on kısa
 * dikey iz: 十刃 — "on kılıç". İlki kalın, çünkü numara küçüldükçe güç
 * büyüyor ve sıfır/bir en üstte duruyor.
 *
 * ⚠️ Buraya bir RAKAM dövmesi çizilmedi. Herhangi bir rakam belirli bir
 * Espada'yı işaret ederdi ve bu bölüm henüz hiçbirini anlatmıyor (kadro
 * ayrı bir kayıt). On kılıç sınıfın kendisini gösteriyor, bir kişiyi değil.
 */
function Espada() {
  return (
    <>
      <path
        className={styles.line}
        d="M150 46c36 0 58 30 58 78 0 60-26 112-58 112s-58-52-58-112 22-78 58-78Z"
        strokeWidth={2}
      />
      <path
        className={styles.line}
        d="M118 122h26M156 122h26M130 186q20 12 40 0"
        strokeWidth={2}
      />

      {/* Kucuk parca: sol sakak */}
      <path className={styles.plate} d="M96 112c-2-30 8-52 28-60l10 10-14 16 4 12-14 8 2 14Z" />

      {/* On kilic */}
      <g className={styles.blades}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <rect
            key={i}
            x={62 + i * 19}
            y={262}
            width={i === 0 ? 7 : 3}
            height={i === 0 ? 32 : 24}
          />
        ))}
      </g>
    </>
  );
}

const STAGE_ART: Record<string, () => React.JSX.Element> = {
  plus: PlusChain,
  hollow: HollowFull,
  gillian: Gillian,
  adjuchas: Adjuchas,
  "vasto-lorde": VastoLorde,
  arrancar: Arrancar,
  espada: Espada,
};

export function HollowMask({ stage }: { stage: string }) {
  const Art = STAGE_ART[stage];
  if (!Art) return null;
  return (
    <svg
      className={styles.mask}
      viewBox="0 0 300 300"
      role="presentation"
      aria-hidden="true"
    >
      <Art />
    </svg>
  );
}
