// @tiptap/core doğrudan bağımlılık değil; react paketi hepsini yeniden dışa verir
import { Mark, mergeAttributes } from "@tiptap/react";

/**
 * El yazmasında bir wiki kaydına bakan sözcüğü işaretler.
 *
 * `<span class="lore-mention" data-entry-id data-entry-slug>` olarak yazılır —
 * backend sanitizasyonu tam olarak bu attribute'lara izin verir. İşaret
 * yalnızca gösterim içindir; sorgulanabilir ilişki `StoryEntryLink` tablosunda
 * durur (AGENTS.md kural 5).
 *
 * Bu mark TÜM editörlerde kayıtlıdır: eski hikâye/wiki formlarında bir bölüm
 * açıldığında tanınmayan mark olarak düşürülmemesi (veri kaybı) için şart.
 */
export const LoreMention = Mark.create({
  name: "loreMention",
  inclusive: false,
  excludes: "",

  addAttributes() {
    return {
      entryId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-entry-id"),
        renderHTML: (attributes) =>
          attributes.entryId
            ? { "data-entry-id": attributes.entryId as string }
            : {},
      },
      entrySlug: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-entry-slug"),
        renderHTML: (attributes) =>
          attributes.entrySlug
            ? { "data-entry-slug": attributes.entrySlug as string }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-entry-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "lore-mention" }),
      0,
    ];
  },
});
