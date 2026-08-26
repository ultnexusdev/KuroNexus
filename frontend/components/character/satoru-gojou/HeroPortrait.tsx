import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  GOJO_CURATOR,
  GOJO_HERO_ASPECT,
  GOJO_HERO_FIGURE_ALT,
  GOJO_HERO_SLOTS,
  GOJO_ID,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import styles from "./GojoExperience.module.css";

/**
 * HERO · İKİ DURUMLU PORTRE.
 *
 * Gözbağlı kare ve Rikugan karesi aynı kutuda üst üste; mod değişince
 * aralarında çapraz geçiş oluyor.
 *
 * ══ 1 · İKİSİ DE HER ZAMAN DOM'DA ══════════════════════════════════════
 * Koşullu çizim YOK. Moda göre birini çizip diğerini sökmek DOM düğümünü
 * değiştirir; `next/image` yeniden bağlanır, tarayıcı kareyi yeniden ister
 * ve ilk geçişte boş bir kare görünür. İllüzyon tam orada kırılır.
 *
 * ══ 2 · GEÇİŞ YALNIZCA OPAKLIK ═════════════════════════════════════════
 * Katmanların hiçbiri JS durumu tutmuyor; opaklığı kökteki `data-mode`
 * sürüyor (CSS). Süre `--g-swap` — global mod geçişiyle AYNI değişken,
 * yani 400ms ve `prefers-reduced-motion` altında 0ms. İki yerde iki ayrı
 * süre tanımlamak zamanla ayrışırdı.
 *
 * ══ 3 · İKİSİ DE ÖN YÜKLENİYOR ═════════════════════════════════════════
 * İkisinde de `priority` var — eşit öncelik. Rikugan karesi ilk geçişte
 * ağdan istenmiyor; sayfa açılırken zaten inmiş oluyor. `display: none`
 * ya da `visibility: hidden` KULLANILMIYOR: ikisi de tarayıcının kareyi
 * indirmesini erteleyebilir. Saydam bir görsel yine de indiriliyor.
 *
 * ══ 4 · TEK ORAN KAYNAĞI ═══════════════════════════════════════════════
 * Yığın kutusu ve üç katman `GOJO_HERO_ASPECT` sabitini okuyor. İki kare
 * arasında piksel kayması ve yüklenirken layout kayması yok.
 *
 * ══ 5 · AURA İSTEĞE BAĞLI ══════════════════════════════════════════════
 * `glow` katmanı `optional`: yuva boşsa HİÇ çizilmiyor ve manifesto
 * paneli de göstermiyor — eksikliği bir kusur değil bir tercih.
 *
 * ══ 6 · İKİ KARE TEK FİGÜR ═════════════════════════════════════════════
 * Kap `role="img"` ve tek bir ad taşıyor; katmanlar `aria-hidden`.
 * Modun hangisi olduğunu mod düğmesi `aria-pressed` ile zaten bildiriyor.
 *
 * ⚠️ Yükleyiciler yığının İÇİNDE değil: üst üste binen üç yükleyici hem
 * tıklanamaz hem anlamsız olurdu. Üçü de aşağıdaki yönetici şeridinde.
 */
export function HeroPortrait({
  locale,
  isAdmin,
  images,
}: {
  locale: string;
  isAdmin: boolean;
  images: Map<string, string>;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  const layers = [
    {
      slot: GOJO_HERO_SLOTS.blindfold,
      cls: styles.heroLayerBlind,
      glyph: "五条悟",
      optional: false,
    },
    {
      slot: GOJO_HERO_SLOTS.sixeyes,
      cls: styles.heroLayerSix,
      glyph: "六眼",
      optional: false,
    },
    {
      slot: GOJO_HERO_SLOTS.glow,
      cls: styles.heroLayerGlow,
      glyph: "光",
      optional: true,
    },
  ];

  return (
    <>
      <div
        className={styles.heroStack}
        style={{ "--slot-ratio": GOJO_HERO_ASPECT } as React.CSSProperties}
        role="img"
        aria-label={say(GOJO_HERO_FIGURE_ALT)}
      >
        {layers.map((layer) => (
          <CuratedImage
            key={layer.slot.key}
            className={`${styles.heroLayer} ${layer.cls}`}
            slotId={layer.slot.key}
            spec={say(layer.slot.spec)}
            aspect={GOJO_HERO_ASPECT}
            src={images.get(layer.slot.key) ?? null}
            isAdmin={isAdmin}
            characterId={GOJO_ID}
            curatorLabel={say(GOJO_CURATOR.upload)}
            statusLabel={say(GOJO_CURATOR.missing)}
            glyph={layer.glyph}
            sizes="368px"
            /* Kadrajı yığın veriyor. */
            fill
            /* Üçü de yığının içinde düzenlenemez; şerit aşağıda. */
            noEdit
            /* Eşit öncelik: ikinci kare ilk geçişte ağdan istenmiyor. */
            priority
            optional={layer.optional}
            /* Katmanlar tek figürün parçası: ad kapta, burada değil. */
            ariaHidden
          />
        ))}
      </div>

      {/* Yönetici şeridi — üç yuvanın tek erişim noktası. */}
      {isAdmin ? (
        <div className={styles.heroEditors}>
          {layers.map((layer) => (
            <div key={layer.slot.key}>
              <p className={styles.heroEditorNote}>
                <code>{layer.slot.key}</code> — {say(layer.slot.spec)}
              </p>
              <CuratorSlot
                characterId={GOJO_ID}
                slot="ABILITY"
                abilityName={layer.slot.key}
                label={say(GOJO_CURATOR.upload)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
