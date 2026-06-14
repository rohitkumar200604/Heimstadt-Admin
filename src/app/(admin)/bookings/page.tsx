"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────── Mock Data ─────────── */
type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface MockBooking {
  id: string;
  user_name: string;
  user_email: string;
  property: string;
  city: string;
  status: BookingStatus;
  check_in: string;
  check_out: string;
  created_at: string;
  pending_docs: number;
  total_docs: number;
}

const MOCK_BOOKINGS: MockBooking[] = [
  { id: "B-001", user_name: "Elena Rodriguez",  user_email: "elena@example.com",  property: "Skyline Residences, Unit 402", city: "Berlin, Mitte",      status: "confirmed",  check_in: "2026-06-01",  check_out: "2027-05-31", created_at: "2026-05-20", pending_docs: 0, total_docs: 3 },
  { id: "B-002", user_name: "Klaus Müller",     user_email: "klaus@example.com",  property: "The Grand Estate, Villa 3",    city: "Potsdam, Lakeside",  status: "pending",    check_in: "2026-07-01",  check_out: "2027-06-30", created_at: "2026-06-10", pending_docs: 2, total_docs: 3 },
  { id: "B-003", user_name: "Aiko Tanaka",      user_email: "aiko@example.com",   property: "Industrial Loft Hub, 7B",      city: "Hamburg, Hafencity", status: "pending",    check_in: "2026-07-15",  check_out: "2028-01-14", created_at: "2026-06-12", pending_docs: 1, total_docs: 2 },
  { id: "B-004", user_name: "Marc Dubois",      user_email: "marc@example.com",   property: "Skyline Residences, Unit 812", city: "Berlin, Mitte",      status: "confirmed",  check_in: "2026-04-01",  check_out: "2027-03-31", created_at: "2026-03-15", pending_docs: 0, total_docs: 4 },
  { id: "B-005", user_name: "Sara Kovač",       user_email: "sara@example.com",   property: "The Grand Estate, Penthouse",  city: "Potsdam, Lakeside",  status: "cancelled",  check_in: "2026-08-01",  check_out: "2027-07-31", created_at: "2026-06-01", pending_docs: 0, total_docs: 0 },
  { id: "B-006", user_name: "Liam Chen",        user_email: "liam@example.com",   property: "Industrial Loft Hub, 12A",     city: "Hamburg, Hafencity", status: "completed",  check_in: "2025-01-01",  check_out: "2025-12-31", created_at: "2024-12-01", pending_docs: 0, total_docs: 3 },
];

/* ─────────── Page ─────────── */
export default function BookingsPage() {
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  const filtered = filter === "all" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter((b) => b.status === filter);

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Reservations</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#002046] tracking-tight">Bookings Management</h2>
          <p className="text-sm text-[#44474e]/70 mt-1">Track all tenant applications, active leases, and document verification status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="reveal-button border border-[#002046] text-[#002046] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[16px]">file_download</span> Export
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${
              filter === s
                ? "bg-[#002046] text-white border-[#002046]"
                : "bg-transparent text-[#44474e]/60 border-[rgba(27,54,93,0.08)] hover:border-[#002046] hover:text-[#002046]"
            }`}
          >
            {s === "all" ? `All (${MOCK_BOOKINGS.length})` : s}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgba(27,54,93,0.02)] border-b border-[rgba(27,54,93,0.06)]">
              <tr>
                {["Tenant", "Property", "Check-in / Check-out", "Status", "Documents", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#44474e]/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(27,54,93,0.04)]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[rgba(27,54,93,0.02)] transition-colors group">
                  {/* Tenant */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#002046] to-[#1b365d] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {b.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0b1c30]">{b.user_name}</p>
                        <p className="text-[10px] text-[#44474e]/50">{b.user_email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Property */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0b1c30]">{b.property}</p>
                    <p className="text-[10px] text-[#44474e]/50">{b.city}</p>
                  </td>
                  {/* Dates */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0b1c30]">{b.check_in}</p>
                    <p className="text-[10px] text-[#44474e]/50">to {b.check_out}</p>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  {/* Documents badge — Requirement 6 */}
                  <td className="px-5 py-4">
                    {b.pending_docs > 0 ? (
                      <Link href="/documents" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200 hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined text-[12px]">warning</span>
                        {b.pending_docs} / {b.total_docs} pending
                      </Link>
                    ) : b.total_docs > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        {b.total_docs} / {b.total_docs} verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#44474e]/40">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all" title="View">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-[#735c00] hover:bg-[rgba(115,92,0,0.04)] transition-all" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-red-600 hover:bg-red-50 transition-all" title="More">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-[rgba(27,54,93,0.02)] border-t border-[rgba(27,54,93,0.06)] px-5 py-3 flex items-center justify-between">
          <p className="text-[10px] text-[#44474e]/50">Showing 1 to {filtered.length} of {filtered.length} bookings</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg bg-[#002046] text-white font-bold text-xs">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const cls: Record<BookingStatus, string> = {
    pending:   "bg-amber-50 text-amber-800 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-[#e5eeff] text-[#002046] border-[#c4c6cf]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cls[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "confirmed" ? "bg-emerald-600" : status === "pending" ? "bg-amber-600" : status === "cancelled" ? "bg-red-600" : "bg-[#002046]"
      }`} />
      {status}
    </span>
  );
}
