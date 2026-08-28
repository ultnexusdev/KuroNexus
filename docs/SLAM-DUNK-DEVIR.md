# SLAM DUNK EVRENİ — DEVİR NOTU

> Tarih: 28 Ağustos 2026 · Kapsam: `/anime/slam-dunk` (+ `/en/anime/slam-dunk`)
> **Yeni oturumda İLK İŞ: bu bloğu oku.** Konvansiyonlar ve tuzaklar burada;
> yeniden keşfetmeye gerek yok.

---

## ⌂ DURUM

**Sayfa inşa edildi ve çalışıyor.** Beş çeyrek, 45 kadro kaydı, 5 takım,
54 küratör yuvası, iki dil. `npm run check:slam-dunk` yeşil.

**AÇIK İŞ — commit edilmedi.** Nedeni aşağıda ("İki oturum çakışması").

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

## ⚠️ İKİ OTURUM ÇAKIŞMASI (28 Ağustos 2026)

Bu iş yapılırken **paralel bir oturum Bleach'in Espada bölümünü
düzenliyordu** ve çalışma ağacında üç tip hatası bıraktı:

```
components/anime/bleach/EspadaSection.tsx(50,9)  '"2:3"' geçerli oran değil
lib/anime/bleach/slots.ts(563,14)                '"2:3"' geçerli oran değil
lib/anime/bleach/slots.ts(565,5)                 '"normal"' geçerli işlem biçimi değil
```

**Bu hatalar Slam Dunk işinden gelmiyor** — `"2:3"` hiçbir zaman izinli
oranlar listesinde yoktu, `"normal"` de bir işlem biçimi değil (o bir
KARIŞIM kipi). Kasıtlı olarak düzeltilmedi: yarım kalmış başka bir
oturumun kararını tahmin etmek yanlış olurdu.

**Sonucu:** `next build` bu üç satır yüzünden koşmuyor, yani

- üretim derlemesi ve performans bütçesi ÖLÇÜLEMEDİ,
- `lib/anime/bleach/slots.ts` iki oturumun değişikliğini birden taşıdığı
  için dosya tek başına commit edilemiyor.

**Yapılacak:** Espada turu bitince `"2:3"` `lib/curated/contract.ts`teki
`SLOT_RATIOS`a eklenmeli (600×900 portre yuvası için doğru oran) ve
`treatment: "normal"` muhtemelen `"photo"` olmalı. Sonra `npx tsc --noEmit`
temizlenir ve commit atılabilir.

---

## Doğrulananlar (28 Ağustos 2026, dev sunucusu 3000)

| | |
|---|---|
| SSR | `/anime/slam-dunk` ve `/en/anime/slam-dunk` 200; 50 kart, 59 çizilen yuva, tek `h1` |
| i18n | EN sayfasında Türkçe sızıntı YOK, beklenen 13 İngilizce dize yerinde |
| Yapışkan skorbord | kaydırınca `top: 68px`te duruyor (site başlığı 69px ölçüldü) |
| Hidrasyon | rakip seçici sekmeleri tıklamayla geçiyor, `aria-selected` doğru dönüyor |
| Hub kartı | `/anime` sayfasında Slam Dunk kapısı ve 湘北 rozeti çiziliyor |
| Sitemap | `/anime/slam-dunk` üç dil girdisiyle listede |
| Bleach regresyonu | `npm run check:bleach` — font/kontrast/çapa/hareket/i18n BEŞİ de yeşil |
| Sayfa ağırlığı | dev HTML 1,06 MB ham / **125 KB gzip** (Bleach aynı koşulda 188 KB) |

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

6. **Gerçek imleç GİZLENMEDİ.** Brief "custom cursor" diyor ama
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

Beş denetim: **veri** (kadro bütünlüğü, takım referansları, stat aralığı,
ilk beş mevkileri), **iki dil** (her `Localized` alanının İngilizcesi +
sözlük iskeleti), **çapa** (skorbordun her bağlantısının karşılığı var mı),
**hex** (palet dışına kaçmış renk), **hareket** (azaltılmış hareket kapısı).

⚠️ Bleach'in denetimlerinden farklı olarak veriyi METİN değil DEĞER olarak
görüyor — bir statın 100'ü aşması ya da bir kaptanın kadroda olmaması
derleme öncesi yakalanıyor.
