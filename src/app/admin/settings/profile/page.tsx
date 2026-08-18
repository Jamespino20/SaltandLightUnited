"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Check,
  Spinner,
  Warning,
  Envelope,
  Lock,
  Phone,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailError, setEmailError] = useState("");

  const [cropOpen, setCropOpen] = useState(false);
  const [cropImg, setCropImg] = useState<string | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropSize, setCropSize] = useState(200);
  const [draggingCrop, setDraggingCrop] = useState(false);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user?.name, user?.phone, user?.bio, user?.avatarUrl]);

  const initials = (user?.name || user?.email || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        setCropImg(ev.target?.result as string);
        setCropSize(size);
        setCropX(0);
        setCropY(0);
        setCropOpen(true);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (!cropImg || !cropCanvasRef.current) return;
    const canvas = cropCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = cropImg;
    await new Promise((r) => { img.onload = r; });

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const scaleX = img.width / (cropContainerRef.current?.offsetWidth || img.width);
    const scaleY = img.height / (cropContainerRef.current?.offsetHeight || img.height);

    ctx.drawImage(
      img,
      cropX * scaleX,
      cropY * scaleY,
      cropSize * scaleX,
      cropSize * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9);
    });

    const formData = new FormData();
    formData.append("file", blob, "avatar.jpg");
    formData.append("folder", "avatars");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setAvatarUrl(data.data.url);
      }
    } catch {
      // Upload failed silently
    }

    setCropOpen(false);
    setCropImg(null);
  }, [cropImg, cropX, cropY, cropSize]);

  const handleCropMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingCrop(true);
  }, []);

  const handleCropMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingCrop || !cropContainerRef.current) return;
    const rect = cropContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - cropSize / 2, rect.width - cropSize));
    const y = Math.max(0, Math.min(e.clientY - rect.top - cropSize / 2, rect.height - cropSize));
    setCropX(x);
    setCropY(y);
  }, [draggingCrop, cropSize]);

  const handleCropMouseUp = useCallback(() => {
    setDraggingCrop(false);
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");

    try {
      const body: Record<string, string> = { name, phone, bio, avatarUrl };
      if (currentPassword) {
        body.currentPassword = currentPassword;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMsg("Profile updated successfully");
      setCurrentPassword("");
      await update();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSaving(true);
    setEmailError("");
    setEmailMsg("");

    try {
      const res = await fetch("/api/profile/email-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setEmailMsg(data.message);
      if (data._dev) setEmailMsg(`[Dev] ${data._dev}`);
      setNewEmail("");
      setEmailPassword("");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to initiate email change");
    } finally {
      setEmailSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/settings"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">Profile</h1>
      </div>

      {msg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Avatar Section */}
      <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-slu-gray-100"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slu-blue text-2xl font-bold text-white ring-4 ring-slu-gray-100">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slu-black">
              {user?.name || "No name set"}
            </h3>
            <p className="text-xs text-slu-gray-500">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slu-gray-200 px-4 py-2 text-sm font-medium text-slu-gray-700 transition-colors hover:bg-slu-gray-50">
                <UserCircle size={16} />
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <X size={14} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <form
        onSubmit={handleProfileSave}
        className="space-y-5 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slu-black">Personal Information</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            <span className="flex items-center gap-1.5">
              <UserCircle size={14} />
              Full Name
            </span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            <span className="flex items-center gap-1.5">
              <Phone size={14} />
              Phone Number
            </span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            placeholder="+63 9XX XXX XXXX"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            placeholder="A short bio about yourself"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            <span className="flex items-center gap-1.5">
              <Lock size={14} />
              Role
            </span>
          </label>
          <input
            type="text"
            value={user?.role || ""}
            disabled
            className="w-full rounded-xl border border-slu-gray-200 bg-slu-gray-50 px-4 py-2.5 text-sm capitalize text-slu-gray-500"
          />
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <label className="mb-1 block text-sm font-medium text-amber-800">
            <span className="flex items-center gap-1.5">
              <Lock size={14} />
              Current Password (required to save changes)
            </span>
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            placeholder="Enter your password to confirm changes"
            required
          />
          <p className="mt-1 text-xs text-amber-600">
            Required to protect your account from unauthorized changes
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !currentPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
          >
            {saving ? <Spinner size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Email Change */}
      <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slu-black">Email Address</h2>
            <p className="mt-1 text-sm text-slu-gray-500">
              Current: <span className="font-medium text-slu-black">{user?.email}</span>
            </p>
          </div>
          <button
            onClick={() => setShowEmailChange(!showEmailChange)}
            className="inline-flex items-center gap-2 rounded-xl border border-slu-gray-200 px-4 py-2 text-sm font-medium text-slu-gray-700 transition-colors hover:bg-slu-gray-50"
          >
            <Envelope size={16} />
            Change Email
          </button>
        </div>

        {showEmailChange && (
          <div className="mt-4 rounded-xl border border-slu-gray-100 bg-slu-gray-50 p-4">
            {emailMsg && (
              <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {emailMsg}
              </div>
            )}
            {emailError && (
              <div className="mb-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <Warning size={14} className="mt-0.5 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}

            <form onSubmit={handleEmailChange} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">
                  New Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-slu-gray-200 bg-white px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                  placeholder="newemail@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">
                  <span className="flex items-center gap-1.5">
                    <Lock size={14} />
                    Current Password
                  </span>
                </label>
                <input
                  type="password"
                  required
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full rounded-xl border border-slu-gray-200 bg-white px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                  placeholder="Enter your password to verify"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <Warning size={14} />
                A verification link will be sent to your new email. You&apos;ll be logged out after confirmation.
              </div>
              <button
                type="submit"
                disabled={emailSaving || !newEmail || !emailPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
              >
                {emailSaving ? <Spinner size={16} className="animate-spin" /> : <Envelope size={16} />}
                {emailSaving ? "Sending..." : "Send Verification Link"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Image Crop Modal */}
      {cropOpen && cropImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slu-black">Crop Avatar</h3>
              <button
                onClick={() => { setCropOpen(false); setCropImg(null); }}
                className="rounded-lg p-1 text-slu-gray-400 hover:text-slu-black"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={cropContainerRef}
              className="relative mx-auto mb-4 overflow-hidden rounded-full"
              style={{ width: 240, height: 240, cursor: "move" }}
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={handleCropMouseUp}
              onMouseLeave={handleCropMouseUp}
            >
              <img
                src={cropImg}
                alt="Crop preview"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div
                className="absolute rounded-full border-4 border-white shadow-lg"
                style={{
                  width: cropSize,
                  height: cropSize,
                  left: cropX,
                  top: cropY,
                  pointerEvents: "none",
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                  pointerEvents: "none",
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setCropOpen(false); setCropImg(null); }}
                className="rounded-xl border border-slu-gray-200 px-4 py-2 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
              >
                <Check size={16} />
                Apply Crop
              </button>
            </div>

            <canvas ref={cropCanvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
}
