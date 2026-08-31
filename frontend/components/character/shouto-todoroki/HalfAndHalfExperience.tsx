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
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import {
  TDR_ALT,
  TDR_BOND_UI,
  TDR_BONDS,
  TDR_CLOSING,
  TDR_CRUMB,
  TDR_DIAL,
  TDR_FACT_NOTE,
  TDR_FACTS_FLAME,
  TDR_FACTS_ICE,
  TDR_GAPS,
  TDR_ID,
  TDR_IDENTITY,
  TDR_IMAGE_KEYS,
  TDR_MISSING_NOTE,
  TDR_MODE,
  TDR_MOVES,
  TDR_PORTRAIT,
  TDR_PORTRAIT_SLOT_KEY,
  TDR_QUIRK,
  TDR_SECTIONS,
  TDR_SITE_URL,
  TDR_SLOT_LABELS,
  TDR_SLOT_SIZES,
  TDR_SLOT_SPECS,
  TDR_TIMELINE,
} from "@/lib/characters/shouto-todoroki-experience";
import { FlameMark, FrostMark, SeamNotch } from "./TodorokiGlyphs";
import {
  SplitShell,
  type DialText,
  type ModeText,
  type SplitBand,
} from "./SplitShell";
import styles from "./HalfAndHalfExperience.module.css";

/**
 * Shōto Todoroki — "Yarım ve Yarım" deneyim sayfası (AniList #89220).
 *
 * /dark-stories/category/anime/karakterler/89220 bu bileşene çıkıyor.
 * Sayfanın fikri tek cümle: BÖLÜNME BİR ORAN, VE ORANI ZİYARETÇİ TUTUYOR.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfanın en üstünden en altına tek bir dikey çizgi iniyor ve HER bölüm o
 * çizginin iki yanına yerleşiyor: solda buz sütunu, sağda alev sütunu.
 * Çizginin yeri `--tdr-split` (0–100) ile veriliyor ve TEK bir kaydırak onu
 * sayfanın tamamında aynı anda kaydırıyor. Kart ızgarası yok, ortalanmış tek
 * kolon yok: her şey iki sütuna düşüyor.
 *
 * ⚠️ Sasuke sayfasında da bir "dikey yarık" var ve fark kasıtlı: orada yarık
 * SABİT bir bölme, burada oran SÜREKLİ ve kullanıcı elinde. Üstelik iki yarı
 * aynı hareket dilini konuşmuyor — solda `clip-path` ile büyüyen kristal,
 * sağda `filter` ile dalgalanan ısı. Kalan eksenlerde de ayrışma dosyanın
 * kendisinde okunuyor: tipografi Cinzel majüskül (tören sesi), düğme bir
 * tarafı SÖNDÜREN "Yarım güç", filigran çizginin iki yanına düşen 半分.
 *
 * ── DURAKLAR (yedi) ──────────────────────────────────────────────────────
 *   1 hero — kimlik çizginin üstünde, portre çizginin İKİ YANINDA
 *   2 mod düğmesi — `SplitShell` içinde ("Yarım güç")
 *   3 künye şeridi — soğuk sütunda sayılar, sıcak sütunda aidiyet + ayna notu
 *   4 Quirk laboratuvarı — 3 büyük kart (個性) + 4 küçük kayıt kartı
 *   5 interaktif bölüm — oran kaydırağı, `SplitShell` içinde
 *   6 kader çizelgesi — beş durak, yaş etiketli, iki replik özgün dilde
 *   7 kapanış — iki replik + 半冷半燃 sözü + kaynak künyesi
 *
 * ── İSTEMCİ ADASI (1) ────────────────────────────────────────────────────
 * `SplitShell`. Kök öğe, "Yarım güç" düğmesi ve oran kaydırağı orada; iki
 * durum aynı adada olmak ZORUNDA çünkü ikisi de aynı kök niteliklerini
 * çeviriyor ve sayfanın iki ayrı yerinde duruyorlar. Bu dosya ve
 * `TodorokiGlyphs` sunucuda kalıyor; adaya yalnızca DÜZ DİZE iniyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden madalyon ölçüsünde).
 * Büyük hero dâhil on altı sahne kadrajı BOŞ ve küratör yuvası olarak
 * duruyor; HER kadrajın hemen altında kendi yuvası var, sayfa sonunda toplu
 * yuva bloğu YOK. Boş kadraj görselsiz ama ayakta: içine elle çizilmiş kar
 * tanesi ya da alev konturu düşüyor (`TodorokiGlyphs`).
 *
 * ⚠️ KADRAJLAR VE YUVALAR SÜTUNLARIN İÇİNDE DEĞİL. Uçlarda (%0 / %100) bir
 * sütun layout'tan tamamen çıkıyor; kadraj o sütunun içinde olsaydı küratör
 * yükleme kutusu da onunla birlikte kaybolurdu. Kadrajlar çizginin İKİ
 * YANINA birden yayılıyor ve bölünme çizgisi onların üstünden geçiyor.
 *
 * ⚠️ Görselin ÜSTÜNDE metin yok — ne ziyaretçi ne yönetici için. Ölçü ve tip
 * künyesi yalnızca `isAdmin` dalında ve kadrajın ALTINDA (Levi hatası). Dolu
 * kadrajda çizginin ve kenarın okunması için perde (`plateScrim`) var.
 */
