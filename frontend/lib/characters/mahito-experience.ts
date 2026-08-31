import type { LocalizedText } from "./types";

/**
 * Mahito (真人) — "Ruhun şekli" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * RUHUN ŞEKLİ BEDENİN ŞEKLİDİR. Bu sayfada hiçbir kenar diğerine paralel
 * değil: bölümler farklı boy ve şekilde yamalar hâlinde duruyor, her köşenin
 * yarıçapı ayrı, aralarında teyellenmiş dikiş çizgileri var. Sayfanın
 * kalbindeki mekanik de aynı cümlenin kendisi: TEK bir kart var ve beş
 * formdan biri seçildiğinde o kart YER DEĞİŞTİRMİYOR, yeni bir kart
 * açılmıyor — aynı kutu başka bir şeye dönüşüyor (`clip-path` +
 * `border-radius` + metin). Morfoloji ekseni.
 *
 * ── KÜNYE VERİSİNİN KAYNAĞI ──────────────────────────────────────────────
 * `public/assets/anime/karakterler/mahito/kaynak.json` (AniList #133702,
 * 31 Ağustos 2026 çekimi). Oradan birebir gelenler:
 *   · ad `Mahito`, yerel ad `真人`, diğer ad `Patchface`
 *   · cinsiyet alanı `Male`
 *   · derece `Special Grade` ve lanetli teknik `Idle Transfiguration`
 *     (künye gövdesinin `__Grade__` / `__Cursed Technique:__` satırları)
 *   · müttefikler: Suguru Geto, Jogo, Hanami "ve birkaçı daha"
 *   · amaç: insanlığın yok edilmesi, nüfusun lanetli ruhlarla değiştirilmesi
 *   · yapımlar listesi (Jujutsu Kaisen, 2. sezon, Shibuya derlemesi)
 *
 * ⚠️ DOĞUM, YAŞ, KAN GRUBU, BOY — DÖRDÜ DE `null`. Künye şeridinde dördü de
 * SATIR olarak duruyor ama "bilinmiyor" YAZMIYOR: bir lanetli ruhun doğum
 * tarihi, yaşı ve kan grubu olmaz. Kayıt boş olduğu için değil, kaydedilecek
 * bir şey olmadığı için boş. Bu bir karakterizasyon, uydurma değil — dördünün
 * de kaynağı yine `kaynak.json`'un kendi `null`ları.
 *
 * ── EVREN VERİSİNİN KAYNAĞI (arşivin KENDİ JJK defteri) ──────────────────
 *   · sınıf "Felaket Laneti (災害呪霊)", tehdit/istihbarat/enerji notu ve
 *     "değişim geçirmiş insanlar üretebiliyor" cümlesi →
 *     `lib/anime/jjk/spirits.ts`, `slug: "mahito"`
 *   · Alan Genişletme `自閉円頓裹` (Self-Embodiment of Perfection), isabeti
 *     "ruh dokunuşu", gövdesi "beden ruhun aldığı biçime uymak zorunda" →
 *     `lib/anime/jjk/domains.ts`, `slug: "mahito"`
 *   · `領域展延` Alan Yayılımı, bedeli "aynı anda teknik yok", kullananlar
 *     "Mahito, Kashimo" → `lib/anime/jjk/energy.ts`
 *   · Shibuya 21:00 (Nanami ve Nobara) ve 22:30 (zincirleme siyah şimşekler
 *     Mahito'nun ruhunu ilk kez gerçekten hedef alır) →
 *     `lib/anime/jjk/shibuya.ts`
 *   · Kap (器) — Yuji Itadori'nin ölçüt kavgası Mahito →
 *     `lib/anime/jjk/archetypes.ts`
 *
 * ── REPLİK DİSİPLİNİ — ⚠️ BU SAYFADA TIRNAK İÇİNDE DİYALOG YOK ───────────
 * Ulquiorra emsali (30 Ağustos 2026). Mahito'nun ünlü cümleleri internette
 * birbirinden farklı yazımlarla dolaşıyor ve arşivin elinde birebir metni
 * doğrulayacak bir kaynak yok. Bu yüzden sayfa iki tür orijinal dil metni
 * taşıyor ve ikisi de ne olduğunu kendisi söylüyor:
 *   · TERİM — 呪霊, 術式, 無為転変, 自閉円頓裹, 領域展延, 反転術式, 呪具,
 *     束縛, 特級, 災害呪霊. Hepsi yukarıdaki iki kaynaktan doğrulandı ve
 *     "terim" rozetiyle çiziliyor.
 *   · ARŞİV CÜMLESİ — kapanıştaki iki satır. Tırnak yok, konuşan yok,
 *     "arşivin cümlesi" rozeti var. Bu bir alıntı değil.
 * Doğrulayamadığımız hiçbir kanji yazılmadı: siyah şimşek sonrası evrimin
 * Japonca adı BİLEREK boş — arşivde o adın doğrulanmış bir kaydı yok.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * Jujutsu (呪術) · Lanet Enerjisi (呪力) · Lanetli Teknik (術式) ·
 * Alan Genişletme (領域展開) · Alan Yayılımı (領域展延) · Lanetli Ruh (呪霊) ·
 * Lanetli Alet (呪具) · Ters Lanet Tekniği (反転術式) · Bağlayıcı Söz (束縛) ·
 * Özel Derece (特級) · Felaket Laneti (災害呪霊).
 * Naruto ya da Bleach terimi YOK.
 */

