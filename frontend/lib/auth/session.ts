import { cache } from "react";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api/client";
import type { AuthenticatedUser } from "@/lib/api/types";

const TOKEN_COOKIE = "kuronexus-token";

/**
 * "Bu ziyaretçi admin mi?" sorusunun sunucu tarafındaki tek yanıtı.
 *
 * Rol token'dan OKUNAMAZ: `auth.service` payload'a yalnızca `{ sub, email }`
 * koyuyor ve guard rolü her istekte veritabanından doğruluyor (kural 6). Bu
 * yüzden burada da kaynağına soruluyor — `GET /auth/me`. Token yoksa istek
 * hiç yapılmaz, yani ziyaretçiye ek maliyet çıkmaz; süresi dolmuş ya da
 * iptal edilmiş token 401 döner ve ziyaretçi sayılır.
 *
 * Bu bilgi yalnızca arayüzde düzenleme kontrollerini gösterip gizlemek için;
 * gerçek yetki zaten her istekte backend'de doğrulanıyor. `cache()` aynı
 * render sırasında (layout + sayfa) tek istekle yetinilmesini sağlar.
 */
export const readIsAdmin = cache(async (): Promise<boolean> => {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return false;
  }
  try {
    const user = await apiFetch<AuthenticatedUser>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return user.role === "ADMIN";
  } catch {
    // Geçersiz token ya da API'ye ulaşılamaması: sayfa ziyaretçi gibi render
    // edilir, çökmez (kural 4 ruhu)
    return false;
  }
});
