"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DocumentCard from "@/components/DocumentCard";
import { Document } from "@/lib/types";

/* ─────────── Mock Data ─────────── */
const MOCK_DOCS: Document[] = [
  { id: "d-001", user_id: "u2", booking_id: "b-001", document_type: "Income Proof",             context: "booking", status: "pending",   created_at: new Date(Date.now() - 7200000).toISOString(),   user_name: "Klaus Müller",     user_email: "klaus@example.com",  file_path: "/docs/income.pdf", verified_by: null, verified_at: null },
  { id: "d-002", user_id: "u3", booking_id: null,    document_type: "ID Verification",          context: "profile", status: "pending",   created_at: new Date(Date.now() - 18000000).toISOString(),  user_name: "Aiko Tanaka",      user_email: "aiko@example.com",   file_path: "/docs/id.pdf", verified_by: null, verified_at: null },
  { id: "d-003", user_id: "u2", booking_id: "b-001", document_type: "Employment Letter",        context: "booking", status: "pending",   created_at: new Date(Date.now() - 86400000).toISOString(),  user_name: "Klaus Müller",     user_email: "klaus@example.com",  file_path: "/docs/employment.pdf", verified_by: null, verified_at: null },
  { id: "d-004", user_id: "u4", booking_id: null,    document_type: "Passport Copy",            context: "profile", status: "pending",   created_at: new Date(Date.now() - 100000000).toISOString(), user_name: "Sara Kovač",       user_email: "sara@example.com",   file_path: "/docs/passport.pdf", verified_by: null, verified_at: null },
  { id: "d-005", user_id: "u1", booking_id: "b-002", document_type: "Structural Survey Report", context: "booking", status: "pending",   created_at: new Date(Date.now() - 172800000).toISOString(), user_name: "Elena Rodriguez",  user_email: "elena@example.com",  file_path: "/docs/survey.pdf", verified_by: null, verified_at: null },
  { id: "d-006", user_id: "u5", booking_id: "b-003", document_type: "Bank Statement",           context: "booking", status: "verified",  created_at: new Date(Date.now() - 259200000).toISOString(), user_name: "Marc Dubois",      user_email: "marc@example.com",   file_path: "/docs/bank.pdf", verified_by: "e1", verified_at: new Date(Date.now() - 250000000).toISOString() },
  { id: "d-007", user_id: "u1", booking_id: null,    document_type: "Driver License",           context: "profile", status: "verified",  created_at: new Date(Date.now() - 345600000).toISOString(), user_name: "Elena Rodriguez",  user_email: "elena@example.com",  file_path: "/docs/license.pdf", verified_by: "e1", verified_at: new Date(Date.now() - 340000000).toISOString() },
  { id: "d-008", user_id: "u5", booking_id: null,    document_type: "Rental History",           context: "profile", status: "rejected",  created_at: new Date(Date.now() - 432000000).toISOString(), user_name: "Marc Dubois",      user_email: "marc@example.com",   file_path: "/docs/rental.pdf", verified_by: "e1", verified_at: new Date(Date.now() - 420000000).toISOString() },
];