export const MHT_ID = 133702;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MHT_SITE_URL = "https://anilist.co/character/133702";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir madalyon kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 */
export const MHT_PORTRAIT = {
  src: "/assets/anime/karakterler/mahito/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 133702 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `mht:` önekli (küratör modu şartı).
 */
export const MHT_IMAGE_KEYS = {
  hero: "mht:hero",
  seams: "mht:seams",
  labTechnique: "mht:idle-transfiguration",
  labDomain: "mht:self-embodiment",
  labAmplify: "mht:domain-amplification",
  minorTransfigured: "mht:transfigured-humans",
  minorReversal: "mht:reversal-absent",
  minorTool: "mht:cursed-tool-absent",
  minorVow: "mht:binding-vow",
  formRaw: "mht:form-raw",
  formMade: "mht:form-made",
  formSelf: "mht:form-self",
  formDomain: "mht:form-domain",
  formEvolved: "mht:form-evolved",
  fateBirth: "mht:fate-birth",
  fateVessel: "mht:fate-vessel",
  fateShibuya: "mht:fate-shibuya",
  fateFlash: "mht:fate-black-flash",
  fateEnd: "mht:fate-end",
  closing: "mht:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const MHT_SLOT_LABELS: Record<string, LocalizedText> = {
  [MHT_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey tam boy kare, dikişli yüz görünür (3:4)",
    en: "Hero — vertical full-figure frame, the stitched face visible (3:4)",
  },
  [MHT_IMAGE_KEYS.seams]: {
    tr: "Dikişler — yüzdeki teyelin yakın çekimi (1:1)",
    en: "The seams — a close crop of the basting on the face (1:1)",
  },
  [MHT_IMAGE_KEYS.labTechnique]: {
    tr: "無為転変 — ruha dokunan el, biçim değiştiren beden (16:9)",
    en: "無為転変 — the hand that touches a soul, a body changing shape (16:9)",
  },
  [MHT_IMAGE_KEYS.labDomain]: {
    tr: "自閉円頓裹 — kapanan alan, içerideki her ruh menzilde (16:9)",
    en: "自閉円頓裹 — the domain sealing shut, every soul inside in range (16:9)",
  },
  [MHT_IMAGE_KEYS.labAmplify]: {
    tr: "領域展延 — örtü dışa değil bedene sarılıyor (16:9)",
    en: "領域展延 — the veil wrapped around the body, not unfolded (16:9)",
  },
  [MHT_IMAGE_KEYS.minorTransfigured]: {
    tr: "Değişim geçirmiş insanlar — üretilmiş gövdeler (3:2)",
    en: "Transfigured humans — manufactured bodies (3:2)",
  },
  [MHT_IMAGE_KEYS.minorReversal]: {
    tr: "反転術式 — öğrenilemeyen şey; boş kalan yer (3:2)",
    en: "反転術式 — the thing never learned; the space it leaves (3:2)",
  },
  [MHT_IMAGE_KEYS.minorTool]: {
    tr: "呪具 — aletsiz el, kayıtta karşılığı olmayan yuva (3:2)",
    en: "呪具 — a hand without a tool, a slot with no record (3:2)",
  },
  [MHT_IMAGE_KEYS.minorVow]: {
    tr: "束縛 — söz ve bedel; bağlanan lanet enerjisi (3:2)",
    en: "束縛 — a vow and its price; cursed energy bound (3:2)",
  },
  [MHT_IMAGE_KEYS.formRaw]: {
    tr: "Form 1 — dokunulmamış beden, ham madde (4:3)",
    en: "Form 1 — the untouched body, raw material (4:3)",
  },
  [MHT_IMAGE_KEYS.formMade]: {
    tr: "Form 2 — değişim geçirmiş insan (4:3)",
    en: "Form 2 — a transfigured human (4:3)",
  },
  [MHT_IMAGE_KEYS.formSelf]: {
    tr: "Form 3 — kendi bedenini yeniden şekillendiren lanet (4:3)",
    en: "Form 3 — the curse reshaping its own body (4:3)",
  },
  [MHT_IMAGE_KEYS.formDomain]: {
    tr: "Form 4 — alanın içi, ruha doğrudan temas (4:3)",
    en: "Form 4 — inside the domain, direct contact with the soul (4:3)",
  },
  [MHT_IMAGE_KEYS.formEvolved]: {
    tr: "Form 5 — siyah şimşek sonrası evrilmiş hâl (4:3)",
    en: "Form 5 — the evolved state after the black flash (4:3)",
  },
  [MHT_IMAGE_KEYS.fateBirth]: {
    tr: "Doğuş — insanların birbirine duyduğu nefret (3:2)",
    en: "Birth — the hatred people hold for one another (3:2)",
  },
  [MHT_IMAGE_KEYS.fateVessel]: {
    tr: "Kap — Yuji Itadori ile ilk temas (3:2)",
    en: "The vessel — first contact with Yuji Itadori (3:2)",
  },
  [MHT_IMAGE_KEYS.fateShibuya]: {
    tr: "Shibuya 21:00 — cadde, iki kayıt (3:2)",
    en: "Shibuya 21:00 — street level, two entries (3:2)",
  },
  [MHT_IMAGE_KEYS.fateFlash]: {
    tr: "Shibuya 22:30 — zincirleme siyah şimşek (3:2)",
    en: "Shibuya 22:30 — chained black flashes (3:2)",
  },
  [MHT_IMAGE_KEYS.fateEnd]: {
    tr: "Son — yutulma (3:2)",
    en: "The end — being swallowed (3:2)",
  },
  [MHT_IMAGE_KEYS.closing]: {
    tr: "Kapanış — dikişleri sökülmüş bir yama şeridi (21:9)",
    en: "Closing — a strip of patchwork with the stitches undone (21:9)",
  },
};

/**
 * Beklenen karenin teknik künyesi.
 *
 * ⚠️ BU METİN ZİYARETÇİYE ÇİZİLMEZ. Boş bir kadrajın içinde piksel ölçüsü
 * yazması Dalga 1'de Levi sayfasında yapılan hataydı; burada `isAdmin`
 * dalının dışına hiç çıkmıyor.
 */
export const MHT_SLOT_SPECS: Record<string, LocalizedText> = {
  [MHT_IMAGE_KEYS.hero]: {
    tr: "dikey kare · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [MHT_IMAGE_KEYS.seams]: {
    tr: "kare yakın çekim · 900×900 · webp",
    en: "square close crop · 900×900 · webp",
  },
  [MHT_IMAGE_KEYS.labTechnique]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [MHT_IMAGE_KEYS.labDomain]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [MHT_IMAGE_KEYS.labAmplify]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [MHT_IMAGE_KEYS.minorTransfigured]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.minorReversal]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.minorTool]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.minorVow]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.formRaw]: {
    tr: "yama karesi · 1200×900 · webp",
    en: "patch frame · 1200×900 · webp",
  },
  [MHT_IMAGE_KEYS.formMade]: {
    tr: "yama karesi · 1200×900 · webp",
    en: "patch frame · 1200×900 · webp",
  },
  [MHT_IMAGE_KEYS.formSelf]: {
    tr: "yama karesi · 1200×900 · webp",
    en: "patch frame · 1200×900 · webp",
  },
  [MHT_IMAGE_KEYS.formDomain]: {
    tr: "yama karesi · 1200×900 · webp",
    en: "patch frame · 1200×900 · webp",
  },
  [MHT_IMAGE_KEYS.formEvolved]: {
    tr: "yama karesi · 1200×900 · webp",
    en: "patch frame · 1200×900 · webp",
  },
  [MHT_IMAGE_KEYS.fateBirth]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.fateVessel]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.fateShibuya]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.fateFlash]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.fateEnd]: {
    tr: "sahne karesi · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [MHT_IMAGE_KEYS.closing]: {
    tr: "şerit kadraj · 1800×780 · webp",
    en: "band frame · 1800×780 · webp",
  },
};

/** `CuratorSlot`un `size` propu — yükleyici oranı kendisi yazıyor. */
export const MHT_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [MHT_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [MHT_IMAGE_KEYS.seams]: { w: 900, h: 900 },
  [MHT_IMAGE_KEYS.labTechnique]: { w: 1600, h: 900 },
  [MHT_IMAGE_KEYS.labDomain]: { w: 1600, h: 900 },
  [MHT_IMAGE_KEYS.labAmplify]: { w: 1600, h: 900 },
  [MHT_IMAGE_KEYS.minorTransfigured]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.minorReversal]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.minorTool]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.minorVow]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.formRaw]: { w: 1200, h: 900 },
  [MHT_IMAGE_KEYS.formMade]: { w: 1200, h: 900 },
  [MHT_IMAGE_KEYS.formSelf]: { w: 1200, h: 900 },
  [MHT_IMAGE_KEYS.formDomain]: { w: 1200, h: 900 },
  [MHT_IMAGE_KEYS.formEvolved]: { w: 1200, h: 900 },
  [MHT_IMAGE_KEYS.fateBirth]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.fateVessel]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.fateShibuya]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.fateFlash]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.fateEnd]: { w: 1200, h: 800 },
  [MHT_IMAGE_KEYS.closing]: { w: 1800, h: 780 },
};

/** Portre yuvasının etiketi (PORTRAIT — ABILITY değil). */
export const MHT_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey tam boy kare, madalyonun üstüne yazılır (3:4)",
  en: "Portrait — vertical full-figure frame, overrides the medallion (3:4)",
};

