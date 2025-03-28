'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface SubscriberData {
  email: string;
  subscription: Array<{
    licenseKey: string;
    subscriptionDate: string;
    subscriptionPrice: string | number;
    currency: string;
    productType: string;
    paymentTransactionID: string;
    paymentProvider: string;
    paymentStatus: string;
  }>;
}

interface Transaction {
  id: string;
  createdAt: string;
  orderDetails: {
    amount: number;
    currency: string;
    item: string;
    orderID: string;
    paymentProvider: string;
    paymentStatus: string;
  };
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const usersRef = ref(database, 'subscriberDetails');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const subscribers = snapshot.val() as Record<string, SubscriberData>;
          // Find the user's entries by email
          const userSubscriptions = Object.values(subscribers)
            .filter((subscriber: SubscriberData) => subscriber.email === user.email)
            .flatMap((subscriber: SubscriberData) => subscriber.subscription)
            .map((sub) => ({
              id: sub.licenseKey,
              createdAt: sub.subscriptionDate,
              orderDetails: {
                amount: typeof sub.subscriptionPrice === 'string' ? 
                  parseFloat(sub.subscriptionPrice) : sub.subscriptionPrice,
                currency: sub.currency,
                item: sub.productType,
                orderID: sub.paymentTransactionID,
                paymentProvider: sub.paymentProvider,
                paymentStatus: sub.paymentStatus
              }
            }));

          setTransactions(userSubscriptions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transaction history');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onSignOut={() => auth.signOut().then(() => router.push('/'))} />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Your Transactions</h2>
          
          {transactions.length > 0 ? (
            <div className="space-y-6">
              <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="text-left text-sm font-bold text-gray-600 dark:text-gray-300 py-3 px-4">Transaction ID</th>
                    <th className="text-left text-sm font-bold text-gray-600 dark:text-gray-300 py-3 px-4">Date</th>
                    <th className="text-left text-sm font-bold text-gray-600 dark:text-gray-300 py-3 px-4">Product</th>
                    <th className="text-left text-sm font-bold text-gray-600 dark:text-gray-300 py-3 px-4">Amount</th>
                    <th className="text-left text-sm font-bold text-gray-600 dark:text-gray-300 py-3 px-4">Status</th>
                    <th className="text-left text-sm font-bold text-gray-600 dark:text-gray-300 py-3 px-4">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <td className="text-sm text-gray-900 dark:text-white py-3 px-4">{transaction.orderDetails.orderID}</td>
                      <td className="text-sm text-gray-900 dark:text-white py-3 px-4">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-sm text-gray-900 dark:text-white py-3 px-4">{transaction.orderDetails.item}</td>
                      <td className="text-sm text-gray-900 dark:text-white py-3 px-4">
                        {transaction.orderDetails.amount} {transaction.orderDetails.currency}
                      </td>
                      <td className="text-sm py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.orderDetails.paymentStatus === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {transaction.orderDetails.paymentStatus}
                        </span>
                      </td>
                      <td className="text-sm text-gray-900 dark:text-white py-3 px-4">{transaction.orderDetails.paymentProvider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
} 