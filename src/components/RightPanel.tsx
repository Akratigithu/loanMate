"use client";

import type { EligibilityResult, FormPreview, PanelTab, TrackingEvent } from "@/lib/types";
import { getDefaultFormPreview, getDefaultTracking } from "@/lib/chatEngine";
import { DocumentPanel } from "./DocumentPanel";
import { EligibilityCard } from "./EligibilityCard";
import { FormPreviewCard } from "./FormPreviewCard";
import { StatusTimeline } from "./StatusTimeline";
import { Sparkles } from "lucide-react";

interface RightPanelProps {
  activeTab: PanelTab;
  eligibility?: EligibilityResult;
}

export function RightPanel({ activeTab, eligibility }: RightPanelProps) {
  const form: FormPreview = getDefaultFormPreview();
  const tracking: TrackingEvent[] = getDefaultTracking();

  const titles: Record<PanelTab, string> = {
    overview: "Eligibility Overview",
    documents: "Document Upload",
    form: "Application Form",
    tracking: "Disbursement Tracking",
  };

  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col border-l border-border bg-surface-elevated">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{titles[activeTab]}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 chat-scroll">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {eligibility ? (
              <EligibilityCard result={eligibility} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-400" />
                <p className="text-sm font-medium text-foreground">
                  No eligibility check yet
                </p>
                <p className="mt-1 text-xs text-muted">
                  Start a conversation to see your MUDRA scheme match
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Quick Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-brand-50 p-3 text-center">
                  <p className="text-lg font-bold text-brand-700">87%</p>
                  <p className="text-[10px] text-muted">Approval Rate</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">2 days</p>
                  <p className="text-[10px] text-muted">Avg. Processing</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && <DocumentPanel />}

        {activeTab === "form" && <FormPreviewCard form={form} />}

        {activeTab === "tracking" && <StatusTimeline events={tracking} />}
      </div>
    </aside>
  );
}
