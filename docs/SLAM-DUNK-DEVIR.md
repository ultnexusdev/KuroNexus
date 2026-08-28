# SLAM DUNK EVRENİ — DEVİR NOTU

> Tarih: 28 Ağustos 2026 · Kapsam: `/anime/slam-dunk` (+ `/en/anime/slam-dunk`)
> **Yeni oturumda İLK İŞ: bu bloğu oku.** Konvansiyonlar ve tuzaklar burada;
> yeniden keşfetmeye gerek yok.

---

## ⌂ DURUM

**CANLIDA — `6f096e0` → `73e2e1a` (28 Ağustos 2026).** Beş çeyrek, 45 kadro
kaydı, 5 takım, 54 küratör yuvası, iki dil. `npm run check:slam-dunk` yeşil.

`73e2e1a` küratörün bildirdiği beş arızayı kapattı: dokuz arka plan yuvasının
kalemi erişilebilir oldu, stat barları artık iki yerde de aynı, manifesto
sayacı ham anahtar basmıyordu. Aynı turda **Shohoku ilk beşi yukarı çekildi**
(takım ortalaması 76,2 → 80,0; Sannoh 77,1) — gerekçe `roster.ts` başlığında.

Üretim derlemesi temiz: rota **19,8 KB** kendi payı / **148 KB** ilk yük
(Bleach 30,8 / 157). Dört denetim takımı da yeşil: `slam-dunk`, `bleach`,
`karakter`, `gojo`.

**Açık iş yok.** Sırada küratörün 54 yuvayı doldurması var (aşağıda).

---

## Kullanıcının koyduğu şartlar (28 Ağustos 2026)

1. **Adres `/anime/slam-dunk`** — Bleach/Naruto ile aynı kanat.
2. **Bleach'in tasarım dili KULLANILMAYACAK.** Kendine özgü mimari ve UI:
   kuş bakışı saha teması, glow hover efektleri, özel stat barları.
   ⚠️ Bu şart yalnızca GÖRSEL dile bakıyor; küratör ALTYAPISI paylaşılıyor
   (aşağıya bak).
3. **Geniş kadro** — beş takımın tam kadrosu + koçlar.
4. **Skorbord menüsü site başlığının ALTINDA**, yapışkan bölüm menüsü
   olarak. Site başlığının yerine geçmiyor.
5. **Dört stat barı**: şut, savunma, ribaunt, hız — 100 üzerinden.
6. **Müzik küratör modundan yüklenecek**, ses düğmesinin yanında.

---

## Mimari

```
lib/anime/slam-dunk/
  types.ts       Localized, pick, TeamId, Position, Stats
  teams.ts       5 takım (renk YOK — palet CSS'te)
  roster.ts      45 kayıt · TEK doğruluk kaynağı
  slots.ts       54 küratör yuvası — kimlikler ROSTER'dan TÜRETİLİYOR
  audio.ts       `slam-dunk:anthem` yuvası + ses sabitleri
  anchors.ts     5 çapa — skorbord + JSON-LD + denetim aynı defteri okuyor
  scoreboard.ts  çeyrek başına GERÇEK maç skoru

components/anime/slam-dunk/   (11 bileşen + 11 CSS modülü)
  court.module.css   ⚠️ PALETİN TEK EVİ. Başka modülde hex = kaçak.
  CourtImage.tsx     Sayfadaki HER kadraj buradan geçer.
```

### Paylaşılan küratör altyapısı — 28 Ağustos 2026'da AYRILDI

`CuratedSlotEditor` iki evrenin ortak aracı oldu:

| Eski yer | Yeni yer |
|---|---|
| `components/anime/bleach/CuratedSlotEditor.tsx` | `components/curated/CuratedSlotEditor.tsx` |
| `components/anime/bleach/CuratedSlotMount.tsx` | `components/curated/CuratedSlotMount.tsx` |
| `lib/anime/bleach/slots.ts` içindeki `SLOT_RATIOS` / `SLOT_TREATMENTS` / `SLOT_BLENDS` | `lib/curated/contract.ts` |
| sözlükte `anime.bleach.curator` | sözlükte **`curator`** (üst düzey) |

⚠️ **`lib/anime/bleach/slots.ts` o üç listeyi artık RE-EXPORT ediyor.**
Yeni bir oran ya da işlem biçimi eklenecekse `lib/curated/contract.ts`e
yazılır — Bleach'in dosyasına yazmak bir şey yapmaz.

⚠️ Bleach'in 16 bölüm dosyasına DOKUNULMADI: re-export sayesinde hepsi
eskisi gibi `@/lib/anime/bleach/slots`tan import ediyor.

---

## ESPADA PORTRELERİ — dört kod hatası (aynı commit'te düzeltildi)

Bu iş yapılırken **paralel bir oturum Bleach'in Espada bölümüne portre
yuvası ekliyordu** (Gemini ile üretilmiş bir tasarım). Tasarıma
DOKUNULMADI; yalnızca dört kod hatası düzeltildi:

