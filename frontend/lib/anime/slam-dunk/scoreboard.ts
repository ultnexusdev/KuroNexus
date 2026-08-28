import { SLAM_DUNK_ANCHORS } from "./anchors";
import { TEAMS } from "./teams";
import type { TeamId } from "./types";

/**
 * SKORBORDUN OKUDUĞU SKOR — çeyrek başına bir gerçek maç.
 *
 * ── FİKİR ────────────────────────────────────────────────────────────────
 * Menü bir stadyum skorbordu şeklinde (kullanıcı isteği). Skorbordun
 * üstünde durup sabit bir sayı göstermek onu bir SÜSE çevirirdi. Bunun
 * yerine her çeyrek, o bölümün anlattığı maçın GERÇEK skorunu yazıyor:
 * ziyaretçi sayfada indikçe skorbord Kanagawa elemelerinden ulusal
 * turnuvaya kadar Shohoku'nun sezonunu sırayla oynuyor.
 *
 * ⚠️ Skorlar uydurma DEĞİL: `teams.ts`teki `clash` kayıtlarından geliyor ve
 * onlar da fandom takım sayfalarındaki maç çizelgelerinden okundu. Açılış
 * çeyreği 0-0 — hava atışı henüz yapılmadı.
 *
 * ⚠️ Sıra `SLAM_DUNK_ANCHORS` ile aynı olmak ZORUNDA: skorbord kaydırma
 * takibiyle çalışıyor ve çapa listesinden okuyor. Aşağıdaki denetim
 * ikisinin ayrışmasını derleme anında yakalıyor.
 */
export interface QuarterScore {
  /** `SLAM_DUNK_ANCHORS` içindeki çapa */
  anchor: string;
  /** Shohoku'nun sayısı */
  home: number;
  /** Rakibin sayısı */
  away: number;
  /** Rakip takım — açılışta henüz yok */
  opponent: TeamId | null;
}

function clashOf(team: TeamId): { home: number; away: number } {
  const clash = TEAMS[team].clash;
  /* `clash` yalnızca Shohoku'da `null` ve buraya Shohoku hiç gelmiyor;
     yine de tip daraltması yapılıyor: bir gün kayıt değişirse derleyici
     uyarsın, çalışma anında `NaN` çizilmesin. */
  if (!clash) return { home: 0, away: 0 };
  const [home, away] = clash.score.split("-").map((n) => Number(n.trim()));
  return { home, away };
}

export const QUARTER_SCORES: QuarterScore[] = [
  { anchor: "tipoff", home: 0, away: 0, opponent: null },
  { anchor: "shohoku", ...clashOf("shoyo"), opponent: "shoyo" },
  { anchor: "matchup", ...clashOf("ryonan"), opponent: "ryonan" },
  { anchor: "bench", ...clashOf("kainan"), opponent: "kainan" },
  { anchor: "buzzer", ...clashOf("sannoh"), opponent: "sannoh" },
];

/**
 * ⚠️ DERLEME ANI DENETİMİ.
 *
 * Bir çapa eklenip buraya yazılmazsa skorbord o bölümde eski skoru
 * göstermeye devam ederdi — sessiz ve fark edilmesi zor bir hata. Modül
 * yüklenirken patlaması, yayına çıkmasından iyi.
 */
if (QUARTER_SCORES.length !== SLAM_DUNK_ANCHORS.length) {
  throw new Error(
    "slam-dunk: QUARTER_SCORES ile SLAM_DUNK_ANCHORS ayrıştı — skorbord yanlış skor gösterir.",
  );
}
