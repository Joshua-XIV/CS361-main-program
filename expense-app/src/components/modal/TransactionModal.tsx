import { useState, useEffect } from 'react';
import { transactionService } from '../../services/transaction.service';
import { categoryApi } from '../../api/categoryApi';
import type { Category } from '../../api/categoryApi';
import type { Transaction } from '../../api/transactionApi';

interface TransactionModalProps {
  open: boolean;
  userId: number;
  transaction?: Transaction; // optional for edit
  onClose: () => void;
  onSaved: (transaction: Transaction) => void;
  title?: string; // optional custom title
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  userId,
  transaction,
  onClose,
  onSaved,
  title,
}) => {
  const [name, setName] = useState(transaction?.name || '');
  const [amount, setAmount] = useState<number>(transaction?.amount || 0);
  const [date, setDate] = useState(transaction?.date || '');
  const [categoryId, setCategoryId] = useState<number | undefined>(transaction?.category_id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    categoryApi.getAll(userId)
      .then(setCategories)
      .catch(console.error);

    setName(transaction?.name || '');
    setAmount(transaction?.amount || 0);
    setDate(transaction?.date || '');
    setCategoryId(transaction?.category_id);
    setError('');
  }, [open, transaction, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let saved: Transaction;
      if (transaction) {
        saved = await transactionService.updateTransaction(transaction.id, {
          name,
          amount,
          date,
          category_id: categoryId,
        });
      } else {
        saved = await transactionService.addTransaction({
          user_id: userId,
          name,
          amount,
          date,
          category_id: categoryId,
        });
      }

      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const isEdit = Boolean(transaction);

  return (
    <div className="confirm-modal">
      <div className="confirm-card">
        <h2 className="text-xl font-semibold mb-4">{title || (isEdit ? 'Edit Transaction' : 'Add Transaction')}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Transaction Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="px-3 py-2 border rounded-lg"
            min={0}
            step={1}
            required
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
            max={new Date().toISOString().slice(0, 16)}
            required
          />
          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="" className='text-black'>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className='text-black'>{cat.name}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
