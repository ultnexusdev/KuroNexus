#!/usr/bin/env node
/**
 * Karakter rota klasoru ureteci.
 *
 * Kullanim (frontend dizininden):  node rota-uret.mjs <dalga-no>
 * Ajanlarin paylasilan dosyalara dokunmamasi icin rotalar MERKEZDE yaziliyor.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

const R = "app/[locale]/dark-stories/category/anime/karakterler";

const DALGALAR = {
  1: [
    [40882, "Eren Yeager", "eren-yeager", "RumblingExperience", "Attack on Titan"],
    [40881, "Mikasa Ackerman", "mikasa-ackerman", "ScarfExperience", "Attack on Titan"],
    [46494, "Armin Arlert", "armin-arlert", "HorizonExperience", "Attack on Titan"],
    [45627, "Levi Ackerman", "levi", "PrecisionExperience", "Attack on Titan"],
    [434, "Eikichi Onizuka", "eikichi-onizuka", "TrackingExperience", "GTO: Great Teacher Onizuka"],
  ],
  2: [
    [89028, "Izuku Midoriya", "izuku-midoriya", "NotebookExperience", "My Hero Academia"],
    [88892, "Katsuki Bakugou", "katsuki-bakugou", "DetonationExperience", "My Hero Academia"],
    [89220, "Shouto Todoroki", "shouto-todoroki", "HalfAndHalfExperience", "My Hero Academia"],
    [89221, "Ochako Uraraka", "ochako-uraraka", "ZeroGravityExperience", "My Hero Academia"],
    [89224, "Toshinori Yagi", "toshinori-yagi", "PlusUltraExperience", "My Hero Academia"],
  ],
  3: [
    [6, "Rukia Kuchiki", "rukia-kuchiki", "ShirayukiExperience", "Bleach"],
    [906, "Renji Abarai", "renji-abarai", "ZabimaruExperience", "Bleach"],
    [564, "Uryuu Ishida", "uryuu-ishida", "QuincyExperience", "Bleach"],
    [1081, "Ulquiorra Cifer", "ulquiorra-cifer", "HollowExperience", "Bleach"],
    [1080, "Grimmjow Jaegerjaquez", "grimmjow-jaegerjaquez", "DesgarronExperience", "Bleach"],
    [908, "Yoruichi Shihouin", "yoruichi-shihouin", "ShunkoExperience", "Bleach"],
  ],
  4: [
    [157116, "Chousou", "chousou", "BloodlineExperience", "Jujutsu Kaisen"],
    [134167, "Maki Zenin", "maki-zenin", "ArmoryExperience", "Jujutsu Kaisen"],
    [133702, "Mahito", "mahito", "IdleTransfigurationExperience", "Jujutsu Kaisen"],
    [137975, "Aoi Toudou", "aoi-toudou", "BoogieWoogieExperience", "Jujutsu Kaisen"],
    [137974, "Panda", "panda", "ThreeCoresExperience", "Jujutsu Kaisen"],
    [162722, "Touji Fushiguro", "touji-fushiguro", "HeavenRestrictionExperience", "Jujutsu Kaisen"],
    [156991, "Jougo", "jougo", "VolcanoExperience", "Jujutsu Kaisen"],
    [129571, "Yuuta Okkotsu", "yuuta-okkotsu", "RikaExperience", "Jujutsu Kaisen"],
  ],
  5: [
    [126635, "Megumi Fushiguro", "megumi-fushiguro", "ShadowMenagerieExperience", "Jujutsu Kaisen"],
    [133700, "Nobara Kugisaki", "nobara-kugisaki", "StrawDollExperience", "Jujutsu Kaisen"],
    [133704, "Kento Nanami", "kento-nanami", "OvertimeExperience", "Jujutsu Kaisen"],
    [133699, "Suguru Getou", "suguru-getou", "ReliquaryExperience", "Jujutsu Kaisen"],
  ],
};

const dalga = Number(process.argv[2]);
const liste = DALGALAR[dalga];
if (!liste) {
  console.error("Kullanim: node rota-uret.mjs <1..5>");
  process.exit(1);
}

const yenidenYaz = dalga === 5; // dalga 5 mevcut rotalari YENI bilesene bagliyor

for (const [id, ad, slug, comp, seri] of liste) {
  const dir = `${R}/${id}`;
  const dosya = `${dir}/page.tsx`;
  if (existsSync(dosya) && !yenidenYaz) {
    console.log(`atlandi (zaten var): ${dosya}`);
    continue;
  }
  mkdirSync(dir, { recursive: true });
  const eskiNot = yenidenYaz
    ? `\n * 30 Ağustos 2026'da bileşen seti YENİDEN yazıldı (Faz 2, Dalga 5).\n * Eski set silinmedi: components/character/.deprecated/${slug}/ altında duruyor.`
    : "";
  writeFileSync(
    dosya,
    `import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ${comp} } from "@/components/character/${slug}/${comp}";

/**
 * ${ad} — AniList #${id} (${seri}).
 *
 * Elle tasarlanmış deneyim sayfası. Kendi statik rota klasöründe, çünkü App
 * Router bir rotanın stil dosyalarını modül grafiğinden topluyor (ölçüm ve
 * gerekçe: lib/characters/experience-page.tsx). Statik parça dinamik
 * parçadan önce eşleştiği için adres değişmedi.${eskiNot}
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, ${id});
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(${id});
  return (
    <${comp} detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
`,
    "utf8",
  );
  console.log(`yazildi: ${dosya}  →  ${comp}`);
}
