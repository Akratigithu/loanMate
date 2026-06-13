export interface SchemeData {
  id: string;
  name: string;
  badge: string;
  description: string;
  loanLimit: string;
  interestRate: string;
  eligibility: string[];
  loanDetails: { label: string; value: string }[];
}

export const schemes: SchemeData[] = [
  {
    id: "shishu",
    name: "MUDRA Shishu",
    badge: "No Collateral",
    description: "For micro-enterprises starting up",
    loanLimit: "Up to ₹50,000",
    interestRate: "7%–12% p.a.",
    eligibility: [
      "Annual turnover < ₹5 lakhs",
      "Non-farm income-generating activities",
      "No existing default on loans",
      "Valid Aadhaar & PAN",
    ],
    loanDetails: [
      { label: "Collateral", value: "No collateral required" },
      { label: "Eligible Sectors", value: "All sectors" },
      { label: "Guarantee Body", value: "MUDRA / SIDBI" },
      { label: "Repayment Tenure", value: "3–7 years" },
    ],
  },
  {
    id: "kishore",
    name: "MUDRA Kishore",
    badge: "No Collateral",
    description: "For small businesses seeking growth capital",
    loanLimit: "₹50,000 – ₹5 Lakh",
    interestRate: "8%–14% p.a.",
    eligibility: [
      "Annual turnover ₹5–25 lakhs",
      "Business operational for 1+ year",
      "No existing default on loans",
      "Valid Aadhaar, PAN & GST",
    ],
    loanDetails: [
      { label: "Collateral", value: "No collateral required" },
      { label: "Eligible Sectors", value: "All non-farm sectors" },
      { label: "Guarantee Body", value: "MUDRA / SIDBI" },
      { label: "Repayment Tenure", value: "3–5 years" },
    ],
  },
  {
    id: "tarun",
    name: "MUDRA Tarun",
    badge: "Growth Capital",
    description: "For established MSMEs scaling operations",
    loanLimit: "₹5 Lakh – ₹10 Lakh",
    interestRate: "9%–15% p.a.",
    eligibility: [
      "Annual turnover > ₹25 lakhs",
      "Business operational for 2+ years",
      "Clean credit history (CIBIL 650+)",
      "Valid Aadhaar, PAN & GST registration",
    ],
    loanDetails: [
      { label: "Collateral", value: "Optional for loans < ₹5L" },
      { label: "Eligible Sectors", value: "Manufacturing & services" },
      { label: "Guarantee Body", value: "MUDRA / SIDBI" },
      { label: "Repayment Tenure", value: "5–7 years" },
    ],
  },
  {
    id: "cgtmse",
    name: "CGTMSE",
    badge: "Credit Guarantee",
    description: "Collateral-free loans with government guarantee",
    loanLimit: "Up to ₹2 Crore",
    interestRate: "Bank-linked rates",
    eligibility: [
      "New & existing MSME units",
      "Manufacturing & service enterprises",
      "No default with any bank",
      "Valid Udyam registration",
    ],
    loanDetails: [
      { label: "Collateral", value: "No collateral up to ₹2 Cr" },
      { label: "Eligible Sectors", value: "All MSME sectors" },
      { label: "Guarantee Body", value: "CGTMSE / SIDBI" },
      { label: "Repayment Tenure", value: "Up to 10 years" },
    ],
  },
];
