"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",    href: "/dashboard",  icon: "dashboard" },
  { label: "Bookings",     href: "/bookings",   icon: "calendar_check" },
  { label: "Messages",     href: "/messages",   icon: "forum" },
  { label: "Documents",    href: "/documents",  icon: "folder_open" },
  { label: "Properties",   href: "/properties", icon: "domain" },
  { label: "Team",         href: "/team",       icon: "group", adminOnly: true },
  { label: "Settings",     href: "/settings",   icon: "settings" },
];

interface SidebarProps {
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
  userEmail: string;
  onClose?: () => void;
}

export default function Sidebar({ role, fullName, avatarUrl, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || role === "admin"
  );

  return (
    <aside className="h-full flex flex-col glass-sidebar shadow-[4px_0_40px_rgba(27,54,93,0.08)]">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-[rgba(27,54,93,0.06)]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" }}
          >
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              home_work
            </span>
          </div>
          <div>
            <p className="font-bold text-[#002046] leading-tight text-base tracking-tight">Heimstadt</p>
            <p className="text-[10px] text-[#44474e]/60 uppercase tracking-[0.25em] mt-0.5">
              {role === "admin" ? "Admin Portal" : "Staff Portal"}
            </p>
          </div>
          {/* Mobile close */}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto md:hidden text-[#44474e]/60 hover:text-[#002046] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Role badge */}
        <div className={cn(
          "mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          role === "admin"
            ? "bg-[#002046]/8 text-[#002046]"
            : "bg-[#fddd7c]/50 text-[#735c00]"
        )}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: role === "admin" ? "#002046" : "#735c00" }} />
          {role === "admin" ? "Administrator" : "Employee"}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#44474e]/40">
          Navigation
        </p>
        {visibleItems.map(({ label, href, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-[#fddd7c]/50 text-[#735c00] border-r-2 border-[#735c00]"
                  : "text-[#44474e]/60 hover:text-[#0b1c30] hover:bg-[rgba(27,54,93,0.04)]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px] transition-colors",
                  active ? "text-[#735c00]" : "text-[#44474e]/40 group-hover:text-[#002046]"
                )}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-[rgba(27,54,93,0.06)]">
          <a
            href="https://heimstadt.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#44474e]/40 hover:text-[#0b1c30] hover:bg-[rgba(27,54,93,0.04)] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[22px] text-[#44474e]/30">language</span>
            Main Website ↗
          </a>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-[rgba(27,54,93,0.06)]">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={fullName} width={32} height={32} className="rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#002046] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#002046] truncate">{fullName}</p>
            <p className="text-[10px] text-[#44474e]/50 capitalize">{role}</p>
          </div>
        </div>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#44474e]/50 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
