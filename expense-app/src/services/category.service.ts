import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/categoryApi";

export const categoryService = {
  getById: async(categoryId: number): Promise<Category> => {
    return await categoryApi.getById(categoryId)
  },

  getAll: async(userId: number): Promise<Category[]> => {
    return await categoryApi.getAll(userId);
  },

  addCategory: async(user_id: number, name: string): Promise<Category> => {
    return await categoryApi.create({user_id, name});
  },

  deleteCategory: async(categoryId: number): Promise<void> => {
    await categoryApi.delete(categoryId);
  },

  updateCategory: async(categoryId: number, updates: Partial<Category>): Promise<Category> => {
    return await categoryApi.update(categoryId, updates)
  }
}