/** Boş kadrajın YÖNETİCİDE görünen tek kelimesi. */
export const MHT_FRAME_EMPTY: LocalizedText = {
  tr: "boş yama",
  en: "empty patch",
};

/** Sayfa sonundaki düzenleyicisiz özet. */
export const MHT_GAPS = {
  title: { tr: "Dikilecek yamalar", en: "Patches left to sew" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yamalar dikildi.",
    en: "Every patch has been sewn.",
  },
} as const;

/** Breadcrumb'ın ikinci parçası. */
export const MHT_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

/** Görsel `alt` metinlerinin ortak öneki (kaynak bilgisi taşır). */
export const MHT_ALT = {
  scenePrefix: {
    tr: "Mahito — küratör yüklemesi:",
    en: "Mahito — curator upload:",
  },
} as const;

/* ══ 1 · HERO ═════════════════════════════════════════════════════════════ */

export const MHT_HERO = {
  eyebrow: {
    tr: "Lanetli Ruh · 呪霊 · Özel Derece",
    en: "Cursed Spirit · 呪霊 · Special Grade",
  },
  /** Başlığın altındaki tek cümle — sayfanın tezi. */
  lede: {
    tr: "Ruhun şekli bedenin şeklidir. Mahito bir bedene değil, bedenin altındaki şeye dokunuyor; beden de kendisine verilen biçime uymak zorunda kalıyor. Bu sayfada hiçbir kenar diğerine paralel değil, çünkü burada hiçbir şey sabit kalmıyor.",
    en: "The shape of the soul is the shape of the body. Mahito does not touch a body but the thing underneath it, and the body has no choice but to follow the shape it is given. No edge on this page runs parallel to another, because nothing here stays fixed.",
  },
  portraitAlt: {
    tr: "Mahito — AniList resmî portresi (#133702), depodaki kopya",
    en: "Mahito — official AniList portrait (#133702), the copy held in this repository",
  },
  portraitAltUploaded: {
    tr: "Mahito — küratörün yüklediği portre",
    en: "Mahito — the portrait uploaded by the curator",
  },
  /** Madalyonun altındaki iki satır. */
  portraitCap: { tr: "AniList portresi · 230×345", en: "AniList portrait · 230×345" },
  portraitCapNote: {
    tr: "Küçük kare, madalyon ölçüsünde kullanıldı",
    en: "A small frame, used at medallion size",
  },
  /** Yalnızca yöneticide — büyük hero karesinin neden boş olduğu. */
  heroCaption: {
    tr: "Büyük hero karesi bilerek boş: depodaki portre 1200×1600 için küçük. Aşağıdaki yuvadan tam boy kareyi yükleyebilirsin.",
    en: "The large hero frame is deliberately empty: the portrait in the repository is too small for 1200×1600. Upload a full-size frame from the slot below.",
  },
  /** Yüklenen karenin üstüne perdeyle yazılan künye. */
  frameCredit: {
    tr: "Küratör yüklemesi · KuroNexus arşivi",
    en: "Curator upload · KuroNexus archive",
  },
} as const;

/* ══ 2 · MOD DÜĞMESİ ══════════════════════════════════════════════════════ */

/**
 * "Ruhun şekli" — `data-soul`.
 *
 * Açıkken sayfanın YAPISI değişiyor: bütün yamaların köşe yarıçapları daha
 * düzensiz bir kümeye geçiyor, dikiş çizgileri (`stroke-dasharray` teyel)
 * görünür hâle geliyor ve ten tonları (`--mht-flesh`) öne çıkıyor. Işık
 * değişmiyor — kenarlar değişiyor.
 */
export const MHT_MODE = {
  title: { tr: "Ruhun şekli", en: "The shape of the soul" },
  native: "無為転変",
  enter: { tr: "Dikişleri göster", en: "Show the seams" },
  exit: { tr: "Dikişleri gizle", en: "Hide the seams" },
  hintOff: {
    tr: "Sayfa şu an düzgün duruyor. Düzgün durması, altındaki şeyin düzgün olduğu anlamına gelmiyor.",
    en: "The page is holding its shape for now. Holding a shape is not the same as being one.",
  },
  hintOn: {
    tr: "Dikişler açıldı: her yamanın köşeleri kaydı, teyel görünür oldu, ten öne çıktı. Aynı içerik, başka bir beden.",
    en: "The seams are open: every patch has shifted its corners, the basting is visible, the skin has come forward. Same content, another body.",
  },
} as const;

/* ══ 3 · KÜNYE ŞERİDİ ═════════════════════════════════════════════════════ */

/**
 * Künye satırları.
 *
 * ⚠️ Dört satırın kaynak değeri `null` (doğum, yaş, kan grubu, boy) ve bu
 * dördü "bilinmiyor" YAZMIYOR — dördü de karakterizasyona çevrildi. Kaynak
 * yine `kaynak.json`: kayıt boş, çünkü kaydedilecek bir şey yok.
 */
export const MHT_IDENTITY = {
  name: "Mahito",
  nativeName: "真人",
  altName: { tr: "Diğer ad: Patchface", en: "Also known as: Patchface" },
  /** Sembolik obje — künye şeridinin son satırı, kendi bloğunda. */
  symbol: {
    glyph: "無為転変",
    title: { tr: "Sembolik obje: dikiş", en: "Symbolic object: the seam" },
    text: {
      tr: "Mahito'nun yüzünü ve gövdesini bir arada tutan şey teyel. Bir dikiş iki ayrı parçanın bir arada durduğunu itiraf eder: yamanın kendisi değil, ARADAKİ ÇİZGİ onun imzası. Bu yüzden bu sayfanın filigranı da bir arma değil, bir dikiş deseni.",
      en: "What holds Mahito's face and body together is basting thread. A seam confesses that two separate pieces are being held together: his signature is not the patch but the LINE BETWEEN them. That is why the watermark on this page is a stitch pattern rather than a crest.",
    },
  },
  facts: [
    {
      label: { tr: "Tür", en: "Kind" },
      value: {
        tr: "Lanetli Ruh (呪霊) — insanların birbirine duyduğu nefretten doğdu",
        en: "Cursed Spirit (呪霊) — born from the hatred people hold for one another",
      },
    },
    {
      label: { tr: "Derece", en: "Grade" },
      value: {
        tr: "Özel Derece (特級) — künyede: Special Grade",
        en: "Special Grade (特級) — the record reads: Special Grade",
      },
    },
    {
      label: { tr: "Sınıf", en: "Class" },
      value: {
        tr: "Felaket Laneti (災害呪霊) — arşivin lanet defterindeki kaydı",
        en: "Disaster Curse (災害呪霊) — his entry in the archive's curse ledger",
      },
    },
    {
      label: { tr: "Lanetli Teknik", en: "Cursed Technique" },
      value: {
        tr: "無為転変 — Idle Transfiguration",
        en: "無為転変 — Idle Transfiguration",
      },
    },
    {
      label: { tr: "Doğum", en: "Birth" },
      value: {
        tr: "Bir tarih değil, bir duygu. Lanetli ruhların takvimi yok.",
        en: "Not a date but a feeling. Cursed spirits keep no calendar.",
      },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "Sayılmıyor. Nefret eskimiyor, biriktiği için büyüyor.",
        en: "Uncounted. Hatred does not age; it grows by accumulating.",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: {
        tr: "Yok. İçinde dolaşan şey kan değil, lanet enerjisi (呪力).",
        en: "None. What moves inside him is not blood but cursed energy (呪力).",
      },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "Ölçülemez: bedenini istediği anda yeniden şekillendiriyor.",
        en: "Unmeasurable: he reshapes his own body whenever he likes.",
      },
    },
    {
      label: { tr: "Cinsiyet", en: "Gender" },
      value: {
        tr: "Künyede Male yazıyor — bir lanetin seçtiği değil, insanın verdiği etiket.",
        en: "The record says Male — a label given by people, not chosen by a curse.",
      },
    },
    {
      label: { tr: "Birlikte hareket ettikleri", en: "Allied with" },
      value: {
        tr: "Suguru Getō, Jōgo, Hanami ve birkaçı daha",
        en: "Suguru Geto, Jogo, Hanami and several others",
      },
    },
    {
      label: { tr: "Amaç", en: "Goal" },
      value: {
        tr: "İnsanlığın yok edilmesi; nüfusun lanetli ruhlarla değiştirilmesi",
        en: "The eradication of humanity; replacing the population with cursed spirits",
      },
    },
    {
      label: { tr: "Yapımlar", en: "Appears in" },
      value: {
        tr: "Jujutsu Kaisen · 2. sezon · Shibuya derlemesi",
        en: "Jujutsu Kaisen · Season 2 · the Shibuya compilation",
      },
    },
  ],
} as const;

