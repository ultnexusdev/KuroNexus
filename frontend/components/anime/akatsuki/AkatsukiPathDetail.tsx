import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { CharacterImageRow } from "@/lib/api/types";
import { AKATSUKI_IDS, type SixPath } from "@/lib/anime/akatsuki";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { RinneganMotif } from "./RinneganMotif";
import shell from "@/app/[locale]/anime/layout.module.css";
import styles from "./AkatsukiPathDetail.module.css";

/**
 * Bir Path'in detay sayfası: görsel hero olarak karşılar (Pain hero'suyla
 * yarışmayan ama net ve büyük bir giriş), altında kullanıcının verdiği uzun
 * metnin tamamı + varsa "Etkiler" bölümü. Metin `\n\n` ile paragraflanır.
 */
export async function AkatsukiPathDetail({
  locale,
  path,
  images,
  isAdmin,
}: {
  locale: string;
  path: SixPath;
  images: CharacterImageRow[];
  isAdmin: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "akatsuki" });

  // Sergiyle aynı yuva; son yükleme kazanır (kürasyon sözleşmesi)
  const art =
    [...images]
      .reverse()
      .find(
        (row) => row.slot === "ABILITY" && row.abilityName === path.imageKey,
      ) ?? null;

  const name = t(`paths.${path.key}.name`);
  const long = t(`paths.${path.key}.long`);
  // `influence` yalnızca bazı yollarda var — yokken anahtar hiç okunmaz
  const hasInfluence = path.key !== "human";
  const influence = hasInfluence ? t(`paths.${path.key}.influence`) : null;

  return (
    <main className={styles.page} data-world="akatsuki">
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={shell.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.akatsuki()}>Akatsuki</Link>
          <span className={shell.sep}>/</span>
          <span>{name}</span>
        </nav>

        <header className={styles.hero}>
          {art ? (
            <span className={styles.heroArt} aria-hidden>
              <Image
                src={apiUrl(art.url)}
                alt=""
                fill
                sizes="1920px"
                priority
              />
            </span>
          ) : (
            <RinneganMotif className={styles.heroFallback} />
          )}
          <div className={styles.heroInner}>
            <p className={`${shell.eyebrow} ${styles.eyebrow}`}>
              {t("pathPage.eyebrow")}
            </p>
            <h1 className={`${shell.display} ${styles.title}`}>{name}</h1>
            <p className={`${shell.brush} ${styles.kanji}`} aria-hidden>
              {path.kanji} · {path.romaji}
            </p>
            <p className={`${shell.data} ${styles.ability}`}>
              {t(`paths.${path.key}.ability`)}
            </p>
          </div>
        </header>

        <section className={styles.body} aria-label={name}>
          {long.split("\n\n").map((paragraph, index) => (
            <p key={index} className={`${shell.prose} ${styles.paragraph}`}>
              {paragraph}
            </p>
          ))}

          {influence ? (
            <>
              <h2
                className={`${shell.display} ${shell.section} ${styles.influenceTitle}`}
              >
                {t("pathPage.influenceTitle")}
              </h2>
              {influence.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className={`${shell.prose} ${styles.paragraph}`}
                >
                  {paragraph}
                </p>
              ))}
            </>
          ) : null}

          <Link href={animeHref.akatsuki()} className={styles.back}>
            {t("pathPage.back")}
          </Link>

          {isAdmin ? (
            <CuratorSlot
              characterId={AKATSUKI_IDS.pain}
              slot="ABILITY"
              abilityName={path.imageKey}
              label={t("slots.pathOf", { name })}
            />
          ) : null}
        </section>
      </CuratorFrame>
    </main>
  );
}
