"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center relative overflow-hidden px-5 py-12">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,32,70,0.07) 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(115,92,0,0.07) 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(253,221,124,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#002046" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-12">
        <img
          src="/logo.jpg"
          alt="Heimstadt"
          className="inline-flex w-16 h-16 rounded-2xl mb-6 shadow-xl object-cover object-top"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-[#002046] tracking-tight">Heimstadt</h1>
        <p className="text-xs text-[#44474e] uppercase tracking-[0.4em] mt-2 font-semibold">Internal Portal</p>
        <div
          className="mx-auto mt-5 h-px w-20"
          style={{ background: "linear-gradient(90deg, transparent, #735c00, #fed65b, #735c00, transparent)" }}
        />
        <p className="mt-5 text-sm text-[#44474e]/60 max-w-sm mx-auto leading-relaxed">
          Welcome to the Heimstadt internal management portal. Please select your access type to continue.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Admin Card */}
        <Link
          id="admin-portal-btn"
          href="/login?role=admin"
          className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,32,70,0.3)]"
          style={{
            background: "linear-gradient(145deg, #002046 0%, #0a2d5e 50%, #1b365d 100%)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 transition-opacity duration-500 group-hover:opacity-40"
            style={{ background: "radial-gradient(circle, rgba(253,221,124,0.5) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
          />

          <div className="relative p-8">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                admin_panel_settings
              </span>
            </div>

            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(253,221,124,0.2)", color: "#fed65b", border: "1px solid rgba(253,221,124,0.3)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#fed65b]" />
              Administrator
            </span>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Portal</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              Full platform management — properties, bookings, team oversight, analytics &amp; system configuration.
            </p>

            {/* Feature list */}
            <ul className="space-y-2 mb-8">
              {["Full dashboard analytics", "Team management", "Property oversight", "Document verification"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="material-symbols-outlined text-[14px] text-[#fed65b]">check_circle</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                Sign in as Admin
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <span className="material-symbols-outlined text-white text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Employee Card */}
        <Link
          id="employee-portal-btn"
          href="/login?role=employee"
          className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(115,92,0,0.25)]"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(27,54,93,0.08)"
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(circle, rgba(253,221,124,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />

          <div className="relative p-8">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
              style={{ background: "rgba(115,92,0,0.08)", border: "1px solid rgba(115,92,0,0.12)" }}
            >
              <span className="material-symbols-outlined text-[#735c00] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                badge
              </span>
            </div>

            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(115,92,0,0.08)", color: "#735c00", border: "1px solid rgba(115,92,0,0.15)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#735c00]" />
              Staff Member
            </span>

            <h2 className="text-2xl font-bold text-[#002046] mb-2 tracking-tight">Employee Portal</h2>
            <p className="text-sm text-[#44474e]/70 leading-relaxed mb-8">
              Your personal workspace — assigned chats, document reviews, bookings &amp; daily task management.
            </p>

            {/* Feature list */}
            <ul className="space-y-2 mb-8">
              {["Assigned chat tickets", "Document reviews", "Booking management", "Personal settings"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-[#44474e]/60">
                  <span className="material-symbols-outlined text-[14px] text-[#735c00]">check_circle</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#002046]/70 group-hover:text-[#002046] transition-colors">
                Sign in as Employee
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#002046] group-hover:text-white"
                style={{ background: "rgba(0,32,70,0.05)", border: "1px solid rgba(0,32,70,0.1)" }}
              >
                <span className="material-symbols-outlined text-[#002046] group-hover:text-white text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-12 text-center text-xs text-[#44474e]/40">
        © {new Date().getFullYear()} Heimstadt GmbH · Internal Use Only · Restricted Access
      </p>
    </div>
  );
}
