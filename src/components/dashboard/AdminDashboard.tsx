"use client";

import Link from "next/link";

interface Stats {
  bookings: number;
  pendingDocs: number;
  openChats: number;
  properties: number;
}

interface AdminDashboardProps {
  stats: Stats;
  fullName: string;
}

const MOCK_RECENT_BOOKINGS = [
  { id: "B-001", user: "Elena Rodriguez", property: "Skyline Residences, Unit 402", status: "confirmed", date: "2026-06-12", pendingDocs: 0 },
  { id: "B-002", user: "Klaus Müller",    property: "The Grand Estate, Villa 3",   status: "pending",   date: "2026-06-13", pendingDocs: 2 },
  { id: "B-003", user: "Aiko Tanaka",     property: "Industrial Loft Hub, 7B",     status: "pending",   date: "2026-06-14", pendingDocs: 1 },
  { id: "B-004", user: "Marc Dubois",     property: "Skyline Residences, Unit 812", status: "confirmed", date: "2026-06-10", pendingDocs: 0 },
  { id: "B-005", user: "Sara Kovač",      property: "The Grand Estate, Penthouse",  status: "cancelled", date: "2026-06-09", pendingDocs: 0 },
];

const MOCK_TEAM = [
  { name: "Lena Fischer",   role: "employee", chats: 4, docs: 3 },
  { name: "Tobias Bauer",   role: "employee", chats: 2, docs: 5 },
  { name: "Maria Santos",   role: "employee", chats: 6, docs: 1 },
];

export default function AdminDashboard({ stats, fullName }: AdminDashboardProps) {
  const statCards = [
    { label: "Total Properties",   value: stats.properties, icon: "domain",          color: "#002046", bg: "rgba(0,32,70,0.06)" },
    { label: "Active Bookings",    value: stats.bookings,   icon: "calendar_check",   color: "#735c00", bg: "rgba(115,92,0,0.06)" },
    { label: "Pending Documents",  value: stats.pendingDocs, icon: "folder_open",     color: "#ba1a1a", bg: "rgba(186,26,26,0.06)" },
    { label: "Open Chat Tickets",  value: stats.openChats,  icon: "forum",            color: "#1b365d", bg: "rgba(27,54,93,0.06)" },
  ];

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Admin Dashboard</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#002046] tracking-tight">
            Good {getGreeting()}, {fullName.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-[#44474e]/70 mt-1">Here&apos;s what&apos;s happening across Heimstadt today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/bookings" className="reveal-button border border-[#002046] text-[#002046] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[18px]">calendar_check</span>
            View Bookings
          </Link>
          <Link href="/documents" className="bg-[#002046] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1b365d] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Review Docs
          </Link>
        </div>
      </div>

      {/* Stat Cards — Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card group">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ color: card.color }}>
                  {card.icon}
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold text-[#44474e]/60 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-[#002046]">{card.value}</p>
            <div className="mt-4 h-1 rounded-full bg-[#e5eeff] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: "70%", background: card.color, opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#002046]">Recent Bookings</h3>
              <p className="text-xs text-[#44474e]/60 mt-0.5">Latest applications & reservations</p>
            </div>
            <Link href="/bookings" className="text-xs text-[#735c00] font-semibold hover:text-[#002046] transition-colors flex items-center gap-1">
              View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(27,54,93,0.02)] border-b border-[rgba(27,54,93,0.06)]">
                <tr>
                  {["Tenant", "Property", "Date", "Status", "Docs"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#44474e]/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(27,54,93,0.04)]">
                {MOCK_RECENT_BOOKINGS.map((b) => (
                  <tr key={b.id} className="hover:bg-[rgba(27,54,93,0.02)] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#002046] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {b.user.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[#0b1c30]">{b.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#44474e]/70 max-w-[180px] truncate">{b.property}</td>
                    <td className="px-5 py-4 text-sm text-[#44474e]/70">{b.date}</td>
                    <td className="px-5 py-4">
                      <span className={`badge-${b.status} capitalize`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${b.status === "confirmed" ? "bg-emerald-600" : b.status === "pending" ? "bg-amber-600" : "bg-red-600"}`} />
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {b.pendingDocs > 0 ? (
                        <Link href="/documents" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200 hover:bg-red-100 transition-colors">
                          <span className="material-symbols-outlined text-[12px]">warning</span>
                          {b.pendingDocs} pending
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Team overview */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#002046]">Team Activity</h3>
              <Link href="/team" className="text-xs text-[#735c00] font-semibold hover:text-[#002046] transition-colors">Manage</Link>
            </div>
            <div className="space-y-3">
              {MOCK_TEAM.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#002046] to-[#1b365d] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0b1c30] truncate">{member.name}</p>
                    <p className="text-[10px] text-[#44474e]/50">{member.chats} chats · {member.docs} docs</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="Online" />
                </div>
              ))}
            </div>
            <Link href="/team" className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-[rgba(27,54,93,0.08)] text-xs font-semibold text-[#44474e]/60 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.03)] transition-all">
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              Add Employee
            </Link>
          </div>

          {/* Pending Actions */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-[#002046] mb-4">Pending Actions</h3>
            <div className="space-y-3">
              <ActionItem icon="folder_open" color="#ba1a1a" bg="rgba(186,26,26,0.06)" label="14 documents awaiting review" href="/documents" />
              <ActionItem icon="forum" color="#735c00" bg="rgba(115,92,0,0.06)" label="8 open support tickets" href="/messages" />
              <ActionItem icon="calendar_check" color="#002046" bg="rgba(0,32,70,0.06)" label="3 bookings need confirmation" href="/bookings" />
            </div>
          </div>

          {/* Quick stats */}
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(254,214,91,0.12) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <p className="text-xs font-bold uppercase tracking-widest text-[#735c00] mb-1">Occupancy Rate</p>
            <p className="text-4xl font-bold text-[#002046] mb-1">98.4%</p>
            <p className="text-xs text-[#44474e]/60">Across all 142 properties</p>
            <div className="mt-4 h-2 rounded-full bg-[#e5eeff] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "98.4%", background: "linear-gradient(90deg, #735c00 0%, #fed65b 100%)" }} />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +0.8% vs last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionItem({ icon, color, bg, label, href }: { icon: string; color: string; bg: string; label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(27,54,93,0.03)] transition-colors group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <span className="material-symbols-outlined text-[18px]" style={{ color }}>{icon}</span>
      </div>
      <p className="text-sm text-[#44474e]/80 group-hover:text-[#0b1c30] transition-colors">{label}</p>
      <span className="material-symbols-outlined text-[16px] text-[#44474e]/30 ml-auto group-hover:text-[#002046] group-hover:translate-x-0.5 transition-all">arrow_forward</span>
    </Link>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