export function HalfAndHalfExperience({
  detail,
  isAdmin,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare (hotlink YOK). `unoptimized` kararı yükleme durumuna bağlı. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? TDR_PORTRAIT.src;

  const name = detail.character.name || TDR_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? TDR_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? TDR_SITE_URL;

  /* Küratör özeti: portre yuvası + on altı ABILITY anahtarı. */
  const gapRows: CuratorGapRow[] = [
    {
      key: TDR_PORTRAIT_SLOT_KEY,
      label: pick(TDR_SLOT_LABELS[TDR_PORTRAIT_SLOT_KEY], locale),
      spec: pick(TDR_SLOT_SPECS[TDR_PORTRAIT_SLOT_KEY], locale),
      filled: portraitUploaded,
    },
    ...Object.values(TDR_IMAGE_KEYS).map((key) => ({
      key,
      label: pick(TDR_SLOT_LABELS[key], locale),
      spec: pick(TDR_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    })),
  ];

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası.
   *
   * Kadraj çizginin iki yanına birden yayılıyor ve bölünme çizgisi üstünden
   * geçiyor (`plateSeam`) — yani oran kadrajı KIRPMIYOR. Boşken içine tarafın
   * motifi düşüyor: soğuk tarafta kar tanesi, sıcak tarafta alev konturu.
   */
  const plate = (key: string, shapeClass: string, side: "ice" | "flame") => {
    const scene = src(key);
    return (
      <>
        <figure
          className={`${styles.plate} ${shapeClass}`}
          data-filled={scene ? "true" : "false"}
          data-side={side}
        >
          {scene ? (
            <>
              <Image
                className={styles.plateImage}
                src={scene}
                alt={`${pick(TDR_ALT.scenePrefix, locale)} — ${pick(
                  TDR_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 60rem) 94vw, 56rem"
              />
              {/* Perde: yüklenen kare parlak çıktığında bölünme çizgisi ve
                  kenar kaybolmasın. Boş kadrajda zaten koyu zemin var. */}
              <span className={styles.plateScrim} aria-hidden />
            </>
          ) : side === "ice" ? (
            <FrostMark
              className={styles.plateMark}
              armClassName={styles.plateMarkArm}
              coreClassName={styles.plateMarkCore}
            />
          ) : (
            <FlameMark
              className={styles.plateMark}
              outlineClassName={styles.plateMarkOutline}
              tongueClassName={styles.plateMarkTongue}
            />
          )}
          <span className={styles.plateSeam} aria-hidden />
        </figure>
        {isAdmin ? (
          <div className={styles.plateSlot}>
            <CuratorSlot
              characterId={TDR_ID}
              slot="ABILITY"
              abilityName={key}
              label={pick(TDR_SLOT_LABELS[key], locale)}
              size={TDR_SLOT_SIZES[key]}
            />
            <p className={styles.plateSpec}>
              {pick(TDR_SLOT_SPECS[key], locale)}
            </p>
          </div>
        ) : null}
      </>
    );
  };

  /** Bölüm başlığı — çizginin üstüne oturan çentik + tören başlığı. */
  const sectionHead = (
    id: string,
    title: LocalizedText,
    native: string,
    lede: LocalizedText,
  ) => (
    <header className={styles.sectionHead}>
      <SeamNotch
        className={styles.sectionNotch}
        iceClassName={styles.notchIce}
        flameClassName={styles.notchFlame}
      />
      <h2 id={id} className={styles.sectionTitle}>
        {pick(title, locale)}
      </h2>
      <p className={styles.sectionNative} lang="ja" aria-hidden>
        {native}
      </p>
      <p className={styles.sectionLede}>{pick(lede, locale)}</p>
    </header>
  );

  /**
   * Sayfanın ızgarası: bir bölümün iki yarısı.
   *
   * Genişlikleri `--tdr-split` veriyor, yani kaydırak sayfadaki HER `split`
   * öğesini aynı anda çeviriyor. Uçlarda kapanan sütun `display: none` ile
   * layout'tan ve erişilebilirlik ağacından gerçekten çıkıyor; yerini
   * kaydıracın yanındaki bedel paneli alıyor.
   */
  const split = (ice: ReactNode, flame: ReactNode) => (
    <div className={styles.split}>
      <div className={styles.iceSide}>
        <span className={styles.sideMeter} aria-hidden />
        {ice}
      </div>
      <div className={styles.flameSide}>
        <span className={styles.sideMeter} aria-hidden />
        {flame}
      </div>
    </div>
  );

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Kimlik bloğu çizginin ÜSTÜNDE duruyor, iki sütuna da düşmüyor: tek
     `<h1>` bir sütunun içinde olsaydı uçlarda sayfadan silinirdi. Portre de
     çizginin iki yanına yayılıyor — bölünme çizgisi yüzünün ortasından
     geçiyor, sayfanın en kısa cümlesi bu. */
  const crumb = (
    <nav className={styles.crumb} aria-label="breadcrumb">
      <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
      <span className={styles.crumbSep} aria-hidden>
        ·
      </span>
      <span className={styles.crumbHere}>{pick(TDR_CRUMB.series, locale)}</span>
    </nav>
  );

  const hero = (
    <section className={styles.hero} aria-labelledby="tdr-name">
      <div className={styles.heroIdentity}>
        <p className={styles.heroHouse}>{pick(TDR_IDENTITY.house, locale)}</p>
        <h1 id="tdr-name" className={styles.heroName}>
          {name}
        </h1>
        <p className={styles.heroNative} lang="ja">
          {nativeName}
        </p>
      </div>

      {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama hero olarak
          kullanılmıyor. Büyük kare aşağıda, boş ve küratöre ayrılmış. */}
      <figure className={styles.portrait}>
        <Image
          className={styles.portraitImage}
          src={portraitSrc}
          alt={pick(
            portraitUploaded ? TDR_ALT.portraitUploaded : TDR_ALT.portraitLocal,
            locale,
          )}
          width={TDR_PORTRAIT.w}
          height={TDR_PORTRAIT.h}
          priority
          unoptimized={!portraitUploaded}
        />
        <span className={styles.portraitSeam} aria-hidden />
      </figure>
      {isAdmin ? (
        <div className={styles.plateSlot}>
          <CuratorSlot
            characterId={TDR_ID}
            slot="PORTRAIT"
            label={pick(TDR_SLOT_LABELS[TDR_PORTRAIT_SLOT_KEY], locale)}
            size={TDR_SLOT_SIZES[TDR_PORTRAIT_SLOT_KEY]}
          />
          <p className={styles.plateSpec}>
            {pick(TDR_SLOT_SPECS[TDR_PORTRAIT_SLOT_KEY], locale)}
          </p>
        </div>
      ) : null}

      {split(
        <p className={styles.heroEpigraph}>
          {pick(TDR_IDENTITY.epigraph, locale)}
        </p>,
        <p className={styles.heroLede}>{pick(TDR_IDENTITY.lede, locale)}</p>,
      )}

      {plate(TDR_IMAGE_KEYS.hero, styles.plateHero, "ice")}
      {isAdmin ? (
        <p className={styles.plateNote}>
          {pick(TDR_IDENTITY.heroFrameCaption, locale)}
        </p>
      ) : null}
    </section>
  );

  /* ══ 3 · KÜNYE ŞERİDİ ══════════════════════════════════════════════════ */
  const factList = (
    rows: readonly {
      key: string;
      label: LocalizedText;
      value: LocalizedText;
      native: string;
    }[],
    tone: string,
  ) => (
    <dl className={`${styles.facts} ${tone}`}>
      {rows.map((row) => (
        <div key={row.key} className={styles.fact}>
          <dt className={styles.factLabel}>{pick(row.label, locale)}</dt>
          <dd className={styles.factValue}>
            {pick(row.value, locale)}
            <span className={styles.factNative} lang="ja" aria-hidden>
              {row.native}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );

  const dossier = (
    <section className={styles.dossier} aria-labelledby="tdr-dossier">
      {sectionHead(
        "tdr-dossier",
        TDR_SECTIONS.dossier.title,
        TDR_SECTIONS.dossier.native,
        TDR_SECTIONS.dossier.lede,
      )}

      {split(
        factList(TDR_FACTS_ICE, styles.factsIce),
        factList(TDR_FACTS_FLAME, styles.factsFlame),
      )}

      {/* Ayna uyarısı sessiz bir tercih olarak bırakılmadı: hangi sütunun
          onun hangi yarısı olduğu YAZIYLA duruyor. */}
      <p className={styles.mirrorNote}>{pick(TDR_IDENTITY.mirror, locale)}</p>
      <p className={styles.factNote}>{pick(TDR_FACT_NOTE, locale)}</p>
    </section>
  );

  /* ══ 4 · QUIRK LABORATUVARI ════════════════════════════════════════════
     Üç büyük kart kendi tarafına düşüyor: 半冷半燃 soğuk sütunda, 体温 ve
     拒絶 sıcak sütunda. Kartların kadrajları sütunların DIŞINDA, çizginin
     iki yanına yayılan bir yığın hâlinde (gerekçe dosya başlığında). */
  const quirkCard = (card: (typeof TDR_QUIRK)[number]) => (
    <article key={card.key} className={styles.card} data-side={card.side}>
      <p className={styles.cardName} lang="ja">
        {card.name}
      </p>
      <p className={styles.cardReading}>{pick(card.reading, locale)}</p>
      <h3 className={styles.cardTitle}>{pick(card.title, locale)}</h3>
      <p className={styles.cardTagline}>{pick(card.tagline, locale)}</p>
      <p className={styles.cardText}>{pick(card.text, locale)}</p>
      <ul className={styles.cardTraits}>
        {card.traits.map((trait) => (
          <li key={trait.tr} className={styles.cardTrait}>
            {pick(trait, locale)}
          </li>
        ))}
      </ul>
    </article>
  );

  const moveCard = (move: (typeof TDR_MOVES)[number]) => (
    <article key={move.key} className={styles.move} data-side={move.side}>
      <p className={styles.moveKind}>{pick(move.kind, locale)}</p>
      <h3 className={styles.moveName} lang="ja">
        {move.name}
      </h3>
      <p className={styles.moveNote}>{pick(move.note, locale)}</p>
    </article>
  );

  const lab = (
    <section className={styles.lab} aria-labelledby="tdr-quirk">
      {sectionHead(
        "tdr-quirk",
        TDR_SECTIONS.quirk.title,
        TDR_SECTIONS.quirk.native,
        TDR_SECTIONS.quirk.lede,
      )}

      {split(
        TDR_QUIRK.filter((card) => card.side === "ice").map(quirkCard),
        TDR_QUIRK.filter((card) => card.side === "flame").map(quirkCard),
      )}

      <div className={styles.plateStack}>
        {TDR_QUIRK.map((card) => (
          <div key={card.key} className={styles.plateCell}>
            {plate(card.imageKey, styles.plateScene, card.side)}
          </div>
        ))}
      </div>

      {split(
        TDR_MOVES.filter((move) => move.side === "ice").map(moveCard),
        TDR_MOVES.filter((move) => move.side === "flame").map(moveCard),
      )}

      <div className={styles.plateStack}>
        {TDR_MOVES.map((move) => (
          <div key={move.key} className={styles.plateCell}>
            {plate(move.imageKey, styles.plateSquare, move.side)}
          </div>
        ))}
      </div>
    </section>
  );

  /* ══ 6 · KADER ÇİZELGESİ ═══════════════════════════════════════════════
     Her durak kendi tarafında yazılıyor; karşı sütunda o durağın sıra
     numarası ve yaş etiketi duruyor. Yani çizelge de çizginin iki yanına
     yerleşiyor, tek sütuna kaçmıyor. */
  const fateBody = (step: (typeof TDR_TIMELINE)[number]) => (
    <>
      <h3 className={styles.fateTitle}>{pick(step.title, locale)}</h3>
      <p className={styles.fateText}>{pick(step.text, locale)}</p>
      {step.quote ? (
        <figure className={styles.fateQuote}>
          <blockquote className={styles.quoteJa} lang="ja">
            {step.quote.text}
          </blockquote>
          <p className={styles.quoteReading}>
            {pick(step.quote.reading, locale)}
          </p>
          <figcaption className={styles.quoteBy}>
            {pick(step.quote.by, locale)}
          </figcaption>
        </figure>
      ) : null}
      {step.memory ? (
        <figure className={styles.fateMemory}>
          <blockquote className={styles.quoteJa} lang="ja">
            {step.memory.text}
          </blockquote>
          <p className={styles.quoteReading}>
            {pick(step.memory.reading, locale)}
          </p>
          <figcaption className={styles.quoteBy}>
            {pick(step.memory.by, locale)}
          </figcaption>
        </figure>
      ) : null}
    </>
  );

  const fateMark = (step: (typeof TDR_TIMELINE)[number], index: number) => (
    <p className={styles.fateMark}>
      <span className={styles.fateIndex}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={styles.fateAge}>{pick(step.age, locale)}</span>
    </p>
  );

  const fate = (
    <section className={styles.fate} aria-labelledby="tdr-fate">
      {sectionHead(
        "tdr-fate",
        TDR_SECTIONS.fate.title,
        TDR_SECTIONS.fate.native,
        TDR_SECTIONS.fate.lede,
      )}

      <ol className={styles.fateList}>
        {TDR_TIMELINE.map((step, index) => (
          <li key={step.key} className={styles.fateStep} data-side={step.side}>
            {split(
              step.side === "ice" ? fateBody(step) : fateMark(step, index),
              step.side === "flame" ? fateBody(step) : fateMark(step, index),
            )}
            {plate(step.imageKey, styles.plateScene, step.side)}
          </li>
        ))}
      </ol>

      <p className={styles.missingNote}>{pick(TDR_MISSING_NOTE, locale)}</p>
    </section>
  );

  /* ══ 7a · ÇİZGİNİN İKİ YANI ════════════════════════════════════════════ */
  const bondList = (side: "ice" | "flame", heading: LocalizedText) => (
    <>
      <h3 className={styles.bondHeading}>{pick(heading, locale)}</h3>
      <ul className={styles.bondList}>
        {TDR_BONDS.filter((bond) => bond.side === side).map((bond) => {
          const linked = isExperienceCharacter(bond.characterId);
          return (
            <li key={bond.characterId} className={styles.bond}>
              <p className={styles.bondName}>
                {linked ? (
                  <Link
                    className={styles.bondLink}
                    href={animeHref.character(bond.characterId)}
                  >
                    {bond.name}
                  </Link>
                ) : (
                  bond.name
                )}
                <span className={styles.bondNative} lang="ja" aria-hidden>
                  {bond.nativeName}
                </span>
              </p>
              <p className={styles.bondRole}>{pick(bond.role, locale)}</p>
              <p className={styles.bondNote}>{pick(bond.note, locale)}</p>
              <p className={styles.bondBadge}>
                {pick(linked ? TDR_BOND_UI.hasPage : TDR_BOND_UI.noPage, locale)}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );

  const bonds = (
    <section className={styles.bonds} aria-labelledby="tdr-bonds">
      {sectionHead(
        "tdr-bonds",
        TDR_SECTIONS.bonds.title,
        TDR_SECTIONS.bonds.native,
        TDR_SECTIONS.bonds.lede,
      )}

      {split(
        bondList("ice", TDR_BOND_UI.iceHeading),
        bondList("flame", TDR_BOND_UI.flameHeading),
      )}

      {/* Endeavor ve Rei portresiz: ikisi de bu sayfaya bağlı portre
          listesinde değil, o yüzden sonsuza kadar boş duracak bir kadraj
          açılmadı — adlarıyla anıldılar. */}
      <p className={styles.parentsNote}>
        {pick(TDR_BOND_UI.parentsNote, locale)}
      </p>

      {plate(TDR_IMAGE_KEYS.bonds, styles.plateBand, "flame")}
    </section>
  );

  /* ══ 7b · KAPANIŞ ══════════════════════════════════════════════════════ */
  const closingQuote = (quote: (typeof TDR_CLOSING.quotes)[number]) => (
    <figure className={styles.closingQuote} data-side={quote.side}>
      <blockquote className={styles.quoteJa} lang="ja">
        {quote.text}
      </blockquote>
      <p className={styles.quoteReading}>{pick(quote.reading, locale)}</p>
      <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
      {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML şartı). */}
      <figcaption className={styles.quoteBy}>{pick(quote.by, locale)}</figcaption>
    </figure>
  );

  const iceQuote = TDR_CLOSING.quotes.find((quote) => quote.side === "ice");
  const flameQuote = TDR_CLOSING.quotes.find((quote) => quote.side === "flame");

  const closing = (
    <section className={styles.closing} aria-labelledby="tdr-closing">
      {sectionHead(
        "tdr-closing",
        TDR_SECTIONS.closing.title,
        TDR_SECTIONS.closing.native,
        TDR_SECTIONS.closing.lede,
      )}

      {split(
        iceQuote ? closingQuote(iceQuote) : null,
        flameQuote ? closingQuote(flameQuote) : null,
      )}

      {/* 半冷半燃 — dört karakter, ikisi soğuk ikisi sıcak. Söz de tam
          ortadan bölünüyor, sayfanın kendisi gibi. */}
      <p className={styles.motto} lang="ja">
        {TDR_CLOSING.motto}
      </p>
      <ul className={styles.mottoGloss}>
        {TDR_CLOSING.mottoGloss.map((gloss, index) => (
          <li
            key={`${gloss.char}-${index}`}
            className={styles.glossItem}
            data-side={gloss.side}
          >
            <span className={styles.glossChar} lang="ja" aria-hidden>
              {gloss.char}
            </span>
            <span className={styles.glossText}>{pick(gloss.text, locale)}</span>
          </li>
        ))}
      </ul>
      <p className={styles.mottoNote}>{pick(TDR_CLOSING.mottoNote, locale)}</p>

      {plate(TDR_IMAGE_KEYS.closing, styles.plateBand, "ice")}

      <p className={styles.credit}>
        {pick(TDR_CLOSING.credit, locale)}{" "}
        <a
          className={styles.creditLink}
          href={siteUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          {pick(TDR_CLOSING.creditLink, locale)}
        </a>
      </p>
      <p className={styles.creditNote}>
        {pick(TDR_CLOSING.creditSecond, locale)}
      </p>
      <p className={styles.creditNote}>
        {pick(TDR_CLOSING.creditNote, locale)}
      </p>
    </section>
  );

  /* ══ Adaya inen düz dizeler ════════════════════════════════════════════
     `SplitShell` bir istemci adası: içine `LocalizedText` DEĞİL, sunucuda
     seçilmiş düz dize iniyor (yoksa İngilizce sayfada Türkçe görünür). */
  const mode: ModeText = {
    title: pick(TDR_MODE.title, locale),
    native: TDR_MODE.native,
    toFull: pick(TDR_MODE.toFull, locale),
    toHalf: pick(TDR_MODE.toHalf, locale),
    stateHalf: pick(TDR_MODE.stateHalf, locale),
    stateFull: pick(TDR_MODE.stateFull, locale),
    hintHalf: pick(TDR_MODE.hintHalf, locale),
    hintFull: pick(TDR_MODE.hintFull, locale),
  };

  const dial: DialText = {
    title: pick(TDR_SECTIONS.dial.title, locale),
    native: TDR_SECTIONS.dial.native,
    lede: pick(TDR_SECTIONS.dial.lede, locale),
    sliderLabel: pick(TDR_DIAL.sliderLabel, locale),
    iceEnd: pick(TDR_DIAL.iceEnd, locale),
    flameEnd: pick(TDR_DIAL.flameEnd, locale),
    iceLabel: pick(TDR_DIAL.iceLabel, locale),
    flameLabel: pick(TDR_DIAL.flameLabel, locale),
    readoutLabel: pick(TDR_DIAL.readoutLabel, locale),
    valueText: pick(TDR_DIAL.valueText, locale),
    presetsLabel: pick(TDR_DIAL.presetsLabel, locale),
    presetFlame: pick(TDR_DIAL.presetFlame, locale),
    presetHalf: pick(TDR_DIAL.presetHalf, locale),
    presetIce: pick(TDR_DIAL.presetIce, locale),
    keyboardHint: pick(TDR_DIAL.keyboardHint, locale),
    costTitle: pick(TDR_DIAL.costTitle, locale),
    frameCaption: pick(TDR_DIAL.frameCaption, locale),
  };

  const bands: SplitBand[] = TDR_DIAL.bands.map((band) => ({
    upTo: band.upTo,
    title: pick(band.title, locale),
    text: pick(band.text, locale),
  }));

  const dialKey = TDR_IMAGE_KEYS.dial;

  return (
    <SplitShell
      isAdmin={isAdmin}
      watermarkLeft={TDR_IDENTITY.watermarkLeft}
      watermarkRight={TDR_IDENTITY.watermarkRight}
      mode={mode}
      dial={dial}
      bands={bands}
      dialScene={src(dialKey)}
      dialSceneAlt={`${pick(TDR_ALT.scenePrefix, locale)} — ${pick(
        TDR_SLOT_LABELS[dialKey],
        locale,
      )}`}
      dialSlot={
        isAdmin ? (
          <div className={styles.plateSlot}>
            <CuratorSlot
              characterId={TDR_ID}
              slot="ABILITY"
              abilityName={dialKey}
              label={pick(TDR_SLOT_LABELS[dialKey], locale)}
              size={TDR_SLOT_SIZES[dialKey]}
            />
            <p className={styles.plateSpec}>
              {pick(TDR_SLOT_SPECS[dialKey], locale)}
            </p>
          </div>
        ) : null
      }
      crumb={crumb}
      hero={hero}
      dossier={dossier}
      lab={lab}
      rest={
        <>
          {fate}
          {bonds}
          {closing}
          {/* Düzenleyicisiz özet — yalnızca küratör modunda. */}
          {isAdmin ? (
            <CuratorGaps
              title={pick(TDR_GAPS.title, locale)}
              emptyLabel={pick(TDR_GAPS.empty, locale)}
              filledLabel={pick(TDR_GAPS.filled, locale)}
              allFilledLabel={pick(TDR_GAPS.allFilled, locale)}
              rows={gapRows}
            />
          ) : null}
        </>
      }
    />
  );
}
