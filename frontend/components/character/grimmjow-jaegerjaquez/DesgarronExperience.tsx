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
  GRIMMJOW_ALT,
  GRIMMJOW_BONDS,
  GRIMMJOW_BOND_UI,
  GRIMMJOW_CLAWS,
  GRIMMJOW_CLAW_UI,
  GRIMMJOW_CLOSING,
  GRIMMJOW_CRUMB,
  GRIMMJOW_FRAME_EMPTY,
  GRIMMJOW_GAPS,
  GRIMMJOW_HERO,
  GRIMMJOW_ID,
  GRIMMJOW_IDENTITY,
  GRIMMJOW_IMAGE_KEYS,
  GRIMMJOW_KIT,
  GRIMMJOW_MISSING_NOTE,
  GRIMMJOW_MODE,
  GRIMMJOW_PORTRAIT,
  GRIMMJOW_PORTRAIT_SLOT,
  GRIMMJOW_POWERS,
  GRIMMJOW_SECTIONS,
  GRIMMJOW_SITE_URL,
  GRIMMJOW_SLOT_LABELS,
  GRIMMJOW_SLOT_SIZES,
  GRIMMJOW_SLOT_SPECS,
  GRIMMJOW_TIMELINE,
  GRIMMJOW_WORLD_LINKS,
  GRIMMJOW_WORLD_UI,
} from "@/lib/characters/grimmjow-jaegerjaquez-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { ClawDeck } from "./ClawDeck";
import { PanteraShell } from "./PanteraShell";
import { ClawMark, CrookedSix, TearFibre } from "./GrimmjowGlyphs";
import styles from "./DesgarronExperience.module.css";

/**
 * Grimmjow Jaegerjaquez — "Desgarrón" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1080 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek kelime: YIRTMA.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Dalganın diğer beş Bleach sayfası kutulu: Rukia'nın dar kolonu, Renji'nin
 * zikzağı, Uryū'nün blueprint ızgarası, Ulquiorra'nın negatif alanı,
 * Yoruichi'nin yatay şeritleri. Bu sayfada HİZALI KUTU YOK. Bölümler tam
 * genişlikte üst üste binmiş bantlar; her bandın alt kenarı `clip-path` ile
 * düzensiz bir yırtık ve bir sonraki bant o yırtığın altına giriyor
 * (negatif `margin-block-start`). Sayfayı yukarıdan aşağı okurken göz
 * kırık kenardan kırık kenara atlıyor.
 *
 * Tipografi de aynı fiili tekrarlıyor: başlıklar Archivo Black, düz, çok
 * büyük ve kırpılmış. Kırpma `clip-path: inset()` ile yapılıyor ve ⚠️
 * YALNIZCA satır kutusunun ÜST BOŞLUĞUNU kesiyor — harf gövdesi, Türkçe
 * noktalı harfler ve alt uzantılar (ç, ş, Q kuyruğu) dokunulmadan kalıyor.
 * Ölçüsü CSS'te, `.bandTitle` başlığında yazılı. Ekran okuyucuya giden
 * metin zaten bütün: `clip-path` tamamen görsel bir kırpma.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (pençe filigranı + 破面 + çarpık 6 + portre + boş hero kadrajı)
 *   2 mod düğmesi — `PanteraShell` içinde (state orada)
 *   3 künye şeridi (sekiz satır, ikisi bilerek boş: yaş ve kan grubu)
 *   4 güç laboratuvarı: üç büyük + dört küçük (Hollow/Arrancar terimleri)
 *   5 Desgarrón — SAYFANIN KALBİ (`ClawDeck`): beş pençe, beş yırtık
 *   6 beş durak (dönem etiketli; yaş yok, çünkü kaynakta da yok)
 *   7 dört isim + evren bağları + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   PanteraShell — kök öğe + Resurrección modu (tek boolean)
 *   ClawDeck     — beş pençe, birikimli yırtıklar
 * `GrimmjowGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca künye
 * kadrajında). Büyük hero karesi ve on dört sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var
 * (sayfa sonunda toplu yuva bloğu yasak).
 *
 * ⚠️ Yoldaş portrelerinin altında yuva YOK ve bu bilinçli: o kareler BAŞKA
 * karakterlerin kendi PORTRAIT kayıtlarından geliyor. Oraya bir yükleme
 * yuvası koymak, Ichigo'nun portresini Grimmjow'un kaydına yazmak olurdu.
 */
