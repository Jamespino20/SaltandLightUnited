"use client";

import { useRef, useEffect } from "react";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<{ root: HTMLElement } | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let mounted = true;
    let quillInstance: { root: HTMLElement; on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void; setContents: (d: unknown) => void; getContents: () => unknown } | null = null;

    (async () => {
      if (!containerRef.current || !mounted) return;
      const Quill = (await import("quill")).default;
      if (!containerRef.current || !mounted) return;

      const editorDiv = containerRef.current.querySelector(".ql-editor");
      if (editorDiv && value) {
        editorDiv.innerHTML = value;
      }

      quillInstance = new Quill(containerRef.current, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
        placeholder: placeholder || "Start writing...",
      });

      if (value) {
        quillInstance.root.innerHTML = value;
      }

      const handleTextChange = () => {
        onChangeRef.current(quillInstance!.root.innerHTML);
      };
      quillInstance.on("text-change", handleTextChange);

      quillRef.current = quillInstance;
    })();

    return () => {
      mounted = false;
      if (quillInstance) {
        quillInstance.off("text-change", () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-slu-gray-200 bg-white overflow-hidden" style={{ height: "500px" }}>
      <div ref={containerRef} style={{ height: "450px" }} />
    </div>
  );
}
