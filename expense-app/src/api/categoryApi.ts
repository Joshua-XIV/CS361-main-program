const API_URL = import.meta.env.VITE_CATEGORY_URL || 'http://localhost:5002';

export interface Category {
  id?: number;
  user_id: number;
  name: string;
  created_at?: string;
  updated_at?: string
}

export const categoryApi = {
  // GET /categories/{id}
  getById: async (categoryId: number): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${categoryId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error('Failed to fetch category');
    }
    
    return response.json();
  },

  // GET /categories?user_id={user_id}
  getAll: async (userId: number): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories?user_id=${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch categories');
    }
    
    return response.json();
  },

  // POST /categories
  create: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }
    
    return response.json();
  },

  // PATCH /categories/{id}
  update: async (categoryId: number, updates: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Category not found');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }
    
    return response.json();
  },

  // DELETE /categories/{id}
  delete: async (categoryId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error('Failed to delete category');
    }
    
    // 204 No Content - nothing to return
  },
};