import { GoogleGenAI } from "@google/genai";
import { Transaction, ContextType, TransactionType } from "../types";
import { CURRENCY_SYMBOL } from "../constants";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (
  transactions: Transaction[],
  context: ContextType
): Promise<string> => {
  const filtered = transactions.filter(t => t.context === context);
  
  if (filtered.length === 0) {
    return "No transactions found for this category. Add some income or expenses to get insights.";
  }

  const incomeTotal = filtered
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = filtered
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // Prepare a summary for the model
  const summary = filtered.map(t => 
    `- ${t.date}: ${t.type} of ${CURRENCY_SYMBOL}${t.amount} for ${t.category} (${t.description})`
  ).join('\n');

  const prompt = `
    You are a helpful financial advisor. Analyze the following list of transactions for a "${context}" budget context.
    
    Total Income: ${CURRENCY_SYMBOL}${incomeTotal}
    Total Expense: ${CURRENCY_SYMBOL}${expenseTotal}
    
    Transaction History:
    ${summary}
    
    Please provide:
    1. A brief summary of spending habits.
    2. One or two specific tips to save money based on these categories.
    3. An encouraging remark.
    
    Keep the response concise (under 200 words) and formatted in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am unable to analyze your data right now. Please check your API key or connection.";
  }
};