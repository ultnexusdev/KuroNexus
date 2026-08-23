import type { ReactNode } from "react";
import type { BleachWorld } from "@/lib/anime/bleach/types";
import styles from "./WorldSection.module.css";
import world from "./world.module.css";

/**
 * BİR KATMAN.
 *
 * Sayfanın imza mekanizması burada başlıyor: bölüm kendi `data-layer`
 * niteliğini taşıyor ve `globals.css` o niteliğe bağlı olarak BÜTÜN kök
 * token setini yeniden bağlıyor. Kullanıcı aşağı indikçe sayfa katman
 * değiştiriyor — bölümden bölüme değil, boyuttan boyuta.
 *
 * ── SUNUCU BİLEŞENİ ──────────────────────────────────────────────────────
 * Tema değişimi tamamen CSS: nitelik + kalıtım. Hiçbir JS gerekmiyor ve
 * JS kapalıyken de çalışıyor. `DepthRail` yalnızca "hangi katmandayım"
 * göstergesini süren ayrı bir ada.
 *
 * ── NEDEN `id` ZORUNLU ───────────────────────────────────────────────────
 * Derinlik rayı buraya çapa atıyor ve adres paylaşılabilir olmalı
 * (`/anime/bleach#hueco-mundo`). Kimlik katmanın kendisinden türetiliyor,
 * yani ikinci bir liste tutulmuyor.
 */
export const LAYER_IDS = [
  "living",
  "soul-society",
  "hueco-mundo",
  "royal",
  "wandenreich",
] as const satisfies readonly BleachWorld[];

export type LayerId = (typeof LAYER_IDS)[number];

/**
 * AÇIK ZEMİNLİ katmanlar.
 *
 * Bugün tek üye var ve öyle kalması bekleniyor: Hueco Mundo sayfanın tek
 * negatif katmanı ve o cesaret tekil olduğu için değerli. Yine de bir küme
 * — çünkü "açık mı" sorusunu soran her yer (geçit yarığı, ileride ray ve
 * gölgeler) tek bir kaynağa sormalı, kendi listesini tutmamalı.
 */
export const LIGHT_LAYERS: ReadonlySet<LayerId> = new Set<LayerId>([
  "hueco-mundo",
]);

/**
 * DERİN BÖLÜM → hangi katmanın derisini giyiyor.
 *
 * Beş katmanın altında, sayfanın devamında derin bölümler var (`#gotei`,
 * `#hueco`…) ve onlar `WorldSection` kullanmıyor — kendi kabuklarını
 * kuruyorlar. Ama hepsi bir katmanın içinde geçiyor ve derinlik rayı bunu
 * bilmeli.
 *
 * ⚠️ 23 Ağustos 2026'ya kadar bilmiyordu: ray yalnızca beş katmanı
 * gözlüyordu, yani okuyucu derin bölümlerdeyken ray son katmanın
 * (Wandenreich) rengini giyiyordu. P07'de bu görünür bir arıza oldu —
 * sayfa beyaza dönüyor ve ray hâlâ koyu tema token'larıyla çiziliyordu,
 * yani beyaz zeminde okunmuyordu.
 *
 * Liste küçük ve elle tutuluyor: bir bölüm eklendiğinde buraya bir satır.
 */
export const DEEP_SECTION_LAYERS: Record<string, LayerId> = {
  gotei: "soul-society",
  zanpakuto: "soul-society",
  bankai: "soul-society",
  hierarchy: "royal",
  hueco: "hueco-mundo",
  espada: "hueco-mundo",
};

/** Rayda ve başlıklarda kullanılan kanji — katman başına tek kaynak */
export const LAYER_KANJI: Record<LayerId, string> = {
  living: "現世",
  "soul-society": "尸魂界",
  "hueco-mundo": "虚圏",
  royal: "霊王宮",
  wandenreich: "見えざる帝国",
};

export function WorldSection({
  layer,
  eyebrow,
  title,
  atmosphere,
  children,
  className,
}: {
  layer: LayerId;
  /** Jost caps — İngilizce sinematik satır ("WORLD OF THE LIVING") */
  eyebrow?: string;
  /** Shippori — katmanın adı ("Karakura") */
  title?: string;
  /**
   * Katmanın kendi görsel grameri (yağmur, mürekkep, boşluk…).
   *
   * Kabuğun DIŞINDA tutuluyor: `WorldSection` beş katmanın ortak
   * iskeleti, atmosfer ise her katmanı diğerlerinden ayıran şey. İkisini
   * birleştirmek, kabuğu beş dallı bir koşula çevirirdi.
   */
  atmosphere?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={layer}
      data-layer={layer}
      className={[styles.layer, className].filter(Boolean).join(" ")}
      aria-labelledby={title ? `${layer}-title` : undefined}
      /* Ray buraya odak taşıyor (`section.focus()`). Odaklanabilir ama
         sekme sırasına GİRMİYOR: klavyeyle gezen biri her katmanda
         gereksiz bir durak yaşamasın. */
      tabIndex={-1}
    >
      {atmosphere}

      {/* Dev kanji katmanın arkasında: okunması değil hissedilmesi için */}
      <span className={world.ghostKanji} aria-hidden="true">
        {LAYER_KANJI[layer]}
      </span>

      <div className={styles.inner}>
        {eyebrow ? (
          <p className={`${world.eyebrow} ${styles.eyebrow}`} lang="en">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 id={`${layer}-title`} className={world.section}>
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}
