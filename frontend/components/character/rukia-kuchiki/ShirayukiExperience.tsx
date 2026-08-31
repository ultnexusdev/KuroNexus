import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  RUKIA_ALT,
  RUKIA_ARTS,
  RUKIA_BONDS,
  RUKIA_BOND_UI,
  RUKIA_CLOSING,
  RUKIA_COMPANION_SLOT,
  RUKIA_CRAFT,
  RUKIA_CRUMB,
  RUKIA_DANCES,
  RUKIA_DANCE_UI,
  RUKIA_FRAME_EMPTY,
  RUKIA_GAPS,
  RUKIA_HERO,
  RUKIA_ID,
  RUKIA_IDENTITY,
  RUKIA_IMAGE_KEYS,
  RUKIA_MISSING_NOTE,
  RUKIA_MOON,
  RUKIA_PORTRAIT,
  RUKIA_PORTRAIT_SLOT,
  RUKIA_SECTIONS,
  RUKIA_SITE_URL,
  RUKIA_SLOT_LABELS,
  RUKIA_SLOT_SIZES,
  RUKIA_SLOT_SPECS,
  RUKIA_TIMELINE,
  RUKIA_WORLD_DOORS,
} from "@/lib/characters/rukia-kuchiki-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { HouseCrest, SnowCrystal } from "./RukiaGlyphs";
import { SnowShell } from "./SnowShell";
import { ThreeDances, type DanceCopy } from "./ThreeDances";
import styles from "./ShirayukiExperience.module.css";

/**
 * Rukia Kuchiki — "Sode no Shirayuki" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/6 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: KAR SİLMEZ, ÖRTER.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Bu dalganın diğer beş sayfası genişliyor, zikzak çiziyor, ızgaraya
 * oturuyor. Bu sayfa DAR ve ORTALANMIŞ tek bir kolon: bölüm başlıkları tam
 * ortada, çok geniş satır aralığında bir mincho; gövde metni ise kolonun
 * içinde hafifçe SOLA kaçık duruyor — kar üstünde yürüyen birinin izi gibi.
 * Bölümlerin arasında kar birikintisi gibi genişleyen yatay bantlar var:
 * kolon 30rem'de sabit kalırken bantlar 34 → 40 → 46rem'e açılıyor.
 *
 * Yayındaki dört Bleach sayfasıyla karışmaması özellikle gözetildi:
 * Ichigo'nun maske çatlağı, Urahara'nın çekmece ızgarası, Aizen'in iki
 * gerçeklik katmanı ve Kenpachi'nin çentikli rayı — dördü de KOYU kalıyor
 * ve dördünün de mekaniği bir seçici. Buradaki mekanik sayfanın ZEMİNİNİ
 * değiştiriyor.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (hane arması filigranı + madalyon portre + boş hero kadrajı)
 *   2 mod düğmesi — "Ay ışığı", `SnowShell` içinde (durum orada)
 *   3 künye şeridi (dokuz satır, ikisi bilerek "kayıtta yok")
 *   4 güç laboratuvarı: üç ağırlık (Zanpakutō/Shikai/Bankai) + dört el işi
 *     (Asauchi/Hadō/Bakudō/Shunpo)
 *   5 üç dans — SAYFANIN KALBİ (`ThreeDances`)
 *   6 beş durak (dönem etiketli kader çizelgesi)
 *   7 bağlar + evren kapıları + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   SnowShell   — kök öğe, "Ay ışığı" modu, kar taneciği katmanı, context
 *   ThreeDances — üç dans mekaniği
 * `RukiaGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında). Büyük hero karesi ve on yedi sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var.
 *
 * ⚠️ Boş kadrajın içindeki üretim metadatası (`1600×900 · webp`) yalnızca
 * `isAdmin` iken çiziliyor. Ziyaretçinin gördüğü boşluk YAZISIZ — Dalga 1
 * denetiminin birinci dersi.
 */
