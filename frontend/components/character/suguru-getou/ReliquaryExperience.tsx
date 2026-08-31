import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick, type LocalizedText } from "@/lib/characters/types";
import {
  collectAbilityImages,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  GETO_ALT,
  GETO_ANCHOR_UI,
  GETO_ANCHORS,
  GETO_ARTS,
  GETO_BOND_UI,
  GETO_BONDS,
  GETO_CLOSING,
  GETO_CRUMB,
  GETO_FRAME_EMPTY,
  GETO_GAPS,
  GETO_HERO,
  GETO_ID,
  GETO_IDENTITY,
  GETO_IMAGE_KEYS,
  GETO_LEAVE_THRESHOLD,
  GETO_MARKS,
  GETO_MISSING_NOTE,
  GETO_MONKEY,
  GETO_NODE_GHOSTS,
  GETO_OUTCOMES,
  GETO_PATH_UI,
  GETO_PORTRAIT,
  GETO_PORTRAIT_SLOT,
  GETO_ROAD_UI,
  GETO_SECTIONS,
  GETO_SITE_URL,
  GETO_SLOT_LABELS,
  GETO_SLOT_SIZES,
  GETO_SLOT_SPECS,
  GETO_STEPS,
  type GetoVoice,
} from "@/lib/characters/suguru-getou-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { BetrayalPath, type PathStepView } from "./BetrayalPath";
import { MonkeyShell } from "./MonkeyShell";
import { BeadStrand, ForkMark, ToriiGate } from "./GetouGlyphs";
import styles from "./ReliquaryExperience.module.css";

/**
 * Suguru Getō — "Tapınak ve İhanet" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133699 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: AYNI ADAM İKİ YOL AYRIMINDA.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfa bir YOL. Yukarıdan aşağı tek bir omurga iniyor ve her bölümde ikiye
 * ayrılıyor: gövde sütunu seçilen dalı sürdürüyor, yanındaki dar sütun
 * seçilmeyen kolu soluk ama OKUNUR tutuyor. Bölümler bu yolun düğümlerinde
 * duruyor; kart ızgarası yok, ortalanmış kolon yok.
 *
 * ⚠️ Rukia sayfasıyla aynı font ikilisini kullanıyor (Shippori Mincho +
 * Cormorant) çünkü ikisi de dalga briefinde kilitli. Muamele bilerek
 * karşıt: Rukia'da ince kesim, 2.4–2.8 satır aralığı ve ortalanmış dar
 * kolon var; burada mincho ORTA BOY ve KALIN (tapınak kitabesi), satır
 * aralığı 1.62, düzen üç sütunlu asimetrik bir yol. Ölçüldü:
 * `node scripts/check-karakter-ayrisma.mjs`.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (torii + tespih filigranı, madalyon portre, boş kapı kadrajı)
 *   2 mod düğmesi — `MonkeyShell` içinde (durum orada)
 *   3 künye şeridi (sekiz satır, biri bilerek boş)
 *   4 güç laboratuvarı: üç sütun (呪霊操術 / 極ノ番 / 特級呪詛師)
 *     + dört terim (呪術 / 呪霊吞み / 領域展開 / 呪力)
 *   5+6 İHANET ÇİZELGESİ — sayfanın kalbi VE kader çizelgesi (`BetrayalPath`);
 *     beş durak, yaş etiketli, kilit anlarda özgün satır
 *   7 bağlar + evren çapaları + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   MonkeyShell  — kök öğe + "Maymun" modu (tek boolean)
 *   BetrayalPath — ihanet çizelgesi
 * `GetouGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında; `unoptimized` YAZILMIYOR, kendi kaynağımız). On beş sahne
 * kadrajı BOŞ ve küratör yuvası olarak duruyor; HER kadrajın hemen altında
 * kendi yuvası var, sayfa sonunda toplu yuva bloğu YOK.
 *
 * ⚠️ Yoldaş portreleri (`companionPortraits`) bu sayfada BİLEREK
 * kullanılmadı. `EXPERIENCE_COMPANIONS[133699]` beş numara taşıyor
 * (Gojō, Shoko, Riko, Tōji, Kenjaku) ama sayfanın bağlar bölümü Yūta,
 * Yūji ve Sukuna'yı da anıyor — onların portresini çizmek listenin
 * DIŞINA çıkmak olurdu (Dalga 1'in dördüncü dersi). Liste ile bölüm
 * arasındaki farkı portre ekleyerek değil, portreyi hiç kullanmayarak
 * çözdük: bağlar ad, rol ve bir cümleyle çiziliyor.
 */
