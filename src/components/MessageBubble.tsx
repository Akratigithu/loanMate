"use client";

import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { EligibilityCard } from "./EligibilityCard";
import { FormPreviewCard } from "./FormPreviewCard";
import { StatusTimeline } from "./StatusTimeline";
import { QuickReplies } from "./QuickReplies";
import type {
  EligibilityResult,
  FormPreview,
  QuickReply,
  TrackingEvent,
} from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
  onQuickReply?: (value: string, label: string) => void;
  isTyping?: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <span className="typing-dot h-2 w-2 rounded-full bg-brand-400" />
      <span className="typing-dot h-2 w-2 rounded-full bg-brand-400" />
      <span className="typing-dot h-2 w-2 rounded-full bg-brand-400" />
    </div>
  );
}

export function MessageBubble({
  message,
  onQuickReply,
  isTyping,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (message.type === "quick-replies" && message.data) {
    return (
      <div className="animate-fade-up mb-4 max-w-[85%]">
        {message.content && (
          <p className="mb-2 text-sm text-muted">{message.content}</p>
        )}
        <QuickReplies
          replies={message.data as QuickReply[]}
          onSelect={(value, label) => onQuickReply?.(value, label)}
        />
      </div>
    );
  }

  return (
    <div
      className={`animate-fade-up mb-4 flex gap-3 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-brand-600 text-white"
            : "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div className={`max-w-[min(520px,85%)] ${isUser ? "text-right" : ""}`}>
        {!isUser && (
          <p className="mb-1 text-xs font-medium text-brand-600">LoanMate AI</p>
        )}

        {isTyping ? (
          <div className="rounded-2xl rounded-tl-md border border-border bg-white px-4 py-2 shadow-sm">
            <TypingIndicator />
          </div>
        ) : message.type === "eligibility" && message.data ? (
          <EligibilityCard result={message.data as EligibilityResult} />
        ) : message.type === "form-preview" && message.data ? (
          <FormPreviewCard form={message.data as FormPreview} />
        ) : message.type === "tracking" && message.data ? (
          <StatusTimeline events={message.data as TrackingEvent[]} />
        ) : message.type === "document-prompt" ? (
          <div className="rounded-2xl rounded-tl-md border border-dashed border-brand-300 bg-brand-50/50 px-4 py-3 shadow-sm">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {message.content}
            </p>
          </div>
        ) : (
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isUser
                ? "rounded-tr-md bg-gradient-to-br from-brand-600 to-brand-700 text-white"
                : "rounded-tl-md border border-border bg-white text-foreground"
            }`}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content.split("**").map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i}>{part}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>
        )}

        <p className={`mt-1 text-[10px] text-muted ${isUser ? "text-right" : ""}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
