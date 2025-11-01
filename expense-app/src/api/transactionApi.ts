const API_URL = import.meta.env.VITE_TRANSACTION_API_URL || 'http://localhost:5001/transactions';

export interface Transaction {
  id: number;
  user_id: number;
  category_id?: number;
  name: string;
  amount: number;
  date: string; // "YYYY-MM-DD" format
  created_at?: string;
  updated_at?: string;
}

export const transactionApi = {
  // -------------------------------
  // /transactions
  // -------------------------------

  // GET /transactions?user_id=123
  getAll: async (userId: number): Promise<Transaction[]> => {
    const response = await fetch(`${API_URL}?user_id=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  },

  // POST /transactions
  create: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }

    return response.json();
  },

  // -------------------------------
  // /transactions/<transaction_id>
  // -------------------------------

  // GET /transactions/<transaction_id>
  getById: async (transactionId: number): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/${transactionId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Transaction not found');
      }
      throw new Error('Failed to fetch transaction');
    }

    return response.json();
  },

  // PATCH /transactions/<transaction_id>
  update: async (transactionId: number, updates: Partial<Transaction>): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/${transactionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Transaction not found');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to update transaction');
    }

    return response.json();
  },

  // DELETE /transactions/<transaction_id>
  delete: async (transactionId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${transactionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Transaction not found');
      }
      throw new Error('Failed to delete transaction');
    }
  },

  // -------------------------------
  // /transactions/monthly
  // -------------------------------

  // GET /transactions/monthly?user_id=123&year=2024&month=10
  getMonthly: async (userId: number, year: number, month: number): Promise<Transaction[]> => {
    const response = await fetch(
      `${API_URL}/monthly?user_id=${userId}&year=${year}&month=${month}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch monthly transactions');
    }

    return response.json();
  },

  // -------------------------------
  // /transactions/yearly
  // -------------------------------

  // GET /transactions/yearly?user_id=123&year=2024
  getYearly: async (userId: number, year: number): Promise<Transaction[]> => {
    const response = await fetch(
      `${API_URL}/yearly?user_id=${userId}&year=${year}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch yearly transactions');
    }

    return response.json();
  },

  // -------------------------------
  // /transactions/range
  // -------------------------------

  // GET /transactions/range?user_id=123&start_year=2024&start_month=1&end_year=2024&end_month=6
  getRange: async (
    userId: number,
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
  ): Promise<Transaction[]> => {
    const response = await fetch(
      `${API_URL}/range?user_id=${userId}&start_year=${startYear}&start_month=${startMonth}&end_year=${endYear}&end_month=${endMonth}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transactions');
    }

    return response.json();
  },
};
