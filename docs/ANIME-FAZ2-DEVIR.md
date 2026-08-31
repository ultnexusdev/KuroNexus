# Faz 2 Devir Notu — kalan 13 karakter

> **Yeni oturuma bu dosyayla başla.** Sırayla: bu dosya →
> `docs/KARAKTER-SAYFASI-EKLEME.md` → `docs/ANIME-FAZ2-SOZLESME.md`.
> Son güncelleme: 31 Ağustos 2026 (Dalga 3 + 5 bitti).

---

## 1. Nerede kaldık

| Dalga | Karakter | Durum |
|---|---|---|
| 1 | Eren, Mikasa, Armin, Levi, Onizuka | ✅ **canlıda** (`main`, `7e9934f`) |
| 2 | Midoriya, Bakugō, Todoroki, Uraraka, Toshinori | ⚠️ **YARIM** — aşağıya bak |
| 3 | Rukia, Renji, Uryū, Ulquiorra, Grimmjow, Yoruichi | ✅ **bitti** (`anime/faz2-dalga35`) |
| 4 | Chōsō, Maki, Mahito, Tōdō, Panda, Tōji, Jōgo, Yūta | ⬜ **kalan** |
| 5 | Megumi, Nobara, Nanami, Getō (yeniden tasarım) | ✅ **bitti** (`anime/faz2-dalga35`) |

Raporlar: `docs/ANIME-FAZ2-DALGA3-RAPOR.md`, `docs/ANIME-FAZ2-DALGA5-RAPOR.md`.

### ⚠️ İKİ ENTEGRASYON DALI VAR — karıştırma

| Dal | İçindekiler | Derleniyor mu |
|---|---|---|
| `anime/faz2-dalga35` | Dalga 3 (6 Bleach) + Dalga 5 (4 JJK) | ✅ **evet** |
| `anime/karakter-fazi-2` | Dalga 2'nin **yalnızca** rota + kaydı (`ce7692d`) | ❌ **hayır** |

**Dalga 2 yarım kaldı ve bu bilinmeden devam edilmemeli.** `ce7692d` beş My
Hero Academia rotasını ve `EXPERIENCE_IDS` kaydını merkeze yazmış, ama beş
sayfanın **bileşenleri hiç commit'lenmemiş**: `K:\KURONEXUS-wt\<slug>-redesign`
worktree'lerinde commit'siz duruyorlar. İkisinin (Midoriya `NotebookExperience`,
Todoroki `HalfAndHalfExperience`) ana bileşeni hiç yazılmamış ve beş klasörün
hiçbirinde `.module.css` yok. O dalda `tsc` beş TS2307 veriyor.

Dalga 3+5 bu yüzden `main` tabanlı ayrı bir dalda ilerledi; `ce7692d`
alınmadı, Dalga 2'nin dallarına ve worktree'lerine **dokunulmadı**.

**Dalga 2'yi bitirecek oturuma:** worktree'lerdeki commit'siz dosyaları
topla, eksik iki bileşeni ve beş `.module.css`'i yaz, sonra
`anime/faz2-dalga35` (ya da o zamanki `main`) üzerine al. `ce7692d`'yi
olduğu gibi merge etme — kaydı var, bileşeni yok.

### Hazır olan altyapı (tekrar yapma)

- **28 karakterin AniList numarası doğrulandı.** Bilinmeyen dördü çözüldü:
  Panda `137974`, Tōji `162722`, Jōgo `156991`, Yūta `129571`.
- **28 portre repoda:** `frontend/public/assets/anime/karakterler/<slug>/`
  (`anilist-portrait.png|jpg` + `kaynak.json`). Hotlink yok.
  ⚠️ Portre **230×345** — hero için küçük, küratör yuvası olarak kalıyor.
- **28 paletin hepsi çözülmüş** ve dalga brief'lerine yazılmış. Elle palet
  yazma; brief'teki bloğu birebir kullan.
- **Brief'ler yazılı:** `docs/ANIME-FAZ2-DALGA3.md`, `-DALGA4.md`,
  `-DALGA5.md`. Her karakterin altı ekseni + mekaniği kilitli.
- **Ayrışma denetimi yazıldı:** `frontend/scripts/check-karakter-ayrisma.mjs`.

---

## 2. Bir dalgayı çalıştırma — adım adım

Her adımın nerede koşacağı yazılı.

### 2.1 Kayıtları ekle (MERKEZDE, sen yaz)

⚠️ **Kayıt dalga dalga giriyor.** Sayfası hazır olmayan karakteri
`EXPERIENCE_IDS`'e ekleme — `check-karakter-kayit.mjs` haklı olarak hata
verir ve denetim tur boyunca kırmızı kalır (bu hata bir kez yapıldı).

