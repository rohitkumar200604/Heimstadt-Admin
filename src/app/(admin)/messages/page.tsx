"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatWindow from "@/components/ChatWindow";
import type { SupportMessage, SupportThread } from "@/lib/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function buildThreads(messages: SupportMessage[], meId: string, profiles: Map<string, { full_name: string | null; email: string | null }>) {
  const byOther = new Map<string, SupportMessage[]>();
  for (const m of messages) {
    const otherId = m.sender_id === meId ? m.recipient_id : m.sender_id;
    if (!otherId || otherId === meId) continue;
    if (!byOther.has(otherId)) byOther.set(otherId, []);
    byOther.get(otherId)!.push(m);
  }

  const threads: SupportThread[] = [];
  for (const [otherId, msgs] of byOther) {
    msgs.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
    const profile = profiles.get(otherId);
    threads.push({
      otherId,
      otherName: profile?.full_name || "Unknown",
      otherEmail: profile?.email || "",
      messages: msgs,
      unreadCount: msgs.filter((m) => m.sender_id === otherId && !m.is_read).length,
    });
  }

  threads.sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.sent_at ?? "";
    const bLast = b.messages[b.messages.length - 1]?.sent_at ?? "";
    return new Date(bLast).getTime() - new Date(aLast).getTime();
  });
  return threads;
}

export default function MessagesPage() {
  const [meId, setMeId] = useState<string | null>(null);
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  const meIdRef = useRef<string | null>(null);

  const fetchThreads = useCallback(async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const me = userData.user?.id;
    if (!me) return;
    meIdRef.current = me;
    setMeId(me);

    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, sender_id, recipient_id, body, sent_at, is_read")
      .or(`sender_id.eq.${me},recipient_id.eq.${me}`)
      .order("sent_at", { ascending: true });

    if (error || !messages) {
      setLoading(false);
      return;
    }

    const otherIds = Array.from(
      new Set(
        messages
          .map((m) => (m.sender_id === me ? m.recipient_id : m.sender_id))
          .filter((id): id is string => !!id && id !== me)
      )
    );

    const profileMap = new Map<string, { full_name: string | null; email: string | null }>();
    if (otherIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", otherIds);
      for (const p of profiles ?? []) {
        profileMap.set(p.id, { full_name: p.full_name, email: p.email });
      }
    }

    const built = buildThreads(messages as SupportMessage[], me, profileMap);
    setThreads(built);
    setLoading(false);
    setActiveId((prev) => prev ?? built[0]?.otherId ?? null);
  }, []);

  useEffect(() => {
    fetchThreads();

    const supabase = createClient();
    const channel = supabase
      .channel("support-messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        fetchThreads();
      })
      .subscribe();

    const pollId = setInterval(fetchThreads, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollId);
    };
  }, [fetchThreads]);

  const activeThread = threads.find((t) => t.otherId === activeId) ?? null;

  const selectThread = useCallback(
    async (otherId: string) => {
      setActiveId(otherId);
      setMobileShowChat(true);

      const me = meIdRef.current;
      if (!me) return;
      const thread = threads.find((t) => t.otherId === otherId);
      if (!thread || thread.unreadCount === 0) return;

      // Mark incoming messages from this person as read.
      const supabase = createClient();
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", otherId)
        .eq("recipient_id", me)
        .eq("is_read", false);

      setThreads((prev) =>
        prev.map((t) =>
          t.otherId === otherId
            ? { ...t, unreadCount: 0, messages: t.messages.map((m) => ({ ...m, is_read: true })) }
            : t
        )
      );
    },
    [threads]
  );

  async function handleSend() {
    const text = reply.trim();
    if (!text || !meId || !activeId) return;

    setReply("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: meId, recipient_id: activeId, body: text, channel: "chat_with_us" })
      .select("id, sender_id, recipient_id, body, sent_at, is_read")
      .single();

    if (!error && data) {
      setThreads((prev) =>
        prev.map((t) => (t.otherId === activeId ? { ...t, messages: [...t.messages, data as SupportMessage] } : t))
      );
    } else {
      console.error("Failed to send reply:", error);
      setReply(text);
    }
  }

  const filtered = threads.filter((t) => (tab === "unread" ? t.unreadCount > 0 : true));

  return (
    <div className="h-[calc(100vh-var(--topbar-height)-40px)] md:h-[calc(100vh-var(--topbar-height)-64px)] flex flex-col max-w-[1280px] mx-auto">
      {/* Page header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Support Center</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#002046] tracking-tight">Messages</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>
      </div>

      {/* Chat layout */}
      <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
        {/* Left: Conversation list */}
        <div className={`w-full md:w-[340px] flex-shrink-0 flex flex-col glass-card rounded-2xl overflow-hidden ${mobileShowChat ? "hidden md:flex" : "flex"}`}>
          {/* Tabs */}
          <div className="p-4 border-b border-[rgba(27,54,93,0.06)] bg-white/40">
            <div className="flex gap-4">
              {(["all", "unread"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-xs font-bold capitalize pb-1 transition-colors ${
                    tab === t ? "text-[#002046] border-b-2 border-[#735c00]" : "text-[#44474e]/50 hover:text-[#002046]"
                  }`}
                >
                  {t === "all" ? "All Chats" : "Unread"}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="p-6 text-center text-xs text-[#44474e]/50">Loading conversations…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="p-6 text-center text-xs text-[#44474e]/50">
                No {tab === "unread" ? "unread " : ""}messages yet. Visitor messages from the &ldquo;Chat with us&rdquo;
                widget on the main site will show up here.
              </div>
            )}
            {filtered.map((thread) => {
              const last = thread.messages[thread.messages.length - 1];
              const isActive = thread.otherId === activeId;
              return (
                <button
                  key={thread.otherId}
                  onClick={() => selectThread(thread.otherId)}
                  className={`w-full text-left p-4 border-b border-[rgba(27,54,93,0.04)] transition-all ${
                    isActive
                      ? "bg-[rgba(253,221,124,0.12)] border-l-4 border-l-[#735c00]"
                      : "hover:bg-[rgba(27,54,93,0.02)] border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    {thread.unreadCount > 0 ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border bg-red-50 text-red-700 border-red-200">
                        {thread.unreadCount} NEW
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                        READ
                      </span>
                    )}
                    {last && <span className="text-[10px] text-[#44474e]/40">{timeAgo(last.sent_at)}</span>}
                  </div>
                  <p className="text-sm font-semibold text-[#002046] mb-0.5 truncate">{thread.otherName}</p>
                  <p className="text-xs text-[#44474e]/60 truncate">{last?.body}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Chat window */}
        {activeThread && meId ? (
          <ChatWindow
            thread={activeThread}
            messages={activeThread.messages}
            currentUserId={meId}
            reply={reply}
            setReply={setReply}
            onSend={handleSend}
            onBack={() => setMobileShowChat(false)}
            mobileVisible={mobileShowChat}
          />
        ) : (
          !loading && (
            <div className="flex-1 hidden md:flex items-center justify-center glass-card rounded-2xl text-sm text-[#44474e]/50">
              Select a conversation to view messages.
            </div>
          )
        )}
      </div>
    </div>
  );
}
