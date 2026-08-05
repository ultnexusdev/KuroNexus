"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { fetchMe, login, logout } from "@/lib/admin/api";
import { ApiError } from "@/lib/api/client";
import styles from "./AdminGuard.module.css";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  // İlk render SSR ile eşleşmeli — token ancak mount sonrası okunur
  const [status, setStatus] = useState<"checking" | "anonymous" | "authed">(
    "checking",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<"invalid" | "rateLimited" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Oturum artık çerezden OKUNAMAZ (HttpOnly) — tek doğru kaynak sunucu.
  // `/auth/me` 200 dönerse girişliyiz, 401 dönerse değiliz.
  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then(() => {
        if (!cancelled) setStatus("authed");
      })
      .catch(() => {
        if (!cancelled) setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Çerezi sunucu yazar; burada dönen yanıttan alınacak bir token yok.
      await login(email, password);
      setStatus("authed");
    } catch (err) {
      setError(err instanceof ApiError && err.status === 429 ? "rateLimited" : "invalid");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "checking") {
    return null;
  }

  if (status === "anonymous") {
    return (
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 className={styles.loginTitle}>{t("login.title")}</h1>
        <label className={styles.field}>
          <span>{t("login.email")}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label className={styles.field}>
          <span>{t("login.password")}</span>
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
              {showPassword ? t("login.hidePassword") : t("login.showPassword")}
            </button>
          </div>
        </label>
        {error ? (
          <p className={styles.error}>
            {error === "rateLimited"
              ? t("login.rateLimited")
              : t("login.error")}
          </p>
        ) : null}
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? t("login.submitting") : t("login.submit")}
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className={styles.topBar}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            // Çıkış isteği başarısız olsa bile arayüzü kilitli bırakmayız;
            // sunucu tarafındaki çerez bir sonraki denemede yine silinir.
            void logout().finally(() => setStatus("anonymous"));
          }}
        >
          {t("logout")}
        </button>
      </div>
      {children}
    </div>
  );
}
