"use client";

import Link from "next/link";

interface Stats {
  bookings: number;
  pendingDocs: number;
  openChats: number;
  properties: number;
}

interface EmployeeDashboardProps {
  stats: Stats;
  fullName: string;
  userId: string;
}

const MOCK_ASSIGNED_CHATS = [
  { id: "c-001", user: "Elena Rodriguez", subject: "HVAC Malfunction - Unit 402", urgency: "urgent", time: "2 mins ago" },
  { id: "c-002", user: "Klaus Müller",    subject: "Lease Renewal Inquiry",       urgency: "normal", time: "1 hour ago" },
  { id: "c-003", user: "Aiko Tanaka",     subject: "Payment Confirmation Request", urgency: "normal", time: "3 hours ago" },
  { id: "c-004", user: "Marc Dubois",     subject: "Parking Slot Availability",    urgency: "low",    time: "5 hours ago" },
];

const MOCK_PENDING_DOCS = [
  { id: "d-001", user: "Klaus Müller",    docType: "Income Proof",              context: "booking" as const, submitted: "2h ago" },
  { id: "d-002", user: "Aiko Tanaka",     docType: "ID Verification",           context: "profile" as const, submitted: "5h ago" },
  { id: "d-003", user: "Klaus Müller",    docType: "Employment Letter",         context: "booking" as const, submitted: "Yesterday" },
  { id: "d-004", user: "Sara Kovač",      docType: "Passport Copy",             context: "profile" as const, submitted: "Yesterday" },
  { id: "d-005", user: "Elena Rodriguez", docType: "Structural Survey Report",  context: "booking" as const, submitted: "2 days ago" },
];

export default function EmployeeDashboard({ stats, fullName }: EmployeeDashboardProps) {
  const greeting = getGreeting();

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Employee Dashboard</p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#002046] tracking-tight">
          Good {greeting}, {fullName.split(" ")[0]} 👋
        </h2>
        <p className="text-sm text-[#44474e]/70 mt-1">Your assigned tasks and pending actions.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat icon="forum" label="Open Chats" value={stats.openChats || 4} color="#002046" bg="rgba(0,32,70,0.06)" />
        <QuickStat icon="folder_open" label="Docs to Review" value={stats.pendingDocs || 5} color="#ba1a1a" bg="rgba(186,26,26,0.06)" />
        <QuickStat icon="calendar_check" label="My Bookings" value={stats.bookings || 12} color="#735c00" bg="rgba(115,92,0,0.06)" />
        <QuickStat icon="schedule" label="Avg Response" value="4m" color="#1b365d" bg="rgba(27,54,93,0.06)" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Tickets */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(0,32,70,0.06)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-[#002046]">forum</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#002046] text-sm">Assigned Chats</h3>
                <p className="text-[10px] text-[#44474e]/50">Reply to users from heimstadt.com</p>
              </div>
            </div>
            <Link href="/messages" className="text-xs text-[#735c00] font-semibold hover:text-[#002046] transition-colors flex items-center gap-1">
              Open inbox <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <div className="divide-y divide-[rgba(27,54,93,0.04)]">
            {MOCK_ASSIGNED_CHATS.map((chat) => (
              <Link
                key={chat.id}
                href="/messages"
                className="flex items-start gap-3 p-4 hover:bg-[rgba(27,54,93,0.02)] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#002046] to-[#1b365d] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {chat.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[#0b1c30] truncate">{chat.user}</p>
                    <span className="text-[10px] text-[#44474e]/40 flex-shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-xs text-[#44474e]/70 truncate">{chat.subject}</p>
                </div>
                {chat.urgency === "urgent" && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-50 text-red-700 border border-red-200 flex-shrink-0 mt-0.5">
                    Urgent
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-[rgba(27,54,93,0.04)]">
            <Link
              href="/messages"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#002046] text-white text-sm font-semibold hover:bg-[#1b365d] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">reply</span>
              Reply to Chats
            </Link>
          </div>
        </div>

        {/* Pending Documents */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(186,26,26,0.06)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">folder_open</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#002046] text-sm">Documents to Review</h3>
                <p className="text-[10px] text-[#44474e]/50">Booking & Profile verifications</p>
              </div>
            </div>
            <Link href="/documents" className="text-xs text-[#735c00] font-semibold hover:text-[#002046] transition-colors flex items-center gap-1">
              View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <div className="divide-y divide-[rgba(27,54,93,0.04)]">
            {MOCK_PENDING_DOCS.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-4 hover:bg-[rgba(27,54,93,0.02)] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-[#002046]/50">description</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0b1c30] truncate">{doc.docType}</p>
                  <p className="text-[10px] text-[#44474e]/50">{doc.user} · {doc.submitted}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  doc.context === "booking"
                    ? "bg-[rgba(0,32,70,0.06)] text-[#002046]"
                    : "bg-[rgba(115,92,0,0.06)] text-[#735c00]"
                }`}>
                  {doc.context}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[rgba(27,54,93,0.04)]">
            <Link
              href="/documents"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#002046] text-[#002046] text-sm font-semibold hover:bg-[#002046] hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Review Documents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, color, bg }: { icon: string; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <span className="material-symbols-outlined text-[20px]" style={{ color }}>{icon}</span>
        </div>
        <p className="text-[10px] font-bold text-[#44474e]/60 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#002046]">{value}</p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
