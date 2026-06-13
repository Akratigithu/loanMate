export interface BankData {
  id: string;
  name: string;
  shortName: string;
  rating: number;
  highlight: string;
  color: string;
  colorLight: string;
  colorDark: string;
  minCibil: string;
  processing: string;
  minLoan: string;
  maxLoan: string;
  schemes: string[];
  collateral: string;
}

export const banks: BankData[] = [
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    rating: 4.5,
    highlight: "Lowest interest rates",
    color: "#1e3a5f",
    colorLight: "#e8f0f8",
    colorDark: "#1a3352",
    minCibil: "650+",
    processing: "7–15 days",
    minLoan: "₹50,000",
    maxLoan: "₹2 Crore",
    schemes: ["MUDRA", "CGTMSE", "Stand-Up India"],
    collateral: "Collateral: Optional < ₹10L",
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    shortName: "PNB",
    rating: 4.2,
    highlight: "Widest branch network",
    color: "#9b1b30",
    colorLight: "#fde8ec",
    colorDark: "#7a1526",
    minCibil: "660+",
    processing: "10–20 days",
    minLoan: "₹1 Lakh",
    maxLoan: "₹1 Crore",
    schemes: ["MUDRA", "PMEGP"],
    collateral: "Collateral: Required > ₹5L",
  },
];
