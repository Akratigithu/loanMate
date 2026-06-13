"use client";

import type { FormPreview } from "@/lib/types";
import { FileText } from "lucide-react";

interface FormPreviewCardProps {
  form: FormPreview;
  compact?: boolean;
}

export function FormPreviewCard({ form, compact }: FormPreviewCardProps) {
  const fields = [
    { label: "Business Name", value: form.businessName },
    { label: "Owner Name", value: form.ownerName },
    { label: "Loan Amount", value: form.loanAmount },
    { label: "Scheme", value: form.scheme },
    { label: "GST Number", value: form.gstNumber },
    { label: "Annual Turnover", value: form.turnover },
  ];

  if (compact) {
    return (
      <div className="space-y-2">
        {fields.slice(0, 4).map((f) => (
          <div key={f.label} className="flex justify-between text-sm">
            <span className="text-muted">{f.label}</span>
            <span className="font-medium text-foreground">{f.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-brand-600" />
        <span className="text-sm font-semibold text-foreground">Auto-filled Application</span>
      </div>
      <div className="space-y-2.5">
        {fields.map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
          >
            <span className="text-xs text-muted">{f.label}</span>
            <span className="text-sm font-medium text-foreground">{f.value}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Submit Application
      </button>
    </div>
  );
}
