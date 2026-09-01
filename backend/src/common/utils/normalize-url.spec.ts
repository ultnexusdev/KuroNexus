import { normalizeUrl } from './normalize-url';

describe('normalizeUrl', () => {
  it('yerel yolu BOZMAZ - D-B6 hatasinin testi', () => {
    // Uc kopyada bu girdi `https:///uploads/kapak.jpg`e cevriliyordu.
    expect(normalizeUrl('/uploads/books/kapak.jpg')).toBe(
      '/uploads/books/kapak.jpg',
    );
    expect(normalizeUrl('/kadro/oyuncu.png')).toBe('/kadro/oyuncu.png');
  });

  it('semasiz adrese https ekler', () => {
    expect(normalizeUrl('imdb.com/title/tt0111161')).toBe(
      'https://imdb.com/title/tt0111161',
    );
  });

  it('semali adrese dokunmaz', () => {
    expect(normalizeUrl('https://example.com/a')).toBe('https://example.com/a');
    expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    expect(normalizeUrl('HTTPS://EXAMPLE.COM')).toBe('HTTPS://EXAMPLE.COM');
  });

  it('bos girdilerde null doner', () => {
    expect(normalizeUrl('')).toBeNull();
    expect(normalizeUrl('   ')).toBeNull();
    expect(normalizeUrl(null)).toBeNull();
    expect(normalizeUrl(undefined)).toBeNull();
  });

  it('bastaki ve sondaki bosluklari kirpar', () => {
    expect(normalizeUrl('  example.com  ')).toBe('https://example.com');
  });
});
