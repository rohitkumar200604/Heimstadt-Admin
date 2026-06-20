"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
  CalendarCheck,
  MessageSquare,
  FileCheck2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopBarProps {
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
  userEmail: string;
  onMenuClick: () => void;
}

interface NotificationItem {
  id: string;
  icon: typeof Bell;
  color: string;
  bg: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", icon: CalendarCheck, color: "#002046", bg: "rgba(0,32,70,0.08)", title: "New booking request", description: "Klaus Müller requested Villa 3 for Jun 13", time: "12m ago", unread: true },
  { id: "n2", icon: FileCheck2, color: "#735c00", bg: "rgba(115,92,0,0.08)", title: "Document awaiting review", description: "Aiko Tanaka submitted an ID verification", time: "2h ago", unread: true },
  { id: "n3", icon: MessageSquare, color: "#1b365d", bg: "rgba(27,54,93,0.08)", title: "New support message", description: "Sara Kovač replied in ticket #482", time: "5h ago", unread: false },
  { id: "n4", icon: CalendarCheck, color: "#002046", bg: "rgba(0,32,70,0.08)", title: "Booking confirmed", description: "Elena Rodriguez — Skyline Residences", time: "Yesterday", unread: false },
];

export default function TopBar({ role, fullName, avatarUrl, userEmail, onMenuClick }: TopBarProps) {
  const initial = fullName.charAt(0).toUpperCase();
  const router = useRouter();

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

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
        <div className="relative" ref={notifRef}>
          <button
            id="notification-btn"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#44474e]/60 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fed65b] border-2 border-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 dropdown-panel rounded-2xl shadow-card-lg overflow-hidden animate-slide-down origin-top-right z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(27,54,93,0.06)]">
                <div>
                  <p className="text-sm font-semibold text-[#002046]">Notifications</p>
                  <p className="text-[11px] text-[#44474e]/50">
                    {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                    className="text-[11px] font-semibold text-[#735c00] hover:text-[#002046] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(27,54,93,0.05)]">
                {notifications.map(({ id, icon: Icon, color, bg, title, description, time, unread }) => (
                  <div key={id} className="flex gap-3 px-4 py-3 hover:bg-[rgba(27,54,93,0.025)] transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#0b1c30] leading-snug">{title}</p>
                      <p className="text-xs text-[#44474e]/60 truncate">{description}</p>
                      <p className="text-[10px] text-[#44474e]/40 mt-1">{time}</p>
                    </div>
                    {unread && <span className="w-1.5 h-1.5 rounded-full bg-[#fed65b] flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[rgba(27,54,93,0.08)]" />

        {/* User pill */}
        <div className="relative" ref={profileRef}>
          <button
            id="profile-menu-btn"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-[rgba(27,54,93,0.04)] transition-all duration-200"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#002046] leading-tight">{fullName}</p>
              <p className="text-[10px] text-[#44474e]/50 capitalize">{role}</p>
            </div>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={36}
                height={36}
                className="rounded-full object-cover flex-shrink-0 shadow-sm border-2 border-[#fed65b]"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm border-2 border-[#fed65b]"
                style={{ background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" }}
              >
                {initial}
              </div>
            )}
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-[#44474e]/40 transition-transform duration-200 hidden sm:block",
                profileOpen && "rotate-180"
              )}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 dropdown-panel rounded-2xl shadow-card-lg overflow-hidden animate-slide-down origin-top-right z-50">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[rgba(27,54,93,0.06)]">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={fullName} width={40} height={40} className="rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" }}
                  >
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#002046] truncate">{fullName}</p>
                  <p className="text-[11px] text-[#44474e]/50 truncate">{userEmail}</p>
                </div>
              </div>
              <div className="p-1.5">
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#44474e]/70 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-[#44474e]/70 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
