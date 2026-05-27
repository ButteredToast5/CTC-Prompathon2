export type PathType = 'debit' | 'credit' | 'gambling' | 'investment' | 'bnpl' | null;

export interface GameStats {
  cash: number;
  debt: number;
  creditScore: number;
  happiness: number; // 0 to 100
}

export interface HistoryItem {
  id: string;
  source: string;
  amount: number;
  type: 'income' | 'expense' | 'interest' | 'fee';
  timestamp: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  isNeed: boolean;
  category: string;
  icon: string;
}
