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
  TOUJI_ALT,
  TOUJI_BONDS,
  TOUJI_BOND_UI,
  TOUJI_CLOSING,
  TOUJI_COLUMN,
  TOUJI_CRUMB,
  TOUJI_FRAME_EMPTY,
  TOUJI_GAPS,
  TOUJI_HERO,
  TOUJI_ID,
  TOUJI_IDENTITY,
  TOUJI_IMAGE_KEYS,
  TOUJI_LAB_MAJOR,
  TOUJI_LAB_MINOR,
  TOUJI_MODE,
  TOUJI_PLAIN_NAMES,
  TOUJI_PORTRAIT,
  TOUJI_PORTRAIT_SLOT,
  TOUJI_SATCHEL_UI,
  TOUJI_SECTIONS,
  TOUJI_SITE_URL,
  TOUJI_SKY,
  TOUJI_SLOT_LABELS,
  TOUJI_SLOT_SIZES,
  TOUJI_SLOT_SPECS,
  TOUJI_STATS,
  TOUJI_TIMELINE,
  TOUJI_TOOLS,
} from "@/lib/characters/touji-fushiguro-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { EmptySkyShell } from "./EmptySkyShell";
import { ToolSatchel } from "./ToolSatchel";
import { ChainMark, HorizonRule, PocketMark, SpearMark } from "./ToujiGlyphs";
import styles from "./HeavenRestrictionExperience.module.css";

/**
 * Tōji Fushiguro (伏黒甚爾) — "Cennetsel Kısıtlama" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/162722 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: ÖLÇÜLEN ŞEY BİR YOKLUK.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfanın üst üçte biri BİLEREK boş — "boş gökyüzü". Her bölüm o boşluğun
 * altına, alçak ve yatay bir banda yerleşiyor. Başlıklar Inter, çok büyük ve
 * çok geniş harf aralıklı; gövde Cormorant. Sayfada iki hareket var:
 * gökyüzünün 150 saniyelik yatay kayması ve bir alet çekildiğinde çizilen
 * kısa çizgi. Başka hiçbir şey kıpırdamıyor — Dalga 4'ün en hareketsiz
 * sayfası bu olmalı, o yüzden süsleme yok.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (boş gökyüzü + Ters Mızrak filigranı + ad)
 *   2 mod düğmesi — `EmptySkyShell` içinde (state orada)
 *   3 künye şeridi (madalyon portre + sekiz satır + yapımlar)
 *   4 lanet laboratuvarı: üç büyük + dört küçük, üçü "yok" diyor
 *   5 envanter — SAYFANIN KALBİ (`ToolSatchel`)
 *   6 kader çizelgesi (beş durak, ark damgalı)
 *   7 bağlar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   EmptySkyShell — kök öğe + "Gökyüzü boş" modu + lanet enerjisi sütunu
 *   ToolSatchel   — envanter tezgâhı
 * `ToujiGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca künye
 * madalyonunda). Büyük hero karesi ve on iki sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var.
 *
 * ⚠️ Boş kadraj ZİYARETÇİYE yazı göstermiyor — yalnızca dolgusuz, çok soluk
 * bir silüet. Ölçü/üretim metni (`TOUJI_SLOT_SPECS`) yalnızca `isAdmin`
 * dalında. Bu sayfada kural özellikle kritik: konusu boşluk olan bir sayfayı
 * on üç etiketli kutuyla doldurmak tasarımı çökertirdi (Dalga 1'de Levi'de
 * tam olarak bu hata yapıldı ve düzeltildi).
 *
 * ⚠️ Yoldaş portreleri (`companionPortraits`) bilerek kullanılmadı: dört
 * küçük yüz karesi sayfanın "boş ve sessiz" kilidini bozardı. Bağlar adla ve
 * çizgiyle çiziliyor; arşivde dosyası olan dördü bağlantılı.
 */
