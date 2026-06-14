import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "emerald" | "amber";
}

const accentStyles = {
  primary:   "bg-hm-primary-fixed text-hm-primary border-hm-primary-fixed-dim",
  secondary: "bg-hm-secondary-fixed text-hm-secondary border-hm-secondary-fixed-dim",
  emerald:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber:     "bg-amber-50 text-amber-700 border-amber-200",
};

export default function StatCard({ label, value, change, positive, icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="card hover:shadow-card-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-hm-on-surface-variant font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-hm-on-bg tracking-tight">{value}</p>
          {change && (
            <p className={cn("text-xs mt-1.5 font-medium", positive ? "text-emerald-700" : "text-red-600")}>
              {positive ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center shrink-0", accentStyles[accent])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
