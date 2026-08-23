/**
 * HERO'NUN ARKA KATMANLARI — dört dünya, dört silüet.
 *
 * Kullanıcı hero boyunca kaydırdıkça arka plandaki dünya sırayla
 * değişiyor: Karakura → Seireitei → Las Noches → Silbern.
 *
 * ── NEDEN FOTOĞRAF DEĞİL SVG ─────────────────────────────────────────────
 * Üç gerekçe, üçü de brief'te:
 *   1. Silüet evrensel ve telifsiz — dört dünya için dört uygun fotoğraf
 *      bulmak mümkün değil (Las Noches'in fotoğrafı yok).
 *   2. Kubo'nun negatif alan estetiğine daha yakın: dolu bir fotoğraf
 *      boşluğu öldürür.
 *   3. Ağ isteği yok. Dördü birden inline, toplam birkaç yüz bayt.
 *
 * ── ÇİZİM DİLİ ───────────────────────────────────────────────────────────
 * Hepsi tek renk (`currentColor`), tek katman, dolgu tabanlı. Detay YOK:
 * amaç "hangi dünya" sorusunu siluetten okutmak, mimariyi resmetmek değil.
 * viewBox hepsinde aynı (0 0 1200 400) ki üst üste bindiklerinde ufuk
 * çizgileri hizalansın — çapraz geçişte zıplama olmuyor.
 */

/** 現世 Karakura — alçak banliyö silueti, elektrik direkleri, anten */
export function KarakuraSilhouette() {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Uzak sıra: alçak evler, düz çatılar */}
      <path
        d="M0 400V286h64v-24h58v24h47v-40h72v40h55v-30h68v30h60v-52h78v52h64v-28h70v28h58v-44h74v44h62v-22h66v22h58v-36h76v36h70v114Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* Ön sıra: iki katlı evler, eğimli çatılar */}
      <path
        d="M0 400v-72h52l26-26 26 26h44v-40h96v40h38l30-30 30 30h58v-54h104v54h46l28-28 28 28h50v-46h98v46h40l26-26 26 26h54v-38h100v38h100v72Z"
        fill="currentColor"
      />
      {/* Elektrik direkleri + telleri: Karakura'nın imzası */}
      <g stroke="currentColor" strokeWidth="3" fill="none">
        <path d="M186 400V212M150 226h72M158 248h56" />
        <path d="M642 400V190M606 204h72M614 226h56" />
        <path d="M1044 400V220M1008 234h72M1016 256h56" />
        {/* Sarkan teller */}
        <path d="M186 226q228 46 456 0" strokeWidth="2" opacity="0.7" />
        <path d="M642 204q201 52 402 16" strokeWidth="2" opacity="0.7" />
      </g>
    </svg>
  );
}

/** 尸魂界 Seireitei — beyaz duvarlar, kiremitli çatı sıraları, kule */
export function SeireiteiSilhouette() {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Arkadaki çatı denizi */}
      <path
        d="M0 400v-96l70-38 70 38v-22l64-34 64 34v-30l76-40 76 40v-46l82-44 82 44v34l68-36 68 36v-28l72-38 72 38v-18l68-36 68 36v100Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Öndeki dev duvar — Seireitei'yi kapatan sekkiseki */}
      <path d="M0 400v-150h1200v150Z" fill="currentColor" />
      {/* Duvarın üstündeki mazgal ritmi */}
      <path
        d="M0 250v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26h56v-26h48v26Z"
        fill="currentColor"
      />
      {/* Sōkyoku Tepesi'nin kulesi — tek dikey vurgu */}
      <path d="M576 250V96l24-40 24 40v154Z" fill="currentColor" />
    </svg>
  );
}

/** 虚圏 Las Noches — dev kubbe, sivri kuleler, kum çizgisi */
export function LasNochesSilhouette() {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Kubbe: Las Noches'in tek okunur formu */}
      <path d="M240 400a360 200 0 0 1 720 0Z" fill="currentColor" />
      {/* Dört kule — kubbeden yükselen sivri gövdeler */}
      <g fill="currentColor">
        <path d="M336 400V150l22-52 22 52v250Z" />
        <path d="M520 400V96l26-62 26 62v304Z" />
        <path d="M652 400V96l26-62 26 62v304Z" />
        <path d="M824 400V150l22-52 22 52v250Z" />
      </g>
      {/* Kum çizgisi — kubbenin oturduğu düzlük */}
      <path d="M0 400v-30q300 -22 600 0t600 -0v30Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

/** 見えざる帝国 Silbern — gotik kuleler, sivri kemerler */
export function SilbernSilhouette() {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Arkadaki kule ormanı */}
      <g fill="currentColor" opacity="0.5">
        <path d="M84 400V180l30-70 30 70v220Z" />
        <path d="M282 400V146l26-62 26 62v254Z" />
        <path d="M900 400V160l28-66 28 66v240Z" />
        <path d="M1080 400V196l24-56 24 56v204Z" />
      </g>
      {/* Katedral gövdesi */}
      <path d="M380 400V240h440v160Z" fill="currentColor" />
      {/* İki ana kule — Silbern'in sivri ikizleri */}
      <path d="M404 400V150l34-92 34 92v250Z" fill="currentColor" />
      <path d="M728 400V150l34-92 34 92v250Z" fill="currentColor" />
      {/* Ortadaki sivri kemer boşluğu: gövdeden OYULUYOR, yani kemer
          zeminin rengini gösteriyor — gotik açıklığın kendisi */}
      <path
        d="M556 400V318a44 44 0 0 1 88 0v82Z"
        fill="var(--world-ink, #000)"
      />
    </svg>
  );
}

/** Sırayla: hero boyunca bu dizinin üstünden geçiliyor */
export const WORLD_LAYERS_ORDER = [
  { key: "karakura", Silhouette: KarakuraSilhouette },
  { key: "seireitei", Silhouette: SeireiteiSilhouette },
  { key: "las-noches", Silhouette: LasNochesSilhouette },
  { key: "silbern", Silhouette: SilbernSilhouette },
] as const;
