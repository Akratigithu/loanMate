"use client";

import { Bell, Circle, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-border bg-surface-elevated px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">Loan Assistant</h1>
        <p className="text-xs text-muted">MUDRA & MSME scheme guidance</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 sm:flex">
          <Circle className="h-2 w-2 fill-brand-500 text-brand-500" />
          <span className="text-xs font-medium text-brand-700">Agent online</span>
        </div>

        <button
          type="button"
          className="relative rounded-xl p-2 text-muted transition-colors hover:bg-slate-100 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100">
            <User className="h-4 w-4 text-brand-700" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground">Ravi Kumar</p>
            <p className="text-[10px] text-muted">MSME Borrower</p>
          </div>
        </div>
      </div>
    </header>
  );
}
