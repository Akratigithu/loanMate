import type {
  ChatMessage,
  ConversationState,
  EligibilityResult,
  FormPreview,
  QuickReply,
  TrackingEvent,
} from "./types";

const QUICK_REPLIES: QuickReply[] = [
  { id: "1", label: "Check loan eligibility", value: "eligibility" },
  { id: "2", label: "Upload documents", value: "documents" },
  { id: "3", label: "Track my application", value: "tracking" },
  { id: "4", label: "MUDRA loan schemes", value: "mudra" },
];

export function getWelcomeMessages(): ChatMessage[] {
  return [
    {
      id: "welcome-1",
      role: "agent",
      type: "text",
      content:
        "Namaste! I'm LoanMate, your AI loan assistant for MSMEs. I can help you check eligibility for government schemes like MUDRA, auto-fill your application, and track disbursement status — all in plain language.",
      timestamp: new Date(),
    },
    {
      id: "welcome-2",
      role: "agent",
      type: "quick-replies",
      content: "How can I help you today?",
      timestamp: new Date(),
      data: QUICK_REPLIES,
    },
  ];
}

export function getDefaultTracking(): TrackingEvent[] {
  return [
    {
      id: "1",
      status: "Application Submitted",
      description: "Your loan application has been received",
      date: "Jun 10, 2026",
      completed: true,
    },
    {
      id: "2",
      status: "Document Verification",
      description: "GST certificate and bank statements under review",
      date: "Jun 11, 2026",
      completed: true,
    },
    {
      id: "3",
      status: "Eligibility Assessment",
      description: "MUDRA Shishu scheme evaluation in progress",
      date: "Jun 12, 2026",
      completed: true,
    },
    {
      id: "4",
      status: "Sanction Pending",
      description: "Awaiting final approval from lending partner",
      date: "Expected Jun 15, 2026",
      completed: false,
    },
    {
      id: "5",
      status: "Disbursement",
      description: "Funds transfer to your registered account",
      date: "Expected Jun 18, 2026",
      completed: false,
    },
  ];
}

