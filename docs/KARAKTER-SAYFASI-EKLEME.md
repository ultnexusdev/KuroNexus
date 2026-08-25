# Karakter Deneyim Sayfası Ekleme — Çalışma Kılavuzu

> **Yeni bir oturuma bu dosyayla başla.** Amacı, 36 sayfalık sistemi baştan
> keşfetmeden bir sonrakini ekleyebilmen. Ne olduğunu değil, **nasıl
> yapılacağını** anlatır.
>
> Geçmişin anlatısı ayrı iki dosyada:
> `docs/DEVIR-2026-08-23-karakter-deneyim-sayfalari.md` (ilk 13) ve
> `docs/DEVIR-2026-08-24-karakter-sayfalari-2.md` (sonraki 22 + dizin sergisi).

---

## 0. Otuz saniyede sistem

Bir karakterin **kendi sayfası** dört yerde birden var olur:

| # | Dosya | Ne yapar |
|---|---|---|
| 1 | `frontend/lib/characters/experiences.ts` | `EXPERIENCE_IDS`'e numara, `EXPERIENCE_COMPANIONS`'a yoldaş listesi |
| 2 | `frontend/lib/characters/roster.ts` | `EXPERIENCE_ROSTER`'a ad + ana dildeki ad + seri |
| 3 | `frontend/app/[locale]/dark-stories/category/anime/karakterler/<id>/page.tsx` | Kendi **statik** rota klasörü |
| 4 | `frontend/components/character/<slug>/` | Bileşen seti + CSS modülü (palet dâhil) |

Dördünden biri eksikse hata **sessiz** olur. `npm run check:karakter` tam
olarak bunu yakalar — her turda koş.

### Neden statik rota klasörü

App Router bir rotanın stil dosyalarını **modül grafiğinden** topluyor. 14
sayfa tek bir `[characterId]` rotasında toplandığında her karakter sayfası
19 stil dosyası indiriyordu (718 KB) — üstelik elle tasarlanmış sayfası
**olmayan** 180+ karakterin künye sayfası da aynı yükü taşıyordu. `import()`
ile dinamik yükleme çözmedi. Çözüm Next'in kendi kuralı: **statik parça
dinamik parçadan önce eşleşir.** Adresler değişmedi, sayı 7'ye indi.
Ayrıntı ve ölçüm: `lib/characters/experience-page.tsx` dosya başı.

### Neden palet CSS modülünde

35 palet `globals.css`'te olsaydı ~14,5 KB gzip **her sayfada** inecekti.
Rotalar ayrıldığı için palet artık karakterin kendi modülünde, dosyanın en
başında, `.page[data-world="…"]` seçicisiyle duruyor.

⚠️ `:global([data-world=…])` **çalışmaz** — CSS Modules'ün "pure selector"
kuralı çıplak öznitelik seçicisini derlemede reddediyor. Yerel bir sınıf şart;
kök öğe zaten `className={styles.page}` + `data-world` ikilisini taşıyor.

⚠️ Itachi'nin paleti `globals.css`'te KALDI (dosyalarına dokunulmama şartı).
Tek istisna odur.

---

## 1. Adım adım: bir karakter ekleme

### 1.1 AniList numarasını çöz

```bash
# nerede: herhangi bir terminal (ağ erişimi olan)
curl -s -X POST https://graphql.anilist.co \
  -H "Content-Type: application/json" \
  -d '{"query":"query($s:String){Page(perPage:12){characters(search:$s){id name{full native} media(perPage:6,sort:POPULARITY_DESC){nodes{title{romaji}}}}}}","variables":{"s":"KARAKTER ADI"}}'
```

**Ad tek başına GÜVENİLMEZ.** Dönen adayları karakterin medya listesinden
süz (Naruto/Bleach/JJK…). Emsal: "Kurama" araması YuYu Hakusho'ya çarpıyor.

**AniList adı sayfanın adı olmayabilir.** İki kayıt böyle:

| Sayfa | Numara | AniList'teki ad |
|---|---|---|
| Obito Uchiha | 3149 | **Tobi** |
| Nagato | 3180 | **Pain** |

