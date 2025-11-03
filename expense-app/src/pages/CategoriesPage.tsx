import React, { useEffect, useState } from 'react'
import  type { Category } from '../api/categoryApi'
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../services/category.service';
import CategoryTable from '../components/category/CategoryTable';
import CategoryModal from '../components/modal/CategoryModal';

const CategoriesPage = () => {
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const editData = async (category: Category) => {
    if (!user?.id) return ;
    if (!category.id) return;
    try {
      await categoryService.updateCategory(category.id, category);
      setCategories(prev =>
        prev.map(c => (c.id === category.id ? category : c))
      );
    } catch (error) {
      console.log(error);
    }
  }

  const addData = async (category: Category) => {
    if (!user?.id) return;

    try {
      const savedCategory = await categoryService.addCategory(user.id, category.name);
      setCategories(prev => [...prev, savedCategory]);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user?.id) return

  return (
    <>
      <h1 className='text-center pb-4'>Categories</h1>
      <div className="search-section w-full page-card flex items-center gap-4">
        <input
          type="text"
          placeholder="Search Transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-3 py-2 border-gray-500 border-2 rounded-xl'
        />
        <button
          onClick={() => setAddModalOpen(true)}
          className=" text-white rounded-xl px-3 py-2 border-2 box-border hover:text-green-400 hover:border-green-400"
        >
          Add Category
        </button>
      </div>
      <div className='categories-container page-card overflow-hidden'>
        {filteredCategories.length === 0 ? (
          <div className="no-results text-center py-12 text-gray-500">No categories found</div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onDelete={deleteData}
            onEdit={editData}
          />
        )}
      </div>
      <CategoryModal
        open={addModalOpen}
        userId={user?.id}
        onClose={() => setAddModalOpen(false)}
        onSaved={addData}
      />
    </>
  )
}

export default CategoriesPage