/** Künye şeridinin altındaki dipnot — dört boş alanın gerekçesi. */
export const MHT_MISSING_NOTE: LocalizedText = {
  tr: "Doğum, yaş, kan grubu ve boy alanları AniList kaydında boş. Bu sayfa oraya bir sayı uydurmadı: dördü de bir lanetli ruhun taşımadığı bilgiler ve satırlar bunu söylüyor.",
  en: "Birth, age, blood type and height are all empty on the AniList record. This page did not invent numbers for them: all four are things a cursed spirit does not carry, and the rows say so.",
};

/* ══ 4 · LANET LABORATUVARI ═══════════════════════════════════════════════ */

/** Bölüm başlıkları ve giriş cümleleri. */
export const MHT_SECTIONS = {
  identity: {
    title: { tr: "Kayıt yamaları", en: "The record patches" },
    lede: {
      tr: "Bir lanetli ruhun künyesi, bir insanınki gibi doldurulamıyor. Aşağıdaki on iki satırın dördü boş geldi ve boş kaldı.",
      en: "A cursed spirit's record cannot be filled in the way a person's can. Four of the twelve rows below arrived empty and stayed empty.",
    },
  },
  lab: {
    title: { tr: "Lanet laboratuvarı", en: "The curse laboratory" },
    lede: {
      tr: "Üç büyük kayıt: bir lanetli teknik (術式), bir alan genişletme (領域展開) ve bir alan yayılımı (領域展延). Üçü de arşivin kendi Jujutsu Kaisen defterinden geliyor.",
      en: "Three major entries: a cursed technique (術式), a domain expansion (領域展開) and a domain amplification (領域展延). All three come from the archive's own Jujutsu Kaisen ledger.",
    },
  },
  minors: {
    title: { tr: "Dört küçük yama", en: "Four small patches" },
    lede: {
      tr: "Bir kayıt dolu, üçü boş. Boş olanlar bu sayfada eksik değil: Mahito'nun ne OLMADIĞI da onun kaydının bir parçası.",
      en: "One entry is filled, three are empty. The empty ones are not gaps here: what Mahito is NOT is also part of his record.",
    },
  },
  forms: {
    title: { tr: "Beden değiştirme", en: "Changing the body" },
    lede: {
      tr: "Aşağıda TEK bir kart var. Bir form seçtiğinde kart yer değiştirmiyor, yeni bir kart açılmıyor: aynı kutu başka bir şey oluyor. Şekli değişiyor, kenarları değişiyor, içindeki metin değişiyor — ama o hâlâ aynı kart.",
      en: "There is exactly ONE card below. Choosing a form does not move it and does not open a second one: the same box becomes something else. Its shape changes, its edges change, the text inside changes — and it is still the same card.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The chart of fate" },
    lede: {
      tr: "Beş durak. Yaş etiketi yok, çünkü yaşı yok: her durak bir yer ve bir saat taşıyor.",
      en: "Five stops. There are no age labels because he has no age: each stop carries a place and an hour instead.",
    },
  },
  bonds: {
    title: { tr: "Dokunduğu insanlar", en: "The people he touched" },
    lede: {
      tr: "Bir lanetli ruhun ilişkileri arkadaşlık değil temas. Aşağıdakilerin her birine dokundu ve her biri buna bir cevap verdi.",
      en: "A cursed spirit's relationships are contact, not friendship. He touched each of the people below, and each of them answered.",
    },
  },
  closing: {
    title: { tr: "Sökülen dikiş", en: "The undone seam" },
    lede: {
      tr: "Bir yama, dikişi söküldüğünde geriye parçalarını bırakır. Mahito'nun sonu da bir dönüşüm değil, bir sökülme.",
      en: "When its seam is undone, a patch leaves its pieces behind. Mahito's end is not a transformation either — it is an unstitching.",
    },
  },
} as const;

/** Kartların rozetleri: kayıttan mı geliyor, arşivin okuması mı. */
export const MHT_BADGES = {
  record: { tr: "kayıt", en: "record" },
  term: { tr: "terim", en: "term" },
  reading: { tr: "arşivin okuması", en: "the archive's reading" },
  absent: { tr: "kayıt yok", en: "no record" },
} as const;

