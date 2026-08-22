import { apiFetch } from "./client";
import type { AuthenticatedUser, LoginResult } from "./types";

/**
 * Kimlik uçları — `lib/admin/api.ts`ten buraya taşındı (2026-08-22 denetimi).
 *
 * NEDEN AYRI DOSYA: `AccountMenu` her sayfanın header'ında ve login/logout'u
 * admin monolitinden alıyordu. Admin sayfaları o modülün ~90 export'unun
 * neredeyse hepsini kullandığı için webpack modülü BÖLEMİYOR ve 1710 satırlık
 * dosyanın tamamı (bütün /admin/* uç sarmalayıcıları) her anonim ziyaretçinin
 * paylaşılan parçasına giriyordu (ölçüm: chunk 1779-*, 13.8 KB). Kimlik üçlüsü
 * yalnızca `apiFetch`e bağımlı — kendi modülünde durunca header o zinciri
 * hiç çekmiyor. Admin tarafı için `lib/admin/api.ts` aynı adları yeniden
 * export ediyor; çağıran kod değişmedi.
 *
 * Kimlik isteklere elle eklenmiyor: token HttpOnly çerezde duruyor ve
 * tarayıcı onu her isteğe kendisi ekliyor (`apiFetch` içindeki
 * `credentials: "include"`). JavaScript çerezi okuyamadığı için zaten
 * `Authorization` başlığı kuramaz.
 */
export function login(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/** Çerezi sunucu yazdı, silmesi de onun işi. */
export function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function fetchMe(): Promise<AuthenticatedUser> {
  return apiFetch<AuthenticatedUser>("/auth/me");
}
