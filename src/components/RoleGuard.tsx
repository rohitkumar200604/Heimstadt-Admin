"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export default function RoleGuard({ children, allowedRoles, fallbackPath = "/dashboard" }: RoleGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role ?? "employee";

      if (allowedRoles.includes(role)) {
        setAuthorized(true);
      } else {
        router.replace(fallbackPath);
      }
      setLoading(false);
    }

    checkRole();
  }, [allowedRoles, fallbackPath, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[rgba(27,54,93,0.1)] border-t-[#735c00] animate-spin" />
        <p className="text-xs text-[#44474e]/50 mt-4 font-medium uppercase tracking-widest">Checking permissions…</p>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect shortly
  }

  return <>{children}</>;
}