/** ÜÇ BÜYÜK KART — hepsi arşivin kendi JJK defterinden. */
export const MHT_LAB = [
  {
    key: "technique",
    name: "無為転変",
    reading: "Mui Tenpen",
    turkish: { tr: "Lanetli Teknik (術式)", en: "Cursed Technique (術式)" },
    english: "Idle Transfiguration",
    tagline: {
      tr: "Ruha doğrudan dokunmak",
      en: "Touching the soul directly",
    },
    text: {
      tr: "Jujutsu'da ruh bedenin içinde durur ve normalde ona erişilmez. Mahito'nun tekniği tam olarak o erişimi veriyor: eliyle ruhun şekline dokunuyor ve beden, ruha verilen yeni biçime uymak zorunda kalıyor. Bu yüzden dokunduğu insan yaralanmıyor — YENİDEN YAPILIYOR.",
      en: "In jujutsu the soul sits inside the body and is normally out of reach. Mahito's technique grants exactly that reach: his hand touches the shape of the soul, and the body is forced to match the new shape it is given. This is why the person he touches is not wounded — they are REMADE.",
    },
    traits: [
      { tr: "Temas gerekiyor: eli değmeden hiçbir şey olmuyor", en: "Contact is required: nothing happens without his hand" },
      { tr: "Kendi ruhuna da dokunabiliyor — kendi bedenini şekillendiriyor", en: "He can touch his own soul too — and reshapes his own body" },
      { tr: "Ölüm bir sonuç değil, biçimlerden yalnızca biri", en: "Death is not an outcome but merely one of the shapes" },
    ],
    imageKey: MHT_IMAGE_KEYS.labTechnique,
    badge: "record" as const,
  },
  {
    key: "domain",
    name: "自閉円頓裹",
    reading: "Jihei Endonka",
    turkish: { tr: "Alan Genişletme (領域展開)", en: "Domain Expansion (領域展開)" },
    english: "Self-Embodiment of Perfection",
    tagline: {
      tr: "İçerideki her ruh menzilde",
      en: "Every soul inside is in range",
    },
    text: {
      tr: "Alan, içindeki her varlığın ruhuna doğrudan temas ediyor. Beden, ruhun aldığı biçime uymak zorunda kalıyor ve teknik kesin isabet ediyor — alan genişletmenin kuralı bu. Mahito için alanın anlamı menzil değil, ELİ OLMADAN DOKUNABİLMEK.",
      en: "The domain makes direct contact with the soul of every being inside it. The body has no choice but to follow the shape the soul is given, and the technique cannot miss — that is the rule of a domain expansion. For Mahito the point of the domain is not range but being able to TOUCH WITHOUT HIS HAND.",
    },
    traits: [
      { tr: "İsabet biçimi: ruh dokunuşu", en: "Manner of the hit: a touch on the soul" },
      { tr: "Derece: Özel Derece (特級)", en: "Grade: Special Grade (特級)" },
      { tr: "İki alan çakışırsa daha rafine olan diğerini eziyor", en: "When two domains collide, the more refined one crushes the other" },
    ],
    imageKey: MHT_IMAGE_KEYS.labDomain,
    badge: "record" as const,
  },
  {
    key: "amplify",
    name: "領域展延",
    reading: "Ryōiki Ten'en",
    turkish: { tr: "Alan Yayılımı (領域展延)", en: "Domain Amplification (領域展延)" },
    english: "Domain Amplification",
    tagline: {
      tr: "Örtüyü dışa değil bedene sarmak",
      en: "Wrapping the veil around the body",
    },
    text: {
      tr: "Alanın örtüsü dışa açılmak yerine bedene sarılıyor ve temas ettiği tekniği nötralize ediyor. Bedeli açık: aynı anda kendi tekniğini kullanamıyorsun. Teknik bağımlı bir rakibe karşı sessiz bir karşı hamle — ve Mahito bunu kullanan iki addan biri.",
      en: "Instead of unfolding outward, the domain's veil is wrapped around the body, neutralising any technique it touches. The price is plain: you cannot use your own technique at the same time. A silent counter against a technique-dependent opponent — and Mahito is one of the two names who use it.",
    },
    traits: [
      { tr: "Bedeli: aynı anda teknik yok", en: "The price: no technique at the same time" },
      { tr: "Arşivde kullananlar: Mahito, Kashimo", en: "In the archive its users are: Mahito, Kashimo" },
      { tr: "Savunma değil iptal: dokunduğu tekniği söndürüyor", en: "Not a guard but a cancellation: it snuffs out the technique it touches" },
    ],
    imageKey: MHT_IMAGE_KEYS.labAmplify,
    badge: "record" as const,
  },
] as const;

/** DÖRT KÜÇÜK KART — biri dolu, üçü bilerek boş. */
export const MHT_MINORS = [
  {
    key: "transfigured",
    name: { tr: "Değişim geçirmiş insanlar", en: "Transfigured humans" },
    term: { tr: "üretilmiş gövdeler", en: "manufactured bodies" },
    text: {
      tr: "İnsanı bir malzeme olarak gördüğü için değişim geçirmiş insanlar üretebiliyor. Bunlar yeni yaratıklar değil: bir zamanlar birer insandılar ve hâlâ o insanın ruhunu taşıyorlar.",
      en: "Because he treats humans as material, he can manufacture transfigured people. These are not new creatures: they were people once, and they still carry that person's soul.",
    },
    imageKey: MHT_IMAGE_KEYS.minorTransfigured,
    badge: "record" as const,
  },
  {
    key: "reversal",
    name: { tr: "Ters Lanet Tekniği", en: "Reverse Cursed Technique" },
    term: { tr: "反転術式 — öğrenemedi", en: "反転術式 — never learned" },
    text: {
      tr: "İki negatif lanet enerjisini çarparak pozitife çeviren ve yarayı iyileştiren teknik. Mahito bunu öğrenemedi. Ruhun şeklini istediği gibi bozabilen varlık, bozduğu şeyi geri almayı bilmiyor.",
      en: "The technique that multiplies two negatives of cursed energy into a positive and heals a wound. Mahito never learned it. The being who can distort the shape of a soul at will does not know how to put back what he distorts.",
    },
    imageKey: MHT_IMAGE_KEYS.minorReversal,
    badge: "absent" as const,
  },
  {
    key: "tool",
    name: { tr: "Lanetli Alet", en: "Cursed Tool" },
    term: { tr: "呪具 — kayıt yok", en: "呪具 — no record" },
    text: {
      tr: "Arşivde Mahito'ya ait bir lanetli alet kaydı yok ve bu yuva boş kalıyor. Dokunmak için alet gerekmiyor; onun silahı zaten eli.",
      en: "The archive holds no cursed tool entry for Mahito, and this slot stays empty. Touching needs no instrument; his weapon is already his hand.",
    },
    imageKey: MHT_IMAGE_KEYS.minorTool,
    badge: "absent" as const,
  },
  {
    key: "vow",
    name: { tr: "Bağlayıcı Söz", en: "Binding Vow" },
    term: { tr: "束縛 — kavram", en: "束縛 — the concept" },
    text: {
      tr: "Bağlayıcı söz, lanet enerjisini bir şarta bağlayarak güçlendirmektir: bir şeyden vazgeçersin, karşılığında bir şey kazanırsın. Mahito'nun kayıtlarında bir bağlayıcı söz yok — ve arşivin okuması şu: hiçbir sözü olmayan bir varlığın tutması gereken bir şekli de yoktur.",
      en: "A binding vow strengthens cursed energy by tying it to a condition: you give something up and gain something back. There is no binding vow in Mahito's records — and the archive reads it this way: a being who has given no word has no shape it is obliged to keep.",
    },
    imageKey: MHT_IMAGE_KEYS.minorVow,
    badge: "reading" as const,
  },
] as const;

/* ══ 5 · MEKANİK: BEŞ FORM, TEK KART ══════════════════════════════════════ */

/**
 * Sayfanın kalbi. Beş form ve TEK bir kart.
 *
 * ⚠️ Bu bir "beş kademeli seçici" DEĞİL: formlar sıralı değil, birbirinin
 * üstüne binmiyor ve bir merdiven oluşturmuyor. Çıktının kendisi KUTUNUN
 * GEOMETRİSİ — her form kartın `clip-path` köşe kümesini ve dört köşesinin
 * yarıçapını başka bir değere çekiyor. Kart taşınmıyor, kopyalanmıyor,
 * yerine yenisi gelmiyor; aynı DOM düğümü başka bir şeye dönüşüyor.
 *
 * `shape` alanı CSS'e geçen sıra numarası değil, kartın `data-form`
 * niteliğine yazılan anahtar. Şeklin tarifi `shapeNote`ta YAZILI da duruyor:
 * `prefers-reduced-motion`ta morph animasyonu kapansa bile ne olduğu
 * okunabilir kalıyor.
 */