Böyle bir durumda `roster.ts`'e **doğru adı** yaz — `experienceMetadata`
başlığı oradan alıyor, yoksa sekme adı ve paylaşım kartı AniList'in adını
gösterir (bu hata bir kez yapıldı ve düzeltildi).

### 1.2 Künyeyi çek

Kendi backend'imiz AniList'i 30 gün önbellekliyor ve kaynak düşse bile
bayat önbelleği sunuyor:

```bash
# nerede: herhangi bir terminal
curl -s "https://api.kuronexus.com/anime/characters/<ID>"
```

Dönen alanlar: `name`, `nameNative`, `image`, `age`, `bloodType`,
`dateOfBirth`, `traits` (boy, rütbe, zanpakutō…), `description`,
`appearances` ve **`images`** (bizim yüklediğimiz portreler).

⚠️ `GET /anime/characters/cards?ids=` ucunun bayat-önbellek yedeği **YOK** ve
önbellek anahtarı istenen kimlik kümesinin tamamından türüyor — yeni bir küme
kaynak kapalıyken boş döner. Yoldaş portreleri bu yüzden o uçtan değil kendi
`CharacterImage` kaydımızdan okunuyor.

### 1.3 Paleti tasarla ve ÖLÇ

Palet, karakterin CSS modülünün **en başındaki** bloktur. Standart set +
yardımcı malzeme ailesi:

```css
.page[data-world="<slug>"] {
  --bg: …;  --surface: …;  --surface-hover: …;
  --border: …;  --border-strong: …;
  --text-primary: …;  --text-secondary: …;  --text-muted: …;
  --accent: …;  --accent-hover: …;  --accent-muted: …;
  --gold: …;  --warn: #a6784a;  --danger: #a6584a;

  /* Yardımcı malzeme — yalnızca bu ağaç okur */
  --<önek>-…: …;
}
```

Eşikler (`npm run check:karakter` ölçüyor):

| Token | Eşik | Neye karşı |
|---|---|---|
| `--text-primary` | **7:1** (AAA) | `bg`, `surface` |
| `--text-secondary`, `--text-muted` | **4.5:1** | `bg`, `surface`, `surface-hover` |
| `--accent` | **3:1** | `bg`, `surface` |
| `--accent-hover`, `--gold` | **4.5:1** | `surface` |
| `--<önek>-…-text` | **4.5:1** | `surface`, `surface-hover` |

**ADLANDIRMA SÖZLEŞMESİ — önemli.** Yardımcı ailenin geri kalanı ölçülmüyor,
çünkü onlar metin değil **malzeme** (gölge gövdesi, kara alev, mürekkep
dolgusu — hepsi koyu olmak zorunda). Bir yardımcı rengi **küçük metinde**
kullanacaksan `-text` ekli bir kardeşini tanımla ve metin onu okusun.
Emsal: `--ita-crimson-text`, `--sas-sharingan-text`, `--nrt-kurama-text`.

**Önek** üç harf ve benzersiz olmalı (aşağıdaki tabloya bak).

**Accent yeni olmalı.** Denetim, iki accent arasındaki RGB uzaklığı 15'in
altındaysa hata veriyor, 15–20 arasındaysa uyarı basıyor.

### 1.4 İskeleti kur

Dört dosyayı da elle yazabilirsin; sıra şu:

1. `components/character/<slug>/<Comp>.module.css` — yalnızca palet bloğu
2. `components/character/<slug>/<Comp>.tsx` — geçici iskelet (aşağıda)
3. `app/…/karakterler/<id>/page.tsx` — rota (aşağıda)
4. `experiences.ts` + `roster.ts` kayıtları

**Rota şablonu** (mevcut bir tanesini kopyala, ör. `karakterler/2007/page.tsx`):

```tsx
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return experienceMetadata(locale, <ID>);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(<ID>);
  return <Comp detail={detail} isAdmin={isAdmin} companions={companions} />;
}
```

**Bileşen sözleşmesi** (bozulamaz):

