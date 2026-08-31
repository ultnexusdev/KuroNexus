"use client";

import { createContext, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { CuratorDock } from "@/components/curated/CuratorDock";
import styles from "./CuratorFrame.module.css";

/**
 * Küratör modu — GERÇEK durum, niteliğin kendisi değil.
 *
 * ── NEDEN NİTELİĞE EK OLARAK BİR CONTEXT ─────────────────────────────────
 * Anahtar bugüne kadar `data-curating` niteliği + CSS ile çalışıyordu ve o
 * mekanizma yerinde duruyor: sunucu bileşenlerinin içine dağılmış yuvaları
 * bir context'e bağlamak sayfanın tamamını istemci sınırına çekerdi.
 *
 * Ama CSS yalnızca GİZLİYOR. Yükleyici adası kapalıyken de mount ediliyor,
 * durumunu tutuyor ve DOM'da duruyordu — kullanıcı isteği bunun tersi
 * (29 Ağustos 2026): "kapalıyken tamamen DOM'dan saklanacak (veya render
 * edilmeyecek)".
 *
 * Context bunu maliyetsiz çözüyor çünkü YALNIZCA yuvalar okuyor ve yuvalar
 * ZATEN istemci bileşeni (`CuratorSlot`). Sunucudan geçen `children` ağacı
 * sağlayıcının altında kaldığı için context onlara sorunsuz iniyor —
 * sunucu bileşenleri istemciye çekilmiyor.
 *
 * ⚠️ VARSAYILAN `false` DEĞİL `undefined` — ve bu ayrım kritik.
 *
 * Üç durum var, iki değil:
 *   true       → çerçeve var, anahtar AÇIK   → yuva çizilsin
 *   false      → çerçeve var, anahtar KAPALI → yuva çizilmesin
 *   undefined  → ÜSTTE ÇERÇEVE YOK           → eski davranış sürsün
 *
 * Üçüncüsü bir geri çekilme değil güvenlik ağı: `CuratorSlot` bu depoda
 * kırk sekiz dosyadan çağrılıyor ve bazıları yuvayı çerçeveyi açan
 * bileşenin ALTINDA ama başka bir dosyada çiziyor (`GateLadder` →
 * `GateShell` → `RockLeeExperience`). Varsayılan `false` olsaydı,
 * zinciri bir yerde kopuk olan HER yuva yöneticiden de sessizce
 * kaybolurdu — ve bu, statik olarak doğrulanamayacak bir risk.
 *
 * Çerçevesiz yuva eskisi gibi çiziliyor; onu zaten çağıranın kendi
 * `isAdmin` kesmesi ziyaretçiden koruyor.
 */
/**
 * ⚠️ DIŞA AÇIK — sağlayıcıyı `CuratorFrame` dışında da kuran bir yer var.
 *
 * Karakter dizini (`CharacterGallery`) kendi anahtarını zaten tutuyor ve
 * çerçeveyi kullanmıyor; ama rafı SUNUCUDA çizilmiş bir düğüm olarak
 * alıyor (`shelf` prop'u) ve o düğümün içindeki yuvalara prop indiremiyor.
 * Sağlayıcıyı oraya kurmak, rafı istemci paketine çekmeden yuvaların modu
 * okumasını sağlıyor — context sunucuda çizilmiş çocuklardan geçebilir.
 */
export const CuratorModeContext = createContext<boolean | undefined>(
  undefined,
);

/**
 * Küratör modu açık mı.
 *
 * `undefined` "üstte çerçeve yok" demek — çağıran bunu "çiz" olarak
 * yorumluyor (gerekçe yukarıda).
 */
export function useCuratorMode(): boolean | undefined {
  return useContext(CuratorModeContext);
}

/**
 * Kürator modu anahtarı.
 *
 * Yükleme yuvaları sayfaya dağılmış durumda (kapak portresi, her yetenek
 * kartı, galeri) — kullanıcı onları "mevcut yuvaların altında" istedi.
 * Dağınık yuvaları tek bir anahtardan açıp kapatmanın en ucuz yolu bu:
 * sarmalayıcı `data-curating` niteliği taşıyor, yuvalar da
 * `[data-curator-slot]` işaretini; kapalıyken CSS onları gizliyor.
 *
 * Neden React context değil: yuvalar SUNUCU bileşenlerinin içinde çiziliyor.
 * Bir context sağlayıcısı onları istemci sınırına çekerdi ve sayfanın
 * tamamı tarayıcıya JS olarak inerdi. Nitelik + CSS, sunucu çizimini
 * bozmadan aynı işi yapıyor.
 *
 * Anahtarın kendisi bu bileşenle birlikte yalnızca yöneticiye iniyor;
 * ziyaretçi bu JS'i hiç almıyor (çizim `isAdmin` ile sunucuda kesiliyor).
 */
export function CuratorFrame({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("character.curator");
  const [curating, setCurating] = useState(false);

  // Ziyaretçide sarmalayıcı hiç çizilmiyor: ne anahtar, ne nitelik.
  // `children` sunucuda çizilmiş olarak geçtiği için buradan geçmesi ona
  // ek maliyet getirmiyor.
  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    /* Nitelik VE context bir arada, ikisi de gerekli:
         • nitelik → CSS'in ulaşabildiği her yuva (Bleach'in iskeleleri,
           künye satırları, ızgara açılımları) tek seçiciyle açılıp
           kapanıyor;
         • context → yükleyici adaları kapalıyken HİÇ mount edilmiyor.
       İkincisi birincinin yerini alamaz: sayfadaki yuvaların çoğu sunucu
       bileşeni ve context okuyamaz. */
    <CuratorModeContext.Provider value={curating}>
      <div className={styles.frame} data-curating={curating ? "true" : "false"}>
        {/* ⚠️ ANAHTAR ARTIK SAYFANIN BAŞINDA DEĞİL (30 Ağustos 2026).
            Eskiden `.bar` içinde, içeriğin ÜSTÜNDE duran bir satırdı ve
            evren sayfaları o kadar uzun ki modu kapatmak için en başa
            dönmek gerekiyordu (kullanıcı bildirimi). Hap sağ altta sabit
            ve `children`den SONRA çiziliyor — `position: fixed` olduğu
            için görsel yeri değişmiyor, ama sekme sırasında sayfanın
            içeriğinden önce gelmiyor. */}
        {children}
        <CuratorDock
          on={curating}
          onToggle={() => setCurating((value) => !value)}
          label={curating ? t("on") : t("off")}
          hint={t("hint")}
        />
      </div>
    </CuratorModeContext.Provider>
  );
}
