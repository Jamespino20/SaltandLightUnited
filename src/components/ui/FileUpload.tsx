"use client";

import { useCallback, useRef, useState } from "react";
import { UploadSimple, X, FileImage } from "@phosphor-icons/react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  previewClassName?: string;
}

export default function FileUpload({
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  label = "Image",
  previewClassName = "h-32 w-auto rounded-lg border border-slu-gray-200 object-cover",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Upload failed");
        onChange(data.data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slu-gray-700">{label}</label>

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className={previewClassName} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition-colors hover:bg-rose-600"
          >
            <X size={12} weight="bold" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all ${
            dragging
              ? "border-slu-blue bg-slu-blue/5"
              : "border-slu-gray-200 hover:border-slu-gray-300 hover:bg-slu-gray-50"
          }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-slu-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slu-blue border-t-transparent" />
              Uploading...
            </div>
          ) : (
            <>
              <FileImage size={28} className="text-slu-gray-300" />
              <p className="text-sm text-slu-gray-500">
                <span className="font-medium text-slu-blue">Click to browse</span> or drag and drop
              </p>
              <p className="text-xs text-slu-gray-400">PNG, JPG, GIF, SVG up to 10MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
