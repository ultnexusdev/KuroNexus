import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { getCharacterImagesBulk } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { AKATSUKI_IDS, EXHIBIT_IMAGE_KEYS } from "@/lib/anime/akatsuki";
import { animeHref } from "@/lib/anime/routes";
import { shareCard } from "@/lib/seo";
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
  NARUTO_PEOPLE,
  NARUTO_PLACES,
  NARUTO_RANKS,
  NARUTO_SENJU_LINE,
  NARUTO_TEAMS,
  NARUTO_UCHIHA_LINE,
  NARUTO_VILLAGES,
  NARUTO_ELEMENT_IDS,
  narutoBijuuKey,
  narutoElementKey,
  narutoPeopleIds,
  narutoPerson,
  type NarutoFigureRef,
} from "@/lib/anime/naruto";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import { ClanEmblem, UzumakiSpiral } from "@/components/anime/naruto/ClanEmblems";
import { NarutoFace, NarutoFigureChip } from "@/components/anime/naruto/NarutoFace";
import { BijuuStage } from "@/components/anime/naruto/BijuuStage";
import {
  NarutoAtlas,
  NarutoChakra,
  NarutoChronicle,
  NarutoDojutsu,
} from "@/components/anime/naruto/NarutoSelectors";
import shell from "../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const TITLE = "Naruto Evreni";
const DESCRIPTION =
  "Shinobi dünyasının kaydı: uluslar, klanlar, chakra, dōjutsu, kuyruklu " +
  "canavarlar, Hokage'ler ve evreni bugüne getiren savaşlar.";

/**
 * ⚠️ STATİK `metadata` EXPORT'UNDAN `generateMetadata`YA ÇEVRİLDİ (P18
 * sonrası SEO turu): hreflang locale'i bilmek zorunda, statik export ise
 * `params`a erişemiyor. Kart da `shareCard`a bağlandı — sayfa kendi
 * `openGraph`ını hiç yazmıyordu, yani WhatsApp/X/Discord'da "KuroNexus"
 * başlığı ve ana sayfa adresiyle paylaşılıyordu (`lib/seo.ts` başlığındaki
 * sığ birleşme tuzağının ta kendisi).
 *
 * ⚠️ Başlık ve açıklama TÜRKÇE SABİT ve öyle kaldı: bu sayfanın İÇERİĞİ de
 * baştan sona Türkçe gömülü (bilinen çatlak, `docs/BLEACH-P00-kesif.md`
 * §1.3'te yazılı — sayfada tek bir `t()` çağrısı yok). Metadata'yı tek
 * başına çevirmek, İngilizce bir kartın Türkçe bir sayfaya açılması demekti;
 * dürüst olan, sayfa çevrilene kadar kartın da Türkçe kalması.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    ...shareCard({
      title: TITLE,
      description: DESCRIPTION,
      locale,
      path: "/anime/naruto",
    }),
  };
}

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
 * ── KADRO PORTRELERİ (22 Ağustos 2026) ───────────────────────────────────
 * Adı geçen herkes `NARUTO_PEOPLE` kaydında; portresi `PORTRAIT` yuvasında
 * AniList numarasının adresinde durur. Takım çipi, chakra kullanıcısı,
 * dönem figürü, Hokage satırı hepsi AYNI kaydı okur — portre bir kez
 * yüklenir/değiştirilir, her yerde birden değişir. İlk set nano-banana-2
 * ile üretilip kurulum betiğiyle yüklendi; küratör istediğini üstüne
 * yükleyerek ezer (son kayıt kazanır, eski satır silinmez).
 *
 * ── AKATSUKI ─────────────────────────────────────────────────────────────
 * Gölgeler bölümü kendi sergisine kapı açıyor (`/anime/akatsuki`). Artık
 * kendi fonu var (`naruto:shadows`); yuva boşsa eski davranışa dönüp
 * serginin `akatsuki:legion` kadrajını ödünç alıyor.
 */
