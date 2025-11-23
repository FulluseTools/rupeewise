import { IncomeCategory, ExpenseCategory } from './types';

export const CURRENCY_SYMBOL = '₹';

export const INCOME_CATEGORIES = Object.values(IncomeCategory);
export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);

export const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

export const MOCK_DATA = []; // Start empty, handled by local storage default