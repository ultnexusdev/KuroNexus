"use client";

import { useRef, type ChangeEvent } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { useTranslations } from "next-intl";
import { apiUrl } from "@/lib/api/client";
import { uploadImage } from "@/lib/admin/api";
import styles from "./RichTextEditor.module.css";

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
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const t = useTranslations("admin.editor");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: styles.content },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

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
          label={t("heading3")}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
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
          label={t("pageBreak")}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          📄
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