export const MHT_FORMS = [
  {
    key: "raw",
    index: "01",
    glyph: "人",
    name: { tr: "Ham beden", en: "Raw body" },
    term: { tr: "dokunulmamış insan", en: "an untouched human" },
    title: {
      tr: "Henüz kimse dokunmadı",
      en: "No one has touched it yet",
    },
    body: {
      tr: "Bir insan bedeni, kendi ruhunun verdiği şekli taşıyor. Jujutsu'da normal olan bu: ruh içeride durur, kimse ona erişemez, beden de bu yüzden aynı beden kalır. Mahito'nun bütün işi bu cümlenin ilk yarısını yanlışlamak.",
      en: "A human body carries the shape its own soul gives it. In jujutsu this is the normal state: the soul sits inside, no one can reach it, and the body therefore stays the same body. All of Mahito's work consists of falsifying the first half of that sentence.",
    },
    shapeNote: {
      tr: "Kartın şekli: dört köşesi de yumuşak, neredeyse simetrik bir yama.",
      en: "The card's shape: all four corners soft, an almost symmetrical patch.",
    },
    imageKey: MHT_IMAGE_KEYS.formRaw,
  },
  {
    key: "made",
    index: "02",
    glyph: "変",
    name: { tr: "Değişim geçirmiş insan", en: "Transfigured human" },
    term: { tr: "üretilmiş gövde", en: "a manufactured body" },
    title: {
      tr: "Aynı ruh, başka bir kap",
      en: "The same soul, another vessel",
    },
    body: {
      tr: "Mahito insanı bir malzeme olarak gördüğü için değişim geçirmiş insanlar üretebiliyor. Bu gövdeler yeni varlıklar değil: içlerindeki ruh hâlâ o insanın ruhu. Değişen tek şey ruha verilen şekil — ve bedenin ona uymak zorunda oluşu.",
      en: "Because Mahito treats humans as material, he can manufacture transfigured people. These bodies are not new beings: the soul inside is still that person's soul. The only thing that changed is the shape the soul was given — and the body's obligation to match it.",
    },
    shapeNote: {
      tr: "Kartın şekli: üç köşe sivriliyor, bir köşe içeri çöküyor. Simetri gitti.",
      en: "The card's shape: three corners sharpen, one corner caves inward. Symmetry is gone.",
    },
    imageKey: MHT_IMAGE_KEYS.formMade,
  },
  {
    key: "self",
    index: "03",
    glyph: "自",
    name: { tr: "Kendi bedeni", en: "His own body" },
    term: { tr: "kendi ruhuna dokunmak", en: "touching his own soul" },
    title: {
      tr: "Kendi kendine dikilen yama",
      en: "The patch that sews itself",
    },
    body: {
      tr: "Kendi ruhuna da dokunabildiği için kendi bedenini de yeniden şekillendirebiliyor. Kolunu bir bıçağa, gövdesini bir engele, yüzünü başka bir yüze çevirmek onun için bir hile değil, sıradan bir hareket. Bir yaraya verdiği ilk cevap iyileştirmek değil, o parçayı BAŞKA BİR ŞEY YAPMAK.",
      en: "Because he can touch his own soul as well, he can reshape his own body. Turning an arm into a blade, a torso into a barrier, a face into another face is not a trick for him but ordinary movement. His first answer to a wound is not to heal it but to make that part into SOMETHING ELSE.",
    },
    shapeNote: {
      tr: "Kartın şekli: sol kenar dışarı taşıyor, sağ kenar içeri kaçıyor; kutu eğrilmiş bir gövde gibi duruyor.",
      en: "The card's shape: the left edge bulges out, the right edge draws in; the box stands like a body bent out of true.",
    },
    imageKey: MHT_IMAGE_KEYS.formSelf,
  },
  {
    key: "domain",
    index: "04",
    glyph: "自閉",
    name: { tr: "Alanın içi", en: "Inside the domain" },
    term: { tr: "自閉円頓裹", en: "自閉円頓裹" },
    title: {
      tr: "Artık elini uzatması gerekmiyor",
      en: "He no longer needs to reach out",
    },
    body: {
      tr: "Alan genişletme kapandığında içerideki her varlığın ruhuna doğrudan temas ediliyor ve teknik kesin isabet ediyor. Mahito için buradaki kazanç menzil değil, ARADAKİ MESAFENİN SİLİNMESİ: dışarıda dokunması gereken şeye, içeride zaten dokunmuş oluyor.",
      en: "When the domain expansion seals shut, the soul of every being inside is contacted directly and the technique cannot miss. For Mahito the gain here is not range but the ERASURE OF DISTANCE: what he must reach for outside, he has already touched inside.",
    },
    shapeNote: {
      tr: "Kartın şekli: dört köşe de içeri kırılıyor, kutu kapalı bir zarfa dönüyor.",
      en: "The card's shape: all four corners fold inward and the box becomes a sealed envelope.",
    },
    imageKey: MHT_IMAGE_KEYS.formDomain,
  },
  {
    key: "evolved",
    index: "05",
    glyph: "魂",
    name: { tr: "Evrilmiş hâl", en: "The evolved state" },
    term: { tr: "siyah şimşek sonrası", en: "after the black flash" },
    title: {
      tr: "Ruhu ilk kez gerçekten hedef alındı",
      en: "For the first time his soul was truly targeted",
    },
    body: {
      tr: "Shibuya'da zincirleme siyah şimşekler Mahito'nun ruhunu ilk kez gerçekten hedef aldı. Bir lanetli ruh için bu bir yara değil bir DERS: kendi ruhunun ne olduğunu ilk kez o vuruşlarla anladı ve ardından evrildi. Arşivde bu hâlin doğrulanmış bir Japonca adı yok, o yüzden burada da yazılmadı.",
      en: "In Shibuya, chained black flashes targeted Mahito's soul in earnest for the first time. For a cursed spirit that is not a wound but a LESSON: those strikes were the first time he understood what his own soul was, and afterwards he evolved. The archive holds no verified Japanese name for this state, so none is written here.",
    },
    shapeNote: {
      tr: "Kartın şekli: kenarlar artık düz değil; kutu kendi konturunu yeniden çizmiş gibi duruyor.",
      en: "The card's shape: the edges are no longer straight; the box looks as though it has redrawn its own outline.",
    },
    imageKey: MHT_IMAGE_KEYS.formEvolved,
  },
] as const;

/** Mekaniğin arayüz metinleri — istemci adasına düz dize olarak iniyor. */
export const MHT_FORM_UI = {
  chooserLabel: { tr: "Beş form", en: "Five forms" },
  chooserHint: {
    tr: "Bir form seç: aşağıdaki kart yerinde duruyor ve şeklini değiştiriyor. Ok tuşlarına gerek yok, hepsi sekmeyle geziliyor.",
    en: "Pick a form: the card below stays where it is and changes shape. No arrow keys needed — all of them are reachable with Tab.",
  },
  cardLabel: { tr: "Dönüşen kart", en: "The morphing card" },
  shapeLabel: { tr: "Şekil", en: "Shape" },
  statusPrefix: { tr: "Seçili form", en: "Selected form" },
  reducedNote: {
    tr: "Hareket azaltma açıkken kart bir anda yeni şeklini alıyor; seçim ve metin aynen çalışıyor.",
    en: "With reduced motion on, the card takes its new shape instantly; the selection and the text work exactly the same.",
  },
} as const;

/* ══ 6 · KADER ÇİZELGESİ ══════════════════════════════════════════════════ */

/**
 * Beş durak. Yaş etiketi YOK (yaşı yok) — yerine yer/saat etiketi var.
 * Kilit anların orijinal dil metni TERİM, alıntı değil: her biri yukarıdaki
 * iki kaynaktan doğrulandı.
 *
 * ⚠️ Tip AÇIKÇA yazıldı: `as const` ile bırakılsaydı `kin` alanı yalnızca
 * onu taşıyan iki durakta var olur ve `stop.kin` okuması birleşim tipinde
 * derlenmezdi. `kin` opsiyonel, `mark` her durakta zorunlu.
 */
