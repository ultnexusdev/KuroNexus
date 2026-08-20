# Futbolcu Kaydı Sözleşmesi

Bu belge `frontend/lib/sport/players/<slug>.ts` dosyalarının nasıl yazılacağını
tanımlar. Yeni bir futbolcu eklemek **tek bir veri dosyası yazmak** demektir;
bileşen, CSS, rota ya da migration gerekmez.

---

## 1 · TEK DOSYA KURALI

Yazılacak dosya: `frontend/lib/sport/players/<slug>.ts` — **başka hiçbir
dosyaya dokunulmaz.** `index.ts`, bileşenler, CSS, rota dosyaları dâhil.
Kayıt listesine ekleme işi ayrıca yapılır.

Dosyanın iskeleti:

```ts
import type { FavouritePlayer } from "./types";

const BASE = "/assets/players/<slug>";

export const <camelCaseAd>: FavouritePlayer = {
  ...
};
```

Tip sözleşmesi `frontend/lib/sport/players/types.ts` içinde, örnek kayıt
`frontend/lib/sport/players/icardi.ts` içinde. **İkisi de okunmalı.**

---

## 2 · GÖRSEL YUVALARI — HEPSİ YER TUTUCU

Fotoğraflar sonradan küratör modundan yüklenecek. Bu yüzden **her yuva**
`placeholder: true` olacak ve **hiçbir gerçek dosya yolu uydurulmayacak.**

Her yuvada bulunması gerekenler:

```ts
{
  id: "hero",                    // KARARLI kimlik — aşağıdaki şemaya uy
  src: `${BASE}/hero.jpg`,       // dosyanın olması GEREKEN yer
  alt: "Victor Osimhen, Galatasaray forması",
  placeholder: true,
  hint: "Dikey kadraj · GS forması · yüz net · gol sevinci",   // küratöre kadraj notu
  width: 1200,                   // yaklaşık oran için — CLS'i bu belirliyor
  height: 1600,
}
```

`hint` Türkçe ve **kadraj tarif eder**: yön (dikey/yatay), forma, an, ışık.
Küratör bu notu okuyup hangi kareyi yükleyeceğini bilecek.

### Yuva kimlikleri (17 adet, şema sabit)

| Kimlik | Adet | Nerede |
| --- | --- | --- |
| `hero` | 1 | ilk ekranın taşıyıcı karesi (dikey) |
| `card` | 1 | hub şeridindeki kart + efsaneler salonundaki portre |
| `crest-gs` | 1 | Galatasaray arması (kare/dikey oturur) |
| `career-<kulüp>` | 4-5 | her kariyer durağında bir kare |
| `night-<anahtar>` | 4 | her unutulmaz gecede bir kare |
| `gallery-1` … `gallery-7` | 7 | galeri |

⚠️ Kimlikler `[a-z0-9][a-z0-9-]*` deseninde olmak zorunda — backend
doğrulaması bunu reddediyor. Türkçe karakter, büyük harf, alt çizgi yok.

⚠️ Kimlikler **kararlı**: sonradan yeniden adlandırmak küratörün o yuvaya
yaptığı yüklemeyi koparır.

---

## 3 · RENK — MAVİ YOK

⚠️ **HİÇBİR MAVİ TON KULLANILMAYACAK.** Lacivert, koyu mavi, çelik mavisi,
gök mavisi — hiçbiri. Gerekçesi kesin ve tartışmaya kapalı: rakip kulübün
rengi ve burası bir Galatasaray arşivi.

Bu kural **her yerde** geçerli: `palette`in beş değeri, kariyer duraklarının
`tone` alanı, atmosfer, zemin.

**Mavi formalı kulüpler nötr taş tonuyla temsil edilir:**
`#8d8778` · `#6d6455` · `#7b7365` · `#5f584b`

Yani Chelsea, Inter, Napoli, Sampdoria, Trabzonspor, Uruguay, Çekya gibi mavi
taşıyan her künye bu tonlardan birini alır. Renk yerine **doku ve ton**
farkıyla ayrışırlar.

Serbest olan aile: altın/amber, kırmızı/crimson, yeşil, turuncu, bordo,
toprak, taş, kemik, kömür.

`palette` beş değer taşır ve sayfanın ışığını kurar:

```ts
palette: {
  ink:    "#0c0b0e",                    // zemin — saf siyah DEĞİL, renkli bir gece
  accent: "#f6c94a",                    // ana vurgu: isim, rakam, çizgi
  warm:   "#c21f31",                    // ikinci vurgu
  glow:   "rgba(246, 201, 74, 0.34)",   // spot ışığının rengi (rgba)
  neon:   "#8f1224",                    // neon kenar, az kullanılır
}
```

