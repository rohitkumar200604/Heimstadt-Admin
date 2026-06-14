"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "forgot";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role"); // "admin" | "employee" | null
  const isEmployee = roleParam === "employee";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const portalLabel = isEmployee ? "Staff Portal" : "Admin Portal";
  const placeholderEmail = isEmployee ? "employee@heimstadt.com" : "admin@heimstadt.com";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent! Check your email.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center relative overflow-hidden px-5">
      {/* Atmospheric background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,32,70,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full"
          style={{
            background: isEmployee
              ? "radial-gradient(circle, rgba(115,92,0,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(115,92,0,0.06) 0%, transparent 70%)",
            filter: "blur(80px)"
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#002046" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md">
        {/* Back to landing */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#44474e]/60 hover:text-[#002046] transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to portal selection
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
            style={{
              background: isEmployee
                ? "linear-gradient(135deg, #735c00 0%, #9a7d00 100%)"
                : "linear-gradient(135deg, #002046 0%, #1b365d 100%)"
            }}
          >
            <span
              className="material-symbols-outlined text-white text-3xl"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
            >
              {isEmployee ? "badge" : "home_work"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#002046] tracking-tight">Heimstadt</h1>
          <p className="text-xs text-[#44474e] uppercase tracking-[0.3em] mt-1 font-semibold">{portalLabel}</p>

          {/* Role indicator pill */}
          <div className="flex justify-center mt-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={
                isEmployee
                  ? { background: "rgba(115,92,0,0.08)", color: "#735c00", border: "1px solid rgba(115,92,0,0.15)" }
                  : { background: "rgba(0,32,70,0.06)", color: "#002046", border: "1px solid rgba(0,32,70,0.10)" }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: isEmployee ? "#735c00" : "#002046" }} />
              {isEmployee ? "Staff Member" : "Administrator"}
            </span>
          </div>

          {/* Gold divider */}
          <div
            className="mx-auto mt-4 h-px w-16"
            style={{ background: "linear-gradient(135deg, #735c00 0%, #fed65b 50%, #735c00 100%)" }}
          />
        </div>

        {/* Glass Card */}
        <div
          className="rounded-3xl p-8 shadow-[0_40px_80px_-20px_rgba(27,54,93,0.15)]"
          style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(27,54,93,0.08)" }}
        >
          {mode === "login" ? (
            <>
              <div className="mb-7">
                <h2 className="text-xl font-semibold text-[#002046]">Welcome back</h2>
                <p className="text-sm text-[#44474e] mt-1">
                  {isEmployee
                    ? "Sign in with your staff credentials to access your workspace."
                    : "Sign in with your administrator credentials."}
                </p>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email field */}
                <div>
                  <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#44474e]/40 text-[20px]">
                      mail
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={placeholderEmail}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-[#0b1c30] placeholder:text-[#44474e]/40
                                 bg-[#eff4ff] border border-[rgba(27,54,93,0.08)]
                                 focus:outline-none focus:ring-2 focus:ring-[#002046]/15 focus:border-[#002046]
                                 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#44474e]/40 text-[20px]">
                      lock
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-[#0b1c30] placeholder:text-[#44474e]/40
                                 bg-[#eff4ff] border border-[rgba(27,54,93,0.08)]
                                 focus:outline-none focus:ring-2 focus:ring-[#002046]/15 focus:border-[#002046]
                                 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#44474e]/40 hover:text-[#002046] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); setSuccess(null); }}
                    className="text-xs text-[#735c00] font-semibold hover:text-[#002046] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="reveal-button w-full py-3 rounded-xl font-semibold text-sm border border-[#002046] text-[#002046]
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  )}
                </button>
              </form>

              {/* Switch role hint */}
              <p className="mt-6 text-center text-xs text-[#44474e]/50">
                {isEmployee ? "Are you an admin?" : "Are you a staff member?"}{" "}
                <Link
                  href={isEmployee ? "/login?role=admin" : "/login?role=employee"}
                  className="text-[#735c00] font-semibold hover:text-[#002046] transition-colors"
                >
                  Switch portal →
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                className="flex items-center gap-1 text-xs text-[#44474e] hover:text-[#002046] mb-6 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to sign in
              </button>

              <div className="mb-7">
                <h2 className="text-xl font-semibold text-[#002046]">Reset password</h2>
                <p className="text-sm text-[#44474e] mt-1">
                  Enter your email and we&apos;ll send you a secure reset link.
                </p>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {success}
                </div>
              )}

              {!success && (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#44474e]/40 text-[20px]">
                        mail
                      </span>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholderEmail}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-[#0b1c30] placeholder:text-[#44474e]/40
                                   bg-[#eff4ff] border border-[rgba(27,54,93,0.08)]
                                   focus:outline-none focus:ring-2 focus:ring-[#002046]/15 focus:border-[#002046]
                                   transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-submit"
                    type="submit"
                    disabled={loading}
                    className="reveal-button w-full py-3 rounded-xl font-semibold text-sm border border-[#002046] text-[#002046]
                               disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? "Sending…" : "Send Reset Link"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#44474e]/40 mt-8">
          © {new Date().getFullYear()} Heimstadt GmbH · Internal Use Only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#002046]/30 text-4xl animate-spin">progress_activity</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
