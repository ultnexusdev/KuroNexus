"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { login } from "@/lib/admin/api";
import { clearToken, getToken, setToken } from "@/lib/admin/auth";
import styles from "./AdminGuard.module.css";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  // İlk render SSR ile eşleşmeli — token ancak mount sonrası okunur
  const [status, setStatus] = useState<"checking" | "anonymous" | "authed">(
    "checking",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStatus(getToken() ? "authed" : "anonymous");
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const result = await login(email, password);
      setToken(result.accessToken);
      setStatus("authed");
    } catch {
      setError(true);
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
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className={styles.error}>{t("login.error")}</p> : null}
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
            clearToken();
            setStatus("anonymous");
          }}
        >
          {t("logout")}
        </button>
      </div>
      {children}
    </div>
  );
}
