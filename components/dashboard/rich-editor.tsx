"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "./image-upload";
import { useFieldError } from "./form";
import { cn } from "@/lib/utils";

function ToolbarButton({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} aria-pressed={active} className={cn("rounded-lg p-2 text-muted transition hover:bg-cyan/10 hover:text-fg", active && "bg-cyan/15 text-cyan")}>
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const file = useRef<HTMLInputElement>(null);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const setLink = () => setLinkDraft((editor.getAttributes("link").href as string | undefined) ?? "https://");
  const applyLink = () => {
    if (linkDraft === null) return;
    if (!linkDraft || linkDraft === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: linkDraft }).run();
    setLinkDraft(null);
  };
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-indigo/90 backdrop-blur">
    <div className="flex flex-wrap items-center gap-0.5 p-1.5">
      <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}><Link2 className="h-4 w-4" /></ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Insert image" onClick={() => file.current?.click()}><ImagePlus className="h-4 w-4" /></ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></ToolbarButton>
      <input
        ref={file}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            const src = await uploadImage(f);
            editor.chain().focus().setImage({ src, alt: f.name.replace(/\.[^.]+$/, "") }).run();
          } catch (err) {
            toast.error((err as Error).message);
          }
          e.target.value = "";
        }}
      />
    </div>
    {linkDraft !== null && (
      <div className="flex items-center gap-2 border-t border-line p-2">
        <input
          autoFocus
          value={linkDraft}
          onChange={(e) => setLinkDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyLink();
            } else if (e.key === "Escape") setLinkDraft(null);
          }}
          placeholder="https:// or /contact"
          className="flex-1 rounded-lg border border-line bg-ink px-3 py-1.5 text-sm outline-none focus:border-cyan"
          aria-label="Link URL"
        />
        <button type="button" onClick={applyLink} className="rounded-lg bg-cyan px-3 py-1.5 text-xs font-semibold text-ink">Apply</button>
        <button type="button" onClick={() => setLinkDraft(null)} className="rounded-lg px-3 py-1.5 text-xs text-muted">Cancel</button>
      </div>
    )}
    </div>
  );
}

/** Tiptap rich-text editor that writes sanitised-on-render HTML into a hidden field. */
export function RichEditor({ name, label, defaultValue = "", placeholder = "Start writing…" }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  const [html, setHtml] = useState(defaultValue);
  const [words, setWords] = useState(0);
  const error = useFieldError(name);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: false }), Link.configure({ openOnClick: false }), Image, Placeholder.configure({ placeholder })],
    content: defaultValue,
    editorProps: { attributes: { class: "prose-co3 min-h-[360px] px-5 py-4 outline-none" } },
    onCreate: ({ editor }) => setWords(editor.getText().split(/\s+/).filter(Boolean).length),
    onUpdate: ({ editor }) => {
      setHtml(editor.isEmpty ? "" : editor.getHTML());
      setWords(editor.getText().split(/\s+/).filter(Boolean).length);
    },
  });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-fg/90">{label}</span>
        <span className="font-mono text-xs text-muted">{words} words · ~{Math.max(1, Math.round(words / 220))} min read</span>
      </div>
      <input type="hidden" name={name} value={html} />
      <div className={cn("overflow-hidden rounded-xl border border-line bg-ink/60 focus-within:border-cyan/60", error && "border-danger")}>
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