export function ShirayukiExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const faces = companionPortraits(companions);

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız, o yüzden `unoptimized` hiç yazılmıyor
     (FAZ 2 §3). AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? RUKIA_PORTRAIT.src;

  const name = detail.character.name || RUKIA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? RUKIA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? RUKIA_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(RUKIA_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(RUKIA_SLOT_LABELS[key], locale),
    spec: pick(RUKIA_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Kadraj boşken de duruyor — ama ziyaretçi için YAZISIZ bir yüzey olarak.
   * Üretim metadatası (`geniş kadraj · 1600×900 · webp`) yalnızca küratöre
   * gösteriliyor; on sekiz kadrajın hepsi boşken ziyaretçiye on sekiz kez
   * ölçü okutmak hem sayfanın hem ekran okuyucunun işini bozardı.
   *
   * ⚠️ Dolu kadrajda başlık/kaydırma yok: yüklenen görselin ÜSTÜNE yazı
   * konmuyor. Yazı gerekseydi araya perde koymak gerekirdi (kontrast betiği
   * görselin üstünü ölçemiyor); bu sayfa o riski hiç almıyor — bütün metin
   * kadrajın DIŞINDA.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <div className={styles.frameSlot} data-filled={scene ? "true" : "false"}>
          <figure className={`${styles.frame} ${shapeClass}`}>
            {scene ? (
              <Image
                src={scene}
                alt={`${pick(RUKIA_ALT.scenePrefix, locale)} ${pick(
                  RUKIA_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 40rem) 92vw, 30rem"
              />
            ) : isAdmin ? (
              <figcaption className={styles.frameCaption} data-curator-slot>
                <span className={styles.frameCaptionWord}>
                  {pick(RUKIA_FRAME_EMPTY, locale)}
                </span>
                <span className={styles.frameCaptionSpec}>
                  {pick(RUKIA_SLOT_SPECS[key], locale)}
                </span>
              </figcaption>
            ) : null}
          </figure>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={RUKIA_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(RUKIA_SLOT_LABELS[key], locale)}
            size={RUKIA_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Bölümler arası kar birikintisi bandı — üç genişlik kademesi. */
  const drift = (band: "1" | "2" | "3") => (
    <span className={styles.drift} data-band={band} aria-hidden>
      <SnowCrystal className={styles.driftCrystal} armClassName={styles.driftArm} />
    </span>
  );

  const dances: DanceCopy[] = RUKIA_DANCES.map((dance) => ({
    key: dance.key,
    call: dance.call,
    reading: dance.reading,
    name: pick(dance.name, locale),
    summary: pick(dance.summary, locale),
    layerNote: pick(dance.layerNote, locale),
    frame: frame(dance.imageKey, styles.frameTall),
  }));

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: hane arması (elle çizilmiş SVG, ince kontur) ve üstünde
     袖白雪. İkisi de `aria-hidden` — dekoratif. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(RUKIA_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="ruk-name">
        <span className={styles.crest} aria-hidden>
          <HouseCrest
            className={styles.crestArt}
            ringClassName={styles.crestRing}
            petalClassName={styles.crestPetal}
            coreClassName={styles.crestCore}
          />
          <span className={styles.crestKanji} lang="ja">
            {RUKIA_IDENTITY.title}
          </span>
        </span>

        <p className={styles.heroHouse}>{pick(RUKIA_IDENTITY.house, locale)}</p>

        <h1 id="ruk-name" className={styles.heroName}>
          {name}
        </h1>

        <p className={styles.heroNative} lang="ja">
          {nativeName}
        </p>

        <p className={styles.heroTitle} lang="ja">
          {RUKIA_IDENTITY.title}
        </p>
        <p className={styles.heroTitleReading}>
          {pick(RUKIA_IDENTITY.titleReading, locale)}
        </p>

        <span className={styles.hairline} aria-hidden />

        <p className={styles.heroEpigraph}>
          {pick(RUKIA_IDENTITY.epigraph, locale)}
        </p>
        <p className={styles.trail}>{pick(RUKIA_HERO.lede, locale)}</p>

        {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, dairesel dar bir kadrajda duruyor. */}
        <figure className={styles.portrait}>
          <Image
            className={styles.portraitImg}
            src={portraitSrc}
            alt={pick(
              portraitUploaded
                ? RUKIA_HERO.portraitAltUploaded
                : RUKIA_HERO.portraitAlt,
              locale,
            )}
            width={RUKIA_PORTRAIT.w}
            height={RUKIA_PORTRAIT.h}
            priority
          />
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={RUKIA_ID}
            slot="PORTRAIT"
            label={pick(RUKIA_PORTRAIT_SLOT, locale)}
            size={{ w: 1200, h: 1600 }}
          />
        ) : null}

        {/* Büyük hero karesi bilerek BOŞ. Not yalnızca kadraj GERÇEKTEN
            boşken yazılıyor: küratör kareyi yüklediğinde "bu kare boş"
            cümlesi yalan olurdu. */}
        {src(RUKIA_IMAGE_KEYS.hero) ? null : (
          <p className={styles.trail}>{pick(RUKIA_HERO.heroCaption, locale)}</p>
        )}
        {frame(RUKIA_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <SnowShell
      isAdmin={isAdmin}
      moonTitle={pick(RUKIA_MOON.title, locale)}
      moonNative={RUKIA_MOON.native}
      moonEnter={pick(RUKIA_MOON.enter, locale)}
      moonExit={pick(RUKIA_MOON.exit, locale)}
      moonHintOn={pick(RUKIA_MOON.hintOn, locale)}
      moonHintOff={pick(RUKIA_MOON.hintOff, locale)}
      hero={hero}
    >
      {drift("1")}

      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════════
          Dokuz satır; iki tanesi "kayıtta yok" diyor ve bu bir eksiklik
          değil bir cevap. */}
      <section className={styles.section} aria-labelledby="ruk-identity">
        <h2 id="ruk-identity" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.identity.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.identity.lede, locale)}
        </p>

        <dl className={styles.facts}>
          {RUKIA_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.trail}>{pick(RUKIA_MISSING_NOTE, locale)}</p>
      </section>

      {drift("2")}

      {/* ══ 4a · ÜÇ AĞIRLIK (Zanpakutō / Shikai / Bankai) ══════════════════ */}
      <section className={styles.section} aria-labelledby="ruk-arts">
        <h2 id="ruk-arts" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.arts.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.arts.lede, locale)}
        </p>

        <ol className={styles.artList}>
          {RUKIA_ARTS.map((art) => (
            <li key={art.key} className={styles.art}>
              <h3 className={styles.artName} lang="ja">
                {art.name}
              </h3>
              <p className={styles.artReading}>{art.reading}</p>
              <p className={styles.artTurkish}>{pick(art.turkish, locale)}</p>

              <span className={styles.hairline} aria-hidden />

              <p className={styles.artTagline}>{pick(art.tagline, locale)}</p>
              <p className={styles.trail}>{pick(art.text, locale)}</p>

              <ul className={styles.traits}>
                {art.traits.map((trait) => (
                  <li key={trait.tr} className={styles.trait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>

              {frame(art.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </section>

      {/* ══ 4b · DÖRT EL İŞİ (Asauchi / Hadō / Bakudō / Shunpo) ════════════ */}
      <section className={styles.section} aria-labelledby="ruk-craft">
        <h2 id="ruk-craft" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.craft.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.craft.lede, locale)}
        </p>

        <ul className={styles.craftList}>
          {RUKIA_CRAFT.map((craft) => (
            <li key={craft.key} className={styles.craft}>
              <h3 className={styles.craftName} lang="ja">
                {craft.name}
              </h3>
              <p className={styles.craftReading}>{craft.reading}</p>
              <p className={styles.craftTurkish}>{pick(craft.turkish, locale)}</p>
              <p className={styles.trail}>{pick(craft.note, locale)}</p>
              {frame(craft.imageKey, styles.frameSmall)}
            </li>
          ))}
        </ul>
      </section>

      {drift("3")}

      {/* ══ 5 · ÜÇ DANS — SAYFANIN KALBİ ═══════════════════════════════════ */}
      <section className={styles.danceSection} aria-labelledby="ruk-dances">
        <h2 id="ruk-dances" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.dances.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.dances.lede, locale)}
        </p>

        <ThreeDances
          dances={dances}
          commandLabel={pick(RUKIA_DANCE_UI.command, locale)}
          commandText={RUKIA_DANCE_UI.commandText}
          commandReading={pick(RUKIA_DANCE_UI.commandReading, locale)}
          callLabel={pick(RUKIA_DANCE_UI.callLabel, locale)}
          calledLabel={pick(RUKIA_DANCE_UI.calledLabel, locale)}
          layerCountLabel={pick(RUKIA_DANCE_UI.layerCount, locale)}
          undoLabel={pick(RUKIA_DANCE_UI.undoLabel, locale)}
          undoHint={pick(RUKIA_DANCE_UI.undoHint, locale)}
          idleHint={pick(RUKIA_DANCE_UI.idleHint, locale)}
          invertedHint={pick(RUKIA_DANCE_UI.invertedHint, locale)}
          statusCalled={pick(RUKIA_DANCE_UI.statusCalled, locale)}
          statusLifted={pick(RUKIA_DANCE_UI.statusLifted, locale)}
          statusInverted={pick(RUKIA_DANCE_UI.statusInverted, locale)}
          keyboardHint={pick(RUKIA_DANCE_UI.keyboardHint, locale)}
        />
      </section>

      {drift("2")}

      {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="ruk-fate">
        <h2 id="ruk-fate" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.fate.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.fate.lede, locale)}
        </p>

        <ol className={styles.fate}>
          {RUKIA_TIMELINE.map((stop) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li key={stop.key} className={styles.stop}>
                <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
                <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                <p className={styles.trail}>{pick(stop.text, locale)}</p>

                {stop.quote ? (
                  <figure className={styles.stopQuote}>
                    <blockquote className={styles.quoteJa} lang="ja">
                      {stop.quote.text}
                    </blockquote>
                    <p className={styles.quoteReading}>
                      {pick(stop.quote.reading, locale)}
                    </p>
                    <figcaption className={styles.quoteBy}>
                      {pick(stop.quote.by, locale)}
                    </figcaption>
                  </figure>
                ) : null}

                {stop.kin ? (
                  <p className={styles.stopKin}>
                    {kinLinked ? (
                      <Link
                        className={styles.stopKinLink}
                        href={animeHref.character(stop.kin.characterId)}
                      >
                        {stop.kin.name}
                      </Link>
                    ) : (
                      <span className={styles.stopKinName}>{stop.kin.name}</span>
                    )}
                    <span className={styles.stopKinRole}>
                      {pick(stop.kin.role, locale)}
                    </span>
                  </p>
                ) : null}

                {frame(stop.imageKey, styles.frameWide)}
              </li>
            );
          })}
        </ol>
      </section>

      {drift("1")}

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Çizilen altı ad `EXPERIENCE_COMPANIONS[6]` ile birebir aynı küme:
          [5, 906, 907, 210, 1086, 908]. Portre kaydı olan madalyonda
          görünüyor; olmayan (bugün Byakuya) yazıyla söyleniyor ve küratör
          yuvası o kadrajın hemen altında duruyor. */}
      <section className={styles.section} aria-labelledby="ruk-bonds">
        <h2 id="ruk-bonds" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.bonds.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.bonds.lede, locale)}
        </p>

        <ul className={styles.bonds}>
          {RUKIA_BONDS.map((bond) => {
            const linked = isExperienceCharacter(bond.characterId);
            const face = faces.get(bond.characterId) ?? null;
            return (
              <li key={bond.characterId} className={styles.bond}>
                <figure className={styles.bondFace} data-filled={face ? "true" : "false"}>
                  {face ? (
                    <Image
                      className={styles.bondFaceImg}
                      src={face}
                      alt={`${pick(RUKIA_ALT.companionPrefix, locale)} ${bond.name}`}
                      width={120}
                      height={160}
                    />
                  ) : null}
                </figure>
                {isAdmin ? (
                  <CuratorSlot
                    characterId={bond.characterId}
                    slot="PORTRAIT"
                    label={`${bond.name} — ${pick(RUKIA_COMPANION_SLOT, locale)}`}
                    size={{ w: 600, h: 800 }}
                  />
                ) : null}

                {linked ? (
                  <Link
                    className={styles.bondName}
                    href={animeHref.character(bond.characterId)}
                  >
                    {bond.name}
                  </Link>
                ) : (
                  <span className={styles.bondNamePlain}>{bond.name}</span>
                )}
                <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                <p className={styles.trail}>{pick(bond.line, locale)}</p>
                <span className={styles.bondFlag}>
                  {pick(linked ? RUKIA_BOND_UI.hasPage : RUKIA_BOND_UI.noPage, locale)}
                  {face ? null : ` · ${pick(RUKIA_BOND_UI.noPortrait, locale)}`}
                </span>
              </li>
            );
          })}
        </ul>

        {frame(RUKIA_IMAGE_KEYS.bonds, styles.frameWide)}
      </section>

      {/* ══ 7b · EVRENDEKİ YERİ ════════════════════════════════════════════
          Dört çapa da `lib/anime/bleach/anchors.ts` defterinde kayıtlı;
          ölü çapa yok (o defterin kendi kuralı). */}
      <section className={styles.section} aria-labelledby="ruk-world">
        <h2 id="ruk-world" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.world.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.world.lede, locale)}
        </p>

        <ul className={styles.doors}>
          {RUKIA_WORLD_DOORS.map((door) => (
            <li key={door.hash} className={styles.door}>
              <Link
                className={styles.doorLink}
                href={`${animeHref.bleach()}#${door.hash}`}
              >
                {pick(door.label, locale)}
              </Link>
              <span className={styles.doorNote}>{pick(door.note, locale)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="ruk-closing">
        <h2 id="ruk-closing" className={styles.sectionTitle}>
          {pick(RUKIA_SECTIONS.closing.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(RUKIA_SECTIONS.closing.lede, locale)}
        </p>

        <ul className={styles.closingQuotes}>
          {RUKIA_CLOSING.quotes.map((quote) => (
            <li key={quote.text}>
              <figure className={styles.closingQuote}>
                <blockquote className={styles.quoteJa} lang="ja">
                  {quote.text}
                </blockquote>
                <p className={styles.quoteReading}>{pick(quote.reading, locale)}</p>
                <p className={styles.trail}>{pick(quote.note, locale)}</p>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                    şartı): not bloğu bilerek onun üstünde duruyor. */}
                <figcaption className={styles.quoteBy}>
                  {pick(quote.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <span className={styles.hairline} aria-hidden />

        <p className={styles.motto} lang="ja">
          {RUKIA_CLOSING.motto}
        </p>
        <p className={styles.trail}>{pick(RUKIA_CLOSING.mottoNote, locale)}</p>

        {frame(RUKIA_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(RUKIA_CLOSING.credit, locale)}{" "}
          <a href={siteUrl} target="_blank" rel="noreferrer noopener">
            {pick(RUKIA_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.trail}>{pick(RUKIA_CLOSING.creditNote, locale)}</p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(RUKIA_GAPS.title, locale)}
          emptyLabel={pick(RUKIA_GAPS.empty, locale)}
          filledLabel={pick(RUKIA_GAPS.filled, locale)}
          allFilledLabel={pick(RUKIA_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </SnowShell>
  );
}
