"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password successfully updated! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          style={{ background: "radial-gradient(circle, rgba(115,92,0,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        {/* Decorative architectural grid lines */}
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
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" }}>
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}>
              key
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#002046] tracking-tight">Heimstadt</h1>
          <p className="text-xs text-[#44474e] uppercase tracking-[0.3em] mt-1 font-semibold">Admin Portal</p>
          {/* Gold divider */}
          <div className="mx-auto mt-4 h-px w-16" style={{ background: "linear-gradient(135deg, #735c00 0%, #fed65b 50%, #735c00 100%)" }} />
        </div>

        {/* Glass Card */}
        <div
          className="rounded-3xl p-8 shadow-[0_40px_80px_-20px_rgba(27,54,93,0.15)]"
          style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(27,54,93,0.08)" }}
        >
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-[#002046]">Update password</h2>
            <p className="text-sm text-[#44474e] mt-1">Enter your new secure password below.</p>
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
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#44474e]/40 text-[20px]">
                    lock
                  </span>
                  <input
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

              {/* Confirm Password field */}
              <div>
                <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#44474e]/40 text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-[#0b1c30] placeholder:text-[#44474e]/40
                               bg-[#eff4ff] border border-[rgba(27,54,93,0.08)]
                               focus:outline-none focus:ring-2 focus:ring-[#002046]/15 focus:border-[#002046]
                               transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="reveal-button w-full py-3 rounded-xl font-semibold text-sm border border-[#002046] text-[#002046]
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
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
