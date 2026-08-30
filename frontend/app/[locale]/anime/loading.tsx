import { getLocale, getTranslations } from "next-intl/server";
import KuroLoader from "@/components/ui/KuroLoader";

/**
 * Anime kanadinin yukleme ekrani.
 *
 * ── ⚠️ ISKELET GITTI, LOADER GELDI (29 Agustos 2026) ─────────────────────
 * Burada `AnimeHallSkeleton` duruyordu: kanadin gercek duzenini birebir
 * taklit eden, zipramayi bitirmek icin yazilmis bir icerik iskeleti.
 * Kullanici karari onun yerine markanin kendi yukleme ekranini istedi --
 * 黒 ve donen halkalar.
 *
 * ⚠️ Bileşen DURUYOR (`components/anime/AnimeHallSkeleton.tsx`) ama artik
 * hicbir yerden cagrilmiyor. Silinmedi: yazilma gerekcesi (poster
 * izgarasi uyusmuyordu, veri inince kutular yer degistiriyordu) hâlâ
 * gecerli ve karar geri alinmak istenirse tek satirlik bir import.
 *
 * ⚠️ `tone="anime"` KALKTI (30 Agustos 2026). Bu dosya sitedeki tek
 * renkli yukleme ekraniydi; artik butun `loading.tsx`ler ve kuresel
 * `RouteLoader` ayni tonu (`--loader-mark`) kullaniyor.
 *
 * ── ⚠️ TEK BAYT JS YOK ───────────────────────────────────────────────────
 * Sunucu bileseni: SVG + CSS. Titreme kalkani da (180ms) saf CSS
 * gecikmesi -- bir istemci kancasi bu yedegi hidrasyona kadar gizlerdi
 * ve sert yuklemede ekran bos kalirdi (gerekce `KuroLoader.tsx`te).
 *
 * ── ⚠️ BU DOSYA ZATEN VARDI ──────────────────────────────────────────────
 * Yani akis (streaming) davranisi ve onun `notFound()` uzerindeki etkisi
 * DEGISMEDI -- yeni bir `loading.tsx` eklenmedi. Kok segmente hicbir sey
 * konmadi; kuresel katman `RouteLoader` rotalara hic dokunmuyor.
 */
export default async function AnimeHallLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return <KuroLoader overlay label={t("routeLoading")} />;
}
