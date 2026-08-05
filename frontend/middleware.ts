import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Yapım aşaması kapısı (HTTP Basic Auth).
 *
 * Amacı güvenlik DEĞİL, **görünürlük**: site geliştirme sürerken arama
 * motorlarının ve kurumsal içerik filtrelerinin sayfaları taramasını
 * engelliyor. Gerçek yetkilendirme her zamanki gibi backend'de (JWT + guard).
 *
 * ⚠️ Kimlik bilgileri KODA YAZILMAZ, ortam değişkeninden okunur. Değişken adları
 * bilinçli olarak `NEXT_PUBLIC_` ÖNEKSİZ: `NEXT_PUBLIC_*` değerleri tarayıcıya
 * gönderilen paketin içine gömülür, yani şifre herkese açık hâle gelirdi.
 *
 * Kapı yalnızca iki değişken de tanımlıysa devreye girer. Tanımsızlarsa site
 * normal çalışır — kapıyı kaldırmak için değişkenleri silmek yeterli, kod
 * değişikliği ve deploy gerekmez.
 */
function buildGate(request: NextRequest): NextResponse | null {
  const user = process.env.SITE_BASIC_AUTH_USER;
  const password = process.env.SITE_BASIC_AUTH_PASSWORD;
  if (!user || !password) {
    return null;
  }
  // Kendi bilgisayarında geliştirirken şifre sorulmaz
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    // Şifre iki nokta içerebilir: yalnızca İLK ayırıcıdan bölünür
    const separator = decoded.indexOf(":");
    if (
      separator !== -1 &&
      decoded.slice(0, separator) === user &&
      decoded.slice(separator + 1) === password
    ) {
      return null;
    }
  }

  return new NextResponse("KuroNexus şu anda yapım aşamasındadır.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="KuroNexus"',
      // Ara sunucular ve tarayıcılar bu yanıtı saklamasın
      "Cache-Control": "no-store",
    },
  });
}

export default function middleware(request: NextRequest) {
  // Kanonik host: www → non-www kalıcı yönlendirme (SEO, mükerrer içerik önlemi)
  const host = request.headers.get("host");
  if (host?.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.port = "";
    // Reverse proxy (Traefik) arkasında gerçek protokolü koru — tek atlamada https'e git
    if (request.headers.get("x-forwarded-proto") === "https") {
      url.protocol = "https:";
    }
    return NextResponse.redirect(url, 301);
  }

  // Yönlendirmeden SONRA, dil yönlendirmesinden ÖNCE: kapı hiçbir içerik
  // üretilmeden devreye girsin.
  const gate = buildGate(request);
  if (gate) {
    return gate;
  }

  return intlMiddleware(request);
}

export const config = {
  // API route'ları, Next internals ve statik dosyalar hariç tüm istekler
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
