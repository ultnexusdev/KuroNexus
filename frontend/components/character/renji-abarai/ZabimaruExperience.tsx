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
  RENJI_ALT,
  RENJI_BLADES,
  RENJI_BONDS,
  RENJI_BOND_UI,
  RENJI_CHAIN_UI,
  RENJI_CLOSING,
  RENJI_CRUMB,
  RENJI_FRAME_EMPTY,
  RENJI_GAPS,
  RENJI_HERO,
  RENJI_ID,
  RENJI_IDENTITY,
  RENJI_IMAGE_KEYS,
  RENJI_KIT,
  RENJI_MISSING_NOTE,
  RENJI_NEXUS,
  RENJI_PORTRAIT,
  RENJI_PORTRAIT_SLOT,
  RENJI_RELEASE,
  RENJI_SECTIONS,
  RENJI_SEGMENTS,
  RENJI_SITE_URL,
  RENJI_SLOT_LABELS,
  RENJI_SLOT_SIZES,
  RENJI_SLOT_SPECS,
  RENJI_TIMELINE,
} from "@/lib/characters/renji-abarai-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { JointShell } from "./JointShell";
import { SegmentChain, type ChainItem } from "./SegmentChain";
import { SpineMotif, TattooBand, TattooRule } from "./RenjiGlyphs";
import styles from "./ZabimaruExperience.module.css";

/**
 * Renji Abarai — "Zabimaru" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/906 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Fikir tek cümle: ZABİMARU EKLEMLİ BİR KILIÇ — ve
 * sayfanın DÜZENİ de eklemli bir aks.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Bölümler tek bir kolonda akmıyor: sırayla sola ve sağa kayıyorlar
 * (`--ren-swing`), aralarında onları bağlayan EKLEM parçaları var ve göz
 * yukarıdan aşağı zikzak çiziyor. Bölüm ayıraçları kutu ya da çizgi değil,
 * bir DÖVME çizgisi — ortasında bir eklem kırığı olan, `stroke-dashoffset`
 * ile çizilen bir SVG. Başlıklar fırça (Yuji Boku) ve BÜYÜK; gövde Inter ve
 * tamamen temiz — fırça yalnızca başlıkta.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (dövme filigranı + madalyon portre + boş hero kadrajı)
 *   2 mod düğmesi — "Bankai" (`JointShell` içinde, state orada)
 *   3 künye şeridi (on bir satır, ikisi bilerek boş)
 *   4 güç laboratuvarı: üç büyük ağız + dört kanat (Bleach terminolojisi)
 *   5 eklem zinciri — SAYFANIN KALBİ (`SegmentChain`)
 *   6 beş dönem
 *   7 bağlar + evrene açılan eklemler + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   JointShell   — kök öğe + "Bankai" modu (tek boolean)
 *   SegmentChain — "Uzat" mekaniği (tek sayaç)
 * `RenjiGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×346 — küçük, o yüzden yalnızca madalyon
 * kadrajında). Büyük hero karesi ve on dokuz sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var
 * (kullanıcı şartı — sayfa sonunda toplu yuva bloğu yasak).
 *
 * ⚠️ Yoldaş portrelerinin ALTINDA yuva YOK ve bu bilinçli: onlar başka bir
 * karakterin `CharacterImage` kaydından geliyor. Oraya bir `ren:` ABILITY
 * yuvası koymak, Rukia'nın yüzünü Renji'nin yetenek kadrajına yüklemek
 * olurdu. Bu sayfanın doldurabileceği kadraj değiller.
 */