- Adlandırılmış export, dosya adıyla aynı. Default export yok.
- Giriş bileşeni **sunucu bileşeni** (`"use client"` yok).
- Kök öğe `className={styles.page}` **+** `data-world="<slug>"` taşır.
- Kök `<main>` **olmaz** — kök layout zaten `<main id="icerik">` çiziyor.

```tsx
import type { CharacterExperienceProps } from "@/lib/characters/experiences";
export function Comp({ detail, isAdmin, companions }: CharacterExperienceProps) { … }
```

`@/lib/characters/experiences` beş yardımcı veriyor — tekrar yazma:

```ts
primaryPortrait(detail)              // yüklenmiş PORTRAIT → AniList portresi → null
isUploadedPortrait(detail)           // next/image `unoptimized` kararı için
collectAbilityImages(detail.images)  // Map<"<önek>:anahtar", mutlak adres>
companionPortraits(companions)       // Map<characterId, mutlak adres>
isExperienceCharacter(id)            // o karakterin kendi sayfası var mı
```

### 1.5 Sayfayı yaz

Yedi durak; sırasını ve biçimini karaktere göre kur, ama hepsi bulunsun:

1. **Hero** — portre + evrene ait büyük tipografik/ikonik filigran (`aria-hidden`)
2. **Mod düğmesi** — karaktere özgü adlı, sayfanın tamamını çeviren tek durum
3. **Künye şeridi** — doğum, boy, kan grubu, yaş, rütbe, takım, sembolik obje
4. **Güç/teknik laboratuvarı** — 3 büyük + 4 küçük kart, gerçek terminolojiyle
5. **İnteraktif bölüm** — sayfanın kalbi; tıklanabilir ve klavyeyle gezilebilir
6. **Kader çizelgesi** — 5 adım, yaş etiketli, kilit anlarda orijinal replik
7. **Kapanış** — iki replik + orijinal dil motto + kaynak künyesi

Üstte breadcrumb: `animeHref.characters()` → `t("backToGallery")`.

**Zorunlu kurallar**

- Görünen **her** metin `LocalizedText` (`{ tr, en }`), bileşende
  `pick(text, locale)`. İstemci adalarına **düz dize** iner.
- CSS'te deri bloğu dışında **tek hex yok**. Ara ton →
  `color-mix(in srgb, …)`.
- Her bölüm `aria-labelledby`; sayfada **tek `<h1>`**; tıklanabilir her şey
  gerçek `<button>`/`<a>`; dokunma hedefi ≥ `var(--touch-min)`; görünür
  `:focus-visible`.
- Animasyonlar ya `@media (prefers-reduced-motion: no-preference)` kapısında
  ya da dosya sonunda bir `reduce` battaniyesiyle kapanır.
- **360 px'te yatay taşma olmaz.**
- `"use client"` yalnızca durum tutan küçük adalarda (en fazla 3).

**Görsel politikası**

- Kapak: `primaryPortrait(detail)`. AniList görseli `next/image`de
  `unoptimized={!isUploadedPortrait(detail)}` olmak **zorunda**.
- Sahne/dönem/teknik görselleri **üretilmez**: her biri için
  `<önek>:<anahtar>` bir `ABILITY` yuvası tanımla, `isAdmin` iken
  `CuratorSlot` çiz, görsel yokken bölüm **görselsiz ama ayakta** kalsın.
- **Dışarıdan raster indirme/hotlink YOK** (lisans doğrulanamıyor, CSP zaten
  engelliyor). Motif gerekiyorsa **elle SVG çiz**.
- Sayfanın altına kaynak künyesi: AniList künyesi +
  `https://anilist.co/character/<id>` bağlantısı, `LocalizedText`.

### 1.6 Denetle

```bash
# nerede: K:\KURONEXUS\frontend
npx tsc --noEmit
npx eslint .
npm run check:karakter
npx next build
```

`check:karakter` dört şeye bakıyor (`frontend/scripts/check-karakter-*.mjs`):

