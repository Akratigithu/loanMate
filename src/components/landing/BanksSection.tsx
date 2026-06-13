import { ArrowUpRight, Clock, Star } from "lucide-react";
import { banks } from "@/data/banks";

export function BanksSection() {
  return (
    <section id="banks" className="bg-surface px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <span className="inline-block rounded-full bg-mint-100 px-4 py-1.5 text-sm font-medium text-teal-700">
            Partner Banks
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[42px]">
            Available Banks & Lenders
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {banks.map((bank) => (
            <article
              key={bank.id}
              className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: bank.color }}
                    >
                      {bank.shortName}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {bank.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                        <Star
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                        {bank.rating} · MSME Lender
                      </p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: bank.colorLight,
                      color: bank.color,
                    }}
                  >
                    {bank.highlight}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Min. CIBIL", value: bank.minCibil },
                    { label: "Processing", value: bank.processing },
                    { label: "Min. Loan", value: bank.minLoan },
                    { label: "Max. Loan", value: bank.maxLoan },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-slate-50 px-3 py-3"
                    >
                      <p className="text-[11px] font-medium text-muted">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-muted">
                    Available Schemes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bank.schemes.map((scheme) => (
                      <span
                        key={scheme}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: bank.colorLight,
                          color: bank.color,
                        }}
                      >
                        {scheme}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {bank.collateral}
                </div>
              </div>

              <div className="flex gap-3 border-t border-border p-4">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: bank.colorDark }}
                >
                  View Criteria
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
                >
                  Compare
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
