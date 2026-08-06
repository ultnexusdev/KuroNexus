# 2 Saatlik Otonom Oturum — 6 Ağustos 2026

> Bu dosya oturum boyunca **canlı** tutulur. En üstteki "Kapanış Özeti" bölümü
> oturumun sonunda doldurulur; altındaki günlük ilerledikçe yazılır.

**Branch:** `feature/2-saat-oturumu` (main'e dokunulmadı)
**Push:** yapılmadı ve yapılmayacak — yalnızca yerel commit.

---

## Kapanış Özeti

_(oturum sonunda doldurulacak)_

---

## Kapsam ve öncelik

Görev talimatındaki sıra korundu:

1. Anime bölümü altında **Karakterler** alt sayfası (liste → detay), bileşenler
   ileride film/dizi/kitap için de kullanılabilecek biçimde **generic**
2. Film/dizi/kitap kanatlarındaki UI/UX tutarsızlıkları
3. Düşük riskli a11y + performans iyileştirmeleri
4. Küçük "sürpriz" özellikler

---

## 🔑 KARAR 1 — Karakter verisi nereden gelecek?

**Seçilen: AniList (mevcut `AnilistService` + `ExternalCache`), yeni Prisma
modeli YOK.**

Değerlendirilen üç yol:

| | Yol | Neden seçilmedi / seçildi |
|---|---|---|
| A | Yeni `Character` Prisma modeli + admin CRUD | ❌ Migration gerekiyor. Bu makinede lokal DB yok (bkz. güvenlik günlüğü), yani migration ilk kez **üretim veritabanında** çalışırdı. Görev kuralı 4 "prod veriye dokunma" diyor. Ayrıca sayfa, elle veri girilene kadar **boş** açılırdı. |
| B | Mevcut `CharacterAnalysis` modeli | ❌ Şu an tamamen **ölü model** — `backend/src` altında tek bir controller/service/DTO referansı yok, veri de yok. AGENTS.md kural 13'e göre bu model "kişisel derinlemesine analiz metni", ansiklopedik künye değil. Yanlış kutu. |
| C | **AniList `Character` API'si, `ExternalCache` üzerinden** | ✅ Şema değişikliği yok → **sıfır prod riski**. Arşivdeki her seri için veri **anında dolu** gelir. AGENTS.md kural 4'ün tam olarak tarif ettiği desen (dış veri cache'lenir, kendi içeriğinden ayrı durur). `AnilistService.getCharacters()` zaten var, sadece karakter `id`'si eksikti. |

**İleriye not (uygulanmadı, bilinçli):** Referans sayfadaki "Güç Profili",
"İkonik Replikler", "Önemli Savaşlar" gibi bölümler **yazılı içerik**, AniList
vermiyor. Bunlar için ileride additive bir `CharacterProfile` modeli (AniList
id → yazılı overlay) gerekir. Bileşenler bugünden **o veri yokken bölümü hiç
çizmeyecek** biçimde yazıldı; model geldiğinde tek prop eklemesiyle açılır.

## 🔑 KARAR 2 — Bileşenler nerede duracak?

`frontend/components/character/` — `anime/` altında **değil**. Talimat
"component'i generic tut, sadece anime'ye özel sabitleme yapma" diyor.
Bileşenler `CharacterSummary` / `CharacterProfile` arayüzlerini alır; bu
arayüzlerde `anilistId` gibi kaynağa özel alan yok, `id: string` +
`sourceLabel` var. Film/dizi tarafı TMDB `credits` ile aynı arayüzü doldurabilir.

## 🔑 KARAR 3 — Rota adı

`/{locale}/dark-stories/category/anime/karakterler` — mevcut `arsiv` deseniyle
aynı (statik segment, `[slug]` dinamik segmentinden önce eşleşir, çakışma yok).
Türkçe segment tercihi mevcut rotalardan (`arsiv`, `yazarlar`, `seriler`,
`okuma-sirasi`) geliyor.

---

## TODO

### Faz 1 — Karakterler (öncelik 1)
- [ ] `AnilistService.getCharacters()` → karakter `id`'si eklensin (cache anahtarı sürümlensin)
- [ ] `AnilistService.getCharacter(id)` → detay sorgusu (künye + göründüğü yapımlar + seslendirenler)
- [ ] `AnimeService` → arşivdeki serilerden karakter dizini
- [ ] `AnimeController` → `/anime/characters` + `/anime/characters/:id` (`:slug`'dan ÖNCE)
- [ ] Frontend tipleri + `lib/api/characters.ts`
- [ ] `components/character/` — kart, ızgara/hall, dosya (detay)
- [ ] Rotalar: liste + detay, `generateMetadata`
- [ ] i18n: `tr.json` + `en.json` `character` ad alanı
- [ ] `sitemap.ts` kaydı

### Faz 2 — UI/UX tutarsızlıkları (öncelik 2)
- [ ] Denetim bulgularından düşük riskli olanlar

### Faz 3 — a11y + performans (öncelik 3)
- [ ] Denetim bulgularından düşük riskli olanlar

### Faz 4 — Sürpriz özellikler (öncelik 4)
- [ ] Karar verilecek (arşivden rastgele karakter/eser önerisi güçlü aday)

---

## İlerleme günlüğü

### T+00:15 — Keşif tamamlandı, plan yazıldı
- Repo pull edildi (17 commit, fast-forward), `feature/2-saat-oturumu` açıldı.
- Tasarım dili okundu: `frontend/styles/globals.css` tek renk kaynağı
  (AGENTS.md kural 16 — bileşende hex yasak), `[data-category="anime"]`
  derisi mürekkep moru accent taşıyor.
- `AnilistService` incelendi: `getCharacters()` zaten var ama **karakter id'si
  dönmüyor** — detay sayfasına link kurulamıyor. Genişletilecek.
- `CharacterAnalysis` modelinin ölü olduğu doğrulandı.
