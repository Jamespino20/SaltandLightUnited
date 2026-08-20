"use client";

import { useEffect, useRef } from "react";
import { Warning, Spinner } from "@phosphor-icons/react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !loading) onCancel();
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmColors = {
    danger: "bg-rose-600 hover:bg-rose-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    info: "bg-slu-blue hover:bg-slu-blue-dark",
  };

  const iconColors = {
    danger: "text-rose-500",
    warning: "text-amber-500",
    info: "text-slu-blue",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : onCancel}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slu-gray-100 ${iconColors[variant]}`}>
            <Warning size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slu-black">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slu-gray-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${confirmColors[variant]}`}
          >
            {loading ? <Spinner size={16} className="animate-spin" /> : null}
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