export function ZabimaruExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız — AniList'in uzak adresi hiç
     kullanılmıyor (Faz 2 §3: hotlink yok), o yüzden `unoptimized` de
     yazılmıyor. */
  const uploadedPortrait = isUploadedPortrait(detail)
    ? primaryPortrait(detail)
    : null;
  const portraitSrc = uploadedPortrait ?? RENJI_PORTRAIT.src;

  const name = detail.character.name || RENJI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? RENJI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? RENJI_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(RENJI_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(RENJI_SLOT_LABELS[key], locale),
      spec: pick(RENJI_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası.
   *
   * ⚠️ Kadraj BOŞSA ve ziyaretçi yöneticiyse değilse hiçbir şey çizilmiyor:
   * Faz 2 §3 "görsel yokken bölüm GÖRSELSİZ ama ayakta kalsın" diyor,
   * "etiketli yer tutucu kalsın" demiyor. Dalga 1'in birinci dersi de aynı
   * yerden geliyordu — boş kadrajın içindeki üretim metadatası
   * ("geniş kadraj · 1400×900 · webp") ziyaretçiye sızıyor ve ekran
   * okuyucu yirmi kez okuyordu.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    if (!scene && !isAdmin) return null;
    return (
      <>
        <div className={styles.frameSlot} data-filled={scene ? "true" : "false"}>
          <div className={styles.frameInner}>
            <figure className={`${styles.frame} ${shapeClass}`}>
              {scene ? (
                <Image
                  src={scene}
                  alt={`${pick(RENJI_ALT.scenePrefix, locale)} ${pick(
                    RENJI_SLOT_LABELS[key],
                    locale,
                  )}`}
                  fill
                  sizes="(max-width: 48rem) 92vw, 40rem"
                />
              ) : (
                <figcaption className={styles.frameCaption} data-curator-slot>
                  <span className={styles.frameCaptionWord}>
                    {pick(RENJI_FRAME_EMPTY, locale)}
                  </span>
                  <span className={styles.frameCaptionSpec}>
                    {pick(RENJI_SLOT_SPECS[key], locale)}
                  </span>
                </figcaption>
              )}
            </figure>
          </div>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={RENJI_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(RENJI_SLOT_LABELS[key], locale)}
            size={RENJI_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Bölüm ayıracı: bir dövme çizgisi, ortasında eklem kırığı. */
  const divider = (
    <span className={styles.rule} aria-hidden>
      <TattooRule
        className={styles.ruleArt}
        lineClassName={styles.ruleLine}
        nodeClassName={styles.ruleNode}
      />
    </span>
  );

  /* Zincire inen altı eklem — metinler burada düz dizeye çözülüyor, kadraj
     burada çiziliyor. İstemci adası yalnızca sırayı ve açık sayısını tutuyor. */
  const chainItems: ChainItem[] = RENJI_SEGMENTS.map((segment) => ({
    key: segment.key,
    native: segment.native,
    stage: pick(segment.stage, locale),
    title: pick(segment.title, locale),
    reach: pick(segment.reach, locale),
    text: pick(segment.text, locale),
    note: pick(segment.note, locale),
    frame: frame(segment.imageKey, styles.frameWide),
  }));

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş dövme bandı + 蛇尾丸. İkisi de `aria-hidden`;
     kanjinin okunuşu ayrı bir satırda YAZIYLA veriliyor, yani bilgi
     yalnızca görsele bağlı değil. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(RENJI_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="ren-name">
        <span className={styles.heroMark} aria-hidden>
          <TattooBand
            className={styles.heroMarkArt}
            strokeClassName={styles.heroMarkStroke}
            spikeClassName={styles.heroMarkSpike}
          />
          <span className={styles.heroMarkKanji} lang="ja">
            蛇尾丸
          </span>
        </span>

        <p className={styles.heroHouse}>{pick(RENJI_CRUMB.series, locale)}</p>

        <h1 id="ren-name" className={styles.heroName}>
          {name}
        </h1>

        <p className={styles.heroNative} lang="ja">
          {nativeName}
        </p>

        <p className={styles.heroTitle} lang="ja">
          {RENJI_IDENTITY.title}
        </p>
        <p className={styles.heroTitleReading}>
          {pick(RENJI_IDENTITY.titleReading, locale)}
        </p>

        {divider}

        <p className={styles.heroEpigraph}>
          {pick(RENJI_IDENTITY.epigraph, locale)}
        </p>
        <p className={styles.heroLede}>{pick(RENJI_HERO.lede, locale)}</p>
        <p className={styles.heroWatermarkNote}>
          {pick(RENJI_HERO.watermarkReading, locale)}
        </p>

        {/* Madalyon portre — 230×346, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, eklemli bir kadrajın içinde duruyor. */}
        <figure className={styles.portrait}>
          <Image
            className={styles.portraitImg}
            src={portraitSrc}
            alt={pick(
              uploadedPortrait
                ? RENJI_HERO.portraitAltUploaded
                : RENJI_HERO.portraitAlt,
              locale,
            )}
            width={RENJI_PORTRAIT.w}
            height={RENJI_PORTRAIT.h}
            priority
          />
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={RENJI_ID}
            slot="PORTRAIT"
            label={pick(RENJI_PORTRAIT_SLOT, locale)}
            size={{ w: 1200, h: 1600 }}
          />
        ) : null}

        {/* Büyük hero karesi bilerek BOŞ. Not yalnızca kadraj GERÇEKTEN
            boşken yazılıyor: küratör kareyi yüklediğinde "bu kadraj boş"
            cümlesi yalan olurdu. */}
        {src(RENJI_IMAGE_KEYS.hero) ? null : (
          <p className={styles.heroFrameNote}>
            {pick(RENJI_HERO.heroCaption, locale)}
          </p>
        )}
        {frame(RENJI_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <JointShell
      isAdmin={isAdmin}
      title={pick(RENJI_RELEASE.title, locale)}
      native={RENJI_RELEASE.native}
      toBankaiLabel={pick(RENJI_RELEASE.toBankai, locale)}
      toShikaiLabel={pick(RENJI_RELEASE.toShikai, locale)}
      hintShikai={pick(RENJI_RELEASE.hintShikai, locale)}
      hintBankai={pick(RENJI_RELEASE.hintBankai, locale)}
      markLabel={pick(RENJI_RELEASE.markLabel, locale)}
      hero={hero}
      spine={
        <SpineMotif
          className={styles.spineArt}
          boneClassName={styles.spineBone}
          cordClassName={styles.spineCord}
        />
      }
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════════ */}
      <section className={styles.limb} data-side="right" aria-labelledby="ren-identity">
        <div className={styles.limbHead}>
          <h2 id="ren-identity" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.identity.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.identity.lede, locale)}
          </p>
        </div>

        <dl className={styles.facts}>
          {RENJI_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.factNote}>{pick(RENJI_MISSING_NOTE, locale)}</p>
      </section>

      {divider}

      {/* ══ 4a · GÜÇ LABORATUVARI — ÜÇ BÜYÜK ═══════════════════════════════ */}
      <section className={styles.limb} data-side="left" aria-labelledby="ren-blades">
        <div className={styles.limbHead}>
          <h2 id="ren-blades" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.blades.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.blades.lede, locale)}
          </p>
        </div>

        <ol className={styles.blades}>
          {RENJI_BLADES.map((blade, index) => (
            <li
              key={blade.key}
              className={styles.blade}
              data-side={index % 2 === 0 ? "left" : "right"}
            >
              <p className={styles.bladeIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.bladeName} lang="ja">
                {blade.name}
              </h3>
              <p className={styles.bladeReading}>{blade.reading}</p>
              <p className={styles.bladeTurkish}>{pick(blade.turkish, locale)}</p>
              <p className={styles.bladeTagline} lang="ja">
                {pick(blade.tagline, locale)}
              </p>
              <p className={styles.bladeText}>{pick(blade.text, locale)}</p>
              <ul className={styles.bladeTraits}>
                {blade.traits.map((trait) => (
                  <li key={trait.tr} className={styles.trait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>
              {frame(blade.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </section>

      {divider}

      {/* ══ 4b · GÜÇ LABORATUVARI — DÖRT KANAT ═════════════════════════════ */}
      <section className={styles.limb} data-side="right" aria-labelledby="ren-kit">
        <div className={styles.limbHead}>
          <h2 id="ren-kit" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.kit.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.kit.lede, locale)}
          </p>
        </div>

        <ul className={styles.kit}>
          {RENJI_KIT.map((item) => (
            <li key={item.key} className={styles.kitCard}>
              <h3 className={styles.kitName} lang="ja">
                {item.name}
              </h3>
              <p className={styles.kitReading}>{item.reading}</p>
              <p className={styles.kitTurkish}>{pick(item.turkish, locale)}</p>
              <p className={styles.kitNote}>{pick(item.note, locale)}</p>
              {frame(item.imageKey, styles.frameSmall)}
            </li>
          ))}
        </ul>
      </section>

      {divider}

      {/* ══ 5 · EKLEM ZİNCİRİ — SAYFANIN KALBİ ═════════════════════════════ */}
      <section className={styles.limb} data-side="left" aria-labelledby="ren-chain">
        <div className={styles.limbHead}>
          <h2 id="ren-chain" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.chain.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.chain.lede, locale)}
          </p>
        </div>

        <SegmentChain
          items={chainItems}
          extendLabel={pick(RENJI_CHAIN_UI.extend, locale)}
          extendDoneLabel={pick(RENJI_CHAIN_UI.extendDone, locale)}
          retractLabel={pick(RENJI_CHAIN_UI.retract, locale)}
          counterLabel={pick(RENJI_CHAIN_UI.counterLabel, locale)}
          emptyLead={pick(RENJI_CHAIN_UI.emptyLead, locale)}
          keyboardHint={pick(RENJI_CHAIN_UI.keyboardHint, locale)}
          statusOpened={pick(RENJI_CHAIN_UI.statusOpened, locale)}
          statusFull={pick(RENJI_CHAIN_UI.statusFull, locale)}
          statusRetracted={pick(RENJI_CHAIN_UI.statusRetracted, locale)}
          sideLeftLabel={pick(RENJI_CHAIN_UI.sideLeft, locale)}
          sideRightLabel={pick(RENJI_CHAIN_UI.sideRight, locale)}
          closingLine={pick(RENJI_CHAIN_UI.closingLine, locale)}
        />
      </section>

      {divider}

      {/* ══ 6 · BEŞ DÖNEM ══════════════════════════════════════════════════ */}
      <section className={styles.limb} data-side="right" aria-labelledby="ren-fate">
        <div className={styles.limbHead}>
          <h2 id="ren-fate" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.fate.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.fate.lede, locale)}
          </p>
        </div>

        <ol className={styles.fate}>
          {RENJI_TIMELINE.map((stop, index) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li
                key={stop.key}
                className={styles.stop}
                data-side={index % 2 === 0 ? "left" : "right"}
              >
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

                {frame(stop.imageKey, styles.frameScene)}
              </li>
            );
          })}
        </ol>
      </section>

      {divider}

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Yoldaş portreleri ARŞİVİN kendi `CharacterImage` kaydından geliyor
          (`companionPortraits`); kayıt yoksa yerine kanjinin ilk işareti
          çiziliyor ve bölüm ayakta kalıyor. Bu kadrajların altında küratör
          yuvası YOK — gerekçesi dosya başındaki uyarıda. */}
      <section className={styles.limb} data-side="left" aria-labelledby="ren-bonds">
        <div className={styles.limbHead}>
          <h2 id="ren-bonds" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.bonds.lede, locale)}
          </p>
        </div>

        <ul className={styles.bonds}>
          {RENJI_BONDS.map((bond) => {
            const linked = isExperienceCharacter(bond.characterId);
            const face = faces.get(bond.characterId) ?? null;
            return (
              <li key={bond.characterId} className={styles.bond}>
                <span className={styles.bondFace}>
                  {face ? (
                    <Image
                      src={face}
                      alt={`${bond.name} — ${pick(RENJI_BOND_UI.portraitAlt, locale)}`}
                      fill
                      sizes="72px"
                    />
                  ) : (
                    <span className={styles.bondFaceMark} aria-hidden lang="ja">
                      {bond.native.slice(0, 1)}
                    </span>
                  )}
                </span>

                <span className={styles.bondBody}>
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
                  <span className={styles.bondNative} lang="ja">
                    {bond.native}
                  </span>
                  <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                  <span className={styles.bondText}>{pick(bond.text, locale)}</span>
                  <span className={styles.bondFlag}>
                    {pick(
                      linked ? RENJI_BOND_UI.hasPage : RENJI_BOND_UI.noPage,
                      locale,
                    )}
                    {face ? null : ` · ${pick(RENJI_BOND_UI.noPortrait, locale)}`}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {divider}

      {/* ══ 7b · EVRENE AÇILAN EKLEMLER ════════════════════════════════════
          Adresler elle YAZILMIYOR: `animeHref.bleach()` + çapa. Dört çapa da
          `lib/anime/bleach/anchors.ts` defterinde kayıtlı ve o defteri
          `scripts/check-bleach-anchors.mjs` denetliyor — yani ölü çapa
          riski yok. */}
      <section className={styles.limb} data-side="right" aria-labelledby="ren-nexus">
        <div className={styles.limbHead}>
          <h2 id="ren-nexus" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.nexus.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.nexus.lede, locale)}
          </p>
        </div>

        <ul className={styles.nexusList}>
          {RENJI_NEXUS.map((node) => (
            <li key={node.key} className={styles.nexus}>
              <Link
                className={styles.nexusLink}
                href={`${animeHref.bleach()}#${node.anchor}`}
              >
                <span className={styles.nexusTitle}>{pick(node.title, locale)}</span>
                <span className={styles.nexusText}>{pick(node.text, locale)}</span>
                <span className={styles.nexusArrow} aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {divider}

      {/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="ren-closing">
        <div className={styles.limbHead}>
          <h2 id="ren-closing" className={styles.sectionTitle}>
            {pick(RENJI_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(RENJI_SECTIONS.closing.lede, locale)}
          </p>
        </div>

        <ul className={styles.closingQuotes}>
          {RENJI_CLOSING.quotes.map((quote) => (
            <li key={quote.text}>
              <figure className={styles.closingQuote}>
                <blockquote className={styles.quoteJa} lang="ja">
                  {quote.text}
                </blockquote>
                <p className={styles.quoteReading}>{pick(quote.reading, locale)}</p>
                <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                    şartı): not bloğu bilerek onun üstünde duruyor. */}
                <figcaption className={styles.quoteBy}>
                  {pick(quote.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {divider}

        <p className={styles.motto} lang="ja">
          {RENJI_CLOSING.motto}
        </p>
        <p className={styles.mottoNote}>{pick(RENJI_CLOSING.mottoNote, locale)}</p>

        {frame(RENJI_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(RENJI_CLOSING.credit, locale)}{" "}
          <a href={siteUrl} target="_blank" rel="noreferrer noopener">
            {pick(RENJI_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>{pick(RENJI_CLOSING.creditNote, locale)}</p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(RENJI_GAPS.title, locale)}
          emptyLabel={pick(RENJI_GAPS.empty, locale)}
          filledLabel={pick(RENJI_GAPS.filled, locale)}
          allFilledLabel={pick(RENJI_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </JointShell>
  );
}
