"use client";

import type { EligibilityResult } from "@/lib/types";
import { BadgeCheck, AlertCircle, Clock } from "lucide-react";

interface EligibilityCardProps {
  result: EligibilityResult;
}

const statusConfig = {
  eligible: {
    icon: BadgeCheck,
    label: "Likely Eligible",
    bg: "bg-brand-50",
    border: "border-brand-200",
    text: "text-brand-800",
    badge: "bg-brand-100 text-brand-700",
  },
  review: {
    icon: Clock,
    label: "Under Review",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-800",
  },
  ineligible: {
    icon: AlertCircle,
    label: "Not Eligible",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-900",
    badge: "bg-red-100 text-red-800",
  },
};

export function EligibilityCard({ result }: EligibilityCardProps) {
  const config = statusConfig[result.status];
  const Icon = config.icon;
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div
      className={`rounded-2xl border ${config.border} ${config.bg} p-4 shadow-sm`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.text}`} />
          <span className={`text-sm font-semibold ${config.text}`}>
            {config.label}
          </span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badge}`}>
          {confidencePercent}% match
        </span>
      </div>

      <div className="mb-3">
        <p className="text-lg font-bold text-foreground">{result.scheme}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{result.reason}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Max Amount
          </p>
          <p className="mt-0.5 text-sm font-bold text-foreground">{result.maxAmount}</p>
        </div>
        <div className="rounded-xl bg-white/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Tenure
          </p>
          <p className="mt-0.5 text-sm font-bold text-foreground">{result.tenure}</p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
          style={{ width: `${confidencePercent}%` }}
        />
      </div>
    </div>
  );
}