| Hata | Düzeltme |
|---|---|
| `ratios: ["2:3"]` — izinli oranlar listesinde yoktu, derlenmiyordu | `"2:3"` `lib/curated/contract.ts`e eklendi. Yatay karşılığı (`3:2`) zaten vardı, dikeyi eksikti; 600×900 tam olarak 2:3 |
| `treatment: "normal"` — böyle bir işlem biçimi yok | `"photo"`. `"normal"` bir KARIŞIM kipi (`SLOT_BLENDS`); tasarımın istediği "filtre uygulama" ve bunun adı `photo` |
| **Yuva kimliği dizinin İNDEKSİNDEN üretiliyordu** (`(name, rank) =>`) ama `espada.ts` rütbeleri **1–10** tutuyor | Elle yazılmış `ESPADA_NAMES` kopyası silindi, liste artık `ESPADA` kaydından türüyor |
| Portre bir `<button>`ın İÇİNDEydi ve küratör kalemi de bir `<button>` | `noEdit` + `penNode`: kalem kartın KARDEŞİ olarak çiziliyor |

⚠️ **Üçüncüsü sessiz bir veri kaybıydı.** Manifesto `bleach:espada:0…9`
üretiyor, bölüm `bleach:espada:1…10` çiziyordu: `slotDef()` Yammy'yi
bulamadığı için `CuratedImage` **sessizce `null` basıyordu** — on portrenin
dokuzu görünüyor, onuncusu hiç yok, hata da yok. `…:0` ise hiçbir yerde
çizilmeyen yetim bir yuvaydı. Tam olarak
`kurator-yuvasi-tanimli-ama-cizilmiyor` notundaki ikinci arıza biçimi.
Doğrulandı: üretim çıktısında artık 1–10 arası **on** yuva çiziliyor.

---

## Doğrulananlar (28 Ağustos 2026)

| | |
|---|---|
| SSR | `/anime/slam-dunk` ve `/en/anime/slam-dunk` 200; 50 kart, 59 çizilen yuva, tek `h1` |
| i18n | EN sayfasında Türkçe sızıntı YOK, beklenen 13 İngilizce dize yerinde |
| Yapışkan skorbord | kaydırınca `top: 68px`te duruyor (site başlığı 69px ölçüldü) |
| Hidrasyon | rakip seçici sekmeleri tıklamayla geçiyor, `aria-selected` doğru dönüyor |
| Hub kartı | `/anime` sayfasında Slam Dunk kapısı ve 湘北 rozeti çiziliyor |
| Sitemap | `/anime/slam-dunk` üç dil girdisiyle listede |
| Bleach regresyonu | `npm run check:bleach` — ALTI denetim de yeşil; bütçe üretim derlemesinde JS **153,7 KB / 220 KB**, CSS 32,3 / 40 |
| Espada | üretim çıktısında 1–10 arası **on** yuva çiziliyor, iç içe `<button>` yok |
| Rota yükü | `/anime/slam-dunk` **19,8 KB** kendi payı / **148 KB** ilk yük (Bleach 30,8 / 157) |

### ⚠️ ÖLÇÜLEMEYENLER — canlıda doğrulanacak

**Tarayıcı paneli GİZLİ olduğunda hiç boyama yapmıyor**, dolayısıyla
`requestAnimationFrame` ve **`IntersectionObserver` HİÇ ateşlenmiyor**.
Ölçüldü: yeni kurulan bir `IntersectionObserver` ilk geri çağrısını bile
vermedi (doğru kurulmuş her IO en az bir kez ateşlenir). Yani şunlar
lokalde sınanamadı ve **kod hatası olduğu anlamına gelmez**:

- skorbordun kaydırma takibi (çeyrek + skor değişimi)
- top imlecinin izi
- saha çizgilerinin imleç altında yanması
- sahil bandının paralaksı
- stat barlarının dolum animasyonu

Aynı ders `browser-pane-frozen-raf` notunda zaten yazılıydı.

---

## Tuzaklar

1. **Node denetim betiği TypeScript'i doğrudan import ediyor.**
   `scripts/check-slam-dunk.mjs` veri modüllerini `await import(...ts)` ile
   okuyor (Node 24 tipleri kendiliğinden soyuyor). İki çözümleyici kancası
   şart: uzantısız `./roster` ve `@/lib/...` takma adı — ikisi de betiğin
   başında `registerHooks` ile karşılanıyor.

2. **Fandom kendi içinde çelişiyor.** İki kayıt elle çözüldü ve gerekçesi
   `roster.ts` içinde yazılı: Kiyota (künye SG, takım metni forvet → **SF**)
   ve Nagano (künye PF, takım tablosu Forward → **SF**; Takano zaten PF).
   Denetim betiği "ilk beşte mevki tekrarı" olarak ikisini de yakaladı.

