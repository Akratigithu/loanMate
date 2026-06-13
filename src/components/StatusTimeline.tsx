"use client";

import type { TrackingEvent } from "@/lib/types";
import { Check, Circle } from "lucide-react";

interface StatusTimelineProps {
  events: TrackingEvent[];
  compact?: boolean;
}

export function StatusTimeline({ events, compact }: StatusTimelineProps) {
  return (
    <div className={compact ? "space-y-0" : "rounded-2xl border border-border bg-white p-4 shadow-sm"}>
      {!compact && (
        <p className="mb-4 text-sm font-semibold text-foreground">Application Timeline</p>
      )}
      <div className="relative">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          return (
            <div key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <div
                  className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${
                    event.completed ? "bg-brand-300" : "bg-slate-200"
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  event.completed
                    ? "bg-brand-500 text-white"
                    : "border-2 border-slate-200 bg-white"
                }`}
              >
                {event.completed ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  <Circle className="h-2 w-2 fill-slate-300 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-sm font-semibold ${
                    event.completed ? "text-foreground" : "text-muted"
                  }`}
                >
                  {event.status}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {event.description}
                </p>
                <p className="mt-1 text-[11px] font-medium text-brand-600">{event.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
