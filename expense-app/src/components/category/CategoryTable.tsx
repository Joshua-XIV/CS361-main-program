import React, { useState, useEffect, useMemo } from "react";
import type { Category } from "../../api/categoryApi";
import ConfirmModal from "../modal/ConfirmModal";
import { categoryService } from "../../services/category.service";

interface CategoryTableProps {
  categories: Category[];
  onDelete: (id: number) => Promise<void>;
  onEdit?: (category: Category) => void;
}

type SortKey = 'name';
type SortDirection = 'asc' | 'desc';

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDelete, onEdit}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: SortKey; direction: SortDirection} | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const selectedCategory = categories.find(c => c.id === selectedId);

  const sortedCategories = useMemo(() => {
    if (!sortConfig) return categories;

    const { key, direction } = sortConfig;
    switch (key) {
      case 'name':
        return [...categories].sort((a, b) => {
          const res = a.name.localeCompare(b.name);
          return direction === 'asc' ? res : -res;
        });
      default:
        return categories;
    }
  }, [categories, sortConfig]);

  const handleConfirmDelete = async (id?: number) => {
    if (selectedId === null) return;
    
    setModalOpen(false);
    setDeleteLoading(true)
    try {
      await onDelete(selectedId);
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedId(null);
      setDeleteLoading(false)
    }
  };

  const handleDeleteClick = (id: number) => {
    if (!id) return;
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setModalOpen(false);
    setSelectedId(null);
  }

  const handleEditClick = (category: Category) => {
    setModalOpen(true);
    setSelectedId(null);
  }

  const handleEditCancel = () => {
    setModalOpen(false);
    setSelectedId(null);
  }

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };


  const getArrow = (key: SortKey) => {
    if (!sortConfig) return '';
    return sortConfig.key === key
      ? sortConfig.direction === 'asc' ? '▲' : '▼'
      : '';
  };

  if (categories.length === 0) {
     return <div className="no-results text-center py-12 text-gray-500">No categories found</div>;
  }
  return (
    <>
      <div className="categories-table">
        {/* Table Header - Desktop only */}
        <div className="hidden md:grid table-header grid-cols-[80%_20%] gap-4 p-4 font-bold border-b-2 border-gray-400 items-center">
          <div className="cursor-pointer underline" onClick={() => requestSort('name')}>Name {getArrow('name')}</div>
          <div className="text-center">Actions</div>
        </div>
        {/* Table Body*/}
        <div className="table-body max-h-[500px] overflow-y-auto">
          {sortedCategories.map(category => {
            return (
              <React.Fragment key={category.id}>
                {/* Desktop */}
                <div className="hidden md:grid table-header grid-cols-[80%_20%] gap-4 p-4 font-bold  border-b-2 border-gray-400">
                  <div className="font-semibold">{category.name}</div>
                  <div className="flex gap-2 justify-center">
                    <button 
                      className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm" 
                      onClick={() => onEdit?.(category)}>Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm"
                      onClick={() => handleDeleteClick(category.id!)}
                      disabled={deleteLoading}>
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>                    
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <ConfirmModal
        open={modalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the ${categories.find(c => c.id === selectedId)?.name.toUpperCase()} category?`}
        afterMessage={`Deleting ${categories.find(c => c.id === selectedId)?.name.toUpperCase()} will set all transaction associated with the ${categories.find(c => c.id === selectedId)?.name.toUpperCase()} category to be set to "Other"`}
      />
    </>
  )
}

export default CategoryTable