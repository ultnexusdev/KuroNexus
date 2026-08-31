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
  MAKI_ALT,
  MAKI_BONDS,
  MAKI_BOND_UI,
  MAKI_CLOSING,
  MAKI_CRUMB,
  MAKI_FRAME_EMPTY,
  MAKI_GAPS,
  MAKI_GAUGES,
  MAKI_HALL_LINKS,
  MAKI_HALL_UI,
  MAKI_ID,
  MAKI_IDENTITY,
  MAKI_IMAGE_KEYS,
  MAKI_LAB,
  MAKI_MANIFEST,
  MAKI_MANIFEST_NOTE,
  MAKI_MANIFEST_UI,
  MAKI_PORTRAIT,
  MAKI_PORTRAIT_SLOT,
  MAKI_QUOTE_NOTE,
  MAKI_RACK_UI,
  MAKI_RESTRICTION,
  MAKI_SITE_URL,
  MAKI_SLOT_LABELS,
  MAKI_SLOT_SIZES,
  MAKI_SLOT_SPECS,
  MAKI_SYSTEMS,
  MAKI_TIMELINE,
  MAKI_TIMELINE_UI,
  MAKI_TOOLS,
  MAKI_TWIN,
  MAKI_VOIDS,
  type MakiRestriction,
} from "@/lib/characters/maki-zenin-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { RackRule, ToolGlyph, ZeninSeal } from "./MakiGlyphs";
import { RestrictionShell, type RestrictionSide } from "./RestrictionShell";
import { WeaponRack, type RackCell, type RackGauge } from "./WeaponRack";
import styles from "./ArmoryExperience.module.css";

/**
 * Maki Zen'in — "Silah Rafı" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/134167 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: LANET ENERJİSİ YOK — SAF
 * FİZİK VE ALET. Zen'in klanının reddi.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfanın tamamı bir ENVANTER IZGARASI: katı, eşit hücreli bir silah rafı.
 * Künye on iki eşit göz, güç laboratuvarı yedi göz, mekanik altı göz — hepsi
 * aynı hücre ölçüsünde ve aynı raf çizgisinde duruyor. Bölümler bu ızgaranın
 * etrafında düz bloklar; yuvarlak köşe, gölge, degrade, süs yok. Bir oyun
 * envanteri gibi: her şey görünür, her şey ölçülü, hiçbir şey saklı değil.
 *
 * Tipografi tek aileye dayanıyor ve muamele askeri: başlıklar MONO
 * (`--font-plexmono`), ALL CAPS, çok geniş harf aralığı, çok büyük punto —
 * stencil hissi. Gövde `--font-inter`. Aynı dalgadaki Tōji'nin ince/çok büyük
 * Inter başlığının ve Chōsō'nun mincho'sunun tam karşısında duruyor.
 *
 * ── HAREKET: ÇELİK TAKIRTISI ─────────────────────────────────────────────
 * Bütün geçişler `steps()` — kademeli, sert, mekanik. Hücre seçimi üç
 * basamakta oturuyor, ölçü sayıları yerine takırdayarak geliyor, filigranın
 * X'i dört basamakta çiziliyor. Organik hiçbir hareket yok: yumuşama,
 * yaylanma, süzülme yok. Maki'nin sayfası yumuşamaz.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (Zen'in mührü + üstündeki X + künye madalyonu + boş hero kadrajı)
 *   2 Cennetsel Kısıtlama düğmesi — `RestrictionShell` içinde (durum orada)
 *   3 künye şeridi — on iki eşit göz, hepsi AniList künyesinden
 *   4 lanet laboratuvarı — üç sistem + dört yokluk, JJK terminolojisiyle
 *   5 SİLAH RAFI — sayfanın kalbi (`WeaponRack`)
 *   6 kader çizelgesi — beş adım, yaş etiketli
 *   7 bağlar + Lanetli Arşiv + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   RestrictionShell — kök öğe + `data-restriction` (tek dize)
 *   WeaponRack       — envanter ızgarası + ölçü şeridi
 * `MakiGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — KÜÇÜK, o yüzden yalnızca künye
 * madalyonunda). Büyük hero karesi ve on üç kadraj daha BOŞ ve küratör yuvası
 * olarak duruyor; her kadrajın hemen altında kendi yuvası var. Alet hücreleri
 * görselsizken elle çizilmiş SVG siluetle AYAKTA duruyor.
 */
