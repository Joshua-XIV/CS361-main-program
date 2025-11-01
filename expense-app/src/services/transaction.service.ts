import { transactionApi } from "../api/transactionApi";
import { categoryApi } from "../api/categoryApi";
import type { Transaction } from "../api/transactionApi";
import type { Category } from "../api/categoryApi";

export interface TransactionWithCategory extends Transaction {
  categoryName: string;
}

export interface TransactionDataWithCategories {
  transactions: TransactionWithCategory[];
  categories: Category[];
}

export type DateFilter = 
  | { type: 'all' }
  | { type: 'month', year: number, month: number }
  | { type: 'year', year: number }
  | { type: 'lastDays', days: number };


export const transactionService = {
  /**
   * Get transactions with category names
   * Fetches based on date filter, then enriches with category data
   */
  getWithCategories: async (
    userId: number,
    dateFilter: DateFilter
  ): Promise<TransactionDataWithCategories> => {
    const categoriesPromise = categoryApi.getAll(userId);
    
    let transactionPromise: Promise<Transaction[]>

    switch (dateFilter.type) {
      case 'month':
        transactionPromise = transactionApi.getMonthly(
          userId,
          dateFilter.year,
          dateFilter.month
        );
        break;
      case 'year':
        transactionPromise = transactionApi.getYearly(
          userId,
          dateFilter.year
        );
        break;
      case 'lastDays':
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - dateFilter.days);

        transactionPromise = transactionApi.getRange(
          userId,
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          endDate.getFullYear(),
          endDate.getMonth() + 1
        );
        break;
      case 'all':
      default:
        transactionPromise = transactionApi.getAll(userId);
        break;
    }

    const [transactions, categories] = await Promise.all([
      transactionPromise,
      categoriesPromise
    ]);

    let filteredTransactions = transactions;
    if (dateFilter.type === 'lastDays') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dateFilter.days);
      const cutoffDateString = cutoffDate.toISOString().split('T')[0];
      
      filteredTransactions = transactions.filter(t => t.date >= cutoffDateString);
    }

    // t.date >= start && t.date <= end

    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    const enrichedTransactions: TransactionWithCategory[] = filteredTransactions.map(t => ({
      ...t,
      categoryName: categoryMap.get(t.category_id) || 'Other'
    }));

    return {
      transactions: enrichedTransactions,
      categories: categories
    };
  },

  /**
   * Helper to convert DateFilter component values to DateFilter Type
   */
  createDateFilter: (month: number | 'full', year: number): DateFilter => {
    if (month == 'full') {
      return { type: 'year', year}
    }
    return { type: 'month', year: year, month: month }
  },

  createLastDaysFilter: (days: number): DateFilter => {
    return { type: 'lastDays', days: days };
  },

  getCurrentMonthFilter: (): DateFilter => {
    const now = new Date();
    return {
      type: 'month',
      year: now.getFullYear(),
      month: now.getMonth() + 1
    };
  },

  getCurrentYearFilter: (): DateFilter => {
    const now = new Date();
    return {
      type: 'year',
      year: now.getFullYear()
    };
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'| 'created_at' | 'updated_at'>): Promise<Transaction> => {
    if (!transaction.name.trim()) {
      throw new Error('Transaction name is required');
    }
    if (transaction.amount <= 0) {
      throw new Error('Amount must be greated than 0');
    }
    if (!transaction.date) {
      throw new Error('Date is required');
    }

    return await transactionApi.create(transaction);
  },

  updateTransaction: async (transactionId: number, updates: Partial<Transaction>): Promise<Transaction> => {
    return await transactionApi.update(transactionId, updates);
  },

  deleteTransaction: async (transactionId: number): Promise<void> => {
    await transactionApi.delete(transactionId);
  },

  getById: async(transactionId: number): Promise<Transaction> => {
    return await transactionApi.getById(transactionId);
  },

  calculateTotal: (transactions: Transaction[]): number => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  },

  calculateByCategory: (transactions: TransactionWithCategory[]): Record<string, number> => {
    return transactions.reduce((sum, t) => {
      const categoryName = t.categoryName;
      sum[categoryName] = (sum[categoryName || 0]) + t.amount;
      return sum;
    }, {} as Record<string, number>);
  },

  sortByDate: <T extends Transaction>(transactions: T[], order: 'asc' | 'desc' = 'desc'): T[] => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  },

  sortByAmount: <T extends Transaction>(transactions: T[], order: 'asc' | 'desc' = 'desc'): T[] => {
    return [...transactions].sort((a ,b) => {
      return order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    })
  },
}