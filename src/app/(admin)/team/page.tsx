"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import RoleGuard from "@/components/RoleGuard";
import { createClient } from "@/lib/supabase/client";
import { TeamMember } from "@/lib/types";

interface TeamMemberWithStats extends TeamMember {
  replies_sent: number;
  docs_reviewed: number;
}

/* ─────────── Page (Admin Only) ─────────── */
export default function TeamPage() {
  const [team, setTeam] = useState<TeamMemberWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMember, setViewingMember] = useState<TeamMemberWithStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: "", email: "", role: "employee" as "admin" | "employee" });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [createdCreds, setCreatedCreds] = useState<{ email: string; tempPassword: string } | null>(null);

  const fetchTeam = useCallback(async () => {
    const supabase = createClient();

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, avatar_url, created_at")
      .in("role", ["admin", "employee"])
      .order("created_at", { ascending: true });

    if (error || !profiles) {
      setLoading(false);
      return;
    }

    const [{ data: messages }, { data: docs }] = await Promise.all([
      supabase.from("messages").select("sender_id"),
      supabase.from("verification_documents").select("reviewed_by"),
    ]);

    const replyCounts = new Map<string, number>();
    for (const m of messages ?? []) {
      if (!m.sender_id) continue;
      replyCounts.set(m.sender_id, (replyCounts.get(m.sender_id) ?? 0) + 1);
    }

    const reviewCounts = new Map<string, number>();
    for (const d of docs ?? []) {
      if (!d.reviewed_by) continue;
      reviewCounts.set(d.reviewed_by, (reviewCounts.get(d.reviewed_by) ?? 0) + 1);
    }

    setTeam(
      profiles.map((p) => ({
        ...p,
        replies_sent: replyCounts.get(p.id) ?? 0,
        docs_reviewed: reviewCounts.get(p.id) ?? 0,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  async function handleAddMember(e: FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError("");

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to add team member");

      setCreatedCreds({ email: data.email, tempPassword: data.tempPassword });
      setShowAddModal(false);
      setAddForm({ full_name: "", email: "", role: "employee" });
      await fetchTeam();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add team member");
    } finally {
      setAdding(false);
    }
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Team Management</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#002046] tracking-tight">Team Members</h2>
          <p className="text-sm text-[#44474e]/70 mt-1">Manage employees and administrators. Add new team members via Supabase dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[rgba(0,32,70,0.06)] text-[#002046] border border-[rgba(0,32,70,0.1)]">
            {team.length} staff
          </span>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading && (
          <div className="col-span-full text-center py-20 text-sm text-[#44474e]/50">Loading team…</div>
        )}

        {!loading && team.map((member) => (
          <div key={member.id} className="glass-card rounded-2xl p-5 card-hover group">
            <div className="flex items-start gap-3 mb-4">
              {/* Avatar */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                member.role === "admin"
                  ? "bg-gradient-to-br from-[#735c00] to-[#fed65b]"
                  : "bg-gradient-to-br from-[#002046] to-[#1b365d]"
              }`}>
                {(member.full_name || member.email).charAt(0).toUpperCase()}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#002046] truncate">{member.full_name || "Unnamed"}</p>
                <p className="text-[10px] text-[#44474e]/50 truncate">{member.email}</p>
              </div>
              {/* Role badge */}
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                member.role === "admin"
                  ? "bg-[rgba(115,92,0,0.08)] text-[#735c00] border-[rgba(115,92,0,0.15)]"
                  : "bg-[rgba(0,32,70,0.06)] text-[#002046] border-[rgba(0,32,70,0.1)]"
              }`}>
                {member.role}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-[rgba(27,54,93,0.06)]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#002046]">{member.replies_sent}</p>
                <p className="text-[9px] text-[#44474e]/50 uppercase tracking-wider">Replies</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#002046]">{member.docs_reviewed}</p>
                <p className="text-[9px] text-[#44474e]/50 uppercase tracking-wider">Reviewed</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#002046]">{new Date(member.created_at).toLocaleDateString()}</p>
                <p className="text-[9px] text-[#44474e]/50 uppercase tracking-wider">Joined</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setViewingMember(member)}
                className="flex-1 py-2 rounded-xl border border-[rgba(27,54,93,0.08)] text-xs font-semibold text-[#44474e]/60 hover:text-[#002046] hover:border-[#002046] transition-all text-center"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}

        {/* Add Employee Card */}
        {!loading && (
          <button
            onClick={() => { setAddError(""); setShowAddModal(true); }}
            className="glass-card rounded-2xl p-5 border-2 border-dashed border-[rgba(27,54,93,0.1)] flex flex-col items-center justify-center text-center min-h-[200px] hover:border-[#735c00] transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-[rgba(115,92,0,0.06)] flex items-center justify-center mb-3 group-hover:bg-[rgba(115,92,0,0.12)] transition-colors">
              <span className="material-symbols-outlined text-[24px] text-[#735c00]">person_add</span>
            </div>
            <p className="text-sm font-semibold text-[#002046] mb-1">Add Team Member</p>
            <p className="text-[10px] text-[#44474e]/50 max-w-[180px]">Create a new staff account and assign their role.</p>
          </button>
        )}
      </div>

      {/* View Profile Modal */}
      {viewingMember && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-5" onClick={() => setViewingMember(null)}>
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between">
              <h3 className="font-bold text-[#002046]">Team Member Profile</h3>
              <button onClick={() => setViewingMember(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ${
                  viewingMember.role === "admin"
                    ? "bg-gradient-to-br from-[#735c00] to-[#fed65b]"
                    : "bg-gradient-to-br from-[#002046] to-[#1b365d]"
                }`}>
                  {(viewingMember.full_name || viewingMember.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#002046] truncate">{viewingMember.full_name || "Unnamed"}</p>
                  <p className="text-xs text-[#44474e]/60 truncate">{viewingMember.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    viewingMember.role === "admin"
                      ? "bg-[rgba(115,92,0,0.08)] text-[#735c00] border-[rgba(115,92,0,0.15)]"
                      : "bg-[rgba(0,32,70,0.06)] text-[#002046] border-[rgba(0,32,70,0.1)]"
                  }`}>
                    {viewingMember.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <DetailRow label="Joined" value={new Date(viewingMember.created_at).toLocaleDateString()} />
                <DetailRow label="Chat replies sent" value={String(viewingMember.replies_sent)} />
                <DetailRow label="Documents reviewed" value={String(viewingMember.docs_reviewed)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-5" onClick={() => setShowAddModal(false)}>
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between">
              <h3 className="font-bold text-[#002046]">Add Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44474e]/70 mb-1.5">Full name</label>
                <input
                  type="text"
                  required
                  value={addForm.full_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, full_name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(27,54,93,0.1)] text-sm focus:outline-none focus:ring-2 focus:ring-[#002046]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44474e]/70 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(27,54,93,0.1)] text-sm focus:outline-none focus:ring-2 focus:ring-[#002046]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44474e]/70 mb-1.5">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value as "admin" | "employee" }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(27,54,93,0.1)] text-sm focus:outline-none focus:ring-2 focus:ring-[#002046]/20"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {addError && <p className="text-xs text-red-600">{addError}</p>}

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 rounded-xl bg-[#002046] text-white font-semibold text-sm hover:bg-[#1b365d] transition-colors disabled:opacity-50"
              >
                {adding ? "Creating…" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Created Credentials Modal */}
      {createdCreds && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-5" onClick={() => setCreatedCreds(null)}>
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between">
              <h3 className="font-bold text-[#002046]">Account Created</h3>
              <button onClick={() => setCreatedCreds(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#44474e]/70">
                Share these credentials with the new team member. They should change this password from <strong>Settings</strong> after logging in — it won&apos;t be shown again.
              </p>
              <div className="space-y-3">
                <DetailRow label="Email" value={createdCreds.email} />
                <DetailRow label="Temporary password" value={createdCreds.tempPassword} />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </RoleGuard>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#44474e]/60">{label}</span>
      <span className="text-xs font-semibold text-[#002046]">{value}</span>
    </div>
  );
}
