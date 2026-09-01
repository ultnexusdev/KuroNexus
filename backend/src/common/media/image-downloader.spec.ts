import { detectExtension, isAllowedHost } from './image-downloader';

/**
 * Bu iki fonksiyon SSRF savunmasının 2. ve 4. katmanı. Kod iki serviste
 * kopyayken hiç testi yoktu; tekleştirildiği için artık tek yerden
 * sabitlenebiliyor (1 Eylul 2026 denetimi, D-B2).
 */
describe('isAllowedHost', () => {
  const allowed = new Set(['covers.openlibrary.org', 'archive.org', 'scdn.co']);

  it('tam eslesmeye izin verir', () => {
    expect(isAllowedHost('archive.org', allowed)).toBe(true);
    expect(isAllowedHost('covers.openlibrary.org', allowed)).toBe(true);
  });

  it('izinli alan adinin alt sunucusuna izin verir', () => {
    // Olculmus gercek zincir: ia801009.us.archive.org
    expect(isAllowedHost('ia801009.us.archive.org', allowed)).toBe(true);
    expect(isAllowedHost('image-cdn-01.scdn.co', allowed)).toBe(true);
  });

  it('buyuk/kucuk harf farkini yok sayar', () => {
    expect(isAllowedHost('ARCHIVE.ORG', allowed)).toBe(true);
  });

  it('izinsiz sunucuyu reddeder', () => {
    expect(isAllowedHost('evil.com', allowed)).toBe(false);
    expect(isAllowedHost('169.254.169.254', allowed)).toBe(false);
    expect(isAllowedHost('localhost', allowed)).toBe(false);
  });

  it('SONEK TUZAGINA dusmez - izinli adi iceren yabanci alan reddedilir', () => {
    // "archive.org.evil.com" izinli DEGIL; eslesme nokta sinirinda olmali.
    expect(isAllowedHost('archive.org.evil.com', allowed)).toBe(false);
    // "notarchive.org" da izinli degil (sonek eslesmesi noktayla basliyor).
    expect(isAllowedHost('notarchive.org', allowed)).toBe(false);
  });
});

describe('detectExtension', () => {
  function bytesOf(...values: number[]): Buffer {
    // 12 bayt taban: fonksiyon daha kisa girdiyi hic incelemiyor.
    const buffer = Buffer.alloc(16);
    values.forEach((value, index) => {
      buffer[index] = value;
    });
    return buffer;
  }

  it('JPEG imzasini tanir', () => {
    expect(detectExtension(bytesOf(0xff, 0xd8, 0xff))).toBe('.jpg');
  });

  it('PNG imzasini tanir', () => {
    expect(detectExtension(bytesOf(0x89, 0x50, 0x4e, 0x47))).toBe('.png');
  });

  it('GIF imzasini tanir', () => {
    expect(detectExtension(bytesOf(0x47, 0x49, 0x46, 0x38))).toBe('.gif');
  });

  it('WEBP imzasini tanir', () => {
    const buffer = Buffer.alloc(16);
    buffer.write('RIFF', 0, 'ascii');
    buffer.write('WEBP', 8, 'ascii');
    expect(detectExtension(buffer)).toBe('.webp');
  });

  it('gorsel olmayan icerikte null doner - uzanti adresten DEGIL icerikten', () => {
    // Adres ".jpg" ile bitse de icerik HTML ise dosya yazilmamali.
    const html = Buffer.from('<!doctype html><html></html>');
    expect(detectExtension(html)).toBeNull();
  });

  it('12 bayttan kisa girdiyi inceleme yapmadan reddeder', () => {
    expect(detectExtension(Buffer.from([0xff, 0xd8, 0xff]))).toBeNull();
  });
});
