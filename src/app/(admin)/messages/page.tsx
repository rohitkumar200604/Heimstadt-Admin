"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatWindow from "@/components/ChatWindow";
import type { Conversation, ChatMessage } from "@/lib/types";

/* ─────────── Mock Data ─────────── */
const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "c-001", user_id: "u1", user_name: "Elena Rodriguez",  user_email: "elena@example.com",  subject: "HVAC Malfunction - Unit 402",    status: "open", assigned_to: null, created_at: new Date(Date.now() - 120000).toISOString(), last_message: "The air conditioning unit in the north bedroom is making a loud metallic grinding sound...", unread_count: 2 },
  { id: "c-002", user_id: "u2", user_name: "Klaus Müller",     user_email: "klaus@example.com",   subject: "Lease Renewal Inquiry",           status: "open", assigned_to: null, created_at: new Date(Date.now() - 3600000).toISOString(), last_message: "Hello, I'd like to discuss the terms for extending my stay for another 24 months...", unread_count: 1 },
  { id: "c-003", user_id: "u3", user_name: "Aiko Tanaka",      user_email: "aiko@example.com",    subject: "Payment Confirmation Request",    status: "open", assigned_to: null, created_at: new Date(Date.now() - 10800000).toISOString(), last_message: "I've sent the wire transfer for this month's rent but haven't seen it reflected yet...", unread_count: 0 },
  { id: "c-004", user_id: "u4", user_name: "Marc Dubois",      user_email: "marc@example.com",    subject: "Parking Slot Availability",       status: "open", assigned_to: null, created_at: new Date(Date.now() - 18000000).toISOString(), last_message: "Are there any additional guest parking spots available for this coming weekend?", unread_count: 0 },
  { id: "c-005", user_id: "u5", user_name: "Sara Kovač",       user_email: "sara@example.com",    subject: "Move-in Date Confirmation",       status: "closed", assigned_to: null, created_at: new Date(Date.now() - 86400000).toISOString(), last_message: "Thank you, everything is confirmed. See you on Monday!", unread_count: 0 },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "c-001": [
    { id: "m1", conversation_id: "c-001", sender_type: "user",     sender_id: "u1", content: "The air conditioning unit in the north bedroom is making a loud metallic grinding sound. It seems to be cooling, but the noise is quite disruptive. Can we have someone look at it?", created_at: new Date(Date.now() - 180000).toISOString() },
    { id: "m2", conversation_id: "c-001", sender_type: "employee", sender_id: "e1", content: "Hello Elena, sorry to hear about the HVAC issue. I've flagged this as urgent. Our technician, Marcus, is currently in the building and can be at your unit in approximately 15 minutes. Does that work for you?", created_at: new Date(Date.now() - 120000).toISOString() },
    { id: "m3", conversation_id: "c-001", sender_type: "user",     sender_id: "u1", content: "Yes, that would be perfect. I'm home and will be here all morning. Thank you for the quick response!", created_at: new Date(Date.now() - 60000).toISOString() },
  ],
  "c-002": [
    { id: "m4", conversation_id: "c-002", sender_type: "user",     sender_id: "u2", content: "Hello, I'd like to discuss the terms for extending my stay for another 24 months. My current lease expires in 3 months.", created_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  "c-003": [
    { id: "m5", conversation_id: "c-003", sender_type: "user",     sender_id: "u3", content: "I've sent the wire transfer for this month's rent but haven't seen it reflected in the portal yet. Could you please check?", created_at: new Date(Date.now() - 10800000).toISOString() },
  ],
  "c-004": [
    { id: "m6", conversation_id: "c-004", sender_type: "user",     sender_id: "u4", content: "Are there any additional guest parking spots available for this coming weekend? I'm expecting visitors.", created_at: new Date(Date.now() - 18000000).toISOString() },
  ],
  "c-005": [
    { id: "m7", conversation_id: "c-005", sender_type: "user",     sender_id: "u5", content: "Could you confirm my move-in date and time?", created_at: new Date(Date.now() - 90000000).toISOString() },
    { id: "m8", conversation_id: "c-005", sender_type: "employee", sender_id: "e1", content: "Absolutely, Sara! Your move-in is confirmed for Monday at 10:00 AM. Our concierge will meet you at the lobby.", created_at: new Date(Date.now() - 87000000).toISOString() },
    { id: "m9", conversation_id: "c-005", sender_type: "user",     sender_id: "u5", content: "Thank you, everything is confirmed. See you on Monday!", created_at: new Date(Date.now() - 86400000).toISOString() },
  ],
};

/* ─────────── Urgency label ─────────── */
function getUrgencyLabel(conv: Conversation) {
  if ((conv.unread_count ?? 0) > 0) return { label: "URGENT", cls: "bg-red-50 text-red-700 border-red-200" };
  if (conv.status === "closed") return { label: "CLOSED", cls: "bg-[#e5eeff] text-[#44474e] border-[#c4c6cf]" };
  return { label: "OPEN", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* ─────────── Main Component ─────────── */
export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES["c-001"]);
  const [reply, setReply] = useState("");
  const [tab, setTab] = useState<"all" | "open" | "closed">("all");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const activeConv = conversations.find((c) => c.id === activeId)!;

  /* Subscribe to realtime (will work once real DB is connected) */
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("chat-messages-realtime")
      .on(
        "postgres_changes" as never,
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload: { new: ChatMessage }) => {
          const msg = payload.new;
          if (msg.conversation_id === activeId) {
            setMessages((prev) => [...prev, msg]);
          }
          // Update unread count on conversation list
          setConversations((prev) =>
            prev.map((c) =>
              c.id === msg.conversation_id && msg.sender_type === "user"
                ? { ...c, last_message: msg.content, unread_count: (c.unread_count ?? 0) + 1 }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeId]);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setMessages(MOCK_MESSAGES[id] || []);
    setMobileShowChat(true);
    // Mark read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c))
    );
  }, []);

  async function handleSend() {
    if (!reply.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversation_id: activeId,
      sender_type: "employee",
      sender_id: "current-user",
      content: reply.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, last_message: reply.trim() } : c))
    );
    setReply("");

    // Insert into Supabase (will work once real DB is connected)
    const supabase = createClient();
    await supabase.from("chat_messages").insert({
      conversation_id: activeId,
      sender_type: "employee",
      content: newMsg.content,
    });
  }

  const filtered = conversations.filter((c) => {
    if (tab === "open") return c.status === "open";
    if (tab === "closed") return c.status === "closed";
    return true;
  });

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
          <span className="text-xs text-[#44474e]/50">Avg response: 4m</span>
        </div>
      </div>

      {/* Chat layout */}
      <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
        {/* Left: Conversation list */}
        <div className={`w-full md:w-[340px] flex-shrink-0 flex flex-col glass-card rounded-2xl overflow-hidden ${mobileShowChat ? "hidden md:flex" : "flex"}`}>
          {/* Tabs */}
          <div className="p-4 border-b border-[rgba(27,54,93,0.06)] bg-white/40">
            <div className="flex gap-4">
              {(["all", "open", "closed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-xs font-bold capitalize pb-1 transition-colors ${
                    tab === t ? "text-[#002046] border-b-2 border-[#735c00]" : "text-[#44474e]/50 hover:text-[#002046]"
                  }`}
                >
                  {t === "all" ? "All Chats" : t === "open" ? "Open" : "Closed"}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => {
              const urgency = getUrgencyLabel(conv);
              const isActive = conv.id === activeId;
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`w-full text-left p-4 border-b border-[rgba(27,54,93,0.04)] transition-all ${
                    isActive
                      ? "bg-[rgba(253,221,124,0.12)] border-l-4 border-l-[#735c00]"
                      : "hover:bg-[rgba(27,54,93,0.02)] border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${urgency.cls}`}>
                      {urgency.label}
                    </span>
                    <span className="text-[10px] text-[#44474e]/40">{timeAgo(conv.created_at)}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#002046] mb-0.5 truncate">{conv.subject}</p>
                  <p className="text-xs text-[#44474e]/60 truncate">{conv.last_message}</p>
                  <p className="text-[10px] text-[#44474e]/40 mt-1">{conv.user_name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Chat window */}
        <ChatWindow
          conversation={activeConv}
          messages={messages}
          reply={reply}
          setReply={setReply}
          onSend={handleSend}
          onBack={() => setMobileShowChat(false)}
          mobileVisible={mobileShowChat}
        />
      </div>
    </div>
  );
}
