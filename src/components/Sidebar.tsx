"use client";

import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  Upload,
  IndianRupee,
} from "lucide-react";
import type { PanelTab } from "@/lib/types";

interface SidebarProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
}

const navItems: { id: PanelTab; label: string; icon: typeof MessageSquare }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: Upload },
  { id: "form", label: "Application", icon: FileText },
  { id: "tracking", label: "Tracking", icon: IndianRupee },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-border bg-surface-elevated">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
          <IndianRupee className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">LoanMate</p>
          <p className="text-xs text-muted">Conversational Agent</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Workspace
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                active
                  ? "bg-brand-50 font-medium text-brand-700"
                  : "text-muted hover:bg-slate-50 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-brand-600" : ""}`} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-brand-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-semibold text-brand-800">AI Assistant</span>
          </div>
          <p className="text-xs leading-relaxed text-brand-700/80">
            Powered by agentic AI for MSME loan eligibility, form auto-fill, and disbursement tracking.
          </p>
        </div>
      </div>
    </aside>
  );
}
