"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { useTranslations } from "next-intl";
import { apiUrl } from "@/lib/api/client";
import { uploadImage } from "@/lib/admin/api";
import { LoreMention } from "@/lib/editor/loreMention";
import { matchEntries, type LoreEntryRef } from "@/lib/editor/loreMatch";
import styles from "./RichTextEditor.module.css";

// "@" ile başlayan, henüz tamamlanmamış bir çağrı. Boşluğa izin verilir
// ("@Temür Kağan"), ama uzunluk sınırlıdır — aksi halde satır boyu açık kalır.
const MENTION_QUERY = /@([\p{L}\p{N}][\p{L}\p{N} '’_-]{0,29})?$/u;

interface SuggestionState {
  items: LoreEntryRef[];
  activeIndex: number;
  from: number;
  to: number;
  left: number;
  top: number;
}

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={active ? styles.buttonActive : styles.button}
      disabled={disabled}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const ALIGN_BAR_WIDTHS = [14, 9, 12];
const ALIGN_BAR_Y = [3, 7, 11];

function AlignIcon({ variant }: { variant: "left" | "center" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      {ALIGN_BAR_WIDTHS.map((width, index) => {
        const x =
          variant === "center"
            ? (16 - width) / 2
            : variant === "right"
              ? 15 - width
              : 1;
        return (
          <rect
            key={ALIGN_BAR_Y[index]}
            x={x}
            y={ALIGN_BAR_Y[index]}
            width={width}
            height={1.5}
            rx={0.75}
          />
        );
      })}
    </svg>
  );
}

export function RichTextEditor({
  content,
  onChange,
  loreEntries,
  onCursorEntryChange,
}: {
  content: string;
  onChange: (html: string) => void;
  /** Verilirse "@" ile lore bağlama açılır (yazım atölyesi). */
  loreEntries?: LoreEntryRef[];
  /** İmlecin üstündeki lore işaretinin kaydı — sağ künye paneli için. */
  onCursorEntryChange?: (entryId: string | null) => void;
}) {
  const t = useTranslations("admin.editor");
  const tWiki = useTranslations("wiki");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null);

  // Klavye yakalayıcısı editör kurulurken bir kez bağlanır; güncel duruma
  // ref üzerinden bakar (state'i kapatsa bayat veri görürdü).
  const suggestionRef = useRef<SuggestionState | null>(null);
  suggestionRef.current = suggestion;
  const loreRef = useRef<LoreEntryRef[]>(loreEntries ?? []);
  loreRef.current = loreEntries ?? [];
  const cursorEntryRef = useRef<string | null>(null);
  const editorRef = useRef<Editor | null>(null);

  function applySuggestion(index: number) {
    const current = suggestionRef.current;
    const activeEditor = editorRef.current;
    if (!current || !activeEditor) {
      return;
    }
    const entry = current.items[index];
    if (!entry) {
      return;
    }
    activeEditor
      .chain()
      .focus()
      .insertContentAt(
        { from: current.from, to: current.to },
        [
          {
            type: "text",
            text: entry.title,
            marks: [
              {
                type: "loreMention",
                attrs: { entryId: entry.id, entrySlug: entry.slug },
              },
            ],
          },
          { type: "text", text: " " },
        ],
      )
      .run();
    setSuggestion(null);
  }

  // İmleç konumuna göre: açık bir "@" çağrısı var mı, imleç bir işaretin
  // içinde mi? İkisi de her metin/seçim değişiminde yeniden hesaplanır.
  function refreshContext(current: Editor) {
    const entryId =
      (current.getAttributes("loreMention").entryId as string | undefined) ??
      null;
    if (entryId !== cursorEntryRef.current) {
      cursorEntryRef.current = entryId;
      onCursorEntryChange?.(entryId);
    }

    if (loreRef.current.length === 0) {
      setSuggestion(null);
      return;
    }

    const { selection } = current.state;
    if (!selection.empty) {
      setSuggestion(null);
      return;
    }
    const { $from } = selection;
    const textBefore = $from.parent.textBetween(
      0,
      $from.parentOffset,
      undefined,
      "￼",
    );
    const match = MENTION_QUERY.exec(textBefore);
    if (!match) {
      setSuggestion(null);
      return;
    }
    const items = matchEntries(loreRef.current, match[1] ?? "");
    if (items.length === 0) {
      setSuggestion(null);
      return;
    }
    const from = $from.pos - match[0].length;
    const coords = current.view.coordsAtPos(from);
    setSuggestion({
      items,
      activeIndex: 0,
      from,
      to: $from.pos,
      left: coords.left,
      top: coords.bottom,
    });
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      TextStyle,
      FontFamily,
      LoreMention,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: styles.content },
      handleKeyDown: (_view, event) => {
        const current = suggestionRef.current;
        if (!current) {
          return false;
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          const delta = event.key === "ArrowDown" ? 1 : -1;
          const next =
            (current.activeIndex + delta + current.items.length) %
            current.items.length;
          setSuggestion({ ...current, activeIndex: next });
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          applySuggestion(current.activeIndex);
          return true;
        }
        if (event.key === "Escape") {
          setSuggestion(null);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
      refreshContext(current);
    },
    onSelectionUpdate: ({ editor: current }) => {
      refreshContext(current);
    },
  });

  editorRef.current = editor;

  // Editör kapanırken künye paneli açık bir kayıtta takılı kalmasın
  useEffect(() => {
    return () => {
      onCursorEntryChange?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLink(current: Editor) {
    const previousUrl = current.getAttributes("link").href as
      | string
      | undefined;
    const url = window.prompt(t("linkPrompt"), previousUrl ?? "");
    if (url === null) {
      return;
    }
    if (url === "") {
      current.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    current.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) {
      return;
    }
    try {
      const result = await uploadImage(file);
      editor.chain().focus().setImage({ src: apiUrl(result.url) }).run();
    } catch {
      // Kapak görseli yüklemesindeki gibi: başarısızlıkta editör sessizce eski haliyle kalır
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar} role="toolbar">
        <select
          className={styles.fontSelect}
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              editor.chain().focus().setFontFamily(value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          value={editor.getAttributes("textStyle").fontFamily || ""}
        >
          <option value="">Varsayılan Font</option>
          <option value="var(--font-cinzel)">Epik Başlık (Cinzel)</option>
          {/* Düz font adı değil değişken: fontlar next/font ile self-host
              ediliyor ve üretilmiş bir ada sahipler. Eski kayıtlardaki düz
              adlar globals.css'teki köprü kurallarıyla çalışmaya devam ediyor. */}
          <option value="var(--font-corinthia), cursive">
            Şiirsel/Estetik (Corinthia)
          </option>
          <option value="var(--font-runic)">Göktürkçe (Orhun)</option>
        </select>
        
        <span className={styles.divider} />

        <ToolbarButton
          label={t("bold")}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label={t("italic")}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label={t("underline")}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span style={{ textDecoration: "underline" }}>U</span>
        </ToolbarButton>
        <ToolbarButton
          label={t("strike")}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span style={{ textDecoration: "line-through" }}>S</span>
        </ToolbarButton>

        <span className={styles.divider} />

        <ToolbarButton
          label={t("heading2")}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label={t("heading3") || "Epik Başlık"}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>H3 (Epik)</span>
        </ToolbarButton>

        <span className={styles.divider} />

        <ToolbarButton
          label={t("bulletList")}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          label={t("orderedList")}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          label={t("blockquote")}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          label={t("link")}
          active={editor.isActive("link")}
          onClick={() => setLink(editor)}
        >
          🔗
        </ToolbarButton>

        <span className={styles.divider} />

        <ToolbarButton
          label={t("alignLeft")}
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignIcon variant="left" />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignCenter")}
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignIcon variant="center" />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignRight")}
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignIcon variant="right" />
        </ToolbarButton>

        <span className={styles.divider} />

        <ToolbarButton label={t("image")} onClick={() => imageInputRef.current?.click()}>
          🖼
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.fileInput}
          onChange={handleImageSelected}
        />

        <span className={styles.divider} />

        <ToolbarButton
          label={t("pageBreak") || "Sayfa Sonu"}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          📄
        </ToolbarButton>
        <ToolbarButton
          label="Rün Ayracı"
          onClick={() => editor.chain().focus().insertContent('<p>---</p>').run()}
        >
          ❖
        </ToolbarButton>

        <span className={styles.divider} />

        <ToolbarButton
          label={t("undo")}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
          <ToolbarButton
            label={t("redo")}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            ↷
          </ToolbarButton>

          <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            <ToolbarButton
              label={t("scrollTop") || "Üste Çık"}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑
            </ToolbarButton>
            <ToolbarButton
              label={t("scrollBottom") || "Alta İn"}
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            >
              ↓
            </ToolbarButton>
          </div>
        </div>
      <EditorContent editor={editor} />

      {suggestion ? (
        <ul
          className={styles.suggestions}
          style={{ left: suggestion.left, top: suggestion.top }}
          role="listbox"
        >
          {suggestion.items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={
                  index === suggestion.activeIndex
                    ? styles.suggestionActive
                    : styles.suggestion
                }
                role="option"
                aria-selected={index === suggestion.activeIndex}
                // Editör odağı kaybetmesin: seçim mousedown'da yapılır
                onMouseDown={(event) => {
                  event.preventDefault();
                  applySuggestion(index);
                }}
              >
                <span className={styles.suggestionTitle}>{item.title}</span>
                <span className={styles.suggestionCategory}>
                  {tWiki(`categories.${item.category}`)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
