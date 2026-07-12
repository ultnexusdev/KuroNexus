import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

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

  return intlMiddleware(request);
}

export const config = {
  // API route'ları, Next internals ve statik dosyalar hariç tüm istekler
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
