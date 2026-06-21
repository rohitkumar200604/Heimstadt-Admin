import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateTempPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => b.toString(36)).join("").slice(0, 16) + "!A1";
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") {
    return NextResponse.json({ success: false, error: "Only admins can add team members" }, { status: 403 });
  }

  const { full_name, email, role } = await req.json();

  if (!full_name?.trim() || !email?.trim() || !["admin", "employee"].includes(role)) {
    return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const tempPassword = generateTempPassword();

  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email: email.trim(),
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: full_name.trim() },
  });

  if (createErr || !created.user) {
    return NextResponse.json({ success: false, error: createErr?.message || "Failed to create user" }, { status: 400 });
  }

  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: created.user.id, full_name: full_name.trim(), email: email.trim(), role }, { onConflict: "id" });

  if (profileErr) {
    return NextResponse.json({ success: false, error: profileErr.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, email: email.trim(), tempPassword });
}
