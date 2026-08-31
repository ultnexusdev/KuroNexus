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
  CHOUSOU_ALT,
  CHOUSOU_ARTS,
  CHOUSOU_BLOOD,
  CHOUSOU_BONDS,
  CHOUSOU_BOND_UI,
  CHOUSOU_CLOSING,
  CHOUSOU_COMPANION_SLOT,
  CHOUSOU_CRUMB,
  CHOUSOU_FRAME_EMPTY,
  CHOUSOU_GAPS,
  CHOUSOU_HERO,
  CHOUSOU_ID,
  CHOUSOU_IDENTITY,
  CHOUSOU_IMAGE_KEYS,
  CHOUSOU_MISSING_NOTE,
  CHOUSOU_NAMELESS,
  CHOUSOU_PORTRAIT,
  CHOUSOU_PORTRAIT_SLOT,
  CHOUSOU_SECTIONS,
  CHOUSOU_SITE_URL,
  CHOUSOU_SLOT_LABELS,
  CHOUSOU_SLOT_SIZES,
  CHOUSOU_SLOT_SPECS,
  CHOUSOU_TENTH,
  CHOUSOU_TERMS,
  CHOUSOU_TIMELINE,
  CHOUSOU_WHISPERS,
  CHOUSOU_WOMBS,
  CHOUSOU_WOMB_UI,
} from "@/lib/characters/chousou-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { BranchNode, VeinWatermark } from "./ChousouGlyphs";
import { BloodShell } from "./BloodShell";
import { NineWombs, type TenthCopy, type WombCopy } from "./NineWombs";
import styles from "./BloodlineExperience.module.css";

/**
 * Chōsō — "Kan Bağı" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/157116 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: DOKUZ SAYILDI, ÜÇÜ
 * ADLANDIRILDI.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Izgara bir DAMAR SÜTUNU: sayfanın ortasından kalın bir damar aşağı iniyor,
 * bölümler ondan sağa ve sola dallanıyor ve her dallanma noktası görünür
 * duruyor. Akış tek yönlü — hiçbir şey yukarı gitmiyor.
 *
 * Rukia'nın (yalnız altyapı deyimi için okundu) dar/ortalanmış tek kolonu,
 * ince mincho'su ve kar tanecikleri bu sayfada YOK: burada başlık aynı
 * ailenin EN KALIN kesimi, harf aralığı negatif, satır aralığı neredeyse
 * kapalı; hareket dili tanecik değil AKIŞKAN SIVI (`stroke-dashoffset` +
 * yavaş nabız).
 *
 * Dalga 4'ün diğer yedisiyle de çakışmıyor: Maki'nin envanter ızgarası ve
 * `steps()` takırtısı, Mahito'nun dikişli düzensiz parçaları — hiçbiri
 * dikey, tek yönlü bir damar değil.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (damar filigranı + 脹相 + madalyon portre + boş hero kadrajı)
 *   2 mod düğmesi — "Kan Bağı", `BloodShell` içinde (durum orada)
 *   3 künye şeridi (on üç satır, dördü bilerek "kayıtta yok")
 *   4 lanet laboratuvarı: üç ağırlık (赤血操術/赤鱗躍動/穿血) + dört terim
 *     (超新星/呪力/領域展開/呪具)
 *   5 dokuz kardeş — SAYFANIN KALBİ (`NineWombs`)
 *   6 bağlar (beş ad, Nexus kaydıyla birebir)
 *   7 kader çizelgesi (beş durak) + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   BloodShell — kök öğe, "Kan Bağı" modu, kılcal damar katmanı
 *   NineWombs  — dokuz kardeş mekaniği
 * `ChousouGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında). Büyük hero karesi ve on altı sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var.
 *
 * ⚠️ Boş kadrajın içindeki üretim metadatası (`1600×900 · webp`) yalnızca
 * `isAdmin` iken çiziliyor. Ziyaretçinin gördüğü boşluk YAZISIZ — Dalga 1
 * denetiminin birinci dersi (Levi'de on beş kutuda ölçü yazıyordu).
 */
