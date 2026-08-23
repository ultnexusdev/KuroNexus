import { getTranslations } from "next-intl/server";
import { BANKAI_HALL } from "@/lib/anime/bleach/bankai";
import { BankaiHall } from "./BankaiHall";
import { CuratedImage } from "./CuratedImage";
import { NicheFigure } from "./NicheFigure";

/**
 * `BankaiHall`in SUNUCU sarmalayıcısı — `Gotei13Section` ve
 * `ZanpakutoSection` ile aynı desen: istemci bileşenleri
 * `getTranslations` çağıramaz, etiketler burada çözülüp aşağı iniyor.
 *
 * ── ⚠️ SİLÜETLER DE BURADA ÇİZİLİYOR ─────────────────────────────────────
 * `CuratedImage` bir SUNUCU bileşeni ve `BankaiHall` bir istemci bileşeni.
 * Sunucu bileşenini istemciye import etmek derlemeyi durduruyor (ölçüldü,
 * 23 Ağustos 2026). React'in izin verdiği yol onu **prop olarak**
 * geçirmek: on siluet burada çizilip diziyle aşağı iniyor.
 *
 * ⚠️ `noEdit` zorunlu: niş bir `<button>` ve içine küratör kalemi
 * (ikinci bir `<button>`) koymak geçersiz HTML olurdu. Yuvalar manifesto
 * panelinden düzenlenebiliyor, yani kayıp yok.
 */
export async function BankaiSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.bankai" });

  const art = BANKAI_HALL.map((niche, i) => (
    <CuratedImage
      key={niche.id}
      slotId={`bleach:bankai:${niche.id}`}
      fill
      decorative
      noEdit
      sizes="320px"
      fallback={<NicheFigure pose={i} />}
    />
  ));

  return (
    <BankaiHall
      locale={locale}
      art={art}
      labels={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        lede: t("lede"),
        corridorAria: t("corridorAria"),
        advance: t("advance"),
        reveal: t("reveal"),
      }}
    />
  );
}
