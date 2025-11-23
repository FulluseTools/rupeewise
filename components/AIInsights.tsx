import React, { useState } from 'react';
import { Button } from './Button';
import { getFinancialInsights } from '../services/geminiService';
import { Transaction, ContextType } from '../types';
import { Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIInsightsProps {
  transactions: Transaction[];
  context: ContextType;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ transactions, context }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowModal(true);
    const result = await getFinancialInsights(transactions, context);
    setInsight(result);
    setIsLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setInsight(null);
  };

  if (!showModal) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            AI Financial Advisor
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Get personalized insights and saving tips for your {context.toLowerCase()} budget using Gemini.
          </p>
        </div>
        <Button 
          onClick={handleGenerate}
          className="bg-white text-indigo-600 hover:bg-indigo-50 border-none whitespace-nowrap"
        >
          Analyze My Spending
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
          <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Analysis ({context})
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500 text-sm animate-pulse">Consulting the AI Advisor...</p>
            </div>
          ) : (
            <div className="prose prose-indigo max-w-none text-slate-700 text-sm leading-relaxed">
              <ReactMarkdown>{insight || ''}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </div>
      </div>
    </div>
  );
};