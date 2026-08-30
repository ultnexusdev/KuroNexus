"use client";

import { useId, useState, type ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import styles from "./SocietySection.module.css";

/**
 * TOPLUM PANOSU — istemci adası.
 *
 * İki seviye seçim: kurum (3) → üye (kurum başına 6–13). Kurum değişince
 * üye sıfırlanır (mockup davranışı). Kurum kareleri `frames[i]` olarak
 * sunucudan geliyor; hepsi DOM'da durur, görünen `data-on` ile seçilir —
 * böylece küratör düzenleyicisi ve yüklenen kare istemci durumuna rağmen
 * sunucu çıktısında yaşar.
 */
export interface SocietyMemberView {
  name: string;
  grade: string;
  tech: string;
  domain: string;
  status: string;
  line: string;
  href: string | null;
}

export interface SocietyBranchView {
  key: string;
  jp: string;
  en: string;
  note: string;
  stats: { label: string; value: string }[];
  people: SocietyMemberView[];
}

export function SocietyBoard({
  branches,
  frames,
  labels,
}: {
  branches: SocietyBranchView[];
  frames: ReactNode[];
  labels: {
    branchesAria: string;
    rosterAria: string;
    grade: string;
    tech: string;
    domain: string;
    status: string;
    file: string;
  };
}) {
  const [branchIndex, setBranchIndex] = useState(0);
  const [memberIndex, setMemberIndex] = useState(0);
  const baseId = useId();

  const branch = branches[branchIndex];
  const member = branch.people[Math.min(memberIndex, branch.people.length - 1)];

  return (
    <div className={styles.board}>
      {/* ── KURUM SEKMELERİ ─────────────────────────────────────────── */}
      <div role="tablist" aria-label={labels.branchesAria} className={styles.tabs}>
        {branches.map((item, i) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={i === branchIndex}
            aria-controls={`${baseId}-branch`}
            tabIndex={i === branchIndex ? 0 : -1}
            className={styles.tab}
            data-on={i === branchIndex ? "" : undefined}
            onClick={() => {
              setBranchIndex(i);
              setMemberIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const delta = e.key === "ArrowRight" ? 1 : -1;
                const next = (i + delta + branches.length) % branches.length;
                setBranchIndex(next);
                setMemberIndex(0);
                (
                  e.currentTarget.parentElement?.children[next] as HTMLElement
                )?.focus();
              }
            }}
          >
            <span className={styles.tabJp} lang="ja" aria-hidden="true">
              {item.jp}
            </span>
            <span className={styles.tabEn}>{item.en}</span>
          </button>
        ))}
      </div>

      <div id={`${baseId}-branch`} role="tabpanel" className={styles.branch}>
        {/* Kurum karesi + not + sayaçlar */}
        <div className={styles.identity}>
          {frames.map((frame, i) => (
            <span
              key={branches[i].key}
              className={styles.frameSeat}
              data-on={i === branchIndex ? "" : undefined}
            >
              {frame}
            </span>
          ))}
          <p className={styles.note}>{branch.note}</p>
          <dl className={styles.stats}>
            {branch.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Kadro listesi */}
        <ul className={styles.roster} aria-label={labels.rosterAria}>
          {branch.people.map((person, i) => (
            <li key={person.name}>
              <button
                type="button"
                className={styles.row}
                data-on={i === Math.min(memberIndex, branch.people.length - 1) ? "" : undefined}
                aria-pressed={i === Math.min(memberIndex, branch.people.length - 1)}
                onClick={() => setMemberIndex(i)}
              >
                <span className={styles.rowName}>{person.name}</span>
                <span className={styles.rowGrade}>{person.grade}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* KÂĞIT DOSYA — arşivin tek açık yüzeyi */}
        <article className={styles.paper} aria-label={`${labels.file}: ${member.name}`}>
          <p className={styles.paperEyebrow}>{labels.file}</p>
          <h3 className={styles.paperName}>
            {member.href ? (
              <Link href={member.href} className={styles.paperLink}>
                {member.name}
              </Link>
            ) : (
              member.name
            )}
          </h3>
          <dl className={styles.paperMeta}>
            <div>
              <dt>{labels.grade}</dt>
              <dd>{member.grade}</dd>
            </div>
            <div>
              <dt>{labels.tech}</dt>
              <dd>{member.tech}</dd>
            </div>
            <div>
              <dt>{labels.domain}</dt>
              <dd lang={member.domain === "—" ? undefined : "en"}>{member.domain}</dd>
            </div>
            <div>
              <dt>{labels.status}</dt>
              <dd data-alert={/shibuya|belirsiz|unknown/i.test(member.status) ? "" : undefined}>
                {member.status}
              </dd>
            </div>
          </dl>
          <p className={styles.paperLine}>{member.line}</p>
          <span className={styles.paperSeal} aria-hidden="true" lang="ja">
            呪
          </span>
        </article>
      </div>
    </div>
  );
}
