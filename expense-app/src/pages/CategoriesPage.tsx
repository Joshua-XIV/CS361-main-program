import React, { useEffect, useState } from 'react'
import  type { Category } from '../api/categoryApi'
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../services/category.service';
import CategoryTable from '../components/category/CategoryTable';

const CategoriesPage = () => {
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id])

  const fetchData = async () => {
    if (!user?.id) return
    
    try {
      setLoadingCategories(true);
      const data = await categoryService.getAll(user.id);

      setCategories(data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingCategories(false);
    }
  }

  const deleteData = async (categoryId: number) => {
    if (!user?.id) return

    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className='text-center pb-4'>Categories</h1>
      <div className='categories-container page-card overflow-hidden'>
        {categories.length === 0 ? (
          <div className="no-results text-center py-12 text-gray-500">No categories found</div>
        ) : (
          <CategoryTable
            categories={categories}
            onDelete={deleteData}
          />
        )}
      </div>
    </>
  )
}

export default CategoriesPage