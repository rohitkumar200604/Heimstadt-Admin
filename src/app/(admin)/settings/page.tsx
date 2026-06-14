"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) return;
    setChangingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (!error) {
      setPasswordChanged(true);
      setNewPassword("");
      setTimeout(() => setPasswordChanged(false), 3000);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Account</p>
        <h2 className="text-xl md:text-2xl font-bold text-[#002046] tracking-tight">Settings</h2>
        <p className="text-sm text-[#44474e]/70 mt-1">Manage your profile and account preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-[#002046] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#735c00]">person</span>
          Profile Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-1.5">Display Name</label>
            <input type="text" defaultValue="Administrator" className="input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-1.5">Email</label>
            <input type="email" defaultValue="admin@heimstadt.com" disabled className="input opacity-60 cursor-not-allowed" />
            <p className="text-[10px] text-[#44474e]/40 mt-1">Email can only be changed from the Supabase dashboard.</p>
          </div>
          <button
            onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 800); }}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Saving…</>
            ) : saved ? (
              <><span className="material-symbols-outlined text-[16px]">check_circle</span> Saved!</>
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-[#002046] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#735c00]">lock</span>
          Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#002046] uppercase tracking-widest mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              placeholder="Minimum 6 characters"
              className="input"
            />
          </div>
          {passwordChanged && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Password updated successfully!
            </div>
          )}
          <button type="submit" disabled={changingPassword || newPassword.length < 6} className="btn-primary flex items-center gap-2">
            {changingPassword ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Integration Section */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-[#002046] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#735c00]">language</span>
          Main Website Connection
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-[rgba(27,54,93,0.06)]">
            <div>
              <p className="text-sm font-medium text-[#0b1c30]">heimstadt.com</p>
              <p className="text-[10px] text-[#44474e]/50">Connected via shared Supabase project</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[rgba(27,54,93,0.06)]">
            <div>
              <p className="text-sm font-medium text-[#0b1c30]">Realtime Chat Sync</p>
              <p className="text-[10px] text-[#44474e]/50">Live chat messages synced between admin and main site</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[#0b1c30]">Document Verification Sync</p>
              <p className="text-[10px] text-[#44474e]/50">Verified docs show ✅ on user&apos;s booking/profile</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-6 border border-red-200/50">
        <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">warning</span>
          Account Actions
        </h3>
        <button
          onClick={handleLogout}
          className="btn-danger flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}
