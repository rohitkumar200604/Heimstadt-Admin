"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [viewingBooking, setViewingBooking] = useState<MockBooking | null>(null);
  const [editingBooking, setEditingBooking] = useState<MockBooking | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest("[data-action-menu]")) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateBooking(id: string, patch: Partial<MockBooking>) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function handleStatusChange(id: string, status: BookingStatus) {
    updateBooking(id, { status });
    setOpenMenuId(null);
    const supabase = createClient();
    await supabase.from("bookings").update({ status }).eq("id", id);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setOpenMenuId(null);
  }

  async function handleSaveEdit() {
    if (!editingBooking) return;
    updateBooking(editingBooking.id, {
      status: editingBooking.status,
      check_in: editingBooking.check_in,
      check_out: editingBooking.check_out,
    });
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: editingBooking.status, check_in: editingBooking.check_in, check_out: editingBooking.check_out })
      .eq("id", editingBooking.id);
    setEditingBooking(null);
  }

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
            {s === "all" ? `All (${bookings.length})` : s}
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
                      <button
                        onClick={() => setViewingBooking(b)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all"
                        title="View"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        onClick={() => setEditingBooking(b)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-[#735c00] hover:bg-[rgba(115,92,0,0.04)] transition-all"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <div className="relative" data-action-menu>
                        <button
                          onClick={() => setOpenMenuId((cur) => (cur === b.id ? null : b.id))}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            openMenuId === b.id ? "text-[#002046] bg-[rgba(27,54,93,0.06)]" : "text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)]"
                          }`}
                          title="More"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                        {openMenuId === b.id && (
                          <div
                            data-action-menu
                            className="absolute right-0 mt-1 w-52 dropdown-panel rounded-xl shadow-card-lg overflow-hidden animate-slide-down origin-top-right z-50"
                          >
                            <div className="p-1.5">
                              {b.status !== "confirmed" && b.status !== "completed" && (
                                <button
                                  onClick={() => handleStatusChange(b.id, "confirmed")}
                                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#44474e]/70 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  Confirm Booking
                                </button>
                              )}
                              {b.status === "confirmed" && (
                                <button
                                  onClick={() => handleStatusChange(b.id, "completed")}
                                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#44474e]/70 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                                  Mark Completed
                                </button>
                              )}
                              {b.status !== "cancelled" && b.status !== "completed" && (
                                <button
                                  onClick={() => handleStatusChange(b.id, "cancelled")}
                                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#44474e]/70 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                                  Cancel Booking
                                </button>
                              )}
                              <div className="my-1 border-t border-[rgba(27,54,93,0.06)]" />
                              <button
                                onClick={() => handleDelete(b.id)}
                                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#44474e]/70 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Delete Booking
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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

      {/* View Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-5" onClick={() => setViewingBooking(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[rgba(27,54,93,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#002046]">Booking Details</h3>
                  <p className="text-xs text-[#44474e]/50 mt-0.5">{viewingBooking.id}</p>
                </div>
                <button onClick={() => setViewingBooking(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002046] to-[#1b365d] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {viewingBooking.user_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0b1c30]">{viewingBooking.user_name}</p>
                  <p className="text-xs text-[#44474e]/50">{viewingBooking.user_email}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <DetailRow label="Property" value={viewingBooking.property} />
                <DetailRow label="City" value={viewingBooking.city} />
                <DetailRow label="Check-in" value={viewingBooking.check_in} />
                <DetailRow label="Check-out" value={viewingBooking.check_out} />
                <DetailRow label="Created" value={viewingBooking.created_at} />
                <DetailRow label="Status" value={viewingBooking.status} />
                <DetailRow
                  label="Documents"
                  value={viewingBooking.total_docs > 0 ? `${viewingBooking.total_docs - viewingBooking.pending_docs} / ${viewingBooking.total_docs} verified` : "None required"}
                />
              </div>
              <Link
                href="/documents"
                onClick={() => setViewingBooking(null)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-[rgba(27,54,93,0.1)] text-[#002046] hover:bg-[rgba(27,54,93,0.03)] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
                Review Documents
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-5" onClick={() => setEditingBooking(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[rgba(27,54,93,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#002046]">Edit Booking</h3>
                  <p className="text-xs text-[#44474e]/50 mt-0.5">{editingBooking.property}</p>
                </div>
                <button onClick={() => setEditingBooking(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44474e]/60 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={editingBooking.status}
                  onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as BookingStatus })}
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44474e]/60 uppercase tracking-wider mb-1.5">Check-in</label>
                  <input
                    type="date"
                    value={editingBooking.check_in}
                    onChange={(e) => setEditingBooking({ ...editingBooking, check_in: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44474e]/60 uppercase tracking-wider mb-1.5">Check-out</label>
                  <input
                    type="date"
                    value={editingBooking.check_out}
                    onChange={(e) => setEditingBooking({ ...editingBooking, check_out: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingBooking(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-[rgba(27,54,93,0.1)] text-[#44474e]/70 hover:bg-[rgba(27,54,93,0.03)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#002046] text-white hover:bg-[#1b365d] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#44474e]/60">{label}</span>
      <span className="text-xs font-semibold text-[#002046] capitalize">{value}</span>
    </div>
  );
}