export default async function NarutoUniversePage() {
  const [images, akatsukiImages, isAdmin] = await Promise.all([
    // Sayfanın kendi kadrajları + BÜTÜN kadro portreleri tek turda
    // (uç 50 kimlikte kesiyor; bulk yardımcı listeyi bölüp birleştiriyor)
    getCharacterImagesBulk([NARUTO_OWNER_ID, ...narutoPeopleIds()]),
    // Akatsuki sergisinin görselleri — Gölgeler yuvası boşsa ödünç alınır
    getCharacterImagesBulk([AKATSUKI_IDS.pain]),
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

  /** Kadro yüz haritası: slug → mutlak portre adresi. Çipler veri bilmez,
      hazır adres alır — istemci bileşenlerine de bu harita iner. */
  const faces = Object.fromEntries(
    Object.entries(NARUTO_PEOPLE).map(([slug, person]) => {
      const row = portrait(person.characterId);
      return [slug, row ? apiUrl(row.url) : null];
    }),
  ) as Record<string, string | null>;

  const faceOf = (figure: NarutoFigureRef) =>
    figure.person ? (faces[figure.person] ?? null) : null;

  /** Element kadrajları: elementId → mutlak adres (yoksa panel görselsiz) */
  const elementArt = Object.fromEntries(
    NARUTO_ELEMENT_IDS.map((id) => {
      const row = art(narutoElementKey(id));
      return [id, row ? apiUrl(row.url) : null];
    }),
  ) as Record<string, string | null>;

  /** Bijuu sahneleri: slug → mutlak adres (jinchūriki + canavar kadrajı) */
  const bijuuArt = Object.fromEntries(
    NARUTO_BIJUU.map((beast) => {
      const row = art(narutoBijuuKey(beast.slug));
      return [beast.slug, row ? apiUrl(row.url) : null];
    }),
  ) as Record<string, string | null>;

  /** Gölgeler fonu: kendi yuvası → yoksa serginin kadro bandı */
  const shadowsArt =
    art(NARUTO_IMAGE_KEYS.shadows) ??
    ([...akatsukiImages]
      .reverse()
      .find(
        (row) =>
          row.slot === "ABILITY" &&
          row.abilityName === EXHIBIT_IMAGE_KEYS.legion,
      ) ??
      null);

  const hero = art(NARUTO_IMAGE_KEYS.hero);
  const candidateFace = portrait(NARUTO_HOKAGE_CANDIDATE.characterId);

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
      <div className={styles.page}>
        <nav className={shell.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <span>Naruto Evreni</span>
        </nav>

        {/* ══ AÇILIŞ — SİNEMATİK KADRAJ ═══════════════════════════════
            Akatsuki hero'sunun hareket ailesi: Ken Burns fon, yükselen
            chakra korları, nefes alan girdap motifi, dikey fırça yazısı.
            Hepsi no-preference kapısının içinde; reduced-motion'da katman
            durağan hâliyle anlamlı. */}
        <header className={styles.opening}>
          {hero ? (
            <span className={styles.heroArt} aria-hidden>
              <Image src={apiUrl(hero.url)} alt="" fill sizes="1920px" priority />
            </span>
          ) : null}
          <span className={styles.heroPool} aria-hidden />
          <span className={styles.heroEmbers} aria-hidden />
          <span className={styles.heroSpiral} aria-hidden>
            <UzumakiSpiral />
          </span>
          <span className={`${shell.brush} ${styles.heroSide}`} aria-hidden>
            九尾の力 ・ 螺旋丸
          </span>

          <div className={styles.openingInner}>
            <p className={`${shell.eyebrow} ${styles.heroEyebrow}`}>
              Anime · Evren Kaydı
            </p>
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
            {NARUTO_TEAMS.map((team) => {
              /* Kartın küratör yuvaları: üyeler + sensei satırı, tek sefer */
              const slotPeople = [
                ...team.members,
                ...(team.senseiRefs ?? []),
              ].filter(
                (figure, i, all) =>
                  figure.person &&
                  all.findIndex((f) => f.person === figure.person) === i,
              );
              return (
                <li
                  key={team.name}
                  className={styles.team}
                  style={{ "--rec": team.color } as React.CSSProperties}
                >
                  <p className={styles.teamTag}>{team.tag}</p>
                  <h3 className={styles.teamName}>{team.name}</h3>
                  <ul className={styles.teamMembers}>
                    {team.members.map((member) => (
                      <li key={member.label}>
                        <NarutoFace
                          src={faceOf(member)}
                          label={member.label}
                          size={26}
                        />
                        <span>{member.label}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.teamSensei}>
                    {team.senseiRefs?.length ? (
                      <span className={styles.senseiFaces} aria-hidden>
                        {team.senseiRefs.map((figure) => (
                          <NarutoFace
                            key={figure.label}
                            src={faceOf(figure)}
                            label={figure.label}
                            size={22}
                          />
                        ))}
                      </span>
                    ) : null}
                    <span>{team.sensei}</span>
                  </p>

                  {/* Kürasyon: karttaki herkesin portre yuvası bir arada.
                      `data-curator-slot` — anahtar kapalıyken tamamı gizli */}
                  {isAdmin && slotPeople.length > 0 ? (
                    <div data-curator-slot className={styles.teamSlots}>
                      {slotPeople.map((figure) => {
                        const person = narutoPerson(figure.person ?? "");
                        if (!person) return null;
                        return (
                          <CuratorSlot
                            key={figure.person}
                            characterId={person.characterId}
                            slot="PORTRAIT"
                            label={`${figure.label} portresi`}
                          />
                        );
                      })}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Section>

        {/* ══ 6 · GÖLGELER — AKATSUKI KAPISI ═════════════════════════
            Kendi üretilmiş fonu + dinmeyen yağmur + süzülen kızıl
            bulutlar + kan kırmızısı ay halesi. Kapı artık sahne. */}
        <section id="golgeler" className={styles.shadows}>
          {shadowsArt ? (
            <span className={styles.shadowsArt} aria-hidden>
              <Image
                src={apiUrl(shadowsArt.url)}
                alt=""
                fill
                sizes="1920px"
              />
            </span>
          ) : null}
          <span className={styles.shadowsMoon} aria-hidden />
          <span className={styles.shadowsRain} aria-hidden />
          <span className={styles.shadowsMist} aria-hidden />
          <span className={styles.shadowsDrift} aria-hidden>
            <AkatsukiCloud />
          </span>
          <span
            className={`${styles.shadowsDrift} ${styles.shadowsDriftB}`}
            aria-hidden
          >
            <AkatsukiCloud />
          </span>

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
            <CuratorSlotIf
              enabled={isAdmin}
              characterId={NARUTO_OWNER_ID}
              slot="ABILITY"
              abilityName={NARUTO_IMAGE_KEYS.shadows}
              label="Gölgeler fonu"
            />
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
              <span className={styles.lineageEmblem} aria-hidden>
                <ClanEmblem clan="uchiha" />
              </span>
              <h3 className={styles.lineageName}>Uchiha</h3>
              <p className={styles.lineageNote}>
                {"Indra'nın hattı — göz ve ateş."}
              </p>
              <ol className={styles.lineageList}>
                {NARUTO_UCHIHA_LINE.map((figure) => (
                  <li key={figure.label}>
                    <NarutoFace
                      src={faceOf(figure)}
                      label={figure.label}
                      size={24}
                    />
                    <span>{figure.label}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.lineage} data-side="senju">
              <span className={styles.lineageEmblem} aria-hidden>
                <ClanEmblem clan="senju" />
              </span>
              <h3 className={styles.lineageName}>Senju</h3>
              <p className={styles.lineageNote}>
                {"Ashura'nın hattı — beden ve yaşam."}
              </p>
              <ol className={styles.lineageList}>
                {NARUTO_SENJU_LINE.map((figure) => (
                  <li key={figure.label}>
                    <NarutoFace
                      src={faceOf(figure)}
                      label={figure.label}
                      size={24}
                    />
                    <span>{figure.label}</span>
                  </li>
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
                <span className={styles.clanEmblem} aria-hidden>
                  <ClanEmblem clan={clan.id} />
                </span>
                <span className={styles.clanBody}>
                  <span className={styles.clanName}>{clan.name}</span>
                  <span className={styles.clanTrait}>{clan.trait}</span>
                </span>
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
          <NarutoChakra
            elements={NARUTO_ELEMENTS}
            art={elementArt}
            faces={faces}
          />

          {/* Kürasyon: beş element kadrajının yuvaları bölümün içinde */}
          {isAdmin ? (
            <div data-curator-slot className={styles.elementSlots}>
              {NARUTO_ELEMENTS.map((element) => (
                <CuratorSlot
                  key={element.id}
                  characterId={NARUTO_OWNER_ID}
                  slot="ABILITY"
                  abilityName={narutoElementKey(element.id)}
                  label={`Element kadrajı · ${element.tr}`}
                />
              ))}
            </div>
          ) : null}
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

        {/* ══ 11 · BIJUU — SİNEMATİK SAHNE ═══════════════════════════
            Üretilen dokuz jinchūriki + bijuu illüstrasyonu bölümün ana
            görsel kahramanı: tam kadraj, %100 opaklık. Ray kuyruk
            sayısına göre kademeli; seçim bütün accent'i o canavarın
            chakra rengine döndürür. */}
        <Section
          title="Kuyruklu Canavarlar"
          lede="Ten-Tails'in dokuz parçası ve onları taşıyanlar."
          art={art(NARUTO_IMAGE_KEYS.bijuu)}
          slotKey={NARUTO_IMAGE_KEYS.bijuu}
          slotLabel="Bijuu fonu"
          isAdmin={isAdmin}
        >
          <BijuuStage bijuu={NARUTO_BIJUU} art={bijuuArt} />

          {/* Kürasyon: dokuz sahnenin yuvaları bölümün içinde */}
          {isAdmin ? (
            <div data-curator-slot className={styles.elementSlots}>
              {NARUTO_BIJUU.map((beast) => (
                <CuratorSlot
                  key={beast.slug}
                  characterId={NARUTO_OWNER_ID}
                  slot="ABILITY"
                  abilityName={narutoBijuuKey(beast.slug)}
                  label={`Bijuu sahnesi · ${beast.name}`}
                />
              ))}
            </div>
          ) : null}

          {/* Kapanış: dokuz parça tek gövdede — sembolik Jūbi mührü.
              Gerçek bir Jūbi görseli bilinçli olarak YOK; dokuz chakra
              şeridi ortadaki gölge kütleye akar (komut §5). */}
          <div className={styles.jubi}>
            <h3 className={styles.jubiTitle}>{"TEN-TAILS'İN DOKUZ PARÇASI"}</h3>
            <p className={styles.jubiLede}>
              Dokuz chakra ayrı bedenlerde gezer; mühür çözülürse hepsi tek
              gölgede birleşir.
            </p>
            <JubiSeal beasts={NARUTO_BIJUU} />
          </div>
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
            {NARUTO_HOKAGE.map((kage) => {
              const face = portrait(kage.characterId);
              return (
                <li key={kage.ord} className={styles.hokage}>
                  <NarutoFace
                    src={face ? apiUrl(face.url) : null}
                    label={kage.name}
                    size={52}
                  />
                  <span className={styles.hokageOrd}>{kage.ord}</span>
                  <div className={styles.hokageBody}>
                    <h3 className={styles.hokageName}>{kage.name}</h3>
                    <p className={styles.hokageEpithet}>{kage.epithet}</p>
                    <p className={styles.hokageEnd}>{kage.end}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Göreve hiç başlayamayan aday — listeyi eksik bırakmak tarihi
              yanlış anlatmak olurdu, ama sıraya da katılamaz */}
          <div className={styles.candidate}>
            <NarutoFace
              src={candidateFace ? apiUrl(candidateFace.url) : null}
              label={NARUTO_HOKAGE_CANDIDATE.name}
              size={52}
            />
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
                <span className={styles.kagePeople}>
                  {kage.people.map((figure) => (
                    <NarutoFigureChip
                      key={figure.label}
                      figure={figure}
                      faces={faces}
                    />
                  ))}
                </span>
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
          <NarutoChronicle eras={NARUTO_ERAS} faces={faces} />
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

        {/* ══ 15 · RÜTBELER VE GÖREVLER ══════════════════════════════
            Görsel dil: rütbeler yolun kendisi (kanji mühürlü merdiven,
            doluluk çubuğu), dereceler mühür damgalı risk kartları. */}
        <Section title="Rütbeler ve Görev Dereceleri" lede="Bir shinobi'nin yolu ve önüne konan işin ağırlığı.">
          <div className={styles.twoUp}>
            <div>
              <h3 className={styles.subhead}>Rütbeler</h3>
              <ul className={styles.rankList}>
                {NARUTO_RANKS.map((rank) => (
                  <li
                    key={rank.lvl}
                    className={styles.rank}
                    style={
                      {
                        "--rec": rank.bar,
                        "--climb": `${rank.climb}%`,
                      } as React.CSSProperties
                    }
                  >
                    <span className={styles.rankKanji} aria-hidden>
                      {rank.kanji}
                    </span>
                    <span className={styles.rankLvl}>{rank.lvl}</span>
                    <span className={styles.rankName}>{rank.name}</span>
                    <span className={styles.rankNote}>{rank.note}</span>
                    <span className={styles.rankMeter} aria-hidden>
                      <span className={styles.rankFill} />
                    </span>
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
                    data-letter={mission.letter}
                    style={
                      {
                        "--rec": mission.bar,
                        "--risk": `${mission.risk}%`,
                      } as React.CSSProperties
                    }
                  >
                    <span className={styles.missionSeal} aria-hidden>
                      {mission.letter}
                    </span>
                    <span className={styles.missionBody}>
                      <span className={styles.missionDesc}>{mission.desc}</span>
                      <span className={styles.missionMeter} aria-hidden>
                        <span className={styles.missionFill} />
                      </span>
                    </span>
                    <span className={styles.missionRisk}>
                      {mission.risk}
                      <small>/100</small>
                    </span>
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

            {/* Kadro portreleri: adı geçen herkesin PORTRAIT yuvası tek
                yerden. Küçük yüz o anki kaydı gösterir — hangisi dolu,
                hangisi boş, liste kendisi söylüyor. */}
            <h2 className={styles.subhead}>Küratör · kadro portreleri</h2>
            <p className={styles.curatorHint}>
              Portre karakterin kaydına (AniList numarası) bağlanır; takım
              çipi, dönem figürü ve karakter dosyası aynı görseli okur. Yeni
              yükleme eskisini görsel olarak ezer, eski kayıt silinmez.
            </p>
            <div className={styles.curatorGrid}>
              {Object.entries(NARUTO_PEOPLE).map(([slug, person]) => (
                <div key={slug} className={styles.curatorCell}>
                  <p className={styles.curatorPerson}>
                    <NarutoFace
                      src={faces[slug]}
                      label={person.name}
                      size={30}
                    />
                    <span className={styles.curatorLabel}>{person.name}</span>
                  </p>
                  <p className={styles.curatorSub}>
                    AniList #{person.characterId}
                    {faces[slug] ? " · portre yüklü" : " · portre boş"}
                  </p>
                  <CuratorSlot
                    characterId={person.characterId}
                    slot="PORTRAIT"
                    label={`${person.name} portresi`}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
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

/**
 * Jūbi mührü — dokuz chakra şeridinin ortadaki gölge kütleye aktığı
 * sembolik kapanış. Sunucuda çizilen saf SVG: görsel dosyası yok, istek
 * yok; her şerit/küre kendi canavarının chakra rengini taşır. Gerçek bir
 * Jūbi illüstrasyonu bilinçli olarak üretilmedi — kapanış soyut (komut §5).
 */
function JubiSeal({ beasts }: { beasts: typeof NARUTO_BIJUU }) {
  const orbX = (i: number) => 90 + i * 90;
  return (
    <svg
      viewBox="0 0 900 320"
      className={styles.jubiSvg}
      role="img"
      aria-label="Dokuz bijuu chakrasının Jūbi gölgesinde birleşişi"
    >
      {/* Gölge kütle: belirsiz gövde + boynuz hatları */}
      <path
        d="M310 190 C310 120 360 78 415 70 L432 40 L448 66 L470 34 L484 64
           C548 68 592 118 592 182 C592 232 540 258 450 258 C360 258 310 236 310 190 Z"
        fill="#07080d"
        stroke="rgba(146,64,78,0.35)"
        strokeWidth="1.5"
      />
      {/* Göz: halkalar + dokuz tomoe (Rinne Sharingan'ın gölgesi) */}
      <g className={styles.jubiEye}>
        <circle cx="450" cy="152" r="46" fill="#16090d" stroke="#8f3c47" strokeWidth="2" />
        <circle cx="450" cy="152" r="33" fill="none" stroke="#a5454f" strokeWidth="1.4" opacity="0.85" />
        <circle cx="450" cy="152" r="20" fill="none" stroke="#a5454f" strokeWidth="1.2" opacity="0.7" />
        <circle cx="450" cy="152" r="8" fill="#a5454f" />
        {beasts.map((beast, i) => {
          const a = (i / beasts.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={beast.slug}
              cx={450 + Math.cos(a) * 26.5}
              cy={152 + Math.sin(a) * 26.5}
              r="3.6"
              fill="#7e2f3a"
            />
          );
        })}
      </g>
      {/* Dokuz şerit: her küreden merkeze akan chakra */}
      {beasts.map((beast, i) => {
        const x = orbX(i);
        const cx = x + (450 - x) * 0.22;
        return (
          <path
            key={`strand-${beast.slug}`}
            className={styles.jubiStrand}
            d={`M${x} 268 Q ${cx} 224 450 186`}
            fill="none"
            stroke={beast.accent}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.7"
          />
        );
      })}
      {/* Dokuz küre: kendi renginde ince glow + kuyruk numarası */}
      {beasts.map((beast, i) => {
        const x = orbX(i);
        return (
          <g
            key={`orb-${beast.slug}`}
            className={styles.jubiOrb}
            style={{ animationDelay: `${i * 0.35}s` } as React.CSSProperties}
          >
            <circle cx={x} cy="272" r="12" fill={beast.accent} opacity="0.2" />
            <circle cx={x} cy="272" r="5.5" fill={beast.accent} />
            <text
              x={x}
              y="300"
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="rgba(214,210,200,0.55)"
            >
              {String(beast.n).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
