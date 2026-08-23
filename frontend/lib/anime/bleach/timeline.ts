import type { Localized } from "./types";
import type { BladeForm } from "./zanpakuto";
import type { LayerId } from "@/components/anime/bleach/WorldSection";

/**
 * HİKÂYE ÇİZELGESİ — P16'nın verisi. Sayfanın kapanışı.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Klasik bir arc zaman çizelgesi DEĞİL. Hikâye **Ichigo'nun kılıcının
 * değişimi** üzerinden anlatılıyor: zaman çizelgesi ile karakter gelişimi
 * tek bir tasarımda birleşiyor. Beş arc, beş kılıç, beş renk.
 *
 * ── ⚠️ KILIÇ ŞABLONU YENİDEN YAZILMADI ───────────────────────────────────
 * `BladeSilhouette` (P04) zaten parametreden üretilen, **morph edilebilir**
 * bir path veriyor: aynı komut dizisi, altı sayıyla ayrışan biçimler. Bu
 * bölümün mekaniği tam olarak o dosyanın var oluş sebebi — ikinci bir kılıç
 * grameri yazmak hem gereksiz hem de morph'u imkânsız kılardı (iki path
 * ancak aynı düğüm dizisine sahipse birbirine dönüşür).
 *
 * ── RENKLER: VERİ, TOKEN DEĞİL ───────────────────────────────────────────
 * ⚠️ Kural 16 istisnası, `divisions.ts` / `espada.ts` / `legends.ts` ile
 * aynı sınıf. Beş değer brief'ten geldi ve arc'ın kendi rengi — temanın
 * değil. Kılıcın rengi bunlardan, zeminin derisi ise katmandan geliyor.
 *
 * ⚠️ Dördüncü arc yine `living`: The Lost Agent baştan sona Karakura'da
 * geçiyor. Tekrar bir hata değil, arc'ın kendisi — Ichigo gücünü
 * kaybediyor ve hikâye eve dönüyor.
 */

export interface ArcRecord {
  id: string;
  /** ÇEVRİLMEZ — arc'ın canon adı */
  name: string;
  /** Kılıcın o dönemki adı; ÇEVRİLMEZ */
  blade: string;
  /** Zeminin derisi */
  layer: LayerId;
  /** ⚠️ VERİ: arc'ın rengi, temanın değil */
  color: string;
  /** 2 cümle */
  text: Localized;
  /** `BladeSilhouette`e giden altı sayı */
  form: BladeForm;
}

export const STORY_ARCS: readonly ArcRecord[] = [
  {
    id: "substitute",
    name: "SUBSTITUTE SOUL REAPER",
    blade: "斬月 · Zangetsu",
    layer: "living",
    color: "#E8752A",
    text: {
      tr: "Rukia'nın gücünü ödünç almakla başladı ve ödünç aldığı şey ona sığmadı: kılıç kendi boyundan büyük, kaba ve ağır çıktı. Bir çırağın elindeki bu iri kesici, henüz adını bile duymadığı bir ruhun ilk hâliydi.",
      en: "It began by borrowing Rukia's power, and what he borrowed did not fit him: the blade came out taller than he was, crude and heavy. That oversized cleaver in an apprentice's hands was the first shape of a spirit whose name he had not yet heard.",
    },
    form: { len: 0.72, width: 0.62, curve: 0.1, tip: 0.35, guard: 0.05, hilt: 0.16 },
  },
  {
    id: "soul-society",
    name: "SOUL SOCIETY",
    blade: "斬月 · bandajlı",
    layer: "soul-society",
    color: "#B8121B",
    text: {
      tr: "Bir infazı durdurmak için duvarın içine girdi ve kılıç orada adını söyledi. Kullanılmadığı zaman kendini saran bandaj, bir silahtan çok bir yaranın sargısına benziyordu — Zangetsu taşınan değil, saklanan bir şeydi.",
      en: "He walked inside the wall to stop an execution, and there the blade spoke its name. The bandage that wrapped it when it was not in use looked less like a sheath than a dressing over a wound — Zangetsu was not carried but hidden.",
    },
    form: { len: 0.78, width: 0.5, curve: 0.14, tip: 0.5, guard: 0.06, hilt: 0.15 },
  },
  {
    id: "arrancar",
    name: "ARRANCAR",
    blade: "天鎖斬月 · Tensa Zangetsu",
    layer: "hueco-mundo",
    color: "#EFEDE7",
    text: {
      tr: "Bankai burada geldi ve beklenenin tersini yaptı: kılıç büyümedi, inceldi. Güç arttıkça biçim küçülüyor — Vasto Lorde'da gördüğümüz aynı kural, bu kez Shinigami tarafında.",
      en: "Bankai arrived here and did the opposite of what was expected: the blade did not grow, it narrowed. Form shrinks as power rises — the same rule we saw in the Vasto Lorde, this time on the Shinigami side.",
    },
    form: { len: 0.82, width: 0.16, curve: 0.06, tip: 0.85, guard: 0.02, hilt: 0.13 },
  },
  {
    id: "lost-agent",
    name: "THE LOST AGENT",
    blade: "Fullbring",
    layer: "living",
    color: "#2E4A6B",
    text: {
      tr: "On yedi ay boyunca hiçbir kılıcı olmadı; gücünü kaybetmiş biri olarak yaşadı. Geri aldığı ilk biçim bir Zanpakutō değil Fullbring'di — kendi eşyasından çıkarılmış, ödünç bir keskinlik.",
      en: "For seventeen months he had no blade at all; he lived as someone who had lost his power. The first edge he got back was not a Zanpakutō but a Fullbring — a sharpness drawn out of his own belongings, and borrowed again.",
    },
    form: { len: 0.66, width: 0.26, curve: 0.3, tip: 0.62, guard: 0.28, hilt: 0.2 },
  },
  {
    id: "blood-war",
    name: "THOUSAND-YEAR BLOOD WAR",
    blade: "斬月 · iki bıçak",
    layer: "wandenreich",
    color: "#7A0F14",
    text: {
      tr: "Ōetsu Nimaiya kılıcı yeniden dövdüğünde ortaya tek bir bıçak çıkmadı: biri uzun, biri kısa, ikisi ayrı. Yıllardır Zangetsu sandığı adam onun Quincy tarafıydı ve kılıç bunu artık saklamıyordu.",
      en: "When Ōetsu Nimaiya reforged the sword, one blade did not come out of it: one long, one short, two separate things. The man he had taken for Zangetsu all those years was his Quincy half, and the blade no longer hid it.",
    },
    form: { len: 0.86, width: 0.2, curve: 0.04, tip: 0.9, guard: 0.14, hilt: 0.11 },
  },
];
