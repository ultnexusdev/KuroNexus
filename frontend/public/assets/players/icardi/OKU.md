# Mauro Icardi — fotoğraf yuvaları

Bu klasör `/spor/futbol/futbolcular/mauro-icardi` sayfasının fotoğraflarını
tutuyor. Şu an klasör **boş**: sayfadaki 17 yuvanın hepsi "FOTO EKLENECEK"
çerçevesi çiziyor, kırık görsel kutusu göstermiyor.

## Fotoğraf eklemenin iki yolu

**1 · Küratör modu (kod yazmadan, anında)**
Siteye admin olarak giriş yap → sayfanın sağ alt köşesindeki **Küratör modu**
düğmesine bas → her karenin sol üstünde bir düzenle düğmesi belirir → dosya
seç ya da adres yapıştır. Yüklenen dosya sunucuya iner ve adresi sabit kalır.
Panel ayrıca `favourite-players.ts` içine yapıştırılacak kod parçacığını
üretiyor — o parçacık yapıştırılmadan değişiklik yalnızca senin tarayıcında
görünür.

**2 · Dosyayı doğrudan buraya koymak**
Aşağıdaki adları kullanarak dosyaları bu klasöre koy, sonra
`frontend/lib/sport/favourite-players.ts` içinde o yuvanın
`placeholder: true` satırını `placeholder: false` yap.

## Yuva listesi

| Dosya | Yuva kimliği | Kadraj |
| --- | --- | --- |
| `hero.jpg` | `hero` | Dikey · GS forması · yüz net · gol sevinci ya da stüdyo |
| `kart.jpg` | `card` | Dikey · üst gövde (hub şeridindeki kart) |
| `kariyer-sampdoria.jpg` | `career-sampdoria` | Sampdoria forması |
| `kariyer-inter.jpg` | `career-inter` | Inter forması · kaptanlık pazubendi |
| `kariyer-psg.jpg` | `career-psg` | PSG forması · yüksek çözünürlük |
| `kariyer-galatasaray.jpg` | `career-galatasaray` | GS forması · gol sevinci |
| `gece-milano.jpg` | `night-derbi` | San Siro · Inter · gol sevinci |
| `gece-golkrali.jpg` | `night-capocannoniere` | Ödül / sezon kutlaması |
| `gece-oldtrafford.jpg` | `night-oldtrafford` | Old Trafford · GS deplasman |
| `gece-superlig.jpg` | `night-superlig` | Süper Lig · GS forması |
| `galeri-01.jpg` | `gallery-1` | Ana kare · geniş · en yüksek çözünürlük |
| `galeri-02.jpg` | `gallery-2` | Maç anı · yatay |
| `galeri-03.jpg` | `gallery-3` | Portre · dikey |
| `galeri-04.jpg` | `gallery-4` | Kutlama · dikey |
| `galeri-05.jpg` | `gallery-5` | Tribün / taraftar · yatay |
| `galeri-06.jpg` | `gallery-6` | Antrenman · kare |
| `galeri-07.jpg` | `gallery-7` | Kupa · şampiyonluk gecesi |

## Notlar

- Uzantı `.jpg` olarak yazılı; başka bir uzantı kullanacaksan defterdeki
  `src` alanını da güncelle.
- Dosyaları küçültmeyi unutma; hero için ~1200×1600, galeri için ~1600 px
  genişlik fazlasıyla yeterli. Depoya 3 MB'lık kareler koyma.
- Bu klasördeki her şey `img-src 'self'` kapsamında, yani CSP'den sorunsuz
  geçiyor. Dış adrese bağlanma — CSP beyaz listesinde yok, görsel sessizce
  kaybolur.
