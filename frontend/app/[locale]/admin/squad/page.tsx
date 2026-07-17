"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  createSquadOverride,
  deleteSquadOverride,
  fetchSquadOverrides,
  uploadImage,
  type SquadOverride,
} from "@/lib/admin/api";
import { fetchFootballSquad } from "@/lib/api/football";
import type { FootballSquadPlayer } from "@/lib/api/types";
import styles from "../transfer-news/page.module.css";

/**
 * Kadro düzeltmeleri. Transfermarkt veri seti yaz transferlerini geç
 * yansıttığı için ayrılan oyuncular kadroda kalıyor, yeni transferler
 * görünmüyor. Buradaki düzeltmeler sync'in üstüne biner ve kalıcıdır.
 */
export default function SquadAdminPage() {
  const t = useTranslations("admin.squad");
  const [squad, setSquad] = useState<FootballSquadPlayer[]>([]);
  const [overrides, setOverrides] = useState<SquadOverride[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState("");

  const refresh = useCallback(() => {
    fetchFootballSquad()
      .then((s) => setSquad(s.players ?? []))
      .catch(console.error);
    fetchSquadOverrides().then(setOverrides).catch(console.error);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hide = async (player: FootballSquadPlayer) => {
    if (!confirm(t("confirmHide", { name: player.name }))) return;
    try {
      await createSquadOverride({ tmPlayerId: player.id });
      refresh();
    } catch (e) {
      console.error(e);
      alert(t("error"));
    }
  };

  const undo = async (id: string) => {
    try {
      await deleteSquadOverride(id);
      refresh();
    } catch (e) {
      console.error(e);
      alert(t("error"));
    }
  };

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert(t("nameRequired"));
      return;
    }
    setIsSubmitting(true);
    try {
      await createSquadOverride({
        name,
        position: position || undefined,
        age: age ? Number(age) : undefined,
        photo: photo || undefined,
      });
      setName("");
      setPosition("");
      setAge("");
      setPhoto("");
      refresh();
    } catch (err) {
      console.error(err);
      alert(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hidden = overrides.filter((o) => o.tmPlayerId);
  const added = overrides.filter((o) => !o.tmPlayerId);

  return (
    <AdminGuard>
      <div className={styles.page}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.empty}>{t("intro")}</p>

        {/* Yeni transfer ekle */}
        <form className={styles.form} onSubmit={addPlayer}>
          <h2 className={styles.title}>{t("addTitle")}</h2>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sq-name">
                {t("name")}
              </label>
              <input
                id="sq-name"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sq-pos">
                {t("position")}
              </label>
              <input
                id="sq-pos"
                className={styles.input}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={t("positionPlaceholder")}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sq-age">
                {t("age")}
              </label>
              <input
                id="sq-age"
                type="number"
                className={styles.input}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sq-photo">
                {t("photo")}
              </label>
              <input
                id="sq-photo"
                type="file"
                accept="image/*"
                className={styles.input}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const uploaded = await uploadImage(file);
                    setPhoto(uploaded.url);
                  } catch (err) {
                    console.error(err);
                    alert(t("error"));
                  }
                }}
              />
              {photo ? <span className={styles.hint}>{t("photoReady")}</span> : null}
            </div>
          </div>
          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("add")}
          </button>
        </form>

        {/* Mevcut kadro — ayrılanı gizle */}
        <h2 className={styles.title}>{t("currentSquad", { count: squad.length })}</h2>
        <ul className={styles.list}>
          {squad.map((p) => (
            <li key={p.id} className={styles.item}>
              {p.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.photo} alt="" className={styles.photo} />
              ) : null}
              <span className={styles.itemMeta}>
                <span className={styles.itemTitle}>{p.name}</span>
                <span className={styles.itemSub}>
                  {[p.position, p.age ? `${p.age}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              {p.id.startsWith("manual:") ? (
                <span className={styles.hint}>{t("manualBadge")}</span>
              ) : (
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => hide(p)}
                >
                  {t("hide")}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Yapılan düzeltmeler — geri alınabilir */}
        {overrides.length > 0 ? (
          <>
            <h2 className={styles.title}>{t("overridesTitle")}</h2>
            <ul className={styles.list}>
              {hidden.map((o) => (
                <li key={o.id} className={styles.item}>
                  <span className={styles.itemMeta}>
                    <span className={styles.itemTitle}>
                      {t("hiddenLabel", { id: o.tmPlayerId ?? "" })}
                    </span>
                    <span className={styles.itemSub}>{t("hiddenSub")}</span>
                  </span>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() => undo(o.id)}
                  >
                    {t("undo")}
                  </button>
                </li>
              ))}
              {added.map((o) => (
                <li key={o.id} className={styles.item}>
                  <span className={styles.itemMeta}>
                    <span className={styles.itemTitle}>{o.name}</span>
                    <span className={styles.itemSub}>{t("addedSub")}</span>
                  </span>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() => undo(o.id)}
                  >
                    {t("remove")}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </AdminGuard>
  );
}
