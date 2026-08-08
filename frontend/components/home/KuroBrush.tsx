"use client";

import type { CSSProperties } from "react";
import styles from "./KuroBrush.module.css";

/**
 * 黒 mührü — vuruş vuruş beliren hâli.
 *
 * ── NEDEN MASKE, NEDEN İSKELET DEĞİL ──────────────────────────────────────
 * Kanji animasyonlarının bilinen yolu KanjiVG'nin vuruş iskeletlerini çizmek.
 * İki sebeple seçilmedi:
 *
 *  1. LİSANS. KanjiVG CC BY-SA 3.0 — atıf ZORUNLU ve share-alike, yani ondan
 *     türeyen çalışma da aynı lisansa bağlanır. Bir marka işaretini o zincire
 *     sokmak istenmedi.
 *  2. GÖRÜNÜM. O iskeletler eşit kalınlıkta çizgiler; el yazısı gibi durur,
 *     fırça gibi durmaz. Sitenin karakteri fırça.
 *
 * Bunun yerine GERÇEK glif (Yuji Boku, OFL) bir maskeyle vuruş sırasına göre
 * açılıyor. Aşağıdaki `d` verisi bir kanji veritabanından KOPYALANMADI:
 * glifin kendisi tuvale çizilip mürekkep dağılımı tarandı (yatay bantlar,
 * dikey bantlar, alttaki dört nokta ölçüldü) ve maske çizgileri o ölçümlere
 * göre yazıldı. Sonuç: animasyon bitince ekranda duran şey, bugünkü logonun
 * TA KENDİSİ — ince bir iskelet değil.
 *
 * ── ZAMANLAMA ─────────────────────────────────────────────────────────────
 * Vuruşlar sabit ritimle başlıyor (`--kb-stagger`), süreleri ise UZUNLUKLARINA
 * göre değişiyor: uzun yatay çubuk 0.5 sn sürerken alttaki nokta 0.24 sn.
 * Hepsine eşit süre verilseydi noktalar ağır, çubuklar aceleci görünürdü.
 * Süreler uzunluğun kareköküyle ölçekleniyor — doğrusal ölçek kısa vuruşları
 * fark edilmeyecek kadar hızlandırıyordu.
 */

/** Sitedeki glifin em kutusu; maske koordinatları bu uzayda (taban y=0). */
const VIEW_BOX = "93 -786 811 885";

/**
 * Vuruşlar arası ritim (sn). Yazımın genel hızını asıl bu belirliyor —
 * süreler örtüştüğü için toplam ≈ 10 × ritim + son vuruş.
 *
 * TEK KAYNAK: hem CSS'e değişken olarak geçiyor hem de `KURO_TOTAL_S`
 * hesabında kullanılıyor. Önce ikisinde ayrı ayrı yazılıydı; biri değişip
 * öteki unutulsaydı "nexus" harfleri kanjinin ortasında belirmeye başlardı.
 */
const STAGGER_S = 0.22;

/** Vuruşlar 黒'nin yazım sırasında: 里 (日 + 土) sonra 灬. */
const STROKES: Array<{ d: string; w: number; dur: number }> = [
  { d: "M272,-712 L272,-425", w: 115, dur: 0.409 }, // 1 · 日 sol dikey
  /* 2 · üst çubuk + sağ dikey, tek vuruşta (㇕).
     Çubuk x 151→859 arası ölçüldü — 日 kutusundan GENİŞ. Kalem sağ uca
     varınca çubuk boyunca geri dönüp sağ dikeyin başına iniyor: o geri
     dönüş zaten açılmış mürekkebin üstünden geçtiği için görünmüyor,
     ama dikeyin doğru yerden (x 734) inmesini sağlıyor. */
  { d: "M145,-706 L866,-706 L734,-706 L734,-425", w: 130, dur: 0.702 },
  { d: "M235,-560 L780,-560", w: 105, dur: 0.548 }, // 3 · 日 orta yatay
  { d: "M235,-416 L762,-416", w: 105, dur: 0.54 }, // 4 · 日 alt yatay
  { d: "M491,-715 L491,-198", w: 110, dur: 0.547 }, // 5 · merkez dikey
  { d: "M245,-305 L700,-305", w: 95, dur: 0.513 }, // 6 · 土'nin yatayı
  { d: "M108,-192 L888,-192", w: 105, dur: 0.672 }, // 7 · uzun alt çubuk
  { d: "M222,-138 L140,68", w: 160, dur: 0.358 }, // 8 · 灬 birinci nokta (sola)
  { d: "M352,-138 L404,58", w: 130, dur: 0.343 }, // 9 · ikinci
  { d: "M550,-138 L600,33", w: 130, dur: 0.321 }, // 10 · üçüncü
  { d: "M735,-138 L858,52", w: 160, dur: 0.362 }, // 11 · dördüncü
];

