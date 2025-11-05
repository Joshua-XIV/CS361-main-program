import React, { useState, useMemo } from 'react';
import type { TransactionWithCategory } from "../../services/transaction.service"
import ConfirmModal from '../modal/ConfirmModal';
import { transactionService } from '../../services/transaction.service';
import TrashCanIcon from "../../assets/trashCan.svg?react"
import EditIcon from "../../assets/editButton.svg?react"

interface TransactionsTableProps {
  transactions: TransactionWithCategory[];
  onDelete: (id: number) => Promise<void>;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onEdit?: (transaction: TransactionWithCategory) => void;
}

type SortKey = 'date' | 'name' | 'categoryName' | 'amount';
type SortDirection = 'asc' | 'desc';

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onDelete, selectedIds, setSelectedIds, onEdit }) => {
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const selectedTransaction = transactions.find(t => t.id === selectedId);

  const sortedTransactions = useMemo(() => {
    if (!sortConfig) return transactions;

    const { key, direction } = sortConfig;
    switch (key) {
      case 'date':
        return transactionService.sortByDate(transactions, direction);
      case 'amount':
        return transactionService.sortByAmount(transactions, direction);
      case 'name':
        return [...transactions].sort((a, b) => {
          const res = a.name.localeCompare(b.name);
          return direction === 'asc' ? res : -res;
        });
      case 'categoryName':
        return [...transactions].sort((a, b) => {
          const res = a.categoryName.localeCompare(b.categoryName);
          return direction === 'asc' ? res : -res;
        });
      default:
        return transactions;
    }
  }, [transactions, sortConfig]);

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleConfirmDelete = async (id?: number) => {
    if (selectedId === null) return;

    setDeletingIds(prev => [...prev, selectedId]);
    setModalOpen(false);
    try {
      await onDelete(selectedId);
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingIds(prev => prev.filter(did => did !== id));
      setSelectedId(null);
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
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const getArrow = (key: SortKey) => {
    if (!sortConfig) return '';
    return sortConfig.key === key
      ? sortConfig.direction === 'asc' ? '▲' : '▼'
      : '';
  };

  if (transactions.length === 0) {
    return <div className="no-results text-center py-12 text-gray-500">No transactions found</div>;
  }

  return (
    <>
      <div className="transactions-table">
        {/* Table Header - Desktop only */}
        <div className="hidden md:grid table-header grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 font-bold border-b-2 border-gray-400">
          <div className='flex flex-col items-start h-full'>
            <span>All</span>
            <input
              type="checkbox"
              checked={selectedIds.length === transactions.length && transactions.length > 0}
              onChange={(e) =>
                e.target.checked
                  ? setSelectedIds(transactions.map(t => t.id!))
                  : setSelectedIds([])
              }
            />
          </div>
          <div className="cursor-pointer underline" onClick={() => requestSort('date')}>Date {getArrow('date')}</div>
          <div className="cursor-pointer underline" onClick={() => requestSort('name')}>Name {getArrow('name')}</div>
          <div className="cursor-pointer underline" onClick={() => requestSort('categoryName')}>Category {getArrow('categoryName')}</div>
          <div className="text-right cursor-pointer underline" onClick={() => requestSort('amount')}>Amount {getArrow('amount')}</div>
          <div className="text-center">Actions</div>
        </div>
        {/* Table Body */}
        <div className="table-body max-h-[60vh] overflow-y-auto">
          {sortedTransactions.map(transaction => {
            const isDeleting = deletingIds.includes(transaction.id!);
            return (
              <React.Fragment key={transaction.id}>
                {/* Desktop / Tablet Row */}
                <div className={`hidden md:grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-gray-300 hover:bg-gray-800 items-center 
                  ${selectedIds.includes(transaction.id!) ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(transaction.id!)}
                      onChange={() => toggleSelect(transaction.id!)}
                    />
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="font-semibold">{transaction.name}</div>
                  <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {transaction.categoryName}
                    </span>
                  </div>
                  <div className="text-right font-bold text-green-600">
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button 
                      className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm flex gap-2" 
                      onClick={() => onEdit?.(transaction)}>Edit <EditIcon {...({ fill: 'white', width: 20, height: 20 } as React.SVGProps<SVGSVGElement>)} /></button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm flex gap-2"
                      onClick={() => handleDeleteClick(transaction.id!)}
                      disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Delete'}
                        <span style={{ display: 'inline-block', transform: 'scale(2.4)' }}>
                          <TrashCanIcon {...({ fill: 'white', width: 20, height: 20 } as React.SVGProps<SVGSVGElement>)} />
                        </span>
                    </button>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className={`md:hidden p-3 border-b border-gray-700 cursor-pointer
                  ${selectedIds.includes(transaction.id!) ? 'bg-gray-800' : 'bg-transparent'}`}
                  onClick={() => toggleSelect(transaction.id!)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-xl">{transaction.name}</div>                   
                    </div>
                    <span className="font-bold text-green-600">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {transaction.categoryName}
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex flex-1 px-3 py-1 bg-blue-500 text-white rounded-xl text-sm gap-2 justify-center" onClick={() => onEdit?.(transaction)}>Edit <EditIcon {...({ fill: 'white', width: 20, height: 20 } as React.SVGProps<SVGSVGElement>)} /></button>
                    <button
                      className="flex flex-1 px-3 py-1 bg-red-500 text-white rounded-xl text-sm gap-2 justify-center"
                      onClick={() => handleDeleteClick(transaction.id!)}
                      disabled={isDeleting}>
                      {isDeleting ? '...' : 'Delete'}
                        <span style={{ display: 'inline-block', transform: 'scale(2.4)' }}>
                          <TrashCanIcon {...({ fill: 'white', width: 20, height: 20 } as React.SVGProps<SVGSVGElement>)} />
                        </span>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <ConfirmModal
        open={modalOpen}
        message={"Are you sure you want to delete this transaction?"}
        messageList={
          selectedTransaction
            ? [
                `Date: ${new Date(selectedTransaction.date).toLocaleDateString()} ${new Date(selectedTransaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                `Name: ${selectedTransaction.name}`,
                `Category: ${selectedTransaction.categoryName}`,
                `Amount: $${selectedTransaction.amount.toFixed(2)}`
              ]
            : []
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteCancel}
        afterMessage='This data will be lost FOREVER'
      />
    </>
  );
};

export default TransactionsTable
