import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { transactionService } from '../services/transaction.service';
import type { TransactionWithCategory, DateFilter as DateFilterType } from '../services/transaction.service';
import type { Category } from '../api/categoryApi';
import DateFilter from '../components/DateFilter';
import TransactionsTable from '../components/transaction/TransactionTable';
import ConfirmModal from '../components/modal/ConfirmModal';
import TransactionModal from '../components/modal/TransactionModal';

const TransactionsPage = () => {
  const { user } = useAuth();

  const [allTransactions, setAllTransactions] = useState<TransactionWithCategory[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(transactionService.getCurrentMonthFilter());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user, dateFilter]);

  const deleteSelected = async () => {
    for (const id of selectedIds) {
      await deleteData(id);
    }
    setSelectedIds([]);
    setModalOpen(false)
  };  

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await transactionService.getWithCategories(user.id, dateFilter);

      setAllTransactions(data.transactions);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (transactionId: number) => {
    if (!user?.id) return;
    
    try {
      await transactionService.deleteTransaction(transactionId);
      setAllTransactions(prev => prev.filter(t => t.id !== transactionId));
      setSelectedIds(prev => prev.filter(t => t !== transactionId));
    } catch (error) {
      console.log(error);
    }
  }

  const applyFilters = () => {
    let filtered = [...allTransactions];

    if (categoryFilter !== 'all') {
      const categoryId = parseInt(categoryFilter);
      filtered = filtered.filter(t => t.category_id === categoryId);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    filtered = transactionService.sortByDate(filtered, 'desc');

    setDisplayedTransactions(filtered);
    setSelectedIds([]);
  };

  useEffect(() => {
    applyFilters();
  }, [allTransactions, categoryFilter, searchTerm]);

  const handleApplyDateFilter = (month: number | 'full', year: number) => {
    const filter = transactionService.createDateFilter(month, year);
    setDateFilter(filter);
  };

  const handleApplyLastDays = (days: number) => {
    const filter = transactionService.createLastDaysFilter(days);
    setDateFilter(filter);
  }

  return (
    <>
      <h1 className='text-center pb-4'>Transactions</h1>

      <DateFilter
        onApply={handleApplyDateFilter}
        onApplyLastDays={handleApplyLastDays}
      />

      <div className="search-section w-full page-card flex items-center gap-4">
        <input
          type="text"
          placeholder="Search Transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-3 py-2 border-gray-500 border-2 rounded-xl'
        />
        <button
          onClick={() => setTransactionModalOpen(true)}
          className=" text-white rounded-xl px-3 py-2 border-2 box-border hover:text-green-400 hover:border-green-400"
        >
          Add Transaction
        </button>
      </div>

      <div className="page-card">
        <label>Category:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className='date-dropdown'
        >
          <option value="all" className='text-black'>All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id} className='text-black'>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="results-info flex page-card mt-5 h-15 justify-between items-center">
        <div>
          Showing {displayedTransactions.length} transactions
          {displayedTransactions.length !== allTransactions.length &&
            ` (filtered from ${allTransactions.length})`
          }
          <span> | Total: ${transactionService.calculateTotal(displayedTransactions).toFixed(2)}</span>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setModalOpen(true)}
            className=" text-white rounded-xl px-2 py-2 border-2 box-border hover:text-red-400 hover:border-red-400"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Table Layout with Columns */}
      <div className="transactions-container page-card overflow-hidden">
        {displayedTransactions.length === 0 ? (
          <div className="no-results text-center py-12 text-gray-500">No transactions found</div>
        ) : (
          <TransactionsTable
            transactions={displayedTransactions}
            onDelete={deleteData}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onEdit={(transaction) => {
              setEditingTransaction(transaction);
              setTransactionModalOpen(true);
            }}
          />
        )}
      </div>

      <p className='text-2xl text-center mt-10' style={{color:"#b0b0b0"}}>
        Manage, filter, and track your transactions all in one place.
      </p>

      <ConfirmModal
        open={modalOpen}
        message={`Are you sure you want to delete the selected ${selectedIds.length} transactions`}
        messageList={
          displayedTransactions
            .filter(t => selectedIds.includes(t.id!))
            .map(t => 
              `• ${new Date(t.date).toLocaleDateString()} | ${t.name} | $${t.amount.toFixed(2)} | ${t.categoryName}`
            )
        }  
        onConfirm={deleteSelected}
        onCancel={() => setModalOpen(false)}
        afterMessage='This data will be deleted FOREVER!'
      />
      {user?.id && (
        <TransactionModal
          open={transactionModalOpen}
          userId={user.id}
          transaction={editingTransaction || undefined} // if null, it's "add"
          onClose={() => {
            setTransactionModalOpen(false);
            setEditingTransaction(null); // clear after closing
          }}
          onSaved={(newTransaction) => {
            const categoryName = categories.find(c => c.id === newTransaction.category_id)?.name || 'Other';
            const enriched: TransactionWithCategory = { ...newTransaction, categoryName };
            setAllTransactions(prev => {
              const exists = prev.find(t => t.id === enriched.id);
              if (exists) {
                return prev.map(t => t.id === enriched.id ? enriched : t);
              }
              return [enriched, ...prev];
            });
          }}
        />
      )}
    </>
  )
}

export default TransactionsPage