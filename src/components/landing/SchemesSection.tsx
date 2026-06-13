"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { schemes } from "@/data/schemes";

export function SchemesSection() {
  const [activeId, setActiveId] = useState("shishu");
  const active = schemes.find((s) => s.id === activeId) ?? schemes[0];

  return (
    <section id="schemes" className="bg-white px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-mint-100 px-4 py-1.5 text-sm font-medium text-teal-700">
            Government Schemes
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[42px]">
            Find the Right Scheme
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Government-backed loan programs designed to fuel MSME growth across
            India. Our AI matches you to the best option instantly.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {schemes.map((scheme) => {
            const isActive = scheme.id === activeId;
            return (
              <button
                key={scheme.id}
                type="button"
                onClick={() => setActiveId(scheme.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "border border-border bg-white text-muted hover:border-teal-200 hover:text-foreground"
                }`}
              >
                {scheme.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-mint-200 shadow-sm">
          <div className="flex flex-col gap-4 bg-mint-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold text-teal-700">
                  {active.name}
                </h3>
                <span className="rounded-full bg-teal-600 px-3 py-0.5 text-xs font-semibold text-white">
                  {active.badge}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{active.description}</p>
            </div>

            <div className="flex gap-8 sm:text-right">
              <div>
                <p className="text-xs font-medium text-muted">Loan Limit</p>
                <p className="text-lg font-bold text-teal-700">
                  {active.loanLimit}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Interest Rate</p>
                <p className="text-lg font-bold text-teal-700">
                  {active.interestRate}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 border-t border-mint-100 md:grid-cols-2">
            <div className="border-b border-mint-100 p-6 md:border-b-0 md:border-r md:p-8">
              <div className="mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-600" />
                <h4 className="text-sm font-semibold text-foreground">
                  Eligibility Criteria
                </h4>
              </div>
              <ul className="space-y-3">
                {active.eligibility.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <Check
                        className="h-3 w-3 text-teal-600"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 md:p-8">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Loan Details
              </h4>
              <div className="space-y-0">
                {active.loanDetails.map((detail, i) => (
                  <div
                    key={detail.label}
                    className={`flex items-center justify-between py-3 ${
                      i < active.loanDetails.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <span className="text-sm text-muted">{detail.label}</span>
                    <span className="text-sm font-medium text-foreground">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Check My Eligibility
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
