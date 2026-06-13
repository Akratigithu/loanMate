"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { RightPanel } from "@/components/RightPanel";
import { Sidebar } from "@/components/Sidebar";
import type { EligibilityResult, PanelTab } from "@/lib/types";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<PanelTab>("overview");
  const [eligibility, setEligibility] = useState<EligibilityResult | undefined>();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[56px] shrink-0 items-center gap-4 border-b border-border bg-surface-elevated px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-slate-100 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Loan Assistant
            </p>
            <p className="text-xs text-muted">MUDRA & MSME scheme guidance</p>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <ChatInterface
            onEligibilityUpdate={setEligibility}
            onTabChange={setActiveTab}
          />
          <RightPanel activeTab={activeTab} eligibility={eligibility} />
        </div>
      </div>
    </div>
  );
}
