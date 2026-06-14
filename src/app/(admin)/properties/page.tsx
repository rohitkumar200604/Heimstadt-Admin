"use client";

import { useState } from "react";

/* ─────────── Mock Data ─────────── */
interface MockProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  status: "available" | "reserved" | "occupied";
  occupancy: string;
  units_filled: number;
  units_total: number;
  valuation: string;
  ytd_change: string;
  ytd_positive: boolean;
  image: string;
}

const MOCK_PROPERTIES: MockProperty[] = [
  { id: "p-001", name: "Skyline Residences",   address: "Friedrichstraße 45",   city: "Berlin, Mitte",      status: "occupied",  occupancy: "100%", units_filled: 48, units_total: 48, valuation: "€42.5M", ytd_change: "+1.2%", ytd_positive: true,  image: "🏢" },
  { id: "p-002", name: "The Grand Estate",     address: "Seepromenade 12",      city: "Potsdam, Lakeside",  status: "reserved",  occupancy: "92%",  units_filled: 11, units_total: 12, valuation: "€18.2M", ytd_change: "-0.4%", ytd_positive: false, image: "🏡" },
  { id: "p-003", name: "Industrial Loft Hub",  address: "Hafenstraße 88",        city: "Hamburg, Hafencity", status: "occupied",  occupancy: "100%", units_filled: 24, units_total: 24, valuation: "€28.9M", ytd_change: "+2.8%", ytd_positive: true,  image: "🏭" },
  { id: "p-004", name: "Riverside Apartments", address: "Am Spreeufer 7",        city: "Berlin, Kreuzberg",  status: "available", occupancy: "75%",  units_filled: 18, units_total: 24, valuation: "€15.1M", ytd_change: "+0.5%", ytd_positive: true,  image: "🌊" },
  { id: "p-005", name: "Park View Suites",     address: "Tiergarten Allee 34",   city: "Berlin, Tiergarten", status: "occupied",  occupancy: "96%",  units_filled: 23, units_total: 24, valuation: "€31.7M", ytd_change: "+1.8%", ytd_positive: true,  image: "🌳" },
  { id: "p-006", name: "Alpine Retreat",       address: "Bergweg 5",             city: "München, Schwabing", status: "reserved",  occupancy: "88%",  units_filled: 7,  units_total: 8,  valuation: "€22.0M", ytd_change: "+3.1%", ytd_positive: true,  image: "⛰️" },
];

/* ─────────── Page ─────────── */
export default function PropertiesPage() {
  const [filter, setFilter] = useState<"all" | "available" | "reserved" | "occupied">("all");

  const filtered = filter === "all" ? MOCK_PROPERTIES : MOCK_PROPERTIES.filter((p) => p.status === filter);

  const totalAssets = MOCK_PROPERTIES.length;
  const avgOccupancy = (MOCK_PROPERTIES.reduce((s, p) => s + (p.units_filled / p.units_total) * 100, 0) / MOCK_PROPERTIES.length).toFixed(1);

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-1">Portfolio</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#002046] tracking-tight">Asset Portfolio</h2>
          <p className="text-sm text-[#44474e]/70 mt-1">Manage high-value residential and commercial properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="reveal-button border border-[#002046] text-[#002046] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[16px]">filter_list</span> Filters
          </button>
          <button className="reveal-button border border-[#002046] text-[#002046] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[16px]">file_download</span> Export
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-[10px] font-bold text-[#44474e]/60 uppercase tracking-widest mb-1">Total Assets</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-[#002046]">{totalAssets}</p>
            <span className="text-xs font-semibold text-emerald-700">+4.2%</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[#e5eeff] overflow-hidden">
            <div className="h-full bg-[#002046] rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
        <div className="stat-card">
          <p className="text-[10px] font-bold text-[#44474e]/60 uppercase tracking-widest mb-1">Avg Occupancy</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-[#002046]">{avgOccupancy}%</p>
            <span className="text-xs font-semibold text-emerald-700">Stable</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[#e5eeff] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${avgOccupancy}%`, background: "linear-gradient(90deg, #735c00 0%, #fed65b 100%)" }} />
          </div>
        </div>
        <div className="stat-card col-span-2">
          <p className="text-[10px] font-bold text-[#44474e]/60 uppercase tracking-widest mb-1">Total Portfolio Value</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-bold text-[#002046]">€158.4M</p>
            <p className="text-xs text-[#44474e]/60 pb-0.5">Projected: €165M</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "occupied", "reserved", "available"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${
              filter === s
                ? "bg-[#002046] text-white border-[#002046]"
                : "bg-transparent text-[#44474e]/60 border-[rgba(27,54,93,0.08)] hover:border-[#002046] hover:text-[#002046]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgba(27,54,93,0.02)] border-b border-[rgba(27,54,93,0.06)]">
              <tr>
                {["Property", "Status", "Occupancy", "Valuation", "Actions"].map((h) => (
                  <th key={h} className={`px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-[#44474e]/60 ${h === "Valuation" ? "text-right" : "text-left"} ${h === "Actions" ? "text-center" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(27,54,93,0.04)]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[rgba(27,54,93,0.02)] transition-colors group">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-xl flex-shrink-0">{p.image}</div>
                      <div>
                        <p className="text-sm font-semibold text-[#002046]">{p.name}</p>
                        <p className="text-[10px] text-[#44474e]/50">{p.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      p.status === "occupied"  ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      p.status === "reserved"  ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-[#e5eeff] text-[#002046] border-[#c4c6cf]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        p.status === "occupied" ? "bg-emerald-600" : p.status === "reserved" ? "bg-amber-600" : "bg-[#002046]"
                      }`} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-sm font-semibold text-[#002046]">{p.occupancy}</p>
                    <p className="text-[10px] text-[#44474e]/40">{p.units_filled} / {p.units_total} Units</p>
                  </td>
                  <td className="px-5 py-5 text-right">
                    <p className="text-sm font-semibold text-[#002046]">{p.valuation}</p>
                    <p className={`text-[10px] font-semibold ${p.ytd_positive ? "text-emerald-700" : "text-red-600"}`}>{p.ytd_change} YTD</p>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-[#002046] hover:bg-[rgba(27,54,93,0.04)] transition-all">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-[#735c00] hover:bg-[rgba(115,92,0,0.04)] transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474e]/40 hover:text-red-600 hover:bg-red-50 transition-all">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[rgba(27,54,93,0.02)] border-t border-[rgba(27,54,93,0.06)] px-5 py-3 flex items-center justify-between">
          <p className="text-[10px] text-[#44474e]/50">Showing {filtered.length} of {totalAssets} assets</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg bg-[#002046] text-white font-bold text-xs">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