export interface MahitoStop {
  key: string;
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  mark: { kind: "term"; text: string; reading: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const MHT_TIMELINE: readonly MahitoStop[] = [
  {
    key: "birth",
    era: { tr: "Başlangıç · yer yok", en: "The beginning · no place" },
    title: { tr: "Nefretten doğuş", en: "Born out of hatred" },
    text: {
      tr: "Lanetli ruhlar insanların duygularından doğar. Mahito'nun kaynağı insanların BİRBİRİNE duyduğu nefret — yani bir kişinin değil, aradaki şeyin çocuğu. Bu yüzden onun için insan bir kişi değil bir malzeme: kendisi de zaten insanların arasındaki boşluktan çıktı.",
      en: "Cursed spirits are born from human feelings. Mahito's source is the hatred people hold for ONE ANOTHER — he is the child of what lies between them, not of any single person. This is why a human is material to him rather than a person: he came out of the gap between people to begin with.",
    },
    mark: { kind: "term" as const, text: "呪霊", reading: { tr: "Lanetli Ruh", en: "Cursed Spirit" } },
    imageKey: MHT_IMAGE_KEYS.fateBirth,
  },
  {
    key: "vessel",
    era: { tr: "Kapla temas", en: "Contact with the vessel" },
    title: { tr: "Yūji Itadori", en: "Yuji Itadori" },
    text: {
      tr: "Arşivin arketip defterinde Yūji KAP (器) olarak kayıtlı ve ölçüt kavgası Mahito. İkisinin çatışması bir güç farkı değil bir tanım farkı: Yūji insanların doğru ölümü hak ettiğini düşünüyor, Mahito ölümü yalnızca biçimlerden biri sayıyor.",
      en: "In the archive's ledger of archetypes Yuji is filed as THE VESSEL (器), and his defining fight is Mahito. Their conflict is not a gap in power but a gap in definition: Yuji believes people deserve a proper death, while Mahito counts death as merely one of the shapes.",
    },
    mark: { kind: "term" as const, text: "器", reading: { tr: "Kap", en: "The Vessel" } },
    kin: {
      characterId: 127212,
      name: "Yūji Itadori",
      role: { tr: "baş düşmanı — arşivde KAP", en: "his nemesis — filed as THE VESSEL" },
    },
    imageKey: MHT_IMAGE_KEYS.fateVessel,
  },
  {
    key: "shibuya",
    era: { tr: "Shibuya · 21:00 · cadde", en: "Shibuya · 21:00 · street level" },
    title: { tr: "Nanami ve Nobara", en: "Nanami and Nobara" },
    text: {
      tr: "Mahito iki kaybı arka arkaya kayda geçiriyor. Nanami'nin son cümlesi Yūji'ye bırakılmış bir görev; Nobara'nın durumu bugün hâlâ belirsiz. Shibuya'nın bu saati, sayfanın en kısa ve en ağır satırı.",
      en: "Mahito enters two losses into the record back to back. Nanami's last sentence is a task left to Yuji; Nobara's status is still unresolved. This hour of Shibuya is the shortest and heaviest line on the page.",
    },
    mark: { kind: "term" as const, text: "渋谷", reading: { tr: "Shibuya", en: "Shibuya" } },
    kin: {
      characterId: 133704,
      name: "Kento Nanami",
      role: { tr: "kestiği adam", en: "the man he cut down" },
    },
    imageKey: MHT_IMAGE_KEYS.fateShibuya,
  },
  {
    key: "flash",
    era: { tr: "Shibuya · 22:30 · kesişme", en: "Shibuya · 22:30 · the crossing" },
    title: { tr: "Siyah şimşek", en: "The black flash" },
    text: {
      tr: "Kopyalanmış bir teknik ve bir kardeşlik anlaşması. Zincirleme siyah şimşekler Mahito'nun ruhunu ilk kez gerçekten hedef alıyor. O ana kadar ruh yalnızca onun dokunduğu şeydi; o andan sonra ona da dokunulabilen bir şey.",
      en: "A borrowed technique and a brotherhood pact. Chained black flashes target Mahito's soul in earnest for the first time. Until that moment the soul was only the thing he touched; after it, the soul is something that can be touched back.",
    },
    mark: { kind: "term" as const, text: "術式", reading: { tr: "Lanetli Teknik", en: "Cursed Technique" } },
    imageKey: MHT_IMAGE_KEYS.fateFlash,
  },
  {
    key: "end",
    era: { tr: "Son · başka birinin içinde", en: "The end · inside someone else" },
    title: { tr: "Yutulma", en: "Swallowed" },
    text: {
      tr: "Mahito'nun sonu bir yenilgi değil bir SÖKÜLME: kendi tekniğiyle yaptığı şeyin aynısı ona yapılıyor ve Sukuna tarafından yutuluyor. Ruhun şekline dokunan varlık, sonunda başka bir ruhun içindeki bir parça oluyor.",
      en: "Mahito's end is not a defeat but an UNSTITCHING: the very thing he did with his own technique is done to him, and Sukuna swallows him. The being who touched the shape of souls ends as a piece inside another soul.",
    },
    mark: { kind: "term" as const, text: "無為転変", reading: { tr: "Idle Transfiguration", en: "Idle Transfiguration" } },
    imageKey: MHT_IMAGE_KEYS.fateEnd,
  },
];

/* ══ 7 · BAĞLAR + KAPANIŞ ═════════════════════════════════════════════════ */

/**
 * ⚠️ İLK BEŞİ `EXPERIENCE_COMPANIONS[133702]` İLE BİREBİR AYNI SIRADA:
 * [156991, 133704, 157116, 127212, 127691]. Listeye olmayan bir kimlik
 * yazmak kadrajı sonsuza kadar boş bırakır (Dalga 1'in dördüncü dersi).
 *
 * Son ikisinin arşivde numarası YOK — `characterId: null`, düz ad, bağlantı
 * kurulmuyor.
 */
export const MHT_BONDS = [
  {
    characterId: 156991,
    name: "Jōgo",
    nativeName: "漏瑚",
    role: { tr: "aynı masadaki lanet", en: "a curse at the same table" },
    line: {
      tr: "Ateş ve ısı. Lanetlerin insanlığa duyduğu öfkeyi en saf biçimde taşıyan üye — Mahito'nun oyuncu tavrının tam karşısında duran ciddiyet.",
      en: "Fire and heat. Of all the curses he carries their anger at humanity in its purest form — the seriousness that stands directly opposite Mahito's playfulness.",
    },
  },
  {
    characterId: 133704,
    name: "Kento Nanami",
    nativeName: "七海建人",
    role: { tr: "kestiği adam", en: "the man he cut down" },
    line: {
      tr: "Shibuya'da saat 21:00. Nanami'nin son cümlesi Yūji'ye bırakılmış bir görev; Mahito onu bir düşman olarak değil, bir işin sonu olarak kayda geçiriyor.",
      en: "Shibuya, 21:00. Nanami's last sentence is a task left to Yuji; Mahito enters him into the record not as an enemy but as the end of a job.",
    },
  },
  {
    characterId: 157116,
    name: "Chōsō",
    nativeName: "脹相",
    role: { tr: "kardeşlerini kullandığı", en: "whose brothers he used" },
    line: {
      tr: "Ölü Rahim Ölüm Sancakları. Mahito onları bir araç gibi kullandı; Chōsō için onlar kardeşti. Bu sayfadaki en somut bedel bu ikisinin arasında duruyor.",
      en: "The Death Painting Wombs. Mahito used them as instruments; to Choso they were brothers. The most concrete debt on this page sits between these two.",
    },
  },
  {
    characterId: 127212,
    name: "Yūji Itadori",
    nativeName: "虎杖悠仁",
    role: { tr: "baş düşmanı", en: "his nemesis" },
    line: {
      tr: "Arşivde KAP (器) olarak kayıtlı ve ölçüt kavgası Mahito. Aralarındaki mesele güç değil tanım: biri doğru ölümü savunuyor, diğeri ölümü biçimlerden biri sayıyor.",
      en: "Filed as THE VESSEL (器) in the archive, with Mahito as his defining fight. What lies between them is definition, not power: one defends a proper death, the other counts death as one of the shapes.",
    },
  },
  {
    characterId: 127691,
    name: "Satoru Gojō",
    nativeName: "五条悟",
    role: { tr: "mühürlenmesi planın merkeziydi", en: "whose sealing was the centre of the plan" },
    line: {
      tr: "Shibuya bir savaş değildi; tek bir mühürleme işleminin etrafına kurulmuş bir tuzaktı. Mahito o tuzağın bir parçası — ve o gece hareket alanını asıl açan şey bu mühür.",
      en: "Shibuya was never a war; it was a trap built around a single sealing. Mahito is a part of that trap — and what actually opened his room to move that night was this seal.",
    },
  },
  {
    characterId: null,
    name: "Hanami",
    nativeName: "花御",
    role: { tr: "aynı masadaki lanet", en: "a curse at the same table" },
    line: {
      tr: "Ormanların laneti; yıkımı öfkeden değil doğayı korumak istemesinden ötürü seçti. Arşivde kendi sayfası yok, bu yüzden burada yalnızca adı yazılı.",
      en: "The curse of the forests; it chose destruction not out of anger but to protect nature. It has no page of its own in the archive, so only its name is written here.",
    },
  },
  {
    characterId: null,
    name: "Dagon",
    nativeName: "陀艮",
    role: { tr: "aynı masadaki lanet", en: "a curse at the same table" },
    line: {
      tr: "Denizin korkusundan doğdu; olgunlaşması Shibuya'da kendi alanının içinde tamamlandı. Onun da arşivde kendi sayfası yok.",
      en: "Born from the fear of the sea; his maturation completed inside his own domain, in Shibuya. He has no page of his own in the archive either.",
    },
  },
] as const;

export const MHT_BOND_UI = {
  portraitAlt: {
    tr: "arşivdeki portre kaydı",
    en: "the portrait record held in the archive",
  },
  hasPage: { tr: "sayfası var", en: "has a page" },
  noPage: { tr: "sayfası yok", en: "no page" },
} as const;

/** Jujutsu Kaisen evren sayfasındaki gerçek çapalar (`lib/anime/jjk/anchors.ts`). */
export const MHT_WORLD_LINKS = [
  {
    anchor: "spirits",
    label: { tr: "Lanet arşivi · 呪霊", en: "The curse archive · 呪霊" },
    note: {
      tr: "On mühürlü dosyanın ilki Mahito'nun kendi kaydı",
      en: "The first of the ten sealed files is Mahito's own entry",
    },
  },
  {
    anchor: "domain",
    label: { tr: "Alan genişletme · 領域", en: "Domain expansion · 領域" },
    note: {
      tr: "自閉円頓裹 orada, diğer alanların yanında",
      en: "自閉円頓裹 sits there, beside the other domains",
    },
  },
  {
    anchor: "shibuya",
    label: { tr: "Shibuya Olayı · 渋谷", en: "The Shibuya Incident · 渋谷" },
    note: {
      tr: "Saat saat: 21:00 ve 22:30 bu sayfanın üçüncü ve dördüncü durağı",
      en: "Hour by hour: 21:00 and 22:30 are this page's third and fourth stops",
    },
  },
] as const;

/**
 * Kapanış.
 *
 * ⚠️ İki satır ALINTI DEĞİL: arşivin kendi cümleleri ve rozetleri bunu
 * söylüyor (dosya başındaki replik disiplini bloğu). Motto ise doğrulanmış
 * bir TERİM: 無為転変.
 */
export const MHT_CLOSING = {
  lineBadge: { tr: "arşivin cümlesi — alıntı değil", en: "the archive's sentence — not a quote" },
  lines: [
    {
      key: "material",
      text: {
        tr: "Sana yaptığım şeyin adı yaralamak değil; senin ne olduğuna dair fikrimi bedenine yazmak.",
        en: "What I do to you is not called wounding; it is writing my opinion of what you are onto your body.",
      },
      note: {
        tr: "Mahito'nun insanı bir malzeme olarak görmesinin arşivdeki karşılığı bu cümleye sıkıştırıldı.",
        en: "The archive compressed the fact that Mahito treats humans as material into this one sentence.",
      },
    },
    {
      key: "mirror",
      text: {
        tr: "Beni öldürebilirsin, ama beni yaratan şeyi öldüremezsin: o sizde duruyor.",
        en: "You can kill me, but you cannot kill what made me: that part stays with you.",
      },
      note: {
        tr: "Lanetli ruhların insan duygularından doğduğu kuralının bu sayfadaki sonucudur; bir replik değil bir çıkarım.",
        en: "This is what the rule that cursed spirits are born from human feelings amounts to on this page; an inference, not a line of dialogue.",
      },
    },
  ],
  discipline: {
    tr: "Bu sayfada tırnak içinde diyalog yok. Mahito'nun ünlü cümlelerinin birebir Japonca metnini doğrulayacak bir kaynak arşivde bulunmadığı için hiçbiri alıntılanmadı; yukarıdaki iki satır arşivin kendi cümleleri, aşağıdaki kanji ise doğrulanmış bir terim.",
    en: "There is no quoted dialogue on this page. Because the archive holds no source that verifies the exact Japanese of Mahito's famous lines, none of them are quoted; the two sentences above are the archive's own, and the kanji below is a verified term.",
  },
  motto: "無為転変",
  mottoReading: {
    tr: "Mui Tenpen — Idle Transfiguration. Ruhun şekline dokunmak.",
    en: "Mui Tenpen — Idle Transfiguration. To touch the shape of a soul.",
  },
  credit: {
    tr: "Künye ve portre: AniList karakter kaydı #133702 (31 Ağustos 2026 çekimi, kopyası depoda). Evren verisi arşivin kendi Jujutsu Kaisen defterinden: lanet arşivi, alan genişletme kayıtları, lanet enerjisi sözlüğü, Shibuya saat çizelgesi ve arketip defteri.",
    en: "Record and portrait: AniList character entry #133702 (captured 31 August 2026, the copy kept in this repository). Universe data from the archive's own Jujutsu Kaisen ledger: the curse archive, the domain records, the cursed-energy glossary, the Shibuya hour chart and the ledger of archetypes.",
  },
  creditLink: { tr: "AniList #133702", en: "AniList #133702" },
  creditNote: {
    tr: "Sahne, teknik ve form görselleri üretilmedi: yirmi kadrajın hepsi küratör yuvası olarak duruyor ve her yuvanın altında kendi yükleme kutusu var. Filigran, dikiş deseni ve yama motifleri elle çizilmiş SVG.",
    en: "No scene, technique or form imagery was generated: all twenty frames stand as curator slots, each with its own upload box directly beneath it. The watermark, the seam pattern and the patch motifs are hand-drawn SVG.",
  },
} as const;
