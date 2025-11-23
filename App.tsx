import React, { useState, useEffect } from 'react';
import { 
  Transaction, 
  ContextType, 
  TransactionType 
} from './types';
import { 
  getTransactions, 
  saveTransactions, 
  clearTransactions 
} from './services/storageService';
import { TransactionForm } from './components/TransactionForm';
import { Dashboard } from './components/Dashboard';
import { AIInsights } from './components/AIInsights';
import { Home, School, LogOut, Wallet } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [context, setContext] = useState<ContextType>(ContextType.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  // Save on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransaction = (
    type: TransactionType,
    category: string,
    amount: number,
    description: string,
    date: string
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date,
      amount,
      category,
      description,
      type,
      context
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleClearData = () => {
    if (window.confirm("WARNING: This will delete ALL data permanently. Continue?")) {
      clearTransactions();
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">RupeeWise</h1>
        </div>

        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Context
          </div>
          
          <button
            onClick={() => setContext(ContextType.HOME)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              context === ContextType.HOME 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home Expenses</span>
          </button>

          <button
            onClick={() => setContext(ContextType.SCHOOL)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              context === ContextType.SCHOOL 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <School className="w-5 h-5" />
            <span className="font-medium">School Expenses</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Clear All Data
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Header for Mobile/Context */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {context === ContextType.HOME ? 'Home Dashboard' : 'School Dashboard'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">Track and manage your {context.toLowerCase()} finances.</p>
            </div>
          </header>

          {/* AI Section */}
          <section>
            <AIInsights transactions={transactions} context={context} />
          </section>

          {/* Input Section */}
          <section>
            <TransactionForm onAdd={addTransaction} context={context} />
          </section>

          {/* Dashboard Visuals */}
          <section>
            <Dashboard 
              transactions={transactions} 
              context={context} 
              onDelete={deleteTransaction}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;