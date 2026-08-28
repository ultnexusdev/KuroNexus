import { getTranslations } from "next-intl/server";
import { playerSlotId } from "@/lib/anime/slam-dunk/slots";
import { pick, type RosterMember } from "@/lib/anime/slam-dunk/types";
import { CourtImage } from "./CourtImage";
import { StatBars } from "./StatBars";
import court from "./court.module.css";
import styles from "./PlayerCard.module.css";

/**
 * KADRO KARTI — sayfanın tekrar eden tek birimi.
 *
 * ── İKİ BOY, TEK BİLEŞEN ─────────────────────────────────────────────────
 *   `stage` → Shohoku ilk beşi. Büyük kadraj, lakap, oynayış notu, kendi
 *             sahne efekti. Sayfanın ilk kıvrımındaki beş kart.
 *   `grid`  → geri kalan kırk kayıt. Aynı veri, sıkıştırılmış düzen.
 *
 * İki ayrı bileşen yazmak, aynı alanların iki yerde ayrışmasına açık kapı
 * bırakırdı (Bleach'te ölçülmüş sınıf: iki kopya, biri güncellenmiyor).
 * Fark tamamen CSS'te: `data-size` niteliği.
 *
 * ── SAHNE EFEKTLERİ ──────────────────────────────────────────────────────
 * Beş sahne kartının her birinin kendi hover/odak muamelesi var (kızıl aura
 * ve darbe dalgaları, soğuk mavi duman, goril silüeti, şimşek, alev + üç
 * sayı çizgisi). Hepsi `data-fx` niteliğinden okunuyor ve tamamı SAF CSS —
 * ziyaretçiye bu efektler için tek bayt JS inmiyor.
 *
 * ⚠️ Efekt `:hover` ile birlikte `:focus-within` de dinliyor: klavyeyle
 * gezen kişi kartın ne yaptığını görmeden geçmesin.
 *
 * ── NEDEN `noEdit` ───────────────────────────────────────────────────────
 * Kart bir bağlantı DEĞİL (kartın kendisi tıklanabilir bir yüzey değil), o
 * yüzden kalem yuvanın kendi köşesinde durabiliyor. `noEdit` yalnızca
 * kartın bir `<a>` içine alındığı yerde gerekecek — bugün öyle bir yer yok.
 */
export async function PlayerCard({
  member,
  locale,
  size = "grid",
}: {
  member: RosterMember;
  locale: string;
  size?: "stage" | "grid";
}) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });

  const epithet = member.epithet ? pick(member.epithet, locale) : null;
  const unknown = t("roster.unknown");

  /* Künye satırı: mevki · boy · kilo · sınıf. Eksik alan UYDURULMUYOR —
     kaynakta yoksa "kayıt yok" yazıyor (manifesto başlığındaki kural). */
  const spec = [
    member.position ? t(`positions.${member.position}`) : null,
    member.height ? `${member.height} cm` : unknown,
    member.weight ? `${member.weight} kg` : unknown,
    member.year ? t("roster.year", { year: member.year }) : null,
  ].filter(Boolean) as string[];

  return (
    <article
      className={styles.card}
      data-size={size}
      data-team={member.team}
      data-role={member.role}
      /* Sahne efektinin anahtarı. Yalnızca `stage` boyunda okunuyor —
         ızgara kartlarında beş ağır efekt aynı anda dönerdi. */
      data-fx={size === "stage" ? member.id : undefined}
    >
      {/* ── EFEKT KATMANLARI ──────────────────────────────────────
          Üçü de dekoratif ve `aria-hidden`: ekran okuyucu için kartta
          yalnızca ad, künye ve statlar var. */}
      {size === "stage" ? (
        <>
          <span className={styles.aura} aria-hidden />
          <span className={styles.fx} aria-hidden />
        </>
      ) : null}

      <div className={styles.frame}>
        <CourtImage
          slotId={playerSlotId(member.id)}
          className={styles.portrait}
          sizes={size === "stage" ? "420px" : "260px"}
          decorative
        />

        {/* Forma numarası kadrajın ÜSTÜNDE: fotoğraf gelince de kalıyor,
            çünkü numara kartın kimliği — yuvanın yedeği değil. */}
        {member.number !== null ? (
          <span className={`${court.numeral} ${styles.number}`} aria-hidden>
            {member.number}
          </span>
        ) : null}

        {member.role !== "player" ? (
          <span className={styles.roleTag}>{t(`roles.${member.role}`)}</span>
        ) : null}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <span className={`${court.display} ${styles.nameLatin}`}>
            {member.name}
          </span>
          <span className={`${court.kanji} ${styles.nameKanji}`} lang="ja">
            {member.kanji}
          </span>
        </h3>

        {epithet ? <p className={styles.epithet}>{epithet}</p> : null}

        <p className={styles.spec}>{spec.join(" · ")}</p>

        {size === "stage" ? (
          <p className={`${court.body} ${styles.note}`}>
            {pick(member.note, locale)}
          </p>
        ) : null}

        {member.stats ? (
          <StatBars
            stats={member.stats}
            locale={locale}
            compact={size === "grid"}
          />
        ) : (
          /* Koç ve menajerde bar YOK. Bir koçu şut yüzdesiyle puanlamak
             veriyi uydurmak olurdu; yerine kaydın kendi notu geçiyor. */
          <p className={`${court.body} ${styles.staffNote}`}>
            {pick(member.note, locale)}
          </p>
        )}
      </div>
    </article>
  );
}