/** Yuji Boku 黒 glifinin dış hattı (OFL). Dış hatlara çevrildi, yazı tipi gerekmez. */
const KURO_OUTLINE =
  "M884-169Q872-164 850.500-163.500Q829-163 806-167Q783-171 764-178Q622-172 493-169.500Q364-167 248-143Q243-138 240.500-130Q238-122 227-122Q248-90 241.500-57Q235-24 225 3Q223 9 221 14.500Q219 20 218 25Q215 36 204.500 53Q194 70 180 79Q156 72 144.500 57Q133 42 127 21.500Q121 1 115-22Q143-21 157-44Q171-67 182-94Q185-102 188-110Q191-118 195-125Q183-134 164.500-141.500Q146-149 131-158Q116-167 113-180Q119-190 130-193.500Q141-197 151-198Q194-205 247.500-209.500Q301-214 356-216.500Q411-219 458-219Q459-229 458.500-244.500Q458-260 457-272Q457-275 457-276Q441-279 424.500-276Q408-273 392-269Q379-265 366.500-262.500Q354-260 342-260Q308-261 283.500-281.500Q259-302 245-318Q298-318 352.500-323.500Q407-329 454-332Q456-341 456-351.500Q456-362 455-372Q455-380 455-384Q423-382 392-376.500Q361-371 332-371Q301-371 276.500-380Q252-389 237-416Q241-419 241-422.500Q241-426 240-429Q240-434 240-439Q240-444 247-451Q242-501 240-550Q238-599 230-633Q208-647 190.500-664.500Q173-682 159-703Q160-705 163-709Q165-711 166.500-714Q168-717 166-724Q209-722 265-726.500Q321-731 380-736Q405-739 429.500-741Q454-743 477-745Q498-747 519-747Q540-747 560-746Q577-746 594.500-746Q612-746 629-747Q648-748 665-756.500Q682-765 699-766Q711-767 722-764Q733-761 743-757Q754-753 764.500-750Q775-747 788-749Q801-739 818-728.500Q835-718 848.500-706Q862-694 863-677Q857-664 849-662Q841-660 832-660Q826-660 819.500-659.500Q813-659 807-655Q792-645 783-620.500Q774-596 769.500-563Q765-530 760.500-495.500Q756-461 750-430.500Q744-400 733-381Q718-377 705-381Q692-385 680-390Q671-394 662.500-397Q654-400 644-401Q629-403 614-401Q599-399 583-397Q568-394 552.500-392.500Q537-391 520-391Q521-383 520.500-373.500Q520-364 519-355Q518-350 517.500-345Q517-340 517-336Q521-337 525-338Q529-339 533-340Q573-349 603.500-351Q634-353 670-331Q672-330 676-327Q686-322 694-315Q702-308 698-293Q677-287 654.500-286.500Q632-286 610-287Q585-287 561-286.500Q537-286 517-278Q519-271 518-252Q517-233 515-225Q536-221 556.500-223Q577-225 597-227Q616-230 634.500-231.500Q653-233 671-229Q674-231 676.500-232.500Q679-234 682-237Q691-243 701.500-249Q712-255 724-254Q743-253 768.500-246Q794-239 819-227.500Q844-216 862-201Q880-186 884-169M671-489Q669-491 664-490Q660-490 660-492Q666-506 673.500-535Q681-564 685-598.500Q689-633 685.500-662.500Q682-692 668-706Q652-704 632.500-704Q613-704 593-704Q575-705 556.500-705Q538-705 520-704Q539-679 536.500-652Q534-625 528-602Q548-595 568.500-589.500Q589-584 606-575Q623-566 631-548Q604-545 575.500-541.500Q547-538 527-536Q522-518 523.500-489Q525-460 520-443Q530-443 541-444Q552-445 564-447Q585-450 607-451.500Q629-453 650-447Q661-458 660.500-471Q660-484 671-489M883 48Q882 49 880 50Q876 51 873.500 53.500Q871 56 873 62Q830 60 804 31Q778 2 758-38Q741-72 725-108Q709-144 686-170Q716-170 740-154Q764-138 787.500-118.500Q811-99 836-88Q861-63 871.500-28.500Q882 6 883 48M457-591Q455-603 454-622Q453-641 450-660Q447-679 438-689Q413-691 393.500-687.500Q374-684 355-680Q347-678 339-676Q331-674 322-673Q309-663 309.500-644Q310-625 313-602Q314-596 314.500-589Q315-582 316-575Q355-583 384.500-584Q414-585 457-591M417 65Q391 60 375 44Q359 28 349 6Q339-16 330-39Q347-51 350.500-75Q354-99 355-123Q355-132 355.500-140Q356-148 357-155Q398-136 413-99Q428-62 427-18Q426 26 417 65M456-437Q455-445 455-453.500Q455-462 456-472Q456-484 456-498Q456-512 455-528Q440-531 426-528.500Q412-526 397-523Q379-519 360-516.500Q341-514 320-519Q320-502 320-489Q320-476 321-463Q321-456 321.500-448Q322-440 322-431Q344-427 362.500-428Q381-429 400-432Q413-434 426.500-435.500Q440-437 456-437M614 41Q571 28 553.500-1.500Q536-31 534-73Q532-115 534-164Q563-155 581-131.500Q599-108 607.500-77.500Q616-47 617.500-15.500Q619 16 614 41";