| Betik | Ne yakalar |
|---|---|
| `kayit` | Dört kayıttan biri eksik mi (rota/bileşen/`EXPERIENCE_IDS`/roster) |
| `sinif` | `styles.X` okunuyor ama CSS'te `.X` yok → sessiz `className={undefined}` |
| `hex` | Deri bloğu dışında hex / renkli `rgb()` / adlandırılmış renk ataması |
| `kontrast` | Palet eşikleri + accent'lerin birbirine çok yakın olması |

Yerelde görmek istersen (canlı API ile):

```bash
# nerede: K:\KURONEXUS\frontend — NEXT_PUBLIC_API_URL derleme anında gömülür
NEXT_PUBLIC_API_URL=https://api.kuronexus.com npx next build
NEXT_PUBLIC_API_URL=https://api.kuronexus.com npx next start -p 3100
```

---

## 2. Çok karakter aynı anda: paralel ajan düzeni

Bu makinede **tmux yok**. İzolasyon worktree + ayrı dalla kuruluyor.

```powershell
# nerede: K:\KURONEXUS (PowerShell)
git worktree add -b "<slug>-redesign" "K:\KURONEXUS-wt\<slug>-redesign" main
cmd /c mklink /J "K:\KURONEXUS-wt\<slug>-redesign\frontend\node_modules" "K:\KURONEXUS\frontend\node_modules"
```

- Worktree'leri **sen** kur, ajanlar kurmasın (eşzamanlı `worktree add` ana
  depoda `index.lock`ta yarışır).
- `node_modules` junction'ı olmadan ajan `tsc`/`eslint` koşamaz. pnpm'in iç
  symlink'leri göreli olduğu için junction sorunsuz çalışıyor.
- **Ajanlara `next build` yaptırma** — RAM yetmez. Onlar `tsc --noEmit` +
  `eslint <kendi dosyaları>`; tam derleme merkezde bir kez.
- İskeleti (rota + palet + kayıtlar) **birleştirmeden önce sen** yaz ki
  ajanlar paylaşılan hiçbir dosyaya dokunmasın. 33 dal bu sayede tek
  çakışma olmadan birleşti.

### Sökerken SIRA önemli

`git worktree remove --force` junction'ın **içine girip** gerçek
`node_modules`'ü silebilir:

```powershell
cmd /c rmdir "K:\KURONEXUS-wt\<slug>-redesign\frontend\node_modules"   # önce bağı sök
git worktree remove "K:\KURONEXUS-wt\<slug>-redesign" --force          # sonra worktree
```

---

## 3. Zaten kullanılmış mekanikler — TEKRARLAMA

Küratör modunun şartı: **şablon paylaşımı yasak.** Yeni sayfanın mekaniği
aşağıdakilerin hiçbiriyle yapısal olarak aynı olmamalı. "Aynı ray, başka
etiket" kabul değil.

| Sayfa | Mekanik |
|---|---|
| Itachi | karanlıkta fener + tıklanabilir Sharingan paneli |
| Naruto | dokuz kademeli "ısınan" ray |
| Sasuke | dikey yarık, sayfayı ikiye bölme |
| Ichigo | maske çatlağı + beş kademeli kimlik seçici |
| Kakashi | sekmeli kartoteks (doğa türleri) |
| Sakura | dolan mühür göstergesi |
| Urahara | 3×3 açılan çekmece ızgarası |
| Shikamaru | tahtada ilerleyen 5 hamlelik zincir |
| Aizen | iki gerçeklik katmanı + kırık ayna parçaları |
| Jiraiya | çevrilen el yazması sayfaları |
| Hinata | dairesel görüş halkası + kör nokta |
| Kenpachi | çentikli kılıç rayı |
| Rock Lee | sekiz kapılı dikey merdiven |
| Sukuna/Itadori | iki modlu kap + yirmi parmak sayacı |
| Sai | adım adım açılan mürekkep tomarı, çizilen SVG figürler |
| Yamato | yükselen gövde + beş büyüme kademesi |
| Iruka | kara tahta, tebeşirle yazılan beş ders |
| Konohamaru | dikey devir zinciri, son halka boş |
| Chōji | iki kefeli hap terazisi (güç ↔ bedel) |
| Ino | dairesel düğüm ağı, merkeze bağlanan çizgiler |
| Kiba | iki sütun → tek sütuna kilitlenen düzen |
| Shino | altıgen petek ızgarası, komşuya yayılan seçim |
| Neji | 2→64 ardışık vuruş sayacı + kafes mührü |
| Tenten | aşağı açılan parşömen, mühür kareleri |
| Gaara | yandan kesit, üst üste beş kum tabakası |
| Temari | yay hâlinde açılan yelpaze, üç yıldız |
| Kankurō | yukarıdan inen ipler, parçalarına ayrılan kuklalar |
| Tsunade | bahis masası, çevrilen kartlar |
| Orochimaru | üst üste binen, geriye açılan deri katmanları |
| Kabuto | çekilen kimlik kartları destesi, son kart boş |
| Obito | şeffaflaşan maske, dört isim katmanı |
| Madara | yükselen basamaklar — sayfanın **ölçeği** değişiyor |
| Nagato | üç soru + yoğunlaşan yağmur |
| Konan | origami katlama adımları |
| Minato | Hiraishin işaretleriyle **anlık** gezinme |
| Kushina | gerilen ve kopan chakra zinciri halkaları |