export function HeavenRestrictionExperience({
  detail,
  isAdmin,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? TOUJI_PORTRAIT.src;

  const name = detail.character.name || TOUJI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? TOUJI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? TOUJI_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(TOUJI_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(TOUJI_SLOT_LABELS[key], locale),
      spec: pick(TOUJI_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /* İstemci adasına yalnızca DÜZ DİZE iniyor (sözleşme): `LocalizedText`
     burada, sunucuda çözülüyor. */
  const satchelItems = TOUJI_TOOLS.map((tool) => ({
    key: tool.key,
    name: tool.name,
    reading: tool.reading,
    turkish: pick(tool.turkish, locale),
    line: pick(tool.line, locale),
    pulled: pick(tool.pulled, locale),
    gains: tool.gains.map((gain) => ({ stat: gain.stat, amount: gain.amount })),
  }));

  const satchelStats = TOUJI_STATS.map((stat) => ({
    key: stat.key,
    label: pick(stat.label, locale),
    native: stat.native,
    base: stat.base,
    max: stat.max,
    note: pick(stat.note, locale),
  }));

  /** Her bölümün üstündeki boş gökyüzü. Dekoratif — anlamı hero'da METİN. */
  const sky = <div className={styles.sky} aria-hidden />;

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Boşken kadraj AYAKTA kalıyor ama ziyaretçiye yalnızca dolgusuz bir
   * silüet gösteriyor; ölçü metni yalnızca küratörde.
   */
  const frame = (
    key: string,
    shapeClass: string,
    glyph: "spear" | "chain" | "pocket",
  ) => {
    const scene = src(key);
    return (
      <>
        <figure
          className={`${styles.frame} ${shapeClass}`}
          data-filled={scene ? "true" : "false"}
        >
          {scene ? (
            <Image
              className={styles.frameImg}
              src={scene}
              alt={`${pick(TOUJI_ALT.scenePrefix, locale)} ${pick(
                TOUJI_SLOT_LABELS[key],
                locale,
              )}`}
              fill
              sizes="(max-width: 48rem) 92vw, 44rem"
            />
          ) : (
            <span className={styles.frameGlyph} aria-hidden>
              {glyph === "spear" ? (
                <SpearMark
                  className={styles.glyphArt}
                  bladeClassName={styles.glyphStroke}
                  shaftClassName={styles.glyphStroke}
                  cordClassName={styles.glyphFaint}
                />
              ) : glyph === "chain" ? (
                <ChainMark
                  className={styles.glyphArt}
                  segmentClassName={styles.glyphStroke}
                  linkClassName={styles.glyphFaint}
                />
              ) : (
                <PocketMark
                  className={styles.glyphArt}
                  clothClassName={styles.glyphStroke}
                  seamClassName={styles.glyphFaint}
                />
              )}
            </span>
          )}

          {/* ⚠️ Ölçü ve üretim metni YALNIZCA küratörde. Ziyaretçi boş
              kadrajda tek harf görmüyor. */}
          {!scene && isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(TOUJI_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(TOUJI_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>

        {isAdmin ? (
          <CuratorSlot
            characterId={TOUJI_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(TOUJI_SLOT_LABELS[key], locale)}
            size={TOUJI_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Üst üçte bir boş. İçindeki iki şey de dekoratif: çok yavaş kayan ufuk
     çizgileri ve dolgusuz Ters Mızrak filigranı. İkisi de `aria-hidden`;
     boşluğun ANLAMI aşağıdaki görünür paragrafta yazılı. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>
          {pick(TOUJI_CRUMB.series, locale)}
        </span>
      </nav>

      <section className={styles.hero} aria-labelledby="toj-name">
        <div className={styles.heroSky} aria-hidden>
          <span className={styles.skyDrift}>
            <HorizonRule
              className={styles.skyArt}
              lineClassName={styles.skyLine}
              hazeClassName={styles.skyHaze}
            />
          </span>

          <span className={styles.watermark}>
            <SpearMark
              className={styles.watermarkArt}
              bladeClassName={styles.watermarkStroke}
              shaftClassName={styles.watermarkStroke}
              cordClassName={styles.watermarkFaint}
            />
          </span>

          <span className={styles.watermarkKanji} lang="ja">
            {TOUJI_IDENTITY.nativeName}
          </span>
        </div>

        <div className={styles.heroBody}>
          <p className={styles.heroHouse}>{pick(TOUJI_HERO.house, locale)}</p>

          <h1 id="toj-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.heroEpithet}>
            {pick(TOUJI_HERO.epithet, locale)}
          </p>

          <span className={styles.rule} aria-hidden />

          {/* Boşluğun anlamı METİNLE de söyleniyor — ekran okuyucu görsel
              boşluğu okuyamaz ama tezi okumalı. */}
          <p className={styles.skyNote}>{pick(TOUJI_SKY.note, locale)}</p>

          <p className={styles.heroLede}>{pick(TOUJI_HERO.lede, locale)}</p>
        </div>

        {/* Büyük hero karesi bilerek BOŞ — küratör yuvası olarak duruyor.
            Not yalnızca kadraj GERÇEKTEN boşken ve yalnızca küratörde. */}
        {!src(TOUJI_IMAGE_KEYS.hero) && isAdmin ? (
          <p className={styles.heroFrameNote} data-curator-slot>
            {pick(TOUJI_HERO.heroCaption, locale)}
          </p>
        ) : null}
        <div className={styles.heroFrame}>
          {frame(TOUJI_IMAGE_KEYS.hero, styles.frameTall, "spear")}
        </div>
      </section>
    </>
  );

  return (
    <EmptySkyShell
      isAdmin={isAdmin}
      title={pick(TOUJI_MODE.title, locale)}
      native={TOUJI_MODE.native}
      nativeReading={pick(TOUJI_MODE.nativeReading, locale)}
      enterLabel={pick(TOUJI_MODE.enter, locale)}
      exitLabel={pick(TOUJI_MODE.exit, locale)}
      hintOn={pick(TOUJI_MODE.hintOn, locale)}
      hintOff={pick(TOUJI_MODE.hintOff, locale)}
      columnLabel={pick(TOUJI_COLUMN.label, locale)}
      columnNative={TOUJI_COLUMN.native}
      columnValue={TOUJI_COLUMN.value}
      columnReading={pick(TOUJI_COLUMN.reading, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="toj-identity">
        {sky}

        <div className={styles.sectionBody}>
          <h2 id="toj-identity" className={styles.sectionTitle}>
            {pick(TOUJI_SECTIONS.identity.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(TOUJI_SECTIONS.identity.lede, locale)}
          </p>

          <div className={styles.identity}>
            <div className={styles.portraitCol}>
              {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero
                  karesi olarak kullanılmıyor. */}
              <figure className={styles.portrait}>
                <Image
                  className={styles.portraitImg}
                  src={portraitSrc}
                  alt={pick(
                    portraitUploaded
                      ? TOUJI_ALT.portraitUploaded
                      : TOUJI_ALT.portrait,
                    locale,
                  )}
                  width={TOUJI_PORTRAIT.w}
                  height={TOUJI_PORTRAIT.h}
                  unoptimized={!portraitUploaded}
                  sizes="10rem"
                />
              </figure>
              {isAdmin ? (
                <CuratorSlot
                  characterId={TOUJI_ID}
                  slot="PORTRAIT"
                  label={pick(TOUJI_PORTRAIT_SLOT, locale)}
                  size={{ w: 1200, h: 1600 }}
                />
              ) : null}
            </div>

            <dl className={styles.facts}>
              {TOUJI_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt className={styles.factLabel}>
                    {pick(fact.label, locale)}
                  </dt>
                  <dd className={styles.factValue}>
                    {pick(fact.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <h3 className={styles.subTitle}>
            {pick(TOUJI_IDENTITY.appearancesTitle, locale)}
          </h3>
          <ul className={styles.appearances}>
            {TOUJI_IDENTITY.appearances.map((entry) => (
              <li key={entry.title} className={styles.appearance}>
                <span className={styles.appearanceTitle}>{entry.title}</span>
                <span className={styles.appearanceRole}>
                  {pick(entry.role, locale)}
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.factNote}>
            {pick(TOUJI_IDENTITY.missingNote, locale)}
          </p>
        </div>
      </section>

      {/* ══ 4 · LANET LABORATUVARI ═════════════════════════════════════════
          Üç büyük + dört küçük. Üç küçük kart "yok" diyor ve KADRAJLARI DA
          YOK: olmayan bir tekniğin sahnesi olmaz, boş bir yuva koymak onu
          "eksik" gibi gösterirdi. */}
      <section className={styles.section} aria-labelledby="toj-lab">
        {sky}

        <div className={styles.sectionBody}>
          <h2 id="toj-lab" className={styles.sectionTitle}>
            {pick(TOUJI_SECTIONS.lab.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(TOUJI_SECTIONS.lab.lede, locale)}
          </p>

          <h3 className={styles.subTitle}>
            {pick(TOUJI_SECTIONS.lab.majorTitle, locale)}
          </h3>

          <ol className={styles.majors}>
            {TOUJI_LAB_MAJOR.map((card, index) => (
              <li key={card.key} className={styles.major}>
                <p className={styles.majorIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h4 className={styles.majorName} lang="ja">
                  {card.name}
                </h4>
                <p className={styles.majorReading}>{card.reading}</p>
                <p className={styles.majorTurkish}>
                  {pick(card.turkish, locale)}
                </p>
                <p className={styles.verdict}>{pick(card.verdict, locale)}</p>

                <p className={styles.majorText}>{pick(card.text, locale)}</p>

                <ul className={styles.traits}>
                  {card.traits.map((trait) => (
                    <li key={trait.tr} className={styles.trait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>

                {frame(card.imageKey, styles.frameWide, "chain")}

                {"pieces" in card ? (
                  <ul className={styles.pieces}>
                    {card.pieces.map((piece) => (
                      <li key={piece.key} className={styles.piece}>
                        <h5 className={styles.pieceName} lang="ja">
                          {piece.name}
                        </h5>
                        <p className={styles.pieceReading}>{piece.reading}</p>
                        <p className={styles.pieceTurkish}>
                          {pick(piece.turkish, locale)}
                        </p>
                        <p className={styles.pieceNote}>
                          {pick(piece.note, locale)}
                        </p>
                        {frame(
                          piece.imageKey,
                          styles.frameSmall,
                          piece.key === "spear" ? "spear" : "chain",
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>

          <h3 className={styles.subTitle}>
            {pick(TOUJI_SECTIONS.lab.minorTitle, locale)}
          </h3>

          <ul className={styles.minors}>
            {TOUJI_LAB_MINOR.map((card) => (
              <li
                key={card.key}
                className={styles.minor}
                data-absent={card.key === "vow" ? "false" : "true"}
              >
                <h4 className={styles.minorName} lang="ja">
                  {card.name}
                </h4>
                <p className={styles.minorReading}>{card.reading}</p>
                <p className={styles.minorTurkish}>
                  {pick(card.turkish, locale)}
                </p>
                <p className={styles.minorVerdict}>
                  {pick(card.verdict, locale)}
                </p>
                <p className={styles.minorNote}>{pick(card.note, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 5 · ENVANTER — SAYFANIN KALBİ ══════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="toj-satchel">
        {sky}

        <div className={styles.sectionBody}>
          <h2 id="toj-satchel" className={styles.sectionTitle}>
            {pick(TOUJI_SECTIONS.satchel.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(TOUJI_SECTIONS.satchel.lede, locale)}
          </p>

          <ToolSatchel
            items={satchelItems}
            stats={satchelStats}
            rollTitle={pick(TOUJI_SATCHEL_UI.rollTitle, locale)}
            rollHint={pick(TOUJI_SATCHEL_UI.rollHint, locale)}
            physicalTitle={pick(TOUJI_SATCHEL_UI.physicalTitle, locale)}
            columnTitle={pick(TOUJI_SATCHEL_UI.columnTitle, locale)}
            columnNative={TOUJI_SATCHEL_UI.columnNative}
            columnCaption={pick(TOUJI_SATCHEL_UI.columnCaption, locale)}
            outBadge={pick(TOUJI_SATCHEL_UI.outBadge, locale)}
            inBadge={pick(TOUJI_SATCHEL_UI.inBadge, locale)}
            attemptsLabel={pick(TOUJI_SATCHEL_UI.attemptsLabel, locale)}
            attemptsNote={pick(TOUJI_SATCHEL_UI.attemptsNote, locale)}
            resetLabel={pick(TOUJI_SATCHEL_UI.resetLabel, locale)}
            statusIdle={pick(TOUJI_SATCHEL_UI.statusIdle, locale)}
            statusReturned={pick(TOUJI_SATCHEL_UI.statusReturned, locale)}
            statusReset={pick(TOUJI_SATCHEL_UI.statusReset, locale)}
            statusAll={pick(TOUJI_SATCHEL_UI.statusAll, locale)}
            closingLine={pick(TOUJI_SATCHEL_UI.closingLine, locale)}
          />

          {frame(TOUJI_IMAGE_KEYS.satchel, styles.frameWide, "pocket")}
        </div>
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="toj-fate">
        {sky}

        <div className={styles.sectionBody}>
          <h2 id="toj-fate" className={styles.sectionTitle}>
            {pick(TOUJI_SECTIONS.fate.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(TOUJI_SECTIONS.fate.lede, locale)}
          </p>

          <ol className={styles.fate}>
            {TOUJI_TIMELINE.map((stop) => {
              const kinLinked = stop.kin
                ? isExperienceCharacter(stop.kin.characterId)
                : false;
              return (
                <li key={stop.key} className={styles.stop}>
                  <p className={styles.stopStamp} lang="ja">
                    {stop.stamp}
                  </p>
                  <p className={styles.stopStampReading}>
                    {pick(stop.stampReading, locale)}
                  </p>

                  <h3 className={styles.stopTitle}>
                    {pick(stop.title, locale)}
                  </h3>
                  <p className={styles.stopText}>{pick(stop.text, locale)}</p>

                  {/* ⚠️ Bu bir REPLİK DEĞİL: o durağın doğrulanmış Japonca
                      terimi. Tırnak içinde söylenmiş cümle bu sayfada hiç
                      yok — gerekçesi veri dosyasının başında. */}
                  <p className={styles.stopMark} lang="ja">
                    {stop.mark}
                  </p>
                  <p className={styles.stopMarkReading}>
                    {pick(stop.markReading, locale)}
                  </p>

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

                  {frame(stop.imageKey, styles.frameScene, "pocket")}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Portresiz, bilerek: bu sayfanın kilidi "boş ve sessiz". Dört dosya
          bağlantılı; arşivde numarası olmayan iki ad yalnızca yazılı. */}
      <section className={styles.section} aria-labelledby="toj-bonds">
        {sky}

        <div className={styles.sectionBody}>
          <h2 id="toj-bonds" className={styles.sectionTitle}>
            {pick(TOUJI_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(TOUJI_SECTIONS.bonds.lede, locale)}
          </p>

          <ul className={styles.bonds}>
            {TOUJI_BONDS.map((bond) => {
              const linked = isExperienceCharacter(bond.characterId);
              return (
                <li key={bond.characterId} className={styles.bond}>
                  <p className={styles.bondHead}>
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
                  </p>
                  <p className={styles.bondRole}>{pick(bond.role, locale)}</p>
                  <p className={styles.bondLine}>{pick(bond.line, locale)}</p>
                  <p className={styles.bondFlag}>
                    {pick(
                      linked ? TOUJI_BOND_UI.hasPage : TOUJI_BOND_UI.noPage,
                      locale,
                    )}
                  </p>
                </li>
              );
            })}
          </ul>

          <ul className={styles.plainNames}>
            {TOUJI_PLAIN_NAMES.map((entry) => (
              <li key={entry.name} className={styles.plainName}>
                <span className={styles.plainNameText}>{entry.name}</span>
                <span className={styles.plainNameRole}>
                  {pick(entry.role, locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 7b · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="toj-closing">
        {sky}

        <div className={styles.sectionBody}>
          <h2 id="toj-closing" className={styles.sectionTitle}>
            {pick(TOUJI_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(TOUJI_SECTIONS.closing.lede, locale)}
          </p>

          <ul className={styles.lines}>
            {TOUJI_CLOSING.lines.map((line) => (
              <li key={line.text}>
                <figure className={styles.line}>
                  <blockquote className={styles.lineJa} lang="ja">
                    {line.text}
                  </blockquote>
                  <p className={styles.lineReading}>
                    {pick(line.reading, locale)}
                  </p>
                  <p className={styles.lineTurkish}>
                    {pick(line.turkish, locale)}
                  </p>
                  <p className={styles.lineNote}>{pick(line.note, locale)}</p>
                  {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                      şartı): not bloğu bilerek onun üstünde duruyor. */}
                  <figcaption className={styles.lineBy}>
                    {pick(line.by, locale)}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className={styles.quoteNote}>
            {pick(TOUJI_CLOSING.quoteNote, locale)}
          </p>

          <span className={styles.rule} aria-hidden />

          <p className={styles.motto} lang="ja">
            {TOUJI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(TOUJI_CLOSING.mottoNote, locale)}
          </p>

          {frame(TOUJI_IMAGE_KEYS.closing, styles.frameBand, "chain")}

          <p className={styles.credit}>
            {pick(TOUJI_CLOSING.credit, locale)}{" "}
            <a
              className={styles.creditLink}
              href={siteUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {pick(TOUJI_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(TOUJI_CLOSING.creditNote, locale)}
          </p>
        </div>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(TOUJI_GAPS.title, locale)}
          emptyLabel={pick(TOUJI_GAPS.empty, locale)}
          filledLabel={pick(TOUJI_GAPS.filled, locale)}
          allFilledLabel={pick(TOUJI_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </EmptySkyShell>
  );
}
