import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { pick, type CharacterOverlay } from "@/lib/characters/types";
import type { CharacterImage } from "@/lib/api/types";
import { CuratorSlot } from "./CuratorSlot";
import { CharacterImageDelete } from "./CharacterImageDelete";
import styles from "./CharacterSections.module.css";

/**
 * Karakter sayfasının elle tasarlanan bölümleri.
 *
 * Hepsi **veriyle sürülüyor**: başlıklar bile (`abilities.title`) içerikten
 * geliyor. Bleach'te "Zanpakutō" yazan kutu Naruto'da "Jutsu" yazacak ve
 * tek satır kod değişmeyecek.
 *
 * Her bölüm kendi verisi yoksa `null` döndürüyor — bir karakterin yalnızca
 * replikleri varsa sayfada yalnızca replikler görünür, boş başlık kalmaz.
 *
 * Sunucu bileşenleri: hiçbiri durum tutmuyor. Tek istisna galeri yükleyicisi,
 * o kendi dosyasında ve yalnızca kürator modunda iniyor.
 */

const CHARACTER_HREF = "/dark-stories/category/anime/karakterler";

/** Hero'daki alıntı — karakterin kendi sözü. */
export function Epigraph({ overlay }: { overlay: CharacterOverlay }) {
  const locale = useLocale();
  if (!overlay.epigraph) {
    return null;
  }
  return <p className={styles.epigraph}>{pick(overlay.epigraph, locale)}</p>;
}

/** Hero'daki etiketler ("Shinigami", "11. Bölük Kaptanı"). */
export function TagRow({ overlay }: { overlay: CharacterOverlay }) {
  const locale = useLocale();
  if (!overlay.tags?.length) {
    return null;
  }
  return (
    <ul className={styles.tagRow}>
      {overlay.tags.map((tag) => (
        <li key={tag.tr} className={styles.tag}>
          {pick(tag, locale)}
        </li>
      ))}
    </ul>
  );
}

/** Güç profili — etiket, değer ve dolan çubuk. */
export function StatBars({ overlay }: { overlay: CharacterOverlay }) {
  const locale = useLocale();
  const stats = overlay.stats;
  if (!stats?.rows.length) {
    return null;
  }

  // Başlığı bölüm KENDİ çizmiyor: dosya sayfasındaki bütün başlıklar aynı
  // `.sectionTitle` kuralından geçiyor ve buraya ikinci bir başlık stili
  // koymak iki farklı başlık dili üretirdi. Metni sayfa okuyor (`stats.title`).
  return (
    <ul className={styles.stats}>
      {stats.rows.map((row) => {
          const percent = Math.max(
            0,
            Math.min(100, Math.round((row.value / row.max) * 100)),
          );
          const isMax = row.value >= row.max;
          return (
            <li key={row.label.tr}>
              <div className={styles.statHead}>
                <span className={styles.statLabel}>
                  {pick(row.label, locale)}
                </span>
                <span className={styles.statValue}>
                  {row.value}/{row.max}
                </span>
              </div>
              {/* Çubuk yalnızca görsel: değer zaten yanında yazılı, o yüzden
                  erişilebilirlik ağacından çıkarılıyor (çift okuma olmasın) */}
              <span className={styles.statTrack} aria-hidden>
                <span
                  className={`${styles.statFill} ${isMax ? styles.statFillMax : ""}`}
                  style={{ width: `${percent}%` }}
                />
              </span>
            </li>
          );
      })}
    </ul>
  );
}