---

## 4. Kullanılmış palet ve önekler

Yeni palet bu tablodakilere yakın düşmemeli; önek benzersiz olmalı.
(Tablo koddan üretildi — güncelini almak için
`node scripts/check-karakter-kontrast.mjs` çıktısındaki uyarılara bak.)

| Dünya | Önek | `--bg` | `--accent` |
|---|---|---|---|
| `choji-akimichi` | `cho` | `#0b0805` | `#e2a13c` |
| `gaara` | `gaa` | `#0b0907` | `#cf6a3f` |
| `hinata-hyuuga` | `hnt` | `#07060c` | `#ab9ae2` |
| `ichigo-kurosaki` | `ich` | `#08080a` | `#e04a48` |
| `ino-yamanaka` | `ino` | `#0a060c` | `#cf5ba8` |
| `iruka-umino` | `iru` | `#0b0908` | `#c98a2e` |
| `itachi` | `ita` | `#060407` | `#c8202f` |
| `jiraiya` | `jir` | `#0a0806` | `#d1553c` |
| `kabuto-yakushi` | `kab` | `#07070c` | `#7f8fe0` |
| `kakashi-hatake` | `kks` | `#070a0c` | `#5aa9d0` |
| `kankuro` | `kan` | `#08060a` | `#7a4fc4` |
| `kenpachi-zaraki` | `knp` | `#090707` | `#cd3f36` |
| `kiba-inuzuka` | `kib` | `#0a0908` | `#c04358` |
| `kisuke-urahara` | `urh` | `#0b0906` | `#c9503a` |
| `konan` | `knn` | `#07080c` | `#adb8d4` |
| `konohamaru-sarutobi` | `knh` | `#06090c` | `#58bf5f` |
| `kushina-uzumaki` | `kus` | `#0a0607` | `#e0495f` |
| `madara-uchiha` | `mad` | `#08080b` | `#5f6bb8` |
| `minato-namikaze` | `min` | `#05070d` | `#f5c84f` |
| `nagato` | `nag` | `#070809` | `#8a7fc4` |
| `naruto-uzumaki` | `nrt` | `#06090f` | `#f2801f` |
| `neji-hyuga` | `nej` | `#06070a` | `#86c2b0` |
| `obito-uchiha` | `obi` | `#08060a` | `#9b5fd8` |
| `orochimaru` | `oro` | `#060806` | `#8fbf46` |
| `rock-lee` | `lee` | `#0a0806` | `#e88a37` |
| `sai` | `sai` | `#0a0a09` | `#ded6c4` |
| `sakura-haruno` | `skr` | `#0a070a` | `#4cbc88` |
| `sasuke-uchiha` | `sas` | `#07060b` | `#8a68e4` |
| `shikamaru-nara` | `shk` | `#08090a` | `#d0a04a` |
| `shino-aburame` | `shi` | `#070806` | `#bf9a35` |
| `sousuke-aizen` | `azn` | `#06070c` | `#9c86e2` |
| `sukuna-itadori` | `vsl` | `#0a0708` | `#e2645f` |
| `temari` | `tem` | `#06080a` | `#5fb0a8` |
| `tenten` | `ten` | `#090809` | `#d13f63` |
| `tsunade` | `tsu` | `#070a08` | `#3fae9a` |
| `yamato` | `yam` | `#060907` | `#4f9c6a` |

