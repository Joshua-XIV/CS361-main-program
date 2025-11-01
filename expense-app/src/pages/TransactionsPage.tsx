import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { transactionApi } from '../api/transactionApi';
import { categoryApi } from '../api/categoryApi';
import type { Category } from '../api/categoryApi';
import type { Transaction } from '../api/transactionApi';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      const [transactionsData, categoriesData] = await Promise.all([
        transactionApi.getAll(user.id),
        categoryApi.getAll(user.id)
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Other';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Other';
  };


  return (
    <>
      <h1 className='text-center'>Transactions</h1>
    </>
  )
}

export default TransactionsPage