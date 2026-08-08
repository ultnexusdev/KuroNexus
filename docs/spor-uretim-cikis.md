# Salon 06 · Spor — üretime çıkış

Faz 1'i canlıya almak için sıra. **Sıra önemli** — bu düzen kesinti penceresini
sıfırlıyor; başka bir sırayla eski Galatasaray adresi bir süre boş sayfaya
yönlenir.

Dal: `spor-arsivi` (6 commit). Son commit: F1 adaptörü ve tohum verisi.

---

## Neden bu sıra

Frontend'in taşıdığı 8 kalıcı yönlendirme, deploy edildiği **an** devreye
giriyor: `/dark-stories/galatasaray` → `/spor/futbol/galatasaray`. Hedef sayfa
veri bulamazsa 404 döner — yani eski adresi olduğu gibi bırakmaktan kötü bir
duruma düşeriz.

Backend ve frontend ayrı servisler olduğu için bu tamamen önlenebilir:

```
1. backend deploy   → migration çalışır, yeni uçlar açılır, KULLANICI HİÇBİR FARK GÖRMEZ
2. içerik yüklenir  → veri yerinde ama henüz onu gösteren sayfa yok
3. frontend deploy  → yönlendirmeler açılır ve gittikleri yerde içerik HAZIR
```

---

## 0. Push — atlanırsa deploy hiçbir şey yapmaz

⚠️ Bu adım ilk denemede atlandı ve deploy değişmemiş kodu yeniden kurdu; canlıda
her şey 404 döndü. Commit yerelde durduğu sürece Coolify onu göremiyor.

```bash
git push -u origin spor-arsivi
```

Doğrulama — uzak uç yerel uçla aynı olmalı:

```bash
git rev-parse --short spor-arsivi && git rev-parse --short origin/spor-arsivi
```

Ardından Coolify'da **her iki servisin de hangi dalı izlediğini kontrol et.**
Varsayılan genelde `main`; bu dal deploy edilecekse servis ayarındaki branch
alanı `spor-arsivi` yapılmalı, yoksa deploy yine eski kodu kurar.

---

## 1. Backend deploy

Coolify'da backend servisini `spor-arsivi` dalından (ya da `main`'e birleştirdikten
sonra `main`'den) deploy et.

Konteyner açılırken migration'ı **kendisi çalıştırıyor** —
`CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]`. Elle bir şey
çalıştırman gerekmiyor.

Uygulanacak iki migration:

| Migration | Ne yapıyor |
|---|---|
| `20260808161046_add_sport_archive` | 16 tablo, 56 indeks, 31 FK, 2 enum, 5 CHECK |
| `20260808203618_add_f1_race_results` | 1 tablo + `F1Driver`'a 4 nullable sütun |

**Mevcut veriye etkisi yok.** İkisi birlikte: 0 DROP, 0 ALTER COLUMN, 0 ADD COLUMN
(mevcut tablolarda). `F1Driver`'a eklenen 4 sütun yeni ve boş bir tabloda.

### Doğrulama

```bash
curl -s https://api.kuronexus.com/sport-archive/overview
# beklenen: {"footballClubs":0,"f1Circuits":0}   ← tablolar var, içerik yok
```

Sıfır dönmesi **doğru** — henüz tohum yüklenmedi.

### Bir şey ters giderse

`migrate deploy` başarısız olursa `&&` yüzünden uygulama hiç başlamaz; Coolify
eski imaja geri alınır ve site etkilenmez. Migration eklemeli olduğu için
başarısızlık beklenmiyor, ama davranış budur.

---

## 2. İçerik

Coolify'ın backend konteyner terminalinden (`/app` dizininde). `ts-node` imajda
var — `node_modules` build aşamasından komple kopyalanıyor.

```bash
TSOPT='{"module":"NodeNext","moduleResolution":"NodeNext"}'

# a) Arşiv tohumu: Galatasaray + 3 dönem + 4 an + Hagi + Monza
npx ts-node --transpile-only -O "$TSOPT" prisma/seed-sport-archive.ts

# b) Monza podyum tarihi (Jolpica'dan 3 istek, 225 satır)
npx ts-node --transpile-only -O "$TSOPT" prisma/sync-f1-results.ts monza

# c) Monza pist haritası
npx ts-node --transpile-only -O "$TSOPT" prisma/add-track-image.ts \
  monza "https://medyascope.tv/wp-content/uploads/2024/08/image-2-11-1536x864-1-1200x675.jpg" \
  "Monza pist haritası" "kaynak: medyascope.tv"
```

