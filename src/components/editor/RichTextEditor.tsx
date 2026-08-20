"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      data-toolbar-btn="true"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`rounded-lg p-1.5 transition-colors ${
        active
          ? "bg-slu-blue text-white"
          : "text-slu-gray-500 hover:bg-slu-gray-100 hover:text-slu-black"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-slu-gray-200" />;
}

/* ── Icons ── */
function BoldIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>);
}
function ItalicIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>);
}
function UnderlineIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>);
}
function StrikethroughIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-3 3c0 2 1 3 3 3" /><line x1="4" y1="12" x2="20" y2="12" /><path d="M15 12c2 0 3 1 3 3a3 3 0 0 1-3 3H8" /></svg>);
}
function CodeIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" /></svg>);
}
function H1Icon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /></svg>);
}
function H2Icon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" /></svg>);
}
function H3Icon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" /><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" /></svg>);
}
function ListUnorderedIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="5" cy="6" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="18" r="1" fill="currentColor" /></svg>);
}
function ListOrderedIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>);
}
function QuoteIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" /></svg>);
}
function AlignLeftIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="17" y1="18" x2="3" y2="18" /></svg>);
}
function AlignCenterIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="17" y1="12" x2="7" y2="12" /><line x1="19" y1="18" x2="5" y2="18" /></svg>);
}
function AlignRightIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="9" y2="12" /><line x1="21" y1="18" x2="7" y2="18" /></svg>);
}
function ImageIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>);
}
function TableIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>);
}
function CodeBlockIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><polyline points="9,8 5,12 9,16" /><polyline points="15,8 19,12 15,16" /></svg>);
}
function HorizontalRuleIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /></svg>);
}
function UndoIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,4 1,10 7,10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>);
}
function RedoIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,4 23,10 17,10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>);
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
}

