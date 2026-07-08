import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // API route'ları, Next internals ve statik dosyalar hariç tüm istekler
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