`frontend/lib/characters/experiences.ts` → `EXPERIENCE_IDS` + `EXPERIENCE_COMPANIONS`
`frontend/lib/characters/roster.ts` → seri sabiti (gerekiyorsa) + kadro satırları

Kadro satırlarını **elle yazma**, künyeden üret:

```bash
# nerede: K:\KURONEXUS\frontend
node -e 'const{readFileSync}=require("node:fs");for(const s of ["rukia-kuchiki","renji-abarai"]){const k=JSON.parse(readFileSync(`public/assets/anime/karakterler/${s}/kaynak.json`,"utf8"));console.log(`  { characterId: EXPERIENCE_IDS.X, name: "${k.ad}", nameNative: "${k.adNative}", ...BLEACH },`)}'
```

### 2.2 Rotaları üret (MERKEZDE)

Betik hazır ve beş dalganın tablosunu içinde taşıyor:
`<scratchpad>/rota-uret.mjs` — kaybolduysa `docs/ANIME-FAZ2-DALGA<n>.md`
tablosundan yeniden yazılır (bileşen adları orada).

```bash
# nerede: K:\KURONEXUS\frontend  ← kökten koşarsan app/ yanlış yere düşer
node <scratchpad>/rota-uret.mjs 3
```

Rota şablonu `karakterler/40882/page.tsx`'te; kopyalanabilir.

### 2.3 Worktree + junction (MERKEZDE, ajanlar kurmasın)

```bash
# nerede: K:\KURONEXUS
git worktree add -b "<slug>-redesign" "K:/KURONEXUS-wt/<slug>-redesign" anime/karakter-fazi-2
```
```powershell
# nerede: PowerShell
cmd /c mklink /J "K:\KURONEXUS-wt\<slug>-redesign\frontend\node_modules" "K:\KURONEXUS\frontend\node_modules"
```

### 2.4 Ajanları koştur

Workflow betiği hazır ve tekrar kullanılabilir:
`<session>/workflows/scripts/faz2-dalga2-*.js` — `KARAKTERLER` dizisini ve
brief dosya adını değiştirmek yeterli. İçinde **Dalga 1 denetiminden çıkan
beş ders** bir bölüm olarak duruyor; onu SİLME, her dalgaya taşı.

Bir ajan = bir karakter = bir worktree. Ajanlara `next build` yaptırma.

### 2.5 Denetle, düzelt, birleştir (MERKEZDE)

```bash
# nerede: K:\KURONEXUS  — junction'ı worktree'den ÖNCE sök
cmd //c rmdir "K:\KURONEXUS-wt\<slug>-redesign\frontend\node_modules"
git merge --no-ff --no-edit <slug>-redesign
```
```bash
# nerede: K:\KURONEXUS\frontend
npx tsc --noEmit
npx eslint components/character/<slug> lib/characters/<slug>-experience.ts
npm run check:karakter
node scripts/check-karakter-ayrisma.mjs
NEXT_PUBLIC_API_URL=https://api.kuronexus.com npx next build
```

Sonra `main`'e merge + push.

---

## 3. Dalga 5'in özel işi — emeklilik ✅ YAPILDI (31 Ağustos 2026)

> Bu bölüm **tarihsel** olarak duruyor; iş bitti. Dördü de
> `components/character/.deprecated/` altında, veri dosyaları `data.ts`
> oldu, rotalar yeni bileşenlere bağlandı, denetimlerin `.deprecated`'ı
> atladığı ölçüldü (52 modül taranıyor, dördü listede yok).
> Ayrışma denetimi de `check:karakter` zincirine **eklendi** ve zincir temiz.
> Aynı şeyi Dalga 4'te yapman gerekmiyor — orada emeklilik yok, yeni sayfa var.

### Özgün metin (Dalga 4 için gerekmiyor)

Dört sayfa zaten yayında; **silinmeyecek**, `.deprecated/` altına taşınacak.
Hazır betik: `<scratchpad>/dalga5-emeklilik.sh`. Yaptığı:

1. `components/character/<slug>/` → `components/character/.deprecated/<slug>/`
2. `lib/characters/<slug>-experience.ts` → `.deprecated/<slug>/data.ts`
3. Taşınan bileşenlerdeki `@/lib/characters/<slug>-experience` importunu
   `./data`ya çevirir.

