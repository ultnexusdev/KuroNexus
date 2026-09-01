import { isInternalRequest } from './app-throttler.guard';

describe('isInternalRequest', () => {
  it('Docker ic agindan gelen SSR istegini tanir', () => {
    expect(isInternalRequest({ ip: '172.18.0.5', ips: [], headers: {} })).toBe(
      true,
    );
  });

  it('loopback ve IPv6 eslemesi de ic sayilir', () => {
    expect(isInternalRequest({ ip: '127.0.0.1', headers: {} })).toBe(true);
    expect(isInternalRequest({ ip: '::1', headers: {} })).toBe(true);
    expect(isInternalRequest({ ip: '::ffff:10.0.0.9', headers: {} })).toBe(
      true,
    );
  });

  it('Traefik uzerinden gelen gercek ziyaretci muaf DEGIL', () => {
    expect(
      isInternalRequest({
        ip: '85.104.12.7',
        ips: ['85.104.12.7'],
        headers: { 'x-forwarded-for': '85.104.12.7' },
      }),
    ).toBe(false);
  });

  it('ozel IP taklit edilse bile X-Forwarded-For varsa muafiyet YOK', () => {
    // Saldirgan basligi kendi eklese Traefik onu listeye ekler; bu test o
    // durumda muafiyetin kapali kaldigini sabitler.
    expect(
      isInternalRequest({
        ip: '172.18.0.5',
        headers: { 'x-forwarded-for': '172.18.0.5' },
      }),
    ).toBe(false);
  });

  it('basliksiz ama public IP ic sayilmaz', () => {
    expect(isInternalRequest({ ip: '85.104.12.7', headers: {} })).toBe(false);
  });

  it('172.32 gibi ozel OLMAYAN aralik disarida kalir', () => {
    expect(isInternalRequest({ ip: '172.32.0.1', headers: {} })).toBe(false);
    expect(isInternalRequest({ ip: '172.15.0.1', headers: {} })).toBe(false);
  });

  it('IP bilinmiyorsa muafiyet vermez', () => {
    expect(isInternalRequest({ headers: {} })).toBe(false);
  });
});