/**
 * `pathLength="1"` bilinçli: her maske çizgisinin dash uzunluğu gerçek
 * uzunluğundan bağımsız 1 birim oluyor, animasyon da 1→0 gidiyor. Aksi
 * halde her çizginin uzunluğunu JS'te ölçüp CSS değişkenine yazmak
 * gerekirdi — bir ölçüm turu ve bir yeniden düzenleme daha.
 */
export function KuroBrush({ className }: { className?: string }) {
  return (
    <svg
      viewBox={VIEW_BOX}
      className={[styles.svg, className].filter(Boolean).join(" ")}
      style={{ "--kb-stagger": `${STAGGER_S}s` } as CSSProperties}
      role="img"
      aria-label="KuroNexus"
    >
      <defs>
        {/* ⚠️ BÖLGE AÇIKÇA VERİLMEK ZORUNDA. `maskUnits="userSpaceOnUse"` ile
            x/y/width/height yazılmazsa varsayılan bölge kullanıcı uzayında
            0,0'dan başlıyor; bu glif ise y −786'dan +79'a, yani NEGATİF y'de
            duruyor. Sonuç ölçüldü: yalnızca y > −88 olan kısım çiziliyordu,
            yani ekranda sadece alttaki dört nokta kalıyordu. Bölge viewBox'ı
            fazlasıyla kapsayacak şekilde veriliyor — maske çizgileri kalın ve
            yuvarlak uçlu, kutunun dışına taşabiliyorlar. */}
        <mask
          id="kb-reveal"
          maskUnits="userSpaceOnUse"
          x="-100"
          y="-1000"
          width="1200"
          height="1300"
        >
          {/* Maske: beyaz = görünür. Yuvarlak uçlar fırça ucunun izini taklit
              ediyor; köşeli uç açılırken kutu gibi bir kenar bırakıyordu. */}
          <g
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {STROKES.map((s, i) => (
              <path
                key={i}
                d={s.d}
                strokeWidth={s.w}
                pathLength={1}
                className={styles.stroke}
                style={
                  {
                    "--kb-i": i,
                    "--kb-dur": `${s.dur}s`,
                  } as CSSProperties
                }
              />
            ))}
          </g>
        </mask>

        {/* Sitedeki iki katmanlı `drop-shadow`un SVG karşılığı */}
        <filter
          id="kb-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="57.7" result="u" />
          <feFlood floodColor="var(--hub-gold, #b08d57)" floodOpacity="0.26" />
          <feComposite in2="u" operator="in" result="uzak" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="9.6" result="y" />
          <feFlood floodColor="var(--hub-gold, #b08d57)" floodOpacity="0.3" />
          <feComposite in2="y" operator="in" result="yakin" />
          <feMerge>
            <feMergeNode in="uzak" />
            <feMergeNode in="yakin" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#kb-glow)">
        <path
          d={KURO_OUTLINE}
          mask="url(#kb-reveal)"
          className={styles.ink}
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

/** Kanjinin tamamlanma anı — "nexus" harfleri bundan sonra beliriyor (sn). */
export const KURO_TOTAL_S =
  (STROKES.length - 1) * STAGGER_S + STROKES[STROKES.length - 1].dur;