**Neden üçü de şart:**
- Klasör `components/character/` içinde ama `.deprecated` adında: denetim
  betikleri `readdirSync(BASE)` ile geziyor ve her klasörde **doğrudan**
  duran `.module.css`'i arıyor; `.deprecated/` içinde doğrudan modül yok,
  atlanıyor. Ayrışma betiği noktayla başlayan klasörleri açıkça eliyor.
- Eski modül yerinde bırakılırsa aynı `data-world` için **iki palet bloğu**
  olur, kontrast denetimi ikisini de ölçer ve aralarındaki uzaklık 0
  çıktığı için "accent COK YAKIN" hatası verir.
- Veri dosyası taşınmazsa eski bileşen yeni veriyi görür ve tsc patlar.

Yeni bileşen adları (rota bunları bekleyecek): `ShadowMenagerieExperience`,
`StrawDollExperience`, `OvertimeExperience`, `ReliquaryExperience`.

Emeklilikten sonra `check:karakter` zincirine ayrışma denetimini ekle
(`package.json`) — şu an iki çift işaretli olduğu için zincirde değil:

```
"check:karakter": "... && node scripts/check-karakter-ayrisma.mjs"
```

---

## 4. Dalga 1 denetiminden çıkan dersler — her dalgada tekrarlanıyor

Beş sayfanın **beşi de** bağımsız denetimden `gecti=false` aldı. Bulgular
gerçekti ve düzeltildi. Sıradaki dalgalarda aynılarını arayın:

1. **Küratör metni ziyaretçiye sızdı.** Levi'de boş kadrajların içine üretim
   metadatası yazılıyordu (`1600×900 · webp`) ve `isAdmin` ile kesilmiyordu;
   ziyaretçi 15 kutu + 15 kez piksel ölçüsü görüyordu. Ev deseni tersi:
   ziyaretçinin gördüğü boşluk **yazısız** olmalı.
