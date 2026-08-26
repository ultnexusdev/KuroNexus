import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_NODES,
  GOJO_S08,
  GOJO_S08_NODE_SLOT,
  GOJO_S08_TEACHER_SLOT,
} from "@/lib/characters/satoru-gojou-experience";
import { ConstellationMap } from "./ConstellationMap";
import { CuratedImage } from "./CuratedImage";
import styles from "./GojoExperience.module.css";

/**
 * P08 · CONNECTIONS — takımyıldız.
 *
 * Merkezde Gojō, çevresinde yedi düğüm. Yörünge çizgileri merkeze ASLA
 * değmiyor: hem geometri (çizgi %18 yarıçapta duruyor, portrenin yarıçapı
 * ~%11) hem de çizginin kendi gradyanı onları merkezden önce bitiriyor.
 *
 * ── GÖRSEL AĞIN ALTINDA `sr-only` LİSTE ──────────────────────────────────
 * BRIEF şartı. Liste haritanın ÖZETİ değil, aynı verinin ikinci sunumu:
 * yedi ismin tamamı, dereceleri ve ilişki açıklamalarıyla birlikte. Yani
 * harita hiç çizilmese (JS yok, dar ekran, ekran okuyucu) bölüm eksiksiz.
 *
 * ── ETİKET DİSİPLİNİ ─────────────────────────────────────────────────────
 * Derecesi kesin olanlarda derece, olmayanlarda rol yazılı — uydurma
 * derece yok (gerekçe veri dosyasında).
 */
export function ConnectionsSection({
  locale,
  isAdmin,
  src,
  images,
}: {
  locale: string;
  isAdmin: boolean;
  src: string | null;
  images: Map<string, string>;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  const nodes = GOJO_NODES.map((node) => ({
    key: node.key,
    name: node.name,
    tag: say(node.tag),
    text: say(node.text),
  }));

  /* Düğüm siluetleri — YALNIZCA görsel bağlıysa çiziliyor.
     Boş yuvayı düğmenin içinde göstermek anlamsız olurdu: orada
     tasarlanmış boşluk yerine renkli nokta çok daha temiz duruyor ve
     brief'in "minimalist" tarifine de o uyuyor. Boş yuvalara küratör
     aşağıdaki şeritten ulaşıyor. */
  const nodeArt: Record<string, React.ReactNode> = {};
  for (const node of GOJO_NODES) {
    const slot = GOJO_S08_NODE_SLOT(node.key);
    const url = images.get(slot.key);
    if (!url) continue;
    nodeArt[node.key] = (
      <CuratedImage
        slotId={slot.key}
        spec={node.name}
        aspect={slot.aspect}
        src={url}
        isAdmin={isAdmin}
        characterId={GOJO_ID}
        curatorLabel={say(GOJO_CURATOR.upload)}
        statusLabel={say(GOJO_CURATOR.missing)}
        sizes="48px"
        /* ⚠️ `<button>` içinde: ikinci etkileşimli öğe geçersiz HTML. */
        noEdit
      />
    );
  }

  return (
    <div className={styles.web}>
      <div className={styles.webInner}>
        <h2 className={styles.webTitle} id="gojo-connections-title">
          {say(GOJO_S08.title)}
        </h2>
        <p className={styles.webLede}>{say(GOJO_S08.lede)}</p>

        <ConstellationMap
          nodes={nodes}
          idleLabel={say(GOJO_S08.idle)}
          keyHint={say(GOJO_S08.keyHint)}
          centerLabel={say(GOJO_S08.centerLabel)}
          nodeArt={nodeArt}
          centerSlot={
            <CuratedImage
              slotId={GOJO_S08_TEACHER_SLOT.key}
              spec={say(GOJO_S08_TEACHER_SLOT.spec)}
              aspect={GOJO_S08_TEACHER_SLOT.aspect}
              src={src}
              alt={say(GOJO_S08_TEACHER_SLOT.alt)}
              isAdmin={isAdmin}
              characterId={GOJO_ID}
              curatorLabel={say(GOJO_CURATOR.upload)}
              statusLabel={say(GOJO_CURATOR.missing)}
              glyph="師"
              sizes="176px"
            />
          }
        />

        {/* Küratör şeridi — YALNIZCA yöneticinin DOM'unda.
            Düğüm siluetleri düğmelerin içinde `noEdit` ile çizildiği
            için yedi yuvaya erişilebilen tek yer burası. */}
        {isAdmin ? (
          <div className={styles.webCurator}>
            {GOJO_NODES.map((node) => {
              const slot = GOJO_S08_NODE_SLOT(node.key);
              return (
                <CuratedImage
                  key={slot.key}
                  slotId={slot.key}
                  spec={`${node.name} — ${say(GOJO_S08.nodeSpec)}`}
                  aspect={slot.aspect}
                  src={images.get(slot.key) ?? null}
                  isAdmin={isAdmin}
                  characterId={GOJO_ID}
                  curatorLabel={say(GOJO_CURATOR.upload)}
                  statusLabel={say(GOJO_CURATOR.missing)}
                  glyph="影"
                  sizes="160px"
                />
              );
            })}
          </div>
        ) : null}

        {/* Görsel ağın `sr-only` karşılığı — aynı verinin ikinci sunumu. */}
        <h3 className={styles.srOnly}>{say(GOJO_S08.listLabel)}</h3>
        <ul className={`${styles.webList} ${styles.srOnly}`}>
          {GOJO_NODES.map((node) => (
            <li key={node.key}>
              {node.name} — {say(node.tag)}. {say(node.text)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
