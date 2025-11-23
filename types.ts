export enum ContextType {
  HOME = 'HOME',
  SCHOOL = 'SCHOOL'
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  context: ContextType;
}

export interface SummaryData {
  name: string;
  value: number;
  color: string;
}

export enum IncomeCategory {
  CASH = 'Cash',
  BANK = 'Bank',
  OTHER = 'Other'
}

// 10 categories as requested
export enum ExpenseCategory {
  GROCERY = 'Grocery',
  RENT = 'Rent',
  UTILITIES = 'Utilities',
  EDUCATION = 'Education Fees',
  BOOKS = 'Books & Stationery',
  TRANSPORT = 'Transport',
  HEALTH = 'Health',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  MISC = 'Miscellaneous'
}