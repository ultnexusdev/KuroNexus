import { getTranslations } from "next-intl/server";
import { DOMAINS } from "@/lib/anime/jjk/domains";
import { pick } from "@/lib/anime/jjk/types";
import { domainSlotId } from "@/lib/anime/jjk/slots";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
import { DomainChamber, type DomainView } from "./DomainChamber";
import styles from "./DomainSection.module.css";

/**
 * P07 · ALAN GENİŞLEMESİ (領域展開) — sayfanın imza anı.
 *
 * Alan seçilince BÖLÜMÜN TAMAMI o alanın paletine döner (`data-domain` →
 * globals.css blokları; yalnızca renk animasyonu, CLS 0). "Alana gir"
 * ekranı devralır: `<dialog>` tam ekran, alanın kendi kural ekranı.
 *
 * ── DEVRALMANIN GÜVENLİK ŞARTLARI (Gojo P03 dersleri) ────────────────────
 *   1. Çıkış her an görünür ("alandan çık ✕").
 *   2. ESC çalışır (native `cancel`), odak diyalogda hapsolur (native).
 *   3. Kaydırma kilidi TEK yerden açılır/kapanır (`close` olayı) — hangi
 *      yoldan çıkılırsa çıkılsın kilit kalkar.
 *   4. Azaltılmış harekette yırtılma animasyonu yok, düz görünüm.
 *
 * Aynı yuva iki kadrajda: bölüm içi (oranlı) + devralma (fill). İki ayrı
 * `CuratedImage` örneği, TEK yuva kimliği — küratör bir kare yükler.
 */
export async function DomainSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.domain" });

  const domains: DomainView[] = DOMAINS.map((domain) => ({
    slug: domain.slug,
    caster: domain.caster,
    jp: domain.jp,
    en: domain.en,
    grade: pick(domain.grade, locale),
    hit: pick(domain.hit, locale),
    body: pick(domain.body, locale),
    tag: pick(domain.tag, locale),
    glyph: domain.glyph,
  }));

  const frames = DOMAINS.map((domain) => (
    <CuratedImage
      key={domain.slug}
      slotId={domainSlotId(domain.slug)}
      className={styles.still}
      sizes="1400px"
      decorative
      noEdit
    />
  ));

  const takeoverStills = DOMAINS.map((domain) => (
    <CuratedImage
      key={domain.slug}
      slotId={domainSlotId(domain.slug)}
      className={styles.takeStill}
      sizes="2560px"
      decorative
      noEdit
      fill
    />
  ));

  const pens = DOMAINS.map((domain) => (
    <CuratedSlotPen key={domain.slug} slotId={domainSlotId(domain.slug)} />
  ));

  return (
    <DomainChamber
      domains={domains}
      frames={frames}
      takeoverStills={takeoverStills}
      pens={pens}
      labels={{
        no: "06",
        kanji: "領域展開",
        latin: t("latin"),
        lede: t("lede"),
        listAria: t("listAria"),
        caster: t("caster"),
        grade: t("grade"),
        hit: t("hit"),
        enter: t("enter"),
        exit: t("exit"),
        active: t("active"),
        titleId: "jjk-domain-title",
      }}
    />
  );
}
