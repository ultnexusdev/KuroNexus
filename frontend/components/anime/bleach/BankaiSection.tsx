import { getTranslations } from "next-intl/server";
import { BANKAI_HALL } from "@/lib/anime/bleach/bankai";
import { BankaiHall } from "./BankaiHall";
import { bankaiSlotId } from "@/lib/anime/bleach/slots";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
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
 * (ikinci bir `<button>`) koymak geçersiz HTML olurdu.
 *
 * ── ⚠️ KALEM ARTIK KORİDORDA ─────────────────────────────────────────────
 * "Manifesto panelinden düzenlenebiliyor, yani kayıp yok" cümlesi 27 Ağustos
 * 2026'da yanlış çıktı: manifesto on altı bölümlük sayfanın EN ALTINDA ve
 * küratör her kare için "aşağı in → yükle → yukarı çık → bak" turu atmak
 * zorunda kalıyordu (kullanıcı bildirimi). Kalem artık `pens` ile ayrı
 * geliyor ve nişin KARDEŞİ olarak çiziliyor — HTML geçerli, yükleme alanı
 * nişin üstünde.
 *
 * ── ⚠️ YUVA KİMLİĞİ TEK KAYNAKTAN ────────────────────────────────────────
 * `bleach:bankai:${niche.id}` elle yazılıyordu ve manifestodaki liste ayrı
 * yazılmıştı: `katen-kyokotsu` ≠ `katen-kyokotsu-karamatsu`. `slotDef()` o
 * nişte `undefined` dönüyor, `CuratedImage` sessizce `null` basıyordu — o
 * niş sayfada YOKTU. Kimlik artık `bankaiSlotId()`den geliyor ve manifesto
 * da aynı listeden türetiliyor (`slots.ts`).
 */
export async function BankaiSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.bankai" });

  const art = BANKAI_HALL.map((niche, i) => (
    <CuratedImage
      key={niche.id}
      slotId={bankaiSlotId(niche.id)}
      fill
      decorative
      noEdit
      sizes="320px"
      fallback={<NicheFigure pose={i} />}
    />
  ));

  const pens = BANKAI_HALL.map((niche) => (
    <CuratedSlotPen key={niche.id} slotId={bankaiSlotId(niche.id)} />
  ));

  return (
    <BankaiHall
      locale={locale}
      art={art}
      pens={pens}
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