export function RichTextEditor({ value, onChange, placeholder, accept = "image/*" }: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<unknown>(null);

  // Create editor once
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "Start writing..." }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] px-8 py-6 focus:outline-none",
      },
    },
  }, [value]); // Include value to reset when content changes

  // Save selection on changes
  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      savedSelection.current = editor.state.selection;
    };
    editor.on("selectionUpdate", handler);
    editor.on("transaction", handler);
    return () => {
      editor.off("selectionUpdate", handler);
      editor.off("transaction", handler);
    };
  }, [editor]);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      e.target.value = "";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "editor-images");
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success && data.data.url) {
          editor.chain().focus().setImage({ src: data.data.url }).run();
        }
      } catch { /* silent */ }
    },
    [editor]
  );

  if (!editor) return null;

  // Base command executor that preserves selection and focuses editor
  const runCommandWithFrame = useCallback(
    (command: () => void) => {
      if (!editor) return;
      // Restore saved selection if available
      if (savedSelection.current) {
        const { state } = editor;
        const tr = state.tr.setSelection(savedSelection.current as any);
        editor.view.dispatch(tr);
      }
      // Execute the command after selection is restored
      requestAnimationFrame(() => command());
    },
    [editor]
  );

  const undoCommand = useCallback(() => runCommandWithFrame(() => editor.chain().focus().undo().run()), [editor, runCommandWithFrame]);
  const redoCommand = useCallback(() => runCommandWithFrame(() => editor.chain().focus().redo().run()), [editor, runCommandWithFrame]);
  const toggleBold = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleBold().run()), [editor, runCommandWithFrame]);
  const toggleItalic = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleItalic().run()), [editor, runCommandWithFrame]);
  const toggleUnderline = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleUnderline().run()), [editor, runCommandWithFrame]);
  const toggleStrike = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleStrike().run()), [editor, runCommandWithFrame]);
  const toggleCode = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleCode().run()), [editor, runCommandWithFrame]);
  const toggleHeading1 = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleHeading({ level: 1 }).run()), [editor, runCommandWithFrame]);
  const toggleHeading2 = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleHeading({ level: 2 }).run()), [editor, runCommandWithFrame]);
  const toggleHeading3 = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleHeading({ level: 3 }).run()), [editor, runCommandWithFrame]);
  const toggleBulletList = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleBulletList().run()), [editor, runCommandWithFrame]);
  const toggleOrderedList = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleOrderedList().run()), [editor, runCommandWithFrame]);
  const toggleBlockquote = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleBlockquote().run()), [editor, runCommandWithFrame]);
  const toggleCodeBlock = useCallback(() => runCommandWithFrame(() => editor.chain().focus().toggleCodeBlock().run()), [editor, runCommandWithFrame]);
  const setTextAlignLeft = useCallback(() => runCommandWithFrame(() => editor.chain().focus().setTextAlign("left").run()), [editor, runCommandWithFrame]);
  const setTextAlignCenter = useCallback(() => runCommandWithFrame(() => editor.chain().focus().setTextAlign("center").run()), [editor, runCommandWithFrame]);
  const setTextAlignRight = useCallback(() => runCommandWithFrame(() => editor.chain().focus().setTextAlign("right").run()), [editor, runCommandWithFrame]);
  const setHorizontalRule = useCallback(() => runCommandWithFrame(() => editor.chain().focus().setHorizontalRule().run()), [editor, runCommandWithFrame]);
  const insertTable = useCallback(() => runCommandWithFrame(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()), [editor, runCommandWithFrame]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slu-gray-200 bg-white" style={{ height: "500px" }}>
      {/* Fixed toolbar ribbon */}
      <div
        className="flex-none flex flex-wrap items-center gap-0.5 border-b border-slu-gray-200 bg-slu-gray-50 px-3 py-2"
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-toolbar-btn]")) {
            e.preventDefault();
          }
        }}
      >
        <ToolbarButton onClick={undoCommand} title="Undo"><UndoIcon /></ToolbarButton>
        <ToolbarButton onClick={redoCommand} title="Redo"><RedoIcon /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={toggleBold} active={editor.isActive("bold")} title="Bold"><BoldIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleItalic} active={editor.isActive("italic")} title="Italic"><ItalicIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleUnderline} active={editor.isActive("underline")} title="Underline"><UnderlineIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleStrike} active={editor.isActive("strike")} title="Strikethrough"><StrikethroughIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleCode} active={editor.isActive("code")} title="Inline code"><CodeIcon /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={toggleHeading1} active={editor.isActive("heading", { level: 1 })} title="Heading 1"><H1Icon /></ToolbarButton>
        <ToolbarButton onClick={toggleHeading2} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><H2Icon /></ToolbarButton>
        <ToolbarButton onClick={toggleHeading3} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><H3Icon /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={toggleBulletList} active={editor.isActive("bulletList")} title="Bullet list"><ListUnorderedIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleOrderedList} active={editor.isActive("orderedList")} title="Numbered list"><ListOrderedIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleBlockquote} active={editor.isActive("blockquote")} title="Blockquote"><QuoteIcon /></ToolbarButton>
        <ToolbarButton onClick={toggleCodeBlock} active={editor.isActive("codeBlock")} title="Code block"><CodeBlockIcon /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={setTextAlignLeft} active={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeftIcon /></ToolbarButton>
        <ToolbarButton onClick={setTextAlignCenter} active={editor.isActive({ textAlign: "center" })} title="Align center"><AlignCenterIcon /></ToolbarButton>
        <ToolbarButton onClick={setTextAlignRight} active={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRightIcon /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={setHorizontalRule} title="Horizontal rule"><HorizontalRuleIcon /></ToolbarButton>
        <ToolbarButton onClick={handleImageUpload} title="Insert image"><ImageIcon /></ToolbarButton>
        <ToolbarButton onClick={insertTable} title="Insert table"><TableIcon /></ToolbarButton>
      </div>

      {/* Table contextual bar */}
      {editor.isActive("table") && (
        <div className="flex-none flex items-center gap-1 border-b border-slu-gray-200 bg-slu-gray-50 px-3 py-1.5 text-xs text-slu-gray-500">
          <span className="mr-2 font-medium text-slu-gray-600">Table</span>
          {[
            { label: "+ Column", fn: () => editor.chain().focus().addColumnAfter().run() },
            { label: "+ Row", fn: () => editor.chain().focus().addRowAfter().run() },
            { label: "- Column", fn: () => editor.chain().focus().deleteColumn().run() },
            { label: "- Row", fn: () => editor.chain().focus().deleteRow().run() },
          ].map((item) => (
            <button key={item.label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => {
              if (savedSelection.current) {
                const { state } = editor;
                const tr = state.tr.setSelection(savedSelection.current as any);
                editor.view.dispatch(tr);
              }
              item.fn();
            }} className="rounded px-2 py-1 hover:bg-slu-gray-100">{item.label}</button>
          ))}
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => {
            if (savedSelection.current) {
              const { state } = editor;
              const tr = state.tr.setSelection(savedSelection.current as any);
              editor.view.dispatch(tr);
            }
            editor.chain().focus().deleteTable().run();
          }} className="rounded px-2 py-1 text-red-600 hover:bg-red-50">Delete Table</button>
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <EditorContent
          editor={editor}
          className="h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-slu-gray-300 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-slu-gray-300 [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-slu-gray-300 [&_.ProseMirror_th]:bg-slu-gray-50 [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-2 [&_.ProseMirror_th]:font-semibold"
        />
      </div>

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleImageFile} className="hidden" />
    </div>
  );
}