Sıkışmış aile: **turuncu/kehribar** (naruto, rocklee, iruka, choji,
shikamaru, shino, gaara) ve **kızıl** (itachi, ichigo, kenpachi, urahara,
jiraiya, kiba, tenten, kushina, vessel). Yeni sayfa bu ikisinden çıkabiliyorsa
çıksın; boş kalan aileler: **turkuaz/deniz mavisi**, **koyu zeytin**,
**bakır/bronz**, **soğuk gri-mavi**.

---

## 5. Dizin nasıl çalışıyor

`/dark-stories/category/anime/karakterler` ikiye ayrık:

- **Üstte** "Elle Tasarlanmış Dosyalar" rafı → `EXPERIENCE_ROSTER`'daki
  37 adres (`CuratedShelf`, sunucu bileşeni, dizine prop olarak geçiyor).
- **Altta** "Künye Dosyaları" ızgarası → **sayfası olmayan** karakterler.
  Elle tasarlanmışlar ızgaradan tamamen düşürülüyor; çift portre yok.

Yani **ızgarada gördüğün her karakterin sayfası yok** — sıradaki işi seçmek
için oraya bak. Kart üzerinde rozet ya da "başrol/yardımcı" etiketi YOK
(24 Ağustos'ta kaldırıldı; rol yalnızca künye sayfasındaki "Göründüğü
Yapımlar" satırlarında kaldı).

Sayaç şeridi: Karakter (raf + ızgara) · Elle tasarlanmış · Seri.

⚠️ `roster.ts`'e satır eklemeyi unutursan sayfa hem rafta görünmez hem
ızgaradan düşmez → karakter sayfada **iki kez** çıkar.
`npm run check:karakter` bunu yakalar.

---

## 6. Bilinen tuzaklar

| Tuzak | Belirti | Çözüm |
|---|---|---|
| CSS Modules "pure selector" | `Selector ":global([data-world=…])" is not pure` | `.page[data-world=…]` kullan |
| `styles.X` tanımsız | Bölüm sessizce stilsiz; tsc **ve** eslint temiz | `npm run check:karakter` |
| Ajan raporu gelmedi | "AJAN DONMEDI" | Worktree'yi **hem `git status --short` hem `git log`** ile tara — iş commit'lenmiş olabilir |
| Oturum limiti | Dalga yarıda kesilir | Dosyalar diskte kalır; topla, commit'le, devam et |
| PowerShell here-string + git | `fatal: / is outside repository` | Mesajı dosyaya yaz, `git commit -F <dosya>` |
| Workflow betiğinde backtick | `Script parse error` | Şablon dizesi içinde backtick kullanma |
| `Get-Content`/`Set-Content` | Türkçe karakterler bozulur | Düzenlemeyi `Edit` aracıyla yap |
| Tarayıcı paneli | 360×760 üstünde bozuk kare | Ölçümü iframe + `getComputedStyle` ile yap |
| `next build` env | Yerelde portreler CSP'ye takılır | `NEXT_PUBLIC_API_URL` **derleme anında** gömülür |

---

## 7. Bitirme

```powershell
# nerede: K:\KURONEXUS
git merge --no-ff --no-edit <slug>-redesign
# frontend'de: tsc + eslint + check:karakter + next build (hepsi temiz olmalı)
git push origin main       # tek push, Coolify iki servisi de tetikler
```

Deploy ~4–5 dakika, tek build. Sonra canlıda doğrula: adres 200 mü, doğru
`data-world` var mı, başlık doğru ad mı, dizinde raf ve sayaç güncellendi mi.

**Görsel yuvaları:** 605 `ABILITY` yuvası şu an boş. Sayfa görselsiz de tam
çalışıyor; küratör modundan yüklenen görsel anında görünür (`no-store`).
