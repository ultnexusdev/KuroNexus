import { extractNextData, readSeries, toDetail } from './bin-kitap.service';

/**
 * 1000Kitap künyesinin doğruluğu tek bir saf işleve bağlı: `toDetail`. Site
 * yapısını değiştirirse arşive sessizce yanlış künye girer — çevirmen boş
 * kalır, seri adı kitabın kendi adı olur, Türkçe telifte orijinal ad iki kez
 * görünür. Bu yüzden burada ağ YOK; ölçülen gerçek yanıtın küçültülmüş hâli
 * sabit veri olarak sınanıyor.
 */

/** "Bülbülü Öldürmek" sayfasından ölçülen yapının birebir küçültülmüşü. */
function translatedPayload() {
  return {
    props: {
      pageProps: {
        response: {
          _sonuc: {
            kitap: {
              id: '939',
              adi: 'Bülbülü Öldürmek',
              seo_adi: 'bulbulu-oldurmek',
              resim: 'https://1k-cdn.com/resimler/kitaplar/9414_kucuk.jpg',
              resimB: 'https://1k-cdn.com/resimler/kitaplar/9414_buyuk.jpg',
              altbaslik: 'Bülbülü Öldürmek #1',
              isbn: '9789755706849',
              baskiyili: '2014',
              okuduDuz: 89456,
              yazarGruplari: [
                // Gerçek yanıtta kişilerin kimliği ve adres anahtarı var
                {
                  turId: 1,
                  turAdi: 'Yazar',
                  yazarlar: [
                    { id: '566', adi: 'Harper Lee', seo_adi: 'harper-lee' },
                  ],
                },
                {
                  turId: 2,
                  turAdi: 'Çevirmen',
                  yazarlar: [
                    { id: '1201', adi: 'Ülker İnce', seo_adi: 'ulker-ince' },
                  ],
                },
                {
                  turId: 3,
                  turAdi: 'Editör',
                  yazarlar: [
                    { id: '9002', adi: 'Bilge Sancı', seo_adi: 'bilge-sanci' },
                  ],
                },
              ],
            },
            liste: [
              {
                hakkinda: {
                  // Gerçek yanıtta türlerin kimliği var (ölçüldü)
                  kidDizi: [
                    { id: '17', adi: 'Dünya Klasikleri' },
                    { id: '29', adi: 'Edebiyat' },
                    { id: '12', adi: 'Roman' },
                  ],
                  bilgiParse: {
                    parse: ['İlk paragraf.', 'İkinci paragraf.'],
                  },
                  digerBaskilar: [{}, {}, {}],
                  baskiBilgileri: {
                    orijinalAdi: 'To Kill A Mockingbird',
                    baskiYili: '2014',
                    baskiYazi: 'Eylül 2014',
                    ilkBaskiYili: '1960',
                    dil: { kod: 'tr', baslik: 'Türkçe' },
                    orijinalDil: { kod: 'en', baslik: 'İngilizce' },
                    ulke: { kod: 'TR', baslik: 'Türkiye' },
                    yayinevi: 'Sel Yayınları',
                    isbn: '9789755706849',
                    sayfaSayisi: '355',
                    tahminiSure: '10 sa. 4 dk.',
                    format: { id: '1', baslik: 'Karton kapak' },
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
}

describe('readSeries', () => {
  it('kitabın kendi adını seri saymaz', () => {
    // 1000Kitap tekil kitaplara da "#1" veriyor; körlemesine alınırsa arşiv
    // tek kitaplık sahte serilerle dolar (kullanıcı kararı)
    expect(readSeries('Bülbülü Öldürmek #1', 'Bülbülü Öldürmek')).toEqual({
      name: null,
      index: null,
    });
  });

  it('gerçek seriyi adı ve sırasıyla alır', () => {
    expect(readSeries('Malazan Book of the Fallen #2', 'Ay Bahçeleri')).toEqual(
      {
        name: 'Malazan Book of the Fallen',
        index: 2,
      },
    );
  });

  it('Türkçe sıra biçimini de tanır', () => {
    // Canlıda ölçüldü: site iki ayrı biçim kullanıyor. Bu tanınmasaydı
    // "Dune 2. Kitap" seri ADI olurdu ve her cilt ayrı bir seri sayılırdı.
    expect(readSeries('Dune 2. Kitap', 'Dune Mesihi')).toEqual({
      name: 'Dune',
      index: 2,
    });
    expect(readSeries('Yüzüklerin Efendisi 3. Cilt', 'Kralın Dönüşü')).toEqual({
      name: 'Yüzüklerin Efendisi',
      index: 3,
    });
  });

  it('cilt işareti taşımayan alt başlığı seri saymaz', () => {
    // `altbaslik` iki ayrı şeyi taşıyor: seri bilgisi ve düz alt başlık.
    // İşaret aranmasaydı her alt başlık tek kitaplık sahte seri üretirdi.
    expect(
      readSeries(
        "Türkiye'de Transgender, Aktivizm ve Altkültürel Pratikler",
        'Başkaldıran Bedenler',
      ),
    ).toEqual({ name: null, index: null });
    expect(readSeries('Malazan', 'Ay Bahçeleri')).toEqual({
      name: null,
      index: null,
    });
  });

  it('alt başlık yoksa boş döner', () => {
    expect(readSeries(undefined, 'Ay Bahçeleri')).toEqual({
      name: null,
      index: null,
    });
  });

  it('büyük/küçük harf ve Türkçe karakter farkını seri saymaz', () => {
    expect(
      readSeries('KÜRK MANTOLU MADONNA #1', 'Kürk Mantolu Madonna'),
    ).toEqual({ name: null, index: null });
  });
});

describe('toDetail', () => {
  it('çeviri kitabın künyesini eksiksiz çıkarır', () => {
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail).not.toBeNull();
    expect(detail?.source).toMatchObject({
      title: 'Bülbülü Öldürmek',
      originalTitle: 'To Kill A Mockingbird',
      authors: ['Harper Lee'],
      publisher: 'Sel Yayınları',
      isbn13: '9789755706849',
      publishedYear: 2014,
      firstPublishedYear: 1960,
      pageCount: 355,
      language: 'tr',
      provider: 'BINKITAP',
      binKitapSlug: 'bulbulu-oldurmek--939',
      popularity: 89456,
    });
  });

  it('çevirmeni ayrı alan olarak verir', () => {
    // Bu kaynağın eklenme sebebi; kaybolursa kaynağın anlamı kalmaz
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.translator).toBe('Ülker İnce');
  });

  it('sahte seriyi künyeye yazmaz', () => {
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.source.seriesName).toBeNull();
    expect(detail?.source.seriesIndex).toBeNull();
  });

  it('türlerin tamamını ve paragrafları korur', () => {
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.source.genres).toEqual([
      'Dünya Klasikleri',
      'Edebiyat',
      'Roman',
    ]);
    expect(detail?.source.description).toBe(
      'İlk paragraf.\n\nİkinci paragraf.',
    );
  });

  it('şemada yeri olmayan alanları ham veride saklar', () => {
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.raw).toMatchObject({
      binKitapId: '939',
      editor: 'Bilge Sancı',
      format: 'Karton kapak',
      country: 'Türkiye',
      originalLanguage: 'İngilizce',
      printedOn: 'Eylül 2014',
      estimatedReadingTime: '10 sa. 4 dk.',
      otherEditionCount: 3,
    });
  });

  it('büyük kapağı tercih eder', () => {
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.source.coverImage).toBe(
      'https://1k-cdn.com/resimler/kitaplar/9414_buyuk.jpg',
    );
  });

  it('Türkçe telifte orijinal adı tekrar etmez', () => {
    // Site Türkçe kitapta orijinal adı kitabın adıyla aynı yazıyor; künyede
    // aynı satır iki kez görünmesin
    const payload = translatedPayload();
    const sonuc = payload.props.pageProps.response._sonuc;
    sonuc.kitap.adi = 'Kürk Mantolu Madonna';
    sonuc.kitap.yazarGruplari = [
      {
        turId: 1,
        turAdi: 'Yazar',
        yazarlar: [{ id: '5', adi: 'Sabahattin Ali' }],
      },
    ];
    sonuc.liste[0].hakkinda.baskiBilgileri.orijinalAdi = 'Kürk Mantolu Madonna';

    const detail = toDetail(payload, 'kurk-mantolu-madonna--1');
    expect(detail?.source.originalTitle).toBeNull();
    expect(detail?.translator).toBeNull();
  });

  it('ilişkisel künye için kişileri rolleri ve kimlikleriyle çıkarır', () => {
    // Kimlik, ilişkisel modelin birincil eşleştirme anahtarı; kaybolursa
    // "Erikson, Steven" ile "Steven Erikson" ayrı kişi olur
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.credits.people).toEqual([
      {
        binKitapId: '566',
        name: 'Harper Lee',
        seoName: 'harper-lee',
        photo: null,
        role: 'AUTHOR',
        orderIndex: 0,
      },
      {
        binKitapId: '1201',
        name: 'Ülker İnce',
        seoName: 'ulker-ince',
        photo: null,
        role: 'TRANSLATOR',
        orderIndex: 0,
      },
      {
        binKitapId: '9002',
        name: 'Bilge Sancı',
        seoName: 'bilge-sanci',
        photo: null,
        role: 'EDITOR',
        orderIndex: 0,
      },
    ]);
  });

  it('türleri kimlikleriyle, yayınevini adıyla verir', () => {
    // Kaynak türe kimlik veriyor, yayınevine vermiyor (ölçüldü)
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.credits.genres[0]).toEqual({
      binKitapId: '17',
      name: 'Dünya Klasikleri',
    });
    expect(detail?.credits.publisher).toBe('Sel Yayınları');
  });

  it('sahte seriyi ilişkisel künyeye de yazmaz', () => {
    const detail = toDetail(translatedPayload(), 'bulbulu-oldurmek--939');
    expect(detail?.credits.series).toBeNull();
  });

  it('boş yanıtta çökmez', () => {
    expect(toDetail(null, 'x')).toBeNull();
    expect(toDetail({}, 'x')).toBeNull();
    expect(
      toDetail({ props: { pageProps: { response: { _sonuc: {} } } } }, 'x'),
    ).toBeNull();
  });
});

describe('extractNextData', () => {
  it('gömülü JSON verisini okur', () => {
    const html = `<html><body><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}}}</script></body></html>`;
    expect(extractNextData(html)).toEqual({ props: { pageProps: {} } });
  });

  it('etiket yoksa null döner', () => {
    expect(extractNextData('<html><body>engellendi</body></html>')).toBeNull();
  });

  it('bozuk JSON karşısında fırlatmaz', () => {
    const html = `<script id="__NEXT_DATA__" type="application/json">{bozuk</script>`;
    expect(extractNextData(html)).toBeNull();
  });
});
