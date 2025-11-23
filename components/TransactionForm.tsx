import React, { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { TransactionType, ContextType } from '../types';
import { Button } from './Button';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (
    type: TransactionType,
    category: string,
    amount: number,
    description: string,
    date: string
  ) => void;
  context: ContextType;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, context }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    onAdd(type, category, parseFloat(amount), description, date);
    
    // Reset essential fields
    setAmount('');
    setDescription('');
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === TransactionType.INCOME ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-500" />
        Add Transaction ({context === ContextType.HOME ? 'Home' : 'School'})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg md:col-span-2">
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.INCOME)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === TransactionType.INCOME 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.EXPENSE)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === TransactionType.EXPENSE 
                ? 'bg-white text-rose-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expense
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Monthly Grocery"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <Button type="submit" className="w-full mt-2">
        Save Transaction
      </Button>
    </form>
  );
};