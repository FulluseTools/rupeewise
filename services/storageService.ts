import { Transaction } from '../types';

const STORAGE_KEY = 'rupeewise_transactions_v1';

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading transactions", error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions", error);
  }
};

export const clearTransactions = () => {
  localStorage.removeItem(STORAGE_KEY);
};