import React, { useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, ContextType, TransactionType, SummaryData } from '../types';
import { CURRENCY_SYMBOL, COLORS } from '../constants';
import { Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from './Button';

interface DashboardProps {
  transactions: Transaction[];
  context: ContextType;
  onDelete: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, context, onDelete }) => {
  const filteredTransactions = transactions.filter(t => t.context === context);

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data (Expenses by Category)
  const chartData: SummaryData[] = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE);
    const categoryMap = new Map<string, number>();

    expenses.forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  }, [filteredTransactions]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(`RupeeWise Report - ${context === ContextType.HOME ? 'Home' : 'School'}`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 35, 180, 25, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Income: ${CURRENCY_SYMBOL}${totalIncome}`, 20, 50);
    doc.text(`Total Expense: ${CURRENCY_SYMBOL}${totalExpense}`, 80, 50);
    doc.text(`Balance: ${CURRENCY_SYMBOL}${balance}`, 140, 50);

    // Table
    const tableData = filteredTransactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description || '-',
      `${CURRENCY_SYMBOL}${t.amount}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: tableData,
      headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    });

    doc.save(`${context.toLowerCase()}_expenses_report.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Income</p>
            <p className="text-2xl font-bold text-emerald-600">{CURRENCY_SYMBOL}{totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <p className="text-2xl font-bold text-rose-600">{CURRENCY_SYMBOL}{totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-full text-rose-600">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Net Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
              {CURRENCY_SYMBOL}{balance.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Distribution</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${CURRENCY_SYMBOL}${value}`, 'Amount']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No expenses to visualize yet.
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
            <Button variant="secondary" onClick={downloadPDF} className="text-xs py-1 px-2">
              Download PDF
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-3">
            {filteredTransactions.length === 0 ? (
              <p className="text-slate-500 text-center mt-10">No transactions found.</p>
            ) : (
              filteredTransactions.slice().reverse().map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${t.type === TransactionType.INCOME ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <div>
                      <p className="font-medium text-slate-800">{t.category}</p>
                      <p className="text-xs text-slate-500">{t.date} • {t.description || 'No desc'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} {CURRENCY_SYMBOL}{t.amount}
                    </span>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};