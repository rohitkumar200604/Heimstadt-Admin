"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";
import { UserRole } from "@/lib/types";

interface SidebarShellProps {
  children: React.ReactNode;
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
  userEmail: string;
}

export default function SidebarShell({ children, role, fullName, avatarUrl, userEmail }: SidebarShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9ff] relative">
      {/* Atmospheric blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,32,70,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(115,92,0,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Mobile navigation drawer */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        role={role}
        fullName={fullName}
        avatarUrl={avatarUrl}
        userEmail={userEmail}
      />

      {/* Desktop Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-50 hidden md:block"
        style={{ width: "var(--sidebar-width)" }}
      >
        <Sidebar role={role} fullName={fullName} avatarUrl={avatarUrl} userEmail={userEmail} />
      </div>

      {/* Main area */}
      <div className="md:ml-[var(--sidebar-width)] min-h-screen flex flex-col">
        <TopBar
          role={role}
          fullName={fullName}
          avatarUrl={avatarUrl}
          userEmail={userEmail}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-5 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

