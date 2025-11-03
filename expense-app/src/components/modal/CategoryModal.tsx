import React, { useState } from 'react'
import { categoryService } from '../../services/category.service'
import type { Category } from '../../api/categoryApi'

interface CategoryModalProps {
  open: boolean;
  userId: number;
  category?: Category; // optional for edit
  onClose: () => void;
  onSaved: (category: Category) => void;
  title?: string; // optional
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  userId,
  category,
  onClose,
  onSaved,
  title
}) => {
  const [name, setName] = useState(category?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubimt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let saved: Category;
      if (category && category.id) {
        saved = await categoryService.updateCategory(category.id, {
          name
        });
      } else {
        saved = await categoryService.addCategory(
          userId,
          name
        );
      }

      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const isEdit = Boolean(category);

  return (
    <div className='confirm-modal' onClick={onClose}>
      <div className='confirm-card' onClick={handleCardClick}>
        <button
          onClick={onClose}
          className=" btn-close text-gray-400 hover:text-white text-4xl absolute top-2 right-6"
          aria-label="Close"
        >
          {"\u00D7"}
        </button>
        <h2 className="text-xl font-semibold mb-4">{title || (isEdit ? 'Edit Category' : 'Add Category')}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubimt} className='flex flex-col gap-3'>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded-lg"
            required
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal