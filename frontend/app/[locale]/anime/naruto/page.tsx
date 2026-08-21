import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { getCharacterImages } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { AKATSUKI_IDS, EXHIBIT_IMAGE_KEYS } from "@/lib/anime/akatsuki";
import { animeHref } from "@/lib/anime/routes";
import {
  NARUTO_ARCHIVES,
  NARUTO_BATTLES,
  NARUTO_BIJUU,
  NARUTO_CLANS,
  NARUTO_ELEMENTS,
  NARUTO_ERAS,
  NARUTO_EYES,
  NARUTO_HOKAGE,
  NARUTO_HOKAGE_CANDIDATE,
  NARUTO_IMAGE_KEYS,
  NARUTO_IMAGE_SLOTS,
  NARUTO_JUTSU,
  NARUTO_JUTSU_CATEGORIES,
  NARUTO_LEGENDS,
  NARUTO_MINOR_VILLAGES,
  NARUTO_MISSIONS,
  NARUTO_NATIONS,
  NARUTO_OTHER_KAGE,
  NARUTO_OWNER_ID,
  NARUTO_PLACES,
  NARUTO_RANKS,
  NARUTO_SENJU_LINE,
  NARUTO_TEAMS,
  NARUTO_UCHIHA_LINE,
  NARUTO_VILLAGES,
} from "@/lib/anime/naruto";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import {
  NarutoAtlas,
  NarutoBijuuPicker,
  NarutoChakra,
  NarutoChronicle,
  NarutoDojutsu,
} from "@/components/anime/naruto/NarutoSelectors";
import shell from "../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Naruto Evreni",
  description:
    "Shinobi dünyasının kaydı: uluslar, klanlar, chakra, dōjutsu, kuyruklu " +
    "canavarlar, Hokage'ler ve evreni bugüne getiren savaşlar.",
};

/**
 * `/anime/naruto` — Naruto Evreni.
 *
 * ── ARŞİVDEKİ SERİ SAYFASINDAN NEDEN AYRI ────────────────────────────────
 * `/dark-stories/category/anime/naruto` "izlediğim seri" kaydı: bölüm
 * ızgarası, ilerleme, raf durumu. Burası ise EVRENİN kendisi — ne izlediğimle
 * ilgisi yok. İkisini tek sayfada birleştirmek, ilerleme çubuğuyla klan
 * soyağacını aynı ekrana koymak demekti.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Bütün kadrajlar küratör yuvası (`NARUTO_IMAGE_KEYS`). Yuva boşsa bölüm
 * görselsiz çizilir, hiçbir yerde boş çerçeve durmaz (boş oda yasağı).
 * Küratör modu açıldığında yuvalar bölümlerin içinde belirir; hem dosya
 * yükleme hem adres yapıştırma çalışır — adres verildiğinde backend görseli
 * İNDİRİP kendi diskimize yazıyor, hotlink yok (CSP zaten engellerdi).
 *
 * ── AKATSUKI ─────────────────────────────────────────────────────────────
 * Gölgeler bölümü kendi sergisine kapı açıyor (`/anime/akatsuki`) ve oradaki
 * mevcut görselleri okuyor — bu sayfa Akatsuki için ikinci bir görsel seti
 * TUTMUYOR, sergininkini ödünç alıyor.
 */
export default async function NarutoUniversePage() {
  const [images, akatsukiImages, isAdmin] = await Promise.all([
    // Sayfanın kendi kadrajları + kadro portreleri tek istekte
    getCharacterImages([
      NARUTO_OWNER_ID,
      ...NARUTO_LEGENDS.map((legend) => legend.characterId).filter(
        (id): id is number => typeof id === "number",
      ),
    ]),
    // Akatsuki sergisinin görselleri — Gölgeler bölümü bunları ödünç alıyor
    getCharacterImages([AKATSUKI_IDS.pain]),
    readIsAdmin(),
  ]);

  /** Yuva anahtarından kadraj. SON kayıt kazanır (kürasyon sözleşmesi:
      yeni yükleme eskisini görsel olarak ezer, eski kayıt silinmez). */
  const art = (key: string) =>
    [...images]
      .reverse()
      .find((row) => row.slot === "ABILITY" && row.abilityName === key) ?? null;

  const portrait = (characterId?: number) =>
    typeof characterId === "number"
      ? ([...images]
          .reverse()
          .find(
            (row) =>
              row.characterId === characterId && row.slot === "PORTRAIT",
          ) ?? null)
      : null;

  /** Akatsuki kadro bandı — sergideki `akatsuki:legion` kadrajı */
  const akatsukiBand =
    [...akatsukiImages]
      .reverse()
      .find(
        (row) =>
          row.slot === "ABILITY" &&
          row.abilityName === EXHIBIT_IMAGE_KEYS.legion,
      ) ?? null;

  const hero = art(NARUTO_IMAGE_KEYS.hero);

  /** Mekânlar bölgeye göre gruplanıyor — kayıt sırası korunuyor */
  const placeRegions = NARUTO_PLACES.reduce<Record<string, typeof NARUTO_PLACES>>(
    (acc, place) => {
      (acc[place.region] ??= []).push(place);
      return acc;
    },
    {},
  );

  return (
    <CuratorFrame isAdmin={isAdmin}>
      <main className={styles.page}>
        <nav className={shell.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <span>Naruto Evreni</span>
        </nav>

        {/* ══ AÇILIŞ ══════════════════════════════════════════════════ */}
        <header className={styles.opening}>
          {hero ? (
            <span className={styles.heroArt} aria-hidden>
              <Image src={apiUrl(hero.url)} alt="" fill sizes="1920px" priority />
            </span>
          ) : null}
          <span className={styles.heroPool} aria-hidden />

          <div className={styles.openingInner}>
            <p className={shell.eyebrow}>Anime · Evren Kaydı</p>
            <h1 className={`${shell.display} ${shell.world}`}>NARUTO EVRENİ</h1>
            <p className={shell.lede}>
              Chakranın bir armağan olarak bırakıldığı, klanların köye
              dönüştüğü ve barışın her kuşakta yeniden pazarlık edildiği
              dünyanın kaydı.
            </p>
            <CuratorSlotIf
              enabled={isAdmin}
              characterId={NARUTO_OWNER_ID}
              slot="ABILITY"
              abilityName={NARUTO_IMAGE_KEYS.hero}
              label="Açılış fonu"
            />
          </div>
        </header>

        {/* ══ 1 · SHINOBI DÜNYASI ════════════════════════════════════ */}
        <Section
          id="dunya"
          title="Shinobi Dünyası"
          lede="Beş büyük ulus, aralarında ezilen küçük köyler ve her birinin kendi gölgesi."
          art={art(NARUTO_IMAGE_KEYS.atlas)}
          slotKey={NARUTO_IMAGE_KEYS.atlas}
          slotLabel="Shinobi Dünyası fonu"
          isAdmin={isAdmin}
        >
          <NarutoAtlas nations={NARUTO_NATIONS} />
        </Section>

        {/* ══ 2 · KÖYLER ═════════════════════════════════════════════ */}
        <Section
          title="Köyler ve Bölgeler"
          lede="Beş büyük köy ve onların gölgesinde kalan altı yerleşim."
          isAdmin={isAdmin}
          slotKey={NARUTO_IMAGE_KEYS.konoha}
          slotLabel="Konohagakure kadrajı"
        >
          <ul className={styles.villageGrid}>
            {NARUTO_VILLAGES.map((village) => (
              <li
                key={village.name}
                className={styles.village}
                style={{ "--tint": village.tint } as React.CSSProperties}
              >
                <span className={styles.villageKanji} aria-hidden>
                  {village.kanji}
                </span>
                <h3 className={styles.villageName}>{village.name}</h3>
                <p className={styles.villageEn}>{village.en}</p>
              </li>
            ))}
          </ul>

          <h3 className={styles.subhead}>Gölgede kalanlar</h3>
          <ul className={styles.minorList}>
            {NARUTO_MINOR_VILLAGES.map((village) => (
              <li
                key={village.name}
                className={styles.minor}
                style={{ "--rec": village.color } as React.CSSProperties}
              >
                <span className={styles.minorName}>{village.name}</span>
                <span className={styles.minorTag}>{village.tag}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══ 3 · İKONİK MEKÂNLAR ════════════════════════════════════ */}
        <Section
          title="İkonik Mekânlar"
          lede="Hikâyenin döndüğü yerler."
          art={art(NARUTO_IMAGE_KEYS.hokageRock)}
          slotKey={NARUTO_IMAGE_KEYS.hokageRock}
          slotLabel="Hokage Kayalığı"
          isAdmin={isAdmin}
        >
          {Object.entries(placeRegions).map(([region, places]) => (
            <div key={region} className={styles.regionBlock}>
              <h3 className={styles.regionLabel}>{region}</h3>
              <ul className={styles.placeGrid}>
                {places.map((place) => (
                  <li key={place.name} className={styles.place}>
                    <h4 className={styles.placeName}>{place.name}</h4>
                    <p className={styles.placeDesc}>{place.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        {/* ══ 4 · EFSANELER ══════════════════════════════════════════ */}
        <Section
          id="shinobi"
          title="Shinobi Efsaneleri"
          lede="Evreni taşıyan dokuz isim. Sıra anlatı sırası, güç sırası değil."
          art={art(NARUTO_IMAGE_KEYS.legends)}
          slotKey={NARUTO_IMAGE_KEYS.legends}
          slotLabel="Efsaneler bandı"
          isAdmin={isAdmin}
        >
          <ul className={styles.legendGrid}>
            {NARUTO_LEGENDS.map((legend) => {
              const face = portrait(legend.characterId);
              return (
                <li
                  key={legend.no}
                  className={styles.legend}
                  style={
                    {
                      "--rec": legend.accent,
                      "--glow": legend.glow,
                    } as React.CSSProperties
                  }
                >
                  {face ? (
                    <span className={styles.legendFace} aria-hidden>
                      <Image
                        src={apiUrl(face.url)}
                        alt=""
                        fill
                        sizes="420px"
                      />
                    </span>
                  ) : null}
                  <span className={styles.legendNo} aria-hidden>
                    {legend.no}
                  </span>
                  <div className={styles.legendBody}>
                    <h3 className={styles.legendName}>{legend.name}</h3>
                    <p className={styles.legendTitle}>{legend.title}</p>
                    <p className={styles.legendPower}>{legend.power}</p>
                  </div>
                  {legend.characterId ? (
                    <CuratorSlotIf
                      enabled={isAdmin}
                      characterId={legend.characterId}
                      slot="PORTRAIT"
                      label={`${legend.name} portresi`}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Section>

        {/* ══ 5 · TAKIMLAR ═══════════════════════════════════════════ */}
        <Section title="Takımlar" lede="Üç kişi ve bir sensei — evrenin temel birimi.">
          <ul className={styles.teamGrid}>
            {NARUTO_TEAMS.map((team) => (
              <li
                key={team.name}
                className={styles.team}
                style={{ "--rec": team.color } as React.CSSProperties}
              >
                <p className={styles.teamTag}>{team.tag}</p>
                <h3 className={styles.teamName}>{team.name}</h3>
                <ul className={styles.teamMembers}>
                  {team.members.map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
                <p className={styles.teamSensei}>{team.sensei}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══ 6 · GÖLGELER — AKATSUKI KAPISI ═════════════════════════ */}
        <section id="golgeler" className={styles.shadows}>
          {akatsukiBand ? (
            <span className={styles.shadowsArt} aria-hidden>
              <Image
                src={apiUrl(akatsukiBand.url)}
                alt=""
                fill
                sizes="1920px"
              />
            </span>
          ) : null}
          <span className={styles.shadowsMist} aria-hidden />

          <div className={styles.shadowsInner}>
            <span className={styles.shadowsCloud} aria-hidden>
              <AkatsukiCloud />
            </span>
            <p className={shell.eyebrow}>Gölgeler</p>
            <h2 className={`${shell.display} ${styles.shadowsTitle}`}>
              AKATSUKI
            </h2>
            <p className={styles.shadowsLede}>
              Barış için kurulan, bir gölgenin elinde bijuu avcısı bir tarikata
              dönüşen örgüt. Kendi sergisi bu arşivde ayrı bir dünya — yüzükler,
              ikililer, Altı Yol ve yağmurun altındaki Nagato orada.
            </p>
            <Link href={animeHref.akatsuki()} className={styles.shadowsEnter}>
              Sergiye gir →
            </Link>
          </div>
        </section>

        {/* ══ 7 · KLANLAR ════════════════════════════════════════════ */}
        <Section
          title="Klanlar ve Soy Hatları"
          lede="Aynı köke çıkan iki dal ve köyün geri kalanı."
          art={art(NARUTO_IMAGE_KEYS.clans)}
          slotKey={NARUTO_IMAGE_KEYS.clans}
          slotLabel="Klanlar bandı"
          isAdmin={isAdmin}
        >
          <div className={styles.lineages}>
            <div className={styles.lineage} data-side="uchiha">
              <h3 className={styles.lineageName}>Uchiha</h3>
              <p className={styles.lineageNote}>
                {"Indra'nın hattı — göz ve ateş."}
              </p>
              <ol className={styles.lineageList}>
                {NARUTO_UCHIHA_LINE.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ol>
            </div>
            <div className={styles.lineage} data-side="senju">
              <h3 className={styles.lineageName}>Senju</h3>
              <p className={styles.lineageNote}>
                {"Ashura'nın hattı — beden ve yaşam."}
              </p>
              <ol className={styles.lineageList}>
                {NARUTO_SENJU_LINE.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ol>
            </div>
          </div>

          <h3 className={styles.subhead}>Konoha klanları</h3>
          <ul className={styles.clanGrid}>
            {NARUTO_CLANS.map((clan) => (
              <li
                key={clan.name}
                className={styles.clan}
                data-noble={clan.noble ? "" : undefined}
              >
                <span className={styles.clanName}>{clan.name}</span>
                <span className={styles.clanTrait}>{clan.trait}</span>
                {clan.noble ? (
                  <span className={styles.clanNoble}>SOYLU</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>

        {/* ══ 8 · CHAKRA ═════════════════════════════════════════════ */}
        <Section
          id="guc"
          title="Chakra ve Doğa Dönüşümü"
          lede="Beş temel dönüşüm; her biri bir diğerini yener, bir diğerine yenilir."
          art={art(NARUTO_IMAGE_KEYS.chakra)}
          slotKey={NARUTO_IMAGE_KEYS.chakra}
          slotLabel="Chakra fonu"
          isAdmin={isAdmin}
        >
          <NarutoChakra elements={NARUTO_ELEMENTS} />
        </Section>

        {/* ══ 9 · DŌJUTSU ════════════════════════════════════════════ */}
        <Section
          title="Dōjutsu"
          lede="Kanla geçen gözler ve onların bedeli."
          art={art(NARUTO_IMAGE_KEYS.dojutsu)}
          slotKey={NARUTO_IMAGE_KEYS.dojutsu}
          slotLabel="Dōjutsu kadrajı"
          isAdmin={isAdmin}
        >
          <NarutoDojutsu eyes={NARUTO_EYES} />
        </Section>

        {/* ══ 10 · JUTSU ARŞİVİ ══════════════════════════════════════ */}
        <Section title="Jutsu Arşivi" lede="Kategoriler ve evreni değiştiren dokuz teknik.">
          <ul className={styles.catStrip}>
            {NARUTO_JUTSU_CATEGORIES.map((cat) => (
              <li key={cat}>{cat}</li>
            ))}
          </ul>

          <ul className={styles.jutsuGrid}>
            {NARUTO_JUTSU.map((jutsu) => (
              <li
                key={jutsu.name}
                className={styles.jutsu}
                style={{ "--rec": jutsu.color } as React.CSSProperties}
              >
                <p className={styles.jutsuRank}>{jutsu.rank}</p>
                <h3 className={styles.jutsuName}>{jutsu.name}</h3>
                <p className={styles.jutsuDesc}>{jutsu.desc}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══ 11 · BIJUU ═════════════════════════════════════════════ */}
        <Section
          title="Kuyruklu Canavarlar"
          lede="Ten-Tails'in dokuz parçası ve onları taşıyanlar."
          art={art(NARUTO_IMAGE_KEYS.bijuu)}
          slotKey={NARUTO_IMAGE_KEYS.bijuu}
          slotLabel="Bijuu fonu"
          isAdmin={isAdmin}
        >
          <NarutoBijuuPicker bijuu={NARUTO_BIJUU} />
        </Section>

        {/* ══ 12 · HOKAGE SALONU ═════════════════════════════════════ */}
        <Section
          title="Hokage Salonu"
          lede="Yedi yüz, yedi dönem. Her biri bir öncekine bir şekilde bağlı."
          art={art(NARUTO_IMAGE_KEYS.hokageHall)}
          slotKey={NARUTO_IMAGE_KEYS.hokageHall}
          slotLabel="Hokage Salonu"
          isAdmin={isAdmin}
        >
          <ol className={styles.hokageList}>
            {NARUTO_HOKAGE.map((kage) => (
              <li key={kage.ord} className={styles.hokage}>
                <span className={styles.hokageOrd}>{kage.ord}</span>
                <div className={styles.hokageBody}>
                  <h3 className={styles.hokageName}>{kage.name}</h3>
                  <p className={styles.hokageEpithet}>{kage.epithet}</p>
                  <p className={styles.hokageEnd}>{kage.end}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Göreve hiç başlayamayan aday — listeyi eksik bırakmak tarihi
              yanlış anlatmak olurdu, ama sıraya da katılamaz */}
          <div className={styles.candidate}>
            <span className={styles.hokageOrd}>
              {NARUTO_HOKAGE_CANDIDATE.ord}
            </span>
            <div className={styles.hokageBody}>
              <h3 className={styles.hokageName}>
                {NARUTO_HOKAGE_CANDIDATE.name}
              </h3>
              <p className={styles.hokageEpithet}>
                {NARUTO_HOKAGE_CANDIDATE.epithet}
              </p>
              <p className={styles.hokageEnd}>{NARUTO_HOKAGE_CANDIDATE.end}</p>
            </div>
          </div>

          <h3 className={styles.subhead}>Diğer köylerin gölgeleri</h3>
          <ul className={styles.kageGrid}>
            {NARUTO_OTHER_KAGE.map((kage) => (
              <li key={kage.village} className={styles.kage}>
                <span className={styles.kageVillage}>{kage.village}</span>
                <span className={styles.kageTitle}>{kage.title}</span>
                <span className={styles.kageNames}>{kage.names}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══ 13 · TARİH ═════════════════════════════════════════════ */}
        <Section
          id="tarih"
          title="Dönemler"
          lede="Kaguya'nın inişinden bugünün metropolüne kadar on beş halka."
          art={art(NARUTO_IMAGE_KEYS.history)}
          slotKey={NARUTO_IMAGE_KEYS.history}
          slotLabel="Tarih bandı"
          isAdmin={isAdmin}
        >
          <NarutoChronicle eras={NARUTO_ERAS} />
        </Section>

        {/* ══ 14 · EFSANEVİ SAVAŞLAR ═════════════════════════════════ */}
        <Section
          title="Efsanevi Savaşlar"
          lede="İki tarafın rengi kartın iki yakasını boyar."
          art={art(NARUTO_IMAGE_KEYS.valley)}
          slotKey={NARUTO_IMAGE_KEYS.valley}
          slotLabel="Son Vadisi"
          isAdmin={isAdmin}
        >
          <ul className={styles.battleGrid}>
            {NARUTO_BATTLES.map((battle) => (
              <li
                key={battle.title}
                className={styles.battle}
                style={
                  {
                    "--left": battle.left,
                    "--right": battle.right,
                  } as React.CSSProperties
                }
              >
                <p className={styles.battlePlace}>{battle.place}</p>
                <h3 className={styles.battleTitle}>{battle.title}</h3>
                <p className={styles.battleNote}>{battle.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══ 15 · RÜTBELER VE GÖREVLER ══════════════════════════════ */}
        <Section title="Rütbeler ve Görev Dereceleri" lede="Bir shinobi'nin yolu ve önüne konan işin ağırlığı.">
          <div className={styles.twoUp}>
            <div>
              <h3 className={styles.subhead}>Rütbeler</h3>
              <ul className={styles.rankList}>
                {NARUTO_RANKS.map((rank) => (
                  <li
                    key={rank.lvl}
                    className={styles.rank}
                    style={{ "--rec": rank.bar } as React.CSSProperties}
                  >
                    <span className={styles.rankLvl}>{rank.lvl}</span>
                    <span className={styles.rankName}>{rank.name}</span>
                    <span className={styles.rankNote}>{rank.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={styles.subhead}>Görev Dereceleri</h3>
              <ul className={styles.missionList}>
                {NARUTO_MISSIONS.map((mission) => (
                  <li
                    key={mission.letter}
                    className={styles.mission}
                    style={{ "--rec": mission.bar } as React.CSSProperties}
                  >
                    <span className={styles.missionLetter}>
                      {mission.letter}
                    </span>
                    <span className={styles.missionDesc}>{mission.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ══ 16 · YASAK PARŞÖMENLER ═════════════════════════════════ */}
        <Section
          title="Yasak Parşömenler"
          lede="Evrenin en dip katmanı — çoğu karakterin hiç öğrenemediği şeyler."
          art={art(NARUTO_IMAGE_KEYS.scrolls)}
          slotKey={NARUTO_IMAGE_KEYS.scrolls}
          slotLabel="Parşömen bandı"
          isAdmin={isAdmin}
        >
          <ul className={styles.scrollGrid}>
            {NARUTO_ARCHIVES.map((archive) => (
              <li key={archive.seal} className={styles.scroll}>
                <p className={styles.scrollSeal}>{archive.seal}</p>
                <h3 className={styles.scrollName}>{archive.name}</h3>
                <p className={styles.scrollDesc}>{archive.desc}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* Küratör kuşağı: tek tek bölümlere dağılmış yuvaların TOPLU listesi.
            Sayfa uzun olduğu için "hangi yuvalar var" sorusunun tek yerden
            cevaplanması gerekiyordu — bölüm içi yuvalar yerinde duruyor. */}
        {isAdmin ? (
          <section className={styles.curatorIndex}>
            <h2 className={styles.subhead}>Küratör · görsel yuvaları</h2>
            <p className={styles.curatorHint}>
              Yuvalar bölümlerin içinde de duruyor. Adres yapıştırırsan görsel
              indirilip kendi diskimize yazılır — dış adres olduğu gibi
              saklanmaz.
            </p>
            <div className={styles.curatorGrid}>
              {NARUTO_IMAGE_SLOTS.map((slot) => (
                <div key={slot.key} className={styles.curatorCell}>
                  <p className={styles.curatorLabel}>{slot.label}</p>
                  <p className={styles.curatorSub}>{slot.hint}</p>
                  <CuratorSlot
                    characterId={NARUTO_OWNER_ID}
                    slot="ABILITY"
                    abilityName={slot.key}
                    label={slot.label}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </CuratorFrame>
  );
}

/**
 * Bölüm kabuğu — başlık, giriş cümlesi, isteğe bağlı fon ve küratör yuvası.
 * On altı bölüm aynı iskeleti paylaşıyor; tekrarı buraya topluyor.
 */
function Section({
  id,
  title,
  lede,
  art,
  slotKey,
  slotLabel,
  isAdmin,
  children,
}: {
  id?: string;
  title: string;
  lede?: string;
  art?: { url: string } | null;
  slotKey?: string;
  slotLabel?: string;
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      {art ? (
        <span className={styles.sectionArt} aria-hidden>
          <Image src={apiUrl(art.url)} alt="" fill sizes="1920px" />
        </span>
      ) : null}

      <div className={styles.sectionInner}>
        <header className={styles.sectionHead}>
          <h2 className={`${shell.display} ${styles.sectionTitle}`}>{title}</h2>
          {lede ? <p className={styles.sectionLede}>{lede}</p> : null}
          {slotKey && slotLabel ? (
            <CuratorSlotIf
              enabled={Boolean(isAdmin)}
              characterId={NARUTO_OWNER_ID}
              slot="ABILITY"
              abilityName={slotKey}
              label={slotLabel}
            />
          ) : null}
        </header>

        {children}
      </div>
    </section>
  );
}

/**
 * Yuvayı yalnızca yöneticiye çiz — `AkatsukiExhibit` içindeki aynı adlı
 * yardımcının kardeşi. Ziyaretçi yükleyici JS'ini hiç indirmiyor.
 */
function CuratorSlotIf({
  enabled,
  ...props
}: { enabled: boolean } & Parameters<typeof CuratorSlot>[0]) {
  if (!enabled) return null;
  return <CuratorSlot {...props} />;
}
