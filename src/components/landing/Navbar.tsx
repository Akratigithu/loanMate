import Link from "next/link";
import { Menu, Moon, TrendingUp } from "lucide-react";

interface NavbarProps {
  variant?: "dark" | "light";
}

export function Navbar({ variant = "dark" }: NavbarProps) {
  const isDark = variant === "dark";

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex h-[72px] items-center justify-between px-6 lg:px-10 ${
        isDark
          ? "bg-navy-900/80 backdrop-blur-md"
          : "border-b border-border bg-white/90 backdrop-blur-md"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
          <TrendingUp className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <span
          className={`text-lg font-bold tracking-tight ${
            isDark ? "text-white" : "text-foreground"
          }`}
        >
          LoanMate
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            isDark
              ? "text-white/70 hover:bg-white/10 hover:text-white"
              : "text-muted hover:bg-slate-100 hover:text-foreground"
          }`}
          aria-label="Toggle dark mode"
        >
          <Moon className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          className={`hidden rounded-full px-5 py-2 text-sm font-medium transition-colors sm:block ${
            isDark
              ? "bg-white text-navy-900 hover:bg-white/90"
              : "border border-border bg-white text-foreground hover:bg-slate-50"
          }`}
        >
          Log In
        </button>

        <button
          type="button"
          className={`hidden rounded-full px-5 py-2 text-sm font-medium transition-colors sm:block ${
            isDark
              ? "bg-navy-700 text-white hover:bg-navy-800"
              : "bg-navy-900 text-white hover:bg-navy-800"
          }`}
        >
          Sign Up
        </button>

        <button
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            isDark
              ? "text-white/70 hover:bg-white/10 hover:text-white"
              : "text-muted hover:bg-slate-100 hover:text-foreground"
          }`}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