2. **Kilitli ızgara varsayılan durumda yoktu.** Onizuka `class` modunda
   eğimi sıfırlıyordu → sayfa düz tek kolon açılıyordu. Mod düğmesi kilitli
   ızgarayı **açıp kapatmaz, derecesini değiştirir.** (Bu brief'in hatasıydı.)
3. **Tek dilli dize kaçtı.** Mikasa'da "çeviri gerektirmeyen teknik dize"
   diye işaretlenen alanın içinde Türkçe nesir vardı ve `/en`'de görünüyordu.
4. **Yoldaş listesi uyuşmazlığı.** Armin sayfası Levi'yi çiziyordu ama
   `EXPERIENCE_COMPANIONS`'ta yoktu → portre girildiğinde bile kadraj
   sonsuza kadar boş kalacaktı. Bugün hepsi boş olduğu için gözle görünmez.
5. **Kanon hatası.** Onizuka'nın okul adı yanlış uyarlamadan alınmıştı.
   ⚠️ **Denetçinin önerdiği düzeltme de yanlıştı** — kaynağı doğrulamadan
   uygulama. (Doğrusu: manga 東京吉祥学苑, anime 聖林学園, dizi 武蔵野聖林学苑.)

Ek: **yüklenen görselin üstündeki metne perde koy.** Kontrast betiği
yalnızca `--bg`/`--surface` üzerinde ölçüyor, görsel üstünü göremiyor.

---

## 5. Bilinen tuzaklar

| Tuzak | Belirti | Çözüm |
|---|---|---|
| `rota-uret.mjs` kökten koşmak | Depo kökünde `app/` beliriyor | `frontend/` dizininden koştur |
| Workflow betiğinde backtick | `Script parse error` | Şablon dizesi içinde backtick kullanma |
| Bash'te backtick'li `node -e` | `syntax error near unexpected token` | Düzenlemeyi `Edit` aracıyla yap |
| `git worktree remove --force` | Gerçek `node_modules` silinebilir | Junction'ı **önce** `rmdir` ile sök |
| Ajan raporu gelmedi | "Ajan donmuş" sanılıyor | Worktree'yi **hem** `git status` **hem** `git log` ile tara |
| `git add -A` | Paralel oturumun yarım dosyaları karışıyor | Dosyaları tek tek ekle |
| `main`'e push | Çift webhook, aynı servis iki kez build, ~23 dk, RAM riski | Kök sebep **AÇIK İŞ**: GitHub → Settings → Webhooks'ta Coolify'a giden çift kaydı sil |

---

## 6. Kalan 13 karakter — tek bakışta

> Dalga 3 ve Dalga 5 BİTTİ; tabloları aşağıda tarihsel kayıt olarak duruyor.
> Sıradaki iş Dalga 4 (sekiz JJK sayfası) ve Dalga 2'nin yarım kalan beşi.

### Dalga 3 · Bleach (6)
| Karakter | ID | Klasör | Bileşen |
|---|---|---|---|
| Rukia Kuchiki | 6 | `rukia-kuchiki` | `ShirayukiExperience` |
| Renji Abarai | 906 | `renji-abarai` | `ZabimaruExperience` |
| Uryū Ishida | 564 | `uryuu-ishida` | `QuincyExperience` |
| Ulquiorra Cifer | 1081 | `ulquiorra-cifer` | `HollowExperience` |
| Grimmjow Jaegerjaquez | 1080 | `grimmjow-jaegerjaquez` | `DesgarronExperience` |
| Yoruichi Shihōin | 908 | `yoruichi-shihouin` | `ShunkoExperience` |

Seri sabiti `BLEACH` zaten var. Yayında dört Bleach sayfası daha var
(Ichigo, Urahara, Aizen, Kenpachi) — mekanikleri brief'te yazılı, yaklaşma.

### Dalga 4 · Jujutsu Kaisen, yeni (8)
| Karakter | ID | Klasör | Bileşen |
|---|---|---|---|
| Chōsō | 157116 | `chousou` | `BloodlineExperience` |
| Maki Zen'in | 134167 | `maki-zenin` | `ArmoryExperience` |
| Mahito | 133702 | `mahito` | `IdleTransfigurationExperience` |
| Aoi Tōdō | 137975 | `aoi-toudou` | `BoogieWoogieExperience` |
| Panda | 137974 | `panda` | `ThreeCoresExperience` |
| Tōji Fushiguro | 162722 | `touji-fushiguro` | `HeavenRestrictionExperience` |
| Jōgo | 156991 | `jougo` | `VolcanoExperience` |
| Yūta Okkotsu | 129571 | `yuuta-okkotsu` | `RikaExperience` |

Seri sabiti `JJK` zaten var. Sekiz ajan aynı anda ağır olabilir — 4+4
bölmek güvenli.

### Dalga 5 · Jujutsu Kaisen, kimlik ameliyatı (4)
| Karakter | ID | Klasör | Yeni bileşen |
|---|---|---|---|
| Megumi Fushiguro | 126635 | `megumi-fushiguro` | `ShadowMenagerieExperience` |
| Nobara Kugisaki | 133700 | `nobara-kugisaki` | `StrawDollExperience` |
| Kento Nanami | 133704 | `kento-nanami` | `OvertimeExperience` |
| Suguru Getō | 133699 | `suguru-getou` | `ReliquaryExperience` |

Bu dördünün kaydı **zaten var** (yayındalar) — `EXPERIENCE_IDS`/`roster`'a
dokunma, yalnız rotayı yeni bileşene bağla ve §3'teki emekliliği uygula.

---

## 7. Bitince

Dalga 3 + 5 için (31 Ağustos 2026):

- [x] `npm run check:karakter` temiz — **ayrışma denetimi zincire eklendi**
      (`package.json`), beş betik birden koşuyor ve beşi de temiz
- [x] `next build` temiz — 10 rotanın onu da listede
- [x] Nexus bağları: Getō↔Gojō ✔, Renji↔Rukia ✔, Nobara↔Megumi ✔,
      Megumi↔Gojō ✔. **Tōji↔Megumi kurulamadı** (Tōji'nin sayfası Dalga 4'te;
      bugün düz adla çiziliyor, dalga girince kendiliğinden bağlanacak)
- [x] Grup 1'in altı worktree'si söküldü (junction **önce**), `prune` yapıldı
- [x] `docs/KARAKTER-SAYFASI-EKLEME.md` §3 (mekanik tablosu, 15 yeni satır +
      emekli dördünün notu) ve §4 (palet tablosu koddan **yeniden üretildi**,
      52 satır) güncellendi
- [x] Bu dosya güncellendi
- [ ] **Grup 2'nin dört worktree'si duruyor** — `K:\KURONEXUS-wt\*-rework`.
      Sökerken junction ÖNCE: `cmd //c rmdir "<yol>\frontend\node_modules"`

Kalanlar (Dalga 2 ve 4):

- [ ] Dalga 2'nin yarım işi (bkz. §1'deki uyarı)
- [ ] Dalga 4 · JJK'dan sekiz yeni sayfa
- [ ] Dalga 4 girince: Tōji↔Megumi ve Yūta↔Getō bağları kendiliğinden kurulur,
      doğrula
- [ ] `lib/characters/sukuna-itadori-experience.ts` satır 62 ve 64 AniList'e
      **hotlink** yapıyor (bu görevden önce yazılmış). İki kareyi indirip
      `public/assets/anime/karakterler/` altına almak ayrı bir iş.
