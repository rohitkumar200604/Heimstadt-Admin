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
    <aside className="relative h-full flex flex-col glass-sidebar shadow-[4px_0_40px_rgba(27,54,93,0.08)] overflow-hidden">
      {/* Decorative glow accents */}
      <div
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,32,70,0.08) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-0 -right-20 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(253,221,124,0.14) 0%, transparent 70%)", filter: "blur(50px)" }}
      />
      {/* Accent rail */}
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: "linear-gradient(180deg, #fed65b 0%, #735c00 35%, transparent 70%)" }}
      />

      {/* Brand */}
      <div className="relative px-6 py-6 border-b border-[rgba(27,54,93,0.06)]">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-xl blur-md opacity-60"
              style={{ background: "linear-gradient(135deg, #fed65b 0%, #002046 100%)" }}
            />
            <Image
              src="/logo.jpg"
              alt="Heimstadt"
              width={40}
              height={40}
              className="relative w-10 h-10 rounded-xl object-cover object-top shadow-lg ring-1 ring-white/20"
            />
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
          "mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
          role === "admin"
            ? "text-white"
            : "bg-[#fddd7c]/50 text-[#735c00] border border-[#fddd7c]/60"
        )}
        style={role === "admin" ? { background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" } : undefined}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: role === "admin" ? "#fed65b" : "#735c00" }} />
          {role === "admin" ? "Administrator" : "Employee"}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden",
                active
                  ? "text-[#0b1c30]"
                  : "text-[#44474e]/60 hover:text-[#0b1c30] hover:bg-[rgba(27,54,93,0.045)] hover:translate-x-0.5"
              )}
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-xl shadow-[0_4px_14px_rgba(254,214,91,0.3)]"
                  style={{ background: "linear-gradient(120deg, rgba(254,214,91,0.45) 0%, rgba(253,221,124,0.2) 100%)" }}
                />
              )}
              {active && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                  style={{ background: "linear-gradient(180deg, #fed65b, #735c00)" }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                  active ? "bg-white/70 shadow-sm" : "group-hover:bg-white/60"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[20px] transition-colors",
                    active ? "text-[#735c00]" : "text-[#44474e]/40 group-hover:text-[#002046]"
                  )}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
              </span>
              <span className="relative z-10">{label}</span>
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
            <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#44474e]/30">language</span>
            </span>
            Main Website ↗
          </a>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="relative p-3 border-t border-[rgba(27,54,93,0.06)]">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-white/40 ring-1 ring-[rgba(27,54,93,0.05)] shadow-sm">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={fullName} width={34} height={34} className="rounded-full object-cover flex-shrink-0 ring-2 ring-[#fed65b]/60" />
          ) : (
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm ring-2 ring-[#fed65b]/60"
              style={{ background: "linear-gradient(135deg, #002046 0%, #1b365d 100%)" }}
            >
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
