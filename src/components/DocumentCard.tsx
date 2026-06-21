"use client";

import { Document, DOC_TYPE_LABELS } from "@/lib/types";

interface DocumentCardProps {
  doc: Document;
  onReview: (doc: Document) => void;
  onReject: (id: string) => void;
}

export default function DocumentCard({ doc, onReview, onReject }: DocumentCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 card-hover group relative">
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <StatusBadge status={doc.status} />
      </div>

      {/* Doc icon + type */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[20px] text-[#002046]/50">badge</span>
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[#002046] group-hover:text-[#735c00] transition-colors truncate pr-16">
            {DOC_TYPE_LABELS[doc.doc_type]}
          </h4>
          <p className="text-[10px] text-[#44474e]/50 truncate">{doc.file_name}</p>
        </div>
      </div>

      {/* Submitter */}
      <div className="flex items-center gap-2 py-3 border-y border-[rgba(27,54,93,0.06)]">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#002046] to-[#1b365d] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
          {(doc.user_name || "U").charAt(0)}
        </div>
        <span className="text-xs text-[#44474e]/80">
          <strong className="text-[#002046]">{doc.user_name || doc.user_id || "User"}</strong>
        </span>
        <span className="ml-auto text-[10px] text-[#44474e]/40">
          {new Date(doc.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        {doc.status === "pending" ? (
          <>
            <button
              onClick={() => onReview(doc)}
              className="flex-1 bg-[#002046] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1b365d] transition-colors"
            >
              Review Document
            </button>
            <button
              onClick={() => onReject(doc.id)}
              className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors group/btn"
              title="Flag / Reject"
            >
              <span className="material-symbols-outlined text-[18px] text-[#44474e]/40 group-hover/btn:text-red-600">flag</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => onReview(doc)}
            className="flex-1 border border-[rgba(27,54,93,0.08)] text-[#44474e]/70 py-2.5 rounded-xl text-xs font-semibold hover:bg-[rgba(27,54,93,0.03)] transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Document["status"] }) {
  const styles = {
    pending:  { cls: "bg-amber-50 text-amber-700 border-amber-200",     icon: "schedule" },
    approved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "check_circle" },
    rejected: { cls: "bg-red-50 text-red-700 border-red-200",            icon: "cancel" },
  };
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${s.cls}`}>
      <span className="material-symbols-outlined text-[10px]">{s.icon}</span>
      {status}
    </span>
  );
}
