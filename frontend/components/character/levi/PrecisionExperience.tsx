import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  LEVI_ALT,
  LEVI_BONDS,
  LEVI_BOND_UI,
  LEVI_CLEAN,
  LEVI_CLOSING,
  LEVI_CRUMB,
  LEVI_FRAME_EMPTY,
  LEVI_GAPS,
  LEVI_GEAR,
  LEVI_HERO,
  LEVI_ID,
  LEVI_IDENTITY,
  LEVI_IMAGE_KEYS,
  LEVI_KIT,
  LEVI_MISSING_NOTE,
  LEVI_PORTRAIT,
  LEVI_PORTRAIT_SLOT,
  LEVI_SECTIONS,
  LEVI_SITE_URL,
  LEVI_SLOT_LABELS,
  LEVI_SLOT_SIZES,
  LEVI_SLOT_SPECS,
  LEVI_TIMELINE,
  LEVI_VOID_ITEMS,
  LEVI_VOID_UI,
} from "@/lib/characters/levi-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { CapacityRack } from "./CapacityRack";
import { CleanShell } from "./CleanShell";
import { NapeMeasure, WingsMark } from "./LeviGlyphs";
import styles from "./PrecisionExperience.module.css";

/* Elde taşınabilecek şeylerin sayısı. Sabit, ve sabit olması mekanizmanın
   kendisi — bkz. CapacityRack başlığı. */
const CAPACITY = 3;

/**
 * Levi (Ackerman) — "Kesinlik" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/45627 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: ELDE ÜÇTEN FAZLA YER YOK.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Dalganın diğer dört sayfası genişliyor (Eren'in ufuk bandı, Mikasa'nın
 * dikey çizgisi, Armin'in iki kolonu, Onizuka'nın kolajı). Bu sayfa tam
 * tersini yapıyor: 34rem'lik TEK dar kolon, bölümler arasında 8–14rem
 * boşluk, kutu yok, kart yok, gölge yok. Görünen her ayrım bir SAÇ ÇİZGİSİ.
 * Başlıklar bile küçük — Bebas Neue ama 1.15rem'i geçmiyor; sayfada en
 * büyük şey adın kendisi ve o da 2.5rem.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (kanat filigranı + madalyon portre + boş hero kadrajı)
 *   2 mod düğmesi — `CleanShell` içinde (state orada)
 *   3 künye şeridi (sekiz satır, biri bilerek boş)
 *   4 donanım: üç büyük + dört küçük
 *   5 kapasite tezgâhı — SAYFANIN KALBİ (`CapacityRack`)
 *   6 beş durak
 *   7 bağlar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   CleanShell   — kök öğe + "pişmanlıksız seçim" modu (tek boolean)
 *   CapacityRack — kapasite tezgâhı
 * `LeviGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında). Büyük hero karesi ve on dört sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın hemen altında kendi yuvası var.
 *
 * ⚠️ Yoldaş portreleri (`companionPortraits`) bu sayfada BİLEREK
 * kullanılmadı: brief "dalganın en az öğe taşıyan sayfası" diyor ve on adet
 * küçük yüz karesi tam olarak o kuralı bozardı. Bağlar bölümü adla ve
 * çizgiyle çiziliyor; arşivde dosyası olanlar bağlantılı.
 */