/* ─────────── Component ─────────── */
export default function DocumentsPage() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [tab, setTab] = useState<"all" | "booking" | "profile">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Document["status"]>("all");
  const [reviewingDoc, setReviewingDoc] = useState<Document | null>(null);

  const filtered = docs.filter((d) => {
    if (tab !== "all" && d.context !== tab) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = docs.filter((d) => d.status === "pending").length;
  const verifiedCount = docs.filter((d) => d.status === "verified").length;
  const rejectedCount = docs.filter((d) => d.status === "rejected").length;

  async function handleVerify(docId: string, newStatus: "verified" | "rejected") {
    // Optimistic update
    setDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: newStatus } : d))
    );
    setReviewingDoc(null);

    // Supabase update (works once real DB is connected)
    const supabase = createClient();
    await supabase
      .from("documents")
      .update({
        status: newStatus,
        verified_at: new Date().toISOString(),
      })
      .eq("id", docId);
  }

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Compliance Suite</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#002046] tracking-tight">Verification Center</h2>
          <p className="text-sm text-[#44474e]/70 mt-1">Review and authorize documents from booking applications and user profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="reveal-button border border-[#002046] text-[#002046] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBadge icon="priority_high" label="Action Required" value={pendingCount} color="#ba1a1a" bg="rgba(186,26,26,0.06)" />
        <StatBadge icon="verified" label="Verified" value={verifiedCount} color="#16a34a" bg="rgba(22,163,74,0.06)" />
        <StatBadge icon="cancel" label="Rejected" value={rejectedCount} color="#44474e" bg="rgba(68,71,78,0.06)" />
      </div>

      {/* Context Tabs: Booking / Profile */}
      <div className="flex items-center gap-6 border-b border-[rgba(27,54,93,0.06)] pb-3">
        {(["all", "booking", "profile"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all border-b-2 ${
              tab === t ? "text-[#002046] border-[#735c00]" : "text-[#44474e]/40 border-transparent hover:text-[#002046]"
            }`}
          >
            {t === "all" ? "All Documents" : t === "booking" ? "📋 Booking Docs" : "👤 Profile Docs"}
          </button>
        ))}

        {/* Status filter */}
        <div className="ml-auto flex gap-2">
          {(["all", "pending", "verified", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                statusFilter === s
                  ? "bg-[#002046] text-white border-[#002046]"
                  : "bg-transparent text-[#44474e]/50 border-[rgba(27,54,93,0.08)] hover:border-[#002046] hover:text-[#002046]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            onReview={setReviewingDoc}
            onReject={(id) => handleVerify(id, "rejected")}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <span className="material-symbols-outlined text-[48px] text-[#44474e]/20 mb-3 block">inbox</span>
            <p className="text-sm text-[#44474e]/50">No documents match your filters.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingDoc && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-5" onClick={() => setReviewingDoc(null)}>
          <div
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-6 border-b border-[rgba(27,54,93,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#002046]">Document Review</h3>
                  <p className="text-xs text-[#44474e]/50 mt-0.5">{reviewingDoc.document_type}</p>
                </div>
                <button onClick={() => setReviewingDoc(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Document preview placeholder */}
            <div className="p-6">
              <div className="w-full h-48 bg-[#eff4ff] rounded-2xl flex items-center justify-center border-2 border-dashed border-[rgba(27,54,93,0.1)] mb-6">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[40px] text-[#002046]/20 mb-2 block">picture_as_pdf</span>
                  <p className="text-xs text-[#44474e]/50">{reviewingDoc.file_path}</p>
                  <button className="mt-2 text-xs text-[#735c00] font-semibold hover:text-[#002046] transition-colors flex items-center gap-1 mx-auto">
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Open Full Document
                  </button>
                </div>
              </div>

              {/* Document details */}
              <div className="space-y-3 mb-6">
                <DetailRow label="Submitted by" value={reviewingDoc.user_name || "Unknown"} />
                <DetailRow label="Email" value={reviewingDoc.user_email || "N/A"} />
                <DetailRow label="Document type" value={reviewingDoc.document_type || "N/A"} />
                <DetailRow label="Context" value={reviewingDoc.context === "booking" ? `Booking — ${reviewingDoc.booking_id || "Application"}` : "User Profile"} />
                <DetailRow label="Submitted" value={new Date(reviewingDoc.created_at).toLocaleDateString()} />
                <DetailRow label="Current status" value={reviewingDoc.status} />
              </div>

              {/* Action buttons */}
              {reviewingDoc.status === "pending" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerify(reviewingDoc.id, "verified")}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve & Verify
                  </button>
                  <button
                    onClick={() => handleVerify(reviewingDoc.id, "rejected")}
                    className="flex-1 bg-red-50 text-red-700 py-3 rounded-xl font-semibold text-sm border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Reject
                  </button>
                </div>
              ) : (
                <div className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold ${
                  reviewingDoc.status === "verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <span className="material-symbols-outlined text-[18px]">{reviewingDoc.status === "verified" ? "verified" : "cancel"}</span>
                  {reviewingDoc.status === "verified" ? "Document Verified ✓" : "Document Rejected"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer decoration */}
      <div className="flex flex-col items-center pt-8">
        <div className="w-24 h-0.5 gold-gradient mb-4 rounded-full" />
        <p className="text-[#44474e]/30 text-[10px] uppercase tracking-[0.3em] font-bold">End of Verification Queue</p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatBadge({ icon, label, value, color, bg }: { icon: string; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: bg }}>
        <span className="material-symbols-outlined text-[24px]" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#002046]">{value}</p>
        <p className="text-[10px] font-bold text-[#44474e]/50 uppercase tracking-widest">{label}</p>
      </div>
    </div>
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
