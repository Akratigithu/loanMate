export type MessageRole = "agent" | "user" | "system";

export type MessageType =
  | "text"
  | "eligibility"
  | "document-prompt"
  | "form-preview"
  | "tracking"
  | "quick-replies";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: Date;
  data?: EligibilityResult | FormPreview | TrackingEvent[] | QuickReply[];
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
}

export interface EligibilityResult {
  scheme: string;
  confidence: number;
  reason: string;
  maxAmount: string;
  tenure: string;
  status: "eligible" | "review" | "ineligible";
}

export interface FormPreview {
  businessName: string;
  ownerName: string;
  loanAmount: string;
  scheme: string;
  gstNumber: string;
  turnover: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "uploaded" | "processing" | "verified";
}

export type PanelTab = "overview" | "documents" | "form" | "tracking";

export interface ConversationState {
  step:
    | "welcome"
    | "business-type"
    | "turnover"
    | "loan-amount"
    | "eligibility-done"
    | "document-upload"
    | "tracking";
  businessType?: string;
  turnover?: string;
  loanAmount?: string;
}
