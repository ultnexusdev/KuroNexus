"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import styles from "./DoorWall.module.css";

/**
 * "Gece Müzesi" giriş holünün kapı duvarı.
 * Her kapı bir kanadın aralık kapısıdır: içinden o kanadın atmosferi
 * (kendi renk sızıntısı + kapak görseli) görünür. Hover'da aralık açılır,
 * ışık içeri dolar ve imleci hafifçe takip eder. prefers-reduced-motion'da
 * tüm hareket kapalıdır (CSS tarafında).
 */

export interface Door {
  slug: string;
  name: string;
  href: string;
  coverImage?: string | null;
  hall: number;
  count?: number;
  sealed?: boolean; // Temürkan: balmumu mühürlü baş köşe
}

// Bilinen kanat atmosferleri (slug → globals.css token anahtarı);
// listede olmayan yeni kategoriler --door-default-*'a düşer (modüler)
const ATMOSPHERE_KEYS: Record<string, string> = {
  film: "film",
  dizi: "dizi",
  spor: "spor",
  anime: "anime",
  "kadim-dunyalar": "kadim",
};

function doorAtmosphere(slug: string): React.CSSProperties {
  const key = ATMOSPHERE_KEYS[slug] ?? "default";
  return {
    "--leak": `var(--door-${key}-a)`,
    "--room": `var(--door-${key}-b)`,
  } as React.CSSProperties;
}

function WaxSeal({ label }: { label: string }) {
  return (
    <svg
      className={styles.waxSeal}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
    >
      {/* Balmumu: hafif düzensiz kenarlı damla */}
      <path
        d="M32 3c8-2 17 2 22 9 5 6 6 15 3 22-2 6 1 10-2 16-3 7-12 12-21 11-8-1-15 2-21-3C7 53 3 45 4 37 5 30 2 24 6 17 10 9 23 5 32 3Z"
        fill="currentColor"
      />
      {/* Mühür baskısı: Orhun 𐱅 (T) — Temürkan'ın kadim harfi */}
      <text
        x="32"
        y="42"
        textAnchor="middle"
        className={styles.waxGlyph}
        aria-hidden
      >
        {"\u{10C45}"}
      </text>
    </svg>
  );
}

export function DoorWall({ doors }: { doors: Door[] }) {
  const t = useTranslations("home");

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <nav className={styles.wall} aria-label={t("indexTitle")}>
      {doors.map((door) => (
        <Link
          key={door.slug}
          href={door.href}
          className={`${styles.door} ${door.sealed ? styles.sealed : ""}`}
          style={doorAtmosphere(door.sealed ? "kadim-dunyalar" : door.slug)}
          onMouseMove={handleMove}
        >
          {door.coverImage ? (
            <Image
              src={apiUrl(door.coverImage)}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 18vw"
              className={styles.doorImg}
            />
          ) : null}
          <span className={styles.room} aria-hidden />
          <span className={styles.leak} aria-hidden />
          <span className={styles.cursorLight} aria-hidden />

          <span className={styles.hallNo}>
            {t("hall", { num: String(door.hall).padStart(2, "0") })}
          </span>

          {door.sealed ? <WaxSeal label={t("sealAria")} /> : null}

          <span className={styles.doorMeta}>
            <span className={styles.doorName}>{door.name}</span>
            <span className={styles.doorSub}>
              {door.sealed
                ? t("sealedSub")
                : door.count !== undefined
                  ? t("worldsCount", { count: door.count })
                  : t("enter")}
            </span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
