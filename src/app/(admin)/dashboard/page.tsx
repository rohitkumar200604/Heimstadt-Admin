import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";

export const metadata = { title: "Dashboard — Heimstadt Admin" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "employee";
  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";

  // Fetch mock stats (will use real data when tables exist)
  // Admin stats
  const [
    { count: bookingsCount },
    { count: pendingDocsCount },
    { count: openChatsCount },
    { count: propertiesCount },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("conversations").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("properties").select("*", { count: "exact", head: true }),
  ]);

  const stats = {
    bookings: bookingsCount ?? 0,
    pendingDocs: pendingDocsCount ?? 0,
    openChats: openChatsCount ?? 0,
    properties: propertiesCount ?? 0,
  };

  if (role === "admin") {
    return <AdminDashboard stats={stats} fullName={fullName} />;
  }

  return <EmployeeDashboard stats={stats} fullName={fullName} userId={user.id} />;
}