export function DesgarronExperience({
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
    (portraitUploaded ? primaryPortrait(detail) : null) ??
    GRIMMJOW_PORTRAIT.src;

  const name = detail.character.name || GRIMMJOW_IDENTITY.name;
  const nativeName =
    detail.character.nameNative ?? GRIMMJOW_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? GRIMMJOW_SITE_URL;

  const clawItems = GRIMMJOW_CLAWS.map((claw) => ({
    key: claw.key,
    index: claw.index,
    native: claw.native,
    reading: claw.reading,
    claw: pick(claw.claw, locale),
    torn: pick(claw.torn, locale),
    cardTitle: pick(claw.cardTitle, locale),
    cardText: pick(claw.cardText, locale),
  }));

  const gapRows: CuratorGapRow[] = Object.values(GRIMMJOW_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(GRIMMJOW_SLOT_LABELS[key], locale),
      spec: pick(GRIMMJOW_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı).
   *
   * ⚠️ Kadrajın kendisi de yırtık: `clip-path` kenarı kesiyor. Ama kesen
   * şey figürün DIŞ kabı; `<Image>` ve altyazı kırpılmıyor, çünkü kırpılmış
   * bir kabın içindeki odak halkası görünmez olur.
   *
   * ⚠️ Kadrajın içindeki üretim künyesi ("geniş kadraj · 1600×900 · webp")
   * YALNIZCA yöneticiye çiziliyor — dolusuna da boşuna da. Sıradan ziyaretçi
   * on beş etiketli kutu değil, yalnızca sayfanın kendi dokusunu görüyor
   * (Dalga 1 dersi 1: küratör metni ziyaretçiye sızmasın).
   *
   * ⚠️ PERDE. Yüklenen karenin ÜSTÜNDE künye metni duruyor ve o metnin
   * kontrastı görselin parlaklığına bağlı kalamaz (kare açık renkliyse
   * yazı kaybolur). `.frameScrim` tam olarak bunun için var ve yalnızca
   * kadraj DOLUYKEN çiziliyor.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <figure
          className={`${styles.frame} ${shapeClass}`}
          data-filled={scene ? "true" : "false"}
        >
          {scene ? (
            <>
              <Image
                className={styles.frameImg}
                src={scene}
                alt={`${pick(GRIMMJOW_ALT.scenePrefix, locale)} ${pick(
                  GRIMMJOW_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 46rem) 94vw, 44rem"
              />
              {isAdmin ? (
                <span className={styles.frameScrim} aria-hidden />
              ) : null}
            </>
          ) : null}

          {isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {scene
                  ? pick(GRIMMJOW_GAPS.filled, locale)
                  : pick(GRIMMJOW_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(GRIMMJOW_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={GRIMMJOW_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(GRIMMJOW_SLOT_LABELS[key], locale)}
            size={GRIMMJOW_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Bandın alt kenarındaki lif çizgisi — kesiğin altına giren tüy. */
  const fibre = (
    <span className={styles.fibre} aria-hidden>
      <TearFibre
        className={styles.fibreArt}
        strokeClassName={styles.fibreStroke}
      />
    </span>
  );

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran üç parçalı ve hepsi elle: dört paralel pençe yırtığı, 破面
     (hafumen — kırılmış maske) ve Aizen'in sırta kazıdığı ÇARPIK 6. Üçü de
     `aria-hidden`; okunabilir karşılıkları künye şeridinde metin olarak var. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbHere}>
          {pick(GRIMMJOW_CRUMB.series, locale)}
        </span>
      </nav>

      <section className={styles.band} data-band="hero" aria-labelledby="grm-name">
        <span className={styles.watermark} aria-hidden>
          <ClawMark
            className={styles.watermarkClaw}
            ripClassName={styles.watermarkRip}
          />
          <span className={styles.watermarkKanji} lang="ja">
            破面
          </span>
          <CrookedSix
            className={styles.watermarkSix}
            strokeClassName={styles.watermarkSixStroke}
          />
        </span>

        <div className={styles.bandInner}>
          <p className={styles.heroHouse}>
            {pick(GRIMMJOW_IDENTITY.house, locale)}
          </p>

          {/* Sayfanın en büyük öğesi ve en sert kırpılanı. Latin büyük
              harf: Türkçe noktalı harf yok, o yüzden burada üstten daha
              derin kesilebiliyor (ölçü CSS'te). */}
          <h1 id="grm-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>

          <p className={styles.heroRank}>
            <span className={styles.heroRankName}>
              {GRIMMJOW_IDENTITY.title}
            </span>
            <span className={styles.heroRankReading}>
              {pick(GRIMMJOW_IDENTITY.titleReading, locale)}
            </span>
          </p>

          <p className={styles.heroEpigraph}>
            {pick(GRIMMJOW_IDENTITY.epigraph, locale)}
          </p>

          <p className={styles.heroLede}>{pick(GRIMMJOW_HERO.lede, locale)}</p>

          {/* Künye portresi — 230×345, yani KÜÇÜK: tam kanama bir hero
              olarak kullanılmıyor, dar bir kadrajda duruyor. */}
          <figure className={styles.portrait}>
            <Image
              className={styles.portraitImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? GRIMMJOW_HERO.portraitAltUploaded
                  : GRIMMJOW_HERO.portraitAlt,
                locale,
              )}
              width={GRIMMJOW_PORTRAIT.w}
              height={GRIMMJOW_PORTRAIT.h}
              priority
            />
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={GRIMMJOW_ID}
              slot="PORTRAIT"
              label={pick(GRIMMJOW_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}

          {/* Büyük hero karesi bilerek BOŞ. Not yalnızca kadraj GERÇEKTEN
              boşken yazılıyor: küratör kareyi yüklediğinde "bu kadraj boş"
              cümlesi yalan olurdu. */}
          {src(GRIMMJOW_IMAGE_KEYS.hero) ? null : (
            <p className={styles.heroFrameNote}>
              {pick(GRIMMJOW_HERO.heroCaption, locale)}
            </p>
          )}
          {frame(GRIMMJOW_IMAGE_KEYS.hero, styles.frameTall)}

          <p className={styles.heroMarkNote}>
            {pick(GRIMMJOW_HERO.markNote, locale)}
          </p>
        </div>
        {fibre}
      </section>
    </>
  );

  return (
    <PanteraShell
      isAdmin={isAdmin}
      title={pick(GRIMMJOW_MODE.title, locale)}
      native={GRIMMJOW_MODE.native}
      nativeReading={pick(GRIMMJOW_MODE.nativeReading, locale)}
      releaseCommand={GRIMMJOW_MODE.release}
      enterLabel={pick(GRIMMJOW_MODE.enter, locale)}
      exitLabel={pick(GRIMMJOW_MODE.exit, locale)}
      hintOn={pick(GRIMMJOW_MODE.hintOn, locale)}
      hintOff={pick(GRIMMJOW_MODE.hintOff, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════════
          Kutu yok: satırlar bandın içinde kırık bir merdiven gibi kayıyor.
          Son iki satır (yaş, kan grubu) bilerek boş cevap taşıyor. */}
      <section
        className={styles.band}
        data-band="identity"
        aria-labelledby="grm-identity"
      >
        <div className={styles.bandInner}>
          <h2 id="grm-identity" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.identity.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.identity.lede, locale)}
          </p>

          <dl className={styles.facts}>
            {GRIMMJOW_IDENTITY.facts.map((fact) => (
              <div
                key={fact.key}
                className={styles.fact}
                data-blank={fact.blank ? "true" : "false"}
              >
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.factNote}>
            {pick(GRIMMJOW_MISSING_NOTE, locale)}
          </p>
        </div>
        {fibre}
      </section>

      {/* ══ 4a · ÜÇ BÜYÜK GÜÇ ══════════════════════════════════════════════ */}
      <section
        className={styles.band}
        data-band="power"
        aria-labelledby="grm-power"
      >
        <div className={styles.bandInner}>
          <h2 id="grm-power" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.power.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.power.lede, locale)}
          </p>

          <ol className={styles.powerList}>
            {GRIMMJOW_POWERS.map((power, index) => (
              <li key={power.key} className={styles.power}>
                <p className={styles.powerIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className={styles.powerName}>{power.name}</h3>
                <p className={styles.powerNative}>
                  <span lang="ja">{power.native}</span>
                  <span className={styles.powerReading}>{power.reading}</span>
                </p>
                <p className={styles.powerTurkish}>
                  {pick(power.turkish, locale)}
                </p>

                <p className={styles.powerTagline}>
                  {pick(power.tagline, locale)}
                </p>
                <p className={styles.powerText}>{pick(power.text, locale)}</p>

                <ul className={styles.powerTraits}>
                  {power.traits.map((trait) => (
                    <li key={trait.tr} className={styles.trait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>

                {frame(power.imageKey, styles.frameWide)}
              </li>
            ))}
          </ol>
        </div>
        {fibre}
      </section>

      {/* ══ 4b · DÖRT KÜÇÜK TEKNİK ═════════════════════════════════════════ */}
      <section className={styles.band} data-band="kit" aria-labelledby="grm-kit">
        <div className={styles.bandInner}>
          <h2 id="grm-kit" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.kit.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.kit.lede, locale)}
          </p>

          <ul className={styles.kitList}>
            {GRIMMJOW_KIT.map((kit) => (
              <li key={kit.key} className={styles.kit}>
                <h3 className={styles.kitName}>{kit.name}</h3>
                <p className={styles.kitNative}>
                  <span lang="ja">{kit.native}</span>
                  <span className={styles.kitReading}>{kit.reading}</span>
                </p>
                <p className={styles.kitTurkish}>{pick(kit.turkish, locale)}</p>
                <p className={styles.kitNote}>{pick(kit.note, locale)}</p>
                {frame(kit.imageKey, styles.frameSmall)}
              </li>
            ))}
          </ul>
        </div>
        {fibre}
      </section>

      {/* ══ 5 · DESGARRÓN — SAYFANIN KALBİ ═════════════════════════════════ */}
      <section
        className={styles.band}
        data-band="desgarron"
        aria-labelledby="grm-desgarron"
      >
        <div className={styles.bandInner}>
          <h2 id="grm-desgarron" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.desgarron.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.desgarron.lede, locale)}
          </p>

          <ClawDeck
            items={clawItems}
            rackLabel={pick(GRIMMJOW_CLAW_UI.rackLabel, locale)}
            counterLabel={pick(GRIMMJOW_CLAW_UI.counterLabel, locale)}
            sealedBadge={pick(GRIMMJOW_CLAW_UI.sealedBadge, locale)}
            tornBadge={pick(GRIMMJOW_CLAW_UI.tornBadge, locale)}
            tearAction={pick(GRIMMJOW_CLAW_UI.tearAction, locale)}
            sealAction={pick(GRIMMJOW_CLAW_UI.sealAction, locale)}
            resetLabel={pick(GRIMMJOW_CLAW_UI.resetLabel, locale)}
            keyboardHint={pick(GRIMMJOW_CLAW_UI.keyboardHint, locale)}
            emptyState={pick(GRIMMJOW_CLAW_UI.emptyState, locale)}
            statusTorn={pick(GRIMMJOW_CLAW_UI.statusTorn, locale)}
            statusSealed={pick(GRIMMJOW_CLAW_UI.statusSealed, locale)}
            statusReset={pick(GRIMMJOW_CLAW_UI.statusReset, locale)}
            completeLine={pick(GRIMMJOW_CLAW_UI.completeLine, locale)}
          />

          {frame(GRIMMJOW_IMAGE_KEYS.desgarron, styles.frameWide)}
        </div>
        {fibre}
      </section>

      {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════════ */}
      <section
        className={styles.band}
        data-band="fate"
        aria-labelledby="grm-fate"
      >
        <div className={styles.bandInner}>
          <h2 id="grm-fate" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.fate.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.fate.lede, locale)}
          </p>

          <ol className={styles.fate}>
            {GRIMMJOW_TIMELINE.map((stop) => {
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
                  ) : null}

                  {frame(stop.imageKey, styles.frameScene)}
                </li>
              );
            })}
          </ol>
        </div>
        {fibre}
      </section>

      {/* ══ 7a · DÖRT İSİM ═════════════════════════════════════════════════
          Portreler arşivin kendi PORTRAIT kayıtlarından; kaydı olmayan
          isim portresiz ama ayakta çiziliyor. Altlarında yükleme yuvası
          YOK — gerekçe bileşen başlığında. */}
      <section
        className={styles.band}
        data-band="bonds"
        aria-labelledby="grm-bonds"
      >
        <div className={styles.bandInner}>
          <h2 id="grm-bonds" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.bonds.lede, locale)}
          </p>

          <ul className={styles.bonds}>
            {GRIMMJOW_BONDS.map((bond) => {
              const linked = isExperienceCharacter(bond.characterId);
              const face = faces.get(bond.characterId) ?? null;
              return (
                <li key={bond.characterId} className={styles.bond}>
                  <span className={styles.bondFace} data-has={face ? "true" : "false"}>
                    {face ? (
                      <Image
                        className={styles.bondFaceImg}
                        src={face}
                        alt={`${pick(GRIMMJOW_ALT.companionPrefix, locale)} ${
                          bond.name
                        }`}
                        fill
                        sizes="80px"
                      />
                    ) : (
                      <span className={styles.bondFaceEmpty}>
                        {pick(GRIMMJOW_BOND_UI.portraitMissing, locale)}
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
                    <span className={styles.bondRole}>
                      {pick(bond.role, locale)}
                    </span>
                    <span className={styles.bondFlag}>
                      {pick(
                        linked
                          ? GRIMMJOW_BOND_UI.hasPage
                          : GRIMMJOW_BOND_UI.noPage,
                        locale,
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Evren bağları — Bleach evren sayfasının kendi çapalarına. */}
          <div className={styles.world}>
            <h3 className={styles.worldTitle}>
              {pick(GRIMMJOW_WORLD_UI.title, locale)}
            </h3>
            <p className={styles.worldLede}>
              {pick(GRIMMJOW_WORLD_UI.lede, locale)}
            </p>
            <ul className={styles.worldList}>
              {GRIMMJOW_WORLD_LINKS.map((link) => (
                <li key={link.anchor} className={styles.worldItem}>
                  <Link
                    className={styles.worldLink}
                    href={`${animeHref.bleach()}#${link.anchor}`}
                  >
                    {pick(link.label, locale)}
                  </Link>
                  <span className={styles.worldNote}>
                    {pick(link.note, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {fibre}
      </section>

      {/* ══ 7b · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section
        className={styles.band}
        data-band="closing"
        aria-labelledby="grm-closing"
      >
        <div className={styles.bandInner}>
          <h2 id="grm-closing" className={styles.bandTitle}>
            {pick(GRIMMJOW_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(GRIMMJOW_SECTIONS.closing.lede, locale)}
          </p>

          <ul className={styles.closingQuotes}>
            {GRIMMJOW_CLOSING.quotes.map((quote) => (
              <li key={quote.text}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {quote.text}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
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

          <p className={styles.quoteDiscipline}>
            {pick(GRIMMJOW_CLOSING.quoteDiscipline, locale)}
          </p>

          <p className={styles.motto} lang="ja">
            {GRIMMJOW_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(GRIMMJOW_CLOSING.mottoNote, locale)}
          </p>

          {frame(GRIMMJOW_IMAGE_KEYS.closing, styles.frameBand)}

          <p className={styles.credit}>
            {pick(GRIMMJOW_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(GRIMMJOW_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(GRIMMJOW_CLOSING.creditNote, locale)}
          </p>
        </div>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(GRIMMJOW_GAPS.title, locale)}
          emptyLabel={pick(GRIMMJOW_GAPS.empty, locale)}
          filledLabel={pick(GRIMMJOW_GAPS.filled, locale)}
          allFilledLabel={pick(GRIMMJOW_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </PanteraShell>
  );
}