⚠️ **(a) yeniden çalıştırılabilir ama yıkıcı:** dönem/an/viraj kayıtlarını sahibine
göre silip yeniden yazıyor. Panelde ya da doğrudan veritabanında düzelttiğin
metinler kaybolur. İlk kurulumdan sonra bir daha çalıştırma.

⚠️ **(b) yaklaşık 100 dış istek yapıyor** (96 sürücü künyesi için Wikimedia
sorgusu + portre indirmesi). Birkaç dakika sürer. Yeniden çalıştırılabilir;
portresi olan sürücü için Commons'a tekrar gitmiyor.

**Yükleme dizini kalıcı — ölçüldü.** Portreler ve pist haritası `/app/uploads/f1/`
altına iniyor. Depoda volume tanımı görünmüyor (Dockerfile yalnızca `mkdir`
yapıyor) ama canlıda daha önce yüklenmiş bir görsel deploy'lardan sonra hâlâ
200 dönüyor — yani Coolify tarafında kalıcı bir volume bağlı. (b) ve (c) her
deploy'da tekrarlanmayacak.

### Doğrulama

```bash
curl -s https://api.kuronexus.com/sport-archive/overview
# beklenen: {"footballClubs":1,"f1Circuits":1}

curl -s https://api.kuronexus.com/sport-archive/f1/circuits/monza | head -c 200
# beklenen: circuit nesnesi, results dizisinde 225 satır
```

---

## 3. Frontend deploy

Coolify'da frontend servisini aynı daldan deploy et.

Bu adımda devreye girenler:
- 8 kalıcı yönlendirme (301)
- `/spor` ağacının 6 sayfası
- Ana sayfa / Nexus / footer bağlantılarının yeni adrese dönmesi
- Sitemap'in taşınmış adresleri süzmesi

### Doğrulama — tek blok

```bash
for u in /spor /spor/futbol /spor/futbol/galatasaray \
         /spor/futbol/efsaneler/hagi /spor/formula-1 \
         /spor/formula-1/pistler/monza /en/spor; do
  printf "%-40s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://kuronexus.com$u)"
done
# hepsi 200 olmalı
```

```bash
# yönlendirmeler
for u in /dark-stories/category/spor /dark-stories/galatasaray \
         /dark-stories/formula-1 /futbol/oyuncu/test; do
  printf "%-36s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code} → %{redirect_url}' https://kuronexus.com$u)"
done
# hepsi 301 ve hedefleri /spor... olmalı
```

```bash
# ⚠️ JOKER YASAĞI — bunlar YÖNLENDİRİLMEMELİ
curl -s -o /dev/null -w '%{http_code}\n' https://kuronexus.com/dark-stories/galatasaray/wiki
# 301 DEĞİL, 200 veya 404 olmalı — 301 çıkarsa joker sızmış demektir
```

---

## Sonra ne kaldı

**Ölü kod temizliği (Adım 4).** `GsHall`, `F1Hall`, `SportSplit` ve onlara bağlı
5 bileşen + `lib/api/sport.ts` + 51 i18n anahtarı silinecek; `[categorySlug]` ve
`[universeSlug]` içindeki iki dallanma düzenlenecek. **Toplam 13 dosya.**

Bu adım yeni sayfalar canlıda doğrulandıktan SONRA yapılmalı — o zamana kadar
eski sayfalar erişilemez ama yerinde duruyor, yani bir sorun çıkarsa
yönlendirmeleri geri alıp eski davranışa dönmek mümkün. Temizlikten sonra o
kapı kapanıyor.

**Günlük senkronizasyon.** `@nestjs/schedule` kurulu; `sync-f1-results.ts`
mantığı bir cron job'a bağlanabilir. Faz 1'de gerek yok — podyum tarihi yılda
bir değişiyor.

**Taslak metinler.** `seed-sport-archive.ts` içindeki anlatılar taslak;
`personalNote` alanları `[TASLAK]` işaretli ve küratörün yazması gerekiyor.
