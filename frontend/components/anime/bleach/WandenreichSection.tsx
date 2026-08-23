import { getTranslations } from "next-intl/server";
import {
  EMPEROR,
  SCHUTZSTAFFEL,
  STERNRITTER,
} from "@/lib/anime/bleach/wandenreich";
import { pick } from "@/lib/anime/bleach/types";
import { SchriftGrid, type GridLetter } from "./SchriftGrid";
import styles from "./Wandenreich.module.css";
import world from "./world.module.css";

/**
 * P09 · WANDENREICH — GÖRÜNMEZ İMPARATORLUK.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Sayfanın geri kalanı Japon estetiği; burası Avrupa gotiği ve **kültürel
 * çarpışmanın kendisi tasarım kararı**. Sivri kemer, altın hairline, buz
 * mavisi ve soldan sağa uzayan sert gölgeler.
 *
 * Yapı yatay bir kadro değil DİKEY bir hiyerarşi — Quincy de bir
 * imparatorluk. Tepede tek ad, ortada beş kişilik muhafız, altta yirmi
 * altı harflik alfabe.
 *
 * ── ⚠️ GOTİK AİLE YALNIZCA İKİ YERDE ─────────────────────────────────────
 * UnifrakturMaguntia'nın Türkçe diyakritiği yok. Aileye basılan tek şey
 * **"Wandenreich" wordmark'ı** ve **tek harfler** — ikisi de Latin.
 * `pnpm check:bleach` bunu satır satır denetliyor ve bu yorumu bile bir
 * kez kırmızıya düşürdü (23 Ağustos 2026): betik, gotik sınıfı ANAN her
 * satırda Türkçe karakter arıyor, yorum olup olmadığına bakmıyor.
 *
 * ── SUNUCUDA ÇÖZÜLÜYOR ───────────────────────────────────────────────────
 * `SchriftGrid` bir istemci adası (klavye gezinmesi). Kayıt iki dili
 * birden taşıyor; burada seçilen dile indirgenip aşağı iniyor, böylece
 * okunmayan dil istemci paketine girmiyor (`EspadaSection` ile aynı).
 */
export async function WandenreichSection({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "anime.bleach.wandenreich",
  });

  const letters: GridLetter[] = STERNRITTER.map((item) => ({
    letter: item.letter,
    bearers: item.bearers.map((bearer) => ({
      name: bearer.name,
      epithet: bearer.epithet,
      note: bearer.note ? pick(bearer.note, locale) : null,
    })),
  }));

  return (
    <section
      id="empire"
      data-layer="wandenreich"
      className={styles.section}
      aria-labelledby="empire-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="empire-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      {/* ── TEPE: İMPARATOR ─────────────────────────────────────────────
          Tek başına ve ortada. Hiyerarşinin en üstünde kimse yok. */}
      <div className={styles.emperor}>
        <p className={styles.wordmark} lang="de">
          <span className={world.gothic}>Wandenreich</span>
        </p>
        <p className={styles.emperorName}>{EMPEROR.name}</p>
        <p className={`${world.meta} ${styles.emperorLetter}`} lang="en">
          {EMPEROR.letter}
          <span aria-hidden="true"> — </span>
          {EMPEROR.epithet}
        </p>
        <p className={`${world.meta} ${styles.emperorTitle}`}>
          {pick(EMPEROR.title, locale)}
        </p>
        <p className={`${world.body} ${styles.emperorText}`}>
          {pick(EMPEROR.text, locale)}
        </p>
      </div>

      <hr className={`${world.rule} ${styles.divide}`} />

      {/* ── ORTA: MUHAFIZ ───────────────────────────────────────────────
          Beş isim, yatay. Alfabenin altında değil ÜSTÜNDE duruyorlar:
          hepsi Sternritter ama hepsi eşit değil. */}
      <div className={styles.guard}>
        <p className={`${world.eyebrow} ${styles.guardTitle}`} lang="de">
          Schutzstaffel
        </p>
        <p className={`${world.meta} ${styles.guardKanji}`} lang="ja">
          親衛隊
        </p>
        <ul className={styles.guardList}>
          {SCHUTZSTAFFEL.map((member) => (
            <li key={member.name} className={styles.guardItem}>
              <span className={styles.guardLetter}>
                <span className={world.gothic}>{member.letter}</span>
              </span>
              <span className={styles.guardName}>{member.name}</span>
              <span className={styles.guardRole}>
                {pick(member.role, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <hr className={`${world.rule} ${styles.divide}`} />

      {/* ── ALT: ALFABE ─────────────────────────────────────────────────
          Yirmi altı harf, yirmi altı mühür. Sayfadaki tek ızgara ve
          master brief'in verdiği tek istisna. */}
      <div className={styles.alphabet}>
        <p className={`${world.eyebrow} ${styles.alphabetTitle}`} lang="en">
          {t("alphabetTitle")}
        </p>
        <p className={`${world.meta} ${styles.alphabetKanji}`}>
          <span lang="ja">聖文字</span>
          <span aria-hidden="true"> · </span>
          {t("schriftNote")}
        </p>

        <SchriftGrid
          letters={letters}
          labels={{
            sealed: t("sealed"),
            hint: t("hint"),
            gridAria: t("gridAria"),
            bearerLabel: t("bearerLabel"),
          }}
        />
      </div>
    </section>
  );
}
