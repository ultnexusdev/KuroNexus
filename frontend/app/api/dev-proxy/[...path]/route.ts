import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api/client";

/**
 * Yalnızca geliştirme köprüsü.
 *
 * Genel sayfalar veriyi Next sunucusundan çeker, orada CORS yoktur. Admin
 * ekranları ise tarayıcıdan istek atar ve canlı API `http://localhost:3000`
 * kaynağını tanımadığı için tarayıcı isteği düşürür. Bu rota o istekleri kendi
 * sunucumuz üzerinden geçirir — sunucudan sunucuya çağrıda CORS devrede olmaz.
 *
 * Üretimde tamamen kapalıdır (404): canlı site zaten aynı kaynaktan konuşur,
 * açık kalması gereksiz bir yol açardı.
 */

export const dynamic = "force-dynamic";

const ENABLED = process.env.NODE_ENV !== "production";

// Kimlik ve gövde tipi dışındaki başlıklar taşınmaz — kopyalanan Host/Origin
// başlıkları hedefte yanlış eşleşmelere yol açar.
// `cookie` şart: oturum token'ı artık HttpOnly çerezde ve tarayıcı onu bu
// köprüye gönderiyor; buradan API'ye taşınmazsa lokalde her istek 401 döner.
const FORWARDED_HEADERS = ["authorization", "content-type", "cookie"];

async function forward(
  request: NextRequest,
  segments: string[],
): Promise<Response> {
  if (!ENABLED) {
    return new Response(null, { status: 404 });
  }

  const path = segments.map((segment) => encodeURIComponent(segment)).join("/");
  const target = `${API_BASE_URL}/${path}${request.nextUrl.search}`;

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      // Dosya yüklemesi de geçebilsin diye gövde ham baytlar olarak taşınır
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });

    const outHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) {
      outHeaders.set("content-type", contentType);
    }
    // Giriş/çıkış yanıtındaki çerez tarayıcıya ulaşmalı, yoksa lokalde
    // oturum hiç açılmaz. `getSetCookie` birden fazla çerezi de korur.
    for (const cookie of response.headers.getSetCookie()) {
      outHeaders.append("set-cookie", cookie);
    }
    return new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: outHeaders,
    });
  } catch {
    // API'ye ulaşılamadıysa admin ekranı kendi hata mesajını göstersin
    return Response.json({ message: "API.REQUEST_FAILED" }, { status: 502 });
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  const { path } = await context.params;
  return forward(request, path);
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
