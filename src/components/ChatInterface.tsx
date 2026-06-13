"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, Send, Sparkles } from "lucide-react";
import type { ChatMessage, ConversationState, EligibilityResult, PanelTab } from "@/lib/types";
import {
  delay,
  getWelcomeMessages,
  processUserMessage,
} from "@/lib/chatEngine";
import { MessageBubble } from "./MessageBubble";

interface ChatInterfaceProps {
  onEligibilityUpdate: (result: EligibilityResult | undefined) => void;
  onTabChange: (tab: PanelTab) => void;
}

export function ChatInterface({
  onEligibilityUpdate,
  onTabChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: "welcome",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(getWelcomeMessages());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        type: "text",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      await delay(600 + Math.random() * 400);

      const { agentMessages, newState, eligibility } = await processUserMessage(
        trimmed,
        conversationState
      );

      setConversationState(newState);
      if (eligibility) {
        onEligibilityUpdate(eligibility);
        onTabChange("overview");
      }

      if (trimmed.toLowerCase().includes("document") || trimmed.toLowerCase().includes("upload")) {
        onTabChange("documents");
      }
      if (trimmed.toLowerCase().includes("form")) {
        onTabChange("form");
      }
      if (trimmed.toLowerCase().includes("track")) {
        onTabChange("tracking");
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, ...agentMessages]);
    },
    [conversationState, isTyping, onEligibilityUpdate, onTabChange]
  );

  const handleQuickReply = (value: string, label: string) => {
    sendMessage(label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-gradient-to-b from-brand-50/30 to-surface">
      <div className="border-b border-brand-100/80 bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              LoanMate Conversational Agent
            </p>
            <p className="text-xs text-brand-100">
              AI-powered MSME loan eligibility · MUDRA schemes · Auto-fill forms
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto px-6 py-6"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onQuickReply={handleQuickReply}
          />
        ))}
        {isTyping && (
          <MessageBubble
            message={{
              id: "typing",
              role: "agent",
              type: "text",
              content: "",
              timestamp: new Date(),
            }}
            isTyping
          />
        )}
      </div>

      <div className="border-t border-border bg-surface-elevated px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTabChange("documents")}
            className="rounded-xl p-2.5 text-muted transition-colors hover:bg-slate-100 hover:text-brand-600"
            aria-label="Attach document"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about loan eligibility, upload docs, or track status..."
            disabled={isTyping}
            className="flex-1 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] text-muted">
          LoanMate uses AI to guide MSME borrowers. Not a substitute for official bank advice.
        </p>
      </div>
    </div>
  );
}