export function BloodlineExperience({
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
     kare. İkisi de bizim kaynağımız (FAZ 2 §3), o yüzden `unoptimized` hiç
     yazılmıyor. AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? CHOUSOU_PORTRAIT.src;

  const name = detail.character.name || CHOUSOU_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? CHOUSOU_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? CHOUSOU_SITE_URL;
  const nameless = pick(CHOUSOU_NAMELESS, locale);

  const gapRows: CuratorGapRow[] = Object.values(CHOUSOU_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(CHOUSOU_SLOT_LABELS[key], locale),
    spec: pick(CHOUSOU_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Kadraj boşken de duruyor — ama ziyaretçi için YAZISIZ bir yüzey olarak.
   * Üretim metadatası yalnızca küratöre gösteriliyor.
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
                alt={`${pick(CHOUSOU_ALT.scenePrefix, locale)} ${pick(
                  CHOUSOU_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 40rem) 92vw, 32rem"
              />
            ) : isAdmin ? (
              <figcaption className={styles.frameCaption} data-curator-slot>
                <span className={styles.frameCaptionWord}>
                  {pick(CHOUSOU_FRAME_EMPTY, locale)}
                </span>
                <span className={styles.frameCaptionSpec}>
                  {pick(CHOUSOU_SLOT_SPECS[key], locale)}
                </span>
              </figcaption>
            ) : null}
          </figure>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={CHOUSOU_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(CHOUSOU_SLOT_LABELS[key], locale)}
            size={CHOUSOU_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Damardaki dallanma noktası — her bölümün gövdeye bağlandığı yer. */
  const node = (
    <>
      <span className={styles.node} aria-hidden>
        <BranchNode
          className={styles.nodeArt}
          ringClassName={styles.nodeRing}
          capillaryClassName={styles.nodeCapillary}
        />
      </span>
      <span className={styles.branchLink} aria-hidden />
    </>
  );

  /**
   * "Kan Bağı" açıkken beliren kardeş adı.
   *
   * Kapalıyken CSS onu `display: none` yapıyor, yani ekran okuyucudan da
   * düşüyor: mod kapalıyken sayfada dokuz ad YOK — sadece görünmez değil.
   */
  const whisper = (order: number) => {
    const w = CHOUSOU_WHISPERS[order];
    return (
      <p className={styles.whisper} data-nameless={w.name ? "false" : "true"}>
        <span className={styles.whisperIndex} lang="ja">
          {w.index}
        </span>
        {w.native ? (
          <span className={styles.whisperNative} lang="ja">
            {w.native}
          </span>
        ) : null}
        <span className={styles.whisperName}>{w.name ?? nameless}</span>
        <span className={styles.whisperNote}>{pick(w.note, locale)}</span>
      </p>
    );
  };

  const wombs: WombCopy[] = CHOUSOU_WOMBS.map((womb) => ({
    key: womb.key,
    index: womb.index,
    order: womb.order,
    name: womb.name,
    native: womb.native,
    title: pick(womb.title, locale),
    memory: pick(womb.memory, locale),
    frame: womb.imageKey ? frame(womb.imageKey, styles.frameKin) : null,
  }));

  const tenthLinked = isExperienceCharacter(CHOUSOU_TENTH.characterId);
  const tenth: TenthCopy = {
    index: CHOUSOU_TENTH.index,
    markFrom: CHOUSOU_TENTH.mark.from,
    markTo: CHOUSOU_TENTH.mark.to,
    markNote: pick(CHOUSOU_TENTH.markNote, locale),
    name: tenthLinked ? (
      <Link
        className={styles.tenthLink}
        href={animeHref.character(CHOUSOU_TENTH.characterId)}
      >
        {CHOUSOU_TENTH.name}
      </Link>
    ) : (
      CHOUSOU_TENTH.name
    ),
    native: CHOUSOU_TENTH.native,
    title: pick(CHOUSOU_TENTH.title, locale),
    text: pick(CHOUSOU_TENTH.text, locale),
    note: pick(CHOUSOU_TENTH.note, locale),
    frame: frame(CHOUSOU_TENTH.imageKey, styles.frameWide),
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş damar/dallanma deseni ve üstünde 脹相. İkisi de
     `aria-hidden` — dekoratif. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(CHOUSOU_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="chs-name">
        <span className={styles.mark} aria-hidden>
          <VeinWatermark
            className={styles.markArt}
            trunkClassName={styles.markTrunk}
            branchClassName={styles.markBranch}
            nodeClassName={styles.markNode}
          />
          <span className={styles.markKanji} lang="ja">
            {CHOUSOU_IDENTITY.nativeName}
          </span>
        </span>

        <div className={styles.heroBody}>
          <p className={styles.heroClass} lang="ja">
            {CHOUSOU_IDENTITY.title}
          </p>
          <p className={styles.heroClassReading}>
            {pick(CHOUSOU_IDENTITY.titleReading, locale)}
          </p>

          <h1 id="chs-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>

          {whisper(0)}

          <span className={styles.hairline} aria-hidden />

          <p className={styles.heroEpigraph}>
            {pick(CHOUSOU_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.prose}>{pick(CHOUSOU_HERO.lede, locale)}</p>

          {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero
              olarak kullanılmıyor, dar bir kadrajda duruyor. */}
          <figure className={styles.portrait}>
            <Image
              className={styles.portraitImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? CHOUSOU_HERO.portraitAltUploaded
                  : CHOUSOU_HERO.portraitAlt,
                locale,
              )}
              width={CHOUSOU_PORTRAIT.w}
              height={CHOUSOU_PORTRAIT.h}
              priority
            />
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={CHOUSOU_ID}
              slot="PORTRAIT"
              label={pick(CHOUSOU_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}

          {/* Büyük hero karesi bilerek BOŞ. Not yalnızca kadraj GERÇEKTEN
              boşken yazılıyor: küratör kareyi yüklediğinde "bu kare boş"
              cümlesi yalan olurdu. */}
          {src(CHOUSOU_IMAGE_KEYS.hero) ? null : (
            <p className={styles.prose}>{pick(CHOUSOU_HERO.heroCaption, locale)}</p>
          )}
          {frame(CHOUSOU_IMAGE_KEYS.hero, styles.frameTall)}
        </div>
      </section>
    </>
  );

  return (
    <BloodShell
      isAdmin={isAdmin}
      bloodTitle={pick(CHOUSOU_BLOOD.title, locale)}
      bloodNative={CHOUSOU_BLOOD.native}
      bloodLede={pick(CHOUSOU_BLOOD.lede, locale)}
      bloodEnter={pick(CHOUSOU_BLOOD.enter, locale)}
      bloodExit={pick(CHOUSOU_BLOOD.exit, locale)}
      bloodHintOn={pick(CHOUSOU_BLOOD.hintOn, locale)}
      bloodHintOff={pick(CHOUSOU_BLOOD.hintOff, locale)}
      hero={hero}
    >
      {/* Gövde damarı: bütün bölümler bunun üstünde ve ondan dallanıyor. */}
      <div className={styles.trunk}>
        {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════ */}
        <section className={styles.branch} data-side="left" aria-labelledby="chs-record">
          {node}
          <div className={styles.branchBody}>
            {whisper(2)}
            <h2 id="chs-record" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.record.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.record.lede, locale)}
            </p>

            <dl className={styles.facts}>
              {CHOUSOU_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                  <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.prose}>{pick(CHOUSOU_MISSING_NOTE, locale)}</p>
          </div>
        </section>

        {/* ══ 4a · ÜÇ AĞIRLIK (術式) ══════════════════════════════════════ */}
        <section className={styles.branch} data-side="right" aria-labelledby="chs-arts">
          {node}
          <div className={styles.branchBody}>
            {whisper(3)}
            <h2 id="chs-arts" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.arts.lede, locale)}
            </p>

            <ol className={styles.artList}>
              {CHOUSOU_ARTS.map((art) => (
                <li key={art.key} className={styles.art}>
                  <h3 className={styles.artName} lang="ja">
                    {art.name}
                  </h3>
                  <p className={styles.artReading}>{art.reading}</p>
                  <p className={styles.artTurkish}>{pick(art.turkish, locale)}</p>

                  <span className={styles.hairline} aria-hidden />

                  <p className={styles.artTagline}>{pick(art.tagline, locale)}</p>
                  <p className={styles.prose}>{pick(art.text, locale)}</p>

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
          </div>
        </section>

        {/* ══ 4b · DÖRT TERİM ═════════════════════════════════════════════ */}
        <section className={styles.branch} data-side="left" aria-labelledby="chs-terms">
          {node}
          <div className={styles.branchBody}>
            {whisper(4)}
            <h2 id="chs-terms" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.terms.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.terms.lede, locale)}
            </p>

            <ul className={styles.termList}>
              {CHOUSOU_TERMS.map((term) => (
                <li
                  key={term.key}
                  className={styles.term}
                  data-empty={term.imageKey ? "false" : "true"}
                >
                  <h3 className={styles.termName} lang="ja">
                    {term.name}
                  </h3>
                  <p className={styles.termReading}>{term.reading}</p>
                  <p className={styles.termTurkish}>{pick(term.turkish, locale)}</p>
                  <p className={styles.prose}>{pick(term.note, locale)}</p>
                  {term.imageKey ? frame(term.imageKey, styles.frameSmall) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ 5 · DOKUZ KARDEŞ — SAYFANIN KALBİ ═══════════════════════════
            Damarın üstünde duruyor: bu bölüm sağa ya da sola dallanmıyor,
            sütunun kendisi. */}
        <section className={styles.branch} data-side="spine" aria-labelledby="chs-wombs">
          {node}
          <div className={styles.branchBody}>
            {whisper(5)}
            <h2 id="chs-wombs" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.wombs.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.wombs.lede, locale)}
            </p>

            {frame(CHOUSOU_IMAGE_KEYS.column, styles.frameTall)}

            <NineWombs
              wombs={wombs}
              tenth={tenth}
              gaugeLabel={pick(CHOUSOU_WOMB_UI.gaugeLabel, locale)}
              gaugeUnit={pick(CHOUSOU_WOMB_UI.gaugeUnit, locale)}
              openLabel={pick(CHOUSOU_WOMB_UI.openLabel, locale)}
              openedLabel={pick(CHOUSOU_WOMB_UI.openedLabel, locale)}
              flowingLabel={pick(CHOUSOU_WOMB_UI.flowingLabel, locale)}
              namelessLabel={pick(CHOUSOU_WOMB_UI.namelessLabel, locale)}
              idleHint={pick(CHOUSOU_WOMB_UI.idleHint, locale)}
              flowHint={pick(CHOUSOU_WOMB_UI.flowHint, locale)}
              midHint={pick(CHOUSOU_WOMB_UI.midHint, locale)}
              doneHint={pick(CHOUSOU_WOMB_UI.doneHint, locale)}
              statusFlowing={pick(CHOUSOU_WOMB_UI.statusFlowing, locale)}
              statusOpened={pick(CHOUSOU_WOMB_UI.statusOpened, locale)}
              statusDone={pick(CHOUSOU_WOMB_UI.statusDone, locale)}
              keyboardHint={pick(CHOUSOU_WOMB_UI.keyboardHint, locale)}
            />
          </div>
        </section>

        {/* ══ 6 · BAĞLAR ══════════════════════════════════════════════════
            Çizilen beş ad `EXPERIENCE_COMPANIONS[157116]` ile birebir aynı
            küme: [127212, 210832, 210831, 133702, 133701]. Portre kaydı
            olan madalyonda görünüyor; olmayan yazıyla söyleniyor ve küratör
            yuvası o kadrajın hemen altında duruyor. */}
        <section className={styles.branch} data-side="right" aria-labelledby="chs-kin">
          {node}
          <div className={styles.branchBody}>
            {whisper(6)}
            <h2 id="chs-kin" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.kin.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.kin.lede, locale)}
            </p>

            <ul className={styles.bonds}>
              {CHOUSOU_BONDS.map((bond) => {
                const linked = isExperienceCharacter(bond.characterId);
                const face = faces.get(bond.characterId) ?? null;
                return (
                  <li key={bond.characterId} className={styles.bond}>
                    <figure
                      className={styles.bondFace}
                      data-filled={face ? "true" : "false"}
                    >
                      {face ? (
                        <Image
                          className={styles.bondFaceImg}
                          src={face}
                          alt={`${pick(CHOUSOU_ALT.companionPrefix, locale)} ${bond.name}`}
                          width={120}
                          height={160}
                        />
                      ) : null}
                    </figure>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={bond.characterId}
                        slot="PORTRAIT"
                        label={`${bond.name} — ${pick(CHOUSOU_COMPANION_SLOT, locale)}`}
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
                    <p className={styles.prose}>{pick(bond.line, locale)}</p>
                    <span className={styles.bondFlag}>
                      {pick(
                        linked ? CHOUSOU_BOND_UI.hasPage : CHOUSOU_BOND_UI.noPage,
                        locale,
                      )}
                      {face ? null : ` · ${pick(CHOUSOU_BOND_UI.noPortrait, locale)}`}
                    </span>
                  </li>
                );
              })}
            </ul>

            {frame(CHOUSOU_IMAGE_KEYS.bonds, styles.frameWide)}
          </div>
        </section>

        {/* ══ 7a · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.branch} data-side="left" aria-labelledby="chs-fate">
          {node}
          <div className={styles.branchBody}>
            {whisper(7)}
            <h2 id="chs-fate" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.fate.lede, locale)}
            </p>

            <ol className={styles.fate}>
              {CHOUSOU_TIMELINE.map((stop) => (
                <li key={stop.key} className={styles.stop}>
                  <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
                  <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                  <p className={styles.prose}>{pick(stop.text, locale)}</p>

                  <figure className={styles.stopMark}>
                    <p className={styles.markJa} lang="ja">
                      {stop.mark.text}
                    </p>
                    <figcaption className={styles.markReading}>
                      {pick(stop.mark.reading, locale)}
                    </figcaption>
                  </figure>

                  {frame(stop.imageKey, styles.frameWide)}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ══ 7b · KAPANIŞ ════════════════════════════════════════════════ */}
        <section
          className={styles.branch}
          data-side="spine"
          aria-labelledby="chs-closing"
        >
          {node}
          <div className={styles.branchBody}>
            {whisper(8)}
            <h2 id="chs-closing" className={styles.sectionTitle}>
              {pick(CHOUSOU_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOUSOU_SECTIONS.closing.lede, locale)}
            </p>

            <ul className={styles.closingLines}>
              {CHOUSOU_CLOSING.quotes.map((quote) => (
                <li key={quote.text}>
                  <figure className={styles.closingLine}>
                    <blockquote className={styles.quoteJa} lang="ja">
                      {quote.text}
                    </blockquote>
                    <p className={styles.quoteReading}>{pick(quote.reading, locale)}</p>
                    <p className={styles.prose}>{pick(quote.note, locale)}</p>
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
              {CHOUSOU_CLOSING.motto}
            </p>
            <p className={styles.prose}>{pick(CHOUSOU_CLOSING.mottoNote, locale)}</p>

            {frame(CHOUSOU_IMAGE_KEYS.closing, styles.frameBand)}

            <p className={styles.credit}>
              {pick(CHOUSOU_CLOSING.credit, locale)}{" "}
              <a href={siteUrl} target="_blank" rel="noreferrer noopener">
                {pick(CHOUSOU_CLOSING.creditLink, locale)}
              </a>
            </p>
            <p className={styles.prose}>{pick(CHOUSOU_CLOSING.creditNote, locale)}</p>
          </div>
        </section>
      </div>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(CHOUSOU_GAPS.title, locale)}
          emptyLabel={pick(CHOUSOU_GAPS.empty, locale)}
          filledLabel={pick(CHOUSOU_GAPS.filled, locale)}
          allFilledLabel={pick(CHOUSOU_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </BloodShell>
  );
}
