"use client";

import { useRef, useEffect } from "react";
import { SupportThread, SupportMessage } from "@/lib/types";

interface ChatWindowProps {
  thread: SupportThread;
  messages: SupportMessage[];
  currentUserId: string;
  reply: string;
  setReply: (reply: string) => void;
  onSend: () => void;
  onBack: () => void;
  mobileVisible: boolean;
}

export default function ChatWindow({
  thread,
  messages,
  currentUserId,
  reply,
  setReply,
  onSend,
  onBack,
  mobileVisible,
}: ChatWindowProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex-1 flex flex-col glass-card rounded-2xl overflow-hidden shadow-lg ${!mobileVisible ? "hidden md:flex" : "flex"}`}>
      {/* Chat header */}
      <div className="p-4 md:p-5 border-b border-[rgba(27,54,93,0.06)] flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="md:hidden text-[#44474e]/60 hover:text-[#002046] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002046] to-[#1b365d] flex items-center justify-center text-white text-sm font-bold">
              {thread.otherName?.charAt(0) ?? "?"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-[#002046] text-sm">{thread.otherName}</h3>
            <p className="text-[10px] text-[#44474e]/50">{thread.otherEmail}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-[rgba(239,244,255,0.3)]">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 max-w-[85%] ${isMine ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isMine
                    ? "bg-[#002046] text-white rounded-br-none"
                    : "glass-card text-[#0b1c30] rounded-bl-none"
                }`}
              >
                {msg.body}
              </div>
              <span className="text-[9px] text-[#44474e]/40 mb-1.5 flex-shrink-0">
                {new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 bg-white/60 border-t border-[rgba(27,54,93,0.06)]">
        <div className="glass-card rounded-2xl p-2 flex items-center gap-2">
          <button className="p-2 text-[#44474e]/40 hover:text-[#002046] transition-colors">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
          </button>
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Type your reply…"
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-[#0b1c30] placeholder:text-[#44474e]/40 py-2"
          />
          <button className="p-2 text-[#44474e]/40 hover:text-[#735c00] transition-colors">
            <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
          </button>
          <button
            onClick={onSend}
            disabled={!reply.trim()}
            className="w-9 h-9 rounded-xl bg-[#002046] text-white flex items-center justify-center hover:bg-[#1b365d] active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