3. **Kanji adların yarısı fandom'da YOK.** ja.wikipedia
   `SLAM DUNKの登場人物` sayfası hepsini veriyor (`{{読み仮名|漢字|かな}}`
   kalıbı). ⚠️ Bir çelişki: Nagano fandom'da 永野 充, ja.wikipedia'da
   永野 満 — ikincisi esas alındı.

4. **`JSON.stringify(...).replace(/</g, "<")` ETKİSİZ.** Kaynakta
   `"<"` derleme anında `<` karakterine çözülür. Doğrusu `"\\u003c"`.
   Slam Dunk'ın JSON-LD'si doğru yazıldı; Bleach'inki hâlâ etkisiz (ayrı
   göreve alındı, dizeler sözlükten geldiği için bugün zararsız).

5. **Müzik `CuratedImage` tablosunda duruyor.** Yeni tablo ve migration
   açılmadı: satırın şekli (`surface` + `slotId` + `url`) yetiyor ve
   yükleme ucu ses biçimlerini ZATEN kabul ediyor (`uploads.service.ts`
   beyaz listesi: `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp3`).
   ⚠️ Ses yuvası GÖRSEL manifestosunda değil (`audio.ts`) — orada olsaydı
   küratör panelinde "eksik görsel" olarak listelenirdi.

6. **⚠️ DEKORATİF SARMALAYICI KÜRATÖR KALEMİNİ YUTUYOR.** Arka plan
   kadrajları `pointer-events: none` + `z-index: -1` taşıyan katmanların
   içinde duruyor; kalem oraya konarsa tıklama **sessizce hiçbir yere
   gitmiyor** — ne hata, ne imleç değişimi. Beş bölümde birden yaşandı
   (28 Ağustos 2026). Kural: kadraj `noEdit`, kalem sarmalayıcının
   DIŞINDA (`<CourtSlotPen backdrop />`). `check:slam-dunk` artık
   ikisinin eşleştiğini denetliyor.

   Aynı tuzağın ikinci yüzü: `CuratedSlotEditor` → `.pencil` mutlak
   konumlu (`top:-10px; right:-10px`). Kabı `position: relative` değilse
   **bütün kalemler sayfanın sağ üst köşesine yığılıyor.** Manifesto
   satırlarında tam olarak bu oldu.

7. **`animation-timeline: view()` aralığı DEĞERİ değil KONUMU çiziyor.**
   Stat barları `entry 12% cover 34%` ile doldurulunca aynı karakterin
   barı hero'da ve ızgarada FARKLI uzunlukta görünüyordu — çünkü dolum
   ekrandaki konuma bağlıydı. Doğrusu `entry 25% entry 100%`: öğe tam
   görünür olduğunda animasyon bitmiş oluyor ve `both` son kareyi
   tutuyor. Kaydırmaya bağlı bir animasyon bir DEĞERİ gösteriyorsa
   aralığı `entry` içinde kapanmalı.

8. **Gerçek imleç GİZLENMEDİ.** Brief "custom cursor" diyor ama
   `cursor: none` erişilebilirlik kaybı: imleç boyutunu büyütmüş kişi
   işaretçisini kaybeder ve JS gelmezse hiç imleç kalmaz. Top imlecin
   ARDINDA hareket ediyor.

---

## Küratörün sırada ne yapacağı

54 yuvanın tamamı boş. Sayfanın en altındaki manifesto paneli (yalnızca
yönetici + küratör anahtarı açık) hepsini bölüm bölüm listeliyor: önerilen
boyut, oran ve "ne bulmam gerek" notu her satırda yazılı.

Öncelik sırası:
1. `slam-dunk:hero` — açılış kadrajı, ilk kıvrımın tamamı
2. `slam-dunk:player:sakuragi` … `:mitsui` — sahnedeki beş kart
3. `slam-dunk:team:*` — beş takım bandı
4. `slam-dunk:anthem` — sayfa müziği (skorbordun sağ ucundaki düğme)
5. Kalan 40 portre

⚠️ Bir kare yüklendiği hâlde görünmüyorsa **önce canlı ucu sorgula**:
`https://api.kuronexus.com/curated-images?surface=anime%2Fslam-dunk`

---

## Denetim

```bash
npm run check:slam-dunk
```

Altı denetim: **veri** (kadro bütünlüğü, takım referansları, stat aralığı,
ilk beş mevkileri), **iki dil** (her `Localized` alanının İngilizcesi +
sözlük iskeleti), **çapa** (skorbordun her bağlantısının karşılığı var mı),
**kalem** (`noEdit` ile çizilen her yuvanın erişilebilir bir kalemi var mı),
**hex** (palet dışına kaçmış renk), **hareket** (azaltılmış hareket kapısı).

⚠️ Bleach'in denetimlerinden farklı olarak veriyi METİN değil DEĞER olarak
görüyor — bir statın 100'ü aşması ya da bir kaptanın kadroda olmaması
derleme öncesi yakalanıyor.