/** Yetenek kartları — Zanpakutō / Jutsu / Quirk, başlık veriden gelir. */
export function AbilityCards({
  overlay,
  characterId,
  imageFor,
  isAdmin = false,
}: {
  overlay: CharacterOverlay;
  characterId: number;
  /** Kürator tarafından yüklenmiş görsel; yoksa koddaki varsayılan */
  imageFor: (abilityName: string) => string | null;
  isAdmin?: boolean;
}) {
  const locale = useLocale();
  const abilities = overlay.abilities;
  if (!abilities?.cards.length) {
    return null;
  }

  return (
    <ul className={styles.abilities}>
      {abilities.cards.map((card) => {
        // Kürator yüklemesi koddaki varsayılanı ezer
        const shot = imageFor(card.name) ?? card.image ?? null;
        return (
        <li key={card.name} className={styles.ability}>
          {/* Formun kendi görseli. Yoksa kart görselsiz çiziliyor —
              yer tutucu bir kutu koymak "eksik" hissi verirdi. */}
          {shot ? (
            <span className={styles.abilityShot}>
              <Image
                src={apiUrl(shot)}
                alt={card.name}
                fill
                sizes="(max-width: 820px) 92vw, 46vw"
                className={styles.abilityShotImg}
                /* Kendi yüklememiz `remotePatterns` içinde: Next onu kutuya
                   göre yeniden boyutlandırabiliyor. AniList adresleri listede
                   olmadığı için orada `unoptimized` şart. */
                unoptimized={!isLocalUpload(shot)}
              />
            </span>
          ) : null}
          <div className={styles.abilityBody}>
            <h3 className={styles.abilityName}>{card.name}</h3>
            {card.release ? (
              <p className={styles.abilityRelease}>
                “{pick(card.release, locale)}”
              </p>
            ) : null}
            <p className={styles.abilitySummary}>{pick(card.summary, locale)}</p>
            {card.traits.length > 0 ? (
              <ul className={styles.abilityTraits}>
                {card.traits.map((trait) => (
                  <li key={trait.tr} className={styles.abilityTrait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>
            ) : null}
            {/* Yükleme yuvası kartın ALTINDA: hangi görselin hangi forma ait
                olduğu ("Shikai — Nozarashi" / "Bankai") yuvanın adında yazılı,
                böylece iki kart karışmıyor. */}
            {isAdmin ? (
              <CuratorSlot
                characterId={characterId}
                slot="ABILITY"
                abilityName={card.name}
                label={card.name}
              />
            ) : null}
          </div>
        </li>
        );
      })}
    </ul>
  );
}

/** Adı geçen karakterlerin portrelerini id'ye göre bulmak için. */
export type CharacterCardMap = Map<number, CharacterCardLite>;

export interface CharacterCardLite {
  characterId: number;
  name: string;
  image: string | null;
}

/** Yuvarlak portre; görsel yoksa adın baş harfi. */
function Face({
  card,
  name,
  faceClass,
  imgClass,
  fallbackClass,
  size,
}: {
  card: CharacterCardLite | undefined;
  name: string;
  faceClass: string;
  imgClass: string;
  fallbackClass: string;
  size: string;
}) {
  return (
    <span className={faceClass}>
      {card?.image ? (
        <Image
          src={card.image}
          alt=""
          fill
          sizes={size}
          className={imgClass}
          unoptimized
        />
      ) : (
        <span className={fallbackClass} aria-hidden>
          {name.slice(0, 1)}
        </span>
      )}
    </span>
  );
}

/** Önemli savaşlar — rakip, ark ve sonuç. */
export function BattleList({
  overlay,
  cards,
}: {
  overlay: CharacterOverlay;
  cards: CharacterCardMap;
}) {
  const locale = useLocale();
  const t = useTranslations("character.outcome");
  if (!overlay.battles?.length) {
    return null;
  }

  return (
    <ul className={styles.battles}>
      {overlay.battles.map((battle) => (
        <li key={battle.opponent} className={styles.battle}>
          <Face
            card={
              battle.opponentCharacterId
                ? cards.get(battle.opponentCharacterId)
                : undefined
            }
            name={battle.opponent}
            faceClass={styles.battleFace}
            imgClass={styles.battleFaceImg}
            fallbackClass={styles.battleFaceFallback}
            size="44px"
          />
          <span className={styles.battleWho}>
            <span className={styles.battleName}>
              {battle.opponentCharacterId ? (
                <Link
                  href={`${CHARACTER_HREF}/${battle.opponentCharacterId}`}
                  className={styles.battleLink}
                >
                  {battle.opponent}
                </Link>
              ) : (
                battle.opponent
              )}
            </span>
            <span className={styles.battleArc}>{pick(battle.arc, locale)}</span>
          </span>
          <span
            className={`${styles.battleOutcome} ${
              battle.outcome === "WIN"
                ? styles.battleWin
                : battle.outcome === "LOSS"
                  ? styles.battleLoss
                  : ""
            }`}
          >
            {t(battle.outcome)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** İkonik replikler. */
export function QuoteList({ overlay }: { overlay: CharacterOverlay }) {
  const locale = useLocale();
  if (!overlay.quotes?.length) {
    return null;
  }

  return (
    <ul className={styles.quotes}>
      {overlay.quotes.map((quote) => (
        <li key={quote.text.tr} className={styles.quote}>
          {pick(quote.text, locale)}
          {quote.source ? (
            <span className={styles.quoteSource}>
              {pick(quote.source, locale)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** İzleme / okuma rehberi. */
export function GuideList({
  entries,
}: {
  entries: NonNullable<CharacterOverlay["guide"]>["anime"];
}) {
  const locale = useLocale();
  if (!entries?.length) {
    return null;
  }

  return (
    <div className={styles.guide}>
      {entries.map((entry) => (
        <div key={entry.range.tr} className={styles.guideRow}>
          <p className={styles.guideRange}>{pick(entry.range, locale)}</p>
          <p className={styles.guideNote}>{pick(entry.note, locale)}</p>
        </div>
      ))}
    </div>
  );
}

/** İlişkiler. */
export function BondList({
  overlay,
  cards,
}: {
  overlay: CharacterOverlay;
  cards: CharacterCardMap;
}) {
  const locale = useLocale();
  if (!overlay.bonds?.length) {
    return null;
  }

  return (
    <ul className={styles.bonds}>
      {overlay.bonds.map((bond) => (
        <li key={bond.name} className={styles.bond}>
          <Face
            card={bond.characterId ? cards.get(bond.characterId) : undefined}
            name={bond.name}
            faceClass={styles.bondFace}
            imgClass={styles.bondFaceImg}
            fallbackClass={styles.bondFaceFallback}
            size="56px"
          />
          <div className={styles.bondText}>
            <h3 className={styles.bondName}>
              {bond.characterId ? (
                <Link
                  href={`${CHARACTER_HREF}/${bond.characterId}`}
                  className={styles.bondLink}
                >
                  {bond.name}
                </Link>
              ) : (
                bond.name
              )}
            </h3>
            <p className={styles.bondSummary}>{pick(bond.summary, locale)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Galeri.
 *
 * Kaynak öncelikli: kürator veritabanına bir görsel eklediyse galeri
 * TAMAMEN oradan çiziliyor; hiç eklenmemişse koddaki varsayılan liste
 * kullanılıyor. İkisini birleştirmek, küratörün sildiği bir görselin
 * kodda kalıp silinemez görünmesine yol açardı.
 */
export function Gallery({
  overlay,
  stored,
  isAdmin = false,
}: {
  overlay: CharacterOverlay;
  stored: CharacterImage[];
  isAdmin?: boolean;
}) {
  const locale = useLocale();

  const items =
    stored.length > 0
      ? stored.map((image) => ({
          key: image.id,
          id: image.id as string | null,
          src: image.url,
          alt: image.altText ?? "",
          caption: image.caption,
        }))
      : (overlay.gallery ?? []).map((image) => ({
          key: image.src,
          id: null,
          src: image.src,
          alt: pick(image.alt, locale),
          caption: image.caption ? pick(image.caption, locale) : null,
        }));

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={styles.gallery}>
      {items.map((item) => (
        <li key={item.key}>
          {/* Kutu bir bağlantı: tıklayınca görselin TAM BOYU açılıyor.
              Izgaradaki küçük hâl kırpılmış ve küçültülmüş; asıl dosyayı
              görmek isteyen yeni sekmede tamamını alıyor. Lightbox yerine
              düz bağlantı seçildi — sayfaya JS eklemeden aynı işi görüyor. */}
          <a
            href={apiUrl(item.src)}
            className={styles.galleryItem}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.alt || undefined}
          >
            <Image
              src={apiUrl(item.src)}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 45vw, 220px"
              className={styles.galleryImg}
              unoptimized={!isLocalUpload(item.src)}
            />
          </a>
          {item.caption ? (
            <span className={styles.galleryCaption}>{item.caption}</span>
          ) : null}
          {/* Silme yalnızca veritabanı kayıtlarında: koddaki varsayılanlar
              buradan kaldırılamaz, onlar veri dosyasında duruyor. */}
          {isAdmin && item.id ? (
            <span data-curator-slot>
              <CharacterImageDelete id={item.id} />
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
