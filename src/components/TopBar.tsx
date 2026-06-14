"use client";

import { Bell, Menu } from "lucide-react";
import { UserRole } from "@/lib/types";

interface TopBarProps {
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
  onMenuClick: () => void;
}

export default function TopBar({ role, fullName, onMenuClick }: TopBarProps) {
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <header
      className="glass-topbar sticky top-0 z-40 flex items-center justify-between px-5 md:px-8"
      style={{ height: "var(--topbar-height)" }}
    >
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger — mobile only */}
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          className="md:hidden text-[#44474e] hover:text-[#002046] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#44474e]/40 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search bookings, messages, documents…"
            className="pl-9 pr-4 py-2 text-sm bg-[#eff4ff] border border-[rgba(27,54,93,0.08)] rounded-full
                       text-[#0b1c30] placeholder:text-[#44474e]/40
                       focus:outline-none focus:ring-2 focus:ring-[#002046]/15 focus:border-[#002046]
                       w-48 md:w-72 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#44474e]/60 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fed65b] border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[rgba(27,54,93,0.08)]" />

        {/* User pill */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#002046] leading-tight">{fullName}</p>
            <p className="text-[10px] text-[#44474e]/50 capitalize">{role}</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm border-2 border-[#fed65b]"
            style={{ background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" }}
          >
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
