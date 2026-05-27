import React, { useState } from 'react';

export type TermKey = 
  | 'checking'
  | 'savings'
  | 'debit'
  | 'credit'
  | 'secured'
  | 'apr'
  | 'compound'
  | 'overdraft'
  | 'index_fund'
  | 'dividends'
  | 'bnpl'
  | 'credit_score'
  | 'liquidity';

interface FinancialTermProps {
  term: TermKey;
  children: React.ReactNode;
}

const TERM_DEFINITIONS: Record<TermKey, { title: string; def: string }> = {
  checking: {
    title: "Checking Account",
    def: "A liquid bank account for daily spending (via debit card). Allows unlimited deposits and ATM withdrawals."
  },
  savings: {
    title: "Savings Account",
    def: "A bank account meant to hoard cash. It pays interest over time, serving as an Emergency Fund."
  },
  debit: {
    title: "Debit Card",
    def: "A payment card linked directly to your Checking account. You only spend cash you already own."
  },
  credit: {
    title: "Credit Card",
    def: "A borrowing card where the bank pays the store today, and bills you next month. Carries high interest debt risks."
  },
  secured: {
    title: "Secured Credit Card",
    def: "Requires a cash deposit that serves as your spending limit. Zero risk of overspending; perfect for building credit."
  },
  apr: {
    title: "APR (Annual Percentage Rate)",
    def: "The yearly interest rate charged on unpaid credit balances. At 29.9% APR, unpaid bills double incredibly fast."
  },
  compound: {
    title: "Compound Interest",
    def: "Earning interest on interest already earned. It fuels an exponential curve to multiply wealth over time."
  },
  overdraft: {
    title: "Overdraft Fees",
    def: "A penalty (often $35) charged when you spend more money than is currently available in your Checking account."
  },
  index_fund: {
    title: "Index Fund",
    def: "A diversified basket of stocks (e.g., S&P 500) representing the entire market. Provides safe, long-term growth (8-10% average)."
  },
  dividends: {
    title: "Dividends",
    def: "Cash payments sent to shareholders periodically by profitable corporations as a reward for holding their stock."
  },
  bnpl: {
    title: "Buy Now, Pay Later",
    def: "A financing deal that splits an online item's cost into 4 small chunks. Stacking plans creates hidden, automated payday liabilities."
  },
  credit_score: {
    title: "Credit Score",
    def: "A score (300 to 850) measuring your borrowing trust. High scores lower your rates on loans and apartments."
  },
  liquidity: {
    title: "Liquidity",
    def: "How quickly an asset can be converted into ready spending cash. Money in checking is liquid; real estate or crypto frozen slots are not."
  }
};

export default function FinancialTerm({ term, children }: FinancialTermProps) {
  const [isHovered, setIsHovered] = useState(false);
  const info = TERM_DEFINITIONS[term];
  if (!info) return <span className="font-bold text-white">{children}</span>;

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline cursor-help border-b-2 border-dashed border-amber-400 text-amber-300 font-bold px-0.5 select-none transition-colors hover:text-amber-200"
    >
      {children}
      {isHovered && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-slate-950/95 border-2 border-amber-500 rounded-2xl text-xs text-slate-200 shadow-2xl z-50 font-sans tracking-normal leading-relaxed text-left pointer-events-none transition-all duration-150 animate-in fade-in slide-in-from-bottom-1 uppercase-none">
          <span className="block font-display font-black text-amber-400 text-sm border-b border-slate-800 pb-1.5 mb-1.5 uppercase tracking-wide">
            💡 {info.title}
          </span>
          <span className="block text-slate-300 text-[11px] normal-case font-normal text-left">
            {info.def}
          </span>
        </span>
      )}
    </span>
  );
}
