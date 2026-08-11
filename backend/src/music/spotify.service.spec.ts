import { buildUrl } from './spotify.service';

/**
 * `buildUrl` regresyon testleri.
 *
 * ── NEDEN VAR ─────────────────────────────────────────────────────────────
 * 11 Ağustos 2026: müzik sync'i canlıda her sanatçıda `MUSIC.SPOTIFY_
 * UNAVAILABLE` veriyordu. Sebep `url.searchParams.set`in virgülleri `%2C`
 * olarak kodlaması ve Spotify'ın buna **400 Bad Request** dönmesiydi:
 *
 *   ?include_groups=album%2Csingle%2Ccompilation   → 400
 *   ?include_groups=album,single,compilation       → 200
 *
 * Belirti sinsiydi: sanatçı künyesi (parametresiz istek) çalışıyordu,
 * diskografi çalışmıyordu — yani "Spotify bağlı" görünürken sync ölüydü.
 *
 * Bu test, birinin bir gün `buildUrl`u "daha temiz" diye `URLSearchParams`a
 * geri çevirmesini engelliyor. Kodu yeniden yazan biri yorumu okumayabilir;
 * kırmızı bir test okunur.
 */
describe('buildUrl', () => {
  it('virgülleri OLDUĞU GİBİ bırakır (Spotify %2C ile 400 dönüyor)', () => {
    const url = buildUrl('artists/abc/albums', {
      include_groups: 'album,single,compilation',
      limit: '50',
      offset: '0',
    });

    expect(url).toBe(
      'https://api.spotify.com/v1/artists/abc/albums' +
        '?include_groups=album,single,compilation&limit=50&offset=0',
    );
    // Asıl iddia: kodlanmış virgül YOK
    expect(url).not.toContain('%2C');
  });

  it('boşluğu kodlar — arama sorguları bozulmasın', () => {
    const url = buildUrl('search', { q: 'linkin park', type: 'artist' });
    expect(url).toBe(
      'https://api.spotify.com/v1/search?q=linkin%20park&type=artist',
    );
  });

  it('sorgu dizesini bozabilecek karakterleri kaçırır', () => {
    // `&` ve `=` kaçırılmazsa sorgu dizesine parametre enjekte edilebilirdi
    const url = buildUrl('search', { q: 'a&b=c', type: 'artist' });
    expect(url).toContain('q=a%26b%3Dc');
    expect(url).toContain('&type=artist');
    // Tek bir `&` ayırıcı olmalı (parametreler arasında), değerde değil
    expect(url.split('&')).toHaveLength(2);
  });

  it('Türkçe karakterleri kodlar', () => {
    const url = buildUrl('search', { q: 'müzik' });
    expect(url).toBe('https://api.spotify.com/v1/search?q=m%C3%BCzik');
  });

  it('parametre yoksa soru işareti eklemez', () => {
    expect(buildUrl('artists/abc', {})).toBe(
      'https://api.spotify.com/v1/artists/abc',
    );
  });
});