export function PrecisionExperience({
  detail,
  isAdmin,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız, o yüzden `unoptimized` hiç yazılmıyor
     (FAZ 2 §3). AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? LEVI_PORTRAIT.src;

  const name = detail.character.name || LEVI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? LEVI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? LEVI_SITE_URL;

  const rackItems = LEVI_VOID_ITEMS.map((item) => ({
    key: item.key,
    name: item.name,
    title: pick(item.title, locale),
    line: pick(item.line, locale),
  }));

  const gapRows: CuratorGapRow[] = Object.values(LEVI_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(LEVI_SLOT_LABELS[key], locale),
    spec: pick(LEVI_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Kadraj boşken de duruyor — ama "pişmanlıksız seçim" modu açıldığında
   * `data-filled="false"` olanlar sayfadan tamamen kalkıyor. Doldurulmuş
   * olanlar kalıyor: mod ikinci dereceden bilgiyi atıyor, gerçek olanı
   * değil.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <div
          className={styles.frameSlot}
          data-filled={scene ? "true" : "false"}
        >
          <div className={styles.frameInner}>
            <figure className={`${styles.frame} ${shapeClass}`}>
              {scene ? (
                <Image
                  src={scene}
                  alt={`${pick(LEVI_ALT.scenePrefix, locale)} ${pick(
                    LEVI_SLOT_LABELS[key],
                    locale,
                  )}`}
                  fill
                  sizes="(max-width: 40rem) 92vw, 34rem"
                />
              ) : (
                <figcaption className={styles.frameCaption}>
                  <span className={styles.frameCaptionWord}>
                    {pick(LEVI_FRAME_EMPTY, locale)}
                  </span>
                  <span className={styles.frameCaptionSpec}>
                    {pick(LEVI_SLOT_SPECS[key], locale)}
                  </span>
                </figcaption>
              )}
            </figure>
          </div>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={LEVI_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(LEVI_SLOT_LABELS[key], locale)}
            size={LEVI_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: tek kanat arması, dolgusuz kontur, çok büyük ve çok soluk.
     Bu sayfada JAPONCA FİLİGRAN YOK (dalga kilidi) — 人類最強の兵士 bir
     filigran değil, künyeden gelen bir unvan satırı. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(LEVI_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="lvi-name">
        <span className={styles.wings} aria-hidden>
          <WingsMark
            className={styles.wingsArt}
            featherClassName={styles.wingsFeather}
            spineClassName={styles.wingsSpine}
          />
        </span>

        <p className={styles.heroHouse}>{pick(LEVI_IDENTITY.house, locale)}</p>

        <h1 id="lvi-name" className={styles.heroName}>
          {name}
        </h1>

        <div className={styles.aside}>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
        </div>

        <p className={styles.heroTitle} lang="ja">
          {LEVI_IDENTITY.title}
        </p>
        <div className={styles.aside}>
          <p className={styles.heroTitleReading}>
            {pick(LEVI_IDENTITY.titleReading, locale)}
          </p>
        </div>

        <span className={styles.rule} aria-hidden />

        <p className={styles.heroEpigraph}>
          {pick(LEVI_IDENTITY.epigraph, locale)}
        </p>

        <div className={styles.aside}>
          <p className={styles.heroLede}>{pick(LEVI_HERO.lede, locale)}</p>
        </div>

        {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, dar bir kadrajda duruyor. */}
        <figure className={styles.portrait}>
          <Image
            className={styles.portraitImg}
            src={portraitSrc}
            alt={pick(
              portraitUploaded
                ? LEVI_HERO.portraitAltUploaded
                : LEVI_HERO.portraitAlt,
              locale,
            )}
            width={LEVI_PORTRAIT.w}
            height={LEVI_PORTRAIT.h}
            priority
          />
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={LEVI_ID}
            slot="PORTRAIT"
            label={pick(LEVI_PORTRAIT_SLOT, locale)}
            size={{ w: 1200, h: 1600 }}
          />
        ) : null}

        {/* Büyük hero karesi bilerek BOŞ — küratör yuvası olarak duruyor.
            Not yalnızca kadraj GERÇEKTEN boşken yazılıyor: küratör kareyi
            yüklediğinde "bu kadraj boş" cümlesi yalan olurdu. */}
        {src(LEVI_IMAGE_KEYS.hero) ? null : (
          <div className={styles.aside}>
            <p className={styles.heroFrameNote}>
              {pick(LEVI_HERO.heroCaption, locale)}
            </p>
          </div>
        )}
        {frame(LEVI_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <CleanShell
      isAdmin={isAdmin}
      title={pick(LEVI_CLEAN.title, locale)}
      native={LEVI_CLEAN.native}
      enterLabel={pick(LEVI_CLEAN.enter, locale)}
      exitLabel={pick(LEVI_CLEAN.exit, locale)}
      hintOn={pick(LEVI_CLEAN.hintOn, locale)}
      hintOff={pick(LEVI_CLEAN.hintOff, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════════
          Kutu yok: her satır bir saç çizgisiyle ayrılıyor. Sekizinci satır
          "yaş" ve bilerek boş bir cevap taşıyor. */}
      <section className={styles.section} aria-labelledby="lvi-identity">
        <h2 id="lvi-identity" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.identity.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.identity.lede, locale)}
          </p>
        </div>

        <dl className={styles.facts}>
          {LEVI_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.aside}>
          <p className={styles.factNote}>{pick(LEVI_MISSING_NOTE, locale)}</p>
        </div>
      </section>

      {/* ══ 4a · DONANIM — ÜÇ BÜYÜK ════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="lvi-gear">
        <h2 id="lvi-gear" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.gear.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.gear.lede, locale)}
          </p>
        </div>

        <ol className={styles.gearList}>
          {LEVI_GEAR.map((gear, index) => (
            <li key={gear.key} className={styles.gear}>
              <p className={styles.gearIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className={styles.gearName} lang="ja">
                {gear.name}
              </h3>
              <div className={styles.aside}>
                <p className={styles.gearReading}>{gear.reading}</p>
              </div>
              <p className={styles.gearTurkish}>{pick(gear.turkish, locale)}</p>

              <p className={styles.gearTagline}>{pick(gear.tagline, locale)}</p>

              {/* Ense kartının ölçüsü metinde geçiyor; şerit onun görsel
                  karşılığı — üretilmiş bir raster değil, elle çizilmiş SVG */}
              {gear.key === "nape" ? (
                <span className={styles.napeBar} aria-hidden>
                  <NapeMeasure
                    className={styles.napeArt}
                    barClassName={styles.napeStrip}
                    tickClassName={styles.napeTick}
                  />
                </span>
              ) : null}

              <p className={styles.gearText}>{pick(gear.text, locale)}</p>

              <div className={styles.aside}>
                <ul className={styles.gearTraits}>
                  {gear.traits.map((trait) => (
                    <li key={trait.tr} className={styles.trait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>
              </div>

              {frame(gear.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </section>

      {/* ══ 4b · DÖRT KÜÇÜK ════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="lvi-kit">
        <h2 id="lvi-kit" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.kit.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.kit.lede, locale)}
          </p>
        </div>

        <ul className={styles.kitList}>
          {LEVI_KIT.map((kit) => (
            <li key={kit.key} className={styles.kit}>
              <h3 className={styles.kitName} lang="ja">
                {kit.name}
              </h3>
              <div className={styles.aside}>
                <p className={styles.kitReading}>{kit.reading}</p>
              </div>
              <p className={styles.kitTurkish}>{pick(kit.turkish, locale)}</p>
              <p className={styles.kitNote}>{pick(kit.note, locale)}</p>
              {frame(kit.imageKey, styles.frameSmall)}
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 5 · KAPASİTE TEZGÂHI — SAYFANIN KALBİ ══════════════════════════ */}
      <section className={styles.voidSection} aria-labelledby="lvi-void">
        <h2 id="lvi-void" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.voidStop.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.voidStop.lede, locale)}
          </p>
        </div>

        <CapacityRack
          items={rackItems}
          capacity={CAPACITY}
          openingLabel={pick(LEVI_VOID_UI.opening, locale)}
          capacityLabel={pick(LEVI_VOID_UI.capacityLabel, locale)}
          heldTitle={pick(LEVI_VOID_UI.heldTitle, locale)}
          droppedTitle={pick(LEVI_VOID_UI.droppedTitle, locale)}
          emptySlotLabel={pick(LEVI_VOID_UI.emptySlot, locale)}
          droppedEmptyLabel={pick(LEVI_VOID_UI.droppedEmpty, locale)}
          listTitle={pick(LEVI_VOID_UI.listTitle, locale)}
          heldBadge={pick(LEVI_VOID_UI.heldBadge, locale)}
          releaseHint={pick(LEVI_VOID_UI.releaseHint, locale)}
          keyboardHint={pick(LEVI_VOID_UI.keyboardHint, locale)}
          resetLabel={pick(LEVI_VOID_UI.resetLabel, locale)}
          statusTaken={pick(LEVI_VOID_UI.statusTaken, locale)}
          statusDropped={pick(LEVI_VOID_UI.statusDropped, locale)}
          statusReleased={pick(LEVI_VOID_UI.statusReleased, locale)}
          statusReset={pick(LEVI_VOID_UI.statusReset, locale)}
          closingLine={pick(LEVI_VOID_UI.closingLine, locale)}
        />

        {frame(LEVI_IMAGE_KEYS.voidScene, styles.frameWide)}
      </section>

      {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="lvi-fate">
        <h2 id="lvi-fate" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.fate.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.fate.lede, locale)}
          </p>
        </div>

        <ol className={styles.fate}>
          {LEVI_TIMELINE.map((stop) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li key={stop.key} className={styles.stop}>
                <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
                <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                <p className={styles.stopText}>{pick(stop.text, locale)}</p>

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
                  <div className={styles.aside}>
                    <p className={styles.stopKin}>
                      {kinLinked ? (
                        <Link
                          className={styles.stopKinLink}
                          href={animeHref.character(stop.kin.characterId)}
                        >
                          {stop.kin.name}
                        </Link>
                      ) : (
                        <span className={styles.stopKinName}>
                          {stop.kin.name}
                        </span>
                      )}
                      <span className={styles.stopKinRole}>
                        {pick(stop.kin.role, locale)}
                      </span>
                    </p>
                  </div>
                ) : null}

                {frame(stop.imageKey, styles.frameScene)}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Portresiz, bilerek: bu sayfa dalganın en az öğe taşıyanı. Yalnız
          ad, rol ve bir çizgi. Arşivde dosyası olanlar bağlantılı. */}
      <section className={styles.section} aria-labelledby="lvi-bonds">
        <h2 id="lvi-bonds" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.bonds.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.bonds.lede, locale)}
          </p>
        </div>

        <ul className={styles.bonds}>
          {LEVI_BONDS.map((bond) => {
            const linked = isExperienceCharacter(bond.characterId);
            return (
              <li key={bond.characterId} className={styles.bond}>
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
                <span className={styles.bondRole}>
                  {pick(bond.role, locale)}
                </span>
                <div className={styles.aside}>
                  <span className={styles.bondFlag}>
                    {pick(linked ? LEVI_BOND_UI.hasPage : LEVI_BOND_UI.noPage, locale)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ 7b · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="lvi-closing">
        <h2 id="lvi-closing" className={styles.sectionTitle}>
          {pick(LEVI_SECTIONS.closing.title, locale)}
        </h2>
        <div className={styles.aside}>
          <p className={styles.sectionLede}>
            {pick(LEVI_SECTIONS.closing.lede, locale)}
          </p>
        </div>

        <ul className={styles.closingQuotes}>
          {LEVI_CLOSING.quotes.map((quote) => (
            <li key={quote.text}>
              <figure className={styles.closingQuote}>
                <blockquote className={styles.quoteJa} lang="ja">
                  {quote.text}
                </blockquote>
                <p className={styles.quoteReading}>
                  {pick(quote.reading, locale)}
                </p>
                <div className={styles.aside}>
                  <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
                </div>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                    şartı): not bloğu bilerek onun üstünde duruyor. */}
                <figcaption className={styles.quoteBy}>
                  {pick(quote.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <span className={styles.rule} aria-hidden />

        <p className={styles.motto} lang="ja">
          {LEVI_CLOSING.motto}
        </p>
        <div className={styles.aside}>
          <p className={styles.mottoNote}>
            {pick(LEVI_CLOSING.mottoNote, locale)}
          </p>
        </div>

        {frame(LEVI_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(LEVI_CLOSING.credit, locale)}{" "}
          <a href={siteUrl} target="_blank" rel="noreferrer noopener">
            {pick(LEVI_CLOSING.creditLink, locale)}
          </a>
        </p>
        <div className={styles.aside}>
          <p className={styles.creditNote}>
            {pick(LEVI_CLOSING.creditNote, locale)}
          </p>
        </div>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(LEVI_GAPS.title, locale)}
          emptyLabel={pick(LEVI_GAPS.empty, locale)}
          filledLabel={pick(LEVI_GAPS.filled, locale)}
          allFilledLabel={pick(LEVI_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </CleanShell>
  );
}
