"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { login } from "@/lib/admin/api";
import { clearToken, setToken } from "@/lib/admin/auth";
import { ApiError } from "@/lib/api/client";
import type { Theme } from "@/lib/theme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./AccountMenu.module.css";

/**
 * Tercihler menüsü + oturum.
 *
 * Giriş formu burada yaşıyor ki düzenleme yapmak için `/admin`'e gitmek
 * gerekmesin: girişten sonra sayfa tazelenir, sunucu `isAdmin`i yeniden
 * hesaplar ve bulunduğun sayfadaki küratör kontrolleri belirir.
 * Kayıt YOK — tek kullanıcı admin (bkz. STATE.md, `/register` bilinçli kapalı).
 */
export function AccountMenu({
  initialTheme,
  isAdmin,
}: {
  initialTheme: Theme;
  isAdmin?: boolean;
}) {
  const t = useTranslations("account");
  const tLogin = useTranslations("admin.login");
  const [open, setOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<"invalid" | "rateLimited" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    let token: string;
    try {
      token = (await login(email, password)).accessToken;
    } catch (err) {
      // Yalnızca giriş isteğinin kendisi bu dalda raporlanır. Tazeleme buranın
      // içinde olsaydı, oradaki bir hata "şifren yanlış" gibi görünürdü.
      setError(
        err instanceof ApiError && err.status === 429 ? "rateLimited" : "invalid",
      );
      setSubmitting(false);
      return;
    }
    setToken(token);
    setPassword("");
    // Tam yeniden yükleme: çerez yazıldıktan sonra sayfa sunucudan `isAdmin`
    // ile yeniden gelir. Soft refresh yerine bunun tercih edilme sebebi,
    // girişin gözle görülür bir sonuç vermesi (kullanıcı geri bildirimi).
    window.location.reload();
  }

  function handleSignOut() {
    clearToken();
    window.location.reload();
  }

  return (
    <div className={styles.root} ref={rootRef}>
      {/* Girişli olduğun düğmenin kendisinden anlaşılsın — menüyü açmak
          gerekmesin */}
      <button
        type="button"
        className={isAdmin ? styles.triggerAdmin : styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {isAdmin ? t("adminBadge") : t("preferences")}
      </button>
      {open ? (
        <div className={styles.panel}>
          <div className={styles.content}>
            <div className={styles.sectionLabel}>{t("appearanceTab")}</div>
            <ThemeSwitcher initialTheme={initialTheme} />
          </div>

          <div className={styles.session}>
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className={styles.sessionLink}
                  onClick={() => setOpen(false)}
                >
                  {t("adminPanel")}
                </Link>
                <button
                  type="button"
                  className={styles.sessionAction}
                  onClick={handleSignOut}
                >
                  {t("signOut")}
                </button>
              </>
            ) : signingIn ? (
              <form className={styles.signInForm} onSubmit={handleSignIn}>
                <label className={styles.field}>
                  <span>{tLogin("email")}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="username"
                  />
                </label>
                <label className={styles.field}>
                  <span>{tLogin("password")}</span>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword
                        ? tLogin("hidePassword")
                        : tLogin("showPassword")}
                    </button>
                  </div>
                </label>
                {error ? (
                  <p className={styles.error}>
                    {error === "rateLimited"
                      ? tLogin("rateLimited")
                      : tLogin("error")}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={submitting}
                >
                  {submitting ? tLogin("submitting") : tLogin("submit")}
                </button>
              </form>
            ) : (
              <button
                type="button"
                className={styles.sessionAction}
                onClick={() => setSigningIn(true)}
              >
                {t("signIn")}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
