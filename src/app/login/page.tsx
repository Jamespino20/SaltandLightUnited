"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Lock, Warning } from "@phosphor-icons/react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  async function checkRateLimit() {
    const res = await fetch("/api/auth/rate-limit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const rlRes = await checkRateLimit();

      if (rlRes.rateLimited) {
        setError(`Too many login attempts. Please wait ${Math.ceil((rlRes.reset - Date.now()) / 1000)} seconds.`);
        setRateLimited(true);
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (!res || res.error) {
        setError("Invalid email or password.");
        return;
      }

      window.location.href = callbackUrl;
    } catch (err) {
      setLoading(false);
      setError("An error occurred during login. Please try again.");
    }
  }

  const disabled = loading || rateLimited;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slu-blue px-4">
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <span className="text-2xl font-bold text-slu-blue">SLU</span>
          <h1 className="mt-2 text-xl font-bold text-slu-black">Admin Sign In</h1>
          <p className="mt-1 text-sm text-slu-gray-500">
            Sign in to manage the site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slu-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-3 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue"
              placeholder="you@saltandlightunited.org"
              disabled={disabled}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slu-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-3 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue"
              placeholder="••••••••"
              disabled={disabled}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 flex items-start gap-2">
              <Warning size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-60"
          >
            <Lock size={18} />
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-slu-gray-500 transition-colors hover:text-slu-blue"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