export function getDefaultFormPreview(): FormPreview {
  return {
    businessName: "ABC Kirana Store",
    ownerName: "Ravi Kumar",
    loanAmount: "₹2,00,000",
    scheme: "MUDRA Shishu",
    gstNumber: "29ABCDE1234F1Z5",
    turnover: "₹8,50,000 / year",
  };
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processUserMessage(
  input: string,
  state: ConversationState
): Promise<{
  agentMessages: ChatMessage[];
  newState: ConversationState;
  eligibility?: EligibilityResult;
}> {
  const normalized = input.trim().toLowerCase();
  const agentMessages: ChatMessage[] = [];
  let newState = { ...state };
  let eligibility: EligibilityResult | undefined;

  const addAgent = (content: string, type: ChatMessage["type"] = "text", data?: ChatMessage["data"]) => {
    agentMessages.push({
      id: createId(),
      role: "agent",
      type,
      content,
      timestamp: new Date(),
      data,
    });
  };

  if (
    normalized.includes("eligibility") ||
    normalized.includes("eligible") ||
    normalized.includes("mudra") ||
    state.step === "welcome" && (normalized.includes("check") || normalized.includes("loan"))
  ) {
    if (state.step === "welcome" || state.step === "eligibility-done") {
      newState = { step: "business-type" };
      addAgent(
        "Great! Let's check your eligibility. First, what type of business do you run?"
      );
      addAgent("", "quick-replies", [
        { id: "bt1", label: "Retail / Kirana", value: "retail" },
        { id: "bt2", label: "Manufacturing", value: "manufacturing" },
        { id: "bt3", label: "Services", value: "services" },
        { id: "bt4", label: "Food & Beverage", value: "food" },
      ]);
      return { agentMessages, newState };
    }
  }

  if (state.step === "business-type") {
    newState = { ...newState, step: "turnover", businessType: input };
    addAgent(`Got it — ${input}. What is your approximate annual turnover?`);
    addAgent("", "quick-replies", [
      { id: "t1", label: "Under ₹5 lakh", value: "under-5" },
      { id: "t2", label: "₹5–10 lakh", value: "5-10" },
      { id: "t3", label: "₹10–25 lakh", value: "10-25" },
      { id: "t4", label: "Above ₹25 lakh", value: "above-25" },
    ]);
    return { agentMessages, newState };
  }

  if (state.step === "turnover") {
    newState = { ...newState, step: "loan-amount", turnover: input };
    addAgent("How much loan amount are you looking for?");
    addAgent("", "quick-replies", [
      { id: "l1", label: "₹50,000", value: "50000" },
      { id: "l2", label: "₹2,00,000", value: "200000" },
      { id: "l3", label: "₹5,00,000", value: "500000" },
      { id: "l4", label: "₹10,00,000", value: "1000000" },
    ]);
    return { agentMessages, newState };
  }

  if (state.step === "loan-amount") {
    const turnover = state.turnover || "";
    const isSmallBusiness =
      turnover.includes("Under") ||
      turnover.includes("5") ||
      turnover.includes("10");

    eligibility = {
      scheme: isSmallBusiness ? "MUDRA Shishu" : "MUDRA Tarun",
      confidence: isSmallBusiness ? 0.87 : 0.72,
      reason: isSmallBusiness
        ? "Turnover under ₹10 lakh qualifies for Shishu tier with collateral-free lending up to ₹50,000–₹2 lakh."
        : "Your turnover fits Tarun tier. Additional bank statements may strengthen your application.",
      maxAmount: isSmallBusiness ? "₹2,00,000" : "₹5,00,000",
      tenure: "36 months",
      status: isSmallBusiness ? "eligible" : "review",
    };

    newState = {
      ...newState,
      step: "eligibility-done",
      loanAmount: input,
    };

    addAgent(
      "I've analyzed your profile against MUDRA scheme criteria. Here's what I found:"
    );
    addAgent("", "eligibility", eligibility);
    addAgent(
      "I can auto-fill your application form using your business details. Would you like to upload your GST certificate and bank statement to proceed?"
    );
    addAgent("", "quick-replies", [
      { id: "d1", label: "Upload documents", value: "documents" },
      { id: "d2", label: "View auto-filled form", value: "form" },
      { id: "d3", label: "Track application", value: "tracking" },
    ]);

    return { agentMessages, newState, eligibility };
  }

  if (
    normalized.includes("document") ||
    normalized.includes("upload") ||
    state.step === "document-upload"
  ) {
    newState = { ...newState, step: "document-upload" };
    addAgent(
      "Please upload your documents using the panel on the right, or drag files into the chat area. I accept PDF, JPG, and PNG formats.",
      "document-prompt"
    );
    addAgent(
      "Required documents:\n• GST Registration Certificate\n• Last 6 months bank statement\n• Aadhaar / PAN (owner ID)"
    );
    return { agentMessages, newState };
  }

  if (normalized.includes("form") || normalized.includes("preview")) {
    addAgent("Here's your auto-filled loan application preview:", "form-preview", getDefaultFormPreview());
    return { agentMessages, newState };
  }

  if (normalized.includes("track") || normalized.includes("status")) {
    newState = { ...newState, step: "tracking" };
    addAgent("Here's the latest status on your application:", "tracking", getDefaultTracking());
    return { agentMessages, newState };
  }

  if (normalized.includes("mudra")) {
    addAgent(
      "MUDRA offers three tiers:\n\n**Shishu** — up to ₹50,000 (micro enterprises)\n**Kishore** — ₹50,000 to ₹5 lakh\n**Tarun** — ₹5 lakh to ₹10 lakh\n\nAll are collateral-free. Would you like to check your eligibility?"
    );
    addAgent("", "quick-replies", [
      { id: "e1", label: "Check my eligibility", value: "eligibility" },
      { id: "e2", label: "Upload documents", value: "documents" },
    ]);
    return { agentMessages, newState };
  }

  addAgent(
    "I can help with loan eligibility, document uploads, form auto-fill, and application tracking. What would you like to do?"
  );
  addAgent("", "quick-replies", QUICK_REPLIES);
  return { agentMessages, newState };
}

export { delay };
