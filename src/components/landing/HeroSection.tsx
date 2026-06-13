import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-grid relative min-h-screen overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900/50" />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-sm font-medium text-teal-300">
            AI-Powered · Trusted by 12,000+ MSMEs
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px]">
          AI-powered Loan{" "}
          <span className="text-teal-400">Assistant</span> for MSMEs
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Check eligibility, auto-fill forms, and track loan status — all
          conversationally. Get matched to the right government scheme in
          minutes.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2.5 rounded-full bg-teal-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-400 hover:shadow-teal-400/30"
          >
            <MessageCircle className="h-4 w-4" />
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="#schemes"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
          >
            Explore Schemes
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {["SIDBI Partner", "RBI Compliant", "ISO 27001 Certified"].map(
            (badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur"
              >
                <span className="text-teal-400">✓</span>
                {badge}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
