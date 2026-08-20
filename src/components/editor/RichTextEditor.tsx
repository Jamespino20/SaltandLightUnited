"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  accept?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rounded-xl border border-slu-gray-200 bg-white overflow-hidden" style={{ height: "500px" }}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{ toolbar: TOOLBAR_OPTIONS }}
        placeholder={placeholder || "Start writing..."}
        theme="snow"
        style={{ height: "450px" }}
      />
    </div>
  );
}
