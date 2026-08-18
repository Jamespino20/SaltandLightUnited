"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Check,
  Spinner,
  Camera,
  Warning,
  Envelope,
  Lock,
  Phone,
  UserCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import FileUpload from "@/components/ui/FileUpload";


export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");

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

  const initials = (user?.name || user?.email || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
      if (data._dev) {
        setEmailMsg(`[Dev] ${data._dev}`);
      }
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
            <div className="mt-2">
              <FileUpload
                value={avatarUrl}
                onChange={(url: string) => setAvatarUrl(url)}
                folder="avatars"
                accept="image/*"
                label="Avatar"
              />
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
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20 resize-none"
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
            className="w-full rounded-xl border border-slu-gray-200 bg-slu-gray-50 px-4 py-2.5 text-sm text-slu-gray-500 capitalize"
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
              <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 flex items-start gap-2">
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
    </div>
  );
}