Her oyuncunun paleti **birbirinden ayırt edilebilir** olmalı. Hepsi
Galatasaraylı ama hepsi aynı sarı-kırmızı olursa yirmi üç sayfa tek sayfaya
düşer. Oyuncunun ülkesi, karakteri ve dönemi rengin çıkış noktası olsun.

---

## 4 · TASARIM DNA'SI — SAYFANIN İSKELETİ

`design` bloğu **verilen değerlerle birebir** yazılır. Bu değerler sayfaların
birbirine benzememesini sağlıyor ve merkezden dağıtıldı; değiştirilmez.

```ts
design: {
  voice: "poster",       // tipografi ailesi
  hero: "kinetic",       // ilk ekranın iskeleti
  signature: "rays",     // imza motifi
  rhythm: "tight",       // dikey nefes
  texture: "clean",      // zemin dokusu
  order: [...],          // varsa bölüm sırası; yoksa alan hiç yazılmaz
}
```

⚠️ `theme` alanı **yazılmayacak.** Tema müziği yalnızca Icardi'ye özel
(kullanıcı kararı). Boş bir ses düğmesi çizmek boş oda yasağını ihlal eder.

---

## 5 · METİN — SES VE DOĞRULUK

Bütün metin **Türkçe** ve arşivin sesinde: küratörün kendi gözlemi gibi,
gazete diliyle değil. Kısa cümle, somut detay, abartısız. Icardi kaydındaki
`story`, `personal` ve `nights` metinleri ölçüdür — okunup aynı sese
yaklaşılmalı.

### ⚠️ SAYI UYDURMA

Bu gerçek insanlar. Emin olmadığın **hiçbir sayıyı yazma**:

- Maç/gol/asist sayısından emin değilsen o satırı **hiç koyma**. Dört yerine
  üç istatistik satırı olması, uydurma bir sayıdan iyidir.
- Emin olduğun şeyleri yaz: şampiyonluk sayısı, transfer yılı, ülke, mevki,
  ikonik anlar, lakaplar.
- `CareerStop.matches` ve `goals` alanları `null` kabul ediyor — emin
  değilsen `null` yaz.
- Tarih ve yıl aralıklarında emin değilsen dar değil **geniş** ifade kullan
  ("2010'ların başı" gibi bir `note` cümlesi, uydurma bir yıldan iyidir).

Dosyanın başına şu uyarı **her kayıtta** yazılır:

```ts
/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 */
```

### Alanların uzunluğu

| Alan | Ölçü |
| --- | --- |
| `tagline` | tek satır, kartın altında — bir gözlem |
| `legendEpithet` | 1-3 kelime lakap (yalnız efsanelerde) |
| `quote` | oyuncunun kendi cümlesi ya da onu anlatan tek cümle |
| `closingQuote` | sayfayı kapatan büyük alıntı |
| `storyLede` | 1-2 cümle |
| `story` | **4 paragraf**, her biri 2-4 cümle |
| `nights[].line` | 1-2 cümle, bir sahne anlatır |
| `personal[].body` | 2-4 cümle, küratörün kişisel gözlemi — en samimi yer |
| `career[].note` | tek cümle, o duraktan geriye kalan |

`personal` **3 kayıt** olacak ve gerçekten kişisel olacak: bir alışkanlık, bir
hareket, bir detay. "Harika bir oyuncuydu" değil; "ortanın nereden geleceğini
beklemez, ilk direğe koşar" düzeyinde.

---

## 6 · KONTROL LİSTESİ

Bitirmeden önce:

- [ ] Tek dosya yazıldı, başka dosyaya dokunulmadı
- [ ] `import type { FavouritePlayer } from "./types";` var
- [ ] 17 yuvanın hepsi `placeholder: true` ve `hint` taşıyor
- [ ] Yuva kimlikleri `[a-z0-9-]` deseninde
- [ ] **Hiçbir mavi ton yok** — palette ve career tone'ları dâhil
- [ ] `design` bloğu verilen değerlerle birebir
- [ ] `theme` alanı YOK
- [ ] Emin olunmayan sayı yazılmadı
- [ ] Dosya başında "SAYILAR DOĞRULANMADI" uyarısı var
- [ ] `story` 4 paragraf, `personal` 3 kayıt, `nights` 4 kayıt
- [ ] Türkçe karakterler doğru (Write aracıyla yazıldı, kabuk üzerinden değil)
