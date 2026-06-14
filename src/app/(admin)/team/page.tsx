"use client";

import RoleGuard from "@/components/RoleGuard";

/* ─────────── Mock Data ─────────── */
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  status: "online" | "offline" | "away";
  assigned_chats: number;
  assigned_docs: number;
  joined: string;
}

const MOCK_TEAM: TeamMember[] = [
  { id: "t-001", name: "Rohit Kumar",     email: "rohit@heimstadt.com",   role: "admin",    status: "online",  assigned_chats: 0, assigned_docs: 0, joined: "2024-01-15" },
  { id: "t-002", name: "Lena Fischer",    email: "lena@heimstadt.com",    role: "employee", status: "online",  assigned_chats: 4, assigned_docs: 3, joined: "2024-06-01" },
  { id: "t-003", name: "Tobias Bauer",    email: "tobias@heimstadt.com",  role: "employee", status: "online",  assigned_chats: 2, assigned_docs: 5, joined: "2024-08-15" },
  { id: "t-004", name: "Maria Santos",    email: "maria@heimstadt.com",   role: "employee", status: "away",    assigned_chats: 6, assigned_docs: 1, joined: "2025-01-10" },
  { id: "t-005", name: "Erik Lindström",  email: "erik@heimstadt.com",    role: "employee", status: "offline", assigned_chats: 0, assigned_docs: 0, joined: "2025-03-20" },
];

/* ─────────── Page (Admin Only) ─────────── */
export default function TeamPage() {
  const onlineCount = MOCK_TEAM.filter((m) => m.status === "online").length;

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} online
          </span>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_TEAM.map((member) => (
          <div key={member.id} className="glass-card rounded-2xl p-5 card-hover group">
            <div className="flex items-start gap-3 mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                  member.role === "admin"
                    ? "bg-gradient-to-br from-[#735c00] to-[#fed65b]"
                    : "bg-gradient-to-br from-[#002046] to-[#1b365d]"
                }`}>
                  {member.name.charAt(0)}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  member.status === "online" ? "bg-emerald-500" : member.status === "away" ? "bg-amber-500" : "bg-[#c4c6cf]"
                }`} />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#002046] truncate">{member.name}</p>
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
                <p className="text-lg font-bold text-[#002046]">{member.assigned_chats}</p>
                <p className="text-[9px] text-[#44474e]/50 uppercase tracking-wider">Chats</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#002046]">{member.assigned_docs}</p>
                <p className="text-[9px] text-[#44474e]/50 uppercase tracking-wider">Docs</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#002046]">{member.joined}</p>
                <p className="text-[9px] text-[#44474e]/50 uppercase tracking-wider">Joined</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-xl border border-[rgba(27,54,93,0.08)] text-xs font-semibold text-[#44474e]/60 hover:text-[#002046] hover:border-[#002046] transition-all text-center">
                View Profile
              </button>
              {member.role !== "admin" && (
                <button className="w-9 h-9 rounded-xl border border-[rgba(27,54,93,0.08)] flex items-center justify-center text-[#44474e]/40 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all">
                  <span className="material-symbols-outlined text-[16px]">person_remove</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Employee Card */}
        <div className="glass-card rounded-2xl p-5 border-2 border-dashed border-[rgba(27,54,93,0.1)] flex flex-col items-center justify-center text-center min-h-[200px] hover:border-[#735c00] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[rgba(115,92,0,0.06)] flex items-center justify-center mb-3 group-hover:bg-[rgba(115,92,0,0.12)] transition-colors">
            <span className="material-symbols-outlined text-[24px] text-[#735c00]">person_add</span>
          </div>
          <p className="text-sm font-semibold text-[#002046] mb-1">Add Team Member</p>
          <p className="text-[10px] text-[#44474e]/50 max-w-[180px]">Create a new user account from the Supabase dashboard and assign their role.</p>
        </div>
      </div>
      </div>
    </RoleGuard>
  );
}
