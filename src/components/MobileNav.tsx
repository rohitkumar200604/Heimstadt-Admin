"use client";

import Sidebar from "@/components/Sidebar";
import { UserRole } from "@/lib/types";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
  userEmail: string;
}

export default function MobileNav({
  isOpen,
  onClose,
  role,
  fullName,
  avatarUrl,
  userEmail,
}: MobileNavProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-out Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "var(--sidebar-width)" }}
      >
        <Sidebar
          role={role}
          fullName={fullName}
          avatarUrl={avatarUrl}
          userEmail={userEmail}
          onClose={onClose}
        />
      </div>
    </>
  );
}
