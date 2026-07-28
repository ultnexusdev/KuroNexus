import { cookies } from "next/headers";

const TOKEN_COOKIE = "kuronexus-token";

/**
 * "Bu ziyaretçi admin mi?" sorusunun sunucu tarafındaki tek yanıtı.
 *
 * JWT'nin imzası burada DOĞRULANMAZ. Bu bilgi yalnızca arayüzde düzenleme
 * kontrollerini gösterip gizlemek için kullanılır; gerçek yetki her istekte
 * backend'de doğrulanır (AGENTS.md kural 6). Sahte bir çerezle düğmeleri gören
 * biri hiçbir işlem yapamaz — korumalı uçlar 401 döner.
 *
 * Bu yüzden bu daldan gizli veri geçirilmemeli: yalnızca kontroller açılır.
 */
export async function readIsAdmin(): Promise<boolean> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return false;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    ) as { role?: string };
    return payload.role === "ADMIN";
  } catch {
    // Bozuk/eksik token: ziyaretçi sayılır
    return false;
  }
}