export function ReliquaryExperience({
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
    (portraitUploaded ? primaryPortrait(detail) : null) ?? GETO_PORTRAIT.src;

  const name = detail.character.name || GETO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? GETO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? GETO_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(GETO_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(GETO_SLOT_LABELS[key], locale),
    spec: pick(GETO_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * İki sesli metin — iki versiyon da çiziliyor, görünürlüğe kökteki
   * `data-monkey` karar veriyor (gerekçe: `MonkeyShell` başlığı).
   */
  const voice = (v: GetoVoice, tone?: string) => (
    <>
      <span className={tone ? `${styles.voicePlain} ${tone}` : styles.voicePlain}>
        {pick(v.plain, locale)}
      </span>
      <span
        className={tone ? `${styles.voiceMonkey} ${tone}` : styles.voiceMonkey}
      >
        {pick(v.monkey, locale)}
      </span>
    </>
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ Ziyaretçi boş kadrajı YAZISIZ görüyor. Üretim metadatası
   * ("geniş kadraj · 1600×900 · webp") yalnızca `isAdmin` iken çiziliyor —
   * Dalga 1'in birinci dersi.
   *
   * ⚠️ PERDE. `overlay` verilen kadrajlarda etiket görselin ÜSTÜNDE duruyor
   * ve altında `frameScrim` var — yüklenen kare parlak çıktığında etiket
   * okunmaz olurdu ve kontrast betiği görsel üstünü ölçemiyor. Perde
   * yalnızca kadraj DOLUYKEN çiziliyor; boşken zaten koyu bir zemin var.
   *
   * ⚠️ Boş kadrajın yönetici notu `<figcaption>` DEĞİL `<div>`: bir
   * `<figure>` en fazla tek `figcaption` taşıyabiliyor ve o tek yer
   * ziyaretçinin de gördüğü `overlay` etiketine ayrıldı.
   */
  const frame = (key: string, shapeClass: string, overlay?: string) => {
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
                alt={`${pick(GETO_ALT.scenePrefix, locale)} ${pick(
                  GETO_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 44rem) 92vw, 38rem"
              />
              <span className={styles.frameScrim} aria-hidden />
            </>
          ) : isAdmin ? (
            <div className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(GETO_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(GETO_SLOT_SPECS[key], locale)}
              </span>
            </div>
          ) : null}
          {/* ⚠️ `lang="ja"` YOK: etiket karışık (鳥居 + Türkçe/İngilizce
              sözcük) ve tamamını Japonca ilan etmek Latin yarısını yanlış
              seslendirtirdi. */}
          {overlay ? (
            <figcaption className={styles.frameOverlay}>{overlay}</figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={GETO_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(GETO_SLOT_LABELS[key], locale)}
            size={GETO_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /**
   * YOLUN BİR DÜĞÜMÜ — sayfanın ızgarası.
   *
   * Üç sütun: seçilmeyen kol (soluk) · omurga ve çatal işareti · gövde.
   * 360 pikselde omurga inceliyor ve kol gövdenin ALTINA iniyor, ama
   * silinmiyor — dallanma dar ekranda da okunur kalıyor.
   */
  const node = (
    labelId: string,
    ghostKey: string,
    body: ReactNode,
    tone?: string,
  ) => (
    <section
      className={tone ? `${styles.node} ${tone}` : styles.node}
      aria-labelledby={labelId}
    >
      <aside className={styles.nodeGhost}>
        <p className={styles.nodeGhostBadge}>
          {pick(GETO_ROAD_UI.ghostBadge, locale)}
        </p>
        <p className={styles.nodeGhostLine}>
          {pick(GETO_NODE_GHOSTS[ghostKey], locale)}
        </p>
      </aside>

      <span className={styles.nodeRail} aria-hidden>
        <ForkMark
          className={styles.nodeFork}
          stemClassName={styles.forkStem}
          leftClassName={styles.forkGhostArm}
          rightClassName={styles.forkTakenArm}
          nodeClassName={styles.forkNode}
        />
        <span className={styles.nodeLine} />
      </span>

      <div className={styles.nodeBody}>{body}</div>
    </section>
  );

  const sectionHead = (
    id: string,
    title: LocalizedText,
    lede: LocalizedText,
  ) => (
    <>
      <h2 id={id} className={styles.nodeTitle}>
        {pick(title, locale)}
      </h2>
      <p className={styles.nodeLede}>{pick(lede, locale)}</p>
    </>
  );

  /* ══ 5+6 · İHANET ÇİZELGESİ — adaya inen düz dizeler ═══════════════════ */
  const pathSteps: PathStepView[] = GETO_STEPS.map((step, i) => ({
    key: step.key,
    index: String(i + 1).padStart(2, "0"),
    age: pick(step.age, locale),
    when: pick(step.when, locale),
    title: pick(step.title, locale),
    text: { plain: pick(step.text.plain, locale), monkey: pick(step.text.monkey, locale) },
    original: step.original
      ? {
          kindLabel: pick(
            step.original.kind === "quote"
              ? GETO_PATH_UI.originalQuote
              : GETO_PATH_UI.originalRecord,
            locale,
          ),
          isQuote: step.original.kind === "quote",
          text: step.original.text,
          reading: pick(step.original.reading, locale),
          note: pick(step.original.note, locale),
        }
      : undefined,
    kin: step.kin
      ? {
          name: step.kin.name,
          role: pick(step.kin.role, locale),
          /* Sayfası olan bağlantılı, olmayan düz ad (FAZ 2 şartı). */
          href: isExperienceCharacter(step.kin.characterId)
            ? animeHref.character(step.kin.characterId)
            : null,
        }
      : undefined,
    stayLabel: pick(step.stayLabel, locale),
    leaveLabel: pick(step.leaveLabel, locale),
    stayLine: {
      plain: pick(step.stayLine.plain, locale),
      monkey: pick(step.stayLine.monkey, locale),
    },
    leaveLine: {
      plain: pick(step.leaveLine.plain, locale),
      monkey: pick(step.leaveLine.monkey, locale),
    },
  }));

  const pathFrames = GETO_STEPS.map((step) => (
    <div key={step.key} className={styles.stepFrameWrap}>
      {frame(step.imageKey, styles.frameScene)}
    </div>
  ));

  const pathOutcomes = GETO_OUTCOMES.map((outcome) => ({
    key: outcome.key,
    kanji: outcome.kanji,
    title: pick(outcome.title, locale),
    text: {
      plain: pick(outcome.text.plain, locale),
      monkey: pick(outcome.text.monkey, locale),
    },
    canon: pick(outcome.canon, locale),
  }));

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş torii (山門) + tespih halkası, ikisi de dolgusuz
     ve çok soluk; üstlerinde dikey yazılmış 呪霊操術. Hepsi `aria-hidden`. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(GETO_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="get-name">
        <span className={styles.watermark} aria-hidden>
          <ToriiGate
            className={styles.torii}
            postClassName={styles.toriiPost}
            beamClassName={styles.toriiBeam}
            glowClassName={styles.toriiGlow}
          />
          <BeadStrand
            className={styles.beads}
            cordClassName={styles.beadCord}
            beadClassName={styles.bead}
            knotClassName={styles.beadKnot}
          />
          <span className={styles.watermarkWord} lang="ja">
            {GETO_IDENTITY.watermark}
          </span>
        </span>

        <div className={styles.heroText}>
          <p className={styles.heroHouse}>{pick(GETO_IDENTITY.house, locale)}</p>

          <h1 id="get-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>

          <p className={styles.heroEpigraph}>
            {pick(GETO_IDENTITY.epigraph, locale)}
          </p>

          <p className={styles.heroLede}>{voice(GETO_HERO.lede)}</p>
        </div>

        {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, dar bir kadrajda duruyor. */}
        <figure className={styles.portrait}>
          <Image
            className={styles.portraitImg}
            src={portraitSrc}
            alt={pick(
              portraitUploaded
                ? GETO_HERO.portraitAltUploaded
                : GETO_HERO.portraitAlt,
              locale,
            )}
            width={GETO_PORTRAIT.w}
            height={GETO_PORTRAIT.h}
            priority
          />
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={GETO_ID}
            slot="PORTRAIT"
            label={pick(GETO_PORTRAIT_SLOT, locale)}
            size={{ w: 1200, h: 1600 }}
          />
        ) : null}

        {/* Büyük kapı kadrajı bilerek BOŞ — küratör yuvası. Not yalnızca
            kadraj GERÇEKTEN boşken yazılıyor: küratör kareyi yüklediğinde
            "bu kadraj boş" cümlesi yalan olurdu. */}
        <div className={styles.gate}>
          {frame(
            GETO_IMAGE_KEYS.hero,
            styles.frameGate,
            pick(GETO_HERO.gateLabel, locale),
          )}
          {src(GETO_IMAGE_KEYS.hero) ? null : (
            <p className={styles.gateNote}>{pick(GETO_HERO.gateNote, locale)}</p>
          )}
        </div>
      </section>
    </>
  );

  return (
    <MonkeyShell
      isAdmin={isAdmin}
      title={pick(GETO_MONKEY.title, locale)}
      native={GETO_MONKEY.native}
      enterLabel={pick(GETO_MONKEY.enter, locale)}
      exitLabel={pick(GETO_MONKEY.exit, locale)}
      frameLine={pick(GETO_MONKEY.frame, locale)}
      hintOn={pick(GETO_MONKEY.hintOn, locale)}
      hintOff={pick(GETO_MONKEY.hintOff, locale)}
      rejection={pick(GETO_MONKEY.rejection, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════ */}
      {node(
        "get-identity",
        "identity",
        <>
          {sectionHead(
            "get-identity",
            GETO_SECTIONS.identity.title,
            GETO_SECTIONS.identity.lede,
          )}

          <dl className={styles.facts}>
            {GETO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.factNote}>{pick(GETO_MISSING_NOTE, locale)}</p>
        </>,
      )}

      {/* ══ 4a · ÜÇ SÜTUN ═══════════════════════════════════════════════ */}
      {node(
        "get-arts",
        "arts",
        <>
          {sectionHead(
            "get-arts",
            GETO_SECTIONS.arts.title,
            GETO_SECTIONS.arts.lede,
          )}

          <ol className={styles.arts}>
            {GETO_ARTS.map((art, index) => (
              <li key={art.key} className={styles.art}>
                <p className={styles.artIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className={styles.artKanji} lang="ja">
                  {art.kanji}
                </h3>
                <p className={styles.artReading} lang="ja">
                  {art.reading}
                </p>
                <p className={styles.artName}>{art.name}</p>
                <p className={styles.artTurkish}>{pick(art.turkish, locale)}</p>

                <p className={styles.artTagline}>{voice(art.tagline)}</p>
                <p className={styles.artText}>{voice(art.text)}</p>

                <ul className={styles.artTraits}>
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
        </>,
      )}

      {/* ══ 4b · DÖRT TERİM ═════════════════════════════════════════════ */}
      {node(
        "get-marks",
        "marks",
        <>
          {sectionHead(
            "get-marks",
            GETO_SECTIONS.marks.title,
            GETO_SECTIONS.marks.lede,
          )}

          <ul className={styles.marks}>
            {GETO_MARKS.map((mark) => (
              <li key={mark.key} className={styles.mark}>
                <h3 className={styles.markKanji} lang="ja">
                  {mark.kanji}
                </h3>
                <p className={styles.markReading} lang="ja">
                  {mark.reading}
                </p>
                <p className={styles.markName}>{pick(mark.name, locale)}</p>
                <p className={styles.markNote}>{voice(mark.note)}</p>
                {frame(mark.imageKey, styles.frameSmall)}
              </li>
            ))}
          </ul>
        </>,
      )}

      {/* ══ 5+6 · İHANET ÇİZELGESİ — SAYFANIN KALBİ ═════════════════════ */}
      {node(
        "get-path",
        "path",
        <>
          {sectionHead(
            "get-path",
            GETO_SECTIONS.path.title,
            GETO_SECTIONS.path.lede,
          )}

          {frame(GETO_IMAGE_KEYS.fork, styles.frameWide)}

          <BetrayalPath
            steps={pathSteps}
            frames={pathFrames}
            outcomes={pathOutcomes}
            threshold={GETO_LEAVE_THRESHOLD}
            labels={{
              stepLabel: pick(GETO_PATH_UI.stepLabel, locale),
              forkLabel: pick(GETO_PATH_UI.forkLabel, locale),
              chosenBadge: pick(GETO_PATH_UI.chosenBadge, locale),
              ghostBadge: pick(GETO_PATH_UI.ghostBadge, locale),
              pendingBadge: pick(GETO_PATH_UI.pendingBadge, locale),
              progressLabel: pick(GETO_PATH_UI.progressLabel, locale),
              outcomeTitle: pick(GETO_PATH_UI.outcomeTitle, locale),
              otherOutcome: pick(GETO_PATH_UI.otherOutcome, locale),
              ownOutcome: pick(GETO_PATH_UI.ownOutcome, locale),
              reset: pick(GETO_PATH_UI.reset, locale),
              idle: pick(GETO_PATH_UI.idle, locale),
              partial: pick(GETO_PATH_UI.partial, locale),
              ready: pick(GETO_PATH_UI.ready, locale),
              announceStay: pick(GETO_PATH_UI.announceStay, locale),
              announceLeave: pick(GETO_PATH_UI.announceLeave, locale),
              announceReset: pick(GETO_PATH_UI.announceReset, locale),
              keyboardHint: pick(GETO_PATH_UI.keyboardHint, locale),
            }}
          />
        </>,
      )}

      {/* ══ 7a · BAĞLAR + EVREN ÇAPALARI ════════════════════════════════ */}
      {node(
        "get-bonds",
        "bonds",
        <>
          {sectionHead(
            "get-bonds",
            GETO_SECTIONS.bonds.title,
            GETO_SECTIONS.bonds.lede,
          )}

          <ul className={styles.bonds}>
            {GETO_BONDS.map((bond) => {
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
                    <span className={styles.bondRole}>
                      {pick(bond.role, locale)}
                    </span>
                  </p>
                  <p className={styles.bondLine}>{pick(bond.line, locale)}</p>
                  <p className={styles.bondFlag}>
                    {pick(
                      linked ? GETO_BOND_UI.hasPage : GETO_BOND_UI.noPage,
                      locale,
                    )}
                  </p>
                </li>
              );
            })}
          </ul>

          <h3 className={styles.anchorTitle}>
            {pick(GETO_ANCHOR_UI.title, locale)}
          </h3>
          <p className={styles.anchorLede}>{pick(GETO_ANCHOR_UI.lede, locale)}</p>
          <ul className={styles.anchors}>
            {GETO_ANCHORS.map((anchor) => (
              <li key={anchor.anchor} className={styles.anchor}>
                <Link
                  className={styles.anchorLink}
                  href={`${animeHref.jjk()}#${anchor.anchor}`}
                >
                  <span className={styles.anchorKanji} lang="ja">
                    {anchor.kanji}
                  </span>
                  <span className={styles.anchorLabel}>
                    {pick(anchor.label, locale)}
                  </span>
                </Link>
                <span className={styles.anchorNote}>
                  {pick(anchor.note, locale)}
                </span>
              </li>
            ))}
          </ul>
        </>,
      )}

      {/* ══ 7b · KAPANIŞ ════════════════════════════════════════════════ */}
      {node(
        "get-closing",
        "closing",
        <>
          {sectionHead(
            "get-closing",
            GETO_SECTIONS.closing.title,
            GETO_SECTIONS.closing.lede,
          )}

          <ul className={styles.closingQuotes}>
            {GETO_CLOSING.quotes.map((quote) => (
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

          <p className={styles.motto} lang="ja">
            {GETO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(GETO_CLOSING.mottoNote, locale)}
          </p>

          {frame(GETO_IMAGE_KEYS.closing, styles.frameBand)}

          <p className={styles.credit}>
            {pick(GETO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(GETO_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(GETO_CLOSING.creditNote, locale)}
          </p>
        </>,
      )}

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(GETO_GAPS.title, locale)}
          emptyLabel={pick(GETO_GAPS.empty, locale)}
          filledLabel={pick(GETO_GAPS.filled, locale)}
          allFilledLabel={pick(GETO_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </MonkeyShell>
  );
}