export function ArmoryExperience({
  detail,
  isAdmin,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. AniList'e hotlink YOK — yol yerel. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? MAKI_PORTRAIT.src;

  const name = detail.character.name || MAKI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MAKI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MAKI_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(MAKI_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(MAKI_SLOT_LABELS[key], locale),
    spec: pick(MAKI_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ `isAdmin` KESMESİ: kadraj boşken ziyaretçi ÜRETİM METADATASI görmüyor.
   * On dört kadrajın hepsi bugün boş; koşulsuz yazılsaydı sıradan bir
   * ziyaretçi sayfada on dört kez "geniş bant · 1600×600 · webp" okurdu ve
   * ekran okuyucu da hepsini seslendirirdi (Dalga 1'de Levi'de yapılan hata).
   * Görsel yokken bölüm görselsiz ama AYAKTA kalıyor.
   *
   * ⚠️ Yüklenen görselin üstündeki metne PERDE: `.frameVeil` başlık şeridinin
   * altına koyu bir degrade koyuyor, yani parlak bir kare yüklendiğinde
   * üstteki yazı kaybolmuyor.
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
                alt={`${pick(MAKI_ALT.scenePrefix, locale)} ${pick(
                  MAKI_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 54rem) 92vw, 46rem"
              />
              <span className={styles.frameVeil} aria-hidden />
            </>
          ) : null}
          {/* Köşe çentikleri figcaption'ın ÜSTÜNDE: HTML şartı gereği
              `figcaption` figure'un ilk ya da SON çocuğu olmak zorunda. */}
          <span className={styles.frameCorners} aria-hidden />
          {!scene && isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(MAKI_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(MAKI_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={MAKI_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(MAKI_SLOT_LABELS[key], locale)}
            size={MAKI_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* Silah rafı adasına düz dize iniyor — `LocalizedText` istemciye geçmiyor.
     Hücrenin içeriği (yüklenmiş kare ya da elle çizilmiş siluet) ve altındaki
     küratör bloğu SUNUCUDA çizilip düğüm olarak geçiyor: `next/image` ve
     `CuratorSlot` böylece raf adasının paketine girmiyor. */
  const rackCells: RackCell[] = MAKI_TOOLS.map((tool) => {
    const scene = src(tool.key);
    return {
      id: tool.id,
      mark: tool.mark,
      kanji: tool.kanji,
      reading: tool.reading,
      name: pick(tool.name, locale),
      gradeKanji: tool.gradeKanji,
      grade: pick(tool.grade, locale),
      note: pick(tool.note, locale),
      mass: tool.mass,
      half: tool.half,
      full: tool.full,
      retired: tool.retired === true,
      art: scene ? (
        <Image
          className={styles.cellImg}
          src={scene}
          alt={`${pick(MAKI_ALT.scenePrefix, locale)} ${pick(
            MAKI_SLOT_LABELS[tool.key],
            locale,
          )}`}
          fill
          sizes="(max-width: 40rem) 44vw, 15rem"
        />
      ) : (
        <ToolGlyph
          shape={tool.glyph}
          className={styles.cellGlyph}
          strokeClassName={styles.cellGlyphStroke}
        />
      ),
      slot: isAdmin ? (
        <div className={styles.cellSlot} data-curator-slot>
          <span className={styles.cellSlotSpec}>
            {pick(MAKI_SLOT_SPECS[tool.key], locale)}
          </span>
          <CuratorSlot
            characterId={MAKI_ID}
            slot="ABILITY"
            abilityName={tool.key}
            label={pick(MAKI_SLOT_LABELS[tool.key], locale)}
            size={MAKI_SLOT_SIZES[tool.key]}
          />
        </div>
      ) : null,
    };
  });

  const rackGauges: RackGauge[] = MAKI_GAUGES.map((gauge) => ({
    id: gauge.id,
    kanji: gauge.kanji,
    label: pick(gauge.label, locale),
    unit: gauge.unit,
    max: gauge.max,
  }));

  const restrictionSides: RestrictionSide[] = (["before", "after"] as const).map(
    (id) => ({
      id,
      mark: MAKI_RESTRICTION.modes[id].mark,
      name: pick(MAKI_RESTRICTION.modes[id].name, locale),
      label: pick(MAKI_RESTRICTION.modes[id].label, locale),
    }),
  );

  const restrictionHints: Record<MakiRestriction, string> = {
    before: pick(MAKI_RESTRICTION.modes.before.hint, locale),
    after: pick(MAKI_RESTRICTION.modes.after.hint, locale),
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş soyut Zen'in mührü + ÜSTÜNE ÇİZİLEN X
     (reddediliş) + 禪院. Mühür klanın gerçek armasının kopyası değil, arşivin
     kendi soyut çizimi — gerekçesi `MakiGlyphs` başlığında. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link className={styles.crumbLink} href={animeHref.characters()}>
          {t("backToGallery")}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbHere}>
          {pick(MAKI_CRUMB.series, locale)}
        </span>
      </nav>

      <section className={styles.hero} aria-labelledby="mki-name">
        <span className={styles.watermark} aria-hidden>
          <ZeninSeal
            className={styles.watermarkArt}
            sealClassName={styles.watermarkSeal}
            strikeClassName={styles.watermarkStrike}
          />
          <span className={styles.watermarkKanji} lang="ja">
            {MAKI_IDENTITY.watermarkKanji}
          </span>
        </span>

        <div className={styles.heroHead}>
          <p className={styles.wordmark} aria-hidden>
            {MAKI_IDENTITY.wordmark}
          </p>

          <h1 id="mki-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.heroRank}>{pick(MAKI_IDENTITY.rank, locale)}</p>
          <p className={styles.heroSerial} aria-hidden>
            {MAKI_IDENTITY.serial}
          </p>
        </div>

        <RackRule className={styles.rule} lineClassName={styles.ruleStroke} />

        <div className={styles.heroText}>
          <p className={styles.heroEpigraph}>
            {pick(MAKI_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.heroLede}>{pick(MAKI_IDENTITY.lede, locale)}</p>
        </div>

        {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, dar bir künye kadrajında duruyor.
            Üstündeki gözlük silueti `data-restriction="after"` iken CSS ile
            kalkıyor — modun sayfadaki görünür sonuçlarından biri. */}
        <div className={styles.portraitPlate}>
          <figure className={styles.portrait}>
            <Image
              className={styles.portraitImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded ? MAKI_ALT.portraitUploaded : MAKI_ALT.portrait,
                locale,
              )}
              width={MAKI_PORTRAIT.w}
              height={MAKI_PORTRAIT.h}
              unoptimized={!portraitUploaded}
              priority
            />
            <span className={styles.portraitGlasses} aria-hidden>
              <ToolGlyph
                shape="glasses"
                className={styles.portraitGlassesArt}
                strokeClassName={styles.portraitGlassesStroke}
              />
            </span>
            <span className={styles.frameCorners} aria-hidden />
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={MAKI_ID}
              slot="PORTRAIT"
              label={pick(MAKI_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}
        </div>

        {/* Büyük hero karesi bilerek BOŞ — küratör yuvası olarak duruyor.
            Not yalnızca kadraj GERÇEKTEN boşken yazılıyor. */}
        {src(MAKI_IMAGE_KEYS.hero) ? null : (
          <p className={styles.heroFrameNote}>
            {pick(MAKI_IDENTITY.heroCaption, locale)}
          </p>
        )}
        {frame(MAKI_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <RestrictionShell
      isAdmin={isAdmin}
      title={pick(MAKI_RESTRICTION.title, locale)}
      kanji={MAKI_RESTRICTION.kanji}
      reading={pick(MAKI_RESTRICTION.reading, locale)}
      lede={pick(MAKI_RESTRICTION.lede, locale)}
      sides={restrictionSides}
      hints={restrictionHints}
      rule={pick(MAKI_RESTRICTION.rule, locale)}
      source={pick(MAKI_RESTRICTION.source, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════════════
          On iki eşit göz. Künye bir tablo değil bir envanter dökümü: her
          satır rafın bir gözü ve hepsi aynı ölçüde. */}
      <section className={styles.section} aria-labelledby="mki-manifest">
        <p className={styles.blockMark} aria-hidden>
          03
        </p>
        <h2 id="mki-manifest" className={styles.sectionTitle}>
          {pick(MAKI_MANIFEST_UI.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            {MAKI_MANIFEST_UI.kanji}
          </span>
        </h2>

        <ul className={styles.manifest}>
          {MAKI_MANIFEST.map((row) => (
            <li key={row.mark} className={styles.manifestRow}>
              <span className={styles.manifestMark} aria-hidden>
                {row.mark}
              </span>
              <span className={styles.manifestKanji} lang="ja" aria-hidden>
                {row.kanji}
              </span>
              <span className={styles.manifestLabel}>
                {pick(row.label, locale)}
              </span>
              <span className={styles.manifestValue}>
                {pick(row.value, locale)}
              </span>
            </li>
          ))}
        </ul>

        <p className={styles.manifestNote}>{pick(MAKI_MANIFEST_NOTE, locale)}</p>

        {frame(MAKI_IMAGE_KEYS.manifest, styles.frameBand)}
      </section>

      {/* ══ 4 · LANET LABORATUVARI ═════════════════════════════════════════
          Üç büyük + dört küçük. Terminoloji JJK'nın kendi terminolojisi:
          天与呪縛 · 呪具 · 呪力 · 術式 · 領域展開 · 反転術式 · 束縛. */}
      <section className={styles.section} aria-labelledby="mki-lab">
        <p className={styles.blockMark} aria-hidden>
          04
        </p>
        <h2 id="mki-lab" className={styles.sectionTitle}>
          {pick(MAKI_LAB.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            呪術
          </span>
        </h2>
        <p className={styles.sectionLede}>{pick(MAKI_LAB.lede, locale)}</p>

        <ul className={styles.systems}>
          {MAKI_SYSTEMS.map((system) => (
            <li key={system.mark} className={styles.system}>
              <p className={styles.systemMark} aria-hidden>
                {system.mark}
              </p>
              <p className={styles.systemKanji} lang="ja">
                {system.kanji}
                <span className={styles.systemReading}>{system.reading}</span>
              </p>
              <h3 className={styles.systemTitle}>
                {pick(system.title, locale)}
              </h3>
              <p className={styles.systemText}>{pick(system.summary, locale)}</p>
              <ul className={styles.systemTraits}>
                {system.traits.map((trait) => (
                  <li key={trait.tr} className={styles.systemTrait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>
              {frame(system.key, styles.frameSquare)}
            </li>
          ))}
        </ul>

        <h3 className={styles.voidsTitle}>
          {pick(MAKI_LAB.voidsTitle, locale)}
        </h3>
        <ul className={styles.voids}>
          {MAKI_VOIDS.map((entry) => (
            <li key={entry.mark} className={styles.voidCard}>
              <span className={styles.voidMark} aria-hidden>
                {entry.mark}
              </span>
              <p className={styles.voidKanji} lang="ja">
                {entry.kanji}
                <span className={styles.voidReading}>{entry.reading}</span>
              </p>
              <h4 className={styles.voidTitle}>{pick(entry.title, locale)}</h4>
              <p className={styles.voidVerdict}>{pick(entry.verdict, locale)}</p>
              <p className={styles.voidNote}>{pick(entry.note, locale)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 5 · SİLAH RAFI — SAYFANIN KALBİ ════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="mki-rack">
        <p className={styles.blockMark} aria-hidden>
          05
        </p>
        <h2 id="mki-rack" className={styles.sectionTitle}>
          {pick(MAKI_RACK_UI.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            {MAKI_RACK_UI.kanji}
          </span>
        </h2>
        <p className={styles.sectionLede}>{pick(MAKI_RACK_UI.lede, locale)}</p>

        <WeaponRack
          cells={rackCells}
          gauges={rackGauges}
          labels={{
            rackLabel: pick(MAKI_RACK_UI.rackLabel, locale),
            rackHint: pick(MAKI_RACK_UI.rackHint, locale),
            stripTitle: pick(MAKI_RACK_UI.stripTitle, locale),
            idleName: pick(MAKI_RACK_UI.idleName, locale),
            idleNote: pick(MAKI_RACK_UI.idleNote, locale),
            selectedLabel: pick(MAKI_RACK_UI.selectedLabel, locale),
            retiredLabel: pick(MAKI_RACK_UI.retiredLabel, locale),
            zeroNote: pick(MAKI_RACK_UI.zeroNote, locale),
            massNote: pick(MAKI_RACK_UI.massNote, locale),
            measureNote: pick(MAKI_RACK_UI.measureNote, locale),
            statusPrefix: pick(MAKI_RACK_UI.statusPrefix, locale),
            statusCleared: pick(MAKI_RACK_UI.statusCleared, locale),
          }}
        />

        {frame(MAKI_IMAGE_KEYS.rack, styles.frameBand)}
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="mki-timeline">
        <p className={styles.blockMark} aria-hidden>
          06
        </p>
        <h2 id="mki-timeline" className={styles.sectionTitle}>
          {pick(MAKI_TIMELINE_UI.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            年表
          </span>
        </h2>
        <p className={styles.sectionLede}>
          {pick(MAKI_TIMELINE_UI.lede, locale)}
        </p>

        <ol className={styles.steps}>
          {MAKI_TIMELINE.map((step) => (
            <li key={step.mark} className={styles.step}>
              <span className={styles.stepMark} aria-hidden>
                {step.mark}
              </span>
              <span className={styles.stepAge}>{pick(step.age, locale)}</span>
              <p className={styles.stepKanji} lang="ja">
                {step.kanji}
                <span className={styles.stepReading}>{step.reading}</span>
              </p>
              <h3 className={styles.stepTitle}>{pick(step.title, locale)}</h3>
              <p className={styles.stepText}>{pick(step.text, locale)}</p>
              <p className={styles.stepTerm}>
                <span className={styles.stepTermLabel}>
                  {pick(MAKI_TIMELINE_UI.termLabel, locale)}
                </span>
                {pick(step.term, locale)}
              </p>
            </li>
          ))}
        </ol>

        {frame(MAKI_IMAGE_KEYS.timeline, styles.frameBand)}
      </section>

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          ⚠️ Tam olarak `EXPERIENCE_COMPANIONS[134167]`teki beş kimlik
          çiziliyor. Mai Zen'in'in arşivde numarası YOK: bağlantısız, düz ad. */}
      <section className={styles.section} aria-labelledby="mki-bonds">
        <p className={styles.blockMark} aria-hidden>
          07
        </p>
        <h2 id="mki-bonds" className={styles.sectionTitle}>
          {pick(MAKI_BOND_UI.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            縁
          </span>
        </h2>
        <p className={styles.sectionLede}>{pick(MAKI_BOND_UI.lede, locale)}</p>

        <ul className={styles.bonds}>
          {MAKI_BONDS.map((bond) => {
            const linked =
              bond.characterId !== undefined &&
              isExperienceCharacter(bond.characterId);
            return (
              <li key={bond.name} className={styles.bond}>
                <span className={styles.bondKanji} lang="ja" aria-hidden>
                  {bond.kanji}
                </span>
                <div className={styles.bondHead}>
                  {linked && bond.characterId !== undefined ? (
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
                </div>
                <p className={styles.bondText}>{pick(bond.summary, locale)}</p>
                <span className={styles.bondFlag}>
                  {pick(
                    linked ? MAKI_BOND_UI.hasPage : MAKI_BOND_UI.noPage,
                    locale,
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Arşivde numarası olmayan tek bağ — bağlantı YOK, düz ad. */}
        <div className={styles.twin}>
          <span className={styles.bondKanji} lang="ja" aria-hidden>
            {MAKI_TWIN.kanji}
          </span>
          <p className={styles.twinName}>{MAKI_TWIN.name}</p>
          <p className={styles.twinRole}>{pick(MAKI_TWIN.role, locale)}</p>
          <p className={styles.twinText}>{pick(MAKI_TWIN.summary, locale)}</p>
        </div>
      </section>

      {/* ══ 7b · EVRENİN KENDİ KAYDI ═══════════════════════════════════════
          Üç çapa da `lib/anime/jjk/anchors.ts` defterinde kayıtlı; adres
          `animeHref.jjk()` ile kuruluyor — hiçbir bileşen `/anime/...`
          dizesini elle yazmıyor. */}
      <section className={styles.section} aria-labelledby="mki-hall">
        <p className={styles.blockMark} aria-hidden>
          08
        </p>
        <h2 id="mki-hall" className={styles.sectionTitle}>
          {pick(MAKI_HALL_UI.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            呪術廻戦
          </span>
        </h2>
        <p className={styles.sectionLede}>{pick(MAKI_HALL_UI.lede, locale)}</p>

        <ul className={styles.hallList}>
          {MAKI_HALL_LINKS.map((entry) => (
            <li key={entry.anchor} className={styles.hall}>
              <Link
                className={styles.hallLink}
                href={`${animeHref.jjk()}#${entry.anchor}`}
              >
                <span className={styles.hallKanji} lang="ja" aria-hidden>
                  {entry.kanji}
                </span>
                {pick(entry.label, locale)}
              </Link>
              <span className={styles.hallNote}>{pick(entry.note, locale)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="mki-closing">
        <p className={styles.blockMark} aria-hidden>
          09
        </p>
        <h2 id="mki-closing" className={styles.sectionTitle}>
          {pick(MAKI_CLOSING.title, locale)}
          <span className={styles.sectionKanji} lang="ja" aria-hidden>
            終
          </span>
        </h2>
        <p className={styles.sectionLede}>{pick(MAKI_CLOSING.lede, locale)}</p>

        <p className={styles.quoteNote}>{pick(MAKI_QUOTE_NOTE, locale)}</p>

        <ul className={styles.closingBlocks}>
          {MAKI_CLOSING.blocks.map((block) => (
            <li key={block.term}>
              <figure className={styles.closingBlock}>
                <p className={styles.closingTerm} lang="ja">
                  {block.term}
                </p>
                <p className={styles.closingReading}>
                  {pick(block.reading, locale)}
                </p>
                <p className={styles.closingText}>{pick(block.note, locale)}</p>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                    şartı): not bloğu bilerek onun üstünde duruyor. */}
                <figcaption className={styles.closingBy}>
                  {pick(block.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <RackRule className={styles.rule} lineClassName={styles.ruleStroke} />

        <p className={styles.motto} lang="ja">
          {MAKI_CLOSING.motto}
        </p>
        <p className={styles.mottoNote}>
          {pick(MAKI_CLOSING.mottoReading, locale)}
        </p>

        {frame(MAKI_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(MAKI_CLOSING.credit, locale)}{" "}
          <a
            className={styles.creditLink}
            href={siteUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {pick(MAKI_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>
          {pick(MAKI_CLOSING.creditNote, locale)}
        </p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(MAKI_GAPS.title, locale)}
          emptyLabel={pick(MAKI_GAPS.empty, locale)}
          filledLabel={pick(MAKI_GAPS.filled, locale)}
          allFilledLabel={pick(MAKI_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </RestrictionShell>
  );
}
